
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
        <div className="mb-8">
                  <SvgHeatmap />
                </div>
        </div>
    </div>
  );
}

export default HeatMapPage;

