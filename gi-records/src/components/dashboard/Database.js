import React, { Component } from 'react';
import Web3 from 'web3';
import { simpleStorageAbi } from '../../abis/abis';
import { connect } from 'react-redux'
import MapContainer from '../layout/Map'


class Database extends Component {


    constructor(props) {
        super(props)
        this.state = {
            data: [],
            hash: '',
            address: '',
            coords: ''
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
        const contractAddr = '0x99614c9Db403A887CC29Ccf6003098ED7076cc52';
        const SimpleContract = new web3.eth.Contract(simpleStorageAbi, contractAddr);
        const { profile } = this.props;
        const fName = profile.firstName;
        const lName = profile.lastName;
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
                coords: owner.coords
            })
        ))

        console.log("coords: ",this.state.coords )
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
                    lName, this.state.coords).send({ from: account });
                flag = false;
                console.log(setResult);
            } else {
                i++;
            }
        }
    }

    render() {
        return (
            <div className="container" onSubmit={this.handleSubmit}>
                <form className="white">
                    <div className="input-field">
                        <label htmlFor="hash">Hash Value</label>
                        <input type="text" id='hash' onChange={this.handleChange} />
                    </div>
                    <div className="input-field">
                        <label htmlFor="address">Ethereum Account Address</label>
                        <input type="text" id='address' onChange={this.handleChange} />
                    </div>
                    <button className="waves-effect waves-light btn">Add</button>
                </form>
                {this.state.data.map((owner, index) => (
                    console.log("Datai: ", this.state.data),
                    <p className="white-text" key={index}>{owner.coords}</p>
                ))}
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

export default connect(mapStateToProps, null)(Database);