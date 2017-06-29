/**
 * Created by RS on 2017/3/30.
 */
function  baiduMap(obj, p1,p2, content ,title) {
    debugger;
    //创建Map实例
    var map = new BMap.Map(obj);
    var ggPoint = new BMap.Point(p1, p2);
    map.centerAndZoom(ggPoint, 18);
    map.setCenter(ggPoint);

    map.addControl(new BMap.NavigationControl());
    //坐标转换完之后的回调函数
    translateCallback = function (data){
        if(data.status === 0) {
            var marker = new BMap.Marker(data.points[0]);// 创建标注

            map.setCenter(data.points[0]);


            map.addOverlay(marker);              // 将标注添加到地图中

            var opts = {
                title: title, // 信息窗口标题
            }
            //marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

            var infoWindow = new BMap.InfoWindow(content, opts);  // 创建信息窗口对象
            map.openInfoWindow(infoWindow, data.points[0]); //开启信息窗口
            marker.addEventListener("click", function () {
                map.openInfoWindow(infoWindow, data.points[0]); //开启信息窗口
            });

            map.addEventListener("zoomend", function () {
                map.setCenter(data.points[0]);
            });



        }
    }

    setTimeout(function(){
        var convertor = new BMap.Convertor();
        var pointArr = [];
        pointArr.push(ggPoint);
        convertor.translate(pointArr, 1, 5, translateCallback)
    }, 1000);

    //map.setViewport(point);
    //map.panBy(305,165);
//添加鼠标滚动缩放
    map.enableScrollWheelZoom();

//添加缩略图控件
    map.addControl(new BMap.OverviewMapControl({isOpen: false, anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));
//添加缩放平移控件
    map.addControl(new BMap.NavigationControl());
//添加比例尺控件
    map.addControl(new BMap.ScaleControl());

    //map.disableDragging();     //禁止拖拽
//添加地图类型控件
//map.addControl(new BMap.MapTypeControl());

////设置标注的图标
//    var icon = new BMap.Icon("img/icon.jpg", new BMap.Size(100, 100));





}