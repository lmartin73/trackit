import React from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { DetailOrgComponent } from '../components/DetailOrgComponent'
import { SmartMessageBox } from "../../../components/utils/actions/MessageActions";
import Organization from '../../../_be/organizations/Organization'
import { UserProfile } from '../../../_be/auth/useracct'
import { LoadingSpinner } from '../../../components/loading-spinner/LoadingSpinner'
import { smallAlertMessage } from '../../../components/alert-messaging/AlertMessaging'


const mapStateToProps = (state, ownProps) => {
    // Maps redux states to local props
    return {
        orgUID: ownProps.location.query.orgUID
    }
}

const mapDispatchToProps = (dispatch) => {
    // Maps the redux dispatch calls to local props
    return {
        dispatch_route: (route) => {
            dispatch(push(route))
        }
    }
}

class DetailOrgContainer extends React.Component {
    /*
        Component to display details about selected organization
    */
    constructor(props) {
        super(props);
        // Bind methods to this pointer
        this.editClicked = this.onEditClicked.bind(this);
        this.leaveClicked = this.onLeaveClicked.bind(this);

        // Initialize state
        this.state = {
            orgLoaded: false
        }
    }

    componentDidMount() {
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

        this.setState({orgLoaded: true})
    }

    onEditClicked() {
        /*
            Direct user to edit organization route

            - pass org id as prop
        */
//        store.dispatch(push({
//            pathname: 'organizations/editorg',
//            state: {orgID: this.state.org.id}
//        }));
    }

    onLeaveClicked() {
        /*
            remove organization action
        */
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
        if (!this.state.orgLoaded) {
            return <LoadingSpinner text="Loading organization..." />
        }

        return(
            <DetailOrgComponent org={this.organization} owner={this.owner} administrators={this.administrators}
                                members={this.members}
                                editClicked={this.editClicked} leaveClicked={this.leaveClicked}/>
        )
    }
}

// Connect state and dispatch to component props
export default connect(mapStateToProps, mapDispatchToProps)(DetailOrgContainer)