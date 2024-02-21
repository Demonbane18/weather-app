const tomTom = {
  key: 'Tsgxuwl2a1qJMDhI3j5rZS9xzsG8UqGF',
  // mapPadding: 40,
  map: null,
  popup: null,
  // searchZoom: 11,
};

const openWeatherMap = {
  appid: 'Tsgxuwl2a1qJMDhI3j5rZS9xzsG8UqGF',
  tileUrl:
    'https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=6be4c73603d24111b5b1a6972d8bd56d',
  layer: '',
  layerName: 'owm_layer',
  sourceName: 'owm_source',
  attribution: 'OpenWeatherMap.org',
  units: 'imperial',
  directions: [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ],
  maxDegree: 360,
};

const ids = {
  html: {
    map: 'map',
    location: 'location',
    imperial: 'imperial',
    metric: 'metric',
  },
};

init();

function appendHeading(element, text) {
  const h3 = document.createElement('H3');
  h3.appendChild(document.createTextNode(text));
  element.appendChild(h3);
}

function appendIcon(element, icon) {
  const img = document.createElement('IMG');
  img.src = 'http://openweathermap.org/img/wn/' + icon + '.png';
  element.appendChild(img);
}

function appendLine(element, text, withoutBreak) {
  element.appendChild(document.createTextNode(text));
  if (!withoutBreak) element.appendChild(document.createElement('BR'));
}

function clearLayer() {
  if (tomTom.map.getLayer(openWeatherMap.layerName))
    tomTom.map.removeLayer(openWeatherMap.layerName);

  if (tomTom.map.getSource(openWeatherMap.sourceName))
    tomTom.map.removeSource(openWeatherMap.sourceName);
}

function displayPopup(response, location) {
  if (!tomTom.map.loaded()) return;

  clearPopup();

  if (response.hasOwnProperty('cod') && response.hasOwnProperty('message')) {
    alert('Error: ' + response.message);
    return;
  }

  tomTom.popup = new tt.Popup({ maxWidth: 'none' })
    .setLngLat(location)
    .setDOMContent(formatText(response))
    .addTo(tomTom.map);
}

function clearPopup() {
  if (tomTom.popup == null) return;

  tomTom.popup.remove();
  tomTom.popup = null;
}

function formatText(response) {
  const weather = response.weather[0];
  const tempUnits = openWeatherMap.units == 'imperial' ? 'F' : 'C';
  const temp = Math.round(response.main.temp);

  const outerDiv = document.createElement('DIV');
  outerDiv.classList.add('popup');

  appendIcon(outerDiv, weather.icon);
  appendHeading(outerDiv, getName(response));

  const innerDiv = document.createElement('DIV');
  outerDiv.appendChild(innerDiv);

  appendLine(innerDiv, weather.description);
  appendLine(innerDiv, 'Temperature: ' + temp + ' ' + tempUnits);
  appendLine(innerDiv, 'Humidity: ' + response.main.humidity + '%');
  appendLine(innerDiv, 'Wind Speed: ' + formatWind(response.wind), true);
  return outerDiv;
}

function formatWind(wind) {
  const units = openWeatherMap.units == 'imperial' ? 'mph' : 'km/h';
  const speed = Math.round(wind.speed) + ' ' + units;
  const direction = getDirection(wind.deg);
  return direction == null ? speed : direction + ' ' + speed;
}

function getCurrentWeatherData(clickEvent) {
  currentWeatherData({
    appid: openWeatherMap.appid,
    lat: clickEvent.lngLat.lat,
    lon: clickEvent.lngLat.lng,
    units: openWeatherMap.units,
  })
    .go()
    .then(function (response) {
      displayPopup(response, clickEvent.lngLat);
    })
    .catch(function (error) {
      clearPopup();

      const message = error.hasOwnProperty('message') ? error.message : error;
      alert('Error: ' + message);
    });
}

function getDirection(degrees) {
  const increment = openWeatherMap.maxDegree / openWeatherMap.directions.length;
  return degrees >= 0 && degrees < openWeatherMap.maxDegree
    ? openWeatherMap.directions[Math.floor(degrees / increment)]
    : null;
}

function getLocation(response) {
  if (response.results.length > 0) return response.results[0];

  alert('Could not find location.');
  return null;
}

function getName(response) {
  const name = response.hasOwnProperty('name') ? response.name : '';
  return name == null || name == ''
    ? 'lat=' + response.coord.lat + ', lon=' + response.coord.lon
    : name;
}

function getValue(elementId) {
  return document.getElementById(elementId).value;
}

function init() {
  const CENTER = { lng: 121.021569, lat: 14.59375 };
  tomTom.map = tt
    // .map({
    //   key: tomTom.key,
    //   container: ids.html.map,
    //   center: CENTER,
    //   zoom: 10,
    //   dragPan: !window.isMobileOrTablet(),
    // })
    .on('click', getCurrentWeatherData);
}

function updateLayer(element) {
  openWeatherMap.layer = element.options[element.selectedIndex].value;

  if (!tomTom.map.loaded()) return;

  clearLayer();
  clearPopup();

  const tileUrl = openWeatherMap.tileUrl
    .replace('{layer}', openWeatherMap.layer)
    .replace('{appid}', openWeatherMap.appid);

  tomTom.map.addSource(openWeatherMap.sourceName, {
    type: 'raster',
    tiles: [tileUrl],
    tileSize: 256,
    minZoom: 0,
    maxZoom: 12,
    attribution: openWeatherMap.attribution,
  });

  tomTom.map.addLayer({
    id: openWeatherMap.layerName,
    type: 'raster',
    source: openWeatherMap.sourceName,
    layout: { visibility: 'visible' },
  });
}

function updateUnits(element) {
  openWeatherMap.units = element.value;

  if (tomTom.map.loaded()) clearPopup();
}
