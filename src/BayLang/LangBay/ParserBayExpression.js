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
BayLang.LangBay.ParserBayExpression = function()
{
};
Object.assign(BayLang.LangBay.ParserBayExpression.prototype,
{
});
Object.assign(BayLang.LangBay.ParserBayExpression,
{
	/**
	 * Read negative
	 */
	readNegative: function(parser)
	{
		var look = null;
		var token = null;
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		if (token.content == "-")
		{
			var op_code = null;
			var res = parser.parser_base.constructor.readDynamic(look);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
			var __v0 = use("BayLang.OpCodes.OpNegative");
			return use("Runtime.Vector").from([parser,new __v0(use("Runtime.Map").from({"value":op_code,"caret_start":caret_start,"caret_end":parser.caret}))]);
		}
		return parser.parser_base.constructor.readDynamic(parser);
	},
	/**
	 * Read bit not
	 */
	readBitNot: function(parser)
	{
		var look = null;
		var token = null;
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		if (token.content == "!")
		{
			var op_code = null;
			var res = this.readNegative(look);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			return use("Runtime.Vector").from([parser,new __v0(use("Runtime.Map").from({"value1":op_code,"math":"!","caret_start":caret_start,"caret_end":parser.caret}))]);
		}
		return this.readNegative(parser);
	},
	/**
	 * Read bit shift
	 */
	readBitShift: function(parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readBitNot(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		while (!token.eof && (token.content == ">>" || token.content == "<<"))
		{
			math = token.content;
			var res = this.readBitNot(look);
			look = Runtime.rtl.attr(res, 0);
			look_value = Runtime.rtl.attr(res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read bit and
	 */
	readBitAnd: function(parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readBitShift(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		while (!token.eof && token.content == "&")
		{
			math = token.content;
			var res = this.readBitShift(look);
			look = Runtime.rtl.attr(res, 0);
			look_value = Runtime.rtl.attr(res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read bit or
	 */
	readBitOr: function(parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readBitAnd(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		while (!token.eof && (token.content == "|" || token.content == "xor"))
		{
			math = token.content;
			var res = this.readBitAnd(look);
			look = Runtime.rtl.attr(res, 0);
			look_value = Runtime.rtl.attr(res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read factor
	 */
	readFactor: function(parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readBitOr(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		while (!token.eof && (token.content == "*" || token.content == "/" || token.content == "%" || token.content == "div" || token.content == "mod"))
		{
			math = token.content;
			var res = this.readBitOr(look);
			look = Runtime.rtl.attr(res, 0);
			look_value = Runtime.rtl.attr(res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read arithmetic
	 */
	readArithmetic: function(parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readFactor(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		while (!token.eof && (token.content == "+" || token.content == "-"))
		{
			math = token.content;
			var res = this.readFactor(look);
			look = Runtime.rtl.attr(res, 0);
			look_value = Runtime.rtl.attr(res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read concat
	 */
	readConcat: function(parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readArithmetic(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		while (!token.eof && token.content == "~")
		{
			math = token.content;
			var res = this.readArithmetic(look);
			look = Runtime.rtl.attr(res, 0);
			look_value = Runtime.rtl.attr(res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read compare
	 */
	readCompare: function(parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readConcat(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		var caret_start = op_code.caret_start;
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var content = token.content;
		if (content == "===" || content == "!==" || content == "==" || content == "!=" || content == ">=" || content == "<=" || content == ">" || content == "<")
		{
			var math = token.content;
			var res = this.readConcat(look);
			look = Runtime.rtl.attr(res, 0);
			look_value = Runtime.rtl.attr(res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":parser.caret}));
			parser = look;
		}
		else if (content == "is" || content == "implements" || content == "instanceof")
		{
			var math = token.content;
			var res = parser.parser_base.constructor.readTypeIdentifier(look);
			look = Runtime.rtl.attr(res, 0);
			look_value = Runtime.rtl.attr(res, 1);
			var __v1 = use("BayLang.OpCodes.OpMath");
			op_code = new __v1(use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":parser.caret}));
			parser = look;
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read not
	 */
	readNot: function(parser)
	{
		var look = null;
		var token = null;
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		if (token.content == "not")
		{
			var op_code = null;
			var start = parser;
			var res = this.readCompare(look);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			return use("Runtime.Vector").from([parser,new __v0(use("Runtime.Map").from({"value1":op_code,"math":"not","caret_start":caret_start,"caret_end":parser.caret}))]);
		}
		return this.readCompare(parser);
	},
	/**
	 * Read and
	 */
	readAnd: function(parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readNot(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		while (!token.eof && (token.content == "and" || token.content == "&&"))
		{
			math = token.content;
			var res = this.readNot(look);
			look = Runtime.rtl.attr(res, 0);
			look_value = Runtime.rtl.attr(res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":"and","caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read or
	 */
	readOr: function(parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readAnd(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		while (!token.eof && (token.content == "or" || token.content == "||"))
		{
			math = token.content;
			var res = this.readAnd(look);
			look = Runtime.rtl.attr(res, 0);
			look_value = Runtime.rtl.attr(res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":"or","caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read element
	 */
	readElement: function(parser)
	{
		/* Try to read function */
		if (parser.parser_operator.constructor.tryReadFunction(parser, false))
		{
			return parser.parser_operator.constructor.readDeclareFunction(parser, false);
		}
		return this.readOr(parser);
	},
	/**
	 * Read ternary operation
	 */
	readTernary: function(parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var condition = null;
		var if_true = null;
		var if_false = null;
		var res = this.readElement(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		var caret_start = op_code.caret_start;
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "?")
		{
			condition = op_code;
			var res = this.readExpression(look);
			parser = Runtime.rtl.attr(res, 0);
			if_true = Runtime.rtl.attr(res, 1);
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			if (token.content == ":")
			{
				var res = this.readExpression(look);
				parser = Runtime.rtl.attr(res, 0);
				if_false = Runtime.rtl.attr(res, 1);
			}
			var __v0 = use("BayLang.OpCodes.OpTernary");
			op_code = new __v0(use("Runtime.Map").from({"condition":condition,"if_true":if_true,"if_false":if_false,"caret_start":caret_start,"caret_end":parser.caret}));
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read pipe
	 */
	ExpressionPipe: function(parser)
	{
		var look = null;
		var look_token = null;
		var op_code = null;
		var is_next_attr = false;
		var save_is_pipe = parser.is_pipe;
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["is_pipe"]), false);
		var res = this.readTernary(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		var caret_start = op_code.caret_start;
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["is_pipe"]), save_is_pipe);
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		look_token = Runtime.rtl.attr(res, 1);
		if (look_token.content == "|>")
		{
			while (look_token.content == "|>" || look_token.content == ",")
			{
				parser = look;
				var value = null;
				var kind = "";
				var is_async = false;
				var is_monad = false;
				if (look_token.content == ",")
				{
					is_next_attr = true;
				}
				var res = parser.parser_base.constructor.readToken(parser);
				look = Runtime.rtl.attr(res, 0);
				look_token = Runtime.rtl.attr(res, 1);
				if (look_token.content == "await")
				{
					is_async = true;
					parser = look;
					var res = parser.parser_base.constructor.readToken(parser);
					look = Runtime.rtl.attr(res, 0);
					look_token = Runtime.rtl.attr(res, 1);
				}
				if (look_token.content == "monad")
				{
					is_monad = true;
					parser = look;
					var res = parser.parser_base.constructor.readToken(parser);
					look = Runtime.rtl.attr(res, 0);
					look_token = Runtime.rtl.attr(res, 1);
				}
				if (look_token.content == "attr")
				{
					parser = look;
					var res = this.readTernary(parser);
					parser = Runtime.rtl.attr(res, 0);
					value = Runtime.rtl.attr(res, 1);
					var __v0 = use("BayLang.OpCodes.OpPipe");
					kind = __v0.KIND_ATTR;
				}
				else if (look_token.content == "\"" || look_token.content == "'")
				{
					var res = this.readTernary(parser);
					parser = Runtime.rtl.attr(res, 0);
					value = Runtime.rtl.attr(res, 1);
					var __v1 = use("BayLang.OpCodes.OpPipe");
					kind = __v1.KIND_ATTR;
				}
				else if (look_token.content == "{")
				{
					parser = look;
					var res = this.readTernary(parser);
					parser = Runtime.rtl.attr(res, 0);
					value = Runtime.rtl.attr(res, 1);
					var __v2 = use("BayLang.OpCodes.OpPipe");
					kind = __v2.KIND_ATTR;
					var res = parser.parser_base.constructor.matchToken(parser, "}");
					parser = Runtime.rtl.attr(res, 0);
				}
				else if (is_next_attr)
				{
					var __v3 = use("BayLang.Exceptions.ParserExpected");
					throw new __v3("|>", parser.caret, parser.file_name)
				}
				else if (look_token.content == "default")
				{
					var arg1;
					var arg2;
					var __v4 = use("BayLang.OpCodes.OpPipe");
					kind = __v4.KIND_CALL;
					is_monad = true;
					var __v12 = use("BayLang.Exceptions.ParserError");
					try
					{
						var res = parser.parser_base.constructor.readIdentifier(look);
						parser = Runtime.rtl.attr(res, 0);
						arg1 = Runtime.rtl.attr(res, 1);
						var res = this.readTernary(parser);
						parser = Runtime.rtl.attr(res, 0);
						arg2 = Runtime.rtl.attr(res, 1);
						var __v5 = use("BayLang.OpCodes.OpString");
						arg1 = new __v5(use("Runtime.Map").from({"value":parser.constructor.findModuleName(parser, arg1.value),"caret_start":arg1.caret_start,"caret_end":arg1.caret_end}));
						var __v6 = use("BayLang.OpCodes.OpCall");
						var __v7 = use("BayLang.OpCodes.OpAttr");
						var __v8 = use("BayLang.OpCodes.OpAttr");
						var __v9 = use("BayLang.OpCodes.OpIdentifier");
						var __v10 = use("BayLang.OpCodes.OpIdentifier");
						var __v11 = use("BayLang.OpCodes.OpIdentifier");
						value = new __v6(use("Runtime.Map").from({"args":use("Runtime.Vector").from([arg1,arg2]),"obj":new __v7(use("Runtime.Map").from({"kind":__v8.KIND_STATIC,"obj":new __v9(use("Runtime.Map").from({"kind":__v10.KIND_SYS_TYPE,"caret_start":caret_start,"caret_end":parser.caret,"value":"rtl"})),"value":new __v11(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"value":"m_to"})),"caret_start":caret_start,"caret_end":parser.caret})),"caret_start":caret_start,"caret_end":parser.caret}));
					}
					catch (_ex)
					{
						if (_ex instanceof __v12)
						{
							var err = _ex;
							
							value = null;
						}
						else
						{
							throw _ex;
						}
					}
					if (value == null)
					{
						var res = this.readTernary(look);
						parser = Runtime.rtl.attr(res, 0);
						arg2 = Runtime.rtl.attr(res, 1);
						var __v13 = use("BayLang.OpCodes.OpCall");
						var __v14 = use("BayLang.OpCodes.OpAttr");
						var __v15 = use("BayLang.OpCodes.OpAttr");
						var __v16 = use("BayLang.OpCodes.OpIdentifier");
						var __v17 = use("BayLang.OpCodes.OpIdentifier");
						var __v18 = use("BayLang.OpCodes.OpIdentifier");
						value = new __v13(use("Runtime.Map").from({"args":use("Runtime.Vector").from([arg2]),"obj":new __v14(use("Runtime.Map").from({"kind":__v15.KIND_STATIC,"obj":new __v16(use("Runtime.Map").from({"kind":__v17.KIND_SYS_TYPE,"caret_start":caret_start,"caret_end":parser.caret,"value":"rtl"})),"value":new __v18(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"value":"m_def"})),"caret_start":caret_start,"caret_end":parser.caret})),"caret_start":caret_start,"caret_end":parser.caret}));
					}
				}
				else if (look_token.content == "method" || look_token.content == "." || look_token.content == ":" || look_token.content == "::")
				{
					parser = look;
					var __v19 = use("BayLang.OpCodes.OpPipe");
					kind = __v19.KIND_CALL;
					/* Set pipe */
					var save_find_ident = parser.find_ident;
					parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["find_ident"]), false);
					parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["is_pipe"]), true);
					if (look_token.content == ".")
					{
						var __v20 = use("BayLang.OpCodes.OpPipe");
						kind = __v20.KIND_METHOD;
						var __v21 = use("BayLang.OpCodes.OpAttr");
						parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["pipe_kind"]), __v21.KIND_ATTR);
					}
					else
					{
						var __v22 = use("BayLang.OpCodes.OpAttr");
						parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["pipe_kind"]), __v22.KIND_STATIC);
					}
					var res = parser.parser_base.constructor.readDynamic(parser);
					parser = Runtime.rtl.attr(res, 0);
					value = Runtime.rtl.attr(res, 1);
					/* Restore parser */
					parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["is_pipe"]), false);
					parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["find_ident"]), save_find_ident);
				}
				else if (look_token.content == "curry")
				{
					var __v23 = use("BayLang.OpCodes.OpPipe");
					kind = __v23.KIND_CALL;
					var res = parser.parser_base.constructor.readCurry(parser);
					parser = Runtime.rtl.attr(res, 0);
					value = Runtime.rtl.attr(res, 1);
				}
				else
				{
					var __v24 = use("BayLang.OpCodes.OpPipe");
					kind = __v24.KIND_CALL;
					var res = parser.parser_base.constructor.readDynamic(parser);
					parser = Runtime.rtl.attr(res, 0);
					value = Runtime.rtl.attr(res, 1);
				}
				var __v25 = use("BayLang.OpCodes.OpPipe");
				op_code = new __v25(use("Runtime.Map").from({"obj":op_code,"kind":kind,"value":value,"is_async":is_async,"is_monad":is_monad,"caret_start":caret_start,"caret_end":parser.caret}));
				var res = parser.parser_base.constructor.readToken(parser);
				look = Runtime.rtl.attr(res, 0);
				look_token = Runtime.rtl.attr(res, 1);
				is_next_attr = false;
			}
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read expression
	 */
	readExpression: function(parser)
	{
		var look = null;
		var token = null;
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "<")
		{
			return parser.parser_html.constructor.readHTML(parser);
		}
		else if (token.content == "curry")
		{
			return parser.parser_base.constructor.readCurry(parser);
		}
		else if (token.content == "@css")
		{
			return parser.parser_html.constructor.readCss(parser);
		}
		return this.ExpressionPipe(parser);
	},
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
});use.add(BayLang.LangBay.ParserBayExpression);
module.exports = BayLang.LangBay.ParserBayExpression;