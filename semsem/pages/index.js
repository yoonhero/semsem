import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam'



function getWindowSize() {
  const {innerWidth, innerHeight} = window;
  return {width: innerWidth, height: innerHeight};
}


export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [imageSrc, setImageSrc] = useState("")
  const [windowSize, setWindowSize] = useState("")
  const [process, setProcess] = useState(null)
  const [modal, setModal] = useState(false)

  useEffect(( ) => {
    setWindowSize(getWindowSize())
    // TODO: Loading 
    setLoading(false)


    function handleWindowResize(){
      setWindowSize(getWindowSize())
    }
    
    window.addEventListener("resize", handleWindowResize)

    
    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])


  const webcamRef = useRef(null);
  const capture = useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();

      setImageSrc(imageSrc)
    },
    [webcamRef]
  );

  
  // TODO
  const createCaricature = async (img) => {
    return
  }



  useEffect(() => {
    // TODO: Create Image 
    if (imageSrc != "") {
      setModal(true)
      // setLoading(true)
      // const createdCaricature = createCaricature(imageSrc)
      // setLoading(false)
    }
  }, [imageSrc, router])

  
  const clear = () => setImageSrc("")


  return (
    <>

      {loading ? <div>Loading...</div> : (
        <main className="w-screen h-screen p-0 m-0 bg-black">
          {imageSrc == "" ?(
            <div className="relative w-full  h-full flex justify-center align-center">
<Webcam ref={webcamRef} audio={false} mirrored={true} screenshotFormat="image/jpeg" width={windowSize.width} height={windowSize.height} videoConstraints={{facingMode:"user"}} /> 
      <div className="fixed bottom-10  right-10 ">
<button onClick={capture} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Capture photo
          </button>
          </div>
          
            </div>
      
) : (
  <div>
            <Image alt="Image" src={imageSrc} width={windowSize.width} height={windowSize.height} />

            <button onClick={() => clear()}>Retry</button>
        </div>
)
      
        }
    </main>
      )}
    
   <>
   {modal &&
    (
      <div className="overflow-y-auto overflow-x-hidden w-full h-full fixed top-0 right-0 left-0 z-50 md:inset-0 flex align-center justify-center">
      <div className="relative p-4 pt-40 w-full max-w-md h-full ">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex flex-col p-6 text-center">
                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
                  <Image src={imageSrc} alt="image" width={200} height={100} className="" />
                  <button onClick={() => setModal(false)} type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2">
                      Yes, I'm sure
                  </button>
                  <button onClick={() => setModal(false)} type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
              </div>
          </div>
      </div>
      </div>
    )}
   </>
    </>
    
  )
}
