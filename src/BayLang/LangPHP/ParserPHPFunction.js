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
BayLang.LangPHP.ParserPHPFunction = function(ctx, parser)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.parser = parser;
};
BayLang.LangPHP.ParserPHPFunction.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangPHP.ParserPHPFunction.prototype.constructor = BayLang.LangPHP.ParserPHPFunction;
Object.assign(BayLang.LangPHP.ParserPHPFunction.prototype,
{
	/**
	 * Returns pattern
	 */
	getPattern: function(ctx, pattern)
	{
		var __v0 = use("BayLang.OpCodes.OpEntityName");
		var __v1 = use("BayLang.OpCodes.OpIdentifier");
		if (pattern instanceof __v0)
		{
			return pattern.items.first(ctx);
		}
		else if (pattern instanceof __v1)
		{
			if (pattern.value == "echo")
			{
				pattern.value = "print";
			}
		}
		return pattern;
	},
	/**
	 * Read call function
	 */
	readCallFunction: function(ctx, reader, pattern)
	{
		if (pattern == undefined) pattern = null;
		var caret_start = reader.caret(ctx);
		/* Read identifier */
		if (pattern == null)
		{
			pattern = this.parser.parser_base.readItem(ctx, reader);
		}
		/* Next token should be bracket */
		if (reader.nextToken(ctx) != "(")
		{
			return null;
		}
		/* Update pattern */
		pattern = this.getPattern(ctx, pattern);
		/* Read arguments */
		reader.matchToken(ctx, "(");
		var args = use("Runtime.Vector").from([]);
		while (!reader.eof(ctx) && reader.nextToken(ctx) != ")")
		{
			var expression = this.parser.parser_expression.readExpression(ctx, reader);
			args.push(ctx, expression);
			if (reader.nextToken(ctx) == ",")
			{
				reader.matchToken(ctx, ",");
			}
		}
		reader.matchToken(ctx, ")");
		var __v0 = use("BayLang.OpCodes.OpCall");
		return new __v0(ctx, use("Runtime.Map").from({"args":args,"item":pattern,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.parser = null;
	},
});
Object.assign(BayLang.LangPHP.ParserPHPFunction, use("Runtime.BaseObject"));
Object.assign(BayLang.LangPHP.ParserPHPFunction,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangPHP";
	},
	getClassName: function()
	{
		return "BayLang.LangPHP.ParserPHPFunction";
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
});use.add(BayLang.LangPHP.ParserPHPFunction);
module.exports = BayLang.LangPHP.ParserPHPFunction;