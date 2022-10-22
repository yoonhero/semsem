import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
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


  
  useEffect(() => {
    console.log(windowSize)
  }, [windowSize])

  
  // TODO
  const createCaricature = async (img) => {
    return
  }



  useEffect(() => {
    // TODO: Create Image 
    if (imageSrc != "") {
      setLoading(true)
      const createdCaricature = createCaricature(imageSrc)
      setLoading(false)
    }
  }, [imageSrc, router])

  
  const clear = () => setImageSrc("")


  return (
    <>
      {loading ? <div>Loading...</div> : (
        <div>
          {imageSrc == "" ?(
      <Webcam audio={false} mirrored={true} screenshotFormat="image/jpeg" width={windowSize.width} height={windowSize.height} videoConstraints={{facingMode:"user"}}>
        {({getScreenshot} ) => (
          <button onClick={() => {
            const src = getScreenshot()

            setImageSrc(src)
          }}>
            Capture photo
          </button>
        )}
      </Webcam> 
) : (
  <div>
            <Image alt="Image" src={imageSrc} width={windowSize.width} height={windowSize.height} />

            <button onClick={() => clear()}>Retry</button>
        </div>
)
      
        }
    </div>
      )}
    
    </>
    
  )
}
