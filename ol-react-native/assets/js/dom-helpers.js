function elementFactory(e, t, r) {
  var n = document.createElement(e);
  return n.setAttribute('class', t), void 0 !== r && (n.textContent = r), n;
}
function createResultItem() {
  return elementFactory('li', 'tt-results-list__item');
}
function createResultList() {
  return elementFactory('ul', 'tt-results-list');
}
function createSearchResult(e, t, r) {
  var n = elementFactory('div', 'tt-search-result__name');
  n.innerText = e;
  var a = elementFactory('div', 'tt-search-result'),
    s = elementFactory('div');
  if ((s.appendChild(n), a.appendChild(s), t)) {
    var l = elementFactory('div', 'tt-search-result__address');
    (l.innerText = t), s.appendChild(l);
  }
  if (r) {
    var c = elementFactory('div', 'tt-search-result__distance');
    (c.innerText = r), a.appendChild(c);
  }
  return a;
}
function checkIfElementOrItsParentsHaveClass(e, t) {
  if (e.classList.contains(t)) return !0;
  for (; e.parentNode; )
    if ((e = e.parentNode).classList && e.classList.contains(t)) return !0;
  return !1;
}
function getElementOrItsParentId(e) {
  if (e.id) return e.id;
  for (; e.parentNode; ) if ((e = e.parentNode).id) return e.id;
  return !1;
}
var DomHelpers = {
  createResultItem: createResultItem,
  createResultList: createResultList,
  createSearchResult: createSearchResult,
  checkIfElementOrItsParentsHaveClass: checkIfElementOrItsParentsHaveClass,
  getElementOrItsParentId: getElementOrItsParentId,
  elementFactory: elementFactory,
};
window.DomHelpers = window.DomHelpers || DomHelpers;
