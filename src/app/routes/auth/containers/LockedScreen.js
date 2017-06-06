import React from 'react'
import ReactDOM from 'react-dom';
import './LockedScreen.css'
import UiValidate from '../../../components/forms/validation/UiValidate'

export default class LockedScreen extends React.Component {
    /*
        Allows user to unlock account after a certain amount of inactivity

        - User must enter password to unlock account
    */
    constructor() {
        super();
        // Temp
        this.state = {photoSrc: "assets/img/avatars/user.png"};

        // Form validation
        this.validationOptions = {
            // Rules for  validation
            rules: {
                password: {
                    required: true,
                    minlength: 8
                }
            },
            // Messages will show when validation isn't followed
            messages: {
                password: {
                    required: 'Password required'
                }
            },
            submitHandler: function(form) {
                /*
                    All validation is successful

                    - Todo: check user password (hash)
                    - if password correct, proceed to main page
                    - if password incorrect, keep account locked
                */
            }.bind(this)
        };
    }

    render() {
        return (
            <div id="extr-page">
                <div id="main" role="main">
                    <UiValidate options={validationOptions}>
                        <form className="lockscreen animated flipInY">
                            <div className="logo">
                                <div><h1 className="logo-name text-center">TrackIt+</h1></div>
                            </div>
                            <div>
                                <img src={this.state.photoSrc} alt="" width="120" height="120"/>
                                <div>
                                    <h1><i className="fa fa-3x text-muted air air-top-right hidden-mobile"/>Name here
                                        <small><i className="fa fa-lock text-muted"/> &nbsp;Locked</small>
                                    </h1>
                                    <p className="text-muted">Email here</p>
                                    <div className="input-group">
                                        <input className="form-control" type="password" name="password" ref="password" />
                                        <div className="input-group-btn">
                                            <button className="btn btn-primary" type="submit"><i className="fa fa-key"/></button>
                                        </div>
                                    </div>
                                    <p className="no-margin margin-top-5">Log in as someone else? <a href="#/login"> Click here</a></p>
                                </div>
                            </div>
                            <p className="font-xs margin-top-5">Copyright TrackIt 2014-2020.</p>
                        </form>
                    </UiValidate>
                </div>
            </div>
        )
    }
}