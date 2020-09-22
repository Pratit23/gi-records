import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { db } from '../../config/fbConfig'
import { Collapsible, CollapsibleItem, Icon, Modal, Button, Toast } from 'react-materialize'
import M from 'materialize-css';
import moment from 'moment'
import Sidenav from '../layout/Sidenav'
import { simpleStorageAbi } from '../../abis/abis';
import Web3 from 'web3';
import globalVal from '../../BlockchainAdd'

var localData = localStorage.getItem('userDetails')
localData = JSON.parse(localData)

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}


class Notifications extends Component {


    displayRazorPay = async (amount, details) => {

        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js')

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?')
            return
        }

        console.log("Amount in notif: ", amount)

        const data = await fetch('http://localhost:2000/razorpay/?amount=' + amount, { method: 'POST' }).then((t) =>
            t.json()
        )

        console.log("This is the response: ", data)

        const options = {
            key: "rzp_test_drE1kuhaA651IE", // Enter the Key ID generated from the Dashboard
            amount: data.amount.toString(), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: data.currency,
            name: "Land",
            description: "Thank you for purchasing me Land!",
            image: "https://picsum.photos/200/300",
            order_id: data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            handler: async function (response) {
                //GOTTA PUT THE BLOCKCHAIN CODE IN HERE
                console.log("PUT THE BLOCKCHAIN CODE IN HERE")
                // alert(response.razorpay_payment_id);
                // alert(response.razorpay_order_id);
                // alert(response.razorpay_signature)

                const web3 = new Web3(Web3.givenProvider);
                const contractAddr = globalVal.address
                const SimpleContract = new web3.eth.Contract(simpleStorageAbi, contractAddr);
                const accounts = await window.ethereum.enable();
                const account = accounts[0];

                var j = 0;

                var tempId = details.buyerEthID;
                var newId = details.buyerEthID;

                var tempNewID = details.sellerEthID;
                var newNewID = details.sellerEthID;
                //console.log(newId)
                var flag = true
                while (flag == true) {
                    //console.log("get if is running")
                    newId = tempId + j;
                    var result = await SimpleContract.methods.getLats(newId).call();
                    if (result.length == 0) {
                        flag = false;
                    }
                    else {
                        j++;
                    }
                }

                var i = 0
                var flag1 = true

                while (flag1 == true) {
                    //console.log("get if is running")
                    newNewID = tempNewID + i;
                    var result1 = await SimpleContract.methods.getLats(newNewID).call();
                    if (result1.length == 0) {
                        flag1 = false;
                    }
                    else {
                        i++;
                    }
                }

                i = i - 1

                var sellerLastFull = tempNewID + i;

                var setResult = await SimpleContract.methods.transaction(newId, details.landID, details.buyerEthID,
                    details.authorFirstName, details.authorLastName, sellerLastFull).send({ from: account });

                if (setResult) {
                    console.log("Land sold")
                } else {
                    console.log("Something went wrong with selling")
                }
                await db.collection('transactions').add({
                    ...details,
                    ...data
                }).then(() => {
                    console.log("Transaction stored to firestore")
                }).catch(function (error) {
                    console.error("Error adding transaction to firestore: ", error);
                });

                await db.collection('sellLand')
                    .doc(details.landID)
                    .delete()
                    .then(() => {
                        console.log("Listing removed from sell land")
                    }).catch(function (error) {
                        console.error("Error removing listing from sellLand: ", error);
                    });

                await db.collection('quotes')
                    .doc(details.landID + localData.ethereumAdd)
                    .delete()
                    .then(() => {
                        console.log("Quote removed from quote")
                    }).catch(function (error) {
                        console.error("Error removing quote from quotes: ", error);
                    });
            },
            prefill: {
                name: localData.firstName + " " + localData.lastName,
                email: this.props.auth.email,
                contact: "9999999999"
            },
            notes: {
                address: "Razorpay Corporate Office"
            },
            theme: {
                color: "#1e88e5"
            }
        };
        const paymentObject = new window.Razorpay(options)
        paymentObject.open()
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
                                        typeof (accepted) !== "undefined" && accepted.length !== 0 ? accepted.map((notif, key) => {
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
                                                                header="Your offer is accepted!"
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
                                                            ><div className="row">
                                                                    <div className="col s6">
                                                                        Seller Details:<br /><div className="divider"></div>
                                                            First Name: {notif.sellerFName}<br />
                                                            Last Name: {notif.sellerLName}<br /><br />
                                                            Buyer Details:<br />
                                                                        <div className="divider"></div>
                                                            First Name: {notif.authorFirstName}<br />
                                                            Last Name: {notif.authorLastName}<br /><br />
                                                                    </div>
                                                                    <div className="col s6">
                                                                        Total Price:
                                                                        <div className="divider"></div>
                                                                        ₹{notif.quotedPrice}<br />
                                                                        + tax calculated after the payment is complete
                                                                    </div>
                                                                </div><br /><a onClick={() => this.displayRazorPay(notif.quotedPrice, notif)} className="btn red white-text">Accept</a></Modal>
                                                            <a className="btn blue white-text" onClick={() => this.handleDismiss(notif.landID, notif.buyerEthID)}>Decline</a>
                                                        </div>
                                                    </div>
                                                </CollapsibleItem>
                                            )
                                        }) : <p className="grey-text emptyText">No acceptances yet</p>
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
                                        typeof (notifications) !== "undefined" && notifications.length !== 0 ? notifications.map((notif, key) => {
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
                                        }) : <p className="grey-text emptyText">No incoming quotations</p>
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
        { collection: 'quotes', orderBy: ['createdAt', 'desc'], where: [['sellerEthID', '==', localData.ethereumAdd]], storeAs: 'notif' },
        { collection: 'quotes', orderBy: ['createdAt', 'desc'], where: [['buyerEthID', '==', localData.ethereumAdd], ['accepted', '==', 1]], storeAs: 'accept' },
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