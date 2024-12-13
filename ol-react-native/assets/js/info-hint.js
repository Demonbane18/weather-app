function InfoHint(t, e, i) {
  (this.type = t),
    (this.position = e),
    (this.duration = i),
    (this.element = this._createElement());
}
(InfoHint.prototype.addTo = function (t) {
  return t.appendChild(this.element), this;
}),
  (InfoHint.prototype.isHidden = function () {
    return this.element.classList.contains('-hidden');
  }),
  (InfoHint.prototype.hide = function () {
    this.element.classList.add('-hidden');
  }),
  (InfoHint.prototype.show = function () {
    this.element.classList.remove('-hidden');
  }),
  (InfoHint.prototype.setErrorMessage = function (t) {
    (this.element.innerText =
      (t && (t.message || t.data.message)) || 'There was an error.'),
      this._createMessage();
  }),
  (InfoHint.prototype.setMessage = function (t) {
    (this.element.innerText = t), this._createMessage();
  }),
  (InfoHint.prototype._createElement = function () {
    var t = document.createElement('div');
    return t.setAttribute('class', this._getClassList()), t;
  }),
  (InfoHint.prototype._createMessage = function () {
    this.show(),
      this.duration &&
        (this.timeout && window.clearTimeout(this.timeout),
        this.duration &&
          (this.timeout = window.setTimeout(
            this.hide.bind(this),
            this.duration
          )));
  }),
  (InfoHint.prototype._createElement = function () {
    var t = document.createElement('div');
    return t.setAttribute('class', this._getClassList()), t;
  }),
  (InfoHint.prototype._getClassList = function () {
    return [
      'tt-info-hint',
      '-hidden',
      '-' + this.position,
      '-' + this.type,
    ].join(' ');
  }),
  (window.infoHint = window.InfoHint || InfoHint);
