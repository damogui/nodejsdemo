
var Lui = require('../../LUI/js/lui');
var tool = require('../../LUI/tool');
var lui = new Lui();
var commJs = require("../lib/util.js");//公共方法
var checkJs = require("../../../../Scripts/check/pub.js");//校验js
//发送请求调取省市县数据
var arrS = [];//省
var arrSs = [];//市
var arrX = [];//县

//有效无效是否启用区域内管辖权；1是； 0否； 
lui.initDropDownList({ warpid: "drop_valid", width: 85, nameField: 'name', idField: 'id', data: [{ name: '状态', id: '-1', pid: '' }, { name: '有效', id: '1', pid: '00' }, { name: '无效', id: '0', pid: '00' }], selectedCallBack: GetPartnerDataForDrop });


//添加机构的弹出层事件
tool.pophide($('.eg-pop .close'), $('.eg-pop'));



//后台交互
require("../../tpl/template-helpers.js");
var tplTablePartner = require("PartnerManage/PartnerList.tpl");//合伙人列表

//分页
var pop = require("../lib/popup/popuptip.js");
var loadimg = require("../lib/popup/showloadimg.js");
var Paginator = require('../lib/page/Paginator.js');
var module = {
    init: function () {
        //todo 逻辑函数
        this.render();
        this.initBtns();

    },

    render: function () {
       
        GetSData();//初始化省市数据  添加机构的时候触发
      

    },
    initBtns: function () {
        //todo 绑定事件
     
       
        //添加合伙人跳转
        $("body").delegate("#btnAddPartner", "click", function () {
            window.location.href = "/Management/PartnerManage/AddPartner/"+window.tokenID;

        });

        //详情页跳转
        $("body").delegate("#tb tr", "click", function () {
            var idP = $(this).attr("data-id");
            if (idP != "noDatatr") {
                window.location.href = "/Management/PartnerManage/Details/" + idP+"/"+window.tokenID;//进行跳转
            }
          

        });

        //点击充值进行充值
        //var currentAddMoney = 0;
        $("body").delegate("#tb tr .addMoney", "click", function (event) {
            event.stopPropagation();//阻止冒泡
            //currentAddMoney = $(this).attr("data-id");
            $("#partnerIntM,#partnerIntC").val("输入整数金额");
            $("#addMark").val("");//备注
            $("#btnAddMoneyOk").removeClass("go_shop").addClass("gray");//变灰色

            //赋值
            $("#patnerName").html($(this).attr("data-name"));//姓名
            $("#patnerName").attr("data-id", $(this).attr("data-id"));//用户id
            $("#patnerLeft").html($(this).attr("data-left"));//剩余储值
           
            $("#calMoney").html($(this).attr("data-left"));//预计充值
            $(".pop-mask").show();
            $("#partner-coins").css("display","");//显示
        });

       
        //机构付款金额和奖励储值失去焦点的时候
        $("body").delegate("#partnerIntM", "blur", function () {
            CalMoney();
        });
        //checkbox点击的时候
        $("body").delegate("#partnerIntC", "blur", function () {

            CalMoney();
        });


        //添加储值提交btnAddMoneyOk
        $("body").delegate("#btnAddMoneyOk", "click", function () {
            var jsonAddCz = {};
            jsonAddCz.UserId = $("#patnerName").attr("data-id");
            jsonAddCz.OrgMoney = $("#partnerIntM").val().trim();//rmb
            jsonAddCz.OrgValue = $("#partnerIntC").val().trim();//手填储值
            jsonAddCz.Remarks = escape($("#addMark").val().trim());//备注


            //当充值金额小于实收金额的时候返回
            if (parseInt(jsonAddCz.OrgValue) < parseInt(jsonAddCz.OrgMoney)) {
                $("#btnAddMoneyOk").removeClass("go_shop").addClass("gray");
                return;
            }

            if (isCanSubM == 1 && jsonAddCz.OrgMoney.length > 0 && jsonAddCz.OrgValue.length > 0 && checkJs.IsPlusInt(jsonAddCz.OrgMoney) && checkJs.IsPlusInt(jsonAddCz.OrgValue)) {
                //提交表单
                $.ajax({
                    type: "post",
                    url: "/Management/PartnerManage/AddPartnerMoney",
                    dataType: "json",
                    data: {
                        data: JSON.stringify(jsonAddCz)
                    },
                    success: function(data) {
                        if (data.OK) {
                            $(".eg-pop .close").click(); //关闭弹窗
                            GetPartnerData(1); //加载数据
                            ShowTip("充值成功");
                            setTimeout(StopTip, 1000); //提示1秒后关闭

                        } else {

                            ShowTip("充值失败");
                            setTimeout(StopTip, 1000); //提示1秒后关闭
                        }


                    }
                });

            } else {
                isCanSubM = 0;
                $("#btnAddMoneyOk").removeClass("go_shop").addClass("gray");//变灰

            }
         



        });
        //储值的取消
        $("body").delegate("#addMCancel", "click", function () {
            $("#save-pop").hide();
            $('.pop-mask').hide();
        });

    }


};

var titleO = "全部";//$("#drop_type").attr("title")  定义全局变量来监听改变事件
var dataType = "0";
//绑定数据
$(function () {
    module.init();
 


});

//为了下拉框的联动的调取列表方法
function GetPartnerDataForDrop() {
    GetPartnerData(1);

}


//发送请求调取数据
function GetPartnerData(page) {
    //$("#divLoading").show();

    loadimg.ShowLoadingForTableNoClass($("#tb"), 12);//不要tr样式的清除
    if (page == undefined) {
        page = 1;
    }

    var pageSize = 10;//分页大小
    var json = {};
    json.IsCorp = $("#drop_valid").attr("data-id");//-1:无效，1有效，0无效
    json.ProvinceId = $("#drop_sheng").attr("data-id");//省市县
    json.CityId = $("#drop_shi").attr("data-id");
    json.CountyId = $("#drop_x").attr("data-id");
    //加载机构列表
    $.ajax({
        type: "post",
        url: "/Management/PartnerManage/GetPatnerList",
        dataType: "json",
        data: {
            //OrgType: dataType,
            //KeyWord: escape($("#txtserch").val()) //$("#tagId").val()
            data: JSON.stringify(json), PageIndex: page, PageSize: pageSize
        },
        success: function (data) {

           
            if (data.Data && data.Data.length > 0) {
                $("#tb").html(tplTablePartner(data.Data));
                $("#Totalcount").html(data.PageSum);
                //加载列表
                Paginator.Paginator(pageSize, page, data.PageSum, GetPartnerData);
              

            }
            else {

                $("#tb").html("");
                //<img src="../../../bundle/img/noclass.png" style="text-align:center;">
                $("#tb").html('<tr  style="border:none;text-align:center;height:280px;" data-id="noDatatr"><td style="font-size: 16px;" colspan="9"><div class="data_img"><div class="big_area" style="margin-top:10px;line-height:30px;"><br/><span>暂无记录</span></div></div></td></tr>');//清空数据
                $("#pagination").html("");//分页控件不显示
                $("#Totalcount").html(0);//数据设置为0
                //$("#bandTotalcount").html(0);//禁用




            }
        }
    });

}


var Scode = "110000";//省的代码
var Sscode = "110000";//市
var Xcode = "110101";//县
var provinceData = {};//省市全部数据
var xData = {};//县的数据
//发送请求调取省数据
function GetSData() {
    //var json = {};
    //json.Parent = dataType;//0:全部，1金牌，2银牌
    //json.KeyWord =escape(undefined);
    arrS = [];//加载前进行清空
    //加载机构列表
    $.ajax({
        type: "post",
        url: "/Management/OrgManage/GetProvinceAndCity",
        dataType: "json",
        data: {
            //data: JSON.stringify(json)
        },
        success: function (data) {
            if (data.Data && data.Data.length > 0) {

                provinceData = data.Data;
                arrS.push({ name: "省", id: 0, pid: 0 });//省
                for (var i = 0; i < data.Data.length; i++) {

                    arrS.push({ name: data.Data[i].Name, id: data.Data[i].Code, pid: data.Data[i].Code });//省
                }

                lui.initDropDownList({ warpid: "drop_sheng", subtextlength: 6, width: 85, nameField: 'name', idField: 'id', data: arrS, selectedCallBack: OptSxBind });//省

                BindEmptySx();//绑定空的数据
              
            }
            else {

                alert("获取数据失败");

            }
        }
    });

}



//绑定空的市县
function BindEmptySx() {

    arrSs.length = 0;
    arrX.length = 0;
    //添加默认值
   
    arrSs.push({ name: "市", id: 0, pid: 0 });//市区
    arrX.push({ name: "区县", id: 0, pid: 0 });//县

    lui.initDropDownList({ warpid: "drop_shi", width: 90, nameField: 'name', idField: 'id', data: arrSs});//市
    lui.initDropDownList({
        warpid: "drop_x", width: 90, nameField: 'name', idField: 'id', data: arrX
    });//县

    //加载列表
    GetPartnerData();//获取列表


}




//计算总额
var isCanSubM = 0;//0不能提交1能提交
function CalMoney() {
   
    isCanSubM = 0;//是否可以提交
    var total = 0;
    var patnerLeft = $("#patnerLeft").html();//剩余储值
    var partnerIntM = $("#partnerIntM").val();//充值人民币
    var patnerAdd = $("#partnerIntC").val();//充值储值
    if (patnerLeft.length>0) {
        patnerLeft = patnerLeft.replace(/,/g, "");
    }

    
    //当充值金额小于实收金额的时候返回
    if (parseInt(patnerAdd) < parseInt(partnerIntM)) {
        $("#btnAddMoneyOk").removeClass("go_shop").addClass("gray");
        $("#calMoney").html($("#patnerLeft").html());
        //ShowTip("充值金额必须大于等于实收金额");
        //setTimeout(StopTip, 1000); //提示1秒后关闭
        return;
    }


    if (checkJs.IsPlusInt(patnerAdd) && patnerAdd.length > 0) {//如果是int类型大于0
        total = parseFloat(patnerLeft) + parseFloat(patnerAdd);
        $("#calMoney").html(commJs.splitNumber(total));
        
    } else {
        $("#calMoney").html($("#patnerLeft").html());
    }
   
   
    if (partnerIntM.length > 0 && patnerAdd.length > 0 && checkJs.IsPlusInt(patnerAdd) && checkJs.IsPlusInt(partnerIntM)) {
        $("#btnAddMoneyOk").removeClass("gray").addClass("go_shop");
        isCanSubM = 1;//是否可以提交

    } else {
        $("#btnAddMoneyOk").removeClass("go_shop").addClass("gray");
    }
}



//校验是不是电话
function IsMobile(obj) {
    return (/^1[3|4|5|7|8]\d{9}$/.test(obj));
}


//绑定市县
function BindSx(scode) {

    arrSs.length = 0;
    arrX.length = 0;
    //添加默认值

    arrSs.push({ name: "市", id: 0, pid: 0 });//市区
    arrX.push({ name: "区县", id: 0, pid: 0 });//县
    for (var i = 0; i < provinceData.length; i++) {
        if (provinceData[i].Code == scode) {
            xData = provinceData[i].CityList[0].AreaList;//赋值县的数据
            for (var j = 0; j < provinceData[i].CityList.length; j++) {
                arrSs.push({
                    name: provinceData[i].CityList[j].Name, id: provinceData[i].CityList[j].Code, pid: '1'
                });//市
            }

        }

    }

    //for (var k = 0; k < xData.length; k++) {
    //    arrX.push({
    //        name: xData[k].Name, id: xData[k].Code, pid: '1'
    //    });//县

    //}
    lui.initDropDownList({ warpid: "drop_shi", width: 90, nameField: 'name', idField: 'id', data: arrSs, selectedCallBack: OptShiBind });//市
    lui.initDropDownList({
        warpid: "drop_x", width: 90, nameField: 'name', idField: 'id', data: arrX, selectedCallBack: null
    });//县

    //重新加载数据
    GetPartnerData(1);//获取列表

}
//绑定县参数传递市的code
function Bindx(sscode) {
   
    arrSs.length = 0;
    arrX.length = 0;
    for (var i = 0; i < provinceData.length; i++) {
        if (provinceData[i].Code == Scode) {

            for (var j = 0; j < provinceData[i].CityList.length; j++) {
                if (provinceData[i].CityList[j].Code == sscode) {
                    xData = provinceData[i].CityList[j].AreaList;//赋值对应的县的数据

                }

            }


        }

    }
    arrX.push({
        name: "区县", id: 0, pid: 0
    });//县
    if (sscode != "0") {
        for (var k = 0; k < xData.length; k++) {
            arrX.push({
                name: xData[k].Name, id: xData[k].Code, pid: '1'
            });//县

        }
        
    }
   
    //lui.initDropDownList({ warpid: "drop_shi", width: 60, nameField: 'name', idField: 'id', data: arrSs });//市
    lui.initDropDownList({
        warpid: "drop_x", width: 90, nameField: 'name', idField: 'id', data: arrX, selectedCallBack: GetPartnerDataForDrop
    });//县


    GetPartnerData(1);//获取列表

}

//绑定事件
function OptSxBind() {
    Scode = $("#drop_sheng").attr("data-id");

    BindSx(Scode);

}

//市区的下拉点击的时候
function OptShiBind() {
    Sscode = $("#drop_shi").attr("data-id");

    Bindx(Sscode);

}







//添加实时校验
$(function () {
    OptCheck();

});
//校验
function OptCheck() {
    //充值校验整数和长度
    $("#partnerIntM,#partnerIntC").keyup(function () {
       
        if ($(this).val().length > 8) {
            var o = $(this).val();
            $(this).val(o.substring(0, 7));//进行截取
           
        }
       
        if (checkJs.IsPlusInt($(this).val())) {
          
        } else {
            $(this).val("");
        }

    });
    //获焦点时操作
    $("#partnerIntM,#partnerIntC").focus(function () {

        if ($(this).val() == "输入整数金额") {
            $(this).val("");
        }


    });
    //失去焦点的时候判断
    $("#partnerIntM,#partnerIntC").blur(function () {

        if ($(this).val() == "") {
            $(this).val("输入整数金额");
        }


    });


   // checkJs.IsPlusInt();
    
    $("#txtcontel").keyup(function () {
        if (commJs.IsPlusInt(this.value)) {
            $("#addTip").css({ "visibility": "hidden" });
        } else {
            $("#addTip").css({ "visibility": "visible" }).html("手机格式不对！");
        }

    });

    //校验金额
    $("#txtOrgMoney").keyup(function () {

        if (this.value.length > 1) {
            $("#addTipM").css({ "visibility": "hidden" });
        }

    });



}






//提示					
function ShowTip(obj) {
   
    $("#showTip").html(obj);
    $("#showTip").show();

}




//停止提示
function StopTip() {
    $("#showTip").hide();
}
//停止提示并且跳转
//function StopTipAndJump() {
//    $("#ShowTipAdd").hide();
//    window.location.href = "/Management/PartnerManage/Index";//添加成功之后进行跳转

//}


////回车事件
//$(function () {
//    $('#txtserch').bind('keypress', function (event) {
//        if (event.keyCode == "13") {
//            GetOrgData(1);

//        }
//    });
//});




