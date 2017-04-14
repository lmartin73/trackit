import React from 'react'
import ReactDOM from 'react-dom';
import UiValidate from '../../../components/forms/validation/UiValidate'
import DisplayContent from '../components/DisplayContent'
import Footer from '../components/Footer'


export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.validationOptions = {
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
            },
            submitHandler: function(form) {
                // Todo: Log in user here

            }.bind(this)
        };
    }

    displayForm() {
        return(
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
                                    {this.displayForm()}
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