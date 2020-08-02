export default class Toc {
  #headingMap = new Map();
  #headerHeight = 0;
  #headingMarginBottom = 0;
  #offsetScreen = 0;
  constructor({ tocSelector = '#toc', header, hgroup = 'h2', sectionSelector = 'article', offsetScreen = 0 }) {
    const hSelection = `${sectionSelector} ${hgroup}`,
      toc = document.querySelector(tocSelector);
    if (!toc) throw new Error(`No matching element with selector: ${tocSelector}`);

    for (const h of document.querySelectorAll(hSelection)) {
      if (!h.id) continue;
      const a = document.createElement('a');
      a.href = '#' + h.id;
      a.innerText = h.innerText;
      toc.appendChild(a);
      this.headingMap.set(h, a);
    }

    if (header) this.headerHeight = typeof header === 'string' ? document.querySelector(header).clientHeight : header.clientHeight;

    this.headingMarginBottom = parseInt(getComputedStyle(document.querySelector(hSelection)).marginBottom);
    this.offsetScreen = offsetScreen;

    window.addEventListener('scroll', this.testScroll.bind(this), {
      passive: true
    });

    this.testScroll();
  }
  get headingMap() {
    return this.#headingMap;
  }
  set headingMap(value) {
    this.#headingMap = value;
  }
  get headerHeight() {
    return this.#headerHeight;
  }
  set headerHeight(value) {
    this.#headerHeight = value;
  }
  get headingMarginBottom() {
    return this.#headingMarginBottom;
  }
  set headingMarginBottom(value) {
    this.#headingMarginBottom = value;
  }
  get offsetScreen() {
    return this.#offsetScreen;
  }
  set offsetScreen(value) {
    this.#offsetScreen = value;
  }
  testScroll() {
    const scrollTop = window.pageYOffset;
    const screenBottom = scrollTop + window.innerHeight;
    const screenUsableBottom = screenBottom;
    const screenUsableTop = scrollTop + this.headerHeight + this.headingMarginBottom;
    let lastVisible;
    for (const [h, a] of this.headingMap) {
      const hTop = h.getBoundingClientRect().top + window.pageYOffset;
      const hBottom = hTop + h.clientHeight;
      if (hTop < screenUsableTop) {
        lastVisible = a;
      }
      if (hTop > screenUsableTop && hBottom + this.headingMarginBottom < screenUsableBottom) {
        a.classList.add('current');
      } else {
        a.classList.remove('current');
      }
    }
    if (lastVisible) lastVisible.classList.add('current');
  }
}