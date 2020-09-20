import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { db } from '../../config/fbConfig'
import { Collapsible, CollapsibleItem, Icon, Modal, Button, Toast } from 'react-materialize'
import M from 'materialize-css';
import moment from 'moment'
import Sidenav from '../layout/Sidenav'
import GPay from '../../store/payment/GPay'

var data = localStorage.getItem('userDetails')
data = JSON.parse(data)


class Notifications extends Component {

    handleTransact = () => {
        console.log("Handle Transact is running")
        return (
            <GPay/>
        )
    }

    handleDismiss = (landID, buyerEthID) => {
        const docID = landID + buyerEthID
        console.log("This is running")
        db.collection("quotes").doc(docID).delete().then(function () {
            console.log("Document successfully deleted!");
            M.toast({ html: 'Offer declined' })
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });
    }

    handleAccept = (landID, buyerEthID) => {
        const docID = landID + buyerEthID
        db.collection("quotes").doc(docID).update({
            accepted: 1
        }).then(function () {
            console.log("Accepted successful")
        }).catch(function (error) {
            console.error("Error accepting: ", error);
        });
    }

    startTransaction = (sellerEthID) => {
        console.log("This is running, check this")
        db.collection("users").get()
            .where([['ethereumAdd', '==', sellerEthID]])
            .then(snapshot => {
                snapshot.forEach(doc => {
                    const data = doc.data()
                    this.setState({
                        sellerFName: data.firstName,
                        sellerLName: data.lastName
                    })
                })
            }).catch(function (error) {
                console.error("Error accepting: ", error);
            });
    }

    render() {
        const { notifications, accepted } = this.props
        console.log("Notif props: ", this.props)
        return (
            <div className="row">
                <div className="col s2 mainSideNav">
                    <Sidenav />
                </div>
                <div className="col s10">
                    <div className="row">
                        <div className="col s6 acceptSec">
                            <div className="section">
                                <h4 className="black-text center-align">Accepted Offers</h4>
                            </div>
                            <div className="section collapWrapper">
                                <Collapsible accordion popout>
                                    {
                                        (accepted && accepted.map((notif, key) => {
                                            console.log("Notif: ", notif)
                                            return (
                                                <CollapsibleItem
                                                    key={key}
                                                    expanded={false}
                                                    header={<div><span>{notif.authorFirstName}</span><span> </span><span>{notif.authorLastName}</span><br /><span></span>₹<span>{notif.quotedPrice}</span><br /><span className="blue-text">{moment(notif.createdAt.toDate()).calendar()}</span></div>}
                                                    icon={<i className="material-icons green-text">check_circle</i>}
                                                    node="div"
                                                ><div className="card blue-grey darken-1 notifCard">
                                                        <div className="card-content white-text">
                                                            <span className="card-title">Offer Accepted</span>
                                                            <span className="white-text">Accepted: {notif.accepted}</span>
                                                        </div>
                                                        <div className="card-action">
                                                            <Modal
                                                                actions={[
                                                                    <Button flat modal="close" node="button" waves="green">Close</Button>
                                                                ]}
                                                                bottomSheet={false}
                                                                fixedFooter={false}
                                                                header="Modal Header"
                                                                id="Modal-0"
                                                                open={false}
                                                                options={{
                                                                    dismissible: true,
                                                                    endingTop: '10%',
                                                                    inDuration: 250,
                                                                    onCloseEnd: null,
                                                                    onCloseStart: null,
                                                                    onOpenEnd: null,
                                                                    onOpenStart: null,
                                                                    opacity: 0.5,
                                                                    outDuration: 250,
                                                                    preventScrolling: true,
                                                                    startingTop: '4%'
                                                                }}
                                                                trigger={<Button className="btn red white-text">Transact</Button>}
                                                            ><div>
                                                                    <p>Seller Details:<br />
                                                First Name: {notif.sellerFName}<br />
                                                Last Name: {notif.sellerLName}<br /><br />
                                                Buyer Details:<br />
                                                First Name: {notif.authorFirstName}<br />
                                                Last Name: {notif.authorLastName}<br /><br />
                                                                    </p>
                                                                </div><br /><a onClick={() => this.handleTransact()} className="btn red white-text">Accept</a></Modal>
                                                            <a className="btn blue white-text" onClick={() => this.handleDismiss(notif.landID, notif.buyerEthID)}>Decline</a>
                                                        </div>
                                                    </div>
                                                </CollapsibleItem>
                                            )
                                        }))
                                    }
                                </Collapsible>
                            </div>
                        </div>
                        <div className="col s6">
                            <div className="section">
                                <h4 className="black-text center-align">Quotations</h4>
                            </div>
                            <div className="section collapWrapper">
                                <Collapsible accordion popout>
                                    {
                                        notifications ? notifications.map((notif, key) => {
                                            console.log("Notif: ", notif)
                                            return (
                                                <CollapsibleItem
                                                    key={key}
                                                    expanded={false}
                                                    header={<div><span>{notif.authorFirstName}</span><span> </span><span>{notif.authorLastName}</span><br /><span></span>₹<span>{notif.quotedPrice}</span><br /><span className="blue-text">{moment(notif.createdAt.toDate()).calendar()}</span></div>}
                                                    icon={<i className="material-icons red-text">call_received</i>}
                                                    node="div"
                                                ><div className="card blue-grey darken-1 notifCard">
                                                        <div className="card-content white-text">
                                                            <span className="card-title">Buy Offer</span>
                                                            <span className="white-text">{notif.plotNo}</span>
                                                        </div>
                                                        <div className="card-action">
                                                            <Modal
                                                                actions={[
                                                                    <Button flat modal="close" node="button" waves="green">Close</Button>
                                                                ]}
                                                                bottomSheet={false}
                                                                fixedFooter={false}
                                                                header="Modal Header"
                                                                id="Modal-0"
                                                                open={false}
                                                                options={{
                                                                    dismissible: true,
                                                                    endingTop: '10%',
                                                                    inDuration: 250,
                                                                    onCloseEnd: null,
                                                                    onCloseStart: null,
                                                                    onOpenEnd: null,
                                                                    onOpenStart: null,
                                                                    opacity: 0.5,
                                                                    outDuration: 250,
                                                                    preventScrolling: true,
                                                                    startingTop: '4%'
                                                                }}
                                                                trigger={<a><i className="material-icons">check</i></a>}
                                                            >{
                                                                    notif.accepted === 1 ? <p className="red-text">Already Accepted</p> : <a onClick={() => this.handleAccept(notif.landID, notif.buyerEthID)} className="btn red white-text">Accept</a>
                                                                }</Modal>
                                                            {
                                                                notif.accepted === 1 ? <p className="red-text">Already Accepted</p> : <a className="btn blue white-text" onClick={() => this.handleDismiss(notif.landID, notif.buyerEthID)}>Decline</a>
                                                            }
                                                        </div>
                                                    </div>
                                                </CollapsibleItem>
                                            )
                                        }) : <h6>Issa empty fam</h6>
                                    }
                                </Collapsible>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    console.log("State: ", state)
    return {
        auth: state.firebase.auth,
        notifications: state.firestore.ordered.notif,
        accepted: state.firestore.ordered.accept
    }
}

export default compose(
    connect(mapStateToProps, null),
    firestoreConnect((props) => [
        { collection: 'quotes', orderBy: ['createdAt', 'desc'], where: [['sellerEthID', '==', data.ethereumAdd]], storeAs: 'notif' },
        { collection: 'quotes', orderBy: ['createdAt', 'desc'], where: [['buyerEthID', '==', data.ethereumAdd], ['accepted', '==', 1]], storeAs: 'accept' },
    ])
)(Notifications)


// var objectKeys = []
// var tempArray = []

// const Notifications = (props) => {
//     console.log("Notification props: ", props)

//     const[profile, setProfile] = useState([])
//     const[notif, setNotif] = useState([])

//     useEffect(() => {
//         db.collection('quotes')
//         .where("sellerEthID", "==", data.ethereumAdd)
//         .get()
//         .then(snapshot => {
//             snapshot.forEach(doc => {
//                 const data = doc.data()
//                 console.log("DOC ID", doc.id)
//                 tempArray[doc.id] = {data}
//             })
//             objectKeys = Object.keys(tempArray)
//             console.log("Snapshot thingy: ", tempArray)
//         })
//         .catch(error => console.log(error))
//     }, [tempArray])

//     return (

//     )
// }

// const mapStateToProps = (state) => {
//     return {
//       auth: state.firebase.auth,
//       profile: state.firebase.profile
//     }
//   }

// export default connect(mapStateToProps, null)(Notifications)