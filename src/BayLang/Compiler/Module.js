"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const rs = use("Runtime.rs");
/*
!
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
BayLang.Compiler.Module = class extends use("Runtime.BaseObject")
{
	/**
	 * Constructor
	 */
	constructor(project)
	{
		super();
		this.project = project;
	}
	
	
	/**
	 * Read module
	 */
	async read(module_path)
	{
		const fs = use("Runtime.fs");
		this.is_exists = false;
		this.path = module_path;
		if (!await fs.isFolder(this.path)) return;
		/* Module json file */
		let module_json_path = this.path + String("/") + String("module.json");
		if (!await fs.isFile(module_json_path)) return;
		/* Read file */
		let content = await fs.readFile(module_json_path);
		let module_info = rtl.jsonDecode(content);
		if (!module_info) return;
		if (!module_info.has("name")) return;
		this.is_exists = true;
		this.name = module_info.get("name");
		this.dest_path = module_info.get("dest");
		this.src_path = module_info.get("src");
		this.allow = module_info.get("allow");
		this.assets = module_info.get("assets");
		this.groups = module_info.get("groups");
		this.required_modules = module_info.get("require");
		this.submodules = module_info.get("modules");
		this.exclude = module_info.get("exclude");
	}
	
	
	/**
	 * Process project cache
	 */
	serialize(serializer, data)
	{
		serializer.process(this, "is_exists", data);
		serializer.process(this, "assets", data);
		serializer.process(this, "groups", data);
		serializer.process(this, "name", data);
		serializer.process(this, "path", data);
		serializer.process(this, "routes", data);
		serializer.process(this, "dest_path", data);
		serializer.process(this, "src_path", data);
		serializer.process(this, "required_modules", data);
		serializer.process(this, "submodules", data);
	}
	
	
	/**
	 * Returns true if module is exists
	 */
	exists(){ return this.is_exists; }
	
	
	/**
	 * Returns module path
	 */
	getPath(){ return this.path; }
	
	
	/**
	 * Returns module name
	 */
	getName(){ return this.name; }
	
	
	/**
	 * Returns source folder path
	 */
	getSourceFolderPath(){ const fs = use("Runtime.fs");const Vector = use("Runtime.Vector");return this.src_path ? fs.join(new Vector(this.getPath(), this.src_path)) : null; }
	
	
	/**
	 * Returns dest folder path
	 */
	getDestFolderPath(lang)
	{
		const fs = use("Runtime.fs");
		const Vector = use("Runtime.Vector");
		if (!this.dest_path.has(lang)) return "";
		return fs.join(new Vector(this.getPath(), this.dest_path.get(lang)));
	}
	
	
	/**
	 * Returns relative source path
	 */
	getRelativeSourcePath(file_path)
	{
		let source_path = this.getSourceFolderPath();
		if (!source_path) return null;
		let source_path_sz = rs.strlen(source_path);
		if (rs.substr(file_path, 0, source_path_sz) != source_path) return null;
		return rs.addFirstSlash(rs.substr(file_path, source_path_sz));
	}
	
	
	/**
	 * Returns true if module contains file
	 */
	checkFile(file_full_path){ return rs.indexOf(file_full_path, this.path) == 0; }
	
	
	/**
	 * Check allow list
	 */
	checkAllow(file_name)
	{
		const re = use("Runtime.re");
		if (!this.allow) return false;
		let success = false;
		for (let i = 0; i < this.allow.count(); i++)
		{
			let file_match = this.allow.get(i);
			if (file_match == "") continue;
			let res = re.match(file_match, file_name);
			/* Ignore */
			if (rs.charAt(file_match, 0) == "!")
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
	}
	
	
	/**
	 * Check exclude
	 */
	checkExclude(relative_src_file_path)
	{
		const re = use("Runtime.re");
		if (!this.exclude) return false;
		if (!relative_src_file_path) return false;
		for (let i = 0; i < this.exclude.count(); i++)
		{
			let file_match = this.exclude.get(i);
			if (file_match == "") continue;
			file_match = re.replace("\\/", "\\/", file_match);
			let res = re.match(file_match, relative_src_file_path);
			if (res)
			{
				return true;
			}
		}
		return false;
	}
	
	
	/**
	 * Returns class name file path
	 */
	resolveClassName(class_name)
	{
		const fs = use("Runtime.fs");
		/* Check if class name start with module name */
		let module_name_sz = rs.strlen(this.getName());
		if (rs.substr(class_name, 0, module_name_sz) != this.getName())
		{
			return "";
		}
		/* Remove module name from class name */
		class_name = rs.substr(class_name, module_name_sz);
		/* Return path to class name */
		let path = this.getSourceFolderPath();
		let arr = rs.split(".", class_name);
		arr.prepend(path);
		return fs.join(arr) + String(".bay");
	}
	
	
	/**
	 * Resolve source path
	 */
	resolveSourceFilePath(relative_src_file_path){ const fs = use("Runtime.fs");const Vector = use("Runtime.Vector");return fs.join(new Vector(this.getSourceFolderPath(), relative_src_file_path)); }
	
	
	/**
	 * Resolve dest path
	 */
	resolveDestFilePath(relative_src_file_path, lang)
	{
		const fs = use("Runtime.fs");
		const Vector = use("Runtime.Vector");
		const re = use("Runtime.re");
		let dest_folder_path = this.getDestFolderPath(lang);
		if (dest_folder_path == "") return "";
		/* Get dest file path */
		let dest_file_path = fs.join(new Vector(dest_folder_path, relative_src_file_path));
		/* Resolve extension */
		if (lang == "php")
		{
			dest_file_path = re.replace("\\.bay$", ".php", dest_file_path);
			dest_file_path = re.replace("\\.ui$", ".php", dest_file_path);
		}
		else if (lang == "es6")
		{
			dest_file_path = re.replace("\\.bay$", ".js", dest_file_path);
			dest_file_path = re.replace("\\.ui$", ".js", dest_file_path);
		}
		else if (lang == "nodejs")
		{
			dest_file_path = re.replace("\\.bay$", ".js", dest_file_path);
			dest_file_path = re.replace("\\.ui$", ".js", dest_file_path);
		}
		return dest_file_path;
	}
	
	
	/**
	 * Returns true if module has group
	 */
	hasGroup(group_name)
	{
		if (rs.substr(group_name, 0, 1) != "@") return false;
		group_name = rs.substr(group_name, 1);
		if (this.groups == null) return false;
		if (this.groups.indexOf(group_name) == -1) return false;
		return true;
	}
	
	
	/**
	 * Returns true if this module contains in module list include groups
	 */
	inModuleList(module_names)
	{
		for (let i = 0; i < module_names.count(); i++)
		{
			let module_name = module_names.get(i);
			if (this.name == module_name) return true;
			if (this.hasGroup(module_name)) return true;
		}
		return false;
	}
	
	
	/**
	 * Compile file
	 */
	async compile(relative_src_file_path, lang)
	{
		const Vector = use("Runtime.Vector");
		const fs = use("Runtime.fs");
		const ParserBay = use("BayLang.LangBay.ParserBay");
		if (lang == undefined) lang = "";
		/* Get src file path */
		let src_file_path = this.resolveSourceFilePath(relative_src_file_path);
		if (src_file_path == "") return false;
		if (!this.checkFile(src_file_path)) return false;
		if (this.checkExclude(relative_src_file_path)) return false;
		/* Check extension */
		let arr = new Vector("bay", "es6", "php", "py", "ui");
		let extension = rs.extname(src_file_path);
		if (arr.indexOf(extension) == -1) return false;
		/* Read file */
		if (!await fs.isFile(src_file_path)) return false;
		let file_content = await fs.readFile(src_file_path);
		/* Parse file */
		let file_op_code = null;
		if (extension == "bay")
		{
			let parser = new ParserBay();
			parser.setContent(file_content);
			file_op_code = parser.parse();
			if (!file_op_code) return false;
		}
		else
		{
			lang = extension;
		}
		/* Translate project languages */
		this.translateLanguages(relative_src_file_path, file_op_code ? file_op_code : file_content, lang);
		return true;
	}
	
	
	/**
	 * Translate file
	 */
	async translateLanguages(relative_src_file_path, op_code, dest_lang)
	{
		if (dest_lang == undefined) dest_lang = "";
		/* Translate to destination language */
		if (dest_lang != "")
		{
			await this.translate(relative_src_file_path, op_code, dest_lang);
		}
		else
		{
			let languages = this.project.getLanguages();
			for (let i = 0; i < languages.count(); i++)
			{
				let lang = languages.get(i);
				if (lang == "bay") continue;
				await this.translate(relative_src_file_path, op_code, lang);
			}
		}
	}
	
	
	/**
	 * Translate file
	 */
	async translate(relative_src_file_path, op_code, lang)
	{
		const LangUtils = use("BayLang.LangUtils");
		const BaseOpCode = use("BayLang.OpCodes.BaseOpCode");
		const fs = use("Runtime.fs");
		/* Get dest file path */
		let dest_file_path = this.resolveDestFilePath(relative_src_file_path, lang);
		if (dest_file_path == "") return false;
		/* Create translator */
		let translator = LangUtils.createTranslator(lang);
		if (!translator) return false;
		/* Translate */
		let dest_file_content = "";
		if (op_code instanceof BaseOpCode)
		{
			dest_file_content = translator.translate(op_code);
		}
		else if (rtl.isString(op_code))
		{
			dest_file_content = op_code;
		}
		/* Create dest folder if not exists */
		let dest_dir_name = rs.dirname(dest_file_path);
		if (!await fs.isFolder(dest_dir_name))
		{
			await fs.mkdir(dest_dir_name);
		}
		/* Save file */
		await fs.saveFile(dest_file_path, dest_file_content);
		return true;
	}
	
	
	/**
	 * Returns projects assets
	 */
	getProjectAssets()
	{
		let project_assets = this.project.getAssets();
		project_assets = project_assets.filter((asset) =>
		{
			if (!asset.has("modules")) return false;
			/* Check module in modules names */
			let modules = asset.get("modules");
			if (!modules) return false;
			if (!rtl.isCollection(modules)) return false;
			if (!this.inModuleList(modules)) return false;
			return true;
		});
		return project_assets;
	}
	
	
	/**
	 * Update assets
	 */
	async updateAssets()
	{
		let languages = this.project.getLanguages();
		if (languages.indexOf("es6") == -1) return;
		/* Builds assets with current module */
		let project_assets = this.getProjectAssets();
		for (let i = 0; i < project_assets.count(); i++)
		{
			await this.project.buildAsset(project_assets.get(i));
		}
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Map = use("Runtime.Map");
		this.project = null;
		this.is_exists = false;
		this.path = "";
		this.src_path = "";
		this.dest_path = new Map();
		this.name = "";
		this.submodules = null;
		this.allow = null;
		this.assets = null;
		this.required_modules = null;
		this.routes = null;
		this.groups = null;
		this.exclude = null;
	}
	static getClassName(){ return "BayLang.Compiler.Module"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return ["Runtime.Serialize.SerializeInterface"]; }
};
use.add(BayLang.Compiler.Module);
module.exports = {
	"Module": BayLang.Compiler.Module,
};