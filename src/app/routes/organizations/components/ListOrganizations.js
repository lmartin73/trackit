import React from 'react'
import { BigBreadcrumbs } from '../../../components'
import JarvisWidget from '../../../components/widgets/JarvisWidget'

/*
    Dumb component for listing organizations current user is associated with
*/
export const ListOrganizations = (props) => {


    return(
        <div id="content" className="animated fadeInDown">
            <div className="row">
                <BigBreadcrumbs items={['Organizations', 'My Organizations']} icon="fa fa-fw fa-users"
                                className="col-xs-12 col-sm-7 col-md-7 col-lg-4"/>
            </div>
            <div className="row col-lg-10 col-lg-offset-1">
                <JarvisWidget colorbutton={true} editbutton={false} data-widget-fullscreenbutton="true" custombutton={false} data-widget-sortable="false">
                    <header><h2>Organizations</h2></header>
                    <div>
                        <div className="widget-body">
                            <div className="tabs-top">
                                <ul className="nav nav-tabs tabs-left" id="demo-pill-nav">
                                    <li className="active"><a href="#tab-r1" data-toggle="tab">Active</a></li>
                                    <li><a href="#tab-r2" data-toggle="tab">Pending</a></li>
                                </ul>
                                <div className="tab-content">
                                    <div className="tab-pane active" id="tab-r1"><br/><br/>
                                        <div className="row">
                                            {
                                                (props.enrolledOrgs.length == 0) ? (
                                                    <div>
                                                        <p className="text-center text-default">No Active Organizations</p>
                                                    </div>
                                                ) : (
                                                    props.enrolledOrgs.map(function(orgUID) {
                                                        return(
                                                            <div key={orgUID} className="col-lg-6 col-md-6 col-sm-6">
                                                                <div className="panel panel-default">
                                                                    <div className="form-inline">
                                                                        <img src={props.enrolledOrgs[orgUID].logoURL} style={{objectFit: 'cover', height: "60px", width: "60px"}} />
                                                                        <button className="btn btn-link" disabled>{props.enrolledOrgs[orgUID].name}</button>
                                                                    </div>
                                                                </div>
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
                                                (props.pendingOrgs.length == 0) ? (
                                                    <div>
                                                        <p className="text-center text-default">No Pending Organizations</p>
                                                    </div>
                                                ) : (
                                                    props.pendingOrgs.map(function(orgUID) {
                                                        return(
                                                            <div key={orgUID} className="col-lg-6 col-md-6 col-sm-6">
                                                                <div className="panel panel-default">
                                                                    <div className="form-inline">
                                                                        <img src={props.pendingOrgs[orgUID].logoURL} style={{objectFit: 'cover', height: "60px", width: "60px"}} />
                                                                        <button className="btn btn-link" disabled>{props.pendingOrgs[orgUID].name}</button>
                                                                    </div>
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
                    </div>
                </JarvisWidget>
            </div>
        </div>
    )
}