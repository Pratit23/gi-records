import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const SecondNav = () => {
    return (
        <div className="nav-extended">
            <div className="nav-wrapper grey darken-4">
                <ul id="nav-mobile" className="left hide-on-med-and-down">
                    <li><NavLink to='/'>Dashboard</NavLink></li>
                    <li><NavLink to='/chartboard'>Chartboard</NavLink></li>
                    <li><NavLink to='/AddLand'>Add Land</NavLink></li>
                    <li><NavLink to='/Database'>Database</NavLink></li>
                </ul>
            </div>
        </div>
    )
}



export default SecondNav


