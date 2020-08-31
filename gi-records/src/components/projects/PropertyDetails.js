import React from 'react'
import { connect } from 'react-redux'
import MapContainer from '../layout/Map2'

const PropertyDetails = (props) => {
    const { property, auth } = props;
    var key = props.location.pathname;
    key = key.slice(-1)

    var i = parseInt(key)

    console.log("Check these lats: ", property[i].coordsArray[i])
    return (
        <div classNameName="container">
            <div className="row">
                <div className="col s12 container">
                    <div className="card blue-grey darken-1 detailInfoCard">
                        <div className="card-content white-text">
                            <span className="card-title">PLOT NO - {property[i].plotNo}</span>
                            <p>Owner - {property[i].firstName} {property[i].lastName}<br/>Address -<br/>
                            {property[i].locality}, {property[i].city},<br/>{property[i].states}</p>
                        </div>
                        <div className="card-action">
                            <a>This is a link</a>
                            <a>This is a link</a>
                        </div>
                    </div>
                </div>
                <div className="col s6">
                    <MapContainer temp={property[i].coordsArray[i]} />
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    console.log("Property: ", state.coordinates.property)
    return {
        property: state.coordinates.property,
        auth: state.firebase.auth,
    }
}

export default connect(mapStateToProps, null)(PropertyDetails)

