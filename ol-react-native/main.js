import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import LayerGroup from 'ol/layer/Group.js';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj.js';
import XYZ from 'ol/source/XYZ.js';
import LayerSwitcher from 'ol-layerswitcher';
import { BaseLayerOptions, GroupLayerOptions } from 'ol-layerswitcher';
import Geolocation from 'ol/Geolocation.js';
import LineString from 'ol/geom/LineString.js';
import Overlay from 'ol/Overlay.js';

const place = fromLonLat([121.021569, 14.59375]);
console.log(place);
const OPEN_WEATHER_KEY = '6be4c73603d24111b5b1a6972d8bd56d';
const z = 12;
const x = 3424;
const y = 1879;
// const z = 10;
// const x = 856;
// const y = 469;

const view = new View({
  center: place,
  zoom: 12,
});

const tileLayer = new TileLayer({
  title: 'Base Map',
  source: new OSM(),
});
const map = new Map({
  target: 'map',
  layers: [
    tileLayer,
    new TileLayer({
      title: 'Cloud Cover Map',
      source: new XYZ({
        url: `http://maps.openweathermap.org/maps/2.0/weather/CL/${z}/${x}/${y}?appid=${OPEN_WEATHER_KEY}&opacity=0.9`,
        tileOptions: {
          crossOriginKeyword: 'anonymous',
        },
        attributions:
          '<a href="https://openweathermap.org/" target="_blank">&copy; OpenWeatherMap</a> ',
        crossOrigin: null,
      }),
    }),
    new TileLayer({
      title: 'Precipitation Map',
      visible: false,
      source: new XYZ({
        url: `http://maps.openweathermap.org/maps/2.0/weather/PA0/${z}/${x}/${y}?appid=${OPEN_WEATHER_KEY}`,
        tileOptions: {
          crossOriginKeyword: 'anonymous',
        },
        attributions:
          '<a href="https://openweathermap.org/" target="_blank">&copy; OpenWeatherMap</a> ',
        crossOrigin: null,
      }),
    }),
  ],
  view: view,
});

const layerSwitcher = new LayerSwitcher({
  reverse: true,
  groupSelectStyle: 'group',
});
map.addControl(layerSwitcher);

// Geolocation marker
const markerEl = document.getElementById('geolocation_marker');
const marker = new Overlay({
  positioning: 'center-center',
  element: markerEl,
  stopEvent: false,
});
map.addOverlay(marker);

// LineString to store the different geolocation positions. This LineString
// is time aware.
// The Z dimension is actually used to store the rotation (heading).
const positions = new LineString([], 'XYZM');

// Geolocation Control
const geolocation = new Geolocation({
  projection: view.getProjection(),
  trackingOptions: {
    maximumAge: 10000,
    enableHighAccuracy: true,
    timeout: 600000,
  },
});
let deltaMean = 500; // the geolocation sampling period mean in ms

// Listen to position changes
geolocation.on('change', function () {
  const position = geolocation.getPosition();
  const accuracy = geolocation.getAccuracy();
  const heading = geolocation.getHeading() || 0;
  const speed = geolocation.getSpeed() || 0;
  const m = Date.now();

  addPosition(position, heading, m, speed);

  const coords = positions.getCoordinates();
  const len = coords.length;
  if (len >= 2) {
    deltaMean = (coords[len - 1][3] - coords[0][3]) / (len - 1);
  }

  const html = [
    'Position: ' + position[0].toFixed(2) + ', ' + position[1].toFixed(2),
    'Accuracy: ' + accuracy,
    'Heading: ' + Math.round(radToDeg(heading)) + '&deg;',
    'Speed: ' + (speed * 3.6).toFixed(1) + ' km/h',
    'Delta: ' + Math.round(deltaMean) + 'ms',
  ].join('<br />');
  document.getElementById('info').innerHTML = html;
});

geolocation.on('error', function () {
  alert('geolocation error');
  // FIXME we should remove the coordinates in positions
});

// convert radians to degrees
function radToDeg(rad) {
  return (rad * 360) / (Math.PI * 2);
}
// convert degrees to radians
function degToRad(deg) {
  return (deg * Math.PI * 2) / 360;
}
// modulo for negative values
function mod(n) {
  return ((n % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
}

function addPosition(position, heading, m, speed) {
  const x = position[0];
  const y = position[1];
  const fCoords = positions.getCoordinates();
  const previous = fCoords[fCoords.length - 1];
  const prevHeading = previous && previous[2];
  if (prevHeading) {
    let headingDiff = heading - mod(prevHeading);

    // force the rotation change to be less than 180°
    if (Math.abs(headingDiff) > Math.PI) {
      const sign = headingDiff >= 0 ? 1 : -1;
      headingDiff = -sign * (2 * Math.PI - Math.abs(headingDiff));
    }
    heading = prevHeading + headingDiff;
  }
  positions.appendCoordinate([x, y, heading, m]);

  // only keep the 20 last coordinates
  positions.setCoordinates(positions.getCoordinates().slice(-20));

  // FIXME use speed instead
  if (heading && speed) {
    markerEl.src = 'data/geolocation_marker_heading.png';
  } else {
    markerEl.src = 'data/geolocation_marker.png';
  }
}

// recenters the view by putting the given coordinates at 3/4 from the top or
// the screen
function getCenterWithHeading(position, rotation, resolution) {
  const size = map.getSize();
  const height = size[1];

  return [
    position[0] - (Math.sin(rotation) * height * resolution * 1) / 4,
    position[1] + (Math.cos(rotation) * height * resolution * 1) / 4,
  ];
}

let previousM = 0;
function updateView() {
  // use sampling period to get a smooth transition
  let m = Date.now() - deltaMean * 1.5;
  m = Math.max(m, previousM);
  previousM = m;
  // interpolate position along positions LineString
  const c = positions.getCoordinateAtM(m, true);
  if (c) {
    view.setCenter(getCenterWithHeading(c, -c[2], view.getResolution()));
    view.setRotation(-c[2]);
    marker.setPosition(c);
    map.render();
  }
}

// geolocate device
const geolocateBtn = document.getElementById('geolocate');
geolocateBtn.addEventListener(
  'click',
  function () {
    geolocation.setTracking(true); // Start position tracking

    tileLayer.on('postrender', updateView);
    map.render();

    disableButtons();
  },
  false
);

// simulate device move
let simulationData;
const client = new XMLHttpRequest();
client.open('GET', 'data/geolocation-orientation.json');

/**
 * Handle data loading.
 */
client.onload = function () {
  simulationData = JSON.parse(client.responseText).data;
};
client.send();

const simulateBtn = document.getElementById('simulate');
simulateBtn.addEventListener(
  'click',
  function () {
    const coordinates = simulationData;

    const first = coordinates.shift();
    simulatePositionChange(first);

    let prevDate = first.timestamp;
    function geolocate() {
      const position = coordinates.shift();
      if (!position) {
        return;
      }
      const newDate = position.timestamp;
      simulatePositionChange(position);
      window.setTimeout(function () {
        prevDate = newDate;
        geolocate();
      }, (newDate - prevDate) / 0.5);
    }
    geolocate();

    tileLayer.on('postrender', updateView);
    map.render();

    disableButtons();
  },
  false
);

function simulatePositionChange(position) {
  const coords = position.coords;
  geolocation.set('accuracy', coords.accuracy);
  geolocation.set('heading', degToRad(coords.heading));
  const projectedPosition = fromLonLat([coords.longitude, coords.latitude]);
  geolocation.set('position', projectedPosition);
  geolocation.set('speed', coords.speed);
  geolocation.changed();
}

function disableButtons() {
  geolocateBtn.disabled = 'disabled';
  simulateBtn.disabled = 'disabled';
}
