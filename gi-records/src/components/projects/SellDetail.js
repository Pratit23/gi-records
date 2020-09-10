import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import MapContainer from '../layout/Map2'
import { quotePrice } from '../../store/actions/propertyActions'
import { Modal, Button } from 'react-materialize';
import { withFirebase } from 'react-redux-firebase'

const SellDetail = (props) => {

    const [property, setProperty] = useState([])
    const [update, setUpdate] = useState([])
    const [coords, setCoords] = useState([])
    const [qPrice, setQPrice] = useState([])

    // var data = localStorage.getItem('sellDetails')
    // data = JSON.parse(data)
    // console.log("Data in sell detail: ", data)

    const handleSubmit = (e) => {
        e.preventDefault();
        const i = props.match.params.id;
        var newProperty = props.property[i]
        newProperty = newProperty.data
        props.quotePrice(newProperty.sellerID, qPrice, props.firebase);
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

    useEffect(() => {
        updateData()
    }, [update]);

    return (
        <div className="container">
            <div className="row">
                <div className="col s12">
                    <div className="card blue-grey darken-1 detailInfoCard">
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
                                trigger={<Button className="black" node="button">Quote Price</Button>}>
                                <form className="white addLandForm z-depth-3" onSubmit={(handleSubmit)}>
                                    <div className="input-field">
                                        <label htmlFor="price">Price</label>
                                        <input type="text" id='hash' onChange={e => setQPrice(e.target.value)} />
                                    </div>
                                    <button className="waves-effect waves-light btn black">Send</button>
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
    // const id = state.ownProps.match.params.id
    console.log("State in sell detail: ", state)
    return {
        property: state.coordinates.sellDetail,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        quotePrice: (sellerID, price, firebase) => dispatch(quotePrice(sellerID, price, firebase))
    }
}

export default withFirebase(connect(mapStateToProps, mapDispatchToProps)(SellDetail))
