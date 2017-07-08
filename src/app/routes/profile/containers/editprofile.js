import React from 'react'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import countries from '../../../components/forms/commons/countries'
import { phoneTypes, addressTypes, fileDefs }  from '../../../components/forms/commons/form_defines'
import UiValidate from '../../../components/forms/validation/UiValidate'
import { smallAlertMessage } from '../../../components/alert-messaging/AlertMessaging'
import { updateUserProfile } from './ProfileActions'
import { LoadingSpinner } from '../../../components/loading-spinner/LoadingSpinner'
import { PROFILE_UPDATED } from './ProfileConstants'
import { bigCirclePhotoStyle, boxShadowStyle, textfieldStyle } from '../../../components/styles/styles'


const mapStateToProps = (state) => {
    /* Maps redux states to local props

    args:
        state: app state from the redux store
    returns:
        dict object with the following attributes:
            - profile: current user profile
            - profile_loading: boolean if profile is loading or not
            - profile_state: current state of the profile
    */
    return {
        profile: state.profile.profile,
        profile_loading: state.profile.isLoading,
        profile_state: state.profile.profile_state
    }
}

const mapDispatchToProps = (dispatch) => {
    /* Maps the redux dispatch calls to local props

    args:
        dispatch: dispatch action method from the redux store
    returns:
        dict object with the following attributes:
            - update_profile: method to update the user profile with the modified information
            - back_to_profile: method to push the `profile` route to the DOM
    */
    return {
        update_profile: (profile) => {dispatch(updateUserProfile(profile))},
        back_to_profile: () => {dispatch(push('myaccount/profile'))}
    }
}

class EditProfile extends React.Component {
    // Component to allow user to edit their profile information

    constructor(props) {
        /*Init method for this component

        args:
            props: props passed to this component
        */
        super(props);

        // Bind methods to this
        this.photoHandler = this.photoHandler.bind(this);
        this.onChange = this.onInputChange.bind(this);

        /* The profile object in the local state is initialized to the
            current profile object in the redux store
                - This allows initializing the state to be much easier
                - This also allows the local state to already have the correct
                    data structure for the profile
        */
        this.state = {
            profile: this.props.profile
        }

        // form validation options
        this.validationOptions = {
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
                    required: true
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
                    maxlength: 2
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
            // Messages will show if validation rules aren't followed
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
                    required: "Phone Number Required"
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
            },
            submitHandler: function(form) {
                /* action handler for form submission

                    The modified data used to submit this data is located in `this.state.profile`
                    - We need to bind this method to the `this` pointer of this component
                        so we can access the methods and data of this component
                args:
                    form: javascript form object
                */
                this.props.update_profile(this.state.profile)
            }.bind(this)
        };
    }

    componentWillReceiveProps(newprops) {
        /* Action handler for prop updates

            Here, we can check the updated profile state
            - if it has successfully updated, then we can go back to the profile route
              and show a nice little success alert message :)

        args:
            newprops: props passed to this component
        */
        if (newprops.profile_state === PROFILE_UPDATED) {
            var message_title = 'Successful'
            var message_description = 'Profile updated!'
            var type = 'success'
            this.props.back_to_profile()
            smallAlertMessage(message_title, message_description, type)
        }
    }

    photoHandler(event) {
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
            this.setState({profile: {photoURL: e.target.result}});
        }.bind(this)
        if (this.refs.imageSelect.files.length == fileDefs.SELECTED_FILES_COUNT) {
            var file = this.refs.imageSelect.files[fileDefs.SELECTED_FILE_INDEX];
            if (file.size <= fileDefs.MAX_FILE_SIZE) {
                // Read file and convert to url
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
            value = value.toUpperCase();
            event.target.value = value;
        }
        // Update state
        var new_state = {profile: {...this.state.profile}};
        new_state[profile_key][event.target.name] = value;
        this.setState(new_state);
    }

    render() {
        // Renders the data to the DOM

        // Show loading spinner with specified text if profile is loading/updating
        if (this.props.profile_loading) {
            return <LoadingSpinner text='Saving profile...' />
        }

        return(
            <div id="content" className="container-fluid animated fadeInDown">
                <h3 className="text-center text-danger">Edit Profile</h3><hr/>
                <div className="col-lg-10 col-lg-offset-1 col-md-10 col-md-offset-1" style={boxShadowStyle}>
                    <UiValidate options={this.validationOptions}>
                        <form id="checkout-form" className="smart-form" noValidate="novalidate">
                            <fieldset>
                                <div className="row">
                                    <div className="col-lg-4 col-md-4">
                                        <div className="text-center">
                                            <div className="">
                                                <img className="img-thumbnail" name="image" style={bigCirclePhotoStyle} src={this.state.profile.photoURL}/><br/>
                                            </div>
                                            <label className="btn btn-link">Select Photo
                                                <input type="file" name="imageSelect" ref="imageSelect" style={{display: 'none'}} onChange={this.photoHandler}/>
                                            </label><br/><br/>
                                        </div>
                                    </div>
                                    <br/>
                                    <div className="col-lg-8 col-md-8">
                                        <section className="col col-xs-6">
                                            <label className="input">
                                                <input type="text" name="firstname" placeholder="First Name" style={textfieldStyle}
                                                                            defaultValue={this.state.profile.firstname}
                                                                            onChange={this.onChange}/>
                                            </label>
                                        </section>
                                        <section className="col col-xs-6">
                                            <label className="input">
                                                <input type="text" name="lastname" placeholder="Last Name" style={textfieldStyle}
                                                                            defaultValue={this.state.profile.lastname}
                                                                            onChange={this.onChange}/>
                                            </label>
                                        </section>
                                        <section className="col col-xs-12">
                                            <label className="input">
                                                <input type="email" name="email" placeholder="Email" style={textfieldStyle}
                                                                            defaultValue={this.state.profile.email}
                                                                            onChange={this.onChange}/>
                                            </label>
                                        </section>
                                        <section className="col col-xs-6">
                                                <label className="input">
                                                    <input type="tel" name="phone" placeholder="Phone" style={textfieldStyle}
                                                                            defaultValue={this.state.profile.phone}
                                                                            onChange={this.onChange} />
                                                </label>
                                        </section>
                                        <section className="col col-xs-6">
                                            <label className="select">
                                                <select name="phone_type" style={textfieldStyle}
                                                                            defaultValue={this.state.profile.phone_type}
                                                                            onChange={this.onChange}>
                                                    <option value="" disabled>Phone Type</option>
                                                    {
                                                        phoneTypes.map(function(type) {
                                                            return(
                                                                <option key={type} value={type}>{type}</option>
                                                            )
                                                        })
                                                    }
                                                </select><i/>
                                            </label>
                                        </section>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <br/>
                                <div className="row">
                                    <section className="col col-6">
                                            <label className="input">
                                                <input type="text" name="street1" placeholder="Street 1"
                                                                            style={textfieldStyle}
                                                                            defaultValue={this.state.profile.street1}
                                                                            onChange={this.onChange}/>
                                            </label>
                                    </section>
                                    <section className="col col-6">
                                        <label className="input">
                                            <input type="text" name="street2" placeholder="Street 2"
                                                                            style={textfieldStyle}
                                                                            defaultValue={this.state.profile.street2}
                                                                            onChange={this.onChange}/>
                                        </label>
                                    </section>
                                </div>
                                <div className="row">
                                    <section className="col col-6">
                                        <label className="input">
                                            <input type="text" name="city" placeholder="City"
                                                                            style={textfieldStyle}
                                                                            defaultValue={this.state.profile.city}
                                                                            onChange={this.onChange}/>
                                        </label>
                                    </section>
                                    <section className="col col-2">
                                        <label className="input">
                                            <input type="text" name="state" placeholder="State"
                                                                            style={textfieldStyle}
                                                                            defaultValue={this.state.profile.state}
                                                                            onChange={this.onChange}/>
                                        </label>
                                    </section>
                                    <section className="col col-4">
                                        <label className="input">
                                            <input type="text" name="zip" placeholder="Zip" style={textfieldStyle}
                                                                            defaultValue={this.state.profile.zip}
                                                                            onChange={this.onChange}/>
                                        </label>
                                    </section>
                                </div>
                                <div className="row">
                                    <section className="col col-8">
                                        <label className="select">
                                            <select name="country" style={textfieldStyle}
                                                                            defaultValue={this.state.profile.country}
                                                                            onChange={this.onChange}>
                                                <option value="" disabled>Country</option>
                                                    {
                                                        countries.map((country) => {
                                                            return <option key={country.key} value={country.value}>{country.value}</option>
                                                        })
                                                    }
                                            </select><i/>
                                        </label>
                                    </section>
                                    <section className="col col-4">
                                        <label className="select">
                                            <select name="address_type" style={textfieldStyle}
                                                                            defaultValue={this.state.profile.address_type}
                                                                            onChange={this.onChange}>
                                                <option value="" disabled>Address Type</option>
                                                {
                                                    addressTypes.map(function(type) {
                                                        return(
                                                            <option key={type} value={type}>{type}</option>
                                                        )
                                                    })
                                                }
                                            </select><i/>
                                        </label>
                                    </section>
                                </div>
                            </fieldset>
                            <fieldset>
                                <br/><p>All required fields must be completed before saving.</p><br/>
                            </fieldset>
                            <footer style={{backgroundColor: "white"}}>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                                <button type="button" className="btn btn-default">Cancel</button>
                            </footer>
                        </form>
                    </UiValidate>
                </div>
            </div>
        )
    }
};

// Connect state and dispatch to component props
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)