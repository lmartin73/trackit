import React from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import JarvisWidget from '../../../components/widgets/JarvisWidget'
import Wizard from '../../../components/forms/wizards/Wizard'
import UiValidate from '../../../components/forms/validation/UiValidate'
import { BigBreadcrumbs } from '../../../components'
import { smallAlertMessage } from '../../../components/alert-messaging/AlertMessaging'
import { LoadingSpinner } from '../../../components/loading-spinner/LoadingSpinner'
import Organization from '../../../_be/organizations/Organization'
import { bigCirclePhotoStyle, boxShadowStyle, backgroundImageStyle, textfieldStyle } from '../../../components/styles/styles'


// Constants for wizard
const STEP_ID_LIST = ['tab1', 'tab2', 'tab3', 'tab4'];
const TIMEOUT = 3000;

const mapStateToProps = (state) => {
    /* Maps redux states to local props

    args:
        state: app state from the redux store
    returns:
        dict object with the following attributes:
            - Todo: add needed state objects
    */
    return {
        profile: this.state
    }
}

const mapDispatchToProps = (dispatch) => {
    /* Maps the redux dispatch calls to local props

    args:
        dispatch: dispatch action method from the redux store
    returns:
        dict object with the following attributes:
            - dispatch_route: method to push a route to the DOM
    */
    return {
        dispatch_route: (route) => {
            dispatch(push(route))
        }
    }
}

class JoinOrg extends React.Component {
    // Component to allow user to join an organization

    constructor() {
        // Init method for this component
        super();

        // Bind methods to this pointer
        this.onComplete = this.onWizardComplete.bind(this);
        this.onOrgCodeChange = this.onOrgCodeChange.bind(this);
        this.onNextClicked = this.onNextClicked.bind(this);
        this.onPreviousClicked = this.onPreviousClicked.bind(this);
        this.handlerWizardReactions = this.handlerWizardReactions.bind(this);

        /*Initialize local state
            - organization: data concerning the organization
            - wizard: object including the wizard current and previous step
        */
        this.state = {
            organization: {
                organization: null,
                orgLoaded: false,
                orgStatusText: ''
            },
            wizard: {
                currentStep: 1,
                prevStep: null
            }
        }
    }

    componentDidMount() {
        /* Action handler for when the component successfully mounts

        Here, we just want to disable the previous button from being clicked,
        since we are initially on step 1
        */
        this.refs.prevBtn.disabled = true;
    }

    onWizardComplete() {
        /* Action handler for when user has successfully completed the wizard

        Here, we will submit organization join request and dispatch to list orgs
        The new organization will be appended to the list of pending organizations for the user
            - organization Data is located at `this.state.organization.organization`
            - user data (if needed) is located at `this.props.profile`
        */
        // Todo: send join organization request
        var message_title = 'Success!'
        var message_description = 'Request successfully sent!'
        var type = 'success'
        this.props.dispatch_route('organizations/listorgs')
        smallAlertMessage(message_title, message_description, type)
    }

    onOrgCodeChange(event) {
        /* Action handler for when the organization code input field value changes

        In this method, we validate that the organization code entered is valid
        and that it successfully creates a new organization object with an organization
        id from our database. If so, we can update the `orgLoaded` attribute in `this.state` to true

        args:
            event: javascript onchange event
        */
        event.preventDefault();
        if (event.target.value.length >= 12) {
            this.setState({orgLoaded: true})
        }
    }

    onNextClicked(event) {
        /* Action handler for wizard next button click

        This method is to validate current step inputs and make a decision on whether
        navigating to the next step is allowed or not

        args:
            event: javascript onclick event
        */
        event.preventDefault();

        // Validate input field
        if (this.refs.orgCode.value == "") {
            this.setState({organization: {orgStatusText: "Organization Code Required"}})
            setTimeout(() => {
                this.setState({organization: {orgStatusText: ''}});
            }, TIMEOUT);
            return
        }

        // Check if organization has loaded
        if (!this.state.organization.orgLoaded) {
            // Show `no organization found` message to DOM for length of TIMEOUT
            this.setState({organization: {orgStatusText: "No Organization Found. Check Organization Code."}})
            setTimeout(() => {
                this.setState({organization: {orgStatusText: ''}});
            }, TIMEOUT);
            return
        } else if (this.state.wizard.currentStep == 4) {
            // Wizard successfully completed
            this.onComplete();
            return
        }
        // Move to next step
        this.setStep(this.state.wizard.currentStep + 1);
    }

    onPreviousClicked(event) {
        /* Action handler for wizard previous button click

        This method will navigate to the previous step, allowing user to backtrack if needed
        We can disable the previous button if the current step is 2

        args:
            event: javascript onclick event
        */
        event.preventDefault();
        if (this.state.wizard.prevStep == null) {
            event.target.disabled = true;
            return
        }
        // Move to previous step
        this.setStep(this.state.wizard.currentStep - 1);
    }

    handlerWizardReactions() {
        /* Handler for the wizard header reactions (tab headers and buttons)

        This method will change the classNames (text color) of the current and previous tabs
        We can safely assume that the other tabs will remain with gray text (`text-muted`) as initialized
            - remove gray color (`text-muted`) from current step header title and add red color (`text-danger`)
            - remove red color (`text-danger`) from previous step header title and add gray color (`text-muted`)
        This method also handles reactions of the wizard buttons
            - Disable previous button if on first step, enable if not
            - Set next button text to `Finish` if on last step, set to `Next` if not

        */
        document.getElementById(STEP_ID_LIST[this.state.wizard.currentStep - 1]).classList.remove('text-muted')
        document.getElementById(STEP_ID_LIST[this.state.wizard.currentStep - 1]).classList.add('text-success')
        document.getElementById(STEP_ID_LIST[this.state.wizard.prevStep - 1]).classList.remove('text-success')
        document.getElementById(STEP_ID_LIST[this.state.wizard.prevStep - 1]).classList.add('text-muted')

        if (this.state.wizard.currentStep == 1) {
            // Disable button
            this.refs.prevBtn.disabled = true;
        } else if (this.state.wizard.currentStep == 4) {
            // Last step
           this.refs.nextBtn.innerText = "Finish";
        } else {
            // Check before enabling again (may already be enabled)
            if (this.refs.prevBtn.disabled) {
                this.refs.prevBtn.disabled = false;
            }
            // Check before setting Next again (may already be next)
            if (this.refs.nextBtn.innerText == "Finish") {
                this.refs.nextBtn.innerText = "Next";
            }
        }
    }

    setStep(step) {
        /* Sets the current step in the wizard

        This method simply updates the current step attribute in the local state,
        as the DOM re-renders due to the state update, showing the new step
        As a callback to the state update, we update the wizard tab headers and button texts

        args:
            step: int
        */
        var new_state = {wizard: {currentStep: step, prevStep: this.state.wizard.currentStep}};
        this.setState(new_state, this.handlerWizardReactions);
    }

    render() {
        // Render content to the ROM

        return(
            <div id="content" className="container-fluid animated fadeInDown">
                <h3 className="text-center text-danger">Join Organization</h3><hr/><br/>
                <div className="col-sm-8 col-sm-offset-2 col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3" style={boxShadowStyle}>
                    <form className="smart-form" ref="form" id="form" noValidate="novalidate">
                        <fieldset>
                            <div className="text-center">
                                <h5 className="col-xs-3 text-success" id="tab1" >CODE</h5>
                                <h5 className="col-xs-3 text-muted" id="tab2">VERIFY</h5>
                                <h5 className="col-xs-3 text-muted" id="tab3">MEMBER</h5>
                                <h5 className="col-xs-3 text-muted" id="tab4">FINISH</h5>
                            </div>
                        </fieldset>
                        <fieldset>
                            {
                                (() => {
                                    switch(this.state.wizard.currentStep) {
                                        case 1:
                                            // Step 1 content
                                            return (
                                                <div>
                                                    <h5><strong>Step 1 </strong> - Organization Code</h5>
                                                    <br/><br/><p className="text-center">Enter your organization code below.</p><br/>
                                                    <section className="col-xs-12">
                                                        <label className="input">
                                                            <input type="text" ref="orgCode" className="form-control" name="orgCode" placeholder="Organization Code"
                                                                                        style={textfieldStyle}
                                                                                        onChange={this.onOrgCodeChange}/><br/>
                                                        </label>
                                                    </section>
                                                </div>
                                            )
                                        case 2:
                                            // Step 2 content
                                            return (
                                                <div>
                                                    <h5><strong>Step 2 </strong> - Verify Information</h5>
                                                    <br/><br/><p className="text-center">Verify that all information below is correct.</p><br/><hr/>
                                                    <section className="text-center">
                                                        <br/><h1 className="text-danger">{this.state.organization.name}</h1><br/>
                                                        <div>
                                                            <img style={bigCirclePhotoStyle} src={this.state.organization.logoURL}/>
                                                        </div><br/>
                                                        <ul className="list-unstyled">
                                                            <li>
                                                                <p className="text-primary">
                                                                    <i className="fa fa-envelope" />&nbsp;&nbsp;<span>{this.state.organization.email}</span>
                                                                </p>
                                                            </li>
                                                            <li>
                                                                <p className="text-muted">
                                                                    <i className="fa fa-map-marker" />&nbsp;&nbsp;<span>{this.state.organization.physicalAddress.city +
                                                                                                                        ", " + this.state.organization.physicalAddress.state}</span>
                                                                </p>
                                                            </li>
                                                        </ul>
                                                    </section>
                                                </div>
                                            )
                                        case 3:
                                            // Step 3 content
                                            return (
                                                <div>
                                                    <h5><strong>Step 3 </strong> - Member Type</h5>
                                                    <br/><br/><p className="text-center">Choose one of the following below.</p>
                                                    <p className="text-center">Position type will be verified by owner(s) after request is sent.</p><br/><hr/>
                                                    <div className="inline-group"><br/>
                                                        <label className="radio">
                                                            <input type="radio" name="radio-inline" defaultChecked/>
                                                            <i/>Administrator</label>
                                                        <label className="radio">
                                                            <input type="radio" name="radio-inline"/>
                                                            <i/>Member</label>
                                                    </div>
                                                </div>
                                            )
                                        case 4:
                                            // Step 4 content
                                            return (
                                                <div>
                                                    <h5><strong>Step 4 </strong> - Finish</h5>
                                                    <div className="row"><br/>
                                                        <h3 className="text-center text-success"><strong><i className="fa fa-check"/> Complete</strong></h3><br/>
                                                        <h5 className="text-center">Information verified to join <strong>{this.state.organization.name}</strong></h5><br/>
                                                        <div className="text-center">
                                                            <div><img style={bigCirclePhotoStyle} src={this.state.organization.logoURL}/></div>
                                                        </div><br/>
                                                    </div>
                                                    <div className="row">
                                                        <div className="text-center">
                                                            <h5 className="text-center">Click finish to send your request!</h5><br/>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                    }
                                })()
                            }
                            <p className="text-center text-warning">
                                {this.state.organization.orgStatusText}
                            </p>
                        </fieldset>
                        <footer style={{backgroundColor: 'white'}}>
                            <button type="submit" ref="nextBtn" onClick={this.onNextClicked} className="btn pull-right btn-success"
                                                        style={{borderRadius: "10px"}}>Next</button>
                            <button ref="prevBtn" onClick={this.onPreviousClicked} className="btn btn-default pull-left"
                                                        style={{borderRadius: "10px"}}>Previous</button>
                        </footer>
                    </form>
                </div>
            </div>
        )
    }
}

// Connect state and dispatch to component props
export default connect(mapStateToProps, mapDispatchToProps)(JoinOrg)