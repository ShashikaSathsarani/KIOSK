import React, { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import './Map.css';


import {map, initMap, getRouteToNode, getRouteToBuilding, drawRoute, addBuildingClickListner, getGpsPosition, drawMarker } from "../utils/map_module";  

function MapComponent() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return; // prevent re-init

    // Initialize the map
    initMap('map');
    mapRef.current = map

    let userLatLng;
    getGpsPosition()
    .then((pos) => userLatLng = pos)
    .catch((e)=>{
      console.log(e);
      userLatLng = [7.252310,80.592530];
    })
    .then(() =>{
      drawMarker(userLatLng)
    })

    const dest=4;
    getRouteToNode(userLatLng, dest)
    .then(r => drawRoute(r));

    addBuildingClickListner((buildingId) => {
      console.log("Building clicked:", buildingId);
      getRouteToBuilding(userLatLng, buildingId)
      .then(r => drawRoute(r));
    });

  }, []);
  
  // Use percentage-based width to help with centering
  const mapStyle = { 
    height: "740px", 
    width: "100%", 
    maxWidth: "840px", 
    margin: "0 auto" 
  };

  return <div id="map" style={mapStyle}></div>;
}

export default MapComponent;
