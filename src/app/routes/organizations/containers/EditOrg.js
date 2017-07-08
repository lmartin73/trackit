import React from 'react'
import { push, goBack } from 'react-router-redux'
import { connect } from 'react-redux'
import JarvisWidget from '../../../components/widgets/JarvisWidget'
import UiValidate from '../../../components/forms/validation/UiValidate'
import countries from '../../../components/forms/commons/countries'
import { fileDefs }  from '../../../components/forms/commons/form_defines'
import Organization from '../../../_be/organizations/Organization'
import { LoadingSpinner } from '../../../components/loading-spinner/LoadingSpinner'
import { smallAlertMessage } from '../../../components/alert-messaging/AlertMessaging'
import { bigCirclePhotoStyle, boxShadowStyle, backgroundImageStyle, textfieldStyle } from '../../../components/styles/styles'


const mapStateToProps = (state, ownProps) => {
    /* Maps redux states to local props

    args:
        state: app state from the redux store
        ownProps: props passed to component through pushing route
    returns:
        dict object with the following attributes:
            - orgUID: organization id
    */
    return {
        orgUID: ownProps.location.query.orgUID
    }
}

const mapDispatchToProps = (dispatch) => {
    /* Maps the redux dispatch calls to local props

    args:
        dispatch: dispatch action method from the redux store
    returns:
        dict object with the following attributes:
            - dispatch_route: method to push a route to the DOM
            - cancel_udpate: method to cancel changes and go back to `organization details`
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
    // Component to allow user to edit organization profile

    constructor(props) {
        /* Init method for this component

        args:
            props: props passed to this component
        */
        super(props);

        // Bind methods to this pointer
        this.logoHandler = this.logoHandler.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.mailingAddressCheckboxHandler = this.mailingAddressCheckboxHandler.bind(this);

        // Initialize new organization object
        this.organization = new Organization(this.props.orgUID);

        /*Initialize local state
            - organization: initialized to organization object that was created
            - mailingAddressChecked: boolean reflecting if mailing address is the same as
                physical address or not
        */
        this.state = {
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
                /* action handler for form submission

                    The modified data used to submit this data is located in `this.state.organization`
                    - We need to bind this method to the `this` pointer of this component
                        so we can access the methods and data of this component
                    - After success, dispatch `detail organization` route, passing in the same orgUID so that the
                        new `detail organization` component is rendered with the new data
                args:
                    form: javascript form object
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
        /* Action handler for when a new file (photo) is selected
            - Todo: Fix image rendering issue. Some iamges render rotated 90 deg, due to image metadata

        args:
            event: javascript event
        */
        event.preventDefault();
        var reader = new FileReader();
        reader.onload = function (e) {
            /* Call back method for when file successfully loads as data URL

            args:
                e: javascript event
            */
            // Update photoURL
            this.setState({organization: {logoURL: e.target.result}});
        }.bind(this)

        // Check file meets requirements
        if (this.refs.imageSelect.files.length == fileDefs.SELECTED_FILES_COUNT) {
            var file = this.refs.imageSelect.files[fileDefs.SELECTED_FILE_INDEX];
            if (file.size <= fileDefs.MAX_FILE_SIZE) {
                // Read file and convert to URL
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
        /* Action handler for when any input value changes

        This method is used to update the selected field in the profile object
        and is also used for handling input masking on the `phone` and `state` fields of the profile
            - If phone has 7 digits, adds a dash to the phone number string
            - If phone has 10 digits, addes parenthesis and dash to phone number string
            - If state has changed, convert state string to uppercase

        args:
            event: javascript event
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
        /* Action handler for mailing address `same as physical address` checkbox

        args:
            event: javascript event
        */
        // Update state
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
        // Renders the data to the DOM

        return(
            <div id="content" className="container-fluid animated fadeInDown">
                <h3 className="text-center text-danger">Edit Organization</h3><hr/>
                <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1" style={boxShadowStyle}>
                    <UiValidate options={this.validationOptions}>
                        <form id="checkout-form" className="smart-form" noValidate="novalidate">
                            <fieldset>
                                <div className="row">
                                    <div className="col-lg-5 col-md-5 col-sm-5">
                                        <div className="text-center">
                                            <div>
                                                <img className="img-thumbnail" name="image" ref="image" style={bigCirclePhotoStyle} src={this.state.organization.logoURL}/><br/>
                                            </div>
                                            <label className="btn btn-link">Select Logo
                                                <input type="file" style={{display: 'none'}} onChange={this.logoHandler}/>
                                            </label><br/><br/>
                                        </div>
                                    </div>
                                    <div className="col-lg-7 col-md-7 col-sm-7">
                                        <section className="col-lg-11 col-md-11 col-sm-11">
                                            <label className="input">
                                                <input type="text" name="name" placeholder="Name" style={textfieldStyle}
                                                                        defaultValue={this.state.organization.name}
                                                                        onChange={this.onInputChange}/>
                                            </label>
                                        </section>
                                        <section className="col-lg-11 col-md-11 col-sm-11">
                                            <label className="input">
                                                <input type="text" name="email" placeholder="Email" style={textfieldStyle}
                                                                        defaultValue={this.state.organization.email}
                                                                        onChange={this.onInputChange}/>
                                            </label>
                                        </section>
                                        <section className="col-lg-11 col-md-11 col-sm-11">
                                            <label className="input">
                                                <input type="text" name="phone" placeholder="Phone" style={textfieldStyle}
                                                                        defaultValue={this.state.organization.phone}
                                                                        onChange={this.onInputChange}/>
                                            </label>
                                        </section>
                                        <section className="col-lg-11 col-md-11 col-sm-11">
                                            <label className="input">
                                                <input type="text" name="fax" placeholder="Fax (optional)" style={textfieldStyle}
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
                                        <textarea rows="2" name="description" style={textfieldStyle}
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
                                            <input type="text" name="p_street1" placeholder="Street 1" style={textfieldStyle}
                                                                        defaultValue={this.state.organization.physicalAddress.street1}
                                                                        onChange={this.onInputChange}/>
                                        </label>
                                    </section>
                                    <section className="col col-6">
                                        <label className="input">
                                            <input type="text" name="p_street2" placeholder="Street 2" style={textfieldStyle}
                                                                        defaultValue={this.state.organization.physicalAddress.street2}
                                                                        onChange={this.onInputChange}/>
                                        </label>
                                    </section>
                                </div>
                                <div className="row">
                                    <section className="col col-3">
                                        <label className="input">
                                            <input type="text" name="p_city" placeholder="City" style={textfieldStyle}
                                                                        defaultValue={this.state.organization.physicalAddress.city}
                                                                        onChange={this.onInputChange}/>
                                        </label>
                                    </section>
                                    <section className="col col-3">
                                        <label className="input">
                                            <input type="text" name="p_state" id="state" placeholder="State" style={textfieldStyle}
                                                                        defaultValue={this.state.organization.physicalAddress.state}
                                                                        onChange={this.onInputChange}/>
                                        </label>
                                    </section>
                                    <section className="col col-3">
                                        <label className="input">
                                            <input type="text" name="p_zip" id="zip" placeholder="Zip" style={textfieldStyle}
                                                                        defaultValue={this.state.organization.physicalAddress.zip}
                                                                        onChange={this.onInputChange}/>
                                        </label>
                                    </section>
                                    <section className="col col-3">
                                        <label className="select">
                                            <select name="p_country" defaultValue={this.state.organization.physicalAddress.country}
                                                                    style={textfieldStyle} onChange={this.onInputChange}>
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
                                                                                    style={textfieldStyle}
                                                                                    defaultValue={this.state.organization.mailingAddress.street1}
                                                                                    onChange={this.onInputChange}/>
                                                        </label>
                                                </section>
                                                <section className="col col-6">
                                                    <label className="input">
                                                        <input type="text" name="m_street2" ref="m_street2" placeholder="Street 2"
                                                                                    style={textfieldStyle}
                                                                                    defaultValue={this.state.organization.mailingAddress.street2}
                                                                                    onChange={this.onInputChange}/>
                                                    </label>
                                                </section>
                                            </div>
                                            <div className="row">
                                                <section className="col col-3">
                                                    <label className="input">
                                                        <input type="text" name="m_city" ref="m_city" placeholder="City"
                                                                                    style={textfieldStyle}
                                                                                    defaultValue={this.state.organization.mailingAddress.city}
                                                                                    onChange={this.onInputChange}/>
                                                    </label>
                                                </section>
                                                <section className="col col-3">
                                                    <label className="input">
                                                        <input type="text" name="m_state" ref="m_state" placeholder="State"
                                                                                    style={textfieldStyle}
                                                                                    defaultValue={this.state.organization.mailingAddress.state}
                                                                                    onChange={this.onInputChange}/>
                                                    </label>
                                                </section>
                                                <section className="col col-3">
                                                    <label className="input">
                                                        <input type="text" name="m_zip" ref="m_zip" placeholder="Zip"
                                                                                    style={textfieldStyle}
                                                                                    defaultValue={this.state.organization.mailingAddress.zip}
                                                                                    onChange={this.onInputChange}/>
                                                    </label>
                                                </section>
                                                <section className="col col-3">
                                                    <label className="select">
                                                        <select name="m_country" ref="m_country" defaultValue={this.state.organization.mailingAddress.country}
                                                                                    style={textfieldStyle} onChange={this.onInputChange}>
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
                            <footer style={{backgroundColor: 'white'}}>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                                <button type="button" className="btn btn-default" onClick={() => {this.props.cancel_update()}}>Cancel</button>
                            </footer>
                        </form>
                    </UiValidate>
                </div>
            </div>
        )
    }
}

// Connect state and dispatch to component props
export default connect(mapStateToProps, mapDispatchToProps)(EditOrg)
