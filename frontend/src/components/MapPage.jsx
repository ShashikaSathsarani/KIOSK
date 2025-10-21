
import './MapPage.css';
import MapComponent from './Map'
import React, { useEffect, useRef, useState } from 'react'

const MapPage = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    // Hide tooltip after 15 seconds
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 15000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="map-page">
      <div className="map-header">
        <h1 className="map-title">Interactive Campus Navigation</h1>
        <p className="page-subtitle">Faculty of Engineering • University of Peradeniya</p>
      </div>
      <div className="map-container-centered">
        <MapComponent />
        {showTooltip && (
          <div className="map-tooltip">
            <p>Click on buildings to see exhibit information</p>
            <button className="tooltip-close" onClick={() => setShowTooltip(false)}>×</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
