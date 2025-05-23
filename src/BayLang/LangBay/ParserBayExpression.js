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
BayLang.LangBay.ParserBayExpression = function(ctx, parser)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.parser = parser;
};
BayLang.LangBay.ParserBayExpression.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangBay.ParserBayExpression.prototype.constructor = BayLang.LangBay.ParserBayExpression;
Object.assign(BayLang.LangBay.ParserBayExpression.prototype,
{
	/**
	 * Read negative
	 */
	readNegative: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		if (reader.nextToken(ctx) == "-")
		{
			reader.readToken(ctx);
			var op_code = this.parser.parser_base.readItem(ctx, reader);
			var __v0 = use("BayLang.OpCodes.OpMath");
			return new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"math":"!","caret_start":caret_start,"caret_end":reader.caret(ctx)}));
		}
		return this.parser.parser_base.readItem(ctx, reader);
	},
	/**
	 * Read bit not
	 */
	readBitNot: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		var operations = use("Runtime.Vector").from(["not","bitnot","!"]);
		if (operations.indexOf(ctx, reader.nextToken(ctx)) >= 0)
		{
			var op = reader.readToken(ctx);
			if (op == "!")
			{
				op = "not";
			}
			var op_code = this.readNegative(ctx, reader);
			var __v0 = use("BayLang.OpCodes.OpMath");
			return new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"math":op,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
		}
		return this.readNegative(ctx, reader);
	},
	/**
	 * Read bit shift
	 */
	readBitShift: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		var operations = use("Runtime.Vector").from(["<<",">>"]);
		/* Read operators */
		var op_code = this.readBitNot(ctx, reader);
		while (!reader.eof(ctx) && operations.indexOf(ctx, reader.nextToken(ctx)) >= 0)
		{
			var math = reader.readToken(ctx);
			var value = this.readBitNot(ctx, reader);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":value,"math":math,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
		}
		return op_code;
	},
	/**
	 * Read bit and
	 */
	readBitAnd: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		var operations = use("Runtime.Vector").from(["&"]);
		/* Read operators */
		var op_code = this.readBitShift(ctx, reader);
		while (!reader.eof(ctx) && operations.indexOf(ctx, reader.nextToken(ctx)) >= 0)
		{
			var math = reader.readToken(ctx);
			var value = this.readBitShift(ctx, reader);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":value,"math":math,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
		}
		return op_code;
	},
	/**
	 * Read bit or
	 */
	readBitOr: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		var operations = use("Runtime.Vector").from(["|","xor"]);
		/* Read operators */
		var op_code = this.readBitAnd(ctx, reader);
		while (!reader.eof(ctx) && operations.indexOf(ctx, reader.nextToken(ctx)) >= 0)
		{
			var math = reader.readToken(ctx);
			var value = this.readBitAnd(ctx, reader);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":value,"math":math,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
		}
		return op_code;
	},
	/**
	 * Read factor
	 */
	readFactor: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		var operations = use("Runtime.Vector").from(["*","/","%","div","mod"]);
		/* Read operators */
		var op_code = this.readBitOr(ctx, reader);
		while (!reader.eof(ctx) && operations.indexOf(ctx, reader.nextToken(ctx)) >= 0)
		{
			var math = reader.readToken(ctx);
			var value = this.readBitOr(ctx, reader);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":value,"math":math,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
		}
		return op_code;
	},
	/**
	 * Read arithmetic
	 */
	readArithmetic: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		var operations = use("Runtime.Vector").from(["+","-"]);
		/* Read operators */
		var op_code = this.readFactor(ctx, reader);
		while (!reader.eof(ctx) && operations.indexOf(ctx, reader.nextToken(ctx)) >= 0)
		{
			var math = reader.readToken(ctx);
			var value = this.readFactor(ctx, reader);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":value,"math":math,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
		}
		return op_code;
	},
	/**
	 * Read concat
	 */
	readConcat: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		var operations = use("Runtime.Vector").from(["~"]);
		/* Read operators */
		var op_code = this.readArithmetic(ctx, reader);
		while (!reader.eof(ctx) && operations.indexOf(ctx, reader.nextToken(ctx)) >= 0)
		{
			var math = reader.readToken(ctx);
			var value = this.readArithmetic(ctx, reader);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":value,"math":math,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
		}
		return op_code;
	},
	/**
	 * Read compare
	 */
	readCompare: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		var op_code = this.readConcat(ctx, reader);
		var operations1 = use("Runtime.Vector").from(["===","!==","==","!=",">=","<=",">","<"]);
		var operations2 = use("Runtime.Vector").from(["is","implements","instanceof"]);
		/* Read operators */
		if (operations1.indexOf(ctx, reader.nextToken(ctx)) >= 0)
		{
			var math = reader.readToken(ctx);
			var value = this.readConcat(ctx, reader);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":value,"math":math,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
		}
		else if (operations2.indexOf(ctx, reader.nextToken(ctx)) >= 0)
		{
			var math = reader.readToken(ctx);
			var value = this.parser.parser_base.readTypeIdentifier(ctx, reader, false);
			var __v1 = use("BayLang.OpCodes.OpMath");
			op_code = new __v1(ctx, use("Runtime.Map").from({"value1":op_code,"value2":value,"math":math,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
		}
		return op_code;
	},
	/**
	 * Read and
	 */
	readAnd: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		var operations = use("Runtime.Vector").from(["and","&&"]);
		/* Read operators */
		var op_code = this.readCompare(ctx, reader);
		while (!reader.eof(ctx) && operations.indexOf(ctx, reader.nextToken(ctx)) >= 0)
		{
			var math = reader.readToken(ctx);
			var value = this.readCompare(ctx, reader);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":value,"math":math,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
		}
		return op_code;
	},
	/**
	 * Read or
	 */
	readOr: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		var operations = use("Runtime.Vector").from(["or","||"]);
		/* Read operators */
		var op_code = this.readAnd(ctx, reader);
		while (!reader.eof(ctx) && operations.indexOf(ctx, reader.nextToken(ctx)) >= 0)
		{
			var math = reader.readToken(ctx);
			var value = this.readAnd(ctx, reader);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":value,"math":math,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
		}
		return op_code;
	},
	/**
	 * Read element
	 */
	readElement: function(ctx, reader)
	{
		/* Try to read function */
		/*
		if (this.parser.parser_function.tryReadFunction(reader, false))
		{
			return this.parser.parser_function.readDeclareFunction(reader, false);
		}
		*/
		return this.readOr(ctx, reader);
	},
	/**
	 * Read ternary operation
	 */
	readTernary: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		/* Detect ternary operation */
		var op_code = this.readElement(ctx, reader);
		if (reader.nextToken(ctx) != "?")
		{
			return op_code;
		}
		/* Read expression */
		var if_true = this.readElement(ctx, reader);
		var if_false = null;
		if (reader.nextToken(ctx) == ":")
		{
			if_false = this.readElement(ctx, reader);
		}
		var __v0 = use("BayLang.OpCodes.OpTernary");
		return new __v0(ctx, use("Runtime.Map").from({"condition":op_code,"if_true":if_true,"if_false":if_false,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
	},
	/**
	 * Read expression
	 */
	readExpression: function(ctx, reader)
	{
		return this.readTernary(ctx, reader);
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.parser = null;
	},
});
Object.assign(BayLang.LangBay.ParserBayExpression, use("Runtime.BaseObject"));
Object.assign(BayLang.LangBay.ParserBayExpression,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.LangBay.ParserBayExpression";
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
});use.add(BayLang.LangBay.ParserBayExpression);
module.exports = BayLang.LangBay.ParserBayExpression;