import React from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { ListOrganizations } from '../components/ListOrganizations'
import { LoadingSpinner } from '../../../components/loading-spinner/LoadingSpinner'


const mapStateToProps = (state) => {
    /* Maps redux states to local props

    args:
        state: app state from the redux store
    returns:
        dict object with the following attributes:
            - enrolledOrgs: list of dict objects (organization data) indexed with organization id
            - pendingOrgs: list of dict objects (organization data) indexed with organization id
            - profile_loading: boolean for whether the profile is loading or not
    */
    return {
        enrolledOrgs: state.profile.profile.enrolledOrgs,
        pendingOrgs: state.profile.profile.pendingOrgs,
        profile_loading: state.profile.isLoading
    }
}

const mapDispatchToProps = (dispatch) => {
    /* Maps the redux dispatch calls to local props

    args:
        dispatch: dispatch action method from the redux store
    returns:
        dict object with the following attributes:
            - goToDetails: method to push the `detail org` route to the DOM, passing
                in the organization id
    */
    return {
        goToDetails: (orgUID) => {
            dispatch(push({
                pathname: 'organizations/detailorg',
                query: {
                    orgUID: orgUID
                }
            }))
        }
    }
}

class ListOrgsContainer extends React.Component {
    /* Container component for list of organizations user is associated with

        This container component loads organizations data from the user's profile before rendering
        the data to the DOM using the stateless `list organizations` component...
    */

    constructor() {
        // Init method for this component
        super();

        // Bind methods to this pointer
        this.orgClicked = this.onOrganizationClicked.bind(this);
    }

    onOrganizationClicked(orgUID) {
        /* Action handler for when any organization div is clicked

        args:
            orgUID: organization id
        */
        this.props.goToDetails(orgUID)
    }

    render() {
        // Renders the data to the DOM

        // Show loading spinner with specified text if profile loading
        if (this.props.profile_loading) {
            return <LoadingSpinner text='Loading organizations...' />
        }

        return(
            <ListOrganizations enrolledOrgs={this.props.enrolledOrgs}
                               pendingOrgs={this.props.pendingOrgs}
                               orgClicked={this.orgClicked} />
        )
    }
}

// Connect state and dispatch to component props
export default connect(mapStateToProps, mapDispatchToProps)(ListOrgsContainer)