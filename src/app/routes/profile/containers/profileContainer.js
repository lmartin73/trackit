import React from 'react'
import { push } from 'react-router-redux'
import { months } from '../../../components/forms/commons/months'
import { Profile } from '../components/profile'
import { connect } from 'react-redux'


// Current date displayed on profile (Date string)
var current_date = new Date();
var date_str = months[current_date.getMonth()] + " " + current_date.getDay() + ", " + current_date.getFullYear();

const mapStateToProps = (state) => {
    /*
        Maps redux states to local props

        - method is called everytime state is updated/changed
        - authState: current authentication status
    */
    return {
        profile: state.profile.profile,
        profile_loading: state.profile.isLoading,
        profile_state: state.profile.profile_state
    }
}

const mapDispatchToProps = (dispatch) => {
    //console.log(dispatch)
    /*
        Maps the redux dispatch calls to local props

        - attemptLogin: method to attempt to log in user
        - loginSuccess: redirects to main webpage (dashboard)
    */
    return {
        go_to_edit_profile: () => {dispatch(push('settings/editprofile'))}
    }
}

class ProfileContainer extends React.Component {
    /*
        Container component for profile

        - Loads profile data, and any other data needed
        - Renders profile dummy component, passing in data as props
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
        if (this.props.profile_loading) {
            return(
                <div>
                    <div style={{marginTop: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <img style={{width: '30px', height: '30px'}} src="assets/img/spinner/ripple.gif" />
                    </div><br/>
                    <p className="text-center text-muted">Loading profile...</p>
                </div>
            )
        }

        return(
            <Profile user={this.props.profile} date={date_str} editProfileClicked={this.editProfileAction} />
        )
    }
}

// Connect state and dispatch to component props
export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer)