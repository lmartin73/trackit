import React from 'react'

export default class DisplayContent extends React.Component {
    /*
        This component will show on app authentication components

        - Includes information about TrackIt services and what makes TrackIt stand out from competitors
        - Todo: Need to add a logo and better quality information
    */
    render() {
        return(
            <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 hidden-xs hidden-sm">
                <h1 className="txt-color-red login-header-big">TrackIt+</h1>
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
                </div>
            </div>
        )
    }
}