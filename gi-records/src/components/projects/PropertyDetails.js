import React, { Component } from 'react'
import { connect } from 'react-redux'
import MapContainer from '../layout/Map2'
import { sellProperty } from '../../store/actions/propertyActions'
import { withFirebase } from 'react-redux-firebase'
import { Modal, Button } from 'react-materialize';
import { Redirect } from 'react-router-dom';

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
            coords: newProperty.coordsArray[key],
            sellState: false,
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
    

    // componentWillReceiveProps(newProps) {
    //     if (newProps.property != this.props.property) {
    //         this.setState({
    //             load: true
    //         })
    //     } else {
    //         return false
    //     }
    // }


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
                                <Modal
                                    actions={[
                                        <Button className="black" flat modal="close" node="button" waves="black">Close</Button>
                                    ]}
                                    bottomSheet={false}
                                    fixedFooter
                                    header="Modal Header"
                                    id="Modal-0"
                                    open={false}
                                    options={{
                                        dismissible: true,
                                        endingTop: '10%',
                                        inDuration: 250,
                                        onCloseEnd: null,
                                        onCloseStart: null,
                                        onOpenEnd: null,
                                        onOpenStart: null,
                                        opacity: 0.5,
                                        outDuration: 250,
                                        preventScrolling: true,
                                        startingTop: '4%'
                                    }}
                                    trigger={<Button node="button">Sell Property</Button>}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</Modal>
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
    console.log("Property details mapState: ", state.coordinates.property)
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

