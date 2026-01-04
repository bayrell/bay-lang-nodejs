"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const rs = use("Runtime.rs");
/*!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2025 "Ildar Bikmamatov" <support@bayrell.org>
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
BayLang.Compiler.Project = class extends use("Runtime.BaseObject")
{
	/**
	 * Process project cache
	 */
	static serialize(rules)
	{
		super.serialize(rules);
	}
	
	
	/**
	 * Constructor
	 */
	constructor()
	{
		super();
	}
	
	
	/**
	 * Read project
	 */
	static async readProject(project_path)
	{
		let project = new BayLang.Compiler.Project();
		await project.read(project_path);
		if (!project.exists()) return null;
		await project.readModules();
		return project;
	}
	
	
	/**
	 * Read project
	 */
	async read(project_path)
	{
		const fs = use("Runtime.fs");
		const Vector = use("Runtime.Vector");
		this.info = null;
		this.path = project_path;
		let project_json_path = fs.join(Vector.create([this.path, "project.json"]));
		if (!await fs.isFolder(this.path)) return;
		if (!await fs.isFile(project_json_path)) return;
		/* Read file */
		let content = await fs.readFile(project_json_path);
		this.info = rtl.jsonDecode(content);
	}
	
	
	/**
	 * Save project
	 */
	async save()
	{
		const fs = use("Runtime.fs");
		const Vector = use("Runtime.Vector");
		let project_json_path = fs.join(Vector.create([this.path, "project.json"]));
		let content = rtl.jsonEncode(this.info, rtl.JSON_PRETTY);
		await fs.saveFile(project_json_path, content);
	}
	
	
	/**
	 * Returns true if project is exists
	 */
	exists()
	{
		if (!this.info) return false;
		if (!this.info.has("name")) return false;
		return true;
	}
	
	
	/**
	 * Returns project path
	 */
	getPath(){ return this.exists() ? this.path : ""; }
	
	
	/**
	 * Returns project file_name
	 */
	getID(){ return this.exists() ? rs.basename(this.path) : ""; }
	
	
	/**
	 * Returns project name
	 */
	getName(){ return this.exists() ? this.info.get("name") : ""; }
	
	
	/**
	 * Set project name
	 */
	setName(name)
	{
		this.info.set("name", name);
	}
	
	
	/**
	 * Returns project description
	 */
	getDescription(){ return this.exists() ? this.info.get("description") : ""; }
	
	
	/**
	 * Set project description
	 */
	setDescription(description)
	{
		this.info.set("description", description);
	}
	
	
	/**
	 * Returns project type
	 */
	getType(){ return this.exists() ? this.info.get("type") : ""; }
	
	
	/**
	 * Set project type
	 */
	setType(project_type)
	{
		this.info.set("type", project_type);
	}
	
	
	/**
	 * Returns version
	 */
	getVersion(){ return this.exists() ? this.info.get("version") : ""; }
	
	
	/**
	 * Set version
	 */
	setVersion(version)
	{
		this.info.set("version", version);
	}
	
	
	/**
	 * Returns assets
	 */
	getAssets(){ const Vector = use("Runtime.Vector");return this.exists() ? this.info.get("assets") : Vector.create([]); }
	
	
	/**
	 * Returns languages
	 */
	getLanguages(){ const Vector = use("Runtime.Vector");return this.exists() ? this.info.get("languages") : Vector.create([]); }
	
	
	/**
	 * Returns modules
	 */
	getModules(){ return this.modules.copy(); }
	
	
	/**
	 * Returns module
	 */
	getModule(module_name){ return this.modules.get(module_name); }
	
	
	/**
	 * Returns modules by group name
	 */
	getModulesByGroupName(group_name)
	{
		/* Get modules */
		let modules = this.modules.transition((module, module_name) => { return module; });
		/* Filter modules by group */
		modules = modules.filter((module) => { return module.hasGroup(group_name); });
		/* Get names */
		modules = modules.map((item) => { return item.name; });
		/* Return modules */
		return modules;
	}
	
	
	/**
	 * Find module by file name
	 */
	findModuleByFileName(file_name)
	{
		let res = null;
		let module_path_sz = -1;
		let module_names = rtl.list(this.modules.keys());
		for (let i = 0; i < module_names.count(); i++)
		{
			let module_name = module_names.get(i);
			let module = this.modules.get(module_name);
			if (module.checkFile(file_name))
			{
				let sz = rs.strlen(module.path);
				if (module_path_sz < sz)
				{
					module_path_sz = sz;
					res = module;
				}
			}
		}
		return res;
	}
	
	
	/**
	 * Read modules
	 */
	async readModules()
	{
		const Map = use("Runtime.Map");
		this.modules = new Map();
		/* Read sub modules */
		await this.readSubModules(this.path, this.info.get("modules"));
	}
	
	
	/**
	 * Read module
	 */
	async readModule(folder_path)
	{
		const Module = use("BayLang.Compiler.Module");
		let module = new Module(this);
		await module.read(folder_path);
		if (module.exists())
		{
			/* Set module */
			this.modules.set(module.getName(), module);
			/* Read sub modules */
			await this.readSubModules(module.getPath(), module.submodules);
		}
	}
	
	
	/**
	 * Read sub modules
	 */
	async readSubModules(path, items)
	{
		const fs = use("Runtime.fs");
		const Vector = use("Runtime.Vector");
		if (!items) return;
		for (let i = 0; i < items.count(); i++)
		{
			let item = items.get(i);
			let module_src = item.get("src");
			let module_type = item.get("type");
			let folder_path = fs.join(Vector.create([path, module_src]));
			/* Read from folder */
			if (module_type == "folder")
			{
				await this.readModuleFromFolder(folder_path);
			}
			else
			{
				await this.readModule(folder_path);
			}
		}
	}
	
	
	/**
	 * Read sub modules
	 */
	async readModuleFromFolder(folder_path)
	{
		const fs = use("Runtime.fs");
		const Vector = use("Runtime.Vector");
		if (!await fs.isFolder(folder_path)) return;
		let items = await fs.listDir(folder_path);
		for (let i = 0; i < items.count(); i++)
		{
			let file_name = items.get(i);
			if (file_name == ".") continue;
			if (file_name == "..") continue;
			/* Read module */
			await this.readModule(fs.join(Vector.create([folder_path, file_name])));
		}
	}
	
	
	/**
	 * Sort modules
	 */
	sortRequiredModules(modules)
	{
		const Vector = use("Runtime.Vector");
		let result = Vector.create([]);
		let add_module;
		add_module = (module_name) =>
		{
			if (modules.indexOf(module_name) == -1) return;
			/* Get module by name */
			let module = this.modules.get(module_name);
			if (!module) return;
			/* Add required modules */
			if (module.required_modules != null)
			{
				for (let i = 0; i < module.required_modules.count(); i++)
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
		for (let i = 0; i < modules.count(); i++)
		{
			add_module(modules.get(i));
		}
		return result;
	}
	
	
	/**
	 * Returns assets modules
	 */
	getAssetModules(asset)
	{
		const Vector = use("Runtime.Vector");
		let modules = asset.get("modules");
		/* Extends modules */
		let new_modules = Vector.create([]);
		modules.each((module_name) =>
		{
			if (rs.substr(module_name, 0, 1) == "@")
			{
				/* Get group modules by name */
				let group_modules = this.getModulesByGroupName(module_name);
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
	}
	
	
	/**
	 * Build asset
	 */
	async buildAsset(asset)
	{
		const fs = use("Runtime.fs");
		const Vector = use("Runtime.Vector");
		let asset_path_relative = asset.get("dest");
		if (asset_path_relative == "") return;
		/* Get asset dest path */
		let asset_path = fs.join(Vector.create([this.path, asset_path_relative]));
		let asset_content = "";
		/* Get modules names in asset */
		let modules = this.getAssetModules(asset);
		for (let i = 0; i < modules.count(); i++)
		{
			let module_name = modules.get(i);
			let module = this.modules.get(module_name);
			if (!module) continue;
			/* Get files */
			for (let j = 0; j < module.assets.count(); j++)
			{
				let file_name = module.assets.get(j);
				let file_source_path = module.resolveSourceFilePath(file_name);
				let file_dest_path = module.resolveDestFilePath(file_name, "es6");
				if (file_dest_path)
				{
					if (await fs.isFile(file_dest_path))
					{
						let content = await fs.readFile(file_dest_path);
						asset_content += content + String("\n");
					}
					else if (await fs.isFile(file_source_path) && rs.extname(file_source_path) == "js")
					{
						let content = await fs.readFile(file_source_path);
						asset_content += content + String("\n");
					}
				}
			}
		}
		/* Create directory if does not exists */
		let dir_name = rs.dirname(asset_path);
		if (!await fs.isDir(dir_name))
		{
			await fs.mkdir(dir_name);
		}
		/* Save file */
		await fs.saveFile(asset_path, asset_content);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Map = use("Runtime.Map");
		this.path = "";
		this.info = new Map();
		this.modules = null;
	}
	static getClassName(){ return "BayLang.Compiler.Project"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return ["Runtime.SerializeInterface"]; }
};
use.add(BayLang.Compiler.Project);
module.exports = {
	"Project": BayLang.Compiler.Project,
};