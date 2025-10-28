import React, { useEffect, useRef, useState } from 'react'; // Import React and hooks (currently not used)
import './HeatMapPage.css'; // Import CSS for styling this page
import SvgHeatmap from '../Heatmap/SvgHeatmap'; // Import the heatmap component

// Main HeatMapPage component
function HeatMapPage() {
  return (
    // Outer container for the page
    // NOTE: className "h2" is a bit confusing; it's better to rename to something like "heatmap-page"
    <div className="h2">
      
      {/* Page heading */}
      {/* Applies large text, centered alignment, bold font, shadow/glass effect from CSS */}
      <h2 className="heatmap-container">
        Event Heat Map
      </h2>

      {/* Wrapper for the heatmap content */}
      {/* Adds rounded corners and shadow for a card-like appearance */}
      <div className="heatmap-iframe-wrapper">
        
        {/* Utility div for spacing below the heatmap */}
        <div className="mb-8">
          
          {/* The actual SVG heatmap component */}
          <SvgHeatmap />
        </div>
      </div>
    </div>
  );
}

// Export the component so it can be used in other parts of the app
export default HeatMapPage;
