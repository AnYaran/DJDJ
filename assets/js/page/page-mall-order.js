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

/*
 * 查看更多评论
 * */
var pageNum = 2;
$('#J_loadMoreCmt').on('click',function(){
    if (pageNum == 3) {
        $('#J_loadMoreCmt').html('木有更多了').addClass('none');
        myScroll.refresh();
        return false;
    }
    // ajax加载更多评论
    var _html = '';
    $.ajax({
        method: "POST",
        url: "../assets/ajax/data-cmt.json",
        data: {page: pageNum},
        beforeSend: function(){
            $('#J_loadMore').show();
        }
    }).done(function(data){
        for (var i= 0;i< data.length;i++) {
            _html += '<li class="dt-cmt-item">';
            _html += '<div class="uinfo">';
            _html += '<a href="'+data[i].href+'">';
            _html += '<span class="avatar">';
            _html += '<img src="'+data[i].pic+'" alt="'+data[i].uname+'用户头像">';
            _html += '</span>';
            _html += '</a>';
            _html += '<div class="uinfo-main">';
            _html += '<a href="'+data[i].href+'">';
            _html += '<span class="uname">'+data[i].uname+'</span>';
            _html += '</a>';
            _html += '<ul class="star">';
            for (var j = 0;j < parseInt(data[i].star);j++) {
                _html += '<li class="on"></li>';
            }
            for (var k = 0;k < 5 - parseInt(data[i].star);k++) {
                _html += '<li></li>';
            }
            _html += '</ul>';
            _html += '</div>';
            _html += '</div>';
            _html += '<div class="dt-cmt-txt">'+data[i].text+'</div>';
            _html += '<div class="dt-cmt-time">'+data[i].time+'</div>';
            if (data[i].replyState == 0) {
                _html += '<div class="dt-cmt-reply">';
                _html += '<span>[商家]：</span>'+data[i].replyTxt;
                _html += '</div>';
            }
            _html += '</li>';
        }
        $('#J_cmtList').append(_html);
        $('#J_loadMore').hide();
        pageNum++;
        myScroll.refresh();
    }).fail(function(data){
        $('#J_loadMoreCmt').html('加载失败');
        $('#J_loadMore').hide();
    });
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
            type: "post",
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
