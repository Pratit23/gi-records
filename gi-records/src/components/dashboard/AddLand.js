import React, { Component } from 'react';
import Web3 from 'web3';
import { simpleStorageAbi } from '../../abis/abis';
import { connect } from 'react-redux'
import MapContainer from '../layout/Map'


class AddLand extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            hash: '',
            address: '',
            coords: '',
            state: '',
            city: '',
            locality: '',
            plotNo: '',
            price: '',
            coordsArray: []
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const web3 = new Web3(Web3.givenProvider);
        const contractAddr = '0x7195270B599D47892B6C6a41663fC7D318AE1fd9';
        const SimpleContract = new web3.eth.Contract(simpleStorageAbi, contractAddr);
        const { profile } = this.props;
        const fName = profile.firstName;
        const lName = profile.lastName;


        var newArray = '';
        var intArray = []
        var array = []


        //const data = { hash: this.state.hash }
        console.log("Hash: ", this.state.hash)
        let self = this;
        await fetch('http://localhost:2000/?hash=' + this.state.hash, {
            method: 'GET'
        }).then(res => res.json())
            .then(response => {
                console.log(response)
                self.setState({ data: response });
            }).catch(err => {
                console.log('caught it!', err);
            })


        this.state.data.map((owner, index) => (
            this.setState({
                coords: owner.coords,
                state: owner.state,
                city: owner.city,
                locality: owner.locality,
                plotNo: owner.plotNo,
                price: owner.price
            })
        ))

        console.log("coords: ", this.state.coords)
        const accounts = await window.ethereum.enable();
        const account = accounts[0];
        var tempAddress = this.state.address;
        var newAddress = this.state.address;
        var flag = true;
        var i = 0;
        //const gas = await SimpleContract.methods.setOwner(number).estimateGas();
        //check in a while loop until (index, userAcct) returns an empty array, which implies index is available for storage
        while (flag == true) {
            //console.log('This is running');
            newAddress = tempAddress + i;
            var result = await SimpleContract.methods.getLats(newAddress).call();
            console.log(newAddress)
            if (result.length == 0) {
                //console.log("If is runnning")
                const setResult = await SimpleContract.methods.setOwner(this.state.address, newAddress, fName,
                    lName, this.state.coords, this.state.state, this.state.city, this.state.locality, this.state.plotNo, this.state.price).send({ from: account });
                flag = false;
                console.log(setResult);
            } else {
                i++;
            }
        }

        var j = 0;
        var tempId = this.state.address;
        var newId = this.state.address;
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

                this.setState({
                    coordsArray: array
                })
            }
        }

        await fetch('http://localhost:2000/delete/?hash=' + this.state.hash, {
            method: 'GET'
        }).then(res => res.json())
            .then(response => {
                console.log(response)
                self.setState({ data: response });
            }).catch(err => {
                console.log('caught it!', err);
            })
    }

    render() {
        return (
            <div className="row">
                <div style={{ padding: '0' }} className="col s12">
                    <div className="mapBG">
                        <MapContainer temp={this.state.coordsArray} />
                    </div>
                    <form className="white addLandForm z-depth-3 col s12 l4" onSubmit={this.handleSubmit}>
                        <div className="input-field">
                            <label htmlFor="hash">Hash Value</label>
                            <input type="text" id='hash' onChange={this.handleChange} />
                        </div>
                        <div className="input-field">
                            <label htmlFor="address">Ethereum Account Address</label>
                            <input type="text" id='address' onChange={this.handleChange} />
                        </div>
                        <button className="waves-effect waves-light btn black">Add</button>
                    </form>
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

export default connect(mapStateToProps, null)(AddLand);