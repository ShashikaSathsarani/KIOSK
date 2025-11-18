import React, { useEffect, useRef, useState } from 'react'
//import { useState, useEffect } from 'react'
import logo from '../assets/university-of-peradeniya-logo-png_seeklogo-480462-removebg-preview.png'
import './Navigation.css'

/**
 * Navigation Component
 * 
 * Sidebar navigation component with:
 * - University logo
 * - Navigation menu items
 * - Real-time date and time display
 * - Active page highlighting
 */
const Navigation = ({ currentPage, onPageClick, pages }) => {
  // State for real-time clock
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Page names corresponding to the components (added ChatBot)
  const pageNames = ['Home', 'About', 'Events', 'Exhibits', 'Notifications', 'Map', 'Heat Map', 'ChatBot']
  // Optional: Page icons (updated to include notification icon)
  // const pageIcons = ['🏠', '📅', '🔥', 'ℹ️', '🗺️', '📞', '🔔', '🤖']
  
  // Update time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    
    return () => clearInterval(timeInterval)
  }, [])
  
  return (
    <div className="sidebar-nav">
      {/* ===== LOGO SECTION ===== */}
      <div className="sidebar-logo">
        <img src={logo} alt="University of Peradeniya Logo" />
      </div>
      
      {/* ===== NAVIGATION MENU ===== */}
      <div className="nav-pages">
        {pages.map((page, index) => (
          <div
            key={index}
            className={`nav-item ${index === currentPage ? 'active' : ''}`}
            onClick={() => onPageClick(index)}
            style={{ cursor: 'pointer' }}
          >
            {/* Optional: Uncomment to show icons */}
            {/* <span className="nav-item-icon">{pageIcons[index]}</span> */}
            <span className="nav-item-name">{pageNames[index]}</span>
          </div>
        ))}
      </div>
      
      {/* ===== DATE AND TIME DISPLAY ===== */}
      <div className="nav-datetime">
        {/* Time Display */}
        <div className="time-display">
          <span className="time-icon">🕐</span>
          <span className="time-text">
            {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>
        
        {/* Date Display */}
        <div className="date-display">
          <span className="date-icon">📅</span>
          <span className="date-text">
            {currentTime.toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Navigation
