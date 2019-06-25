(function (d) {
	'use strict';

	/**
	 * Has SVG support?
	 * @returns {boolean}
	 */
	function hasSVG() {
		return Boolean(d.createElementNS) &&
			Boolean(d.createElementNS('http://www.w3.org/2000/svg', 'svg')
					.createSVGRect);
	}

	if (!hasSVG()) {
		d.documentElement.className += ' no-svg';
	}
})(document);