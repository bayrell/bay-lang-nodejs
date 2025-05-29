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
BayLang.LangES6.ParserES6Function = function(ctx, parser)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.parser = parser;
};
BayLang.LangES6.ParserES6Function.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangES6.ParserES6Function.prototype.constructor = BayLang.LangES6.ParserES6Function;
Object.assign(BayLang.LangES6.ParserES6Function.prototype,
{
	/**
	 * Returns pattern
	 */
	getPattern: function(ctx, pattern)
	{
		var __v0 = use("BayLang.OpCodes.OpEntityName");
		if (pattern instanceof __v0)
		{
			if (pattern.items.count(ctx) == 2 && pattern.items.get(ctx, 0).value == "console" && pattern.items.get(ctx, 1).value == "log")
			{
				var __v1 = use("BayLang.OpCodes.OpIdentifier");
				return new __v1(ctx, use("Runtime.Map").from({"value":"print","caret_start":pattern.caret_start,"caret_end":pattern.caret_end}));
			}
			else
			{
				return pattern.items.first(ctx);
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
			if (!this.parser.parser_base.constructor.isIdentifier(ctx, reader.nextToken(ctx)))
			{
				return null;
			}
			pattern = this.parser.parser_base.readEntityName(ctx, reader);
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
Object.assign(BayLang.LangES6.ParserES6Function, use("Runtime.BaseObject"));
Object.assign(BayLang.LangES6.ParserES6Function,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangES6";
	},
	getClassName: function()
	{
		return "BayLang.LangES6.ParserES6Function";
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
});use.add(BayLang.LangES6.ParserES6Function);
module.exports = BayLang.LangES6.ParserES6Function;