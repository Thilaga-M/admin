import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchMenu(params) {
  return {
    type: 'FETCH_MENU',
    payload: http.get('/menu',{params:params})
  };
}

export function viewMenu(id) {
  return http.get('/menu/'+id,{params:{}})
}

export function addMenu(data,para) {
  return http.post('/menu'+para,param(data))
}

export function deleteMenu(id) {
  return http.delete('/menu/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 