/**
 * Created by Yaran Ann on 2015/8/4 0004.
 * 购物车Js
 */
var $J_OrderList = $('#J_OrderList');
var $J_checkAll =  $('#J_checkAll');
var $J_CartList = $('#J_CartList');
/*
 * 自定义模态框
 * */
function myModalHide(){ // 隐藏自定义弹窗
    var $backdrop = $('.modal-backdrop');
    $backdrop.remove();
    $('.modal').removeClass('in');
    setTimeout(function(){
        $('.modal').hide();
    },300);
}
$('[data-dismiss="modal"]').on('click',function(){
    myModalHide()
});
$('body').on('click','.modal-backdrop,.modal',function(){
    myModalHide()
});
$('.modal-dialog').on('click',function(e){
    e.stopPropagation();
});
$J_OrderList.on('click','[data-toggle="modal"]',function(e){
    e.preventDefault();
    var $this = $(this);
    var href    = $this.attr('href');
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')));
    var $triggerType = $this.data('type');
    $('#J_triggerType').val($triggerType);
    $('<div class="modal-backdrop" />').appendTo($(document.body));
    $target.show();
    $('#J_modalContent').load('./choose-sepc-modal.html', {proID: 25}, function() { //加载规格选择页面
        $('.modal-backdrop').toggleClass('in');
        setTimeout(function(){
            $target.toggleClass('in');
        },10);
        /*
         * 初始化iScroll
         * */
        myScroll1 = new IScroll('.scroller-wrapper',{
            probeType: 2,
            mouseWheel: true,
            preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A|I|SPAN)$/ }
        });
        setTimeout(function(){
           myScroll1.refresh(); // 刷新iScroll
        },0)
    });
});

$(function(){
    /*
     * 监听数量输入框
     * */
    $('.J_Amount').on('keyup paste input',function(){
        this.value = ~~this.value.replace(/\D/g,'');
        if (this.value > 1) $(this).siblings('.J_MinusBtn').removeClass('disabled');
        if(this.value == ''|| this.value < 1) this.value = 1;
    });

    /*
     * 增加数量
     * */
    $('.J_PlusBtn').on('click',function(e){
        e.preventDefault();
        var $this = $(this)
            ,$parent = $this.parent()
            ,$input = $parent.find('.J_Amount')
            ,$inputVal = parseInt($input.val())
            ,_Max_Amount = $this.data('maxamount');
        if ($this.hasClass('disabled')) {
            $.gohn._showTip('超出数量范围');
            return false;
        }
        $this.siblings('.J_MinusBtn').removeClass('disabled');
        $input.val($inputVal+1);
        if (parseInt($input.val()) == _Max_Amount) {
            $this.addClass('disabled');
            return false;
        }
    });

    /*
     * 减少数量
     * */
    $('.J_MinusBtn').on('click',function(e){
        e.preventDefault();
        var $this = $(this)
            ,$parent = $this.parent()
            ,$input = $parent.find('.J_Amount')
            ,$inputVal = parseInt($input.val());
        $this.siblings('.J_PlusBtn').removeClass('disabled');
        if ($this.hasClass('disabled')) return false;
        $input.val($inputVal-1);
        if(parseInt($input.val()) == 1){
            $this.addClass('disabled');
            return false;
        }
    });
});

/*
 * 点击编辑按钮修改数量规格
 * */
$J_CartList.on('click','.J_editMeta',function(e){
    e.stopPropagation();
    e.preventDefault();
    var $this = $(this);
    $this.html('完成');
    $this.parents('.sc-list-wrapper').find('ul.sc-list li').addClass('active');
});

/*
 * 点击完成按钮保存信息
 * */
$J_OrderList.on('click','.J_saveItemBtn',function(){
    $(this).parents('li').removeClass('active');
});

/*
 * 点击删除按钮
 * */
$('#J_delItemBtn').on('click',function(){
    if (window.confirm("确定删除所选的商品？")) {
        // 执行删除操作
    }
});

/*
 * icheck选择
 * */
$J_OrderList.on('change','.icheck',function(){
    var _this = $(this);
    if (_this.prop('checked')) {
        _this.parents('li').addClass('selected');
    } else {
        _this.parents('li').removeClass('selected');
    }
    // 计算总价总量
    setTotal();
    if ($J_OrderList.find('li').length == $J_OrderList.find('li.selected').length) {
        $J_checkAll.prop('checked',true);
    } else {
        $J_checkAll.prop('checked',false);
    }
});

/*
 * 购物车全选
 * */
$J_checkAll.on('change',function(){
    var _this = $(this);
    if (_this.prop('checked')) {
        $J_OrderList.find('li').addClass('selected');
        $J_OrderList.find('.icheck:not(:checked)').prop('checked',true);
    } else {
        $J_OrderList.find('li').removeClass('selected');
        $J_OrderList.find('.icheck:checked').prop('checked',false);
    }
    // 计算总价总量
    setTotal();
});

/*
 * 计算总价及总数量
 * */
function setTotal(){
    var moneyTotal = 0, numTotal = 0, freight = 0;
    $J_OrderList.find("li.selected").each(function(){
        var $this = $(this)
            ,numVal = $this.find('.J_itemNum').html();
        if ( numVal > 0) {
            moneyTotal += parseInt(numVal)*parseFloat($(this).find('.J_unitPrice').text());
            numTotal += parseInt(numVal);
        }
    });
    $("#J_moneyTotal").html(moneyTotal.toFixed(2));
    $("#J_numTotal").html(numTotal);
}