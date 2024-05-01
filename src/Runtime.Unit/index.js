/*!
 *  Bayrell Language
 *
 *  (c) Copyright 2016-2023 "Ildar Bikmamatov" <support@bayrell.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.bayrell.org/licenses/APACHE-LICENSE-2.0.html
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var exports = {
	MODULE_NAME: 'Runtime.Unit',
}

function add(name)
{
	var module_name = exports.MODULE_NAME;
	
	name = name
		.substr(module_name.length + 1)
		.replace(".", "/")
	;
	
	var path = __dirname + "/" + name + ".js";
	return require(path);
}

add("Runtime.Unit.AssertHelper");
add("Runtime.Unit.Commands.TestAll");
add("Runtime.Unit.Commands.TestRun");
add("Runtime.Unit.Test");
add("Runtime.Unit.TestProvider");
add("Runtime.Unit.UnitTest");
add("Runtime.Unit.ModuleDescription");

var use = require('bay-lang').use;
exports["VERSION"] = use("Runtime.Console.ModuleDescription").getModuleVersion();

module.exports = exports;
