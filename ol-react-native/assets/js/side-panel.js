function SidePanel(e, t) {
  (this.map = t),
    (this.element = document.querySelector(e)),
    (this.unfoldButton = this.createRevealPanel()),
    this.element.appendChild(this.createFooter()),
    (this.isFolded = !1);
}
(SidePanel.prototype.toggleSidePanel = function () {
  this.element.classList.toggle('-folded'),
    this.isFolded
      ? this.unfoldButton.parentElement.removeChild(this.unfoldButton)
      : document.getElementById('map').appendChild(this.unfoldButton),
    (this.isFolded = !this.isFolded),
    this.map.resize();
}),
  (SidePanel.prototype.createRevealPanel = function () {
    var e = document.createElement('div'),
      t = document.createElement('div');
    return (
      e.setAttribute('class', 'tt-reveal-side-panel'),
      t.setAttribute('class', 'tt-icon -fold'),
      t.addEventListener('click', this.toggleSidePanel.bind(this)),
      e.appendChild(t),
      e
    );
  }),
  (SidePanel.prototype.createFooter = function () {
    var e = document.createElement('div'),
      t = document.createElement('div');
    return (
      e.setAttribute('class', 'tt-side-panel__footer'),
      t.setAttribute('class', 'tt-side-panel__close-button tt-icon -fold'),
      t.addEventListener('click', this.toggleSidePanel.bind(this)),
      e.appendChild(t),
      e
    );
  }),
  (window.SidePanel = window.SidePanel || SidePanel);
