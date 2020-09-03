import React, { useState } from 'react';
import PropertySummary from './PropertySummary'
import { Link } from 'react-router-dom'

const PropertyList = ({ property }) => {

    console.log("Property List: ", property)
    return (
        <div className="project-list section">
            {property && property.map(property => {
                console.log("mapping is running")
                return (
                    <Link to={'/sellDetail/' + property.landID} key={property.landID}>
                        <PropertySummary key={property.landID} property={property} />
                    </Link>
                )
            })}
        </div>
    )
}

export default PropertyList