import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const SecondNav = () => {
    return (
        <div className="nav-extended">
            <div className="nav-wrapper grey darken-4">
                <ul id="nav-mobile" className="left hide-on-med-and-down tabs grey darken-4">
                    <li className="tab col s3"><NavLink to='/'>Dashboard</NavLink></li>
                    <li className="tab col s3"><NavLink to='/chartboard'>Chartboard</NavLink></li>
                    <li className="tab col s3"><NavLink to='/ViewAllLand'>Your Lands</NavLink></li>
                    <li className="tab col s3"><NavLink to='/Database'>Add Land</NavLink></li>
                    <li className="tab col s3"><NavLink to='/SellLand'>Sell Land</NavLink></li>
                </ul>
            </div>
        </div>
    )
}

export default SecondNav


