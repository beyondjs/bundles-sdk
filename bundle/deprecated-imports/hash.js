const DynamicProcessor = require('@beyond-js/dynamic-processor')(Map);
const equal = require('@beyond-js/equal');
const crc32 = require('@beyond-js/crc32');

module.exports = class extends DynamicProcessor {
	get dp() {
		return 'bundler.bundle.dependencies.deprecated-imports.hash';
	}

	#value;
	get value() {
		if (this.#value !== void 0) return this.#value;

		const sources = this.children.get('sources').child;
		if (!sources.size) return (this.#value = 0);

		const compute = {};
		sources.forEach(({ file, hash }) => (compute[file] = hash));
		return (this.#value = crc32(equal.generate(compute)));
	}

	constructor(imports) {
		super();
		super.setup(new Map([['sources', { child: imports.sources }]]));
	}

	_prepared(require) {
		this.children.get('sources').child.forEach(source => require(source));
	}

	_process() {
		this.#value = void 0;
	}
};
