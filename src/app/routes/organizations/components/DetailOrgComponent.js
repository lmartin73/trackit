import React from 'react'
import { bigCirclePhotoStyle, boxShadowStyle, smallCirclePhotoStyle, mediumCirclePhotoStyle } from '../../../components/styles/styles'


export const DetailOrgComponent = (props) => {
    /* Stateless component for displaying detailed information for an organization

    args:
        props: props passed to component
            - data:
                org: Organization object
                owner: Profile object
                administrators: list of Project objects
                members: list of Profile objects
            - actions:
                editClicked: button action to handle edit organization button click
                leaveClicked: button action to handle leave organization button click

        Todo: add action handler method from props to user profile div
    */
    return(
        <div id="content" className="container-fluid animated fadeInDown">
            <h3 className="text-center text-danger">Organization Details</h3><hr/>
            <div className="text-center col-lg-6 col-md-7 col-sm-12 col-xs-12" style={boxShadowStyle}>
                <br/>
                <img src={props.org.logoURL} style={bigCirclePhotoStyle}/>
                <h1 className="text-danger"><br/>{props.org.name}
                    <br />
                </h1>
                <ul className="list-unstyled">
                    <li>
                        <p className="text-muted">
                            <i className="fa fa-envelope" />&nbsp;&nbsp;<a href={"mailto:" + props.org.email}>{props.org.email}</a>
                        </p>
                    </li>
                    <li>
                        <p className="text-muted">
                            <i className="fa fa-phone" />&nbsp;&nbsp;<span>{props.org.phone}</span>
                        </p>
                    </li>
                    <hr/>
                    <li>
                        <h5 className="text-success">Physical Address:</h5>
                        <p className="text-muted">
                            <i className="fa fa-map-marker" />&nbsp;&nbsp;<span>
                                {props.org.physicalAddress.street1 + " " + props.org.physicalAddress.street2}<br/>{props.org.physicalAddress.city + ", " +
                                 props.org.physicalAddress.state + " " + props.org.physicalAddress.zip + " " + props.org.physicalAddress.country}
                            </span>
                        </p>
                    </li>
                    <li>
                        <br/>
                        <h5 className="text-success">Mailing Address:</h5>
                        <p className="text-muted">
                            <i className="fa fa-map-marker" />&nbsp;&nbsp;<span>
                                {props.org.mailingAddress.street1 + " " + props.org.mailingAddress.street2}<br/>{props.org.mailingAddress.city + ", " +
                                 props.org.mailingAddress.state + " " + props.org.mailingAddress.zip + " " + props.org.mailingAddress.country}
                            </span>
                        </p>
                    </li>
                </ul>
                <hr/>
                <p className="text-center">{props.org.description}</p>
                <hr/>
                <div className="form-inline">
                    <button className="btn btn-default" onClick={props.editClicked}>Edit Organization</button>&nbsp;&nbsp;
                    <button className="btn btn-success">Send Message</button>
                </div>
                <div><br/></div>
            </div>
            <div className="col-lg-6 col-md-5 col-sm-12 col-xs-12">
                <br/><br/>
                <div className="row">
                    <div className="col-xs-5 text-right">
                        <img src="assets/img/avatars/sunny.png" style={mediumCirclePhotoStyle} />
                    </div>
                    <div className="col-xs-7 text-left">
                        <h5 className="text-danger">{props.owner.firstname + " "}<span className="semi-bold">{props.owner.lastname}</span>
                            <br />
                            <small>Owner</small>
                        </h5>
                        <ul className="list-unstyled">
                            <li>
                                <p className="text-muted">
                                    <i className="fa fa-envelope" />&nbsp;&nbsp;<a href={"mailto:" + props.owner.email}>{props.owner.email}</a>
                                </p>
                            </li>
                            <li>
                                <p className="text-muted">
                                    <i className="fa fa-phone" />&nbsp;&nbsp;<span>{props.owner.phone}</span>
                                </p>
                            </li>
                        </ul>
                    </div>
                </div><hr/>
                <div className="tabs-top">
                    <ul className="nav nav-tabs tabs-left" id="demo-pill-nav">
                        <li className="active"><a href="#tab-r1" data-toggle="tab">Administrators</a></li>
                        <li><a href="#tab-r2" data-toggle="tab">Members</a></li>
                    </ul>
                </div>
                <div className="tab-content">
                    <div className="tab-pane active" id="tab-r1"><br/>
                        <div className="row">
                            {
                                (props.administrators.length == 0) ? (
                                    <div>
                                        <p className="text-center text-default">No Administrators</p>
                                    </div>
                                ) : (
                                    props.administrators.map(function(user) {
                                        return(
                                            <div>
                                                <div key={user.firstname} onClick={() => {}} className="form-inline col-lg-6 col-md-12 col-sm-4 col-xs-12">
                                                    <img src={user.photoURL} style={smallCirclePhotoStyle} />
                                                    <button className="btn btn-link text-center">{user.firstname + " " + user.lastname}</button>
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
                                (props.members.length == 0) ? (
                                    <div>
                                        <p className="text-center text-default">No Members</p>
                                    </div>
                                ) : (
                                    props.members.map(function(user) {
                                        return(
                                            <div>
                                                <div key={user.firstname} onClick={() => {}} className="form-inline col-lg-6 col-md-12 col-sm-4 col-xs-12">
                                                    <img src={user.photoURL} style={smallCirclePhotoStyle} />
                                                    <button className="btn btn-link text-center">{user.firstname + " " + user.lastname}</button>
                                                </div>
                                            </div>
                                        )
                                    })
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
