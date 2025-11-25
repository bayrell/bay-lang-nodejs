"use strict;"
const use = require('bay-lang').use;
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
if (typeof Runtime.Console == 'undefined') Runtime.Console = {};
Runtime.Console.BaseCommand = class extends use("Runtime.BaseObject")
{
	static SUCCESS = 1;
	static ERROR = -1;
	
	
	/**
	 * Returns name
	 */
	static getName(){ return ""; }
	
	
	/**
	 * Returns description
	 */
	static getDescription(){ return ""; }
	
	
	/**
	 * Run task
	 */
	runTask()
	{
		return this.constructor.UNKNOWN_ERROR;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "Runtime.Console.BaseCommand"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Console.BaseCommand);
module.exports = {
	"BaseCommand": Runtime.Console.BaseCommand,
};