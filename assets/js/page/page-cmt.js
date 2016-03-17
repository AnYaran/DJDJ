/**
 * Created by Yaran Ann on 2015/8/5 0005.
 * 评论页面JS
 */

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

var _CMT_Data = [];
function validForm(){
    var i = 0;
    $J_cmtContent.each(function () {
        if ($(this).val() == "") {
            i++;
        }
    });
    if (i == $J_cmtContent.length) {
        $.gohn._showTip('亲，请至少输入一项评价内容');
        return false;
    }
    $J_cmtItem.each(function(){
        var $this = $(this)
            ,$proId = $this.data('proid')
            ,$J_cmtContentVal = $this.find('.J_cmtContent').val()
            ,$J_iScoreVal = $this.find('.J_iScore').val();
        _CMT_Data.push({"proid":$proId,"cmtContent":$J_cmtContentVal,"iScrore":$J_iScoreVal});
    });

    $.ajax({
        method: "post",
        url: "../assets/ajax/data-login.json",
        data: {cmtData:_CMT_Data},
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
        $J_submitBtn.html('提交评价');
        $J_submitBtn[0].disabled = false;
    });
}

