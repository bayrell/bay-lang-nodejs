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
if (typeof BayLang.LangNode == 'undefined') BayLang.LangNode = {};
BayLang.LangNode.TranslatorNode = function()
{
	use("BayLang.LangES6.TranslatorES6").apply(this, arguments);
};
BayLang.LangNode.TranslatorNode.prototype = Object.create(use("BayLang.LangES6.TranslatorES6").prototype);
BayLang.LangNode.TranslatorNode.prototype.constructor = BayLang.LangNode.TranslatorNode;
Object.assign(BayLang.LangNode.TranslatorNode.prototype,
{
	_init: function()
	{
		use("BayLang.LangES6.TranslatorES6").prototype._init.call(this);
		this.async_await = null;
		this.expression = null;
		this.html = null;
		this.operator = null;
		this.program = null;
		this.use_module_name = true;
		this.enable_async_await = true;
		this.emulate_async_await = false;
		this.enable_introspection = false;
		this.enable_context = false;
	},
	takeValue: function(k,d)
	{
		if (d == undefined) d = null;
		if (k == "async_await")return this.async_await;
		else if (k == "expression")return this.expression;
		else if (k == "html")return this.html;
		else if (k == "operator")return this.operator;
		else if (k == "program")return this.program;
		else if (k == "use_module_name")return this.use_module_name;
		else if (k == "enable_async_await")return this.enable_async_await;
		else if (k == "emulate_async_await")return this.emulate_async_await;
		else if (k == "enable_introspection")return this.enable_introspection;
		else if (k == "enable_context")return this.enable_context;
		return use("BayLang.LangES6.TranslatorES6").prototype.takeValue.call(this,k,d);
	},
});
Object.assign(BayLang.LangNode.TranslatorNode, use("BayLang.LangES6.TranslatorES6"));
Object.assign(BayLang.LangNode.TranslatorNode,
{
	/**
	 * Reset translator
	 */
	reset: function(t)
	{
		t = use("BayLang.LangES6.TranslatorES6").reset.bind(this)(t);
		var __v0 = use("BayLang.LangNode.TranslatorNodeExpression");
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["expression"]), new __v0());
		var __v1 = use("BayLang.LangNode.TranslatorNodeProgram");
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["program"]), new __v1());
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["preprocessor_flags"]), t.preprocessor_flags.concat(use("Runtime.Map").from({"BACKEND":true,"NODEJS":true,"ES6":false})));
		return t;
	},
	/**
	 * Translate BaseOpCode
	 */
	translate: function(t, op_code)
	{
		return t.program.constructor.translateProgram(t, op_code);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangNode";
	},
	getClassName: function()
	{
		return "BayLang.LangNode.TranslatorNode";
	},
	getParentClassName: function()
	{
		return "BayLang.LangES6.TranslatorES6";
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
		a.push("async_await");
		a.push("expression");
		a.push("html");
		a.push("operator");
		a.push("program");
		a.push("use_module_name");
		a.push("enable_async_await");
		a.push("emulate_async_await");
		a.push("enable_introspection");
		a.push("enable_context");
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
});use.add(BayLang.LangNode.TranslatorNode);
module.exports = BayLang.LangNode.TranslatorNode;