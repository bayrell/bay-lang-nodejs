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
BayLang.LangES6.ParserES6Base = function(ctx, parser)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.parser = parser;
};
BayLang.LangES6.ParserES6Base.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangES6.ParserES6Base.prototype.constructor = BayLang.LangES6.ParserES6Base;
Object.assign(BayLang.LangES6.ParserES6Base.prototype,
{
	/**
	 * Read number
	 */
	readNumber: function(ctx, reader, flag_negative)
	{
		if (flag_negative == undefined) flag_negative = false;
		var caret_start = reader.caret(ctx);
		/* Read number */
		var value = reader.readToken(ctx);
		if (value == "")
		{
			throw caret_start.expected(ctx, "Number")
		}
		var __v0 = use("BayLang.Caret");
		if (!__v0.isNumber(ctx, value))
		{
			throw caret_start.expected(ctx, "Number")
		}
		/* Look dot */
		if (reader.nextToken(ctx) == ".")
		{
			value += use("Runtime.rtl").toStr(reader.readToken(ctx));
			value += use("Runtime.rtl").toStr(reader.readToken(ctx));
		}
		/* Returns op_code */
		var __v0 = use("BayLang.OpCodes.OpNumber");
		return new __v0(ctx, use("Runtime.Map").from({"value":(flag_negative) ? ("-" + use("Runtime.rtl").toStr(value)) : (value),"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
	},
	/**
	 * Read string
	 */
	readString: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		var str_char = reader.readToken(ctx);
		/* Read begin string char */
		if (str_char != "'" && str_char != "\"")
		{
			throw caret_start.expected(ctx, "String")
		}
		/* Read string value */
		var caret = reader.caret(ctx);
		var value_str = "";
		var ch = caret.nextChar(ctx);
		while (!caret.eof(ctx) && ch != str_char)
		{
			if (ch == "\\")
			{
				caret.readChar(ctx);
				if (caret.eof(ctx))
				{
					throw caret.expected(ctx, "End of string")
				}
				var ch2 = caret.readChar(ctx);
				if (ch2 == "n")
				{
					value_str += use("Runtime.rtl").toStr("\n");
				}
				else if (ch2 == "r")
				{
					value_str += use("Runtime.rtl").toStr("\r");
				}
				else if (ch2 == "t")
				{
					value_str += use("Runtime.rtl").toStr("\t");
				}
				else if (ch2 == "s")
				{
					value_str += use("Runtime.rtl").toStr(" ");
				}
				else if (ch2 == "\\")
				{
					value_str += use("Runtime.rtl").toStr("\\");
				}
				else if (ch2 == "'")
				{
					value_str += use("Runtime.rtl").toStr("'");
				}
				else if (ch2 == "\"")
				{
					value_str += use("Runtime.rtl").toStr("\"");
				}
				else
				{
					value_str += use("Runtime.rtl").toStr(ch + use("Runtime.rtl").toStr(ch2));
				}
			}
			else
			{
				value_str += use("Runtime.rtl").toStr(caret.readChar(ctx));
			}
			if (caret.eof(ctx))
			{
				throw caret.expected(ctx, "End of string")
			}
			ch = caret.nextChar(ctx);
		}
		/* Read end string char */
		if (ch != "'" && ch != "\"")
		{
			throw caret.expected(ctx, "End of string")
		}
		/* Restore reader */
		reader.init(ctx, caret);
		/* Returns op_code */
		var __v0 = use("BayLang.OpCodes.OpString");
		return new __v0(ctx, use("Runtime.Map").from({"value":value_str,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
	},
	/**
	 * Read comment
	 */
	readComment: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		var str_char = reader.readToken(ctx);
		/* Read begin coment */
		reader.matchToken(ctx, "/");
		reader.matchToken(ctx, "*");
		/* Read comment value */
		var caret = reader.caret(ctx);
		var value_str = "";
		var ch2 = caret.nextString(ctx, 2);
		while (!caret.eof(ctx) && ch2 != "*/")
		{
			value_str += use("Runtime.rtl").toStr(caret.readChar(ctx));
			if (caret.eof(ctx))
			{
				throw caret.expected(ctx, "End of comment")
			}
			ch2 = caret.nextString(ctx, 2);
		}
		/* Restore reader */
		reader.init(ctx, caret);
		/* Read end coment */
		reader.matchToken(ctx, "*");
		reader.matchToken(ctx, "/");
		/* Returns op_code */
		var __v0 = use("BayLang.OpCodes.OpComment");
		return new __v0(ctx, use("Runtime.Map").from({"value":value_str,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
	},
	/**
	 * Read identifier
	 */
	readIdentifier: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		/* Read identifier */
		var name = reader.readToken(ctx);
		if (!this.constructor.isIdentifier(ctx, name) || this.constructor.isReserved(ctx, name))
		{
			throw reader.expected(ctx, "Identifier")
		}
		/* Returns op_code */
		var __v0 = use("BayLang.OpCodes.OpIdentifier");
		return new __v0(ctx, use("Runtime.Map").from({"value":name,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
	},
	/**
	 * Read entity name
	 */
	readEntityName: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		var items = use("Runtime.Vector").from([]);
		/* Read name */
		items.push(ctx, this.readIdentifier(ctx, reader));
		/* Read names */
		while (reader.nextToken(ctx) == ".")
		{
			reader.readToken(ctx);
			items.push(ctx, this.readIdentifier(ctx, reader));
		}
		/* Returns op_code */
		var __v0 = use("BayLang.OpCodes.OpEntityName");
		return new __v0(ctx, use("Runtime.Map").from({"items":items,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
	},
	/**
	 * Read dynamic identifier
	 */
	readItem: function(ctx, reader)
	{
		var __v0 = use("BayLang.Caret");
		if (__v0.isNumber(ctx, reader.nextToken(ctx)))
		{
			return this.readNumber(ctx, reader);
		}
		return this.readIdentifier(ctx, reader);
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.parser = null;
	},
});
Object.assign(BayLang.LangES6.ParserES6Base, use("Runtime.BaseObject"));
Object.assign(BayLang.LangES6.ParserES6Base,
{
	/**
	 * Returns true if name is identifier
	 */
	isIdentifier: function(ctx, name)
	{
		if (name == "")
		{
			return false;
		}
		var __v0 = use("BayLang.Caret");
		var __v1 = use("Runtime.rs");
		if (__v0.isNumber(ctx, __v1.charAt(ctx, name, 0)))
		{
			return false;
		}
		var __v0 = use("Runtime.rs");
		var sz = __v0.strlen(ctx, name);
		for (var i = 0; i < sz; i++)
		{
			var __v1 = use("Runtime.rs");
			var ch = __v1.charAt(ctx, name, i);
			var __v2 = use("BayLang.Caret");
			var __v3 = use("BayLang.Caret");
			if (__v2.isChar(ctx, ch) || __v3.isNumber(ctx, ch) || ch == "_")
			{
				continue;
			}
			return false;
		}
		return true;
	},
	/**
	 * Returns true if reserved words
	 */
	isReserved: function(ctx, name)
	{
		var __v0 = use("Runtime.rs");
		if (__v0.substr(ctx, name, 0, 3) == "__v")
		{
			return true;
		}
		return false;
	},
	/**
	 * Read collection
	 */
	readCollection: function(ctx, parser)
	{
		var start = parser;
		var look = null;
		var token = null;
		var __v0 = use("Runtime.Vector");
		var values = new __v0(ctx);
		var ifdef_condition = null;
		var flag_ifdef = false;
		var res = this.matchToken(ctx, parser, "[");
		parser = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = token.caret_start;
		var res = this.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		while (!token.eof && token.content != "]")
		{
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == "#ifdef")
			{
				parser = look;
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["find_ident"]), false);
				var res = parser.parser_expression.constructor.readExpression(ctx, parser);
				parser = Runtime.rtl.attr(ctx, res, 0);
				ifdef_condition = Runtime.rtl.attr(ctx, res, 1);
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["find_ident"]), true);
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "then");
				parser = Runtime.rtl.attr(ctx, res, 0);
				token = Runtime.rtl.attr(ctx, res, 1);
				flag_ifdef = true;
			}
			var parser_value = null;
			var res = parser.parser_expression.constructor.readExpression(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			parser_value = Runtime.rtl.attr(ctx, res, 1);
			var res = this.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == ",")
			{
				parser = look;
				var res = this.readToken(ctx, parser);
				look = Runtime.rtl.attr(ctx, res, 0);
				token = Runtime.rtl.attr(ctx, res, 1);
			}
			if (flag_ifdef)
			{
				var __v1 = use("BayLang.OpCodes.OpPreprocessorIfDef");
				parser_value = new __v1(ctx, use("Runtime.Map").from({"items":parser_value,"condition":ifdef_condition}));
			}
			values.push(ctx, parser_value);
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == "#endif")
			{
				parser = look;
				flag_ifdef = false;
				ifdef_condition = null;
			}
			var res = this.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
		}
		var res = this.matchToken(ctx, parser, "]");
		parser = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var __v1 = use("BayLang.OpCodes.OpCollection");
		return use("Runtime.Vector").from([parser,new __v1(ctx, use("Runtime.Map").from({"values":values,"caret_start":caret_start,"caret_end":token.caret_end}))]);
	},
	/**
	 * Read collection
	 */
	readDict: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var __v0 = use("Runtime.Vector");
		var values = new __v0(ctx);
		var ifdef_condition = null;
		var flag_ifdef = false;
		var res = this.matchToken(ctx, parser, "{");
		parser = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = token.caret_start;
		var res = this.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		while (!token.eof && token.content != "}")
		{
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == "#ifdef")
			{
				parser = look;
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["find_ident"]), false);
				var res = parser.parser_expression.constructor.readExpression(ctx, parser);
				parser = Runtime.rtl.attr(ctx, res, 0);
				ifdef_condition = Runtime.rtl.attr(ctx, res, 1);
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["find_ident"]), true);
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "then");
				parser = Runtime.rtl.attr(ctx, res, 0);
				token = Runtime.rtl.attr(ctx, res, 1);
				flag_ifdef = true;
			}
			var parser_value = null;
			var res = this.readString(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			parser_value = Runtime.rtl.attr(ctx, res, 1);
			var key = parser_value.value;
			var res = this.matchToken(ctx, parser, ":");
			parser = Runtime.rtl.attr(ctx, res, 0);
			var res = parser.parser_expression.constructor.readExpression(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			parser_value = Runtime.rtl.attr(ctx, res, 1);
			var res = this.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == ",")
			{
				parser = look;
			}
			var __v1 = use("BayLang.OpCodes.OpDictPair");
			values.push(ctx, new __v1(ctx, use("Runtime.Map").from({"key":key,"value":parser_value,"condition":ifdef_condition})));
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == "#endif")
			{
				parser = look;
				flag_ifdef = false;
				ifdef_condition = null;
			}
			var res = this.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
		}
		var res = this.matchToken(ctx, parser, "}");
		parser = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var __v1 = use("BayLang.OpCodes.OpDict");
		return use("Runtime.Vector").from([parser,new __v1(ctx, use("Runtime.Map").from({"values":values,"caret_start":caret_start,"caret_end":token.caret_end}))]);
	},
	/**
	 * Read fixed
	 */
	readFixed: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var start = parser;
		var caret_start = parser.caret;
		var flag_negative = false;
		var res = this.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "")
		{
			var __v0 = use("BayLang.Exceptions.ParserExpected");
			throw new __v0(ctx, "Identifier", token.caret_start, look.file_name)
		}
		/* Read string */
		if (token.content == "'" || token.content == "\"")
		{
			return this.readString(ctx, parser);
		}
		/* Read Collection */
		if (token.content == "[")
		{
			return this.readCollection(ctx, parser);
		}
		/* Read Dict */
		if (token.content == "{")
		{
			return this.readDict(ctx, parser);
		}
		/* Negative number */
		if (token.content == "-")
		{
			flag_negative = true;
			parser = look;
			var res = this.readToken(ctx, look);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
		}
		/* Read Number */
		if (this.isNumber(ctx, token.content))
		{
			return this.readNumber(ctx, parser, flag_negative);
		}
		return this.readIdentifier(ctx, parser, true);
	},
	/**
	 * Read call args
	 */
	readCallArgs: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var __v0 = use("Runtime.Vector");
		var items = new __v0(ctx);
		var res = this.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "{")
		{
			var res = this.readDict(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			var d = Runtime.rtl.attr(ctx, res, 1);
			items = use("Runtime.Vector").from([d]);
		}
		else if (token.content == "(")
		{
			var res = this.matchToken(ctx, parser, "(");
			parser = Runtime.rtl.attr(ctx, res, 0);
			var res = this.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			while (!token.eof && token.content != ")")
			{
				var parser_value = null;
				var res = parser.parser_expression.constructor.readExpression(ctx, parser);
				parser = Runtime.rtl.attr(ctx, res, 0);
				parser_value = Runtime.rtl.attr(ctx, res, 1);
				items.push(ctx, parser_value);
				var res = this.readToken(ctx, parser);
				look = Runtime.rtl.attr(ctx, res, 0);
				token = Runtime.rtl.attr(ctx, res, 1);
				if (token.content == ",")
				{
					parser = look;
					var res = this.readToken(ctx, parser);
					look = Runtime.rtl.attr(ctx, res, 0);
					token = Runtime.rtl.attr(ctx, res, 1);
				}
			}
			var res = this.matchToken(ctx, parser, ")");
			parser = Runtime.rtl.attr(ctx, res, 0);
		}
		return use("Runtime.Vector").from([parser,items]);
	},
	/**
	 * Read new instance
	 */
	readNew: function(ctx, parser, match_new)
	{
		if (match_new == undefined) match_new = true;
		var look = null;
		var token = null;
		var op_code = null;
		var caret_start = parser.caret;
		var args = use("Runtime.Vector").from([]);
		if (match_new)
		{
			var res = this.matchToken(ctx, parser, "new");
			parser = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			caret_start = token.caret_start;
		}
		var res = this.readTypeIdentifier(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_code = Runtime.rtl.attr(ctx, res, 1);
		var res = this.readToken(ctx, parser);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "(" || token.content == "{")
		{
			var res = this.readCallArgs(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			args = Runtime.rtl.attr(ctx, res, 1);
		}
		var __v0 = use("BayLang.OpCodes.OpNew");
		return use("Runtime.Vector").from([parser,new __v0(ctx, use("Runtime.Map").from({"args":args,"value":op_code,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/**
	 * Read dynamic
	 */
	readDynamic: function(ctx, parser, dynamic_flags)
	{
		if (dynamic_flags == undefined) dynamic_flags = -1;
		var look = null;
		var token = null;
		var parser_items = null;
		var op_code = null;
		var op_code_first = null;
		var is_await = false;
		var is_context_call = true;
		var caret_start = null;
		/* Dynamic flags */
		var flag_call = 1;
		var flag_attr = 2;
		var flag_static = 4;
		var flag_dynamic = 8;
		var f_next = (ctx, s) =>
		{
			if ((dynamic_flags & 1) == 1)
			{
				if (s == "{" || s == "(" || s == "@")
				{
					return true;
				}
			}
			if ((dynamic_flags & 2) == 2)
			{
				if (s == ".")
				{
					return true;
				}
			}
			if ((dynamic_flags & 4) == 4)
			{
				if (s == "::")
				{
					return true;
				}
			}
			if ((dynamic_flags & 8) == 8)
			{
				if (s == "[")
				{
					return true;
				}
			}
			return false;
		};
		var res = this.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "await")
		{
			caret_start = token.caret_start;
			is_await = true;
			parser = look;
		}
		var res = this.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "@")
		{
			var res = this.readToken(ctx, look);
			var look2 = Runtime.rtl.attr(ctx, res, 0);
			var token2 = Runtime.rtl.attr(ctx, res, 1);
			if (!f_next(ctx, token2.content))
			{
				if (this.isIdentifier(ctx, token2.content))
				{
					parser = look;
					is_context_call = false;
				}
			}
		}
		var res = this.readBaseItem(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_code = Runtime.rtl.attr(ctx, res, 1);
		op_code_first = op_code;
		if (caret_start == null)
		{
			caret_start = op_code.caret_start;
		}
		var __v0 = use("BayLang.OpCodes.OpIdentifier");
		var __v1 = use("BayLang.OpCodes.OpIdentifier");
		var __v2 = use("BayLang.OpCodes.OpIdentifier");
		if (op_code instanceof __v0 && (op_code.kind == __v1.KIND_CONTEXT || op_code.kind == __v2.KIND_SYS_FUNCTION))
		{
			is_context_call = false;
		}
		var res = this.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (f_next(ctx, token.content))
		{
			var __v0 = use("BayLang.OpCodes.OpIdentifier");
			var __v1 = use("BayLang.OpCodes.OpNew");
			var __v2 = use("BayLang.OpCodes.OpCollection");
			var __v3 = use("BayLang.OpCodes.OpDict");
			if (op_code instanceof __v0)
			{
				var __v1 = use("BayLang.OpCodes.OpIdentifier");
				var __v2 = use("BayLang.OpCodes.OpIdentifier");
				var __v3 = use("BayLang.OpCodes.OpIdentifier");
				var __v4 = use("BayLang.OpCodes.OpIdentifier");
				var __v5 = use("BayLang.OpCodes.OpIdentifier");
				var __v6 = use("BayLang.OpCodes.OpIdentifier");
				if (parser.find_ident && op_code.kind != __v1.KIND_SYS_TYPE && op_code.kind != __v2.KIND_SYS_FUNCTION && op_code.kind != __v3.KIND_VARIABLE && op_code.kind != __v4.KIND_CLASS && op_code.kind != __v5.KIND_CLASSREF && op_code.kind != __v6.KIND_CONTEXT)
				{
					var __v7 = use("BayLang.Exceptions.ParserExpected");
					throw new __v7(ctx, "Module or variable '" + use("Runtime.rtl").toStr(op_code.value) + use("Runtime.rtl").toStr("'"), op_code.caret_start, parser.file_name)
				}
			}
			else if (op_code instanceof __v1 || op_code instanceof __v2 || op_code instanceof __v3)
			{
			}
			else
			{
				var __v4 = use("BayLang.Exceptions.ParserExpected");
				throw new __v4(ctx, "Module or variable", op_code.caret_start, parser.file_name)
			}
		}
		/* If is pipe */
		var __v0 = use("BayLang.OpCodes.OpIdentifier");
		if (parser.is_pipe && op_code instanceof __v0)
		{
			var __v1 = use("BayLang.OpCodes.OpAttr");
			var __v2 = use("BayLang.OpCodes.OpIdentifier");
			var __v3 = use("BayLang.OpCodes.OpIdentifier");
			op_code = new __v1(ctx, use("Runtime.Map").from({"kind":parser.pipe_kind,"obj":new __v2(ctx, use("Runtime.Map").from({"kind":__v3.KIND_PIPE,"caret_start":op_code.caret_start,"caret_end":op_code.caret_end})),"value":op_code,"caret_start":op_code.caret_start,"caret_end":op_code.caret_end}));
		}
		while (!token.eof && f_next(ctx, token.content))
		{
			var token_content = token.content;
			/* Static call */
			if (token_content == "(" || token_content == "{" || token_content == "@")
			{
				if ((dynamic_flags & flag_call) != flag_call)
				{
					var __v0 = use("BayLang.Exceptions.ParserError");
					throw new __v0(ctx, "Call are not allowed", token.caret_start, parser.file_name)
				}
				if (token_content == "@")
				{
					parser = look;
					is_context_call = false;
				}
				var res = this.readCallArgs(ctx, parser);
				parser = Runtime.rtl.attr(ctx, res, 0);
				parser_items = Runtime.rtl.attr(ctx, res, 1);
				var __v0 = use("BayLang.OpCodes.OpCall");
				op_code = new __v0(ctx, use("Runtime.Map").from({"obj":op_code,"args":parser_items,"caret_start":caret_start,"caret_end":parser.caret,"is_await":is_await,"is_context":is_context_call}));
				is_context_call = true;
			}
			else if (token_content == "." || token_content == "::" || token_content == "[")
			{
				var kind = "";
				var look_values = null;
				var look_value = null;
				parser = look;
				is_context_call = true;
				if (token_content == ".")
				{
					var __v1 = use("BayLang.OpCodes.OpAttr");
					kind = __v1.KIND_ATTR;
					if ((dynamic_flags & flag_attr) != flag_attr)
					{
						var __v2 = use("BayLang.Exceptions.ParserError");
						throw new __v2(ctx, "Attr are not allowed", token.caret_start, parser.file_name)
					}
				}
				else if (token_content == "::")
				{
					var __v2 = use("BayLang.OpCodes.OpAttr");
					kind = __v2.KIND_STATIC;
					if ((dynamic_flags & flag_static) != flag_static)
					{
						var __v3 = use("BayLang.Exceptions.ParserError");
						throw new __v3(ctx, "Static attr are not allowed", token.caret_start, parser.file_name)
					}
				}
				else if (token_content == "[")
				{
					var __v3 = use("BayLang.OpCodes.OpAttr");
					kind = __v3.KIND_DYNAMIC;
					if ((dynamic_flags & flag_dynamic) != flag_dynamic)
					{
						var __v4 = use("BayLang.Exceptions.ParserError");
						throw new __v4(ctx, "Dynamic attr are not allowed", token.caret_start, parser.file_name)
					}
				}
				if (token_content == "[")
				{
					var res = parser.parser_expression.constructor.readExpression(ctx, parser);
					parser = Runtime.rtl.attr(ctx, res, 0);
					look_value = Runtime.rtl.attr(ctx, res, 1);
					var res = this.readToken(ctx, parser);
					look = Runtime.rtl.attr(ctx, res, 0);
					token = Runtime.rtl.attr(ctx, res, 1);
					if (token.content == ",")
					{
						var __v1 = use("Runtime.Vector");
						look_values = new __v1(ctx);
						look_values.push(ctx, look_value);
					}
					while (token.content == ",")
					{
						parser = look;
						var res = parser.parser_expression.constructor.readExpression(ctx, parser);
						parser = Runtime.rtl.attr(ctx, res, 0);
						look_value = Runtime.rtl.attr(ctx, res, 1);
						look_values.push(ctx, look_value);
						var res = this.readToken(ctx, parser);
						look = Runtime.rtl.attr(ctx, res, 0);
						token = Runtime.rtl.attr(ctx, res, 1);
					}
					var res = this.matchToken(ctx, parser, "]");
					parser = Runtime.rtl.attr(ctx, res, 0);
					if (look_values != null)
					{
						var __v1 = use("BayLang.OpCodes.OpAttr");
						kind = __v1.KIND_DYNAMIC_ATTRS;
					}
				}
				else
				{
					var res = this.readToken(ctx, parser);
					look = Runtime.rtl.attr(ctx, res, 0);
					token = Runtime.rtl.attr(ctx, res, 1);
					if (token.content == "@")
					{
						parser = look;
						is_context_call = false;
					}
					var res = this.readIdentifier(ctx, parser);
					parser = Runtime.rtl.attr(ctx, res, 0);
					look_value = Runtime.rtl.attr(ctx, res, 1);
				}
				var __v1 = use("BayLang.OpCodes.OpAttr");
				op_code = new __v1(ctx, use("Runtime.Map").from({"kind":kind,"obj":op_code,"attrs":(look_values != null) ? (look_values) : (null),"value":(look_values == null) ? (look_value) : (null),"caret_start":caret_start,"caret_end":parser.caret}));
			}
			else
			{
				var __v2 = use("BayLang.Exceptions.ParserExpected");
				throw new __v2(ctx, "Next attr", token.caret_start, parser.file_name)
			}
			var res = this.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			var __v0 = use("BayLang.OpCodes.OpAttr");
			var __v1 = use("BayLang.OpCodes.OpAttr");
			if (op_code instanceof __v0 && op_code.kind == __v1.KIND_PIPE && token.content != "(" && token.content != "{")
			{
				var __v2 = use("BayLang.Exceptions.ParserExpected");
				throw new __v2(ctx, "Call", token.caret_start, parser.file_name)
			}
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangES6";
	},
	getClassName: function()
	{
		return "BayLang.LangES6.ParserES6Base";
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
});use.add(BayLang.LangES6.ParserES6Base);
module.exports = BayLang.LangES6.ParserES6Base;