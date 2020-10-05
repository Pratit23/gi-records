import React, { Component } from 'react'
import PropertyList from '../projects/PropertyList'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom';
import { db } from '../../config/fbConfig'
import Sidenav from '../layout/Sidenav'
var localData = localStorage.getItem('userDetails')
localData = JSON.parse(localData)

var tempStates = []
var tempLocality = []
var tempCity = []

class BuyLand extends Component {
    constructor(props) {
        super(props)
        this.state = {
            states: '',
            city: '',
            locality: '',
            showForm: true,
            showCards: false,
            property: [],
        }
        this.goBack = this.goBack.bind(this);
    }
    goBack() {
        this.setState({
            states: '',
            city: '',
            locality: '',
            showForm: true,
            showCards: false,
        })
    }
    handleChange = (e) => {
        e.preventDefault();
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        var tempArray = []
        db.collection('sellLand')
            .where("state", "==", this.state.states)
            .where("city", "==", this.state.city)
            .where("locality", "==", this.state.locality)
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
                this.setState({
                    property: tempArray,
                    showForm: false,
                    showCards: true
                })
                console.log("Buy land property: ", this.state.property)
                console.log("Length of state property: ", (this.state.property).length)
                localStorage.setItem('sellDetails', JSON.stringify(this.state.property))
                this.props.sell(this.state.property)
            })
            .catch(error => console.log(error))
        console.log("CHECK THIS: ", this.state.property)
    }
    shouldComponentUpdate(prevProps, prevState) {
        if (prevState.showForm != this.state.showForm) {
            this.getStates()
            return true
        } else {
            return false
        }
    }

    getStates = async() => {
        await db.collection('sellLand')
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                const data = doc.data()
                console.log("DOC ID", data)
                var s = data.state
                var c = data.city
                var l = data.locality
                tempStates[s] = null 
                tempCity[c] = null 
                tempLocality[l] = null 
            })
        }).then(() => {
            window.$(document).ready(function(){
                console.log("Tempstates: ", tempStates)
                window.$('input.stateInput').autocomplete({
                  data: {
                    ...tempStates
                  },
                });
              });
            window.$(document).ready(function(){
                console.log("Tempstates: ", tempStates)
                window.$('input.cityInput').autocomplete({
                  data: {
                    ...tempCity
                  },
                });
              });
            window.$(document).ready(function(){
                console.log("Tempstates: ", tempStates)
                window.$('input.localityInput').autocomplete({
                  data: {
                    ...tempLocality
                  },
                });
              });
        })
        console.log("Temp states: ", tempStates)
    }

    componentDidMount() {
        this.getStates()
    }

    render() {
        const { property, auth } = this.props;
        if (!auth.uid) return <Redirect to='/landing' />
        const showForm = this.state.showForm
        const showCards = this.state.showCards
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
                                <form className="blue-grey darken-4 addLandForm z-depth-3" onSubmit={this.handleSubmit}>
                                    <div className="input-field">
                                        <label htmlFor="states">State</label>
                                        <input className="white-text stateInput" id="autocomplete-input" type="text" id='states' onChange={this.handleChange} />
                                    </div>
                                    <div className="input-field">
                                        <label htmlFor="city">City</label>
                                        <input className="white-text cityInput" type="text" id='city' onChange={this.handleChange} />
                                    </div>
                                    <div className="input-field">
                                        <label htmlFor="locality">Locality</label>
                                        <input className="white-text localityInput" type="text" id='locality' onChange={this.handleChange} />
                                    </div>
                                    <button className="waves-effect waves-light btn black">Search</button>
                                </form>
                            ) : (
                                    null
                                )
                        }
                        {
                            showCards === true ? (
                                <div>
                                    <button onClick={this.goBack} className="waves-effect waves-light btn black">Back</button>
                                    <PropertyList property={this.state.property} />
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