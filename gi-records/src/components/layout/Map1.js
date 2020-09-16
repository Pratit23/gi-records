import React, { useEffect, useState } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps"
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'



const ViewAllLandMaps = (props) => {

    const [points, setPoints] = useState([]);
    const [infoWindow, setInfoWindow] = useState(false)
    const [key, setKey] = useState(0)

    console.log("Map1 Props:", props)

    useEffect(() => {
        props.temp.map((coords, key) => {
            points.push(coords)
        })

        console.log("Map 1 points: ", points)
    })

    // const handleMouseOver = e => {
    //     setInfoWindow(true)
    // };
    // const handleMouseExit = e => {
    //     setInfoWindow(false)
    // };
    const handleClick = e => {

    };


    const GoogleMapExample = withGoogleMap(props => (
        <GoogleMap defaultZoom={15} defaultCenter={{ lat: 15.998976, lng: 73.675307 }}>
            {props.isMarkerShown && <Marker position={{ lat: 15.998976, lng: 73.675307 }} />}
            {points.map((coords, key) => (
                console.log("Arrays inside point: ", coords),
                <Polygon
                    path={coords}
                    key={key}
                    options={{
                        fillColor: "#F15152",
                        fillOpacity: 0.4,
                        strokeColor: "#000",
                        strokeOpacity: 1,
                        strokeWeight: 1
                    }}
                    // onClick={handleClick}
                // onMouseOver={handleMouseOver} 
                // onMouseOut={handleMouseExit}
                />
            ))}
        </GoogleMap>
    ));
    return (
        <div>
                <GoogleMapExample
                    containerElement={<div style={{ height: `100vh` }} />}
                    mapElement={<div className="mapElement" style={{ height: `100vh` }} />}
                />
            {
                infoWindow ?
                    <p className="black-text">Testing</p>
                    : null
            }
        </div>
    );
};

export default ViewAllLandMaps;