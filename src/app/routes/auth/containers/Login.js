import React from 'react'
import ReactDOM from 'react-dom';
import UiValidate from '../../../components/forms/validation/UiValidate'
import DisplayContent from '../components/DisplayContent'
import Footer from '../components/Footer'

const validationOptions = {
    // Rules for login form validation
    rules: {
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            minlength: 8
        },
    },
    // Messages for login form validation
    messages: {
        email: {
            required: 'Email Required',
            email: 'Invalid Email Address'
        },
        password: {
            required: 'Password Required'
        },
    }
};

export default class Login extends React.Component {

    constructor() {
        super();
        // Initialize variable for sign in action method to keep form as a controlled component
        this.submitForm = this.signInAction.bind(this);
        this.displayForm = this.loginForm();
    }

    signInAction(event) {
        event.preventDefault();

        const formValid = this.refs.email.value.length != 0 && this.refs.email.validity.valid &&
                          this.refs.password.value.length >= 8;
        if (formValid) {
            // Todo: Sign in user here
            // email -> this.email.value
            // password -> this.password.value
        }
    }

    loginForm() {
        return(
            <UiValidate options={validationOptions}>
                <form id="login-form" onSubmit={this.submitForm} className="smart-form client-form">
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
        )
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
                            <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4">
                                <div className="well no-padding">
                                    {this.displayForm}
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