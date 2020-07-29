import React, { useState } from 'react';
import Web3 from 'web3';
import { simpleStorageAbi } from '../abis/abis';
import { connect } from 'react-redux'
import MapContainer from '../components/layout/Map'


// note, contract address must match the address provided by Truffle after migrations
const web3 = new Web3(Web3.givenProvider);
const contractAddr = '0xbD4A1cc44A5d34204efCF45DB45f4B2EAe1c3c42';
const SimpleContract = new web3.eth.Contract(simpleStorageAbi, contractAddr);
var newArray = '';
var splitArray = []
var intArray = []



function Blockchain(props) {
  const [lats, setCoords] = useState([]);
  const [address, setAddress] = useState('');
  const [id, setId] = useState('');

  const { profile } = props;

  const fName = profile.firstName;
  const lName = profile.lastName;

  const handleSet = async (e) => {
    e.preventDefault();
    
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    var tempAddress = address;
    var newAddress = address;
    var flag = true;
    var i = 0;
    //const gas = await SimpleContract.methods.setOwner(number).estimateGas();
    //check in a while loop until (index, userAcct) returns an empty array, which implies index is available for storage
    while(flag == true)
    {
      //console.log('This is running');
      newAddress = tempAddress + i;
      var result = await SimpleContract.methods.getLats(newAddress).call();
      console.log(newAddress)
      if(result.length == 0) 
      {
        //console.log("If is runnning")
        const setResult = await SimpleContract.methods.setOwner(address, newAddress, fName,
          lName, "73.675307 15.998976 73.673804 15.995305 73.676338 15.993283 73.678700 15.997491").send({ from: account });
        flag = false;
        console.log(setResult);
        console.log(fName);
        console.log(lName);
      } else {
        i++;
      }
    }
  }

  // const handleGet = async (e) => {
  //   e.preventDefault();
  //   for (var i = 0; i < idArray.length - 1; i++) {
  //     newArray[i] = await SimpleContract.methods.getLats(i).call();
  //   }
  //   console.log(newArray)
  //   //const result = await SimpleContract.methods.getLats(id).call();
  //   //getLongs(result);
  //   //console.log(result);
  // }

  var array = []

  const handleGet = async (e) => {
    e.preventDefault();
    var j = 0;
    var tempId = id
    var newId = id;
    //console.log(newId)
    var flag = true
    while(flag == true)
    {
      //console.log("get if is running")
      newId = tempId + j;
      var result = await SimpleContract.methods.getLats(newId).call();
      if(result.length == 0)
      {
        flag = false; 
      }
      else{
        newArray = newArray.concat(result)
        newArray = newArray.split(" ")
        for(var i = 0; i < newArray.length; i+=2)
        {
          intArray.push({lat: parseFloat(newArray[i+1]), lng: parseFloat(newArray[i])})
        }
        array[j] = intArray;
        intArray = []
        newArray = ''
        j++;
      }
    }

    console.log(array);
    setCoords(array);
  }

  return (
    <div className="container">
      <form className="white signInContainer" onSubmit={handleSet}>
        <h5 className="grey-text text-darken-3">Enter Details</h5>
        <div className="input-field">
          <label htmlFor="address">Account Address</label>
          <input type="text" id='address' onChange={e => setAddress(e.target.value)} />
        </div>
        <button className="waves-effect waves-light btn">Set</button>
      </form>
      <form className="white signInContainer" onSubmit={handleGet}>
        <div className="input-field">
          <label htmlFor="id">Transaction ID</label>
          <input type="text" id='id' onChange={e => setId(e.target.value)} />
        </div>
        <button className="waves-effect waves-light btn">Get</button>
      </form>
      <MapContainer setPoints={array}/>
      {/*<h2 className="white-text">{lats}</h2>*/}
    </div>
  );
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
    update: (data) => dispatch ({type: 'UPDATE', points: data})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Blockchain)