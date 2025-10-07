"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const rs = use("Runtime.rs");
const BaseObject = use("Runtime.BaseObject");
/*!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2024 "Ildar Bikmamatov" <support@bayrell.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
if (typeof Runtime == 'undefined') Runtime = {};
Runtime.Context = class extends BaseObject
{
	
	
	/**
	 * Returns true if is initialized
	 */
	isInitialized(){ return this.initialized; }
	
	
	/**
	 * Returns true if is started
	 */
	isStarted(){ return this.started; }
	
	
	/**
	 * Returns start time
	 */
	getStartTime(){ return this.start_time; }
	
	
	/**
	 * Returns base path
	 */
	getBasePath(){ return this.base_path; }
	
	
	/**
	 * Returns entities
	 */
	getEntities(class_name)
	{
		if (class_name == undefined) class_name = "";
		if (class_name == "")
		{
			return this.entities.slice();
		}
		return this.entities.filter((entity_name) => { return rtl.isInstanceOf(entity_name, class_name); });
	}
	
	
	/**
	 * Returns environments
	 */
	getEnvironments(){ return this.environments.copy(); }
	
	
	/**
	 * Returns provider by name
	 */
	provider(provider_name)
	{
		const ItemNotFound = use("Runtime.Exceptions.ItemNotFound");
		if (!this.providers.has(provider_name))
		{
			throw new ItemNotFound(provider_name, "Provider");
		}
		return this.providers.get(provider_name);
	}
	
	
	/**
	 * Return environment
	 */
	env(name)
	{
		const RuntimeHook = use("Runtime.Hooks.RuntimeHook");
		var value = this.environments.get(name);
		var res = Map.create({"name": name, "value": value});
		this.hook(RuntimeHook.ENV, res);
		return res.get("value");
	}
	
	
	/**
	 * Init params
	 */
	static initParams(params)
	{
		if (!params.has("start_time"))
		{
			params.set("start_time", Date.now());
		}
		if (!params.has("cli_args"))
		{
			params.set("cli_args", process.argv.slice(1));
		}
		if (!params.has("base_path"))
		{
			params.set("base_path", process.cwd());
		}
		if (!params.has("environments"))
		{
			params.set("environments", Map.from(process.env));
		}
		/* Setup default environments */
		if (!params.has("environments")) params.set("environments", new Map());
		var env = params.get("environments");
		if (!env.has("CLOUD_ENV")) env.set("CLOUD_ENV", false);
		if (!env.has("DEBUG")) env.set("DEBUG", false);
		if (!env.has("LOCALE")) env.set("LOCALE", "en_US");
		if (!env.has("TZ")) env.set("TZ", "UTC");
		if (!env.has("TZ_OFFSET")) env.set("TZ_OFFSET", 0);
		return params;
	}
	
	
	/**
	 * Constructor
	 */
	constructor(params)
	{
		super();
		if (params.has("base_path")) this.base_path = params.get("base_path");
		if (params.has("cli_args")) this.cli_args = params.get("cli_args");
		if (params.has("environments")) this.environments = params.get("environments");
		if (params.has("modules")) this.modules = params.get("modules");
		if (params.has("start_time")) this.start_time = params.get("start_time");
	}
	
	
	/**
	 * Init
	 */
	async init(params)
	{
		const RuntimeHook = use("Runtime.Hooks.RuntimeHook");
		if (this.initialized) return;
		/* Extend modules */
		this.modules = this.constructor.getRequiredModules(this.modules);
		/* Get modules entities */
		this.entities = this.constructor.getEntitiesFromModules(this.modules);
		/* Create providers */
		var providers = this.getEntities("Runtime.Entity.Provider");
		this.createProviders(providers);
		/* Create providers from params */
		if (params.has("providers"))
		{
			this.createProviders(params.get("providers"));
		}
		/* Init providers */
		await this.initProviders();
		/* Hook init app */
		await this.hook(RuntimeHook.INIT);
		/* Set initialized */
		this.initialized = true;
	}
	
	
	/**
	 * Start context
	 */
	async start()
	{
		const RuntimeHook = use("Runtime.Hooks.RuntimeHook");
		if (this.started) return;
		/* Start providers */
		await this.startProviders();
		/* Hook start app */
		await this.hook(RuntimeHook.START);
		/* Set started */
		this.started = true;
	}
	
	
	/**
	 * Run context
	 */
	async run()
	{
		return 0;
	}
	
	
	/**
	 * Create providers
	 */
	createProviders(providers)
	{
		const RuntimeException = use("Runtime.Exceptions.RuntimeException");
		for (var i = 0; i < providers.count(); i++)
		{
			var factory = providers.get(i);
			/* Create provider */
			var provider = factory.createInstance();
			if (!provider)
			{
				throw new RuntimeException("Can't to create provider '" + String(factory.name) + String("'"));
			}
			/* Add provider */
			this.registerProvider(factory.name, provider);
		}
	}
	
	
	/**
	 * Register provider
	 */
	registerProvider(provider_name, provider)
	{
		const BaseProvider = use("Runtime.BaseProvider");
		const RuntimeException = use("Runtime.Exceptions.RuntimeException");
		if (this.initialized) return;
		if (!(provider instanceof BaseProvider))
		{
			throw new RuntimeException("Provider '" + provider_name + "' must be intstanceof BaseProvider");
		}
		this.providers.set(provider_name, provider);
	}
	
	
	/**
	 * Init providers
	 */
	async initProviders()
	{
		var providers_names = rtl.list(this.providers.keys());
		for (var i = 0; i < providers_names.count(); i++)
		{
			var provider_name = providers_names.get(i);
			var provider = this.providers.get(provider_name);
			await provider.init();
		}
	}
	
	
	/**
	 * Start providers
	 */
	async startProviders()
	{
		var providers_names = rtl.list(this.providers.keys());
		for (var i = 0; i < providers_names.count(); i++)
		{
			var provider_name = providers_names.get(i);
			var provider = this.providers.get(provider_name);
			await provider.start();
		}
	}
	
	
	/**
	 * Call hook
	 */
	hook(hook_name, params)
	{
		if (params == undefined) params = null;
		var hook = this.provider("hook");
		return hook.apply(hook_name, params);
	}
	
	
	/**
	 * Translate message
	 */
	translate(s, params)
	{
		if (params == undefined) params = null;
		if (params == null) return s;
		return rs.format(s, params);
	}
	
	
	/**
	 * Returns all modules
	 * @param Collection<string> modules
	 * @return Collection<string>
	 */
	static getRequiredModules(modules)
	{
		const Vector = use("Runtime.Vector");
		var res = new Vector();
		var cache = new Map();
		this._getRequiredModules(res, cache, modules);
		return res.removeDuplicates();
	}
	
	
	/**
	 * Returns required modules
	 * @param string class_name
	 * @return Collection<string>
	 */
	static _getRequiredModules(res, cache, modules)
	{
		const Callback = use("Runtime.Callback");
		if (modules == null) return;
		for (var i = 0; i < modules.count(); i++)
		{
			var module_name = modules.get(i);
			if (!cache.has(module_name))
			{
				cache.set(module_name, true);
				var f = new Callback(module_name + String(".ModuleDescription"), "requiredModules");
				if (f.exists())
				{
					var sub_modules = f.apply();
					if (sub_modules != null)
					{
						var sub_modules = rtl.list(sub_modules.keys());
						this._getRequiredModules(res, cache, sub_modules);
					}
					res.push(module_name);
				}
			}
		}
	}
	
	
	/**
	 * Returns modules entities
	 */
	static getEntitiesFromModules(modules)
	{
		const Vector = use("Runtime.Vector");
		return modules.reduce((entities, module_name) =>
		{
			const Callback = use("Runtime.Callback");
			var f = new Callback(module_name + String(".ModuleDescription"), "entities");
			if (!f.exists()) return entities;
			var arr = f.apply();
			if (!arr) return entities;
			return entities.concat(arr);
		}, new Vector());
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.environments = new Map();
		this.providers = new Map();
		this.modules = [];
		this.entities = [];
		this.base_path = "";
		this.start_time = 0;
		this.initialized = false;
		this.started = false;
	}
	static getClassName(){ return "Runtime.Context"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(Runtime.Context);
module.exports = {
	"Context": Runtime.Context,
};