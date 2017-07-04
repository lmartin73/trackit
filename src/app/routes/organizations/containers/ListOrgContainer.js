import React from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { ListOrganizations } from '../components/ListOrganizations'
import { LoadingSpinner } from '../../../components/loading-spinner/LoadingSpinner'


const mapStateToProps = (state) => {
    // Maps redux states to local props
    return {
        enrolledOrgs: state.profile.profile.enrolledOrgs,
        pendingOrgs: state.profile.profile.pendingOrgs,
        profile_loading: state.profile.isLoading
    }
}

const mapDispatchToProps = (dispatch) => {
    // Maps the redux dispatch calls to local props
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
    // Component to list organizations current user is associated with

    constructor() {
        super();
        // Bind methods to this pointer
        this.orgClicked = this.onOrganizationClicked.bind(this);
    }

    onOrganizationClicked(orgUID) {
        // Directs user to organization that was clicked
        this.props.goToDetails(orgUID)
    }

    render() {
        // Show loading spinner with specified text if profile loading
        if (this.props.profile_loading) {
            return <LoadingSpinner text='Loading organizations...' />
        }

        return(
            <ListOrganizations enrolledOrgs={this.props.enrolledOrgs}
                               pendingOrgs={this.props.pendingOrgs} orgClicked={this.orgClicked} />
        )
    }
}

// Connect state and dispatch to component props
export default connect(mapStateToProps, mapDispatchToProps)(ListOrgsContainer)