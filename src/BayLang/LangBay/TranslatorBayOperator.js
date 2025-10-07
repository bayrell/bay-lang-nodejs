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
BayLang.LangBay.TranslatorBayOperator = function(translator)
{
	use("Runtime.BaseObject").call(this);
	this.translator = translator;
};
BayLang.LangBay.TranslatorBayOperator.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangBay.TranslatorBayOperator.prototype.constructor = BayLang.LangBay.TranslatorBayOperator;
Object.assign(BayLang.LangBay.TranslatorBayOperator.prototype,
{
	/**
	 * OpAssign
	 */
	OpAssign: function(op_code, result)
	{
		if (op_code.pattern)
		{
			this.translator.expression.OpTypeIdentifier(op_code.pattern, result);
		}
		var values_count = op_code.values.count();
		for (var i = 0; i < values_count; i++)
		{
			var op_code_value = op_code.values.get(i);
			if (op_code.pattern || i > 0)
			{
				result.push(" ");
			}
			if (op_code_value.op_code)
			{
				this.translator.expression.translate(op_code_value.op_code, result);
			}
			else
			{
				result.push(op_code_value.var_name);
			}
			if (op_code_value.expression)
			{
				result.push(" = ");
				this.translator.expression.translate(op_code_value.expression, result);
			}
			if (i < values_count - 1)
			{
				result.push(",");
			}
		}
	},
	/**
	 * OpBreak
	 */
	OpBreak: function(op_code, result)
	{
		result.push("break");
	},
	/**
	 * OpContinue
	 */
	OpContinue: function(op_code, result)
	{
		result.push("continue");
	},
	/**
	 * OpReturn
	 */
	OpReturn: function(op_code, result)
	{
		result.push("return");
		if (op_code.expression)
		{
			result.push(" ");
			this.translator.expression.translate(op_code.expression, result);
		}
	},
	/**
	 * OpInc
	 */
	OpInc: function(op_code, result)
	{
		var __v0 = use("BayLang.OpCodes.OpInc");
		if (op_code.kind == __v0.KIND_PRE_INC)
		{
			result.push("++");
			this.translator.expression.translate(op_code.value, result);
		}
		var __v1 = use("BayLang.OpCodes.OpInc");
		if (op_code.kind == __v1.KIND_PRE_DEC)
		{
			result.push("--");
			this.translator.expression.translate(op_code.value, result);
		}
		var __v2 = use("BayLang.OpCodes.OpInc");
		if (op_code.kind == __v2.KIND_POST_INC)
		{
			this.translator.expression.translate(op_code.value, result);
			result.push("++");
		}
		var __v3 = use("BayLang.OpCodes.OpInc");
		if (op_code.kind == __v3.KIND_POST_DEC)
		{
			this.translator.expression.translate(op_code.value, result);
			result.push("--");
		}
	},
	/**
	 * OpFor
	 */
	OpFor: function(op_code, result)
	{
		result.push("for (");
		this.translateItem(op_code.expr1, result);
		result.push("; ");
		this.translator.expression.translate(op_code.expr2, result);
		result.push("; ");
		this.translateItem(op_code.expr3, result);
		result.push(")");
		result.push(this.translator.newLine());
		this.translateItems(op_code.value, result);
	},
	/**
	 * OpIf
	 */
	OpIf: function(op_code, result)
	{
		result.push("if (");
		this.translator.expression.translate(op_code.condition, result);
		result.push(")");
		result.push(this.translator.newLine());
		this.translateItems(op_code.if_true, result);
		if (op_code.if_else && op_code.if_else.count() > 0)
		{
			for (var i = 0; i < op_code.if_else.count(); i++)
			{
				var op_code_item = op_code.if_else.get(i);
				result.push(this.translator.newLine());
				result.push("else if (");
				this.translator.expression.translate(op_code_item.condition, result);
				result.push(")");
				result.push(this.translator.newLine());
				this.translateItems(op_code_item.if_true, result);
			}
		}
		if (op_code.if_false)
		{
			result.push(this.translator.newLine());
			result.push("else");
			result.push(this.translator.newLine());
			this.translateItems(op_code.if_false, result);
		}
	},
	/**
	 * OpThrow
	 */
	OpThrow: function(op_code, result)
	{
		result.push("throw ");
		this.translator.expression.translate(op_code.expression, result);
	},
	/**
	 * OpTryCatch
	 */
	OpTryCatch: function(op_code, result)
	{
		result.push("try");
		result.push(this.translator.newLine());
		this.translateItems(op_code.op_try, result);
		if (op_code.items && op_code.items.count() > 0)
		{
			var items_count = op_code.items.count();
			for (var i = 0; i < items_count; i++)
			{
				var op_code_item = op_code.items.get(i);
				result.push(this.translator.newLine());
				result.push("catch (");
				this.translator.expression.OpTypeIdentifier(op_code_item.pattern, result);
				result.push(" ");
				result.push(op_code_item.name);
				result.push(")");
				result.push(this.translator.newLine());
				this.translateItems(op_code_item.value, result);
			}
		}
	},
	/**
	 * OpWhile
	 */
	OpWhile: function(op_code, result)
	{
		result.push("while (");
		this.translator.expression.translate(op_code.condition, result);
		result.push(")");
		result.push(this.translator.newLine());
		this.translateItems(op_code.value, result);
	},
	/**
	 * OpComment
	 */
	OpComment: function(op_code, result)
	{
		result.push("/*");
		result.push(op_code.value);
		result.push("*/");
	},
	/**
	 * Translate item
	 */
	translateItem: function(op_code, result)
	{
		var __v0 = use("BayLang.OpCodes.OpAssign");
		var __v1 = use("BayLang.OpCodes.OpBreak");
		var __v2 = use("BayLang.OpCodes.OpCall");
		var __v3 = use("BayLang.OpCodes.OpContinue");
		var __v4 = use("BayLang.OpCodes.OpReturn");
		var __v5 = use("BayLang.OpCodes.OpInc");
		var __v6 = use("BayLang.OpCodes.OpFor");
		var __v7 = use("BayLang.OpCodes.OpIf");
		var __v8 = use("BayLang.OpCodes.OpThrow");
		var __v9 = use("BayLang.OpCodes.OpTryCatch");
		var __v10 = use("BayLang.OpCodes.OpWhile");
		var __v11 = use("BayLang.OpCodes.OpComment");
		if (op_code instanceof __v0)
		{
			this.OpAssign(op_code, result);
		}
		else if (op_code instanceof __v1)
		{
			this.OpBreak(op_code, result);
		}
		else if (op_code instanceof __v2)
		{
			this.translator.expression.OpCall(op_code, result);
		}
		else if (op_code instanceof __v3)
		{
			this.OpContinue(op_code, result);
		}
		else if (op_code instanceof __v4)
		{
			this.OpReturn(op_code, result);
		}
		else if (op_code instanceof __v5)
		{
			this.OpInc(op_code, result);
		}
		else if (op_code instanceof __v6)
		{
			this.OpFor(op_code, result);
		}
		else if (op_code instanceof __v7)
		{
			this.OpIf(op_code, result);
		}
		else if (op_code instanceof __v8)
		{
			this.OpThrow(op_code, result);
		}
		else if (op_code instanceof __v9)
		{
			this.OpTryCatch(op_code, result);
		}
		else if (op_code instanceof __v10)
		{
			this.OpWhile(op_code, result);
		}
		else if (op_code instanceof __v11)
		{
			this.OpComment(op_code, result);
		}
		else
		{
			return false;
		}
		return true;
	},
	/**
	 * Translate OpItems
	 */
	translateItems: function(op_code, result)
	{
		if (op_code.items.count() == 0)
		{
			result.push("{");
			result.push("}");
			return ;
		}
		/* Begin bracket */
		result.push("{");
		this.translator.levelInc();
		/* Items */
		var items_count = op_code.items.count();
		for (var i = 0; i < items_count; i++)
		{
			var op_code_item = op_code.items.get(i);
			var result_items = use("Runtime.Vector").from([]);
			var flag = this.translateItem(op_code_item, result_items);
			if (flag)
			{
				result.push(this.translator.newLine());
				result.appendItems(result_items);
				var __v0 = use("BayLang.OpCodes.OpAssign");
				var __v1 = use("BayLang.OpCodes.OpBreak");
				var __v2 = use("BayLang.OpCodes.OpCall");
				var __v3 = use("BayLang.OpCodes.OpContinue");
				var __v4 = use("BayLang.OpCodes.OpInc");
				var __v5 = use("BayLang.OpCodes.OpReturn");
				var __v6 = use("BayLang.OpCodes.OpThrow");
				if (op_code_item instanceof __v0 || op_code_item instanceof __v1 || op_code_item instanceof __v2 || op_code_item instanceof __v3 || op_code_item instanceof __v4 || op_code_item instanceof __v5 || op_code_item instanceof __v6)
				{
					result.push(";");
				}
			}
		}
		/* End bracket */
		this.translator.levelDec();
		result.push(this.translator.newLine());
		result.push("}");
	},
	_init: function()
	{
		use("Runtime.BaseObject").prototype._init.call(this);
		this.translator = null;
	},
});
Object.assign(BayLang.LangBay.TranslatorBayOperator, use("Runtime.BaseObject"));
Object.assign(BayLang.LangBay.TranslatorBayOperator,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.LangBay.TranslatorBayOperator";
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
});use.add(BayLang.LangBay.TranslatorBayOperator);
module.exports = BayLang.LangBay.TranslatorBayOperator;