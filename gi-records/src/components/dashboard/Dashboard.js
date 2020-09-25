import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom';
import DashChart1 from '../layout/DashChart1';
import DashChart2 from '../layout/DashChart2';
import { db } from '../../config/fbConfig'
import Sidenav from '../layout/Sidenav'
import { Select } from 'react-materialize'
import Web3 from 'web3';
import { simpleStorageAbi } from '../../abis/abis';
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";
import globalVal from '../../BlockchainAdd'

var temp = []

const Dashboard = (props) => {

  const [showDropDown, setShowDropDown] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const [property, setProperty] = useState([])
  const [selectPlot, setSelectPlot] = useState('')
  const [selectLocality, setSelectLocality] = useState('')

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

    while (flag1 == true) {
      newId = tempId + j;
      var states = await SimpleContract.methods.getState(newId).call();
      var city = await SimpleContract.methods.getCity(newId).call();
      var locality = await SimpleContract.methods.getLocality(newId).call();
      var plotNo = await SimpleContract.methods.getPlotNo(newId).call();

      if (states.length == 0 && city.length == 0 && locality.length == 0 && plotNo.length == 0) {
        flag1 = false
      } else {
        temp.push({
          states: states,
          city: city,
          locality: locality,
          plotNo: plotNo
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
  }

  // useEffect(() => {

  // }, [profile])

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
              <div className="row">
                <div className="col s6">
                  <div className="card red darken-1 chartCard">
                    <div className="mainCard card-content white-text">
                      <div className="section">
                        <span className="cardTitle card-title white-text">Watchlist</span>
                        <div className="input-field section">
                          {
                            showButton ? <a onClick={() => handleDropdown()} className="btn">Get Plots</a> : null
                          }
                          {
                            showDropDown ?
                              <div className="input-field col s12">
                                <select onChange={() => getValue()} id="plotSelect">
                                  {
                                    temp && temp.map((property, key) => {
                                      return (
                                        <option key={key} value={[property.plotNo, property.locality]}>
                                          {property.plotNo}, {property.locality}
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
                        <DashChart1 plotNo={selectPlot} locality={selectLocality} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="section">
              </div>
            </div>
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


export default compose(
  connect(mapStateToProps, null),
  firestoreConnect((props) => [
    { collection: 'quotes', orderBy: ['createdAt', 'desc'], storeAs: 'notif' },
  ])
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