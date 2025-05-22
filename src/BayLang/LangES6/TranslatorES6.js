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
if (typeof BayLang.LangES6 == 'undefined') BayLang.LangES6 = {};
BayLang.LangES6.TranslatorES6 = function(ctx)
{
	use("BayLang.CoreTranslator").apply(this, arguments);
};
BayLang.LangES6.TranslatorES6.prototype = Object.create(use("BayLang.CoreTranslator").prototype);
BayLang.LangES6.TranslatorES6.prototype.constructor = BayLang.LangES6.TranslatorES6;
Object.assign(BayLang.LangES6.TranslatorES6.prototype,
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
	 * Translate BaseOpCode
	 */
	translate: function(ctx, op_code)
	{
		var content = use("Runtime.Vector").from([]);
		this.program.translate(ctx, op_code, content);
		var __v0 = use("Runtime.rs");
		return __v0.join(ctx, "", content);
	},
	_init: function(ctx)
	{
		use("BayLang.CoreTranslator").prototype._init.call(this,ctx);
		var __v0 = use("BayLang.LangES6.TranslatorES6Expression");
		var __v1 = use("BayLang.LangES6.TranslatorES6Operator");
		var __v2 = use("BayLang.LangES6.TranslatorES6Program");
		var __v3 = use("BayLang.LangES6.TranslatorES6Html");
		this.vars = use("Runtime.Map").from({});
		this.uses = use("Runtime.Map").from({});
		this.current_namespace_name = "";
		this.expression = new __v0(ctx, this);
		this.operator = new __v1(ctx, this);
		this.program = new __v2(ctx, this);
		this.html = new __v3(ctx, this);
	},
});
Object.assign(BayLang.LangES6.TranslatorES6, use("BayLang.CoreTranslator"));
Object.assign(BayLang.LangES6.TranslatorES6,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangES6";
	},
	getClassName: function()
	{
		return "BayLang.LangES6.TranslatorES6";
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
});use.add(BayLang.LangES6.TranslatorES6);
module.exports = BayLang.LangES6.TranslatorES6;