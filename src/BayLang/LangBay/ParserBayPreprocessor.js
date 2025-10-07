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
BayLang.LangBay.ParserBayPreprocessor = function()
{
};
Object.assign(BayLang.LangBay.ParserBayPreprocessor.prototype,
{
});
Object.assign(BayLang.LangBay.ParserBayPreprocessor,
{
	/**
	 * Read namespace
	 */
	readPreprocessor: function(parser)
	{
		var start = parser;
		var look = null;
		var token = null;
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "#switch")
		{
			return this.readPreprocessorSwitch(start);
		}
		if (token.content == "#ifcode")
		{
			return this.readPreprocessorIfCode(start);
		}
		return null;
	},
	/**
	 * Read preprocessor switch
	 */
	readPreprocessorSwitch: function(parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var __v0 = use("Runtime.Vector");
		var items = new __v0();
		/* Save vars */
		var save_vars = parser.vars;
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["vars"]), parser.vars.concat(use("Runtime.Map").from({"ES6":true,"NODEJS":true,"JAVASCRIPT":true,"PHP":true,"PYTHON3":true})));
		var res = parser.parser_base.constructor.matchToken(parser, "#switch");
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		while (token.content == "#case")
		{
			parser = look;
			/* Skip ifcode */
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			if (token.content == "ifcode")
			{
				parser = look;
			}
			/* Read condition */
			var condition = null;
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["find_ident"]), false);
			var res = parser.parser_expression.constructor.readExpression(parser);
			parser = Runtime.rtl.attr(res, 0);
			condition = Runtime.rtl.attr(res, 1);
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["find_ident"]), true);
			/* Read then */
			var res = parser.parser_base.constructor.matchToken(parser, "then");
			parser = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			/* Read content */
			var content = "";
			var caret_content = parser.caret;
			var res = parser.parser_base.constructor.readUntilStringArr(parser, use("Runtime.Vector").from(["#case","#endswitch"]), false);
			parser = Runtime.rtl.attr(res, 0);
			content = Runtime.rtl.attr(res, 1);
			/* Look content */
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			var __v1 = use("BayLang.OpCodes.OpPreprocessorIfCode");
			var ifcode = new __v1(use("Runtime.Map").from({"condition":condition,"content":content,"caret_start":caret_content,"caret_end":parser.caret}));
			items.push(ifcode);
		}
		/* Restore vars */
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["vars"]), save_vars);
		/* read endswitch */
		var res = parser.parser_base.constructor.matchToken(parser, "#endswitch");
		parser = Runtime.rtl.attr(res, 0);
		var __v2 = use("BayLang.OpCodes.OpPreprocessorSwitch");
		return use("Runtime.Vector").from([parser,new __v2(use("Runtime.Map").from({"items":items,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/**
	 * Read preprocessor ifcode
	 */
	readPreprocessorIfCode: function(parser)
	{
		var look = null;
		var token = null;
		var caret_start = parser.caret;
		var res = parser.parser_base.constructor.matchToken(parser, "#ifcode");
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		/* Read condition */
		var condition = null;
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["find_ident"]), false);
		var res = parser.parser_expression.constructor.readExpression(parser);
		parser = Runtime.rtl.attr(res, 0);
		condition = Runtime.rtl.attr(res, 1);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["find_ident"]), true);
		/* Read then */
		var res = parser.parser_base.constructor.matchToken(parser, "then");
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		/* Read content */
		var content = "";
		var caret_content = parser.caret;
		var res = parser.parser_base.constructor.readUntilStringArr(parser, use("Runtime.Vector").from(["#endif"]), false);
		parser = Runtime.rtl.attr(res, 0);
		content = Runtime.rtl.attr(res, 1);
		/* Match endif */
		var res = parser.parser_base.constructor.matchToken(parser, "#endif");
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var __v0 = use("BayLang.OpCodes.OpPreprocessorIfCode");
		var ifcode = new __v0(use("Runtime.Map").from({"condition":condition,"content":content,"caret_start":caret_content,"caret_end":parser.caret}));
		return use("Runtime.Vector").from([parser,ifcode]);
	},
	/**
	 * Read preprocessor ifdef
	 */
	readPreprocessorIfDef: function(parser, kind)
	{
		if (kind == undefined) kind = "";
		var items = null;
		var token = null;
		var caret_start = parser.caret;
		var res = parser.parser_base.constructor.matchToken(parser, "#ifdef");
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		/* Read condition */
		var condition = null;
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["find_ident"]), false);
		var res = parser.parser_expression.constructor.readExpression(parser);
		parser = Runtime.rtl.attr(res, 0);
		condition = Runtime.rtl.attr(res, 1);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["find_ident"]), true);
		/* Read then */
		var res = parser.parser_base.constructor.matchToken(parser, "then");
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var __v0 = use("BayLang.OpCodes.OpPreprocessorIfDef");
		var __v1 = use("BayLang.OpCodes.OpPreprocessorIfDef");
		var __v2 = use("BayLang.OpCodes.OpPreprocessorIfDef");
		var __v3 = use("BayLang.OpCodes.OpPreprocessorIfDef");
		if (kind == __v0.KIND_PROGRAM)
		{
			var res = parser.parser_program.constructor.readProgram(parser, "#endif");
			parser = Runtime.rtl.attr(res, 0);
			items = Runtime.rtl.attr(res, 1);
			var res = parser.parser_base.constructor.matchToken(parser, "#endif");
			parser = Runtime.rtl.attr(res, 0);
		}
		else if (kind == __v1.KIND_CLASS_BODY)
		{
			var res = parser.parser_program.constructor.readClassBody(parser, "#endif");
			parser = Runtime.rtl.attr(res, 0);
			items = Runtime.rtl.attr(res, 1);
			var res = parser.parser_base.constructor.matchToken(parser, "#endif");
			parser = Runtime.rtl.attr(res, 0);
			/*list d = parser.parser_program::classBodyAnalyze(parser, items);
			items = d.item("functions");*/
		}
		else if (kind == __v2.KIND_OPERATOR)
		{
			var res = parser.parser_operator.constructor.readOpItems(parser, "#endif");
			parser = Runtime.rtl.attr(res, 0);
			items = Runtime.rtl.attr(res, 1);
			var res = parser.parser_base.constructor.matchToken(parser, "#endif");
			parser = Runtime.rtl.attr(res, 0);
		}
		else if (kind == __v3.KIND_EXPRESSION)
		{
			var res = parser.parser_expression.constructor.readExpression(parser);
			parser = Runtime.rtl.attr(res, 0);
			items = Runtime.rtl.attr(res, 1);
			var res = parser.parser_base.constructor.matchToken(parser, "#endif");
			parser = Runtime.rtl.attr(res, 0);
		}
		var __v4 = use("BayLang.OpCodes.OpPreprocessorIfDef");
		return use("Runtime.Vector").from([parser,new __v4(use("Runtime.Map").from({"items":items,"condition":condition,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.LangBay.ParserBayPreprocessor";
	},
	getParentClassName: function()
	{
		return "";
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
});use.add(BayLang.LangBay.ParserBayPreprocessor);
module.exports = BayLang.LangBay.ParserBayPreprocessor;