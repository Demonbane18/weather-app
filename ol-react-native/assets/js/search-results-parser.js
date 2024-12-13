function getAddressLines(e) {
  var r = e.type,
    t = e.poi,
    s = e.address,
    i = e.entityType;
  if ('Point Address' === r || 'Address Range' === r || 'Cross Streets' === r)
    return [s.freeformAddress, `${s.municipality}, ${s.country}`];
  if ('POI' === r) return [t.name, s.freeformAddress];
  if ('Street' === r)
    return [s.streetName, `${s.postalCode || ''} ${s.municipality || ''}`];
  if ('Geography' !== r) return [s.freeformAddress];
  switch (i) {
    case 'Municipality':
      return [s.municipality, s.country];
    case 'MunicipalitySubdivision':
      return [s.municipalitySubdivision, s.municipality];
    case 'Country':
      return [s.country, s.country];
    case 'CountrySubdivision':
      return [s.countrySubdivision, s.country];
    default:
      return [s.freeformAddress];
  }
}
function getResultDistance(e) {
  return void 0 !== e.dist ? e.dist : '';
}
var SearchResultsParser = {
  getAddressLines: getAddressLines,
  getResultDistance: getResultDistance,
};
window.SearchResultsParser = window.SearchResultsParser || SearchResultsParser;
