import React from 'react'

export default class DisplayContent extends React.Component {

    render() {
        return(
            <div className="col-xs-12 col-sm-12 col-md-7 col-lg-8 hidden-xs hidden-sm">
                <h1 className="txt-color-red login-header-big">TrackIt</h1>
                <div className="hero">
                    <div className="pull-left login-desc-box-l">
                        <h4 className="paragraph-header">
                            Manage and track all of your inventory within your company from the cloud.
                        </h4>
                        <div className="login-app-icons">
                            <span></span>
                            <a className="btn btn-danger btn-sm">Find out more</a>
                        </div>
                    </div>
                    <img src="assets/img/demo/iphoneview.png" className="pull-right display-image" alt=""
                        style={{width: '210px'}}/>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h5 className="about-heading">About TrackIt - Are you up to date?</h5>
                        <p>Information about TrackIt will go here</p>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
                        <h5 className="about-heading">Not just your average Inventory Manager!</h5>
                        <p>More information about trackit goes here.</p>
                    </div>
                </div>
            </div>
        )
    }
}