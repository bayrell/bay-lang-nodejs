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
if (typeof Bayrell.Lang.Compiler.Commands == 'undefined') Bayrell.Lang.Compiler.Commands = {};
Bayrell.Lang.Compiler.Commands.Watch = function(ctx)
{
	use("Runtime.Console.BaseCommand").apply(this, arguments);
};
Bayrell.Lang.Compiler.Commands.Watch.prototype = Object.create(use("Runtime.Console.BaseCommand").prototype);
Bayrell.Lang.Compiler.Commands.Watch.prototype.constructor = Bayrell.Lang.Compiler.Commands.Watch;
Object.assign(Bayrell.Lang.Compiler.Commands.Watch.prototype,
{
	/**
	 * On change file
	 */
	onChangeFile: async function(ctx, changed_file_path)
	{
		var __v0 = use("Bayrell.Lang.Exceptions.ParserUnknownError");
		try
		{
			if (changed_file_path == this.settings.project_json_path)
			{
				var __v0 = use("Runtime.io");
				__v0.print(ctx, "Reload project.json");
				await this.settings.reload(ctx);
				return Promise.resolve();
			}
			var file_info = await this.settings.compileFile(ctx, changed_file_path, "", 3);
			if (!file_info)
			{
				return Promise.resolve();
			}
			var module = file_info.get(ctx, "module");
			var assets = module.config.get(ctx, "assets");
			var module_file_name = file_info.get(ctx, "module_file_name");
			if (file_info.get(ctx, "file") == "/module.json")
			{
				var __v0 = use("Runtime.io");
				__v0.print(ctx, "Reload module.json");
				await this.settings.reload(ctx);
			}
			else if (assets.indexOf(ctx, module_file_name) >= 0)
			{
				await this.settings.updateModule(ctx, module.name);
			}
		}
		catch (_ex)
		{
			if (_ex instanceof __v0)
			{
				var e = _ex;
				
				var __v1 = use("Runtime.io");
				__v1.print_error(ctx, "Error: " + e.toString(ctx));
			}
			else if (true)
			{
				var e = _ex;
				
				var __v2 = use("Runtime.io");
				__v2.print_error(ctx, e);
			}
			else
			{
				throw _ex;
			}
		}
	},
	/**
	 * Run task
	 */
	run: async function(ctx)
	{
		this.settings = ctx.provider(ctx, "Bayrell.Lang.Compiler.SettingsProvider");
		let watch_dir = (ctx) =>
		{
			let io = use("Runtime.io");
			let chokidar = require("chokidar");
			return new Promise(() => {
				io.print(ctx, "Start watch");
				chokidar
					.watch(ctx.base_path)
					.on('change', (path, stat) => {
						setTimeout(()=>{ this.onChangeFile(ctx, path); }, 500);
					})
				;
				
			});
		};
		
		await watch_dir(ctx);
		return Promise.resolve(this.constructor.SUCCESS);
	},
	_init: function(ctx)
	{
		use("Runtime.Console.BaseCommand").prototype._init.call(this,ctx);
		this.settings = null;
	},
});
Object.assign(Bayrell.Lang.Compiler.Commands.Watch, use("Runtime.Console.BaseCommand"));
Object.assign(Bayrell.Lang.Compiler.Commands.Watch,
{
	/**
	 * Returns name
	 */
	getName: function(ctx)
	{
		return "watch";
	},
	/**
	 * Returns description
	 */
	getDescription: function(ctx)
	{
		return "Watch changes";
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Bayrell.Lang.Compiler.Commands";
	},
	getClassName: function()
	{
		return "Bayrell.Lang.Compiler.Commands.Watch";
	},
	getParentClassName: function()
	{
		return "Runtime.Console.BaseCommand";
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
});use.add(Bayrell.Lang.Compiler.Commands.Watch);
module.exports = Bayrell.Lang.Compiler.Commands.Watch;