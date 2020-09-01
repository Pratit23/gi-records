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
        this.state = {
            key: i,
            price: 0,
            property: property
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
        this.props.sellProperty(this.state.key, this.state.price, this.props.firebase);
    }


    render() {
        return (
            <div classNameName="container">
                <div className="row container">
                    <div className="col s12">
                        <div className="card blue-grey darken-1 detailInfoCard">
                            <div className="card-content white-text">
                                <span className="card-title">PLOT NO - {this.state.property[this.state.key].plotNo}</span>
                                <p>Owner - {this.state.property[this.state.key].firstName} {this.state.property[this.state.key].lastName}<br />Address -<br />
                                    {this.state.property[this.state.key].locality}, {this.state.property[this.state.key].city},<br />{this.state.property[this.state.key].states}<br />Purchase Rate - {this.state.property[this.state.key].buyingRate}/sq.ft
                            <br />Purchase Price - ₹{this.state.property[this.state.key].price}</p>
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
                            <MapContainer temp={this.state.property[this.state.key].coordsArray[this.state.key]} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    console.log("Property: ", state.coordinates.property)
    return {
        property: state.coordinates.property,
        auth: state.firebase.auth,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        sellProperty: (key, price, firebase) => dispatch(sellProperty(key, price, firebase))
    }
}

export default withFirebase(connect(mapStateToProps, mapDispatchToProps)(PropertyDetails))

