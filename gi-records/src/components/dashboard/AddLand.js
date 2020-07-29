import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom';
import Blockchain from '../../store/Blockchain'

class AddLand extends Component {

    render() {
        //console.log(this.props)
        const { auth } = this.props;
        if (!auth.uid) return <Redirect to='/signin' />
        return (
            <div>
                <Blockchain/>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    console.log(state);
    return {
        auth: state.firebase.auth,
    }
}

export default connect(mapStateToProps, null)(AddLand);