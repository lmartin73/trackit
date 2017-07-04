import React from 'react'
import { push, goBack } from 'react-router-redux'
import { connect } from 'react-redux'
import { BigBreadcrumbs } from '../../../components'
import JarvisWidget from '../../../components/widgets/JarvisWidget'
import UiValidate from '../../../components/forms/validation/UiValidate'
import countries from '../../../components/forms/commons/countries'
import { fileDefs }  from '../../../components/forms/commons/form_defines'
import Organization from '../../../_be/organizations/Organization'
import { LoadingSpinner } from '../../../components/loading-spinner/LoadingSpinner'
import { smallAlertMessage } from '../../../components/alert-messaging/AlertMessaging'


const mapStateToProps = (state, ownProps) => {
    // Maps redux states to local props
    return {
        orgUID: ownProps.location.query.orgUID
    }
}

const mapDispatchToProps = (dispatch) => {
    /*
        Maps the redux dispatch calls to local props
        - Todo: return update_profile method
    */
    return {
        dispatch_route: (route) => {
            dispatch(push(route))
        },
        cancel_update: () => {
            dispatch(goBack())
        }
    }
}

class EditOrg extends React.Component {
    /*
        Component to allow user to edit organization profile
    */
    constructor(props) {
        super(props);
        // Bind methods to this pointer
        this.logoHandler = this.logoHandler.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.mailingAddressCheckboxHandler = this.mailingAddressCheckboxHandler.bind(this);

        this.organization = new Organization(this.props.orgUID);

        // Initialize local state
        this.state = {
            // Todo: subject to change. Setting to organization object may be too much
            organization: this.organization,
            mailingAddressChecked: false
        }

        // form validations options
        this.validationOptions = {
            // rules for validation
            rules: {
                name: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                phone: {
                    required: true
                },
                description: {
                    required: true
                },
                p_street1: {
                    required: true
                },
                p_city: {
                    required: true
                },
                p_state: {
                    required: true,
                },
                p_zip: {
                    required: true,
                },
                p_country: {
                    required: true
                },
                m_street1: {
                    required: true
                },
                m_city: {
                    required: true
                },
                m_state: {
                    required: true,
                },
                m_zip: {
                    required: true,
                },
                m_country: {
                    required: true
                }
            },
            // Messages will show if validation rules aren't followed
            messages: {
                name: {
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
            },
            submitHandler: function(form) {
                /*
                    All validation is successful
                    Update organization information
                    - Todo: may need to modify updateOrganizationInfo method to have a call back
                */
                this.organization.updateOrganizationInfo(this.state.organization);
                var message_title = 'Success'
                var message_description = 'Organization successfully updated!'
                var type = 'success'
                this.props.dispatch_route({
                    pathname: 'organization/detailorg',
                    query: {
                        orgUID: this.props.orgUID
                    }
                })
                smallAlertMessage(message_title, message_description, type)
            }.bind(this)
        };
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
                    <BigBreadcrumbs items={['Organizations', 'My Organizations', 'org name']} icon="fa fa-fw fa-users"
                                    className="col-xs-12 col-sm-7 col-md-7 col-lg-4"/>
                </div>
                <div className="row">
                    <article className="col-sm-10 col-sm-offset-1 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
                        <JarvisWidget editbutton={false} custombutton={false}>
                            <header>
                                <span className="widget-icon"> <i className="fa fa-edit"/> </span>
                                <h2>Edit Organization</h2>
                            </header>
                            <div className="widget-body">
                                <UiValidate options={this.validationOptions}>
                                    <form id="checkout-form" className="smart-form" noValidate="novalidate">
                                        <fieldset>
                                            <div className="row">
                                                <div className="col-lg-5 col-md-5 col-sm-5">
                                                    <div className="text-center">
                                                        <div>
                                                            <img className="img-thumbnail" style={{objectFit: 'cover', height: "120px", width: "120px"}} src={''}/><br/>
                                                        </div>
                                                        <label className="btn btn-link">Select Logo
                                                            <input type="file" style={{display: 'none'}} onChange={this.logoHandler}/>
                                                        </label><br/><br/>
                                                    </div>
                                                </div>
                                                <div className="col-lg-7 col-md-7 col-sm-7">
                                                    <section className="col-lg-11 col-md-11 col-sm-11">
                                                        <label className="input"> <i className="icon-prepend fa fa-user"/>
                                                            <input type="text" name="name" placeholder="Name"
                                                                                    defaultValue={this.state.organization.name}
                                                                                    onChange={this.onInputChange}/>
                                                        </label>
                                                    </section>
                                                    <section className="col-lg-11 col-md-11 col-sm-11">
                                                        <label className="input"> <i className="icon-prepend fa fa-envelope-o"/>
                                                            <input type="text" name="email" placeholder="Email"
                                                                                    defaultValue={this.state.organization.email}
                                                                                    onChange={this.onInputChange}/>
                                                        </label>
                                                    </section>
                                                    <section className="col-lg-11 col-md-11 col-sm-11">
                                                        <label className="input"> <i className="icon-prepend fa fa-user"/>
                                                            <input type="text" name="phone" placeholder="Phone"
                                                                                    defaultValue={this.state.organization.phone}
                                                                                    onChange={this.onInputChange}/>
                                                        </label>
                                                    </section>
                                                    <section className="col-lg-11 col-md-11 col-sm-11">
                                                        <label className="input"> <i className="icon-prepend fa fa-user"/>
                                                            <input type="text" name="fax" placeholder="Fax (optional)"
                                                                                    defaultValue={this.state.organization.fax}
                                                                                    onChange={this.onInputChange}/>
                                                        </label>
                                                    </section>
                                                </div>
                                            </div>
                                            <br/>
                                        </fieldset>
                                        <fieldset>
                                            <h5>Description</h5>
                                            <br/>
                                            <div className="row">
                                                <section className="col col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                  <label className="textarea textarea-resizable">
                                                    <textarea rows="2" name="description"
                                                        placeholder="Here, include a brief description describing your organization."
                                                        className="custom-scroll" defaultValue={this.state.organization.description} onChange={this.onInputChange}/>
                                                  </label>
                                                </section>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <h5>Physical Address</h5>
                                            <br/>
                                            <div className="row">
                                                <section className="col col-6">
                                                    <label className="input">
                                                        <input type="text" name="p_street1" placeholder="Street 1"
                                                                                    defaultValue={this.state.organization.physicalAddress.street1}
                                                                                    onChange={this.onInputChange}/>
                                                    </label>
                                                </section>
                                                <section className="col col-6">
                                                    <label className="input">
                                                        <input type="text" name="p_street2" placeholder="Street 2"
                                                                                    defaultValue={this.state.organization.physicalAddress.street2}
                                                                                    onChange={this.onInputChange}/>
                                                    </label>
                                                </section>
                                            </div>
                                            <div className="row">
                                                <section className="col col-3">
                                                    <label className="input">
                                                        <input type="text" name="p_city" placeholder="City"
                                                                                    defaultValue={this.state.organization.physicalAddress.city}
                                                                                    onChange={this.onInputChange}/>
                                                    </label>
                                                </section>
                                                <section className="col col-3">
                                                    <label className="input">
                                                        <input type="text" name="p_state" id="state" placeholder="State"
                                                                                    defaultValue={this.state.organization.physicalAddress.state}
                                                                                    onChange={this.onInputChange}/>
                                                    </label>
                                                </section>
                                                <section className="col col-3">
                                                    <label className="input">
                                                        <input type="text" name="p_zip" id="zip" placeholder="Zip"
                                                                                    defaultValue={this.state.organization.physicalAddress.zip}
                                                                                    onChange={this.onInputChange}/>
                                                    </label>
                                                </section>
                                                <section className="col col-3">
                                                    <label className="select">
                                                        <select name="p_country" defaultValue={this.state.organization.physicalAddress.country} onChange={this.onInputChange}>
                                                            <option value="" disabled>Country</option>
                                                                {countries.map((country)=>{
                                                                    return <option key={country.key} value={country.value}>{country.value}</option>
                                                                    })
                                                                }
                                                        </select><i/>
                                                    </label>
                                                </section>
                                            </div>
                                        </fieldset>
                                        <fieldset>
                                            <h5>Mailing Address</h5><br/>
                                            <label className="checkbox">
                                                <input type="checkbox" onChange={this.mailingAddressCheckboxHandler} />
                                                <i/>Same as physical address
                                            </label>
                                            <br/>
                                            {
                                                (!this.state.mailingAddressChecked) ? (
                                                    <div>
                                                        <div className="row">
                                                            <section className="col col-6">
                                                                    <label className="input">
                                                                        <input type="text" name="m_street1" ref="m_street1" placeholder="Street 1"
                                                                                                defaultValue={this.state.organization.mailingAddress.street1}
                                                                                                onChange={this.onInputChange}/>
                                                                    </label>
                                                            </section>
                                                            <section className="col col-6">
                                                                <label className="input">
                                                                    <input type="text" name="m_street2" ref="m_street2" placeholder="Street 2"
                                                                                                defaultValue={this.state.organization.mailingAddress.street2}
                                                                                                onChange={this.onInputChange}/>
                                                                </label>
                                                            </section>
                                                        </div>
                                                        <div className="row">
                                                            <section className="col col-3">
                                                                <label className="input">
                                                                    <input type="text" name="m_city" ref="m_city" placeholder="City"
                                                                                                defaultValue={this.state.organization.mailingAddress.city}
                                                                                                onChange={this.onInputChange}/>
                                                                </label>
                                                            </section>
                                                            <section className="col col-3">
                                                                <label className="input">
                                                                    <input type="text" name="m_state" ref="m_state" placeholder="State"
                                                                                                defaultValue={this.state.organization.mailingAddress.state}
                                                                                                onChange={this.onInputChange}/>
                                                                </label>
                                                            </section>
                                                            <section className="col col-3">
                                                                <label className="input">
                                                                    <input type="text" name="m_zip" ref="m_zip" placeholder="Zip"
                                                                                                defaultValue={this.state.organization.mailingAddress.zip}
                                                                                                onChange={this.onInputChange}/>
                                                                </label>
                                                            </section>
                                                            <section className="col col-3">
                                                                <label className="select">
                                                                    <select name="m_country" ref="m_country" defaultValue={this.state.organization.mailingAddress.country} onChange={this.onInputChange}>
                                                                        <option value="" disabled>Country</option>
                                                                            {countries.map((country)=>{
                                                                                return <option key={country.key} value={country.value}>{country.value}</option>
                                                                                })
                                                                            }
                                                                    </select><i/>
                                                                </label>
                                                            </section>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )
                                            }
                                        </fieldset>
                                        <fieldset>
                                            <br/><p>All required fields must be completed before saving.</p><br/>
                                        </fieldset>
                                        <footer>
                                            <button type="submit" className="btn btn-primary">Save Changes</button>
                                            <button type="button" className="btn btn-default" onClick={() => {this.props.cancel_update()}}>Cancel</button>
                                        </footer>
                                    </form>
                                </UiValidate>
                            </div>
                        </JarvisWidget>
                    </article>
                </div>
            </div>
        )
    }
}

// Connect state and dispatch to component props
export default connect(mapStateToProps, mapDispatchToProps)(EditOrg)
