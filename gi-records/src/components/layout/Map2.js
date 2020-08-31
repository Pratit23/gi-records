import React, { useEffect, useState } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps"
import { connect } from 'react-redux'

const DetailsCardMap = (props) => {

    const [points, setPoints] = useState([]);
    useEffect(() => {
        if ((props.temp).length !== 0) {
            var l = (props.temp).length
            setPoints(props.temp)
        }
    })

    const GoogleMapExample = withGoogleMap(props => (
        console.log("First lat: ", points),
        <GoogleMap defaultZoom={15} defaultCenter={points[0] ? points[0] : { lat: 15.998976, lng: 73.675307 }}>
            {props.isMarkerShown && <Marker position={points[0] ? points[0] : { lat: 15.998976, lng: 73.675307 }} />}
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
    console.log(points)
    return (
        <div>
            <GoogleMapExample
                containerElement={<div style={{ height: `100vh`, width: '99vw', margin: '0 auto' }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
    );
};

export default DetailsCardMap;