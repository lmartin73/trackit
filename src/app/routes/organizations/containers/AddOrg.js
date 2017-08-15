import React from 'react'
import ReactDOM from 'react-dom'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import countries from '../../../components/forms/commons/countries'
import { LoadingSpinner } from '../../../components/loading-spinner/LoadingSpinner'
import { smallAlertMessage } from '../../../components/alert-messaging/AlertMessaging'
import { fileDefs }  from '../../../components/forms/commons/form_defines'
import Organization from '../../../_be/organizations/Organization'
import { bigCirclePhotoStyle, boxShadowStyle, textfieldStyle } from '../../../components/styles/styles'


// Constants for wizard
const STEP_ID_LIST = ['tab1', 'tab2', 'tab3', 'tab4'];
const TIMEOUT = 3000;

const mapStateToProps = (state) => {
    /* Maps redux states to local props

    args:
        state: app state from the redux store
    returns:
        dict object with the following attributes:
            - Todo: add needed state objects
    */
    return {
        profile: this.state
    }
}

const mapDispatchToProps = (dispatch) => {
    /* Maps the redux dispatch calls to local props

    args:
        dispatch: dispatch action method from the redux store
    returns:
        dict object with the following attributes:
            - dispatch_route: method to push a route to the DOM
    */
    return {
        dispatch_route: (route) => {
            dispatch(push(route))
        }
    }
}

class AddOrg extends React.Component {
    // Component to allow user to add a new organization

    constructor() {
        // Init method for this component
        super();

        // Bind methods to this pointer
        this.onComplete= this.onWizardComplete.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.logoHandler = this.logoHandler.bind(this);
        this.mailingAddressCheckboxHandler = this.mailingAddressCheckboxHandler.bind(this);
        this.onNextClicked = this.onNextClicked.bind(this);
        this.onPreviousClicked = this.onPreviousClicked.bind(this);
        this.handlerWizardReactions = this.handlerWizardReactions.bind(this);

        this.stepToValidate = 1

        /*Initialize local state
            - organization: structure where organization data is stored
            - mailingAddressChecked: boolean for whether mailing address is same as physical address or not
        */
        this.state = {
            organization: {
                name: '',
                email: '',
                phone: '',
                fax: '',
                logoURL: 'assets/img/avatars/sunny.png',
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
            mailingAddressChecked: false,
            wizard: {
                currentStep: 1,
                prevStep: null,
            },
            validationMessage: ''
        }
    }

    componentDidMount() {
        /* Action handler for when the component successfully mounts

        Here, we just want to disable the previous button from being clicked,
        since we are initially on step 1
        */
        this.refs.prevBtn.disabled = true;
    }

    onWizardComplete(data) {
        /* Action handler for when user has successfully completed the wizard

        Here, we will submit organization join request and dispatch to list orgs
        The new organization will be appended to the list of pending organizations for the user
            - organization Data is located at `this.state.organization.organization`
            - user data (if needed) is located at `this.props.profile`
        */
        // Todo: create new organization
        var message_title = 'Success!'
        var message_description = 'Organization created!'
        var type = 'success'
        this.props.dispatch_route('organizations/listorgs')
        smallAlertMessage(message_title, message_description, type)
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
        if (event.target.name.startsWith('p_')) {
            // Each physical address input field name starts with p_
            // Remove it to get the actually input name used in the organization
            var name = event.target.name.replace('p_', '');
            var new_state = {
                organization: {...this.state.organization,
                    physicalAddress: {...this.state.physicalAddress,
                        name: value
                    }
                }
            };
        } else if (event.target.name.startsWith('m_')) {
            // Each mailing address input field name starts with m_
            // Remove it to get the actually input name used in the organization
            var name = event.target.name.replace('m_', '');
            var new_state = {
                organization: {...this.state.organization,
                    mailingAddress: {...this.state.mailingAddress,
                        name: value
                    }
                }
            };
        } else {
            // All other fields
            var name = event.target.name;
            var new_state = {
                organization: {...this.state.organization,
                    name: value
                }
            };
        }
        this.setState(new_state);
    }

    mailingAddressCheckboxHandler(event) {
        /* Action handler for check box value change

        This method updates the state (mailing address object) when the `mailing same as physical address`
        checkbox value changes.
            - If selected, copy physical address object to mailing address object
            - If not selected, clear mailing address object

        args:
            javascript onchange event
        */
        this.setState({mailingAddressChecked: event.target.checked});
        if (event.target.checked) {
            // Copy physical address to mailing address (this.state)
            var new_state = {
                organization: {...this.state.organization,
                    mailingAddress: this.state.organization.physicalAddress
                }
            };
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
            var new_state = {
                organization: {...this.state.organization,
                    mailingAddress: clear_mailingAddress
                }
            };
        }
        // Update state
        this.setState(new_state);
    }

    onNextClicked(event) {
        /* Action handler for wizard next button click

        This method is to validate current step inputs and make a decision on whether
        navigating to the next step is allowed or not

        args:
            event: javascript onclick event
        */
        event.preventDefault();

        // Validate all input fields (Check for each step)
        if (!this.stepValid()) {
            if (this.state.wizard.currentStep == 1) {
                var message = "All Fields Are Required"
            } else {
                var message = "Description Required"
            }
            this.setState({validationMessage: message})
            setTimeout(() => {
                this.setState({validationMessage: ''});
            }, TIMEOUT);
            return
        } else if (this.state.wizard.currentStep == 4) {
            // Wizard successfully completed
            this.onComplete();
            return
        }
        // Move to next step
        this.setStep(this.state.wizard.currentStep + 1);
    }

    onPreviousClicked(event) {
        /* Action handler for wizard previous button click

        This method will navigate to the previous step, allowing user to backtrack if needed
        We can disable the previous button if the current step is 2

        args:
            event: javascript onclick event
        */
        event.preventDefault();
        this.setStep(this.state.wizard.currentStep - 1);
    }

    handlerWizardReactions() {
        /* Handler for the wizard header reactions (tab headers and buttons)

        This method will change the classNames (text color) of the current and previous tabs
        We can safely assume that the other tabs will remain with gray text (`text-muted`) as initialized
            - remove gray color (`text-muted`) from current step header title and add red color (`text-danger`)
            - remove red color (`text-danger`) from previous step header title and add gray color (`text-muted`)
        This method also handles reactions of the wizard buttons
            - Disable previous button if on first step, enable if not
            - Set next button text to `Finish` if on last step, set to `Next` if not

        */
        document.getElementById(STEP_ID_LIST[this.state.wizard.currentStep - 1]).classList.remove('text-muted')
        document.getElementById(STEP_ID_LIST[this.state.wizard.currentStep - 1]).classList.add('text-success')
        document.getElementById(STEP_ID_LIST[this.state.wizard.prevStep - 1]).classList.remove('text-success')
        document.getElementById(STEP_ID_LIST[this.state.wizard.prevStep - 1]).classList.add('text-muted')

        if (this.state.wizard.currentStep == 1) {
            // Disable button
            this.refs.prevBtn.disabled = true;
        } else if (this.state.wizard.currentStep == 4) {
            // Last step
           this.refs.nextBtn.innerText = "Finish";
        } else {
            // Check before enabling again (may already be enabled)
            if (this.refs.prevBtn.disabled) {
                this.refs.prevBtn.disabled = false;
            }
            // Check before setting Next again (may already be next)
            if (this.refs.nextBtn.innerText == "Finish") {
                this.refs.nextBtn.innerText = "Next";
            }
        }
        // When the user changes tabs, the component re-renders, and scrolls to top
        ReactDOM.findDOMNode(this).scrollIntoView();
    }

    setStep(step) {
        /* Sets the current step in the wizard

        This method simply updates the current step attribute in the local state,
        as the DOM re-renders due to the state update, showing the new step
        As a callback to the state update, we update the wizard tab headers and button texts

        args:
            step: int
        */
        this.stepToValidate = step
        var new_state = {wizard: {currentStep: step, prevStep: this.state.wizard.currentStep}};
        this.setState(new_state, this.handlerWizardReactions);
    }

    stepValid() {
        /* Validate input fields in step (Check values in this.state)

        args:
            step: int
        returns:
            boolean
        */
        switch(this.stepToValidate) {
            case 1:
                return (
                    this.state.organization.name != "" &&
                    this.state.organization.email != "" &&
                    this.state.organization.phone != "" &&
                    this.state.organization.fax != "" &&
                    this.state.organization.physicalAddress.street1 != "" &&
                    this.state.organization.physicalAddress.street2 != "" &&
                    this.state.organization.physicalAddress.city != "" &&
                    this.state.organization.physicalAddress.state != "" &&
                    this.state.organization.physicalAddress.zip != "" &&
                    this.state.organization.physicalAddress.country != "" &&
                    this.state.organization.mailingAddress.street1 != "" &&
                    this.state.organization.mailingAddress.street2 != "" &&
                    this.state.organization.mailingAddress.city != "" &&
                    this.state.organization.mailingAddress.state != "" &&
                    this.state.organization.mailingAddress.zip != "" &&
                    this.state.organization.mailingAddress.country != ""
                )
            case 2:
                return (
                    this.state.organization.description != ""
                )
        }
    }

    render() {
        // Render content to the DOM

        return(
            <div id="content" className="container-fluid animated fadeInDown">
                <h3 className="text-center text-danger">Create Organization</h3><hr/><br/>
                <div className="col-sm-8 col-sm-offset-2 col-xs-12 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3" style={boxShadowStyle}>
                    <form className="smart-form" ref="form" id="form" noValidate="novalidate">
                        <fieldset>
                            <div className="text-center">
                                <h5 className="col-xs-3 text-success" id="tab1">BASIC INFO</h5>
                                <h5 className="col-xs-3 text-muted" id="tab2">MORE INFO</h5>
                                <h5 className="col-xs-3 text-muted" id="tab3">VERIFY</h5>
                                <h5 className="col-xs-3 text-muted" id="tab4">FINISH</h5>
                            </div>
                        </fieldset>
                        <fieldset>
                            {
                                (() => {
                                    switch(this.state.wizard.currentStep) {
                                        case 1:
                                            // Step 1
                                            return (
                                                <div>
                                                    <h5><strong>Step 1 </strong> - Basic Info</h5>
                                                    <br/><br/>
                                                    <div className="row">
                                                        <section className="col col-6">
                                                            <label className="input">
                                                                <input name="name" placeholder="Name" style={textfieldStyle} onChange={this.onInputChange}/>
                                                            </label>
                                                        </section>
                                                        <section className="col col-6">
                                                            <label className="input">
                                                                <input name="email" placeholder="Email" style={textfieldStyle} onChange={this.onInputChange}/>
                                                            </label>
                                                        </section>
                                                        <section className="col col-6">
                                                            <label className="input">
                                                                <input name="phone" placeholder="Phone" style={textfieldStyle} onChange={this.onInputChange}/>
                                                            </label>
                                                        </section>
                                                        <section className="col col-6">
                                                            <label className="input">
                                                                <input name="fax" placeholder="Fax (optional)" style={textfieldStyle} onChange={this.onInputChange}/>
                                                            </label>
                                                        </section>
                                                    </div>

                                                    <hr/><br/>
                                                    <h6>Physical Address</h6><br/>
                                                    <div className="row">
                                                        <section className="col col-6">
                                                            <label className="input">
                                                                <input name="p_street1" placeholder="Street 1" style={textfieldStyle} onChange={this.onInputChange}/>
                                                            </label>
                                                        </section>
                                                        <section className="col col-6">
                                                            <label className="input">
                                                                <input name="p_street2" placeholder="Street 2" style={textfieldStyle} onChange={this.onInputChange}/>
                                                            </label>
                                                        </section>
                                                        <section className="col col-3">
                                                            <label className="input">
                                                                <input name="p_city" placeholder="City" style={textfieldStyle} onChange={this.onInputChange}/>
                                                            </label>
                                                        </section>
                                                        <section className="col col-3">
                                                            <label className="input">
                                                                <input name="p_state" placeholder="State" style={textfieldStyle} onChange={this.onInputChange}/>
                                                            </label>
                                                        </section>
                                                        <section className="col col-3">
                                                            <label className="input">
                                                                <input name="p_zip" placeholder="Zip" style={textfieldStyle} onChange={this.onInputChange}/>
                                                            </label>
                                                        </section>
                                                        <section className="col col-3">
                                                            <label className="select">
                                                                <select name="p_country" style={textfieldStyle} onChange={this.onInputChange}>
                                                                    <option value="" disabled>Country</option>
                                                                        {countries.map((country)=>{
                                                                            return <option key={country.key} value={country.value}>{country.value}</option>
                                                                            })
                                                                        }
                                                                </select><i/>
                                                            </label>
                                                        </section>
                                                    </div>
                                                    <hr/><br/>
                                                    <h6>Mailing Address</h6><br/>
                                                    <div className="row">
                                                        <div className="col col-12">
                                                            <label className="checkbox">
                                                                <input type="checkbox" onChange={this.mailingAddressCheckboxHandler} />
                                                                <i/>Same as physical address
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <br/>
                                                    {
                                                        (!this.state.mailingAddressChecked) ? (
                                                            <div className="row">
                                                                <section className="col col-6">
                                                                    <label className="input">
                                                                        <input name="m_street1" placeholder="Street 1" style={textfieldStyle} onChange={this.onInputChange}/>
                                                                    </label>
                                                                </section>
                                                                <section className="col col-6">
                                                                    <label className="input">
                                                                        <input name="m_street2" placeholder="Street 2" style={textfieldStyle} onChange={this.onInputChange}/>
                                                                    </label>
                                                                </section>
                                                                <section className="col col-3">
                                                                    <label className="input">
                                                                        <input name="m_city" placeholder="City" style={textfieldStyle} onChange={this.onInputChange}/>
                                                                    </label>
                                                                </section>
                                                                <section className="col col-3">
                                                                    <label className="input">
                                                                        <input name="m_state" placeholder="State" style={textfieldStyle} onChange={this.onInputChange}/>
                                                                    </label>
                                                                </section>
                                                                <section className="col col-3">
                                                                    <label className="input">
                                                                        <input name="m_zip" placeholder="Zip" style={textfieldStyle} onChange={this.onInputChange}/>
                                                                    </label>
                                                                </section>
                                                                <section className="col col-3">
                                                                    <label className="select">
                                                                        <select name="m_country" style={textfieldStyle} onChange={this.onInputChange}>
                                                                            <option value="" disabled>Country</option>
                                                                                {countries.map((country)=>{
                                                                                    return <option key={country.key} value={country.value}>{country.value}</option>
                                                                                    })
                                                                                }
                                                                        </select><i/>
                                                                    </label>
                                                                </section>
                                                            </div>
                                                        ) : null
                                                    }
                                                    <hr/><br/><br/><p>All required fields must be complete.</p><br/>
                                                </div>
                                            )
                                        case 2:
                                            // Step 2
                                            return (
                                                <div>
                                                    <h5><strong>Step 2 </strong> - Logo and Description</h5>
                                                    <br/><br/><p className="text-center">Select a logo for your organization!</p><br/>
                                                    <div className="row">
                                                        <div className="text-center">
                                                            <div>
                                                                <img ref="image" style={bigCirclePhotoStyle}
                                                                                 src={this.state.organization.logoURL}/><br/>
                                                            </div>
                                                            <label className="btn btn-link">Select Logo
                                                                <input ref="imageSelect" type="file" style={{display: 'none'}} onChange={this.logoHandler}/>
                                                            </label><br/><br/>
                                                        </div>
                                                    </div>
                                                    <hr/><br/>
                                                    <h6>Description</h6><br/>
                                                    <div className="row">
                                                        <section className="col col-xs-12">
                                                            <label className="textarea">
                                                                <textarea rows="4" name="description"
                                                                    placeholder="Here, include a brief description describing your organization."
                                                                    style={textfieldStyle} onChange={this.onInputChange} />
                                                            </label>
                                                        </section>
                                                    </div>
                                                </div>
                                            )
                                        case 3:
                                            // Step 3
                                            return (
                                                <div>
                                                    <h5><strong>Step 3 </strong> - Verify Information</h5>
                                                    <br/><br/><p className="text-center">Verify that all information below is correct.</p><br/>
                                                    <div className="row">
                                                        <section className="col col-4 text-center">
                                                            <div><img style={bigCirclePhotoStyle} src={this.state.organization.logoURL}/></div>
                                                        </section><br/>
                                                        <section className="col col-8">
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
                                                        </section>
                                                    </div>
                                                </div>
                                            )
                                        case 4:
                                            // Step 4
                                            return (
                                                <div>
                                                    <h5><strong>Step 4 </strong> - Finish</h5><br/>
                                                    <div className="row">
                                                        <h3 className="text-center text-success"><strong><i className="fa fa-check"/> Complete</strong></h3><br/>
                                                        <h5 className="text-center">Information verified for <strong>{this.state.organization.name}</strong></h5><br/>
                                                        <div className="text-center">
                                                            <div><img style={bigCirclePhotoStyle} src={this.state.organization.logoURL}/></div>
                                                        </div><br/>
                                                    </div>
                                                    <div className="row">
                                                        <div className="text-center">
                                                            <h5 className="text-center">Click finish to save your Organization!</h5><br/>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                    }
                                })()
                            }
                            <p className="text-center text-warning">
                                {this.state.validationMessage}
                            </p>
                        </fieldset>
                        <footer style={{backgroundColor: 'white'}}>
                            <button ref="nextBtn" onClick={this.onNextClicked} className="btn pull-right btn-success"
                                                        style={{borderRadius: "10px"}}>Next</button>
                            <button ref="prevBtn" onClick={this.onPreviousClicked} className="btn btn-default pull-left"
                                                        style={{borderRadius: "10px"}}>Previous</button>
                        </footer>
                    </form>
                </div>
            </div>
        )
    }
}

// Connect state and dispatch to component props
export default connect(mapStateToProps, mapDispatchToProps)(AddOrg)
