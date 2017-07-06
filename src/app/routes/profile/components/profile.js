import React from 'react'
import { bigCirclePhotoStyle, boxShadowStyle, backgroundImageStyle } from '../../../components/styles/styles'

/*
    Dumb profile component
*/
export const Profile = (props) => {
    return(
        <div id="content" className="animated fadeInDown">
            <h3 className="text-center text-danger">My Profile</h3><hr/>
            <div className="col-lg-7 col-md-6 text-center" style={boxShadowStyle}>
                <br/>
                <img src={props.user.photoURL} style={bigCirclePhotoStyle} />
                <h1 className="text-danger"><br/>{props.user.firstname + " "}<span className="semi-bold">{props.user.lastname}</span>
                    <br />
                    <small>{props.user.city + ", " + props.user.state}</small>
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
                </ul>
                <hr/>
                <div className="form-inline">
                    <button className="btn btn-default" onClick={props.editProfileClicked}>Edit Profile</button>&nbsp;&nbsp;
                    <button className="btn btn-success">Send Message</button>
                </div>
                <div><br/></div>
            </div>
        </div>
    );
};