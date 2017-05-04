import React from 'react'
import { push } from 'react-router-redux'
import store from '../../../store/configureStore'
import { months } from '../../../components/forms/commons/months'
import { Profile } from '../components/profile'


// Getting current date and converting to string (Month day, year)
var current_date = new Date();
var date_str = months[current_date.getMonth()] + " " + current_date.getDay() + ", " + current_date.getFullYear();

export default class ProfileContainer extends React.Component {

    constructor() {
        super();
        this.editProfileAction = this.editProfileClicked.bind(this);

        // todo: retrieve user information from redux store
    }

    editProfileClicked() {
        store.dispatch(push('settings/editprofile'));
    }

    render() {
        return(
            <Profile user={this.userInfo} date={date_str} editProfileClicked={this.editProfileAction} />
        )
    }
}