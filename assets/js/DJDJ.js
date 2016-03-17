/**
 * Created by Yaran Ann on 2015/7/14 0014.
 */

/*
* iScroll初始化
* */
var myScroll;

function loaded() {
    /*
    * 页面加载完 移除loading
    * */
    $('#loading').remove();

    /*
    * 初始化iScroll
    * */
    myScroll = new IScroll('#wrapper',{
        probeType: 2,
        mouseWheel: true,
        tap: true,
        preventDefault: false
    });

    myScroll.on('scroll', function(){
        $("#wrapper").trigger('scroll');//iscroller和loadlazy.js 图片缓冲完毕后不能及时刷新，加上这个模拟浏览器被滑动，那么图片就可以刷新了
        /*
        * 回到顶部
        * */
        $.gohn._goTopShow();

        /*
         * 监听详细页Tab导航 -- 固定顶部
         * */
        if ($('#J_dtContent').length > 0) {
            if ( this.y <= (-1)*document.getElementById('J_dtContent').offsetTop) {
                $('#J_scrollSniffer').insertAfter($('.header')).addClass('affix');
            } else if ($('#J_scrollSniffer').hasClass('affix')){
                $('#J_scrollSniffer').insertBefore($('#tab-content')).removeClass('affix');
            }
            if ($('.dt-tabs-nav > a.active').index() == 4) {
                $('#J_cmtAction').insertAfter($('.bar-btn-group')).addClass('affix');
            } else {
                $('#J_cmtAction').insertAfter($('#J_loadMore')).removeClass('affix');
            }
        }

    });

    /*
    * 列表页下拉刷新上拉加载更多初始化
    * */
    if (typeof (ajaxLoad) != 'undefined') {
        if (myScroll) {
            myScroll.destroy();
            $(myScroll.scroller).attr('style','');
            myScroll = null;
        }
    }
}
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

(function($){
    /*
    * 验证正则
    * */
    $.utils = {
        _regPhone: function(value) {
            return /^13[0-9]{9}$|^15[0-9]{9}$|^18[0-9]{9}$/.test(value);
        },
        _isEmail: function(value) {
            return /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/.test(value);
        },
        _minlength: function( value, param ) {
            var length = value.length;
            return length >= param;
        },
        _maxlength: function( value, param ) {
            var length = value.length;
            return length <= param;
        },
        _regNumber: function(value) {
            return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
        }
    }
}(jQuery));




(function($){
    $.gohn = {
        /*
        * 二级菜单
        * */
        _submenu: function(){
            $('.has-submenu > a').on('click',function(e){
                e.stopPropagation();
                e.preventDefault();
                var $this = $(this);
                if ($this.parent().hasClass('open')) {
                    $this.parent().removeClass('open');
                } else {
                    $this.parent().addClass('open').siblings('.tab-item').removeClass('open');
                }
            });
            $('body,html').on('click',function(){
                $('.has-submenu').removeClass('open');
            });
        },
        /*
         * 提示信息
         * */
        _showTip: function(tipTxt){
            var div = document.createElement('div');
            div.innerHTML = '<div class="error-tip">'+tipTxt+'</div>';
            var tipNode = div.firstChild;
            $("body").after(tipNode);
            setTimeout(function(){
                $(tipNode).remove();
            }, 1500);
        },
        _showTip1: function(tipTxt){
            var div = document.createElement('div');
            div.innerHTML = '<div class="error-tip">'+tipTxt+'</div>';
            var tipNode = div.firstChild;
            $("body").after(tipNode);
        },
        /*
        * 表单提交结果
        * */
        _showPrompt: function(state,msg){
            var div = document.createElement('div');
            div.innerHTML = '<div class="prompt prompt-'+state+'">'+msg+'</div>';
            var tipNode = div.firstChild;
            $("#myForm").append(tipNode);
        },
        /*
        * 回到顶部
        * */
        _goTopShow: function(){
            var $goTop = $('.gotop');
            if ( myScroll.y < -300 ) {
                $goTop.fadeIn();
                $goTop.on('click',function(e){
                    e.preventDefault();
                    myScroll.scrollTo(0, 0);
                    $goTop.fadeOut();
                });
            } else {
                $goTop.fadeOut();
            }
        },
        /*
        * 搜索表单
        * */
        _formSearch: function(){
          //  var that = this;
            _show = function(e) {
                e.stopPropagation();
                $('#J_searchWrap').toggleClass('active');
                $(this).toggleClass('active');
            };
            _hide = function() {
                $('#J_searchWrap').removeClass('active');
                $('#J_searchShow').removeClass('active');
            };
            $('#J_searchShow').on('click',function(e){
                _show(e);
            });
            $('#J_searchHide').on('click',function(){
                _hide();
            });
            $('#J_searchWrap').on('click',function(e){
                e.stopPropagation();
            });
            $('body').on('click',function(){
                _hide();
            });
        },
        /*
        * 筛选
        * */
        _filterBar: function(){
            $('#J_fiterBar li.droplist-trigger').on('click',function(){
               var _this = $(this)
                   ,_droplistId = _this.data('target');
                $(_droplistId).siblings('.droplist').removeClass('droplist-expand');
                $(_droplistId).toggleClass('droplist-expand');
                $(_droplistId).find('li').on('click',function(){
                    var _that = $(this);
                    _this.find('span').html(_that.html());
                    _this.addClass('active');
                    $('.droplist').removeClass('droplist-expand');
                    $('#J_droplistMask').hide();
                });
                if ($(_droplistId).hasClass('droplist-expand')) {
                    $('#J_droplistMask').show();
                } else {
                    $('#J_droplistMask').hide();
                }
            });
            $('#J_droplistMask').on('click',function(){
                $('.droplist').removeClass('droplist-expand');
                $(this).hide();
            });
        },
        /*
        * 加入收藏
        * */
        _addFavorites: function(obj,proId){
            if ($(obj).hasClass('active')) return false;
            // ajax 收藏
            $.ajax({
                method: "POST",
                url: "../assets/ajax/data-favorites.json",
                data: {proId:proId},
                dataType: "json"
            }).done(function(data){
                $(obj).addClass('active');
                $(obj).find('span').html('已收藏');
                $.gohn._showTip('收藏成功');
            }).fail(function(data){
                $.gohn._showTip('收藏失败');
            });
        }
    }
}(jQuery));

$(function(){
    $.gohn._formSearch(); // 顶部表单搜素显示隐藏
    $.gohn._submenu();
});

/*
 * 提示框
 * state:fail,success,loading,network
 * */
function showToast(state,txt){
    $('.toast').remove();
    $('body').append('<div class="toast"><div class="toast-text"><span class="toast-icon-'+state+'"></span>'+txt+'</div></div>');
    setTimeout(function(){
        $('.toast').fadeOut(function(){
            $(this).remove();
        });
    },1000);
}

var AYR = {};
AYR.Util = {
    isMobile: function(v) {
        return /^[0]?[1][0-9]{10}$/.test(v);
    },
    isYYYYMMDD: function(v) {
        return /^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(v);
    }
};
