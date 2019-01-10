import React from 'react';
//import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
 import classnames from 'classnames';
import { Button, Modal, ModalBody,Nav, NavItem, NavLink} from 'reactstrap';


import { servicesuggest,serviceBaseTax } from '../../actions/billingActions';
 
import Autocomplete from './../Common/Autocomplete';

  
class AddEditBill extends React.Component {
  constructor(props) {
    super(props);
        this.state={
          billData:[],
          results: [ ],
          loading: false,
          selectedData:[],
          value:'',
          activeTab:'1',
          modal:false,
          delete_index:'',
          totalData:{
            totalSale:"0.00",
            discount:"0.00",
            exclusive:"0.00",
            inclusive:"0.00",
            adjustment:"0.00",
            roundOff:"0.00",
            netPayable:"0.00"
          }
        }
        this.taxCalculation=this.taxCalculation.bind(this);
        this.totalCalculation=this.totalCalculation.bind(this);
    }

 
  onSearch( value ) {
     this.setState({loading:true,value:value});
      servicesuggest(value)
      .then((response) => {
         let options=[];
         if (response.data.result) {
            response.data.result.services.map((res,i)=>{
                let matchingStatus=0;
                  this.state.selectedData.map((data,index)=>{
                    if(res.service_id===data.service_id){
                       matchingStatus=1;
                    }
                     return true;
                  })
                if(matchingStatus===0) {
                  let service_rate = (res.service_rate)?parseFloat(res.service_rate):0;
                    options.push({ value: res.service_display_name,result:{service_display_name:res.service_display_name,service_rate:service_rate,service_id:res.service_id,quantity:1,discountpc:0,discountrs:0,total:service_rate.toFixed(2),tax:[],inc_tax:0,exc_tax:0}})
                }
                 return true;
            })
        }
        this.setState({loading:false,results:options});
        }); 
  }

  onSelect( selectedData, index ) {
       // console.log( "selected", selectedData, index );

      serviceBaseTax(selectedData.service_id).then((res)=>{
              let tax_data = res.data.results.maintax;
              if (typeof tax_data !== 'undefined' && tax_data.length > 0) selectedData["tax"] = tax_data;
              this.taxCalculation(selectedData);
      });
  }

  taxCalculation(selectedData,index){
  let data=[];
    if(index>=0){
       data=this.state.selectedData; 
      selectedData=data[index];
    }
 
    let tax   = selectedData.tax;
    let service_rate  = parseFloat(selectedData.service_rate);
    let rate  = parseFloat(service_rate - selectedData.discountrs); 
    let quantity = selectedData.quantity;
    let inc_tax = 0.00;
    let exc_tax = 0.00;

    //console.log(selectedData,tax)
    var temp_tax = {};
    let serviceIds=tax.map((vals,keys)=>{
               let tax_rate = parseFloat(vals.tax_value);
              let tax_amt = parseFloat(((rate * tax_rate) / 100).toFixed(2));
               temp_tax[vals.tax_id] = {
                    tax_id: vals["tax_id"],
                    tax_amt: tax_amt,
                    taxation_name: vals["taxation_name"],
                    tax_flag: vals["tax_flag"],
                    tax_value: vals["tax_value"]
                  };
                    return vals.tax_id;
        });

     tax.map((val,key)=>{

        let tax_rate = parseFloat(val.tax_value);
        let tax_amt = parseFloat(((rate * tax_rate) / 100).toFixed(2));

        if(val.tax_flag===1){ 
            let subTax=val.sub_rule;
              // console.log(subTax) 
            Object.keys(subTax).map((vals,keys)=>{
              let subTaxs=subTax[vals];
              let tax_id = (subTaxs.tax_id*1);
              if(serviceIds.indexOf(tax_id)>-1 && tax_id!==-1){
                  let subTaxAmt = parseFloat(parseFloat(rate) + parseFloat(temp_tax[tax_id].tax_amt));
                  tax_amt = (subTaxAmt * tax_rate) / 100;
                  temp_tax[val.tax_id].tax_amt=tax_amt;
              }else if(tax_id!==-1){
                  delete temp_tax[val.tax_id];
                  delete temp_tax[tax_id];
                  tax_amt =0;
              }
              return true;
             });
             exc_tax+=(tax_amt*quantity);
          }else{ 
            inc_tax+=(tax_amt*quantity);
        }
        return true;

      });

     selectedData.inc_tax=inc_tax.toFixed(2);
     selectedData.exc_tax=exc_tax.toFixed(2);
     selectedData.taxed=temp_tax;

     if(index>=0){
          this.setState({selectedData:[...data,...selectedData]});  
        }
      else{
        this.setState({selectedData:[...this.state.selectedData,selectedData],results:[],value:''}); 
      }

      let self=this;
      setTimeout(()=>{
        self.totalCalculation();
      },5)
  }

  totalCalculation(){
    let totalData={totalSale:"0.00", discount:"0.00", exclusive:"0.00",inclusive:"0.00",adjustment:"0.00",roundOff:"0.00",netPayable:"0.00"}
    this.state.selectedData.map((data,index)=>{
      totalData.totalSale=((totalData.totalSale*1)+(data.total*1)+(data.discountrs*1)).toFixed(2);
      totalData.discount=((totalData.discount*1)+(data.discountrs*1)).toFixed(2);
      totalData.exclusive=((totalData.exclusive*1)+(data.exc_tax*1)).toFixed(2);
      totalData.inclusive=((totalData.inclusive*1)+(data.inc_tax*1)).toFixed(2);
      totalData.netPayable=((totalData.netPayable*1)+(data.total*1)+(data.exc_tax*1)).toFixed(2);
      return true;
    });

    let roundOff = (totalData.netPayable % 1).toFixed(2);
     totalData.roundOff = ((roundOff < 0.50) ? -Math.abs(roundOff) : 1 - Math.abs(roundOff)).toFixed(2);
    totalData.netPayable=(Math.round(totalData.netPayable)).toFixed(2);
    this.setState({totalData:totalData});  
 }

  removeservice(index){
      this.state.selectedData.splice(this.state.delete_index,1);
      this.setState({selectedData:this.state.selectedData}); 
      let self=this;
      setTimeout(()=>{
        self.totalCalculation();
      },5)
      this.popUpToggle();
  }
  onChangeEvent(event,col,index){
      let data=this.state.selectedData; 
      data[index][col]=event.target.value;
      if(isNaN(event.target.value)){
          data[index][col]='';
          data[index]["total"]=0;
        }
      let service_rate=data[index]["service_rate"]; 

      if(data[index]["quantity"]>=0 && data[index]["service_rate"] && (col==='discountpc' || col==='service_rate' || col==='quantity'))
      {
         data[index]["discountrs"]=((data[index]["service_rate"] * data[index]["discountpc"])/100).toFixed(2);
      }

      if(data[index]["quantity"]>=0 && data[index]["service_rate"] && col==='discountrs')
      {
         data[index]["discountpc"]=((data[index]["discountrs"]/data[index]["service_rate"])*100).toFixed(2);
      }

      if(data[index]["discountrs"]){
        service_rate=(data[index]["service_rate"]-(data[index]["discountrs"]));
      }

      if(data[index]["quantity"]>=0 && data[index]["service_rate"])
      {
         data[index]["total"]=(data[index]["quantity"]*service_rate).toFixed(2);
      }
    this.setState({selectedData:data});  
    let self=this;
    setTimeout(()=>{
      self.taxCalculation('',index);
    },5)
   }

  popUpToggle(index){
    this.setState({modal:!this.state.modal,delete_index:index})
  }

  paymentMode(tab,bill_status,btype) {
     
  }
 
  
  render() {

    //console.log( this.state.selectedData );
    let totalData = this.state.totalData;
 
          return (
                <div className="portlet">
                 <div className="transition-item detail-page">
                   <div className="main-content">
                      {/*<div className="loader-div">
                        <div className="sk-fading-circle">
                          <div className="sk-circle1 sk-circle"></div>
                          <div className="sk-circle2 sk-circle"></div>
                          <div className="sk-circle3 sk-circle"></div>
                          <div className="sk-circle4 sk-circle"></div>
                          <div className="sk-circle5 sk-circle"></div>
                          <div className="sk-circle6 sk-circle"></div>
                          <div className="sk-circle7 sk-circle"></div>
                          <div className="sk-circle8 sk-circle"></div>
                          <div className="sk-circle9 sk-circle"></div>
                          <div className="sk-circle10 sk-circle"></div>
                          <div className="sk-circle11 sk-circle"></div>
                          <div className="sk-circle12 sk-circle"></div>
                        </div>
                      </div>*/}
                      {
                      this.state.selectedData.map((data,index)=>{
                               return (
                                       <div key={index} className="full-width border-width" > 
                                          <div className="service-div"> {data.service_display_name}<div className="delete-btn"><i onClick={(e)=>this.popUpToggle(index)} className="icon-close icons font-2xl d-block"></i></div>
                                          </div>
                                          <div className="float-label">
                                              <div className="half-width paddingright control"><input type="text" className="form-control" placeholder="Rate (₹)" onChange={(e)=>{this.onChangeEvent(e,"service_rate",index)}} value={data.service_rate} required/> <label htmlFor="Rate (₹)">Rate (₹)</label></div>
                                              <div className="half-width paddingleft control"><input type="text" className="form-control" placeholder="Quantity" value={data.quantity}  onChange={(e)=>{this.onChangeEvent(e,"quantity",index)}}  required/> <label htmlFor="Quantity">Quantity</label> </div>
                                          </div>
                                          <div className="float-label">
                                              <div className="half-width paddingright control"><input required type="text" className="form-control" placeholder="Discount %"  value={data.discountpc} onChange={(e)=>{this.onChangeEvent(e,"discountpc",index)}} /><label htmlFor="Discount %">Discount %</label></div>
                                              <div className="half-width paddingleft control"><input required type="text" className="form-control" placeholder="Discount (₹)"  value={data.discountrs} onChange={(e)=>{this.onChangeEvent(e,"discountrs",index)}} /><label htmlFor="Discount (₹)">Discount (₹)</label></div>
                                          </div> 
                                          
                                          <div>
                                              <div className="half-width paddingright"></div>
                                              <div className="half-width paddingleft text-rights">Total :₹ <span>{data.total}</span></div>
                                          </div>

                                        </div>
                                    )
                            })
                         }
  
                        <div className="full-width border-width search-service" > 
                              <div>
                                  <Autocomplete placeholder="Search service..." onSearch={this.onSearch.bind( this )} value={this.state.value} onSelect={this.onSelect.bind( this )} results={this.state.results} loading={this.state.loading}>
                                      {item => {
                                        return <div key={item}>{item}</div>;
                                      }}
                                    </Autocomplete> 
                              </div>
                              <div>
                                  <div className="half-width paddingright"><input type="text" className="form-control" placeholder="Rate (₹)"/></div>
                                  <div className="half-width paddingleft"><input type="text" className="form-control" placeholder="Quantity"/></div>
                              </div>
                              <div>
                                  <div className="half-width paddingright"><input type="text" className="form-control" placeholder="Discount %"/></div>
                                  <div className="half-width paddingleft"><input type="text" className="form-control" placeholder="Discount (₹)"/></div>
                              </div> 
                         </div>
                          <Modal isOpen={this.state.modal} toggle={(e)=>this.popUpToggle()} className={classnames({"modalheight-cls":1 })}>
                              <ModalBody>
                                    Are you sure, want to delete?
                                <div className="delete-cls">
                                  <Button color="primary" size="sm" onClick={()=>{this.removeservice()}}  >Ok</Button>
                                  <Button color="danger" size="sm" onClick={(e)=>this.popUpToggle()} className={classnames({"modaldelete-cls":1 })}>Cancel</Button> 
                                  </div>
                              </ModalBody>
                          </Modal> 
                  </div>
 
                <footer className="billing-footer">
                  <div className="tax-div tot-sales" >
                    <div className="half-width" ></div>
                    <div className="half-width">Total sales <div className="amt-div">₹ {totalData.totalSale}</div></div>
                  </div>
                  <div className="tax-div">
                    <div className="half-width" style={{"borderRight":"0px"}}>Inclusive Tax <div className="amt-div">₹ {totalData.inclusive}</div></div>
                    <div className="half-width">Exclusive Tax <div className="amt-div">₹ {totalData.exclusive}</div></div>
                  </div>
                  <div className="tax-div">
                    <div className="half-width" style={{"borderRight":"0px"}}>Add Adjustment<div className="amt-div">₹ {totalData.adjustment}</div></div>
                    <div className="half-width">Round Off <div className="amt-div">₹ {totalData.roundOff}</div></div>
                  </div>
                  <div className="tax-div">
                    <div className="half-width" ></div>
                    <div className="half-width">Discount <div className="amt-div">₹ {totalData.discount}</div></div>
                  </div>
                  <div className="tax-div tot-sales">
                    <div className="half-width" ></div>
                    <div className="half-width">Net Payable <div className="amt-div">₹ {totalData.netPayable}</div></div>
                  </div>

                  <div className="billings">
                    <Nav tabs style={{width:'100%'}}>
                      <NavItem className={classnames({tabslist:1 })}>
                        <NavLink  onClick={() => { this.paymentMode('cash'); }}>
                          Cash
                        </NavLink>
                      </NavItem>
                      <NavItem className={classnames({tabslist1:1 })}>
                        <NavLink  onClick={() => { this.paymentMode('debit/credit card'); }}>
                          Debit/Credit Card
                        </NavLink>
                      </NavItem>
                      <NavItem className={classnames({tabslist:1 })}>
                        <NavLink  onClick={() => { this.paymentMode('sodexo'); }}>
                          Sodexo
                        </NavLink>
                      </NavItem> 
                  </Nav> 
                  </div> 

                </footer>
                </div>
                </div> )
  }
}
 
export default AddEditBill;