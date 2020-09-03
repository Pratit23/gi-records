import React, { Component } from 'react'
import PropertyList from '../projects/PropertyList'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Redirect } from 'react-router-dom';
import { db } from '../../config/fbConfig'

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
                    tempArray.push(data)
                })
                this.setState({
                    property: tempArray,
                    showForm: false,
                    showCards: true
                })
                console.log("Snapshot thingy: ", this.state.property)
                this.props.sell(this.state.property)
            })
            .catch(error => console.log(error))
        console.log("CHECK THIS: ", this.state.property)
    }

    shouldComponentUpdate(prevProps, prevState) {
        if (prevState.showForm != this.state.showForm) {
            return true
        } else {
            return false
        }
    }

    render() {
        const { property, auth } = this.props;
        if (!auth.uid) return <Redirect to='/signin' />
        const showForm = this.state.showForm
        const showCards = this.state.showCards

        return (
            <div className="container">
                {
                    showForm ? (
                        <form className="white addLandForm z-depth-3" onSubmit={this.handleSubmit}>
                            <div className="input-field">
                                <label htmlFor="states">State</label>
                                <input type="text" id='states' onChange={this.handleChange} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="city">City</label>
                                <input type="text" id='city' onChange={this.handleChange} />
                            </div>
                            <div className="input-field">
                                <label htmlFor="locality">Locality</label>
                                <input type="text" id='locality' onChange={this.handleChange} />
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