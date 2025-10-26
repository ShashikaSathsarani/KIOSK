
import React, { useEffect, useRef, useState } from 'react'
import './HeatMapPage.css';
import SvgHeatmap from '../Heatmap/SvgHeatmap';

function HeatMapPage() {
  return (
    <div className="h2">
      <h2 className="heatmap-container">
        Event Heat Map
      </h2>
      <div className="heatmap-iframe-wrapper">
        {/* Replace the src URL below with the actual heatmap website URL */}
        {/* <iframe
          src="https://example.com/heatmap"
          title="Event Heat Map"
          width="100%"
          height="600px"
          className="border-none rounded-2xl shadow-[0_4px_32px_rgba(0,0,0,0.15)]"
          allowFullScreen
        /> */}
        <div className="mb-8">
                  {/* <HeatMap /> */}
                  <SvgHeatmap />
                </div>
        </div>
    </div>
  );
}

export default HeatMapPage;

