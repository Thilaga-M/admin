import http from '../core/http-call';
//import axiosCancel from 'axios-cancel';
var param= require('jquery-param');


export function fetchRoom(params) {
  return {
    type: 'FETCH_Room',
    payload: http.get('/RoomMaster',{params:params})
  };
}

export function viewRoom(id) {
  return http.get('/RoomMaster/'+id,{params:{}})
}

export function addRoom(data,para) {
  return http.post('/RoomMaster'+para,param(data))
}

export function deleteRoom(id) {
  return http.delete('/RoomMaster/'+id,{params:{}})
}

export function update_fetch_status(params) {
  return {
    type: 'UPDATE_FETCH_STATUS',
    payload:false
  };
}

export function getFloorList() {
  return http.get('/getFloorList',{params:{}})
}
 