import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState, useRef, useCallback } from 'react';
import ImageGrid from '../components/image_grid';
import Loading from '../components/loading';
import axios from 'axios';
import ProgressBar from '../components/progress_bar';
import { ImageCard } from '../components/ImageCard';
import { CheckBox } from '../components/checkbox';
import { useAudio } from '../utils/use-audio';
import { CopyRight } from '../components/copyright';
import { SearchSEO, SearchEngine } from '../utils/SearchSEO';
import { KakaoAdFit } from '../utils/KakaoAdfit';
import { ShareButtons } from '../components/ShareButton';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';

function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { width: innerWidth, height: innerHeight };
}

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState('');
    const [index, setIndex] = useState(0);
    const [finish, setFinish] = useState(false);
    const [images, setImages] = useState([]);
    const [windowSize, setWindowSize] = useState('');
    const [imageSize, setImageSize] = useState({ width: 600, height: 400 });
    const [createdImage, setCreatedImage] = useState('');
    // const [createdQR, setCreatedQR] = useState('');
    const [progress, setProgress] = useState(0);
    // const [show, setShow] = useState(false);
    const [frame, setFrame] = useState(0);
    const [changeFrame, setChangeFrame] = useState(false);
    const [useAI, setUseAI] = useState(0);
    const [waitWebcam, setWaitWebcam] = useState(false);

    const [playing, toggle] = useAudio('/camera-click.wav');
    const [bgm_playing, bgm_toggle] = useAudio('/bgm.mp3');
    const [countdown_playing, countdown_toggle] = useAudio('/countdown.m4a');

    const [showLang, setShowLang] = useState(true);

    const [timer, setTimer] = useState(null);

    const { t } = useTranslation();

    useEffect(() => {
        setWindowSize(getWindowSize());
        setImages(['', '', '', '']);
        // TODO: Loading
        setLoading(false);

        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        setTimeout(() => {
            setShowLang(false);
        }, 1000);

        window.addEventListener('resize', handleWindowResize);

        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    /* -------------------------------- WEBCAM -------------------------------- */
    const webcamRef = useRef(null);

    useEffect(() => {
        if (webcamRef.current != null) {
            let image_info = {
                width: webcamRef.current.props.width,
                heigth: webcamRef.current.props.heigth,
            };
            setImageSize(image_info);
        }
    }, [webcamRef]);

    const capture = useCallback(() => {
        try {
            countdown_toggle();
            setTimer(3);
            setWaitWebcam(true);
        } catch (e) {
            console.log(e);
        }
    }, [webcamRef]);

    useEffect(() => {
        if (!playing) {
            setWaitWebcam(false);
        }
    }, [playing]);

    useEffect(() => {
        if (timer == 0) {
            const imageSrc = webcamRef.current.getScreenshot();
            toggle();
            setImageSrc(imageSrc);

            setTimer(null);
            // if (windowSize?.width <= 640) {
            //     setWaitWebcam(false);
            // }
            setTimeout(() => {
                setWaitWebcam(false);
            }, 1000);
        } else if (timer > 0) {
            const timer_interval = setTimeout(() => {
                setTimer(timer - 1);
            }, 1000);

            return () => clearInterval(timer_interval);
        }
    }, [timer]);

    /* ------------------------------ SET IMAGE ON CELL---------------------------------- */
    useEffect(() => {
        if (imageSrc != '') {
            let new_images = images;
            new_images[index] = imageSrc;
            setIndex(index + 1);

            setImages(new_images);
            setImageSrc('');
        }
    }, [imageSrc]);

    const uploadProgress = (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded}, ${total} | ${percent}`);
    };

    const createCaricature = () => {
        const data = { images: images, frame: frame, ai_on: useAI ? 1 : 0 };
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        // -------------------------------TODO ADVANCED TIMER---------------------------------
        // setTimeout(() => {
        //     setProgress(progress + 100 / 16);
        // }, 1000);

        bgm_toggle();

        axios
            .post(baseUrl, data, {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                onUploadProgress: (progressEvent) =>
                    setProgress(
                        (progressEvent.loaded / progressEvent.total) * 100,
                    ),
            })
            .then((response) => {
                setCreatedImage(response.data.body.output);
                //setCreatedQR(response.data.body.qr);
                setLoading(false);
                setFinish(true);
            })
            .catch((response) => {
                console.log(response);
            });
    };

    useEffect(() => {
        /// WHEN FINISH Caputuring
        if (index == 4) {
            setLoading(true);

            createCaricature();
        }
    }, [index]);

    // Clearing and RESET
    const clear = () => {
        setTimer(null);
        setIndex(0);
        setFinish(false);
        setLoading(false);
        setImages(['', '', '', '']);
        setCreatedImage('');
        //setCreatedQR('');
        setProgress(0);
        //setShow(false);
        bgm_toggle();
    };

    const changeFrameOnClick = (idx) => {
        setFrame(idx);
        // setChangeFrame(false);
    };

    const checkboxClick = () => {
        setUseAI(!useAI);
    };

    // const onUserMedia = () => {
    //     setWaitWebcam(false);
    // };

    function base64ToArrayBuffer(base64) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }

    function saveByteArray(image) {
        // var blob = new Blob([arraybuffer], { type: 'applicatio//png' });

        var data = image.replace(/^data:image\/\w+;base64,/, '');
        var buf = new Buffer(data, 'base64');

        var blob = new Blob([buf], { type: 'application/png' });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        var fileName = '멜라네컷.png';
        link.download = fileName;
        link.click();
    }

    return (
        <>
            <Head>
                <title>{t('common:title')}</title>
                <link rel="icon" href="/favicon.png" />
                <SearchSEO locale={t('common:lang')} />
                <SearchEngine />
            </Head>

            {loading ? (
                index != 4 ? (
                    <Loading>{t('common:loading_msg')}</Loading>
                ) : (
                    <ProgressBar
                        msg={t('common:progress_msg')}
                        progress={progress}
                    />
                )
            ) : (
                <>
                    {!finish ? (
                        <main className="w-screen h-screen p-0 m-0 bg-black">
                            <div className="relative w-full  h-full flex justify-center align-center">
                                {waitWebcam && timer != 0 && (
                                    <div className="z-10 fixed w-full h-full right-0 top-0 flex justify-center items-center">
                                        <div className="animate-bounce text-6xl md:text-9xl text-white font-bold">
                                            <p>{timer || t('common:v')}</p>
                                        </div>
                                    </div>
                                )}
                                <ImageGrid
                                    images={images}
                                    imageSize={imageSize}
                                    windowSize={windowSize}
                                    webcamRef={webcamRef}
                                />
                                <div className="z-10 fixed bottom-10">
                                    {!waitWebcam ? (
                                        <button
                                            onClick={() => capture()}
                                            disabled={waitWebcam}
                                            className={` w-20 h-20 hover:bg-gray-700 py-2 px-2 rounded-full border-4 border-gray-500 
                                         bg-gray-300`}
                                        ></button>
                                    ) : (
                                        <svg
                                            aria-hidden="true"
                                            className="w-20 h-20 text-gray-500 animate-spin dark:text-gray-600 fill-gray-900"
                                            viewBox="0 0 100 101"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                fill="currentFill"
                                            />
                                        </svg>
                                    )}
                                </div>

                                <div className="fixed z-30 bottom-7 left-7  sm:bottom-10 sm:left-10">
                                    <CheckBox
                                        checked={useAI}
                                        onClickFunc={checkboxClick}
                                        text={useAI ? 'AI ON' : 'AI OFF'}
                                    />
                                </div>

                                <div className="fixed z-30 bottom-5 right-5  sm:bottom-10 sm:right-10">
                                    <button
                                        onClick={() =>
                                            setChangeFrame(!changeFrame)
                                        }
                                        className="relative inline-block text-lg group"
                                    >
                                        <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                                            <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                                            <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                                            <span className="relative">
                                                {windowSize?.width > 680
                                                    ? changeFrame
                                                        ? 'Hide Frames'
                                                        : 'Change Frame'
                                                    : changeFrame
                                                    ? 'Hide'
                                                    : 'Change'}
                                            </span>
                                        </span>
                                        <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"></span>
                                    </button>
                                </div>
                                {t('common:lang') == 'ko' && (
                                    <div
                                        className={`fixed z-30 top-5 right-5 text-white text-xl transition transform duration-400 delay-200 transition-opacity opacity-1 ${
                                            !showLang && 'opacity-0'
                                        } ease-out`}
                                    >
                                        <Link href="/en">ENG</Link>
                                    </div>
                                )}

                                {changeFrame && (
                                    <div className="z-20 fixed bottom-0 h-[50vh] md:h-auto sm:bottom-5">
                                        {windowSize?.width <= 760 ? (
                                            <div className="pb-[20px] px-[10vw] h-full w-full flex flex-row snap-x overflow-x-auto  self-center scrollbar-hide sm:scrollbar">
                                                {[
                                                    '/romela_frame.png',
                                                    '/frame_red.png',
                                                    '/frame_green.png',
                                                    '/frame_blue.png',
                                                    '/frame_purple.png',
                                                    '/frame_white.png',
                                                    '/frame_black.png',
                                                ].map((src, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex flex-row relative  flex-shrink-0 p-3  overflow-hidden"
                                                    >
                                                        <ImageCard
                                                            key={idx}
                                                            imgSrc={src}
                                                            onClickEvent={
                                                                changeFrameOnClick
                                                            }
                                                            windowHeight={
                                                                windowSize?.height
                                                            }
                                                            idx={idx}
                                                            selected={
                                                                frame == idx
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="max-w-[90vw] flex flex-row justify-center space-x-3 p-5">
                                                {[
                                                    '/romela_frame.png',
                                                    '/frame_red.png',
                                                    '/frame_green.png',
                                                    '/frame_blue.png',
                                                    '/frame_purple.png',
                                                    '/frame_white.png',
                                                    '/frame_black.png',
                                                ].map((src, idx) => (
                                                    <ImageCard
                                                        key={idx}
                                                        imgSrc={src}
                                                        onClickEvent={
                                                            changeFrameOnClick
                                                        }
                                                        windowHeight={
                                                            windowSize?.height
                                                        }
                                                        idx={idx}
                                                        selected={frame == idx}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </main>
                    ) : (
                        <main className="w-screen min-h-[100vh] p-0 m-0 bg-black">
                            <div className="relative w-full  h-full flex justify-center ">
                                <div className="bg-black mt-12  flex flex-col justify-center gap-5 items-center align-center">
                                    <Image
                                        src={createdImage}
                                        height={windowSize.height - 200}
                                        width={
                                            ((windowSize.height - 200) / 1722) *
                                            618
                                        }
                                    />
                                    <div className="flex flex-row">
                                        <button
                                            onClick={() =>
                                                saveByteArray(createdImage)
                                            }
                                            className="m-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => clear()}
                                            className="m-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                        >
                                            Retry
                                        </button>
                                    </div>

                                    <ShareButtons />
                                    <div className=" mb-10 mt-10"></div>

                                    <KakaoAdFit />

                                    <div className=" mb-40"></div>
                                </div>

                                {/* For Production this is for RaspberryPI {show && (
                                <div className="fixed ">
                                    <Image
                                        src={createdQR}
                                        height={300}
                                        width={300}
                                    />
                                </div>
                            )} */}

                                {/* <div className="fixed bottom-10"> */}
                                {/* This is for the RaspberryPI <button
                                    onClick={() =>
                                        show ? setShow(false) : setShow(true)
                                    }
                                    className="m-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {!show ? 'Show QR Code' : 'Hide QR Code'}
                                </button> */}

                                {/* </div> */}

                                <CopyRight />
                            </div>
                        </main>
                    )}
                </>
            )}
        </>
    );
}
