
var calender = require('../lib/calendar/calender-plugin.js');
var Lui = require('../../LUI/js/lui');
var lui = new Lui();

var g_city = 0;
var g_org = 0;

$(function () {

    InitTime();

    GetCitys();

});

function GetCitys() {

    $.ajax({
        type: "post",
        url: "/partner/data/GetCitys",
        dataType: "json",
        data: {},
        success: function (data) {


            var datas = [];

            if (data.Data && data.Data.length > 0) {

                datas = data.Data;

            }

            datas.unshift({ "AreaID": 0, "AreaName": "城市" });

            var s_t = lui.initDropDownList({ warpid: "drop_city", width: 185, subtextlength: 15, valueField: "AreaID", textField: "AreaName", data: datas, selectedCallBack: OptCityBind });

            GetOrgs(0);

        }
    });

}

function GetOrgs(areacode) {

    $.ajax({
        type: "post",
        url: "/partner/data/GetOrgs",
        dataType: "json",
        data: { AreaCode: areacode },
        success: function (data) {

            var datas = [];
            if (data.Data && data.Data.length > 0) {

                datas = data.Data;
                var t_orgids = [];
                for (var i = 0; i < data.Data.length; i++) {
                    t_orgids.push(data.Data[i].OrgID);
                }

                var t_t_orgids = t_orgids.join(",");

                datas.unshift({ "OrgID": t_t_orgids, "OrgName": "机构" });


                g_org = t_t_orgids;

            } else {
                datas.unshift({ "OrgID": "0", "OrgName": "机构" });
            }


            var s_t = lui.initDropDownList({ warpid: "drop_org", width: 185, subtextlength: 15, valueField: "OrgID", textField: "OrgName", data: datas, selectedCallBack: OptOrgBind });


            GetAchievementList(1);

        }
    });

}

function GetAchievementList(pageindex) {

    var stime = $("#stime-input").val();
    var etime = $("#etime-input").val();

    $.ajax({
        type: "post",
        url: "/partner/data/GetAchievementList",
        dataType: "json",
        data: { pageindex: pageindex, pagesize: 10, orgid: g_org, stime: stime, etime: etime },
        success: function (data) {


            $("#pager").html("");
            $("#b_table_list").hide();
            $("#b_table_list_tip").hide();

            var count = data.PageSum;
            var paycount = parseInt(data.PageIndex);//后台返回用此值

            $("#b_count_span").html(count);

            $('#b_paycount_span').html(formatMoney(paycount,0));


            if (data.Data && data.Data.length > 0) {

                var str = "";
                for (var i = 0; i < data.Data.length; i++) {

                    var d = data.Data[i];

                    str += "<tr><td>" + d.ActionTimeText + "</td><td>" + d.OrgName + "</td><td>" + d.UserName + "</td><td>" + d.CityName + "</td><td>" + formatMoney(d.CurrentValue,0) + "</td></tr>";
                }


                $("#b_tr_body").html(str);

                $("#pager").html(data.TagValue);

                PagerClick(GetAchievementList);

                $("#b_table_list").show();

            } else {

                $("#b_table_list_tip").show();
            }

        }
    });

}

function OptCityBind() {


    var code = $("#drop_city").attr("data-id");

    g_city = code;

    GetOrgs(code);

}

function OptOrgBind() {


    var code = $("#drop_org").attr("data-id");

    g_org = code;

    GetAchievementList(1);

}

function InitTime() {
    var calenderConfig = {
        maxDate: new Date(),
        defaultDate: new Date("2017-01-01"),
        onChange: function (obj, val) {


            GetAchievementList(1);

        }
    };

    calenderConfig.defaultDate = new Date("2017-01-01");
    calender("#stime-input", calenderConfig);

    calenderConfig.defaultDate = new Date();
    calender("#etime-input", calenderConfig);


}

function PagerClick(callback) {
    $("#pager a[data-num]").click(function () {
        var _p = $(this).attr("data-num");
        callback(_p);
    });
}


//格式化货币格式
function formatMoney(number, places, symbol, thousand, decimal) {
    number = number || 0;
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : "$";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var negative = number < 0 ? "-" : "",
        i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return negative +
        (j ? i.substr(0, j) + thousand : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) +
        (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}

//截取字符串长度
function subStringNum(str, num) {
    var num = num || 6;
    if (str.length > num) {
        return str.substring(0, num);
    } else {
        return str;
    }

}




