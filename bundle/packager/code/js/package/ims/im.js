const { header } = require('@beyond-js/code');

module.exports = async function (im, sourcemap) {
	const { id, url, hash, code, map } = im;

	sourcemap.concat(header(`INTERNAL MODULE: ${id}`));

	const creator = 'creator: function (require, exports) {';

	sourcemap.concat(`ims.set('${id}', {hash: ${hash}, ${creator}`);
	sourcemap.concat(code, url, map);
	sourcemap.concat('}});\n');
};
