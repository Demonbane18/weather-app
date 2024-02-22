const application = {
  name: 'Weather Maps',
  version: '1.0',
};

const tomTom = {
  key: 'Tsgxuwl2a1qJMDhI3j5rZS9xzsG8UqGF',
  mapPadding: 40,
  map: null,
  popup: null,
  searchZoom: 11,
};

var messageBox = document.querySelector('.js-message-box');
var messageBoxContent = document.querySelector('.tt-overlay-panel__content');
var messageBoxClose = messageBox.querySelector('.js-message-box-close');

var messages = {
  permissionDenied:
    'Permission denied. You can change your browser settings' +
    'to allow usage of geolocation on this domain.',
  notAvailable: 'Geolocation data provider not available.',
};

const openWeatherMap = {
  appid: '6be4c73603d24111b5b1a6972d8bd56d',
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

function centerAndZoom(response) {
  const location = getLocation(response);
  if (location != null)
    tomTom.map.flyTo({ center: location.position, zoom: tomTom.searchZoom });
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

function findLocation() {
  if (!tomTom.map.loaded()) {
    alert('Please try again later, map is still loading.');
    return;
  }

  clearPopup();

  const queryText = getValue(ids.html.location);

  tt.services
    .fuzzySearch({ key: tomTom.key, query: queryText })
    .go()
    .then(centerAndZoom)
    .catch(function (error) {
      alert('Could not find location (' + queryText + '). ' + error.message);
    });
}

function formatText(response) {
  const weather = response.weather[0];
  const tempUnits = openWeatherMap.units == 'imperial' ? 'F' : 'F';
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
  tt.setProductInfo(application.name, application.version);

  tomTom.map = tt
    .map({
      key: tomTom.key,
      container: ids.html.map,
      dragPan: !isMobileOrTablet(),
    })
    .on('click', getCurrentWeatherData);
}

tomTom.map.addControl(new tt.FullscreenControl());

// Create plugin instance
var geolocateControl = new tt.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: false,
  },
});

bindEvents();

// Handle case when domain permissions are already blocked
handlePermissionDenied();

tomTom.map.addControl(geolocateControl);

function handlePermissionDenied() {
  if ('permissions' in navigator) {
    navigator.permissions
      .query({ name: 'geolocation' })
      .then(function (result) {
        if (result.state === 'denied') {
          displayErrorMessage(messages.permissionDenied);
        }
      });
  }
}

function bindEvents() {
  geolocateControl.on('error', handleError);
  messageBoxClose.addEventListener('click', handleMessageBoxClose);
}

function handleMessageBoxClose() {
  messageBox.setAttribute('hidden', true);
}

function displayErrorMessage(message) {
  messageBoxContent.textContent = message;
  messageBox.removeAttribute('hidden');
}

function handleError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      displayErrorMessage(messages.permissionDenied);
      break;
    case error.POSITION_UNAVAILABLE:
    case error.TIMEOUT:
      displayErrorMessage(messages.notAvailable);
  }
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
