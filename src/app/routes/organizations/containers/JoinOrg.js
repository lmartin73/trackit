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


const mapStateToProps = (state) => {
    // Maps redux states to local props
    // Todo: check if any more states are needed
    // Temporarily returning state so that redux doesn't crash
    return {
        state: state
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

class JoinOrg extends React.Component {
    /*
        Component to allow user to join an organization
    */
    constructor() {
        super();
        // Bind methods to this pointer
        this.onComplete= this.onWizardComplete.bind(this);
        this.onOrgCodeChange = this.onOrgCodeChange.bind(this);

        // Initialize local state
        this.state = {
            organization: null,
            orgLoaded: false
        }

        // Form validation options
        this.validateOptions = {
            highlight: function (element) {
                $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
            },
            unhighlight: function (element) {
                $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
            },
            errorElement: 'span',
            errorClass: 'help-block',
            // Rules for validation
            rules: {
                orgCode: {
                    required: true,
                }
            },
            // Messages will show when rules aren't followed
            messages: {
                orgCode: {
                    required: "Code Required",
                }
            }
        };
    }

    componentDidMount() {
        // Used has a handler to disable next button if organization not found
        this.refs.wizard.next.on('click', function(e) {
            e.preventDefault();
            if (this.refs.wizard.currentStep == 2 && !this.state.orgLoaded) {
                this.refs.wizard.next.addClass('disabled')
            }
        }.bind(this))

        // Enable next button again if moved back to step 1
        this.refs.wizard.prev.on('click', function(e) {
            e.preventDefault();
            if (this.refs.wizard.currentStep == 1 && this.refs.wizard.next.hasClass('disabled')) {
                this.refs.wizard.next.removeClass('disabled')
            }
        }.bind(this))
    }

    onWizardComplete(data){
        /*
            Submit data from wizard, creating organization
            - Todo: send organization join request for current user
        */
        var message_title = 'Success!'
        var message_description = 'Request successfully sent!'
        var type = 'success'
        this.props.dispatch_route('organizations/listorgs')
        smallAlertMessage(message_title, message_description, type)
    }

    onOrgCodeChange(event) {
        event.preventDefault();
        // Here, we will validate organization code and search for organization in the store
        // If found, set orgLoaded to true (this.state.orgLoaded)
        // this.setState({orgLoaded: true})
    }

    render() {
        return(
            <div id="content" className="container-fluid animated fadeInDown">
                <div className="row">
                    <BigBreadcrumbs items={['Organizations', 'Join Organization']} icon="fa fa-fw fa-users"
                                    className="col-xs-12 col-sm-7 col-md-7 col-lg-4"/>
                </div><br/>
                <div className="row">
                    <div className="col-sm-12 col-xs-12 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
                        <article>
                            <JarvisWidget editbutton={false} deletebutton={false} color="darken">
                                <header>
                                    <span className="widget-icon"><i className="fa fa-users"/></span><h2>Join Organization</h2>
                                </header>
                                <div>
                                    <div className="widget-body">
                                        <div className="row">
                                            <UiValidate options={this.validateOptions}>
                                                <form noValidate="novalidate">
                                                    <Wizard className="col-sm-12" ref="wizard" orgLoaded={this.state.orgLoaded} compCode="1" onComplete={this.onComplete}>
                                                        <div className="form-bootstrapWizard clearfix">
                                                            <ul className="bootstrapWizard">
                                                                <li data-smart-wizard-tab="1">
                                                                    <span className="step">1</span> <span className="title">Code</span>
                                                                </li>
                                                                <li data-smart-wizard-tab="2">
                                                                    <span className="step">2</span> <span className="title">Verify</span>
                                                                </li>
                                                                <li data-smart-wizard-tab="3">
                                                                    <span className="step">3</span> <span className="title">Member Type</span>
                                                                </li>
                                                                <li data-smart-wizard-tab="4">
                                                                    <span className="step">4</span> <span className="title">Finish</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="tab-content">
                                                            <div className="tab-pane" data-smart-wizard-pane="1">
                                                                <br/><h3><strong>Step 1 </strong> - Organization Code</h3>
                                                                <h5>Enter your organization code below.</h5><hr/><br/>
                                                                <div className="row">
                                                                    <div className="col-sm-6 col-sm-offset-3">
                                                                        <div className="form-group">
                                                                            <input className="form-control" type="text" name="orgCode" placeholder="Organization Code" onChange={this.onOrgCodeChange}/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <hr/>
                                                            </div>
                                                            <div className="tab-pane" data-smart-wizard-pane="2">
                                                                <br/><h3><strong>Step 2 </strong> - Verify</h3>
                                                                <h5>Verify that all information below is correct.</h5><hr/>
                                                                <div className="row"><br/>
                                                                    <div className="text-center">
                                                                        {
                                                                            (this.state.orgLoaded) ? (
                                                                                <div>
                                                                                    <h1>Org name</h1>
                                                                                    <div>
                                                                                        <img style={{objectFit: 'cover', height: "100px", width: "100px"}} src="assets/img/avatars/user.png"/>
                                                                                    </div><br/>
                                                                                    <p>Email</p>
                                                                                    <p>Location</p>
                                                                                </div>
                                                                            ) : (
                                                                                <div>
                                                                                    <p>No Organizaion Found!</p>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div><br/>
                                                                </div>
                                                            </div>
                                                            <div className="tab-pane" data-smart-wizard-pane="3">
                                                                <br/><h3><strong>Step 3 </strong> - Member Type</h3>
                                                                <h5>Choose one of the following below.</h5><hr/>
                                                                <p>Position type will be verified by owner(s) after request is sent.</p>
                                                                <div className="row">
                                                                    <label className="radio col-xs-10 col-xs-offset-1">
                                                                        <input type="radio" name="radio" defaultChecked/>Owner
                                                                    </label>
                                                                    <label className="radio col-xs-10 col-xs-offset-1">
                                                                        <input type="radio" name="radio"/>Administrator
                                                                    </label>
                                                                    <label className="radio col-xs-10 col-xs-offset-1">
                                                                        <input type="radio" name="radio"/>Member
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="tab-pane" data-smart-wizard-pane="4"><br/>
                                                                <h3><strong>Step 4 </strong> - Finish</h3><hr/>
                                                                <div className="row"><br/>
                                                                    <h1 className="text-center">Done!</h1>
                                                                    <h4 className="text-center">Information verified to join <strong>{this.name}</strong></h4>
                                                                    <div className="text-center">
                                                                        <div><img style={{objectFit: 'cover', height: "100px", width: "100px"}} src="assets/img/avatars/user.png"/></div>
                                                                    </div><br/><br/>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="text-center">
                                                                        <h1 className="text-center text-success"><strong><i className="fa fa-check"/> Complete</strong></h1>
                                                                        <h4 className="text-center">Click next to send your request!</h4><br/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-actions">
                                                                <div className="row">
                                                                    <div className="col-sm-12">
                                                                        <ul className="pager wizard no-margin">
                                                                            <li className="previous" data-smart-wizard-prev="">
                                                                                <a className="btn btn-lg btn-default">Previous</a>
                                                                            </li>
                                                                            <li className="next" data-smart-wizard-next="">
                                                                                <a ref="nextButton" className="btn btn-lg txt-color-darken">Next</a>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Wizard>
                                                </form>
                                            </UiValidate>
                                        </div>
                                    </div>
                                </div>
                            </JarvisWidget>
                        </article>
                    </div>
                </div>
            </div>
        )
    }
}

// Connect state and dispatch to component props
export default connect(mapStateToProps, mapDispatchToProps)(JoinOrg)