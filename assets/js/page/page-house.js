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
    if (_index == 1) { // 地图交通重置地图中心点
        setTimeout(function(){
            mp.setCenter(new BMap.Point(pointX,pointY));
        }, 100);
    }
    if (_index == 4) { // 评论列表
        $('#J_cmtAction').insertAfter($('.bar-btn-group')).addClass('affix');
        myScroll.on('scrollEnd', function(){
            if (pageNum == 3) {
                $('#J_loadMore').html('木有更多了');
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
                    _html += '</li>';
                }
                $('#J_cmtList').append(_html);
                pageNum++;
                myScroll.refresh();
            }).fail(function(data){
                $('#J_loadMore').html('加载失败');
            });
        });
    } else {
        $('#J_cmtAction').insertAfter($('#J_loadMore')).removeClass('affix');
    }

    _this.addClass('active').siblings().removeClass('active');
    $("#tab-content > .tab-pane:eq("+_index+")").addClass('active').siblings().removeClass('active');

    if (_this.parent().hasClass('affix')) {
        myScroll.scrollTo(0, -document.getElementById('tab-content').offsetTop);
    } else {
        myScroll.refresh();
    }
});


/*
 * 地图
 * */
var mp;
var pointX = 110.294864;
var pointY = 19.987957;
function initialize() {
    mp = new BMap.Map('allmap');
    var _initPoint = new BMap.Point(pointX,pointY);
    mp.centerAndZoom(_initPoint, 15);
    $.gohn._initMap(new BMap.Point(pointX,pointY),'长岛蓝湾 7300元/m2');
}
function loadScript() {
    var script = document.createElement("script");
    script.src = "http://api.map.baidu.com/api?v=2.0&ak=0KwZB6jDdajUxgZtPLlyg7UC&callback=initialize";
    document.body.appendChild(script);
}
window.addEventListener('load',loadScript);



$(function(){
    /*
     * 户型图轮播初始化
     * */
    _w = document.getElementById('content').offsetWidth - 0.5*0.0625*(640<=document.documentElement.getBoundingClientRect().width?640:document.documentElement.getBoundingClientRect().width);
    var swiper1 = new Swiper('#J_swiperHousetype_1', {
        width: _w,
        nextButton: '#J_swiperHousetype_1 .swiper-button-next',
        prevButton: '#J_swiperHousetype_1 .swiper-button-prev',
        // Disable preloading of all images
        preloadImages: false,
        // Enable lazy loading
        lazyLoading: true,
        loop: true
    });
    var swiper2 = new Swiper('#J_swiperHousetype_2', {
        width: _w,
        nextButton: '#J_swiperHousetype_2 .swiper-button-next',
        prevButton: '#J_swiperHousetype_2 .swiper-button-prev',
        // Disable preloading of all images
        preloadImages: false,
        // Enable lazy loading
        lazyLoading: true,
        loop: true
    });
    var swiper3 = new Swiper('#J_swiperHousetype_3', {
        width: _w,
        nextButton: '#J_swiperHousetype_3 .swiper-button-next',
        prevButton: '#J_swiperHousetype_3 .swiper-button-prev',
        // Disable preloading of all images
        preloadImages: false,
        // Enable lazy loading
        lazyLoading: true,
        loop: true
    });

    /*
     * 户型切换
     * */
    $('#J_houseTypeList > li > a').on('click',function(e){
        e.preventDefault();
        $(this).parent().toggleClass('open').siblings().removeClass('open');
    });


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

$(function(){
    /*
     * 星星评价
     * */
    var $Star = $(".J_star");
    $Star.each(function(){
        var $this = $(this);
        var aLi = $this.find('li');
        var oInput = $this.siblings('.J_iScore')[0];
        var j = iScore = iStar = 0;

        for (j = 1; j <= aLi.length; j++){
            aLi[j - 1].index = j;

            //鼠标移过显示分数
            aLi[j - 1].onmouseover = function (){
                fnPoint(this.index);
            };

            //鼠标离开后恢复上次评分
            aLi[j - 1].onmouseout = function (){
                fnPoint();
            };

            //点击后进行评分处理
            aLi[j - 1].onclick = function (){
                iStar = this.index;
                oInput.value = this.index;
            }
        }

        //评分处理
        function fnPoint(iArg){
            //分数赋值
            iScore = iArg || iStar;
            for (var i = 0; i < aLi.length; i++) aLi[i].className = i < iScore ? "on" : "";
        }
    });
});

/*
 * 表单提交
 * */
var $J_submitBtn = $('#J_submitBtn');
var $J_cmtList = $('#J_cmtList');
var $J_cmtItem = $J_cmtList.find('.cmt-item');
var $J_cmtContent = $J_cmtList.find('.J_cmtContent');

function validForm(){
    var cmtData = $('#myCmtForm').serialize();
    var cmtContent = $('#cmtContent').val();
    if ($.trim(cmtContent) == '') {
        $.gohn._showTip('请输入您的评价！');
        $('#cmtContent').focus();
        return false;
    }

    $.ajax({
        method: "post",
        url: "../assets/ajax/data-login.json",
        data: {cmtData:cmtData},
        dataType: 'json',
        beforeSend: function(){
            $J_submitBtn.html('<img src="../assets/img/loading.svg" width="15" height="15" style="vertical-align: top;"> 正在提交...');
            $J_submitBtn[0].disabled = true;
        }
    }).done(function(data){
        if (data.stateCode == 0) {
            $.gohn._showTip("发表评价成功");
            setTimeout(function(){
                window.location.href = "index.html";
            },1000);
        }
    }).fail(function(){
        $.gohn._showTip("请求失败");
    }).always(function(){
        $J_submitBtn.html('发表评价');
        $J_submitBtn[0].disabled = false;
    });
}
