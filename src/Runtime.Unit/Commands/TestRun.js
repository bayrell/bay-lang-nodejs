"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
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
if (typeof Runtime == 'undefined') Runtime = {};
if (typeof Runtime.Unit == 'undefined') Runtime.Unit = {};
if (typeof Runtime.Unit.Commands == 'undefined') Runtime.Unit.Commands = {};
Runtime.Unit.Commands.TestRun = class extends use("Runtime.Console.BaseCommand")
{
	/**
	 * Returns name
	 */
	static getName(){ return "test::run"; }
	
	
	/**
	 * Returns description
	 */
	static getDescription(){ return "Run test"; }
	
	
	/**
	 * Run task
	 */
	static async run()
	{
		let test_name = Runtime.rtl.getContext().cli_args[2];
		let error_code = this.SUCCESS;
		if (test_name == null)
		{
			/* List all tests */
			rtl.print("List of all tests:");
			let tests = Runtime.rtl.getContext().provider("Runtime.Unit.TestProvider");
			for (let i = 0; i < tests.count(); i++)
			{
				let test = tests.get(i);
				rtl.print(i + 1 + String(") ") + String(rtl.color("yellow", test.name)));
			}
		}
		else
		{
			/* Run current test */
			let tests = Runtime.rtl.getContext().provider("Runtime.Unit.TestProvider");
			error_code = await tests.runTestByName(test_name);
			if (error_code == 1)
			{
				rtl.print(rtl.color("green", "OK"));
			}
			else
			{
				rtl.print(rtl.color("red", "Fail"));
			}
		}
		return error_code;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "Runtime.Unit.Commands.TestRun"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Unit.Commands.TestRun);
module.exports = {
	"TestRun": Runtime.Unit.Commands.TestRun,
};