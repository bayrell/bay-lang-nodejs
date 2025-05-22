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
BayLang.LangES6.ParserES6Program = function(ctx, parser)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.parser = parser;
};
BayLang.LangES6.ParserES6Program.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangES6.ParserES6Program.prototype.constructor = BayLang.LangES6.ParserES6Program;
Object.assign(BayLang.LangES6.ParserES6Program.prototype,
{
	/**
	 * Read module
	 */
	readModuleItem: function(ctx, reader)
	{
		return this.parser.parser_operator.readOperator(ctx, reader);
	},
	/**
	 * Parse program
	 */
	parse: function(ctx, reader)
	{
		var items = use("Runtime.Vector").from([]);
		var caret_start = reader.caret(ctx);
		/* Read module */
		while (!reader.eof(ctx) && reader.nextToken(ctx) != "")
		{
			var next_token = reader.nextToken(ctx);
			/* Read module item */
			var op_code = this.readModuleItem(ctx, reader);
			if (op_code)
			{
				items.push(ctx, op_code);
			}
			else
			{
				break;
			}
			/* Match semicolon */
			if (reader.nextToken(ctx) == ";")
			{
				reader.matchToken(ctx, ";");
			}
		}
		/* Returns op_code */
		var __v0 = use("BayLang.OpCodes.OpModule");
		return new __v0(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":reader.caret(ctx),"items":items}));
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.parser = null;
	},
});
Object.assign(BayLang.LangES6.ParserES6Program, use("Runtime.BaseObject"));
Object.assign(BayLang.LangES6.ParserES6Program,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangES6";
	},
	getClassName: function()
	{
		return "BayLang.LangES6.ParserES6Program";
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
});use.add(BayLang.LangES6.ParserES6Program);
module.exports = BayLang.LangES6.ParserES6Program;