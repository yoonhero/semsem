import Head from "next/head";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import ImageGrid from "../components/image_grid";
import Loading from "../components/loading";
import { transform } from "../utils/api";
import axios from "axios";
import ProgressBar from "../components/progress_bar";

function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { width: innerWidth, height: innerHeight };
}

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState("");
    const [index, setIndex] = useState(0);
    const [finish, setFinish] = useState(false);
    const [images, setImages] = useState([]);
    const [windowSize, setWindowSize] = useState("");
    const [imageSize, setImageSize] = useState({ width: 600, height: 400 });
    const [createdImage, setCreatedImage] = useState("");
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setWindowSize(getWindowSize());
        setImages(["", "", "", ""]);
        // TODO: Loading
        setLoading(false);

        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

    /* -------------------------------- WEBCAM -------------------------------- */
    const webcamRef = useRef(null);

    useEffect(() => {
        if (webcamRef.current != null) {
            let image_info = { width: webcamRef.current.props.width, heigth: webcamRef.current.props.heigth };
            setImageSize(image_info);
        }
    }, [webcamRef]);

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();

        setImageSrc(imageSrc);
    }, [webcamRef]);

    /* ------------------------------ SET IMAGE ON CELL---------------------------------- */
    useEffect(() => {
        if (imageSrc != "") {
            let new_images = images;
            new_images[index] = imageSrc;
            setIndex(index + 1);

            setImages(new_images);
            setImageSrc("");
        }
    }, [imageSrc]);

    const uploadProgress = (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded}, ${total} | ${percent}`);
    };

    const createCaricature = () => {
        const data = { images: images };
        const baseUrl = "http://127.0.0.1:5000/api/predict";

        // -------------------------------TODO ADVANCED TIMER---------------------------------
        // setTimeout(() => {
        //     setProgress(progress + 100 / 16);
        // }, 1000);

        axios
            .post(baseUrl, data, {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "application/json",
                onUploadProgress: (progressEvent) => setProgress((progressEvent.loaded / progressEvent.total) * 100),
            })
            .then((response) => {
                setCreatedImage(response.data.body.output);
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
        setImages(["", "", "", ""]);
        setCreatedImage("");
        setProgress(0);
    };

    return (
        <>
            <Head>
                <title>인생네컷 with AI by RoMeLA</title>
            </Head>
            {loading ? (
                index != 4 ? (
                    <Loading>Loading...</Loading>
                ) : (
                    <ProgressBar progress={progress} />
                )
            ) : (
                <main className='w-screen h-screen p-0 m-0 bg-black'>
                    {!finish ? (
                        <div className='relative w-full  h-full flex justify-center align-center'>
                            <ImageGrid images={images} imageSize={imageSize} windowSize={windowSize} webcamRef={webcamRef} />
                            <div className='fixed bottom-10'>
                                <button
                                    onClick={() => capture()}
                                    className='bg-gray-300 w-20 h-20 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full border-4 border-gray-500'></button>
                            </div>
                        </div>
                    ) : (
                        <div className='relative w-full  h-full flex justify-center items-center'>
                            <div className='bg-black m-0  flex justify-center align-center'>
                                <Image src={createdImage} height={windowSize.height - 100} width={((windowSize.height - 100) / 1722) * 618} />
                            </div>

                            <div className='fixed bottom-10 '>
                                <button onClick={() => clear()} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            )}
        </>
    );
}
