const DynamicProcessor = require('@beyond-js/dynamic-processor')(Map);

/**
 * The processors of a packager
 */
module.exports = class ProcessorsSettings extends DynamicProcessor {
	get dp() {
		return 'bundler.processors.settings';
	}

	#value;
	get value() {
		return this.#value;
	}

	#errors = [];
	get errors() {
		return this.#errors;
	}

	constructor(settings) {
		super.setup([['settings', { child: settings }]]);
	}

	_process() {
		this.#errors.length = 0;

		const settings = this.children.get('settings');
		if (!(settings.value?.processors instanceof Array)) {
			this.#errors.push(`Processors settings in package.json is invalid or not set`);
			return;
		}

		const { processors } = settings.value;

		this.clear();
		for (specifier of processors) {
			try {
				const meta = require(specifier);
				this.set(meta.name, meta);
			} catch (exc) {
				this.#errors.push(`Error requireing processor "${'specifier'}"`);
				return;
			}
		}
		if (!(this.#value instanceof Array)) {
			throw new Error(`Supported processors property is not defined in "${bundle.type}" bundle`);
		}
	}
};
