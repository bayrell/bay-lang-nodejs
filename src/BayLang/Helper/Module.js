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
BayLang.Helper.Module = function(ctx, project, module_path)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.path = module_path;
	this.project = project;
};
BayLang.Helper.Module.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.Helper.Module.prototype.constructor = BayLang.Helper.Module;
Object.assign(BayLang.Helper.Module.prototype,
{
	/**
	 * Init module
	 */
	init: async function(ctx)
	{
		this.is_exists = false;
		var __v0 = use("Runtime.fs");
		if (!await __v0.isFolder(ctx, this.path))
		{
			return Promise.resolve(false);
		}
		/* Module json file */
		var module_json_path = this.path + use("Runtime.rtl").toStr("/") + use("Runtime.rtl").toStr("module.json");
		var __v0 = use("Runtime.fs");
		if (!await __v0.isFile(ctx, module_json_path))
		{
			return Promise.resolve(false);
		}
		/* Read file */
		var __v0 = use("Runtime.fs");
		var content = await __v0.readFile(ctx, module_json_path);
		var __v1 = use("Runtime.rtl");
		var module_info = __v1.json_decode(ctx, content);
		if (!module_info)
		{
			return Promise.resolve(false);
		}
		if (!module_info.has(ctx, "name"))
		{
			return Promise.resolve(false);
		}
		this.is_exists = true;
		this.name = module_info.get(ctx, "name");
		this.dest_path = module_info.get(ctx, "dest");
		this.src_path = module_info.get(ctx, "src");
		this.allow = module_info.get(ctx, "allow");
		this.assets = module_info.get(ctx, "assets");
		this.groups = module_info.get(ctx, "groups");
		this.required_modules = module_info.get(ctx, "require");
		this.submodules = module_info.get(ctx, "modules");
		this.exclude = module_info.get(ctx, "exclude");
		/* Load widgets */
		this.widgets = use("Runtime.Vector").from([]);
		if (module_info.has(ctx, "widgets"))
		{
			var widgets = module_info.get(ctx, "widgets");
			this.widgets = module_info.get(ctx, "widgets").map(ctx, (ctx, item) =>
			{
				var __v2 = use("BayLang.Helper.Widget");
				var widget = new __v2(ctx, this);
				widget.kind = item.get(ctx, "kind");
				widget.name = item.get(ctx, "name");
				return widget;
			});
		}
		return Promise.resolve(true);
	},
	/**
	 * Process project cache
	 */
	serialize: function(ctx, serializer, data)
	{
		serializer.process(ctx, this, "is_exists", data);
		serializer.process(ctx, this, "assets", data);
		serializer.process(ctx, this, "groups", data);
		serializer.process(ctx, this, "name", data);
		serializer.process(ctx, this, "path", data);
		serializer.process(ctx, this, "routes", data);
		serializer.process(ctx, this, "dest_path", data);
		serializer.process(ctx, this, "src_path", data);
		serializer.process(ctx, this, "required_modules", data);
		serializer.process(ctx, this, "submodules", data);
		serializer.processItems(ctx, this, "widgets", data, (ctx, widget) =>
		{
			var __v0 = use("BayLang.Helper.Widget");
			return new __v0(ctx, this);
		});
	},
	/**
	 * Returns true if module is exists
	 */
	exists: function(ctx)
	{
		return this.is_exists;
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
	 * Returns source folder path
	 */
	getSourceFolderPath: function(ctx)
	{
		var __v0 = use("Runtime.fs");
		return (this.src_path) ? (__v0.join(ctx, use("Runtime.Vector").from([this.getPath(ctx),this.src_path]))) : (null);
	},
	/**
	 * Returns dest folder path
	 */
	getDestFolderPath: function(ctx, lang)
	{
		if (!this.dest_path.has(ctx, lang))
		{
			return "";
		}
		var __v0 = use("Runtime.fs");
		return __v0.join(ctx, use("Runtime.Vector").from([this.getPath(ctx),this.dest_path.get(ctx, lang)]));
	},
	/**
	 * Returns relative source path
	 */
	getRelativeSourcePath: function(ctx, file_path)
	{
		var source_path = this.getSourceFolderPath(ctx);
		if (!source_path)
		{
			return null;
		}
		var __v0 = use("Runtime.rs");
		var source_path_sz = __v0.strlen(ctx, source_path);
		var __v1 = use("Runtime.rs");
		if (__v1.substr(ctx, file_path, 0, source_path_sz) != source_path)
		{
			return null;
		}
		var __v1 = use("Runtime.rs");
		var __v2 = use("Runtime.rs");
		return __v1.addFirstSlash(ctx, __v2.substr(ctx, file_path, source_path_sz));
	},
	/**
	 * Returns true if module contains file
	 */
	checkFile: function(ctx, file_full_path)
	{
		var __v0 = use("Runtime.rs");
		return __v0.indexOf(ctx, file_full_path, this.path) == 0;
	},
	/**
	 * Check allow list
	 */
	checkAllow: function(ctx, file_name)
	{
		if (!this.allow)
		{
			return false;
		}
		var success = false;
		for (var i = 0; i < this.allow.count(ctx); i++)
		{
			var file_match = this.allow.get(ctx, i);
			if (file_match == "")
			{
				continue;
			}
			var __v0 = use("Runtime.re");
			var res = __v0.match(ctx, file_match, file_name);
			/* Ignore */
			var __v1 = use("Runtime.rs");
			if (__v1.charAt(ctx, file_match, 0) == "!")
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
		return success;
	},
	/**
	 * Check exclude
	 */
	checkExclude: function(ctx, relative_src_file_path)
	{
		if (!this.exclude)
		{
			return false;
		}
		for (var i = 0; i < this.exclude.count(ctx); i++)
		{
			var file_match = this.exclude.get(ctx, i);
			if (file_match == "")
			{
				continue;
			}
			var __v0 = use("Runtime.re");
			file_match = __v0.replace(ctx, "\\/", "\\/", file_match);
			var __v1 = use("Runtime.re");
			var res = __v1.match(ctx, file_match, relative_src_file_path);
			if (res)
			{
				return true;
			}
		}
		return false;
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
			return "";
		}
		/* Remove module name from class name */
		var __v1 = use("Runtime.rs");
		class_name = __v1.substr(ctx, class_name, module_name_sz);
		/* Return path to class name */
		var path = this.getSourceFolderPath(ctx);
		var __v2 = use("Runtime.rs");
		var arr = __v2.split(ctx, ".", class_name);
		arr.prepend(ctx, path);
		var __v3 = use("Runtime.fs");
		return __v3.join(ctx, arr) + use("Runtime.rtl").toStr(".bay");
	},
	/**
	 * Resolve source path
	 */
	resolveSourceFilePath: function(ctx, relative_src_file_path)
	{
		var __v0 = use("Runtime.fs");
		return __v0.join(ctx, use("Runtime.Vector").from([this.getSourceFolderPath(ctx),relative_src_file_path]));
	},
	/**
	 * Resolve dest path
	 */
	resolveDestFilePath: function(ctx, relative_src_file_path, lang)
	{
		var dest_folder_path = this.getDestFolderPath(ctx, lang);
		if (dest_folder_path == "")
		{
			return "";
		}
		/* Get dest file path */
		var __v0 = use("Runtime.fs");
		var dest_file_path = __v0.join(ctx, use("Runtime.Vector").from([dest_folder_path,relative_src_file_path]));
		/* Resolve extension */
		if (lang == "php")
		{
			var __v1 = use("Runtime.re");
			dest_file_path = __v1.replace(ctx, "\\.bay$", ".php", dest_file_path);
			var __v2 = use("Runtime.re");
			dest_file_path = __v2.replace(ctx, "\\.ui$", ".php", dest_file_path);
		}
		else if (lang == "es6")
		{
			var __v3 = use("Runtime.re");
			dest_file_path = __v3.replace(ctx, "\\.bay$", ".js", dest_file_path);
			var __v4 = use("Runtime.re");
			dest_file_path = __v4.replace(ctx, "\\.ui$", ".js", dest_file_path);
		}
		else if (lang == "nodejs")
		{
			var __v5 = use("Runtime.re");
			dest_file_path = __v5.replace(ctx, "\\.bay$", ".js", dest_file_path);
			var __v6 = use("Runtime.re");
			dest_file_path = __v6.replace(ctx, "\\.ui$", ".js", dest_file_path);
		}
		return dest_file_path;
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
	 * Compile file
	 */
	compile: async function(ctx, relative_src_file_path)
	{
		/* Get src file path */
		var src_file_path = this.resolveSourceFilePath(ctx, relative_src_file_path);
		if (src_file_path == "")
		{
			return Promise.resolve(false);
		}
		if (!this.checkFile(ctx, src_file_path))
		{
			return Promise.resolve(false);
		}
		/* Read file */
		var __v0 = use("Runtime.fs");
		if (!await __v0.isFile(ctx, src_file_path))
		{
			return Promise.resolve(false);
		}
		var __v0 = use("Runtime.fs");
		var file_content = await __v0.readFile(ctx, src_file_path);
		/* Parse file */
		var __v1 = use("BayLang.LangBay.ParserBay");
		var parser = new __v1(ctx);
		var res = parser.constructor.parse(ctx, parser, file_content);
		var file_op_code = res.get(ctx, 1);
		if (!file_op_code)
		{
			return Promise.resolve(false);
		}
		/* Translate project languages */
		this.translateLanguages(ctx, relative_src_file_path, file_op_code);
		return Promise.resolve(true);
	},
	/**
	 * Translate file
	 */
	translateLanguages: async function(ctx, relative_src_file_path, op_code)
	{
		/* Translate project languages */
		var languages = this.project.getLanguages(ctx);
		for (var i = 0; i < languages.count(ctx); i++)
		{
			var lang = languages.get(ctx, i);
			if (lang == "bay")
			{
				continue;
			}
			await this.translate(ctx, relative_src_file_path, op_code, lang);
		}
	},
	/**
	 * Translate file
	 */
	translate: async function(ctx, relative_src_file_path, op_code, lang)
	{
		/* Get dest file path */
		var dest_file_path = this.resolveDestFilePath(ctx, relative_src_file_path, lang);
		if (dest_file_path == "")
		{
			return Promise.resolve(false);
		}
		/* Create translator */
		var __v0 = use("BayLang.LangUtils");
		var translator = __v0.createTranslator(ctx, lang);
		if (!translator)
		{
			return Promise.resolve(false);
		}
		/* Translate */
		var res = translator.constructor.translate(ctx, translator, op_code);
		var dest_file_content = res.get(ctx, 1);
		/* Create dest folder if not exists */
		var __v1 = use("Runtime.rs");
		var dest_dir_name = __v1.dirname(ctx, dest_file_path);
		var __v2 = use("Runtime.fs");
		if (!await __v2.isFolder(ctx, dest_dir_name))
		{
			var __v3 = use("Runtime.fs");
			await __v3.mkdir(ctx, dest_dir_name);
		}
		/* Save file */
		var __v2 = use("Runtime.fs");
		await __v2.saveFile(ctx, dest_file_path, dest_file_content);
		return Promise.resolve(true);
	},
	/**
	 * Returns projects assets
	 */
	getProjectAssets: function(ctx)
	{
		var project_assets = this.project.getAssets(ctx);
		project_assets = project_assets.filter(ctx, (ctx, asset) =>
		{
			if (!asset.has(ctx, "modules"))
			{
				return false;
			}
			/* Check module in modules names */
			var modules = asset.get(ctx, "modules");
			if (!modules)
			{
				return false;
			}
			var __v0 = use("Runtime.Collection");
			if (!(modules instanceof __v0))
			{
				return false;
			}
			if (!this.inModuleList(ctx, modules))
			{
				return false;
			}
			return true;
		});
		return project_assets;
	},
	/**
	 * Update assets
	 */
	updateAssets: async function(ctx)
	{
		var languages = this.project.getLanguages(ctx);
		if (languages.indexOf(ctx, "es6") == -1)
		{
			return Promise.resolve();
		}
		/* Builds assets with current module */
		var project_assets = this.getProjectAssets(ctx);
		for (var i = 0; i < project_assets.count(ctx); i++)
		{
			await this.project.buildAsset(ctx, project_assets.get(ctx, i));
		}
	},
	/**
	 * Load routes
	 */
	loadRoutes: async function(ctx)
	{
		var __v0 = use("BayLang.Helper.RouteProcessor");
		var route_processor = new __v0(ctx, this);
		await route_processor.load(ctx);
		this.routes = route_processor.getRoutes(ctx);
	},
	/**
	 * Add widget
	 */
	addWidget: async function(ctx, widget)
	{
		/* Add widget */
		this.widgets.push(ctx, widget);
		/* Get path */
		var __v0 = use("Runtime.rs");
		var model_path = __v0.removeFirstSlash(ctx, this.getRelativeSourcePath(ctx, widget.getModelPath(ctx)));
		var __v1 = use("Runtime.rs");
		var component_path = __v1.removeFirstSlash(ctx, this.getRelativeSourcePath(ctx, widget.getComponentPath(ctx)));
		/* Add assets to module.json */
		var module_json_path = this.path + use("Runtime.rtl").toStr("/") + use("Runtime.rtl").toStr("module.json");
		var __v2 = use("Runtime.fs");
		var content = await __v2.readFile(ctx, module_json_path);
		var __v3 = use("Runtime.rtl");
		var module_info = __v3.json_decode(ctx, content);
		if (module_info.get(ctx, "assets").indexOf(ctx, model_path) == -1)
		{
			module_info.get(ctx, "assets").push(ctx, model_path);
		}
		if (module_info.get(ctx, "assets").indexOf(ctx, component_path) == -1)
		{
			module_info.get(ctx, "assets").push(ctx, component_path);
		}
		/* Add widget to module.json */
		if (!module_info.has(ctx, "widgets"))
		{
			module_info.set(ctx, "widgets", use("Runtime.Vector").from([]));
		}
		module_info.get(ctx, "widgets").push(ctx, use("Runtime.Map").from({"kind":widget.kind,"name":widget.name}));
		/* Save module.json */
		var __v4 = use("Runtime.rtl");
		var __v5 = use("Runtime.Serializer");
		content = __v4.json_encode(ctx, module_info, __v5.JSON_PRETTY);
		var __v6 = use("Runtime.fs");
		await __v6.saveFile(ctx, module_json_path, content);
		/* Add assets to cache */
		if (this.assets.indexOf(ctx, model_path) == -1)
		{
			this.assets.push(ctx, model_path);
		}
		if (this.assets.indexOf(ctx, component_path) == -1)
		{
			this.assets.push(ctx, component_path);
		}
	},
	/**
	 * Remove widget
	 */
	removeWidget: async function(ctx, widget)
	{
		/* Remove item */
		this.widgets.removeItem(ctx, widget);
		/* Get path */
		var __v0 = use("Runtime.rs");
		var model_path = __v0.removeFirstSlash(ctx, this.getRelativeSourcePath(ctx, widget.getModelPath(ctx)));
		var __v1 = use("Runtime.rs");
		var component_path = __v1.removeFirstSlash(ctx, this.getRelativeSourcePath(ctx, widget.getComponentPath(ctx)));
		/* Remove assets from module.json */
		var module_json_path = this.path + use("Runtime.rtl").toStr("/") + use("Runtime.rtl").toStr("module.json");
		var __v2 = use("Runtime.fs");
		var content = await __v2.readFile(ctx, module_json_path);
		var __v3 = use("Runtime.rtl");
		var module_info = __v3.json_decode(ctx, content);
		var assets = module_info.get(ctx, "assets");
		for (var i = assets.count(ctx) - 1; i >= 0; i--)
		{
			var file_name = assets.get(ctx, i);
			if (file_name == model_path || file_name == component_path)
			{
				assets.remove(ctx, i);
			}
		}
		/* Remove widget from module.json */
		if (module_info.has(ctx, "widgets"))
		{
			var widgets = module_info.get(ctx, "widgets");
			var __v4 = use("Runtime.lib");
			var pos = widgets.find(ctx, __v4.equalAttr(ctx, "name", widget.name));
			if (pos >= 0)
			{
				widgets.remove(ctx, pos);
			}
		}
		/* Save module.json */
		var __v4 = use("Runtime.rtl");
		var __v5 = use("Runtime.Serializer");
		content = __v4.json_encode(ctx, module_info, __v5.JSON_PRETTY);
		var __v6 = use("Runtime.fs");
		await __v6.saveFile(ctx, module_json_path, content);
		/* Remove assets from cache */
		for (var i = this.assets.count(ctx) - 1; i >= 0; i--)
		{
			var file_name = this.assets.get(ctx, i);
			if (file_name == model_path || file_name == component_path)
			{
				this.assets.remove(ctx, i);
			}
		}
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.project = null;
		this.is_exists = false;
		this.path = "";
		this.src_path = "";
		this.dest_path = use("Runtime.Map").from({});
		this.name = "";
		this.submodules = null;
		this.allow = null;
		this.assets = null;
		this.required_modules = null;
		this.routes = null;
		this.groups = null;
		this.widgets = null;
		this.exclude = null;
	},
});
Object.assign(BayLang.Helper.Module, use("Runtime.BaseObject"));
Object.assign(BayLang.Helper.Module,
{
	/**
	 * Read project from folder
	 */
	readModule: async function(ctx, project, path)
	{
		var __v0 = use("BayLang.Helper.Module");
		var module = new __v0(ctx, project, path);
		await module.init(ctx);
		if (!module.exists(ctx))
		{
			return Promise.resolve(null);
		}
		return Promise.resolve(module);
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