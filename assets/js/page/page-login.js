/**
 * Created by Yaran Ann on 2015/11/18 0030.
 */
/*
 * 登陆表单验证
 * */
var $J_submitBtn = $('#J_submitBtn');
$('#myForm').on('submit',function(e){
    e.preventDefault();
    var $form = $(this),
        url = $form.attr('action'),
        dataForm = $form.serialize();

    var _uname = $('#uname').val();
    if ($.trim(_uname) == "") {
        showToast("fail","请输入手机号");
        $('#uname').focus();
        return false;
    }

    if (!AYR.Util.isMobile(_uname)) {
        showToast("fail","手机号格式错误");
        $('#uname').focus();
        return false;
    }

    var _pwd = $('#pwd').val();
    if ($.trim(_pwd) == "") {
        showToast("fail","请输入密码");
        $('#pwd').focus();
        return false;
    }

    $.ajax({
        method: "post",
        url: url,
        data: dataForm,
        dataType: 'json',
        beforeSend: function(){
            $J_submitBtn.html('<img src="../assets/img/loading.svg" width="15" height="15" style="position:relative;top:1px;"> 正在登陆...');
            $J_submitBtn[0].disabled = true;
        }
    }).done(function(data){
        if (data.stateCode == 0) {
            saveUserInfo(); // 记住密码
            showToast("success","登陆成功");
            //   window.location.href = "index.html";
        } else if (data.state == 1) {
            showToast("fail","手机号不存在");
        } else {
            showToast("fail","密码错误");
        }
    }).fail(function(){
        showToast("fail","请求失败");
    }).always(function(){
        $J_submitBtn.html('登 陆');
        $J_submitBtn[0].disabled = false;
    });
});

//初始化页面时验证是否记住了密码
$(document).ready(function() {
    if ($.cookie("rmbUser") == "true") {
        $("#rmbUser").attr("checked", true);
        $("#uname").val($.cookie("userName"));
        $("#pwd").val($.cookie("passWord"));
    }
});
//保存用户信息
function saveUserInfo() {
    if ($("#rmbUser")[0].checked) {
        var userName = $("#uname").val();
        var passWord = $("#pwd").val();
        $.cookie("rmbUser", "true", { expires: 7 }); // 存储一个带7天期限的 cookie
        $.cookie("userName", userName, { expires: 7 }); // 存储一个带7天期限的 cookie
        $.cookie("passWord", passWord, { expires: 7 }); // 存储一个带7天期限的 cookie
    }
    else {
        $.cookie("rmbUser", "false", { expires: -1 });
        $.cookie("userName", '', { expires: -1 });
        $.cookie("passWord", '', { expires: -1 });
    }
}