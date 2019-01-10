import axios from 'axios';
import Path from './Config';
import browserHistory from './History';
 
 
var http = axios.create({
  baseURL: Path.apiUrl, 
});

 http.interceptors.request.use(function (config) {

  let clength = localStorage.getItem("clength");
  let c_id = localStorage.getItem("c_id");
  if(clength>1 && c_id && config.params){
    config.params.cid=c_id;
    config.params.centerid=c_id;
  } 
  if(clength>1 && c_id && config.data && !config.params){
    config.data=config.data+"&cid="+c_id+"&centerid="+c_id;
  }

   var token=localStorage.getItem("token");
     if(token){
     	  config.headers = { 
          "Authorization": `Bearer `+token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        };
     }
 
     return config;
  }); 
 
http.interceptors.response.use((response) => {
  if(response.data.status===300){
      localStorage.clear();
      browserHistory.push('/pages/login');
  }

  return response;
},(error) => {
	if(error.response.status===401){
 		localStorage.clear();
		browserHistory.push('/pages/login');
	 }
});

export default http;
 
 
 