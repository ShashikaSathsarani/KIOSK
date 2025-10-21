import React, { useEffect, useRef, useState } from 'react'
import './IntroVideo.css'
import introVideo from '../assets/intro.mp4'

const IntroVideo = ({ onVideoClick }) => {
  const videoRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    // Auto-play the video when component mounts
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Auto-play failed:', err)
      })
    }
  }, [])

  const handleClick = () => {
    if (onVideoClick) {
      onVideoClick()
    }
  }

  const handleVideoEnd = () => {
    // Restart video when it ends
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play()
    }
  }

  const handleVideoLoad = () => {
    setVideoLoaded(true)
  }

  const handleVideoError = () => {
    setVideoError(true)
    console.error('Failed to load intro video')
  }

  return (
    <div className="intro-video-container" onClick={handleClick}>
      {videoError ? (
        <div className="video-fallback">
          <div className="fallback-content">
            <h1>🎬 PeraVerse</h1>
            <p>Faculty of Engineering</p>
            <p>University of Peradeniya</p>
            <div className="touch-hint">
              <span className="touch-icon"></span>
              <p>Touch</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="intro-video"
            src={introVideo}
            muted
            loop
            onEnded={handleVideoEnd}
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            playsInline
          />
          {videoLoaded && (
            <div className="video-overlay">
              <div className="touch-hint">
                <span className="touch-icon"></span>
                <p>Click To Continue</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default IntroVideo
