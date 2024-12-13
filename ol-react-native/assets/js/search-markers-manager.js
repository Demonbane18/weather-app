function checkDependencyAvailability() {
  if (!window.tt) throw new Error('tt is not available');
  if (!window.SearchMarker) throw new Error('Search Marker is not available');
}
function addEntryPointsMapLayersIfNecessary(r, e) {
  e.entryPoints &&
    (r.addSource('entry-points-connectors', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    }),
    r.addLayer({
      id: 'entry-points-connectors',
      type: 'line',
      source: 'entry-points-connectors',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': '#000',
        'line-width': 0.5,
        'line-dasharray': [10, 10],
      },
      filter: ['in', '$type', 'LineString'],
    }));
}
function SearchMarkersManager(r, e) {
  if ((checkDependencyAvailability(), !r || 'object' != typeof r))
    throw new Error('map is not valid');
  (this.map = r),
    (this._options = e || {}),
    (this._poiList = void 0),
    (this.markers = {}),
    addEntryPointsMapLayersIfNecessary(r, this._options);
}
(SearchMarkersManager.prototype.draw = function (r) {
  if (!r || !Array.isArray(r))
    throw new Error('Poi list(poiList) must be an array');
  (this._poiList = r),
    this.clear(),
    this._poiList.forEach(function (r) {
      var e = r.id,
        a = {
          name: r.poi ? r.poi.name : void 0,
          address: r.address.freeformAddress,
          distance: r.dist,
          classification: r.poi ? r.poi.classifications[0].code : void 0,
          position: r.position,
          entryPoints: r.entryPoints,
        };
      void 0 === a.name &&
        'Geography' === r.type &&
        ((a.name = r.address.freeformAddress), (a.address = r.address.country));
      var t = new SearchMarker(a, this._options);
      t.onClick(
        function (r) {
          this._lastClickedMarker &&
            this._lastClickedMarker !== r &&
            this._lastClickedMarker.clearEntryPoints(),
            (this._lastClickedMarker = r);
        }.bind(this)
      ),
        t.addTo(this.map),
        (this.markers[e] = t);
    }, this);
}),
  (SearchMarkersManager.prototype.getMarkers = function () {
    return this.markers;
  }),
  (SearchMarkersManager.prototype.openPopup = function (r) {
    for (var e in this.markers) {
      var a = this.markers[e];
      a.getPopup().isOpen() && a.togglePopup();
    }
    this.markers[r].togglePopup();
  }),
  (SearchMarkersManager.prototype.jumpToMarker = function (r) {
    this.map.jumpTo({ center: this.markers[r].getLngLat(), zoom: 16 });
  }),
  (SearchMarkersManager.prototype.getMarkersBounds = function () {
    var r = new tt.LngLatBounds();
    for (var e in this.markers) r.extend(this.markers[e].getLngLat());
    return r;
  }),
  (SearchMarkersManager.prototype.clear = function () {
    for (var r in this.markers) {
      this.markers[r].remove();
    }
    (this.markers = {}), (this._lastClickedMarker = null);
  }),
  (window.SearchMarkersManager =
    window.SearchMarkersManager || SearchMarkersManager);
