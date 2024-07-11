import GeoLocationUtils from './utils.js';
let MAP // 全局变量方便

// initmap在闭包内无定义，所以要移除闭包，定义为全局函数 
window.initMap = () => {
  const mapOptions = {
    zoom: 5,
    center: new qq.maps.LatLng(39.916527, 116.397128),
    mapTypeId: qq.maps.MapTypeId.ROADMAP,
  };

  const map = new qq.maps.Map(document.getElementById('container'), mapOptions);

  // Optional: 添加点击地图事件，打印console,可以
  const mapClickListener = qq.maps.event.addListener(map, 'click', function (event) {
    console.log('您点击的位置为: [' + event.latLng.getLat() + ', ' +
      event.latLng.getLng() + ']');
  });

  // 可以手动移除绑定点击事件
  // window.removeEvent = function () {
  //   qq.maps.event.removeListener(mapClickListener);
  // };

  // Optional: 添加绘图工具【需要引入js】
  var drawingManager = new qq.maps.drawing.DrawingManager({
    drawingMode: qq.maps.drawing.OverlayType.MARKER,
    drawingControl: true,
    drawingControlOptions: {
      position: qq.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        qq.maps.drawing.OverlayType.MARKER,
        qq.maps.drawing.OverlayType.CIRCLE,
        qq.maps.drawing.OverlayType.POLYGON,
        qq.maps.drawing.OverlayType.POLYLINE,
        qq.maps.drawing.OverlayType.RECTANGLE
      ]
    },
    circleOptions: {
      fillColor: new qq.maps.Color(255, 208, 70, 0.3),
      strokeColor: new qq.maps.Color(88, 88, 88, 1),
      strokeWeight: 3,
      clickable: false
    }
  });
  drawingManager.setMap(map);

  return map;
};

// 更新位置信息：打点，做记号（）
const updateMap = (map, position) => {
  map.panTo(new qq.maps.LatLng(position.coords.latitude, position.coords.longitude));
  map.setZoom(16);

  setTimeout(() => {
    new qq.maps.Marker({
      position: new qq.maps.LatLng(position.coords.latitude, position.coords.longitude),
      animation: qq.maps.MarkerAnimation.DROP,
      map,
    });

    new qq.maps.Label({
      position: new qq.maps.LatLng(position.coords.latitude, position.coords.longitude),
      map,
      content: 'Your Position',
    });
  }, 1000);
};

const handlePosition = (map, position) => {
  console.log('position:', position, '\n map:', map)
  console.log(`Latitude: ${position.coords.latitude}\nLongitude: ${position.coords.longitude}`);
  updateMap(map, position);
};

const handleError = (error) => {
  console.error('Error occurred while getting location:', error);
};

const setupGeoLocation = () => {
  const map = initMap();
  MAP = map;
  // 这里用原型链附带参数的方式携带map，但是可读性很差
  GeoLocationUtils.getLocation(handlePosition.bind(null, map), handleError);
};

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  setupGeoLocation();
});

// 重新获取定位，第一个按钮
document.getElementById('reLocateEvent').addEventListener('click', () => {
  GeoLocationUtils.getLocation(handlePosition.bind(null, MAP), handleError);
})

// 创建带有事件的group div
const createButtonGroup = (ID, text, buttonText, event) => {
  const str = `
    <p id="BG-text-${ID}">${text}</p>
    <button id="BG-button-${ID}" class="button">${buttonText}</button>
  `
  // 加入html
  const group = document.createElement('div')
  group.className = 'button-text-group'
  group.innerHTML = str
  document.getElementById('console').appendChild(group)

  // 添加事件
  document.getElementById(`BG-button-${ID}`).addEventListener('click', event)
}


// 动态生成鼠标点击事件
const content = [
  { "text": "marker标记", "button": "开始标记监听", "event": () => { event_a() } },
  { "text": "清除标记", "button": "清除标记", "event": () => { event_b() } },
  { "text": "创建热力图", "button": "创建热力图", "event": () => { event_c() } },
  { "text": "删除热力图", "button": "删除热力图", "event": () => { event_d() } },
  { "text": "文字1", "button": "按钮2", "event": () => { event_b() } }
]
content.forEach((item, index) => {
  const id = `${index}`
  createButtonGroup(id, item.text, item.button, item.event)
})


// 开始标记 再次点击结束标记并清除
const markerList = []
const event_a = () => {
  //添加监听事件  获取鼠标点击事件
  qq.maps.event.addListener(MAP, 'click', function (event) {
    // optional
    var anchor = new qq.maps.Point(10, 30);
    var size = new qq.maps.Size(32, 30);
    var origin = new qq.maps.Point(0, 0);
    var icon = new qq.maps.MarkerImage('https://mapapi.qq.com/web/lbs/javascriptV2/demo/img/plane.png', size, origin, anchor);
    size = new qq.maps.Size(52, 30);
    var originShadow = new qq.maps.Point(32, 0);
    var shadow = new qq.maps.MarkerImage(
      'https://mapapi.qq.com/web/lbs/javascriptV2/demo/img/plane.png',
      size,
      originShadow,
      anchor
    );
    // optional end

    const marker = new qq.maps.Marker({
      icon: icon, // optional，自定义标记
      shadow: shadow, // optional,自定义阴影
      animation: qq.maps.MarkerAnimation.DROP, // Optional可选，增加一个动画 BOUNCE跳动，DROP下落
      draggable: true, // Optional可选，是否可拖拽
      position: event.latLng,
      map: MAP
    })
    markerList.push(marker)

    // Optional:为marker添加点击监听
    const infoWin = new qq.maps.InfoWindow({
      map: MAP
    });
    // 弹出一个信息窗口
    qq.maps.event.addListener(marker, 'click', function () {
      infoWin.open()
      infoWin.setContent('<div style="text-align:center;white-space:' +
        'nowrap;margin:10px;">这是个标注(3秒后关闭)</div>') // 如果需要自定义，需要额外的逻辑
      infoWin.setPosition(event.latLng)
      setTimeout(() => {
        infoWin.close()
      }, 3000)
    });
  });
}

// 清除标记，移除覆盖层
const event_b = () => {
  if (markerList) {
    for (let i in markerList) {
      markerList[i].setMap(null);
    }
    markerList.length = 0
  }
}

const event_c = () => {
  console.log('热力图并没有好用的场景，就算了')
}

const event_d = () => {
  
}