/**
 * Created by Yaran Ann on 2015/7/30 0030.
 */
/*
 * 修改密码表单验证
 * */
$('#myForm').on('click','#J_submitBtn',function(){
    var _this = $(this);

    var _curpwd = $('#curpwd').val();
    if ($.trim(_curpwd) == "") {
        $.gohn._showTip("请输入当前密码");
        $('#curpwd').focus();
        return false;
    }

    $.ajax({
        method: "post",
        url: "../assets/ajax/data-checkpwd.json",
        data: {curpwd: _curpwd},
        dataType: "json"
    }).done(function(data){
        if (data.stateCode == 1) {
            $.gohn._showTip('当前密码错误');
            return false;
        }
    });

    var _newpwd = $('#newpwd').val();
    if ($.trim(_newpwd) == "") {
        $.gohn._showTip("请输入新密码");
        $('#newpwd').focus();
        return false;
    }

    if (!$.utils._minlength(_newpwd,6) || !$.utils._maxlength(_newpwd,20)) {
        $.gohn._showTip("密码长度至少6位最多20位");
        $('#newpwd').focus();
        return false;
    }

    var _newpwd1 = $('#newpwd1').val();
    if ($.trim(_newpwd1) == "") {
        $.gohn._showTip("请输入确认密码");
        $('#newpwd1').focus();
        return false;
    }

    if (_newpwd != _newpwd1) {
        $.gohn._showTip("两次密码不一致");
        $('#newpwd1').focus();
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
            $.gohn._showTip("修改成功");
            window.location.href = "index.html";
        } else {
            $.gohn._showTip("修改失败");
        }
    }).fail(function(){
        $.gohn._showTip("请求失败");
    }).always(function(){
        _this.html('确认');
        _this[0].disabled = false;
    });
});
