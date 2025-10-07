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
if (typeof BayLang == 'undefined') BayLang = {};
if (typeof BayLang.Compiler == 'undefined') BayLang.Compiler = {};
if (typeof BayLang.Compiler.Commands == 'undefined') BayLang.Compiler.Commands = {};
BayLang.Compiler.Commands.Watch = function()
{
	use("Runtime.Console.BaseCommand").apply(this, arguments);
};
BayLang.Compiler.Commands.Watch.prototype = Object.create(use("Runtime.Console.BaseCommand").prototype);
BayLang.Compiler.Commands.Watch.prototype.constructor = BayLang.Compiler.Commands.Watch;
Object.assign(BayLang.Compiler.Commands.Watch.prototype,
{
	/**
	 * On change file
	 */
	onChangeFile: async function(changed_file_path)
	{
		var __v2 = use("BayLang.Exceptions.ParserUnknownError");
		try
		{
			if (changed_file_path == this.settings.project_json_path)
			{
				var __v0 = use("Runtime.io");
				__v0.print("Reload project.json");
				await this.settings.reload();
				return Promise.resolve();
			}
			var file_info = await this.settings.compileFile(changed_file_path, "", 3);
			if (!file_info)
			{
				return Promise.resolve();
			}
			var module = file_info.get("module");
			var assets = module.config.get("assets");
			var src_file_name = file_info.get("src_file_name");
			if (file_info.get("file_name") == "/module.json")
			{
				var __v1 = use("Runtime.io");
				__v1.print("Reload module.json");
				await this.settings.reload();
			}
			else if (assets.indexOf(src_file_name) >= 0)
			{
				await this.settings.updateModule(module.name);
			}
		}
		catch (_ex)
		{
			if (_ex instanceof __v2)
			{
				var e = _ex;
				
				var __v3 = use("Runtime.io");
				__v3.print_error("Error: " + e.toString());
			}
			else if (true)
			{
				var e = _ex;
				
				var __v4 = use("Runtime.io");
				__v4.print_error(e);
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
	run: async function()
	{
		this.settings = use("Runtime.rtl").getContext().provider("BayLang.Compiler.SettingsProvider");
		let watch_dir = () =>
		{
			let io = use("Runtime.io");
			let chokidar = require("chokidar");
			return new Promise(() => {
				io.print("Start watch");
				chokidar
					.watch(ctx.base_path)
					.on('change', (path, stat) => {
						setTimeout(()=>{ this.onChangeFile(path); }, 500);
					})
				;
				
			});
		};
		
		await watch_dir();
		return Promise.resolve(this.constructor.SUCCESS);
	},
	_init: function()
	{
		use("Runtime.Console.BaseCommand").prototype._init.call(this);
		this.settings = null;
	},
});
Object.assign(BayLang.Compiler.Commands.Watch, use("Runtime.Console.BaseCommand"));
Object.assign(BayLang.Compiler.Commands.Watch,
{
	/**
	 * Returns name
	 */
	getName: function()
	{
		return "watch";
	},
	/**
	 * Returns description
	 */
	getDescription: function()
	{
		return "Watch changes";
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Compiler.Commands";
	},
	getClassName: function()
	{
		return "BayLang.Compiler.Commands.Watch";
	},
	getParentClassName: function()
	{
		return "Runtime.Console.BaseCommand";
	},
	getClassInfo: function()
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function()
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function()
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(field_name)
	{
		return null;
	},
});use.add(BayLang.Compiler.Commands.Watch);
module.exports = BayLang.Compiler.Commands.Watch;