

Init(1);

function Init(f) {
    $("#dBody").html("");
    $("#emptyDataBefore").tmpl(null).appendTo("#dBody");
    $.ajax({
        type: "post",
        url: "/Partner/Data/GetMyBalance",
        dataType: "json",
        data: {
            PageIndex: f
        },
        error: function (e) {
            $("#emptyDataOver").tmpl(null).appendTo("#dBody");
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