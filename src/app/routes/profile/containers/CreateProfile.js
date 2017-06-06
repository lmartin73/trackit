import React from 'react'
import JarvisWidget from '../../../components/widgets/JarvisWidget'
import UiValidate from '../../../components/forms/validation/UiValidate'
import Wizard from '../../../components/forms/wizards/Wizard'
import countries from '../../../components/forms/commons/countries'
import WidgetGrid from '../../../components/widgets/WidgetGrid'
import { phoneTypes, addressTypes, fileDefs }  from '../../../components/forms/commons/form_defines'
import { bigBox } from "../../../components/utils/actions/MessageActions";
import { WelcomeContent } from '../components/WelcomeContent'


export default class CreateProfile extends React.Component {
    /*
        Allows user to set up their profile after registering
    */
    constructor() {
        super();
        // Bind methods to this pointer
        this.onComplete= this.onWizardComplete.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.photoHandler = this.photoHandler.bind(this);

        // State used to display user input information on step 3 (Verification)
        // Can not access refs in render method (DOM hasnt been rendered, refs are undefined)
        this.state = {
            firstname: "",            // Get first name after registering
            lastname: "",            // Get last name after registering
            email: "",     // Get email after registering
            phone: "",
            phone_type: "",
            street1: "",
            street2: "",
            city: "",
            state: "",
            zip: "",
            country: "",
            address_type: "",
            photo_url: ""
        };

        // Form validation options
        this.validateOptions = {
            highlight: function (element) {
                $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
            },
            unhighlight: function (element) {
                $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
            },
            errorElement: 'span',
            errorClass: 'help-block',
            // Rules for validation
            rules: {
                firstname: {
                    required: true
                },
                lastname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                phone: {
                    required: true,
                },
                phone_type: {
                    required: true
                },
                street1: {
                    required: true
                },
                city: {
                    required: true
                },
                state: {
                    required: true,
                    minlength: 2,
                    maxlength: 2,
                },
                zip: {
                    required: true,
                    minlength: 5,
                    maxlength: 10
                },
                country: {
                    required: true
                },
                address_type: {
                    required: true
                }
            },
            // Messages will show when validation rules aren't followed
            messages: {
                firstname: {
                    required: "First Name Required"
                },
                lastname: {
                    required: "Last Name Required"
                },
                email: {
                    required: 'Email Required',
                    email: 'Invalid Email Address'
                },
                phone: {
                    required: "Phone Number Required",
                },
                phone_type: {
                    required: "Phone Type Required"
                },
                street1: {
                    required: "Street Required"
                },
                city: {
                    required: "City Required"
                },
                state: {
                    required: "State Required"
                },
                zip: {
                    required: "Zip Code Required"
                },
                country: {
                    required: "Country Required"
                },
                address_type: {
                    required: "Address Type Required"
                }
            }
        };
    }

    onWizardComplete(data){
        /*
            Todo: create user profile
            - use refs to access data from form
            - navigate to home page
        */
    }

    photoHandler(event) {
        /*
            Handler for when user selects new photo for profile picture

            - Todo: Fix image rendering issue. Some images render rotated 90 deg, due to image metadata
        */
        event.preventDefault();
        var reader = new FileReader();
        reader.onload = function (e) {
            this.refs.image.src = e.target.result;
        }.bind(this)
        if (this.refs.imageSelect.files.length == fileDefs.SELECTED_FILES_COUNT) {
            var file = this.refs.imageSelect.files[fileDefs.SELECTED_FILE_INDEX];
            if (file.size <= fileDefs.MAX_FILE_SIZE) {
                reader.readAsDataURL(file);
            } else {
                // Custom alert box if file too large
                bigBox({
                    title: "Error!",
                    content: "Photo too large to upload. Please select another photo...",
                    color: "#C46A69",
                    icon: "fa fa-warning shake animated",
                    timeout: fileDefs.ALERT_TIMEOUT
                });
            }
        }
    }

    // Change the state when user updates information
    // Masked Input was not firing on change event
    // Masked Input value was the raw input value, not the full masked value
    // This code formats the input as it is typed
    onInputChange(event) {
        /*
            Masks input fields (if needed) as user types

            - recieves js event from textfields
        */
        event.preventDefault();
        var value = event.target.value;
        if (event.target.name == "phone") {

            // Remove any unneccessary characters
            value = value.replace(/[^\d]/g, '');
            if (value.length == 7) {

                // Format phone string with middle dash
                value = value.replace(/(\d{3})(\d{4})/, "$1-$2");
            } else if (value.length == 10) {

                // Format phone strong with parenthesis and middle dash
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
            }
            event.target.value = value;
        } else if (event.target.name == "state") {

            // Convert state to all uppercase
            value = value.toUpperCase();
            event.target.value = value;
        }
        var stateChange = {};
        stateChange[event.target.name] = value;
        this.setState(stateChange);
    }

    render() {
        return(
            <div id="extr-page">
                <header id="header" className="animated fadeInDown">
                    <div id="logo-group">
                        <span id="logo"><div><h1 className="logo-name text-center">TrackIt+</h1></div></span>
                    </div>
                    <span id="extr-page-header-space"><span>Welcome, {this.state.firstname}!</span></span>
                </header>
                <div id="main" role="main" className="animated fadeInDown">
                    <div id="content" className="container">
                        <div className="txt-color-red text-center" style={{fontSize: '25px'}}>
                            Welcome to <strong>Trackit+</strong><hr/>
                        </div>
                        <div className="row">
                            <WelcomeContent email={this.state.email}/>
                            <div className="col-sm-12 col-xs-12 col-md-7 col-lg-6">
                                <WidgetGrid>
                                    <article>
                                        <JarvisWidget editbutton={false} deletebutton={false} color="darken">
                                            <header>
                                                <span className="widget-icon"><i className="fa fa-user"/></span><h2>Create Profile</h2>
                                            </header>
                                            <div>
                                                <div className="widget-body">
                                                    <div className="row">
                                                        <UiValidate options={this.validateOptions}>
                                                            <form noValidate="novalidate">
                                                                <Wizard className="col-sm-12" onComplete={this.onComplete}>
                                                                    <div className="form-bootstrapWizard clearfix">
                                                                        <ul className="bootstrapWizard">
                                                                            <li data-smart-wizard-tab="1">
                                                                                <span className="step">1</span> <span className="title">Basic Info</span>
                                                                            </li>
                                                                            <li data-smart-wizard-tab="2">
                                                                                <span className="step">2</span> <span className="title">Profile Photo</span>
                                                                            </li>
                                                                            <li data-smart-wizard-tab="3">
                                                                                <span className="step">3</span> <span className="title">Verify</span>
                                                                            </li>
                                                                            <li data-smart-wizard-tab="4">
                                                                                <span className="step">4</span> <span className="title">Complete</span>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                    <div className="tab-content">
                                                                        <div className="tab-pane" data-smart-wizard-pane="1">
                                                                            <br/><h3><strong>Step 1 </strong> - Basic Info</h3>
                                                                            <h5>All required fields must be complete.</h5><hr/>
                                                                            <div className="row">
                                                                                <div className="col-sm-6">
                                                                                    <div className="form-group">
                                                                                        <div className="input-group">
                                                                                            <span className="input-group-addon"><i className="fa fa-user fa-lg fa-fw"/></span>
                                                                                            <input className="form-control" type="text" name="firstname"
                                                                                                                            ref="firstname" placeholder="First Name"
                                                                                                                            value={this.state.firstname} onChange={this.onInputChange}/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-6">
                                                                                    <div className="form-group">
                                                                                        <div className="input-group">
                                                                                            <span className="input-group-addon"><i className="fa fa-user fa-lg fa-fw"/></span>
                                                                                            <input className="form-control" type="text" name="lastname"
                                                                                                                            ref="lastname" placeholder="Last Name"
                                                                                                                            value={this.state.lastname} onChange={this.onInputChange}/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <hr/>
                                                                            <div className="row">
                                                                                <div className="col-sm-12">
                                                                                    <div className="form-group">
                                                                                        <div className="input-group">
                                                                                            <span className="input-group-addon"><i className="fa fa-envelope fa-lg fa-fw"/></span>
                                                                                            <input className="form-control" type="text" name="email"
                                                                                                                            ref="email" placeholder="Email"
                                                                                                                            value={this.state.email} onChange={this.onInputChange}/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <hr/>
                                                                            <div className="row">
                                                                                <div className="col-sm-8">
                                                                                    <div className="form-group">
                                                                                        <div className="input-group">
                                                                                            <span className="input-group-addon"><i className="fa fa-phone fa-lg fa-fw"/></span>
                                                                                            <input className="form-control" name="phone"
                                                                                                                            ref="phone" placeholder="Phone" onChange={this.onInputChange}/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-4">
                                                                                    <select className="form-control" name="phone_type"
                                                                                                                            ref="phone_type" defaultValue="" onChange={this.onInputChange}>
                                                                                        <option value="" disabled>Phone Type</option>
                                                                                        {phoneTypes.map(function(type) {
                                                                                                return(
                                                                                                    <option key={type} value={type}>{type}</option>
                                                                                                )
                                                                                            })
                                                                                        }
                                                                                    </select><i/>
                                                                                </div>
                                                                            </div>
                                                                            <hr/>
                                                                            <div className="row">
                                                                                <div className="col-sm-6">
                                                                                    <div className="form-group">
                                                                                        <div className="input-group">
                                                                                            <span className="input-group-addon"><i className="fa fa-location-arrow fa-lg fa-fw"/></span>
                                                                                            <input className="form-control" type="text" name="street1"
                                                                                                                            ref="street1" placeholder="Street 1"
                                                                                                                            onChange={this.onInputChange}/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-6">
                                                                                    <div className="form-group">
                                                                                        <div className="input-group">
                                                                                            <span className="input-group-addon"><i className="fa fa-location-arrow fa-lg fa-fw"/></span>
                                                                                            <input className="form-control" type="text" name="street2"
                                                                                                                            ref="street2" placeholder="Street 2"
                                                                                                                            onChange={this.onInputChange}/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="col-sm-6">
                                                                                    <div className="form-group">
                                                                                        <input className="form-control" type="text" name="city"
                                                                                                                        ref="city" placeholder="City"
                                                                                                                        onChange={this.onInputChange}/>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-2">
                                                                                    <div className="form-group">
                                                                                        <input className="form-control" type="text" name="state"
                                                                                                                        ref="state" placeholder="State"
                                                                                                                        onChange={this.onInputChange}/>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-4">
                                                                                    <div className="form-group">
                                                                                        <input className="form-control" type="text" name="zip"
                                                                                                                        ref="zip" placeholder="Zip"
                                                                                                                        onChange={this.onInputChange}/>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="col-sm-8">
                                                                                    <div className="form-group">
                                                                                        <select name="country" className="form-control" ref="country" defaultValue="" onChange={this.onInputChange}>
                                                                                            <option value="" disabled>Country</option>
                                                                                                {countries.map((country)=>{
                                                                                                    return <option key={country.key} value={country.value}>{country.value}</option>
                                                                                                    })
                                                                                                }
                                                                                        </select><i/>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-4">
                                                                                    <div className="form-group">
                                                                                        <select className="form-control" name="address_type" ref="address_type" defaultValue="" onChange={this.onInputChange}>
                                                                                            <option value="" disabled>Address Type</option>
                                                                                            {addressTypes.map(function(type) {
                                                                                                    return(
                                                                                                        <option key={type} value={type}>{type}</option>
                                                                                                    )
                                                                                                })
                                                                                            }
                                                                                        </select><i/>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="tab-pane" data-smart-wizard-pane="2">
                                                                            <br/><h3><strong>Step 2 </strong> - Profile Photo</h3><hr/>
                                                                            <h5 className="text-center">Select a photo to use as your profile photo!</h5><br/>
                                                                            <div className="row">
                                                                                <div className="text-center">
                                                                                    <div>
                                                                                        <img ref="image" className="img-thumbnail"
                                                                                                            style={{objectFit: 'cover', height: "120px", width: "120px"}}
                                                                                                            src="assets/img/avatars/user.png"/><br/>
                                                                                    </div>
                                                                                    <label className="btn btn-link">Select Photo
                                                                                        <input ref="imageSelect" type="file" style={{display: 'none'}} onChange={this.photoHandler}/>
                                                                                    </label><br/><br/>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="tab-pane" data-smart-wizard-pane="3">
                                                                            <br/><h3><strong>Step 3 </strong> - Verify</h3><hr/>
                                                                            <h5>Verify that all information below is correct.</h5>
                                                                            <div className="row"><br/>
                                                                                <div className="col-sm-3 text-center">
                                                                                    <div><img style={{objectFit: 'cover', height: "100px", width: "100px"}} src="assets/img/avatars/user.png"/><br/></div>
                                                                                </div><br/>
                                                                                <div className="col-sm-9">
                                                                                    <table className="table table-user-information">
                                                                                        <tbody>
                                                                                            <tr>
                                                                                                <td><p className="text-muted"><strong><i className="fa fa-user"/>&nbsp;&nbsp;Name:</strong></p></td>
                                                                                                <td><p className="text-muted">{this.state.firstname + " " + this.state.lastname}</p></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td><p className="text-muted"><strong><i className="fa fa-envelope"/>&nbsp;&nbsp;Email:</strong></p></td>
                                                                                                <td><p className="text-muted">{this.state.email}</p></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td><p className="text-muted"><strong><i className="fa fa-phone"/>&nbsp;&nbsp;Phone:</strong></p></td>
                                                                                                <td><p className="text-muted">{this.state.phone}
                                                                                                    <small className="pull-right text-primary">{this.state.phonetype}</small></p></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td><p className="text-muted"><strong><i className="fa fa-map-marker"/>&nbsp;&nbsp;Address:</strong></p></td>
                                                                                                <td>
                                                                                                    <p className="text-muted">{this.state.street1 + " " + this.state.street2}
                                                                                                    <small className="pull-right text-primary">{this.state.addresstype}</small><br/>
                                                                                                        {this.state.city + ", " + this.state.state + " " + this.state.zip}<br/>
                                                                                                        {this.state.country}
                                                                                                    </p>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="tab-pane" data-smart-wizard-pane="4"><br/>
                                                                            <h3><strong>Step 4 </strong> - Complete</h3><hr/>
                                                                            <div className="row"><br/>
                                                                                <h1 className="text-center">Thanks, {this.state.firstname}!</h1>
                                                                                <div className="text-center">
                                                                                    <div><img style={{objectFit: 'cover', height: "100px", width: "100px"}} src="assets/img/avatars/user.png"/></div>
                                                                                </div><br/><br/>
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="text-center">
                                                                                    <h1 className="text-center text-success"><strong><i className="fa fa-check"/> Complete</strong></h1>
                                                                                    <h4 className="text-center">Click next to save your profile!</h4><br/>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-actions">
                                                                            <div className="row">
                                                                                <div className="col-sm-12">
                                                                                    <ul className="pager wizard no-margin">
                                                                                        <li className="previous" data-smart-wizard-prev="">
                                                                                            <a href="#" className="btn btn-lg btn-default">Previous</a>
                                                                                        </li>
                                                                                        <li className="next" data-smart-wizard-next="">
                                                                                            <a href="#" className="btn btn-lg txt-color-darken">Next</a>
                                                                                        </li>
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Wizard>
                                                            </form>
                                                        </UiValidate>
                                                    </div>
                                                </div>
                                            </div>
                                        </JarvisWidget>
                                    </article>
                                </WidgetGrid>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}