import React, { useEffect, useState } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps"
import { connect } from 'react-redux'


const ViewAllLandMaps = (props) => {

    const [points, setPoints] = useState([]);
    useEffect(() => {
        if ((props.temp).length !== 0) {
            setPoints(props.temp)
        }
    })

    const GoogleMapExample = withGoogleMap(props => (
        console.log("Points: ", points),
        <GoogleMap defaultZoom={15} defaultCenter={{lat: 15.998976, lng: 73.675307 }}>
            {props.isMarkerShown && <Marker position={{ lat: 15.998976, lng: 73.675307 }} />}
            {points.map((coords,key) => (
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
                }} />
            ))}
        </GoogleMap>
    ));
    console.log(points)
    return (
        <div>
            <GoogleMapExample
                containerElement={<div style={{ height: `100vh`}} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
    );
};

export default ViewAllLandMaps;