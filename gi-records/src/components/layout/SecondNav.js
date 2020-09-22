import React, { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Dropdown, Button } from 'react-materialize';
import M from "materialize-css";

const SecondNav = () => {

    return (
        <div>
            <div className="nav-wrapper grey darken-4">
                <ul id="nav-mobile" style={{ width: 'auto' }} className="left hide-on-med-and-down grey darken-4">
                    <li><NavLink to='/'>Dashboard</NavLink></li>
                    <li><NavLink to='/chartboard'>Chartboard</NavLink></li>
                    <li><NavLink to='/ViewAllLand'>Your Lands</NavLink></li>
                    <li><NavLink to='/Database'>Add Land</NavLink></li>
                    <Dropdown
                        id="Dropdown_6"
                        options={{
                            alignment: 'left',
                            autoTrigger: true,
                            closeOnClick: true,
                            constrainWidth: true,
                            container: null,
                            coverTrigger: true,
                            hover: false,
                            inDuration: 150,
                            onCloseEnd: null,
                            onCloseStart: null,
                            onOpenEnd: null,
                            onOpenStart: null,
                            outDuration: 25,
                        }}
                        trigger={<Button className="red darken-1" node="button">Land Transact</Button>}
                    >
                    <ul>
                    <li className="tab col s3"><NavLink className="black-text" to='/SellLand'>Sell Land</NavLink></li>
                    <li className="tab col s3"><NavLink className="black-text" to='/BuyLand'>Buy Land</NavLink></li>
                    <li className="tab col s3"><NavLink className="black-text" to='/transactions'>Transactions</NavLink></li></ul></Dropdown>
                </ul>
            </div>
        </div>
    )
}

export default SecondNav


