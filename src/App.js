import React from "react";
import FullScreenDialog from "./mappop.js";
import { places } from "./places.js";
//import { locationData } from "./locations.js";
import {
  GoogleMap,
  LoadScript,
  StreetViewPanorama,
} from "@react-google-maps/api";
import { useState, useEffect } from "react";
//import { StreetViewService } from "@react-google-maps/api";
//import randomLocation from 'random-location'
import "./App.css";


function App() {

  //let positions = []

  const mapContainerStyle = {
    height: "100vh",
    width: "100vw",
  };

  const center = {
    lat: 37.869085,
    lng: -122.254775,
  };

  const [currentPosition, setCurrentPosition] = useState({});
  const [positions, setPositions] = useState([]);

  const streetViewOptions = {
    disableDefaultUI: true,
    showRoadLabels: false,
    enableCloseButton: false,
    enableCompass: true,
  };

  const generateNewPosition = () => {
    let pos = places[Math.floor(Math.random() * places.length)];
    while (positions.includes(pos)) {
      pos = places[Math.floor(Math.random() * places.length)];
    }
    /*let pos = {
      lat: locationData[Math.floor(Math.random() * locationData.length)].latitude,
      lng: locationData[Math.floor(Math.random() * locationData.length)].longitude,
    }*/
    /*while (locationData.includes(pos)) {
      pos = locationData[Math.floor(Math.random() * locationData.length)];
    }*/
    return pos;
  };

  const updatePosition = () => {
    let currentPlace = generateNewPosition();
    setPositions((positions) => [...positions, currentPlace]);
    setCurrentPosition(currentPlace);
    return currentPlace;
  };

  const clearPositions = () => {
    setPositions([]);
  };

  useEffect(() => {
    updatePosition();
  }, []);


  /*const onLoad = (streetViewService) => {
    for (let i = 0; i < 5; i++) {
      let pos;
      const P = { // Center of Europe
        latitude: 49.09021458334862,
        longitude: 10.592291506314515
      }
       
      const R = 500000
      streetViewService.getPanorama(
        {
          location: {
            lat: randomLocation.randomCircumferencePoint(P, R).latitude,
            lng: randomLocation.randomCircumferencePoint(P, R).longitude,
          },
          radius: 50000,
        },
        (data) => {
          console.log(data)
          if (data === null) {
            i--;
          } 
          else {
            pos = {
              lat: data.location.latLng.lat(),
              lng: data.location.latLng.lng(),
            };
            console.log("lat: " + pos.lat + "lng: " + pos.lng)
            positions.push(pos);
            console.log(positions)
          }
          
        }
      );
    }
    updatePosition();
    return positions;
  };*/

  return (
    <div className="App">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
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
          >
          </StreetViewPanorama>
          <div
            className="dialog-wrapper"
            style={{ zIndex: 99, position: "relative" }}
          >
            <FullScreenDialog
              clearPositions={clearPositions}
              updatePos={updatePosition}
              pos={currentPosition}
              className="map"
            />
          </div>
          
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default App;
