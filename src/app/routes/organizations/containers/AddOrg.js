import React from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import JarvisWidget from '../../../components/widgets/JarvisWidget'
import Wizard from '../../../components/forms/wizards/Wizard'
import UiValidate from '../../../components/forms/validation/UiValidate'
import countries from '../../../components/forms/commons/countries'
import { BigBreadcrumbs } from '../../../components'
import { SmartMessageBox } from "../../../components/utils/actions/MessageActions"
import { smallAlertMessage } from '../../../components/alert-messaging/AlertMessaging'


export default class AddOrg extends React.Component {
    /*
        Component to allow user to add a new organization
    */
    constructor() {
        super();
        // Bind methods to this pointer
        this.onComplete= this.onWizardComplete.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.logoHandler = this.logoHandler.bind(this);
        this.mailingAddressCheckboxHandler = this.mailingAddressCheckboxHandler.bind(this);

        // Initialize local state
        this.state = {
            organization: {
                name: '',
                email: '',
                phone: '',
                fax: '',
                description: '',
                physicalAddress: {
                    street1: '',
                    steet2: '',
                    city: '',
                    state: '',
                    zip: '',
                    country: ''
                },
                mailingAddress: {
                    street1: '',
                    steet2: '',
                    city: '',
                    state: '',
                    zip: '',
                    country: ''
                }
            },
            mailingAddressChecked: false
        }

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
                name: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                phone: {
                    required: true,
                },
                description: {
                    required: true,
                },
                p_street1: {
                    required: true
                },
                p_street2: {
                    required: false
                },
                p_city: {
                    required: true
                },
                p_state: {
                    required: true,
                    minlength: 2,
                    maxlength: 2,
                },
                p_zip: {
                    required: true,
                    minlength: 5,
                    maxlength: 10
                },
                p_country: {
                    required: true
                },
                m_street1: {
                    required: true
                },
                m_street2: {
                    required: false
                },
                m_city: {
                    required: true
                },
                m_state: {
                    required: true,
                    minlength: 2,
                    maxlength: 2,
                },
                m_zip: {
                    required: true,
                    minlength: 5,
                    maxlength: 10
                },
                m_country: {
                    required: true
                }
            },
            // Messages will show if validation rules aren't followed
            messages: {
                firstname: {
                    required: "Name Required"
                },
                email: {
                    required: 'Email Required',
                    email: 'Invalid Email Address'
                },
                phone: {
                    required: "Phone Number Required"
                },
                description: {
                    required: "Description Required"
                },
                p_street1: {
                    required: "Street Required"
                },
                p_city: {
                    required: "City Required"
                },
                p_state: {
                    required: "State Required"
                },
                p_zip: {
                    required: "Zip Code Required"
                },
                p_country: {
                    required: "Country Required"
                },
                m_street1: {
                    required: "Street Required"
                },
                m_city: {
                    required: "City Required"
                },
                m_state: {
                    required: "State Required"
                },
                m_zip: {
                    required: "Zip Code Required"
                },
                m_country: {
                    required: "Country Required"
                }
            }
        };
    }

    onWizardComplete(data){
        /*
            Submit data from wizard, creating organization
            - Todo: create new organization
        */
        var message_title = 'Success!'
        var message_description = 'Organization created!'
        var type = 'success'
        this.props.dispatch_route('organizations/listorgs')
        smallAlertMessage(message_title, message_description, type)
    }

    logoHandler(event) {
        /*
            handler for when user selects new photo for organization logo
            - Todo: fix image rendering issue. Some images render rotated 90 deg, due to image metadata
        */
        event.preventDefault();
        var reader = new FileReader();
        reader.onload = function (e) {
            this.setState({organization: {logoURL: e.target.result}});
        }.bind(this)
        if (this.refs.imageSelect.files.length == fileDefs.SELECTED_FILES_COUNT) {
            var file = this.refs.imageSelect.files[fileDefs.SELECTED_FILE_INDEX];
            if (file.size <= fileDefs.MAX_FILE_SIZE) {
                reader.readAsDataURL(file);
            } else {
                // Custom alert box if file too large
                var message_title = 'Alert!'
                var message_description = 'Photo too large. Please choose another one.'
                var type = 'danger'
                smallAlertMessage(message_title, message_description, type)
            }
        }
    }

    onInputChange(event) {
        /*
            Used for input masking (phone and state)

            - If phone has 7 digits, adds dash
            - If phone has 10 digits, adds parenthesis and dash
            - Convert state to uppercase
        */
        event.preventDefault();
        var org_key = 'organization';
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

        } else if (event.target.name == "p_state" || event.target.name  == "m_state") {
            value = value.toUpperCase();
            event.target.value = value;
        }

        // Update state
        var new_state = {organization: {...this.state.organization}};
        if (event.target.name.startsWith('p_')) {
            // Each physical address input field name starts with p_
            // Remove it to get the actually input name used in the organization
            var name = event.target.name.replace('p_', '');
            var physicalAddr_key = 'physicalAddress';
            new_state[org_key][physicalAddr_key][name] = value;

        } else if (event.target.name.startsWith('m_')) {
            // Each mailing address input field name starts with m_
            // Remove it to get the actually input name used in the organization
            var name = event.target.name.replace('m_', '');
            var mailingAddr_key = 'mailingAddress';
            new_state[org_key][mailingAddr_key][name] = value;

        } else {
            // All other fields
            new_state[org_key][event.target.name] = value;
        }
        this.setState(new_state);
    }

    mailingAddressCheckboxHandler(event) {
        this.setState({mailingAddressChecked: event.target.checked});
        if (event.target.checked) {
            // Copy physical address to mailing address (this.state)
            var new_state = {organization: {...this.state.organization, mailingAddress: this.state.organization.physicalAddress}}
        } else {
            // Clear mailing address fields in state
            var clear_mailingAddress = {
                street1: '',
                street2: '',
                city: '',
                state: '',
                zip: '',
                country: ''
            }
            var new_state = {organization: {...this.state.organization, mailingAddress: clear_mailingAddress}}
        }
        this.setState(new_state);
    }

    render() {
        return(
            <div id="content" className="container-fluid animated fadeInDown">
                <div className="row">
                    <BigBreadcrumbs items={['Organizations', 'New Organization']} icon="fa fa-fw fa-users"
                                    className="col-xs-12 col-sm-7 col-md-7 col-lg-4"/>
                </div><br/>
                <div className="row">
                    <div className="col-sm-12 col-xs-12 col-md-10 col-md-offset-1 col-lg-10 col-lg-offset-1">
                        <article>
                            <JarvisWidget editbutton={false} deletebutton={false} color="darken">
                                <header>
                                    <span className="widget-icon"><i className="fa fa-user"/></span><h2>New Organization</h2>
                                </header>
                                <div>
                                    <div className="widget-body">
                                        <div className="row">
                                            <UiValidate options={this.validateOptions}>
                                                <form noValidate="novalidate">
                                                    <Wizard className="col-sm-12" compCode="0" onComplete={this.onComplete}>
                                                        <div className="form-bootstrapWizard clearfix">
                                                            <ul className="bootstrapWizard">
                                                                <li data-smart-wizard-tab="1">
                                                                    <span className="step">1</span> <span className="title">Basic Info</span>
                                                                </li>
                                                                <li data-smart-wizard-tab="2">
                                                                    <span className="step">2</span> <span className="title">Logo/Description</span>
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
                                                                                <input className="form-control" type="text" name="name"
                                                                                                                placeholder="Name"
                                                                                                                onChange={this.onInputChange}/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <div className="input-group">
                                                                                <span className="input-group-addon"><i className="fa fa-envelope fa-lg fa-fw"/></span>
                                                                                <input className="form-control" type="text" name="email"
                                                                                                                placeholder="Email"
                                                                                                                onChange={this.onInputChange}/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <div className="input-group">
                                                                                <span className="input-group-addon"><i className="fa fa-phone fa-lg fa-fw"/></span>
                                                                                <input className="form-control" name="phone"
                                                                                                                placeholder="Phone"
                                                                                                                onChange={this.onInputChange}/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <div className="input-group">
                                                                                <span className="input-group-addon"><i className="fa fa-fax fa-lg fa-fw"/></span>
                                                                                <input className="form-control" name="fax"
                                                                                                                placeholder="Fax (optional)"
                                                                                                                onChange={this.onInputChange}/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <hr/>
                                                                <h6>Physical Address</h6>
                                                                <div className="row">
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <div className="input-group">
                                                                                <span className="input-group-addon"><i className="fa fa-location-arrow fa-lg fa-fw"/></span>
                                                                                <input className="form-control" type="text" name="p_street1"
                                                                                                                placeholder="Street 1"
                                                                                                                onChange={this.onInputChange}/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-6">
                                                                        <div className="form-group">
                                                                            <div className="input-group">
                                                                                <span className="input-group-addon"><i className="fa fa-location-arrow fa-lg fa-fw"/></span>
                                                                                <input className="form-control" type="text" name="p_street2"
                                                                                                                placeholder="Street 2"
                                                                                                                onChange={this.onInputChange}/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-sm-3">
                                                                        <div className="form-group">
                                                                            <input className="form-control" type="text" name="p_city"
                                                                                                            placeholder="City"
                                                                                                            onChange={this.onInputChange}/>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-3">
                                                                        <div className="form-group">
                                                                            <input className="form-control" type="text" name="p_state"
                                                                                                            placeholder="State"
                                                                                                            onChange={this.onInputChange}/>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-3">
                                                                        <div className="form-group">
                                                                            <input className="form-control" type="text" name="p_zip"
                                                                                                            placeholder="Zip"
                                                                                                            onChange={this.onInputChange}/>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-sm-3">
                                                                        <div className="form-group">
                                                                            <select name="p_country" className="form-control" onChange={this.onInputChange}>
                                                                                <option value="" disabled>Country</option>
                                                                                    {countries.map((country)=>{
                                                                                        return <option key={country.key} value={country.value}>{country.value}</option>
                                                                                        })
                                                                                    }
                                                                            </select><i/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <hr/>
                                                                <h6>Mailing Address</h6>
                                                                <div className="col-xs-12">
                                                                    <label className="checkbox">
                                                                        &nbsp;&nbsp;<input type="checkbox" onChange={this.mailingAddressCheckboxHandler} />
                                                                        <i/>Same as physical address
                                                                    </label>
                                                                </div>
                                                                <br/>
                                                                {
                                                                    (!this.state.mailingAddressChecked) ? (
                                                                        <div>
                                                                            <div className="row">
                                                                                <div className="col-sm-6">
                                                                                    <div className="form-group">
                                                                                        <div className="input-group">
                                                                                            <span className="input-group-addon"><i className="fa fa-location-arrow fa-lg fa-fw"/></span>
                                                                                            <input className="form-control" type="text" name="m_street1"
                                                                                                                            placeholder="Street 1"
                                                                                                                            onChange={this.onInputChange}/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-6">
                                                                                    <div className="form-group">
                                                                                        <div className="input-group">
                                                                                            <span className="input-group-addon"><i className="fa fa-location-arrow fa-lg fa-fw"/></span>
                                                                                            <input className="form-control" type="text" name="m_street2"
                                                                                                                            placeholder="Street 2"
                                                                                                                            onChange={this.onInputChange}/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="col-sm-3">
                                                                                    <div className="form-group">
                                                                                        <input className="form-control" type="text" name="m_city"
                                                                                                                        placeholder="City"
                                                                                                                        onChange={this.onInputChange}/>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-3">
                                                                                    <div className="form-group">
                                                                                        <input className="form-control" type="text" name="m_state"
                                                                                                                        placeholder="State"
                                                                                                                        onChange={this.onInputChange}/>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-3">
                                                                                    <div className="form-group">
                                                                                        <input className="form-control" type="text" name="m_zip"
                                                                                                                        placeholder="Zip"
                                                                                                                        onChange={this.onInputChange}/>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-3">
                                                                                    <div className="form-group">
                                                                                        <select name="m_country" className="form-control" onChange={this.onInputChange}>
                                                                                            <option value="" disabled>Country</option>
                                                                                                {countries.map((country)=>{
                                                                                                    return <option key={country.key} value={country.value}>{country.value}</option>
                                                                                                    })
                                                                                                }
                                                                                        </select><i/>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div></div>
                                                                    )
                                                                }
                                                            </div>
                                                            <div className="tab-pane" data-smart-wizard-pane="2">
                                                                <br/><h3><strong>Step 2 </strong> - Logo and Description</h3><hr/>
                                                                <h5 className="text-center">Select a logo for your organization!</h5><br/>
                                                                <div className="row">
                                                                    <div className="text-center">
                                                                        <div>
                                                                            <img ref="image" className="img-thumbnail"
                                                                                                style={{objectFit: 'cover', height: "120px", width: "120px"}}
                                                                                                src="assets/img/avatars/user.png"/><br/>
                                                                        </div>
                                                                        <label className="btn btn-link">Select Logo
                                                                            <input ref="imageSelect" type="file" style={{display: 'none'}} onChange={this.logoHandler}/>
                                                                        </label><br/><br/>
                                                                    </div>
                                                                </div>
                                                                <hr/>
                                                                <div className="row">
                                                                    <div className="col-sm-10 col-sm-offset-1">
                                                                        <h6>Description</h6>
                                                                        <div className="form-group">
                                                                            <textarea rows="2" name="description"
                                                                                placeholder="Here, include a brief description describing your organization."
                                                                                className="form-control" onChange={this.onInputChange} />
                                                                        </div>
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
                                                                                    <td><p className="text-muted">{this.state.organization.name}</p></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td><p className="text-muted"><strong><i className="fa fa-envelope"/>&nbsp;&nbsp;Email:</strong></p></td>
                                                                                    <td><p className="text-muted">{this.state.organization.email}</p></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td><p className="text-muted"><strong><i className="fa fa-phone"/>&nbsp;&nbsp;Phone:</strong></p></td>
                                                                                    <td><p className="text-muted">{this.state.organization.phone}</p></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td><p className="text-muted"><strong><i className="fa fa-fax"/>&nbsp;&nbsp;Fax:</strong></p></td>
                                                                                    {
                                                                                        (this.state.organization.fax != '') ? (
                                                                                            <td><p className="text-muted">{this.state.organization.fax}</p></td>
                                                                                        ) : (
                                                                                            <td><p className="text-muted">N/A</p></td>
                                                                                        )
                                                                                    }
                                                                                </tr>
                                                                                <tr>
                                                                                    <td><p className="text-muted"><strong><i className="fa fa-align-left"/>&nbsp;&nbsp;Description:</strong></p></td>
                                                                                    <td><p className="text-muted">{this.state.organization.description}</p></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td><p className="text-muted"><strong><i className="fa fa-map-marker"/>&nbsp;&nbsp;Physical Address:</strong></p></td>
                                                                                    <td>
                                                                                        {
                                                                                            (this.state.organization.physicalAddress.street2) ? (
                                                                                                <p className="text-muted">{this.state.organization.physicalAddress.street1 + " " + this.state.organization.physicalAddress.street2}<br/>
                                                                                                    {this.state.organization.physicalAddress.city + ", " + this.state.organization.physicalAddress.state + " " + this.state.organization.physicalAddress.zip}<br/>
                                                                                                    {this.state.organization.physicalAddress.country}
                                                                                                </p>
                                                                                            ) : (
                                                                                                <p className="text-muted">{this.state.organization.physicalAddress.street1}<br/>
                                                                                                    {this.state.organization.physicalAddress.city + ", " + this.state.organization.physicalAddress.state + " " + this.state.organization.physicalAddress.zip}<br/>
                                                                                                    {this.state.organization.physicalAddress.country}
                                                                                                </p>
                                                                                            )
                                                                                        }
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td><p className="text-muted"><strong><i className="fa fa-map-marker"/>&nbsp;&nbsp;Mailing Address:</strong></p></td>
                                                                                    <td>
                                                                                        {
                                                                                            (this.state.organization.mailingAddress.street2) ? (
                                                                                                <p className="text-muted">{this.state.organization.mailingAddress.street1 + " " + this.state.organization.mailingAddress.street2}<br/>
                                                                                                    {this.state.organization.mailingAddress.city + ", " + this.state.organization.mailingAddress.state + " " + this.state.organization.mailingAddress.zip}<br/>
                                                                                                    {this.state.organization.mailingAddress.country}
                                                                                                </p>
                                                                                            ) : (
                                                                                                <p className="text-muted">{this.state.organization.mailingAddress.street1}<br/>
                                                                                                    {this.state.organization.mailingAddress.city + ", " + this.state.organization.mailingAddress.state + " " + this.state.organization.mailingAddress.zip}<br/>
                                                                                                    {this.state.organization.mailingAddress.country}
                                                                                                </p>
                                                                                            )
                                                                                        }
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
                                                                    <h1 className="text-center">Thanks!</h1>
                                                                    <h4 className="text-center">Information verified for <strong>{this.state.name}</strong></h4>
                                                                    <div className="text-center">
                                                                        <div><img style={{objectFit: 'cover', height: "100px", width: "100px"}} src="assets/img/avatars/user.png"/></div>
                                                                    </div><br/><br/>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="text-center">
                                                                        <h1 className="text-center text-success"><strong><i className="fa fa-check"/> Complete</strong></h1>
                                                                        <h4 className="text-center">Click next to save your Organization!</h4><br/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="form-actions">
                                                                <div className="row">
                                                                    <div className="col-sm-12">
                                                                        <ul className="pager wizard no-margin">
                                                                            <li className="previous" data-smart-wizard-prev="">
                                                                                <a className="btn btn-lg btn-default">Previous</a>
                                                                            </li>
                                                                            <li className="next" data-smart-wizard-next="">
                                                                                <a className="btn btn-lg txt-color-darken">Next</a>
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
                    </div>
                </div>
            </div>
        )
    }
}