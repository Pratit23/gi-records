import React, { Component } from 'react'
import { connect } from 'react-redux'
import MapContainer from '../layout/Map2'

class SellDetail extends Component {

    constructor(props) {
        super(props)
        const { property, auth } = props;
        var key = props.location.pathname
        key = key.slice(-1)
        var i = parseInt(key)
        var newProperty = property[i]
        console.log("Sell Detail Property: ", newProperty)
        this.state = {
            property: newProperty,
        }
        console.log("After state: ", this.state.property)
    }


    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col s12">
                        <div className="card blue-grey darken-1 detailInfoCard">
                            <div className="card-content white-text">
                                <span className="card-title">PLOT NO - {this.state.property.plotNo}</span>
                                <p>Owner - {this.state.property.authorFirstName} {this.state.property.authorLastName}<br />Address -<br />
                                    {this.state.property.locality}, {this.state.property.city},<br />{this.state.property.state}<br />Purchase Rate - {this.state.property.rate}/sq.ft
                            <br />Purchase Price - ₹{this.state.property.price}</p>
                            <button className="waves-effect waves-light btn black">Quote a Price</button>
                            </div>
                            <MapContainer temp={this.state.property.coords} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log("Sell detail state: ", state.coordinates.sellDetail)
    return {
        property: state.coordinates.sellDetail,
    }
}

export default connect(mapStateToProps, null)(SellDetail)
