import * as firebase from 'firebase'
import * as UserConstants from './UserConstants'
import * as ProfileConstants from '../../routes/profile/containers/ProfileConstants'
import {loadUserProfile, storeUserProfile} from '../../routes/profile/containers/ProfileActions'
import { push } from 'react-router-redux'

export const REQUEST_USER = 'REQUEST_USER'
export const USER_INFO = 'USER_INFO'


export function requestUserInfo()
{
  return (dispatch) => {
    return $.getJSON('assets/api/user/login-info.json')
      .then((data)=> {
        dispatch({
          type: USER_INFO,
          data
        })
      })
  }
}

export function startListeningToAuth(){
    return function(dispatch,getState){
        firebase.auth().onAuthStateChanged(function(user){
            if(user){
                //user is authenticated.
                dispatch({
                    type: UserConstants.AUTHENTICATE_USER,
                    AUTH_STATE: UserConstants.AUTHENTICATED,
                    USER: user
                })
                //load user profile
                dispatch(loadUserProfile(user.uid));

            }else{
                //no user authenticated
                if(getState().user.AUTH_STATE != UserConstants.GUEST){
                    dispatch({
                        type: UserConstants.LOGOUT_USER
                    })
                }
                //unload user profile
                dispatch({
                    type: ProfileConstants.UNLOAD_PROFILE
                })
                dispatch(push('/login'))
            }
        });
    }

}

export function attemptLoginWithEmail(email,password){
    return function(dispatch,getState){
        dispatch({
            type: UserConstants.ATTEMPT_LOGIN
        })

        firebase.auth().signInWithEmailAndPassword(email,password).catch(function(error){
            //TODO HANDLE LOGIN ERRORS
        });
    }
}

export function logoutUser(){
    return function(dispacth,getState){
        firebase.auth().signOut().catch(function(error){
            // TODO error handling when we can't logout user
        })
    }
}