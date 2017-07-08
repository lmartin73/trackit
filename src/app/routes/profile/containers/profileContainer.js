import React from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { Profile } from '../components/profile'
import { LoadingSpinner } from '../../../components/loading-spinner/LoadingSpinner'
import { profile } from '../../../testdata/sample_profile_data'


const mapStateToProps = (state) => {
    /* Maps redux states to local props

    args:
        state: app state from the redux store
    returns:
        dict object with the following attributes:
            - profile: user Profile object
            - profile_loading: boolean for whether the profile is loading or not
            - enrolledOrgs: list of dict objects (organization data) indexed with organization id
            - pendingOrgs: list of dict objects (organization data) indexed with organization id
    */
    return {
        profile: state.profile.profile,
        profile_loading: state.profile.isLoading,
        enrolledOrgs: state.profile.profile.enrolledOrgs,
        pendingOrgs: state.profile.profile.pendingOrgs
    }
}

const mapDispatchToProps = (dispatch) => {
    /* Maps the redux dispatch calls to local props

    args:
        dispatch: dispatch action method from the redux store
    returns:
        dict object with the following attributes:
            - go_to_edit_profile: method to push the `edit profile` route to the DOM
            - goToOrgDetails: method to push the `detail org` route to the DOM, passing
                    in the organization id
    */
    return {
        go_to_edit_profile: () => {dispatch(push('myaccount/editprofile'))},
        goToOrgDetails: (orgUID) => {
            dispatch(push({
                pathname: 'organizations/detailorg',
                query: {
                    orgUID: orgUID
                }
            }))
        }
    }
}

class ProfileContainer extends React.Component {
    /* Container component for user profile

        This container component loads data from the user's profile before rendering
        the data to the DOM using the stateless profile component...
    */

    constructor() {
        // Init method of this class
        super();

        // Bind methods to the `this` pointer
        this.editProfileAction = this.editProfileClicked.bind(this);
        this.orgClicked = this.onOrganizationClicked.bind(this);
    }

    editProfileClicked() {
        // Action handler for edit profile button
        this.props.go_to_edit_profile()
    }

    onOrganizationClicked(orgUID) {
        /* Action handler for when any organization div is clicked

        args:
            orgUID: organization id
        */
        this.props.goToOrgDetails(orgUID)
    }

    render() {
        // Renders the data to the DOM

        // Show loading spinner with specified text if profile is loading
        if (this.props.profile_loading) {
            return <LoadingSpinner text='Loading profile...' />
        }

        return(
            <Profile user={profile}
                     editProfileClicked={this.editProfileAction}
                     enrolledOrgs={this.props.enrolledOrgs}
                     pendingOrgs={this.props.pendingOrgs}
                     orgClicked={this.orgClicked}/>
        )
    }
}

// Connect state and dispatch to component props
export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer)
