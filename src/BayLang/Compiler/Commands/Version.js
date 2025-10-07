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
BayLang.Compiler.Commands.Version = class extends BaseCommand
{
	/**
	 * Returns name
	 */
	static getName(){ return "version"; }
	
	
	/**
	 * Returns description
	 */
	static getDescription(){ return "Show version"; }
	
	
	/**
	 * Run task
	 */
	static async run()
	{
		const Callback = use("Runtime.Callback");
		var runtime_version = new Callback("Runtime.ModuleDescription", "getModuleVersion");
		var lang_version = new Callback("BayLang.ModuleDescription", "getModuleVersion");
		rtl.print("Lang version: " + String(lang_version.apply()));
		rtl.print("Runtime version: " + String(runtime_version.apply()));
		return this.SUCCESS;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "BayLang.Compiler.Commands.Version"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.Compiler.Commands.Version);
module.exports = {
	"Version": BayLang.Compiler.Commands.Version,
};