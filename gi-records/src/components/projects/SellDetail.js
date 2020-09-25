import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import MapContainer from '../layout/Map2'
import { quotePrice } from '../../store/actions/propertyActions'
import { Modal, Button } from 'react-materialize';
import { withFirebase } from 'react-redux-firebase'
import Sidenav from '../layout/Sidenav'
import DashChart2 from '../layout/DashChart2';

const SellDetail = (props) => {

    const [property, setProperty] = useState([])
    const [update, setUpdate] = useState([])
    const [coords, setCoords] = useState([])
    const [states, setStates] = useState('')
    const [city, setCity] = useState('')
    const [locality, setLocatily] = useState('')
    const [plotNo, setPlotNo] = useState('')
    const [landID, setLandID] = useState('')
    const [qPrice, setQPrice] = useState('')
    const [showGraph, setShowGraph] = useState(false)

    // var data = localStorage.getItem('sellDetails')
    // data = JSON.parse(data)
    // console.log("Data in sell detail: ", data)

    const handleSubmit = (e) => {
        e.preventDefault();
        const i = props.match.params.id;
        var newProperty = props.property[i]
        newProperty = newProperty.data
        setStates(newProperty.state)
        setCity(newProperty.city)
        setLocatily(newProperty.locality)
        setPlotNo(newProperty.plotNo)
        setLandID(newProperty.landID)
        const firebase = props.firebase
        console.log("Firebase: ", firebase)
        console.log("New property test: ", newProperty.state)
        props.quotePrice(newProperty.sellerID, qPrice, newProperty.state, newProperty.city, newProperty.locality, newProperty.plotNo, newProperty.landID, coords, newProperty.authorFirstName, newProperty.authorLastName, firebase);
        //props.quotePrice(newProperty ,firebase);
    }

    const updateData = (e) => {
        console.log("Sell detail props: ", props)
        const i = props.match.params.id;
        var newProperty = props.property[i]
        setProperty(newProperty.data)
        setCoords(newProperty.data.coords)
        console.log("Length of coords: ", newProperty.data.coords.length)
        console.log("New property in updateData: ", newProperty)
        if (coords.length != 0) {
            update.push(true)
        }
        console.log("New property: ", newProperty)
    }

    const showTheGraph = () => {
        setShowGraph(true)
    }

    useEffect(() => {
        updateData()
    }, [update]);

    return (
        <div className="row">
            <div className="col s2 mainSideNav">
                <Sidenav />
            </div>
            <div className="col s10">
                <div className="container">
                    <div className="row">
                        <div className="col s12">
                            <div className="card blue-grey darken-4 detailInfoCard">
                                <div className="row">
                                    <div className="col s6">
                                        <div className="card-content white-text">
                                            <span className="card-title">PLOT NO - {property.plotNo}</span>
                                            <p>Owner - {property.authorFirstName} {property.authorLastName}<br />Address -<br />
                                                {property.locality}, {property.city},<br />{property.state}<br />Purchase Rate - {property.rate}/sq.ft
                                                <br />Purchase Price - ₹{property.price}</p>
                                            <Modal
                                                actions={[
                                                    <Button className="black white-text" flat modal="close" node="button">Close</Button>
                                                ]}
                                                bottomSheet={false}
                                                fixedFooter
                                                header="Quote Price"
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
                                                trigger={<Button className="black" node="button">Quote Price</Button>}>
                                                <form className="white addLandForm z-depth-3" onSubmit={(handleSubmit)}>
                                                    <div className="input-field">
                                                        <label htmlFor="price">Price</label>
                                                        <input type="text" id='hash' onChange={e => setQPrice(e.target.value)} />
                                                    </div>
                                                    <button className="waves-effect waves-light btn black">Send</button>
                                                </form>
                                            </Modal>
                                            <a onClick={() => showTheGraph()} class="blue white-text btn">Show Graph</a>
                                        </div>
                                    </div>
                                    <div className="col s6">
                                        {
                                            showGraph ?
                                                <div className="card  blue-grey darken-4 chartCard sellDetailChart">
                                                    <div className="mainCard card-content white-text">
                                                        <div className="section">
                                                            <span className="cardTitle card-title white-text">Rate</span>
                                                        </div>
                                                        <div className="cardChart section">
                                                            <DashChart2 locality={property.locality}/>
                                                        </div>
                                                    </div>
                                                </div> : null
                                        }
                                    </div>
                                </div>
                                {
                                    coords ?
                                        <MapContainer temp={coords} />
                                        : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => {
    // const id = state.ownProps.match.params.id
    console.log("State in sell detail: ", state)
    return {
        property: state.coordinates.sellDetail,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        quotePrice: (sellerID, price, states, city, locality, plotNo, landID, coords, sellerFName, sellerLName, firebase) => dispatch(quotePrice(sellerID, price, states, city, locality, plotNo, landID, coords, sellerFName, sellerLName, firebase))
    }
}

export default withFirebase(connect(mapStateToProps, mapDispatchToProps)(SellDetail))
