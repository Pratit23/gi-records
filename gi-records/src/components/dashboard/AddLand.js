import React, { Component } from 'react';
import Web3 from 'web3';
import { simpleStorageAbi } from '../../abis/abis';
import { connect } from 'react-redux'
import MapContainer from '../layout/Map'
import { Redirect } from 'react-router-dom';


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
            rate: '',
            landSize: '',
            price: '',
            coordsArray: [],
            displaySecDiv: false,
            added: false
        }
    }

    handleChangeMeta = (e) => {
        // e.preventDefault();
        // const web3 = new Web3(Web3.givenProvider);
        // var metaMaskAcc = web3.currentProvider.selectedAddress;
        // var lowerCaseAddress = (e.target.value.toLowerCase())
        // console.log("Metamask address: ",metaMaskAcc)
        // console.log("LoweCase address: ",lowerCaseAddress)
        // if(metaMaskAcc == lowerCaseAddress) {
            this.setState({
                [e.target.id]: e.target.value
            })
        // }
        // else {
        //     alert("Error!!! Ethereum address does not match!!!")
        // }
    }

    handleChange = (e) => {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const web3 = new Web3(Web3.givenProvider);
        const contractAddr = '0x11d5231943D982657f7Af116a16Cec14EE68d24A';
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
                rate: owner.rate,
                landSize: owner.landSize,
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
                console.log("State added:", this.state.added)
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

                console.log("This is that array: ", array[(array.length) - 1])
                console.log("And the length of this array is: ", array.length)

                this.setState({
                    coordsArray: array[(array.length) - 1],
                })
            }
        }

        await fetch('http://localhost:2000/delete/?hash=' + this.state.hash, {
            method: 'GET'
        }).then(res => res.json())
            .then(response => {
                console.log(response)
                self.setState({ data: response, added: true });
            }).catch(err => {
                console.log('caught it!', err);
            })
    }

    shouldComponentUpdate(prevProps, prevState) {
        if (prevState.added != this.state.added) {
            return true
        } else {
            return false
        }
    }

    render() {
        const firstName = this.props.profile.firstName;
        const lastName = this.props.profile.lastName;
        const { auth } = this.props;
        if (!auth.uid) return <Redirect to='/signin' />
        return (
            <div className="row">
                <div style={{ padding: '0' }} className="col s12">
                    <div className="mapBG">
                        <MapContainer temp={this.state.coordsArray} />
                    </div>
                    <form className="white addLandForm z-depth-3" onSubmit={this.handleSubmit}>
                        <div className="input-field">
                            <label htmlFor="hash">Hash Value</label>
                            <input type="text" id='hash' onChange={this.handleChange} />
                        </div>
                        <div className="input-field">
                            <label htmlFor="address">Ethereum Address (Lowercase letters)</label>
                            <input type="text" id='address' onChange={this.handleChangeMeta} />
                        </div>
                        <button className="waves-effect waves-light btn black">Add</button>
                    </form>
                    {
                        console.log("Second div", this.state.added),
                        this.state.added ?
                            <form className="white addLandForm z-depth-3">
                                <p>{firstName}</p>
                                <p>{lastName}</p>
                                <p>{this.state.coords}</p>
                                <p>{this.state.state}</p>
                                <p>{this.state.city}</p>
                                <p>{this.state.locality}</p>
                                <p>{this.state.plotNo}</p>
                                <p>{this.state.price}</p>
                            </form>
                            : console.log("Second not loading")
                    }
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
        points: state.coordinates.points,
        auth: state.firebase.auth,
    }
}

export default connect(mapStateToProps, null)(AddLand);