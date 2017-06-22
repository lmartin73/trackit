import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { attemptLoginWithEmail } from '../../../components/user/UserActions'
import { AUTHENTICATED, GUEST, AWAITING_AUTHENTICATION } from '../../../components/user/UserConstants'
import UiValidate from '../../../components/forms/validation/UiValidate'
import DisplayContent from '../components/DisplayContent'
import Footer from '../components/Footer'
import { smallBox } from "../../../components/utils/actions/MessageActions";

var sha256 = require('js-sha256');

const mapStateToProps = (state) => {
    /*
        Maps redux states to local props
        - method is called everytime state is updated/changed
        - authState: current authentication status
    */
    return {
        authState: state.user.AUTH_STATE,
        isLogging: state.user.isLogging
    }
}

const mapDispatchToProps = (dispatch) => {
    /*
        Maps the redux dispatch calls to local props
        - attemptLogin: method to attempt to log in user
        - loginSuccess: redirects to main webpage (dashboard)
    */
    return {
        attemptLogin: (email, password) => {
            dispatch(attemptLoginWithEmail(email, password))
        },
        loginSuccess: () => {
            // Method to route to dashboard and show successful login message
            dispatch(push('/dashboard'))
            smallBox({
                title: "Signed In!",
                content: "<i class='fa fa-clock-o'></i> <i>Welcome back to TrackIt!</i>",
                color: "#659265",
                iconSmall: "fa fa-check fa-2x fadeInRight animated",
                timeout: 4000
            });
        }
    }
}

class Login extends React.Component {
    /* Login component for user authentication */

    componentWillReceiveProps(props) {
        /*
            Used as a handler for authentication state changes

            - If state changed to authenticated, user is logged in
            - If state is not changed to authenticated, do nothing
        */
        if (props.authState === AUTHENTICATED && !props.isLogging) {
            this.props.loginSuccess()

        } else if (props.authState === GUEST) {
            // Todo: Error message
        }
    }

    constructor(props) {
        super(props);
        // Bind methods to 'this' pointer
        this.onInputValueChanged = this.onInputValueChanged.bind(this);

        // Initialize local state
        this.state = {
            auth: {
                email: '',
                password: sha256('')
            }
        };

        // login form validation options
        this.validationOptions = {
            rules: {
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true,
                    minlength: 6
                },
            },
            // messages will show if rules arent followed
            messages: {
                email: {
                    required: 'Email Required',
                    email: 'Invalid Email Address'
                },
                password: {
                    required: 'Password Required'
                },
            },
            submitHandler: function(form) {
                /*
                    All validation has been successful
                    Attempt to log in user
                */
                this.props.attemptLogin(this.state.auth.email, this.state.auth.password)
            }.bind(this)
        };
    }

    onInputValueChanged(event) {
        /*
            Method used to update state in correspondence with input fields when modified
            - Update email field in state when email input is changed
            - Update password hash in state when password input is changed
        */
        event.preventDefault();
        var newState = {};
        if (event.target.name === 'password') {
            newState = {auth: {...this.state.auth, password: sha256(event.target.value)}};
        } else if (event.target.name === 'email') {
            newState = {auth: {...this.state.auth, email: event.target.value}};
        }
        this.setState(newState);
    }

    render() {
        if (this.props.isLogging) {
            return (
                <div>
                    <div style={{marginTop: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <img style={{width: '30px', height: '30px'}} src="assets/img/spinner/ripple.gif" />
                    </div><br/>
                    <p className="text-center text-muted">Loading account...</p>
                </div>
            )
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
                        <span className="hidden-mobile hiddex-xs">Need an account?</span>&nbsp;
                        <a href="#/register" className="btn btn-danger">Create account</a>
                    </span>
                </header>
                <div id="main" role="main" className="animated fadeInDown">
                    <div id="content" className="container">
                        <div className="row">
                            <DisplayContent />
                            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                                <div className="well no-padding">
                                    <UiValidate options={this.validationOptions}>
                                        <form id="form" className="smart-form client-form">
                                            <header>Sign In</header>
                                            <fieldset>
                                                <section>
                                                    <label className="label">E-mail</label>
                                                    <label className="input"> <i className="icon-append fa fa-user"/>
                                                    <input type="email" name="email" onChange={this.onInputValueChanged} />
                                                    <b className="tooltip tooltip-top-right"><i className="fa fa-user txt-color-teal"/>
                                                        Please enter your email address.</b></label>
                                                </section>
                                                <section>
                                                    <label className="label">Password</label>
                                                    <label className="input"> <i className="icon-append fa fa-lock"/>
                                                    <input type="password" name="password" onChange={this.onInputValueChanged} />
                                                    <b className="tooltip tooltip-top-right"><i className="fa fa-lock txt-color-teal"/>
                                                        Please enter your password.</b></label>
                                                    <div className="note">
                                                        <a href="#/forgot">Forgot password?</a>
                                                    </div>
                                                </section>
                                                <section>
                                                    <label className="checkbox">
                                                        <input type="checkbox" name="remember" defaultChecked={true}/>
                                                        <i/>Stay signed in
                                                    </label>
                                                </section>
                                            </fieldset>
                                            <footer>
                                                <button type="submit" className="btn btn-primary">Sign in</button>
                                            </footer>
                                        </form>
                                    </UiValidate>
                                </div>
                                <Footer />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// Use connect method to connect redux store to Login component
export default connect(mapStateToProps, mapDispatchToProps)(Login)
