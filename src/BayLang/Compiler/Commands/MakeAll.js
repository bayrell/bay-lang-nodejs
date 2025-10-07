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
BayLang.Compiler.Commands.MakeAll = class extends BaseCommand
{
	/**
	 * Returns name
	 */
	static getName(){ return "make_all"; }
	
	
	/**
	 * Returns description
	 */
	static getDescription(){ return "Make all modules"; }
	
	
	/**
	 * Run task
	 */
	static async run()
	{
		const Project = use("BayLang.Compiler.Project");
		const Make = use("BayLang.Compiler.Commands.Make");
		/* Read project */
		var project = await Project.readProject(Runtime.rtl.getContext().base_path);
		if (!project)
		{
			rtl.error("Project not found");
			return this.ERROR;
		}
		var make = new Make();
		var modules = project.getModules();
		var keys = rtl.list(modules.keys());
		for (var i = 0; i < keys.count(); i++)
		{
			var module_name = keys.get(i);
			var module = modules.get(module_name);
			rtl.print(rtl.color("yellow", "Compile " + String(module.name)));
			await make.compile(project, module);
		}
		return this.SUCCESS;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "BayLang.Compiler.Commands.MakeAll"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.Compiler.Commands.MakeAll);
module.exports = {
	"MakeAll": BayLang.Compiler.Commands.MakeAll,
};