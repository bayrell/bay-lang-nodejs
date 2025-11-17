"use strict;"
const use = require('bay-lang').use;
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
if (typeof BayLang.LangES6 == 'undefined') BayLang.LangES6 = {};
BayLang.LangES6.TranslatorES6 = class extends use("BayLang.CoreTranslator")
{
	/**
	 * Constructor
	 */
	constructor()
	{
		super();
		this.uses.set("rtl", "Runtime.rtl");
		this.uses.set("rs", "Runtime.rs");
		this.uses.set("BaseObject", "Runtime.BaseObject");
		this.uses.set("Map", "Runtime.Map");
		this.uses.set("Vector", "Runtime.Vector");
		this.preprocessor_flags.set("FRONTEND", true);
		this.preprocessor_flags.set("ES6", true);
		this.preprocessor_flags.set("JAVASCRIPT", true);
	}
	
	
	/**
	 * Returns string
	 */
	toString(s)
	{
		const re = use("Runtime.re");
		s = re.replace("\\\\", "\\\\", s);
		s = re.replace("\"", "\\\"", s);
		s = re.replace("\n", "\\n", s);
		s = re.replace("\r", "\\r", s);
		s = re.replace("\t", "\\t", s);
		return "\"" + String(s) + String("\"");
	}
	
	
	/**
	 * Set use modules
	 */
	setUseModules(use_modules)
	{
		if (use_modules == undefined) use_modules = null;
		return null;
	}
	
	
	/**
	 * Use module
	 */
	useModule(module_name)
	{
		if (module_name == "rtl") return "Runtime.rtl";
		if (module_name == "rs") return "Runtime.rs";
		return module_name;
	}
	
	
	/**
	 * Returns module name
	 */
	getUseModule(module_name)
	{
		if (this.uses.get(module_name))
		{
			return this.useModule(this.uses.get(module_name));
		}
		return this.useModule(module_name);
	}
	
	
	/**
	 * Add use modules
	 */
	addUseModules(result)
	{
	}
	
	
	/**
	 * Translate BaseOpCode
	 */
	translate(op_code)
	{
		const Vector = use("Runtime.Vector");
		let content = new Vector();
		content.push("\"use strict;\"");
		content.push(this.newLine());
		this.program.translate(op_code, content);
		return rs.join("", content);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const TranslatorStyle = use("BayLang.LangStyle.TranslatorStyle");
		const TranslatorES6Expression = use("BayLang.LangES6.TranslatorES6Expression");
		const TranslatorES6Operator = use("BayLang.LangES6.TranslatorES6Operator");
		const TranslatorES6Program = use("BayLang.LangES6.TranslatorES6Program");
		const TranslatorES6Html = use("BayLang.LangES6.TranslatorES6Html");
		const TranslatorHelper = use("BayLang.TranslatorHelper");
		this.style = new TranslatorStyle(this);
		this.expression = new TranslatorES6Expression(this);
		this.operator = new TranslatorES6Operator(this);
		this.program = new TranslatorES6Program(this);
		this.html = new TranslatorES6Html(this);
		this.helper = new TranslatorHelper(this);
		this.use_module_name = false;
		this.use_window = true;
	}
	static getClassName(){ return "BayLang.LangES6.TranslatorES6"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangES6.TranslatorES6);
module.exports = {
	"TranslatorES6": BayLang.LangES6.TranslatorES6,
};