/**
 * Created by Yaran Ann on 2015/8/3 0003.
 * 个人中心 -- 个人资料页面JS
 */
/*
 * select 下拉框
 * */
$('#sex').on('click',function(){
    $(this).siblings('span.select-val').html($(this).val());
});


/*
* 保存个人资料
* */
$('#J_submitBtn').on('click',function(e){
    e.preventDefault();
    var _this = $(this);

    var _uname = $('#uname').val();
    if ($.trim(_uname) == "") {
        $.gohn._showTip("请输入用户名");
        $('#uname').focus();
        return false;
    }

    var _phone = $('#phone').val();
    if ($.trim(_phone) == "") {
        $.gohn._showTip("请输入您的手机号");
        $('#phone').focus();
        return false;
    }

    if (!($.utils._regPhone(_phone))) {
        $.gohn._showTip("请输入正确的手机号码");
        $("#phone").focus();
        return false;
    }

    var _email = $('#email').val();
    if ($.trim(_email) == "") {
        $.gohn._showTip("请输入邮箱");
        $('#email').focus();
        return false;
    }

    if (!($.utils._isEmail(_email))) {
        $.gohn._showTip("请输入正确的邮箱");
        $("#email").focus();
        return false;
    }

    $.ajax({
        method: "post",
        url: "../assets/ajax/data-login.json",
        data: $('#myForm').serialize(),
        dataType: 'json',
        beforeSend: function(){
            _this.html('<img src="../assets/img/loading.svg" width="15" height="15" style="vertical-align: top;"> 正在保存...');
            _this[0].disabled = true;
        }
    }).done(function(data){
        if (data.stateCode == 0) {
            $.gohn._showTip("保存成功");
            window.location.href = "index.html";
        } else if (data.state == 1) {
            $.gohn._showTip("该手机号已注册");
        } else {
            $.gohn._showTip("该用户名已存在");
        }
    }).fail(function(){
        $.gohn._showTip("请求失败");
    }).always(function(){
        _this.html('保存');
        _this[0].disabled = false;
    });
});