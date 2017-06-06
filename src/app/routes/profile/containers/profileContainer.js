import React from 'react'
import { push } from 'react-router-redux'
import store from '../../../store/configureStore'
import { months } from '../../../components/forms/commons/months'
import { Profile } from '../components/profile'


export default class ProfileContainer extends React.Component {
    /*
        Container component for profile

        - Loads profile data, and any other data needed
        - Renders profile dummy component, passing in data as props
    */
    constructor() {
        super();
        // Bind methods to this pointer
        this.editProfileAction = this.editProfileClicked.bind(this);
        this.userInfo = {}

        // Current date displayed on profile (Date string)
        var current_date = new Date();
        var date_str = months[current_date.getMonth()] + " " + current_date.getDay() + ", " + current_date.getFullYear();

        // Todo: retrieve user information from store
    }

    editProfileClicked() {
        /*
            Used to direct to edit profile route on button click
        */
        store.dispatch(push('settings/editprofile'));
    }

    render() {
        return(
            <Profile user={this.userInfo} date={date_str} editProfileClicked={this.editProfileAction} />
        )
    }
}