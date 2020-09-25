import React, { Component } from 'react';
import Web3 from 'web3';
import { simpleStorageAbi } from '../../abis/abis';
import { connect } from 'react-redux'
import MapContainer from '../layout/Map'
import { Redirect } from 'react-router-dom';
import Sidenav from '../layout/Sidenav'
import { db } from '../../config/fbConfig'
import M from 'materialize-css'
import globalVal from '../../BlockchainAdd'

var tempData = []
const month = new Date().getMonth()
const year = new Date().getFullYear()


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
            marketRate: '',
            govRate: '',
            buyingRate: '',
            landSize: '',
            hash: '',
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
            [e.target.id]: e.target.value,
            address: this.props.profile.ethereumAdd,
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const web3 = new Web3(Web3.givenProvider);
        const contractAddr = globalVal.address
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
                marketRate: owner.marketRate,
                govRate: owner.govRate,
                buyingRate: owner.buyingRate,
                landSize: owner.landSize,
                hash: owner.hash,
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
                    lName, this.state.coords, this.state.state, this.state.city, this.state.locality
                    , this.state.plotNo, this.state.buyingRate, this.state.landSize, this.state.hash, this.state.price).send({ from: account });
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

                this.setState({
                    coordsArray: array,
                })
            }
        }


        // var state = 'Maharashtra'
        // var city = 'Kudal'
        // var locality = 'Kudal MIDC'
        // var rate = '102'
        // var mon = '2020-08-09'


        // await fetch('http://localhost:2000/setPrice/?state=' + state + '&city=' + city + '&locality=' + locality + '&rate=' + rate + '&mon=' + mon, {
        //     method: 'GET'
        // }).then(res => res.json())
        //     .then(response => {
        //         console.log(response)
        //         self.setState({ data: response, added: true });
        //     }).catch(err => {
        //         console.log('caught it!', err);
        //     })

        //check if locality exists
        // if yes there is already a land
        // 

        const docID = this.state.city + this.state.locality + this.state.state

        await db.collection("rates").doc(docID)
            .get()
            .then(async snapshot => {
                console.log("this is running")
                tempData = snapshot.data()
                if (!tempData) {
                    var dates = [new Date()]
                    var marketRate = [this.state.marketRate]
                    var govRate = [this.state.govRate]
                    await db.collection('rates').doc(docID).set({
                        state: this.state.state,
                        city: this.state.city,
                        locality: this.state.locality,
                        marketRate: marketRate,
                        govRate: govRate,
                        dates: dates,
                        landSize: this.state.landSize,
                    })
                } 
            }).catch(error => console.log(error))

        //     console.log("BRUUUU data: ", tempData)

        // if(!tempData) {
        //     await db.collection("rates").doc(docID).set({
        //         state: this.state.state,
        //         city: this.state.city,
        //         locality: this.state.locality,
        //         marketRate: this.state.marketRate,
        //         govRate: this.state.govRate,
        //         buyingRate: this.state.buyingRate,
        //         month: month,
        //         year: year,
        //         createdAt: new Date(),
        //     })
        //     .then(function () {
        //         M.toast({ html: 'Land Added' })
        //     }).catch(function (error) {
        //         console.error("Error: ", error);
        //     });
        // } else {
        //     if(parseInt(this.state.marketRate) > parseInt(tempData.marketRate) || parseInt(this.state.govRate) > parseInt(tempData.govRate) || parseInt(this.state.buyingRate) > parseInt(tempData.buyingRate) || !tempData) {
        //         await db.collection("rates").doc(docID).set({
        //             state: this.state.state,
        //             city: this.state.city,
        //             locality: this.state.locality,
        //             marketRate: this.state.marketRate,
        //             govRate: this.state.govRate,
        //             buyingRate: this.state.buyingRate,
        //             month: month,
        //             year: year,
        //             createdAt: new Date(),
        //         })
        //         .then(function () {
        //             M.toast({ html: 'Land Added' })
        //         }).catch(function (error) {
        //             console.error("Error: ", error);
        //         });
        //     }
        // }

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
                <div className="col s2 mainSideNav">
                    <Sidenav />
                </div>
                <div className="col s10">
                    <div className="row">
                        <div style={{ padding: '0' }} className="col s12">
                            <div className="mapBG">
                                <MapContainer temp={this.state.coordsArray} />
                                <div className="yourLandFloatingDiv">
                                    <form className="blue-grey darken-4 addLandForm z-depth-3" onSubmit={this.handleSubmit}>
                                        <div className="input-field">
                                            <label htmlFor="hash">Hash Value</label>
                                            <input className="white-text" type="text" id='hash' onChange={this.handleChange} />
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
                        </div>
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
        points: state.coordinates.points,
        auth: state.firebase.auth,
    }
}

export default connect(mapStateToProps, null)(AddLand);