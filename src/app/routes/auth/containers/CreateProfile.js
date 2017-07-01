import React from 'react'
import JarvisWidget from '../../../components/widgets/JarvisWidget'
import UiValidate from '../../../components/forms/validation/UiValidate'
import Wizard from '../../../components/forms/wizards/Wizard'
import countries from '../../../components/forms/commons/countries'
import WidgetGrid from '../../../components/widgets/WidgetGrid'
import { phoneTypes, addressTypes, fileDefs }  from '../../../components/forms/commons/form_defines'
import { bigBox } from "../../../components/utils/actions/MessageActions";
import { WelcomeContent } from '../components/WelcomeContent'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { smallAlertMessage } from '../../../components/alert-messaging/AlertMessaging'
import { LoadingSpinner } from '../../../components/loading-spinner/LoadingSpinner'
import { updateUserProfile } from '../../profile/containers/ProfileActions'
import { PROFILE_UPDATED } from '../../profile/containers/ProfileConstants'


const mapStateToProps = (state) => {
    /*
        Maps redux states to local props
        - profile: user profile object
        - profile_loading: boolean for whether the profile is loading or not
        - profile_state: current state of the profile
    */
    return {
        profile: state.profile.profile,
        profile_loading: state.profile.isLoading,
        profile_state: state.profile.profile_state
    }
}

const mapDispatchToProps = (dispatch) => {
    /*
        Maps the redux dispatch calls to local props
        - update_profile: method to update profile with new profile information
        - dispatch_route: method to dispatch a new route
    */
    return {
        update_profile: (profile) => {dispatch(updateUserProfile(profile))},
        dispatch_route: (route) => {dispatch(push(route))}
    }
}

class CreateProfile extends React.Component {
    /*
        Allows user to set up their profile after registering
    */
    constructor(props) {
        super(props);
        // Bind methods to this pointer
        this.updateProfileHandler= this.updateProfileHandler.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.photoHandler = this.photoHandler.bind(this);

        // Initialize local state
        this.state = {
            profile: {
                firstname: this.props.profile.firstname,
                lastname: this.props.profile.lastname,
                email: this.props.profile.email,
                phone: '',
                phone_type: '',
                street1: '',
                street2: '',
                city: '',
                state: '',
                zip: '',
                country: '',
                address_type: '',
                photoURL: ''
            }
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

    componentWillReceiveProps(newprops) {
        /*
            Used as a handler for profile updated changes
        */
        if (newprops.profile_state === PROFILE_UPDATED) {
            var message_title = 'Profile Created!'
            var message_description = 'Account Setup Complete!'
            var type = 'success'

            this.props.dispatch_route('/dashboard')
            smallAlertMessage(message_title, message_description, type)
        }
    }

    updateProfileHandler(data){
        /*
            update user profile
            - Data is stored in this.state.profile
        */
        this.props.update_profile(this.state.profile);
    }

    photoHandler(event) {
        /*
            Handler for when user selects new photo for profile picture
            - Todo: Fix image rendering issue. Some images render rotated 90 deg, due to image metadata
        */
        event.preventDefault();
        var reader = new FileReader();
        reader.onload = function (e) {
            this.setState({profile: {photoURL: e.target.result}});
        }.bind(this)
        if (this.refs.imageSelect.files.length == fileDefs.SELECTED_FILES_COUNT) {
            var file = this.refs.imageSelect.files[fileDefs.SELECTED_FILE_INDEX];
            if (file.size <= fileDefs.MAX_FILE_SIZE) {
                reader.readAsDataURL(file);
            } else {
                // show Error message alert box
                var message_title = 'Error!'
                var message_description = 'Photo too large. Please select another one.'
                var type = 'danger'
                smallAlertMessage(message_title, message_description, type)
            }
        }
    }

    onInputChange(event) {
        /*
            Masks input fields (if needed) as user types
            and updates local state
        */
        event.preventDefault();
        var profile_key = 'profile';
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
        // Update state
        var new_state = {profile: {...this.state.profile}};
        new_state[profile_key][event.target.name] = value;
        this.setState(new_state);
    }

    render() {
        // Show loading spinner with specific text if profile is loading
        if (this.props.profile_loading) {
            return <LoadingSpinner text='Saving your profile...' />
        }

        return(
            <div id="extr-page">
                <header id="header" className="animated fadeInDown">
                    <div id="logo-group">
                        <span id="logo"><div><h1 className="logo-name text-center">TrackIt+</h1></div></span>
                    </div>
                    <span id="extr-page-header-space"><span>Welcome, {this.state.profile.firstname}!</span></span>
                </header>
                <div id="main" role="main" className="animated fadeInDown">
                    <div id="content" className="container">
                        <div className="txt-color-red text-center" style={{fontSize: '25px'}}>
                            Welcome to <strong>Trackit+</strong><hr/>
                        </div>
                        <div className="row">
                            <WelcomeContent email={this.state.profile.email}/>
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
                                                                <Wizard className="col-sm-12" onComplete={this.updateProfileHandler}>
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
                                                                                                                            value={this.state.profile.firstname} onChange={this.onInputChange}/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-6">
                                                                                    <div className="form-group">
                                                                                        <div className="input-group">
                                                                                            <span className="input-group-addon"><i className="fa fa-user fa-lg fa-fw"/></span>
                                                                                            <input className="form-control" type="text" name="lastname"
                                                                                                                            ref="lastname" placeholder="Last Name"
                                                                                                                            value={this.state.profile.lastname} onChange={this.onInputChange}/>
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
                                                                                                                            value={this.state.profile.email} onChange={this.onInputChange}/>
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
                                                                                                                            ref="phone" value={this.state.profile.phone} placeholder="Phone" onChange={this.onInputChange}/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-4">
                                                                                    <select className="form-control" name="phone_type"
                                                                                                                            ref="phone_type" defaultValue={this.state.profile.phone_type} onChange={this.onInputChange}>
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
                                                                                            <input className="form-control" type="text" name="street1" value={this.state.profile.street1}
                                                                                                                            ref="street1" placeholder="Street 1"
                                                                                                                            onChange={this.onInputChange}/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-6">
                                                                                    <div className="form-group">
                                                                                        <div className="input-group">
                                                                                            <span className="input-group-addon"><i className="fa fa-location-arrow fa-lg fa-fw"/></span>
                                                                                            <input className="form-control" type="text" name="street2" value={this.state.profile.street2}
                                                                                                                            ref="street2" placeholder="Street 2"
                                                                                                                            onChange={this.onInputChange}/>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="col-sm-6">
                                                                                    <div className="form-group">
                                                                                        <input className="form-control" type="text" name="city" value={this.state.profile.city}
                                                                                                                        ref="city" placeholder="City"
                                                                                                                        onChange={this.onInputChange}/>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-2">
                                                                                    <div className="form-group">
                                                                                        <input className="form-control" type="text" name="state" value={this.state.profile.state}
                                                                                                                        ref="state" placeholder="State"
                                                                                                                        onChange={this.onInputChange}/>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col-sm-4">
                                                                                    <div className="form-group">
                                                                                        <input className="form-control" type="text" name="zip" value={this.state.profile.zip}
                                                                                                                        ref="zip" placeholder="Zip"
                                                                                                                        onChange={this.onInputChange}/>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="row">
                                                                                <div className="col-sm-8">
                                                                                    <div className="form-group">
                                                                                        <select name="country" className="form-control" ref="country" defaultValue={this.state.profile.country} onChange={this.onInputChange}>
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
                                                                                        <select className="form-control" name="address_type" ref="address_type" defaultValue={this.state.profile.address_type} onChange={this.onInputChange}>
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
                                                                                                            src={this.state.profile.photoURL}/><br/>
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
                                                                                                <td><p className="text-muted">{this.state.profile.firstname + " " + this.state.profile.lastname}</p></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td><p className="text-muted"><strong><i className="fa fa-envelope"/>&nbsp;&nbsp;Email:</strong></p></td>
                                                                                                <td><p className="text-muted">{this.state.profile.email}</p></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td><p className="text-muted"><strong><i className="fa fa-phone"/>&nbsp;&nbsp;Phone:</strong></p></td>
                                                                                                <td><p className="text-muted">{this.state.profile.phone}
                                                                                                    <small className="pull-right text-primary">{this.state.profile.phone_type}</small></p></td>
                                                                                            </tr>
                                                                                            <tr>
                                                                                                <td><p className="text-muted"><strong><i className="fa fa-map-marker"/>&nbsp;&nbsp;Address:</strong></p></td>
                                                                                                <td>
                                                                                                    <p className="text-muted">{this.state.profile.street1 + " " + this.state.profile.street2}
                                                                                                    <small className="pull-right text-primary">{this.state.profile.address_type}</small><br/>
                                                                                                        {this.state.profile.city + ", " + this.state.profile.state + " " + this.state.profile.zip}<br/>
                                                                                                        {this.state.profile.country}
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
                                                                                <h1 className="text-center">Thanks, {this.state.profile.firstname}!</h1>
                                                                                <div className="text-center">
                                                                                    <div><img style={{objectFit: 'cover', height: "100px", width: "100px"}} src={this.state.profile.photoURL}/></div>
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

// Connect state and dispatch the component props
export default connect(mapStateToProps, mapDispatchToProps)(CreateProfile)