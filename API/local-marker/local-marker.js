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

document.addEventListener('DOMContentLoaded', () => {
  setupGeoLocation();
});

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
  { "text": "文字1", "button": "按钮2", "event": () => { event_b() } },
  { "text": "文字1", "button": "按钮2", "event": () => { event_b() } },
  { "text": "文字1", "button": "按钮2", "event": () => { event_b() } },
  { "text": "文字1", "button": "按钮2", "event": () => { event_b() } },
  { "text": "文字1", "button": "按钮2", "event": () => { event_b() } },
  { "text": "文字1", "button": "按钮2", "event": () => { event_b() } },
  { "text": "文字1", "button": "按钮2", "event": () => { event_b() } },
  { "text": "文字1", "button": "按钮2", "event": () => { event_b() } },
  { "text": "文字1", "button": "按钮2", "event": () => { event_b() } },
  { "text": "文字1", "button": "按钮2", "event": () => { event_b() } },
  { "text": "文字1", "button": "按钮2", "event": () => { event_b() } },
  { "text": "文字1", "button": "按钮2", "event": () => { event_b() } },
]
content.forEach((item, index) => {
  const id = `${index}`
  createButtonGroup(id, item.text, item.button, item.event)
})


// 开始标记 再次点击结束标记并清除
const event_a = () => {
  //添加监听事件  获取鼠标点击事件
  const marker = []
  qq.maps.event.addListener(MAP, 'click', function (event) {
    marker.push = new qq.maps.Marker({
      position: event.latLng,
      map: MAP
    });
  });
}
const event_b = () => {
  console.log('event_b')
}