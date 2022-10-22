import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import Webcam from 'react-webcam'
import styles from '../styles/Home.module.css'



function getWindowSize() {
  const {innerWidth, innerHeight} = window;
  return {width: innerWidth, height: innerHeight};
}


export default function Home() {
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

  useEffect(() => {
    console.log(imageSrc)    
  }, [imageSrc])

  return (
    <>
      {loading ? <div>Loading...</div> : (
        <div>
      
      
      {imageSrc == "" ? (<Webcam audio={false} mirrored={true} screenshotFormat="image/jpeg" width={windowSize.width} height={windowSize.height} videoConstraints={{facingMode:"user"}}>
        {({getScreenshot} ) => (
          <button onClick={() => {
            const src = getScreenshot()

            setImageSrc(src)
          }}>
            Capture photo
          </button>
        )}
      </Webcam> 
      ): (
      
      <div>
        <Image alt="Caricature" src={imageSrc} width={windowSize.width} height={windowSize.height}/>
        <button onClick={() => setImageSrc("")}>ReTrY</button>
      </div>

      )} 
      
    </div>
      )}
    
    </>
    
  )
}
