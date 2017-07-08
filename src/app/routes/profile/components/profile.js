import React from 'react'
import { bigCirclePhotoStyle, boxShadowStyle, smallCirclePhotoStyle } from '../../../components/styles/styles'

export const Profile = (props) => {
    /* Stateless component for displaying user profile information

    args:
        props: props passed to component
            - data:
                user: Profile object
                enrolledOrgs: list of dict objects (organization data) indexed with organization id
                pendingOrgs: list of dict objects (organization data) indexed with organization id
            - actions:
                editProfileClicked: button action to handle clicking on edit profile button
                orgClicked: button action to handle clicking on any organization div (pending orgs disabled)
    */
    return(
        <div id="content" className="container-fluid animated fadeInDown">
            <h3 className="text-center text-danger">My Profile</h3><hr/>
            <div className="col-lg-7 col-md-7 col-sm-12 col-xs-12 text-center" style={boxShadowStyle}>
                <br/>
                <img src={props.user.photoURL} style={bigCirclePhotoStyle} />
                <h1 className="text-danger"><br/>{props.user.firstname + " "}<span className="semi-bold">{props.user.lastname}</span>
                    <br />
                </h1>
                <ul className="list-unstyled">
                    <li>
                        <p className="text-muted">
                            <i className="fa fa-envelope" />&nbsp;&nbsp;<a href={"mailto:" + props.user.email}>{props.user.email}</a>
                        </p>
                    </li>
                    <li>
                        <p className="text-muted">
                            <i className="fa fa-phone" />&nbsp;&nbsp;<span>{props.user.phone}</span>
                        </p>
                    </li>
                    <li>
                        <p className="text-muted">
                            <i className="fa fa-map-marker" />&nbsp;&nbsp;<span>
                                {props.user.street1 + " " + props.user.street2}<br/>{props.user.city + ", " +
                                 props.user.state + " " + props.user.zip + " " + props.user.country}
                            </span>
                        </p>
                    </li>
                </ul><hr/>
                <div className="form-inline">
                    <button className="btn btn-default" onClick={props.editProfileClicked}>Edit Profile</button>&nbsp;&nbsp;
                    <button className="btn btn-success">Send Message</button>
                </div>
                <div><br/></div>
            </div>
            <div className="col-lg-5 col-md-5 col-sm-12 col-xs-12">
                <br/>
                <h4 className="text-center text-default">My Organizations</h4><hr/>
                {
                    (Object.keys(props.pendingOrgs).length == 0) ? (
                        (Object.keys(props.enrolledOrgs).length == 0) ? (
                            <div>
                                <p className="text-center text-muted">No Enrolled Organizations</p>
                            </div>
                        ) : (
                            Object.keys(props.enrolledOrgs).map(function(orgUID) {
                                return(
                                    <div>
                                        <div key={orgUID} onClick={() => props.orgClicked(orgUID)} className="form-inline col-lg-6 col-md-12">
                                            <img src={props.enrolledOrgs[orgUID].logoURL} style={smallCirclePhotoStyle} />
                                            <button className="btn btn-link text-center">{props.enrolledOrgs[orgUID].name}</button>
                                        </div>
                                    </div>
                                )
                            })
                        )
                    ) : (
                        <div>
                            <div className="tabs-top">
                                <ul className="nav nav-tabs tabs-left" id="demo-pill-nav">
                                    <li className="active"><a href="#tab-r1" data-toggle="tab">Enrolled</a></li>
                                    <li><a href="#tab-r2" data-toggle="tab">Pending</a></li>
                                </ul>
                            </div>
                            <div className="tab-content">
                                <div className="tab-pane active" id="tab-r1"><br/>
                                    <div className="row">
                                        {
                                            (Object.keys(props.enrolledOrgs).length == 0) ? (
                                                <div>
                                                    <p className="text-center text-default">No Enrolled Organizations</p>
                                                </div>
                                            ) : (
                                                Object.keys(props.enrolledOrgs).map(function(orgUID) {
                                                    return(
                                                        <div>
                                                            <div key={orgUID} onClick={() => props.orgClicked(orgUID)} className="form-inline col-lg-6 col-md-12">

                                                                <img src={props.enrolledOrgs[orgUID].logoURL} style={smallCirclePhotoStyle} />
                                                                <button className="btn btn-link text-center">{props.enrolledOrgs[orgUID].name}</button>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="tab-pane" id="tab-r2"><br/>
                                    <div className="row">
                                        {
                                            Object.keys(props.pendingOrgs).map(function(orgUID) {
                                                return(
                                                    <div>
                                                        <div key={orgUID} onClick={() => props.orgClicked(orgUID)} className="form-inline col-lg-6 col-md-12" disabled>
                                                            <img src={props.pendingOrgs[orgUID].logoURL} style={smallCirclePhotoStyle} />
                                                            <button className="btn btn-link text-center">{props.pendingOrgs[orgUID].name}</button>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};