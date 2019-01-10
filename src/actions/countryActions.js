import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchCountry(params) {
  return {
    type: 'FETCH_COUNTRY',
    payload: http.get('/CountryMaster',{params:params})
  };
}

export function viewCountry(id) {
  return http.get('/CountryMaster/'+id,{params:{}})
}

export function addCountry(data,para) {
  return http.post('/CountryMaster'+para,param(data))
}

export function deleteCountry(id) {
  return http.delete('/CountryMaster/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 