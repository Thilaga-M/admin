import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchAmenities(params) {
  return {
    type: 'FETCH_AMENITIES',
    payload: http.get('/amenities',{params:params})
  };
}

export function viewAmenities(id) {
  return http.get('/amenities/'+id,{params:{}})
}

export function addAmenities(data,para) {
  return http.post('/amenities'+para,param(data))
}

export function deleteAmenities(id) {
  return http.delete('/amenities/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 