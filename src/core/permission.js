export function permissionCheck(pagename,action) {
	let parseData = localStorage.getItem("permission");
	let m_status = localStorage.getItem("m_status");
	let permission=JSON.parse(parseData);
	let masterAccess=['business','menu'];
	if(m_status==="M"){
		return {permission:(masterAccess.indexOf(pagename)!==-1)?"View,New,Edit":"View"};
	}

	return permission.find((val)=>{
		//console.log(val.pagename)
 		let actions= val.permission.split(",");
		if(val.pagename===pagename && actions.indexOf(action)!==-1){
			return 1;
		}else if(val.pagename===pagename && !action){
			return 1;
		}
	}); 
} 