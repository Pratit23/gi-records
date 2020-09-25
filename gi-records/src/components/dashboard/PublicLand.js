import React, { useEffect, useState } from 'react'
import Web3 from 'web3';
import Sidenav from '../layout/Sidenav'
import { simpleStorageAbi } from '../../abis/abis'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps"
import globalVal from '../../BlockchainAdd'
import DashChart2 from '../layout/DashChart2';
import { db } from '../../config/fbConfig';

var localData = localStorage.getItem('userDetails')
localData = JSON.parse(localData)

var latLngs = []

const PublicLand = () => {

    const [ownerAccts, setOwnerAccts] = useState([])
    const [allCoords, setAllCoords] = useState([])
    const [update, setUpdate] = useState(false)
    const [finalCoords, setFinalCoords] = useState([])
    const [ownerProperty, setOwnerProperty] = useState([])
    const [infoWindow, setInfoWindow] = useState(false)
    const [key, setKey] = useState(0)
    const [points, setPoints] = useState([]);
    const [showGraph, setShowGraph] = useState(false);

    const getCoords = async () => {
        console.log("Get coords is running")
        const web3 = new Web3(Web3.givenProvider);
        const contractAddr = globalVal.address
        const SimpleContract = new web3.eth.Contract(simpleStorageAbi, contractAddr);

        var owners = await SimpleContract.methods.getOwners().call();
        setOwnerAccts(owners)

        if (ownerAccts.length === 0) {
            setUpdate(true)
        }

        console.log("Length of owners: ", ownerAccts.length)

        for (var i = 0; i < ownerAccts.length; i++) {
            var j = 0
            var tempId = ownerAccts[i]
            var newId = ownerAccts[i]
            var flag = true
            var intArray = []
            var newArray = ''
            var array = []

            console.log("OwnerAccts: ", ownerAccts)

            while (flag === true) {
                //console.log("get if is running")
                newId = tempId + j;
                var result = await SimpleContract.methods.getLats(newId).call();
                var firstName = await SimpleContract.methods.getfName(newId).call();
                var lastName = await SimpleContract.methods.getlName(newId).call();
                var states = await SimpleContract.methods.getState(newId).call();
                var city = await SimpleContract.methods.getCity(newId).call();
                var locality = await SimpleContract.methods.getLocality(newId).call();
                var plotNo = await SimpleContract.methods.getPlotNo(newId).call();
                var buyingRate = await SimpleContract.methods.getBuyingRate(newId).call();
                //var marketRate = await SimpleContract.methods.getMarketRate(newId).call();
                var landSize = await SimpleContract.methods.getLandSize(newId).call();
                var price = await SimpleContract.methods.getPrice(newId).call();
                if (result.length == 0) {
                    flag = false;
                }
                else {
                    newArray = newArray.concat(result)
                    newArray = newArray.split(" ")
                    for (var k = 0; k < newArray.length; k += 2) {
                        intArray.push({ lat: parseFloat(newArray[k + 1]), lng: parseFloat(newArray[k]) })
                    }
                    array[j] = intArray;
                    ownerProperty.push({
                        firstName: firstName,
                        lastName: lastName,
                        state: states,
                        city: city,
                        locality: locality,
                        plotNo: plotNo,
                        buyingRate: buyingRate,
                        landSize: landSize,
                        price: price,
                        coordsArray: intArray,
                    })
                    intArray = []
                    newArray = ''
                    j++;
                }
            }

            allCoords.push(array)
        }
        for (var x = 0; x < allCoords.length; x++) {
            for (var z = 0; z < allCoords[x].length; z++) {
                finalCoords.push(allCoords[x][z])
            }
        }
        finalCoords.map((coords, key) => {
            points.push(coords)
        })

        console.log("Final Coords: ", finalCoords)
    }

    const GoogleMapExample = withGoogleMap(props => (
        <GoogleMap defaultZoom={17} defaultCenter={key ? latLngs : { lat: 15.998976, lng: 73.675307 }}>
            {props.isMarkerShown && <Marker position={key ? latLngs : { lat: 15.998976, lng: 73.675307 }} />}
            {points.map((coords, key) => (
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
                    onClick={() => handleClick(key)}
                // onMouseOut={handleMouseExit}
                />
            ))}
        </GoogleMap>
    ));

    const handleClick = (key) => {
        var avgLats = 0
        var avgLngs = 0

        for (var i = 0; i < ownerProperty[key].coordsArray.length; i++) {
            console.log("For is running")
            avgLats += ownerProperty[key].coordsArray[i].lat
            avgLngs += ownerProperty[key].coordsArray[i].lng
        }

        avgLats /= ownerProperty[key].coordsArray.length
        avgLngs /= ownerProperty[key].coordsArray.length

        console.log("Avg lats: ", avgLats)

        latLngs = { lat: avgLats, lng: avgLngs }
        setKey(key)
        setInfoWindow(true)
    };

    const showTheGraph = () => {
        setShowGraph(true)
    }

    const addToWatchlist = (property) => {
        console.log("Property coordsArray: ", toString(property.coordsArray[0]['lat']))
        const docID = localData.ethereumAdd + property.coordsArray[0]['lat']
        db.collection('watchlist').doc(docID).set({
            ...property
        }).then(() => {
            console.log("Added to watchlist")
        })
    }

    useEffect(() => {
        getCoords()
        window.$(document).ready(function () {
            window.$('.tooltipped').tooltip();
        });
    }, [update])

    return (
        <div className="row">
            <div className="col s2 mainSideNav">
                <Sidenav />
            </div>
            <div className="col s10">
                <h1>Public Land Info</h1>
                <div className="section dashSec2">
                    <div className="mapBG">
                        {
                            finalCoords.length != 0 ?
                                <>
                                    {
                                        console.log("New Property CHECK THIS: ", ownerProperty[key]),
                                        infoWindow ?

                                            <div className="viewAllCards">
                                                <div className="card propertyCard blue-grey darken-4">
                                                    <div className="row">
                                                        <div className="col s6">
                                                            <div className="card-content white-text">
                                                                <span className="card-title">{ownerProperty[key].plotNo}</span>
                                                                <p>{ownerProperty[key].firstName} {ownerProperty[key].lastName}<br />{ownerProperty[key].locality}, {ownerProperty[key].city}<br />{ownerProperty[key].state}<br />Area: {ownerProperty[key].landSize} sq/m<br />Buying Rate: ₹{ownerProperty[key].buyingRate}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col s6">
                                                            {
                                                                showGraph ?
                                                                    <div className="card  blue-grey darken-4 chartCard sellDetailChart">
                                                                        <div className="mainCard card-content white-text">
                                                                            <div className="section">
                                                                                <span className="cardTitle card-title white-text">Rate</span>
                                                                            </div>
                                                                            <div className="cardChart section">
                                                                                <DashChart2 locality={ownerProperty[key].locality} />
                                                                            </div>
                                                                        </div>
                                                                    </div> : null
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="card-action propertyCard">
                                                        <a onClick={() => addToWatchlist(ownerProperty[key])} className="black white-text btn">Add to watchlist</a>
                                                        <a onClick={() => showTheGraph()} className="blue white-text btn">Show Graph</a>
                                                    </div>
                                                </div>
                                            </div>
                                            : null
                                    }
                                    <GoogleMapExample
                                        containerElement={<div style={{ height: `100vh` }} />}
                                        mapElement={<div className="mapElement" style={{ height: `100vh` }} />}
                                    />
                                </> : null
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PublicLand
