import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchCity(params) {
  return {
    type: 'FETCH_CITY',
    payload: http.get('/CityMaster',{params:params})
  };
}

export function viewCity(id) {
  return http.get('/CityMaster/'+id,{params:{}})
}

export function addCity(data,para) {
  return http.post('/CityMaster'+para,param(data))
}

export function deleteCity(id) {
  return http.delete('/CityMaster/'+id,{params:{}})
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