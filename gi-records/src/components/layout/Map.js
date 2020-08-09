// import React from "react"
// import { compose, withProps } from "recompose"
// import { withScriptjs, withGoogleMap, GoogleMap, Marker,Polygon } from "react-google-maps"
// import { connect } from 'react-redux';

// // const coords = [
// //     { lat: 73.675307, lng: 15.998976 },
// //     { lat: 73.673804, lng: 15.995305 },
// //     { lat: 73.676338, lng: 15.993283 },
// //     { lat: 73.678700, lng: 15.997491 }];

// // const c = [
// //     { lat: 73.706999, lng: 16.017694 },
// //     { lat: 73.707890, lng: 16.016663 },
// //     { lat: 73.706065, lng: 16.017415 },
// //     { lat: 73.706999, lng: 16.017694 }];

// // const reversedCoords = coords.map( ll => {
// //     return { lat: ll.lng, lng: ll.lat }
// // });

// // const reversedCoordsNew = c.map( ll => {
// //     return { lat: ll.lng, lng: ll.lat }
// // });




// const MyMapComponent = compose(
//     withProps({
//         googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w",
//         loadingElement: <div style={{ height: `100%` }} />,
//         containerElement: <div style={{ height: `400px` }} />,
//         mapElement: <div style={{ height: `100%` }} />,
//     }),
//     withScriptjs,
//     withGoogleMap
// )((props) =>
//     <GoogleMap defaultZoom={15} defaultCenter={{ lat: 15.998976, lng: 73.675307 }}>
//         {props.isMarkerShown && <Marker position={{ lat: 15.998976, lng: 73.675307 }} />}
//         <Polygon
//         path={props.points}
//         //key={1}
//         options={{
//             fillColor: "#000",
//             fillOpacity: 0.4,
//             strokeColor: "#000",
//             strokeOpacity: 1,
//             strokeWeight: 1
//         }} />
//     </GoogleMap>
// )

// const mapStateToProps = (state) => {
//     console.log(state);
//     return {
//         points: state.coordinates.points
//     }
// }

// export default connect(mapStateToProps, null)(MyMapComponent);

import React, { useEffect, useState } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps"
import { connect } from 'react-redux'


const MyMapComponent = (props) => {

    const [points, setPoints] = useState([]);
    useEffect(() => {
        if ((props.temp).length !== 0) {
            setPoints((props.temp)[0])
        }
    })

    const GoogleMapExample = withGoogleMap(props => (
        console.log("First lat: ", points[0]),
        <GoogleMap defaultZoom={15} defaultCenter={(points[0]) ? points[0] : { lat: 15.998976, lng: 73.675307 }}>
            {props.isMarkerShown && <Marker position={(points[0]) ? points[0] : { lat: 15.998976, lng: 73.675307 }} />}
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
                containerElement={<div style={{ height: `100vh`, width: '99vw', margin: '0 auto'}} />}
                mapElement={<div style={{ height: `100%` }} />}
            />
        </div>
    );
};

export default MyMapComponent;