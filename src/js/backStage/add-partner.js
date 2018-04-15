
var Lui = require('../../LUI/js/lui');
var tool = require('../../LUI/tool');
var lui = new Lui();
var commJs = require("../lib/util.js");//公共方法
//发送请求调取省市县数据
var arrS = [];//省
var arrSs = [];//市
var arrX = [];//县
//var orgId = 0;//当前的orgId

//添加机构的弹出层事件
tool.pophide($('.eg-pop .close'), $('.eg-pop'));


//单选按钮
tool.radio();
var module = {
    init: function () {
        //todo 逻辑函数
        this.render();
        this.initBtns();

    },

    render: function () {
        //加载列表


    },
    initBtns: function () {
        //todo 绑定事件

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
        //进行多选框的交互
        $("body").delegate(".lbch", "click", function () {
            $(this).find(".chssx").toggleClass("active");
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
            if (parseInt(objs.length) > 0) {
                $("#btnSsxOk").css("background", "");


            } else {
                $("#btnSsxOk").css("background", "#c0c0c0");
                return;
            }
            var tmpSsName = $("#ssName").attr("data-str");
            var tmpSsId = $("#ssName").attr("data-id");
            $("#choicexStr  .active").each(function (index, item) {
                xNames += $(this).attr("data-name");
                xIds += $(this).attr("data-id");
                if (objs.length - 1 == index) {

                } else {
                    xNames += "、";
                    xIds += "、";
                }


            });

            $("tr[data-id=" + tmpSsId + "]").remove();//进行移除已经存在的省市

            //进行拼接省市县附加div
            $("#tb").append("<tr data-id='" + tmpSsId + "' data-x='" + xIds + "'> <td>" + tmpSsName.split('-')[0] + "</td> <td>" + tmpSsName.split('-')[1] + "</td> <td>" + xNames + "</td> </tr>");//进行追加
            //隐藏弹框

            $("#add-country").hide();
            $('.pop-mask').hide();

            CheckIsSubmit();//验证表单是不是可以提交

        });

        //性别交互(男)
        $("body").delegate("#lbMan", "click", function () {
            $("#sexMan").addClass("active");
            $("#sexWomen").removeClass("active");

        });

        //性别交互（女）
        $("body").delegate("#lbWomen", "click", function () {
            $("#sexWomen").addClass("active");
            $("#sexMan").removeClass("active");

        });

        //表单提交（添加合伙人）
        $("body").delegate("#btnOk", "click", function () {
            //if (isCanSubmit == 0) {//不可以
            //    return;

            //}
            var jsonAdd = {};
            var arrPcc = new Array();
            jsonAdd.UserName = escape($("#patnerName").val().trim());//姓名
            jsonAdd.CorpName = escape($("#patnerCorpName").val().trim());//合伙人公司地址

            if ($("#sexMan").hasClass("active")) {
                jsonAdd.Gender = 1;
            } else {
                jsonAdd.Gender = 0;
            }


            if ($("#patnerName").val().length < 1) {
                return;
            }

            //校验电话

            if (!commJs.IsMobile($("#patnerTel").val())) {
                ShowTip("电话格式不对");
                setTimeout(StopTip, 1000);//提示1秒后关闭
                return;
            } 

            ///校验邮箱
            var ssxdatatr = $("#tb tr");
            if (ssxdatatr.length < 1) {
                return;
            }

            ///校验邮箱
            if (!IsEmail($("#patnerEmail").val())) {
                ShowTip("邮箱格式不对");
                setTimeout(StopTip, 1000);//提示1秒后关闭
                return;

            } 
            jsonAdd.Tel = $("#patnerTel").val();//手机
            jsonAdd.Email = $("#patnerEmail").val();//邮箱

            jsonAdd.Remark = $("#patnerMark").val();//备注
            //添加城市


           
            $("#tb tr").each(function (index, item) {
                var json2 = {
                };
                json2.ProvinceCityStr = $(item).attr("data-id");
                json2.CountyStr = $(item).attr("data-x");
                arrPcc.push(json2);

            });

            jsonAdd.PartnerAreas = arrPcc;//合伙人地区
           
            //提交表单
            $.ajax({
                type: "post",
                url: "/Management/OrgManage/CheckOrgPhone",
                dataType: "json",
                data: {

                    data: jsonAdd.Tel, orgId: -1
                },
                success: function (data) {


                    if (data.Data == "0") {

                        $(".eg-pop .close").click();//关闭弹窗
                        //提交表单
                        $.ajax({
                            type: "post",
                            url: "/Management/PartnerManage/SubmitPartner",
                            dataType: "json",
                            data: {

                                data: JSON.stringify(jsonAdd)
                            },
                            success: function (data) {
                                if (data.Data > 0) {
                                    ShowTip("添加成功");
                                    setTimeout(StopTipAndJump, 1000);//提示1秒后关闭并且进行跳转
                                    
                                }


                            }
                        });
                    } else {
                        ShowTip("电话重复");
                        setTimeout(StopTip, 1000);//提示1秒后关闭

                    }

                }
            });







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


//提示					
function ShowTip(obj) {
   
    $("#ShowTipAdd").html(obj);
    $("#ShowTipAdd").show();

}




//停止提示
function StopTip() {
    $("#ShowTipAdd").hide();
}
//停止提示并且跳转
function StopTipAndJump() {
    $("#ShowTipAdd").hide();
    window.location.href = "/Management/PartnerManage/Index/"+window.tokenID;//添加成功之后进行跳转

}



///加载县的数据和省市名
var haveS = [];//包括省市
var haveX = [];//包括县
function loadXDataStr() {
    //获取已经选定的县的数据
     haveS = [];//包括省市
     haveX = [];//包括县

    $("#tb tr").each(function (index, item) {
        haveS.push($(item).attr("data-id"));
        var aar = $(item).attr("data-x").split('、');
        for (var i = 0; i < aar.length; i++) {
            haveX.push(aar[i]);//追加区县
        }
      
    });

    //加载机构列表
    $.ajax({
        type: "post",
        url: "/Management/PartnerManage/GetCountyDataByProvinceCity",
        dataType: "json",
        data: {
            data: JSON.stringify({
                ProvinceId: Scode, CityId: Sscode
            })
        },
        success: function (data) {
            if (data.Data && data.Data.length > 0) {

                var lbStr0 = "";

                for (var i = 0; i < data.Data.length; i++) {

                    if (i % 3 === 0 && i > 0) {
                        lbStr0 += " <br/>";
                    }

                    if (data.Data[i].Tag == 1) {//已经存在其他合伙人
                        lbStr0 += "<label for='" + data.Data[i].Id + "' class='lbch unchoose' > <span class='checkbox'  data-id='" + data.Data[i].Id + "' data-name='" + data.Data[i].Name + "'></span><span>" + data.Data[i].Name + "</span> </label>";
                        
                    }
                    else if ($.inArray(""+data.Data[i].Id, haveX)!=-1) {//如果存在
                        lbStr0 += "<label for='" + data.Data[i].Id + "' class='lbch' > <span class='checkbox chssx active'  data-id='" + data.Data[i].Id + "' data-name='" + data.Data[i].Name + "'></span><span>" + data.Data[i].Name + "</span> </label>";
                        
                    } else {
                        lbStr0 += "<label for='" + data.Data[i].Id + "' class='lbch' > <span class='checkbox chssx'  data-id='" + data.Data[i].Id + "' data-name='" + data.Data[i].Name + "'></span><span>" + data.Data[i].Name + "</span> </label>";
                        
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
                    name: "请选择省份", id: 0, pid: 0
                });//省
                for (var i = 0; i < data.Data.length; i++) {

                    arrS.push({
                        name: data.Data[i].Name, id: data.Data[i].Code, pid: data.Data[i].Code
                    });//省
                }

                lui.initDropDownList({
                    warpid: "drop_sheng", subtextlength: 10, width: 160, nameField: 'name', idField: 'id', data: arrS, selectedCallBack: OptSxBind
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
        warpid: "drop_shi", subtextlength: 10, width: 160, nameField: 'name', idField: 'id', data: arrSs, selectedCallBack: null
    });//市

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





//添加实时校验(涉及到所有字段)
$(function () {
    OptCheckSubmit();

});
//校验
function OptCheckSubmit() {
    //姓名和备注
    $("#patnerName").keyup(CheckIsSubmit);
    //校验电话
    $("#patnerTel").keyup(CheckIsSubmit);
    ///校验邮箱
    $("#patnerEmail").keyup(CheckIsSubmit);


}

//判断是不是可以提交
var isCanSubmit = 0;//0不可以提交1可以
function CheckIsSubmit() {
    isCanSubmit = 1;//初始化 的时候可以提价
    //姓名和备注
  
   if ( $("#patnerName").val().length < 1) {
        isCanSubmit = 0;
    }

    //校验电话

    if (commJs.IsMobile($("#patnerTel").val())) {
    } else {
        isCanSubmit = 0;
        //ShowTip("电话格式不对");
        //setTimeout(StopTip, 1000);//提示1秒后关闭
    }

    ///校验邮箱

    if (IsEmail($("#patnerEmail").val())) {

    } else {
        isCanSubmit = 0;
      
    }



    var ssxdatatr = $("#tb tr");
    if (ssxdatatr.length < 1) {
        isCanSubmit = 0;
    }
    if (isCanSubmit == 1) {
        $("#btnOk").css("background", "");//验证通过
    } else {
        $("#btnOk").css("background", "#c0c0c0");
    }



}



//校验邮箱
function IsEmail(str) {
    var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    return reg.test(str);
}




