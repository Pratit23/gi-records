import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import DashChart1 from '../layout/DashChart1';
import Sidenav from '../layout/Sidenav'
import Web3 from 'web3';
import { simpleStorageAbi } from '../../abis/abis';
import "materialize-css/dist/css/materialize.min.css";
import globalVal from '../../BlockchainAdd'
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize'
import { db } from '../../config/fbConfig';
import moment from 'moment'

var temp = []

const Dashboard = (props) => {

  const [showDropDown, setShowDropDown] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const [property, setProperty] = useState([])
  const [selectPlot, setSelectPlot] = useState('')
  const [selectLocality, setSelectLocality] = useState('')
  const [selectCity, setSelectCity] = useState('')
  const [selectState, setSelectState] = useState('')
  const [selectLandSize, setSelectLandSize] = useState('')
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
  }

  const getWatchlist = async () => {
    var localData = localStorage.getItem('userDetails')
    localData = JSON.parse(localData)
    if (typeof (localData.ethereumAdd) !== 'undefined') {
      console.log("Ethereum Add: ", localData.ethereumAdd)
      if (watchlist.length == 0) {
        await db.collection('watchlist')
          .where("ethereumAdd", "==", localData.ethereumAdd)
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
        }
      }
    }
  }

  useEffect(() => {
    getWatchlist()
  })

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
                <div className="col s12">
                  <div className="card red darken-1 chartCard">
                    <div className="mainCard card-content white-text">
                      <div className="section dashCard">
                        <span className="cardTitle card-title white-text">Watchlist</span>
                        <div className="input-field section">
                          {
                            showButton ? <a onClick={() => handleDropdown()} className="btn">Get Plots</a> : null
                          }
                          {
                            showDropDown ?
                              <div className="input-field col s12 inputDashCard">
                                <select onChange={() => getValue()} id="plotSelect">
                                  {
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
              <div className="section">
              </div>
            </div>
            <div className="col s6 collapWrapper">
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
                  </Collapsible> </div>: null
              }
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