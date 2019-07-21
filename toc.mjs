export default class Toc {
	_headingMap = new Map();
	_headerHeight = 0;
	_headingMarginBottom = 0;
	_offsetScreen = 0;
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
		return this._headingMap;
	}
	set headingMap(value) {
		this._headingMap = value;
	}
	get headerHeight() {
		return this._headerHeight;
	}
	set headerHeight(value) {
		this._headerHeight = value;
	}
	get headingMarginBottom() {
		return this._headingMarginBottom;
	}
	set headingMarginBottom(value) {
		this._headingMarginBottom = value;
	}
	get offsetScreen() {
		return this._offsetScreen;
	}
	set offsetScreen(value) {
		this._offsetScreen = value;
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