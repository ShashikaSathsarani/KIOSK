
import React, { useEffect, useRef, useState } from 'react'
import './HeatMapPage.css';

function HeatMapPage() {
  return (
    <div className="heatmap-container">
      <h2>Event Heat Map</h2>
      <div className="heatmap-iframe-wrapper">
        {/* Replace the src URL below with the actual heatmap website URL */}
        <iframe
          src="https://example.com/heatmap"
          title="Event Heat Map"
          width="100%"
          height="600px"
          style={{ border: 'none', borderRadius: '16px', boxShadow: '0 4px 32px rgba(0,0,0,0.15)' }}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default HeatMapPage;

