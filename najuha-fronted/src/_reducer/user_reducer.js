import {
    LOGIN_USER,
    AUTH_USER
} from '../_action/types'


export default function (state = {}, action){
    switch (action.type){
        case LOGIN_USER:
                return {...state, loginSucces: action.payload}
            break;

        case AUTH_USER:
                return {...state, userAuth: action.payload}
            break;

        default:
            return state;
    }
}