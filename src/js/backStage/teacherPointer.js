
var row_data = { SchoolID: 0, SchoolName: "", ProvinceID: "", CityID: "", CountyID: "" };//当前行数据


var Lui = require('../../LUI/js/lui');
var lui = new Lui();


var arrS = [];
var arrSs = [];
var arrX = [];

var Scode = "";//省的代码
var Sscode = "";//市
var Xcode = "";//县
var provinceData = {};//省市全部数据
var xData = {};//县的数据

var isedit = 0;//0:add; 1:edit


//发送请求调取全部数据
function GetSData() {

    arrS = [];//加载前进行清空

    $.ajax({
        type: "post",
        url: "/Management/OrgManage/GetProvinceAndCityToLeaf",
        dataType: "json",
        data: {},
        success: function (data) {
            if (data.Data && data.Data.length > 0) {

                provinceData = data.Data;
                arrS.push({ name: "省", id: 0, pid: 0 });//省
                for (var i = 0; i < data.Data.length; i++) {

                    arrS.push({ name: data.Data[i].Name, id: data.Data[i].Code, pid: data.Data[i].Code });//省
                }

                var tname = isedit == 1 ? "drop_sheng_x" : "drop_sheng";


                var s_t = lui.initDropDownList({ warpid: tname, subtextlength: 6, width: 85, nameField: 'name', idField: 'id', data: arrS, selectedCallBack: OptSxBind });//省

                if (typeof Scode != "undefined" && Scode.toString().length > 0) {
                    s_t.setValue(Scode);
                }

                BindSx();

            }
            else {

                alert("获取数据失败");

            }
        }
    });

}

//绑定市县
function BindSx() {

    arrSs.length = 0;

    //添加默认值

    arrSs.push({ name: "市", id: 0, pid: 0 });//市区

    for (var i = 0; i < provinceData.length; i++) {

        if (provinceData[i].Code == Scode) {

            for (var j = 0; j < provinceData[i].CityList.length; j++) {
                arrSs.push({
                    name: provinceData[i].CityList[j].Name, id: provinceData[i].CityList[j].Code, pid: '1'
                });//市
            }

        }

    }
    var tname = isedit == 1 ? "drop_shi_x" : "drop_shi";
    var s_t = lui.initDropDownList({ warpid: tname, width: 90, nameField: 'name', idField: 'id', data: arrSs, selectedCallBack: OptShiBind });//市

    if (typeof Sscode != "undefined" && Sscode.toString().length > 0) {
        s_t.setValue(Sscode);
    }

    Bindx();


}
//绑定县参数传递市的code
function Bindx() {

    xData = {};//县的数据

    arrX.length = 0;
    for (var i = 0; i < provinceData.length; i++) {
        if (provinceData[i].Code == Scode) {

            for (var j = 0; j < provinceData[i].CityList.length; j++) {
                if (provinceData[i].CityList[j].Code == Sscode) {
                    xData = provinceData[i].CityList[j].AreaList;//赋值对应的县的数据
                }
            }
        }

    }

    arrX.push({
        name: "区/县", id: 0, pid: 0
    });//县

    for (var k = 0; k < xData.length; k++) {
        arrX.push({
            name: xData[k].Name, id: xData[k].Code, pid: '1'
        });//县

    }
    var tname = isedit == 1 ? "drop_x_x" : "drop_x";
    var s_t = lui.initDropDownList({
        warpid: tname, width: 90, nameField: 'name', idField: 'id', data: arrX
    });//县


    if (typeof Xcode != "undefined" && Xcode.toString().length > 0) {
        s_t.setValue(Xcode);
    }

}

//绑定事件
function OptSxBind() {

    var tname = isedit == 1 ? "drop_sheng_x" : "drop_sheng";

    Scode = $("#" + tname).attr("data-id");
    Sscode = "";
    Xcode = "";

    BindSx();

}

//市区的下拉点击的时候
function OptShiBind() {
    var tname = isedit == 1 ? "drop_shi_x" : "drop_shi";

    Sscode = $("#" + tname).attr("data-id");
    Xcode = "";

    Bindx();

}



///////////////////////////////////////////////






//添加校区按钮
$("[data-type='add']").click(function () {

    $.ajax({
        type: "post",
        url: "/Org/School/GetOrgAreas",
        data: {},
        dataType: "json",
        error: function (e) {
            $("[data-type='add-info']").css({ "visibility": "visible" }).text("请求失败！");
        },
        success: function (e) {
            if (e.OK) {


                Scode = e.Data.ProvinceID;
                Sscode = e.Data.CityID;
                Xcode = e.Data.CountyID;

                isedit = 0;

                GetSData();

                $("[data-type='add-info']").css({ "visibility": "hidden" });
                $("#add-name").val("");
                $('.pop-mask,#addteach-pointer').show();

            }
            else {
                $("[data-type='add-info']").css({ "visibility": "visible" }).text(e.Result);
            }
        }
    });

});

$("[data-close]").click(function () {
    $('.pop-mask,#addteach-pointer,#editteach-pointer').hide();
});

$("#edit-name,#add-name").keypress(function () {
    var keynum = event.keyCode;
    if (keynum == 32)
        return false;
    if ($(this).val().length == 25)//25位
        return false;
    $("[data-type='edit-info'],[data-type='add-info']").css({ "visibility": "hidden" });
});

$("#edit-name,#add-name").keydown(function () {
    if (event.keyCode == 8) {
        $("[data-type='edit-info'],[data-type='add-info']").css({ "visibility": "hidden" });
    }
});

$("#edit-name,#add-name").keyup(function () {
    $("[data-type='edit-info'],[data-type='add-info']").css({ "visibility": "hidden" });
});

//修改校区
$("#edit-ok").click(function () {
    if ($("[data-type='edit-info']").css("visibility") == "visible") {
        return;
    }
    row_data.SchoolName = $("#edit-name").val();
    if ($.trim(row_data.SchoolName).length == 0) {
        $("[data-type='edit-info']").css({ "visibility": "visible" }).text("校区不能为空！");
        return;
    }
    if ($.trim(row_data.SchoolName).length > 10) {
        $("[data-type='edit-info']").css({ "visibility": "visible" }).text("校区名称最大长度为10！");
        return;
    }

    var t_sheng = $("#drop_sheng_x").attr("data-id");
    var t_shi = $("#drop_shi_x").attr("data-id");
    var t_xian = $("#drop_x_x").attr("data-id");

    row_data.ProvinceID = t_sheng;
    row_data.CityID = t_shi;
    row_data.CountyID = t_xian;


    $.ajax({
        type: "post",
        url: "/Org/School/EditSchool",
        data: { data: JSON.stringify(row_data) },
        dataType: "json",
        error: function (e) {
            $("[data-type='edit-info']").css({ "visibility": "visible" }).text("请求失败!");
        },
        success: function (e) {
            if (e.OK) {
                $('.pop-mask,#editteach-pointer').hide();
                init(1);//加载表格
            }
            else {
                $("[data-type='edit-info']").css({ "visibility": "visible" }).text(e.Result);
            }
        }
    });
});

//添加校区submit
$("#add-ok").click(function () {
    if ($("[data-type='add-info']").css("visibility") == "visible") {
        return;
    }
    row_data.SchoolName = $("#add-name").val();
    if ($.trim(row_data.SchoolName).length == 0) {
        $("[data-type='add-info']").css({ "visibility": "visible" }).text("校区不能为空！");
        return;
    }
    if ($.trim(row_data.SchoolName).length > 10) {
        $("[data-type='add-info']").css({ "visibility": "visible" }).text("校区名称最大长度为10！");
        return;
    }

    var t_sheng = $("#drop_sheng").attr("data-id");
    var t_shi = $("#drop_shi").attr("data-id");
    var t_xian = $("#drop_x").attr("data-id");

    row_data.ProvinceID = t_sheng;
    row_data.CityID = t_shi;
    row_data.CountyID = t_xian;



    $.ajax({
        type: "post",
        url: "/Org/School/AddSchool",
        data: { data: JSON.stringify(row_data) },
        dataType: "json",
        error: function (e) {
            $("[data-type='add-info']").css({ "visibility": "visible" }).text("请求失败！");
        },
        success: function (e) {
            if (e.OK) {
                $('.pop-mask,#addteach-pointer').hide();
                init(1);//加载表格
            }
            else {
                $("[data-type='add-info']").css({ "visibility": "visible" }).text(e.Result);
            }
        }
    });
});

init(1);

function init(e1) {
    $("#pager").html("");
    $("#ctable").children(":first").nextAll().remove();
    $("#emptyDataBefore").tmpl(null).appendTo("#ctable");
    $.ajax({
        type: "post",
        url: "/Org/School/GetSchooles",
        data: {
            PageIndex: e1
        },
        dataType: "json",
        error: function (e) {
        },
        success: function (e) {
            $("#ctable").children(":first").nextAll().remove();
            if (e.Data.length == 0) {
                $("#emptyDataOver").tmpl(null).appendTo("#ctable");
            }
            else {
                $("#schoolData").tmpl(e.Data).appendTo("#ctable");
            }
            $("#dataCount").html(e.PageSum);
            $("#pager").html(e.TagValue);
            //分页事件
            PagerClick();

            //修改事件
            EditClick();
        }
    });
}

function PagerClick() {
    $("#pager a[data-num]").click(function () {
        init($(this).attr("data-num"));//加载表格
    });
}

//点击修改班级
function EditClick() {
    $("[data-type='edit']").click(function () {


        $('.pop-mask,#editteach-pointer').show();

        var $r = $(("tr[data-id=" + $(this).attr("data-id") + "]"));
        row_data.SchoolID = $(this).attr("data-id")//学校ID
        row_data.SchoolName = $r.children("[data-index=1]").attr("data-value");//学校名称
       
        $("#edit-name").val(row_data.SchoolName);
        $("[data-type='edit-info']").css({ "visibility": "hidden" });


        Scode = $(this).attr("data-sheng");
        Sscode = $(this).attr("data-shi");
        Xcode = $(this).attr("data-xian");
        isedit = 1;

        GetSData();


    });
}