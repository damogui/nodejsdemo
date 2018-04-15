var Lui = require('../../LUI/js/lui');
var lui = new Lui();
var a = require('template-helpers.js');
function createObjectURL(blob) {
    if (window.URL) {
        return window.URL.createObjectURL(blob);
    }
    else if (window.webkitURL) {
        return window.webkitURL.createObjectURL(blob);
    }
    else { return null; }
}
function revokeObjectURL(url) {
    if (window.URL) {
        window.URL.revokeObjectURL(url);
    } else if (window.webkitURL) {
        window.webkitURL.revokeObjectURL(url);
    }
}
var awardList = {
    awardTypePop: undefined,
    uawardTypePop: undefined,
    //加载学校
    getSchools: function () {
        var ithis = this;
        //加载学校
        $.ajax({
            type: "post",
            url: "/Org/StudentManage/GetOrgSchools",
            dataType: "json",
            data: {
                data: ""
            },
            success: function (data) {
                $("#drop_school").show();
                var arrJxd = [];
                arrJxd.push({
                    name: "全部校区", id: -1
                });//学校
                for (var i = 0; i < data.Data.length; i++) {

                    arrJxd.push({ name: data.Data[i].SchoolName, id: data.Data[i].SchoolId });
                }
                lui.initDropDownList({
                    warpid: "drop_school", width: 125, nameField: 'name', idField: 'id', data: arrJxd, subtextlength: 7,
                    selectedCallBack: function (warpid, value, text) {
                        ithis.initDrawData();
                        ithis.queryobj.schoolID = value;
                        ithis.getData();
                    },
                    loadedCallBack: function (warpid, value, text) {
                        //ithis.initDrawData();
                        ithis.queryobj.schoolID = value;
                        //ithis.getData();
                        ithis.getAwardTypes();

                    }
                });

            },
            error: function (err) {
                console.log(err);
            }
        });

    },
    getAwardTypes: function () {
        var ithis = this;


        $.ajax({
            url: "/Management/CourseManage/GetDicList",
            type: "get",
            async: true,
            data: { dicType: 14 },
            success: function (data) {
                result = data.Data;
                $("#drop_awardtype").show();
                result.unshift({ DicKey: -1, DicValue: "全部类别" });

                lui.initDropDownList({
                    warpid: "drop_awardtype", width: 125, textField: 'DicValue', valueField: 'DicKey', data: result, subtextlength: 7,
                    selectedCallBack: function (warpid, value, text) {
                        ithis.initDrawData();
                        ithis.queryobj.awardType = value;
                        ithis.getData();
                    },
                    loadedCallBack: function (warpid, value, text) {
                        ithis.initDrawData();
                        ithis.queryobj.awardType = value;
                        ithis.getData();

                    }
                });
                result.shift();
                result.unshift({ DicKey: -1, DicValue: "请选择奖品类别" });
                awardTypePop = lui.initDropDownList({
                    warpid: "drop_awardtype_pop", width: 260, textField: 'DicValue', valueField: 'DicKey', data: result, subtextlength: 7,
                    selectedCallBack: function (warpid, value, text) {
                        if ($("#cr2").attr("data-group-sel") == "1") {
                            if (+value == 7) {
                                $(".coin-num-area").show();
                            }
                            else {
                                $(".coin-num-area").hide();
                            }
                        }
                        else {
                            $(".coin-num-area").show();
                        }
                    },

                });
                uawardTypePop = lui.initDropDownList({
                    warpid: "drop_awardtype_pop_u", width: 260, textField: 'DicValue', valueField: 'DicKey', data: result, subtextlength: 7,
                    selectedCallBack: function (warpid, value, text) {
                        if ($("#ur2").attr("data-group-sel") == "1") {
                            if (+value == 7) {
                                $(".coin-num-area").show();
                            }
                            else {
                                $(".coin-num-area").hide();
                            }
                        }
                        else {
                            $(".coin-num-area").show();
                        }
                    },

                });

            },
            error: function () { }
        });

    },
    getData: function () {
        $("#ctable").html('<tr><td colspan=8>' + $("#divLoading").html() + '</td></tr>');
        var nodata = '<tr><td colspan=8><div align="center" style="margin-top: 30px; margin-bottom: 30px;"><br>暂无奖品<br> <br></div></td></tr>'
        var ithis = this;

        $.ajax({
            url: "/Org/Currency/GetAwardList",
            type: "post",
            async: true,
            data: ithis.queryobj,
            success: function (data) {
                if (data.OK) {
                    var tpl = require("OrgManage/awardList");
                    var r = data.Data;
                    var d = { iscg: iscg, data: r };
                    $("#totalNum").text(data.PageSum);
                    if (r.length > 0) {
                        $("#ctable").html(tpl(d));


                    }
                    else {

                        $("#ctable").html(nodata);
                    }
                    $("#pager").html(data.TagValue);
                }

            },
            error: function () {
                $("#ctable").html(nodata);
            }
        });
    },
    initDrawData: function () { },
    showDelAward: function (id) {
        $("#btn-del").attr("data-id", id);
        $("#pop-del,.pop-mask").show();
    },
    delAward: function (id) {
        var ithis = this;
        $.ajax({
            type: "post",
            url: "/Org/Currency/DelAward",
            dataType: "json",
            data: {
                awardID: id
            },
            success: function (data) {
                if (data.OK) {
                    ithis.showTip("删除成功", function () {
                        $("#pop-del,.pop-mask").hide();
                        ithis.getData();
                    });
                }
                else {
                    ithis.showTip(data.Result, function () {

                    });
                }

            },
            error: function () { }

        })
    },
    queryobj: { awardType: 0, schoolID: 0, awardID: 0, pageSize: 10, pageIndex: 1 },
    init: function () {
        if (iscg == 1) {
            this.getSchools();
        } else {
            this.getAwardTypes();
        }
        this.bindEvent();
    },
    showTip: function (msg, cb) {
        $(".fixed-success").html(msg);
        $(".fixed-success").show();
        setTimeout(function () { $(".fixed-success").hide(); if (cb) { cb(); } }, 1000);
    },
    PagerClick: function () {

    },

    bindEvent: function () {
        var ithis = this;

        $("#pager").on("click", "a[data-num]", function () {
            ithis.queryobj.pageIndex = $(this).attr("data-num");
            ithis.getData();
        });
        $("#btncreate").click(function () {
            $("#cawardName").val("");
            awardTypePop.setValue(-1);
            ithis.checkradio($("#pop-create").find("label[data-isautocheck]"));
            $("#pop-create").find(".filename_area").hide();
            ithis.hideImgArea($("#pop-create").find(".award_colse"));
            $("#ccoin-num").val("");
            $("#cremark").val("");
            $("#pop-create,.pop-mask").show();
        });
        $(".eg-pop .close").click(function () {
            $(this).parent().parent().hide();
            $(".pop-mask").hide();
        })

        $("#pop-create,#pop-update").on("click", 'label[data-group="award-way"]', function () {
            ithis.checkradio(this);
        });

        //提交验证
        function validateInput(m, f) {
            if (!m.AwardName) {
                $(".error").html("奖品名称不可为空");
                $(".error").show();
                setTimeout(function () { $(".error").html(""); }, 1500);
                return false;
            }
            if (m.AwardName.length > 10) {
                $(".error").html("奖品名称最多10个字符");
                $(".error").show();
                setTimeout(function () { $(".error").html(""); }, 1500);
                return false;
            }
            if (f) {
                var maxsize = 1024 * 1024 * 5;
                var imgarr = ["image/jpeg", "image/png", "image/jpg", "image/bmp"];
                if (imgarr.indexOf(f.type) < 0) {
                    $(".error").html("上传文件只能为图片");
                    $(".error").show();
                    setTimeout(function () { $(".error").html(""); }, 1500);
                    return false;
                }
                if (f.size > maxsize) {
                    $(".error").html("上传图片不可大于5M");
                    $(".error").show();
                    setTimeout(function () { $(".error").html(""); }, 1500);
                    return false;
                }
            }
            if (m.AwardType && m.AwardType > 0) { }
            else {
                $(".error").html("请选择奖品类别");
                $(".error").show();
                setTimeout(function () { $(".error").html(""); }, 1500);
                return false;
            }
            if ($(".coin-num-area").is(":visible")) {

                if (+m.AwardID == 0) {
                    if ($("#ccoin-num").val() == "") {
                        $(".error").html("请填写学币数量");
                        $(".error").show();
                        setTimeout(function () { $(".error").html(""); }, 1500);
                        return false;
                    }
                }
                else {
                    if ($("#ucoin-num").val() == "") {
                        $(".error").html("请填写学币数量");
                        $(".error").show();
                        setTimeout(function () { $(".error").html(""); }, 1500);
                        return false;
                    }
                }

            }
            return true;
        }
        $("#pop-create").on("click", "#btn-create-ok", function () {
            var item = $(this);

            var m = {
                AwardID: 0,
                AwardName: $("#cawardName").val(),
                AwardType: awardTypePop.getValue().value,
                AwardWays: $("#pop-create").find("span[data-group-sel]").attr("data-value"),
                CValue: $("#ccoin-num").val() == "" ? 0 : parseInt($("#ccoin-num").val()),
                Remark: $("#cremark").val()
            };

            var f = new FormData();

            f.append("data", JSON.stringify(m));
            f.append("f", document.getElementById("cupimg").files[0]);
            if (!validateInput(m, document.getElementById("cupimg").files[0])) {
                return false;
            }
            if (item.attr("sending") == 1) {
                return false;
            }
            else {
                item.attr("sending", 1);
            }
            var xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.open("post", '/Org/Currency/AddAward', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    data = xhr.response;
                    if (data.OK) {
                        ithis.showTip("添加成功", function () {
                            item.attr("sending", 0);
                            $("#pop-create,.pop-mask").hide();
                            ithis.getData();
                        });
                    }
                    else {
                        item.attr("sending", 0);
                        $(".error").html(data.Result);
                        $(".error").show();
                        setTimeout(function () { $(".error").html(""); }, 1500);
                    }
                }
                else if (xhr.readyState == 4 && xhr.status != 200) {
                    item.attr("sending", 0);
                }

            };
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.send(f);

        });

        $("#ucoin-num,#ccoin-num").keypress(function () {
            var keynum = event.keyCode;
            if (!(keynum >= 48 && keynum <= 57))//非数字
                return false;
            if ($(this).val().length == 4)//3位数字
                return false;
            //if ($(this).val() == "" && keynum == 48)//首位不能为0
            //    return false;
            if ($(this).val() == "0")//首位不能为0
                return false;

        });


        $("#uawardName,#cawardName").keypress(function () {
            var keynum = event.keyCode;
            if (keynum == 32 || keynum == 44 || keynum == 47 || keynum == 39 || keynum == 34 || keynum == 58)
                return false;
            if ($(this).val().length >= 10)
                return false;
        });


        $("#cupimg,#uupimg").change(function (e) {
            if (e.target.files.length == 0) { return; }
            var t = $(this);
            var f = e.target.files[0];
            var url = createObjectURL(f);
            var p = $(this).parent().parent();
            p.find(".filename_area").show();
            var fname = p.find(".filename");
            fname.attr("data-src", url);
            fname.text(f.name);
            t.siblings("span").text("修改图片");

        })
        //鼠标进入
        $("body").on("mouseover", ".filename", function (e) {
            var t = $(this);
            if (t.attr("data-src")) {
                var img = "<div class='moveimg' style='background:#fff;display: inline-block;position: absolute;z-index: 10;text-align: center;border: 1px solid rgb(201, 201, 201);left: 121px;top: 60px;box-shadow: #c9c9c9 0px 3px 5px 3px;'><i class='award_num_up'></i><img src='" + t.attr("data-src") + "' style='vertical-align:middle;' width='100px'/>";
                if (t.find(".moveimg").length == 0) {

                    t.attr("data-isover", 1);
                    t.append(img);

                }


            }

        });

        //鼠标移出
        $("body").on("mouseleave", ".filename", function () {
            var t = $(this);
            t.find(".moveimg").remove();
        });

        //鼠标移动

        $("body").on("mousemove", ".filename", function (e) {
            var t = $(this);
            if (!$(e.target).hasClass("filename")) { t.find(".moveimg").remove(); return false; }
            if (t.attr("data-isover") == 1) {
                var img = t.parent().find(".moveimg");
                var x = e.originalEvent.offsetX;
                var y = e.originalEvent.offsetY;

                img.css({ "left": x - 50, "top": t.height() + 5 });

            }
        });

        $(".award_colse").click(function (e) {
            ithis.hideImgArea(this);
        })

        //修改奖品
        $("#ctable").on("click", ".operatBtn", function () {
            var t = $(this).attr("data-type");
            var id = $(this).closest("tr").attr("data-id");
            switch (t) {
                case "edit":
                    ithis.showUpdatePop(id);
                    break;
                case "del":
                    ithis.showDelAward(id);
                    break;
            }
        });

        $("#pop-update").on("click", "#btn-save", function () {
            var item = $(this);

            var j = JSON.parse($(this).attr("data-json"));
            var isdelimg = $("#pop-update").find(".filename_area").is(":hidden");

            var m = {
                SchoolID: j.SchoolID,
                AwardID: j.AwardID,
                AwardName: $("#uawardName").val(),
                AwardType: uawardTypePop.getValue().value,
                AwardWays: $("#pop-update").find("span[data-group-sel]").attr("data-value"),
                CValue: $("#ucoin-num").val() == "" ? 0 : parseInt($("#ucoin-num").val()),
                Remark: $("#uremark").val(),
                AwardImg: isdelimg ? "" : j.AwardImg,
                AwardImgName: isdelimg ? "" : j.AwardImgName

            };


            var f = new FormData();

            f.append("data", JSON.stringify(m));
            f.append("f", document.getElementById("uupimg").files[0]);
            if (!validateInput(m, document.getElementById("uupimg").files[0])) {
                return false;
            }
            if (item.attr("sending") == 1) {
                return false;
            }
            else {
                item.attr("sending", 1);
            }
            var xhr = new XMLHttpRequest();
            xhr.responseType = "json";
            xhr.open("post", '/Org/Currency/EditAward', true);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    data = xhr.response;
                    if (data.OK) {
                        ithis.showTip("修改成功", function () {
                            item.attr("sending", 0);
                            $("#pop-update,.pop-mask").hide();
                            ithis.getData();
                        });
                    }
                    else {
                        item.attr("sending", 0);
                        $(".error").html(data.Result);
                        $(".error").show();
                        setTimeout(function () { $(".error").html(""); }, 1500);
                    }

                }
                else if (xhr.readyState == 4 && xhr.status != 200) {
                    item.attr("sending", 0);
                }

            };
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.send(f);
        });
        $("#pop-update").on("click", "#btn-ab", function () {
            $("#pop-update,.pop-mask").hide();
        });


        //删除奖品

        $("#pop-del").on("click", "#btn-del", function () {
            ithis.delAward($(this).attr("data-id"));
        });
        $("#pop-del").on("click", "#btn-del-cancel", function () {
            $("#pop-del,.pop-mask").hide();
        });

    },

    //弹出修改框
    showUpdatePop: function (id) {
        ithis = this;
        $.ajax({
            url: "/Org/Currency/GetAwardList",
            type: "post",
            async: true,
            data: { awardID: id },
            success: function (data) {
                if (data.OK) {
                    var r = data.Data;
                    var m = r[0];
                    $("#btn-save").attr("data-id", id);
                    $("#btn-save").attr("data-json", JSON.stringify(m));
                    $("#uawardName").val(m.AwardName);
                    uawardTypePop.setValue(m.AwardType);
                    if (m.AwardImg) {
                        var fspan = $("#pop-update").find(".filename");
                        fspan.text(m.AwardImgName);
                        fspan.attr("data-src", m.AwardImg);
                        $("#pop-update").find(".filename_area").show();
                        $("#uupimg").siblings("span").text("修改图片");

                    }
                    else {
                        $("#pop-update").find(".filename_area").hide();
                        $("#uupimg").siblings("span").text("添加图片");
                    }
                    $("#uupimg").val("");
                    ithis.checkradio($("#pop-update").find(".radio[data-value='" + m.AwardWays + "']").parent());
                    if (m.AwardWays == 1) {
                        $("#ucoin-num").val(m.CValue);
                    }
                    else {
                        if (+m.AwardType == 7) {
                            $("#ucoin-num").val(m.CValue);
                        }
                        else {
                            $("#ucoin-num").val("");
                        }
                    }
                    $("#uremark").val(m.Remark);
                }

            },
            error: function () {

            }
        });

        $("#pop-update,.pop-mask").show();
    },
    checkradio: function (item) {
        var scheck = $(item).find(".radio");
        var acheck = $('label[data-group="award-way"]').find(".radio");
        acheck.removeClass("active");
        acheck.removeAttr("data-group-sel");
        scheck.addClass("active");
        scheck.attr("data-group-sel", 1);
        if (scheck.attr("data-value") == 2) {

            if (scheck[0].id == "ur2") {
                if (+uawardTypePop.getValue().value == 7) {
                    $(".coin-num-area").show();
                }
                else {
                    $(".coin-num-area").hide();
                }
            }
            else if (scheck[0].id == "cr2") {
                if (+awardTypePop.getValue().value == 7) {
                    $(".coin-num-area").show();
                }
                else {
                    $(".coin-num-area").hide();
                }
            }
        }
        else {
            $(".coin-num-area").show();
        }
    },
    hideImgArea: function (item) {
        var p = $(item).parent();
        p.hide();
        var url = $(item).siblings(".filename").attr("data-src");
        revokeObjectURL(url);
        document.getElementById("cupimg").value = "";
        document.getElementById("uupimg").value = "";
        $("#cupimg,#uupimg").siblings("span").text("添加图片");
    }
}
//radio 选中

$(function () {

    awardList.init();
})