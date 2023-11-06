import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from './type';

export function loginUser(dataToSubmit){
    const request = axios.post('http://localhost:5001/api/login', dataToSubmit, { withCredentials: true })
      .then(response => response.data);
    return{
        type: LOGIN_USER,
        payload: request
    }
}

export function registerUser(dataToSubmit){
    const request = axios.post('http://localhost:5001/api/register', dataToSubmit)
      .then(response => response.data);
    return{
        type: REGISTER_USER,
        payload: request
    }
}

export function auth(){
    const request = axios.get('http://localhost:5001/api/auth')
      .then(response => response.data);
    return{
        type: AUTH_USER,
        payload: request
    }
}