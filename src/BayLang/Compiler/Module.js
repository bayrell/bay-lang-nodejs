"use strict;"
var use = require('bay-lang').use;
/*!
 *  Bayrell Language
 *
 *  (c) Copyright 2016-2023 "Ildar Bikmamatov" <support@bayrell.org>
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
if (typeof Bayrell == 'undefined') Bayrell = {};
if (typeof Bayrell.Lang == 'undefined') Bayrell.Lang = {};
if (typeof Bayrell.Lang.Compiler == 'undefined') Bayrell.Lang.Compiler = {};
Bayrell.Lang.Compiler.Module = function(ctx)
{
	use("Runtime.BaseStruct").apply(this, arguments);
};
Bayrell.Lang.Compiler.Module.prototype = Object.create(use("Runtime.BaseStruct").prototype);
Bayrell.Lang.Compiler.Module.prototype.constructor = Bayrell.Lang.Compiler.Module;
Object.assign(Bayrell.Lang.Compiler.Module.prototype,
{
	/**
	 * Returns module path
	 */
	getModulePath: function(ctx)
	{
		return this.path;
	},
	/**
	 * Returns source path
	 */
	getSourcePath: function(ctx)
	{
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(ctx, Runtime.rtl.attr(ctx, this.config, "src"));
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(ctx, __v2.m_to(ctx, "string", ""));
		var module_src = __v1.value(ctx);
		var __v3 = use("Runtime.fs");
		var module_src_path = __v3.join(ctx, use("Runtime.Vector").from([this.path,module_src]));
		return module_src_path;
	},
	/**
	 * Returns full source file.
	 * Returns file_path
	 */
	resolveSourceFile: function(ctx, file_name)
	{
		var first_char = Runtime.rtl.attr(ctx, file_name, 0);
		if (first_char == "@")
		{
			var __v0 = use("Runtime.fs");
			var __v1 = use("Runtime.rs");
			return __v0.join(ctx, use("Runtime.Vector").from([this.path,__v1.substr(ctx, file_name, 1)]));
		}
		var path = this.getSourcePath(ctx);
		var __v0 = use("Runtime.fs");
		return __v0.join(ctx, use("Runtime.Vector").from([path,file_name]));
	},
	/**
	 * Resolve destination file
	 */
	resolveDestFile: function(ctx, project_path, relative_file_name, lang)
	{
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(ctx, Runtime.rtl.attr(ctx, this.config, ["dest", lang]));
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(ctx, __v2.m_to(ctx, "string", ""));
		var dest = __v1.value(ctx);
		var dest_path = "";
		var __v3 = use("Runtime.rs");
		var is_local = __v3.substr(ctx, dest, 0, 2) == "./";
		if (is_local)
		{
			var __v4 = use("Runtime.fs");
			dest_path = __v4.join(ctx, use("Runtime.Vector").from([this.path,dest,relative_file_name]));
		}
		else
		{
			var __v5 = use("Runtime.fs");
			dest_path = __v5.join(ctx, use("Runtime.Vector").from([project_path,dest,relative_file_name]));
		}
		if (lang == "php")
		{
			var __v4 = use("Runtime.re");
			dest_path = __v4.replace(ctx, "\\.bay$", ".php", dest_path);
			var __v5 = use("Runtime.re");
			dest_path = __v5.replace(ctx, "\\.ui$", ".php", dest_path);
		}
		else if (lang == "es6")
		{
			var __v6 = use("Runtime.re");
			dest_path = __v6.replace(ctx, "\\.bay$", ".js", dest_path);
			var __v7 = use("Runtime.re");
			dest_path = __v7.replace(ctx, "\\.ui$", ".js", dest_path);
		}
		else if (lang == "nodejs")
		{
			var __v8 = use("Runtime.re");
			dest_path = __v8.replace(ctx, "\\.bay$", ".js", dest_path);
			var __v9 = use("Runtime.re");
			dest_path = __v9.replace(ctx, "\\.ui$", ".js", dest_path);
		}
		return dest_path;
	},
	/**
	 * Check exclude
	 */
	checkExclude: function(ctx, file_name)
	{
		var module_excludelist = Runtime.rtl.attr(ctx, this.config, "exclude");
		var __v0 = use("Runtime.Collection");
		if (module_excludelist && module_excludelist instanceof __v0)
		{
			for (var i = 0; i < module_excludelist.count(ctx); i++)
			{
				var __v1 = use("Runtime.Monad");
				var __v2 = new __v1(ctx, Runtime.rtl.attr(ctx, module_excludelist, i));
				var __v3 = use("Runtime.rtl");
				__v2 = __v2.monad(ctx, __v3.m_to(ctx, "string", ""));
				var file_match = __v2.value(ctx);
				if (file_match == "")
				{
					continue;
				}
				var __v4 = use("Runtime.re");
				var res = __v4.match(ctx, file_match, file_name);
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
	checkAllow: function(ctx, file_name)
	{
		var success = false;
		var module_allowlist = Runtime.rtl.attr(ctx, this.config, "allow");
		var __v0 = use("Runtime.Collection");
		if (module_allowlist && module_allowlist instanceof __v0)
		{
			for (var i = 0; i < module_allowlist.count(ctx); i++)
			{
				var __v1 = use("Runtime.Monad");
				var __v2 = new __v1(ctx, Runtime.rtl.attr(ctx, module_allowlist, i));
				var __v3 = use("Runtime.rtl");
				__v2 = __v2.monad(ctx, __v3.m_to(ctx, "string", ""));
				var file_match = __v2.value(ctx);
				if (file_match == "")
				{
					continue;
				}
				var __v4 = use("Runtime.re");
				var res = __v4.match(ctx, file_match, file_name);
				/* Ignore */
				var __v5 = use("Runtime.rs");
				if (__v5.charAt(ctx, file_match, 0) == "!")
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
	_init: function(ctx)
	{
		use("Runtime.BaseStruct").prototype._init.call(this,ctx);
		this.name = "";
		this.path = "";
		this.config = use("Runtime.Map").from({});
	},
});
Object.assign(Bayrell.Lang.Compiler.Module, use("Runtime.BaseStruct"));
Object.assign(Bayrell.Lang.Compiler.Module,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Bayrell.Lang.Compiler";
	},
	getClassName: function()
	{
		return "Bayrell.Lang.Compiler.Module";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseStruct";
	},
	getClassInfo: function(ctx)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function(ctx)
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function(ctx)
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		return null;
	},
});use.add(Bayrell.Lang.Compiler.Module);
module.exports = Bayrell.Lang.Compiler.Module;