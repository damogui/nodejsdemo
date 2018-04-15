var Lui = require('../../LUI/js/lui');
var lui = new Lui();
//
//Tag---1为查询我的合伙人；其它为查询其它城市合伙人
//城市,搜索，年、校区、老师、学生、排序
var row_data = { PageIndex: 1, Tag: 1, AreaID: 0, TagValue: "", OrgYear: 0, OrgSchool: 0, OrgTeacher: 0, OrgStudent: 0, OrgOrder: 0 };//搜索条件


var drop_year;//老师对象
var drop_school;//校区
var drop_teacher;//老师
var drop_student;//学生

init();

function init() {
    GetCitys();
}


function GetYear(f) {
    $.ajax({
        type: "post",
        url: "/Org/Classes/GetDic",
        dataType: "json",
        data: { DicType: f },
        success: function (e) {
            if (+f == 10) {
                e.Data.unshift({ DicKey: 0, DicValue: "年营收" });
                drop_year = lui.initDropDownList({
                    warpid: "drop_year", width: 120, subtextlength: 10, textField: 'DicValue', valueField: 'DicKey', data: e.Data
                });
                GetYear(11);
            }
            if (+f == 11) {
                e.Data.unshift({ DicKey: 0, DicValue: "校区数量" });
                drop_school = lui.initDropDownList({
                    warpid: "drop_school", width: 120, subtextlength: 10, textField: 'DicValue', valueField: 'DicKey', data: e.Data
                });
                GetYear(12);
            }
            if (+f == 12) {
                e.Data.unshift({ DicKey: 0, DicValue: "老师数量" });
                drop_teacher = lui.initDropDownList({
                    warpid: "drop_teacher", width: 120, subtextlength: 10, textField: 'DicValue', valueField: 'DicKey', data: e.Data
                });
                GetYear(13);
            }
            if (+f == 13) {
                e.Data.unshift({ DicKey: 0, DicValue: "年生源量" });
                drop_student = lui.initDropDownList({
                    warpid: "drop_student", width: 120, subtextlength: 12, textField: 'DicValue', valueField: 'DicKey', data: e.Data
                });
            }
        }
    });
}

function GetCitys() {
    $.ajax({
        type: "post",
        url: "/Partner/Data/GetsTitleCitys",
        dataType: "json",
        data: { Tag: 0 },
        success: function (e) {
            if (e.OK) {
                $("#citysData").tmpl(e.Data).appendTo("#citys");
                //过滤条件
                drop_org = lui.initDropDownList({
                    warpid: "drop_orgsource", width: 150, subtextlength: 11, textField: 'SourceName', valueField: 'SourceID', data: [{ SourceName: '全部', SourceID: 0 }, { SourceName: '只看我签约的', SourceID: 1 }, { SourceName: '魔方格转给我的', SourceID: 2 }]
                });
                GetYear(10);
            }
        }
    });
}
