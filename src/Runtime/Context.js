"use strict;"
var use = require('bay-lang').use;
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
Runtime.Context = function(ctx)
{
	use("Runtime.BaseObject").apply(this, arguments);
};
Runtime.Context.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.Context.prototype.constructor = Runtime.Context;
Object.assign(Runtime.Context.prototype,
{
	/**
	 * Returns app
	 */
	getApp: function(ctx)
	{
		return this.app;
	},
	/**
	 * Returns true if is initialized
	 */
	isInitialized: function(ctx)
	{
		return this.initialized;
	},
	/**
	 * Returns true if is started
	 */
	isStarted: function(ctx)
	{
		return this.started;
	},
	/**
	 * Returns start time
	 */
	getStartTime: function(ctx)
	{
		return this.start_time;
	},
	/**
	 * Returns base path
	 */
	getBasePath: function(ctx)
	{
		return this.base_path;
	},
	/**
	 * Returns console args
	 */
	getConsoleArgs: function(ctx)
	{
		return this.cli_args.slice(ctx);
	},
	/**
	 * Returns modules
	 */
	getModules: function(ctx)
	{
		return this.modules.slice(ctx);
	},
	/**
	 * Returns entities
	 */
	getEntities: function(ctx, class_name)
	{
		if (class_name == undefined) class_name = "";
		if (class_name == "")
		{
			return this.entities.slice(ctx);
		}
		var __v0 = use("Runtime.lib");
		return this.entities.filter(ctx, __v0.isInstance(ctx, class_name));
	},
	/**
	 * Returns environments
	 */
	getEnvironments: function(ctx)
	{
		return this.environments.copy(ctx);
	},
	/**
	 * Returns provider by name
	 */
	provider: function(ctx, provider_name)
	{
		if (!this.providers.has(ctx, provider_name))
		{
			var __v0 = use("Runtime.Exceptions.RuntimeException");
			throw new __v0(ctx, "Provider '" + use("Runtime.rtl").toStr(provider_name) + use("Runtime.rtl").toStr("' not found"))
		}
		return this.providers.get(ctx, provider_name);
	},
	/**
	 * Return environment
	 */
	env: function(ctx, name)
	{
		var value = Runtime.rtl.attr(ctx, this.environments, name);
		var __v0 = use("Runtime.Hooks.RuntimeHook");
		var hook_res = this.callHook(ctx, __v0.ENV, use("Runtime.Map").from({"name":name,"value":value}));
		return Runtime.rtl.attr(ctx, hook_res, "value");
	},
	/**
	 * Init
	 */
	init: async function(ctx)
	{
		if (this.initialized)
		{
			return Promise.resolve();
		}
		/* Create app */
		if (this.entry_point)
		{
			var __v0 = use("Runtime.rtl");
			this.app = __v0.newInstance(ctx, this.entry_point);
		}
		var modules = this.modules;
		if (modules.indexOf(ctx, "Runtime"))
		{
			modules.prepend(ctx, "Runtime");
		}
		/* Extend modules */
		this.modules = this.constructor.getRequiredModules(ctx, modules);
		/* Get modules entities */
		this.entities = this.constructor.getEntitiesFromModules(ctx, this.modules);
		/* Create providers */
		this.createProviders(ctx);
		/* Init providers */
		await this.initProviders(ctx);
		/* Hook init app */
		var __v0 = use("Runtime.Hooks.RuntimeHook");
		await this.callHookAsync(ctx, __v0.INIT);
		/* Init app */
		var __v1 = use("Runtime.rtl");
		if (this.app != null && __v1.method_exists(ctx, this.app, "init"))
		{
			await this.app.init(ctx);
		}
		/* Set initialized */
		this.initialized = true;
	},
	/**
	 * Start context
	 */
	start: async function(ctx)
	{
		if (this.started)
		{
			return Promise.resolve();
		}
		/* Start providers */
		await this.startProviders(ctx);
		/* Hook start app */
		var __v0 = use("Runtime.Hooks.RuntimeHook");
		await this.callHookAsync(ctx, __v0.START);
		/* Start app */
		var __v1 = use("Runtime.rtl");
		if (this.app && __v1.method_exists(ctx, this.app, "start"))
		{
			await this.app.start(ctx);
		}
		/* Hook launched app */
		var __v1 = use("Runtime.Hooks.RuntimeHook");
		await this.callHookAsync(ctx, __v1.LAUNCHED);
		/* Set started */
		this.started = true;
	},
	/**
	 * Run context
	 */
	run: async function(ctx)
	{
		var code = 0;
		/* Run app */
		if (this.app == null)
		{
			return Promise.resolve();
		}
		/* Run entry_point */
		var __v0 = use("Runtime.rtl");
		if (__v0.method_exists(ctx, this.app, "main"))
		{
			/* Hook launched app */
			var __v1 = use("Runtime.Hooks.RuntimeHook");
			await this.callHookAsync(ctx, __v1.RUN);
			code = await this.app.main(ctx);
		}
		return Promise.resolve(code);
	},
	/**
	 * Call hook
	 */
	callHook: function(ctx, hook_name, params)
	{
		if (params == undefined) params = null;
		if (params == null)
		{
			params = use("Runtime.Map").from({});
		}
		if (!this.providers.has(ctx, "hook"))
		{
			return params;
		}
		var hook = this.provider(ctx, "hook");
		var methods_list = hook.getMethods(ctx, hook_name);
		for (var i = 0; i < methods_list.count(ctx); i++)
		{
			var f = Runtime.rtl.attr(ctx, methods_list, i);
			var __v0 = use("Runtime.rtl");
			var res = __v0.apply(ctx, f, use("Runtime.Vector").from([params]));
			var __v1 = use("Runtime.rtl");
			if (__v1.isPromise(ctx, res))
			{
				var __v2 = use("Runtime.Exceptions.RuntimeException");
				throw new __v2(ctx, "Promise is not allowed")
			}
		}
		return params;
	},
	/**
	 * Call hook
	 */
	callHookAsync: async function(ctx, hook_name, params)
	{
		if (params == undefined) params = null;
		if (params == null)
		{
			params = use("Runtime.Map").from({});
		}
		var hook = this.provider(ctx, "hook");
		var methods_list = hook.getMethods(ctx, hook_name);
		for (var i = 0; i < methods_list.count(ctx); i++)
		{
			var f = Runtime.rtl.attr(ctx, methods_list, i);
			var __v0 = use("Runtime.rtl");
			await __v0.apply(ctx, f, use("Runtime.Vector").from([params]));
		}
		return Promise.resolve(params);
	},
	/**
	 * Translate message
	 */
	translate: function(ctx, module, s, params)
	{
		if (params == undefined) params = null;
		if (params == null)
		{
			return s;
		}
		var __v0 = use("Runtime.rs");
		return __v0.format(ctx, s, params);
	},
	/**
	 * Create providers
	 */
	createProviders: function(ctx)
	{
		var providers = this.getEntities(ctx, "Runtime.Entity.Provider");
		for (var i = 0; i < providers.count(ctx); i++)
		{
			var factory = providers.get(ctx, i);
			/* Create provider */
			var provider = factory.createInstance(ctx);
			if (!provider)
			{
				var __v0 = use("Runtime.Exceptions.RuntimeException");
				throw new __v0(ctx, "Wrong declare provider '" + use("Runtime.rtl").toStr(factory.name) + use("Runtime.rtl").toStr("'"))
			}
			/* Add provider */
			this.registerProvider(ctx, factory.name, provider);
		}
	},
	/**
	 * Init providers
	 */
	initProviders: async function(ctx)
	{
		var providers_names = this.providers.keys(ctx);
		for (var i = 0; i < providers_names.count(ctx); i++)
		{
			var provider_name = providers_names.get(ctx, i);
			var provider = this.providers.get(ctx, provider_name);
			await provider.init(ctx);
		}
	},
	/**
	 * Start providers
	 */
	startProviders: async function(ctx)
	{
		var providers_names = this.providers.keys(ctx);
		for (var i = 0; i < providers_names.count(ctx); i++)
		{
			var provider_name = providers_names.get(ctx, i);
			var provider = this.providers.get(ctx, provider_name);
			await provider.start(ctx);
		}
	},
	/**
	 * Register provider
	 */
	registerProvider: function(ctx, provider_name, provider)
	{
		if (this.initialized)
		{
			return ;
		}
		var __v0 = use("Runtime.BaseProvider");
		if (!(provider instanceof __v0))
		{
			var __v1 = use("Runtime.Exceptions.RuntimeException");
			throw new __v1(ctx, "Provider '" + provider_name + "' must be intstanceof BaseProvider")
		}
		this.providers.set(ctx, provider_name, provider);
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.app = null;
		this.base_path = "";
		this.entry_point = "";
		this.cli_args = use("Runtime.Vector").from([]);
		this.environments = use("Runtime.Map").from({});
		this.modules = use("Runtime.Vector").from([]);
		this.providers = use("Runtime.Map").from({});
		this.entities = use("Runtime.Vector").from([]);
		this.start_time = 0;
		this.initialized = false;
		this.started = false;
	},
});
Object.assign(Runtime.Context, use("Runtime.BaseObject"));
Object.assign(Runtime.Context,
{
	/**
	 * Create context
	 */
	create: function(ctx, params)
	{
		var __v0 = use("Runtime.Dict");
		if (!(params instanceof __v0))
		{
			var __v1 = use("Runtime.Dict");
			params = __v1.from(params);
		}
		params = params.toMap(ctx);
		if (!params.has("start_time"))
		{
			params.set("start_time", Date.now());
		}
		let Map = use("Runtime.Map");
		let Vector = use("Runtime.Vector");
		
		if (!params.has(ctx, "cli_args"))
		{
			params.set(ctx, "cli_args", Vector.from(process.argv.slice(1)));
		}
		if (!params.has(ctx, "base_path"))
		{
			params.set(ctx, "base_path", process.cwd());
		}
		if (!params.has(ctx, "environments"))
		{
			params.set(ctx, "environments", Map.from(process.env));
		}
		if (params.has(ctx, "modules"))
		{
			var modules = params.get(ctx, "modules");
			var __v0 = use("Runtime.Vector");
			if (!(modules instanceof __v0))
			{
				var __v1 = use("Runtime.Vector");
				modules = __v1.from(modules);
			}
			params.set(ctx, "modules", modules.toVector(ctx));
		}
		/* Setup default environments */
		if (!params.has(ctx, "environments"))
		{
			var __v0 = use("Runtime.Map");
			params.set(ctx, "environments", new __v0(ctx));
		}
		var env = params.get(ctx, "environments");
		if (!env)
		{
			env = use("Runtime.Map").from({});
		}
		if (!env.has(ctx, "CLOUD_ENV"))
		{
			env.set(ctx, "CLOUD_ENV", false);
		}
		if (!env.has(ctx, "DEBUG"))
		{
			env.set(ctx, "DEBUG", false);
		}
		if (!env.has(ctx, "LOCALE"))
		{
			env.set(ctx, "LOCALE", "en_US");
		}
		if (!env.has(ctx, "TZ"))
		{
			env.set(ctx, "TZ", "UTC");
		}
		if (!env.has(ctx, "TZ_OFFSET"))
		{
			env.set(ctx, "TZ_OFFSET", 0);
		}
		var __v0 = use("Runtime.rtl");
		var instance = __v0.newInstance(ctx, this.getClassName(ctx));
		if (params.has(ctx, "base_path"))
		{
			instance.base_path = params.get(ctx, "base_path");
		}
		if (params.has(ctx, "entry_point"))
		{
			instance.entry_point = params.get(ctx, "entry_point");
		}
		if (params.has(ctx, "cli_args"))
		{
			instance.cli_args = params.get(ctx, "cli_args");
		}
		if (params.has(ctx, "environments"))
		{
			instance.environments = params.get(ctx, "environments");
		}
		if (params.has(ctx, "modules"))
		{
			instance.modules = params.get(ctx, "modules");
		}
		if (params.has(ctx, "start_time"))
		{
			instance.start_time = params.get(ctx, "start_time");
		}
		if (params.has(ctx, "tz"))
		{
			instance.tz = params.get(ctx, "tz");
		}
		return instance;
	},
	/**
	 * Returns all modules
	 * @param Collection<string> modules
	 * @return Collection<string>
	 */
	getRequiredModules: function(ctx, modules)
	{
		var __v0 = use("Runtime.Vector");
		var res = new __v0(ctx);
		var __v1 = use("Runtime.Map");
		var cache = new __v1(ctx);
		this._getRequiredModules(ctx, res, cache, modules);
		return res.removeDuplicates(ctx);
	},
	/**
	 * Returns required modules
	 * @param string class_name
	 * @return Collection<string>
	 */
	_getRequiredModules: function(ctx, res, cache, modules)
	{
		if (modules == null)
		{
			return ;
		}
		for (var i = 0; i < modules.count(ctx); i++)
		{
			var module_name = modules.item(ctx, i);
			if (!cache.has(ctx, module_name))
			{
				cache.set(ctx, module_name, true);
				var __v0 = use("Runtime.Callback");
				var f = new __v0(ctx, module_name + use("Runtime.rtl").toStr(".ModuleDescription"), "requiredModules");
				if (f.exists(ctx))
				{
					var __v1 = use("Runtime.rtl");
					var sub_modules = __v1.apply(ctx, f);
					if (sub_modules != null)
					{
						var sub_modules = sub_modules.keys(ctx);
						this._getRequiredModules(ctx, res, cache, sub_modules);
					}
					res.push(ctx, module_name);
				}
			}
		}
	},
	/**
	 * Returns modules entities
	 */
	getEntitiesFromModules: function(ctx, modules)
	{
		var __v0 = use("Runtime.Vector");
		var entities = new __v0(ctx);
		for (var i = 0; i < modules.count(ctx); i++)
		{
			var module_name = modules.item(ctx, i);
			var __v1 = use("Runtime.Callback");
			var f = new __v1(ctx, module_name + use("Runtime.rtl").toStr(".ModuleDescription"), "entities");
			if (f.exists(ctx))
			{
				var arr = f.apply(ctx);
				if (arr)
				{
					entities.appendItems(ctx, arr);
				}
			}
		}
		return entities;
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.Context";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
	},
	getClassInfo: function(ctx)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function(ctx)
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function(ctx)
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		return null;
	},
});use.add(Runtime.Context);
module.exports = Runtime.Context;