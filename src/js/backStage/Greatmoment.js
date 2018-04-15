var Lui = require('../../LUI/js/lui');
var calender = require('../lib/calendar/calender-plugin.js');
var lui = new Lui();
var drop_school;//校区对象
var drop_clsss;//班级对象

//Tag，0为累计； 今天1； 昨天2； 本周3； 本月4； 自定义5；

//每页数据
var pageAverage = 9;

//正常分页
var para = { PageIndex: 1, SchoolID: 0, ClassID: 0, Tag: 0, STime: new Date().toLocaleDateString(), ETime: new Date().toLocaleDateString() };
//二维码参数分页
var QRpara = { PageIndex: 1, SchoolID: 0, ClassID: 0, Tag: 0, STime: new Date().toLocaleDateString(), ETime: new Date().toLocaleDateString() };
//当前点击的是第几个图片
var current_index = 0;
$("span[data-down]").click(function () {
    $('.pop-mask,#popDatak').hide();
});
function rightImg(current_index) {
    $('.right_arrow,.left_arrow').attr('data-curpage', current_index);
    var str = '<li><img src="' + arry[current_index].PicUrl + '" alt=""></li>';
    $('.img_area').append(str);
    $('.img_area').animate({ 'left': -560 + 'px' }, function () {
        $('.img_area').width(560);
        $('.img_area img').attr('class', '');
        $('.img_area li:first').remove();
        $('.img_area').css('left', 0)
    });
    $("span[data-n-left]").html(+$("span[data-n-left]").html() + 1);
    RenderData(+$("span[data-n-left]").html(), arry[current_index].PicID);
}
function leftImg(current_index) {
    $('.right_arrow,.left_arrow').attr('data-curpage', current_index);
    var str = '<li><img src="' + arry[current_index].PicUrl + '" alt=""></li>';
    $('.img_area').prepend(str);
    $('.img_area').css('left', '-560px');
    $('.img_area').width(2 * 560);
    $('.img_area').animate({ 'left': 0 + 'px' }, function () {
        $('.img_area img').attr('class', '');
        $('.img_area li:last').remove();
        $('.img_area').css('left', 0 + 'px');
    });
    $("span[data-n-left]").html(+$("span[data-n-left]").html() - 1);
    RenderData(+$("span[data-n-left]").html(), arry[current_index].PicID);
}
$('.right_arrow').click(function () {
    if ($('.img_area').attr('class').indexOf('rotate') > -1) {
        $('.img_area').attr('class', 'img_area');
    }
    $('.img_area').width(2 * 560);
    var _leftNum = +$('span[data-n-left]').html();
    var _rightTotal = +$('span[data-n-right]').html();
    var all_total = Math.ceil(_rightTotal / pageAverage);//总页数
    var curent_page = Math.ceil(_leftNum / pageAverage);//当前页码
    current_index = $('.left_arrow').attr('data-curpage');//当前图片数组中的位置
    var current_real = $("span[data-n-left]").html();//当前图片实际的张数

    if (current_real < _rightTotal) {
        current_index++;
        if (current_real % pageAverage == 0 && (!QRPage[curent_page + 1])) {
            QRpara.PageIndex = curent_page + 1;
            loadPopData(true, function () {
                rightImg(current_index);
            });
        } else {
            rightImg(current_index);
        }
    } else {
    }

});

$('.left_arrow').click(function () {
    if ($('.img_area').attr('class').indexOf('rotate') > -1) {
        $('.img_area').attr('class', 'img_area');
    }
    $('.img_area').width(1 * 560);
    var _leftNum = +$('span[data-n-left]').html();
    var _rightTotal = +$('span[data-n-right]').html();
    var all_total = Math.ceil(_rightTotal / pageAverage);//总页数
    var curent_page = Math.ceil(_leftNum / pageAverage);//当前页码
    current_index = $('.left_arrow').attr('data-curpage');//当前图片数组中的位置
    var current_real = $("span[data-n-left]").html();//当前图片实际的张数

    if (current_real > 1) {
        if (current_real % pageAverage == 1 && (!QRPage[curent_page - 1])) {
            if (curent_page > 1) {
                QRpara.PageIndex = curent_page - 1;
                var left_length = arry.length - 1;
                loadPopData(false, function () {
                    leftImg(pageAverage - 1);
                });
            }
        } else {
            current_index--;
            leftImg(current_index);
        }

    } else {
    }

});



$('.roate').click(function () {
    $('.img_area img').attr('class', '');
    if (count % 4 == 0) {
        $('.img_area img').addClass('rotate')
    } else if (count % 4 == 1) {
        $('.img_area img').addClass('rotate1')
    } else if (count % 4 == 2) {
        $('.img_area img').addClass('rotate2')
    } else {
        $('.img_area img').addClass('rotate3')
    }
    count++;
});

initData();

function initData() {
    if (userRole == 2)//超管
    {
        /*全部校区的下拉*/
        $.ajax({
            type: "post",
            url: "/Org/School/GetSchool",
            dataType: "json",
            error: function (e) {
                drop_school = lui.initDropDownList({
                    warpid: "schoolAll", width: 170, subtextlength: 10, textField: 'SchoolName', valueField: 'SchoolID', data: [{ SchoolName: '全部校区', SchoolID: 0 }]
                });
            },
            success: function (e) {
                drop_school = lui.initDropDownList({
                    warpid: "schoolAll", width: 170, subtextlength: 10, textField: 'SchoolName', valueField: 'SchoolID', data: e.Data, selectedCallBack: GetChange
                });
                GetClasses();
            }
        });
    }
    else if (userRole == 3)//校长
    {
        GetClasses();
    }

}

function GetClasses() {
    /*全部班级的下拉*/
    $.ajax({
        type: "post",
        url: "/Org/Classes/GetClassName",
        dataType: "json",
        data: { SchoolID: para.SchoolID },
        error: function (e) {
            drop_clsss = lui.initDropDownList({
                warpid: "classAll", width: 100, subtextlength: 7, textField: 'ClassName', valueField: 'ClassID', data: [{ ClassName: '全部班级', ClassID: 0 }]
            });
        },
        success: function (e) {
            drop_clsss = lui.initDropDownList({
                warpid: "classAll", width: 100, subtextlength: 7, textField: 'ClassName', valueField: 'ClassID', data: e, selectedCallBack: GetTableChange
            });
            //修改参数
            loadData();//加载表格--学校/班级/页码
        }
    });
}

function GetChange(e1, e2)//控件ID、选中项ID--加载班级
{
    QRpara.SchoolID = para.SchoolID = e2;//学校ID
    QRpara.ClassID = para.ClassID = 0;//班级ID
    QRpara.PageIndex = para.PageIndex = 1;
    GetClasses();
}

function GetTableChange(e1, e2)//控件ID、e2班级ID--加载表格
{
    QRpara.ClassID = para.ClassID = e2;//班级ID
    QRpara.PageIndex = para.PageIndex = 1;
    loadData();//加载表格--学校/班级/页码
}

function loadData() {
    $("#contentData,#pager").html("");
    $("#emptyDataBefore").tmpl(null).appendTo("#contentData");
    $.ajax({
        type: "post",
        url: "/Org/OrgStatManage/GetMoment",
        data: para,
        dataType: "json",
        error: function (e) {
        },
        success: function (e) {
            $("#contentData,#pager").html("");
            if (e.Data.T.length == 0) {
                $("#emptyDataOver").tmpl(null).appendTo("#contentData");
            }
            else {
                $("#momentData").tmpl(e.Data).appendTo("#contentData");
            }
            $("#pager").html(e.TagValue);

            $("span[data-sum]").html(e.PageSum);

            //修改弹出层的数据源
            BindUp(e.Data, false, true);

            //分页事件
            PagerClick();

            //弹出层
            EditClick();
        }
    });
}

function loadPopData(e1, callback)//e1:true 右；e1:false 左
{
    $.ajax({
        type: "post",
        url: "/Org/OrgStatManage/GetMoment",
        data: QRpara,
        dataType: "json",
        error: function (e) {
        },
        success: function (e) {
            if (e.Data.T.length == 0) {
            }
            else {
                BindUp(e.Data, true, e1);
                callback();
            }
        }

    });
}


function EditClick() {
    $("#contentData div[data-up]").click(function () {
        BindUpImg($(this));
        $('.pop-mask,#popDatak').show();
    });
}
$('#contentData').on('click', '.box', function () {
    var img_url = $(this).find('img').attr('src');//判断点击的值在数组里面的那个位置
    $.each(arry, function (i, j) {
        if (j.PicUrl == img_url) {
            current_index = i;
        }
    });
    $('.right_arrow').attr('data-curpage', current_index);
    $('.left_arrow').attr('data-curpage', current_index);
})
function PagerClick() {
    $("#pager a[data-num]").click(function () {
        QRpara.PageIndex = para.PageIndex = +$(this).attr("data-num");
        loadData();//加载表格--学校/班级/页码
    });
}

function BindUp(e1, e2, e3)//e2代表数据叠加;//e3:true 右；e3:false 左
{
    if (!e2) {
        arry = [];//页面真正分页时，清空数据
        QRPage = [];
        length = 0;

    }
    if (!e3) {
        e1.T.reverse();
    }
    $.each(e1.T, function (i, j) {
        if (j) {
            if (!QRKey[j.PicID]) {
                if (e3) {
                    arry.push(j);
                }
                else {
                    arry.unshift(j);
                }
                QRKey[j.QRKey] = true;
                length = length + 1;
            }
            if (!QRPage[QRpara.PageIndex])//第一次时，记录页码
            {
                QRPage[QRpara.PageIndex] = true;
            }
        }
    });

}


function BindUpImg(e1) {
    $("ul[data-left-right] li img").attr({ "src": e1.children("img").attr("src") });
    $("span[data-n-left]").html(e1.attr("data-index"));
    RenderData(+e1.attr("data-index"), +e1.attr("data-id"));
    $("span[data-n-right]").html(+$("span[data-sum]").html());

    $('.right_arrow').attr('data-index', e1.attr("data-index") - 1);
    $('.left_arrow').attr('data-index', e1.attr("data-index") - 1);
}

function RenderData(e1, e2) {
    debugger;
    $("#scodeData").html("");
    var _ay = [];
    $.each(arry, function (i, j) {
        if (j) {
            if (j.Index == e1)
                _ay.push(j);
        }
    });

    $("#scoderight").tmpl(_ay).appendTo("#scodeData");

    //二维码
    QRCode(e2);
}

function QRCode(e2) {
    var options = {
        render: "canvas",    //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
        text: imgUrl + "/Experience/Index/QR/" + e2 + "/" + para.SchoolID + "/" + para.ClassID + "/" + para.Tag + "/" + para.STime + "/" + para.ETime,//url
        width: "210",               //二维码的宽度
        height: "198",              //二维码的高度
        background: "#ffffff",       //二维码的后景色
        foreground: "#000000",        //二维码的前景色
        src: imgUrl + '/favicon.ico'             //二维码中间的图片
    };
    $('#QRlogo').qrcode(options);
}
$('.box_boxs').hover(function () {
    $(this).find('.left_arrow,.right_arrow').show();
    $(this).find('.bottom').show();
}, function () {
    $(this).find('.left_arrow,.right_arrow').hide();
    $(this).find('.bottom').hide();
});

$("span[data-month]").click(function () {
    QRpara.Tag = para.Tag = +$(this).attr("data-month");
    QRpara.PageIndex = para.PageIndex = 1;
    if (para.Tag == 5) {
        QRpara.STime = para.STime = $("#txtBegTime").val();
        QRpara.ETime = para.ETime = $("#txtEndTime").val();
        $(".limit-date").show();
    }
    else {
        $(".limit-date").hide();
    }

    $(this).addClass("active").siblings().removeClass("active");

    if (para.Tag != 5) {
        loadData();
    }
    else {
        var calenderConfig = {
            maxDate: new Date(),
            defaultDate: new Date(),
            onChange: function (obj, val) {
                var stime = $("#txtBegTime").val();
                var etime = $("#txtEndTime").val();
                if (stime) {
                    calenderConfig.maxDate = new Date();
                    calenderConfig.minDate = new Date(stime);
                    if (etime) {
                        calenderConfig.defaultDate = new Date(etime);
                    }
                    calender("#txtEndTime", calenderConfig);
                }
                if (etime) {
                    calenderConfig.maxDate = new Date(etime);
                    calenderConfig.minDate = null;
                    if (stime) {
                        calenderConfig.defaultDate = new Date(stime);
                    }
                    calender("#txtBegTime", calenderConfig)
                }
                if (stime && etime) {
                    QRpara.PageIndex = para.PageIndex = 1;
                    QRpara.STime = para.STime = stime;
                    QRpara.ETime = para.ETime = etime;
                    loadData();
                }
            }
        };
        calenderConfig.defaultDate = new Date();
        calender("#txtBegTime", calenderConfig);
        calender("#txtEndTime", calenderConfig);
        var stime = $("#txtBegTime").val();
        var etime = $("#txtEndTime").val();
        if (stime && etime) {
            QRpara.PageIndex = para.PageIndex = 1;
            QRpara.STime = para.STime = stime;
            QRpara.ETime = para.ETime = etime;
            loadData();
        }
    }
});