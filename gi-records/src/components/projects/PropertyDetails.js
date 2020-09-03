import React, { Component } from 'react'
import { connect } from 'react-redux'
import MapContainer from '../layout/Map2'
import { sellProperty } from '../../store/actions/propertyActions'
import { withFirebase } from 'react-redux-firebase'

class PropertyDetails extends Component {

    constructor(props) {
        super(props)
        const { property, auth } = props;
        var key = props.location.pathname;
        key = key.slice(-1)
        var i = parseInt(key)
        var newProperty = property[key]
        console.log("New Property: ", newProperty)
        this.state = {
            key: i,
            price: 0,
            states: newProperty.states,
            city: newProperty.city,
            locality: newProperty.locality,
            plotNo: newProperty.plotNo,
            buyingRate: newProperty.buyingRate,
            property: newProperty,
            coords: newProperty.coordsArray[key]
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        console.log("Firebase: ", this.props.firebase)
        this.props.sellProperty(this.state.key, this.state.price, this.state.states, this.state.city, this.state.locality, this.state.plotNo,
            this.state.buyingRate, this.state.coords, this.props.firebase);
    }


    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12">
                        <div className="card blue-grey darken-1 detailInfoCard">
                            <div className="card-content white-text">
                                <span className="card-title">PLOT NO - {this.state.property.plotNo}</span>
                                <p>Owner - {this.state.property.firstName} {this.state.property.lastName}<br />Address -<br />
                                    {this.state.property.locality}, {this.state.property.city},<br />{this.state.property.states}<br />Purchase Rate - {this.state.property.buyingRate}/sq.ft
                            <br />Purchase Price - ₹{this.state.property.price}</p>
                            </div>
                            <div className="card-action detailInfoCard">
                                <form className="white addLandForm z-depth-3" onSubmit={this.handleSubmit}>
                                    <div className="input-field">
                                        <label htmlFor="price">Price</label>
                                        <input type="text" id='price' onChange={this.handleChange} />
                                    </div>
                                    <button className="waves-effect waves-light btn black">List for Selling</button>
                                </form>
                            </div>
                            <MapContainer temp={this.state.property.coordsArray[this.state.key]} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        property: state.coordinates.property,
        auth: state.firebase.auth,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        sellProperty: (key, price, states, city, locality, plotNo, buyingRate, coords, firebase) => dispatch(sellProperty(key, price, states, city, locality, plotNo, buyingRate, coords, firebase))
    }
}

export default withFirebase(connect(mapStateToProps, mapDispatchToProps)(PropertyDetails))

