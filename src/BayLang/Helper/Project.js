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
BayLang.Helper.Project = function(project_path)
{
	use("Runtime.BaseObject").call(this);
	this.path = project_path;
};
BayLang.Helper.Project.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.Helper.Project.prototype.constructor = BayLang.Helper.Project;
Object.assign(BayLang.Helper.Project.prototype,
{
	/**
	 * Init project
	 */
	init: async function()
	{
		this.info = null;
		var __v0 = use("Runtime.fs");
		var project_json_path = __v0.join(use("Runtime.Vector").from([this.path,"project.json"]));
		var __v1 = use("Runtime.fs");
		if (!await __v1.isFolder(this.path))
		{
			return Promise.resolve(false);
		}
		var __v2 = use("Runtime.fs");
		if (!await __v2.isFile(project_json_path))
		{
			return Promise.resolve(false);
		}
		/* Read file */
		var __v3 = use("Runtime.fs");
		var content = await __v3.readFile(project_json_path);
		var __v4 = use("Runtime.rtl");
		var project_info = __v4.json_decode(content);
		if (!project_info)
		{
			return Promise.resolve(false);
		}
		if (!project_info.has("name"))
		{
			return Promise.resolve(false);
		}
		this.info = project_info;
	},
	/**
	 * Returns project cache path
	 */
	getCachePath: function()
	{
		var __v0 = use("Runtime.fs");
		return (this.exists()) ? (__v0.join(use("Runtime.Vector").from([this.getPath(),".cache","cache.json"]))) : ("");
	},
	/**
	 * Read project from cache
	 */
	readCache: async function()
	{
		/* Get json path */
		var cache_path = this.getCachePath();
		var __v0 = use("Runtime.fs");
		if (!await __v0.isFile(cache_path))
		{
			return Promise.resolve(false);
		}
		/* Read file */
		var __v1 = use("Runtime.fs");
		var content = await __v1.readFile(cache_path);
		var __v2 = use("Runtime.rtl");
		var data = __v2.json_decode(content);
		if (!data)
		{
			return Promise.resolve(false);
		}
		/* Import data */
		var __v3 = use("Runtime.Serializer");
		var serializer = new __v3();
		var __v4 = use("Runtime.Serializer");
		serializer.setFlag(__v4.ALLOW_OBJECTS);
		var __v5 = use("Runtime.Serializer");
		serializer.setFlag(__v5.DECODE);
		this.serialize(serializer, data);
		return Promise.resolve(true);
	},
	/**
	 * Save project to cache
	 */
	saveCache: async function()
	{
		/* Get json folder */
		var cache_path = this.getCachePath();
		var __v0 = use("Runtime.rs");
		var folder_path = __v0.dirname(cache_path);
		var __v1 = use("Runtime.fs");
		if (!await __v1.isFolder(folder_path))
		{
			var __v2 = use("Runtime.fs");
			await __v2.mkdir(folder_path);
		}
		/* Create serializer */
		var __v3 = use("Runtime.SerializerJson");
		var serializer = new __v3();
		var __v4 = use("Runtime.Serializer");
		serializer.setFlag(__v4.JSON_PRETTY);
		/* Save cache to file */
		var content = serializer.encode(this);
		var __v5 = use("Runtime.fs");
		await __v5.saveFile(cache_path, content);
	},
	/**
	 * Process project cache
	 */
	serialize: function(serializer, data)
	{
		serializer.processItems(this, "modules", data, (serializer, module) =>
		{
			var __v0 = use("BayLang.Helper.Module");
			return new __v0(this, module.get("path"));
		});
	},
	/**
	 * Load object
	 */
	load: async function(is_force)
	{
		if (is_force == undefined) is_force = false;
		if (!this.exists())
		{
			return Promise.resolve();
		}
		var is_loaded = false;
		if (!is_force)
		{
			is_loaded = await this.readCache();
		}
		if (!is_loaded)
		{
			/* Read and load modules */
			await this.readModules();
			await this.loadModules();
			/* Save to cache */
			await this.saveCache();
		}
	},
	/**
	 * Returns true if project is exists
	 */
	exists: function()
	{
		return this.info != null;
	},
	/**
	 * Returns project path
	 */
	getPath: function()
	{
		return (this.exists()) ? (this.path) : ("");
	},
	/**
	 * Returns project file_name
	 */
	getID: function()
	{
		var __v0 = use("Runtime.rs");
		return (this.exists()) ? (__v0.basename(this.path)) : ("");
	},
	/**
	 * Returns project name
	 */
	getName: function()
	{
		return (this.exists()) ? (this.info.get("name")) : ("");
	},
	/**
	 * Set project name
	 */
	setName: function(name)
	{
		if (!this.exists())
		{
			return ;
		}
		this.info.set("name", name);
	},
	/**
	 * Returns project description
	 */
	getDescription: function()
	{
		return (this.exists()) ? (this.info.get("description")) : ("");
	},
	/**
	 * Set project description
	 */
	setDescription: function(description)
	{
		if (!this.exists())
		{
			return ;
		}
		this.info.set("description", description);
	},
	/**
	 * Returns project type
	 */
	getType: function()
	{
		return (this.exists()) ? (this.info.get("type")) : ("");
	},
	/**
	 * Set project type
	 */
	setType: function(project_type)
	{
		if (!this.exists())
		{
			return ;
		}
		this.info.set("type", project_type);
	},
	/**
	 * Returns assets
	 */
	getAssets: function()
	{
		return (this.exists()) ? (this.info.get("assets")) : (use("Runtime.Vector").from([]));
	},
	/**
	 * Returns languages
	 */
	getLanguages: function()
	{
		return (this.exists()) ? (this.info.get("languages")) : (use("Runtime.Vector").from([]));
	},
	/**
	 * Returns module
	 */
	getModule: function(module_name)
	{
		return this.modules.get(module_name);
	},
	/**
	 * Returns modules by group name
	 */
	getModulesByGroupName: function(group_name)
	{
		/* Get modules */
		var modules = this.modules.transition((module, module_name) =>
		{
			return module;
		});
		/* Filter modules by group */
		modules = modules.filter((module) =>
		{
			return module.hasGroup(group_name);
		});
		/* Get names */
		var __v0 = use("Runtime.lib");
		modules = modules.map(__v0.attr("name"));
		/* Return modules */
		return modules;
	},
	/**
	 * Returns widget
	 */
	getWidget: async function(widget_name)
	{
		if (!this.modules)
		{
			return Promise.resolve(null);
		}
		/* Find widget by name */
		var modules = this.modules.keys().sort();
		for (var i = 0; i < modules.count(); i++)
		{
			var module_name = modules.get(i);
			var module = this.modules.get(module_name);
			var widget = module.getWidget(widget_name);
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
	saveInfo: async function()
	{
		var __v0 = use("Runtime.fs");
		var project_json_path = __v0.join(use("Runtime.Vector").from([this.path,"project.json"]));
		var __v1 = use("Runtime.rtl");
		var __v2 = use("Runtime.rtl");
		var content = __v1.json_encode(this.info, __v2.JSON_PRETTY);
		var __v3 = use("Runtime.fs");
		await __v3.saveFile(project_json_path, content);
	},
	/**
	 * Find module by file name
	 */
	findModuleByFileName: function(file_name)
	{
		var res = null;
		var module_path_sz = -1;
		var module_names = this.modules.keys();
		for (var i = 0; i < module_names.count(); i++)
		{
			var module_name = module_names.get(i);
			var module = this.modules.get(module_name);
			if (module.checkFile(file_name))
			{
				var __v0 = use("Runtime.rs");
				var sz = __v0.strlen(module.path);
				if (module_path_sz < sz)
				{
					module_path_sz = sz;
					res = module;
				}
			}
		}
		return res;
	},
	/**
	 * Load modules
	 */
	loadModules: async function()
	{
		var modules = this.modules.keys().sort();
		for (var i = 0; i < modules.count(); i++)
		{
			var module_name = modules.get(i);
			var module = this.modules.get(module_name);
			await module.loadRoutes();
		}
	},
	/**
	 * Read modules
	 */
	readModules: async function()
	{
		if (!this.exists())
		{
			return Promise.resolve();
		}
		this.modules = use("Runtime.Map").from({});
		/* Read sub modules */
		await this.readSubModules(this.path, this.info.get("modules"));
	},
	/**
	 * Read sub modules
	 */
	readSubModules: async function(path, items)
	{
		if (!items)
		{
			return Promise.resolve();
		}
		for (var i = 0; i < items.count(); i++)
		{
			var item = items.get(i);
			var module_src = item.get("src");
			var module_type = item.get("type");
			var __v0 = use("Runtime.fs");
			var folder_path = __v0.join(use("Runtime.Vector").from([path,module_src]));
			/* Read from folder */
			if (module_type == "folder")
			{
				await this.readModuleFromFolder(folder_path);
			}
			else
			{
				var __v1 = use("BayLang.Helper.Module");
				var module = __v1.readModule(this, folder_path);
				if (module)
				{
					/* Set module */
					this.modules.set(module.getName(), module);
					/* Read sub modules */
					await this.readSubModules(module.getPath(), module.submodules);
				}
			}
		}
	},
	/**
	 * Read sub modules
	 */
	readModuleFromFolder: async function(folder_path)
	{
		var __v0 = use("Runtime.fs");
		if (!await __v0.isFolder(folder_path))
		{
			return Promise.resolve();
		}
		var __v1 = use("Runtime.fs");
		var items = await __v1.listDir(folder_path);
		for (var i = 0; i < items.count(); i++)
		{
			var file_name = items.get(i);
			if (file_name == ".")
			{
				continue;
			}
			if (file_name == "..")
			{
				continue;
			}
			/* Read module */
			var __v2 = use("BayLang.Helper.Module");
			var __v3 = use("Runtime.fs");
			var module = __v2.readModule(this, __v3.join(use("Runtime.Vector").from([folder_path,file_name])));
			if (module)
			{
				/* Set module */
				this.modules.set(module.getName(), module);
				/* Read sub modules */
				this.readSubModules(module.getPath(), module.submodules);
			}
		}
	},
	/**
	 * Sort modules
	 */
	sortRequiredModules: function(modules)
	{
		var result = use("Runtime.Vector").from([]);
		var add_module;
		add_module = (module_name) =>
		{
			if (modules.indexOf(module_name) == -1)
			{
				return ;
			}
			/* Get module by name */
			var module = this.modules.get(module_name);
			if (!module)
			{
				return ;
			}
			/* Add required modules */
			if (module.required_modules != null)
			{
				for (var i = 0; i < module.required_modules.count(); i++)
				{
					add_module(module.required_modules.get(i));
				}
			}
			/* Add module if not exists */
			if (result.indexOf(module_name) == -1)
			{
				result.push(module_name);
			}
		};
		for (var i = 0; i < modules.count(); i++)
		{
			add_module(modules.get(i));
		}
		return result;
	},
	/**
	 * Returns assets modules
	 */
	getAssetModules: function(asset)
	{
		var modules = asset.get("modules");
		/* Extends modules */
		var new_modules = use("Runtime.Vector").from([]);
		modules.each((module_name) =>
		{
			var __v0 = use("Runtime.rs");
			if (__v0.substr(module_name, 0, 1) == "@")
			{
				/* Get group modules by name */
				var group_modules = this.getModulesByGroupName(module_name);
				/* Append group modules */
				new_modules.appendItems(group_modules);
			}
			else
			{
				new_modules.push(module_name);
			}
		});
		modules = new_modules.removeDuplicates();
		/* Sort modules by requires */
		modules = this.sortRequiredModules(modules);
		return modules;
	},
	/**
	 * Build asset
	 */
	buildAsset: async function(asset)
	{
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(Runtime.rtl.attr(asset, "dest"));
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(__v2.m_to("string", ""));
		var asset_path_relative = __v1.value();
		if (asset_path_relative == "")
		{
			return Promise.resolve();
		}
		/* Get asset dest path */
		var __v3 = use("Runtime.fs");
		var asset_path = __v3.join(use("Runtime.Vector").from([this.path,asset_path_relative]));
		var asset_content = "";
		/* Get modules names in asset */
		var modules = this.getAssetModules(asset);
		for (var i = 0; i < modules.count(); i++)
		{
			var module_name = modules.get(i);
			var module = this.modules.get(module_name);
			if (!module)
			{
				continue;
			}
			/* Get files */
			for (var j = 0; j < module.assets.count(); j++)
			{
				var file_name = module.assets.get(j);
				var file_source_path = module.resolveSourceFilePath(file_name);
				var file_dest_path = module.resolveDestFilePath(file_name, "es6");
				if (file_dest_path)
				{
					var __v4 = use("Runtime.fs");
					var __v6 = use("Runtime.fs");
					var __v7 = use("Runtime.rs");
					if (await __v4.isFile(file_dest_path))
					{
						var __v5 = use("Runtime.fs");
						var content = await __v5.readFile(file_dest_path);
						asset_content += use("Runtime.rtl").toStr(content + use("Runtime.rtl").toStr("\n"));
					}
					else if (await __v6.isFile(file_source_path) && __v7.extname(file_source_path) == "js")
					{
						var __v8 = use("Runtime.fs");
						var content = await __v8.readFile(file_source_path);
						asset_content += use("Runtime.rtl").toStr(content + use("Runtime.rtl").toStr("\n"));
					}
				}
			}
		}
		/* Create directory if does not exists */
		var __v9 = use("Runtime.rs");
		var dir_name = __v9.dirname(asset_path);
		var __v10 = use("Runtime.fs");
		if (!await __v10.isDir(dir_name))
		{
			var __v11 = use("Runtime.fs");
			await __v11.mkdir(dir_name);
		}
		/* Save file */
		var __v12 = use("Runtime.fs");
		await __v12.saveFile(asset_path, asset_content);
	},
	_init: function()
	{
		use("Runtime.BaseObject").prototype._init.call(this);
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
	readProjects: async function(projects_path)
	{
		var __v0 = use("Runtime.fs");
		if (!await __v0.isFolder(projects_path))
		{
			return Promise.resolve(use("Runtime.Vector").from([]));
		}
		var result = use("Runtime.Vector").from([]);
		var __v1 = use("Runtime.fs");
		var items = await __v1.listDir(projects_path);
		for (var i = 0; i < items.count(); i++)
		{
			var file_name = items.get(i);
			if (file_name == ".")
			{
				continue;
			}
			if (file_name == "..")
			{
				continue;
			}
			var __v2 = use("Runtime.fs");
			var project = await this.readProject(__v2.join(use("Runtime.Vector").from([projects_path,file_name])));
			if (project)
			{
				result.push(project);
			}
		}
		return Promise.resolve(result);
	},
	/**
	 * Read project from folder
	 */
	readProject: async function(project_path)
	{
		var __v0 = use("BayLang.Helper.Project");
		var project = new __v0(project_path);
		await project.init();
		if (!project.exists())
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
	__implements__:
	[
		use("BayLang.Helper.CacheInterface"),
		use("Runtime.SerializeInterface"),
	],
});use.add(BayLang.Helper.Project);
module.exports = BayLang.Helper.Project;