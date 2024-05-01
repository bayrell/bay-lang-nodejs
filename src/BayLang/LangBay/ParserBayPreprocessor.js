"use strict;"
var use = require('bay-lang').use;
/*!
 *  Bayrell Language
 *
 *  (c) Copyright 2016-2023 "Ildar Bikmamatov" <support@bayrell.org>
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
if (typeof Bayrell == 'undefined') Bayrell = {};
if (typeof Bayrell.Lang == 'undefined') Bayrell.Lang = {};
if (typeof Bayrell.Lang.LangBay == 'undefined') Bayrell.Lang.LangBay = {};
Bayrell.Lang.LangBay.ParserBayPreprocessor = function(ctx)
{
};
Object.assign(Bayrell.Lang.LangBay.ParserBayPreprocessor.prototype,
{
});
Object.assign(Bayrell.Lang.LangBay.ParserBayPreprocessor,
{
	/**
	 * Read namespace
	 */
	readPreprocessor: function(ctx, parser)
	{
		var start = parser;
		var look = null;
		var token = null;
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "#switch")
		{
			return this.readPreprocessorSwitch(ctx, start);
		}
		if (token.content == "#ifcode")
		{
			return this.readPreprocessorIfCode(ctx, start);
		}
		return null;
	},
	/**
	 * Read preprocessor switch
	 */
	readPreprocessorSwitch: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var __v0 = use("Runtime.Vector");
		var items = new __v0(ctx);
		/* Save vars */
		var save_vars = parser.vars;
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), parser.vars.concat(ctx, use("Runtime.Map").from({"ES6":true,"NODEJS":true,"JAVASCRIPT":true,"PHP":true,"PYTHON3":true})));
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "#switch");
		parser = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = token.caret_start;
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		while (token.content == "#case")
		{
			parser = look;
			/* Skip ifcode */
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == "ifcode")
			{
				parser = look;
			}
			/* Read condition */
			var condition = null;
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["find_ident"]), false);
			var res = parser.parser_expression.constructor.readExpression(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			condition = Runtime.rtl.attr(ctx, res, 1);
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["find_ident"]), true);
			/* Read then */
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "then");
			parser = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			/* Read content */
			var content = "";
			var caret_content = parser.caret;
			var res = parser.parser_base.constructor.readUntilStringArr(ctx, parser, use("Runtime.Vector").from(["#case","#endswitch"]), false);
			parser = Runtime.rtl.attr(ctx, res, 0);
			content = Runtime.rtl.attr(ctx, res, 1);
			/* Look content */
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			var __v1 = use("Bayrell.Lang.OpCodes.OpPreprocessorIfCode");
			var ifcode = new __v1(ctx, use("Runtime.Map").from({"condition":condition,"content":content,"caret_start":caret_content,"caret_end":parser.caret}));
			items.push(ctx, ifcode);
		}
		/* Restore vars */
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), save_vars);
		/* read endswitch */
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "#endswitch");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var __v1 = use("Bayrell.Lang.OpCodes.OpPreprocessorSwitch");
		return use("Runtime.Vector").from([parser,new __v1(ctx, use("Runtime.Map").from({"items":items.toCollection(ctx),"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/**
	 * Read preprocessor ifcode
	 */
	readPreprocessorIfCode: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var caret_start = parser.caret;
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "#ifcode");
		parser = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		/* Read condition */
		var condition = null;
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["find_ident"]), false);
		var res = parser.parser_expression.constructor.readExpression(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		condition = Runtime.rtl.attr(ctx, res, 1);
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["find_ident"]), true);
		/* Read then */
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "then");
		parser = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		/* Read content */
		var content = "";
		var caret_content = parser.caret;
		var res = parser.parser_base.constructor.readUntilStringArr(ctx, parser, use("Runtime.Vector").from(["#endif"]), false);
		parser = Runtime.rtl.attr(ctx, res, 0);
		content = Runtime.rtl.attr(ctx, res, 1);
		/* Match endif */
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "#endif");
		parser = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var __v0 = use("Bayrell.Lang.OpCodes.OpPreprocessorIfCode");
		var ifcode = new __v0(ctx, use("Runtime.Map").from({"condition":condition,"content":content,"caret_start":caret_content,"caret_end":parser.caret}));
		return use("Runtime.Vector").from([parser,ifcode]);
	},
	/**
	 * Read preprocessor ifdef
	 */
	readPreprocessorIfDef: function(ctx, parser, kind)
	{
		if (kind == undefined) kind = "";
		var items = null;
		var token = null;
		var caret_start = parser.caret;
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "#ifdef");
		parser = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		/* Read condition */
		var condition = null;
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["find_ident"]), false);
		var res = parser.parser_expression.constructor.readExpression(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		condition = Runtime.rtl.attr(ctx, res, 1);
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["find_ident"]), true);
		/* Read then */
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "then");
		parser = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var __v0 = use("Bayrell.Lang.OpCodes.OpPreprocessorIfDef");
		var __v1 = use("Bayrell.Lang.OpCodes.OpPreprocessorIfDef");
		var __v2 = use("Bayrell.Lang.OpCodes.OpPreprocessorIfDef");
		var __v3 = use("Bayrell.Lang.OpCodes.OpPreprocessorIfDef");
		if (kind == __v0.KIND_PROGRAM)
		{
			var res = parser.parser_program.constructor.readProgram(ctx, parser, "#endif");
			parser = Runtime.rtl.attr(ctx, res, 0);
			items = Runtime.rtl.attr(ctx, res, 1);
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "#endif");
			parser = Runtime.rtl.attr(ctx, res, 0);
		}
		else if (kind == __v1.KIND_CLASS_BODY)
		{
			var res = parser.parser_program.constructor.readClassBody(ctx, parser, "#endif");
			parser = Runtime.rtl.attr(ctx, res, 0);
			items = Runtime.rtl.attr(ctx, res, 1);
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "#endif");
			parser = Runtime.rtl.attr(ctx, res, 0);
			/*list d = parser.parser_program::classBodyAnalyze(parser, items);
			items = d.item("functions");*/
		}
		else if (kind == __v2.KIND_OPERATOR)
		{
			var res = parser.parser_operator.constructor.readOpItems(ctx, parser, "#endif");
			parser = Runtime.rtl.attr(ctx, res, 0);
			items = Runtime.rtl.attr(ctx, res, 1);
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "#endif");
			parser = Runtime.rtl.attr(ctx, res, 0);
		}
		else if (kind == __v3.KIND_EXPRESSION)
		{
			var res = parser.parser_expression.constructor.readExpression(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			items = Runtime.rtl.attr(ctx, res, 1);
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "#endif");
			parser = Runtime.rtl.attr(ctx, res, 0);
		}
		var __v0 = use("Bayrell.Lang.OpCodes.OpPreprocessorIfDef");
		return use("Runtime.Vector").from([parser,new __v0(ctx, use("Runtime.Map").from({"items":items,"condition":condition,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Bayrell.Lang.LangBay";
	},
	getClassName: function()
	{
		return "Bayrell.Lang.LangBay.ParserBayPreprocessor";
	},
	getParentClassName: function()
	{
		return "";
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
});use.add(Bayrell.Lang.LangBay.ParserBayPreprocessor);
module.exports = Bayrell.Lang.LangBay.ParserBayPreprocessor;