import React, { Component } from 'react'
//import { connect } from 'react-redux'
//import axios from 'axios'

class Database extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
        }
    }

    handleSubmit = (e) =>  {
        e.preventDefault();
        //const data = { hash: this.state.hash }
        let self = this;
        fetch('http://localhost:2000/', {
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
                        <label htmlFor="data">Hash Value</label>
                        <input type="text" id='data' onChange={this.handleChange}/>
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

export default Database;