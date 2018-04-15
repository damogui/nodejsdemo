function LuiWordSpeak() {
    this.selector = "lui_wordspeak";
    this.param = {};
 
}

LuiWordSpeak.prototype = {
    speakList:{},
    constructor: LuiWordSpeak,
    init: function (param) {
        var sthis = this;
        param = param || {};
        $(".lui_div_speak").remove();
        var luidivspeak = '<div class="lui_div_speak" id="lui_div_speak"/>';
        $("body").append(luidivspeak);
       
        $(".lui_wordspeak").each(function (index, item) {
            // $(item).unbind("click");
            // $(item).bind("click", function() {
            //     sthis.play(item, 1, 1000, param.callback, true);
            // });
            
            $(item).unbind("mouseover");
            $(item).bind("mouseover", function () {
                sthis.play(item, 1, 1000, param.callback, true);
                $(item).addClass("play");
            });

        });
   
        window.LuiWordSpeakpause = false;
        if (param.auto) {
            param.loop = param.loop || 1;
            if (param.loop > 0) {
                // $(".lui_wordspeak").each(function(index, item) {
                //     sthis.play(item, param.loop, param.interval, param.callback);
                // });
                var item = $(".lui_wordspeak")[0];
                sthis.speakList["speak"] = $(item).attr("data-src");
                sthis.play(item, param.loop, param.interval, param.callback);
            }
        }
        sthis.param = param;
        return sthis;
    },
    //时间间隔
    /*
    @method 播放
    @param item 容器
           loop 播放次数
           interval 时间间隔
           callback 全部播放完成后回调
           isclick  是否手动触发播放
    */
    play: function (item, loop, interval, callback, isclick) {
        var sthis = this;
       
        loop = loop || 1;
        interval = interval || 1000;
        isclick = isclick || false;
        //暂停播放 全局设置停止播放
        if (window.LuiWordSpeakpause)
        {
            return;
        }
       //如果当前音频尚未播放完毕，不能打断
        if ($(item).attr("data-play") == 1) {
            return;
        } else {
            $(item).attr("data-play", 1);
        }
        if ($(item).attr("data-src") != sthis.speakList["speak"]) {
            return;
        }
        //创建audio 标签
        var audio = sthis.createAudio(item, loop, interval, callback, isclick);
        console.log(isclick);

        //判断 
        if (loop > 0) {
            if (!isclick) {
                sthis.loop = loop - 1;
                if (sthis.loop <= 1) {
                    clearTimeout(sthis.speaktimer);
                }
            }
            sthis.isclick = isclick;
            audio.play();
         
            //避免点击播放时也触发事件，将callback 改为callback&&isclick;过滤掉点击触发
            if (callback && !isclick) {
                if (loop === 1) {
                    //audio.onended = null;
                    var is_playFinish = setInterval(function () {
                        if (audio.ended) {
                            setTimeout(function () {
                                callback();
                            }, interval);
                            window.clearInterval(is_playFinish);
                        }
                    }, 5);
                    setTimeout(function () {
                        window.clearInterval(is_playFinish);
                    }, 10000);
                }
            }
            loop--;
        }

    },
    createAudio: function (item, loop, interval, callback, isclick) {
        var sthis = this;
        var url = $(item).attr("data-src");
        if ($("#lui_audio_speak").length > 0) {
            $("#lui_audio_speak").find("source")[0].src = url;
            document.getElementById("lui_audio_speak").load();
            return $("#lui_audio_speak")[0];
        }
        var div = document.getElementById('lui_div_speak');
        div.innerHTML = '<audio id="lui_audio_speak"><source src="' + url + '"></audio>';
        var audio = $("#lui_audio_speak")[0];
        audio.onended = null;
        audio.onended = function () {
            $(item).attr("data-play", 0);
            $(item).removeClass("play");
            if (sthis.loop > 0) {
                if (sthis.speaktimer) {
                    clearTimeout(sthis.speaktimer);
                }
                sthis.speaktimer = setTimeout(function () {
                    sthis.play(item, sthis.loop, interval, callback,false);
                }, interval);
            }
        };

        return audio;
    }

};
module.exports = LuiWordSpeak;