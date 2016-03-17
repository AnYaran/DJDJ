$(function(){
    /*
     * 取消订单
     * */
    $('.J_cancelOrderBtn').on('click',function(){
        var $this = $(this)
            ,$orderID = $this.parents('.order-view').data('orderid');
        if (window.confirm("确认取消该订单吗？")) {
            // 异步删除订单操作
            $.ajax({
                method: "POST",
                url: "../assets/ajax/data-login.json",
                data: {orderID:$orderID},
                dataType: "json",
                beforeSend: function(){
                    $this.html('正在取消');
                    $this[0].disabled = true;
                }
            }).done(function(){
                $.gohn._showTip('订单取消成功');
                setTimeout(function(){
                    window.location.reload();
                },1000);
            }).fail(function(){
                $.gohn._showTip('请求失败');
            }).always(function(){
                $this.html('取消订单');
                $this[0].disabled = false;
            });

        }
    });
});