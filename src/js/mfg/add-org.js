
var Lui = require('../../LUI/js/lui');
var tool = require('../../LUI/tool');
var lui = new Lui();
var commJs = require("../lib/util.js");//公共方法
//发送请求调取省市县数据
var arrS = [];//省
var arrSs = [];//市
var arrX = [];//县
var orgId = 0;//当前的orgId
var imgabsUrl = "";//图片的绝对地址
var isMatchPanter = 0;//是否匹配到合伙人


var arrStuNums = [];//学生数量
var arrTeacherNums = [];//教师数量
var arrSchoolNums = [];//校区数量
var arrEarning = [];//年营收
var arrOtherPatners = [];//当县没城市合伙人时候的下拉

//充值
var oid;//当前的orgid
var uid;//当前的合伙人id 0代表魔方格
var uname;//合伙人姓名
var dataCm;//当前储值
var oname;//当前机构名字
var addM = 0;//要添加的金额

//机构类型的下拉
lui.initDropDownList({ warpid: "drop_type", width: 85, nameField: 'name', idField: 'id', data: [{ name: '全部', id: '0', pid: '' }, { name: '金牌', id: '1', pid: '00' }, { name: '银牌', id: '2', pid: '00' }] });
//合作类型的下拉
lui.initDropDownList({ warpid: "drop_hz", width: 120, nameField: 'name', idField: 'id', data: [{ name: '金牌', id: '1', pid: '' }] });
//合作级别
lui.initDropDownList({ warpid: "drop_jy", width: 130, nameField: 'name', idField: 'id', data: [{ name: 'A级', id: '1', pid: '1' }] });

//签约部门
lui.initDropDownList({ warpid: "drop_SignDep", width: 130, nameField: 'name', idField: 'id', data: [{ name: '魔方格总部', id: '1', pid: '1' }], selectedCallBack: OptNoPatnerDrop });//下拉联动合伙人, { name: '城市合伙人', id: '2', pid: '2' }


//签约人
lui.initDropDownList({ warpid: "txtsignman", width: 130, nameField: 'name', idField: 'id', data: [{ name: '请选择支持人员', id: '-1', pid: '-1' }, { name: '孟春玲', id: '0', pid: '0' }], selectedCallBack: CheckIsSubmit, subtextlength: 15 });//选择完之后校验


//添加机构的弹出层事件
tool.pophide($('.eg-pop .close'), $('.eg-pop'));
//tool.popshow($('.addbtn '), $('#addorg-pop'));
//机构详情的弹出层事件
tool.popshow($('.see-detail '), $('#addorg-name'));

//多选框的点击
tool.checkBoox();
//后台交互
var tplTableOrg = require("OrgManage/OrgManageList.tpl");
require("../../tpl/template-helpers.js");
//分页
var pop = require("../lib/popup/popuptip.js");
//var loadimg = require("../lib/popup/showloadimg.js");
//var Paginator = require('../lib/page/Paginator.js');
var module = {
    init: function () {
        //todo 逻辑函数
        this.initBtns();
        this.render();
       

    },

    render: function () {
        //加载列表
        GetSData();//初始化省市数据  添加机构的时候触发

    },
    initBtns: function () {
        //todo 绑定事件

        //点击关闭充值弹窗的时候进行跳转
        $("body").delegate("#closeOkDiv", "click", function () {
            window.location.href = "/Management/OrgManage/Index/"+window.tokenID;//调到列表页面

        });

        /////添加logo
        $("body").delegate("#addlogo", "click", function () {
            
            $("#upload").click();//上传

        });
        //获取logo地址
        $("body").delegate("#upload", "change", function () {
            
            uploadImage($("#upload"));//开始上传

        });


        //是否内部专用
        $("body").delegate("#isTest", "click", function (event) {
            $("#isTestChk").toggleClass("active");
            event.stopPropagation();
        });
        ///多选框点击
        $("body").delegate("#isTestChk", "click", function (event) {

            $("#isTestChk").toggleClass("active");
            event.stopPropagation();


        });
        ///删除
        $("body").delegate("#imgDel", "click", function (event) {
            //var obj = document.getElementById('upload');
            //obj.select();
            //document.execCommand('Delete');//Delete为固定名称  

            $("#upload").val("");
            //$("#upload").selection.clear(); //清除
            $("#imgname").html("");
            imgabsUrl = "";//删除
            $("#delAndReUpload").hide();//隐藏删除和重新上传


        });
        ///重新上传
        $("body").delegate("#uploadagin", "click", function (event) {

            $("#upload").click();//上传


        });

        ///充值
        $("body").delegate("#btnAddMoney", "click", function (event) {
           
            $(".money_type .btnm").removeClass("active");//清除已经选择的
            $("#addMHand").hide();//隐藏输入框
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
            if (addMoney < 1) {
                return;
            }
            //判断是否储值足够

            if (uid != 0) {//合伙人的时候才判断
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

        //输入金额市区焦点的时候
        $("body").delegate("#addMHand", "blur", function () {
            CalMoney();
        });
        //赠送金额
        $("body").delegate("#addMGift", "blur", function () {
            CalMoney();
        });
        ///表单提交
        $("body").delegate("#btnOk", "click", function () {
            if (!IsEmail($("#txtemail").val())) {//必填
                ShowTip("邮箱格式不对");
                setTimeout(StopTip, 1000);//提示1秒后关闭
                return;

            }
            if (isMatchPanter == 0) {//没匹配到

                if ($("#drop_SignDep").attr("data-id") == "1") {
                    if ($("#txtsignman").attr("data-id") == "-1") {//没选签约人
                        isCanSubmit = 0;
                        ShowTip("请选择签约人");
                        setTimeout(StopTip, 1000);//提示1秒后关闭
                    }
                } else {
                    if ($("#drop_SignDepChoice").attr("data-id") == "0") {//没选择合伙人
                        isCanSubmit = 0;
                    }


                }


            }
            //添加校验
            if (isCanSubmit==0) {
                return;//没通过校验
            }
            var jsonAdd = {};
            jsonAdd.OrgName = escape($("#txtorgname").val().trim());

            if ($("#isTestChk").hasClass("active")) {
                jsonAdd.OrgType = 2;//测试
            } else {
                jsonAdd.OrgType = 1;//有效
            }

            jsonAdd.OrgLogo = imgabsUrl;//图片地址

            jsonAdd.LinkMan = escape($("#txtorgcon").val());//联系人
            jsonAdd.LinkManTel = $("#txtcontel").val();
            jsonAdd.Email = $("#txtemail").val();//邮箱
            //jsonAdd.Email = $("#txtemail").val();//邮箱

            jsonAdd.ProvinceId = $("#drop_sheng").attr("data-id");//省
            jsonAdd.CityId = $("#drop_shi").attr("data-id");
            jsonAdd.CountyId = $("#drop_x").attr("data-id");
            jsonAdd.AreaLeval = $("#drop_qy").attr("data-id");
            jsonAdd.Addr = escape($("#txtconaddr").val());//必填项备注


            //jsonAdd.ChannelId = $("#drop_qd1").attr("data-id");//签约渠道

            jsonAdd.Sales = $("#drop_Earning").attr("data-id");//销售额/年
            jsonAdd.Schools = $("#drop_SchoolNums").attr("data-id");//校区数量
            jsonAdd.Teachers = $("#drop_TeacherNums").attr("data-id");//教师数量
            jsonAdd.Students = $("#drop_StuNums").attr("data-id");//学生数量

            //签约
            //jsonAdd.SellerId = $("#drop_SignDep").attr("data-id");//签约人0魔方格其他为合伙人
            jsonAdd.SellerMan = escape($("#drop_SignDep").attr("title")); //escape($("#txtsignman").val().trim());//签约人SellerMan
            if (isMatchPanter == 1) {//匹配到
                jsonAdd.SellerId = $("#signPatner").attr("data-id");//匹配到签约人
                jsonAdd.SellerM = "";//赋值空
                jsonAdd.PartnerTag = 3;//匹配到合伙人
                uname = $("#signPatner").html();//合伙人姓名
            } else {//没匹配到

                if ($("#drop_SignDep").attr("data-id") == "1") {
                    jsonAdd.PartnerTag = 1;//魔方格总部
                    jsonAdd.SellerId = 0;//魔方格
                    jsonAdd.SellerMan = "魔方格总部";//签约人SellerMan
                    if ($("#txtsignman").attr("data-id") < 0) {
                        ShowTip("请选择签约人");
                        setTimeout(StopTip, 1000);//提示1秒后关闭
                        return;

                    }
                    uname = "魔方格总部";//显示用

                }
                else {//选择合伙人
                    jsonAdd.PartnerTag = 2;//城市合伙人

                    if ($("#drop_SignDepChoice").attr("data-id") == "0") {
                        ShowTip("请选择合伙人");
                        setTimeout(StopTip, 1000);//提示1秒后关闭
                        return;
                    }
                    jsonAdd.SellerId = $("#drop_SignDepChoice").attr("data-id");//需要判断签约人
                    uname = $("#drop_SignDepChoice").attr("title");//合伙人姓名
                }

            }

            jsonAdd.CoType = $("#drop_hz").attr("data-id");//1金牌，2银牌
            jsonAdd.TeachType = 1; //$("#drop_jy").attr("data-id");//教研评级：1为教研A级；2为教研B级；写死
            //jsonAdd.SignMark = escape($("#txtmark").val());//备注
            jsonAdd.Remark = escape($("#txtmark").val());//签约备注
            if (jsonAdd.OrgName.length < 1) {
                ShowTip("机构名称不能为空");
                setTimeout(StopTip, 1000);//提示1秒后关闭
                // $("#addTip").css({ "visibility": "visible" }).html("机构名称不能为空！");

                return;
            }
            if (jsonAdd.LinkMan.length < 1) {
                ShowTip("机构负责人不能为空");
                setTimeout(StopTip, 1000);//提示1秒后关闭
                //$("#addTip").css({ "visibility": "visible" }).html("机构联系人不能为空！");
                return;
            }
            if (jsonAdd.LinkManTel.length < 1) {
                ShowTip("电话格式不对");
                setTimeout(StopTip, 1000);//提示1秒后关闭
                //$("#addTip").css({ "visibility": "visible" }).html("电话格式不对！");


                return;
            }



            //校验电话
            if (!IsMobile(jsonAdd.LinkManTel)) {
                ShowTip("电话格式不对");
                setTimeout(StopTip, 1000);//提示1秒后关闭
                //$("#addTip").css({ "visibility": "visible" }).html("电话格式不对！");

                return;

            }
            //新添加(省)
            if (jsonAdd.ProvinceId == "0") {
                ShowTip("省不能为空");
                setTimeout(StopTip, 1000);//提示1秒后关闭
                //$("#addTip").css({ "visibility": "visible" }).html("省不能为空！");


                return;
            }
            //新添加（市）
            if (jsonAdd.CityId == "0") {
                ShowTip("市不能为空");
                setTimeout(StopTip, 1000);//提示1秒后关闭
                //$("#addTip").css({ "visibility": "visible" }).html("市不能为空！");


                return;
            }
            //新添加（县）
            if (jsonAdd.CountyId == "0") {
                ShowTip("县不能为空");
                setTimeout(StopTip, 1000);//提示1秒后关闭
                //$("#addTip").css({ "visibility": "visible" }).html("县不能为空！");


                return;
            }

            //地址不能为空
            if (jsonAdd.Addr.length < 1) {
                ShowTip("地址不能为空");
                setTimeout(StopTip, 1000);//提示1秒后关闭
                //$("#addTip").css({ "visibility": "visible" }).html("地址不能为空！");

                return;
            }

            //校验校区数量
            if ($("#drop_SchoolNums").attr("data-id") == "0") {
                ShowTip("校区数量必选");
                setTimeout(StopTip, 1000);//提示1秒后关闭
                //$("#addTip").css({ "visibility": "visible" }).html("校区数量必选！");

                return;

            }

            //校验老师数量
            if ($("#drop_TeacherNums").attr("data-id") == "0") {
                ShowTip("教师数量必选");
                setTimeout(StopTip, 1000);//提示1秒后关闭
                //$("#addTip").css({ "visibility": "visible" }).html("教师数量必选！");

                return;

            }

            //校验年生源量
            if ($("#drop_StuNums").attr("data-id") == "0") {
                ShowTip("年生源量必选");
                setTimeout(StopTip, 1000);//提示1秒后关闭
                //$("#addTip").css({ "visibility": "visible" }).html("学生数量必选！");

                return;

            }

            if (!IsEmail($("#txtemail").val())) {//必填
                ShowTip("邮箱格式不对");
                setTimeout(StopTip, 1000);//提示1秒后关闭
                return;

            }
           


            //提交表单
            $.ajax({
                type: "post",
                url: "/Management/OrgManage/CheckOrgPhone",
                dataType: "json",
                data: {

                    data: jsonAdd.LinkManTel, orgId: -1
                },
                success: function (data) {


                    if (data.Data == "0") {
                        //提交表单
                        $.ajax({
                            type: "post",
                            url: "/Management/OrgManage/AddMfgOrg",
                            dataType: "json",
                            data: {

                                data: JSON.stringify(jsonAdd)
                            },
                            success: function (data) {
                                //ShowTip("添加成功");
                                //setTimeout(StopTip, 1000);//提示1秒后关闭
                                //进行显示赋值
                                //充值beg
                                oid = data.Data;//机构id
                                uid = jsonAdd.SellerId;//合伙人id
                                //uname = $("#signPatner").html();//合伙人姓名
                                dataCm =0;//当前储值
                                oname = $("#txtorgname").val().trim();//机构名
                                //充值end


                                $("#orgName").html($("#txtorgname").val().trim());//机构名不要加密过的
                                $("#txtShowPersonName").html($("#txtorgcon").val().trim());//负责人
                                //$("#loginId").html(data.Data);//登录账号
                                $("#loginTel").html(jsonAdd.LinkManTel);//电话
                                $(".pop-mask").show();
                                $("#okDiv").show();


                                

                            }
                        });
                    } else {
                        ShowTip("电话重复");
                        setTimeout(StopTip, 1000);//提示1秒后关闭
                        //$("#addTip").css({ "visibility": "visible" }).html("电话重复！");

                    }

                }
            });







        });

        //机构付款金额和奖励储值失去焦点的时候
        $("body").delegate("#txtOrgMoney,#txtOrgValue", "blur", function () {
            CalMoney();
        });
      
        //选择充值金额
        $("body").delegate(".money_type .btnm", "click", function () {
            $("#addMHand").hide();
            $(this).addClass("active").siblings().removeClass("active");
            var idBtn = $(this).attr("data-id");
            if (idBtn == "addM5") {//文本框显示
                $("#addMHand").show();

            } else {
                $("#addMHand").hide();
                $("#addMHand").val("");



            }
            CalMoney();

        });

        //取消
        $("body").delegate("#btnCancel", "click", function () {
            //$("#org-coin").hide();
            $("#tip-sure").hide();
            $('.pop-mask').hide();
            window.location.href = "/Management/OrgManage/Index/"+window.tokenID;//调到列表页面
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

                    //if (data.SQLResultSet>0) {

                    //}

                    //$(".eg-pop .close").click();//关闭弹窗
                    //GetOrgData(1);//重新加载

                    window.location.href = "/Management/OrgManage/Index/"+window.tokenID;//进行跳转

                }
            });


            //$("#org-coin").hide();
            $("#tip-sure").hide();
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




var Scode = "0";//省的代码
var Sscode = "0";//市
var Xcode = "0";//县
var provinceData = {
};//省市全部数据
var xData = {
};//县的数据
//发送请求调取省数据
function GetSData() {
    var json = {
    };
    json.Parent = dataType;//0:全部，1金牌，2银牌
    json.KeyWord = escape($("#txtserch").val());
    arrS = [];//加载前进行清空
    //加载机构列表
    $.ajax({
        type: "post",
        url: "/Management/OrgManage/GetProvinceAndCityToLeaf",
        dataType: "json",
        data: {
            data: JSON.stringify(json)
        },
        success: function (data) {
            if (data.Data && data.Data.length > 0) {

                provinceData = data.Data;
                arrS.push({
                    name: "省", id: 0, pid: 0
                });//省
                for (var i = 0; i < data.Data.length; i++) {

                    arrS.push({
                        name: data.Data[i].Name, id: data.Data[i].Code, pid: data.Data[i].Code
                    });//省
                }

                lui.initDropDownList({
                    warpid: "drop_sheng", subtextlength: 6, width: 85, nameField: 'name', idField: 'id', data: arrS, selectedCallBack: OptSxBind
                });//省

                BindEmptySx();//绑定空的数据
                loadEarning();//绑定年营收
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
        name: "市", id: 0, pid: 0
    });//市区
    arrX.push({
        name: "区县", id: 0, pid: 0
    });//县

    lui.initDropDownList({
        warpid: "drop_shi", width: 90, nameField: 'name', idField: 'id', data: arrSs, selectedCallBack: OptShiBind
    });//市
    lui.initDropDownList({
        warpid: "drop_x", width: 90, nameField: 'name', idField: 'id', data: arrX
    });//县




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
        name: "市", id: 0, pid: 0
    });//市区
    arrX.push({
        name: "区县", id: 0, pid: 0
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

    //for (var k = 0; k < xData.length; k++) {
    //    arrX.push({
    //        name: xData[k].Name, id: xData[k].Code, pid: '1'
    //    });//县

    //}
    lui.initDropDownList({
        warpid: "drop_shi", width: 90, nameField: 'name', idField: 'id', data: arrSs, selectedCallBack: OptShiBind
    });//市
    lui.initDropDownList({
        warpid: "drop_x", width: 90, nameField: 'name', idField: 'id', data: arrX, selectedCallBack: OptXbind
    });//县

    //绑定生源


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
                name: xData[k].Name, id: xData[k].PFid, pid: '1'
            });//县

        }

    }
   
    //lui.initDropDownList({ warpid: "drop_shi", width: 60, nameField: 'name', idField: 'id', data: arrSs });//市
    lui.initDropDownList({
        warpid: "drop_x", width: 90, nameField: 'name', idField: 'id', data: arrX, selectedCallBack: OptXbind
    });//县


}

//绑定事件
function OptSxBind() {
    Scode = $("#drop_sheng").attr("data-id");

    BindSx(Scode);
    CheckIsSubmit();//添加校验

}

//市区的下拉点击的时候
function OptShiBind() {
    Sscode = $("#drop_shi").attr("data-id");

    Bindx(Sscode);

    CheckIsSubmit();//添加校验
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

                    arrEarning.push({
                        name: data.Data[i].Name, id: data.Data[i].Id, pid: data.Data[i].Id
                    });
                }

                lui.initDropDownList({
                    warpid: "drop_Earning", width: 180, nameField: 'name', idField: 'id', data: arrEarning, selectedCallBack: null, subtextlength: 15, defaultValue: 3, defaultText: "500万～1000万"
                });

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

                    arrSchoolNums.push({
                        name: data.Data[i].Name, id: data.Data[i].Id, pid: data.Data[i].Id
                    });
                }

                lui.initDropDownList({
                    warpid: "drop_SchoolNums", width: 140, nameField: 'name', idField: 'id', data: arrSchoolNums, selectedCallBack: CheckIsSubmit, subtextlength: 15
                });

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

                    arrTeacherNums.push({
                        name: data.Data[i].Name, id: data.Data[i].Id, pid: data.Data[i].Id
                    });
                }

                lui.initDropDownList({
                    warpid: "drop_TeacherNums", width: 140, nameField: 'name', idField: 'id', data: arrTeacherNums, selectedCallBack: CheckIsSubmit, subtextlength: 15
                });

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

                    arrStuNums.push({
                        name: data.Data[i].Name, id: data.Data[i].Id, pid: data.Data[i].Id
                    });
                }

                lui.initDropDownList({
                    warpid: "drop_StuNums", width: 140, nameField: 'name', idField: 'id', data: arrStuNums, selectedCallBack: CheckIsSubmit, subtextlength: 15
                });


            }
            else {

                //alert("获取数据失败");

            }
        }
    });

}

//绑定县的时候需要关联城市合伙人
function OptXbind() {
    
    //arrStuNums = [];//加载前进行清空
    var dropxCode = $("#drop_x").attr("data-id");//县区代码
    $.ajax({
        type: "post",
        url: "/Management/OrgManage/GetPatnerByCountryId",
        dataType: "json",
        data: {
            data: dropxCode
        },
        success: function (data) {
            if (data.Data) {//存在
                isMatchPanter = 1;
                
                $("#drop_SignDep").hide();//隐藏下拉框
                $("#showPatner").show();
                $(".signManOther").hide();
                $(".mfgSign").hide();
                $(".signMan").show();//合伙人显示赋值
                $("#signPatner").html(data.Data.Name);
                $("#signPatner").attr("data-id", data.Data.Id);//提交的时候需要
                CheckIsSubmit();//进行校验
            } else {
                //签约部门
                lui.initDropDownList({
                    warpid: "drop_SignDep", width: 130, nameField: 'name', idField: 'id', data: [{ name: '魔方格总部', id: '1', pid: '1' }], selectedCallBack: OptNoPatnerDrop
                });//下拉联动合伙人
                isMatchPanter = 0;
                $("#drop_SignDep").show();//隐藏下拉框
                $("#showPatner").hide();
                $(".signManOther").hide();
                $(".signMan").hide();
                $(".mfgSign").show();//魔方格显示
                 CheckIsSubmit();//进行校验
            }

        }
    });
   
}



//添加实时校验(涉及到所有字段)
$(function () {
    OptCheckSubmit();

});
//校验
function OptCheckSubmit() {
    //机构名
    $("#txtorgname").keyup(CheckIsSubmit);
    //电话
    $("#txtcontel").blur(CheckIsSubmit);
    ///校验地址
    $("#txtconaddr").keyup(CheckIsSubmit);
    ///联系人
    $("#txtorgcon").keyup(CheckIsSubmit);
    //邮箱
    $("#txtemail").keyup(CheckIsSubmit);
  
    //魔方格总部的签约人
  // $("#txtsignman").keyup(CheckIsSubmit);



}

//判断是不是可以提交
var isCanSubmit = 0;//0不可以提交1可以
function CheckIsSubmit() {

    isCanSubmit = 1;//初始化 的时候可以提价

    if ($("#txtorgname").val().trim().length < 1) {//机构名

        isCanSubmit = 0;

    }
    if ($("#txtorgcon").val().length < 1) {

        isCanSubmit = 0;



    }
    if ($("#txtcontel").val().length < 1) {

        isCanSubmit = 0;

    }



    //校验电话
    if (!IsMobile($("#txtcontel").val())) {

        isCanSubmit = 0;
        if ($("#txtcontel").val().length>0) {
            ShowTip("电话格式不对");
            setTimeout(StopTip, 1000);//提示1秒后关闭
        }


    }
    //校验邮箱
    if ( $("#txtemail").val().length < 1) {//必填
        //ShowTip("邮箱格式不对");
        //setTimeout(StopTip, 1000);//提示1秒后关闭
        isCanSubmit = 0;

    }

    //地址不能为空
    if ($("#txtconaddr").val().length < 1) {

        isCanSubmit = 0;


    }
    //新添加(省)
    if ($("#drop_sheng").attr("data-id") == "0") {
        isCanSubmit = 0;

    }
    //新添加（市）
    if ($("#drop_shi").attr("data-id") == "0") {
        isCanSubmit = 0;

    }
    //新添加（县）
    if ($("#drop_x").attr("data-id") == "0") {
        isCanSubmit = 0;

    }


    //地址不能为空
    if ($("#txtconaddr").val().length < 1) {
        isCanSubmit = 0;

    }

    //校验校区数量
    if ($("#drop_SchoolNums").attr("data-id") == "0") {
        isCanSubmit = 0;


    }

    //校验老师数量
    if ($("#drop_TeacherNums").attr("data-id") == "0") {
        isCanSubmit = 0;
    }

    //校验年生源量
    if ($("#drop_StuNums").attr("data-id") == "0") {
        isCanSubmit = 0;


    }

    if (isMatchPanter == 0) {//没匹配到
        
        if ($("#drop_SignDep").attr("data-id") == "1") {
            if ($("#txtsignman").attr("data-id")=="-1") {//没选签约人
                isCanSubmit = 0;
                //ShowTip("请选择签约人");
                //setTimeout(StopTip, 1000);//提示1秒后关闭
            }
        } else {
            if ($("#drop_SignDepChoice").attr("data-id") == "0") {//没选择合伙人
                isCanSubmit = 0;
            }


        }


    }



    if (isCanSubmit == 1) {
        $("#btnOk").removeClass("btn-gray").addClass("btn-blue");//验证通过
    } else {
        $("#btnOk").removeClass("btn-blue").addClass("btn-gray");
    }



}

//当前县区无合伙人的时候的下拉联动
function OptNoPatnerDrop() {


    var dropV = $("#drop_SignDep").attr("data-id");
    if (dropV == "2") {
        $(".mfgSign").hide();
        $(".signMan").hide();
        $(".signManOther").show();//合伙人显示
        //绑定合伙人
        loadOtherPatners();

    } else {
        $(".signManOther").hide();
        $(".signMan").hide();

        $(".mfgSign").show();//魔方格显示

    }




}


//绑定其他合伙人
function loadOtherPatners() {
    arrOtherPatners = [];//加载前进行清空
    $.ajax({
        type: "post",
        url: "/Management/OrgManage/GetMfgPatners",
        dataType: "json",
        data: {
            data: ""//
        },
        success: function (data) {
            if (data.Data && data.Data.length > 0) {
                arrOtherPatners.push({
                    name: "请选择合伙人", id: 0, pid: 0
                });
                for (var i = 0; i < data.Data.length; i++) {

                    arrOtherPatners.push({
                        name: data.Data[i].Name, id: data.Data[i].Id, pid: data.Data[i].Id
                    });
                }

                lui.initDropDownList({
                    warpid: "drop_SignDepChoice", width: 130, nameField: 'name', idField: 'id', data: arrOtherPatners, selectedCallBack: CheckIsSubmit, subtextlength: 15
                });


            }
            else {

                //alert("获取数据失败");

            }
        }
    });

}


//异步上传
function uploadImage(docObj) {
    
    //判断是否有选择上传文件
    var imgPath = docObj.val();
    if (imgPath == "") {
        //alert("请选择上传图片！");
        return;
    }
    //判断上传文件的后缀名
    var strExtension = imgPath.substr(imgPath.lastIndexOf('.') + 1).toLowerCase();
    if (strExtension != 'jpg' && strExtension != 'gif'
        && strExtension != 'png' && strExtension != 'bmp' && strExtension != 'jpeg') {
        //alert("请选择图片文件！");
        return;
    }

    var str = imgPath;
    var arr = str.split('\\');//注split可以用字符或字符串分割
    var imgName = arr[arr.length - 1];//图片名字
    $("#imgname").html(imgName);
    $("#delAndReUpload").show();//显示出来删除和重新上传
    //var imgObj = new Image();      //建立一个图像对象
    var allowImgFileSize = 10485760;    //上传图片最大值(单位字节)（ 2 M = 2097152 B ）
    //imgObj.src = docObj[0].value;直接读取会报错


    var reader = new FileReader();
    var file = docObj[0].files[0];

    if (file) {
        //var url = URL.createObjectURL(file);
        //imgObj.src = url;
        //将文件以Data URL形式读入页面
        reader.readAsDataURL(file);//进行读取
        reader.onload = function (e) {
            //var result = document.getElementById("result");
            var imgFileSize = reader.result.substring(reader.result.indexOf(",") + 1).length;
            if (allowImgFileSize != 0 && allowImgFileSize < imgFileSize) {
                alert("上传失败，请上传不大于10M的图片！");
                //hDialog.show({ type: 'toast', toastText: '上传失败，请上传不大于2M的图片！', toastTime: 3000, hasMask: false });
                return;
            }

            $.ajax({
                type: 'post',
                dataType: 'json',
                data: {
                    "imgData": reader.result
                },
                url: "/Management/OrgManage/UploadPic",// ajaxUrl + 'UploadIDCartImageBase64'
                success: function (data) {
                    if (data) {
                        imgabsUrl = data;
                        //alert(data);

                    }
                },
                //此接口返回的图片路径是error的响应文本
                error: function (xhr) {

                },
                beforeSend: function () {
                    //loadding


                }
            });
        }
        reader.onerror = function () {
            alert("error");
        }
    }


}




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
//function StopTipAndJump() {
//    $("#ShowTipAdd").hide();
//    window.location.href = "/Management/PartnerManage/Index";//添加成功之后进行跳转

//}


//校验邮箱
function IsEmail(str) {
    var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    return reg.test(str);
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



}




