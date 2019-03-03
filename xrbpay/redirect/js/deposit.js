var recharge = "/member/payment/recharge";
var transfer = "/member/center/transfer";
var transtips = "/member/center/transtips";
var transconfirm = "/member/payment/transconfirm";
var atmconfirm = "/member/payment/atmconfirm";
var atmtips = "/member/center/atmtips";
var safetips = "/member/center/safetips";
var autoRecharge = "/member/payment/autorecharge";
if (typeof window.IS_MOBILE !== "undefined") {
    recharge = "/mobile/member/payment/recharge";
    transfer = "#/payment/transfer";
    transtips = "#/payment/deposit/transtips/";
    transconfirm = "#/member/payment/transconfirm";
    atmconfirm = "#/member/payment/atmconfirm";
    atmtips = "#/payment/deposit/atmtips/";
    safetips = "#/payment/deposit/safetips/"
}
$(function() {
    $(".banklist,.banklist2").click(function() {
        $(this).find("input:radio").prop("checked", true)
    });
    $(".tab").click(function() {
        var a = $(this).attr("id");
        $(".subcontent").css("display", "none");
        $(".tab").removeClass("tabactive");
        $("#subpage" + a).css("display", "block");
        $(this).addClass("tabactive")
    });
    $("#copy_chkcode").val(Math.floor((Math.random() * 1000000) % 800000) + 100000)
});
function formSubmit(d, c, b) {
    var a = "/trans";
    if (d) {
        a = "http://" + d
    }
    a += "/redirect";
    return confirmTransaction(a, c, b)
}
function validateTransaction(d, c) {
    d = $(d);
    var a = d.closest(".subcontent");
    var b = apiAmount(a);
    var e = apiPayId(a);
    if (b && e) {
        setTimeout(function() {
            closeTabBackToTransfer()
        },
        10);
        return true
    } else {
        return false
    }
}
function doDeposit(b, a) {
    b = $(b);
    if (a == -1) {
        return apiDeposit(b)
    } else {
        if (a == 0) {
            return zfbDeposit(b)
        } else {
            if (a == 1) {
                return atmDeposit(b)
            }
        }
    }
}
function apiDeposit(c) {
    var a = c.closest(".subcontent");
    var b = apiAmount(a);
    var d = apiPayId(a);
    if (b && d) {
        if (typeof window.IS_MOBILE !== "undefined") {
            window.location.href = transtips + b
        } else {
            dialog.url("订单信息", 334, 270, transtips + "?amount=" + b)
        }
    }
}
function apiAmount(a) {
    var b = Number(a.find("input[name=amount]").val());
    if (isNaN(b) || b <= 0 || b < MIN_AMOUNT) {
        if (typeof window.IS_MOBILE !== "undefined") {
            alert("充值金额最少为" + Math.max(MIN_AMOUNT, 1) + "元")
        } else {
            dialog.error("错误", "充值金额最少为" + Math.max(MIN_AMOUNT, 1) + "元")
        }
        return false
    } else {
        return b
    }
}
function apiPayId(a) {
    var b;
    if (typeof window.IS_MOBILE !== "undefined") {
        b = a.find("select").val()
    } else {
        b = a.find("input:radio:checked").val()
    }
    if (b == undefined) {
        dialog.error("错误", "请选择银行种类！");
        return false
    } else {
        return b
    }
}
function atmDeposit(a) {
    var b;
    if (typeof window.IS_MOBILE !== "undefined") {
        b = a.closest(".subcontent").find("select").val()
    } else {
        b = a.closest(".subcontent").find("input:radio:checked").val()
    }
    if (b == undefined) {
        dialog.error("消息", "请选择银行种类！");
        return
    }
    if (typeof window.IS_MOBILE !== "undefined") {
        window.location.href = atmtips + b
    } else {
        dialog.url("订单提交", 564, 457, atmtips + "?cardid=" + b)
    }
}
function zfbDeposit(a) {
    var b;
    if (typeof window.IS_MOBILE !== "undefined") {
        b = a.closest(".subcontent").find("select").val()
    } else {
        b = a.closest(".subcontent").find("input:radio:checked").val()
    }
    if (b == undefined) {
        dialog.error("消息", "请选择银行种类！");
        return
    }
    if (typeof window.IS_MOBILE !== "undefined") {
        window.location.href = safetips + b
    } else {
        dialog.url("订单提交", 564, 437, safetips + "?cardid=" + b)
    }
}
function isNumber(b) {
    b = (b) ? b: window.event;
    var a = (b.which) ? b.which: b.keyCode;
    if (a > 31 && (a < 46 || a > 57)) {
        return false
    }
    return true
}
function validation(a) {
    var b = $("#subpage" + a + " #amount" + a).val();
    if (b == "") {
        $("#subpage" + a + " .validation").fadeIn(200);
        $("#btnSubmit" + a).css("display", "block");
        $("#btnDeposit" + a).css("display", "none")
    } else {
        if (b >= MIN_AMOUNT) {
            $("#subpage" + a + " .validation").fadeOut(200);
            $("#btnSubmit" + a).css("display", "none");
            $("#btnDeposit" + a).css("display", "block")
        } else {
            $("#subpage" + a + " .validation").fadeIn(200);
            $("#btnSubmit" + a).css("display", "block");
            $("#btnDeposit" + a).css("display", "none")
        }
    }
}
var intDiff = parseInt(1200);
function timer(a) {
    if (window.timerVar) {
        clearTimeout(timerVar)
    }
    timerVar = window.setInterval(function() {
        var c = 0,
        b = 0,
        e = 0,
        d = 0;
        if (a > 0) {
            c = Math.floor(a / (60 * 60 * 24));
            b = Math.floor(a / (60 * 60)) - (c * 24);
            e = Math.floor(a / 60) - (c * 24 * 60) - (b * 60);
            d = Math.floor(a) - (c * 24 * 60 * 60) - (b * 60 * 60) - (e * 60)
        }
        if (e <= 9) {
            e = "0" + e
        }
        if (d <= 9) {
            d = "0" + d
        }
        $("#time_show").html("<s></s>" + e + ":<s></s>" + d);
        a--
    },
    1000)
}
$(function() {
    timer(intDiff)
});
function getQueryString(a) {
    var b = new RegExp("(^|&)" + a + "=([^&]*)(&|$)", "i");
    var c = window.location.search.substr(1).match(b);
    if (c != null) {
        return unescape(c[2])
    }
    return null
}
function goFrameUrl(a) {
    window.parent.document.getElementById("frame").src = a
}
function alertAdmin(d) {
    var b = $("#amount").val();
    if (b == "") {
        if (typeof window.IS_MOBILE !== "undefined") {
            alert("存款金额不能为空！")
        } else {
            dialog.error("消息", "存款金额不能为空！")
        }
        return
    }
    var e = $(".post-info").find("input").vals();
    if (e == "") {
        if (typeof window.IS_MOBILE !== "undefined") {
            alert("存款金额不能为空！")
        } else {
            dialog.error("消息", "存款信息不能为空！")
        }
        return
    }
    var c = $("#copy_cardid").val();
    if (c == "") {
        if (typeof window.IS_MOBILE !== "undefined") {
            alert("存款金额不能为空！")
        } else {
            dialog.error("消息", "转入帐号不能为空！")
        }
        return
    }
    var a = $("#copy_chkcode").val();
    processRecharge(d, b, c, a, e)
}
function alertAdmin3party(f) {
    var c = $("#amount").val();
    if (c == "") {
        if (typeof window.IS_MOBILE !== "undefined") {
            alert("存款金额不能为空！")
        } else {
            dialog.error("消息", "存款金额不能为空！")
        }
        return
    }
    var b = $("#cardId").val();
    if (b != "") {
        if (typeof window.IS_MOBILE !== "undefined") {
            var d = new RegExp("^[0-9]*$");
            if (b.length != 4 || !d.test(b)) {
                dialog.error("消息", "商品号后4位错误！");
                return false
            }
        } else {
            var d = new RegExp("^[0-9]*$");
            if (b.length != 4 || !d.test(b)) {
                dialog.error("消息", "商品号后4位错误！");
                return false
            }
        }
    } else {
        dialog.error("消息", "商品号后4位不能为空！");
        return false
    }
    var g = $(".post-info").find("input").vals();
    if (g == "") {
        if (typeof window.IS_MOBILE !== "undefined") {
            alert("存款金额不能为空！")
        } else {
            dialog.error("消息", "存款信息不能为空！")
        }
        return
    }
    var e = $("#copy_cardid").val();
    if (e == "") {
        if (typeof window.IS_MOBILE !== "undefined") {
            alert("存款金额不能为空！")
        } else {
            dialog.error("消息", "转入帐号不能为空！")
        }
        return
    }
    var a = $("#copy_chkcode").val();
    processRecharge(f, c, e, a, g)
}
function submitTransConfirm(a, d) {
    var c = parent.window;
    var b = document.getElementById("t_confirm");
    b.target = "_blank";
    b.action = d;
    b.submit();
    setTimeout(function() {
        closeTabBackToTransfer()
    },
    10)
}
function submitAtmConfirm(e) {
    var c = parent.window;
    var b = $("input[name='amount']").val();
    var d = $("input[name='cardId']").val();
    var a = $("input[name='check']").val();
    var f = $("input[name='infos']").val().split(",");
    processRecharge(e, b, d, a, f)
}
function processRecharge(d, b, c, a, e) {
    $(d).attr("disabled", "disabled");
    $(d).val("提交中，请等待...");
    $.post(recharge, {
        amount: b,
        cardid: c,
        check: a,
        payInfo: JSON.stringify(e)
    },
    function(f) {
        if (f.success) {
            alert("存款信息提交成功，等待客服审核！");
            if (typeof window.IS_MOBILE !== "undefined") {
                //window.parent.location.href = transfer
            } else {
                closeTabBackToTransfer()
            }
            return
        } else {
            alert(f.message)
        }
        $(d).removeAttr("disabled");
        $(d).val("提交订单")
    })
}
function cancelTrans(a, b) {
    $(a).attr("disabled", "disabled");
    $(a).val("提交中，请等待...");
    $.post("/member/payment/cancelTrans", {
        transId: b
    },
    function(c) {
        if (c.success) {
            if (!confirm("取消成功啦！，是否前往订单列表？")) {
                $(a).removeAttr("disabled");
                $(a).val("取消订单");
                return
            }
            closeTabBackToTransfer()
        } else {
            dialog.error("消息", "提交失败，请联系客服！")
        }
        $(a).removeAttr("disabled");
        $(a).val("取消订单")
    })
}
function showPayInfoDialog(d, e) {
    var a = ["存款人", "存款账号", "存款时间"];
    var c = '<div class="payconfirm">';
    for (var b = 0; b < a.length; b++) {
        c += "<p><label>" + a[b] + "：</label><input /></p>"
    }
    c += "</div>";
    dialog.info("支付确认信息", c, {
        "确定": function() {
            var f = $(this).find("input").vals();
            $.post("/member/payment/alertAdmin", {
                transId: d,
                payInfo: JSON.stringify(f)
            },
            function(g) {
                if (g.success) {
                    dialog.close();
                    closeTabBackToTransfer()
                } else {
                    dialog.error("消息", "确认失败，请联系客服！")
                }
            })
        },
        "取消": function() {
            dialog.close()
        }
    })
}
function autoCharge(e) {
    var a = $("#amount").val();
    var d = $("#userName").val();
    var c = $("#cardId").val();
    if (a == "") {
        if (typeof window.IS_MOBILE !== "undefined") {
            alert("存款金额不能为空！")
        } else {
            dialog.error("消息", "存款金额不能为空！")
        }
        return
    }
    if (d == "") {
        if (typeof window.IS_MOBILE !== "undefined") {
            alert("用户姓名不能为空！")
        } else {
            dialog.error("消息", "用户姓名不能为空！")
        }
        return
    }
    if (c == "") {
        if (typeof window.IS_MOBILE !== "undefined") {
            alert("用户卡号不能为空！")
        } else {
            dialog.error("消息", "用户卡号不能为空！")
        }
        return
    }
    var f = $(".post-info").find("input").vals();
    if (f == "") {
        if (typeof window.IS_MOBILE !== "undefined") {
            alert("存款金额不能为空！")
        } else {
            dialog.error("消息", "存款信息不能为空！")
        }
        return
    }
    var b = $("#copy_cardid").val();
    if (b == "") {
        if (typeof window.IS_MOBILE !== "undefined") {
            alert("存款金额不能为空！")
        } else {
            dialog.error("消息", "转入帐号不能为空！")
        }
        return
    }
    $(e).attr("disabled", "disabled");
    $(e).val("提交中，请等待...");
    $.post(autoRecharge, {
        amount: a,
        cardid: b,
        check: $("#copy_chkcode").val(),
        payInfo: JSON.stringify(f)
    },
    function(g) {
        if (g.success) {
            alert("存款信息提交成功，请您尽快支付，以便订单及时处理！！");
            $(".manual").show();
            $(".auto").hide();
            return
        } else {
            if (typeof window.IS_MOBILE !== "undefined") {
                alert(g.message)
            } else {
                dialog.error("消息", g.message)
            }
        }
        $(e).removeAttr("disabled");
        $(e).val("提交订单")
    })
}
function confirmTransaction(b, c, i) {
    c = $(c);
    var a = c.closest(".subcontent");
    var f = a.find("input[name=pid]").val();
    var e = apiAmount(a);
    var g = apiPayId(a);
    var h = a.find("input[name=uid]").val();
    if (e && g) {
        var d = transconfirm + "?amount=" + e + "&uid=" + h + "&pid=" + f + "&payId=" + g + "&payUrl=" + b;
        if (typeof window.IS_MOBILE !== "undefined") {
            window.location.href = transtips + e
        } else {
            dialog.url("存款信息", 334, 220, d)
        }
        return false
    }
    return false
}
function confirmAtm(f) {
    var b = $("#amount").val();
    if (b == "") {
        if (typeof window.IS_MOBILE !== "undefined") {
            alert("存款金额不能为空！")
        } else {
            dialog.error("消息", "存款金额不能为空！")
        }
        return
    }
    var g = $(".post-info").find("input").vals();
    if (g == "") {
        if (typeof window.IS_MOBILE !== "undefined") {
            alert("存款金额不能为空！")
        } else {
            dialog.error("消息", "存款信息不能为空！")
        }
        return
    }
    var c = $("#copy_cardid").val();
    if (c == "") {
        if (typeof window.IS_MOBILE !== "undefined") {
            alert("存款金额不能为空！")
        } else {
            dialog.error("消息", "转入帐号不能为空！")
        }
        return
    }
    var a = $("#copy_chkcode").val();
    var e = $("#copy_username").val();
    var d = atmconfirm + "?amount=" + b + "&cardId=" + c + "&check=" + a + "&userName=" + e + "&infos=" + g;
    if (typeof window.IS_MOBILE !== "undefined") {
        window.location.href = transtips + b
    } else {
        dialog.url("存款信息", 334, 220, d)
    }
}
function showTranstips(a) {
    var b = parent.window;
    if (typeof b.IS_MOBILE !== "undefined") {
        b.location.href = transtips + a
    } else {
        b.$("#paneliframe").dialog("close");
        b.dialog.url("订单信息", 334, 270, transtips + "?amount=" + a)
    }
}
function closeThis() {
    parent.window.$("#paneliframe").dialog("close")
}
function closeTabBackToTransfer() {
//    var a = window.top;
//    a.open(transfer, "frame");
//    a.close()
};