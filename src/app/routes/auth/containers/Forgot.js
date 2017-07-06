import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import UiValidate from '../../../components/forms/validation/UiValidate'
import DisplayContent from '../components/DisplayContent'
import Footer from '../components/Footer'
import * as firebase from 'firebase'
import { smallAlertMessage } from "../../../components/alert-messaging/AlertMessaging";
import { textfieldStyle } from '../../../components/styles/styles'


const mapDispatchToProps = (dispatch) => {
    /*
        Maps the redux dispatch calls to local props
        - goBackToLogin: redirects to Login page
        - dispatch_route: pushes route to DOM
    */
    return {
        goBackToLogin: () => {
            var message_title = 'Email Sent'
            var message_description = 'Password recovery email has been sent!'
            var type = 'success'
            dispatch(push('/login'))
            smallAlertMessage(message_title, message_description, type)
        },
        dispatch_route: (route) => {
            dispatch(push(route))
        }
    }
}

class Forgot extends React.Component {
    /* Allows user to reset their password */

    constructor(props) {
        super(props);
        // form validation options
        this.validationOptions = {
            // Rules for input fields
            rules: {
                email: {
                    required: true,
                    email: true
                }
            },
            // Messages will show if rules aren't followed
            messages: {
                email: {
                    required: 'Email Required',
                    email: 'Invalid Email Address'
                }
            },
            submitHandler: function(form) {
                /*
                    Send password recovery email and nagivate back to login page
                */
                firebase.auth().sendPasswordResetEmail(this.refs.email.value).catch(function(error) {
                    // Todo: Error handling
                });
                this.props.goBackToLogin();
            }.bind(this)
        };
    }

    render() {
        return (
            <div id="extr-page">
                <header id="header" className="animated fadeInDown">
                    <div id="logo-group">
                        <span id="logo">
                            <div><h1 className="logo-name text-center">TrackIt+</h1></div>
                        </span>
                    </div>
                    <span id="extr-page-header-space"><span className="hidden-mobile hiddex-xs">Need an account?</span> <a
                        href="#/register" className="btn btn-danger">Create account</a></span>
                </header>
                <div id="main" role="main" className="animated fadeInDown">
                    <div id="content" className="container">
                        <div className="row">
                            <DisplayContent />
                            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                                <div className="well no-padding">
                                    <UiValidate options={this.validationOptions}>
                                        <form id="login-form" className="smart-form client-form">
                                            <header>Forgot Password</header>
                                            <fieldset>
                                                <section>
                                                    <label className="input">
                                                    <input type="email" name="email" ref="email" placeholder="Email" style={textfieldStyle}/>
                                                    <b className="tooltip tooltip-top-right"><i className="fa fa-envelope txt-color-teal"/>
                                                        &nbsp;Need to recover your account? Please enter your email address.</b></label>
                                                </section>
                                                <section>
                                                    <div className="note">
                                                        <a onClick={() => {this.props.dispatch_route('/login')}}>I remembered my password!</a>
                                                    </div>
                                                </section>
                                            </fieldset>
                                            <footer>
                                                <button type="submit" className="btn btn-primary">
                                                    <i className="fa fa-refresh"/> Reset Password
                                                </button>
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
export default connect(null, mapDispatchToProps)(Forgot)
