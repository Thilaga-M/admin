import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchDocumentList(id) {
  return http.get('/customerdocumentlist/'+id,{params:{}})
}

export function fetchKYCDocumentList(cust_hid,doc_type_id) {
  return http.get('/customerkycdocumentlist/'+cust_hid+'/'+doc_type_id,{params:{}})
}

export function uploadDocument(data) {
  return http.post('/uploadDocument',param(data))
}

export function deleteDocument(id) {
  return http.delete('/customerdocument/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
 
