import React from 'react'
import { connect } from 'react-redux'

const PropertyDetails = (props) => {
    const { property, auth } = props;
    return (
        <div>
            <h1>{property[0].firstName}</h1>
        </div>
    )
}

const mapStateToProps = (state) => {
    console.log("Property: ", state)
    return {
      property: state.coordinates.property,
      auth: state.firebase.auth,
    }
}

export default connect(mapStateToProps, null)(PropertyDetails)

