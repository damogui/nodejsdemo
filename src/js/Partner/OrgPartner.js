var Lui = require('../../LUI/js/lui');
var lui = new Lui();
//
//给机构充值---IsAuto是否自定义金额---PartnerValue合伙人余额----InValue为充值金额---IsOn提交充值进行中(1正在处理中；2处理完成；0未处理)
var row_in = { OrgID: 0, PartnerValue: 0, IsAuto: 0, InValue: 0, OrgName: "", IsOn: 0, Remark: "" };

var drop_org;//机构来源
var drop_year;//老师对象
var drop_school;//校区
var drop_teacher;//老师
var drop_student;//学生

init();

function init() {
    GetCitys();
    BindClick();
}

//注册点击事件
function BindClick() {
    //点击排序
    $("#orgOrder span[data-order]").click(function () {
        $(this).siblings().removeClass("active").end().addClass("active");
        row_data.PageIndex = 1;
        row_data.OrgOrder = +$(this).attr("data-order");
        GetData();
    });

    //点击搜索
    $("#orgSearch").click(function () {
        row_data.PageIndex = 1;
        row_data.TagValue = escape($.trim($("#orgValue").val()));
        GetData();
    });

    //回车
    $("#orgValue").keydown(function (e) {
        if (e.keyCode == 13) {
            row_data.PageIndex = 1;
            row_data.TagValue = escape($.trim($("#orgValue").val()));
            GetData();
        }
    });

    //关闭窗体
    $(".close").click(function () {
        $('.pop-mask,#org-coin').hide();
    });

    //关闭窗体
    $("[data-close]").click(function () {
        $('.pop-mask,#tip-sure').hide();
    });

    //选择充值
    $("span[data-ed]").click(function () {
        $(this).siblings("span").removeClass("active").end().addClass("active");
        var r = +$(this).attr("data-value");
        if (r == 0) {
            r = +$("#orgInValue").val();
            $("#orgInValue").removeClass("vis");
        }
        else {
            $("#orgInValue").addClass("vis");
        }
        ErrorInfo();
    });

    //输入充值金额
    $("#orgInValue").keypress(function () {
        var keynum = event.keyCode;
        if (!(keynum >= 48 && keynum <= 57))//非数字
            return false;
        if ($(this).val().length == 8)//8位数字
            return false;
        if ($(this).val() == "" && keynum == 48)//首位不能为0
            return false;
    });

    //输入充值金额后
    $("#orgInValue").keyup(function () {
        ErrorInfo();
    });

    //输入充值金额--回车
    $("#orgInValue").keydown(function () {
        if (event.keyCode == 8) {
            ErrorInfo();
        }
    });

    //点击立即充值按钮
    $("#okStart").click(function () {
        if ($(this).hasClass("red")) {
            $('#org-coin').hide();
            $('#tip-sure').show();
            $("#infoRemark").val("");
            $("#infoName").text(row_in.OrgName);
            $("#infoValue").text(ValueStr(row_in.InValue));
        }
    });

    //提交充值
    $("#ok").click(function () {
        if (row_in.IsOn == 1)//1为正在处理；2为处理完成；0为没有处理
            return;
        row_in.IsOn = 1;
        row_in.Remark = escape($.trim($("#infoRemark").val()));
        OK();
    });
}

//显示异常
function ErrorInfo() {
    row_in.IsAuto = false;
    row_in.IsOn = 0;
    $("#errorInfo").text("我的储值不足");
    var rStart = +$("[data-start]").text().replace(/,/gim, '');//充值前合伙人金额
    var orgStart = +$("[data-org-start]").text().replace(/,/gim, '');//充值前机构金额
    var rIn = 0;//充值金额
    var r = $("span[data-ed][class*='active']");
    if (r.length == 1) {
        if (+r.attr("data-value") == 0) {
            row_in.IsAuto = true;
            rIn = +$("#orgInValue").val().replace(/,/gim, '');//自定义
        }
        else {
            rIn = +r.attr("data-value").replace(/,/gim, '');//固定金额
        }
        if (rIn == 0) {
            //充值金额不能为0
        }
        else {
            if (rStart < rIn) {
                $("#errorInfo").show();//不可以充值
            }
            else {
                $("#errorInfo").hide();//可以充值
            }
        }
    }
    else {
        $("#errorInfo").show();//没有充值金额
    }

    //是否自定义金额
    if (row_in.IsAuto && rIn == 0) {
        $("#okStart").removeClass("red").addClass("gray");
    }
    else //按钮是否可以点击
    {
        if ($("#errorInfo").is(":hidden")) {
            $("#okStart").removeClass("gray").addClass("red");
        }
        else {
            $("#okStart").removeClass("red").addClass("gray");
        }
    }
    //充值金额
    row_in.InValue = rIn;
    //计算预计余额
    $("[data-end]").text(rStart - rIn);////充值后合伙人金额
    $("[data-org-end]").text(orgStart + rIn);//充值后机构金额
}

//绑定城市
function BindCitys() {
    //点击城市
    $("#citys span[data-areaid]").click(function () {
        $(this).siblings().removeClass("active").end().addClass("active");
        row_data.PageIndex = 1;
        row_data.AreaID = +$(this).attr("data-areaid");
        GetData();
    });
}

//加载下拉
function GetYear(f) {
    if (f == 0) {
        GetData();
        return;
    }
    $.ajax({
        type: "post",
        url: "/Org/Classes/GetDic",
        dataType: "json",
        data: { DicType: f },
        success: function (e) {
            if (+f == 10) {
                e.Data.unshift({ DicKey: 0, DicValue: "年营收" });
                drop_year = lui.initDropDownList({
                    warpid: "drop_year", width: 120, subtextlength: 10, textField: 'DicValue', valueField: 'DicKey', data: e.Data, selectedCallBack: BindDropYearData
                });
                GetYear(11);
            }
            if (+f == 11) {
                e.Data.unshift({ DicKey: 0, DicValue: "校区数量" });
                drop_school = lui.initDropDownList({
                    warpid: "drop_school", width: 120, subtextlength: 10, textField: 'DicValue', valueField: 'DicKey', data: e.Data, selectedCallBack: BindDropSchoolData
                });
                GetYear(12);
            }
            if (+f == 12) {
                e.Data.unshift({ DicKey: 0, DicValue: "老师数量" });
                drop_teacher = lui.initDropDownList({
                    warpid: "drop_teacher", width: 120, subtextlength: 10, textField: 'DicValue', valueField: 'DicKey', data: e.Data, selectedCallBack: BindDropTeacherData
                });
                GetYear(13);
            }
            if (+f == 13) {
                e.Data.unshift({ DicKey: 0, DicValue: "年生源量" });
                drop_student = lui.initDropDownList({
                    warpid: "drop_student", width: 120, subtextlength: 12, textField: 'DicValue', valueField: 'DicKey', data: e.Data, selectedCallBack: BindDropStudentData
                });
                GetYear(0);
            }
        }
    });
}

//加载下拉
function GetCitys() {
    $.ajax({
        type: "post",
        url: "/Partner/Data/GetsTitleCitys",
        dataType: "json",
        data: { Tag: row_data.Tag },
        success: function (e) {
            if (e.OK) {
                $("#citysData").tmpl(e.Data).appendTo("#citys");
                //过滤条件
                drop_org = lui.initDropDownList({
                    warpid: "drop_orgsource", width: 150, subtextlength: 11, textField: 'SourceName', valueField: 'SourceID', data: [{ SourceName: '全部', SourceID: 0 }, { SourceName: '只看我签约的', SourceID: 1 }, { SourceName: '魔方格转给我的', SourceID: 2 }], selectedCallBack: BindDropOrgData
                });
                GetYear(10);
                BindCitys();
            }
        }
    });
}

//查询机构信息
function GetData() {
    $("#pageSum").html(0);
    $("#orgList,#pager").html("");
    $("#emptyDataBefore").tmpl(null).appendTo("#orgList");
    $.ajax({
        type: "post",
        url: "/Partner/Data/GetOrgList",
        dataType: "json",
        data: { orgPara: JSON.stringify(row_data) },
        error: function (e) {
            $("#emptyDataOver").tmpl(null).appendTo("#orgList");
        },
        success: function (e) {
            $("#orgList").html("");
            if (e.Data == null || e.Data.length == 0) {
                $("#emptyDataOver").tmpl(null).appendTo("#orgList");
            }
            else {
                $("#orgData").tmpl(e.Data).appendTo("#orgList");
            }
            $("#pageSum").html(e.PageSum);
            $("#pager").html(e.TagValue);

            //分页事件
            PagerClick();

            //机构详细/充值
            HrefClick();
        }
    });
}

//链接详细
function HrefClick() {
    //链接
    $("#orgList [data-href]").click(function () {
        location.href = $(this).attr("data-href");
    });

    //充值
    $("#orgList [data-in]").click(function () {
        event.stopPropagation();
        //初始值
        row_in.OrgID = $(this).attr("data-orgid");
        row_in.OrgName = $(this).attr("data-name");
        row_in.IsAuto = false;
        row_in.InValue = 0;
        row_in.IsOn = 0;
        row_in.Remark = "";
        //取消激活状态
        $("[data-ed]").removeClass("active");
        $("#okStart").removeClass("red").addClass("gray");
        $("#orgInValue").val("");
        $("#orgInValue").addClass("vis");
        GetInit();
    });
}

//弹出层
function GetInit() {
    $.ajax({
        type: "post",
        url: "/Partner/Data/GetOrgIn",
        dataType: "json",
        data: { OrgID: row_in.OrgID },
        error: function (e) {
        },
        success: function (e) {
            row_in.PartnerValue = e.Data.CurrentPartnerValue;
            $("#orgName").text(e.Data.OrgName);
            $("span[data-partnerValue]").text(e.Data.CurrentPartnerValueStr);
            $("span[data-orgValue]").text(e.Data.CurrentOrgValueStr);
            $('.pop-mask,#org-coin').show();
        }
    });
}

//分页
function PagerClick() {
    $("#pager a[data-num]").click(function () {
        row_data.PageIndex = +$(this).attr("data-num");
        GetData();//加载表格
    });
}

//机构来源下拉
function BindDropOrgData(e1, e2)//控件ID、选中项ID
{
    row_data.PageIndex = 1;
    row_data.OrgCource = e2;
    GetData();
}

//年营下拉
function BindDropYearData(e1, e2)//控件ID、选中项ID
{
    row_data.PageIndex = 1;
    row_data.OrgYear = e2;
    GetData();
}

//校区下拉
function BindDropSchoolData(e1, e2)//控件ID、选中项ID
{
    row_data.PageIndex = 1;
    row_data.OrgSchool = e2;
    GetData();
}

//老师下拉
function BindDropTeacherData(e1, e2)//控件ID、选中项ID
{
    row_data.PageIndex = 1;
    row_data.OrgTeacher = e2;
    GetData();
}

//学生下拉
function BindDropStudentData(e1, e2)//控件ID、选中项ID
{
    row_data.PageIndex = 1;
    row_data.OrgStudent = e2;
    GetData();
}

//金额字符串处理---金额，3位加逗号
function ValueStr(e1) {
    var i = e1.toString();
    return i.split('').reverse().join('').replace(/(\d{3})/g, '$1,').replace(/\,$/, '').split('').reverse().join('');
}

//最后充值
function OK() {
    $.ajax({
        type: "post",
        url: "/Partner/Data/SaveValue",
        dataType: "json",
        data: { Data: JSON.stringify(row_in) },
        error: function (e) {
            row_in.IsOn = 2;
            $('.pop-mask,#tip-sure').hide();
            $("#infoSave").show();
            $("#infoSave").html("充值失败");
            setTimeout('$("#infoSave").hide();', 1500);
        },
        success: function (e) {
            row_in.IsOn = 2;
            $('.pop-mask,#tip-sure').hide();
            $("#infoSave").show();
            if (e.OK) {
                $("#headSumFormat").html(ValueStr(row_in.PartnerValue - row_in.InValue) + " 元");
                $("#infoSave").html("充值成功");
                GetData();//加载表格
            }
            else {
                $("#infoSave").html("充值失败");
            }
            setTimeout('$("#infoSave").hide();', 1500);
        }
    });
}