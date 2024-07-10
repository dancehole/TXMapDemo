// 封装常用的一些方法【与地图有关】

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


// GeoLocationUtils.js
/**
 * 获取地理位置信息的工具类
 */
class GeoLocationUtils {
  /**
   * 获取当前位置信息
   * @param {Function} onSuccess 成功回调函数，接收position参数[position.coords.latitude]
   * @param {Function} onError 失败回调函数，接收error参数
   */
  static async getLocation(onSuccess, onError) {
    if (!navigator.geolocation) {
      onError && onError(new Error('当前浏览器不支持地理定位'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        onSuccess && onSuccess(position);
      },
      error => {
        onError && onError(error);
      }
    );
  }
}

export default GeoLocationUtils;