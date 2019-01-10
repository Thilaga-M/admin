import http from '../core/http-call';
var param= require('jquery-param');


export function fetchNotification(params) {
  return {
    type: 'FETCH_NOTIFICATION',
    payload: http.get('/notification',{params:params})
  };
}

export function viewNotification(id) {
  return http.get('/notification/'+id,{params:{}})
}

export function addNotification(data,para) {
  return http.post('/notification'+para,param(data))
}

export function deleteNotification(id) {
  return http.delete('/notification/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}
export function getTemplateCategory() {
    return http.get('/getTemplateCategoryList',{params:{}})
  }
 
  export function getTemplateList(id) {
    return http.get('/getTemplateMasterByCategory/'+id,{params:{}})
  }
  export function viewTemplateMaster(id) {
    return http.get('/templatemaster/'+id,{params:{}})
  }

  export function getCustomerList() {
    return http.get('/getCustomerList',{params:{}})
  }