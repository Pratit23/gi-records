import React, { Component } from 'react'
import ProjectList from '../projects/ProjectList'
import Notifications from './Notifications'
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
//import DashChart3 from '../layout/DashChart3';

var testArray = ['one', 'two', 'three']


class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showDropDown: false,
      showButton: true,
      property: [],
      selectPlot: '',
    }
  }

  handleSelect() {
    window.$(document).ready(function(){
      window.$('select').formSelect();
    });
  }

  componentDidMount() {
    window.$(document).ready(function(){
      window.$('select').formSelect();
    });
  }

  async handleDropdown() {
    const web3 = new Web3(Web3.givenProvider);
    const contractAddr = '0x208c6ad7F12E86429532d372547e2c389F291c99';
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
        this.state.property.push({
          states: states,
          city: city,
          locality: locality,
          plotNo: plotNo
        })
      }
      this.handleSelect()
      j++
    }

    this.setState({
      showDropDown: true,
      showButton: false
    })
  }

  render() {
    console.log(this.props)
    const { projects, auth, notifications } = this.props;
    if (!auth.uid) {
      this.props.history.push('/signin')
    }
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
                        <div className="section">
                          <span className="cardTitle card-title white-text">Watchlist</span>
                          <div className="input-field section">
                            {
                              this.state.showButton ? <a onClick={() => this.handleDropdown()} className="btn">Get Plots</a> : null
                            }
                            {
                              this.state.showDropDown ?
                                <div className="input-field col s12">
                                  <select id="select">
                                    <option value="" disabled selected>Choose your option</option>
                                    <option value="1">Option 1</option>
                                    <option value="2">Option 2</option>
                                    <option value="3">Option 3</option>
                                  </select>
                                  <label>Materialize Select</label>
                                </div> : null
                            }
                          </div>
                        </div>
                        <div className="cardChart section">
                          <DashChart1 />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*<div className="col s12 m6">
                    <div className="card  blue darken-1">
                      <div className="mainCard card-content white-text">
                        <div className="section">
                          <span className="cardTitle card-title white-text">Rate</span>
                        </div>
                        <div className="cardChart section">
                          <DashChart2 />
                        </div>
                      </div>
                    </div>
                  </div>*/}
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