import React from 'react';
import PropertySummary from './PropertySummary'
import { Link } from 'react-router-dom'

const PropertyList = ({ property }) => {
    console.log("Property List: ", property)
    return (
        <div className="project-list section">
        {property && property.map(property => {
            console.log("mapping is running")
            return (
                <PropertySummary key={property.landID} property={property} />
            )
        })}
        </div>
    )
}

export default PropertyList