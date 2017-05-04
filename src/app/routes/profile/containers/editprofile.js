import React from 'react'
import { push } from 'react-router-redux'
import store from '../../../store/configureStore'
import countries from '../../../components/forms/commons/countries'
import { phoneTypes, addressTypes }  from '../../../components/forms/commons/form_defines'
import UiValidate from '../../../components/forms/validation/UiValidate'
import JarvisWidget from '../../../components/widgets/JarvisWidget'
import { bigBox } from "../../../components/utils/actions/MessageActions";
import '../../../../../node_modules/jquery.maskedinput/src/jquery.maskedinput.js'

// Used for checking file (photo)
const SELECTED_FILES_COUNT = 1;
const SELECTED_FILE_INDEX = 0
const MAX_FILE_SIZE = 100000    // (in bytes) todo: to be modified
const ALERT_TIMEOUT = 6000      // 6 seconds


export default class EditProfile extends React.Component {

    componentDidMount() {
        // Mask inputs to ensure correct values
        $('#phone').mask('(999) 999-9999');
        $('#zip').mask('99999?-9999');
        $('#state').mask('aa');
    }

    constructor() {
        super();
        this.photoHandler = this.photoHandler.bind(this);
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
                phonetype: {
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
                },
                zip: {
                    required: true,
                },
                country: {
                    required: true
                },
                addresstype: {
                    required: true
                }
            },
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
                phonetype: {
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
                addresstype: {
                    required: "Address Type Required"
                }
            },
            submitHandler: function(form) {
                // Todo: Save changes here (this.refs)
                store.dispatch(push('settings/profile'));
            }.bind(this)
        };
    }

    photoHandler(event) {
        event.preventDefault();
        // Todo: Fix image rendering issue. Some images render rotated 90 degrees, due to image metadata
        var reader = new FileReader();
        reader.onload = function (e) {
            this.refs.image.src = e.target.result;
        }.bind(this)
        if (this.refs.imageSelect.files.length == SELECTED_FILES_COUNT) {
            var file = this.refs.imageSelect.files[SELECTED_FILE_INDEX];
            if (file.size <= MAX_FILE_SIZE) {
                reader.readAsDataURL(file);
            } else {
                // Custom alert box if file too large
                bigBox({
                    title: "Error!",
                    content: "Photo too large to upload. Please select another photo...",
                    color: "#C46A69",
                    icon: "fa fa-warning shake animated",
                    timeout: ALERT_TIMEOUT
                });
            }
        }
    }

    render() {
        return(
            <div id="content">
                <br/>
                <div className="row">
                    <article className="col-sm-10 col-sm-offset-1 col-md-10 col-md-offset-1 col-lg-8 col-lg-offset-2">
                        <JarvisWidget editbutton={false} custombutton={false}>
                            <header>
                                <span className="widget-icon"> <i className="fa fa-edit"/> </span>
                                <h2>Edit Profile</h2>
                            </header>
                            <div>
                                <div className="widget-body no-padding">
                                    <UiValidate options={this.validationOptions}>
                                        <form id="checkout-form" className="smart-form" noValidate="novalidate">
                                            <fieldset>
                                                <div className="row">
                                                    <div className="text-center">
                                                        <div className="">
                                                            <img className="img-thumbnail" style={{objectFit: 'cover', height: "120px", width: "120px"}} src="assets/img/avatars/user.png"/><br/>
                                                        </div>
                                                        <label className="btn btn-link">Select Photo
                                                            <input type="file" style={{display: 'none'}} onChange={this.photoHandler}/>
                                                        </label><br/><br/>
                                                    </div>
                                                </div>
                                                <br/>
                                                <div className="row">
                                                    <section className="col col-6">
                                                        <label className="input"> <i className="icon-prepend fa fa-user"/>
                                                            <input type="text" name="firstname" ref="firstname" placeholder="First Name" defaultValue={""}/>
                                                        </label>
                                                    </section>
                                                    <section className="col col-6">
                                                        <label className="input"> <i className="icon-prepend fa fa-user"/>
                                                            <input type="text" name="lastname" ref="lastname" placeholder="Last Name" defaultValue={""}/>
                                                        </label>
                                                    </section>
                                                </div>
                                            </fieldset>
                                            <fieldset>
                                                <section>
                                                    <br/>
                                                    <label className="input"> <i className="icon-prepend fa fa-envelope-o"/>
                                                        <input type="email" name="email" ref="email" placeholder="Email" defaultValue={""}/>
                                                    </label>
                                                </section>
                                            </fieldset>
                                            <fieldset>
                                                <br/>
                                                <div className="row">
                                                    <section className="col col-8">
                                                            <label className="input"> <i className="icon-prepend fa fa-phone"/>
                                                                <input type="tel" name="phone" ref="phone" id="phone" placeholder="Phone" defaultValue={""} />
                                                            </label>
                                                    </section>
                                                    <section className="col col-4">
                                                        <label className="select">
                                                            <select name="phonetype" ref="phonetype" defaultValue={""}>
                                                                <option value="" disabled>Phone Type</option>
                                                                {phoneTypes.map(function(type) {
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
                                                <br/>
                                                <div className="row">
                                                    <section className="col col-6">
                                                            <label className="input">
                                                                <input type="text" name="street1" ref="street1" placeholder="Street 1" defaultValue={""}/>
                                                            </label>
                                                    </section>
                                                    <section className="col col-6">
                                                        <label className="input">
                                                            <input type="text" name="street2" ref="street2" placeholder="Street 2" defaultValue={""}/>
                                                        </label>
                                                    </section>
                                                </div>
                                                <div className="row">
                                                    <section className="col col-6">
                                                        <label className="input">
                                                            <input type="text" name="city" ref="city" placeholder="City" defaultValue={""}/>
                                                        </label>
                                                    </section>
                                                    <section className="col col-2">
                                                        <label className="input">
                                                            <input type="text" name="state" ref="state" id="state" placeholder="State" defaultValue={""}/>
                                                        </label>
                                                    </section>
                                                    <section className="col col-4">
                                                        <label className="input">
                                                            <input type="text" name="zip" id="zip" ref="zip" placeholder="Zip" defaultValue={""}/>
                                                        </label>
                                                    </section>
                                                </div>
                                                <div className="row">
                                                    <section className="col col-8">
                                                        <label className="select">
                                                            <select name="country" ref="country" defaultValue={""}>
                                                                <option value="" disabled>Country</option>
                                                                    {countries.map((country)=>{
                                                                        return <option key={country.key} value={country.value}>{country.value}</option>
                                                                        })
                                                                    }
                                                            </select><i/>
                                                        </label>
                                                    </section>
                                                    <section className="col col-4">
                                                        <label className="select">
                                                            <select name="addresstype" ref="addresstype" defaultValue={""}>
                                                                <option value="" disabled>Address Type</option>
                                                                {addressTypes.map(function(type) {
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
                                            <footer>
                                                <button type="submit" className="btn btn-primary">Save Changes</button>
                                            </footer>
                                        </form>
                                    </UiValidate>
                                </div>
                            </div>
                        </JarvisWidget>
                    </article>
                </div>
            </div>
        )
    }
};