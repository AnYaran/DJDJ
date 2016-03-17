/**
 * Created by Yaran Ann on 2015/7/27 0027.
 * 房产导购详细页JS
 */

/*
 * 顶部广告轮播初始化
 * */
var swiper = new Swiper('.swiper-detail', {
    pagination: '.swiper-detail .swiper-pagination',
    paginationClickable: true,
    // Disable preloading of all images
    preloadImages: false,
    // Enable lazy loading
    lazyLoading: true,
    loop: true,
    autoplay: 2500,
    autoplayDisableOnInteraction: false
});

/*
 * 导航Tab切换
 * */
var pageNum = 2;
$('.dt-tabs-nav > a').on('click',function(e){
    e.preventDefault();
    var _this = $(this)
        ,_index = _this.index();

    _this.addClass('active').siblings().removeClass('active');
    $("#tab-content > .tab-pane:eq("+_index+")").addClass('active').siblings().removeClass('active');

    if (_this.parent().hasClass('affix')) {
        myScroll.scrollTo(0, -document.getElementById('tab-content').offsetTop);
    } else {
        myScroll.refresh();
    }
});


$(function(){
    /*
     * 预约报名表单验证
     * */
    $('#myForm').on('click','#J_submitBtn',function(){
        var _this = $(this);
        var _uname = $('#uname').val();
        if ($.trim(_uname) == "") {
            $.gohn._showTip("请输入您的姓名");
            $('#uname').focus();
            return false;
        }
        var _tel = $('#tel').val();
        if ($.trim(_tel) == "") {
            $.gohn._showTip("请输入您的手机号码");
            $('#tel').focus();
            return false;
        }

        if (!($.utils._regPhone(_tel))) {
            $.gohn._showTip("请输入正确的手机号码")
            $("#tel").focus();
            return false;
        }

        var _demmand = $('#demmand').val();
        if ($.trim(_demmand) == "") {
            $.gohn._showTip("请输入您的购房需求");
            $('#amount').focus();
            return false;
        }

        $.ajax({
            method: "post",
            url: "../assets/ajax/data-apply.json",
            data: $('#myForm').serialize(),
            dataType: 'json',
            beforeSend: function(){
                _this.html('<img src="../assets/img/loading.svg" width="15" height="15" style="vertical-align: top;"> 正在提交...');
                _this[0].disabled = true;
            }
        }).done(function(data){
            $.gohn._showPrompt("success","提交成功！");
            _this.html('确认提交');
            _this[0].disabled = false;
            setTimeout(function(){
                $('#J_applyModal').modal('hide');
            },1000);
        }).fail(function(){
            $.gohn._showPrompt("fail","请求失败！");
            _this.html('确认提交');
            _this[0].disabled = false;
            setTimeout(function(){
                $('#J_applyModal').modal('hide');
            },1000);
        });
    });
});
