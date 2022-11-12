import Webcam from 'react-webcam';
import Image from 'next/image';

const ImageGrid = ({ images, imageSize, windowSize, webcamRef }) => {
    return (
        <div className=" grid grid-cols-2 grid-rows-2">
            {images.map((image, i) => (
                <div
                    key={i}
                    className="h-full bg-black p-0 m-0  flex justify-center align-center"
                >
                    {image != '' ? (
                        <Image
                            src={image}
                            height={imageSize.height}
                            width={imageSize.width}
                        />
                    ) : i == 0 || images[i - 1] != '' ? (
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            mirrored={true}
                            screenshotFormat="image/jpeg"
                            width={windowSize.width / 2}
                            height={windowSize.height / 2}
                            videoConstraints={{ facingMode: 'user' }}
                        />
                    ) : (
                        <div className="bg-gray-700 w-full h-full text-white hover:bg-gray-800"></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ImageGrid;
