
var openId = $("#openId").val();
var stuId = $("#stuId").val();
var userRole = $("#userRole").val();
var userPwd = $("#userPwd").val();
var loginId = $("#loginId").val();
var parentOrgId = $("#parentOrgId").val();//家长端绑定的机构id
$(function() {
   
    document.title = '魔方格';
    if (stuId == "0" || stuId == "") {
        //$.router.load("/Parents/ParentMenu/BindStuAccount", true); //处理跳转

        window.location.href = "/Parents/ParentMenu/BindStuAccount/" + openId + "?parentOrgId=" + parentOrgId;
        


    } else if (userRole == "4") {
        tlogin();
        //window.location.href = "/teacher/myclass/index";//跳转家长端

       
    } else {
        $("#main").css("display", "");//显示
    }

    document.title = '家长端';

    //右边
    $("body").undelegate("#unbindAccount", "click");
    $("body").delegate("#unbindAccount", "click", function () {
        window.location.href = "/Parents/ParentMenu/UnBindStuAccount/" + openId;
    });

    //$("#unbindAccount").click(function () {//解除绑定

    //    //var tipStr = "";
    //    //if (userRole == "4") {
    //    //    tipStr = "确定解除绑定此老师吗？";

    //    //} else {
    //    //    tipStr = "确定解除绑定此学生吗？";

    //    //}
    //    //$.confirm(tipStr, function () { UnBindStuAccount(); }, function () { });
    //    //// alert("确定要解除绑定");

    //    window.location.href = "/Parents/ParentMenu/UnBindStuAccount/" + openId ;
        
    //});

  
   
});

//解除绑定
function UnBindStuAccount() {

    $("#divLoading").show();
    //加载列表
    $.ajax({
        type: "post",
        url: "/Parents/ParentMenu/BindAccount",
        dataType: "json",

        data: {
            openId: openId, type: 1//0绑定1解绑

        },
        success: function (data) {
            $("#divLoading").hide();

            //$("#divLoading").hide();
            if (data.Data && data.Data.length > 0) {

                // $.router.load("/Parents/ParentMenu/BindStuAccount", true); //处理跳转
                window.location.href = "/Parents/ParentMenu/BindStuAccount/" + openId;
            }
            else {
                $.alert("绑定失败!", "提示");


            }
        }
    });

}


///教师端登录
function tlogin() {
    $.ajax({
        url: "/Home/Login",
        type: "post",
        data: {
            UserCode: loginId,
            UserPWD: userPwd
        },
        success: function (data) {

            if (typeof (data) == "string") {
                data = JSON.parse(data);
            }

            if (data.OK.toString() == "false") {
                $.toast(data.Result, 2000, "pop-toast");
            } else {
                window.location.href = "/teacher/myclass/index/" + window.tokenID;
            }
        }

    });

}

