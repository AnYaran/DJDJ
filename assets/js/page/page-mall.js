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

/*
* 查看更多评论
* */
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

/*
 * 初始化iScroll
 * */
myScroll1 = new IScroll('.scroller-wrapper',{
    probeType: 2,
    mouseWheel: true,
    preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A|I|SPAN)$/ }
});


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
$('[data-toggle="modal"]').on('click',function(e){
    e.preventDefault();
    var $this = $(this);
    var href    = $this.attr('href');
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, '')));
    var $triggerType = $this.data('type');
    $('#J_triggerType').val($triggerType);
    $('<div class="modal-backdrop" />').appendTo($(document.body));
    $target.show();
    $('.modal-backdrop').toggleClass('in');
    setTimeout(function(){
        $target.toggleClass('in');
    },10);
    setTimeout(function(){
        myScroll1.refresh(); // 刷新iScroll
    },0)
});

$(function(){
    var _Max_Amount = 10; // 购买最大数量限制

    var  $J_SpecGroupOuter =  $('#J_SpecGroupOuter');
    var $J_SelectedSpec = $('#J_SelectedSpec');

    /*
     * 选择规格效果切换
     * */
    $J_SpecGroupOuter.on('click','i',function(){
        var $this = $(this);
        if ($this.hasClass('disabled')) return false;
        $this.toggleClass('sel').siblings().removeClass('sel');

        if ($this.hasClass('sel')) { // 设置该规格是否已选变量
            $this.parents('.J_SpecGroup').attr('data-sel',"true");
        } else {
            $this.parents('.J_SpecGroup').attr('data-sel',"false");
        }
        resetSelectedSpec(); // 重置已选规格
        specUnExistDisabled(); // 不存在的规格设为disabled
    });

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
            ,$inputVal = parseInt($input.val());
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


    /*
     * 初始化价格及库存 -- 赋值
     * */
    $('#J_ItemPrice').html(_DATA_Detail.detail.defaultItemPrice);
    $('#J_ItemStock').html(_DATA_Detail.detail.ItemQuantity);

    /*
     * 初始化规格列表
     * */
    var Spec_Html = '';
    var Selected_Spec_Title_Arr = [];
    function initSpecList(){
        $.each(_DATA_Detail.valItemInfo.skuName,function(index,item){
            Spec_Html += '<div id="J_SpecGroup_'+item.id+'" class="J_SpecGroup spec-item" data-sel=false>';
            Spec_Html += '<h3 class="spec-title">'+item.text+'</h3>';
            Spec_Html += '<p class="spec-list">';
            var Spec_List = '';
            $.each( item.values,function(index1,item1){
                Spec_List+='<i data-id="'+item.id+':'+item1.id+'">'+item1.text+'</i>';
            });
            Spec_Html +=Spec_List+'</p>'+'</div>';

            Selected_Spec_Title_Arr[index] = item.text;
        });
        $J_SpecGroupOuter.html(Spec_Html);
    }
    initSpecList();


    /*
     * 初始化已选规格参数
     * */
    $J_SelectedSpec.html('请选择 '+Selected_Spec_Title_Arr.join());

    /*
     * 重置已选规格参数
     * */
    function resetSelectedSpec(){
        var Unselected_Spec_Title_Arr = [];
        var Selected_Spec_Val_Arr = [];
        var Selected_Spec_Dataid_Arr = [];
        $('.J_SpecGroup').each(function(){
            var $this = $(this)
                ,$index = $this.index()
                ,isSel = $this.attr('data-sel')
                ,selSpecTxt = $this.find('.spec-title').html();
            if (isSel == "false") {
                Unselected_Spec_Title_Arr.push(selSpecTxt);
            }
        });
        if (Unselected_Spec_Title_Arr.length == 0) { // 如果全部选择
            $('.sel').each(function(){
                var $this = $(this)
                    ,$selSpecTxt =  $this.html()
                    ,$dataId = $this.data('id');
                Selected_Spec_Val_Arr.push('"'+$selSpecTxt+'"');
                Selected_Spec_Dataid_Arr.push($dataId);
            });
            $J_SelectedSpec.html(Selected_Spec_Val_Arr.join());
            $('#J_specListInput').val(Selected_Spec_Dataid_Arr);
            syncItemInfo(Selected_Spec_Dataid_Arr); // 同步产品价格库存
        } else { // 如果未全部选择
            $J_SelectedSpec.html('请选择 '+Unselected_Spec_Title_Arr.join());

            $('#J_ItemPrice').html(_DATA_Detail.detail.defaultItemPrice);
            $('#J_ItemStock').html(_DATA_Detail.detail.ItemQuantity);
        }
    }

    /*
     * 同步产品价格库存
     * */
    function syncItemInfo(Selected_Spec_Val_Arr){
        var _Spec_String = ';'+Selected_Spec_Val_Arr.join(';')+';';
        // 判断当前组合是否存在 ， 如果存在给库存和价格赋值
        if (_Spec_String in _DATA_Detail.valItemInfo.skuMap) {
            $('#J_ItemStock').html(_DATA_Detail.valItemInfo.skuMap[_Spec_String].stock);
            $('#J_ItemPrice').html(_DATA_Detail.valItemInfo.skuMap[_Spec_String].price);
        }
    }

    /*
     * 不存在的规格设为disabled
     * */
    function specUnExistDisabled(){
        if ($J_SpecGroupOuter.find('i.sel').length == 0) {
            $('.J_SpecGroup i.disabled').each(function(){
                $(this).removeClass('disabled');
            });
        } else {
            $J_SpecGroupOuter.find('i.sel').each(function(){
                var $this = $(this);
                var _selId = $this.data('id');
                $this.parents('.J_SpecGroup').siblings('.J_SpecGroup').find('i').not('.sel').each(function(){
                    var _this = $(this);
                    var curIndexVal = _this.data('id');
                    var i = 0,j = 0,k = 0;

                    $.each(_DATA_Detail.valItemInfo.skuMap,function(index,item) {
                        if (index.indexOf(_selId) > -1 && index.indexOf(curIndexVal) > -1) {
                            i++;
                            if (item.stock == 0) j++;
                        } else {
                            k++;
                        }
                    });
                    if ( k == _DATA_Detail.valItemInfo.skuMap.length || j==i) {
                        _this.addClass('disabled');
                    } else {
                        _this.removeClass('disabled');
                    }
                });
            });
        }
    }

    /*
     * 点击确定
     * */
    $('#J_submitBtn').on('click',function(){
        var $J_specListInputVal = $('#J_specListInput').val();  // 规格ID串
        var $J_triggerType = $('#J_triggerType').val();
        if ($J_specListInputVal == '') {
            $.gohn._showTip('请选择产品属性');
        } else {
            console.log($J_specListInputVal);
            if ($J_triggerType == 'cart') {
                $.gohn._showTip('已成功加入购物车');
                myModalHide();
            } else if ($J_triggerType == 'buy') {
                window.location.href = "order-center.html";
            }
        }
    });

})

