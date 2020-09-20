import React from 'react'
import moment from 'moment'

const PropertySummary = ({ property }) => {
    console.log("Project Summary: ", property)
    return (
        <div className="card z-depth-0 propertySummary">
            <div className="card-content grey-text text-darken-3">
                <span className="card-title ">{property.city}</span>
                <p>Listed by {property.authorFirstName} {property.authorLastName}</p>
                <p className="grey-text">{moment(property.createdAt.toDate()).calendar()}</p>
            </div>
        </div>
    )
}

export default PropertySummary