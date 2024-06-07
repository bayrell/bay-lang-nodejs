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
if (typeof BayLang.Helper == 'undefined') BayLang.Helper = {};
BayLang.Helper.Module = function(ctx, project)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.project = project;
};
BayLang.Helper.Module.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.Helper.Module.prototype.constructor = BayLang.Helper.Module;
Object.assign(BayLang.Helper.Module.prototype,
{
	/**
	 * Init module from file
	 */
	initFromFile: function(ctx, module_path)
	{
		this.info = null;
		var __v0 = use("Runtime.rs");
		var file_name = __v0.basename(ctx, module_path);
		if (file_name == "")
		{
			return ;
		}
		if (Runtime.rtl.attr(ctx, file_name, 0) == ".")
		{
			return ;
		}
		var module_json_path = module_path + use("Runtime.rtl").toStr("/") + use("Runtime.rtl").toStr("module.json");
		var __v1 = use("Runtime.fs");
		if (!__v1.isFile(ctx, module_json_path))
		{
			return ;
		}
		/* Read file */
		var __v1 = use("Runtime.fs");
		var content = __v1.readFile(ctx, module_json_path);
		var __v2 = use("Runtime.rtl");
		var module_info = __v2.json_decode(ctx, content);
		/* Init module */
		this.init(ctx, module_path, module_info);
	},
	/**
	 * Init module
	 */
	init: function(ctx, module_path, module_info)
	{
		this.info = null;
		if (!module_info)
		{
			return ;
		}
		if (!module_info.has(ctx, "name"))
		{
			return ;
		}
		this.path = module_path;
		this.name = module_info.get(ctx, "name");
		this.src_path = module_info.get(ctx, "src");
		this.groups = module_info.get(ctx, "groups");
		this.submodules = module_info.get(ctx, "modules");
	},
	/**
	 * Process project cache
	 */
	serialize: function(ctx, serializer, data)
	{
		serializer.process(ctx, this, "groups", data);
		serializer.process(ctx, this, "name", data);
		serializer.process(ctx, this, "path", data);
		serializer.process(ctx, this, "routes", data);
		serializer.process(ctx, this, "src_path", data);
		serializer.process(ctx, this, "submodules", data);
		serializer.processItems(ctx, this, "widgets", data, (ctx, widget) =>
		{
			var __v0 = use("BayLang.Helper.Widget");
			return new __v0(ctx, this);
		});
	},
	/**
	 * Returns true if project is exists
	 */
	exists: function(ctx)
	{
		return this.path != null;
	},
	/**
	 * Returns module path
	 */
	getPath: function(ctx)
	{
		return this.path;
	},
	/**
	 * Returns module name
	 */
	getName: function(ctx)
	{
		return this.name;
	},
	/**
	 * Returns routes
	 */
	getRoutes: function(ctx)
	{
		return (this.routes) ? (this.routes) : (use("Runtime.Vector").from([]));
	},
	/**
	 * Returns route by name
	 */
	getRoute: function(ctx, route_name)
	{
		var __v0 = use("Runtime.lib");
		return this.getRoutes(ctx).findItem(ctx, __v0.equalAttr(ctx, "name", route_name));
	},
	/**
	 * Returns widgets
	 */
	getWidgets: function(ctx)
	{
		return (this.widgets) ? (this.widgets) : (use("Runtime.Vector").from([]));
	},
	/**
	 * Returns widget by name
	 */
	getWidget: function(ctx, widget_name)
	{
		var __v0 = use("Runtime.lib");
		return this.getWidgets(ctx).findItem(ctx, __v0.equalAttr(ctx, "name", widget_name));
	},
	/**
	 * Returns source path
	 */
	getSourcePath: function(ctx)
	{
		var __v0 = use("Runtime.fs");
		return __v0.join(ctx, use("Runtime.Vector").from([this.getPath(ctx),this.src_path]));
	},
	/**
	 * Returns class name file path
	 */
	resolveClassName: function(ctx, class_name)
	{
		/* Check if class name start with module name */
		var __v0 = use("Runtime.rs");
		var module_name_sz = __v0.strlen(ctx, this.getName(ctx));
		var __v1 = use("Runtime.rs");
		if (__v1.substr(ctx, class_name, 0, module_name_sz) != this.getName(ctx))
		{
			return ;
		}
		/* Remove module name from class name */
		var __v1 = use("Runtime.rs");
		class_name = __v1.substr(ctx, class_name, module_name_sz);
		/* Return path to class name */
		var path = this.getSourcePath(ctx);
		var __v2 = use("Runtime.rs");
		var arr = __v2.split(ctx, ".", class_name);
		arr.prepend(ctx, path);
		var __v3 = use("Runtime.fs");
		return __v3.join(ctx, arr) + use("Runtime.rtl").toStr(".bay");
	},
	/**
	 * Returns true if module has group
	 */
	hasGroup: function(ctx, group_name)
	{
		var __v0 = use("Runtime.rs");
		if (__v0.substr(ctx, group_name, 0, 1) != "@")
		{
			return false;
		}
		var __v0 = use("Runtime.rs");
		group_name = __v0.substr(ctx, group_name, 1);
		if (this.groups == null)
		{
			return false;
		}
		if (this.groups.indexOf(ctx, group_name) == -1)
		{
			return false;
		}
		return true;
	},
	/**
	 * Returns true if this module contains in module list include groups
	 */
	inModuleList: function(ctx, module_names)
	{
		for (var i = 0; i < module_names.count(ctx); i++)
		{
			var module_name = module_names.get(ctx, i);
			if (this.name == module_name)
			{
				return true;
			}
			if (this.hasGroup(ctx, module_name))
			{
				return true;
			}
		}
		return false;
	},
	/**
	 * Rename module
	 */
	rename: function(ctx, new_module_name)
	{
		return ;
		if (!this.exists(ctx))
		{
			return ;
		}
		var __v0 = use("Runtime.rs");
		var new_file_name = __v0.lower(ctx, new_module_name);
		var old_file_name = this.file_name;
		/* Set new module name */
		this.info.set(ctx, "name", new_module_name);
		/* Save file */
		var module_path = "/data/projects/" + use("Runtime.rtl").toStr(old_file_name);
		var module_json_path = module_path + use("Runtime.rtl").toStr("/") + use("Runtime.rtl").toStr("module.json");
		var __v1 = use("Runtime.rtl");
		var __v2 = use("Runtime.rtl");
		var content = __v1.json_encode(ctx, this.info, __v2.JSON_PRETTY);
		var __v3 = use("Runtime.fs");
		__v3.saveFile(ctx, module_json_path, content);
		/* Rename folder */
	},
	/**
	 * Load routes
	 */
	loadRoutes: async function(ctx)
	{
		var __v0 = use("BayLang.Helper.RouteProcessor");
		var route_processor = new __v0(ctx, this);
		await route_processor.load(ctx);
	},
	/**
	 * Load widgets
	 */
	loadWidgets: async function(ctx)
	{
		var __v0 = use("BayLang.Helper.WidgetProcessor");
		var widget_processor = new __v0(ctx, this);
		await widget_processor.load(ctx);
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.project = null;
		this.path = "";
		this.src_path = "";
		this.name = "";
		this.submodules = null;
		this.routes = null;
		this.groups = null;
		this.widgets = null;
	},
});
Object.assign(BayLang.Helper.Module, use("Runtime.BaseObject"));
Object.assign(BayLang.Helper.Module,
{
	/**
	 * Read project from folder
	 */
	readModule: function(ctx, project, path)
	{
		var __v0 = use("BayLang.Helper.Module");
		var module = new __v0(ctx, project);
		module.initFromFile(ctx, path);
		if (!module.exists(ctx))
		{
			return null;
		}
		return module;
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Helper";
	},
	getClassName: function()
	{
		return "BayLang.Helper.Module";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
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
	__implements__:
	[
		use("Runtime.SerializeInterface"),
	],
});use.add(BayLang.Helper.Module);
module.exports = BayLang.Helper.Module;