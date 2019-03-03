﻿<?php
/*
===============================================================================
接收卡类支付下行数据

orderid	上行过程中传入的orderid
opstate	操作结果状态。
	0 卡被成功使用
	-1 卡号密码错误
	-2 卡实际面值和提交时面值不符，卡内实际面值未使用。卡实际面值由ovalue表示
	-3 卡实际面值和提交时面值不符，卡内实际面值已被使用。卡实际面值由ovalue表示
	-4 卡已经使用（卡在提交到爱扬联盟之前已经被使用）
	-5 失败(网络原因、具体原因不明确等)

ovalue	opstate=-2或者-3时表示的值，单位元(注：现只提供正确的骏网卡实际面值，
	其他卡值为0或者无效。为了精确性，该值可能带有4位小数)

sysorderid
	爱扬支付接口v2.6版本新增
	此次卡消耗过程中爱扬系统的订单Id。为保持和以前版本兼容，该值不加入返回结果签名验证。

completiontime
	爱扬支付接口v2.6版本新增
	此次卡消耗过程中爱扬系统的订单结束时间。格式为年/月/日 时：分：秒，如2010/04/05 21:50:58。
	为保持和以前版本兼容，该值不加入返回结果签名验证。

================================================================================
*/
header('Content-Type:text/html;charset=GB2312');
require_once("../config/pay_config.php");
require_once("../aiyang/class.aiyangpay.php");

//接收返回的下行参数
$orderid        = trim($_GET['orderid']);
$opstate        = trim($_GET['opstate']);
$ovalue         = trim($_GET['ovalue']);
$sysorderid		= trim($_GET['sysorderid']);
$completiontime		= trim($_GET['completiontime']);

//进行爱扬签名认证
$aiyangpay	= new aiyangpay();
$aiyangpay->key	= $aiyang_merchant_key;
$aiyangpay->recive();

//////////////////////////////////////////////////////////////////////////
// 进入到这一步，说明签名已经验证成功，
// 你可以在这里加入自己的代码, 例如：可以将处理结果存入数据库




//////////////////////////////////////////////////////////////////////////
//完成之后返回成功
/*
	协议:
	0 成功
	-1 请求参数无效
	-2 签名错误
*/
die("opstate=0");
?>