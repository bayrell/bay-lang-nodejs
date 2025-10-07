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
BayLang.LangNode.TranslatorNodeExpression = function()
{
	use("BayLang.LangES6.TranslatorES6Expression").apply(this, arguments);
};
BayLang.LangNode.TranslatorNodeExpression.prototype = Object.create(use("BayLang.LangES6.TranslatorES6Expression").prototype);
BayLang.LangNode.TranslatorNodeExpression.prototype.constructor = BayLang.LangNode.TranslatorNodeExpression;
Object.assign(BayLang.LangNode.TranslatorNodeExpression.prototype,
{
});
Object.assign(BayLang.LangNode.TranslatorNodeExpression, use("BayLang.LangES6.TranslatorES6Expression"));
Object.assign(BayLang.LangNode.TranslatorNodeExpression,
{
	/**
	 * OpIdentifier
	 */
	OpIdentifier: function(t, op_code)
	{
		if (op_code.value == "@")
		{
			return use("Runtime.Vector").from([t,"use(\"Runtime.rtl\").getContext()"]);
		}
		if (op_code.value == "_")
		{
			return use("Runtime.Vector").from([t,"ctx.constructor.translate"]);
		}
		if (op_code.value == "log" || op_code.value == "print")
		{
			return use("Runtime.Vector").from([t,"console.log"]);
		}
		var __v0 = use("BayLang.OpCodes.OpIdentifier");
		if (t.modules.has(op_code.value) || op_code.kind == __v0.KIND_SYS_TYPE)
		{
			var module_name = op_code.value;
			var new_module_name = this.findModuleName(t, module_name);
			if (module_name != new_module_name)
			{
				var res = t.constructor.addSaveOpCode(t, use("Runtime.Map").from({"op_code":op_code,"var_content":this.useModuleName(t, module_name)}));
				t = Runtime.rtl.attr(res, 0);
				var var_name = Runtime.rtl.attr(res, 1);
				return use("Runtime.Vector").from([t,var_name]);
			}
		}
		return use("Runtime.Vector").from([t,op_code.value]);
	},
	/**
	 * OpTypeIdentifier
	 */
	OpTypeIdentifier: function(t, op_code)
	{
		var var_name = "";
		if (op_code.entity_name.names.count() > 0)
		{
			var module_name = op_code.entity_name.names.first();
			var new_module_name = this.findModuleName(t, module_name);
			if (module_name != new_module_name)
			{
				var res = t.constructor.addSaveOpCode(t, use("Runtime.Map").from({"var_content":this.useModuleName(t, module_name)}));
				t = Runtime.rtl.attr(res, 0);
				var_name = Runtime.rtl.attr(res, 1);
			}
		}
		if (var_name == "")
		{
			var __v0 = use("Runtime.rs");
			var_name = __v0.join(".", op_code.entity_name.names);
		}
		return use("Runtime.Vector").from([t,var_name]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangNode";
	},
	getClassName: function()
	{
		return "BayLang.LangNode.TranslatorNodeExpression";
	},
	getParentClassName: function()
	{
		return "BayLang.LangES6.TranslatorES6Expression";
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
});use.add(BayLang.LangNode.TranslatorNodeExpression);
module.exports = BayLang.LangNode.TranslatorNodeExpression;