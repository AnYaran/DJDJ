$(function(){
    $('[data-dismiss="modal"]').on('click',function(){
        myModalHide()
    });

    var  $J_SpecGroupOuter =  $('#J_SpecGroupOuter');
    var  $J_SelectedSpec = $('#J_SelectedSpec');
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

