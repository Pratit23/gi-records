import React, { useEffect, useState } from 'react'
import Web3 from 'web3';
import Sidenav from '../layout/Sidenav'
import { simpleStorageAbi } from '../../abis/abis'
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps"

const PublicLand = () => {

    const [ownerAccts, setOwnerAccts] = useState([])
    const [allCoords, setAllCoords] = useState([])
    const [update, setUpdate] = useState(false)
    const [finalCoords, setFinalCoords] = useState([])
    const [ownerProperty, setOwnerProperty] = useState([])
    const [infoWindow, setInfoWindow] = useState(false)
    const [key, setKey] = useState(0)
    const [points, setPoints] = useState([]);

    const getCoords = async () => {
        console.log("Get coords is running")
        const web3 = new Web3(Web3.givenProvider);
        const contractAddr = '0xbdDB204381B459AD0d328A896A10d62129212634';
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
                var landSize = await SimpleContract.methods.getLandSize(newId).call();
                var price = await SimpleContract.methods.getPrice(newId).call();
                if (result.length == 0) {
                    flag = false;
                }
                else {
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
                        coordsArray: result
                    })
                    newArray = newArray.concat(result)
                    newArray = newArray.split(" ")
                    for (var k = 0; k < newArray.length; k += 2) {
                        intArray.push({ lat: parseFloat(newArray[k + 1]), lng: parseFloat(newArray[k]) })
                    }
                    array[j] = intArray;
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
        <GoogleMap defaultZoom={16} defaultCenter={{ lat: 15.998976, lng: 73.675307 }}>
            {props.isMarkerShown && <Marker position={{ lat: 15.998976, lng: 73.675307 }} />}
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
                // onMouseOver={handleMouseOver} 
                // onMouseOut={handleMouseExit}
                />
            ))}
        </GoogleMap>
    ));

    const handleClick = (key) => {
        setKey(key)
        setInfoWindow(true)
    };

    useEffect(() => {
        getCoords()
    }, [update])

    return (
        <div className="row">
            <div className="col s2 mainSideNav">
                <Sidenav />
            </div>
            <div className="col s10">
                <div className="mapBG">
                    {
                        finalCoords.length != 0 ?
                            <div>
                                <GoogleMapExample
                                    containerElement={<div style={{ height: `100vh` }} />}
                                    mapElement={<div className="mapElement" style={{ height: `100vh` }} />}
                                />
                                {
                                    console.log("Info window: ", infoWindow),
                                    infoWindow ?
                                        <h1>{ownerProperty[key].lastName}</h1>
                                        : null
                                }
                            </div> : null
                    }
                </div>
            </div>
        </div>
    )
}

export default PublicLand
