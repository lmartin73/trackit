import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { attemptLoginWithEmail } from '../../../components/user/UserActions'
import { AUTHENTICATED, GUEST } from '../../../components/user/UserConstants'
import UiValidate from '../../../components/forms/validation/UiValidate'
import DisplayContent from '../components/DisplayContent'
import Footer from '../components/Footer'


const mapStateToProps = (state) => {
    /*
        Maps redux states to local props

        - method is called everytime state is updated/changed
        - authState: current authentication status
    */
    return {
        authState: state.user.AUTH_STATE
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
        loginSuccess: () => {dispatch(push('#/dashboard'))}
    }
}

class Login extends React.Component {

    componentWillReceiveProps(props) {
        /*
            Used as a handler for authentication state changes

            - If state changed to authenticated, user is logged in
            - If state is not changed to authenticated, do nothing
        */
        if (props.authState === AUTHENTICATED) {
            this.props.loginSuccess()
        } else if (props.authState === GUEST) {
            // Todo: Error message
        }
    }

    constructor(props) {
        super(props);

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

                    - data:
                        email: this.refs.email.value
                        password: this.refs.password.value
                */
                this.props.attemptLogin(this.refs.email.value, this.refs.password.value)
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
                                                    <input type="email" name="email" ref="email" />
                                                    <b className="tooltip tooltip-top-right"><i className="fa fa-user txt-color-teal"/>
                                                        Please enter your email address.</b></label>
                                                </section>
                                                <section>
                                                    <label className="label">Password</label>
                                                    <label className="input"> <i className="icon-append fa fa-lock"/>
                                                    <input type="password" name="password" ref="password" />
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