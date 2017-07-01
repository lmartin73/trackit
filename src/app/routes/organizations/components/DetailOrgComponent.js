import React from 'react'
import { BigBreadcrumbs } from '../../../components'
import JarvisWidget from '../../../components/widgets/JarvisWidget'

/*
    Dumb component for displaying details of a specific organization
*/
export const DetailOrgComponent = (props) => {
    return(
        <div id="content" className="container-fluid animated fadeInDown">
            <div className="row">
                <BigBreadcrumbs items={['Organizations', 'My Organizations', props.org.name]} icon="fa fa-fw fa-users"
                                className="col-xs-12 col-sm-7 col-md-7 col-lg-4"/>
            </div>
            <div className="row col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1">
                <JarvisWidget colorbutton={true} editbutton={false} data-widget-fullscreenbutton="true"
                                                        custombutton={false} data-widget-sortable="false">
                    <header><h2>Details</h2></header>
                    <div className="widget-body">
                        <div className="pull-right">
                            <button className="btn btn-primary" onClick={props.editClicked}>Edit</button>&nbsp;&nbsp;
                            <button className="btn btn-default" onClick={props.leaveClicked}>Leave</button>
                        </div>
                        <br/><hr/>
                        <div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 text-right">
                            <img src={props.org.logoURL} style={{objectFit: 'cover', height: "100px", width: "100px"}}/>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                            <h1><span className="semi-bold">{props.org.name}</span><br/>
                                <small>{props.org.physicalAddress.city}, {props.org.physicalAddress.state}</small>
                            </h1>
                            <p className="text-muted">
                                <i className="fa fa-envelope" />&nbsp;&nbsp;<a href={"mailto:"+props.org.email}>{props.org.email}</a>
                            </p>
                            <p className="text-muted">
                                <i className="fa fa-phone" />&nbsp;&nbsp;<span className="txt-color-darken">{props.org.phone}</span>
                            </p>
                        </div>
                    </div>
                </JarvisWidget>
            </div>
            <div className="row col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1">
                <JarvisWidget colorbutton={true} editbutton={false} data-widget-fullscreenbutton="true"
                                                        custombutton={false} data-widget-sortable="false">
                    <header><h2>Members</h2></header>
                    <div className="widget-body">
                        <div className="tabs-top">
                            <ul className="nav nav-tabs tabs-left" id="demo-pill-nav">
                                <li className="active">
                                    <a href="#tab-r1" data-toggle="tab">Owners</a>
                                </li>
                                <li>
                                    <a href="#tab-r2" data-toggle="tab">Administrators</a>
                                </li>
                                <li>
                                    <a href="#tab-r3" data-toggle="tab">Members</a>
                                </li>
                            </ul>
                            <div className="tab-content pre-scrollable">
                                <div className="tab-pane active" id="tab-r1">
                                    <br/><br/>
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6">
                                            <div className="panel panel-default">
                                                <div className="form-inline">
                                                    &nbsp;&nbsp;<img src={props.owner.photoURL} style={{objectFit: 'cover', height: "50px", width: "50px"}}/>
                                                    <button className="btn btn-link">{props.owner.firstname + " " + props.owner.lastname}</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="tab-pane" id="tab-r2">
                                    <br/><br/>
                                    <div className="row">
                                        {
                                            (props.administrators.length == 0) ? (
                                                <div>
                                                    <p className="text-center text-default">No Administrators</p>
                                                </div>
                                            ) : (
                                                props.administrators.map(function(mem) {
                                                    return(
                                                        <div key={mem.uid} className="col-lg-6 col-md-6 col-sm-6">
                                                            <div className="panel panel-default">
                                                                <div className="form-inline">
                                                                    &nbsp;&nbsp;<img src={mem.photoURL} style={{objectFit: 'cover', height: "50px", width: "50px"}}/>
                                                                    <button className="btn btn-link">{mem.firstname + " " + mem.lastname}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="tab-pane" id="tab-r3">
                                    <br/><br/>
                                    <div className="row">
                                        {
                                            (props.members.length == 0) ? (
                                                <div>
                                                    <p className="text-center text-default">No Members</p>
                                                </div>
                                            ) : (
                                                props.members.map(function(mem) {
                                                    return(
                                                        <div key={mem.uid} className="col-lg-6 col-md-6 col-sm-6">
                                                            <div className="panel panel-default">
                                                                <div className="form-inline">
                                                                    &nbsp;&nbsp;<img src={mem.photoURL} style={{objectFit: 'cover', height: "50px", width: "50px"}}/>
                                                                    <button className="btn btn-link">{mem.name}</button>
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
                </JarvisWidget>
            </div>
            <div className="row col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1">
                {/*
                    Temporary data table (For listing organization inventory updates)
                */}
                <JarvisWidget editbutton={false}>
                    <header>
                        <span className="widget-icon"> <i className="fa fa-table"/> </span>
                        <h2>Inventory Updates</h2>
                    </header>
                    <div>
                        <div className="widget-body no-padding">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr><th>Data</th></tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>#Datahere</td></tr>
                                        <tr><td>#Datahere</td></tr>
                                        <tr><td>#Datahere</td></tr>
                                        <tr><td>#Datahere</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </JarvisWidget>
            </div>
        </div>
    )
}
