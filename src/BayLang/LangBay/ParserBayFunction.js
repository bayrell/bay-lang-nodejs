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
BayLang.LangBay.ParserBayFunction = function(ctx, parser)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.parser = parser;
};
BayLang.LangBay.ParserBayFunction.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangBay.ParserBayFunction.prototype.constructor = BayLang.LangBay.ParserBayFunction;
Object.assign(BayLang.LangBay.ParserBayFunction.prototype,
{
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
		/* Find identifier */
		var __v0 = use("BayLang.OpCodes.OpTypeIdentifier");
		if (pattern instanceof __v0)
		{
			pattern = pattern.entity_name.items.last(ctx);
		}
		this.parser.findVariable(ctx, pattern);
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
		return new __v0(ctx, use("Runtime.Map").from({"args":args,"obj":pattern,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.parser = null;
	},
});
Object.assign(BayLang.LangBay.ParserBayFunction, use("Runtime.BaseObject"));
Object.assign(BayLang.LangBay.ParserBayFunction,
{
	/**
	 * Read flags
	 */
	readFlags: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var __v0 = use("Runtime.Map");
		var values = new __v0(ctx);
		var __v1 = use("BayLang.OpCodes.OpFlags");
		var current_flags = __v1.getFlags(ctx);
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		while (!token.eof && current_flags.indexOf(ctx, token.content) >= 0)
		{
			var flag = token.content;
			values.set(ctx, "p_" + use("Runtime.rtl").toStr(flag), true);
			parser = look;
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
		}
		var __v2 = use("BayLang.OpCodes.OpFlags");
		return use("Runtime.Vector").from([parser,new __v2(ctx, values)]);
	},
	/**
	 * Read function args
	 */
	readDeclareFunctionArgs: function(ctx, parser, find_ident, flag_match)
	{
		if (find_ident == undefined) find_ident = true;
		if (flag_match == undefined) flag_match = true;
		var res = null;
		var look = null;
		var token = null;
		var __v0 = use("Runtime.Vector");
		var items = new __v0(ctx);
		if (flag_match)
		{
			res = parser.parser_base.constructor.matchToken(ctx, parser, "(");
			parser = Runtime.rtl.attr(ctx, res, 0);
		}
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		while (!token.eof && token.content != ")")
		{
			var arg_value = null;
			var arg_pattern = null;
			var arg_expression = null;
			var arg_start = parser;
			/* Arg type */
			var res = parser.parser_base.constructor.readTypeIdentifier(ctx, parser, find_ident);
			parser = Runtime.rtl.attr(ctx, res, 0);
			arg_pattern = Runtime.rtl.attr(ctx, res, 1);
			/* Arg name */
			var res = parser.parser_base.constructor.readIdentifier(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			arg_value = Runtime.rtl.attr(ctx, res, 1);
			var arg_name = arg_value.value;
			/* Arg expression */
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == "=")
			{
				parser = look;
				var save_vars = parser.vars;
				var __v1 = use("Runtime.Dict");
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), new __v1(ctx));
				var res = parser.parser_expression.constructor.readExpression(ctx, parser);
				parser = Runtime.rtl.attr(ctx, res, 0);
				arg_expression = Runtime.rtl.attr(ctx, res, 1);
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), save_vars);
			}
			/* Register variable in parser */
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), parser.vars.setIm(ctx, arg_name, true));
			var __v1 = use("BayLang.OpCodes.OpDeclareFunctionArg");
			items.push(ctx, new __v1(ctx, use("Runtime.Map").from({"pattern":arg_pattern,"name":arg_name,"expression":arg_expression,"caret_start":arg_pattern.caret_start,"caret_end":parser.caret})));
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == ",")
			{
				parser = look;
				var res = parser.parser_base.constructor.readToken(ctx, parser);
				look = Runtime.rtl.attr(ctx, res, 0);
				token = Runtime.rtl.attr(ctx, res, 1);
			}
		}
		if (flag_match)
		{
			res = parser.parser_base.constructor.matchToken(ctx, parser, ")");
			parser = Runtime.rtl.attr(ctx, res, 0);
		}
		return use("Runtime.Vector").from([parser,items]);
	},
	/**
	 * Read function variables
	 */
	readDeclareFunctionUse: function(ctx, parser, vars, find_ident)
	{
		if (vars == undefined) vars = null;
		if (find_ident == undefined) find_ident = true;
		var look = null;
		var token = null;
		var __v0 = use("Runtime.Vector");
		var items = new __v0(ctx);
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "use")
		{
			parser = look;
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "(");
			parser = Runtime.rtl.attr(ctx, res, 0);
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			while (!token.eof && token.content != ")")
			{
				var ident = null;
				var res = parser.parser_base.constructor.readIdentifier(ctx, parser);
				parser = Runtime.rtl.attr(ctx, res, 0);
				ident = Runtime.rtl.attr(ctx, res, 1);
				var name = ident.value;
				if (vars != null && find_ident)
				{
					if (!vars.has(ctx, name))
					{
						var __v1 = use("BayLang.Exceptions.ParserError");
						throw new __v1(ctx, "Unknown identifier '" + use("Runtime.rtl").toStr(name) + use("Runtime.rtl").toStr("'"), ident.caret_start, parser.file_name)
					}
				}
				items.push(ctx, name);
				var res = parser.parser_base.constructor.readToken(ctx, parser);
				look = Runtime.rtl.attr(ctx, res, 0);
				token = Runtime.rtl.attr(ctx, res, 1);
				if (token.content == ",")
				{
					parser = look;
					var res = parser.parser_base.constructor.readToken(ctx, parser);
					look = Runtime.rtl.attr(ctx, res, 0);
					token = Runtime.rtl.attr(ctx, res, 1);
				}
			}
			var res = parser.parser_base.constructor.matchToken(ctx, parser, ")");
			parser = Runtime.rtl.attr(ctx, res, 0);
		}
		return use("Runtime.Vector").from([parser,items]);
	},
	/**
	 * Read function
	 */
	readDeclareFunction: function(ctx, parser, has_name)
	{
		if (has_name == undefined) has_name = true;
		var look = null;
		var parser_value = null;
		var op_code = null;
		var token = null;
		var flags = null;
		/* Clear vars */
		var save_is_html = parser.is_html;
		var save_vars = parser.vars;
		var __v0 = use("Runtime.Dict");
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), new __v0(ctx));
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["is_html"]), false);
		var is_html = false;
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "async")
		{
			parser = look;
			var __v1 = use("BayLang.OpCodes.OpFlags");
			flags = new __v1(ctx, use("Runtime.Map").from({"p_async":true}));
		}
		var res = parser.parser_base.constructor.readTypeIdentifier(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		parser_value = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = parser_value.caret_start;
		var result_type = parser_value;
		var expression = null;
		var is_context = true;
		var name = "";
		var __v1 = use("BayLang.OpCodes.OpTypeIdentifier");
		var __v2 = use("BayLang.OpCodes.OpEntityName");
		if (result_type && result_type instanceof __v1 && result_type.entity_name instanceof __v2)
		{
			if (result_type.entity_name.names.get(ctx, 0) == "html")
			{
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["is_html"]), true);
				is_html = true;
			}
		}
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "@")
		{
			is_context = false;
			parser = look;
		}
		if (has_name)
		{
			var res = parser.parser_base.constructor.readIdentifier(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			parser_value = Runtime.rtl.attr(ctx, res, 1);
			var name = parser_value.value;
		}
		/* Read function arguments */
		var args = null;
		var res = this.readDeclareFunctionArgs(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		args = Runtime.rtl.attr(ctx, res, 1);
		/* Read function variables */
		var vars = null;
		var res = this.readDeclareFunctionUse(ctx, parser, save_vars);
		parser = Runtime.rtl.attr(ctx, res, 0);
		vars = Runtime.rtl.attr(ctx, res, 1);
		/* Add variables */
		vars.each(ctx, (ctx, name) =>
		{
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), parser.vars.setIm(ctx, name, true));
		});
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "=>")
		{
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "=>");
			parser = Runtime.rtl.attr(ctx, res, 0);
			var res = parser.parser_expression.constructor.readExpression(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			expression = Runtime.rtl.attr(ctx, res, 1);
			op_code = null;
		}
		else if (token.content == "{")
		{
			var save = parser;
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "{");
			parser = Runtime.rtl.attr(ctx, res, 0);
			var res = this.readOperators(ctx, save);
			parser = Runtime.rtl.attr(ctx, res, 0);
			op_code = Runtime.rtl.attr(ctx, res, 1);
			if (is_html)
			{
				expression = op_code;
				op_code = null;
			}
		}
		else if (token.content == ";")
		{
			var res = parser.parser_base.constructor.matchToken(ctx, parser, ";");
			parser = Runtime.rtl.attr(ctx, res, 0);
			expression = null;
			op_code = null;
		}
		/* Restore vars */
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), save_vars);
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["is_html"]), save_is_html);
		var __v1 = use("BayLang.OpCodes.OpDeclareFunction");
		return use("Runtime.Vector").from([parser,new __v1(ctx, use("Runtime.Map").from({"args":args,"vars":vars,"flags":flags,"name":name,"is_html":is_html,"is_context":is_context,"result_type":result_type,"expression":expression,"items":op_code,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/**
	 * Returns true if next is function
	 */
	tryReadFunction: function(ctx, parser, has_name, flags)
	{
		if (has_name == undefined) has_name = true;
		if (flags == undefined) flags = null;
		var look = null;
		var parser_value = null;
		var token = null;
		/* Clear vars */
		var save_vars = parser.vars;
		var __v0 = use("Runtime.Dict");
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), new __v0(ctx));
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["find_ident"]), false);
		var res = false;
		var __v1 = use("BayLang.Exceptions.ParserExpected");
		try
		{
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == "async")
			{
				parser = look;
			}
			var res = parser.parser_base.constructor.readTypeIdentifier(ctx, parser, false);
			parser = Runtime.rtl.attr(ctx, res, 0);
			parser_value = Runtime.rtl.attr(ctx, res, 1);
			var caret_start = parser_value.caret_start;
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == "@")
			{
				parser = look;
			}
			if (has_name)
			{
				var res = parser.parser_base.constructor.readIdentifier(ctx, parser);
				parser = Runtime.rtl.attr(ctx, res, 0);
			}
			var res = this.readDeclareFunctionArgs(ctx, parser, false);
			parser = Runtime.rtl.attr(ctx, res, 0);
			var res = this.readDeclareFunctionUse(ctx, parser, null, false);
			parser = Runtime.rtl.attr(ctx, res, 0);
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (flags != null && flags.p_declare || parser.current_class_abstract || parser.current_class_declare || parser.current_class_kind == "interface")
			{
				if (token.content != ";")
				{
					var __v1 = use("BayLang.Exceptions.ParserExpected");
					throw new __v1(ctx, "Function", caret_start, parser.file_name)
				}
			}
			else if (token.content != "=>" && token.content != "{")
			{
				var __v1 = use("BayLang.Exceptions.ParserExpected");
				throw new __v1(ctx, "Function", caret_start, parser.file_name)
			}
			res = true;
		}
		catch (_ex)
		{
			if (_ex instanceof __v1)
			{
				var e = _ex;
				
				res = false;
			}
			else
			{
				throw _ex;
			}
		}
		/* Restore vars */
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), save_vars);
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["find_ident"]), true);
		return res;
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.LangBay.ParserBayFunction";
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
});use.add(BayLang.LangBay.ParserBayFunction);
module.exports = BayLang.LangBay.ParserBayFunction;