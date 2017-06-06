import React from 'react'

/*
    Dumb profile component

    - All data and actions passed in from props
*/
export const Profile = (props) => {
    return(
        <div id="content">
            <div className="row">
                <div className="col-sm-12 col-md-10 col-lg-6">
                    <div className="well well-sm">
                        <div className="row">
                            <div className="col col-12">
                                <div className="well well-light well-sm no-margin no-padding">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div id="myCarousel" className="carousel fade profile-carousel">
                                                <div className="air air-top-left padding-10">
                                                    <h4 className="txt-color-white font-md">{props.date}</h4>
                                                </div>
                                                <div className="carousel-inner">
                                                    <div className="item active">
                                                        <img src="assets/img/demo/s1.jpg" alt="demo user" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-12">
                                            <div className="row">
                                                <div className="col-sm-3 profile-pic">
                                                    <img src={props.user.photo} style={{backgroundColor: "gainsboro"}} />
                                                </div>
                                                <div className="col-sm-6">
                                                    <h1>{props.user.firstname}<span className="semi-bold">{props.user.lastname}</span><br />
                                                        <small>{"Company"}</small>
                                                    </h1>
                                                    <ul className="list-unstyled text-left">
                                                        <li>
                                                            <p className="text-muted">
                                                                <i className="fa fa-envelope" />&nbsp;&nbsp;<a href={"mailto:"+props.user.email}>{props.user.email}</a>
                                                            </p>
                                                        </li>
                                                        <li>
                                                            <p className="text-muted">
                                                                <i className="fa fa-phone" />&nbsp;&nbsp;<span className="txt-color-darken">{props.user.phone.number}</span>
                                                                <small className="pull-right text-primary">{props.user.phone.type}</small>
                                                            </p>
                                                        </li>
                                                        <li>
                                                            <p className="text-muted">
                                                                <i className="fa fa-map-marker" />&nbsp;&nbsp;<span className="txt-color-darken">
                                                                    {props.user.address.city + ", " + props.user.address.state}
                                                                </span>
                                                                <small className="pull-right text-primary">{props.user.address.type}</small>
                                                            </p>
                                                        </li>
                                                    </ul>
                                                    <br />
                                                    <button onClick={props.editProfileClicked} className="btn btn-default btn-xs"><i className="fa fa-user" /> Edit Information</button>&nbsp;&nbsp;
                                                    <button className="btn btn-default btn-xs"><i className="fa fa-envelope-o" /> Send Email</button>
                                                    <br/><br/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};