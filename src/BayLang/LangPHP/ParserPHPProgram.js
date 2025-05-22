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
BayLang.LangPHP.ParserPHPProgram = function(ctx, parser)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.parser = parser;
};
BayLang.LangPHP.ParserPHPProgram.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangPHP.ParserPHPProgram.prototype.constructor = BayLang.LangPHP.ParserPHPProgram;
Object.assign(BayLang.LangPHP.ParserPHPProgram.prototype,
{
	/**
	 * Read namespace
	 */
	readNamespace: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		/* Read module name */
		reader.matchToken(ctx, "namespace");
		var entity_name = this.parser.parser_base.readEntityName(ctx, reader);
		var module_name = entity_name.getName(ctx);
		/* Create op_code */
		var __v0 = use("BayLang.OpCodes.OpNamespace");
		var op_code = new __v0(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":reader.caret(ctx),"name":module_name}));
		/* Set current namespace */
		this.parser.current_namespace = op_code;
		this.parser.current_namespace_name = module_name;
		/* Returns op_code */
		return op_code;
	},
	/**
	 * Read use
	 */
	readUse: function(ctx, reader)
	{
		var look = null;
		var token = null;
		var name = null;
		var caret_start = reader.caret(ctx);
		var alias = "";
		/* Read module name */
		reader.matchToken(ctx, "use");
		var module_name = this.parser.parser_base.readEntityName(ctx, reader);
		/* Read alias */
		if (reader.nextToken(ctx) == "as")
		{
			reader.readToken(ctx);
			alias = reader.readToken(ctx);
		}
		var __v0 = use("BayLang.OpCodes.OpUse");
		return new __v0(ctx, use("Runtime.Map").from({"name":module_name.getName(ctx),"alias":alias,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
	},
	/**
	 * Read module
	 */
	readModuleItem: function(ctx, reader)
	{
		var next_token = reader.nextToken(ctx);
		/* Namespace */
		if (next_token == "namespace")
		{
			return this.readNamespace(ctx, reader);
		}
		else if (next_token == "use")
		{
			return this.readUse(ctx, reader);
		}
		else if (next_token != "")
		{
			return this.parser.parser_operator.readOperator(ctx, reader);
		}
		return null;
	},
	/**
	 * Parse program
	 */
	parse: function(ctx, reader)
	{
		var items = use("Runtime.Vector").from([]);
		var caret_start = reader.caret(ctx);
		/* Read PHP token */
		reader.matchToken(ctx, "<?php");
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
Object.assign(BayLang.LangPHP.ParserPHPProgram, use("Runtime.BaseObject"));
Object.assign(BayLang.LangPHP.ParserPHPProgram,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangPHP";
	},
	getClassName: function()
	{
		return "BayLang.LangPHP.ParserPHPProgram";
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
});use.add(BayLang.LangPHP.ParserPHPProgram);
module.exports = BayLang.LangPHP.ParserPHPProgram;