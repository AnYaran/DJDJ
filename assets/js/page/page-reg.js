/**
 * Created by Yaran Ann on 2015/7/30 0030.
 */
/*
 * 注册表单验证
 * */
$('#myForm').on('click','#J_submitBtn',function(){
    var _this = $(this);
    var _tel = $('#tel').val();
    if ($.trim(_tel) == "") {
        $.gohn._showTip("请输入手机号");
        $('#tel').focus();
        return false;
    }

    if (!($.utils._regPhone(_tel))) {
        $.gohn._showTip("请输入正确的手机号码")
        $("#tel").focus();
        return false;
    }

    var _vcode = $('#vcode').val();
    if ($.trim(_vcode) == "") {
        $.gohn._showTip("请输入验证码");
        $('#vcode').focus();
        return false;
    }

    $.ajax({
        method: "post",
        url: "../assets/ajax/data-checkvcode.json",
        data: {vcode: _vcode},
        dataType: "json"
    }).done(function(data){
        if (data.stateCode == 1) {
            $.gohn._showTip('验证码错误');
            return false;
        }
    });

    var _pwd = $('#pwd').val();
    if ($.trim(_pwd) == "") {
        $.gohn._showTip("请输入密码");
        $('#pwd').focus();
        return false;
    }

    if (!$.utils._minlength(_pwd,6) || !$.utils._maxlength(_pwd,20)) {
        $.gohn._showTip("密码长度至少6位最多20位");
        $('#pwd').focus();
        return false;
    }

    var _pwd1 = $('#pwd1').val();
    if ($.trim(_pwd1) == "") {
        $.gohn._showTip("请输入确认密码");
        $('#pwd1').focus();
        return false;
    }

    if (_pwd != _pwd1) {
        $.gohn._showTip("两次密码不一致");
        $('#pwd1').focus();
        return false;
    }
    var _uname = $('#uname').val();
    if ($.trim(_uname) == "") {
        $.gohn._showTip("请输入用户名");
        $('#uname').focus();
        return false;
    }

    var _agree = $('#agree').prop('checked');
    if (!_agree) {
        $.gohn._showTip("请勾选阅读并同意服务协议");
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
            $.gohn._showTip("注册成功");
            window.location.href = "index.html";
        } else if (data.state == 1) {
            $.gohn._showTip("该手机号已注册");
        } else {
            $.gohn._showTip("该用户名已存在");
        }
    }).fail(function(){
        $.gohn._showTip("请求失败");
    }).always(function(){
        _this.html('注 册');
        _this[0].disabled = false;
    });
});


/*
* 发送手机验证码
* */
$('#J_sendSms').click(function(){
    var count = 10;
    var _this = $(this);
    _this.attr('disabled',true).html('重新发送('+count+')');
    var t = setInterval(function(){
        if (count < 1) {
            clearInterval(t);
            _this.attr('disabled',false).html('重新发送');
        }else {
            _this.html('重新发送('+count--+')')
        }
    },1000);
});