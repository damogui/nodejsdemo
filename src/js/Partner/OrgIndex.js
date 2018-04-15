

Init();

function Init() {

    $.ajax({
        type: "post",
        url: "/Partner/Data/GetOrgInfo",
        dataType: "json",
        data: {
            OrgID: _orgID
        },
        error: function (e) {

        },
        success: function (e) {
            if (e.OK) {
                $("#Addr").text(e.Data.Addr);
                $("#Email").text(e.Data.Email);
                $("#AreaLeval").text(e.Data.AreaLevalStr);
                $("#Sales").text(e.Data.SalesStr);
                $("#Schools").text(e.Data.SchoolStr);
                $("#Teachers").text(e.Data.TeacherStr);
                $("#Students").text(e.Data.StudentStr);
            }
        }
    });

}


