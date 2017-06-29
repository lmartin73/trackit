import React from 'react'
import { push } from 'react-router-redux'
import { months } from '../../../components/forms/commons/months'
import { Profile } from '../components/profile'
import { connect } from 'react-redux'
import { LoadingSpinner } from '../../../components/loading-spinner/LoadingSpinner'


// Current date displayed on profile (Date string)
var current_date = new Date();
var date_str = months[current_date.getMonth()] + " " + current_date.getDay() + ", " + current_date.getFullYear();

const mapStateToProps = (state) => {
    /*
        Maps redux states to local props
        - profile: user profile object
        - profile_loading: boolean for whether the profile is loading or not
        - profile_state: current state of the profile
    */
    return {
        profile: state.profile.profile,
        profile_loading: state.profile.isLoading,
        profile_state: state.profile.profile_state
    }
}

const mapDispatchToProps = (dispatch) => {
    /*
        Maps the redux dispatch calls to local props
        - go_to_edit_profile: method to dispatch to editprofile route
    */
    return {
        go_to_edit_profile: () => {dispatch(push('myaccount/editprofile'))}
    }
}

class ProfileContainer extends React.Component {
    /*
        Container component for profile
    */
    constructor() {
        super();
        // Bind methods to this pointer
        this.editProfileAction = this.editProfileClicked.bind(this);
    }

    editProfileClicked() {
        /*
            Used to direct to edit profile route on button click
        */
        this.props.go_to_edit_profile()
    }

    render() {
        // Show loading spinner with specified text if profile loading
        if (this.props.profile_loading) {
            return <LoadingSpinner text='Loading profile...'>
        }

        return(
            <Profile user={this.props.profile} date={date_str} editProfileClicked={this.editProfileAction} />
        )
    }
}

// Connect state and dispatch to component props
export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer)