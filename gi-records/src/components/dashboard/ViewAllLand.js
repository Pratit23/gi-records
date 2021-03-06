import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import Blockchain from '../../store/Blockchain'

class AddLand extends Component {

    render() {
        const { auth } = this.props;
        if (!auth.uid) return <Redirect to='/landing' />
        return (
            <div>
                <Blockchain/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
    }
}

export default connect(mapStateToProps, null)(AddLand);