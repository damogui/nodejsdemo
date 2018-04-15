
var Lui = require('../../LUI/js/lui');
var tool = require('../../LUI/tool');
var lui = new Lui();
var commJs = require("../lib/util.js");//公共方法
var checkJs = require("../../../../Scripts/check/pub.js");//校验js
//发送请求调取省市县数据
var arrS = [];//省
var arrSs = [];//市
var arrX = [];//县

var patnerId = $("#patnerId").val();//合伙人用户id
var isEditPatnerSs = 0;//省市不做修改的时候状态0 1修改



//添加机构的弹出层事件
tool.pophide($('.eg-pop .close'), $('.eg-pop'));



//后台交互
require("../../tpl/template-helpers.js");
var tplDetailPartner1 = require("PartnerManage/PatnerDetails.tpl");//详情1
var tplDetailPartner2 = require("PartnerManage/PatnerValueList.tpl");//储值


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

        GetSinglePartnerData();//获取单个合伙人详情


    },
    initBtns: function () {
        //todo 绑定事件
        ///添加删除城市beg
        //添加城市
        $("body").delegate("#addCity", "click", function () {
            $("#btnSsxOk").css("background", "#c0c0c0");//置灰
            $("#btnBlueSNext").css("background", "#c0c0c0");//下一步置灰
            Scode = 0;
            Sscode = 0;//赋初始值

            GetSData();//初始化省市数据  添加机构的时候触发
            $('.pop-mask').show();
            $("#add-city").show();
        });
        //省市选择好的下一步操作
        $("body").delegate("#btnBlueSNext", "click", function () {

            if (Scode == "0" || Sscode == "0") {
                return;
            } else {



                //绑定县的数据
                loadXDataStr();

                $("#add-city").hide();
                $("#add-country").show();

            }

        });
        //县的的上一步操作
        $("body").delegate("#btnBluePre", "click", function () {

            $("#add-country").hide();
            $("#add-city").show();

        });
        //进行多选框的交互(添加)
        $("body").delegate("#choicexStr .lbch", "click", function () {
            $(this).find(".chssx").toggleClass("active");
            var isHave = $(this).attr("data-h");//1是有
            if (isHave == "1" && (!$(this).find(".chssx").hasClass("active"))) {//那应该是删除
                $(this).find(".chssx").attr("data-d", "1");//删除标志
            }

            //进行判断确定按钮是不是可以添加
            var objs = $("#choicexStr  .active");


            if (parseInt(objs.length) > 0) {
                $("#btnSsxOk").css("background", "");

            } else {
                $("#btnSsxOk").css("background", "#c0c0c0");
            }


        });
        //省市县提交
        $("body").delegate("#btnSsxOk", "click", function () {

            var objs = $("#choicexStr  .active");//县
            var xNames = "";
            var xIds = "";
            var xIdsDel = "";
            var xIdsAdd = "";

            if (parseInt(objs.length) > 0) {
                $("#btnSsxOk").css("background", "");


            } else {
                $("#btnSsxOk").css("background", "#c0c0c0");
                return;
            }
            var tmpSsName = $("#ssName").attr("data-str");
            var tmpSsId = $("#ssName").attr("data-id");
            $("#choicexStr  .chssx").each(function (index, item) {
                if ($(this).attr("data-h") == "1" && (!$(this).hasClass("active"))) {//负责且没勾选
                    //xNames += $(this).attr("data-name");
                    xIdsDel += $(this).attr("data-id");
                    xIdsDel += "、";

                }
                if ($(this).hasClass("active")) {
                    xNames += $(this).attr("data-name");// 显示用

                    xIds += $(this).attr("data-id");//所有选中id
                    //if (objs.length - 1 == index) {

                    //} else {
                    //    xNames += "、";
                    //    xIds += "、";
                    //}
                    if ($(this).attr("data-h") == "0") {//没有负责
                        xIdsAdd += $(this).attr("data-id");
                        xIdsAdd += "、";

                    }

                }


            });

            $("tr[data-id=" + tmpSsId + "]").remove();//进行移除已经存在的省市

            //进行拼接省市县附加div
            $("#tbpc").append("<tr data-id='" + tmpSsId + "' data-x='" + xIds + "'> <td>" + tmpSsName.split('-')[0] + "</td> <td>" + tmpSsName.split('-')[1] + "</td> <td>" + xNames + "</td><td style='color: #ff5400; cursor: pointer;' class='delete'  data-id='" + tmpSsId + "' data-x='" + xIds + "'>修改</td> </tr>");//进行追加
            //隐藏弹框

            $("#add-country").hide();
            $('.pop-mask').hide();
            isEditPatnerSs = 1;

            var jsonEditAdd = {};
            jsonEditAdd.ProvinceCityStr = tmpSsId;//省市拼接
            //jsonEditAdd.CountyStr = xIds;//县
            jsonEditAdd.CountyStrDel = xIdsDel;//县(删除)
            jsonEditAdd.CountyStrAdd = xIdsAdd;//县（添加）

            //提交表单
            $.ajax({
                type: "post",
                url: "/Management/PartnerManage/EditPartnerCityCountry",
                dataType: "json",
                data: {

                    data: JSON.stringify(jsonEditAdd), userId: patnerId
                },
                success: function (data) {
                    GetSinglePartnerData();
                    if (data.Data > 0) {
                        ShowTip("修改成功");
                        setTimeout(StopTip, 1000);//提示1秒后关闭并且进行跳转

                    } else {
                        ShowTip("修改失败");
                        setTimeout(StopTip, 1000);//提示1秒后关闭并且进行跳转
                    }


                }
            });

        });






        ///添加删除城市end

        //修改资料
        $("body").delegate("#editData", "click", function () {
             var userName=$("#patnerName").html();
             var email = $("#emailData").html();
            var corpName = $("#corpName").html();
             $("#editName").val(userName);
             $("#editEmail").val(email);
             $("#editCorpName").val(corpName);

             var sex = $(".sex").attr("data-id");//1为男0为女
             if (sex == "1") {
                 $("#radMan").addClass("active");
                 $("#radWomen").removeClass("active");
             } else {
                 $("#radMan").removeClass("active");
                 $("#radWomen").addClass("active");

             }


            $(".pop-mask").show();
            $("#edit_partner").show();


        });



        //性别交互(男)
        $("body").delegate("#lbMan", "click", function () {
            $("#radMan").addClass("active");
            $("#radWomen").removeClass("active");

        });

        //性别交互（女）
        $("body").delegate("#lbWomen", "click", function () {
            $("#radWomen").addClass("active");
            $("#radMan").removeClass("active");

        });

        //保存提交(修改资料)
        $("body").delegate("#btnEditOk", "click", function () {
            var editJson = {};
            editJson.UserId = patnerId;//用户表id
            editJson.UserName = escape($("#editName").val().trim());
            editJson.Email = escape($("#editEmail").val().trim());
            editJson.CorpName = escape($("#editCorpName").val().trim());

            if ($("#radMan").hasClass("active")) {
                editJson.Gender = 1;//男

            } else {
                editJson.Gender = 0;

                
            }
            
            if (editJson.UserName.length > 0) {
                $.ajax({
                    type: "post",
                    url: "/Management/PartnerManage/UpdatePatnerInfo",
                    dataType: "json",
                    data: {
                        data: JSON.stringify(editJson)
                    },
                    success: function (data) {

                        
                        if (data.Data > 0) {
                            GetSinglePartnerData();//获取单个合伙人详情
                            $("#edit_partner").hide();
                            $(".pop-mask").hide();
                            ShowTip("修改成功");
                            setTimeout(StopTip, 1000); //提示1秒后关闭
                        }
                        else {
                            $("#edit_partner").hide();
                            $(".pop-mask").hide();
                            ShowTip("修改失败");
                            setTimeout(StopTip, 1000); //提示1秒后关闭


                        }
                    }
                });
                
            }

        

        });


        //放弃修改
        $("body").delegate("#btnEditCancel", "click", function () {
            $(".close").click();//触发关闭

        });


        //删除区县
        $("body").delegate(".delete", "click", function () {
            var delSs = $(this).attr("data-id");//省市
            var delx = $(this).attr("data-x");//县
            loadXDataStrDel(delSs, delx);//删除的时候带的县字符串
            $("#delteCity").show();
            $(".pop-mask").show();

         

        });

        //删除区县的弹框
        $("body").delegate("#btnDelCancel", "click", function () {
            $(".close").click();//触发关闭

        });

        //进行多选框的交互(删除城市的时候)
        $("body").delegate("#choicexStrDel .lbch", "click", function () {
            //暂时不做校验
            $(this).find(".chssx").toggleClass("active");
            var isHave = $(this).attr("data-h");//1是有
            if (isHave == "1" && (!$(this).find(".chssx").hasClass("active"))) {//那应该是删除
                $(this).find(".chssx").attr("data-d", "1");//删除标志
            }
           


        });
        //(删除的确定按钮)
        $("body").delegate("#btnDelOk", "click", function () {

            var objs = $("#choicexStrDel  .active");//县
            var xNames = "";
            var xIdsDel = "";//删除
            var xIdsAdd = "";//添加
            var xIds = "";//所有选中的
            
            var tmpSsName = $("#ssNameDel").attr("data-str");
            var tmpSsId = $("#ssNameDel").attr("data-id");
           
            //需要删除的
            $("#choicexStrDel  .chssx ").each(function (index, item) {
                
                if ($(this).attr("data-h") == "1" &&(!$(this).hasClass("active"))) {//负责且没勾选
                    //xNames += $(this).attr("data-name");
                    xIdsDel += $(this).attr("data-id");
                    xIdsDel += "、";

                }
                if ($(this).hasClass("active")) {
                    xNames += $(this).attr("data-name");// 显示用
                   
                    xIds += $(this).attr("data-id");//所有选中id
                    if (objs.length - 1 == index) {

                    } else {
                        xNames += "、";
                        xIds += "、";
                    }
                    if ($(this).attr("data-h") == "0") {//没有负责
                        xIdsAdd += $(this).attr("data-id");
                        xIdsAdd += "、";

                    }
                    
                }



            });

            $("tr[data-id=" + tmpSsId + "]").remove();//进行移除已经存在的省市

            //直接提交到数据库更新
            
            if (objs.length == 0) {//0的时候进行删除(只删除)
                
                //提交表单
                $.ajax({
                    type: "post",
                    url: "/Management/PartnerManage/DelPartnerCityCountry",
                    dataType: "json",
                    data: {

                        data: tmpSsId, userId: patnerId
                    },
                    success: function (data) {
                        GetSinglePartnerData();//获取单个合伙人详情
                        if (data.Data > 0) {
                            ShowTip("修改成功");
                            setTimeout(StopTip, 1000);//提示1秒后关闭并且进行跳转

                        } else {
                            ShowTip("修改失败");
                            setTimeout(StopTip, 1000);//提示1秒后关闭并且进行跳转
                        }


                    }
                });


            } else {
                //进行拼接省市县附加div
                $("#tbpc").append("<tr data-id='" + tmpSsId + "' data-x='" + xIds + "'> <td>" + tmpSsName.split('-')[0] + "</td> <td>" + tmpSsName.split('-')[1] + "</td> <td>" + xNames + "</td><td style='color: #ff5400; cursor: pointer;' class='delete'  data-id='" + tmpSsId + "' data-x='" + xIds + "'>修改</td> </tr>");//进行追加
                //隐藏弹框
                //直接提交

                var jsonEditDel = {};
                jsonEditDel.ProvinceCityStr = tmpSsId;//省市拼接
                jsonEditDel.CountyStrDel = xIdsDel;//县(删除)
                jsonEditDel.CountyStrAdd = xIdsAdd;//县（添加）


                //提交表单
                $.ajax({
                    type: "post",
                    url: "/Management/PartnerManage/EditPartnerCityCountry",
                    dataType: "json",
                    data: {

                        data: JSON.stringify(jsonEditDel), userId: patnerId
                    },
                    success: function (data) {
                        GetSinglePartnerData();//获取单个合伙人详情
                        if (data.Data > 0) {
                            ShowTip("修改成功");
                            setTimeout(StopTip, 1000);//提示1秒后关闭并且进行跳转

                        } else {
                            ShowTip("修改失败");
                            setTimeout(StopTip, 1000);//提示1秒后关闭并且进行跳转
                        }


                    }
                });

                
            }

          

            $("#delteCity").hide();
            $('.pop-mask').hide();
          
            //CheckIsSubmit();//验证表单是不是可以提交

        });



        //重置密码
        $("body").delegate("#btnResetPwd", "click", function () {
            $(".pop-mask").show();
            $("#reset_password").show();//显示重置密码框
            
           

        });
        //重置密码(取消)
        $("body").delegate("#resetPwdCancel", "click", function () {
            $(".close").click();//触发关闭



        });
        //重置密码（确定）
        $("body").delegate("#resetPwdOk", "click", function () {
            $.ajax({
                type: "post",
                url: "/Management/PartnerManage/ReaSetPatnerPwd",
                dataType: "json",
                data: {
                    data: patnerId//用户id
                },
                success: function (data) {

                    
                    if (data.Data > 0) {
                        $(".close").click();//触发关闭
                        ShowTip("重置成功");
                        setTimeout(StopTip, 1000); //提示1秒后关闭
                    }
                    else {
                        $(".close").click();//触发关闭
                        ShowTip("重置失败");
                        setTimeout(StopTip, 1000); //提示1秒后关闭


                    }
                }
            });



        });
        //禁用账号
        $("body").delegate("#btnBanAccount", "click", function () {

            $("#bandName").html($("#patnerName").html());
            $("#bandTel").html($("#patnerTel").html());


            $(".pop-mask").show();
            $("#bandDiv").show();//显示重置密码框

        });

      
        //禁用账号(取消)
        $("body").delegate("#btnBandCancel", "click", function () {
            $(".close").click();//触发关闭



        });
        //禁用账号（确定）
        $("body").delegate("#btnBandOk", "click", function () {
            $.ajax({
                type: "post",
                url: "/Management/PartnerManage/BandPatner",
                dataType: "json",
                data: {
                    data: patnerId//用户id
                },
                success: function (data) {

                    
                    if (data.Data > 0) {
                        GetSinglePartnerData();//获取单个合伙人详情
                        $(".close").click();//触发关闭
                        ShowTip("禁用成功");
                        setTimeout(StopTip, 1000); //提示1秒后关闭
                    }
                    else {
                        $(".close").click();//触发关闭
                        ShowTip("禁用失败");
                        setTimeout(StopTip, 1000); //提示1秒后关闭


                    }
                }
            });



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

//获取合伙人单条数据
function GetSinglePartnerData() {


    $.ajax({
        type: "post",
        url: "/Management/PartnerManage/GetSinglePartnerData",
        dataType: "json",
        data: {
            data: patnerId
        },
        success: function (data) {

            
            if (data.Data) {
                //$("#patnerName").html(data.Data.UserName);
                $("#tb").html(tplDetailPartner1(data.Data));
                if (data.Data.IsCorpNum == 0) {
                    $("#addCity").css("display", "none");//禁用的时候隐藏添加城市
                   

                } else {
                    $("#bandSpan").css("display", "none");//禁用文字不显示
                }
               

                loadPatnerValueList(1);//加载储值记录
            }
            else {

                $("#tb").html("");

            }
        }
    });

}


//加载合伙人的储值记录列表
function loadPatnerValueList(page) {
    var pageSize = 10;//分页大小
    //加载机构列表
    $.ajax({
        type: "post",
        url: "/Management/PartnerManage/GetPatnerValueList",
        dataType: "json",
        data: {
            data: patnerId, PageIndex: page, PageSize: pageSize
        },
        success: function (data) {
            
            if (data.Data) {
                $("#tb2").html(tplDetailPartner2(data.Data));
                $("#Totalcount").html(data.PageSum);
                Paginator.Paginator(pageSize, page, data.PageSum, loadPatnerValueList);
            }
            else {
                $("#Totalcount").html("0");
             
                $("#tb2").html('<tr  style="border:none;text-align:center;height:280px;" data-id="noDatatr"><td style="font-size: 16px;" colspan="9"><div class="data_img"><div class="big_area" style="margin-top:10px;line-height:30px;"><br/><span>暂无记录</span></div></div></td></tr>');//清空数据

            }
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



var Scode = 0;//省的代码当前选择
var Sscode = 0;//市当前选择
//var ssName = "";//省市名称
//var Xcode = "110101";//县
var provinceData = {
};//省市全部数据
var xData = {
};//县的数据
//发送请求调取省数据
function GetSData() {

    arrS = [];//加载前进行清空
    //加载机构列表
    $.ajax({
        type: "post",
        url: "/Management/OrgManage/GetProvinceAndCity",
        dataType: "json",
        data: {
            data: ""
        },
        success: function (data) {
            if (data.Data && data.Data.length > 0) {

                provinceData = data.Data;
                arrS.push({
                    name: "请选择省", id: 0, pid: 0
                });//省
                for (var i = 0; i < data.Data.length; i++) {

                    arrS.push({
                        name: data.Data[i].Name, id: data.Data[i].Code, pid: data.Data[i].Code
                    });//省
                }

                lui.initDropDownList({
                    warpid: "drop_sheng", subtextlength: 10, width: 162, nameField: 'name', idField: 'id', data: arrS, selectedCallBack: OptSxBind
                });//省

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

    arrSs.push({
        name: "请选择市", id: 0, pid: 0
    });//市区
    arrX.push({
        name: "请选择区县", id: 0, pid: 0
    });//县

    lui.initDropDownList({
        warpid: "drop_shi", subtextlength: 10, width: 162, nameField: 'name', idField: 'id', data: arrSs, selectedCallBack: null
    });//市

}





////绑定事件
function OptSxBind() {
    Scode = $("#drop_sheng").attr("data-id");
    BindSx(Scode);
    //Scode = $("#drop_shi").attr("data-id");
    Sscode = $("#drop_shi").attr("data-id");
    if (Scode == "0" || Sscode == "0") {
        $("#btnBlueSNext").css("background", "#c0c0c0");
        return;
    } else {
        $("#btnBlueSNext").css("background", "");//可以进行点击
    }

}



//市区的下拉点击的时候(判断能不能下一步)
function OptShiBind() {
    Scode = $("#drop_sheng").attr("data-id");
    Sscode = $("#drop_shi").attr("data-id");
    if (Scode == "0" || Sscode == "0") {
        $("#btnBlueSNext").css("background", "#c0c0c0");
        return;
    } else {
        $("#btnBlueSNext").css("background", "");//可以进行点击
    }



}

//绑定市县
function BindSx(scode) {

    arrSs.length = 0;
    arrX.length = 0;
    //添加默认值

    arrSs.push({
        name: "请选择市", id: 0, pid: 0
    });//市区
    arrX.push({
        name: "请选择区县", id: 0, pid: 0
    });//县
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




    lui.initDropDownList({
        warpid: "drop_shi", width: 160, subtextlength: 10, nameField: 'name', idField: 'id', data: arrSs, selectedCallBack: OptShiBind
    });//市



}

///加载县的数据和省市名
var haveS = [];//包括省市
var haveX = [];//包括县
function loadXDataStr() {
    //获取已经选定的县的数据
     haveS = [];//包括省市
     haveX = [];//包括县

     $("#tbpc tr").each(function (index, item) {
        haveS.push($(item).attr("data-id"));
        var aar = $(item).attr("data-x").split('、');
        for (var i = 0; i < aar.length; i++) {
            haveX.push(aar[i]);//追加区县
        }
      
    });

    //加载县数据
    $.ajax({
        type: "post",
        url: "/Management/PartnerManage/GetCountyDataByProvinceCityByPatnerId",
        dataType: "json",
        data: {
            data: JSON.stringify({
                ProvinceId: Scode, CityId: Sscode
            }), userId:patnerId     //用户id
        },
        success: function (data) {
            if (data.Data && data.Data.length > 0) {

                var lbStr0 = "";

                for (var i = 0; i < data.Data.length; i++) {

                    if (i % 3 === 0 && i > 0) {
                        lbStr0 += " <br/>";
                    }
                    

                    if (data.Data[i].Tag == 1) {//已经存在其他合伙人
                        lbStr0 += "<label  class='unchoose' data-id='" + data.Data[i].Id + "' data-h='" + data.Data[i].IsHave + "' data-d='0'  > <span class='checkbox'  data-id='" + data.Data[i].Id + "' data-name='" + data.Data[i].Name + "' data-h='" + data.Data[i].IsHave + "' data-d='0'></span><span>" + data.Data[i].Name + "</span> </label>";
                        
                    }
                    else if ($.inArray(""+data.Data[i].Id, haveX)!=-1) {//如果存在
                        lbStr0 += "<label data-id='" + data.Data[i].Id + "'    data-h='" + data.Data[i].IsHave + "' data-d='0'  class='lbch' > <span class='checkbox chssx active'  data-id='" + data.Data[i].Id + "' data-name='" + data.Data[i].Name + "' data-h='" + data.Data[i].IsHave + "' data-d='0'></span><span>" + data.Data[i].Name + "</span> </label>";
                        
                    } else {
                        lbStr0 += "<label data-id='" + data.Data[i].Id + "' data-h='" + data.Data[i].IsHave + "' data-d='0'  class='lbch' > <span class='checkbox chssx'  data-id='" + data.Data[i].Id + "' data-name='" + data.Data[i].Name + "' data-h='" + data.Data[i].IsHave + "' data-d='0'></span><span>" + data.Data[i].Name + "</span> </label>";
                        
                    }

                   
                }
                var shengStr = $("#drop_sheng").attr("title");
                var shiStr = $("#drop_shi").attr("title");


                $("#ssName").attr("data-id", Scode + "-" + Sscode);//省市id
                $("#ssName").attr("data-str", shengStr + "-" + shiStr);//省市名称进行拼接使用

                $("#ssName").html(data.TagValue);//省市
                $("#choicexStr").html(lbStr0);



            }
            else {

                alert("获取数据失败");

            }
        }
    });


}




///删除时候加载县的数据和省市名
var haveSDel = [];//包括省市(删除)
var haveXDel = [];//包括县(删除)
function loadXDataStrDel(delSscode, delXcode) {
    //获取已经选定的县的数据
    haveSDel = [];//包括省市
    haveXDel = [];//包括县

    var aar = delXcode.split('、');
    for (var i = 0; i < aar.length; i++) {
        haveXDel.push(aar[i]);//追加区县
    }

    //加载县数据
    $.ajax({
        type: "post",
        url: "/Management/PartnerManage/GetCountyDataByProvinceCityByPatnerId",
        dataType: "json",
        data: {
            data: JSON.stringify({
                ProvinceId: delSscode.split('-')[0], CityId: delSscode.split('-')[1]
            }), userId:patnerId
        },
        success: function (data) {
            if (data.Data && data.Data.length > 0) {

                var lbStr0 = "";

                for (var i = 0; i < data.Data.length; i++) {

                    if (i % 3 === 0 && i > 0) {
                        lbStr0 += " <br/>";
                    }

                    if (data.Data[i].Tag == 1) {//已经存在合伙人
                        lbStr0 += "<label   data-id='" + data.Data[i].Id + "' data-h='" + data.Data[i].IsHave + "' data-d='0'  class='lbch unchoose' > <span class='checkbox'  data-id='" + data.Data[i].Id + "' data-name='" + data.Data[i].Name + "' data-h='" + data.Data[i].IsHave + "' data-d='0'></span><span>" + data.Data[i].Name + "</span> </label>";

                    }
                    else if ($.inArray("" + data.Data[i].Id, haveXDel) != -1) {//如果存在
                        lbStr0 += "<label data-id='" + data.Data[i].Id + "' data-h='" + data.Data[i].IsHave + "'  data-d='0' class='lbch' > <span class='checkbox chssx active'  data-id='" + data.Data[i].Id + "' data-name='" + data.Data[i].Name + "' data-h='" + data.Data[i].IsHave + "' data-d='0'></span><span>" + data.Data[i].Name + "</span> </label>";

                    } else {
                        lbStr0 += "<label data-id='" + data.Data[i].Id + "' data-h='" + data.Data[i].IsHave + "' data-d='0'  class='lbch' > <span class='checkbox chssx'  data-id='" + data.Data[i].Id + "' data-name='" + data.Data[i].Name + "' data-h='" + data.Data[i].IsHave + "' data-d='0'></span><span>" + data.Data[i].Name + "</span> </label>";

                    }


                }
                //var shengStr = $("#drop_sheng").attr("title");
                //var shiStr = $("#drop_shi").attr("title");


                $("#ssNameDel").attr("data-id", delSscode.split('-')[0] + "-" + delSscode.split('-')[1]);//省市id
                if (data.TagValue.indexOf("-")==-1) {//判断是不是直辖市
                    $("#ssNameDel").attr("data-str", data.TagValue + "-" + data.TagValue);//省市名称进行拼接使用
                } else {
                    $("#ssNameDel").attr("data-str", data.TagValue);//省市名称进行拼接
                }
             

                $("#ssNameDel").html(data.TagValue);//省市
                $("#choicexStrDel").html(lbStr0);



            }
            else {

                alert("获取数据失败");

            }
        }
    });


}



