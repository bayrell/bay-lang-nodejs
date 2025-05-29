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
BayLang.LangES6.TranslatorES6Expression = function(ctx, translator)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.translator = translator;
};
BayLang.LangES6.TranslatorES6Expression.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangES6.TranslatorES6Expression.prototype.constructor = BayLang.LangES6.TranslatorES6Expression;
Object.assign(BayLang.LangES6.TranslatorES6Expression.prototype,
{
	/**
	 * OpIdentifier
	 */
	OpIdentifier: function(ctx, op_code, result)
	{
		if (op_code.value == "print")
		{
			result.push(ctx, "console.log");
		}
		else
		{
			result.push(ctx, op_code.value);
		}
		this.translator.opcode_level = 20;
	},
	/**
	 * OpNumber
	 */
	OpNumber: function(ctx, op_code, result)
	{
		result.push(ctx, op_code.value);
		this.translator.opcode_level = 20;
	},
	/**
	 * OpString
	 */
	OpString: function(ctx, op_code, result)
	{
		result.push(ctx, this.translator.toString(ctx, op_code.value));
		this.translator.opcode_level = 20;
	},
	/**
	 * OpCode generics
	 */
	OpCodeGenerics: function(ctx, items, result)
	{
		if (!items)
		{
			return ;
		}
		/* Get items count */
		var items_count = items.count(ctx);
		if (items_count == 0)
		{
			return ;
		}
		/* Output generics */
		result.push(ctx, "<");
		for (var i = 0; i < items_count; i++)
		{
			var op_code_item = items.get(ctx, i);
			var __v0 = use("BayLang.OpCodes.OpIdentifier");
			var __v1 = use("BayLang.OpCodes.OpTypeIdentifier");
			if (op_code_item instanceof __v0)
			{
				this.OpIdentifier(ctx, op_code_item, result);
			}
			else if (op_code_item instanceof __v1)
			{
				this.OpTypeIdentifier(ctx, op_code_item, result);
			}
			if (i < items_count - 1)
			{
				result.push(ctx, ", ");
			}
		}
		result.push(ctx, ">");
	},
	/**
	 * OpTypeIdentifier
	 */
	OpTypeIdentifier: function(ctx, op_code, result)
	{
		var pattern = op_code.entity_name.items.last(ctx);
		result.push(ctx, pattern.value);
		this.OpCodeGenerics(ctx, op_code.generics, result);
	},
	/**
	 * OpCollection
	 */
	OpCollection: function(ctx, op_code, result)
	{
		var is_multiline = op_code.isMultiLine(ctx);
		result.push(ctx, "[");
		if (is_multiline)
		{
			this.translator.levelInc(ctx);
		}
		var i = 0;
		var values_count = op_code.values.count(ctx);
		while (i < values_count)
		{
			var op_code_item = op_code.values.get(ctx, i);
			if (is_multiline)
			{
				result.push(ctx, this.translator.newLine(ctx));
			}
			/* Preprocessor */
			var __v0 = use("BayLang.OpCodes.OpPreprocessorIfDef");
			if (op_code_item instanceof __v0)
			{
				var items = use("Runtime.Vector").from([]);
				var condition = op_code_item.condition.value;
				var __v1 = use("BayLang.OpCodes.OpPreprocessorIfDef");
				while (op_code_item != null && op_code_item instanceof __v1 && op_code_item.condition.value == condition)
				{
					items.push(ctx, op_code_item);
					/* Get next item */
					i++;
					op_code_item = op_code.values.get(ctx, i);
				}
				this.OpPreprocessorCollection(ctx, items, result);
				continue;
			}
			/* Translate item */
			this.translate(ctx, op_code_item, result);
			var __v0 = use("BayLang.OpCodes.OpPreprocessorIfDef");
			if (!(op_code_item instanceof __v0))
			{
				if (is_multiline)
				{
					result.push(ctx, ",");
				}
				else if (i < values_count - 1)
				{
					result.push(ctx, ", ");
				}
			}
			i++;
		}
		if (is_multiline)
		{
			this.translator.levelDec(ctx);
			result.push(ctx, this.translator.newLine(ctx));
		}
		result.push(ctx, "]");
	},
	/**
	 * Collection preprocessor
	 */
	OpPreprocessorCollection: function(ctx, items, result)
	{
		var condition = items.get(ctx, 0).condition.value;
		result.push(ctx, "#ifdef " + use("Runtime.rtl").toStr(condition) + use("Runtime.rtl").toStr(" then"));
		for (var i = 0; i < items.count(ctx); i++)
		{
			var op_code_item = items.get(ctx, i);
			result.push(ctx, this.translator.newLine(ctx));
			this.translate(ctx, op_code_item.items, result);
			result.push(ctx, ",");
		}
		result.push(ctx, this.translator.newLine(ctx));
		result.push(ctx, "#endif");
	},
	/**
	 * OpDict
	 */
	OpDict: function(ctx, op_code, result)
	{
		var is_multiline = op_code.isMultiLine(ctx);
		if (op_code.values.count(ctx) == 0 && !is_multiline)
		{
			result.push(ctx, "{");
			result.push(ctx, "}");
			return ;
		}
		/* Begin bracket */
		result.push(ctx, "{");
		if (is_multiline)
		{
			this.translator.levelInc(ctx);
		}
		/* Items */
		var i = 0;
		var values_count = op_code.values.count(ctx);
		while (i < values_count)
		{
			var op_code_item = op_code.values.get(ctx, i);
			if (is_multiline)
			{
				result.push(ctx, this.translator.newLine(ctx));
			}
			/* Preprocessor */
			if (op_code_item.condition != null)
			{
				var items = use("Runtime.Vector").from([]);
				var condition = op_code_item.condition.value;
				while (op_code_item != null && op_code_item.condition != null)
				{
					items.push(ctx, op_code_item);
					/* Get next item */
					i++;
					op_code_item = op_code.values.get(ctx, i);
				}
				this.OpPreprocessorDict(ctx, items, result);
				continue;
			}
			/* Translate item */
			result.push(ctx, this.translator.toString(ctx, op_code_item.key));
			result.push(ctx, ": ");
			this.translate(ctx, op_code_item.value, result);
			if (is_multiline)
			{
				result.push(ctx, ",");
			}
			else if (i < values_count - 1)
			{
				result.push(ctx, ", ");
			}
			i++;
		}
		/* End bracket */
		if (is_multiline)
		{
			this.translator.levelDec(ctx);
			result.push(ctx, this.translator.newLine(ctx));
		}
		result.push(ctx, "}");
	},
	/**
	 * Dict preprocessor
	 */
	OpPreprocessorDict: function(ctx, items, result)
	{
		var condition = items.get(ctx, 0).condition.value;
		result.push(ctx, "#ifdef " + use("Runtime.rtl").toStr(condition) + use("Runtime.rtl").toStr(" then"));
		for (var i = 0; i < items.count(ctx); i++)
		{
			var op_code_item = items.get(ctx, i);
			result.push(ctx, this.translator.newLine(ctx));
			result.push(ctx, this.translator.toString(ctx, op_code_item.key));
			result.push(ctx, ": ");
			this.translate(ctx, op_code_item.value, result);
			result.push(ctx, ",");
		}
		result.push(ctx, this.translator.newLine(ctx));
		result.push(ctx, "#endif");
	},
	/**
	 * OpAttr
	 */
	OpAttr: function(ctx, op_code, result)
	{
		var __v0 = use("Runtime.Vector");
		var attrs = new __v0(ctx);
		var op_code_first = op_code;
		var __v1 = use("BayLang.OpCodes.OpAttr");
		while (op_code_first instanceof __v1)
		{
			attrs.push(ctx, op_code_first);
			op_code_first = op_code_first.obj;
		}
		attrs = attrs.reverse(ctx);
		/* first op_code */
		this.translateItem(ctx, op_code_first, result);
		/* Attrs */
		for (var i = 0; i < attrs.count(ctx); i++)
		{
			var item_attr = attrs.get(ctx, i);
			var __v1 = use("BayLang.OpCodes.OpAttr");
			var __v2 = use("BayLang.OpCodes.OpAttr");
			var __v3 = use("BayLang.OpCodes.OpAttr");
			var __v4 = use("BayLang.OpCodes.OpAttr");
			if (item_attr.kind == __v1.KIND_ATTR)
			{
				result.push(ctx, ".");
				result.push(ctx, item_attr.value.value);
			}
			else if (item_attr.kind == __v2.KIND_STATIC)
			{
				result.push(ctx, "::");
				result.push(ctx, item_attr.value.value);
			}
			else if (item_attr.kind == __v3.KIND_DYNAMIC)
			{
				result.push(ctx, "[");
				this.translate(ctx, item_attr.value, result);
				result.push(ctx, "]");
			}
			else if (item_attr.kind == __v4.KIND_DYNAMIC_ATTRS)
			{
				result.push(ctx, "[");
				var item_attr_count = item_attr.attrs.count(ctx);
				for (var j = 0; j < item_attr_count; j++)
				{
					var op_code_item = item_attr.attrs.get(ctx, j);
					this.translate(ctx, op_code_item, result);
					if (j < item_attr_count - 1)
					{
						result.push(ctx, ", ");
					}
				}
				result.push(ctx, "]");
			}
		}
		this.translator.opcode_level = 20;
	},
	/**
	 * OpClassOf
	 */
	OpClassOf: function(ctx, op_code, result)
	{
		result.push(ctx, "classof ");
		result.push(ctx, op_code.entity_name.names.last(ctx));
	},
	/**
	 * OpCall
	 */
	OpCall: function(ctx, op_code, result)
	{
		this.translateItem(ctx, op_code.item, result);
		var __v0 = use("BayLang.OpCodes.OpDict");
		if (op_code.args.count(ctx) == 1 && op_code.args.get(ctx, 0) instanceof __v0)
		{
			this.OpDict(ctx, op_code.args.get(ctx, 0), result);
		}
		else
		{
			result.push(ctx, "(");
			var args_count = op_code.args.count(ctx);
			for (var i = 0; i < args_count; i++)
			{
				var op_code_item = op_code.args.get(ctx, i);
				this.Expression(ctx, op_code_item, result);
				if (i < args_count - 1)
				{
					result.push(ctx, ", ");
				}
			}
			result.push(ctx, ")");
		}
		this.translator.opcode_level = 20;
	},
	/**
	 * OpNew
	 */
	OpNew: function(ctx, op_code, result)
	{
		result.push(ctx, "new ");
		this.OpTypeIdentifier(ctx, op_code.value, result);
		var __v0 = use("BayLang.OpCodes.OpDict");
		if (op_code.args.count(ctx) == 1 && op_code.args.get(ctx, 0) instanceof __v0)
		{
			this.OpDict(ctx, op_code.args.get(ctx, 0), result);
		}
		else
		{
			result.push(ctx, "(");
			var args_count = op_code.args.count(ctx);
			for (var i = 0; i < args_count; i++)
			{
				var op_code_item = op_code.args.get(ctx, i);
				this.Expression(ctx, op_code_item, result);
				if (i < args_count - 1)
				{
					result.push(ctx, ", ");
				}
			}
			result.push(ctx, ")");
		}
		this.translator.opcode_level = 20;
	},
	/**
	 * OpMath
	 */
	OpMath: function(ctx, op_code, result)
	{
		var result1 = use("Runtime.Vector").from([]);
		this.Expression(ctx, op_code.value1, result1);
		var opcode_level1 = this.translator.opcode_level;
		var op = "";
		var opcode_level = 0;
		if (op_code.math == "!")
		{
			opcode_level = 16;
			op = "!";
		}
		if (op_code.math == ">>")
		{
			opcode_level = 12;
			op = ">>";
		}
		if (op_code.math == "<<")
		{
			opcode_level = 12;
			op = "<<";
		}
		if (op_code.math == "&")
		{
			opcode_level = 9;
			op = "&";
		}
		if (op_code.math == "xor")
		{
			opcode_level = 8;
			op = "^";
		}
		if (op_code.math == "|")
		{
			opcode_level = 7;
			op = "|";
		}
		if (op_code.math == "*")
		{
			opcode_level = 14;
			op = "*";
		}
		if (op_code.math == "/")
		{
			opcode_level = 14;
			op = "/";
		}
		if (op_code.math == "%")
		{
			opcode_level = 14;
			op = "%";
		}
		if (op_code.math == "div")
		{
			opcode_level = 14;
			op = "div";
		}
		if (op_code.math == "mod")
		{
			opcode_level = 14;
			op = "mod";
		}
		if (op_code.math == "+")
		{
			opcode_level = 13;
			op = "+";
		}
		if (op_code.math == "-")
		{
			opcode_level = 13;
			op = "-";
		}
		if (op_code.math == "~")
		{
			opcode_level = 13;
			op = "~";
		}
		if (op_code.math == "===")
		{
			opcode_level = 10;
			op = "===";
		}
		if (op_code.math == "!==")
		{
			opcode_level = 10;
			op = "!==";
		}
		if (op_code.math == "==")
		{
			opcode_level = 10;
			op = "==";
		}
		if (op_code.math == "!=")
		{
			opcode_level = 10;
			op = "!=";
		}
		if (op_code.math == ">=")
		{
			opcode_level = 10;
			op = ">=";
		}
		if (op_code.math == "<=")
		{
			opcode_level = 10;
			op = "<=";
		}
		if (op_code.math == ">")
		{
			opcode_level = 10;
			op = ">";
		}
		if (op_code.math == "<")
		{
			opcode_level = 10;
			op = "<";
		}
		if (op_code.math == "is")
		{
			opcode_level = 10;
			op = "instanceof";
		}
		if (op_code.math == "instanceof")
		{
			opcode_level = 10;
			op = "instanceof";
		}
		if (op_code.math == "implements")
		{
			opcode_level = 10;
			op = "implements";
		}
		if (op_code.math == "bitnot")
		{
			opcode_level = 16;
			op = "bitnot";
		}
		if (op_code.math == "not")
		{
			opcode_level = 16;
			op = "!";
		}
		if (op_code.math == "and" || op_code.math == "&&")
		{
			opcode_level = 6;
			op = "&&";
		}
		if (op_code.math == "or" || op_code.math == "||")
		{
			opcode_level = 5;
			op = "||";
		}
		if (op_code.math == "not" || op_code.math == "bitnot")
		{
			if (op_code.math == "bitnot")
			{
				result.push(ctx, "~");
			}
			else
			{
				result.push(ctx, op);
			}
			if (opcode_level1 < opcode_level)
			{
				result.push(ctx, "(");
				result.appendItems(ctx, result1);
				result.push(ctx, ")");
			}
			else
			{
				result.appendItems(ctx, result1);
			}
		}
		else
		{
			if (opcode_level1 < opcode_level)
			{
				result.push(ctx, "(");
				result.appendItems(ctx, result1);
				result.push(ctx, ")");
			}
			else
			{
				result.appendItems(ctx, result1);
			}
			if (op == "~")
			{
				result.push(ctx, " + ");
			}
			else
			{
				result.push(ctx, " " + use("Runtime.rtl").toStr(op) + use("Runtime.rtl").toStr(" "));
			}
			var result2 = use("Runtime.Vector").from([]);
			this.Expression(ctx, op_code.value2, result2);
			var opcode_level2 = this.translator.opcode_level;
			if (opcode_level2 < opcode_level)
			{
				if (op == "~")
				{
					result.push(ctx, "String");
				}
				result.push(ctx, "(");
				result.appendItems(ctx, result2);
				result.push(ctx, ")");
			}
			else
			{
				if (op == "~")
				{
					result.push(ctx, "String(");
					result.appendItems(ctx, result2);
					result.push(ctx, ")");
				}
				else
				{
					result.appendItems(ctx, result2);
				}
			}
		}
		this.translator.opcode_level = opcode_level;
	},
	/**
	 * Translate item
	 */
	translateItem: function(ctx, op_code, result)
	{
		var __v0 = use("BayLang.OpCodes.OpNumber");
		if (op_code instanceof __v0)
		{
			this.OpNumber(ctx, op_code, result);
		}
		var __v0 = use("BayLang.OpCodes.OpString");
		var __v1 = use("BayLang.OpCodes.OpIdentifier");
		var __v2 = use("BayLang.OpCodes.OpAttr");
		var __v3 = use("BayLang.OpCodes.OpClassOf");
		var __v4 = use("BayLang.OpCodes.OpCollection");
		var __v5 = use("BayLang.OpCodes.OpDict");
		var __v6 = use("BayLang.OpCodes.OpDeclareFunction");
		var __v7 = use("BayLang.OpCodes.OpCall");
		var __v8 = use("BayLang.OpCodes.OpNew");
		if (op_code instanceof __v0)
		{
			this.OpString(ctx, op_code, result);
		}
		else if (op_code instanceof __v1)
		{
			this.OpIdentifier(ctx, op_code, result);
		}
		else if (op_code instanceof __v2)
		{
			this.OpAttr(ctx, op_code, result);
		}
		else if (op_code instanceof __v3)
		{
			this.OpClassOf(ctx, op_code, result);
		}
		else if (op_code instanceof __v4)
		{
			this.OpCollection(ctx, op_code, result);
		}
		else if (op_code instanceof __v5)
		{
			this.OpDict(ctx, op_code, result);
		}
		else if (op_code instanceof __v6)
		{
			this.translator.program.OpDeclareFunction(ctx, op_code, result);
		}
		else if (op_code instanceof __v7)
		{
			this.OpCall(ctx, op_code, result);
		}
		else if (op_code instanceof __v8)
		{
			this.OpNew(ctx, op_code, result);
		}
	},
	/**
	 * Expression
	 */
	Expression: function(ctx, op_code, result)
	{
		var __v0 = use("BayLang.OpCodes.OpMath");
		if (op_code instanceof __v0)
		{
			this.OpMath(ctx, op_code, result);
		}
		else
		{
			this.translateItem(ctx, op_code, result);
		}
	},
	/**
	 * Translate expression
	 */
	translate: function(ctx, op_code, result)
	{
		this.Expression(ctx, op_code, result);
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.translator = null;
	},
});
Object.assign(BayLang.LangES6.TranslatorES6Expression, use("Runtime.BaseObject"));
Object.assign(BayLang.LangES6.TranslatorES6Expression,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangES6";
	},
	getClassName: function()
	{
		return "BayLang.LangES6.TranslatorES6Expression";
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
});use.add(BayLang.LangES6.TranslatorES6Expression);
module.exports = BayLang.LangES6.TranslatorES6Expression;