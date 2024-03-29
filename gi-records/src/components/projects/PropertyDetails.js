import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import MapContainer from '../layout/Map2'
import { sellProperty } from '../../store/actions/propertyActions'
import { withFirebase } from 'react-redux-firebase'
import { Modal, Button } from 'react-materialize';
import { Redirect } from 'react-router-dom';
import Sidenav from '../layout/Sidenav'
import DashChart2 from '../layout/DashChart2';
import M from 'materialize-css'
import Web3 from 'web3';
import { simpleStorageAbi } from '../../abis/abis';
import globalVal from '../../BlockchainAdd'

var localData = localStorage.getItem('userDetails')
localData = JSON.parse(localData)

const PropertyDetails = (props) => {

    const [stateKey, setStateKey] = useState(0)
    const [price, setPrice] = useState(0)
    const [states, setStates] = useState('')
    const [city, setCity] = useState('')
    const [locality, setLocality] = useState('')
    const [plotNo, setPlotNo] = useState('')
    const [buyingRate, setBuyingRate] = useState('')
    const [stateProperty, setStateProperty] = useState([])
    const [coords, setCoords] = useState([])
    const [update, setUpdate] = useState([])
    const [showGraph, setShowGraph] = useState(false)
    const [landSize, setLandSize] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();

        // const web3 = new Web3(Web3.givenProvider);
        // const contractAddr = globalVal.address
        // const SimpleContract = new web3.eth.Contract(simpleStorageAbi, contractAddr);

        // var j = 0
        // var flag = false
        // var selfID = localData.ethereumAdd

        // while(flag === false) {
        //     var result = await SimpleContract.methods.getLats(newId).call();
        // 
        
        console.log("State key: ", stateKey)

        props.sellProperty(stateKey, price, states, city, locality, plotNo,
            buyingRate, coords, landSize, props.firebase);
        M.toast({ html: 'Listed successfully!' })
    }

    const updateData = (e) => {
        console.log("Property detail props: ", props)
        const i = props.match.params.id;
        var newProperty = props.property[i]
        console.log("New property: ", newProperty)
        setStates(newProperty.states)
        setCity(newProperty.city)
        setLocality(newProperty.locality)
        setPlotNo(newProperty.plotNo)
        setBuyingRate(newProperty.buyingRate)
        setStateProperty(newProperty)
        setCoords(newProperty.coordsArray)
        setPrice(newProperty.price)
        setLandSize(newProperty.landSize)
        setStateKey(newProperty.landID)

        if (coords.length != 0) {
            update.push(true)
        }
    }

    const showTheGraph = () => {
        setShowGraph(true)
    }

    useEffect(() => {
        console.log("Property Detail props: ", props)
        updateData()
    }, update);

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
                                            <span className="card-title">PLOT NO - {plotNo}</span>
                                            <p>Owner - {stateProperty.firstName} {stateProperty.lastName}<br />Address -<br />
                                                {locality}, {city},<br />{states}<br />Purchase Rate - {buyingRate}/sq.ft
                                    <br />Purchase Price - ₹{stateProperty.landSize * stateProperty.buyingRate}</p>
                                            <Modal
                                                actions={[
                                                    <Button className="black white-text" flat modal="close" node="button">Close</Button>
                                                ]}
                                                bottomSheet={false}
                                                fixedFooter
                                                header="LIST PROPERTY"
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
                                                trigger={<Button className="black white-text" node="button">List Property</Button>}>
                                                <form className="white addLandForm z-depth-3" onSubmit={(handleSubmit)}>
                                                    <div className="input-field">
                                                        <label htmlFor="price">Price</label>
                                                        <input type="text" id='hash' onChange={e => setPrice(e.target.value)} />
                                                    </div>
                                                    <button className="waves-effect waves-light btn black">List for Selling</button>
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
                                                            <span className="cardTitle card-title white-text">Rate/sq.m</span>
                                                        </div>
                                                        <div className="cardChart section">
                                                            <DashChart2 city={stateProperty.city} state={stateProperty.states} locality={stateProperty.locality} landSize={stateProperty.landSize} />
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
    console.log("Property details mapState: ", state.coordinates.property)
    return {
        property: state.coordinates.property,
        auth: state.firebase.auth,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        sellProperty: (key, price, states, city, locality, plotNo, buyingRate, coords, landSize, firebase) => dispatch(sellProperty(key, price, states, city, locality, plotNo, buyingRate, coords, landSize, firebase))
    }
}

export default withFirebase(connect(mapStateToProps, mapDispatchToProps)(PropertyDetails))

