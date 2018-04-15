function popshow(sele, popshow) {//弹出层的显示

    sele.on('click', function () {
        popshow.show();
        $('.pop-mask').show();
        $('.pop-mask').show();
    })
}
function pophide(sele, popshow) {//弹出层的消失
    sele.on('click', function () {
        popshow.hide();
        $('.pop-mask').hide();
    })
}
function checkBoox() {//复选框的样式
    $('.checkBox').on('click', function () {
        if ($(this).find('img').css('visibility') == 'visible') {
            $(this).find('img').css('visibility', 'hidden');
            $(this).css('border', '1px solid #8e9fa8');
        } else {
            $(this).find('img').css('visibility', 'visible');
            $(this).css('border', '1px solid #fff');
        }
    })
}
function chooseAll() {//全选全不选
    $('.checkBox').on('click', function () {
        var num = $('.checkBox').index($(this));
        if (num == 0) {
            if ($(this).find('img').css('visibility') == 'visible') {
                $('.checkBox').each(function () {
                    $(this).find('img').css('visibility', 'hidden');
                    $(this).css('border', '1px solid #8e9fa8');
                })
            } else {
                $('.checkBox').each(function () {
                    $(this).find('img').css('visibility', 'visible');
                    $(this).css('border', '1px solid #fff');
                })
            }
        } else {
            if ($(this).find('img').css('visibility') == 'visible') {
                $(this).find('img').css('visibility', 'hidden');
                $(this).css('border', '1px solid #8e9fa8');
            } else {
                $(this).find('img').css('visibility', 'visible');
                $(this).css('border', '1px solid #fff');
            }
            var $imgs = $.makeArray($('.table tr:not(:first)').find('img'));
            var value = $imgs.every(function (item) {
                return item.style.visibility == 'visible';
            })
            if (value) {
                $('.checkBox').first().find('img').css('visibility', 'visible');
                $('.checkBox').first().css('border', '1px solid #fff');
            } else {
                $('.checkBox').first().find('img').css('visibility', 'hidden');
                $('.checkBox').first().css('border', '1px solid #8e9fa8');
            }
        }
    })

}
function Sibs(This) {
    This.on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
    })
}

function radio() {//单选的样式
    $('.radio').on('click', function () {
        $('.radio').removeClass('active');
        $(this).addClass('active');
    })
}

function setCookie(objName, objValue, objHours) {
    var str = objName + "=" + escape(objValue);

    if (objHours > 0) { //为0时不设定过期时间，浏览器关闭时cookie自动消失
        var date = new Date();
        var ms = objHours * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString() + ";path=/";
    }
    document.cookie = str;
}

function getCookie(objName) { //获取指定名称的cookie的值
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) {
            return unescape(temp[1]);
        }
    }
}
window._globaltimer = null;//全局的定时器
//弹出加载图片
function ShowLoading(obj) {
    obj.html(jQuery("#divLoading").html());
}
function timeTickBig(second, callback) {
    $(".times-big").html(second + "S");
    var interval = {
        clock: {},
        tickTime: 0,
        remainTickTime: 0
    };
    interval.clock = t = setInterval(function () {
        $(".times-big").html(--second + "S");
        if (second <= 0) {
            $(".rotate-point").css({"animation-play-state": "paused"});
            clearInterval(t);
            if (callback) {
                callback();
            }
        }
    }, 1000);
    $(".rotate-point").css({"animation-play-state": "running"});
}
function timeTickSmall(second, callback, isOpeat) {//isOpeat是否进行了答题后点退出操作 
    var ts = second;
    $(".rotate-small").show();
    $(".times-small").html(second + "s");
    if (isOpeat) { second = 1; }
    
   var interval = {
        clock: {},
        tickTime: 0,
        remainTickTime: second
    };
   clearInterval(window._globaltimer);
   window._globaltimer = null;
   window._globaltimer = setInterval(function () {
        if (second > 1) {
            $(".times-small").html(--second + "s");
        } else { --second; }
        interval.remainTickTime = second;
        interval.tickTime = ts - second;
        if (second == 0) {
            $(".rotate-point").css({"animation-play-state": "paused"});
            if (callback) {
                if (window.ituserClick) {
                    window.ituserClick = false;
                    return false;
                }
               callback();
            }
        }

    }, 1000);

    $(".rotate-point").css({"animation-play-state": "running"});
    return interval;
}
function timeTickSmall1(second, callback) {
    var ts = second;
    $(".award-time span").html(second);
    var interval = {
        clock: {},
        tickTime: 0,
        remainTickTime: 0
    };
    interval.clock = t = setInterval(function () {
        $(".award-time span").html(--second);
        interval.remainTickTime = second;
        interval.tickTime = ts - second;
        if (second <= 0) {
            clearInterval(t);
            if (callback) {
                callback();
            }
        }

    }, 1000);
    return interval;
}
function progessBar(p, cur, total) {
    if (!p) {
        return;
    }
    cur = cur || 0;
    total = total || 10;
    w = $(p).find(".progress-bar").width() * (cur / total);
    $(p).find(".child-progress").css({"width": w + "px"});
    $(p).find(".cur-num").html(cur);
    $(p).find(".total-num").html(total);
}

//加载图片到某个元素中
function InsertLoading(obj) {
    obj.append(jQuery("#divLoading").html());
}

function CheckBrowser() {
    //平台、设备和操作系统
    var system = {
        win: false,
        mac: false,
        xll: false,
        ipad: false
    };
    //检测平台
    var p = navigator.platform;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    system.ipad = (navigator.userAgent.match(/iPad/i) != null) ? true : false;
    if (system.win || system.mac || system.xll) {
        return false;
    } else {
        return true;

    }
};

var teacherCom = {
    showConfirm: function (msg, oktext, canceltext, okcallback, cancelcallback) {
       $("#teacher-com-shade-box,#teacher-com-body").remove();
        var html = '<!--遮罩--><div class="pop-mask" id="teacher-com-shade-box" style="z-index:10600"></div>';
        html += '<div class="teach_popStyle" id="teacher-com-body" style="z-index:10601">';
        html += '<!--对话框--><div class="body" >';
        html += '<p class="sing_text">' + msg + '</p>';
        html += '<div>';
        html += '<span class="teacher-btn blue" id="teacher-com-confirm">' + oktext + '</span>';
        html += '<span class="teacher-btn gray fr" id="teacher-com-cancel">' + canceltext + '</span>';
        html += '</div>';
        html += '</div></div>';
        $("body").append(html);
        $("body").off("click", "#teacher-com-confirm");
        $("body").on("click", "#teacher-com-confirm", function () {
            $("#teacher-com-shade-box,#teacher-com-body").remove();
            if (okcallback)
                okcallback();
        });
        $("body").off("click", "#teacher-com-cancel");
        $("body").on("click", "#teacher-com-cancel", function () {

            if (cancelcallback)
                cancelcallback();
            $("#teacher-com-shade-box,#teacher-com-body").remove();
        })
    }

}
module.exports = {
    pophide: pophide,
    popshow: popshow,
    checkBoox: checkBoox,
    Sibs: Sibs,
    radio: radio,
    chooseAll: chooseAll,
    setCookie: setCookie,//设置cookie
    getCookie: getCookie, // 获取cookie
    ShowLoading: ShowLoading,//加载中
    InsertLoading: InsertLoading,
    timeTickBig: timeTickBig,//倒计时
    timeTickSmall: timeTickSmall,//倒计时
    timeTickSmall1:timeTickSmall1,
    progessBar: progessBar,
    checkBrowser: CheckBrowser,
    Awardyb: Awardyb,
    AwardRoate:AwardRoate,
    Secret: Secret,
    teacherCom: teacherCom
}

/*//摇杆
function Awardyb(warpid,awardindex,alltime) {
    alltime=alltime||10000;

    awardindex=awardindex||(Math.ceil(Math.random()*11)+1);
    var loop = {
        interval: 1,
        loop_interval: 500,
        timer: {},
        totaltime:0,
        init: function (plist) {
            this.plist = plist;
            var lthis = this;
            lthis.run();

        },
        run: function () {
            var lthis = this;
            lthis.timer = setInterval(function () {
                lthis.toggle();
            }, lthis.loop_interval);
        },
        toggle: function () {
            var lthis = this;
            var plist = this.plist;
            lthis.totaltime=lthis.totaltime+lthis.loop_interval;
            if(alltime-lthis.totaltime<=3000){
                lthis.loop_interval=800;
                if(lthis.timer){
                    clearInterval(lthis.timer);
                    lthis.timer=setInterval(function () {
                        lthis.toggle();
                    }, lthis.loop_interval);
                }
                if(alltime-lthis.totaltime<=2000){
                    lthis.loop_interval=1000;
                    if(lthis.timer){
                        clearInterval(lthis.timer);
                        lthis.timer=setInterval(function () {
                            lthis.toggle();
                        }, lthis.loop_interval);
                    }
                }
            }
            if(this.totaltime>=alltime){
                if(lthis.timer){
                    clearInterval(lthis.timer);
                    plist.css({ "opacity": 0,"bottom": 0});
                    var item=$(plist[awardindex]);
                    item.css({ "opacity": 1,"bottom": (18*1)+"px"});
                    return false;
                }
            }

            for(var k=0;k<plist.length;k++){
                var item=plist.filter("[data-index='"+k+"']").filter("[data-add='1']");
                if(k==0){
                    // item.show();
                    item.css({ "opacity": 1,"bottom": (18*1)+"px"});;
                }
                else{
                    // item.hide();
                    item.css({ "opacity": 0,"bottom": 0});

                }


                if(k<plist.length-1){
                    item.attr("data-index", k+1);
                    item.removeAttr("data-add");
                }
                else{
                    item.attr("data-index", 0);
                    plist.attr("data-add",1);
                }
            }

        },


    };
    var warp = $('#'+warpid);
    //摇杆
    var yg = warp.find(".yg");
    //抽奖区域
    var runwarp = warp.find('.yb3');
    this.ygdown = function (random) {
        this.awardindex=random;
        yg.css({"transform": "rotateX(30deg)"});
        setTimeout(function () {
            yg.css({"transform": "rotateX(0deg)"});
        }, 1500);
        this.awardrun();
    }
    this.awardrun = function () {
        var plist = runwarp.find("p");
        loop.init(plist);
    }
}*/

//大转盘抽奖
/*function AwardRoate(requestRandomNum) {

    //计算旋转的角度
    var original=0;
    //随机数
    var random_index=0;
    var roate_flag=false;//防止用户多次点击

    this.requestRandomNum=requestRandomNum;
    var athis=this;

  $(".roate_award .opt .btn-award").rotate({
        bind:{
            click:function(){

                if(!roate_flag){
                    roate_flag=true;
                    if(athis.requestRandomNum&&typeof athis.requestRandomNum=="function")
                    {
                        random_index=athis.requestRandomNum();
                        console.log('随机数'+random_index);
                    }
                    else{
                        random_index=Math.floor(Math.random()*7) + 1;

                    }
                    original=(random_index*45+(Math.floor(Math.random()*45) + 1));//Math.floor(Math.random()*45) + 1...最后指针的位置
                    $('.roate_roate').rotate({
                        duration:3000,
                        angle:0,
                        animateTo:-(original+1440),
                        easing: $.easing.easeOutSine,
                        callback: function(){
                           res=random_index+1;
                            console.log('结果值'+res);
                            roate_flag=false;
                        }
                    });
                }else{return;}

            }
        }
    });
}*/
//大转盘抽奖
/**/
function AwardRoate(){//touchBtn 触发元素,//ele_roate旋转元素  roateClass //自行旋转的类
    this.original=0;//计算旋转的角度
    this.index=0;//随机数
    this.roate_flag=false;//防止用户多次点击
   var athis=this;
    //点击的时候进行自行转动
    this.roateSelf=function(){
        if(!this.roate_flag){
            this.roate_flag=true;
            $('.roate_roate').addClass('roateBySelf');
        }
    };
    this.roateUser=function(random_index,callBack){//random_index  web反馈值 //callBack 进行抽奖后面的后续工作
        this.index=random_index;
        $('.roate_roate').removeClass('roateBySelf');
        this.original=(this.index*45+(Math.floor(Math.random()*45) + 1));//Math.floor(Math.random()*45) + 1...最后指针的位置
        $('.roate_roate').rotate({
            duration:2500,
            angle:0,
            animateTo:-(athis.original+1440),
            easing: $.easing.easeOutSine,
            callback: function(){
             if(callBack){callBack(random_index);}
                athis.roate_flag=false;
            }
        });
    }
}
//摇杆抽奖
var set=null;
function setInter(arry_ybs,i,athis){
    set=setInterval(function(){
        i++;
        if(!arry_ybs[i]){i=0;}
        $('.translate_p').html(arry_ybs[i]);
        if(athis.index==i && typeof athis.index=='number'){
            $('.translate_p').removeClass('translate');
            athis.roate_flag=false;
            clearInterval(set);
            athis.callBack(athis.index);
            athis.index='';
        }
    },200);
}
function Awardyb(arry_ybs){// arry_ybs  传入的所有的奖项
    this.index='';//保存随机数的值
    this.roate_flag=false;//防止用户多次点击
    var athis=this;
    this.callBack=function(index){//定义一个完成时候执行的callback
      //  console.log(index);
    };
    this.roateSelf=function(random_index,callBack){//random_index为随机数 callBack为回调函数
        $('.award-yb-all .yg').css({"transform": "rotateX(360deg)"});
        setTimeout(function () {
            $('.award-yb-all .yg').css({"transform": "rotateX(0deg)"});
        }, 500);
        if(!this.roate_flag){
            this.roate_flag=true;
            $('.translate_p').addClass('translate');
           setInter(arry_ybs, 0, athis);//athi将生成的对象传递进去
            
           
        }
    }
    this.roateUser = function (random_index, callBack) {
        this.roateSelf();
        this.index=random_index;
        this.callBack=callBack;
    }
}
//秘密传递奖项
function Secret(award_list){//item用户点击时候传递的当前对象
    this.roate_flag=false;//防止用户多次点击
    this.obj='';//存储传入的对象
    var athis=this;
    this.roateSelf=function(item){
        if(this.obj){//再次点击时
            $('.cj2 .card-warp').each(function(){
                $(this).find(".card-open").css({ "transform": "rotateY(-180deg)" });
                $(this).find(".card-close").css({ "transform": "rotateY(0deg)" });
            })
        }
        if(!this.roate_flag){
            this.obj=item;
            item.addClass('secret_roate');
            this.roate_flag=true;
        }
    }
    this.roateUser=function(random_index,callBack){
        if(this.obj){
            this.obj.removeClass('secret_roate');
        }
        else{
            this.obj = $(".cj2 .card-warp[data-index='" + random_index + "']");
            this.obj.removeClass('secret_roate');
        }
        this.roate_flag=false;
        this.obj.find(".card-open .card-inner-front").html(award_list[random_index]);
        callBack(award_list[random_index]);
        var o = this.obj.find(".card-open");
        var c = this.obj.find(".card-close");
        o.css({ "transform": "rotateY(0deg)" });
        c.css({ "transform": "rotateY(-180deg)" });
        setTimeout(function () {
            var olist = athis.obj.siblings().find(".card-open");
            var clist = athis.obj.siblings().find(".card-close");
            olist.css({ "transform": "rotateY(0deg)" });
            clist.css({ "transform": "rotateY(-180deg)" });
        }, 1000);
    }
    this.reset=function () {
        var olist =$(".card-warp").find(".card-open");
        var clist =$(".card-warp").find(".card-close");
        olist.css({ "transform": "rotateY(180deg)" });
        clist.css({ "transform": "rotateY(0deg)" });
    }
}

