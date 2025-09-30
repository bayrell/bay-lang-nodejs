"use strict;"
var use = require('bay-lang').use;
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
if (typeof BayLang == 'undefined') BayLang = {};
if (typeof BayLang.Compiler == 'undefined') BayLang.Compiler = {};
BayLang.Compiler.Module = function()
{
	use("Runtime.BaseStruct").apply(this, arguments);
};
BayLang.Compiler.Module.prototype = Object.create(use("Runtime.BaseStruct").prototype);
BayLang.Compiler.Module.prototype.constructor = BayLang.Compiler.Module;
Object.assign(BayLang.Compiler.Module.prototype,
{
	/**
	 * Returns module path
	 */
	getModulePath: function()
	{
		return this.path;
	},
	/**
	 * Returns source path
	 */
	getSourcePath: function()
	{
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(Runtime.rtl.attr(this.config, "src"));
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(__v2.m_to("string", ""));
		var module_src = __v1.value();
		var __v3 = use("Runtime.fs");
		var module_src_path = __v3.join(use("Runtime.Vector").from([this.path,module_src]));
		var __v4 = use("Runtime.rs");
		return __v4.removeLastSlash(module_src_path);
	},
	/**
	 * Has group
	 */
	hasGroup: function(group_name)
	{
		var __v0 = use("Runtime.rs");
		if (__v0.substr(group_name, 0, 1) != "@")
		{
			return false;
		}
		var __v0 = use("Runtime.rs");
		group_name = __v0.substr(group_name, 1);
		var groups = this.config.get("groups");
		if (groups == null)
		{
			return false;
		}
		if (groups.indexOf(group_name) == -1)
		{
			return false;
		}
		return true;
	},
	/**
	 * Returns true if this module contains in module list include groups
	 */
	inModuleList: function(module_names)
	{
		for (var i = 0; i < module_names.count(); i++)
		{
			var module_name = module_names.get(i);
			if (this.name == module_name)
			{
				return true;
			}
			if (this.hasGroup(module_name))
			{
				return true;
			}
		}
		return false;
	},
	/**
	 * Returns full source file.
	 * Returns file_path
	 */
	resolveSourceFile: function(file_name)
	{
		var first_char = Runtime.rtl.attr(file_name, 0);
		if (first_char == "@")
		{
			var __v0 = use("Runtime.fs");
			var __v1 = use("Runtime.rs");
			return __v0.join(use("Runtime.Vector").from([this.path,__v1.substr(file_name, 1)]));
		}
		var path = this.getSourcePath();
		var __v0 = use("Runtime.fs");
		return __v0.join(use("Runtime.Vector").from([path,file_name]));
	},
	/**
	 * Resolve destination file
	 */
	resolveDestFile: function(project_path, relative_file_name, lang)
	{
		if (!this.config.has("dest"))
		{
			return "";
		}
		if (!this.config.get("dest").has(lang))
		{
			return "";
		}
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(Runtime.rtl.attr(this.config, ["dest", lang]));
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(__v2.m_to("string", ""));
		var dest = __v1.value();
		var dest_path = "";
		var __v3 = use("Runtime.rs");
		var is_local = __v3.substr(dest, 0, 2) == "./";
		if (is_local)
		{
			var __v4 = use("Runtime.fs");
			dest_path = __v4.join(use("Runtime.Vector").from([this.path,dest,relative_file_name]));
		}
		else
		{
			var __v5 = use("Runtime.fs");
			dest_path = __v5.join(use("Runtime.Vector").from([project_path,dest,relative_file_name]));
		}
		if (lang == "php")
		{
			var __v4 = use("Runtime.re");
			dest_path = __v4.replace("\\.bay$", ".php", dest_path);
			var __v5 = use("Runtime.re");
			dest_path = __v5.replace("\\.ui$", ".php", dest_path);
		}
		else if (lang == "es6")
		{
			var __v6 = use("Runtime.re");
			dest_path = __v6.replace("\\.bay$", ".js", dest_path);
			var __v7 = use("Runtime.re");
			dest_path = __v7.replace("\\.ui$", ".js", dest_path);
		}
		else if (lang == "nodejs")
		{
			var __v8 = use("Runtime.re");
			dest_path = __v8.replace("\\.bay$", ".js", dest_path);
			var __v9 = use("Runtime.re");
			dest_path = __v9.replace("\\.ui$", ".js", dest_path);
		}
		return dest_path;
	},
	/**
	 * Check exclude
	 */
	checkExclude: function(file_name)
	{
		var module_excludelist = Runtime.rtl.attr(this.config, "exclude");
		var __v0 = use("Runtime.Collection");
		if (module_excludelist && module_excludelist instanceof __v0)
		{
			for (var i = 0; i < module_excludelist.count(); i++)
			{
				var __v1 = use("Runtime.Monad");
				var __v2 = new __v1(Runtime.rtl.attr(module_excludelist, i));
				var __v3 = use("Runtime.rtl");
				__v2 = __v2.monad(__v3.m_to("string", ""));
				var file_match = __v2.value();
				if (file_match == "")
				{
					continue;
				}
				var __v4 = use("Runtime.re");
				var res = __v4.match(file_match, file_name);
				if (res)
				{
					return true;
				}
			}
		}
		return false;
	},
	/**
	 * Check allow list
	 */
	checkAllow: function(file_name)
	{
		var success = false;
		var module_allowlist = Runtime.rtl.attr(this.config, "allow");
		var __v0 = use("Runtime.Collection");
		if (module_allowlist && module_allowlist instanceof __v0)
		{
			for (var i = 0; i < module_allowlist.count(); i++)
			{
				var __v1 = use("Runtime.Monad");
				var __v2 = new __v1(Runtime.rtl.attr(module_allowlist, i));
				var __v3 = use("Runtime.rtl");
				__v2 = __v2.monad(__v3.m_to("string", ""));
				var file_match = __v2.value();
				if (file_match == "")
				{
					continue;
				}
				var __v4 = use("Runtime.re");
				var res = __v4.match(file_match, file_name);
				/* Ignore */
				var __v5 = use("Runtime.rs");
				if (__v5.charAt(file_match, 0) == "!")
				{
					if (res)
					{
						success = false;
					}
				}
				else
				{
					if (res)
					{
						success = true;
					}
				}
			}
		}
		return success;
	},
	_init: function()
	{
		use("Runtime.BaseStruct").prototype._init.call(this);
		this.name = "";
		this.path = "";
		this.config = use("Runtime.Map").from({});
	},
});
Object.assign(BayLang.Compiler.Module, use("Runtime.BaseStruct"));
Object.assign(BayLang.Compiler.Module,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Compiler";
	},
	getClassName: function()
	{
		return "BayLang.Compiler.Module";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseStruct";
	},
	getClassInfo: function()
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function()
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function()
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(field_name)
	{
		return null;
	},
});use.add(BayLang.Compiler.Module);
module.exports = BayLang.Compiler.Module;