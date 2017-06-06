import React from 'react'
import ReactDOM from 'react-dom';
import HtmlRender from '../../../components/utils/HtmlRender'
import UiValidate from '../../../components/forms/validation/UiValidate'
import {DisplayContent} from '../components/DisplayContent'
import Footer from '../components/Footer'

// Terms and agreement information
const terms = require('html-loader!../components/TermsAndConditions.html');

export default class Register extends React.Component {

    constructor() {
        super();
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
                // Todo: Register user here
            }.bind(this)
        };
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
                                                    <input type="text" name="firstname" ref="firstname" placeholder="First Name" />
                                                    <b className="tooltip tooltip-bottom-right">Please enter your first name.</b> </label>
                                                </section>
                                                <section>
                                                    <label className="input"> <i className="icon-append fa fa-user"/>
                                                    <input type="text" name="lastname" ref="lastname" placeholder="Last Name" />
                                                    <b className="tooltip tooltip-bottom-right">Please enter your last name.</b> </label>
                                                </section>
                                                <section>
                                                    <label className="input"> <i className="icon-append fa fa-envelope"/>
                                                    <input type="email" name="email" ref="email" placeholder="Email" />
                                                    <b className="tooltip tooltip-bottom-right">Please enter your email address.</b> </label>
                                                </section>
                                                <section>
                                                    <label className="input"> <i className="icon-append fa fa-lock"/>
                                                    <input type="password" name="password" ref="password" placeholder="Password" />
                                                    <b className="tooltip tooltip-bottom-right">Please enter your password.</b> </label>
                                                </section>
                                                <section>
                                                    <label className="input"> <i className="icon-append fa fa-lock"/>
                                                    <input type="password" name="passwordConfirm" ref="passwordConfirm" placeholder="Confirm password" />
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