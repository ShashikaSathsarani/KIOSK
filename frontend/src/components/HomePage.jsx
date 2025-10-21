import './HomePage.css'
import EngexLogo from '../assets/Engex.jpg'

import React, { useEffect, useRef, useState } from 'react'

// Faculty slideshow images + captions
import Img1 from '../assets/background_image.jpg'
import Img2 from '../assets/B-min-scaled.jpg'
import Img3 from '../assets/Faculty75Lightened-scaled.jpeg'
import Img4 from '../assets/FOEdroneView-scaled.jpg'

const HomePage = () => {
  const slides = [
    { image: Img1 },
    { image: Img2 },
    { image: Img3 },
    { image: Img4 }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 4000) // 4s per slide
    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className="home-page fade-in">
      {/* ✅ Fullscreen slideshow */}
      <div className="slideshow-container">
        <img
          src={slides[currentIndex].image}
          alt={`Slide ${currentIndex + 1}`}
          className="slide-image"
        />

        {/* ✅ Overlay: logo top-left, caption bottom-left */}
        <img src={EngexLogo} alt="EngEx Logo" className="overlay-logo" />
        <div className="slide-caption">
          {slides[currentIndex].caption}
        </div>

        {/* ✅ Only on first slide: right-aligned title */}
        {currentIndex === 0 && (
          <div className="first-slide-title fade-in-right">
            <div className="faculty-line">Faculty of Engineering</div>
            <div className="university-line">University of Peradeniya</div>
          </div>
        )}

        {/* ✅ Full-width description overlay */}
        <div className="description-box">
          <p className="faculty-description">
            Sri Lanka’s oldest and most prestigious engineering institution — shaping
            generations of innovators, leaders, and visionaries for over 75 years.
          </p>
          <p className="faculty-description">
            The <strong>Faculty of Engineering, University of Peradeniya</strong> proudly presents 
            <strong> EngEx2025</strong> – The Diamond Jubilee Exhibition. Discover groundbreaking 
            <strong> research, innovations</strong>, and <strong>future-shaping projects</strong> 
            as we mark this historic milestone in engineering education and impact.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
