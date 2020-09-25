import React from 'react'
import Sidenav from '../layout/Sidenav'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Collapsible, CollapsibleItem, Icon, Modal, Button, Toast } from 'react-materialize'

var data = localStorage.getItem('userDetails')
data = JSON.parse(data)

const AllTransactions = (props) => {
    console.log("Props in AllTransactions: ", props)
    return (
        <div className="row">
            <div className="col s2 mainSideNav">
                <Sidenav />
            </div>
            <div className="col s10">
                <h1>All Transactions</h1>
                <div className="section dashSec2">
                    <div className="allTransacCollap">
                        <Collapsible accordion popout>
                            {
                                typeof (props.all) !== "undefined" && (props.all).length !== 0 ?
                                    (props.all).map((transaction, key) => {
                                        return (
                                            <CollapsibleItem
                                                key={key}
                                                expanded={false}
                                                header={(transaction.id).toUpperCase()}
                                                icon={<Icon>filter_drama</Icon>}
                                                node="div"
                                            >
                                                <p className="black-text allTransactText">Seller Details:<br />{transaction.sellerFName} {transaction.sellerLName}<br /></p>
                                                <div className="divider"></div>
                                                <p className="allTransactText">Land Details:<br />{transaction.plotNo},<br />{transaction.locality}, {transaction.city}<br />{transaction.state}<br /></p>
                                                <div className="divider"></div>
                                                <p className="allTransactText">Transaction Details:<br/>Total Amount: ₹{transaction.quotedPrice}</p>
                                            </CollapsibleItem>


                                        )
                                    })
                                    : <p className="grey-text">No previous transaction</p>
                            }
                        </Collapsible>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile, //adding profile which is on the state to the props
        all: state.firestore.ordered.allTransactions
    }
}

export default compose(
    connect(mapStateToProps, null),
    firestoreConnect((props) => [
        { collection: 'transactions', orderBy: ['createdAt', 'desc'], where: ['buyerEthID', '==', data.ethereumAdd], storeAs: 'allTransactions' },
    ])
)(AllTransactions)
