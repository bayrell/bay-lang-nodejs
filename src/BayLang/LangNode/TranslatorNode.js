"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
const rtl = use("Runtime.rtl");
const TranslatorES6 = use("BayLang.LangES6.TranslatorES6");
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
if (typeof BayLang.LangNode == 'undefined') BayLang.LangNode = {};
BayLang.LangNode.TranslatorNode = class extends TranslatorES6
{
	
	/* Flags */
	
	
	/**
	 * Constructor
	 */
	constructor()
	{
		super();
		this.preprocessor_flags.set("BACKEND", true);
		this.preprocessor_flags.set("ES6", false);
		this.preprocessor_flags.set("NODEJS", true);
	}
	
	
	/**
	 * Set use modules
	 */
	setUseModules(use_modules)
	{
		if (use_modules == undefined) use_modules = null;
		if (use_modules == null) use_modules = new Map();
		var save_use_modules = this.use_modules.get("local").copy();
		this.use_modules.set("local", use_modules);
		return save_use_modules;
	}
	
	
	/**
	 * Use module
	 */
	useModule(module_name)
	{
		var is_global = false;
		if (module_name == this.current_class_name) return module_name;
		if (module_name == "Runtime.rtl" || module_name == "Runtime.rs")
		{
			is_global = true;
		}
		var arr = rs.split(".", module_name);
		var alias_name = arr.last();
		if (this.uses.has(alias_name))
		{
			var modules = this.use_modules.get(is_global ? "global" : "local");
			modules.set(alias_name, module_name);
			return alias_name;
		}
		return module_name;
	}
	
	
	/**
	 * Add use modules
	 */
	addUseModules(result, is_multiline, use_modules)
	{
		if (is_multiline == undefined) is_multiline = true;
		if (use_modules == undefined) use_modules = null;
		if (use_modules == null) use_modules = this.use_modules.get("local");
		var keys = rtl.list(use_modules.keys());
		for (var i = 0; i < keys.count(); i++)
		{
			var alias_name = keys.get(i);
			var module_name = use_modules.get(alias_name);
			if (is_multiline) result.push(this.newLine());
			result.push("const " + String(alias_name) + String(" = use(") + String(this.toString(module_name)) + String(");"));
		}
	}
	
	
	/**
	 * Translate BaseOpCode
	 */
	translate(op_code)
	{
		var result = [];
		result.push("\"use strict;\"");
		result.push(this.newLine());
		result.push("const use = require('bay-lang').use;");
		/*result.push(this.newLine());
		result.push("const {rtl, rs} = use.rtl();");*/
		/* Translate program */
		var result1 = [];
		result1.push(this.newLine());
		this.program.translate(op_code, result1);
		/* Add use */
		this.addUseModules(result, true, this.use_modules.get("global"));
		this.addUseModules(result);
		result.appendItems(result1);
		/* Add export */
		this.program.addModuleExports(result);
		return rs.join("", result);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const TranslatorNodeExpression = use("BayLang.LangNode.TranslatorNodeExpression");
		const TranslatorNodeProgram = use("BayLang.LangNode.TranslatorNodeProgram");
		this.expression = new TranslatorNodeExpression(this);
		this.program = new TranslatorNodeProgram(this);
		this.use_modules = Map.create({
			"global": new Map(),
			"local": new Map(),
		});
		this.use_module_name = true;
		this.use_window = false;
	}
	static getClassName(){ return "BayLang.LangNode.TranslatorNode"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.LangNode.TranslatorNode);
module.exports = {
	"TranslatorNode": BayLang.LangNode.TranslatorNode,
};