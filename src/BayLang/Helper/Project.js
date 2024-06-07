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
BayLang.Helper.Project = function(ctx)
{
	use("Runtime.BaseObject").apply(this, arguments);
};
BayLang.Helper.Project.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.Helper.Project.prototype.constructor = BayLang.Helper.Project;
Object.assign(BayLang.Helper.Project.prototype,
{
	/**
	 * Init from file
	 */
	initFromFile: async function(ctx, project_path)
	{
		var __v0 = use("Runtime.rs");
		var file_name = __v0.basename(ctx, project_path);
		if (file_name == "")
		{
			return Promise.resolve();
		}
		if (Runtime.rtl.attr(ctx, file_name, 0) == ".")
		{
			return Promise.resolve();
		}
		var __v1 = use("Runtime.fs");
		var project_json_path = __v1.join(ctx, use("Runtime.Vector").from([project_path,"project.json"]));
		var __v2 = use("Runtime.fs");
		if (!await __v2.isFolder(ctx, project_path))
		{
			return Promise.resolve();
		}
		var __v2 = use("Runtime.fs");
		if (!await __v2.isFile(ctx, project_json_path))
		{
			return Promise.resolve();
		}
		/* Read file */
		var __v2 = use("Runtime.fs");
		var content = await __v2.readFile(ctx, project_json_path);
		var __v3 = use("Runtime.rtl");
		var project_info = __v3.json_decode(ctx, content);
		/* Init project */
		this.init(ctx, project_path, project_info);
		/* Load data from cache */
		await this.readCache(ctx);
	},
	/**
	 * Init project
	 */
	init: function(ctx, project_path, project_info)
	{
		if (!project_info)
		{
			return ;
		}
		if (!project_info.has(ctx, "name"))
		{
			return ;
		}
		this.path = project_path;
		this.info = project_info;
	},
	/**
	 * Returns project cache path
	 */
	getCachePath: function(ctx)
	{
		var __v0 = use("Runtime.fs");
		return (this.exists(ctx)) ? (__v0.join(ctx, use("Runtime.Vector").from([this.getPath(ctx),".cache","cache.json"]))) : ("");
	},
	/**
	 * Read project from cache
	 */
	readCache: async function(ctx)
	{
		/* Get json path */
		var cache_path = this.getCachePath(ctx);
		var __v0 = use("Runtime.fs");
		if (!await __v0.isFile(ctx, cache_path))
		{
			return Promise.resolve(false);
		}
		/* Read file */
		var __v0 = use("Runtime.fs");
		var content = await __v0.readFile(ctx, cache_path);
		var __v1 = use("Runtime.rtl");
		var data = __v1.json_decode(ctx, content);
		if (!data)
		{
			return Promise.resolve(false);
		}
		/* Import data */
		var __v2 = use("Runtime.Serializer");
		var serializer = new __v2(ctx);
		var __v3 = use("Runtime.Serializer");
		serializer.setFlag(ctx, __v3.ALLOW_OBJECTS);
		var __v4 = use("Runtime.Serializer");
		serializer.setFlag(ctx, __v4.DECODE);
		this.serialize(ctx, serializer, data);
		return Promise.resolve(true);
	},
	/**
	 * Save project to cache
	 */
	saveCache: async function(ctx)
	{
		/* Get json folder */
		var cache_path = this.getCachePath(ctx);
		var __v0 = use("Runtime.rs");
		var folder_path = __v0.dirname(ctx, cache_path);
		var __v1 = use("Runtime.fs");
		if (!await __v1.isFolder(ctx, folder_path))
		{
			var __v2 = use("Runtime.fs");
			await __v2.mkdir(ctx, folder_path);
		}
		/* Create serializer */
		var __v1 = use("Runtime.SerializerJson");
		var serializer = new __v1(ctx);
		var __v2 = use("Runtime.Serializer");
		serializer.setFlag(ctx, __v2.JSON_PRETTY);
		/* Save cache to file */
		var content = serializer.encode(ctx, this);
		var __v3 = use("Runtime.fs");
		await __v3.saveFile(ctx, cache_path, content);
	},
	/**
	 * Process project cache
	 */
	serialize: function(ctx, serializer, data)
	{
		serializer.processItems(ctx, this, "modules", data, (ctx, module) =>
		{
			var __v0 = use("BayLang.Helper.Module");
			return new __v0(ctx, this);
		});
	},
	/**
	 * Load object
	 */
	load: async function(ctx)
	{
		var is_loaded = await this.readCache(ctx);
		if (!is_loaded)
		{
			await this.loadObject(ctx);
			/* Save to cache */
			await this.saveCache(ctx);
		}
	},
	/**
	 * Load project from file system
	 */
	loadObject: async function(ctx)
	{
		var modules = this.modules.keys(ctx).sort(ctx);
		for (var i = 0; i < modules.count(ctx); i++)
		{
			var module_name = modules.get(ctx, i);
			var module = this.modules.get(ctx, module_name);
			await module.loadRoutes(ctx);
			await module.loadWidgets(ctx);
		}
	},
	/**
	 * Returns true if project is exists
	 */
	exists: function(ctx)
	{
		return this.info != "";
	},
	/**
	 * Returns project path
	 */
	getPath: function(ctx)
	{
		return (this.exists(ctx)) ? (this.path) : ("");
	},
	/**
	 * Returns project file_name
	 */
	getID: function(ctx)
	{
		var __v0 = use("Runtime.rs");
		return (this.exists(ctx)) ? (__v0.basename(ctx, this.path)) : ("");
	},
	/**
	 * Returns project name
	 */
	getName: function(ctx)
	{
		return (this.exists(ctx)) ? (this.info.get(ctx, "name")) : ("");
	},
	/**
	 * Set project name
	 */
	setName: function(ctx, name)
	{
		if (!this.exists(ctx))
		{
			return ;
		}
		this.info.set(ctx, "name", name);
	},
	/**
	 * Returns project description
	 */
	getDescription: function(ctx)
	{
		return (this.exists(ctx)) ? (this.info.get(ctx, "description")) : ("");
	},
	/**
	 * Set project description
	 */
	setDescription: function(ctx, description)
	{
		if (!this.exists(ctx))
		{
			return ;
		}
		this.info.set(ctx, "description", description);
	},
	/**
	 * Returns project type
	 */
	getType: function(ctx)
	{
		return (this.exists(ctx)) ? (this.info.get(ctx, "type")) : ("");
	},
	/**
	 * Set project type
	 */
	setType: function(ctx, project_type)
	{
		if (!this.exists(ctx))
		{
			return ;
		}
		this.info.set(ctx, "type", project_type);
	},
	/**
	 * Returns module
	 */
	getModule: function(ctx, module_name)
	{
		return this.modules.get(ctx, module_name);
	},
	/**
	 * Returns widget
	 */
	getWidget: async function(ctx, widget_name)
	{
		if (!this.modules)
		{
			return Promise.resolve(null);
		}
		/* Find widget by name */
		var modules = this.modules.keys(ctx).sort(ctx);
		for (var i = 0; i < modules.count(ctx); i++)
		{
			var module_name = modules.get(ctx, i);
			var module = this.modules.get(ctx, module_name);
			var widget = module.getWidget(ctx, widget_name);
			if (widget)
			{
				return Promise.resolve(widget);
			}
		}
		return Promise.resolve(null);
	},
	/**
	 * Save project
	 */
	saveInfo: async function(ctx)
	{
		var __v0 = use("Runtime.fs");
		var project_json_path = __v0.join(ctx, use("Runtime.Vector").from([this.path,"project.json"]));
		var __v1 = use("Runtime.rtl");
		var __v2 = use("Runtime.rtl");
		var content = __v1.json_encode(ctx, this.info, __v2.JSON_PRETTY);
		var __v3 = use("Runtime.fs");
		await __v3.saveFile(ctx, project_json_path, content);
	},
	/**
	 * Read modules
	 */
	readModules: async function(ctx)
	{
		if (!this.exists(ctx))
		{
			return Promise.resolve();
		}
		this.modules = use("Runtime.Map").from({});
		/* Read sub modules */
		await this.readSubModules(ctx, this.path, this.info.get(ctx, "modules"));
	},
	/**
	 * Read sub modules
	 */
	readSubModules: async function(ctx, path, items)
	{
		if (!items)
		{
			return Promise.resolve();
		}
		for (var i = 0; i < items.count(ctx); i++)
		{
			var item = items.get(ctx, i);
			var module_src = item.get(ctx, "src");
			var module_type = item.get(ctx, "type");
			var __v0 = use("Runtime.fs");
			var folder_path = __v0.join(ctx, use("Runtime.Vector").from([path,module_src]));
			/* Read from folder */
			if (module_type == "folder")
			{
				await this.readModuleFromFolder(ctx, folder_path);
			}
			else if (module_type == "folder")
			{
				var __v1 = use("BayLang.Helper.Module");
				var module = __v1.readModule(ctx, this, folder_path);
				if (module)
				{
					/* Set module */
					this.modules.set(ctx, module.getName(ctx), module);
					/* Read sub modules */
					await this.readSubModules(ctx, module.getPath(ctx), module.getInfo(ctx).get(ctx, "modules"));
				}
			}
		}
	},
	/**
	 * Read sub modules
	 */
	readModuleFromFolder: async function(ctx, folder_path)
	{
		var __v0 = use("Runtime.fs");
		if (!await __v0.isFolder(ctx, folder_path))
		{
			return Promise.resolve();
		}
		var __v0 = use("Runtime.fs");
		var items = await __v0.listDir(ctx, folder_path);
		for (var i = 0; i < items.count(ctx); i++)
		{
			var file_name = items.get(ctx, i);
			/* Read module */
			var __v1 = use("BayLang.Helper.Module");
			var __v2 = use("Runtime.fs");
			var module = __v1.readModule(ctx, this, __v2.join(ctx, use("Runtime.Vector").from([folder_path,file_name])));
			if (module)
			{
				/* Set module */
				this.modules.set(ctx, module.getName(ctx), module);
				/* Read sub modules */
				this.readSubModules(ctx, module.getPath(ctx), module.submodules);
			}
		}
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.path = "";
		this.info = null;
		this.modules = null;
	},
});
Object.assign(BayLang.Helper.Project, use("Runtime.BaseObject"));
Object.assign(BayLang.Helper.Project,
{
	/**
	 * Read projects
	 */
	readProjects: async function(ctx, projects_path)
	{
		var __v0 = use("Runtime.fs");
		if (!await __v0.isFolder(ctx, projects_path))
		{
			return Promise.resolve(use("Runtime.Vector").from([]));
		}
		var result = use("Runtime.Vector").from([]);
		var __v0 = use("Runtime.fs");
		var items = await __v0.listDir(ctx, projects_path);
		for (var i = 0; i < items.count(ctx); i++)
		{
			var file_name = items.get(ctx, i);
			var __v1 = use("Runtime.fs");
			var project = await this.readProject(ctx, __v1.join(ctx, use("Runtime.Vector").from([projects_path,file_name])));
			if (project)
			{
				result.push(ctx, project);
			}
		}
		return Promise.resolve(result);
	},
	/**
	 * Read project from folder
	 */
	readProject: async function(ctx, project_path)
	{
		var __v0 = use("BayLang.Helper.Project");
		var project = new __v0(ctx);
		await project.initFromFile(ctx, project_path);
		if (!project.exists(ctx))
		{
			return Promise.resolve(null);
		}
		return Promise.resolve(project);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Helper";
	},
	getClassName: function()
	{
		return "BayLang.Helper.Project";
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
		use("BayLang.Helper.CacheInterface"),
		use("Runtime.SerializeInterface"),
	],
});use.add(BayLang.Helper.Project);
module.exports = BayLang.Helper.Project;