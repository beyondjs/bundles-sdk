const equal = require('@beyond-js/equal');
const crc32 = require('@beyond-js/crc32');
const DynamicProcessor = require('@beyond-js/dynamic-processor')();

module.exports = class extends DynamicProcessor {
	get dp() {
		return 'bundler.processors.hashes.dependencies';
	}

	#value;
	get value() {
		return this.#value;
	}

	constructor(processors) {
		super();
		super.setup(new Map([['processors', { child: processors }]]));
	}

	_prepared(require) {
		const processors = this.children.get('processors').child;
		processors.forEach(({ dependencies }) => dependencies && require(dependencies));
	}

	_process() {
		const processors = this.children.get('processors').child;

		const compute = {};
		processors.forEach(({ dependencies }, name) => {
			dependencies && (compute[name] = dependencies.hashes.specifiers);
		});
		const value = crc32(equal.generate(compute));

		const changed = this.#value !== value;
		this.#value = value;
		return changed;
	}
};
