import GeoLocationUtils from './utils.js';

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

const handlePosition = (map,position) => {
  console.log('position:',position,'\n map:',map)
  console.log(`Latitude: ${position.coords.latitude}\nLongitude: ${position.coords.longitude}`);
  updateMap(map, position);
};

const handleError = (error) => {
  console.error('Error occurred while getting location:', error);
};

const setupGeoLocation = () => {
  const map = initMap();
  GeoLocationUtils.getLocation(handlePosition.bind(null,map), handleError);
};

document.addEventListener('DOMContentLoaded', () => {
  setupGeoLocation();
});