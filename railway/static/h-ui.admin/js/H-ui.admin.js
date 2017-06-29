/* -----------H-ui前端框架-------------
* H-ui.admin.js v2.4
* http://www.h-ui.net/
* Created & Modified by guojunhui
* Date modified 15:42 2016.03.14
*
* Copyright 2013-2016 北京颖杰联创科技有限公司 All rights reserved.
* Licensed under MIT license.
* http://opensource.org/licenses/MIT
*
*/
var num=0,oUl=$("#min_title_list"),hide_nav=$("#Hui-tabNav");


$.ajaxSetup({
	statusCode: {
		401: function () {
			alert('登录超时，请重新登录！');
			top.location.href = "/login.html";
		},
		403:function(){
            alert('没有访问权限！');

		}
	}
});
/*获取顶部选项卡总长度*/
function tabNavallwidth(){
	var taballwidth=0,
		$tabNav = hide_nav.find(".acrossTab"),
		$tabNavWp = hide_nav.find(".Hui-tabNav-wp"),
		$tabNavitem = hide_nav.find(".acrossTab li"),
		$tabNavmore =hide_nav.find(".Hui-tabNav-more");
	if (!$tabNav[0]){return}
	$tabNavitem.each(function(index, element) {
        taballwidth+=Number(parseFloat($(this).width()+60))
    });
	$tabNav.width(taballwidth+25);
	var w = $tabNavWp.width();
	if(taballwidth+25>w){
		$tabNavmore.show()}
	else{
		$tabNavmore.hide();
		$tabNav.css({left:0})
	}
}

/*左侧菜单响应式*/
function Huiasidedisplay(){
	if($(window).width()>=768){
		$(".Hui-aside").show()
	}
}
function getskincookie(){
	var v = getCookie("Huiskin");
	var hrefStr=$("#skin").attr("href");
	if(v==null||v==""){
		v="default";
	}
	if(hrefStr!=undefined){
		var hrefRes=hrefStr.substring(0,hrefStr.lastIndexOf('skin/'))+'skin/'+v+'/skin.css';
		$("#skin").attr("href",hrefRes);
	}
}
function Hui_admin_tab(obj){
	if($(obj).attr('_href')){
		var bStop=false;
		var bStopIndex=0;
		var _href=$(obj).attr('_href');
		var _titleName=$(obj).attr("data-title");
		var topWindow=$(window.parent.document);
		var show_navLi=topWindow.find("#min_title_list li");
		show_navLi.each(function() {
			if($(this).find('span').attr("data-href")==_href){
				bStop=true;
				bStopIndex=show_navLi.index($(this));
				return false;
			}
		});
		if(!bStop){
			creatIframe(_href,_titleName);
			min_titleList();
		}
		else{
			show_navLi.removeClass("active").eq(bStopIndex).addClass("active");
			var iframe_box=topWindow.find("#iframe_box");
			iframe_box.find(".show_iframe").hide().eq(bStopIndex).show().find("iframe").attr("src",_href);
		}
	}

}
function min_titleList(){
	var topWindow=$(window.parent.document);
	var show_nav=topWindow.find("#min_title_list");
	var aLi=show_nav.find("li");
}
function creatIframe(href,titleName){
	var topWindow=$(window.parent.document);
	var show_nav=topWindow.find('#min_title_list');
	//show_nav.find('li').removeClass("active");
	var iframe_box=topWindow.find('#iframe_box');
	show_nav.find('li').html('<span data-href="'+href+'">'+titleName+'</span><em></em>');
	var taballwidth=0,
		$tabNav = topWindow.find(".acrossTab"),
		$tabNavWp = topWindow.find(".Hui-tabNav-wp"),
		$tabNavitem = topWindow.find(".acrossTab li"),
		$tabNavmore =topWindow.find(".Hui-tabNav-more");
	if (!$tabNav[0]){return}
	$tabNavitem.each(function(index, element) {
        taballwidth+=Number(parseFloat($(this).width()+60))
    });
	$tabNav.width(taballwidth+25);
	var w = $tabNavWp.width();
	if(taballwidth+25>w){
		$tabNavmore.show()}
	else{
		$tabNavmore.hide();
		$tabNav.css({left:0})
	}
	var iframeBox=iframe_box.find('.show_iframe');
	iframeBox.hide();
	iframe_box.html('<div class="show_iframe"><div class="loading"></div><iframe frameborder="0" src='+href+'></iframe></div>');
	var showBox=iframe_box.find('.show_iframe:visible');
	showBox.find('iframe').load(function(){
		showBox.find('.loading').hide();
	});
}
function removeIframe(){
	var topWindow = $(window.parent.document);
	var iframe = topWindow.find('#iframe_box .show_iframe');
	var tab = topWindow.find(".acrossTab li");
	var showTab = topWindow.find(".acrossTab li.active");
	var showBox=topWindow.find('.show_iframe:visible');
	var i = showTab.index();
	tab.eq(i-1).addClass("active");
	iframe.eq(i-1).show();
	tab.eq(i).remove();
	iframe.eq(i).remove();
}
/*弹出层*/
/*
	参数解释：
	title	标题
	url		请求的url
	id		需要操作的数据id
	w		弹出层宽度（缺省调默认值）
	h		弹出层高度（缺省调默认值）
*/
function layer_show(title,url,w,h){
	if (title == null || title == '') {
		title=false;
	};
	if (url == null || url == '') {
		url="404.html";
	};
	if (w == null || w == '') {
		w=800;
	};
	if (h == null || h == '') {
		h=($(window).height() - 50);
	};
	 var index = layer.open({
		type: 2,
		area: [w+'px', h +'px'],
		fix: false, //不固定
		maxmin: true,
		shade:0.6,
		title: title,
		content: url,
		moveOut:true


	});
	return index;
}

//获取系统当前日期
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate;

	return currentdate;
}

function checkSubmit() {
	if (!submited)
	{
		submited = true;
		return true;
	}
	else {
		layer.msg("请不要重复提交表单！");
		return false;
	}
}


function layer_open(title,url,w,h){
	layer.open({
		type: 2,
		title: title,
		fix: false, //不固定
		shade:0.6,
		area: [w, h],
		content: url
	});
}

function opertion(page,power,id){
	var html='';
	if($.inArray("BROWSE",power)!=-1){
		$("#"+page).css('display','block');
		if($.inArray("ADD",power)!=-1){
			html+='<a href="javascript:;" id="add" class="btn btn-primary size-S radius"> <i class="Hui-iconfont">&#xe600;</i> 添加</a>';
		}
		if($.inArray("EDIT",power)!=-1){
			if(page!='tresult'&&page!='plan'&&page!='jzList'&&page!='dyList'&&page!='gyList'&&page!='scList'&&page!='data-list') {
				html += '<a href="javascript:;" id="edit" class="btn btn-secondary size-S radius"><i class="Hui-iconfont">&#xe6df;</i>编辑</a>';
			}
			if(page=='xmList'){
				html+='<a href="javascript:;"  id="complete" class="btn btn-warning size-S radius"><i class="Hui-iconfont">&#xe631;</i>完工</a>';
				html+='<a href="javascript:;" id="building" class="btn btn-success size-S radius"><i class="Hui-iconfont">&#xe601;</i>在建</a>';
			}
			if(page=='equipment'){
				html+='<a href="javascript:;" id="check" class="btn btn-success size-S  radius"><i class="Hui-iconfont">&#xe601;</i>检定</a>';
			}
		}
		if($.inArray("VIEW",power)!=-1){
			html+='<a href="javascript:;" id="view" class="btn btn-success size-S radius"> <i class="Hui-iconfont">&#xe616;</i> 查看</a>';
		}
		if($.inArray("DOWNLOAD",power)!=-1){
			html+='<a href="javascript:;" id="downLoad" class="btn btn-secondary size-S radius"> <i class="Hui-iconfont">&#xe640;</i>下载</a>';
		}
		if($.inArray("LOCK",power)!=-1){
			html+='<a href="javascript:;"  id="lock" class="btn btn-warning size-S  radius"><i class="Hui-iconfont">&#xe631;</i>锁定</a>';

			if(page=='unit-person'){
				html+='<a href="javascript:;"  id="login" class="btn btn-success size-S  radius"><i class="Hui-iconfont">&#xe631;</i>授权登录</a>';
			}
		}
		if($.inArray("DELETE",power)!=-1){
			if(page!='tresult'&&page!='plan') {
				html += '<a href="javascript:;" id ="del" class="btn btn-danger size-S radius"><i class="Hui-iconfont">&#xe6e2;</i>删除</a>';
			}
		}
		if($.inArray("GRANT",power)!=-1){
			html+='<a href="javascript:;" id ="grant" class="btn btn-success size-S radius"><i class="Hui-iconfont">&#xe70d;</i>授权</a>';
		}
		if($.inArray("VERIFY",power)!=-1){
			if(page!='tresult'&&page!='plan'){
				html+='<a href="javascript:;" id ="pass" class="btn btn-warning size-S radius"><i class="Hui-iconfont">&#xe725;</i>审核</a>';
			}
		}
		if($.inArray("ACCEPT",power)!=-1){
			if(page!='plan') {
				html += '<a href="javascript:;" id ="accept" class="btn btn-success size-S radius"><i class="Hui-iconfont">&#xe63c;</i>受理</a>';
			}
		}
		if($.inArray("REVIEW",power)!=-1){

			if(page!='jzList'&&page!='dyList'&&page!='data-list'){
				html+='<a href="javascript:;" id ="review" class="btn btn-warning size-S radius"><i class="Hui-iconfont">&#xe6f7;</i>复核</a>';
			}
		}
		if($.inArray("PRINT",power)!=-1){
			if(page!='tresult'&&page!='plan') {
				html += '<a href="javascript:;" id ="print" class="btn btn-secondary size-S radius"><i class="Hui-iconfont">&#xe652;</i>打印</a>';
			}
		}
		if($.inArray("UPLOAD",power)!=-1){
			if(page=='dyList'||page=="scList"||page=="jzList"||page=="gyList"||page=="zxList") {
				html += '<a href="javascript:;" id ="upload" class="btn btn-primary size-S radius"><i class="Hui-iconfont">&#xe600;</i>结果上传</a>';
			}
		}
	}else{
		alert('你没有访问权限');
	}
	$('#'+id).html(html);


}
/*关闭弹出框口*/
function layer_close(){
	var index = parent.layer.getFrameIndex(window.name);
	parent.layer.close(index);
}
$(function(){
	getskincookie();
	//layer.config({extend: 'extend/layer.ext.js'});
	Huiasidedisplay();
	var resizeID;
	$(window).resize(function(){
		clearTimeout(resizeID);
		resizeID = setTimeout(function(){
			Huiasidedisplay();
		},500);
	});

	$(".nav-toggle").click(function(){
		$(".Hui-aside").slideToggle();
	});
	$(".Hui-aside").on("click",".menu_dropdown dd li a",function(){
		if($(window).width()<768){
			$(".Hui-aside").slideToggle();
		}
	});
	/*左侧菜单*/
	$.Huifold(".menu_dropdown dl dt",".menu_dropdown dl dd","fast",1,"click");
	/*选项卡导航*/

	$(".Hui-aside").on("click",".menu_dropdown a",function(){
		Hui_admin_tab(this);

	});

	$(document).on("click","#min_title_list li",function(){
		var bStopIndex=$(this).index();
		var iframe_box=$("#iframe_box");
		$("#min_title_list li").removeClass("active").eq(bStopIndex).addClass("active");
		iframe_box.find(".show_iframe").hide().eq(bStopIndex).show();
	});
	$(document).on("click","#min_title_list li i",function(){
		var aCloseIndex=$(this).parents("li").index();
		$(this).parent().remove();
		$('#iframe_box').find('.show_iframe').eq(aCloseIndex).remove();
		num==0?num=0:num--;
		tabNavallwidth();
	});
	$(document).on("dblclick","#min_title_list li",function(){
		var aCloseIndex=$(this).index();
		var iframe_box=$("#iframe_box");
		if(aCloseIndex>0){
			$(this).remove();
			$('#iframe_box').find('.show_iframe').eq(aCloseIndex).remove();
			num==0?num=0:num--;
			$("#min_title_list li").removeClass("active").eq(aCloseIndex-1).addClass("active");
			iframe_box.find(".show_iframe").hide().eq(aCloseIndex-1).show();
			tabNavallwidth();
		}else{
			return false;
		}
	});
	tabNavallwidth();

	$('#js-tabNav-next').click(function(){
		num==oUl.find('li').length-1?num=oUl.find('li').length-1:num++;
		toNavPos();
	});
	$('#js-tabNav-prev').click(function(){
		num==0?num=0:num--;
		toNavPos();
	});

	function toNavPos(){
		oUl.stop().animate({'left':-num*100},100);
	}

	/*换肤*/
	$("#Hui-skin .dropDown-menu a").click(function(){
		var v = $(this).attr("data-val");
		setCookie("Huiskin", v);
		var hrefStr=$("#skin").attr("href");
		var hrefRes=hrefStr.substring(0,hrefStr.lastIndexOf('skin/'))+'skin/'+v+'/skin.css';
		$(window.frames.document).contents().find("#skin").attr("href",hrefRes);
		//$("#skin").attr("href",hrefResd);
	});
});

//操作日志
function opertionLog(url){
	var loginfo  ="";
	$.ajax({
		url:url ,    //请求的url地址
		dataType: "json",
		async:false,
		type: "GET",
		success: function(reg) {
			if(reg.code==0){
				var data = reg.data;
				var total =reg.data.length;
				$(".data-total").text(total);
				$.each(data,function(n,value){
					loginfo+="<tr class='text-c'>" ;
					loginfo+="<td width='80px'>"+value.authorityName+"</td>";
					loginfo+="<td >"+value.oprationContent+"</td>";
					loginfo+="<td width='50px'>"+value.createName+"</td>";
					loginfo+="<td >"+value.createTime.substring(0,10)+"</td>";
					if(value.authorityName=='编辑'){
						loginfo+="<td><a href=\"javascript:;\" data-logid ="+value.logId+" class=\"btn btn-success size-S radius\"> <i class=\"Hui-iconfont\">&#xe616;</i> 查看</a></td>";
					}else{
						loginfo+="<td></td>";
					}
					loginfo+="</tr>";
				});
				$("#logInfo").html(loginfo);

			}
		}
	});

	$('#logInfo').on('click','a',function(){
		var logId= $(this).attr("data-logid");
		var url="/api/v1/OperationLog/"+logId+"/ListByLogId";
		$.get(url,function(reg){
			if(reg.code==0){
				var data = reg.data;
				var str = "<table class=\"table table-border table-bordered table-hover table-bg table-sort\">";
				str+="<thead>";
				str+="<tr class=\"text-c\" style='background-color:#00a2d4'>";
				str+=" <th width=\"100\">修改字段名称</th>";
				str+=" <th width=\"100\">修改前的值</th>";
				str+=" <th width=\"100\">修改后的值</th>";
				str+="</tr></thead>";
				str+=" <tbody id=\"log\">";
				$.each(data,function(n,value){
					str+="<tr class=\"text-c\">";
					str+="<td >"+value.fieldName+"</td>";
					str+="<td>"+value.prevValue+"</td>";
					str+="<td >"+value.afterValue+"</td>";
					str+="</tr>";
				});
				str+="</tbody>";
				str+="</table>";

				layer.open({
					title:false,
					type: 1,
					content:str  //注意，如果str是object，那么需要字符拼接。
				});
			}
		});

	});
}

function showModal(url, width, height) {
	if (!width || width == 0) {
		width = window.screen.availWidth;
	}
	if (!height || height == 0) {
		height = window.screen.availHeight;
	}
		height = height - 100;
		width = width - 10;
		window.open(url, "", "width=" + width + ",height=" + height + ",toolbar=no,resizable=yes,scrollbars=no,location=no,directories=no,status=no,menubar=no");
}

//选中行
function selectTr(em) {
	if ($(em).hasClass("ui-state-active")) return;
	$(em).siblings("tr").filter(".ui-state-active").removeClass("ui-state-active");
	$(em).addClass("ui-state-active");
}

//获取当前时间，格式YYYY-MM-DD
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate;
	return currentdate;
}

function autodivheight(id){ //函数：获取尺寸
    //获取浏览器窗口高度
    var winHeight=0;
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    //通过深入Document内部对body进行检测，获取浏览器窗口高度
    if (document.documentElement && document.documentElement.clientHeight)
        winHeight = document.documentElement.clientHeight;
    //DIV高度为浏览器窗口的高度
    //document.getElementById("test").style.height= winHeight +"px";
    //DIV高度为浏览器窗口高度的一半
    document.getElementById(id).style.height= winHeight/1.009+"px";
}


//受理通过
function  AcceptPassAction(uri) {
	//获取实验人员列表
	$.ajax({
		url: '/api/v1/XMPerson/' + projectId + '/LiteListByProjId',
		dataType: "json",
		async: true,
		type: 'GET',
		success: function (reg) {
			if (reg.code == 0) {
				var list = "";
				$.each(reg.data, function (k, val) {
					list += '<div class="check-box">';
					list += '<input type="checkbox" id=user"' + val.value + '" name="authorityTag" value="' + val.value + '">';
					list += '<label for="checkbox-1">' + val.name + '</label>';
					list += '</div>';
				});

				$('#user-list').html(list);

			}
		}
	});

	var index = layer.open({
		type: 1,
		title: '受理通过',
		content: $('#AcceptPass-modal'), //这里content是一个DOM
		area: ['700px', '350px'],
		btn: ['确定', '取消'],
		'yes': function (index, layero) {
			var testId = "";
			var testId2 = "";
			var alluserBox = $("#user-list").find("input[type='checkbox']");
			var n = 0;
			for (var i = 0; i < alluserBox.length; i++) {
				if (alluserBox[i].checked) {
					n++;
				}

			}
			if($("#TestStandard").val()==""){
				layer.msg('请选择试验规范!', {icon: 1, time: 2000});
				return;
			}


			if (n < 1) {
				layer.msg('请选择一名实验人员!', {icon: 1, time: 2000});

			} else if (n > 2) {
				layer.msg('实验人员最多两名!', {icon: 1, time: 2000});

			}
			else {
				if (n == 1) {
					testId = alluserBox[0].value;
//                        alert(testId)
				}
				if (n == 2) {
					testId = alluserBox[0].value;
					testId2 = alluserBox[1].value;
//                        alert(testId +","+testId2)
				}


				$.ajax({
					url: uri,    //请求的url地址
					dataType: "json",
					async: true,
					type: "PATCH",
					data: {'testId': testId, 'testId2': testId2, 'TestStandard': $("#TestStandard").val()},
					success: function (reg) {
						if (reg.code == 0) {
							layer.msg('操作成功!', {icon: 1, time: 2000}, function () {
								parent.location.href = reload_url;
								layer.close(index);
							});
						} else {
							layer.alert(reg.message);
						}
					}
				});
			}

		}
	});
}

//通过
function PassStatus(uri){
	layer.confirm('确认要通过吗？',function(index){
		$.ajax({
			url: uri,    //请求的url地址
			dataType: "json",
			async: true,
			type: "PATCH",
			success: function(reg) {
				if(reg.code==0){
					layer.msg('已通过!',{icon:1,time:2000},function(){
						parent.location.href = reload_url;

					});
				}else{
					layer.msg(reg.message,{icon:5,time:2000});
				}
			}
		});
	});
}

//驳回
function BackStatus(power,uri){
	var title;
	if(power=='vb'){
		title='审核驳回';
	}else if(power =='ab'){
		title='受理驳回';
	}else{
		title='信息';
	}
	var index=layer.open({
		title:title,
		type: 1,
		content: $('#status-modal'), //这里content是一个DOM
		area:['540px','340px'],
		btn:['确定','取消'],
		'yes':function(index,layero){
			debugger;
			var reason=$('#reason').val();
			if(reason==""){
				layer.alert('请输入驳回原因！');
			}else {
				$.ajax({
					url:uri,    //请求的url地址
					dataType: "json",
					data:{'message':reason},
					async: true,
					type: "PATCH",
					success: function(reg) {

						if(reg.code==0){
							layer.msg(reg.message,{icon:1,time:2000},function(){
								parent.location.href = reload_url;
								layer.close(index);
							});

						}else{
							layer.alert(reg.message,{icon:5,time:2000});
						}
					},
					error:function(){
						layer.alert('请求出错！');
					}
				});
			}
		}
	});
}


function  getActionEvent(url) {
	//获取当前用户操作权限
	$.ajax({
		url: url,
		dataType: "json",
		async: false,
		type: 'GET',
		success: function (reg) {
			if (reg.code == 0) {
				var powerData = reg.data;
				getPower(powerData);

			} else {
				layer.alert(reg.message);
			}
		},
		error: function () {
			layer.alert('指定操作权限接口异常！');
		}
	});
}

//获取报检单的权限
function getPower(powerData){
    if(powerData.length!=0){
        var actionStr = "";
        $.each(powerData,function(key,value){
            if($.inArray(value.AuthorityTag,initPower)!=-1) {
                switch (value.ActionEventCode) {
                    case 'EDIT':
                        actionStr += '<button class="btn btn-primary radius size-S" type="button" id="edit"><i class="Hui-iconfont">&#xe632;</i>编辑</button>';
                        break;
                    case 'PRINT':
                        actionStr += '<button class="btn btn-success radius size-S" type="button" id="print"><i class="Hui-iconfont">&#xe652;</i>打印</button>';
                        break;
                    case 'DELETE':
                        actionStr += '<button class="btn btn-danger radius size-S" type="button" id="del"><i class="Hui-iconfont">&#xe6e2;</i>删除</button>';
                        break;
                    case 'SUBMIT':
                        actionStr += '<button class="btn btn-success radius size-S" type="button" id="submit"><i class="Hui-iconfont">&#xe632;</i>提交</button>';
                        break;
                    case 'VERIFYPASS':
                        actionStr += ' <button class="btn btn-success radius size-S" type="button" id="VerifyPass" value="vp"><i class="Hui-iconfont">&#xe632;</i>审核通过</button>';
                        break;
                    case 'VERIFYBACK':
                        actionStr += ' <button class="btn btn-danger radius size-S" type="button" id="VerifyBack" value="vb"><i class="Hui-iconfont">&#xe632;</i>审核驳回</button>';
                        break;
                    case 'ACCEPTPASS':
                        actionStr += ' <button class="btn btn-success radius size-S" type="button" id="ACCEPTPASS" value="ap"><i class="Hui-iconfont">&#xe632;</i>受理通过</button>';
                        break;
                    case 'ACCEPTBACK':
                        actionStr += ' <button class="btn btn-danger radius size-S" type="button" id="ACCEPTBACK" value="ab"><i class="Hui-iconfont">&#xe632;</i>受理驳回</button>';
                        break;
                    case 'INVALID':
                        actionStr += '<button class="btn btn-warning radius size-S" type="button" id="Invalid" value="i"><i class="Hui-iconfont">&#xe632;</i>作废</button>';
                        break;
                    case 'INVALIDAPPROVAL':
                        actionStr += '<button class="btn btn-warning radius size-S" type="button" id="invalidapproval" value="ia"><i class="Hui-iconfont">&#xe632;</i>批准作废</button>';
                        break;
                    case 'INVALIDVERIFY':
                        actionStr += '<button class="btn btn-warning radius size-S" type="button" id="InvalidVerify" value="iv"><i class="Hui-iconfont">&#xe632;</i>审核作废</button>';
                        break;
                    case 'INVALIDREVOKE':
                        actionStr += '<button class="btn btn-success radius size-S" type="button" id="RevokeInvalid" value="ri"><i class="Hui-iconfont">&#xe632;</i>撤销作废</button>';
                        break;
                    default:
                }
            }
        });
        $('#power').html(actionStr);
		if(actionStr==""){
			$('.easyui-layout').layout('hidden', 'south');
		}else {
			$('.easyui-layout').layout('show', 'south');
		}
    }
}

//工作流
function workInfo(uri){
    $.ajax({
        url:uri ,    //请求的url地址
        dataType: "json",
        async: false,
        type: "GET",
        success: function (reg) {
            if(reg.code==0){
                var workInfo="";
                $.each(reg.data,function(n,v){
                    workInfo+="<tr class='text-c'>" ;
                    workInfo+='<td>'+ v.ActionEventName+'</td>';
                    if(v.OperateRemark!=null){
                        workInfo+='<td>'+ v.OperateRemark+'</td>';
                    }else{
                        workInfo+='<td></td>';
                    }

                    workInfo+='<td>'+ v.OperatorName+'</td>';
                    workInfo+='<td>'+ v.OperateTime+'</td>';
                    workInfo+='</tr>';
                });
                $('#workInfo').html(workInfo);
            }else{
                layer.alert(reg.message);
            }
        },
        error:function(){
            layer.alert('工作流接口异常！');
        }
    });

}

function isbywCode( str ){
	//var re =  /^[a-zA-Z\-]*$/g; //[a-zA-Z-]{1}
	var re =/^[a-zA-Z-]{1}$/g; //
	if (re.test(str)) {
		return true;
		//if(str.length==1){
		//	return true;
		//}
		//else {
		//	return false;
		//}
	} else {
		return false;
	}
}
function tdENum(s){
	if(s!=='null'){
		trNum++;
		return Number(s);
	}else {
		return 0;
	}
}


function getHzDiffStr(s1,s2){
	var s=s1-s2;
	debugger;

	var color='green';
	if(Math.abs(s)<MaxLoad/1000){
		color='green';
	} else  if(Math.abs(s)>=MaxLoad/1000&&Math.abs(s)<=(MaxLoad*2)/1000){
		color='orange';
	}else if(Math.abs(s)>(MaxLoad*2)/1000){
		color='red';
	}
	return "<td class='hzdiff' style='color:"+color+"'>" + s.toFixed(2) + "</td>";
}

function getDateDiffStr(datestr1,datestr2){
	var date1=new Date(datestr1).getTime();
	var date2=new Date(datestr2).getTime();
	var LittleStr="";
	var datediff ;   //时间差的毫秒数
	if(date1<date2){
		LittleStr="-";
		datediff=date2-date1;
	}else {
		datediff=date1-date2;
	}

	//计算出相差天数
	var days=Math.floor(datediff/(24*3600*1000));

	//计算出小时数

	var leave1=datediff%(24*3600*1000);    //计算天数后剩余的毫秒数
	var hours=Math.floor(leave1/(3600*1000));
	//计算相差分钟数
	var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
	var minutes=Math.floor(leave2/(60*1000));
	//计算相差秒数
	var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
	var seconds=Math.round(leave3/1000);
	var str;
	hours=Math.abs(hours);
	minutes=Math.abs(minutes);
	seconds=Math.abs(seconds);
	if(days==0){

		str= LittleStr+hours+":"+minutes+":"+seconds ;
	}else {
		str= LittleStr+days+"天"+hours+":"+minutes+":"+seconds;
	}
	var color='green';
	if(Math.abs(days)>0){
		color='red';
	}else if(hours>0){
		color='red';
	}else if(minutes<10){
		color='green';
	}else  if(minutes>=10&&minutes<=30){
		color='orange';
	}else if(minutes>30){
		color='red';
	}
	return "<td class='difftime' style='color:"+color+"'>" + str + "</td>";
}


//显示上传时间列
function showUploadtimeT (){
	$("#UploadtimeT").show();
	$("#DelaytimeT").hide();
	$(".uploadtime").show();
	$(".difftime").hide();
}
//显示延迟时间列
function showDelaytimeT(){
	$("#UploadtimeT").hide();
	$("#DelaytimeT").show();
	$(".uploadtime").hide();
	$(".difftime").show();
}


function showLoading(str){
	//return   layer.load(2, {
	//	shade: [0.5,'#000'],
	//	content: str
	//});
	return layer.msg(str, {icon: 16,shade: [0.5, '#f5f5f5'],scrollbar: false}) ;
}
function showLoading(str,top_offset,left_offset){
	//return   layer.load(2, {
	//	shade: [0.5,'#000'],
	//	content: str
	//});
	return layer.msg(str, {icon: 16,shade: [0.5, '#f5f5f5'],scrollbar: false,offset: [top_offset, left_offset]}) ;
}
function hideLoading(index){
	layer.close(index);
}

function stringToBytes ( str ) {
	var ch, st, re = [];
	for (var i = 0; i < str.length; i++ ) {
		ch = str.charCodeAt(i);  // get char
		st = [];                 // set up "stack"
		do {
			st.push( ch & 0xFF );  // push byte to stack
			ch = ch >> 8;          // shift value down by 1 byte
		}
		while ( ch );
		// add stack contents to result
		// done because chars have "wrong" endianness
		re = re.concat( st.reverse() );
	}
	// return an array of bytes
	return re;
}




