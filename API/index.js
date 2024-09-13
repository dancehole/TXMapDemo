// index.html 对应js逻辑

// 程序基本逻辑：类似于 共享位置信息，区别在于轮询信息 + 动画展示
var MAP // 全局变量：地图对象
var NAME // 用户名
var is_Animating = false

// 显示自定义模态框
function showPrompt() {
  const n = getCookie('name')
  console.log(n)
  if (n !== null && n !== '') {
    NAME = n
    document.getElementById('customPrompt').style.display = 'none';
    getLocation()
  } else {
    document.getElementById('customPrompt').style.display = 'block';
  }
}

function getCookie(name) {
  var cookieArr = document.cookie.split('; '); // 将cookie字符串分割成多个条目
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split('='); // 分割键值对
    if (name == cookiePair[0]) { // 如果找到了匹配的键
      // 解码Cookie值并返回
      return decodeURIComponent(cookiePair[1]);
    }
  }
  // 如果没有找到匹配的键，返回null
  return null;
}

function setCookie(name, value, daysToExpire) {
  /**
   * 设置Cookie
   * 
   * @param {string} name - Cookie的名称
   * @param {string} value - Cookie的值
   * @param {number} daysToExpire - Cookie过期的天数，如果不设置则默认为会话Cookie（关闭浏览器即失效）
   */
  var expires = "";
  if (daysToExpire) {
    var date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// 处理用户点击确定按钮的逻辑【程序入口文件】
function handleConfirm() {
  const name = document.getElementById('promptInput').value;
  setCookie('name', name, 1); // 把名字放到cookie里，这样刷新页面的时候，还能拿到用户输入的内容/不用每次都输入名字
  console.log('用户输入的内容：', name)
  document.getElementById('customPrompt').style.display = 'none';
  // 更新地图
  getLocation();
}

// 获取位置权限，并通过showPosition和showError回调展示（本身不返回值）
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    console.error('当前浏览器不支持地理定位')
  }
}

// 上传自己的信息，同时下拉别人的信息(info:{name:,latitude:,longitude:})
async function getAndPostPosition(info) {
  try {
    // 提交fetch请求=>上传位置信息=>下拉所有人的位置信息
    let response = await fetch("https://dancehole.cn:8082/submit_location", {
      method: "POST",
      body: JSON.stringify(info),
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      console.log("提交成功！", response);
      return response.json();
    } else {
      console.error("提交失败，请重试！", response);
    }
  } catch (error) {
    console.log(error);
  }
  return null
}

function calculateMid(hasLoaded) {
  let sumLatitudes = 0;
  let sumLongitudes = 0;
  let count = hasLoaded.length;

  for (let location of hasLoaded) {
    console.log(location)
    sumLatitudes += location.latitude;
    sumLongitudes += location.longitude;
  }

  console.log(sumLatitudes / count, sumLongitudes / count);
  const mid = {
    latitude: sumLatitudes / count,
    longitude: sumLongitudes / count
  }

  // 打标
  document.getElementById('text').innerHTML = '正在计算中心！'
  const tmpLocate = new qq.maps.LatLng(mid.latitude, mid.longitude);
  MAP.panTo(tmpLocate);
  MAP.zoomTo(12);

  const marker = new qq.maps.Marker({
    position: tmpLocate,
    animation: qq.maps.MarkerAnimation.DROP,
    map: MAP
  });

  // 进行打标和文本提示
  setTimeout(() => {


    setTimeout(() => {
      var label = new qq.maps.Label({
        position: tmpLocate,
        map: MAP,
        content: res.name
      });

      is_Animating = false  // set false
      document.getElementById('text').innerHTML = ''
    }, 1000);
    MAP.zoomTo(16);
  }, 2500);


  return {
    averageLatitude: sumLatitudes / count,
    averageLongitude: sumLongitudes / count
  };
}

async function render(res) {
  is_Animating = true
  document.getElementById('text').innerHTML = '检测到' + res.name + '的位置！'
  // 缩小画面，展示其他人的位置信息【计算中心位置】

  // 渲染
  const tmpLocate = new qq.maps.LatLng(res.latitude, res.longitude);
  MAP.panTo(tmpLocate);
  MAP.zoomTo(12);

  const marker = new qq.maps.Marker({
    position: tmpLocate,
    animation: qq.maps.MarkerAnimation.DROP,
    map: MAP
  });

  // 进行打标和文本提示
  setTimeout(() => {

    MAP.zoomTo(16);

    setTimeout(() => {
      var label = new qq.maps.Label({
        position: tmpLocate,
        map: MAP,
        content: res.name
      });

      is_Animating = false  // set false
      document.getElementById('text').innerHTML = ''
    }, 1000);
  }, 2500);
}
// 主函数
async function loop(curr) {

  const initialInterval = 7000; // 初始时间间隔，单位毫秒
  const params = {
    name: document.getElementById('promptInput').value,
    latitude: curr.latitude,
    longitude: curr.longitude
  }

  // 轮询=>渲染
  const hasLoaded = [params.name] // 已经渲染过的名字
  const hasLoadedAll = [params]
  let is_calculated = false;

  const timer = setInterval(() => {
    const res = getAndPostPosition(params);
    res.then(data => {
      if (data.length > 0) {
        data.forEach(item => {
          if (!hasLoaded.includes(item.name) && !is_Animating) {
            hasLoaded.push(item.name);
            hasLoadedAll.push(item)
            render(item);
          }
        })
      }
    })

    if (hasLoaded.length === 4 && !is_calculated) {
      is_calculated = true
      calculateMid(hasLoadedAll)
    }

  }, initialInterval);
}

// 获取定位成功，显示位置信息
async function showPosition(position) {
  var curr = position.coords

  // 发请求,不求结果
  const params = {
    name: document.getElementById('promptInput').value,
    latitude: curr.latitude,
    longitude: curr.longitude
  }
  getAndPostPosition(params);

  console.log(
    'Latitude(纬度): ' + position.coords.latitude + // 纬度
    '<br>Longitude(经度): ' + position.coords.longitude // 经度
  )

  // 给自己设置
  MAP.panTo(new qq.maps.LatLng(position.coords.latitude, position.coords.longitude));
  MAP.zoomTo(16);
  // 打标
  setTimeout(function () {
    new qq.maps.Marker({
      position: new qq.maps.LatLng(position.coords.latitude, position.coords.longitude),
      animation: qq.maps.MarkerAnimation.DROP,
      map: MAP
    });
    //marker.setAnimation(qq.maps.Animation.DROP);
  }, 1000);

  // 文本提示
  new qq.maps.Label({
    position: new qq.maps.LatLng(position.coords.latitude, position.coords.longitude),
    map: MAP,
    content: params.name
  });

  // 跳转去loop 监听
  loop(curr)
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

// 初始化地图
window.onload = function () {

  // 检查是否需要输入名字
  showPrompt()
  try {
    // 初始化地图为gz
    init({ latitude: 23.13586376420126, longitude: 113.3245201066893 });
  } catch (error) {
    console.error("获取位置失败:", error);
  }
}