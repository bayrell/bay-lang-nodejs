"use strict;"
const use = require('bay-lang').use;
const BaseCommand = use("Runtime.Console.BaseCommand");
/*!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2025 "Ildar Bikmamatov" <support@bayrell.org>
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
BayLang.Compiler.Commands.Watch = class extends BaseCommand
{
	
	
	/**
	 * Returns name
	 */
	static getName(){ return "watch"; }
	
	
	/**
	 * Returns description
	 */
	static getDescription(){ return "Watch changes"; }
	
	
	/**
	 * On change file
	 */
	async onChangeFile(changed_file_path)
	{
		const io = use("Runtime.io");
		const ParserUnknownError = use("BayLang.Exceptions.ParserUnknownError");
		try
		{
			if (changed_file_path == this.settings.project_json_path)
			{
				io.print("Reload project.json");
				await this.settings.reload();
				return;
			}
			var file_info = await this.settings.compileFile(changed_file_path, "", 3);
			if (!file_info) return;
			var module = file_info.get("module");
			var assets = module.config.get("assets");
			var src_file_name = file_info.get("src_file_name");
			if (file_info.get("file_name") == "/module.json")
			{
				io.print("Reload module.json");
				await this.settings.reload();
			}
			else if (assets.indexOf(src_file_name) >= 0)
			{
				await this.settings.updateModule(module.name);
			}
		}
		catch (_ex)
		{
			if (_ex instanceof ParserUnknownError)
			{
				var e = _ex;
				io.print_error("Error: " + e.toString());
			}
			else if (true)
			{
				var e = _ex;
				io.print_error(e);
			}
			else
			{
				throw _ex;
			}
		}
	}
	
	
	/**
	 * Run task
	 */
	async run()
	{
		this.settings = Runtime.rtl.getContext().provider("BayLang.Compiler.SettingsProvider");
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
		return this.constructor.SUCCESS;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "BayLang.Compiler.Commands.Watch"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.Compiler.Commands.Watch);
module.exports = {
	"Watch": BayLang.Compiler.Commands.Watch,
};