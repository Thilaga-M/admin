import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchState(params) {
  return {
    type: 'FETCH_STATE',
    payload: http.get('/StateMaster',{params:params})
  };
}

export function viewState(id) {
  return http.get('/StateMaster/'+id,{params:{}})
}

export function addState(data,para) {
  return http.post('/StateMaster'+para,param(data))
}

export function deleteState(id) {
  return http.delete('/StateMaster/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}

export function getCountryList() {
  return http.get('/getCountryList',{params:{}})
}
 