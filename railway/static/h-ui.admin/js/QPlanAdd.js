


//====================================================================
//删除列表中指定项
function deleteALLItem() {
    for (var i = document.getElementById("rclist").options.length - 1; i >= 0; i--)

        document.getElementById("rclist").options.remove(i);

}
 
 
//======================================================================

function Trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
 
 
 function isShow(){
 	var testMode=$("#testMode").val();
    if(testMode=='DY'||testMode=='SC'||testMode=='ZX'||testMode==''){
         return false;
     }else
     {
         return true;
     }

 }
 
//////////////////////////////////////////////////////////////////////////////////////
/*
 用途：检查输入对象的值是否符合整数格式
 输入：str 输入的字符串
 返回：如果通过验证返回true,否则返回false

 */
function isInteger( str ){
    var regu = /^[-]{0,1}[0-9]{1,}$/;
    return regu.test(str);
}

/*
/*
 用途：检查输入字符串是否是带小数的数字格式,可以是负数
 输入：
 s：字符串
 返回：
 如果通过验证返回true,否则返回false

 */
function isDecimal( str ){
    if(isInteger(str)) return true;
    var re = /^[-]{0,1}(\d+)[\.]+(\d+)$/;
    if (re.test(str)) {
        if(RegExp.$1==0&&RegExp.$2==0) return false;
        return true;
    } else {
        return false;
    }
}


function rangelength(str,min,max){
    var ret=true;
    if(str.length>max) ret=false;
    if(str.length<min) ret=false;
    return ret;
}


/////////////////////////////////////////////////////////////////////////////////////

//var sel = form1.rclist;
var sel = document.getElementById("rclist");
var NAN = true;
///////////////////////////////////////////////////////////////////////////////////////
//===========================  数据处理 开始  ===================================//
//////////////////////////////////////////////////////////////////////////////////////
//添加记录
function addrcitem() {
    var testMode=Trim($("#testMode").val()); //桩号
    if (testMode == "") {
        layer.msg("请选择试验方法", {icon: 6, time: 2000});
        return;
    }

    //var l = sel.length;
    var l = $("#rclist").get(0).options.length;
    var i = l + 1;
    //pileNo  pileTop pileBottom pileType pileLength pileDiameter pileTong czl gzDate
    //序号	桩号	"设计桩顶标高(m)"	"设计桩底标高(m)"	"设计桩径mm)"	"设计桩长(m)"	"砼强度等级"	承载力设计值(kN)	灌注日期


    var pileNo = Trim($("#pileNo").val()); //桩号
    var pileTop = Trim($("#pileTop").val());//设计桩顶标高
    var pileBottom = Trim($("#pileBottom").val());//设计桩底标高

    var pileLength = Trim($("#pileLength").val()); //设计桩长
    var pileDiameter = Trim($("#pileDiameter").val());//设计桩径mm
    var pileTong = Trim($("#pileTong").val());//砼强度等级

    var czl = Trim($("#czl").val()); //承载力设计值


    var gzDate = Trim($("#gzDate").val());//灌注日期


    var t, v;
    var arr;
    if (pileNo == "") {
        layer.msg("请输入桩号", {icon: 6, time: 3000});
        return;
    }
    if(!rangelength(pileNo,0,16)){
        layer.msg("桩号长度范围[0-16]", {icon: 6, time: 3000});
        return;
    }
    if (pileTop == "") {
        layer.msg("请输入设计桩顶标高", {icon: 6, time: 3000});
        return;
    }
    if(!isDecimal(pileTop)){
        layer.msg("设计桩顶标高输入格式不正确", {icon: 6, time: 3000});
        return;
    }
    if(!rangelength(pileTop,0,10)){
        layer.msg("设计桩顶标高长度范围[0-10]", {icon: 6, time: 3000});
        return;
    }
    if (pileBottom == "") {
        layer.msg("请输入设计桩底标高", {icon: 6, time: 3000});
        return;
    }
    if(!isDecimal(pileBottom)){
        layer.msg("设计桩底标高输入格式不正确", {icon: 6, time: 3000});
        return;
    }
    if(!rangelength(pileBottom,0,10)){
        layer.msg("设计桩底标高长度范围[0-10]", {icon: 6, time: 3000});
        return;
    }
    if (pileLength == "") {
        layer.msg("请输入设计桩长", {icon: 6, time: 3000});
        return;
    }

    if(!isDecimal(pileLength)){
        layer.msg("设计桩长输入格式不正确", {icon: 6, time: 3000});
        return;
    }
    if(!rangelength(pileLength,0,10)){
        layer.msg("设计桩长长度范围[0-10]", {icon: 6, time: 3000});
        return;
    }
    if (pileDiameter == "") {
        layer.msg("请输入设计桩径mm", {icon: 6, time: 3000});
        return;
    }
    if(!isDecimal(pileDiameter)){
        layer.msg("设计桩径mm输入格式不正确", {icon: 6, time: 3000});
        return;
    }
    if(!rangelength(pileDiameter,0,10)){
        layer.msg("设计桩径mm长度范围[0-10]", {icon: 6, time: 3000});
        return;
    }
    if (pileTong == "") {
        layer.msg("请选择砼强度等级", {icon: 6, time: 3000});
        return;
    }

    if (isShow()) {

        if (czl == "") {
            layer.msg("请输入承载力设计值", {
                icon: 6,
                time:3000
            });
            return;
        }
    }else {
        czl=0;
    }
    if(!isDecimal(czl)){
        layer.msg("承载力设计值输入格式不正确", {icon: 6, time: 3000});
        return;
    }
    if(!rangelength(czl,0,10)){
        layer.msg("承载力设计值长度范围[0-10]", {icon: 6, time: 3000});
        return;
    }
    if (gzDate == "") {
        layer.msg("请输入灌注日期", {icon: 6, time:3000});
        return;
    }


    for (var j = 0; j < l; j++) {
        arr = document.getElementById("rclist").options[j].text.split("|");
        if (arr[0] == pileNo) {
            NAN = false;
        }
    }
    if (NAN) {
        t = pileNo + "|" + pileTop + "|" + pileBottom  + "|" + pileLength + "|" + pileDiameter + "|" + pileTong + "|" + czl + "|" + gzDate;
        v = t;
        var option = new Option(t, v);
        //sel.append(option);
        var sell = document.getElementById("rclist");
        sell.options.add(option);
        showrclist();

    }
    else {
        layer.alert("请勿添加重复值");
        NAN = true;
        return false;
    }
}
        




//显示所有记录数据
function showrclist() {
    var tbody = "";
    $("#tabledit tfoot").html(tbody);

    var l = $("#rclist").get(0).options.length;

    var arr;
    var trBody = "";
    for (var j=l-1;j >=0;j--){
    //for (var j = 0; j < l; j++) {
        arr = document.getElementById("rclist").options[j].text.split("|");

        trBody += "<tr style='text-align:center;'  bgcolor='#fff' id='rclist_" + j + "' onclick=selectedtr(" + String(j) + ")  >"
        trBody += "<td style='text-align:center;'>" + String(j + 1) + "</td>";
        trBody += "<td style='text-align:center;'>" + arr[0] + "</td>";
        trBody += "<td style='text-align:center;'>" + arr[1] + "</td>";
        trBody += "<td style='text-align:center;'>" + arr[2] + "</td>";
        trBody += "<td style='text-align:center;'>" + arr[3] + "</td>";
        trBody += "<td style='text-align:center;'>" + arr[4] + "</td>";

        trBody += "<td style='text-align:center;'>" + arr[5] + "</td>";
        if (isShow()) {
            trBody += "<td style='text-align:center;'>" + arr[6] + "</td>";
        }
        trBody += "<td style='text-align:center;'>" + arr[7] + "</td>";

        trBody += "<td style='text-align:center;width:100px;'><input class=\"btn btn-danger-outline size-MINI radius\" type=\"button\"  onclick=DelRcItem(" + String(j) + ") value=\"删除\"></td></tr>";

    }
    $("#tabledit tfoot").append(trBody);
}

 
//改变选定记录背景色
function selectedtr(i) {
    var tr = "rclist_" + i;
    document.getElementById(tr).style.backgroundColor = "#BCBCBC";
    //var l = sel.length;
    var l = $("#rclist").get(0).options.length;
    for (var j = 0; j < l; j++) {
        tr = "rclist_" + j;
        if (j != i) { $(tr).style.backgroundColor = "#fff"; }
    }
}
 
//删除发货列表记录
function DelRcItem(i) {
    deleteAnItem(document.getElementById("rclist"), i); 
    showrclist(); 
}
//删除列表中指定项
function deleteAnItem(theList, itemNo) {
    theList.options[itemNo] = null
}
///////////////////////////////////////////////////////////////////////////////
//============================  处理  结束  =========================//
///////////////////////////////////////////////////////////////////////////////
//初始化
function init() {

    deleteALLItem(); 

}

 