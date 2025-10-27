import React, { useEffect, useRef, useState } from 'react'
import Dashboard from '../map_module/Dashboard';


//import {map, initMap, getRouteToNode, getRouteToBuilding, drawRoute, addBuildingClickListner, getGpsPosition, drawMarker } from "../utils/map_module";  

function MapPage() {
  return (
    <div className="map-page">
      <div className="map-container">
        <Dashboard kiosk_mode={true}/>
      </div>
    </div>
  );
}

export default MapPage;
