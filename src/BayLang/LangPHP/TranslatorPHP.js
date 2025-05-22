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
if (typeof BayLang.LangPHP == 'undefined') BayLang.LangPHP = {};
BayLang.LangPHP.TranslatorPHP = function(ctx)
{
	use("BayLang.CoreTranslator").apply(this, arguments);
};
BayLang.LangPHP.TranslatorPHP.prototype = Object.create(use("BayLang.CoreTranslator").prototype);
BayLang.LangPHP.TranslatorPHP.prototype.constructor = BayLang.LangPHP.TranslatorPHP;
Object.assign(BayLang.LangPHP.TranslatorPHP.prototype,
{
	/**
	 * Returns string
	 */
	toString: function(ctx, s)
	{
		var __v0 = use("Runtime.re");
		s = __v0.replace(ctx, "\\\\", "\\\\", s);
		var __v1 = use("Runtime.re");
		s = __v1.replace(ctx, "\"", "\\\"", s);
		var __v2 = use("Runtime.re");
		s = __v2.replace(ctx, "\n", "\\n", s);
		var __v3 = use("Runtime.re");
		s = __v3.replace(ctx, "\r", "\\r", s);
		var __v4 = use("Runtime.re");
		s = __v4.replace(ctx, "\t", "\\t", s);
		return "\"" + use("Runtime.rtl").toStr(s) + use("Runtime.rtl").toStr("\"");
	},
	/**
	 * Returns module name
	 */
	getModuleName: function(ctx, module_name)
	{
		var __v0 = use("Runtime.rs");
		return __v0.replace(ctx, ".", "\\", module_name);
	},
	/**
	 * Translate BaseOpCode
	 */
	translate: function(ctx, op_code)
	{
		var content = use("Runtime.Vector").from([]);
		if (op_code.is_component)
		{
			this.html.translate(ctx, op_code, content);
		}
		else
		{
			this.program.translate(ctx, op_code, content);
		}
		var __v0 = use("Runtime.rs");
		return __v0.join(ctx, "", content);
	},
	_init: function(ctx)
	{
		use("BayLang.CoreTranslator").prototype._init.call(this,ctx);
		var __v0 = use("BayLang.LangPHP.TranslatorPHPExpression");
		var __v1 = use("BayLang.LangPHP.TranslatorPHPOperator");
		var __v2 = use("BayLang.LangPHP.TranslatorPHPProgram");
		var __v3 = use("BayLang.LangPHP.TranslatorPHPHtml");
		this.expression = new __v0(ctx, this);
		this.operator = new __v1(ctx, this);
		this.program = new __v2(ctx, this);
		this.html = new __v3(ctx, this);
	},
});
Object.assign(BayLang.LangPHP.TranslatorPHP, use("BayLang.CoreTranslator"));
Object.assign(BayLang.LangPHP.TranslatorPHP,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangPHP";
	},
	getClassName: function()
	{
		return "BayLang.LangPHP.TranslatorPHP";
	},
	getParentClassName: function()
	{
		return "BayLang.CoreTranslator";
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
});use.add(BayLang.LangPHP.TranslatorPHP);
module.exports = BayLang.LangPHP.TranslatorPHP;