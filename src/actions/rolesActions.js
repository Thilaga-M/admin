import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchRoles(params) {
  return {
    type: 'FETCH_ROLES',
    payload: http.get('/roles',{params:params})
  };
}

export function viewRoles(id) {
  return http.get('/roles/'+id,{params:{}})
}

export function fetchMenu() {
  return http.get('/menu',{params:{}})
}

export function addRoles(data,para) {
  return http.post('/roles'+para,param(data))
}

export function deleteRoles(id) {
  return http.delete('/roles/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 