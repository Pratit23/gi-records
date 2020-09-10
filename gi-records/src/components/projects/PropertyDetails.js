import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import MapContainer from '../layout/Map2'
import { sellProperty } from '../../store/actions/propertyActions'
import { withFirebase } from 'react-redux-firebase'
import { Modal, Button } from 'react-materialize';
import { Redirect } from 'react-router-dom';

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

    var data = localStorage.getItem('propertyDetails')
    data = JSON.parse(data)

    const handleSubmit = (e) => {
        e.preventDefault();
        props.sellProperty(stateKey, price, states, city, locality, plotNo,
            buyingRate, coords, props.firebase);
    }

    const updateData = (e) => {
        var key = props.location.pathname;
        var key = key.slice(-1)
        var i = parseInt(key)
        var newProperty = data[i]
        setStateKey(i)
        setStates(newProperty.states)
        setCity(newProperty.city)
        setLocality(newProperty.locality)
        setPlotNo(newProperty.plotNo)
        setBuyingRate(newProperty.buyingRate)
        setStateProperty(newProperty)
        setCoords(newProperty.coordsArray[i])
        setPrice(newProperty.price)
        if (coords.length != 0) {
            update.push(true)
        }
    }

    useEffect(() => {
        console.log("Property Detail props: ", props)
        updateData()
    }, update);

    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <div className="card blue-grey darken-1 detailInfoCard">
                        <div className="card-content white-text">
                            <span className="card-title">PLOT NO - {plotNo}</span>
                            <p>Owner - {stateProperty.firstName} {stateProperty.lastName}<br />Address -<br />
                                {locality}, {city},<br />{states}<br />Purchase Rate - {buyingRate}/sq.ft
                            <br />Purchase Price - ₹{price}</p>
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
                                trigger={<Button node="button">Sell Property</Button>}>
                                <form className="white addLandForm z-depth-3" onSubmit={(handleSubmit)}>
                                    <div className="input-field">
                                        <label htmlFor="price">Price</label>
                                        <input type="text" id='hash' onChange={e => setPrice(e.target.value)} />
                                    </div>
                                    <button className="waves-effect waves-light btn black">List for Selling</button>
                                </form>
                            </Modal>
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
        sellProperty: (key, price, states, city, locality, plotNo, buyingRate, coords, firebase) => dispatch(sellProperty(key, price, states, city, locality, plotNo, buyingRate, coords, firebase))
    }
}

export default withFirebase(connect(mapStateToProps, mapDispatchToProps)(PropertyDetails))

