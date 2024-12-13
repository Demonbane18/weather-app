function SearchMarker(i, _) {
  (this.poiData = i),
    (this.options = _ || {}),
    (this.marker = new tt.Marker({
      element: this.createMarker(),
      anchor: 'bottom',
    }));
  var t = this.poiData.position.lng || this.poiData.position.lon;
  this.marker.setLngLat([t, this.poiData.position.lat]),
    this.marker.setPopup(new SearchMarkerPopup(this.poiData, this.options));
}
function SearchMarkerPopup(i, _) {
  return (this.poiData = i), (this.options = _), this.createPopup();
}
function SearchIconCreator(i, _) {
  (this.color = i), (this.poiData = _);
}
(SearchMarker.prototype.addTo = function (i) {
  return (
    this.marker.addTo(i),
    this.entryPoints && this.entryPoints.bindMap(i),
    (this._map = i),
    this
  );
}),
  (SearchMarker.prototype.remove = function () {
    this.marker.remove(),
      this.entryPoints && this.entryPoints.clearEntryPoints(),
      (this._map = null),
      (this._onClickCallback = null);
  }),
  (SearchMarker.prototype.getLngLat = function () {
    return this.marker.getLngLat();
  }),
  (SearchMarker.prototype.getPopup = function () {
    return this.marker.getPopup();
  }),
  (SearchMarker.prototype.togglePopup = function () {
    return this.marker.togglePopup();
  }),
  (SearchMarker.prototype.onClick = function (i) {
    this._onClickCallback = i;
  }),
  (SearchMarker.prototype.createMarker = function () {
    var i = document.createElement('div');
    (i.className = 'tt-icon-marker-black tt-search-marker'),
      this.options.markerClassName &&
        (i.className += ' ' + this.options.markerClassName);
    var _ = document.createElement('div'),
      t = new SearchIconCreator('white', this.poiData).getIcon();
    return (
      (_.className = 'marker-inner ' + t),
      i.appendChild(_),
      this.drawEntryPoints(i),
      i
    );
  }),
  (SearchMarker.prototype.drawEntryPoints = function (i) {
    this.options.entryPoints &&
      this.poiData.entryPoints &&
      (this.entryPoints = new EntryPoints(this.poiData, i, this.options));
  }),
  (SearchMarkerPopup.prototype.createPopup = function () {
    return new tt.Popup({ offset: [0, -38] }).setDOMContent(
      this.createPopupContent(this.poiData, this.options)
    );
  }),
  (SearchMarkerPopup.prototype.createPopupContent = function () {
    var i = document.createElement('div');
    (i.className = 'tt-pop-up-container'),
      this.options.popupClassName &&
        (i.className += ' ' + this.options.popupClassName);
    var _ = document.createElement('div');
    _.className = 'pop-up-icon';
    var t = document.createElement('div');
    (t.className = new SearchIconCreator('black', this.poiData).getIcon()),
      _.appendChild(t);
    var p = document.createElement('div');
    p.className = 'pop-up-content';
    var e = document.createElement('div');
    this.poiData.name &&
      this.createDivWithContent('pop-up-result-name', this.poiData.name, e),
      this.createDivWithContent(
        'pop-up-result-address',
        this.poiData.address,
        e
      );
    var a = this.poiData.position.lon
      ? this.poiData.position.lon
      : this.poiData.position.lng;
    return (
      this.createDivWithContent(
        'pop-up-result-position',
        this.poiData.position.lat + ', ' + a,
        e
      ),
      this.poiData.type &&
        this.createDivWithContent(
          'pop-up-result-type',
          this.poiData.type + ' entry',
          e
        ),
      i.appendChild(_),
      i.appendChild(p),
      p.appendChild(e),
      this.poiData.distance &&
        this.createDivWithContent(
          'pop-up-result-distance',
          this.convertDistance(this.poiData.distance),
          p
        ),
      i
    );
  }),
  (SearchMarkerPopup.prototype.convertDistance = function (i) {
    var _ = Math.round(i);
    return _ >= 1e3 ? Math.round(_ / 100) / 10 + ' km' : _ + ' m';
  }),
  (SearchMarkerPopup.prototype.createDivWithContent = function (i, _, t) {
    var p = document.createElement('div');
    (p.className = i),
      p.appendChild(document.createTextNode(_)),
      t.appendChild(p);
  }),
  (SearchIconCreator.prototype.getIcon = function () {
    var i = this.poiData.classification,
      _ = this.availableIcons.fallback;
    if (this.poiData.classification) {
      var t;
      if (Array.isArray(i)) {
        var p =
          i.indexOf('hospital/polyclinic') > -1
            ? 'HOSPITAL_POLYCLINIC'
            : i.length > 1
            ? i[1].toUpperCase()
            : i[0].toUpperCase();
        t = this.availableIcons[p];
      } else t = this.availableIcons[i];
      t && (_ = t);
    }
    var e = this.getIconClassModifier(_);
    return e && this.isColorModifier(e)
      ? 'tt-icon-' + this.getIconClassWithoutModifier(_) + '-' + this.color
      : 'tt-icon-' + _;
  }),
  (SearchIconCreator.prototype.getIconClassModifier = function (i) {
    var _ = i.split('-');
    return _.length > -1 ? _.slice(-1)[0] : void 0;
  }),
  (SearchIconCreator.prototype.getIconClassWithoutModifier = function (i) {
    return i.split('-').slice(0, -1).join('-');
  }),
  (SearchIconCreator.prototype.isColorModifier = function (i) {
    return ['white', 'black'].indexOf(i) > -1;
  }),
  (SearchIconCreator.prototype.availableIcons = {
    fallback: 'flag-white',
    ACCESS_GATEWAY: 'ic_map_poi_110-white',
    ADMINISTRATIVE_DIVISION: 'ic_map_poi_133-white',
    ADVENTURE_SPORTS_VENUE: 'ic_map_poi_122-white',
    AGRICULTURAL_BUSSINESS: 'ic_map_poi_107-white',
    AGRICULTURE: 'ic_map_poi_107-white',
    AIRPORT: 'ic_map_poi_007-white',
    AMUSEMENT_PARK: 'ic_map_poi_051-white',
    AUTOMOTIVE_DEALER: 'ic_map_poi_008-white',
    BANK: 'ic_map_poi_077-white',
    BAR_PUB: 'ic_map_poi_120-white',
    BEACH: 'ic_map_poi_043-white',
    BEAUTY_SALON: 'ic_map_poi_066-white',
    BUILDING_POINT: 'ic_map_poi_132-white',
    BUS_STATION: 'ic_map_poi_069-white',
    BUSINESS_PARK: 'ic_map_poi_102-white',
    CAFE_PUB: 'ic_map_poi_120-white',
    CAMPING_GROUND: 'ic_map_poi_058-white',
    CAR_DEALER: 'ic_map_poi_008-white',
    CAR_WASH: 'ic_map_poi_067-white',
    CASH_DISPENSER: 'ic_map_poi_042-white',
    CASINO: 'ic_map_poi_009-white',
    CINEMA: 'ic_map_poi_011-white',
    CITY_CENTER: 'ic_map_poi_012-white',
    CLUB_ASSOCIATION: 'ic_map_poi_131-white',
    COLLEGE_UNIVERSITY: 'ic_map_poi_041-white',
    COMMERCIAL_BUILDING: 'ic_map_poi_098-white',
    COMMUNITY_CENTER: 'ic_map_poi_081-white',
    COMPANY: 'ic_map_poi_013-white',
    CONVENIENCE_STORE: 'ic_map_poi_080-white',
    COURTHOUSE: 'ic_map_poi_015-white',
    CULTURAL_CENTER: 'ic_map_poi_016-white',
    DENTIST: 'ic_map_poi_048-white',
    DEPARTMENT_STORE: 'ic_map_poi_104-white',
    DOCTOR: 'ic_map_poi_047-white',
    ECONOMIC_CHAIN_HOTEL: 'ic_map_poi_083-white',
    ELECTRIC_VEHICLE_STATION: 'ic_map_poi_073-white',
    EMBASSY: 'ic_map_poi_040-white',
    EMERGENCY_MEDICAL_SERVICE: 'ic_map_poi_115-white',
    ENTERTAINMENT: 'ic_map_poi_035-white',
    ENTRY_POINT: 'ic_map_poi_109-white',
    EXCHANGE: 'ic_map_poi_096-white',
    EXHIBITION_CENTER: 'ic_map_poi_017-white',
    EXHIBITION_CONVENTION_CENTER: 'ic_map_poi_017-white',
    FERRY_TERMINAL: 'ic_map_poi_018-white',
    FINANCIAL_INSTITUTION: 'ic_map_poi_077-white',
    FIRE_STATION_BRIGADE: 'ic_map_poi_068-white',
    FRONTIER_CROSSING: 'ic_map_poi_019-white',
    FUEL_FACILITIES: 'ic_map_poi_004-white',
    GEOGRAPHIC_FEATURE: 'ic_map_poi_127-white',
    GOLF_COURSE: 'ic_map_poi_020-white',
    GOVERNMENT_OFFICE: 'ic_map_poi_000-white',
    HEALTH_CARE_SERVICE: 'ic_map_poi_116-white',
    HELIPAD_HELICOPTER_LANDING: 'ic_map_poi_123-white',
    HOLIDAY_RENTAL: 'ic_map_poi_130-white',
    HOSPITAL_POLYCLINIC: 'ic_map_poi_021-white',
    HOTEL_MOTEL: 'ic_map_poi_022-white',
    ICE_SKATING_RINK: 'ic_map_poi_044-white',
    IMPORTANT_TOURIST_ATTRACTION: 'ic_map_poi_023-white',
    INDUSTRIAL_AREA: 'ic_map_poi_095-white',
    INDUSTRIAL_BUILDING: 'ic_map_poi_095-white',
    LEGAL_SOLICIDORS: 'ic_map_poi_064-white',
    LEISURE_CENTER: 'ic_map_poi_061-white',
    LIBRARY: 'ic_map_poi_052-white',
    LUXURY_HOTEL: 'ic_map_poi_078-white',
    MANUFACTURING_FACILITY: 'ic_map_poi_099-white',
    MARINA: 'ic_map_poi_062-white',
    MARKET: 'ic_map_poi_118-white',
    MEDIA_FACILITY: 'ic_map_poi_101-white',
    MILITARY_INSTALLATION: 'ic_map_poi_106-white',
    MOTORING_ORGANIZATION_OFFICE: 'ic_map_poi_076-white',
    MOUNTAIN_PASS: 'ic_map_poi_024-white',
    MOUNTAIN_PEAK: 'ic_map_poi_001-white',
    MUSEUM: 'ic_map_poi_025-white',
    NATIVE_RESERVATION: 'ic_map_poi_125-white',
    NIGHTLIFE: 'ic_map_poi_050-white',
    NON_GOVERNMENTAL_ORGANIZATION: 'ic_map_poi_134-white',
    OPEN_PARKING_AREA: 'ic_map_poi_002',
    OPERA: 'ic_map_poi_026-white',
    OTHER: 'flag-white',
    PARKING_GARAGE: 'ic_map_poi_003',
    PARK_RECREATION_AREA: 'ic_map_poi_059-white',
    PET_SERVICES: 'ic_map_poi_085-white',
    PETROL_STATION: 'ic_map_poi_004-white',
    PHARMACY: 'ic_map_poi_054-white',
    PLACE_OF_WORSHIP: 'ic_map_poi_027-white',
    PLAYING_FIELD: 'ic_map_poi_072-white',
    POLICE_STATION: 'ic_map_poi_039-white',
    PORT_WAREHOUSE_FACILITY: 'ic_map_poi_105-white',
    POST_OFFICE: 'ic_map_poi_028-white',
    PRIMARY_RESOURCE_FACILITY: 'ic_map_poi_108-white',
    PRIMARY_RESOURCE_UTILITY: 'ic_map_poi_108-white',
    PRISON_CORRECTIONAL_FACILITY: 'ic_map_poi_094-white',
    PUBLIC_AMENITY: 'ic_map_poi_097-white',
    PUBLIC_TRANSPORT_STOP: 'ic_map_poi_069-white',
    RAILWAY_STATION: 'ic_map_poi_005-white',
    RENT_A_CAR_FACILITY: 'ic_map_poi_029-white',
    RENT_A_CAR_PARKING: 'ic_map_poi_030',
    REPAIR_FACILITY: 'ic_map_poi_053-white',
    RESEARCH_FACILITY: 'ic_map_poi_100-white',
    RESIDENTIAL_ACCOMMODATION: 'ic_map_poi_075-white',
    RESIDENTIAL_AREA: 'ic_map_poi_103-white',
    RESTAURANT: 'ic_map_poi_031-white',
    RESTAURANT_AREA: 'ic_map_poi_031-white',
    RESTAURANT_CHINESE: 'ic_map_poi_079-white',
    REST_AREA: 'ic_map_poi_006-white',
    SCENIC_PANORAMIC_VIEW: 'ic_map_poi_055-white',
    SCHOOL: 'ic_map_poi_070-white',
    SHOP: 'ic_map_poi_032-white',
    SHOPPING_CENTER: 'ic_map_poi_033-white',
    SPORTS_CENTER: 'ic_map_poi_038-white',
    STADIUM: 'ic_map_poi_034-white',
    SWIMMING_POOL: 'ic_map_poi_046-white',
    TELE_COMMUNICATIONS: 'ic_map_poi_082-white',
    TENNIS_COURT: 'ic_map_poi_045-white',
    THEATER: 'ic_map_poi_035-white',
    TOURIST_INFORMATION_OFFICE: 'ic_map_poi_023-white',
    TRAFFIC_LIGHT: 'ic_map_poi_129-white',
    TRAFFIC_SERVICE_CENTER: 'ic_map_poi_126-white',
    TRAFFIC_SIGN: 'ic_map_poi_128-white',
    TRAIL_SYSTEM: 'ic_map_poi_124-white',
    TRANSPORT_AUTHORITY_VEHICLE_REGISTRATION: 'ic_map_poi_113-white',
    TRUCK_STOP: 'ic_map_poi_071',
    VETERINARIAN: 'ic_map_poi_049-white',
    WATER_SPORT: 'ic_map_poi_046-white',
    WEIGH_STATION: 'ic_map_poi_111-white',
    WELFARE_ORGANIZATION: 'ic_map_poi_117-white',
    WINERY: 'ic_map_poi_057-white',
    YACHT_BASIN: 'ic_map_poi_062-white',
    ZOOS_ARBORETA_BOTANICAL_GARDEN: 'ic_map_poi_037',
  }),
  (window.SearchMarkerPopup = window.SearchMarkerPopup || SearchMarkerPopup),
  (window.SearchMarker = window.SearchMarker || SearchMarker);
