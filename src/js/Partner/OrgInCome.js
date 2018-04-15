
Init(1);

function Init(f) {
    $("#dBody").html("");
    $("#emptyDataBefore").tmpl(null).appendTo("#dBody");
    $.ajax({
        type: "post",
        url: "/Partner/Data/GetOrgBalance",
        dataType: "json",
        data: {
            OrgID: _orgID, PageIndex: f
        },
        error: function (e) {

        },
        success: function (e) {
            $("#dBody").html("");
            if (e.Data == null || e.Data.D.length == 0) {
                $("#emptyDataOver").tmpl(null).appendTo("#dBody");
            }
            else {
                $("#blanceData").tmpl(e.Data.D).appendTo("#dBody");
            }
            $("#sumMoney").html(e.Data.CurrentValueStr);
            $("#sumBalance").html(e.PageSum);
            $("#pager").html(e.TagValue);

            //分页事件
            PagerClick();
        }
    });
}


function PagerClick() {
    $("#pager a[data-num]").click(function () {
        var _p = $(this).attr("data-num");
        Init(_p);//加载表格
    });
}