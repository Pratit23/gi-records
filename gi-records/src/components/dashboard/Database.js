import React, { Component } from 'react'
import { connect } from 'react-redux'
//import { connect } from 'react-redux'
//import axios from 'axios'

class Database extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            hash: ''
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        //const data = { hash: this.state.hash }
        console.log("Hash: ", this.state.hash)
        let self = this;
        fetch('http://localhost:2000/?hash=' + this.state.hash, {
            method: 'GET'
        }).then(res => res.json())
            .then(response => {
                console.log(response)
                self.setState({ data: response });
            }).catch(err => {
                console.log('caught it!', err);
            })
    }

    render() {
        return (
            <div className="container" onSubmit={this.handleSubmit}>
                <form className="white">
                    <div className="input-field">
                        <label htmlFor="hash">Hash Value</label>
                        <input type="text" id='hash' onChange={this.handleChange} />
                    </div>
                    <button className="waves-effect waves-light btn">Get</button>
                </form>
                    {this.state.data.map((owner, index) => (
                        <p className="white-text" key={index}>{owner.coords}</p>
                    ))}
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
      update: (data) => dispatch ({type: 'UPDATE_NEW', hash: data}),
    }
}

export default connect(null, mapDispatchToProps)(Database);