import React, { Component } from 'react'
import { simpleStorageAbi } from '../../abis/abis';
import Web3 from 'web3';
import globalVal from '../../BlockchainAdd'

export default class SellLand extends Component {

    constructor(props) {
        super(props)
        this.state = {
            buyerFName: '',
            buyerLName: '',
            buyerID: '',
            sellerID: '',
            landID: ''
        }
    }

    handleChange = (e) => {
        e.preventDefault()
        this.setState({
            [e.target.id]: [e.target.value]
        })
    }

    handleSubmit = async (e) => {
        e.preventDefault()
        const web3 = new Web3(Web3.givenProvider);
        const contractAddr = globalVal.address
        const SimpleContract = new web3.eth.Contract(simpleStorageAbi, contractAddr);
        const accounts = await window.ethereum.enable();
        const account = accounts[0];

        var j = 0;
        
        var tempId = this.state.buyerID;
        var newId = this.state.buyerID;
        
        var tempNewID = this.state.sellerID;
        var newNewID = this.state.sellerID;
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
                j++;
            }
        }

        var i = 0
        var flag1 = true

        while (flag1 == true) {
            //console.log("get if is running")
            newNewID = tempNewID + i;
            var result1 = await SimpleContract.methods.getLats(newNewID).call();
            if (result1.length == 0) {
                flag1 = false;
            }
            else {
                i++;
            }
        }

        i = i - 1

        var sellerLastFull = tempNewID + i;

        console.log("Seller Last: ", sellerLastFull)
        console.log("Seller last type: ", typeof(sellerLastFull))
        
        console.log("NewID: ", typeof(newId))
        console.log("NewID type: ", typeof(newId))
        
        console.log("SellerID: ", (this.state.sellerID))
        console.log("SellerID type: ", typeof(this.state.sellerID))
        
        console.log("Land Address: ",(this.state.landID))
        console.log("Land Address type: ", typeof(this.state.landID))
        
        console.log("buyerFName: ", (this.state.buyerFName))
        console.log("buyerFName type: ", typeof(this.state.buyerFName))
        
        console.log("buyerLName: ", (this.state.buyerLName))
        console.log("buyerLName type: ", typeof(this.state.buyerLName))



        var setResult = await SimpleContract.methods.transaction(newId, this.state.landID[0], this.state.buyerID[0],
            this.state.buyerFName[0], this.state.buyerLName[0], sellerLastFull).send({ from: account });

        if(setResult) {
            console.log("Land sold")
        } else {
            console.log("Something went wrong with selling")
        }
    }

    render() {
        return (
            <div>
                <form className="white container sellLandForm z-depth-3" onSubmit={this.handleSubmit}>
                    BUYER DETAILS
                    <div className="input-field">
                        <label htmlFor="buyerFName">Buyer First Name</label>
                        <input type="text" id='buyerFName' onChange={this.handleChange} />
                    </div>
                    <div className="input-field">
                        <label htmlFor="buyerLName">Buyer Last Name</label>
                        <input type="text" id='buyerLName' onChange={this.handleChange} />
                    </div>
                    <div className="input-field">
                        <label htmlFor="buyerID">Buyer Ethereum Address</label>
                        <input type="text" id='buyerID' onChange={this.handleChange} />
                    </div>
                    <div className="input-field">
                        <label htmlFor="sellerID">Seller Address</label>
                        <input type="text" id='sellerID' onChange={this.handleChange} />
                    </div>
                    <div className="input-field">
                        <label htmlFor="landID">Land Address</label>
                        <input type="text" id='landID' onChange={this.handleChange} />
                    </div>
                    <button className="waves-effect waves-light btn black">Sell</button>
                </form>
            </div>
        )
    }
}
