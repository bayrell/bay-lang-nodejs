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
Bayrell.Lang.Compiler.SettingsProvider = function(ctx)
{
	use("Runtime.BaseProvider").apply(this, arguments);
};
Bayrell.Lang.Compiler.SettingsProvider.prototype = Object.create(use("Runtime.BaseProvider").prototype);
Bayrell.Lang.Compiler.SettingsProvider.prototype.constructor = Bayrell.Lang.Compiler.SettingsProvider;
Object.assign(Bayrell.Lang.Compiler.SettingsProvider.prototype,
{
	/**
	 * Returns modules
	 */
	getModules: function(ctx)
	{
		return this.modules;
	},
	/**
	 * Start
	 */
	start: async function(ctx)
	{
		var __v0 = use("Runtime.fs");
		this.project_json_path = __v0.join(ctx, use("Runtime.Vector").from([ctx.base_path,"project.json"]));
		await this.reload(ctx);
	},
	/**
	 * Check provider
	 */
	check: async function(ctx)
	{
		var file_name = this.project_json_path;
		var __v0 = use("Runtime.fs");
		var is_file = await __v0.isFile(ctx, file_name);
		if (!is_file)
		{
			var __v1 = use("Runtime.Exceptions.RuntimeException");
			throw new __v1(ctx, "File '" + file_name + "' does not exists")
		}
		if (!this.config)
		{
			var __v1 = use("Runtime.Exceptions.RuntimeException");
			throw new __v1(ctx, "File '" + file_name + "' contains error ")
		}
	},
	/**
	 * Read settings from file
	 */
	reload: async function(ctx)
	{
		var file_name = this.project_json_path;
		var __v0 = use("Runtime.fs");
		var is_file = await __v0.isFile(ctx, file_name);
		if (!is_file)
		{
			return Promise.resolve();
		}
		var __v1 = use("Runtime.fs");
		var file_content = await __v1.readFile(ctx, file_name);
		var __v2 = use("Runtime.rtl");
		this.config = __v2.json_decode(ctx, file_content);
		var __v3 = use("Runtime.rs");
		this.project_path = __v3.dirname(ctx, file_name);
		this.modules = use("Runtime.Map").from({});
		/* Load modules */
		await this.readModules(ctx, this.project_path, this.config);
	},
	/**
	 * Returns modules from config
	 */
	readModules: async function(ctx, config_path, config)
	{
		if (!config)
		{
			return Promise.resolve();
		}
		if (!config.has(ctx, "modules"))
		{
			return Promise.resolve();
		}
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(ctx, Runtime.rtl.attr(ctx, config, "modules"));
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(ctx, __v2.m_to(ctx, "Runtime.Collection", use("Runtime.Vector").from([])));
		var modules_info = __v1.value(ctx);
		for (var i = 0; i < modules_info.count(ctx); i++)
		{
			var __v3 = use("Runtime.Monad");
			var __v4 = new __v3(ctx, Runtime.rtl.attr(ctx, modules_info, i));
			var __v5 = use("Runtime.rtl");
			__v4 = __v4.monad(ctx, __v5.m_to(ctx, "Runtime.Dict", use("Runtime.Map").from({})));
			var module_info = __v4.value(ctx);
			var __v6 = use("Runtime.Monad");
			var __v7 = new __v6(ctx, Runtime.rtl.attr(ctx, module_info, "src"));
			var __v8 = use("Runtime.rtl");
			__v7 = __v7.monad(ctx, __v8.m_to(ctx, "string", ""));
			var module_src = __v7.value(ctx);
			var __v9 = use("Runtime.Monad");
			var __v10 = new __v9(ctx, Runtime.rtl.attr(ctx, module_info, "type"));
			var __v11 = use("Runtime.rtl");
			__v10 = __v10.monad(ctx, __v11.m_to(ctx, "string", ""));
			var module_type = __v10.value(ctx);
			if (module_type == "module")
			{
				var __v12 = use("Runtime.fs");
				var module_path = __v12.join(ctx, use("Runtime.Vector").from([config_path,module_src]));
				var module = await this.readModule(ctx, module_path);
			}
			else if (module_type == "folder")
			{
				var __v13 = use("Runtime.fs");
				var folder_path = __v13.join(ctx, use("Runtime.Vector").from([config_path,module_src]));
				var folder_modules = await this.readModulesFromFolder(ctx, folder_path);
			}
		}
	},
	/**
	 * Read modules from folder
	 */
	readModulesFromFolder: async function(ctx, folder_path)
	{
		var __v0 = use("Runtime.fs");
		var file_names = await __v0.listDir(ctx, folder_path);
		for (var i = 0; i < file_names.count(ctx); i++)
		{
			var file_name = Runtime.rtl.attr(ctx, file_names, i);
			var __v1 = use("Runtime.fs");
			var module_path = __v1.join(ctx, use("Runtime.Vector").from([folder_path,file_name]));
			await this.readModule(ctx, module_path);
		}
	},
	/**
	 * Read module from folder
	 */
	readModule: async function(ctx, module_path)
	{
		var __v0 = use("Runtime.fs");
		var module_json_path = __v0.join(ctx, use("Runtime.Vector").from([module_path,"module.json"]));
		var __v1 = use("Runtime.fs");
		var is_file = await __v1.isFile(ctx, module_json_path);
		if (!is_file)
		{
			return Promise.resolve(null);
		}
		var __v2 = use("Runtime.fs");
		var module_json_content = await __v2.readFile(ctx, module_json_path);
		var __v3 = use("Runtime.rtl");
		var module_json = __v3.json_decode(ctx, module_json_content);
		if (!module_json)
		{
			return Promise.resolve(null);
		}
		var __v4 = use("Runtime.Monad");
		var __v5 = new __v4(ctx, Runtime.rtl.attr(ctx, module_json, "name"));
		var __v6 = use("Runtime.rtl");
		__v5 = __v5.monad(ctx, __v6.m_to(ctx, "string", ""));
		var module_name = __v5.value(ctx);
		if (module_name == "")
		{
			return Promise.resolve(null);
		}
		/* Create module */
		var __v7 = use("Bayrell.Lang.Compiler.Module");
		var module = new __v7(ctx, use("Runtime.Map").from({"name":module_name,"config":module_json,"path":module_path}));
		/* Read submodules */
		await this.readModules(ctx, module_path, module_json);
		/* Add module */
		if (module && !this.modules.has(ctx, module_name))
		{
			this.modules.set(ctx, module_name, module);
		}
		return Promise.resolve(module);
	},
	/**
	 * Find module by file name
	 */
	findModuleByFileName: function(ctx, file_name)
	{
		var res = null;
		var module_path_sz = -1;
		var module_names = this.modules.keys(ctx);
		for (var i = 0; i < module_names.count(ctx); i++)
		{
			var module_name = Runtime.rtl.attr(ctx, module_names, i);
			var module = Runtime.rtl.attr(ctx, this.modules, module_name);
			var __v0 = use("Runtime.rs");
			if (__v0.indexOf(ctx, file_name, module.path) == 0)
			{
				var __v1 = use("Runtime.rs");
				var sz = __v1.strlen(ctx, module.path);
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
	resolveSourceFile: async function(ctx, file_path)
	{
		var __v0 = use("Runtime.fs");
		if (!await __v0.isFile(ctx, file_path))
		{
			return Promise.resolve(null);
		}
		var module = this.findModuleByFileName(ctx, file_path);
		if (!module)
		{
			return Promise.resolve(null);
		}
		var module_path = module.getModulePath(ctx);
		var __v0 = use("Runtime.rs");
		if (__v0.indexOf(ctx, file_path, module_path) != 0)
		{
			return Promise.resolve(null);
		}
		var __v0 = use("Runtime.rs");
		var module_ext_name = __v0.extname(ctx, file_path);
		var __v1 = use("Runtime.rs");
		var __v2 = use("Runtime.rs");
		var d = use("Runtime.Map").from({"file_path":file_path,"file_name":__v1.substr(ctx, file_path, __v2.strlen(ctx, module_path)),"module":module,"src_file_name":null,"ext_name":module_ext_name,"success":false});
		var module_src_path = module.getSourcePath(ctx);
		var __v3 = use("Runtime.rs");
		if (__v3.indexOf(ctx, file_path, module_src_path) != 0)
		{
			return Promise.resolve(d);
		}
		var __v3 = use("Runtime.rs");
		var __v4 = use("Runtime.rs");
		var src_file_name = __v3.substr(ctx, file_path, __v4.strlen(ctx, module_src_path));
		var __v5 = use("Runtime.fs");
		src_file_name = __v5.removeFirstSlash(ctx, src_file_name);
		d.set(ctx, "src_file_name", src_file_name);
		if (module.checkExclude(ctx, src_file_name))
		{
			return Promise.resolve(d);
		}
		d.set(ctx, "success", module.checkAllow(ctx, src_file_name));
		return Promise.resolve(d);
	},
	/**
	 * Compile file to lang
	 */
	compileFile: async function(ctx, file_path, lang, log_level)
	{
		if (log_level == undefined) log_level = 0;
		var file_info = await this.resolveSourceFile(ctx, file_path);
		if (!Runtime.rtl.attr(ctx, file_info, "success"))
		{
			return Promise.resolve(file_info);
		}
		if ((log_level & 2) == 2)
		{
			var __v0 = use("Runtime.io");
			__v0.print(ctx, file_path);
		}
		else if ((log_level & 1) == 1)
		{
			var __v1 = use("Runtime.io");
			__v1.print(ctx, Runtime.rtl.attr(ctx, file_info, "src_file_name"));
		}
		var ext_name = Runtime.rtl.attr(ctx, file_info, "ext_name");
		var container = use("Runtime.Map").from({"op_code":null,"success":false,"content":"","result":"","lang":""});
		/* Set content */
		var __v0 = use("Runtime.fs");
		var content = await __v0.readFile(ctx, file_path);
		container.set(ctx, "content", content);
		if (ext_name == "bay")
		{
			var __v1 = use("Bayrell.Lang.LangBay.ParserBay");
			var parser = new __v1(ctx);
			var __v2 = use("Bayrell.Lang.LangUtils");
			var op_code = __v2.parse(ctx, parser, content);
			container.set(ctx, "op_code", op_code);
		}
		var is_lang = (ctx, ext_name, lang) => 
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
		var save_file = async (ctx, file_info, container) => 
		{
			var src_file_name = Runtime.rtl.attr(ctx, file_info, "src_file_name");
			var module = Runtime.rtl.attr(ctx, file_info, "module");
			var dest_path = module.resolveDestFile(ctx, this.project_path, src_file_name, container.get(ctx, "lang"));
			if (dest_path == "")
			{
				return Promise.resolve(false);
			}
			/* Create directory if does not exists */
			var __v1 = use("Runtime.rs");
			var dir_name = __v1.dirname(ctx, dest_path);
			var __v2 = use("Runtime.fs");
			if (!await __v2.isDir(ctx, dir_name))
			{
				var __v3 = use("Runtime.fs");
				await __v3.mkdir(ctx, dir_name);
			}
			/* Save file */
			var __v2 = use("Runtime.fs");
			await __v2.saveFile(ctx, dest_path, Runtime.rtl.attr(ctx, container, "result"));
			if ((log_level & 2) == 2)
			{
				var __v3 = use("Runtime.io");
				__v3.print(ctx, "=> " + use("Runtime.rtl").toStr(dest_path));
			}
			return Promise.resolve(true);
		};
		var languages = use("Runtime.Vector").from([]);
		if (lang == "")
		{
			var __v1 = use("Runtime.Monad");
			var __v2 = new __v1(ctx, Runtime.rtl.attr(ctx, this.config, "languages"));
			var __v3 = use("Runtime.rtl");
			__v2 = __v2.monad(ctx, __v3.m_to(ctx, "Runtime.Collection", use("Runtime.Vector").from([])));
			languages = __v2.value(ctx);
		}
		else
		{
			languages = use("Runtime.Vector").from([lang]);
		}
		for (var i = 0; i < languages.count(ctx); i++)
		{
			var __v1 = use("Runtime.Monad");
			var __v2 = new __v1(ctx, Runtime.rtl.attr(ctx, languages, i));
			var __v3 = use("Runtime.rtl");
			__v2 = __v2.monad(ctx, __v3.m_to(ctx, "string", ""));
			var lang_name = __v2.value(ctx);
			var op_code = Runtime.rtl.attr(ctx, container, "op_code");
			container.set(ctx, "success", false);
			container.set(ctx, "lang", lang_name);
			container.set(ctx, "result", "");
			if (ext_name == "bay")
			{
				if (op_code)
				{
					var __v4 = use("Bayrell.Lang.LangUtils");
					var t = __v4.createTranslator(ctx, lang_name);
					if (t)
					{
						var __v5 = use("Bayrell.Lang.LangUtils");
						container.set(ctx, "result", __v5.translate(ctx, t, op_code));
						container.set(ctx, "success", true);
					}
				}
			}
			else if (is_lang(ctx, ext_name, lang_name))
			{
				container.set(ctx, "result", container.get(ctx, "content"));
				container.set(ctx, "success", true);
			}
			if (container.get(ctx, "success"))
			{
				await save_file(ctx, file_info, container, lang_name);
			}
		}
		if ((log_level & 2) == 2)
		{
			var __v1 = use("Runtime.io");
			__v1.print(ctx, "Ok");
		}
		return Promise.resolve(file_info);
	},
	/**
	 * Compile module to lang
	 */
	compileModule: async function(ctx, module_name, lang)
	{
		if (lang == undefined) lang = "";
		if (!this.modules.has(ctx, module_name))
		{
			var __v0 = use("Runtime.io");
			__v0.print_error(ctx, "Module " + module_name + " not found");
			return Promise.resolve(false);
		}
		/* Get module */
		var module = this.modules.get(ctx, module_name);
		var module_src_path = module.getSourcePath(ctx);
		var is_success = true;
		/* Read files */
		var __v0 = use("Runtime.fs");
		var files = await __v0.listDirRecursive(ctx, module_src_path);
		for (var i = 0; i < files.count(ctx); i++)
		{
			var file_name = Runtime.rtl.attr(ctx, files, i);
			var __v1 = use("Runtime.fs");
			var file_path = __v1.join(ctx, use("Runtime.Vector").from([module_src_path,file_name]));
			if (module.checkExclude(ctx, file_name))
			{
				continue;
			}
			var __v2 = use("Runtime.fs");
			if (!await __v2.isFile(ctx, file_path))
			{
				continue;
			}
			var __v2 = use("Bayrell.Lang.Exceptions.ParserUnknownError");
			try
			{
				await this.compileFile(ctx, file_path, lang, 1);
			}
			catch (_ex)
			{
				if (_ex instanceof __v2)
				{
					var e = _ex;
					
					var __v3 = use("Runtime.io");
					__v3.print_error(ctx, e.toString(ctx));
					is_success = false;
				}
				else if (true)
				{
					var e = _ex;
					
					var __v4 = use("Runtime.io");
					__v4.print_error(ctx, e);
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
			await this.updateModule(ctx, module_name);
		}
		return Promise.resolve(is_success);
	},
	/**
	 * Update module
	 */
	updateModule: async function(ctx, module_name)
	{
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(ctx, Runtime.rtl.attr(ctx, this.config, "languages"));
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(ctx, __v2.m_to(ctx, "Runtime.Collection", use("Runtime.Vector").from([])));
		var languages = __v1.value(ctx);
		if (languages.indexOf(ctx, "es6") == -1)
		{
			return Promise.resolve(-1);
		}
		if (!this.modules.has(ctx, module_name))
		{
			var __v3 = use("Runtime.io");
			__v3.print_error(ctx, "Module " + module_name + " not found");
			return Promise.resolve(-1);
		}
		var module = Runtime.rtl.attr(ctx, this.modules, module_name);
		var __v3 = use("Runtime.Monad");
		var __v4 = new __v3(ctx, Runtime.rtl.attr(ctx, this.config, "assets"));
		var __v5 = use("Runtime.rtl");
		__v4 = __v4.monad(ctx, __v5.m_to(ctx, "Runtime.Collection", use("Runtime.Vector").from([])));
		var assets = __v4.value(ctx);
		for (var i = 0; i < assets.count(ctx); i++)
		{
			var asset = Runtime.rtl.attr(ctx, assets, i);
			var __v6 = use("Runtime.Monad");
			var __v7 = new __v6(ctx, Runtime.rtl.attr(ctx, asset, "modules"));
			var __v8 = use("Runtime.rtl");
			__v7 = __v7.monad(ctx, __v8.m_to(ctx, "Runtime.Collection", use("Runtime.Vector").from([])));
			var modules = __v7.value(ctx);
			if (modules.indexOf(ctx, module_name) >= 0)
			{
				await this.makeAsset(ctx, asset);
			}
		}
		return Promise.resolve(0);
	},
	/**
	 * Make assets
	 */
	makeAsset: async function(ctx, asset)
	{
		var __v0 = use("Runtime.Monad");
		var __v1 = new __v0(ctx, Runtime.rtl.attr(ctx, asset, "modules"));
		var __v2 = use("Runtime.rtl");
		__v1 = __v1.monad(ctx, __v2.m_to(ctx, "Runtime.Collection", use("Runtime.Vector").from([])));
		var modules = __v1.value(ctx);
		var __v3 = use("Runtime.Monad");
		var __v4 = new __v3(ctx, Runtime.rtl.attr(ctx, asset, "dest"));
		var __v5 = use("Runtime.rtl");
		__v4 = __v4.monad(ctx, __v5.m_to(ctx, "string", ""));
		var asset_path_relative = __v4.value(ctx);
		if (asset_path_relative == "")
		{
			return Promise.resolve();
		}
		var __v6 = use("Runtime.fs");
		var asset_path = __v6.join(ctx, use("Runtime.Vector").from([this.project_path,asset_path_relative]));
		var asset_content = "";
		for (var i = 0; i < modules.count(ctx); i++)
		{
			var module_name = Runtime.rtl.attr(ctx, modules, i);
			var module = Runtime.rtl.attr(ctx, this.modules, module_name);
			if (!module)
			{
				continue;
			}
			var __v7 = use("Runtime.Monad");
			var __v8 = new __v7(ctx, Runtime.rtl.attr(ctx, module.config, "assets"));
			var __v9 = use("Runtime.rtl");
			__v8 = __v8.monad(ctx, __v9.m_to(ctx, "Runtime.Collection", use("Runtime.Vector").from([])));
			var files = __v8.value(ctx);
			for (var j = 0; j < files.count(ctx); j++)
			{
				var file_name = Runtime.rtl.attr(ctx, files, j);
				var file_source_path = module.resolveSourceFile(ctx, file_name);
				var file_dest_path = module.resolveDestFile(ctx, this.project_path, file_name, "es6");
				var __v10 = use("Runtime.fs");
				var __v12 = use("Runtime.fs");
				if (await __v10.isFile(ctx, file_dest_path))
				{
					var __v11 = use("Runtime.fs");
					var content = await __v11.readFile(ctx, file_dest_path);
					asset_content += use("Runtime.rtl").toStr(content + use("Runtime.rtl").toStr("\n"));
				}
				else if (await __v12.isFile(ctx, file_source_path))
				{
					var __v13 = use("Runtime.fs");
					var content = await __v13.readFile(ctx, file_source_path);
					asset_content += use("Runtime.rtl").toStr(content + use("Runtime.rtl").toStr("\n"));
				}
			}
		}
		/* Create directory if does not exists */
		var __v7 = use("Runtime.rs");
		var dir_name = __v7.dirname(ctx, asset_path);
		var __v8 = use("Runtime.fs");
		if (!await __v8.isDir(ctx, dir_name))
		{
			var __v9 = use("Runtime.fs");
			await __v9.mkdir(ctx, dir_name);
		}
		/* Save file */
		var __v8 = use("Runtime.fs");
		await __v8.saveFile(ctx, asset_path, asset_content);
		var __v9 = use("Runtime.io");
		__v9.print(ctx, "Bundle to => " + use("Runtime.rtl").toStr(asset_path_relative));
	},
	_init: function(ctx)
	{
		use("Runtime.BaseProvider").prototype._init.call(this,ctx);
		this.project_path = "";
		this.project_json_path = "";
		this.config = use("Runtime.Map").from({});
		this.modules = use("Runtime.Map").from({});
	},
});
Object.assign(Bayrell.Lang.Compiler.SettingsProvider, use("Runtime.BaseProvider"));
Object.assign(Bayrell.Lang.Compiler.SettingsProvider,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Bayrell.Lang.Compiler";
	},
	getClassName: function()
	{
		return "Bayrell.Lang.Compiler.SettingsProvider";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseProvider";
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
});use.add(Bayrell.Lang.Compiler.SettingsProvider);
module.exports = Bayrell.Lang.Compiler.SettingsProvider;