import React, { useState, useEffect } from 'react'
import Web3 from 'web3';
import { simpleStorageAbi } from '../abis/abis';
import { connect } from 'react-redux'
import MapContainer from '../components/layout/Map1'
import { Link } from 'react-router-dom'
import Sidenav from '../components/layout/Sidenav'
import globalVal from '../BlockchainAdd'
import { Switch } from 'react-materialize'
import { db } from '../config/fbConfig';


var localData = localStorage.getItem('userDetails')
localData = JSON.parse(localData)

var tempArray = []

const Blockchain = (props) => {

  // note, contract address must match the address provided by Truffle after migrations
  const web3 = new Web3(Web3.givenProvider);
  const contractAddr = globalVal.address
  const SimpleContract = new web3.eth.Contract(simpleStorageAbi, contractAddr);

  const [id, setId] = useState()
  const [property, setProperty] = useState([])
  const [listedProperty, setListedProperty] = useState([])
  const [coordsArray, setCoordsArray] = useState([])
  const [listedCoordsArray, setListedCoordsArray] = useState([])
  const [toggle, setToggle] = useState(false)

  const checkToggle = async () => {
    if (toggle) {
      setToggle(false)
      props.show(property)
    } else {
      setToggle(true)
      props.show(tempArray)
    }
  }

  console.log("Propeasd", property)

  const handleGet = async () => {

    console.log("These are the props: ", props)

    var newArray = '';
    var intArray = []
    var array = []

    var j = 0;
    var tempId = id
    var newId = id;
    //console.log(newId)
    var flag = true
    while (flag == true) {
      newId = tempId + j;
      var result = await SimpleContract.methods.getLats(newId).call();
      if (result.length == 0) {
        flag = false;
      }
      else {
        newArray = newArray.concat(result)
        newArray = newArray.split(" ")
        for (var i = 0; i < newArray.length; i += 2) {
          intArray.push({ lat: parseFloat(newArray[i + 1]), lng: parseFloat(newArray[i]) })
        }
        array[j] = intArray;
        intArray = []
        newArray = ''
        j++;
      }
    }

    var flag1 = true
    tempId = id
    newId = id
    j = 0
    var v = 0

    while (flag1 == true) {
      newId = tempId + j;
      var firstName = await SimpleContract.methods.getfName(newId).call();
      var lastName = await SimpleContract.methods.getlName(newId).call();
      var states = await SimpleContract.methods.getState(newId).call();
      var city = await SimpleContract.methods.getCity(newId).call();
      var locality = await SimpleContract.methods.getLocality(newId).call();
      var plotNo = await SimpleContract.methods.getPlotNo(newId).call();
      var buyingRate = await SimpleContract.methods.getBuyingRate(newId).call();
      var landSize = await SimpleContract.methods.getLandSize(newId).call();
      var hashValue = await SimpleContract.methods.getHashValue(newId).call();
      var price = await SimpleContract.methods.getPrice(newId).call();

      console.log("I AM BACK", firstName, lastName)

      if (firstName.length == 0 && lastName.length == 0 && states.length == 0 && city.length == 0
        && locality.length == 0 && plotNo.length == 0 && buyingRate.length == 0 && landSize.length == 0 && hashValue.length == 0 && price.length == 0) {
        flag1 = false
      } else {
        console.log("Else is running")
        property[plotNo + locality] = {
          firstName: firstName,
          lastName: lastName,
          states: states,
          city: city,
          locality: locality,
          plotNo: plotNo,
          buyingRate: buyingRate,
          landSize: landSize,
          hashValue: hashValue,
          price: price,
          coordsArray: array[parseInt(v)],
          landID: newId,
        }
        j++
        v++
      }
    }

    tempArray = []

    await db.collection('sellLand')
      .where('sellerID', '==', localData.ethereumAdd)
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const data = doc.data()
          tempArray[data.plotNo + data.locality] = {
            firstName: data.authorFirstName,
            lastName: data.authorLastName,
            states: data.state,
            city: data.city,
            locality: data.locality,
            plotNo: data.plotNo,
            buyingRate: data.rate,
            landSize: data.landSize,
            price: data.price,
            coordsArray: data.coords,
          }
          listedCoordsArray.push(data.coords)
        })
      })

    console.log("Listed property: ", tempArray)

    setCoordsArray(array)
    console.log("Property in blockchain: ", property)
    props.show(property)
    localStorage.setItem('propertyDetails', JSON.stringify(property))
  }

  useEffect(() => {
    setId(props.profile.ethereumAdd)
  })

  useEffect(() => {
    handleGet()
  }, [id])

  return (
    <div className="row">
      <div className="col s2 mainSideNav">
        <Sidenav />
      </div>
      <div className="col s10">
        <div className="section">
          <h3>Your Lands</h3>
        </div>
        <div className="section dashSec2">
          <div className="row mb-0">
            <div style={{ padding: '0' }} className="col s12">
              <div className="mapBG">
                {
                  toggle ? <MapContainer temp={listedCoordsArray} /> : <MapContainer temp={coordsArray} />
                }
                <div className="yourLandFloatingDiv">
                  <Switch
                    id="Switch-11"
                    offLabel="All Lands"
                    onChange={() => checkToggle()}
                    onLabel="Listed"
                    checked={toggle}
                  />
                  {
                    toggle ?
                      <div className="scrollLand">
                        {
                          Object.keys(tempArray).length == 0 ? <div className="progress">
                            <div className="indeterminate"></div>
                          </div> : Object.values(tempArray).map(
                            (details, key) => (
                              <div key={key}>
                                <div className="col s12" key={key}>
                                  <div className="card propertyCard blue-grey darken-4" key={key}>
                                    <Link to={'/property/' + Object.keys(tempArray)[key]} key={key}>
                                      <div className="card-content white-text">
                                        <span className="card-title">{details.plotNo}</span>
                                        <p>{details.locality}, {details.states}, {details.city}</p>
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            ))}
                      </div>
                      :
                      <div className="scrollLand">
                        {
                          Object.keys(property).length == 0 ? <div className="progress">
                            <div className="indeterminate"></div>
                          </div> :
                            Object.values(property).map(
                              (details, key) => (
                                <div key={key}>
                                  <div className="col s12" key={key}>
                                    <div className="card propertyCard blue-grey darken-4" key={key}>
                                      <Link to={'/property/' + Object.keys(property)[key]} key={key}>
                                        <div className="card-content white-text">
                                          <span className="card-title">{details.plotNo}</span>
                                          <p>{details.locality}, {details.states}, {details.city}</p>
                                        </div>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              ))}
                      </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  console.log("check this shit: ", state.firebase.profile)
  return {
    profile: state.firebase.profile,
    points: state.coordinates.points
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    show: (data) => dispatch({ type: 'SHOW', property: data })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Blockchain)