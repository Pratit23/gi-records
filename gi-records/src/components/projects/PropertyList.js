import React, { useState } from 'react';
import PropertySummary from './PropertySummary'
import { Link } from 'react-router-dom'
import { array } from 'prop-types';

const PropertyList = ({ property }) => {
    var tempArray = []
    console.log("Property List: ", property)
    var arrayOfKeys = Object.keys(property);
    console.log("Array of keys: ", arrayOfKeys)
    for(var i = 0; i < arrayOfKeys.length; i++)
    {
        tempArray.push(property[arrayOfKeys[i]])
    }
    return (
        <div className="project-list section">
            {
                tempArray.length == 0 ? <p>No lands available in this area</p>: tempArray && tempArray.map((property,key) => {
                    return (
                        <Link key={key} to={'/sellDetail/' + arrayOfKeys[key]}>
                            <PropertySummary key={key} property={property.data} />
                        </Link>
                    )
                })
            }
            
        </div>
    )
}

export default PropertyList