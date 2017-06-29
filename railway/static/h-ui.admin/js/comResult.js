/**
 * Created by RS on 2017/6/1.
 */

function  getflowFlagStr(flowFlag){
    var tableHtml;
    if(flowFlag==0){
        tableHtml='<span class="label label-default radius">未判定</span>';
    }else if(flowFlag==1){
        tableHtml='<span class="label label-warning radius">待复核</span>';
    }else  if(flowFlag==2){
        tableHtml='<span class="label label-danger radius">退回修订</span>';
    }else if(flowFlag==3){
        tableHtml='<span class="label label-success radius">已复核</span>';
    }else{
        tableHtml='<span class="label label-warning radius">未知</span>';
    }
    return tableHtml;
}

function  getResultStr(pileGrade,flowFlag,isEdit){
    var clickStr='';
    if(flowFlag!=9&&isEdit){
        clickStr='onclick="setPileGrade();"';

    }
    var vhtml;
    if(pileGrade==5){
        vhtml='<span '+clickStr+'  class="label label-success radius">合格</span>';
    }
    else if(pileGrade==6){
        vhtml='<span  '+clickStr+' class="label label-danger radius">不合格</span>';
    }
    else{
        vhtml='<span '+clickStr+'  class="label label-default radius">未判定</span>';
    }
    return vhtml;
}

function  getisValidStr(isValid,flowFlag,isEdit){
    commisValid=isValid;
    var clickStr='';
    if(flowFlag!=9&&isEdit){
        clickStr='onclick="setIsValid();"';
    }
    var vhtml=isValid==1?'<span '+clickStr+'  class="label label-success radius">有效</span>':'<span  '+clickStr+' class="label label-danger radius">无效</span>';

    return vhtml;
}

//function getResultStr(s){
//    var str='<span class="label label-warning radius">未判定</span>';
//    if(s==5){
//        str='<span class="label label-success radius">合格</span>';
//    }
//    else if(s==6){
//        str='<span class="label label-danger radius">不合格</span>';
//    }
//    return str;
//}
function  getDyResultStr(result){
    var s;
    if(result=='0'){
       s= '<span style="color:blue">未判定</span>';
    }else  if(result=='1'){
        s= '<span style="color:green">Ⅰ类</span>';
    }else if( result=='2'){
        s= '<span style="color:olivedrab">Ⅱ类</span>';
    }else if( result=='3'){
         s= '<span style="color:indigo">Ⅲ类</span>';
    }else  if( result=='4'){
         s= '<span style="color:blue">Ⅳ类</span>';
    }else  if( result=='5'){
         s= '<span style="color:green">合格</span>';
    }else  if( result=='6'){
         s= '<span style="color:red">不合格</span>';
    }else{
         s= '<span style="color:blue">其它</span>';
    }
    return s;
}

//获取权限
function getResultPower(page,power,id,isReview,isedit,isresult) {

    var actionStr = "";
    actionStr=getResultPowerStr(page,power,id,isReview,isedit,isresult);


    $('#' + id).html(actionStr);

    if(actionStr==""){
        $("#"+id).hide();
        $("#result-table-div").height($(".resut-left").height());

    }else {
        $("#"+id).show();
        $("#result-table-div").height($(".resut-left").height() - 40);
    }

}

//获取权限
function getResultPowerStr(page,power,id,isReview,isedit,isresult) {

    var actionStr = "";
    if ($.inArray("EDIT", power) != -1) {

        if (isedit) {
            actionStr += '<button type="button" class="btn btn-success size-M radius " id="saveBtn" ><i class="Hui-iconfont">&#xe632;</i> 保存</button>&nbsp;';
            if (page == 'jzResult') {
                actionStr += '<button type="button"   id="cancelBtn"  class="btn btn-primary size-M radius" ><i class="Hui-iconfont">&#xe66b;</i> 取消</button>&nbsp;';
            }

        }
        if (isresult) {
            actionStr += '<button type="button" class="btn btn-secondary  size-M radius" id="ResultBtn"  ><i class="Hui-iconfont">&#xe6a7;</i> 提交检测结论</button>&nbsp;';

        }


    }
    if($.inArray("REVIEW",power)!=-1){
        if(isReview){
            actionStr+='<button type="button"   id="review"  class="btn btn-warning size-M radius" ><i class="Hui-iconfont">&#xe6f7;</i>复核</button>';
        }

    }
    return actionStr;
}

//表单验证
function validisValidform() {
    return $("#form-data-isValid").validate({
        debug: true,
        rules: {
            isValid: {
                required: true
            },
            message: {
                required: true,
                rangelength:[0,255]
            }
        }
    });
}
function comSetIsValid(url){

    //设置数据有效性
    var index=layer.open({
        type: 1,
        title:'设置数据有效性',
        content: $('#data-isValid'), //这里content是一个DOM
        area:['550px','300px'],
        offset: [top_offset, left_offset],
        btn:['确定','取消'],
        'yes':function(index,layero){

            var isValid = $('#data-isValid input[name=isValid]:checked').val();
            if(validisValidform().form()) {
                $.ajax({
                    url: url,    //请求的url地址
                    dataType: "json",
                    async: true,
                    type: "PATCH",
                    data:{'isValid':isValid,'message':$("#message-set").val()},
                    success: function(reg) {
                        if(reg.code==0){
                            layer.msg('操作成功!',{icon:1,time:2000,offset: [top_offset, left_offset]});
                            window.opener.location.reload();//刷新父窗口
//                                window.opener.location.reload(true);
                            setIsValidValue(isValid);
                            getReviewInfo();
                        }else{
                            layer.alert(reg.message, {
                                icon:2,
                                title:'错误信息',
                                offset:[top_offset, left_offset],
                                skin:'layer-ext-moon'
                            });
                        }
                    },error:function(){
                        layer.alert('更新失败！', {
                            icon:2,
                            title:'错误信息',
                            offset:[top_offset, left_offset],
                            skin:'layer-ext-moon'
                        });
                    }
                });
                layer.close(index);
            }
        }
    });
}
function  validflowFlagform(){
    return $("#form-data-review").validate({
        debug: true,
        rules: {
            flowFlag: {
                required: true
            },
            message: {
                required: true,
                rangelength:[0,255]
            }
        }
    });
}
function reviewLayer(url){
    var index=layer.open({
        type: 1,
        title:'复核',
        content: $('#data-review'), //这里content是一个DOM
        area:['550px','300px'],
        offset: [top_offset, left_offset],
        btn:['确定','取消'],
        'yes':function(index,layero){

            var flowFlag = $('input[name=flowFlag]:checked').val();
            if(validflowFlagform().form()) {
                $.ajax({
                    url: url,    //请求的url地址
                    dataType: "json",
                    async: true,
                    type: "PATCH",
                    data:{'flowFlag':flowFlag,'message':$("#message").val()},
                    success: function(reg) {
                        if(reg.code==0){
                            layer.msg('操作成功!',{icon:1,time:2000,offset: [top_offset, left_offset]});

                            if(flowFlag=='2')   {
                                $('#flowFlag').html('<span class="label label-danger radius">退回修订</span>');

                            }
                            if(flowFlag=='3'){
                                $('#flowFlag').html('<span class="label label-success radius">已复核</span>');

                            }
//                                    getReviewInfo();
//                                    $("#review").hide();
                            window.close();
                            window.opener.location.reload();//刷新父窗口
//                                    window.opener.location.reload(true);
                        }else{
                            layer.alert(reg.message, {
                                icon:2,
                                title:'错误信息',
                                offset:[top_offset, left_offset],
                                skin:'layer-ext-moon'
                            });
                        }
                    }
                });
                layer.close(index);
            }
        }
    });
}