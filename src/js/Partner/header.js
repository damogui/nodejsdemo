/**
 * Created by WckY on 2017/6/29.
 */
$('#eg-header').html(require('component/partner'));
$('.header .nav li').click(function(){
    $(this).addClass('active').siblings().removeClass('active');
});
