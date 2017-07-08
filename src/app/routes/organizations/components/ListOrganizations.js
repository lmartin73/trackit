import React from 'react'
import { mediumCirclePhotoStyle } from '../../../components/styles/styles'


export const ListOrganizations = (props) => {
    /* Stateless component for displaying information for the list of organizations the user is
        associated with

    args:
        props: props passed to component
            - data:
                enrolledOrgs: list of dict objects (organization data) indexed with organization id
                pendingOrgs: list of dict objects (organization data) indexed with organization id
            - actions:
                orgClicked: button action to handle clicking on any organization div (pending orgs disabled)
    */
    return(
        <div id="content" className="animated fadeInDown">
            <h3 className="text-center text-danger">My Organizations</h3><hr/>
            <div className="text-center">
                {
                    (Object.keys(props.pendingOrgs).length == 0) ? (
                        (Object.keys(props.enrolledOrgs).length == 0) ? (
                            <div>
                                <p className="text-center text-muted">No Organizations</p>
                            </div>
                        ) : (
                            Object.keys(props.enrolledOrgs).map(function(orgUID) {
                                return(
                                    <div key={orgUID} onClick={() => props.orgClicked(orgUID)} className="col-lg-3 col-md-3 col-sm-4 col-xs-6">
                                        <img src={props.enrolledOrgs[orgUID].logoURL} style={mediumCirclePhotoStyle} /><br/>
                                        <button className="btn btn-link text-center">{props.enrolledOrgs[orgUID].name}</button>
                                    </div>
                                )
                            })
                        )
                    ) : (
                        <div className="tabs-top">
                            <ul className="nav nav-tabs tabs-left" id="demo-pill-nav">
                                <li className="active"><a href="#tab-r1" data-toggle="tab">Enrolled</a></li>
                                <li><a href="#tab-r2" data-toggle="tab">Pending</a></li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane active" id="tab-r1"><br/><br/>
                                    <div className="row">
                                        {
                                            (Object.keys(props.enrolledOrgs).length == 0) ? (
                                                <div>
                                                    <p className="text-center text-muted">No Organizations</p>
                                                </div>
                                            ) : (
                                                Object.keys(props.enrolledOrgs).map(function(orgUID) {
                                                    return(
                                                        <div key={orgUID} onClick={() => props.orgClicked(orgUID)} className="col-lg-3 col-md-3 col-sm-4 col-xs-6">
                                                            <img src={props.enrolledOrgs[orgUID].logoURL} style={mediumCirclePhotoStyle} /><br/>
                                                            <button className="btn btn-link text-center">{props.enrolledOrgs[orgUID].name}</button>
                                                        </div>
                                                    )
                                                })
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="tab-pane" id="tab-r2"><br/><br/>
                                    <div className="row">
                                        {
                                            Object.keys(props.pendingOrgs).map(function(orgUID) {
                                                return(
                                                    <div key={orgUID} className="col-lg-3 col-md-3 col-sm-4 col-xs-6" disabled>
                                                        <img src={props.pendingOrgs[orgUID].logoURL} style={mediumCirclePhotoStyle} /><br/>
                                                        <button className="btn btn-link text-center" disabled>{props.pendingOrgs[orgUID].name}</button>
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
    )
}
