"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const rs = use("Runtime.rs");
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
BayLang.Compiler.Commands.Make = class extends BaseCommand
{
	/**
	 * Returns name
	 */
	static getName(){ return "make"; }
	
	
	/**
	 * Returns description
	 */
	static getDescription(){ return "Make module"; }
	
	
	/**
	 * Build asset
	 */
	async buildAsset(project, module)
	{
		var languages = project.getLanguages();
		if (languages.indexOf("es6") != -1)
		{
			var project_assets = module.getProjectAssets();
			for (var i = 0; i < project_assets.count(); i++)
			{
				var asset_item = project_assets.get(i);
				await project.buildAsset(asset_item);
				rtl.print("Bundle to => " + String(asset_item.get("dest")));
			}
		}
	}
	
	
	/**
	 * Compile module
	 */
	async compile(project, module, lang)
	{
		const fs = use("Runtime.fs");
		const ParserUnknownError = use("BayLang.Exceptions.ParserUnknownError");
		if (lang == undefined) lang = "";
		var is_success = true;
		var module_src_path = module.getSourceFolderPath();
		var files = await fs.listDirRecursive(module_src_path);
		for (var i = 0; i < files.count(); i++)
		{
			var file_name = files[i];
			var file_path = fs.join([module_src_path, file_name]);
			/* Detect is file */
			if (!await fs.isFile(file_path))
			{
				continue;
			}
			/* Check if not exclude */
			if (module.checkExclude(file_name))
			{
				continue;
			}
			/* Compile */
			try
			{
				var extension = rs.extname(file_name);
				if (extension == "bay")
				{
					rtl.print(file_name);
					await module.compile(file_name, lang);
				}
			}
			catch (_ex)
			{
				if (_ex instanceof ParserUnknownError)
				{
					var e = _ex;
					rtl.error(e.toString());
					is_success = false;
				}
				else if (true)
				{
					var e = _ex;
					rtl.error(e);
					is_success = false;
				}
				else
				{
					throw _ex;
				}
			}
		}
		if (!is_success)
		{
			return false;
		}
		await this.buildAsset(project, module);
		return true;
	}
	
	
	/**
	 * Run task
	 */
	async run()
	{
		const Modules = use("BayLang.Compiler.Commands.Modules");
		const Project = use("BayLang.Compiler.Project");
		var module_name = Runtime.rtl.getContext().cli_args[2];
		var lang = Runtime.rtl.getContext().cli_args[3];
		if (!module_name)
		{
			Modules.showModules();
			return 0;
		}
		/* Read project */
		var project = await Project.readProject(Runtime.rtl.getContext().base_path);
		if (!project)
		{
			rtl.error("Project not found");
			return;
		}
		/* Get module */
		var module = project.getModule(module_name);
		if (!module)
		{
			rtl.error("Module not found");
			return;
		}
		/* Compile module */
		var is_success = await this.compile(project, module, lang);
		if (!is_success)
		{
			return this.constructor.ERROR;
		}
		return this.constructor.SUCCESS;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "BayLang.Compiler.Commands.Make"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.Compiler.Commands.Make);
module.exports = {
	"Make": BayLang.Compiler.Commands.Make,
};