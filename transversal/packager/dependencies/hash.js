const equal = require('@beyond-js/equal');
const crc32 = require('@beyond-js/crc32');
const DynamicProcessor = require('@beyond-js/dynamic-processor')();

module.exports = class extends DynamicProcessor {
	#dependencies;

	#value;
	get value() {
		return this.#value;
	}

	constructor(dependencies) {
		super();
		this.#dependencies = dependencies;
		super.setup(new Map([['dependencies', { child: dependencies }]]));
	}

	_process() {
		const value = (() => {
			const compute = [];
			this.#dependencies.forEach(dependency => compute.push(dependency.specifier));
			return crc32(equal.generate(compute));
		})();

		const changed = this.#value !== value;
		this.#value = value;
		return changed;
	}
};
