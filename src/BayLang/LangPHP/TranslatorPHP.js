"use strict;"
const use = require('bay-lang').use;
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
if (typeof BayLang.LangPHP == 'undefined') BayLang.LangPHP = {};
BayLang.LangPHP.TranslatorPHP = class extends use("BayLang.CoreTranslator")
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
		this.uses.set("Method", "Runtime.Method");
		this.uses.set("Vector", "Runtime.Vector");
		this.preprocessor_flags.set("BACKEND", true);
		this.preprocessor_flags.set("PHP", true);
	}
	
	
	/**
	 * Returns string
	 */
	toString(s)
	{
		s = rs.replace("\\", "\\\\", s);
		s = rs.replace("\"", "\\\"", s);
		s = rs.replace("\n", "\\n", s);
		s = rs.replace("\r", "\\r", s);
		s = rs.replace("\t", "\\t", s);
		s = rs.replace("$", "\\$", s);
		return "\"" + String(s) + String("\"");
	}
	
	
	/**
	 * Returns module name
	 */
	getModuleName(module_name)
	{
		return rs.replace(".", "\\", module_name);
	}
	
	
	/**
	 * Translate BaseOpCode
	 */
	translate(op_code)
	{
		const Vector = use("Runtime.Vector");
		let content = Vector.create([]);
		content.push("<?php");
		content.push(this.newLine());
		this.program.translate(op_code, content);
		return rs.join("", content);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const TranslatorHelper = use("BayLang.TranslatorHelper");
		const TranslatorStyle = use("BayLang.LangStyle.TranslatorStyle");
		const TranslatorPHPExpression = use("BayLang.LangPHP.TranslatorPHPExpression");
		const TranslatorPHPOperator = use("BayLang.LangPHP.TranslatorPHPOperator");
		const TranslatorPHPProgram = use("BayLang.LangPHP.TranslatorPHPProgram");
		const TranslatorPHPHtml = use("BayLang.LangPHP.TranslatorPHPHtml");
		this.helper = new TranslatorHelper(this);
		this.style = new TranslatorStyle(this);
		this.expression = new TranslatorPHPExpression(this);
		this.operator = new TranslatorPHPOperator(this);
		this.program = new TranslatorPHPProgram(this);
		this.html = new TranslatorPHPHtml(this);
	}
	static getClassName(){ return "BayLang.LangPHP.TranslatorPHP"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangPHP.TranslatorPHP);
module.exports = {
	"TranslatorPHP": BayLang.LangPHP.TranslatorPHP,
};