"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
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
BayLang.Compiler.Commands.Modules = class extends BaseCommand
{
	/**
	 * Returns name
	 */
	static getName(){ return "modules"; }
	
	
	/**
	 * Returns description
	 */
	static getDescription(){ return "Show modules"; }
	
	
	/**
	 * Run task
	 */
	static async run()
	{
		this.showModules(true);
		return this.SUCCESS;
	}
	
	
	/**
	 * Show modules
	 */
	static async showModules(verbose)
	{
		const Project = use("BayLang.Compiler.Project");
		var project = await Project.readProject(Runtime.rtl.getContext().base_path);
		if (!project)
		{
			return;
		}
		var modules = project.getModules();
		var modules_names = rtl.list(modules.keys()).sort();
		for (var i = 0; i < modules_names.count(); i++)
		{
			var module_name = modules_names[i];
			var module = modules.get(module_name);
			if (verbose)
			{
				rtl.print(i + 1 + String(") ") + String(rtl.color("yellow", module_name)) + String(" - ") + String(module.path));
			}
			else
			{
				rtl.print(module_name);
			}
		}
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "BayLang.Compiler.Commands.Modules"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.Compiler.Commands.Modules);
module.exports = {
	"Modules": BayLang.Compiler.Commands.Modules,
};