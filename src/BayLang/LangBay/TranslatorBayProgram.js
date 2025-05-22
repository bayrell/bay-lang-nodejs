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
BayLang.LangBay.TranslatorBayProgram = function(ctx, translator)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.translator = translator;
};
BayLang.LangBay.TranslatorBayProgram.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangBay.TranslatorBayProgram.prototype.constructor = BayLang.LangBay.TranslatorBayProgram;
Object.assign(BayLang.LangBay.TranslatorBayProgram.prototype,
{
	/**
	 * OpNamespace
	 */
	OpNamespace: function(ctx, op_code, result)
	{
		result.push(ctx, "namespace ");
		result.push(ctx, op_code.name);
		result.push(ctx, ";");
		result.push(ctx, this.translator.newLine(ctx));
	},
	/**
	 * OpUse
	 */
	OpUse: function(ctx, op_code, result)
	{
		var __v0 = use("Runtime.rs");
		var items = __v0.split(ctx, ".", op_code.name);
		var last_name = items.last(ctx);
		result.push(ctx, "use ");
		result.push(ctx, op_code.name);
		if (op_code.alias != "" && op_code.alias != last_name)
		{
			result.push(ctx, " as ");
			result.push(ctx, op_code.alias);
		}
		result.push(ctx, ";");
	},
	/**
	 * OpAnnotation
	 */
	OpAnnotation: function(ctx, op_code, result)
	{
		result.push(ctx, "@");
		this.translator.expression.OpTypeIdentifier(ctx, op_code.name, result);
		this.translator.expression.OpDict(ctx, op_code.params, result);
	},
	/**
	 * OpAssign
	 */
	OpAssign: function(ctx, op_code, result)
	{
		this.translator.operator.OpAssign(ctx, op_code, result);
		result.push(ctx, ";");
	},
	/**
	 * OpDeclareFunctionArg
	 */
	OpDeclareFunctionArg: function(ctx, op_code, result)
	{
		this.translator.expression.OpTypeIdentifier(ctx, op_code.pattern, result);
		result.push(ctx, " ");
		result.push(ctx, op_code.name);
		if (op_code.expression)
		{
			result.push(ctx, " = ");
			this.translator.expression.translate(ctx, op_code.expression, result);
		}
	},
	/**
	 * OpDeclareFunctionArgs
	 */
	OpDeclareFunctionArgs: function(ctx, op_code, result)
	{
		if (op_code.args && op_code.args.count(ctx) > 0)
		{
			var args_count = op_code.args.count(ctx);
			for (var i = 0; i < args_count; i++)
			{
				var op_code_item = op_code.args.get(ctx, i);
				this.OpDeclareFunctionArg(ctx, op_code_item, result);
				if (i < args_count - 1)
				{
					result.push(ctx, ", ");
				}
			}
		}
	},
	/**
	 * OpDeclareFunction
	 */
	OpDeclareFunction: function(ctx, op_code, result)
	{
		var __v0 = use("BayLang.OpCodes.OpTypeIdentifier");
		if (!(op_code.result_type instanceof __v0))
		{
			return ;
		}
		/* Function flags */
		var flags = use("Runtime.Vector").from(["async","static","pure"]);
		flags = flags.filter(ctx, (ctx, flag_name) =>
		{
			return (op_code.flags) ? (op_code.flags.isFlag(ctx, flag_name)) : (false);
		});
		var __v0 = use("Runtime.rs");
		result.push(ctx, __v0.join(ctx, " ", flags));
		if (flags.count(ctx) > 0)
		{
			result.push(ctx, " ");
		}
		/* Function result type */
		this.translator.expression.OpTypeIdentifier(ctx, op_code.result_type, result);
		/* Function name */
		result.push(ctx, " ");
		result.push(ctx, op_code.name);
		/* Arguments */
		result.push(ctx, "(");
		this.OpDeclareFunctionArgs(ctx, op_code, result);
		result.push(ctx, ")");
		/* Expression */
		if (op_code.expression)
		{
			var is_multiline = op_code.expression.isMultiLine(ctx);
			if (is_multiline)
			{
				result.push(ctx, " =>");
				result.push(ctx, this.translator.newLine(ctx));
			}
			else
			{
				result.push(ctx, " => ");
			}
			this.translator.expression.translate(ctx, op_code.expression, result);
			result.push(ctx, ";");
		}
		else if (op_code.items)
		{
			if (op_code.items.items.count(ctx) > 0)
			{
				result.push(ctx, this.translator.newLine(ctx));
			}
			this.translator.operator.translateItems(ctx, op_code.items, result);
		}
	},
	/**
	 * Translate class item
	 */
	translateClassItem: function(ctx, op_code, result)
	{
		var __v0 = use("BayLang.OpCodes.OpAnnotation");
		var __v1 = use("BayLang.OpCodes.OpAssign");
		var __v2 = use("BayLang.OpCodes.OpDeclareFunction");
		if (op_code instanceof __v0)
		{
			this.OpAnnotation(ctx, op_code, result);
		}
		else if (op_code instanceof __v1)
		{
			this.OpAssign(ctx, op_code, result);
		}
		else if (op_code instanceof __v2)
		{
			this.OpDeclareFunction(ctx, op_code, result);
		}
		else
		{
			return false;
		}
		return true;
	},
	/**
	 * Translate class body
	 */
	translateClassBody: function(ctx, op_code, result)
	{
		/* Begin bracket */
		result.push(ctx, "{");
		this.translator.levelInc(ctx);
		/* Class body items */
		var next_new_line = true;
		for (var i = 0; i < op_code.items.count(ctx); i++)
		{
			if (next_new_line)
			{
				result.push(ctx, this.translator.newLine(ctx));
			}
			var op_code_item = op_code.items.get(ctx, i);
			next_new_line = this.translateClassItem(ctx, op_code_item, result);
		}
		/* End bracket */
		this.translator.levelDec(ctx);
		result.push(ctx, this.translator.newLine(ctx));
		result.push(ctx, "}");
	},
	/**
	 * Translate class
	 */
	translateClass: function(ctx, op_code, result)
	{
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		var __v1 = use("BayLang.OpCodes.OpDeclareClass");
		var __v2 = use("BayLang.OpCodes.OpDeclareClass");
		if (op_code.kind == __v0.KIND_CLASS)
		{
			result.push(ctx, "class ");
		}
		else if (op_code.kind == __v1.KIND_INTERFACE)
		{
			result.push(ctx, "interface ");
		}
		else if (op_code.kind == __v2.KIND_STRUCT)
		{
			result.push(ctx, "struct ");
		}
		/* Class name */
		result.push(ctx, op_code.name);
		/* Template */
		if (op_code.template)
		{
			this.translator.expression.OpTypeTemplate(ctx, op_code.template, result);
		}
		/* Extends */
		if (op_code.class_extends)
		{
			result.push(ctx, " extends ");
			this.translator.expression.OpTypeIdentifier(ctx, op_code.class_extends, result);
		}
		/* Implements */
		if (op_code.class_implements)
		{
			result.push(ctx, " implements ");
			var items_count = op_code.class_implements.count(ctx);
			for (var i = 0; i < items_count; i++)
			{
				var op_code_item = op_code.class_implements.get(ctx, i);
				this.translator.expression.OpTypeIdentifier(ctx, op_code_item, result);
				if (i < items_count - 1)
				{
					result.push(ctx, ", ");
				}
			}
		}
		result.push(ctx, this.translator.newLine(ctx));
		this.translateClassBody(ctx, op_code, result);
	},
	/**
	 * Translate item
	 */
	translateItem: function(ctx, op_code, result)
	{
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		var __v1 = use("BayLang.OpCodes.OpNamespace");
		var __v2 = use("BayLang.OpCodes.OpUse");
		if (op_code instanceof __v0)
		{
			this.translateClass(ctx, op_code, result);
		}
		else if (op_code instanceof __v1)
		{
			this.OpNamespace(ctx, op_code, result);
		}
		else if (op_code instanceof __v2)
		{
			this.OpUse(ctx, op_code, result);
		}
		else
		{
			this.translator.last_semicolon = false;
			var exists = this.translator.operator.translateItem(ctx, op_code, result);
			if (exists && !this.translator.last_semicolon)
			{
				result.push(ctx, ";");
			}
		}
	},
	/**
	 * Translate items
	 */
	translateItems: function(ctx, items, result)
	{
		var op_code_use_count = 0;
		var prev_op_code_use = false;
		for (var i = 0; i < items.count(ctx); i++)
		{
			var op_code_item = items.get(ctx, i);
			if (i > 0)
			{
				result.push(ctx, this.translator.newLine(ctx));
			}
			var __v0 = use("BayLang.OpCodes.OpDeclareClass");
			if (op_code_item instanceof __v0 && op_code_use_count > 0)
			{
				result.push(ctx, this.translator.newLine(ctx));
				if (op_code_use_count > 1)
				{
					result.push(ctx, this.translator.newLine(ctx));
				}
			}
			var __v0 = use("BayLang.OpCodes.OpUse");
			if (op_code_item instanceof __v0)
			{
				op_code_use_count++;
			}
			else
			{
				op_code_use_count = 0;
			}
			this.translateItem(ctx, items.get(ctx, i), result);
		}
	},
	/**
	 * Translate
	 */
	translate: function(ctx, op_code, result)
	{
		this.translateItems(ctx, op_code.items, result);
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.translator = null;
	},
});
Object.assign(BayLang.LangBay.TranslatorBayProgram, use("Runtime.BaseObject"));
Object.assign(BayLang.LangBay.TranslatorBayProgram,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.LangBay.TranslatorBayProgram";
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
});use.add(BayLang.LangBay.TranslatorBayProgram);
module.exports = BayLang.LangBay.TranslatorBayProgram;