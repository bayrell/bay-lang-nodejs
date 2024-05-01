"use strict;"
var use = require('bay-lang').use;
/*!
 *  Bayrell Language
 *
 *  (c) Copyright 2016-2023 "Ildar Bikmamatov" <support@bayrell.org>
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
if (typeof Bayrell == 'undefined') Bayrell = {};
if (typeof Bayrell.Lang == 'undefined') Bayrell.Lang = {};
if (typeof Bayrell.Lang.Compiler == 'undefined') Bayrell.Lang.Compiler = {};
Bayrell.Lang.Compiler.CLI = function(ctx)
{
};
Object.assign(Bayrell.Lang.Compiler.CLI.prototype,
{
	/**
	 * Returns modules
	 */
	getModules: function(ctx)
	{
		return this.settings.modules;
	},
	/**
	 * Show modules
	 */
	showModules: function(ctx, verbose)
	{
		var modules = this.getModules(ctx);
		var modules_names = modules.keys(ctx).sort(ctx);
		for (var i = 0; i < modules_names.count(ctx); i++)
		{
			var module_name = Runtime.rtl.attr(ctx, modules_names, i);
			var module = Runtime.rtl.attr(ctx, modules, module_name);
			if (verbose)
			{
				var __v0 = use("Runtime.io");
				var __v1 = use("Runtime.io");
				__v0.print(ctx, i + 1 + use("Runtime.rtl").toStr(") ") + use("Runtime.rtl").toStr(__v1.color(ctx, "yellow", module_name)) + use("Runtime.rtl").toStr(" - ") + use("Runtime.rtl").toStr(module.path));
			}
			else
			{
				var __v2 = use("Runtime.io");
				__v2.print(ctx, module_name);
			}
		}
	},
	/**
	 * Init app
	 */
	init: async function(ctx, c)
	{
		return Promise.resolve(c);
	},
	/**
	 * Start app
	 */
	start: async function(ctx)
	{
		/* Create settings provider */
		var __v0 = use("Bayrell.Lang.Compiler.SettingsProvider");
		this.settings = new __v0(ctx);
		var __v1 = use("Runtime.fs");
		this.settings.project_json_path = __v1.join(ctx, use("Runtime.Vector").from([ctx.base_path,"project.json"]));
		await this.settings.reload(ctx);
	},
	/**
	 * Main entry point
	 */
	main: async function(ctx)
	{
		var cmd = Runtime.rtl.attr(ctx, ctx.cli_args, 1);
		var __v0 = use("Runtime.rtl");
		if (__v0.isEmpty(ctx, cmd))
		{
			var __v1 = use("Runtime.io");
			__v1.print(ctx, "Methods:");
			var __v2 = use("Runtime.io");
			__v2.print(ctx, "  assets");
			var __v3 = use("Runtime.io");
			__v3.print(ctx, "  make");
			var __v4 = use("Runtime.io");
			__v4.print(ctx, "  make_all");
			var __v5 = use("Runtime.io");
			__v5.print(ctx, "  modules");
			var __v6 = use("Runtime.io");
			__v6.print(ctx, "  version");
			var __v7 = use("Runtime.io");
			__v7.print(ctx, "  watch");
			return Promise.resolve(0);
		}
		else if (cmd == "version")
		{
			var __v8 = use("Runtime.rtl");
			var runtime_version = __v8.method(ctx, "Runtime.ModuleDescription", "getModuleVersion");
			var __v9 = use("Runtime.rtl");
			var lang_version = __v9.method(ctx, "Bayrell.Lang.ModuleDescription", "getModuleVersion");
			var __v10 = use("Runtime.io");
			__v10.print(ctx, "Lang version: " + use("Runtime.rtl").toStr(lang_version(ctx)));
			var __v11 = use("Runtime.io");
			__v11.print(ctx, "Runtime version: " + use("Runtime.rtl").toStr(runtime_version(ctx)));
			return Promise.resolve(0);
		}
		else if (cmd == "modules")
		{
			this.showModules(ctx, true);
			return Promise.resolve(0);
		}
		else if (cmd == "make")
		{
			var module_name = Runtime.rtl.attr(ctx, ctx.cli_args, 2);
			var lang = Runtime.rtl.attr(ctx, ctx.cli_args, 3);
			var __v12 = use("Runtime.rtl");
			if (__v12.isEmpty(ctx, module_name))
			{
				this.showModules(ctx);
				return Promise.resolve(0);
			}
			return Promise.resolve(await this.compileModule(ctx, module_name, lang));
		}
		else if (cmd == "make_all")
		{
			var lang = Runtime.rtl.attr(ctx, ctx.cli_args, 2);
			var modules = this.getModules(ctx);
			var modules_names = modules.keys(ctx).sort(ctx);
			for (var i = 0; i < modules_names.count(ctx); i++)
			{
				var module_name = Runtime.rtl.attr(ctx, modules_names, i);
				var __v12 = use("Runtime.io");
				var __v13 = use("Runtime.io");
				__v12.print(ctx, __v13.color(ctx, "yellow", "Compile " + use("Runtime.rtl").toStr(module_name)));
				await this.compileModule(ctx, module_name, lang);
			}
		}
		else if (cmd == "assets")
		{
			var module_name = Runtime.rtl.attr(ctx, ctx.cli_args, 2);
			var lang = Runtime.rtl.attr(ctx, ctx.cli_args, 3);
			var __v12 = use("Runtime.rtl");
			if (__v12.isEmpty(ctx, module_name))
			{
				this.showModules(ctx);
				return Promise.resolve(0);
			}
			return Promise.resolve(await this.makeAssets(ctx, module_name));
		}
		else if (cmd == "watch")
		{
			let on_change_file = async (ctx, changed_file_path) =>
			{
				let io = use("Runtime.io");
				try
				{
					if (changed_file_path == this.settings.project_json_path)
					{
						io.print(ctx, "Reload project.json");
						await this.settings.reload();
						return;
					}
					
					let file_info = await this.compileFile(ctx, changed_file_path, "", 3);
					if (file_info)
					{
						let module = file_info.get(ctx, "module");
						let assets = module.config.get(ctx, "assets");
						let module_file_name = file_info.get(ctx, "module_file_name");
						
						if (file_info.get(ctx, "file") == "/module.json")
						{
							io.print(ctx, "Reload module.json");
							await this.settings.reload();
						}
						
						else if (assets.indexOf(ctx, module_file_name) >= 0)
						{
							await this.makeAssets(ctx, module.name);
						}
					}
				}
				catch (e)
				{
					let ParserUnknownError = use("Bayrell.Lang.Exceptions.ParserUnknownError");
					if (e instanceof ParserUnknownError)
					{
						io.print_error(ctx, "Error: " + e.toString());
					}
					else
					{
						io.print_error(ctx, e);
					}
					return;
				}
			};
			
			let watch_dir = (ctx) =>
			{
				let io = use("Runtime.io");
				let chokidar = require('chokidar');
				return new Promise(() => {
					
					io.print(ctx, "Start watch");
					chokidar
						.watch(ctx.base_path)
						.on('change', (path, stat) => {
							setTimeout(()=>{ on_change_file(ctx, path); }, 500);
						})
					;
					
				});
			};
			
			await watch_dir(ctx);
		}
		return Promise.resolve(0);
	},
	_init: function(ctx)
	{
		this.settings = null;
	},
});
Object.assign(Bayrell.Lang.Compiler.CLI,
{
	/**
	 * App modules
	 */
	modules: function(ctx)
	{
		return use("Runtime.Vector").from(["Bayrell.Lang"]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Bayrell.Lang.Compiler";
	},
	getClassName: function()
	{
		return "Bayrell.Lang.Compiler.CLI";
	},
	getParentClassName: function()
	{
		return "";
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
});use.add(Bayrell.Lang.Compiler.CLI);
module.exports = Bayrell.Lang.Compiler.CLI;