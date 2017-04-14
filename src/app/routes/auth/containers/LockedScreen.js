import React from 'react'
import ReactDOM from 'react-dom';
import './LockedScreen.css'
import UiValidate from '../../../components/forms/validation/UiValidate'

export default class LockedScreen extends React.Component {

    constructor() {
        super();
        this.state = {photoSrc: "assets/img/avatars/user.png"};
        this.validationOptions = {
            // Rules for locked screen form validation
            rules: {
                password: {
                    required: true,
                    minlength: 8
                }
            },
            // Messages for locked screen form validation
            messages: {
                password: {
                    required: 'Password required'
                }
            },
            submitHandler: function(form) {
                // Todo: Check password here

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
                                    <p className="no-margin margin-top-5">Logged as someone else? <a href="#/login"> Click here</a></p>
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