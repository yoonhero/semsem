import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";

function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { width: innerWidth, height: innerHeight };
}

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState("");
    const [index, setIndex] = useState(0);
    const [finish, setFinish] = useState(false);
    const [images, setImages] = useState([]);
    const [windowSize, setWindowSize] = useState("");
    const [imageSize, setImageSize] = useState({ width: 600, height: 400 });
    const [createdImage, setCreatedImage] = useState("");
    const [email, setEmail] = useState("");

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
        // console.log(image_info);

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
    }, [imageSrc, router]);

    /* ----------------------- TODO ------------------------- */
    const createCaricature = async (imgs) => {
        // fetch("URL", {method: "POST"})
        return "https://pbs.twimg.com/media/DcJ2XS9U0AAIAKc.jpg";
    };

    useEffect(() => {
        /// WHEN FINISH Caputuring
        if (finish && index == 4) {
            setLoading(true);

            // fetch("URL") + email

            // const createdCaricature = createCaricature(images);

            // setCreatedImage(createdCaricature);

            setLoading(false);
        }
    }, [finish]);

    // Clearing and RESET
    const clear = () => {
        setIndex(0);
        setFinish(false);
        setLoading(false);
        setImages(["", "", "", ""]);
        setCreatedImage("");
        setEmail("");
    };

    /* ------------------------------- User Email Form --------------------------------- */
    const onChange = (e) => {
        setEmail(e.target.value);
    };

    /* ----------------------- SEND Email to user ------------------------ */
    const sendEmail = () => {};

    return (
        <>
            <Head>
                <title>인생네컷 with AI</title>
            </Head>
            {loading ? (
                imageSrc == "" ? (
                    <div className='w-screen h-screen p-0 bg-gray-700 '>
                        <div className='w-full h-full flex flex-col gap-10 justify-center items-center  text-center '>
                            <svg
                                aria-hidden='true'
                                className='w-24 h-24 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
                                viewBox='0 0 100 101'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                    fill='currentColor'
                                />
                                <path
                                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                    fill='currentFill'
                                />
                            </svg>
                            <div className='animate-ping text-white text-3xl'>Loading...</div>
                        </div>
                    </div>
                ) : (
                    <div className='w-screen h-screen p-0 bg-gray-700 '>
                        <div className='w-full h-full flex flex-col gap-10 justify-center items-center  text-center '>
                            <svg
                                aria-hidden='true'
                                className='w-24 h-24 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
                                viewBox='0 0 100 101'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                                    fill='currentColor'
                                />
                                <path
                                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                                    fill='currentFill'
                                />
                            </svg>
                            <div className='animate-ping text-white text-3xl'>Processing...</div>
                        </div>
                    </div>
                )
            ) : (
                <main className='w-screen h-screen p-0 m-0 bg-black'>
                    {finish ? (
                        <div className='relative w-full  h-full flex justify-center align-center'>
                            <div className=' grid grid-cols-2 grid-rows-2'>
                                {images.map((image, i) => (
                                    <div key={i} className='w-full h-full bg-black p-0 m-0  flex justify-center align-center'>
                                        {image != "" ? (
                                            <Image src={image} height={imageSize.height} width={imageSize.width} />
                                        ) : i == 0 || images[i - 1] != "" ? (
                                            <Webcam
                                                ref={webcamRef}
                                                audio={false}
                                                mirrored={true}
                                                screenshotFormat='image/jpeg'
                                                width={windowSize.width / 2}
                                                height={windowSize.height / 2}
                                                videoConstraints={{ facingMode: "user" }}
                                            />
                                        ) : (
                                            <div className='bg-gray-700 w-full h-full text-white hover:bg-gray-800'></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className='fixed bottom-10'>
                                <button
                                    onClick={() => capture()}
                                    className='bg-gray-300 w-20 h-20 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full border-4 border-gray-500'></button>
                            </div>
                        </div>
                    ) : (
                        <div className='relative w-full  h-full flex justify-center items-center'>
                            <div key={i} className='w-full h-full bg-black m-0  flex justify-center align-center'>
                                <Image src={createdImage} height={imageSize.height} width={imageSize.width} />
                            </div>

                            {/* <div className='fixed'>
                                <div className='flex flex-col gap-2'>
                                    <input
                                        onChange={(e) => onChange(e)}
                                        value={email}
                                        type='email'
                                        class='bg-gray-50 border border-gray-300 text-gray-900 text-2xl rounded-2xl focus:ring-blue-500 focus:border-blue-500 block w-full p-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                                        placeholder='Your Email'
                                    />

                                    <button
                                        onClick={() => setFinish(true)}
                                        className='bg-blue-500 hover:bg-blue-700 text-xl text-white font-bold py-4 px-6 rounded-xl'>
                                        Submit
                                    </button>
                                </div>
                            </div> */}

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
