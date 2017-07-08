import React from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { DetailOrgComponent } from '../components/DetailOrgComponent'
import Organization from '../../../_be/organizations/Organization'
import { UserProfile } from '../../../_be/auth/useracct'
import { LoadingSpinner } from '../../../components/loading-spinner/LoadingSpinner'
import { smallAlertMessage } from '../../../components/alert-messaging/AlertMessaging'
import { SmartMessageBox } from "../../../components/utils/actions/MessageActions"


const mapStateToProps = (state, ownProps) => {
    /* Maps redux states to local props

    args:
        state: app state from the redux store
        ownProps: props passed to component through pushing route
    returns:
        dict object with the following attributes:
            - orgUID: selected organization id
    */
    return {
        orgUID: ownProps.location.query.orgUID
    }
}

const mapDispatchToProps = (dispatch) => {
    /* Maps the redux dispatch calls to local props

    args:
        dispatch: dispatch action method from the redux store
    returns:
        dict object with the following attributes:
            - dispatch_route: method to push a route to the DOM
            - goToEdit: method to push the `edit org` route to the DOM, passing
                in the organization id
    */
    return {
        dispatch_route: (route) => {
            dispatch(push(route))
        },
        goToEdit: (orgUID) => {
            dispatch(push({
                pathname: 'organizations/editorg',
                query: {
                    orgUID: orgUID
                }
            }))
        }
    }
}

class DetailOrgContainer extends React.Component {
    /* Container component to display details about selected organization

        This component loads information about the selected organization using the
        organizatio id (passed to props from previous component) and renders the data
        to the DOM...

        Todo: add action method for user profile clicked
    */

    constructor(props) {
        /* Init method of this component

        args:
            props: props passed to this component
        */
        super(props);

        // Bind methods to this pointer
        this.editClicked = this.onEditClicked.bind(this);
        this.leaveClicked = this.onLeaveClicked.bind(this);

        /* Initialize local state
            - orgLoaded: boolean (used for re-rendering the DOM once organization data has been load)
                Hence, orgLoaded is set to true once data has loaded
        */
        this.state = {
            orgLoaded: false
        }
    }

    componentDidMount() {
        /* action method called when the component has mounted to the DOM

            This method is used to do the following:
                - Load organizatio data
                - Set owner profile using owner uid
                - Iterate through administrator uids and create a list of administrator profiles
                - Iterate through member uids and create a list of member profiles
        */

        // Get organization information
        this.organization = new Organization(this.props.orgUID);

        // Get profiles for owner, administrators, and members
        this.owner = new UserProfile(this.organization.ownerUID)
        this.administrators = [];
        this.members = [];
        for (uid in this.organization.administratorUIDs) {
            var profile = new UserProfile(uid);
            this.administrators.push(profile);
        }
        for (uid in this.organization.memberUIDs) {
            var profile = new UserProfile(uid);
            this.administrators.push(profile);
        }

        // Update orgLoaded field in this.state to render organization details
        this.setState({orgLoaded: true})
    }

    onEditClicked() {
        // Action handler for edit organization button click
        this.props.goToEdit(this.props.orgUID);
    }

    onLeaveClicked() {
        // Action handler for leave organization button click
        SmartMessageBox({
            title: "Sure?",
            content: "Are you sure you want to leave this organization?",
            buttons: '[No][Yes]'
        },
        function (ButtonPressed) {
            if (ButtonPressed === "Yes") {
                // Todo: Remove user from organization
                var message_title = 'Removed!'
                var message_description = 'You have been removed from ' + this.organization.name + '!'
                var type = 'success'
                this.props.dispatch_route('organizations/listorgs')
                smallAlertMessage(message_title, message_description, type)
            }
            if (ButtonPressed === "No") {
                // Do nothing
            }
        }.bind(this));
    }

    render() {
        // Renders the data to the DOM

        // Show loading spinner with specified text if organization data is loading
        if (!this.state.orgLoaded) {
            return <LoadingSpinner text="Loading organization..." />
        }

        return(
            <DetailOrgComponent org={this.organization}
                                owner={this.owner}
                                administrators={this.administrators}
                                members={this.members}
                                editClicked={this.editClicked}
                                leaveClicked={this.leaveClicked}/>
        )
    }
}

// Connect state and dispatch to component props
export default connect(mapStateToProps, mapDispatchToProps)(DetailOrgContainer)