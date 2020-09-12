import React, { Component } from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { db } from '../../config/fbConfig'
import { Collapsible, CollapsibleItem, Icon } from 'react-materialize'

var data = localStorage.getItem('userDetails')
data = JSON.parse(data)

class Notifications extends Component {
    render() {
        const { notifications } = this.props
        console.log("Notif props: ", this.props)
        return (
            <div className="container">
                <Collapsible accordion popout>
                    {
                        (notifications && notifications.map((notif, key) => {
                            return (
                                <CollapsibleItem
                                    key={key}
                                    expanded={false}
                                    header={notif.quotedPrice}
                                    icon={<Icon>filter_drama</Icon>}
                                    node="div"
                                ><div className="card blue-grey darken-1">
                                        <div className="card-content white-text">
                                            <span className="card-title">Card Title</span>
                                            <p>I am a very simple card. I am good at containing small.</p>
                                        </div>
                                        <div className="card-action">
                                            <a href="#"><i className="material-icons">check</i></a>
                                            <a href="#"><i className="material-icons">close</i></a>
                                        </div>
                                    </div>
                                </CollapsibleItem>
                            )
                        }))
                    }
                </Collapsible>
            </div>

        )
    }
}


const mapStateToProps = (state) => {
    console.log("State: ", state)
    return {
        auth: state.firebase.auth,
        notifications: state.firestore.ordered.notif
    }
}

export default compose(
    connect(mapStateToProps, null),
    firestoreConnect((props) => [
        { collection: 'quotes', orderBy: ['createdAt', 'desc'], where: [['sellerEthID', '==', data.ethereumAdd]], storeAs: 'notif' },
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