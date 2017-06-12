/**
 * Created by griga on 11/17/15.
 */

import React from 'react'

import FullScreen from './FullScreen'
import ToggleMenu from './ToggleMenu'
import SpeechButton from '../voice-control/components/SpeechButton'
import SearchMobile from './SearchMobile'

import Activities from '../activities/components/Activities'
import LanguageSelector from '../i18n/LanguageSelector'

import RecentProjects from './RecentProjects'

import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { logoutUser } from '../user/UserActions'
import { AUTHENTICATED, GUEST } from '../user/UserConstants'
import {smallBox, SmartMessageBox} from "../utils/actions/MessageActions";


const mapStateToProps = (state) => {
    /*
        Maps redux states to local props

        - method is called everytime state is updated/changed
        - authState: current authentication status
    */
    return {
        authState: state.user.AUTH_STATE,
        isLogging: state.user.isLogging
    }
}

const mapDispatchToProps = (dispatch) => {
    /*
        Maps the redux dispatch calls to local props

        - logoutUser: method to log out user
    */
    return {
        logoutUser: () => {dispatch(logoutUser())},
    }
}

class Header extends React.Component {

    constructor(props) {
        super(props);
        this.signout = this.signOutUser.bind(this);
    }

    signOutUser() {
        /*
            signs out user upon button click
        */
        SmartMessageBox({
            title: "Are you sure?",
            content: "Are you sure you want to log out?",
            buttons: '[No][Yes]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "Yes") {
                this.props.logoutUser();
            }
            if (ButtonPressed === "No") {
                // Nothing
            }
        }.bind(this));
    }

  render() {
    if (this.props.isLogging) {
        return (
            <div>
                <div style={{marginTop: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <img style={{width: '30px', height: '30px'}} src="assets/img/spinner/ripple.gif" />
                </div><br/>
                <p className="text-center text-muted">Logging out...</p>
            </div>
        )
    }

    return <header id="header">
      <div id="logo-group">
                <span id="logo">
                    <img src="assets/img/logo.png" // place your logo here
                         alt="SmartAdmin"/>
                </span>
        {/* Note: The activity badge color changes when clicked and resets the number to 0
         Suggestion: You may want to set a flag when this happens to tick off all checked messages / notifications */}

        <Activities />
      </div>

      <RecentProjects />
      <div className="pull-right"  /*pulled right: nav area*/ >


        <ToggleMenu className="btn-header pull-right"  /* collapse menu button */ />


        {/* #MOBILE */}
        {/*  Top menu profile link : this shows only when top menu is active */}
        <ul id="mobile-profile-img" className="header-dropdown-list hidden-xs padding-5">
          <li className="">
            <a className="dropdown-toggle no-margin userdropdown" data-toggle="dropdown">
              <img src="assets/img/avatars/sunny.png" alt="John Doe" className="online"/>
            </a>
            <ul className="dropdown-menu pull-right">
              <li>
                <a className="padding-10 padding-top-0 padding-bottom-0"><i
                  className="fa fa-cog"/> Setting</a>
              </li>
              <li className="divider"/>
              <li>
                <a href="#/views/profile"
                   className="padding-10 padding-top-0 padding-bottom-0"> <i className="fa fa-user"/>
                  <u>P</u>rofile</a>
              </li>
              <li className="divider"/>
              <li>
                <a className="padding-10 padding-top-0 padding-bottom-0"
                   data-action="toggleShortcut"><i className="fa fa-arrow-down"/> <u>S</u>hortcut</a>
              </li>
              <li className="divider"/>
              <li>
                <a className="padding-10 padding-top-0 padding-bottom-0"
                   data-action="launchFullscreen"><i className="fa fa-arrows-alt"/> Full
                  <u>S</u>creen</a>
              </li>
              <li className="divider"/>
              <li>
                <a href="#/login" className="padding-10 padding-top-5 padding-bottom-5"
                   data-action="userLogout"><i
                  className="fa fa-sign-out fa-lg"/> <strong><u>L</u>ogout</strong></a>
              </li>
            </ul>
          </li>
        </ul>

        {/* logout button */}
        <div id="logout" className="btn-header transparent pull-right">
                    <span><a onClick={this.signout}
                              ><i
                      className="fa fa-sign-out"/></a></span>
        </div>

        {/* search mobile button (this is hidden till mobile view port) */}
        <SearchMobile className="btn-header transparent pull-right"/>


        {/* input: search field */}
        <form action="#/misc/search.html" className="header-search pull-right">
          <input id="search-fld" type="text" name="param" placeholder="Find reports and more"
                 data-autocomplete='[
					"ActionScript",
					"AppleScript",
					"Asp",
					"BASIC",
					"C",
					"C++",
					"Clojure",
					"COBOL",
					"ColdFusion",
					"Erlang",
					"Fortran",
					"Groovy",
					"Haskell",
					"Java",
					"JavaScript",
					"Lisp",
					"Perl",
					"PHP",
					"Python",
					"Ruby",
					"Scala",
					"Scheme"]'/>
          <button type="submit">
            <i className="fa fa-search"/>
          </button>
          <a href="$" id="cancel-search-js" title="Cancel Search"><i className="fa fa-times"/></a>
        </form>


        <SpeechButton className="btn-header transparent pull-right hidden-sm hidden-xs" />

        <FullScreen className="btn-header transparent pull-right"/>


        {/* multiple lang dropdown : find all flags in the flags page */}
        <LanguageSelector />


      </div>
      {/* end pulled right: nav area */}


    </header>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)