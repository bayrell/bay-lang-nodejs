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
BayLang.LangES6.TranslatorES6Operator = function(ctx, translator)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.translator = translator;
};
BayLang.LangES6.TranslatorES6Operator.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangES6.TranslatorES6Operator.prototype.constructor = BayLang.LangES6.TranslatorES6Operator;
Object.assign(BayLang.LangES6.TranslatorES6Operator.prototype,
{
	/**
	 * OpAssign
	 */
	OpAssign: function(ctx, op_code, result)
	{
		if (op_code.pattern)
		{
			result.push(ctx, "var");
		}
		var values_count = op_code.items.count(ctx);
		for (var i = 0; i < values_count; i++)
		{
			var op_code_value = op_code.items.get(ctx, i);
			if (op_code.pattern || i > 0)
			{
				result.push(ctx, " ");
			}
			this.translator.expression.OpIdentifier(ctx, op_code_value.value, result);
			if (op_code_value.expression)
			{
				result.push(ctx, " = ");
				this.translator.expression.translate(ctx, op_code_value.expression, result);
			}
			if (i < values_count - 1)
			{
				result.push(ctx, ",");
			}
		}
	},
	/**
	 * OpBreak
	 */
	OpBreak: function(ctx, op_code, result)
	{
		result.push(ctx, "break");
	},
	/**
	 * OpContinue
	 */
	OpContinue: function(ctx, op_code, result)
	{
		result.push(ctx, "continue");
	},
	/**
	 * OpReturn
	 */
	OpReturn: function(ctx, op_code, result)
	{
		result.push(ctx, "return");
		if (op_code.expression)
		{
			result.push(ctx, " ");
			this.translator.expression.translate(ctx, op_code.expression, result);
		}
	},
	/**
	 * OpInc
	 */
	OpInc: function(ctx, op_code, result)
	{
		var __v0 = use("BayLang.OpCodes.OpInc");
		if (op_code.kind == __v0.KIND_INC)
		{
			this.translator.expression.translate(ctx, op_code.item, result);
			result.push(ctx, "++");
		}
		var __v0 = use("BayLang.OpCodes.OpInc");
		if (op_code.kind == __v0.KIND_DEC)
		{
			this.translator.expression.translate(ctx, op_code.item, result);
			result.push(ctx, "--");
		}
	},
	/**
	 * OpFor
	 */
	OpFor: function(ctx, op_code, result)
	{
		result.push(ctx, "for (");
		this.translateItem(ctx, op_code.expr1, result);
		result.push(ctx, "; ");
		this.translator.expression.translate(ctx, op_code.expr2, result);
		result.push(ctx, "; ");
		this.translateItem(ctx, op_code.expr3, result);
		result.push(ctx, ")");
		this.translateItems(ctx, op_code.content, result);
	},
	/**
	 * OpIf
	 */
	OpIf: function(ctx, op_code, result)
	{
		result.push(ctx, "if (");
		this.translator.expression.translate(ctx, op_code.condition, result);
		result.push(ctx, ")");
		this.translateItems(ctx, op_code.if_true, result);
		if (op_code.if_else && op_code.if_else.count(ctx) > 0)
		{
			for (var i = 0; i < op_code.if_else.count(ctx); i++)
			{
				var op_code_item = op_code.if_else.get(ctx, i);
				result.push(ctx, this.translator.newLine(ctx));
				result.push(ctx, "else if (");
				this.translator.expression.translate(ctx, op_code_item.condition, result);
				result.push(ctx, ")");
				this.translateItems(ctx, op_code_item.if_true, result);
			}
		}
		if (op_code.if_false)
		{
			result.push(ctx, this.translator.newLine(ctx));
			result.push(ctx, "else");
			this.translateItems(ctx, op_code.if_false, result);
		}
	},
	/**
	 * OpThrow
	 */
	OpThrow: function(ctx, op_code, result)
	{
		result.push(ctx, "throw ");
		this.translator.expression.translate(ctx, op_code.expression, result);
	},
	/**
	 * OpTryCatch
	 */
	OpTryCatch: function(ctx, op_code, result)
	{
		result.push(ctx, "try");
		this.translateItems(ctx, op_code.op_try, result);
		if (op_code.items && op_code.items.count(ctx) > 0)
		{
			var items_count = op_code.items.count(ctx);
			for (var i = 0; i < items_count; i++)
			{
				var op_code_item = op_code.items.get(ctx, i);
				result.push(ctx, this.translator.newLine(ctx));
				result.push(ctx, "catch (");
				this.translator.expression.OpTypeIdentifier(ctx, op_code_item.pattern, result);
				result.push(ctx, " ");
				result.push(ctx, op_code_item.name);
				result.push(ctx, ")");
				this.translateItems(ctx, op_code_item.value, result);
			}
		}
	},
	/**
	 * OpWhile
	 */
	OpWhile: function(ctx, op_code, result)
	{
		result.push(ctx, "while (");
		this.translator.expression.translate(ctx, op_code.condition, result);
		result.push(ctx, ")");
		this.translateItems(ctx, op_code.content, result);
	},
	/**
	 * OpComment
	 */
	OpComment: function(ctx, op_code, result)
	{
		result.push(ctx, "/*");
		result.push(ctx, op_code.value);
		result.push(ctx, "*/");
	},
	/**
	 * Translate item
	 */
	translateItem: function(ctx, op_code, result)
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
			this.OpAssign(ctx, op_code, result);
		}
		else if (op_code instanceof __v1)
		{
			this.OpBreak(ctx, op_code, result);
		}
		else if (op_code instanceof __v2)
		{
			this.translator.expression.OpCall(ctx, op_code, result);
		}
		else if (op_code instanceof __v3)
		{
			this.OpContinue(ctx, op_code, result);
		}
		else if (op_code instanceof __v4)
		{
			this.OpReturn(ctx, op_code, result);
		}
		else if (op_code instanceof __v5)
		{
			this.OpInc(ctx, op_code, result);
		}
		else if (op_code instanceof __v6)
		{
			this.OpFor(ctx, op_code, result);
		}
		else if (op_code instanceof __v7)
		{
			this.OpIf(ctx, op_code, result);
		}
		else if (op_code instanceof __v8)
		{
			this.OpThrow(ctx, op_code, result);
		}
		else if (op_code instanceof __v9)
		{
			this.OpTryCatch(ctx, op_code, result);
		}
		else if (op_code instanceof __v10)
		{
			this.OpWhile(ctx, op_code, result);
		}
		else if (op_code instanceof __v11)
		{
			this.OpComment(ctx, op_code, result);
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
	translateItems: function(ctx, op_code, result)
	{
		var __v0 = use("BayLang.OpCodes.OpItems");
		if (!(op_code instanceof __v0))
		{
			result.push(ctx, " ");
			this.translateItem(ctx, op_code, result);
			result.push(ctx, ";");
			this.translator.last_semicolon = true;
			return ;
		}
		result.push(ctx, this.translator.newLine(ctx));
		if (op_code.items.count(ctx) == 0)
		{
			result.push(ctx, "{");
			result.push(ctx, "}");
			return ;
		}
		/* Begin bracket */
		result.push(ctx, "{");
		this.translator.levelInc(ctx);
		/* Items */
		var items_count = op_code.items.count(ctx);
		for (var i = 0; i < items_count; i++)
		{
			var op_code_item = op_code.items.get(ctx, i);
			var result_items = use("Runtime.Vector").from([]);
			this.translator.last_semicolon = false;
			var flag = this.translateItem(ctx, op_code_item, result_items);
			if (flag)
			{
				result.push(ctx, this.translator.newLine(ctx));
				result.appendItems(ctx, result_items);
				var __v0 = use("BayLang.OpCodes.OpAssign");
				var __v1 = use("BayLang.OpCodes.OpBreak");
				var __v2 = use("BayLang.OpCodes.OpCall");
				var __v3 = use("BayLang.OpCodes.OpContinue");
				var __v4 = use("BayLang.OpCodes.OpInc");
				var __v5 = use("BayLang.OpCodes.OpReturn");
				var __v6 = use("BayLang.OpCodes.OpThrow");
				if (op_code_item instanceof __v0 || op_code_item instanceof __v1 || op_code_item instanceof __v2 || op_code_item instanceof __v3 || op_code_item instanceof __v4 || op_code_item instanceof __v5 || op_code_item instanceof __v6)
				{
					if (!this.translator.last_semicolon)
					{
						result.push(ctx, ";");
					}
				}
			}
		}
		/* End bracket */
		this.translator.levelDec(ctx);
		result.push(ctx, this.translator.newLine(ctx));
		result.push(ctx, "}");
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.translator = null;
	},
});
Object.assign(BayLang.LangES6.TranslatorES6Operator, use("Runtime.BaseObject"));
Object.assign(BayLang.LangES6.TranslatorES6Operator,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangES6";
	},
	getClassName: function()
	{
		return "BayLang.LangES6.TranslatorES6Operator";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
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
});use.add(BayLang.LangES6.TranslatorES6Operator);
module.exports = BayLang.LangES6.TranslatorES6Operator;