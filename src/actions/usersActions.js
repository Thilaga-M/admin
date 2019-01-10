import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchUsers(params) {
  return {
    type: 'FETCH_USERS',
    payload: http.get('/users',{params:params})
  };
}

export function viewUsers(id) {
  return http.get('/users/'+id,{params:{}})
}

export function rolesall(id) {
  return http.get('/rolesall',{params:{}})
}

export function fetchCenter(params) {
  return http.get('/centername',{params:params})
}

export function addUsers(data,para) {
  return http.post('/users'+para,param(data))
}

export function deleteUsers(id) {
  return http.delete('/users/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 