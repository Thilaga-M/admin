import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchFeedback(params) {
  return {
    type: 'FETCH_FEEDBACK',
    payload: http.get('/feedback',{params:params})
  };
}

export function viewFeedback(id) {
  return http.get('/feedback/'+id,{params:{}})
}

export function getAccountTypeList() {
  return http.get('/getAccountTypeList',{params:{}})
}

export function getAccountHeadList(id) {
  return http.get('/getAccountHeadList/'+id,{params:{}})
}


export function addFeedback(data,para) {
  return http.post('/feedback'+para,param(data))
}

export function deleteFeedback(id) {
  return http.delete('/feedback/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 