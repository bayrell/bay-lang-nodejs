/*!
 *  Bayrell Language
 *
 *  (c) Copyright 2016-2023 "Ildar Bikmamatov" <support@bayrell.org>
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

let classes = {};
let packages = {};

function get_package_name(module_name)
{
	module_name = module_name.replace(".", "-").toLowerCase();
	if (module_name.substr(0, 7) == "runtime") module_name = "bayrell-" + module_name;
	return module_name;
}
function load_package(package_name)
{
	if (packages[package_name] != undefined)
	{
		return ;
	}
	
	let package_path = null;
	packages[package_name] = 0;
	
	try
	{
		package_path = require.resolve(package_name);
	}
	catch(e)
	{
	}
	
	if (package_path != null)
	{
		require(package_path);
		packages[package_name] = 1;
	}
}

module.exports = function (class_name)
{
	if (classes[class_name] != undefined)
	{
		return classes[class_name];
	}
	
	let class_name_arr = class_name.split(".");
	for (var i=class_name_arr.length-1; i>0; i--)
	{
		let package_name = class_name_arr.slice(0, i).join(".");
		package_name = get_package_name(package_name);
		
		load_package(package_name);
		
		if (classes[class_name] != undefined)
		{
			return classes[class_name];
		}
	}
	
	return null;
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