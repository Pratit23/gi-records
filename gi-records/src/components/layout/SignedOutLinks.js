import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const SignedOutLinks = () => {
    return (
        <div>
            <NavLink to='/SignUp'>Signup</NavLink>
            {/*<NavLink to='/signin'>Login</NavLink>*/}
        </div>

    )
}

export default SignedOutLinks