/*!
 *  Bayrell Language
 *
 *  (c) Copyright 2016-2026 "Ildar Bikmamatov" <support@bayrell.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const path = require("path");

let modules = {};
let classes = {};

function load_class_name(class_name)
{
	for (const module_name in modules)
	{
		const module_path = modules[module_name];
		if (!class_name.startsWith(module_name + ".")) continue;
		
		let file_path = class_name.substring(module_name.length + 1);
		file_path = path.join(module_path, file_path.replaceAll(".", path.sep) + ".js");
		
		let exists = false;
		try
		{
			exists = require.resolve(file_path);
		}
		catch (e)
		{
		}
		
		if (exists)
		{
			require(file_path);
			return;
		}
	}
	
	if (classes[class_name] == undefined) classes[class_name] = null;
}

module.exports = function (class_name)
{
	if (classes[class_name] != undefined)
	{
		return classes[class_name];
	}
	
	load_class_name(class_name);
	
	return classes[class_name];
}
module.exports.include = function(module_name)
{
	let data = require(module_name);
	if (data && data.MODULE_NAME)
	{
		const module_path = path.dirname(module_name);
		modules[data.MODULE_NAME] = module_path;
	}
}
module.exports.add = function (cls)
{
	if (cls == null || cls == undefined) return ;
	if (cls.getClassName == null || cls.getClassName == undefined) return ;
	
	let class_name = cls.getClassName();
	if (class_name == null || class_name == undefined) return ;
	
	classes[class_name] = cls;
	
	return null;
}
module.exports.get_classes = function ()
{
	return Object.assign({}, classes);
}
module.exports.get_modules = function ()
{
	return Object.assign({}, modules);
}