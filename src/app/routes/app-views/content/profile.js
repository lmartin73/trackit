import React from 'react'

export default class ProfileEdited extends React.Component {
    render() {
        return(
            <div id="content">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="well well-sm">
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-6">
                                    <div className="well well-light well-sm no-margin no-padding">
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div id="myCarousel" className="carousel fade profile-carousel">

                                                    <div className="air air-top-left padding-10">
                                                        <h4 className="txt-color-white font-md">Jan 1, 2014</h4>
                                                    </div>
                                                    <ol className="carousel-indicators">
                                                        <li data-target="#myCarousel" data-slide-to={0} className="active" />
                                                        <li data-target="#myCarousel" data-slide-to={1} className />
                                                        <li data-target="#myCarousel" data-slide-to={2} className />
                                                    </ol>
                                                    <div className="carousel-inner">
                                                        {/* Slide 1 */}
                                                        <div className="item active">
                                                            <img src="assets/img/demo/s1.jpg" alt="demo user" />
                                                        </div>
                                                        {/* Slide 2 */}
                                                        <div className="item">
                                                            <img src="assets/img/demo/s2.jpg" alt="demo user" />
                                                        </div>
                                                        {/* Slide 3 */}
                                                        <div className="item">
                                                            <img src="assets/img/demo/m3.jpg" alt="demo user" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-sm-12">
                                                <div className="row">
                                                    <div className="col-sm-3 profile-pic">
                                                        <img src="assets/img/avatars/sunny-big.png" alt="demo user" />
                                                        <div className="padding-10">
                                                            <h4 className="font-md"><strong>        </strong>
                                                                <br />
                                                                <small>         </small>
                                                            </h4>
                                                            <br />
                                                            <h4 className="font-md"><strong>        </strong>
                                                                <br />
                                                                <small>         </small>
                                                            </h4>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <h1>John <span className="semi-bold">Doe</span>
                                                            <br />
                                                            <small> CEO, SmartAdmin</small>
                                                        </h1>
                                                        <ul className="list-unstyled">
                                                            <li>
                                                                <p className="text-muted">
                                                                    <i className="fa fa-phone" />&nbsp;&nbsp;(<span className="txt-color-darken">313</span>) <span className="txt-color-darken">464</span> - <span className="txt-color-darken">6473</span>
                                                                </p>
                                                            </li>
                                                            <li>
                                                                <p className="text-muted">
                                                                    <i className="fa fa-envelope" />&nbsp;&nbsp;<a href="mailto:simmons@smartadmin">ceo@smartadmin.com</a>
                                                                </p>
                                                            </li>
                                                            <li>

                                                                <p className="text-muted">
                                                                    <i className="fa fa-map-marker" />&nbsp;&nbsp;<span className="txt-color-darken">
                                                                            151 Yucca Dr.
                                                                    </span><br/>
                                                                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="txt-color-darken">
                                                                            Jackson MS, 39211
                                                                    </span><br/>
                                                                   &nbsp;&nbsp;&nbsp;&nbsp;<span className="txt-color-darken">
                                                                           United Stated
                                                                   </span>
                                                                </p>
                                                            </li>

                                                        </ul>
                                                        <br />
                                                        <p className="font-md">
                                                            <i>A little about me...</i>
                                                        </p>
                                                        <p>
                                                            This is some text about me.
                                                            This is on another line. This is on the same line as that one.
                                                            This is the last line.
                                                        </p>
                                                        <br />
                                                        <a href="#" className="btn btn-default btn-xs"><i className="fa fa-user" /> Edit Information</a>&nbsp;&nbsp;
                                                        <a href="#" className="btn btn-default btn-xs"><i className="fa fa-envelope-o" /> Send Email</a>
                                                        <br /><br />
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
        )
    }
}
    