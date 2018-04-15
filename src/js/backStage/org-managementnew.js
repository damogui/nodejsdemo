
var Lui = require('../../LUI/js/lui');
var tool = require('../../LUI/tool');
var lui = new Lui();
var commJs = require("../lib/util.js");//公共方法
//发送请求调取省市县数据
var arrS = [];//省
var arrSs = [];//市
var arrX = [];//县

var arrStuNums = [];//学生数量
var arrTeacherNums = [];//教师数量
var arrSchoolNums = [];//校区数量
var arrEarning = [];//年营收


//充值
var oid;//当前的orgid
var uid = 0;//当前的合伙人id 0代表魔方格
var uname;//合伙人姓名
var dataCm;//当前储值
var oname;//当前机构名字
var addM = 0;//要添加的金额
//添加机构的弹出层事件
tool.pophide($('.eg-pop .close'), $('.eg-pop'));
//tool.popshow($('.addbtn '), $('#addorg-pop'));
//机构详情的弹出层事件
tool.popshow($('.see-detail '), $('#addorg-name'));

//多选框的点击
tool.checkBoox();
//后台交互
var tplTableOrg = require("OrgManage/OrgManageListNew.tpl");
require("../../tpl/template-helpers.js");
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
        //加载列表
        InitDrop();//初始化下拉然后再调取数据列表


    },
    initBtns: function () {
        //todo 绑定事件
        //搜索
        $("body").delegate("#searchImg", "click", function () {
            GetOrgData(1);

        });
        //合作方式
        $("body").delegate(".hz .span", "click", function () {
            $(this).addClass("active").siblings().removeClass("active");
            GetOrgData(1);
        });
        //累计利润
        $("body").delegate(".lr .span", "click", function () {
            $(this).addClass("active").siblings().removeClass("active");
            GetOrgData(1);
        });
        //排序
        $("body").delegate(".px .span", "click", function () {
            $(this).addClass("active").siblings().removeClass("active");
            GetOrgData(1);
        });

        //金额的切换
        $("body").delegate(".addMoney", "click", function () {
            $("#tipMoney").addClass("vis");
            $("#btnAddM").removeClass("red").addClass("gray");//变灰
            oid = this.id;
            uid = $(this).attr("data-uid");
            uname = $(this).attr("data-uname");//合伙人姓名
            dataCm = $(this).attr("data-cm");//当前储值
            oname = $(this).attr("data-oname");
            $(".money_type .btnm").removeClass("active");//移除选中样式
            $("#addMHand").hide();
            $("#txtRemarks").val("");//清空备注
            if (uid == "0") {//魔方格 
                $("#patnerAdd").hide();
                $("#mfgAdd").show();
                $("#giftDiv").show();



            } else {
                $("#patnerName").html(uname);
                $("#mfgAdd").hide();
                $("#patnerAdd").show();
                $("#giftDiv").hide();


            }
            $("#AddMAfter").html(dataCm);
            $("#addMOrgName").html(oname);
            $("#orgAddMoneyName").html(oname);//机构名称赋值

            $("#addMLeftMoney").html(commJs.splitNumber(dataCm));


            $("#addMHand,#addMGift").val("");//输入框初始化
            $(".pop-mask").show();
            $("#org-coin").show();

        });

        //点击充值的按钮
        $("body").delegate("#btnAddM", "click", function () {
            if (addMoney < 1 && addGift<1) {//有赠送金额也可以提交
                return;
            }
            //判断是否储值足够
            
            if (uid != 0) {
                //提交表单
                $.ajax({
                    type: "post",
                    url: "/Management/OrgManage/GetPatnersMoneyById",
                    dataType: "json",
                    data: {

                        data: uid
                    },
                    success: function (data) {
                        if (parseFloat(addMoney) > data.Data) {
                            $("#tipMoney").removeClass("vis");
                            return;
                        } else {
                            $("#org-coin").hide();
                            $("#tip-sure").show();
                        }

                       

                    }
                });

            } else {
                $("#org-coin").hide();
                $("#tip-sure").show();
            }




        });

        //输入金额和赠送金额市区焦点的时候
        $("body").delegate("#addMHand,#addMGift", "blur", function () {
            CalMoney();
        });

        ////金钱
        //$("body").delegate(".money_type .btnm", "click", function () {

        //    CalMoney();
        //});


        //取消
        $("body").delegate("#btnCancel", "click", function () {
            //$("#org-coin").hide();
            $("#tip-sure").hide();
            $('.pop-mask').hide();

        });

        //确定
        $("body").delegate("#btnAddMOk", "click", function () {


            var jsonAddCz = {};
            jsonAddCz.OrgId = oid;
            jsonAddCz.SellerId = uid;
            
            //添加
            jsonAddCz.AddOrgValue = addMoney;
            //赠送
            jsonAddCz.GiftOrgValue = addGift;
            jsonAddCz.Remarks = escape($("#txtRemarks").val());//备注

            //提交表单
            $.ajax({
                type: "post",
                url: "/Management/OrgManage/MfgAddOrgMoney",
                dataType: "json",
                data: {

                    data: JSON.stringify(jsonAddCz)
                },
                success: function (data) {
                  
                    if (data.OK) {
                        $(".eg-pop .close").click();//关闭弹窗
                        GetOrgData(1);//重新加载
                       
                        ShowTip("充值成功");
                        setTimeout(StopTip, 1000);//提示1秒后关闭
                    } else {
                        $(".eg-pop .close").click();//关闭弹窗
                        GetOrgData(1);//重新加载
                        ShowTip(data.Result);
                        setTimeout(StopTip, 1000);//提示1秒后关闭
                        
                    }

                   
                }
            });


            //$("#org-coin").hide();
            $("#tip-sure").hide();
            $('.pop-mask').hide();

           

        });



        //选择充值金额
        $("body").delegate(".money_type .btnm", "click", function () {
            $(this).addClass("active").siblings().removeClass("active");
            $("#tipMoney").addClass("vis");
           
            var idBtn = $(this).attr("data-id");
            if (idBtn == "addM5") {//文本框显示
                $("#addMHand").show();

            } else {
                $("#addMHand").hide();
                $("#addMHand").val("");



            }
            CalMoney();

        });
        ////金钱类型选择
        //$("body").delegate(".money_type .btnm", "click", function () {
        //    if (this.id != "addM5") {
        //        CalMoney();
        //    }


        //});


    }


};

var titleO = "全部";//$("#drop_type").attr("title")  定义全局变量来监听改变事件
var dataType = "0";
//绑定数据
$(function () {
    module.init();
    OptTypeSel();


});

//初始化下拉
function InitDrop() {
    loadEarning();//绑定年营收
}


//处理下拉列表
function OptTypeSel() {
    $("#drop_type li").click(function () {
        var titleN = $(this).attr("title");
        dataType = $(this).attr("data-id");


        if (titleO != titleN) {
            titleO = titleN;//重新赋值
            GetOrgData();

        }


    });

}


//发送请求调取数据
function GetOrgData(page) {
    //$("#divLoading").show();
    if (parseInt(page) > 0) {

    } else {
        page = 1;
    }


    loadimg.ShowLoading($("#tb"));//不要tr样式的清除
    if (page == undefined) {
        page = 1;
    }

    var pageSize = 10;
    var json = {};
    json.OrgType = 1;//1正式合作2内部专用
    json.KeyWord = escape($("#txtserch").val());
    json.PartnerType = $(".hz .active").attr("data-id");//魔方格总部1 城市合伙人2全部0
    json.SumMoney = $(".lr .active").attr("data-id");//累计利润
    //规模
    json.Sales = $("#drop_Earning").attr("data-id");//年营收
    json.Schools = $("#drop_SchoolNums").attr("data-id");//校区
    json.Teachers = $("#drop_TeacherNums").attr("data-id");//老师
    json.Students = $("#drop_StuNums").attr("data-id");//生源

    json.Order = $(".px .active").attr("data-id");//Order

    //加载机构列表
    $.ajax({
        type: "post",
        url: "/Management/OrgManage/GetOrgList",
        dataType: "json",
        data: {
            //OrgType: dataType,
            //KeyWord: escape($("#txtserch").val()) //$("#tagId").val()
            data: JSON.stringify(json), PageIndex: page, PageSize: pageSize
        },
        success: function (data) {


            if (data.Data && data.Data.length > 0) {
                $("#tb").html(tplTableOrg(data.Data));
                $("#totalcount").html(data.PageSum);
                //Paginator.Paginator(10, page, data.PageSum, loadExamStu);
                //加载列表
                Paginator.Paginator(pageSize, page, data.PageSum, GetOrgData);


            }
            else {

                $("#tb").html("");
                //<img src="../../../bundle/img/noclass.png" style="text-align:center;">
                $("#tb").html('<div class="data_img" style="text-align: center" ><div class="big_area" style="margin-top:10px;line-height:30px;"><br/><span>暂无符合条件的机构</span></div></div>');//清空数据
                $("#pagination").html("");//分页控件不显示
                $("#totalcount").html(0);//数据设置为0
                //$("#bandTotalcount").html(0);//禁用




            }
        }
    });

}


//计算总额
var addMoney = 0;//增加
var addGift = 0;//赠送
function CalMoney() {
    
    var total = 0;//当前储值
    addMoney = 0;
    addGift = 0;
    var activeObj = $(".money_type .active").attr("data-id");
    if (activeObj == "addM5") {
        if ($("#addMHand").val() != "") {

            total += parseFloat($("#addMHand").val());//输入
            addMoney = parseFloat($("#addMHand").val());
        }

    } else {

        if (activeObj == "addM1") {
            total += 1000;
            addMoney = 1000;

        } else if (activeObj == "addM3") {
            total += 3000;
            addMoney = 3000;

        } else if (activeObj == "addM4") {
            total += 10000;
            addMoney = 10000;

        }

    }




    if ($("#addMGift").val() != "") {
        total += parseFloat($("#addMGift").val());
        addGift = parseFloat($("#addMGift").val());//赠送
    }

    addM = total;
    total += parseFloat(dataCm);

    $("#addMAll").html(commJs.splitNumber(addM));
    $("#AddMAfter").html(commJs.splitNumber(total));

    if (addMoney > 0 || addGift > 0) {//买和赠送有一个可以提交 gray  red  
        $("#btnAddM").removeClass("gray").addClass("red");//变红

    } else {
        $("#btnAddM").removeClass("red").addClass("gray");//变灰

        
    }



}







//绑定年营收
function loadEarning() {

    $.ajax({
        type: "post",
        url: "/Management/OrgManage/GetOrgDropByType",
        dataType: "json",
        data: {
            type: "10"//年营收：200万以下、200～500万、500万～1000万（默认选中）、1000～2000万、2000～5000万、5000万～1亿、1亿以上
        },
        success: function (data) {
            if (data.Data && data.Data.length > 0) {                
                for (var i = 0; i < data.Data.length; i++) {

                    arrEarning.push({ name: data.Data[i].Name, id: data.Data[i].Id, pid: data.Data[i].Id });
                }
                arrEarning.unshift({ id: 0, pid: 0, name: "年营收" });

                lui.initDropDownList({ warpid: "drop_Earning", width: 180, nameField: 'name', idField: 'id', data: arrEarning, selectedCallBack: GetOrgData, subtextlength: 15 });

                loadSchoolNums();//加载校区数量
            }
            else {

                //alert("获取数据失败");

            }
        }
    });

}

//绑定校区数量
function loadSchoolNums() {
    arrSchoolNums = [];//加载前进行清空
    $.ajax({
        type: "post",
        url: "/Management/OrgManage/GetOrgDropByType",
        dataType: "json",
        data: {
            type: "11"//校区数量：5个以下、5～10个、10～20个、20～50个、50～100个、100个以上
        },
        success: function (data) {
            if (data.Data && data.Data.length > 0) {
                arrSchoolNums.push({
                    name: "校区数量", id: 0, pid: 0
                });
                for (var i = 0; i < data.Data.length; i++) {

                    arrSchoolNums.push({ name: data.Data[i].Name, id: data.Data[i].Id, pid: data.Data[i].Id });
                }

                lui.initDropDownList({ warpid: "drop_SchoolNums", width: 140, nameField: 'name', idField: 'id', data: arrSchoolNums, selectedCallBack: GetOrgData, subtextlength: 15 });

                loadTeacherNums();//老师数量
            }
            else {

                //alert("获取数据失败");

            }
        }
    });

}

//绑定老师数量
function loadTeacherNums() {
    arrTeacherNums = [];//加载前进行清空
    $.ajax({
        type: "post",
        url: "/Management/OrgManage/GetOrgDropByType",
        dataType: "json",
        data: {
            type: "12"//老师数量：20人以下、20～50人、50～100人、100～200人、200～500人、500人以上
        },
        success: function (data) {
            if (data.Data && data.Data.length > 0) {
                arrTeacherNums.push({
                    name: "老师数量", id: 0, pid: 0
                });
                for (var i = 0; i < data.Data.length; i++) {

                    arrTeacherNums.push({ name: data.Data[i].Name, id: data.Data[i].Id, pid: data.Data[i].Id });
                }

                lui.initDropDownList({ warpid: "drop_TeacherNums", width: 140, nameField: 'name', idField: 'id', data: arrTeacherNums, selectedCallBack: GetOrgData, subtextlength: 15 });

                loadStuNums();//年生源量
            }
            else {

                //alert("获取数据失败");

            }
        }
    });

}

//绑定年生源量
function loadStuNums() {
    arrStuNums = [];//加载前进行清空
    $.ajax({
        type: "post",
        url: "/Management/OrgManage/GetOrgDropByType",
        dataType: "json",
        data: {
            type: "13"//年生源量：500人以下、500～1000人、1000～2000人、2000～5000人、5000～10000人、10000人以上
        },
        success: function (data) {
            if (data.Data && data.Data.length > 0) {
                arrStuNums.push({
                    name: "年生源量", id: 0, pid: 0
                });//学校
                for (var i = 0; i < data.Data.length; i++) {

                    arrStuNums.push({ name: data.Data[i].Name, id: data.Data[i].Id, pid: data.Data[i].Id });
                }

                lui.initDropDownList({ warpid: "drop_StuNums", width: 140, nameField: 'name', idField: 'id', data: arrStuNums, selectedCallBack: GetOrgData, subtextlength: 15 });


            }
            else {

                //alert("获取数据失败");

            }

            GetOrgData();
        }
    });

}



//回车事件
$(function () {
    $('#txtserch').bind('keypress', function (event) {
        if (event.keyCode == "13") {
            GetOrgData(1);

        }
    });
});




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
function StopTipAndJump() {
    $("#showTip").hide();
    window.location.href = "/Management/PartnerManage/Index/"+window.tokenID;//添加成功之后进行跳转

}