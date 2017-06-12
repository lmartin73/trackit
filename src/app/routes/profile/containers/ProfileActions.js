import UserProfile from '../../../_be/auth/useracct.js'
import * as ProfileConstants from './ProfileConstants'
import * as UserActions from '../../../components/user/UserActions'
import { currentProfile }from '../../../store/tiStatic'

//download the user profile from the remote server
export function loadUserProfile(uid){
    return function(dispatch,getState){
        dispatch({
            type: ProfileConstants.FETCH_PROFILE,
            profile: null
        })
        currentProfile.fetchUser(uid);

        //Wait a few seconds to for the data to download from server then sync with the store
        var profilePromise = new Promise(function(resolve){
            setTimeout(()=>resolve(true),ProfileConstants.FETCH_PROFILE_TIMEOUT)
        })

        profilePromise.then((res)=>{
            if(res){
                if(currentProfile.hasProfileLoaded()){
                    dispatch({
                        type: ProfileConstants.STORE_PROFILE,
                        profile: currentProfile.getUserProfile()
                    })
                }else{

                //TODO need to handle situation where we can't download profile in reasonable amount of time.
                    dispatch({
                        type: ProfileConstants.UNLOAD_PROFILE
                    })
                    dispatch(UserActions.logoutUser())
                }
            }
        })
    }

}


export function updateUserProfile(profileData){
     return function(dispatch,getState){

        //make sure the profile being upload is for the current authenticated user
        if(getState().user.CURRENT_USER.uid == profileData.uid){
            dispatch({
                 type: ProfileConstants.UPDATE_PROFILE,
                 profile: profileData
            })

            currentProfile.updateProfile(profileData);

        }
     }
}

export function createProfileWithEmailAction(newUserData){
    return function(dispatch, getState){
        //creating new user
        dispatch({
            type: ProfileConstants.CREATE_PROFILE_WITH_EMAIL
        })

        //initialize new profile on remote server
        currentProfile.createProfileViaEmail(newUserData.firstname, newUserData.lastname, newUserData.email, newUserData.uid)

        //fetch new profile into store
        dispatch({
            type:ProfileConstants.FETCH_PROFILE,
            profile: null
        })
    }
}

export function createProfileWithProviderAction(providerData){
    return function(dispatch, getState){
        //creating new user
        dispatch({
            type: ProfileConstants.CREATE_PROFILE_WITH_PROVIDER
        })

        //initialize new profile on remote server
        currentProfile.createProfileViaProvider(providerData)

        //fetch new profile into store
        dispatch({
            type:ProfileConstants.FETCH_PROFILE,
            profile: null
        })
    }
}
