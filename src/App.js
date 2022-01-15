import React from "react";
import FullScreenDialog from "./mappop.js";
import { places } from "./places.js";
import {
  GoogleMap,
  LoadScript,
  StreetViewPanorama,
} from "@react-google-maps/api";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const mapContainerStyle = {
    height: "100vh",
    width: "100vw",
  };

  const center = {
    lat: 37.869085,
    lng: -122.254775,
  };

  const [currentPosition, setCurrentPosition] = useState({});
  const [positions,setPositions] = useState([]);

  const streetViewOptions = {
    disableDefaultUI: true,
    showRoadLabels: false,
    enableCloseButton: false,
  };

  const generateNewPosition = () => {
    let pos = places[Math.floor(Math.random() * places.length)];
    while (positions.includes(pos)) {
      pos = places[Math.floor(Math.random() * places.length)];
    }
    return pos;
  }
  
  const updatePosition = () => {
    let currentPlace = generateNewPosition();
    setPositions(positions => [...positions, currentPlace])
    setCurrentPosition(currentPlace);
    return currentPlace;
  }

  const clearPositions = () => {
    setPositions([]);
  }

  useEffect(() => {
    updatePosition()
  }, []);

  return (
    <div className="App">
      <LoadScript googleMapsApiKey="AIzaSyBq_jflBkiQcBPPY4gW9rC2siJ8V-xAmzM">
        <GoogleMap
          options={{ disableDefaultUI: true }}
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={10}
        >
          <StreetViewPanorama
            style={{ position: "relative" }}
            options={streetViewOptions}
            position={currentPosition}
            visible={true}
            className="streetviewpanel"
          ></StreetViewPanorama>
          <div
            className="dialog-wrapper"
            style={{ zIndex: 99, position: "relative" }}
          >
            <FullScreenDialog clearPositions = {clearPositions} updatePos = {updatePosition} pos = {currentPosition} className="map"/> 
            
          </div>
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default App;
