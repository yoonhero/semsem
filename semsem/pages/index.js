import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState, useRef, useCallback } from 'react';
import ImageGrid from '../components/image_grid';
import Loading from '../components/loading';
import { transform } from '../utils/api';
import axios from 'axios';
import ProgressBar from '../components/progress_bar';
import { ImageCard } from '../components/ImageCard';
import { CheckBox } from '../components/checkbox';

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
    const [createdQR, setCreatedQR] = useState('');
    const [progress, setProgress] = useState(0);
    const [show, setShow] = useState(false);
    const [frame, setFrame] = useState(0);
    const [changeFrame, setChangeFrame] = useState(false);
    const [useAI, setUseAI] = useState(0);
    // const [waitWebcam, setWaitWebcam] = useState(false);

    useEffect(() => {
        setWindowSize(getWindowSize());
        setImages(['', '', '', '']);
        // TODO: Loading
        setLoading(false);

        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

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

            console.log('webcam setting up');
        }
    }, [webcamRef]);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();

        setImageSrc(imageSrc);
    }, [webcamRef]);

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
                setCreatedQR(response.data.body.qr);
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
        setIndex(0);
        setFinish(false);
        setLoading(false);
        setImages(['', '', '', '']);
        setCreatedImage('');
        setCreatedQR('');
        setProgress(0);
    };

    const changeFrameOnClick = (idx) => {
        setFrame(idx);
        setChangeFrame(false);
    };

    const checkboxClick = () => {
        setUseAI(!useAI);
    };

    return (
        <>
            <Head>
                <title>멜라네컷 with AI</title>
            </Head>
            {loading ? (
                index != 4 ? (
                    <Loading>Loading...</Loading>
                ) : (
                    <ProgressBar progress={progress} />
                )
            ) : (
                <main className="w-screen h-screen p-0 m-0 bg-black">
                    {!finish ? (
                        <div className="relative w-full  h-full flex justify-center align-center">
                            <ImageGrid
                                images={images}
                                imageSize={imageSize}
                                windowSize={windowSize}
                                webcamRef={webcamRef}
                            />
                            <div className="fixed bottom-10">
                                <button
                                    onClick={() => capture()}
                                    className={`w-20 h-20 hover:bg-gray-700 py-2 px-2 rounded-full border-4 border-gray-500 
                                         bg-gray-300 `}
                                ></button>
                            </div>

                            <div className="fixed z-10 bottom-10 left-10">
                                <CheckBox
                                    checked={useAI}
                                    onClickFunc={checkboxClick}
                                    text={useAI ? 'AI ON' : 'AI OFF'}
                                />
                            </div>

                            <div className="fixed z-10  bottom-10 right-10">
                                <button
                                    onClick={() => setChangeFrame(!changeFrame)}
                                    className="relative inline-block text-lg group"
                                >
                                    <span className="relative z-10 block px-5 py-3 overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white">
                                        <span className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-gray-50"></span>
                                        <span className="absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"></span>
                                        <span className="relative">
                                            {changeFrame
                                                ? 'Hide Frames'
                                                : 'Change Frame'}
                                        </span>
                                    </span>
                                    <span className="absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0"></span>
                                </button>
                            </div>
                            {changeFrame && (
                                <div className="fixed bottom-5">
                                    <div className="flex flex-row justify-center space-x-3 p-5 -ml-3">
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
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="relative w-full  h-full flex justify-center items-center">
                            <div className="bg-black m-0  flex justify-center align-center">
                                <Image
                                    src={createdImage}
                                    height={windowSize.height - 200}
                                    width={
                                        ((windowSize.height - 200) / 1722) * 618
                                    }
                                />
                            </div>
                            {show && (
                                <div className="fixed ">
                                    <Image
                                        src={createdQR}
                                        height={300}
                                        width={300}
                                    />
                                </div>
                            )}

                            <div className="fixed bottom-10">
                                <button
                                    onClick={() =>
                                        show ? setShow(false) : setShow(true)
                                    }
                                    className="m-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {!show ? 'Show QR Code' : 'Hide QR Code'}
                                </button>
                                <button
                                    onClick={() => clear()}
                                    className="m-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Retry
                                </button>
                            </div>

                            <div className="fixed bottom-2">
                                <p class="animate-bounce text-white text-sm">
                                    Copyright 2022 © Yoonhero06 with ROMELA
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            )}
        </>
    );
}
