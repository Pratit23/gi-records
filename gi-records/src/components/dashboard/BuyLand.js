import React, { useState, useEffect } from 'react'
import PropertyList from '../projects/PropertyList'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom';
import { db } from '../../config/fbConfig'
import Sidenav from '../layout/Sidenav'

var localData = localStorage.getItem('userDetails')
localData = JSON.parse(localData)

const BuyLand = (props) => {

    const [states, setTheState] = useState('')
    const [city, setCity] = useState('')
    const [locality, setLocality] = useState('')
    const [showForm, setShowForm] = useState(true)
    const [showCards, setShowCards] = useState(false)
    const [property, setProperty] = useState([])
    const [tempProperty, setTempProperty] = useState([])

    const goBack = () => {
        setTheState('')
        setCity('')
        setLocality('')
        setShowForm(true)
        setShowCards(false)
    }

    // const handleChange = (e) => {
    //     e.preventDefault();
    //     this.setState({
    //         [e.target.id]: e.target.value
    //     })
    // }

    const handleSubmit = (e) => {
        e.preventDefault()
        var tempArray = []
        db.collection('sellLand')
            .where("state", "==", states)
            .where("city", "==", city)
            .where("locality", "==", locality)
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    const data = doc.data()
                    console.log("DOC ID", data)
                    if (data.sellerID != localData.ethereumAdd) {
                        tempArray[doc.id] = { data }
                    }
                })
                console.log("Snapshot thingy: ", tempArray)
                setProperty(property)
                setShowForm(false)
                setShowCards(true)
                localStorage.setItem('sellDetails', JSON.stringify(property))
                props.sell(property)
            })
            .catch(error => console.log(error))
        console.log("CHECK THIS: ", property)
    }

    const getValue = () => {
        var state = window.$('#stateSelect').val()
        var cities = window.$('#citySelect').val()
        var localities = window.$('#localitySelect').val()
        setTheState(state)
        setCity(cities)
        setLocality(localities)
        console.log("State Value: ", states)
        console.log("City Value: ", city)
        console.log("Locality Value: ", locality)
    }

    const getList = async () => {
        console.log("Use effect be working")
        window.$(document).ready(function () {
            window.$('#stateSelect').formSelect()
            window.$('#citySelect').formSelect()
            window.$('#localitySelect').formSelect()
        });
        await db.collection('sellLand').get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    const data = doc.data()
                    tempProperty.push(data)
                })
            })
        console.log("State array: ", tempProperty)
    }

    useEffect(() => {
        getList()
    }, [tempProperty])

    return (
        <div className="row">
            <div className="col s2 mainSideNav">
                <Sidenav />
            </div>
            <div className="col s10">
                <h1>Buy Land</h1>
                <div className="container buyLandContainer">
                    {
                        showForm ? (
                            <div className="input-field col s12 white addLandForm z-depth-3" onSubmit={() => handleSubmit()}>
                                <select id='stateSelect' onChange={() => getValue()}>
                                    {
                                        console.log("Rendering: ", tempProperty),
                                            tempProperty.map((states, key) => {
                                                console.log("States bruuu: ", states)
                                                return (
                                                    <option key={key} value={states.state} className="black-text">Testing</option>
                                                )
                                            })
                                    }
                                </select>
                                <select id='citySelect' onChange={() => getValue()}>
                                    {
                                        console.log("Rendering: ", tempProperty),
                                        typeof (tempProperty) !== 'undefined' && (tempProperty).length !== 0 ?
                                            tempProperty.map((cities, key) => {
                                                return (
                                                    <option key={key} value={cities.city}>{cities.city}</option>
                                                )
                                            }) : null
                                    }
                                </select>
                                <select id='localitySelect' onChange={() => this.getValue()}>
                                    {
                                        console.log("Rendering: ", tempProperty),
                                        typeof (tempProperty) !== 'undefined' && (tempProperty).length !== 0 ?
                                            tempProperty.map((localities, key) => {
                                                return (
                                                    <option key={key} value={localities.locality}>{localities.locality}</option>
                                                )
                                            }) : null
                                    }
                                </select>
                            </div>
                        ) : (
                                null
                            )
                    }
                    {
                        showCards === true ? (
                            <div>
                                <button onClick={() => goBack} className="waves-effect waves-light btn black">Back</button>
                                <PropertyList property={property} />
                            </div>
                        ) : (
                                null
                            )
                    }
                </div>
            </div>
        </div>
    )
}


const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        sell: (data) => dispatch({ type: 'SHOW_SELL_DETAIL', property: data })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BuyLand)