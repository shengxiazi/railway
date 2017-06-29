(function () {        //闭包
    function load_script(xyUrl, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = xyUrl;
        //借鉴了jQuery的script跨域方法
        script.onload = script.onreadystatechange = function () {
            if ((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                callback && callback();
                // Handle memory leak in IE
                script.onload = script.onreadystatechange = null;
                if (head && script.parentNode) {
                    head.removeChild(script);
                }
            }
        };
        // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
        head.insertBefore(script, head.firstChild);
    }
    //单个坐标转换
    function translate(point, type, callback) {
        var callbackName = 'cbk_' + Math.round(Math.random() * 10000);    //随机函数名
        var xyUrl = "http://api.map.baidu.com/ag/coord/convert?from=" + type + "&to=4&x=" + point.lng + "&y=" + point.lat + "&callback=BMap.Convertor." + callbackName;
        //动态创建script标签
        load_script(xyUrl);
        BMap.Convertor[callbackName] = function (xyResult) {
            delete BMap.Convertor[callbackName];    //调用完需要删除改函数
            var point = new BMap.Point(xyResult.x, xyResult.y);
            callback && callback(point);
        }
    }
    //批量坐标转换 2014.6.21孙晖
    function geoconv(points, type, callback) {
        var callbackName = 'cbk_' + Math.round(Math.random() * 10000);    //随机函数名
        var xyUrl = "http://api.map.baidu.com/geoconv/v1/?ak=a7wFV9jcy3B9tB69ql5oGkQz&from=" + type + "&to=5&coords=" + points + "&output=json&callback=BMap.Convertor." + callbackName;
        //动态创建script标签
        load_script(xyUrl);
        BMap.Convertor[callbackName] = function (xyResult) {
            delete BMap.Convertor[callbackName];    //调用完需要删除改函数
            callback && callback(xyResult.result,xyResult.status);
        }
    }
    window.BMap = window.BMap || {};
    BMap.Convertor = {};
    BMap.Convertor.translate = translate;
    BMap.Convertor.geoconv = geoconv;
})();

//单坐标转换方法
function baiduMap(e, p) {
    var map = new BMap.Map(e);
    translateCallback = function (point) {
        var marker = new BMap.Marker(point);
        map.addOverlay(marker);
    };
    for (var i = 0; i < p.length; i++) {
        var point = new BMap.Point(p[i].lng, p[i].lat);
        BMap.Convertor.translate(point, 0, translateCallback);
    }
}

//引用点聚合
document.writeln("<script type=\"text/javascript\" src=\"http://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js\" ><\/script>");
document.writeln("<script type=\"text/javascript\" src=\"http://api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js\" ><\/script>");

//区域插件
document.writeln("<script type=\"text/javascript\" src=\"http://api.map.baidu.com/library/AreaRestriction/1.2/src/AreaRestriction_min.js\"><\/script>");

//多坐标批量转换方法
//map:初始化后的对象new BMap.Map("divid");
//pointArray:[{ "lng": lng, "lat": lat, "title": "title", "content": "content","show":true, "icon":"","mapaddr":true,"width":400 }]
//opt:{"MapType":true,"Navigation":true,"Scale":true,"ScrollWheel":true,"DistanceTool":true,"ViewPort":true,"Zoom":16}

//全局标记
var isDo = true;
//百度地图API
function bdMap(e, pointArray, opt, callback) {
    //计数
    var counts = 0;

    //初始化地图
    if (typeof (opt) != "object" || opt == null || opt == undefined) {
        opt = { "MapType": true, "Navigation": true, "Scale": true, "ScrollWheel": true, "DistanceTool": false, "ViewPort": true, "Zoom": 5 };
    }
    var zoom = (opt.Zoom) ? opt.Zoom : 5;  // 设置地图缩放级别，范围3-18
    var viewport = (opt.ViewPort == undefined) ? true : opt.ViewPort; //启用让所有点在视野范围内
    var map = new BMap.Map(e,{minZoom:5,maxZoom:20});  //初始化地图容器
    map.centerAndZoom(new BMap.Point(108.948031,34.346244), 5);

    //区域限制
    var b = new BMap.Bounds(new BMap.Point(75.0115650000,18.9072650000),new BMap.Point(167.3659960000, 73.1642890000));
    try {
        BMapLib.AreaRestriction.setBounds(map, b);
    } catch (e) {
        alert(e);
    }

    //地图控件
    if (opt.MapType == undefined || opt.MapType) map.addControl(new BMap.MapTypeControl());          // 添加地图类型控件
    if (opt.Navigation == undefined || opt.Navigation) map.addControl(new BMap.NavigationControl());       // 添加平移缩放控件
    if (opt.Scale == undefined || opt.Scale) map.addControl(new BMap.ScaleControl());            // 添加比例尺控件
    if (opt.ScrollWheel == undefined || opt.ScrollWheel) map.enableScrollWheelZoom();   //启用滚轮放大缩小

    //坐标转换
    mapTranslate();
    function mapTranslate() {
        // 开始坐标点插入
        var pCount = pointArray.length;
        if (pCount == 0) {
            //alert("缺少GPS坐标信息");
            return;
        }
        // 获取中心点的坐标的索引
        var cenIndex = 0;
        for (var i = 0; i < pCount; i++) {
            if (pointArray[i].show) {
                cenIndex = i; break;
            }
        }
        // GPS坐标转换为baidu坐标
        var convPage = 0; // 正在分批转换坐标的页码
        var convCompleted = 0; // 已经转换完坐标的页码
        var convPageCount = Math.ceil(pCount / 100);    // 需要转换坐标的总页码数
        var rpa = new Array(); //转换后的坐标数组
        var pIndex = -1; //正在插入的转换后的坐标的索引号
        var convInterval = setInterval(function () {
            if (convCompleted == convPageCount) {
                clearInterval(convInterval);
                return;
            }
            if (convPage > convCompleted) {
                return;
            }
            var coords = "";
            var convCount = (convPage + 1) * 100 < pCount ? (convPage + 1) * 100 : pCount;
            for (var i = convPage * 100; i < convCount; i++) {
                coords += pointArray[i].lng + "," + pointArray[i].lat + ";";
            }
            coords = coords.substring(0, coords.length - 1);
            BMap.Convertor.geoconv(coords, 1, geoconvCallback);
            convPage++;
        }, 16);

        //将坐标转换后返回值插入新的数组备用
        geoconvCallback = function (d,status){
            if(status==0){
                var p_i;
                for (var i = 0; i < d.length; i++) {
                    p_i = (convPage - 1) * 100 + i;
                    var rp = new BMap.Point(d[i].x, d[i].y);
                    rpa.push(rp);
                }
                convCompleted++;
                if (pIndex < 0) {
                    pIndex = 0;
                }
            }else{
                layer.alert('坐标转换失败！');
            }
        };

        // 开始插入转换后的坐标点
        var pCompleted = 0; //已经插入的坐标的最大索引号
        var markers = [];
        var pInterval = setInterval(function (){
            if (pIndex < 0) {
                return;
            }
            //当达到坐标索引达到点的数值时，停止执行
            if (pCompleted == pCount) {
                clearInterval(pInterval);
                if (viewport && rpa.length > 1) {
                    var veOpt = {
                        enableAnimation:true,
                        margins:[300,20,100,20]
                    };
                    map.setViewport(rpa,veOpt);       //让所有点在视野范围内
                }
                layer.close(index);
                map.enableScrollWheelZoom();
               // 点聚合
                var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
                return;
            }
            if (pIndex > pCompleted) {
                return;
            }
            var sContent = pointArray[pIndex].content;
            var sTitle = pointArray[pIndex].title;
            var pShow = pointArray[pIndex].show;
            var icons = pointArray[pIndex].icon;
            var mapAddr = pointArray[pIndex].mapaddr;
            var point = rpa[pIndex];
            var marker;
            var myIcon = '';
            if (icons == undefined || icons == "" || icons == null) {
                marker = new BMap.Marker(point);
            } else {
                //标记点图标
                var ji = parseInt((pIndex.toString()).slice((pIndex.toString()).length-1));
                var ic = icons[ji];
                myIcon = new BMap.Icon("/static/mapImage/" + ic + ".png", new BMap.Size(21, 30));
                marker = new BMap.Marker(point, { icon: myIcon });
            }
            markers.push(marker);
            index = layer.load();
            var isInit = true;
            //查询
            mapSearch();
            function mapSearch (){
                var v = $('#testMode').val();
                if (callback && v!='') {
                    isInit = false;
                    //侧边提示
                    $('.switch').css('display', 'block');
                    var myGeo = new BMap.Geocoder();
                    var pt = marker.getPosition();
                    var ul = $('#left-panel ul:nth-child(1)').get(0);
                    var str = '';
                    var txt = $('#testMode option:checked').text();
                    $.each(pointArray, function (i,v) {
                        str +=  '<li class="sho info-'+i+'" data-lng="'+rpa[i].lng+'" data-lat="'+rpa[i].lat+'" style="padding:10px 10px 10px 10px;border-bottom:1px solid #dadada;"><span class="ico" style="display:inline-block;vertical-align:top;width:21px;height:30px;background:url(/static/mapImage/'+icons[parseInt((i.toString()).slice((i.toString()).length-1))]+'.png) no-repeat 0px 0px;"></span><span style="margin:0px 0px 0px 12px;color:#3385ff;">工程名称：'+v.projectName+'</span><div style="margin:-4px 0px 0px 24px;">&nbsp;&nbsp;检测编号：'+v.serialNo+'</div><div style="margin:4px 0px 0px 24px;color:#ff9429;">&nbsp;&nbsp;测试方法：'+txt+'</div></li>' ;
                    });
                    counts++;

                    //渲染数据
                    mapPage();
                    function mapPage () {
                        if (counts == pointArray.length) {
                            ul.innerHTML = str;
                            var lis = $.makeArray(  $(ul).children() );
                            //响应式
                            if (window.screen.width <= 1366) {
                                $('#left-panel').css( 'height', '470px');
                                $('#left-panel li').css( 'padding', '0px 10px');
                            } else {
                                $('#left-panel').css( 'height', '780px');
                            }
                            $('#left-panel').slideToggle("slow");
                            $(ul).slideToggle("slow");
                        }
                    }
                }
            }


            //点击打开详情页
            //解绑事件
            $('body').off('click', '#left-panel ul:nth-child(1) li');
            $('body').on('click', '#left-panel ul:nth-child(1) li', function (e) {
                var thats = $(this);
                var inddd = $(this).index();
                var lng = $(this).attr("data-lng");
                var lat = $(this).attr("data-lat");
                //匹配标记点
                for (var i = 0; i < markers.length; i++) {
                    if (lng == markers[i].point.lng && lat == markers[i].point.lat ) {
                        if (pIndex == pointArray.length) {
                            if (isDo) {
                                    if ($('.cb').css('display') == 'none') {
                                        $('.cb').remove();
                                        var div = '<div class="cb" style="position:relative;"></div>';
                                        thats.append(div);
                                        //DOM操作
                                        var dv =  $('.cb');
                                        //数据详情
                                        var detail = pointArray[i].content;
                                        $( detail ).attr('id', 'tb-'+inddd+'');
                                        dv.append(detail);
                                        dv.append('<i class="Hui-iconfont clos">&#xe60b;</i>');
                                        dv.append('<div class="closes" style="display:none;"></div>');
                                        dv.css('display', 'none');
                                        //缓动动画
                                        dv.slideToggle("slow");
                                        isDo = false;
                                        //主体内容  信息窗口
                                        var sContent = pointArray[i].content;
                                        //标题
                                        var sTitle = pointArray[i].title;
                                        var infoOpt = { title: sTitle };
                                        if (pointArray[i].width) infoOpt.width = pointArray[i].width;
                                        sContent = "测点地址：<span style='background-color:#ff9429;' id=\"" + spanid + "\"></span>";
                                        infoOpt = '';
                                        var infoWindow = new BMap.InfoWindow(sContent, infoOpt);
                                        var mapAddr = pointArray[i].mapaddr;
                                        if (mapAddr) {
                                            //标记点
                                            var p = markers[i].getPosition();
                                             //逆地址
                                            var geo = new BMap.Geocoder();
                                            geo.getLocation(p, function (rs) {
                                                var wz = rs.address;
                                                map.openInfoWindow(infoWindow, p);
                                                document.getElementById(spanid).innerHTML = wz;
                                                // //信息窗口样式
                                                $('span[id]').parent().parent().css({
                                                    top: '40px',
                                                    height: "auto"
                                                });
                                                //图片加载完成后重绘
                                                infoWindow.redraw();
                                            });
                                        } else {
                                        map.openInfoWindow(infoWindow, markers[i].point);
                                        }
                                        return false;
                                    } else {
                                        var div = '<div class="cb" style="position:relative;"></div>';
                                        thats.append(div);
                                        //DOM操作
                                        var dv =  $('.cb');
                                        //数据详情
                                        var detail = pointArray[i].content;
                                        console.log( pointArray[i] );

                                        $( detail ).attr('id', 'tb-'+inddd+'');
                                        dv.append(detail);
                                        dv.append('<i class="Hui-iconfont clos">&#xe60b;</i>');
                                        dv.append('<div class="closes" style="display:none;"></div>');
                                        dv.css('display', 'none');
                                        //缓动动画
                                        dv.slideToggle("slow");
                                        isDo = false;
                                        //主体内容  信息窗口
                                        var sContent = pointArray[i].content;
                                        //标题
                                        var sTitle = pointArray[i].title;
                                        var infoOpt = { title: sTitle };
                                        if (pointArray[i].width) infoOpt.width = pointArray[i].width;
                                        sContent = "测点地址：<span style='background-color:#ff9429;' id=\"" + spanid + "\"></span>";
                                        infoOpt = '';
                                        var infoWindow = new BMap.InfoWindow(sContent, infoOpt);
                                        var mapAddr = pointArray[i].mapaddr;
                                        if (mapAddr) {
                                            //标记点
                                            var p = markers[i].getPosition();
                                             //逆地址
                                            var geo = new BMap.Geocoder();
                                            geo.getLocation(p, function (rs) {
                                                var wz = rs.address;
                                                map.openInfoWindow(infoWindow, p);
                                                document.getElementById(spanid).innerHTML = wz;
                                                // //信息窗口样式
                                                $('span[id]').parent().parent().css({
                                                    top: '40px',
                                                    height: "auto"
                                                });
                                                //图片加载完成后重绘
                                                infoWindow.redraw();
                                            });
                                        } else {
                                        map.openInfoWindow(infoWindow, markers[i].point);
                                        }
                                    }
                                    break;
                                    return false;
                            }
                        }
                    }
                }
            });

            // 经过图标高亮
            $('body').off('mousemove', '#left-panel ul:nth-child(1) li');
            $('body').on('mousemove', '#left-panel ul:nth-child(1) li', function (e) {
                var that = $(this);
                var inddd = $(this).attr('class').replace('ch sho info-', '');
                var lng = $(this).attr("data-lng");
                var lat = $(this).attr("data-lat");
                //匹配标记点
                for (var i = 0; i < markers.length; i++) {
                    if (lng == markers[i].point.lng && lat == markers[i].point.lat ) {
                        if (pIndex == pointArray.length) {
                            that.find('.ico').css({
                                background: "url(/static/mapImage/0"+icons[parseInt(inddd.slice(inddd.length-1))]+".png) no-repeat 0px 0px"
                            });
                        }
                    }
                }
            });

            // 离开图标还原
            $('body').off('mouseout', '#left-panel ul:nth-child(1) li');
            $('body').on('mouseout', '#left-panel ul:nth-child(1) li', function (e) {
                var that = $(this);
                var inddd = $(this).attr('class').replace('ch sho info-', '');
                var lng = $(this).attr("data-lng");
                var lat = $(this).attr("data-lat");
                //匹配标记点
                for (var i = 0; i < markers.length; i++) {
                    if (lng == markers[i].point.lng && lat == markers[i].point.lat ) {
                        if (pIndex == pointArray.length) {
                               that.find('.ico').css({
                                     background: "url(/static/mapImage/"+icons[parseInt(inddd.slice(inddd.length-1))]+".png) no-repeat 0px 0px"
                                });
                        }
                    }
                };
            });

            //关闭详情页
            $('body').off('click', '.clos');
            $('body').on('click', '.clos',  function (e) {
                $('.cb').slideToggle("slow");
                isDo = true;
                //图标还原
                var $li = $('#left-panel ul:nth-child(1) li');
                var $par = $(this).parent().parent();
                var inddd = $par.attr('class').replace('sho info-', '');
                $par.find('.ico').css({
                    background: "url(/static/mapImage/"+icons[parseInt((inddd.toString()).slice((inddd.toString()).length-1))]+".png) no-repeat 0px 0px"
                    });
                //阻止事件冒泡
                e.stopPropagation();
            });
            //经过关闭按钮
            $('body').off('mousemove', '.clos');
            $('body').on('mousemove', '.clos',  function (e) {
                this.style.cursor = 'default';
                $('.closes').show();
                //阻止事件冒泡
                e.stopPropagation();
            });
            //离开关闭按钮
            $('body').off('mouseout', '.clos');
            $('body').on('mouseout', '.clos',  function (e) {
                $('.closes').hide();
                //阻止事件冒泡
                e.stopPropagation();
            });

            //不加载详细地址
            if (mapAddr) {
                var spanid = "xxwz-" + Math.random().toString().substring(2, 6);
                sContent += "<br>地图地址：<span id=\"" + spanid + "\"></span>";
            }
            var infoOpt = { title: sTitle };
            if (pointArray[pIndex].width) infoOpt.width = pointArray[pIndex].width;
            sContent = "测点地址：<span style='background-color:#ff9429;' class='co' id=\"" + spanid + "\"></span>";
            infoOpt = '';
            var infoWindow = new BMap.InfoWindow(sContent, infoOpt);
            var iscl = true;
            //给点添加事件
            marker.addEventListener("click", function (e){
                if (iscl) {
                    if (mapAddr) {
                        var that = this;
                        var $li = $('#left-panel ul:nth-child(1) li');
                        //标记点坐标
                        var poi = marker.getPosition();
                        //逆地址解析
                        var gc = new BMap.Geocoder();
                        //异步
                        gc.getLocation(poi, function (rs) {
                            var addComp = rs.addressComponents;
                            var wz = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                            wz = rs.address;
                            map.openInfoWindow(infoWindow,point);
                            if (wz == '') wz = '定位失败';
                            document.getElementById(spanid).innerHTML = wz;
                            //信息窗口样式
                            $('span[id]').parent().parent().css({
                                top: '40px',
                                height: "auto"
                            });
                            //图片加载完成后重绘
                            infoWindow.redraw();
                            $.each( $li, function (nm,vl) {
                                        var inddd = $(vl).attr('class').replace('ch sho info-', '');
                                        var lng = $(vl).attr("data-lng");
                                        var lat = $(vl).attr("data-lat");
                                        //匹配标记点
                                        if (lng == that.point.lng && lat == that.point.lat ) {
                                            isInit = false;
                                            if (pIndex == pointArray.length) {
                                                //图标高亮
                                                console.log( $(vl) );
                                                $(vl).find('.ico').css({
                                                    background: "url(/static/mapImage/0"+icons[parseInt((inddd.toString()).slice((inddd.toString()).length-1))]+".png) no-repeat 0px 0px"
                                                    });
                                                return false;
                                            }
                                            return false;
                                        }
                            });
                            //关闭信息窗口
                            $('.BMap_bubble_content').parent().next().on('click', function (e) {
                                iscl = true;
                                isInit = true;
                                //图标还原
                                $.each( $li, function (nm,vl) {
                                        var inddd = $(vl).attr('class').replace('ch sho info-', '');
                                        var lng = $(vl).attr("data-lng");
                                        var lat = $(vl).attr("data-lat");
                                        //匹配标记点
                                        if (lng == that.point.lng && lat == that.point.lat ) {
                                            // isInit = false;
                                            if (pIndex == pointArray.length) {
                                                $(vl).find('.ico').css({
                                                    background: "url(/static/mapImage/"+icons[parseInt((inddd.toString()).slice((inddd.toString()).length-1))]+".png) no-repeat 0px 0px"
                                                    });
                                                return false;
                                            }
                                            return false;
                                        }
                                });
                            });
                            //点击标记点 打开信息窗口 显示地址信息 显示结果列表
                            //重复点击 不打开信息窗口  不显示结果列表
                            //关闭信息窗口 重复点击  打开信息窗口  不显示结果列表
                            //点击其他 打开信息窗口  显示地址信息  显示结果列表
                        });
                        //初始化结果列表
                        if (isInit) {
                                //侧边提示
                                $('.switch').css('display', 'block');
                                $('.con').show('slow');
                                var str = '';
                                iscl = false;
                                $.each(pointArray, function (i,v) {
                                    if (rpa[i].lng == that.point.lng && rpa[i].lat == that.point.lat ) {
                                        str +=  '<li class="ch sho info-'+i+'" data-lng="'+rpa[i].lng+'" data-lat="'+rpa[i].lat+'" style="padding:10px 10px 10px 10px;border-bottom:1px solid #dadada;"><span class="ico" style="display:inline-block;vertical-align:top;width:21px;height:30px;background:url(/static/mapImage/0'+icons[parseInt((i.toString()).slice((i.toString()).length-1))]+'.png) no-repeat 0px 0px;"></span><div style="margin:-28px 0px 0px 30px;color:#3385ff;">工程名称：'+v.projectName+'</div><div style="margin:8px 0px 0px 22px;">&nbsp;&nbsp;检测编号：'+v.serialNo+'</div><div style="margin:8px 0px 0px 30px;color:#ff9429;" class="typ">&nbsp;&nbsp;测试方法：'+v.type+'</div></li>' ;
                                        $('.con').html(str);
                                        $('#left-panel').css('height', 'auto');
                                        $('#left-panel').show("slow");
                                        var htm = $('.typ').html();
                                        if(htm=='&nbsp;&nbsp;测试方法：DY'){
                                           $('.typ').html('测试方法：低应变');
                                       }
                                       if(htm=='&nbsp;&nbsp;测试方法：GY'){
                                         $('.typ').html('测试方法：高应变');
                                       }
                                       if(htm=='&nbsp;&nbsp;测试方法：SC'){
                                         $('.typ').html('测试方法：声测');
                                       }
                                       if(htm=='&nbsp;&nbsp;测试方法：KS'){
                                           $('.typ').html('测试方法：地基系数k30');
                                       }
                                       if(htm=='&nbsp;&nbsp;测试方法：ED'){
                                         $('.typ').html('测试方法：动态变形模量EVd');
                                       }
                                       if(htm=='&nbsp;&nbsp;测试方法：YS'){
                                        $('.typ').html('测试方法：压实系数');
                                       }
                                       if(htm=='&nbsp;&nbsp;测试方法：JZ'){
                                        $('.typ').html('测试方法：静载');
                                       }
                                        return false;
                                    }
                                });
                        }
                    } else {
                        map.openInfoWindow(infoWindow,point);
                    }
                }
            });
            marker.addEventListener("mouseover", function (e){
                    var that = this;
                    var $li = $('#left-panel ul:nth-child(1) li');
                    //标记点坐标
                    var pois = marker.getPosition();
                    //逆地址解析
                    var gcs = new BMap.Geocoder();
                    //异步
                    gcs.getLocation(pois, function (rs) {
                        $.each( $li, function (nm,vl) {
                                    var inddd = $(vl).attr('class').replace('ch sho info-', '');
                                    var lng = $(vl).attr("data-lng");
                                    var lat = $(vl).attr("data-lat");
                                    //匹配标记点
                                    if (lng == that.point.lng && lat == that.point.lat ) {
                                        if (pIndex == pointArray.length) {
                                            //图标高亮
                                            $(vl).find('.ico').css({
                                                background: "url(/static/mapImage/0"+icons[parseInt((inddd.toString()).slice((inddd.toString()).length-1))]+".png) no-repeat 0px 0px"
                                                });
                                            return false;
                                        }
                                    }
                        });
                    });
            });
            marker.addEventListener("mouseout", function (e){
                    var that = this;
                    var $li = $('#left-panel ul:nth-child(1) li');
                    //标记点坐标
                    var poiss = marker.getPosition();
                    //逆地址解析
                    var gcss = new BMap.Geocoder();
                    //异步
                    gcss.getLocation(poiss, function (rs) {
                        $.each( $li, function (nm,vl) {
                                    var inddd = $(vl).attr('class').replace('ch sho info-', '');
                                    var lng = $(vl).attr("data-lng");
                                    var lat = $(vl).attr("data-lat");
                                    //匹配标记点
                                    if (lng == that.point.lng && lat == that.point.lat ) {
                                        if (pIndex == pointArray.length) {
                                            //图标还原
                                            $(vl).find('.ico').css({
                                                background: "url(/static/mapImage/"+icons[parseInt((inddd.toString()).slice((inddd.toString()).length-1))]+".png) no-repeat 0px 0px"
                                                });
                                            return false;
                                        }
                                    }
                        });
                    });
            });
            pCompleted++;
            pIndex++;
        }, 16);
    }
}