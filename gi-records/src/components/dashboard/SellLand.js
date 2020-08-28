import React, { Component } from 'react'

export default class SellLand extends Component {
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
                    <button className="waves-effect waves-light btn black">Sell</button>
                </form>
            </div>
        )
    }
}
