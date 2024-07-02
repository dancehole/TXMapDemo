// index.html 对应js逻辑


// 程序基本逻辑：类似于 共享位置信息，区别在于轮询信息 + 动画展示

var MAP
async function getLocation() {
  if (await navigator.geolocation) {
    return navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    console.error('当前浏览器不支持地理定位')
  }
}
// 获取定位成功，显示位置信息
async function showPosition(position) {
  var curr = position.coords
  console.log(
    'Latitude(纬度): ' + position.coords.latitude + // 纬度
    '<br>Longitude(经度): ' + position.coords.longitude // 经度
  )
  MAP.panTo(new qq.maps.LatLng(position.coords.latitude, position.coords.longitude));
  MAP.zoomTo(16);
  // 打标
  setTimeout(function () {
    const marker = new qq.maps.Marker({
      position: new qq.maps.LatLng(position.coords.latitude, position.coords.longitude),
      animation: qq.maps.MarkerAnimation.DROP,
      map: MAP
    });
    //marker.setAnimation(qq.maps.Animation.DROP);
  }, 1000);

  // 弹出输入框
  const name = await prompt("请输入您的名字:");
  console.log(name)

  // 文本提示
  var label = new qq.maps.Label({
    position: new qq.maps.LatLng(position.coords.latitude, position.coords.longitude),
    map: MAP,
    content: name
  });

  try {
    // 提交fetch请求=>上传位置信息=>下拉所有人的位置信息
    let response = await fetch("https://example.com/submit", {
      method: "GET",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      alert("提交成功！");
    } else {
      alert("提交失败，请重试！");
    }
  } catch (error) {
    console.log(error);
  }

  // 缩小画面，展示其他人的位置信息【计算中心位置】
  response = [{
    "name": "aaa",
    "latitude": 23.135259591059862,
    "longitude": 113.32640785925591
  },
  {
    "name": "bbb",
    "latitude": 23.135852591059862,
    "longitude": 113.32312785925591
  },
  {
    "name": "ccc",
    "latitude": 23.135852591059862,
    "longitude": 113.31215785925591
  },
  ]

  // 循环渲染
  response.forEach((element, index) => {
    setTimeout(() => {
      const tmpLocate = new qq.maps.LatLng(element.latitude, element.longitude);
      MAP.panTo(tmpLocate);
      MAP.zoomTo(16);

      // 进行打标和文本提示
      setTimeout(() => {
        const marker = new qq.maps.Marker({
          position: tmpLocate,
          animation: qq.maps.MarkerAnimation.DROP,
          map: MAP
        });

        var label = new qq.maps.Label({
          position: tmpLocate,
          map: MAP,
          content: element.name
        });
      }, 2000);
    }, index * 4000); // 根据索引乘以延迟时间，以实现逐个渲染位置信息的效果
    console.log('move to:', element)
  });

  // 打完标后，计算中心距离
  // 计算中心位置
  const centerPos = {
    lat: response.reduce((sumLat, item) => sumLat + item.latitude, 0) / response.length,
    lng: response.reduce((sumLng, item) => sumLng + item.longitude, 0) / response.length
  };

  console.log('Center Position:', centerPos);

  // 平移到中心位置
  const centerLatLng = new qq.maps.LatLng(centerPos.lat, centerPos.lng);
  MAP.panTo(centerLatLng);
  MAP.zoomTo(16);

  const marker = new qq.maps.Marker({
    position: centerLatLng,
    animation: qq.maps.MarkerAnimation.DROP,
    map: MAP
  });

  var label = new qq.maps.Label({
    position: centerLatLng,
    map: MAP,
    content: 'Center Position'
  });

  return curr
}
// 获取定位失败，显示错误信息
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log = ('用户拒绝地理定位请求')
      break;
  }
}

//初始化地图函数  自定义函数名init
var init = function (curr) {
  //定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
  MAP = new qq.maps.Map(document.getElementById("container"), {
    center: new qq.maps.LatLng(curr.latitude, curr.longitude),      // 地图的中心地理坐标。
    zoom: 10     // 放大倍数（8为区域级 4为国家级 10为市县级）
  });
}

window.onload = async function () {
  try {
    // 初始化地图为gz
    init({ latitude: 23.13586376420126, longitude: 113.3245201066893 });

    // 更新地图
    await getLocation();

  } catch (error) {
    console.error("获取位置失败:", error);
  }

}