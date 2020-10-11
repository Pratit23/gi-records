import React, { useEffect } from "react";
import { geolocated } from "react-geolocated";
import Geocode from "react-geocode";
import { db } from '../../config/fbConfig'
import { connect } from "react-redux";
import { Link } from 'react-router-dom'
import { compose } from 'redux'

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w");

// set response language. Defaults to english.
Geocode.setLanguage("en");

// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
//Geocode.setRegion("es");

// Enable or disable logs. Its optional.
//Geocode.enableDebug();

var address = ''
var tempArray = ''
var theState = ''
var theCity = ''
var dbResults = []
var arrayOfKeys = []

var localData = localStorage.getItem('userDetails')
localData = JSON.parse(localData)

const GetLocation = (props) => {

    const getData = () => {
        if (props.coords) {
            Geocode.fromLatLng(props.coords.latitude, props.coords.longitude).then(
                response => {
                    address = response.results[0].formatted_address;
                    console.log("The address of the land:", address);
                },
                error => {
                    console.error("Error fetching the land: ", error);
                }
            ).then(() => {
                tempArray = address.split(',')
                theState = ((tempArray[tempArray.length - 2]).slice(0, (tempArray[tempArray.length - 2]).length - 6)).trim()
                theCity = (tempArray[tempArray.length - 3]).trim()
                // console.log("The state: ", theState)
                // console.log("The city: ", theCity)
                // console.log("Temp Array: ", tempArray)

                db.collection('sellLand')
                    .where("state", "==", theState)
                    .where("city", "==", theCity)
                    .get()
                    .then(snapshot => {
                        snapshot.forEach(doc => {
                            const data = doc.data()
                            // console.log("DOC", doc.id)
                            console.log("DOC ID", data)
                            if (data.sellerID != localData.ethereumAdd) {
                                dbResults[data.plotNo + data.locality] = { ...data }
                            }
                        })
                    })
                    .catch(error => console.log(error))
                console.log("DB Results: ", dbResults)
                props.sell(dbResults)

                arrayOfKeys = Object.keys(dbResults);
            })
        }
    }
    useEffect(() => {
        getData()
    },)

    return (
        <div>
            <h5 className="center-align">Suggested Lands</h5>
            <div className="row">
                <div className="col s12">
                    {
                        console.log("Length of dbresults: ", Object.values(dbResults).length),
                        Object.values(dbResults).length !== 0 ?
                            Object.values(dbResults).map((detail, key) => {
                                console.log("Is this working?")
                                return (
                                    <Link key={key} to={'/sellDetail/' + arrayOfKeys[key]}>
                                        <div className="card blue-grey darken-1 horiCards">
                                            <div className="card-content white-text">
                                                <span className="card-title">{detail.plotNo}</span>
                                                <p>{detail.locality}, {detail.city}<br />{detail.state}</p>
                                            </div>
                                        </div>
                                    </Link>
                                )
                            }) : console.log("It aint mapping son")
                    }
                </div>
            </div>
        </div>
    ) 
}


const mapDispatchToProps = (dispatch) => {
    return {
        sell: (data) => dispatch({ type: 'SHOW_SELL_DETAIL', property: data })
    }
}

export default compose(geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
}),
    connect(null, mapDispatchToProps)
)(GetLocation);