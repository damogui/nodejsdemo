/*! <DEBUG:undefined> */
function anonymous($data,$filename) {'use strict';var $utils=this,$helpers=$utils.$helpers,$each=$utils.$each,$value=$data.$value,$index=$data.$index,$escape=$utils.$escape,dateFormat=$data.dateFormat,$out='';$out+=' ';
$each($data,function($value,$index){
$out+=' <tr> <td>';
$out+=$escape($value.UserName);
$out+='</td> <td>';
$out+=$escape($value.Tel);
$out+='</td> ';
if($value.IsCorpStr=="有效"){
$out+=' <td class="green">';
$out+=$escape($value.IsCorpStr);
$out+='</td> ';
}else{
$out+=' <td class="red">';
$out+=$escape($value.IsCorpStr);
$out+='</td> ';
}
$out+=' <td>';
$out+=$escape($value.Tel);
$out+='</td> <td>';
$out+=$escape($value.Tel);
$out+='</td> <td>';
$out+=$escape($value.CurrentValue);
$out+='</td> <td>';
$out+=$escape($value.SumValue);
$out+='</td> <td>';
$out+=$escape($value.Createtime|dateFormat: "yyyy-MM-dd");
$out+='</td> <td>充值</td> </tr> ';
});
return new String($out);}