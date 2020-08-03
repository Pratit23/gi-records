import React, { Component } from 'react'
import axios from 'axios'

class Database extends Component {

    constructor(props) {
        super(props)
        this.state = {
            persons: []
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:3000`)
            .then(res => {
                const person = res.data;
                this.setState({ person });
            })
    }

    render() {
        return (
            <div className="container">
                <p>{console.log("Look at this: ",this.persons)}</p>
            </div>
        )
    }
}

export default Database;