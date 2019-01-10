import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchPincode(params) {
  return {
    type: 'FETCH_PINCODE',
    payload: http.get('/PincodeMaster',{params:params})
  };
}

export function viewPincode(id) {
  return http.get('/PincodeMaster/'+id,{params:{}})
}

export function addPincode(data,para) {
  return http.post('/PincodeMaster'+para,param(data))
}

export function deletePincode(id) {
  return http.delete('/PincodeMaster/'+id,{params:{}})
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

 export function getStateList(id) {
  return http.get('/getStateList/'+id,{params:{}})
}

export function getCityList(id) {
  return http.get('/getCityList/'+id,{params:{}})
}
export function getPincodeList(id) {
  return http.get('/getPincodeList/'+id,{params:{}})
}