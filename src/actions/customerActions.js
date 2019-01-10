import http from "../core/http-call";
//import axiosCancel from 'axios-cancel';
var param = require("jquery-param");

export function fetchCustomer(params) {
  return {
    type: "FETCH_CUSTOMER",
    payload: http.get("/customer", { params: params })
  };
}

export function fetchCustomerList(params) {
  return http.get("/customer", { params: params });
}

export function getKYC(params) {
  return http.get("/KYCMaster", { params: { limit: 1000, page: 1 } });
}

export function getPayment(params) {
  return http.get("/PaymentMaster", {
    params: {
      search_term: "",
      startDate: "",
      endDate: "",
      limit: 1000,
      page: 1
    }
  });
}

export function viewCustomer(id) {
  return http.get("/customer/" + id, { params: {} });
}

export function officespacelist(id) {
  return http.get("/officespacelist", { params: {} });
}

export function addCustomer(data, para) {
  return http.post("/customer" + para, param(data));
}

export function deleteCustomer(id) {
  return http.delete("/customer/" + id, { params: {} });
}

export function listallcompany(params) {
  
  return http.get("/listallcompany", { params: params });
}

export function viewcompany(id) {
  return http.get("/viewcompany/" + id, { params: {} });
}
export function updatecompany(data, para) {
  return http.post("/updatecompany/" + para, param(data));
}

export function update_fetch_status(params) {
  return {
    type: "UPDATE_FETCH_STATUS",
    payload: false
  };
}

//Customer Employee
export function fetchEmployee(params) {
  return http.get("/employee", { params: params });
}

export function viewEmployee(id) {
  return http.get("/employee/" + id, { params: {} });
}

export function addEmployee(data, para) {
  return http.post("/employee" + para, param(data));
}

export function deleteEmployee(id) {
  return http.delete("/employee/" + id, { params: {} });
}

export function updateFinance(data, para) {
  return http.post("/updatefinance/" + para, param(data));
}

export function updatePayment(data, para) {
  return http.post("/updatepayment/" + para, param(data));
}

export function fetchSpace(params) {
  return http.get("/fetchspace", { params: params });
}

export function fetchCustomerSpace(id) {
  return http.get("/customerofficespace/" + id, { params: {} });
}

export function terminateUnits(data) {
  return http.post("/terminateunits", param(data));
}
