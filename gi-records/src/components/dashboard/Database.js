import React, { Component } from 'react'
// import axios from 'axios'

class Database extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        let self = this;
        fetch('http://localhost:2000/', {
            method: 'GET'
        }).then(res => res.json())
        .then(response => {
            console.log(response)
            self.setState({data: response});
        }).catch(err => {
        console.log('caught it!',err);
        })
    }

    render() {
        return (
            <div className="container">
                <p>{console.log("Data: ",this.state.data)}</p>
            </div>
        )
    }
}

export default Database;