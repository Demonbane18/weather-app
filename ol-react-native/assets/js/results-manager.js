function appendParentSelector(e, t) {
  return e ? e + ' ' + t : t;
}
function ResultsManager(e) {
  (this.resultsElement = document.querySelector(
    appendParentSelector(e, '.js-results')
  )),
    (this.resultsPlaceholder = document.querySelector(
      appendParentSelector(e, '.js-results-placeholder')
    )),
    (this.resultsLoader = document.querySelector(
      appendParentSelector(e, '.js-results-loader')
    ));
}
(ResultsManager.prototype.loading = function () {
  this.resultsLoader.removeAttribute('hidden'),
    this.resultsElement.setAttribute('hidden', 'hidden'),
    this.resultsPlaceholder.setAttribute('hidden', 'hidden'),
    (this.resultsElement.innerHTML = '');
}),
  (ResultsManager.prototype.success = function () {
    this.resultsLoader.setAttribute('hidden', 'hidden'),
      this.resultsElement.removeAttribute('hidden');
  }),
  (ResultsManager.prototype.resultsNotFound = function () {
    this.resultsElement.setAttribute('hidden', 'hidden'),
      this.resultsLoader.setAttribute('hidden', 'hidden'),
      this.resultsPlaceholder.removeAttribute('hidden');
  }),
  (ResultsManager.prototype.append = function (e) {
    this.resultsElement.appendChild(e);
  }),
  (ResultsManager.prototype.clear = function () {
    for (var e = 0; e < this.resultsElement.children.length; e++)
      this.resultsElement.removeChild(this.resultsElement.children[e]);
  }),
  (window.ResultsManager = window.ResultsManager || ResultsManager);
