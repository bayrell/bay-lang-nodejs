"use strict;"
const use = require('bay-lang').use;
const Entity = use("Runtime.Entity.Entity");
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
if (typeof Runtime == 'undefined') Runtime = {};
if (typeof Runtime.Console == 'undefined') Runtime.Console = {};
if (typeof Runtime.Console.Annotations == 'undefined') Runtime.Console.Annotations = {};
Runtime.Console.Annotations.ConsoleCommand = class extends Entity
{
	constructor(api_name)
	{
		super(Map.create({
			"name": api_name,
		}));
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "Runtime.Console.Annotations.ConsoleCommand"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(Runtime.Console.Annotations.ConsoleCommand);
module.exports = {
	"ConsoleCommand": Runtime.Console.Annotations.ConsoleCommand,
};