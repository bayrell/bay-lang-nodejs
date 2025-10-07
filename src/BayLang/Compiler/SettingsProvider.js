"use strict;"
var use = require('bay-lang').use;
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
BayLang.Compiler.SettingsProvider = function()
{
	use("Runtime.BaseProvider").apply(this, arguments);
};
BayLang.Compiler.SettingsProvider.prototype = Object.create(use("Runtime.BaseProvider").prototype);
BayLang.Compiler.SettingsProvider.prototype.constructor = BayLang.Compiler.SettingsProvider;
Object.assign(BayLang.Compiler.SettingsProvider.prototype,
{
	/**
	 * Returns modules
	 */
	getModules: function()
	{
		return this.modules;
	},
	/**
	 * Start
	 */
	start: async function()
	{
		var __v0 = use("Runtime.fs");
		this.project_json_path = __v0.join(use("Runtime.Vector").from([use("Runtime.rtl").getContext().base_path,"project.json"]));
		await this.reload();
	},
	/**
	 * Check provider
	 */
	check: async function()
	{
		var file_name = this.project_json_path;
		var __v0 = use("Runtime.fs");
		var is_file = await __v0.isFile(file_name);
		if (!is_file)
		{
			var __v1 = use("Runtime.Exceptions.RuntimeException");
			throw new __v1("File '" + file_name + "' does not exists")
		}
		if (!this.config)
		{
			var __v2 = use("Runtime.Exceptions.RuntimeException");
			throw new __v2("File '" + file_name + "' contains error ")
		}
	},
	/**
	 * Read settings from file
	 */
	reload: async function()
	{
		var file_name = this.project_json_path;
		var __v0 = use("Runtime.fs");
		var is_file = await __v0.isFile(file_name);
		if (!is_file)
		{
			return Promise.resolve();
		}
		var __v1 = use("Runtime.fs");
		var file_content = await __v1.readFile(file_name);
		var __v2 = use("Runtime.rtl");
		this.config = __v2.json_decode(file_content);
		var __v3 = use("Runtime.rs");
		this.project_path = __v3.dirname(file_name);
		this.modules = use("Runtime.Map").from({});
		/* Load modules */
		await this.readModules(this.project_path, this.config);
	},
	/**
	 * Returns modules from config
	 */
	readModules: async function(config_path, config)
	{
		if (!config)
		{
			return Promise.resolve();
		}
		if (!config.has("modules"))
		{
			return Promise.resolve();
		}
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(Runtime.rtl.attr(config, "modules"));
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(__v2.m_to("Runtime.Collection", use("Runtime.Vector").from([])));
		var modules_info = __v1.value();
		for (var i = 0; i < modules_info.count(); i++)
		{
			var __v3 = use("Runtime.Monad");
			var __v4 = new __v3(Runtime.rtl.attr(modules_info, i));
			var __v5 = use("Runtime.rtl");
			__v4 = __v4.monad(__v5.m_to("Runtime.Dict", use("Runtime.Map").from({})));
			var module_info = __v4.value();
			var __v6 = use("Runtime.Monad");
			var __v7 = new __v6(Runtime.rtl.attr(module_info, "src"));
			var __v8 = use("Runtime.rtl");
			__v7 = __v7.monad(__v8.m_to("string", ""));
			var module_src = __v7.value();
			var __v9 = use("Runtime.Monad");
			var __v10 = new __v9(Runtime.rtl.attr(module_info, "type"));
			var __v11 = use("Runtime.rtl");
			__v10 = __v10.monad(__v11.m_to("string", ""));
			var module_type = __v10.value();
			if (module_type == "module")
			{
				var __v12 = use("Runtime.fs");
				var module_path = __v12.join(use("Runtime.Vector").from([config_path,module_src]));
				var module = await this.readModule(module_path);
			}
			else if (module_type == "folder")
			{
				var __v13 = use("Runtime.fs");
				var folder_path = __v13.join(use("Runtime.Vector").from([config_path,module_src]));
				var folder_modules = await this.readModulesFromFolder(folder_path);
			}
		}
	},
	/**
	 * Read modules from folder
	 */
	readModulesFromFolder: async function(folder_path)
	{
		var __v0 = use("Runtime.fs");
		var file_names = await __v0.listDir(folder_path);
		for (var i = 0; i < file_names.count(); i++)
		{
			var file_name = Runtime.rtl.attr(file_names, i);
			var __v1 = use("Runtime.fs");
			var module_path = __v1.join(use("Runtime.Vector").from([folder_path,file_name]));
			await this.readModule(module_path);
		}
	},
	/**
	 * Read module from folder
	 */
	readModule: async function(module_path)
	{
		var __v0 = use("Runtime.fs");
		var module_json_path = __v0.join(use("Runtime.Vector").from([module_path,"module.json"]));
		var __v1 = use("Runtime.fs");
		var is_file = await __v1.isFile(module_json_path);
		if (!is_file)
		{
			return Promise.resolve(null);
		}
		var __v2 = use("Runtime.fs");
		var module_json_content = await __v2.readFile(module_json_path);
		var __v3 = use("Runtime.rtl");
		var module_json = __v3.json_decode(module_json_content);
		if (!module_json)
		{
			return Promise.resolve(null);
		}
		var __v4 = use("Runtime.Monad");
		var __v5 = new __v4(Runtime.rtl.attr(module_json, "name"));
		var __v6 = use("Runtime.rtl");
		__v5 = __v5.monad(__v6.m_to("string", ""));
		var module_name = __v5.value();
		if (module_name == "")
		{
			return Promise.resolve(null);
		}
		/* Create module */
		var __v7 = use("BayLang.Compiler.Module");
		var module = new __v7(use("Runtime.Map").from({"name":module_name,"config":module_json,"path":module_path}));
		/* Read submodules */
		await this.readModules(module_path, module_json);
		/* Add module */
		if (module && !this.modules.has(module_name))
		{
			this.modules.set(module_name, module);
		}
		return Promise.resolve(module);
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
			var module_name = Runtime.rtl.attr(module_names, i);
			var module = Runtime.rtl.attr(this.modules, module_name);
			var __v0 = use("Runtime.rs");
			if (__v0.indexOf(file_name, module.path) == 0)
			{
				var __v1 = use("Runtime.rs");
				var sz = __v1.strlen(module.path);
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
	 * Resolve source file.
	 * Find module, file_name by file
	 */
	resolveSourceFile: async function(file_path)
	{
		var __v0 = use("Runtime.fs");
		if (!await __v0.isFile(file_path))
		{
			return Promise.resolve(null);
		}
		var module = this.findModuleByFileName(file_path);
		if (!module)
		{
			return Promise.resolve(null);
		}
		var module_path = module.getModulePath();
		var __v1 = use("Runtime.rs");
		if (__v1.indexOf(file_path, module_path) != 0)
		{
			return Promise.resolve(null);
		}
		var __v2 = use("Runtime.rs");
		var module_ext_name = __v2.extname(file_path);
		var __v3 = use("Runtime.rs");
		var __v4 = use("Runtime.rs");
		var d = use("Runtime.Map").from({"file_path":file_path,"file_name":__v3.substr(file_path, __v4.strlen(module_path)),"module":module,"src_file_name":null,"ext_name":module_ext_name,"success":false});
		var module_src_path = module.getSourcePath();
		var __v5 = use("Runtime.rs");
		if (__v5.indexOf(file_path, module_src_path) != 0)
		{
			return Promise.resolve(d);
		}
		var __v6 = use("Runtime.rs");
		var __v7 = use("Runtime.rs");
		var src_file_name = __v6.substr(file_path, __v7.strlen(module_src_path));
		var __v8 = use("Runtime.rs");
		src_file_name = __v8.removeFirstSlash(src_file_name);
		d.set("src_file_name", src_file_name);
		if (module.checkExclude(src_file_name))
		{
			return Promise.resolve(d);
		}
		d.set("success", module.checkAllow(src_file_name));
		return Promise.resolve(d);
	},
	/**
	 * Compile file to lang
	 */
	compileFile: async function(file_path, lang, log_level)
	{
		if (log_level == undefined) log_level = 0;
		var file_info = await this.resolveSourceFile(file_path);
		if (!Runtime.rtl.attr(file_info, "success"))
		{
			return Promise.resolve(file_info);
		}
		if ((log_level & 2) == 2)
		{
			var __v0 = use("Runtime.io");
			__v0.print(file_path);
		}
		else if ((log_level & 1) == 1)
		{
			var __v1 = use("Runtime.io");
			__v1.print(Runtime.rtl.attr(file_info, "src_file_name"));
		}
		var ext_name = Runtime.rtl.attr(file_info, "ext_name");
		var container = use("Runtime.Map").from({"op_code":null,"success":false,"content":"","result":"","lang":""});
		/* Set content */
		var __v2 = use("Runtime.fs");
		var content = await __v2.readFile(file_path);
		container.set("content", content);
		if (ext_name == "bay")
		{
			var __v3 = use("BayLang.LangBay.ParserBay");
			var parser = new __v3();
			var __v4 = use("BayLang.LangUtils");
			var op_code = __v4.parse(parser, content);
			container.set("op_code", op_code);
		}
		var is_lang = (ext_name, lang) =>
		{
			/* ES6 */
			if (ext_name == "es6" && lang == "es6")
			{
				return true;
			}
			if (ext_name == "js" && lang == "es6")
			{
				return true;
			}
			/* NodeJS */
			if (ext_name == "node" && lang == "nodejs")
			{
				return true;
			}
			if (ext_name == "nodejs" && lang == "nodejs")
			{
				return true;
			}
			if (ext_name == "js" && lang == "nodejs")
			{
				return true;
			}
			/* PHP */
			if (ext_name == "php" && lang == "php")
			{
				return true;
			}
			return false;
		};
		var save_file = async (file_info, container) =>
		{
			var src_file_name = Runtime.rtl.attr(file_info, "src_file_name");
			var module = Runtime.rtl.attr(file_info, "module");
			var dest_path = module.resolveDestFile(this.project_path, src_file_name, container.get("lang"));
			if (dest_path == "")
			{
				return Promise.resolve(false);
			}
			/* Create directory if does not exists */
			var __v5 = use("Runtime.rs");
			var dir_name = __v5.dirname(dest_path);
			var __v6 = use("Runtime.fs");
			if (!await __v6.isDir(dir_name))
			{
				var __v7 = use("Runtime.fs");
				await __v7.mkdir(dir_name);
			}
			/* Save file */
			var __v8 = use("Runtime.fs");
			await __v8.saveFile(dest_path, Runtime.rtl.attr(container, "result"));
			if ((log_level & 2) == 2)
			{
				var __v9 = use("Runtime.io");
				__v9.print("=> " + use("Runtime.rtl").toStr(dest_path));
			}
			return Promise.resolve(true);
		};
		var languages = use("Runtime.Vector").from([]);
		if (lang == "")
		{
			var __v5 = use("Runtime.Monad");
			var __v6 = new __v5(Runtime.rtl.attr(this.config, "languages"));
			var __v7 = use("Runtime.rtl");
			__v6 = __v6.monad(__v7.m_to("Runtime.Collection", use("Runtime.Vector").from([])));
			languages = __v6.value();
		}
		else
		{
			languages = use("Runtime.Vector").from([lang]);
		}
		for (var i = 0; i < languages.count(); i++)
		{
			var __v8 = use("Runtime.Monad");
			var __v9 = new __v8(Runtime.rtl.attr(languages, i));
			var __v10 = use("Runtime.rtl");
			__v9 = __v9.monad(__v10.m_to("string", ""));
			var lang_name = __v9.value();
			var op_code = Runtime.rtl.attr(container, "op_code");
			container.set("success", false);
			container.set("lang", lang_name);
			container.set("result", "");
			if (ext_name == "bay")
			{
				if (op_code)
				{
					var __v11 = use("BayLang.LangUtils");
					var t = __v11.createTranslator(lang_name);
					if (t)
					{
						var __v12 = use("BayLang.LangUtils");
						container.set("result", __v12.translate(t, op_code));
						container.set("success", true);
					}
				}
			}
			else if (is_lang(ext_name, lang_name))
			{
				container.set("result", container.get("content"));
				container.set("success", true);
			}
			if (container.get("success"))
			{
				await save_file(file_info, container, lang_name);
			}
		}
		if ((log_level & 2) == 2)
		{
			var __v13 = use("Runtime.io");
			__v13.print("Ok");
		}
		return Promise.resolve(file_info);
	},
	/**
	 * Compile module to lang
	 */
	compileModule: async function(module_name, lang)
	{
		if (lang == undefined) lang = "";
		if (!this.modules.has(module_name))
		{
			var __v0 = use("Runtime.io");
			__v0.print_error("Module " + module_name + " not found");
			return Promise.resolve(false);
		}
		/* Get module */
		var module = this.modules.get(module_name);
		var module_src_path = module.getSourcePath();
		var is_success = true;
		/* Read files */
		var __v1 = use("Runtime.fs");
		var files = await __v1.listDirRecursive(module_src_path);
		for (var i = 0; i < files.count(); i++)
		{
			var file_name = Runtime.rtl.attr(files, i);
			var __v2 = use("Runtime.fs");
			var file_path = __v2.join(use("Runtime.Vector").from([module_src_path,file_name]));
			if (module.checkExclude(file_name))
			{
				continue;
			}
			var __v3 = use("Runtime.fs");
			if (!await __v3.isFile(file_path))
			{
				continue;
			}
			var __v4 = use("BayLang.Exceptions.ParserUnknownError");
			try
			{
				await this.compileFile(file_path, lang, 1);
			}
			catch (_ex)
			{
				if (_ex instanceof __v4)
				{
					var e = _ex;
					
					var __v5 = use("Runtime.io");
					__v5.print_error(e.toString());
					is_success = false;
				}
				else if (true)
				{
					var e = _ex;
					
					var __v6 = use("Runtime.io");
					__v6.print_error(e);
					is_success = false;
				}
				else
				{
					throw _ex;
				}
			}
		}
		if (is_success)
		{
			await this.updateModule(module_name);
		}
		return Promise.resolve(is_success);
	},
	/**
	 * Update module
	 */
	updateModule: async function(module_name)
	{
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(Runtime.rtl.attr(this.config, "languages"));
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(__v2.m_to("Runtime.Collection", use("Runtime.Vector").from([])));
		var languages = __v1.value();
		if (languages.indexOf("es6") == -1)
		{
			return Promise.resolve(-1);
		}
		if (!this.modules.has(module_name))
		{
			var __v3 = use("Runtime.io");
			__v3.print_error("Module " + module_name + " not found");
			return Promise.resolve(-1);
		}
		/* Make assets by module name */
		var assets = this.getAssetsByModule(module_name);
		for (var i = 0; i < assets.count(); i++)
		{
			await this.makeAsset(assets.get(i));
		}
		return Promise.resolve(0);
	},
	/**
	 * Get assets by module name
	 */
	getAssetsByModule: function(module_name)
	{
		var module = Runtime.rtl.attr(this.modules, module_name);
		/* Find assets by module */
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(Runtime.rtl.attr(this.config, "assets"));
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(__v2.m_to("Runtime.Collection", use("Runtime.Vector").from([])));
		var assets = __v1.value();
		assets = assets.filter((asset) =>
		{
			if (!asset.has("modules"))
			{
				return false;
			}
			/* Check module in modules names */
			var __v3 = use("Runtime.Monad");
			var __v4 = new __v3(Runtime.rtl.attr(asset, "modules"));
			var __v5 = use("Runtime.rtl");
			__v4 = __v4.monad(__v5.m_to("Runtime.Collection", use("Runtime.Vector").from([])));
			var modules = __v4.value();
			if (!module.inModuleList(modules))
			{
				return false;
			}
			return true;
		});
		return assets;
	},
	/**
	 * Returns modules by group name
	 */
	getGroupModules: function(group_name)
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
			/* Add required modules */
			var module = this.modules.get(module_name);
			if (module.config.has("require"))
			{
				var required_modules = module.config.get("require");
				for (var i = 0; i < required_modules.count(); i++)
				{
					add_module(required_modules.get(i));
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
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(Runtime.rtl.attr(asset, "modules"));
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(__v2.m_to("Runtime.Collection", use("Runtime.Vector").from([])));
		var modules = __v1.value();
		/* Extends modules */
		var new_modules = use("Runtime.Vector").from([]);
		modules.each((module_name) =>
		{
			var __v3 = use("Runtime.rs");
			if (__v3.substr(module_name, 0, 1) == "@")
			{
				/* Get group modules by name */
				var group_modules = this.getGroupModules(module_name);
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
	 * Make assets
	 */
	makeAsset: async function(asset)
	{
		var modules = this.getAssetModules(asset);
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(Runtime.rtl.attr(asset, "dest"));
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(__v2.m_to("string", ""));
		var asset_path_relative = __v1.value();
		if (asset_path_relative == "")
		{
			return Promise.resolve();
		}
		var __v3 = use("Runtime.fs");
		var asset_path = __v3.join(use("Runtime.Vector").from([this.project_path,asset_path_relative]));
		var asset_content = "";
		for (var i = 0; i < modules.count(); i++)
		{
			var module_name = Runtime.rtl.attr(modules, i);
			var module = Runtime.rtl.attr(this.modules, module_name);
			if (module)
			{
				var __v4 = use("Runtime.Monad");
				var __v5 = new __v4(Runtime.rtl.attr(module.config, "assets"));
				var __v6 = use("Runtime.rtl");
				__v5 = __v5.monad(__v6.m_to("Runtime.Collection", use("Runtime.Vector").from([])));
				var files = __v5.value();
				for (var j = 0; j < files.count(); j++)
				{
					var file_name = Runtime.rtl.attr(files, j);
					var file_source_path = module.resolveSourceFile(file_name);
					var file_dest_path = module.resolveDestFile(this.project_path, file_name, "es6");
					if (file_dest_path == "")
					{
						continue;
					}
					var __v7 = use("Runtime.fs");
					var __v9 = use("Runtime.fs");
					var __v10 = use("Runtime.rs");
					if (await __v7.isFile(file_dest_path))
					{
						var __v8 = use("Runtime.fs");
						var content = await __v8.readFile(file_dest_path);
						asset_content += use("Runtime.rtl").toStr(content + use("Runtime.rtl").toStr("\n"));
					}
					else if (await __v9.isFile(file_source_path) && __v10.extname(file_source_path) == "js")
					{
						var __v11 = use("Runtime.fs");
						var content = await __v11.readFile(file_source_path);
						asset_content += use("Runtime.rtl").toStr(content + use("Runtime.rtl").toStr("\n"));
					}
				}
			}
		}
		/* Create directory if does not exists */
		var __v12 = use("Runtime.rs");
		var dir_name = __v12.dirname(asset_path);
		var __v13 = use("Runtime.fs");
		if (!await __v13.isDir(dir_name))
		{
			var __v14 = use("Runtime.fs");
			await __v14.mkdir(dir_name);
		}
		/* Save file */
		var __v15 = use("Runtime.fs");
		await __v15.saveFile(asset_path, asset_content);
		var __v16 = use("Runtime.io");
		__v16.print("Bundle to => " + use("Runtime.rtl").toStr(asset_path_relative));
	},
	_init: function()
	{
		use("Runtime.BaseProvider").prototype._init.call(this);
		this.project_path = "";
		this.project_json_path = "";
		this.config = use("Runtime.Map").from({});
		this.modules = use("Runtime.Map").from({});
	},
});
Object.assign(BayLang.Compiler.SettingsProvider, use("Runtime.BaseProvider"));
Object.assign(BayLang.Compiler.SettingsProvider,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Compiler";
	},
	getClassName: function()
	{
		return "BayLang.Compiler.SettingsProvider";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseProvider";
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
});use.add(BayLang.Compiler.SettingsProvider);
module.exports = BayLang.Compiler.SettingsProvider;