import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import DashChart1 from '../layout/DashChart1';
import DashChart3 from '../layout/DashChart3';
import Sidenav from '../layout/Sidenav'
import Web3 from 'web3';
import { simpleStorageAbi } from '../../abis/abis';
import "materialize-css/dist/css/materialize.min.css";
import globalVal from '../../BlockchainAdd'
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize'
import { db } from '../../config/fbConfig';
import GeoLocation from './GeoLocation'
import moment from 'moment'
import { geolocated } from "react-geolocated";
import Geocode from "react-geocode";
import { Link } from 'react-router-dom'

var temp = []

var address = ''
var tempArray = ''
var theState = ''
var theCity = ''
var dbResults = []
var arrayOfKeys = []

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyBvZX8lKdR6oCkPOn2z-xmw0JHMEzrM_6w");

// set response language. Defaults to english.
Geocode.setLanguage("en");

var localData = localStorage.getItem('userDetails')
localData = JSON.parse(localData)


// set response region. Its optional.
// A Geocoding request with region=es (Spain) will return the Spanish city.
//Geocode.setRegion("es");

// Enable or disable logs. Its optional.
//Geocode.enableDebug();

const Dashboard = (props) => {

  const [showDropDown, setShowDropDown] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const [showDropDownTwo, setShowDropDownTwo] = useState(false)
  const [property, setProperty] = useState([])
  const [selectPlot, setSelectPlot] = useState('')
  const [selectLocality, setSelectLocality] = useState('')
  const [selectCity, setSelectCity] = useState('')
  const [selectState, setSelectState] = useState('')
  const [selectLandSize, setSelectLandSize] = useState('')
  const [selectPlot1, setSelectPlot1] = useState('')
  const [selectLocality1, setSelectLocality1] = useState('')
  const [selectCity1, setSelectCity1] = useState('')
  const [selectState1, setSelectState1] = useState('')
  const [selectLandSize1, setSelectLandSize1] = useState('')
  const [showCollapsible, setShowCollapsible] = useState(false)
  const [watchlist, setWatchlist] = useState([])
  const [update, setUpdate] = useState(false)

  const { profile } = props

  const handleDropdown = async () => {
    const web3 = new Web3(Web3.givenProvider);
    const contractAddr = globalVal.address
    const SimpleContract = new web3.eth.Contract(simpleStorageAbi, contractAddr);

    var localData = localStorage.getItem('userDetails')
    localData = JSON.parse(localData)

    var flag1 = true
    var tempId = localData.ethereumAdd
    var newId = localData.ethereumAdd
    var j = 0
    var tempProperty = []

    temp = []
    while (flag1 == true) {
      newId = tempId + j;
      var states = await SimpleContract.methods.getState(newId).call();
      var city = await SimpleContract.methods.getCity(newId).call();
      var locality = await SimpleContract.methods.getLocality(newId).call();
      var plotNo = await SimpleContract.methods.getPlotNo(newId).call();
      var landSize = await SimpleContract.methods.getLandSize(newId).call();

      if (states.length == 0 && city.length == 0 && locality.length == 0 && plotNo.length == 0) {
        flag1 = false
      } else {
        temp.push({
          states: states,
          city: city,
          locality: locality,
          plotNo: plotNo,
          landSize: landSize,
        })
        property[plotNo] = { temp }
      }
      handleSelect()
      j++
    }

    setShowButton(false)
    setShowDropDown(true)

    console.log("THIS IS AMAZING: ", property)
  }

  const handleSelect = () => {
    window.$(document).ready(function () {
      var selected = window.$('select').formSelect()
    });
    //var val = window.$('select').val()
  }

  const getValue = () => {
    var plotVal = window.$('#plotSelect').val()
    console.log("The value: ", plotVal)
    var check = plotVal.split(",")
    setSelectPlot(check[0])
    setSelectLocality(check[1])
    setSelectCity(check[2])
    setSelectState(check[3])
    setSelectLandSize(check[4])

    console.log("Select Plot: ", selectPlot)
  }

  const getValueAnother = () => {
    var plotVal = window.$('#anotherSelect').val()
    console.log("The value: ", plotVal)
    var check = plotVal.split(",")
    setSelectPlot1(check[0])
    setSelectLocality1(check[1])
    setSelectCity1(check[2])
    setSelectState1(check[3])
    setSelectLandSize1(check[4])

    console.log("Select Plot: ", selectPlot)
  }

  const getWatchlist = async () => {
    var localData = localStorage.getItem('userDetails')
    localData = JSON.parse(localData)
    if (typeof (props.ethID) !== 'undefined') {
      //console.log("Ethereum Add: ", localData.ethereumAdd)
      if (watchlist.length === 0) {
        await db.collection('watchlist')
          .where("ethereumAdd", "==", props.ethID)
          .orderBy('createdAt', 'desc')
          .get()
          .then(snapshot => {
            console.log("Snapshot: ", snapshot)
            snapshot.forEach(doc => {
              console.log("this is ronning")
              const data = doc.data()
              watchlist.push(data)
            })
          })
        console.log("Watchlist: ", watchlist)
        if (watchlist.length !== 0) {
          setShowCollapsible(true)
          setShowDropDownTwo(true)
        }
      }
    }
    if (props.coords) {
      Geocode.fromLatLng(props.coords.latitude, props.coords.longitude).then(
        response => {
          address = response.results[0].formatted_address;
          console.log("The address of the land:", address);
        },
        error => {
          console.error("Error fetching the land: ", error);
        }
      ).then(async() => {
        tempArray = address.split(',')
        theState = ((tempArray[tempArray.length - 2]).slice(0, (tempArray[tempArray.length - 2]).length - 6)).trim()
        theCity = (tempArray[tempArray.length - 3]).trim()
        // console.log("The state: ", theState)
        // console.log("The city: ", theCity)
        // console.log("Temp Array: ", tempArray)

        await db.collection('sellLand')
          .where("state", "==", theState)
          .where("city", "==", theCity)
          .get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              const data = doc.data()
              // console.log("DOC", doc.id)
              console.log("DOC ID", data)
              if (data.sellerID !== props.ethID) {
                dbResults[data.plotNo + data.locality] = { ...data }
              }
            })
          }).then(() => {
            props.sell(dbResults)
          })
          .catch(error => console.log(error))
        console.log("DB Results: ", dbResults)
        arrayOfKeys = Object.keys(dbResults);
        console.log("Array of dbresult keys: ", arrayOfKeys)
      })
    }
  }

  useEffect(() => {
    getWatchlist()
    window.$(document).ready(function () {
      console.log("Selector is running")
      var selected = window.$('select').formSelect()
    });
  },[props.ethID])

  return (
    <div className="row">
      <div className="col s2 mainSideNav">
        <Sidenav />
      </div>
      <div className="col s10">
        <div className="section">
          <h1>Dashboard</h1>
        </div>
        <div className="section dashSec2">
          <div className="row">
            <div className="col s6">
              <div className="col s12">
                <div className="card red darken-1 chartCard">
                  <div className="mainCard card-content white-text">
                    <div className="section dashCard">
                      <span className="cardTitle card-title white-text">Your Lands</span>
                      <div className="input-field section">
                        {
                          showButton ? <a onClick={() => handleDropdown()} className="btn">Get Plots</a> : null
                        }
                        {
                          showDropDown ?
                            <div className="input-field col s12 inputDashCard">
                              <select onChange={() => getValue()} id="plotSelect">
                                {
                                  console.log("Watchlist: ", watchlist),
                                  temp && temp.map((property, key) => {
                                    return (
                                      <option key={key} value={[property.plotNo, property.locality, property.city, property.states, property.landSize]}>
                                        {property.plotNo}, {property.locality}, {property.city}, {property.states}, {property.landSize}
                                      </option>
                                    )
                                  })
                                }
                              </select>
                              <label>Choose your Plot</label>
                            </div> : null
                        }
                      </div>
                    </div>
                    <div className="cardChart section">
                      {
                        console.log("selectState: ", selectState),
                        selectState.length !== 0 && selectCity.length !== 0 && selectLocality.length !== 0 && selectLandSize.length !== 0 ?
                          <DashChart1 city={selectCity} locality={selectLocality} state={selectState} landSize={selectLandSize} /> : null
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col s6">
              <div className="col s12">
                <div className="card blue darken-1 chartCard">
                  <div className="mainCard card-content white-text">
                    <div className="section dashCard">
                      <span className="cardTitle card-title white-text">Watchlist</span>
                      <div className="input-field section">
                        {
                          showDropDownTwo ?
                            <div className="input-field col s12 inputDashCard">
                              <select onChange={() => getValueAnother()} id="anotherSelect">
                                {
                                  watchlist && watchlist.map((property, key) => {
                                    return (
                                      <option key={key} value={[property.plotNo, property.locality, property.city, property.state, property.landSize]}>
                                        {property.plotNo}, {property.locality}, {property.city}, {property.state}, {property.landSize}
                                      </option>
                                    )
                                  })
                                }
                              </select>
                              <label>Choose your Plot</label>
                            </div> : null
                        }
                      </div>
                    </div>
                    <div className="cardChart section">
                      {
                        console.log("selectState: ", selectState1),
                        selectState1.length !== 0 && selectCity1.length !== 0 && selectLocality1.length !== 0 && selectLandSize1.length !== 0 ?
                          <DashChart3 city={selectCity1} locality={selectLocality1} state={selectState1} landSize={selectLandSize1} /> : null
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="suggestedContainer">
              <div className="col s6">
                <h5 className="center-align">Suggested Lands</h5>
                <div className="row">
                  <div className="col s12">
                    {
                      console.log("Length of dbresults: ", Object.values(dbResults).length),
                      Object.values(dbResults).length !== 0 ?
                        Object.values(dbResults).map((detail, key) => {
                          console.log("Is this working?")
                          return (
                            <Link key={key} to={'/sellDetail/' + Object.keys(dbResults)[key]}>
                            {
                              console.log("Array of key key key: ", Object.keys(dbResults)[key])
                            }
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
            </div>

            {/*<div className="col s6 collapWrapperDash">
              {
                showCollapsible ?
                  <div className="allTransacCollap">
                    <Collapsible
                      accordion
                      popout>
                      {
                        watchlist.map((property, key) => {
                          return (
                            <CollapsibleItem
                              key={key}
                              expanded={false}
                              header={property.plotNo}
                              icon={<Icon>filter_drama</Icon>}
                              node="div">
                              {property.plotNo}
                              <br /><p>{moment(property.createdAt.toDate()).format('MMMM Do YYYY')}</p>

                            </CollapsibleItem>
                          )
                        })
                      }
                    </Collapsible> </div> : null
              }
            </div>*/}
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  console.log("State: ", state);
  console.log("mapState mounted");
  localStorage.setItem('userDetails', JSON.stringify(state.firebase.profile))
  return {
    projects: state.firestore.ordered.projects,
    auth: state.firebase.auth,
    notifications: state.firestore.ordered.quotes,
    ethID: state.firebase.profile.ethereumAdd
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      sell: (data) => dispatch({ type: 'SHOW_SELL_DETAIL', property: data })
  }
}


export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect((props) => [
    { collection: 'quotes', orderBy: ['createdAt', 'desc'], storeAs: 'notif' },
  ]),
  geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
}),
)(Dashboard)


// return [
//   {
//     collection: 'users',             // parent collection
//     doc: props.userId,        // sub-document
//     subcollections: [
//       { collection: 'images' }        // sub-collection
//     ],
//     storeAs: 'images'
//   }
// ]