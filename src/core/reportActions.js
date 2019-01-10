import browserHistory from './../core/History';

export function printer(data,title){
    var mywindow = window.open('', 'INVOICE', 'height=400,width=600');
    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('</head><body>');
    mywindow.document.write(`
    <style> 
    table, tbody, tfoot, thead, tr, th, td {
      margin: 0;
      padding: 0;
      border: 0;
      outline: 0;
      font-size: 100%;
      vertical-align: baseline;
      background: transparent;
  }
  .row .col.s3 {
    width: 25% !important;
    margin-left: auto;
    left: auto;
    right: auto;
}
.row .col.s6 {
    width: 50% !important;
    margin-left: auto;
    left: auto;
    right: auto;
}
.row .col.s12 {
    width: 100% !important;
    margin-left: auto;
    left: auto;
    right: auto;
}
  body {
      margin: 0;
      padding: 0;
      font: 12px/15px "Helvetica Neue", Arial, Helvetica, sans-serif;
      color: #555; 
  } 
  table {
      border: 1px solid #d3d3d3;
      background: #fefefe;
      width: 100%;
      margin: 1% auto 0; 
      border-radius: 5px; 
  }

  th, td {
      padding: 2px 2px 1px;
      text-align: left;
  }

  th {
      padding-top: 22px;
      text-shadow: 1px 1px 1px #fff;
      background: #e8eaeb;
  }

  td {
      border-top: 1px solid #e0e0e0;
      border-right: 1px solid #e0e0e0;
  }

  tr.odd-row td {
      background: #f6f6f6;
  }

  td.first, th.first {
      text-align: left;
  }

  td.last {
      border-right: none;
  }
  h1{
    margin-top:20px;
      text-align:center;
  }
  .header-value{
   border:none !important;
  }
  .report-table-header{
    border: 1px solid #fff !important;
  }
      </style>
    `);
    let clength = localStorage.getItem("clength");
    let c_id = localStorage.getItem("c_id");
    let centerName=localStorage.getItem("centerName");
    let businessName=localStorage.getItem("business_name");
    let Cresult =JSON.parse(localStorage.getItem("Cresult"));

    if(clength>1 && !c_id){
      setTimeout(()=>{
        this.popup();
      },5);
  }else{
    centerName=(centerName)?centerName:(Cresult)?Cresult[0].centername:'';
  } 
    mywindow.document.write("<div >"+businessName+"</div>");
    mywindow.document.write("<h1>"+title+"</h1>");
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');
    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/
    mywindow.print();
    mywindow.close();
}


export function tabletoExcel(data, wbname, appname) {	

    var uri = 'data:application/vnd.ms-excel;base64,'
    , tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
      + '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>'
      + '<Styles>'
      + '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>'
      + '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>'
      + '</Styles>' 
      + '{worksheets}</Workbook>'
    , tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>'
    , tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>'
    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }

      var ctx = "";
      var workbookXML = "";
      var worksheetsXML = "";
      var rowsXML = "";
      //for (var i = 0; i < tables.length; i++) {

        for (var k = 0; k < data.length; k++) {
          if(data[k]){
            rowsXML += '<Row>'
              for (var index in data[k]) {
                if(data[k][index]){
                  var dataType = '';
                  var dataStyle = '';
                  var dataValue =data[k][index];
                  var dataFormula = '';
                  // eslint-disable-next-line
                  dataFormula = (dataFormula)?dataFormula:(appname=='Calc' && dataType=='DateTime')?dataValue:null;
                  // eslint-disable-next-line
                  ctx = {  attributeStyleID: (dataStyle=='Currency' || dataStyle=='Date')?' ss:StyleID="'+dataStyle+'"':'', nameType: (dataType=='Number' || dataType=='DateTime' || dataType=='Boolean' || dataType=='Error')?dataType:'String', data: (dataFormula)?'':dataValue, attributeFormula: (dataFormula)?' ss:Formula="'+dataFormula+'"':'' };
                  rowsXML += format(tmplCellXML, ctx);
              }
            }
             rowsXML += '</Row>'
           }
        }
        //ctx = {rows: rowsXML, nameWS: wsnames[i] || 'Sheet' + i};
        ctx = {rows: rowsXML, nameWS:'Sheet 1'};
        worksheetsXML += format(tmplWorksheetXML, ctx);
        rowsXML = "";
   // }

      ctx = {created: (new Date()).getTime(), worksheets: worksheetsXML};
      workbookXML = format(tmplWorkbookXML, ctx);
 
      var link = document.createElement("A");
      link.href = uri + base64(workbookXML);
      link.download = wbname || 'Workbook.xls';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }