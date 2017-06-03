
import * as UserConstants from './UserConstants'
import {USER_INFO} from './UserActions'

export default function userReducer (state = {

}, action ){
  switch (action.type){
    case USER_INFO:
      return action.data

    case UserConstants.ATTEMPT_LOGIN:
        return {
            AUTH_STATE: UserConstants.AWAITING_AUTHENTICATION,
            CURRENT_USER: null,
            isLogging: true
        }

    case UserConstants.LOGOUT_USER:
        return{
            AUTH_STATE: UserConstants.GUEST,
            CURRENT_USER: null,
            isLogging: false
        }

    case UserConstants.AUTHENTICATE_USER:
        return{
            AUTH_STATE: action.AUTH_STATE,
            CURRENT_USER: action.USER,
            isLogging: false
        }

    default:
      return state
  }
}