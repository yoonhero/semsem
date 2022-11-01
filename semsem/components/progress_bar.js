const ProgressBar = ({ progress }) => {
    return (
        <div className='w-screen h-screen p-0 bg-gray-600 '>
            <div className='w-full h-full flex flex-col gap-10 justify-center items-center  text-center '>
                <div className='animate-ping text-white text-3xl'>Processing..</div>

                <div className='mb-4 w-80 h-4 bg-gray-800 rounded-full dark:bg-gray-700'>
                    <div className='h-4 bg-blue-600 rounded-full dark:bg-blue-500' style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
