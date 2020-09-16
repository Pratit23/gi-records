import React, { useEffect, useState } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps"
import { connect } from 'react-redux'

var flag = false
var latLngs = {}

const DetailsCardMap = (props) => {

    const [points, setPoints] = useState([]);

    useEffect(() => {
        console.log("Map2: ", props.temp)
        if ((props.temp).length !== 0) {
            console.log("if is running")
            var l = (props.temp).length
            setPoints(props.temp)
            console.log("Points: ", points)
            console.log("getAverage is running")

            console.log("Leng: ", points.length)

            var avgLats = 0
            var avgLngs = 0

            for (var i = 0; i < points.length; i++) {
                console.log("For is running")
                avgLats += points[i].lat
                avgLngs += points[i].lng
            }

            console.log("Leng: ", points.length)

            avgLats /= points.length
            avgLngs /= points.length

            console.log("Avg lats: ", avgLats)

            latLngs = { lat: avgLats, lng: avgLngs }

            console.log("Dict: ", latLngs)

            // getAverage()
            // flag = true
        }
    })

    const GoogleMapExample = withGoogleMap(props => (
        console.log("First lat: ", points),
        <GoogleMap defaultZoom={17} defaultCenter={latLngs ? latLngs : { lat: 15.998976, lng: 73.675307 }}>
            {props.isMarkerShown && <Marker position={latLngs ? latLngs : { lat: 15.998976, lng: 73.675307 }} />}
            <Polygon
                path={points}
                //key={1}
                options={{
                    fillColor: "#F15152",
                    fillOpacity: 0.4,
                    strokeColor: "#000",
                    strokeOpacity: 1,
                    strokeWeight: 1
                }} />
        </GoogleMap>
    ));
    return (
        <div>
            <GoogleMapExample
                containerElement={<div style={{ height: `100vh` }} />}
                mapElement={<div className="mapElement" style={{ height: `100%` }} />}
            />
        </div>
    );
};

export default DetailsCardMap;