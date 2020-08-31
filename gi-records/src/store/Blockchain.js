import React, { Component } from 'react'
import Web3 from 'web3';
import { simpleStorageAbi } from '../abis/abis';
import { connect } from 'react-redux'
import MapContainer from '../components/layout/Map1'
import { Link } from 'react-router-dom'


// note, contract address must match the address provided by Truffle after migrations
const web3 = new Web3(Web3.givenProvider);
const contractAddr = '0xF8Fdb25E2b71E82342ac33ac63aA2DCF4BcCE972';
const SimpleContract = new web3.eth.Contract(simpleStorageAbi, contractAddr);
var newArray = '';
var splitArray = []
var intArray = []
var array = []

class Blockchain extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id: '',
      property: [],
      coordsArray: [],
      update: false,
    }
  }

  handleChange = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  async componentDidMount() {
    
  }

  handleGet = async (e) => {
    e.preventDefault();
    var j = 0;
    var tempId = this.state.id
    var newId = this.state.id;
    //console.log(newId)
    var flag = true
    while (flag == true) {
      //console.log("get if is running")
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
    tempId = this.state.id
    newId = this.state.id
    j = 0

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

      if (firstName.length == 0 && lastName.length == 0 && states.length == 0 && city.length == 0
        && locality.length == 0 && plotNo.length == 0 && buyingRate.length == 0 && landSize.length == 0 && hashValue.length == 0 && price.length == 0) {
        flag1 = false
      } else {
        this.state.property.push({
          firstName: firstName,
          lastName: lastName,
          states: states,
          city: city,
          locality: locality,
          plotNo: plotNo,
          buyingRate: buyingRate,
          landSize: landSize,
          hashValue: hashValue,
          price: price
        })
        j++
      }
    }

    console.log("First Names: ", this.state.firstName)
    console.log("Array : ", array);
    this.setState({
      coordsArray: array,
      update: true,
    })
    this.props.show(this.state.property)
    console.log("Props: ", this.props)
  }

  shouldComponentUpdate(prevProps, prevState) {
    if (prevState.update != this.state.update) {
      return true
    } else {
      return false
    }
  }

  render() {
    return (
      <div className="row">
        <div style={{ padding: '0' }} className="col s12">
          <div className="mapBG">
            <MapContainer temp={this.state.coordsArray} />
          </div>
          <form className="white addLandForm z-depth-3" onSubmit={this.handleGet}>
            <div className="input-field">
              <label htmlFor="id">Ethereum Address</label>
              <input type="text" id='id' onChange={this.handleChange} />
            </div>
            <button className="waves-effect waves-light btn black">Get</button>
          </form>
          <div className="scrollLand">
            {(this.state.property).map(
              (details, key) => (
                <div className="row" key={key}>
                  <div className="col s12" key={key}>
                    <div className="card propertyCard blue-grey darken-1" key={key}>
                      <Link to={'/property/' + key} key={key}>
                        <div className="card-content white-text">
                          <span className="card-title">Property {key + 1}</span>
                          <p>{details.plotNo}</p>
                        </div>
                      </Link>
                      <div className="card-action propertyCard">
                        <a>Sell</a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  // console.log("State: ",state)
  // console.log("Kuch bhi: ",state.coordinates.points)
  return {
    profile: state.firebase.profile,
    points: state.coordinates.points
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    update: (data) => dispatch({ type: 'UPDATE', points: data }),
    show: (data) => dispatch({ type: 'SHOW', property: data })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Blockchain)