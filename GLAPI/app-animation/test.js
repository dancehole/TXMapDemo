function startReplayTest(drawnPath) {
  start()
  var roation;
  var position;
  var path = [
    new TMap.LatLng(39.98481500648338, 116.30571126937866),
    new TMap.LatLng(39.982266575222155, 116.30596876144409),
    new TMap.LatLng(39.982348784165886, 116.3111400604248)
  ];
  
  // MultiPolyline文档：https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocVector#1
  var polylineLayer = new TMap.MultiPolyline({
    map, // 绘制到目标地图
    // 折线样式定义
    styles: {
      style_blue: new TMap.PolylineStyle({
        color: '#2A88FF', // 线填充色
        width: 8, // 折线宽度
        borderWidth: 3, // 边线宽度
        borderColor: '#0569FF', // 边线颜色
        lineCap: 'round', // 线端头方式
        showArrow: true
      }),
      style_gray: new TMap.PolylineStyle({
        color: '#ccc', // 线填充色
        width: 8, // 折线宽度
        borderWidth: 3, // 边线宽度
        borderColor: '#FFF', // 边线颜色
        lineCap: 'round' // 线端头方式
      })
    },
    geometries: [
      {
        id: 'path1',
        styleId: 'style_blue',
        paths: path
      },
      {
        id: 'path2',
        styleId: 'style_blue',
        paths: path
      }
    ]
  });
  // marker文档：https://lbs.qq.com/webApi/javascriptGL/glDoc/glDocMarker
  var marker = new TMap.MultiMarker({
    id: 'car',
    map,
    styles: {
      'car-down': new TMap.MarkerStyle({
        width: 48,
        height: 72,
        anchor: {
          x: 24,
          y: 36
        },
        faceTo: 'map',
        rotate: 180,
        src: 'https://mapapi.qq.com/web/mapComponents/componentsTest/zyTest/static/model_taxi.png?a=1'
      }),
      start: new TMap.MarkerStyle({
        anchor: {
          x: 16,
          y: 32
        },
        src: 'https://mapapi.qq.com/web/miniprogram/demoCenter/images/marker-start.png'
      }),
      end: new TMap.MarkerStyle({
        src: 'https://mapapi.qq.com/web/miniprogram/demoCenter/images/marker-end.png'
      })
    },
    geometries: [
      {
        id: 'car',
        styleId: 'car-down',
        position: path[0]
      },
      {
        id: 'start',
        styleId: 'start',
        position: path[0]
      },
      {
        id: 'end',
        styleId: 'end',
        position: path[2]
      }
    ]
  });
  function carMove() {
    map.off('idle', carMove);
    marker.moveAlong(
      {
        car: {
          path,
          speed: 200
        }
      },
      {
        autoRotation: true
      }
    );
  }
  marker.on('moving', function (e) {
    if (!e.car) return;
    roation = TMap.geometry.computeHeading(
      e.car.passedLatLngs[e.car.passedLatLngs.length - 2],
      e.car.passedLatLngs[e.car.passedLatLngs.length - 1]
    );
    position = TMap.geometry.computeDestination(
      marker.getGeometryById('car').position,
      roation,
      60
    );
    map.easeTo(
      {
        center: position,
        rotation: e.car.angle && e.car.angle,
        zoom: 20,
        pitch: 70
      },
      {
        duration: 300
      }
    );
    // 移动路线置灰
    polylineLayer.updateGeometries([
      {
        id: 'path2',
        styleId: 'style_gray',
        paths: e.car.passedLatLngs
      }
    ]);
  });

  function start() {
    // 禁用编辑器
    editor.disable()
    map.easeTo(
      {
        zoom: 20,
        rotation: 180,
        pitch: 80
      },
      {
        duration: 1000
      }
    );
    map.on('idle', carMove);
  };

  // 移动回全局播放
  function end() {
    marker.stopMove();
    polylineLayer.setGeometries([
      {
        id: 'path1',
        styleId: 'style_blue',
        paths: path
      },
      {
        id: 'path2',
        styleId: 'style_blue',
        paths: path
      }
    ]);
    marker.setGeometries([
      {
        id: 'car',
        styleId: 'car-down',
        position: new TMap.LatLng(39.98481500648338, 116.30571126937866)
      },
      {
        id: 'start',
        styleId: 'start',
        position: new TMap.LatLng(39.98481500648338, 116.30571126937866)
      },
      {
        id: 'end',
        styleId: 'end',
        position: new TMap.LatLng(39.982348784165886, 116.3111400604248)
      }
    ]);
    map.easeTo({
      center,
      zoom: 16,
      rotation: 0,
      pitch: 0
    });
  };
}
