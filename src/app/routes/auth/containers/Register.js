import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import HtmlRender from '../../../components/utils/HtmlRender'
import UiValidate from '../../../components/forms/validation/UiValidate'
import DisplayContent from '../components/DisplayContent'
import Footer from '../components/Footer'
import { AUTHENTICATED } from '../../../components/user/UserConstants'
import { attemptRegisterWithEmail } from '../../../components/user/UserActions'
import { LoadingSpinner } from '../../../components/loading-spinner/LoadingSpinner'
import { smallAlertMessage } from '../../../components/alert-messaging/AlertMessaging'


// Terms and agreement information
const terms = require('html-loader!../components/TermsAndConditions.html');

// Hash module
var sha256 = require('js-sha256');

const mapStateToProps = (state) => {
    /*
        Maps redux states to local props
        - authState: authentication state of the user
        - auth_logging: boolean for whether authentication is logging or not
        - profile_loading: boolean for whether profile is loading or not
    */
    return {
        authState: state.user.AUTH_STATE,
        auth_logging: state.user.isLogging,
        profile_loading: state.profile.isLoading
    }
}

const mapDispatchToProps = (dispatch) => {
    /*
        Maps the redux dispatch calls to local props
        - attemptRegister: method to attempt to register new user
        - registerSuccess: navigates to create profile route
    */
    return {
        attemptRegister: (email, password, firstname, lastname) => {
            dispatch(attemptRegisterWithEmail(email, password, firstname, lastname))
        },
        registerSuccess: () => {
            // Method to route to dashboard and show successful login message
            var message_title = 'Success!'
            var message_description = 'Welcome To TrackIt!'
            var type = 'success'
            dispatch(push('/createprofile'))
            smallAlertMessage(message_title, message_description, type)
        }
    }
}

class Register extends React.Component {
    /* Register component for user authentication */

    constructor() {
        super();
        // Bind methods to this pointer
        this.onInputValueChanged = this.onInputValueChanged.bind(this);

        // Initialize local state
        this.state = {
            newUserInfo: {
                firstname: '',
                lastname: '',
                email: '',
                password: sha256('')
            }
        }

        // form validation options
        this.validationOptions = {
            rules: {
                firstname: {
                    required: true
                },
                lastname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 8
                },
                passwordConfirm: {
                    required: true,
                    minlength: 8,
                    equalTo: '#password'
                }
            },
            messages: {
                firstname: {
                    required: 'First Name Required'
                },
                lastname: {
                    required: 'Last Name Required'
                },
                email: {
                    required: 'Email Required',
                    email: 'Invalid Email Address'
                },
                password: {
                    required: 'Password Required'
                },
                passwordConfirm: {
                    required: 'Password Required',
                    equalTo: 'Invalid Password Match'
                }
            },
            submitHandler: function(form) {
                // attempt to register user
                this.props.attemptRegister(this.state.newUserInfo.email, this.state.newUserInfo.password,
                                            this.state.newUserInfo.firstname, this.state.newUserInfo.lastname)
            }.bind(this)
        };
    }

    componentWillReceiveProps(new_props) {
        /*
            Used as a handler for authentication state changes
            - If state changed to authenticated and profile stops loading
                , user is registed and logged in
                - proceed to create profile route
        */
        if (new_props.authState === AUTHENTICATED && !new_props.profile_loading) {
            this.props.registerSuccess()
        }
    }

    onInputValueChanged(event) {
        /*
            Method used to update state in correspondence with input fields when modified
            - Update firstname, lastname, and email field in state when input is changed
            - Update password hash in state when password input is changed
        */
        event.preventDefault();
        var newUserInfo_key = 'newUserInfo'
        var new_state = {newUserInfo: {...this.state.newUserInfo}};

        if (event.target.name === 'password') {
            // Hash new password
            new_state[newUserInfo_key][event.target.name] = sha256(event.target.value);
        } else {
            new_state[newUserInfo_key][event.target.name] = event.target.value;
        }
        this.setState(new_state);
    }

    displayTerms() {
        return(
            <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                            <h4 className="modal-title" id="myModalLabel">Terms & Conditions</h4>
                        </div>
                        <div className="modal-body custom-scroll terms-body">
                            <HtmlRender html={terms}/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger pull-left" id="print">
                                <i className="fa fa-print"/> Print
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        // Show loading spinner with specific text depending on auth/profile state
        if (this.props.auth_logging) {
            return <LoadingSpinner text='Registering your account...' />
        } else if (this.props.profile_loading) {
            return <LoadingSpinner text='Initializing profile...' />
        }

        return (
            <div id="extr-page">
                <header id="header" className="animated fadeInDown">
                    <div id="logo-group">
                        <span id="logo">
                            <div><h1 className="logo-name text-center">TrackIt+</h1></div>
                        </span>
                    </div>
                    <span id="extr-page-header-space">
                        <span className="hidden-mobile hiddex-xs">Already registered?
                        </span>&nbsp;<a href="#login" className="btn btn-danger">Sign In</a>
                    </span>
                </header>
                <div id="main" role="main" className="animated fadeInDown">
                    <div id="content" className="container">
                        <div className="row">
                            <DisplayContent />
                            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                                <div className="well no-padding">
                                    <UiValidate options={this.validationOptions}>
                                        <form id="smart-form-register" className="smart-form client-form">
                                            <fieldset>
                                                <section>
                                                    <label className="input"> <i className="icon-append fa fa-user"/>
                                                    <input type="text" id="firstname" name="firstname" placeholder="First Name" onChange={this.onInputValueChanged} />
                                                    <b className="tooltip tooltip-bottom-right">Please enter your first name.</b> </label>
                                                </section>
                                                <section>
                                                    <label className="input"> <i className="icon-append fa fa-user"/>
                                                    <input type="text" id="lastname" name="lastname" placeholder="Last Name" onChange={this.onInputValueChanged} />
                                                    <b className="tooltip tooltip-bottom-right">Please enter your last name.</b> </label>
                                                </section>
                                                <section>
                                                    <label className="input"> <i className="icon-append fa fa-envelope"/>
                                                    <input type="email" id="email" name="email" placeholder="Email" onChange={this.onInputValueChanged} />
                                                    <b className="tooltip tooltip-bottom-right">Please enter your email address.</b> </label>
                                                </section>
                                                <section>
                                                    <label className="input"> <i className="icon-append fa fa-lock"/>
                                                    <input type="password" id="password" name="password" placeholder="Password" onChange={this.onInputValueChanged} />
                                                    <b className="tooltip tooltip-bottom-right">Please enter your password.</b> </label>
                                                </section>
                                                <section>
                                                    <label className="input"> <i className="icon-append fa fa-lock"/>
                                                    <input type="password" id="passwordConfirm" name="passwordConfirm" placeholder="Confirm password" />
                                                    <b className="tooltip tooltip-bottom-right">Please confirm your password.</b> </label>
                                                </section>
                                            </fieldset>
                                            <fieldset>
                                                <section>
                                                    <label className="checkbox">
                                                    <input type="checkbox" name="terms" id="terms" value="off"/>
                                                    <i/>I agree with the <a href="#" data-toggle="modal" data-target="#myModal">
                                                        Terms and Conditions </a></label>
                                                </section>
                                            </fieldset>
                                            <footer>
                                                <button type="submit" className="btn btn-primary">Register</button>
                                            </footer>
                                        </form>
                                    </UiValidate>
                                </div>
                                <Footer />
                            </div>
                        </div>
                    </div>
                </div>
                {this.displayTerms()}
            </div>
        )
    }
}

// Use connect method to connect redux store to component
export default connect(mapStateToProps, mapDispatchToProps)(Register)