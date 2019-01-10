export function validationCheck(requestParams) {
	let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    let regs = /^\d+$/;
    let numbers =  /^\d{10}$/;  
	

	let requiredMsg="This is required.";
	let emailMsg="Email is not valid.";
	let numericMsg="Only numeric is allowed";
	let alphabetMsg="Only alphabet is allowed";



for (var key in requestParams) 
{
    if (requestParams.hasOwnProperty(key)) {
      //  console.log(key + " -> " + requestParams[key].required);
		if("required" in requestParams[key])
		{
			if(requestParams[key].value.length==0)
			{
				requestParams[key].required = false;
				requestParams[key].msg = requiredMsg;
				continue;
			}
			else
			{				
				requestParams[key].required = true;
				requestParams[key].msg = '';
			}
		}
		if("email" in requestParams[key])
		{
			if(reg.test(requestParams[key].value) == true)
			{
				requestParams[key].email = false;
				requestParams[key].msg = '';
			}
			else
			{
				requestParams[key].required = true;
				requestParams[key].msg = emailMsg;
			}

		}
		if("mobile" in requestParams[key])
		{
			if(numbers.test(requestParams[key].value) == true)
			{
				requestParams[key].required = false;
				requestParams[key].msg = '';
			}
			else
			{
				requestParams[key].required = true;
				requestParams[key].msg = numericMsg;
			}

		}

		if("number" in requestParams[key])
		{
			if(regs.test(requestParams[key].value) == true)
			{
				requestParams[key].required = false;
				requestParams[key].msg = '';
			}
			else
			{
				requestParams[key].required = true;
				requestParams[key].msg = numericMsg;
			}

		}
		
    }
}
	return requestParams;
} 