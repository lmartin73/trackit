import * as ProfileConstants from './ProfileConstants'

export default function profileReducer (state = {

}, action ){
  switch (action.type){

    case ProfileConstants.UPDATE_PROFILE:
        return {
            profile_state: ProfileConstants.PROFILE_UPDATED,
            profile: action.profile,
            isLoading: false
        }

    case ProfileConstants.FETCH_PROFILE:
        return {
            profile_state: ProfileConstants.LOADING_PROFILE,
            profile: action.profile,
            isLoading: true
        }

    case ProfileConstants.STORE_PROFILE:
        return{
            profile_state: ProfileConstants.PROFILE_LOADED,
            profile: action.profile,
            isLoading: false
        }

    case ProfileConstants.UNLOAD_PROFILE:
        return {
            profile_state: ProfileConstants.PROFILE_UNLOADED,
            profile: null,
            isLoading:false
        }
    case ProfileConstants.CREATE_PROFILE_WITH_EMAIL:
    case ProfileConstants.CREATE_PROFILE_WITH_PROVIDER:
        return {
            profile_state: ProfileConstants.NEW_PROFILE,
            profile: null,
            isLoading: false
        }


    default:
      return state
  }
}