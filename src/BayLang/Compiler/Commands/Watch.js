"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const rs = use("Runtime.rs");
/*
!
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
BayLang.Compiler.Commands.Watch = class extends use("Runtime.Console.BaseCommand")
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
		const Project = use("BayLang.Compiler.Project");
		const Make = use("BayLang.Compiler.Commands.Make");
		const ParserUnknownError = use("BayLang.Exceptions.ParserUnknownError");
		/* Read project */
		let project = await Project.readProject(Runtime.rtl.getContext().base_path);
		if (!project)
		{
			rtl.error("Project not found");
			return;
		}
		let make = new Make();
		let module = project.findModuleByFileName(changed_file_path);
		if (module)
		{
			try
			{
				let file_path = module.getRelativeSourcePath(changed_file_path);
				if (!file_path) return;
				if (module.checkExclude(file_path)) return;
				let extension = rs.extname(file_path);
				let result = await module.compile(file_path);
				if (result)
				{
					rtl.print(changed_file_path);
					await rtl.wait(1000);
					let languages = project.getLanguages();
					for (let i = 0; i < languages.count(); i++)
					{
						let lang = languages.get(i);
						let dest_file_path = module.resolveDestFilePath(file_path, lang);
						if (extension != "bay" && extension != lang) continue;
						rtl.print("=> " + String(dest_file_path));
					}
					await make.buildAsset(project, module);
				}
			}
			catch (_ex)
			{
				if (_ex instanceof ParserUnknownError)
				{
					var e = _ex;
					rtl.print(changed_file_path);
					rtl.error(e.toString());
				}
				else
				{
					throw _ex;
				}
			}
		}
	}
	
	
	/**
	 * Run task
	 */
	async run()
	{
		let watch_dir = () =>
		{
			let chokidar = require("chokidar");
			return new Promise(() => {
				console.log("Start watch");
				chokidar
					.watch(rtl.getContext().base_path)
					.on('change', (path, stat) => {
						this.onChangeFile(path);
					})
				;
				
			});
		};
		
		await watch_dir();
		return this.constructor.SUCCESS;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "BayLang.Compiler.Commands.Watch"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.Compiler.Commands.Watch);
module.exports = {
	"Watch": BayLang.Compiler.Commands.Watch,
};