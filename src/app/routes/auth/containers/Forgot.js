import React from 'react'
import ReactDOM from 'react-dom';
import UiValidate from '../../../components/forms/validation/UiValidate'
import DisplayContent from '../components/DisplayContent'
import Footer from '../components/Footer'

export default class Forgot extends React.Component {

    constructor() {
        super();
        this.validationOptions = {
            // Rules for password recovery form validation
            rules: {
                email: {
                    required: true,
                    email: true
                }
            },
            // Messages for password recovery form validation
            messages: {
                email: {
                    required: 'Email Required',
                    email: 'Invalid Email Address'
                }
            },
            submitHandler: function(form) {
                // Todo: Send recovery email here

            }.bind(this)
        };
    }

    displayForm() {
        return(
            <UiValidate options={validationOptions}>
                <form id="login-form" className="smart-form client-form">
                    <header>Forgot Password</header>
                    <fieldset>
                        <section>
                            <label className="label">Enter your email address.</label>
                            <label className="input"> <i className="icon-append fa fa-envelope"/>
                            <input type="email" name="email" ref="email"/>
                            <b className="tooltip tooltip-top-right"><i className="fa fa-envelope txt-color-teal"/>
                                &nbsp;Need to recover your account? Please enter your email address.</b></label>
                        </section>
                        <section>
                            <div className="note">
                                <a href="#/login">I remembered my password!</a>
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
                    <span id="extr-page-header-space"><span className="hidden-mobile hiddex-xs">Need an account?</span> <a
                        href="#/register" className="btn btn-danger">Create account</a></span>
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