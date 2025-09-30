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
if (typeof BayLang.LangBay == 'undefined') BayLang.LangBay = {};
BayLang.LangBay.TranslatorBay = function()
{
	use("Runtime.BaseObject").apply(this, arguments);
};
BayLang.LangBay.TranslatorBay.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangBay.TranslatorBay.prototype.constructor = BayLang.LangBay.TranslatorBay;
Object.assign(BayLang.LangBay.TranslatorBay.prototype,
{
	/**
	 * Reset translator
	 */
	reset: function()
	{
		this.opcode_level = 0;
		this.indent_level = 0;
		this.preprocessor_flags = use("Runtime.Map").from({});
	},
	/**
	 * Set flag
	 */
	setFlag: function(flag_name, value)
	{
		this.preprocessor_flags.set(flag_name, value);
		return this;
	},
	/**
	 * Increment indent level
	 */
	levelInc: function()
	{
		this.indent_level = this.indent_level + 1;
	},
	/**
	 * Decrease indent level
	 */
	levelDec: function()
	{
		this.indent_level = this.indent_level - 1;
	},
	/**
	 * Returns new line with indent
	 */
	newLine: function()
	{
		var __v0 = use("Runtime.rs");
		return this.crlf + use("Runtime.rtl").toStr(__v0.str_repeat(this.indent, this.indent_level));
	},
	/**
	 * Returns string
	 */
	toString: function(s)
	{
		var __v0 = use("Runtime.re");
		s = __v0.replace("\\\\", "\\\\", s);
		var __v1 = use("Runtime.re");
		s = __v1.replace("\"", "\\\"", s);
		var __v2 = use("Runtime.re");
		s = __v2.replace("\n", "\\n", s);
		var __v3 = use("Runtime.re");
		s = __v3.replace("\r", "\\r", s);
		var __v4 = use("Runtime.re");
		s = __v4.replace("\t", "\\t", s);
		return "\"" + use("Runtime.rtl").toStr(s) + use("Runtime.rtl").toStr("\"");
	},
	_init: function()
	{
		use("Runtime.BaseObject").prototype._init.call(this);
		var __v0 = use("BayLang.LangBay.TranslatorBayExpression");
		var __v1 = use("BayLang.LangBay.TranslatorBayOperator");
		var __v2 = use("BayLang.LangBay.TranslatorBayProgram");
		var __v3 = use("BayLang.LangBay.TranslatorBayHtml");
		this.opcode_level = 0;
		this.indent_level = 0;
		this.indent = "\t";
		this.crlf = "\n";
		this.preprocessor_flags = use("Runtime.Map").from({});
		this.expression = new __v0(this);
		this.operator = new __v1(this);
		this.program = new __v2(this);
		this.html = new __v3(this);
	},
});
Object.assign(BayLang.LangBay.TranslatorBay, use("Runtime.BaseObject"));
Object.assign(BayLang.LangBay.TranslatorBay,
{
	/**
	 * Translate BaseOpCode
	 */
	translate: function(t, op_code)
	{
		var content = use("Runtime.Vector").from([]);
		if (op_code.is_component)
		{
			t.html.translate(op_code, content);
		}
		else
		{
			t.program.translate(op_code, content);
		}
		var __v0 = use("Runtime.rs");
		var result = __v0.join("", content);
		return use("Runtime.Vector").from([t,result]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.LangBay.TranslatorBay";
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
});use.add(BayLang.LangBay.TranslatorBay);
module.exports = BayLang.LangBay.TranslatorBay;