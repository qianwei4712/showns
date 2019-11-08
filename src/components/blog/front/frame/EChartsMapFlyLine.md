
以官方示例为起点进行修改：<https://www.echartsjs.com/gallery/editor.html?c=scatter-map> 



若自行绘制html进行尝试，请记得引入中国地图或者世界地图js

```html
< script type="text/javascript" src="http://echarts.baidu.com/gallery/vendors/echarts/map/js/world.js"></script>
< script type="text/javascript" src="http://echarts.baidu.com/gallery/vendors/echarts/map/js/china.js"></script>
```

> 世界地图的使用方式与中国地图相同，需要更换的就是坐标而已。



首先将 `option` 中无关项去除，如 `title`，`tooltip`，`visualMap`，`legend`；

保留下顶部 `geoCoordMap` 数组，这个数组是城市对应的坐标，灰常重要。。。全靠这个坐标

然后清空  `series` ，并修改  `convertData` 方法如下

```javascript
 var convertData = function (data) {
     var res = [];
     for (var i = 0; i < data.length; i++) {
         var dataItem = data[i];
         var fromCoord = geoCoordMap[dataItem[0].name];
         var toCoord = geoCoordMap[dataItem[1].name];
         if (fromCoord && toCoord) {
             res.push([{
                 coord: fromCoord
             }, {
                 coord: toCoord
             }]);
         }
     }
     return res;
 };
```

这个 `convertData`  的作用是将中文位置转为经纬度坐标；

**必须是  `geoCoordMap` 内包含的坐标，不然无法获得经纬度**；



`series` 属性内可以同时生效多个图标，可以产生组合效应，这里就只展示最简单的如下

```javascript
series: [
        {
            type: 'lines',
            zlevel: 10,
            effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                color: 'red',
                symbolSize: 3
            },
            lineStyle: {
                normal: {
                    color: '#a6c84c',
                    width: 0,
                    curveness: 0.4
                }
            },
            data: convertData([[{name:'北京'},{name:'宁波'}],
                               [{name:'宁波'},{name:'兰州'}],
                               [{name:'南京'},{name:'重庆'}]])
        }
    ]
```

这里绘制了三条线，效果如下图

![Image text](http://oss.huqianwei.com/data/EChartsMapFlyLine1.png) 

为飞线添加轨迹，只需在加一个 `series`  图形

```javascript
series: [
        {
            type: 'lines',
            zlevel: 10,
            effect: {
                show: true,
                period: 6,
                trailLength: 0.7,
                color: 'red',
                symbolSize: 3
            },
            lineStyle: {
                normal: {
                    color: '#a6c84c',
                    width: 0,
                    curveness: 0.4
                }
            },
            data: convertData([[{name:'北京'},{name:'宁波'}],
                               [{name:'宁波'},{name:'兰州'}],
                               [{name:'南京'},{name:'重庆'}]])
        },
        {
            type: 'lines',
            zlevel: 2,
            effect: {
                show: true,
                period: 6,
                trailLength: 0,
            },
            lineStyle: {
                normal: {
                    color: 'white',
                    width: 2,
                    opacity: 0.4,
                    curveness: 0.4
                }
            },
            data: convertData([[{name:'北京'},{name:'宁波'}],
                               [{name:'宁波'},{name:'兰州'}],
                               [{name:'南京'},{name:'重庆'}]])
        }
    ]
```
如想更换飞线图标，只需要更换 `symbolSize` 属性，这个svg图标代码网上搜一下吧
效果请自行尝试。。
 
