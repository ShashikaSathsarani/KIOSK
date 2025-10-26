import React from 'react'
import './Footer.css'

/**
 * Footer Component - Tailwind Version
 * 
 * Application footer with:
 * - Copyright information
 * - System branding
 * - University attribution
 */
const Footer = () => {
  return (
    <div className="app-footer">
      <div className="footer-content">
        <p className="">
          © 2025 Faculty of Engineering, University of Peradeniya
        </p>
        <p className="my-1 text-xs font-light">
          PeraVerse Digital Kiosk System by PeraCom
        </p>
      </div>
    </div>
  )
}

export default Footer;
