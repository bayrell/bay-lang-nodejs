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
BayLang.LangBay.ParserBayExpression = function(ctx)
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
	readNegative: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = token.caret_start;
		if (token.content == "-")
		{
			var op_code = null;
			var res = parser.parser_base.constructor.readDynamic(ctx, look);
			parser = Runtime.rtl.attr(ctx, res, 0);
			op_code = Runtime.rtl.attr(ctx, res, 1);
			var __v0 = use("BayLang.OpCodes.OpNegative");
			return use("Runtime.Vector").from([parser,new __v0(ctx, use("Runtime.Map").from({"value":op_code,"caret_start":caret_start,"caret_end":parser.caret}))]);
		}
		return parser.parser_base.constructor.readDynamic(ctx, parser);
	},
	/**
	 * Read bit not
	 */
	readBitNot: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = token.caret_start;
		if (token.content == "!")
		{
			var op_code = null;
			var res = this.readNegative(ctx, look);
			parser = Runtime.rtl.attr(ctx, res, 0);
			op_code = Runtime.rtl.attr(ctx, res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			return use("Runtime.Vector").from([parser,new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"math":"!","caret_start":caret_start,"caret_end":parser.caret}))]);
		}
		return this.readNegative(ctx, parser);
	},
	/**
	 * Read bit shift
	 */
	readBitShift: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readBitNot(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_code = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		while (!token.eof && (token.content == ">>" || token.content == "<<"))
		{
			math = token.content;
			var res = this.readBitNot(ctx, look);
			look = Runtime.rtl.attr(ctx, res, 0);
			look_value = Runtime.rtl.attr(ctx, res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read bit and
	 */
	readBitAnd: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readBitShift(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_code = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		while (!token.eof && token.content == "&")
		{
			math = token.content;
			var res = this.readBitShift(ctx, look);
			look = Runtime.rtl.attr(ctx, res, 0);
			look_value = Runtime.rtl.attr(ctx, res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read bit or
	 */
	readBitOr: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readBitAnd(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_code = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		while (!token.eof && (token.content == "|" || token.content == "xor"))
		{
			math = token.content;
			var res = this.readBitAnd(ctx, look);
			look = Runtime.rtl.attr(ctx, res, 0);
			look_value = Runtime.rtl.attr(ctx, res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read factor
	 */
	readFactor: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readBitOr(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_code = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		while (!token.eof && (token.content == "*" || token.content == "/" || token.content == "%" || token.content == "div" || token.content == "mod"))
		{
			math = token.content;
			var res = this.readBitOr(ctx, look);
			look = Runtime.rtl.attr(ctx, res, 0);
			look_value = Runtime.rtl.attr(ctx, res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read arithmetic
	 */
	readArithmetic: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readFactor(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_code = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		while (!token.eof && (token.content == "+" || token.content == "-"))
		{
			math = token.content;
			var res = this.readFactor(ctx, look);
			look = Runtime.rtl.attr(ctx, res, 0);
			look_value = Runtime.rtl.attr(ctx, res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read concat
	 */
	readConcat: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readArithmetic(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_code = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		while (!token.eof && token.content == "~")
		{
			math = token.content;
			var res = this.readArithmetic(ctx, look);
			look = Runtime.rtl.attr(ctx, res, 0);
			look_value = Runtime.rtl.attr(ctx, res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read compare
	 */
	readCompare: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readConcat(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_code = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = op_code.caret_start;
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var content = token.content;
		if (content == "===" || content == "!==" || content == "==" || content == "!=" || content == ">=" || content == "<=" || content == ">" || content == "<")
		{
			var math = token.content;
			var res = this.readConcat(ctx, look);
			look = Runtime.rtl.attr(ctx, res, 0);
			look_value = Runtime.rtl.attr(ctx, res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":parser.caret}));
			parser = look;
		}
		else if (content == "is" || content == "implements" || content == "instanceof")
		{
			var math = token.content;
			var res = parser.parser_base.constructor.readTypeIdentifier(ctx, look);
			look = Runtime.rtl.attr(ctx, res, 0);
			look_value = Runtime.rtl.attr(ctx, res, 1);
			var __v1 = use("BayLang.OpCodes.OpMath");
			op_code = new __v1(ctx, use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":math,"caret_start":caret_start,"caret_end":parser.caret}));
			parser = look;
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read not
	 */
	readNot: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = token.caret_start;
		if (token.content == "not")
		{
			var op_code = null;
			var start = parser;
			var res = this.readCompare(ctx, look);
			parser = Runtime.rtl.attr(ctx, res, 0);
			op_code = Runtime.rtl.attr(ctx, res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			return use("Runtime.Vector").from([parser,new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"math":"not","caret_start":caret_start,"caret_end":parser.caret}))]);
		}
		return this.readCompare(ctx, parser);
	},
	/**
	 * Read and
	 */
	readAnd: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readNot(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_code = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		while (!token.eof && (token.content == "and" || token.content == "&&"))
		{
			math = token.content;
			var res = this.readNot(ctx, look);
			look = Runtime.rtl.attr(ctx, res, 0);
			look_value = Runtime.rtl.attr(ctx, res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":"and","caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read or
	 */
	readOr: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var look_value = null;
		var res = this.readAnd(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_code = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = op_code.caret_start;
		var math = "";
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		while (!token.eof && (token.content == "or" || token.content == "||"))
		{
			math = token.content;
			var res = this.readAnd(ctx, look);
			look = Runtime.rtl.attr(ctx, res, 0);
			look_value = Runtime.rtl.attr(ctx, res, 1);
			var __v0 = use("BayLang.OpCodes.OpMath");
			op_code = new __v0(ctx, use("Runtime.Map").from({"value1":op_code,"value2":look_value,"math":"or","caret_start":caret_start,"caret_end":look.caret}));
			parser = look;
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read element
	 */
	readElement: function(ctx, parser)
	{
		/* Try to read function */
		if (parser.parser_operator.constructor.tryReadFunction(ctx, parser, false))
		{
			return parser.parser_operator.constructor.readDeclareFunction(ctx, parser, false);
		}
		return this.readOr(ctx, parser);
	},
	/**
	 * Read ternary operation
	 */
	readTernary: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var condition = null;
		var if_true = null;
		var if_false = null;
		var res = this.readElement(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_code = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = op_code.caret_start;
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "?")
		{
			condition = op_code;
			var res = this.readExpression(ctx, look);
			parser = Runtime.rtl.attr(ctx, res, 0);
			if_true = Runtime.rtl.attr(ctx, res, 1);
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == ":")
			{
				var res = this.readExpression(ctx, look);
				parser = Runtime.rtl.attr(ctx, res, 0);
				if_false = Runtime.rtl.attr(ctx, res, 1);
			}
			var __v0 = use("BayLang.OpCodes.OpTernary");
			op_code = new __v0(ctx, use("Runtime.Map").from({"condition":condition,"if_true":if_true,"if_false":if_false,"caret_start":caret_start,"caret_end":parser.caret}));
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read pipe
	 */
	ExpressionPipe: function(ctx, parser)
	{
		var look = null;
		var look_token = null;
		var op_code = null;
		var is_next_attr = false;
		var save_is_pipe = parser.is_pipe;
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["is_pipe"]), false);
		var res = this.readTernary(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_code = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = op_code.caret_start;
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["is_pipe"]), save_is_pipe);
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		look_token = Runtime.rtl.attr(ctx, res, 1);
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
				var res = parser.parser_base.constructor.readToken(ctx, parser);
				look = Runtime.rtl.attr(ctx, res, 0);
				look_token = Runtime.rtl.attr(ctx, res, 1);
				if (look_token.content == "await")
				{
					is_async = true;
					parser = look;
					var res = parser.parser_base.constructor.readToken(ctx, parser);
					look = Runtime.rtl.attr(ctx, res, 0);
					look_token = Runtime.rtl.attr(ctx, res, 1);
				}
				if (look_token.content == "monad")
				{
					is_monad = true;
					parser = look;
					var res = parser.parser_base.constructor.readToken(ctx, parser);
					look = Runtime.rtl.attr(ctx, res, 0);
					look_token = Runtime.rtl.attr(ctx, res, 1);
				}
				if (look_token.content == "attr")
				{
					parser = look;
					var res = this.readTernary(ctx, parser);
					parser = Runtime.rtl.attr(ctx, res, 0);
					value = Runtime.rtl.attr(ctx, res, 1);
					var __v0 = use("BayLang.OpCodes.OpPipe");
					kind = __v0.KIND_ATTR;
				}
				else if (look_token.content == "\"" || look_token.content == "'")
				{
					var res = this.readTernary(ctx, parser);
					parser = Runtime.rtl.attr(ctx, res, 0);
					value = Runtime.rtl.attr(ctx, res, 1);
					var __v1 = use("BayLang.OpCodes.OpPipe");
					kind = __v1.KIND_ATTR;
				}
				else if (look_token.content == "{")
				{
					parser = look;
					var res = this.readTernary(ctx, parser);
					parser = Runtime.rtl.attr(ctx, res, 0);
					value = Runtime.rtl.attr(ctx, res, 1);
					var __v2 = use("BayLang.OpCodes.OpPipe");
					kind = __v2.KIND_ATTR;
					var res = parser.parser_base.constructor.matchToken(ctx, parser, "}");
					parser = Runtime.rtl.attr(ctx, res, 0);
				}
				else if (is_next_attr)
				{
					var __v3 = use("BayLang.Exceptions.ParserExpected");
					throw new __v3(ctx, "|>", parser.caret, parser.file_name)
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
						var res = parser.parser_base.constructor.readIdentifier(ctx, look);
						parser = Runtime.rtl.attr(ctx, res, 0);
						arg1 = Runtime.rtl.attr(ctx, res, 1);
						var res = this.readTernary(ctx, parser);
						parser = Runtime.rtl.attr(ctx, res, 0);
						arg2 = Runtime.rtl.attr(ctx, res, 1);
						var __v5 = use("BayLang.OpCodes.OpString");
						arg1 = new __v5(ctx, use("Runtime.Map").from({"value":parser.constructor.findModuleName(ctx, parser, arg1.value),"caret_start":arg1.caret_start,"caret_end":arg1.caret_end}));
						var __v6 = use("BayLang.OpCodes.OpCall");
						var __v7 = use("BayLang.OpCodes.OpAttr");
						var __v8 = use("BayLang.OpCodes.OpAttr");
						var __v9 = use("BayLang.OpCodes.OpIdentifier");
						var __v10 = use("BayLang.OpCodes.OpIdentifier");
						var __v11 = use("BayLang.OpCodes.OpIdentifier");
						value = new __v6(ctx, use("Runtime.Map").from({"args":use("Runtime.Vector").from([arg1,arg2]),"obj":new __v7(ctx, use("Runtime.Map").from({"kind":__v8.KIND_STATIC,"obj":new __v9(ctx, use("Runtime.Map").from({"kind":__v10.KIND_SYS_TYPE,"caret_start":caret_start,"caret_end":parser.caret,"value":"rtl"})),"value":new __v11(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"value":"m_to"})),"caret_start":caret_start,"caret_end":parser.caret})),"caret_start":caret_start,"caret_end":parser.caret}));
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
						var res = this.readTernary(ctx, look);
						parser = Runtime.rtl.attr(ctx, res, 0);
						arg2 = Runtime.rtl.attr(ctx, res, 1);
						var __v5 = use("BayLang.OpCodes.OpCall");
						var __v6 = use("BayLang.OpCodes.OpAttr");
						var __v7 = use("BayLang.OpCodes.OpAttr");
						var __v8 = use("BayLang.OpCodes.OpIdentifier");
						var __v9 = use("BayLang.OpCodes.OpIdentifier");
						var __v10 = use("BayLang.OpCodes.OpIdentifier");
						value = new __v5(ctx, use("Runtime.Map").from({"args":use("Runtime.Vector").from([arg2]),"obj":new __v6(ctx, use("Runtime.Map").from({"kind":__v7.KIND_STATIC,"obj":new __v8(ctx, use("Runtime.Map").from({"kind":__v9.KIND_SYS_TYPE,"caret_start":caret_start,"caret_end":parser.caret,"value":"rtl"})),"value":new __v10(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"value":"m_def"})),"caret_start":caret_start,"caret_end":parser.caret})),"caret_start":caret_start,"caret_end":parser.caret}));
					}
				}
				else if (look_token.content == "method" || look_token.content == "." || look_token.content == ":" || look_token.content == "::")
				{
					parser = look;
					var __v5 = use("BayLang.OpCodes.OpPipe");
					kind = __v5.KIND_CALL;
					/* Set pipe */
					var save_find_ident = parser.find_ident;
					parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["find_ident"]), false);
					parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["is_pipe"]), true);
					if (look_token.content == ".")
					{
						var __v6 = use("BayLang.OpCodes.OpPipe");
						kind = __v6.KIND_METHOD;
						var __v7 = use("BayLang.OpCodes.OpAttr");
						parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["pipe_kind"]), __v7.KIND_ATTR);
					}
					else
					{
						var __v8 = use("BayLang.OpCodes.OpAttr");
						parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["pipe_kind"]), __v8.KIND_STATIC);
					}
					var res = parser.parser_base.constructor.readDynamic(ctx, parser);
					parser = Runtime.rtl.attr(ctx, res, 0);
					value = Runtime.rtl.attr(ctx, res, 1);
					/* Restore parser */
					parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["is_pipe"]), false);
					parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["find_ident"]), save_find_ident);
				}
				else if (look_token.content == "curry")
				{
					var __v6 = use("BayLang.OpCodes.OpPipe");
					kind = __v6.KIND_CALL;
					var res = parser.parser_base.constructor.readCurry(ctx, parser);
					parser = Runtime.rtl.attr(ctx, res, 0);
					value = Runtime.rtl.attr(ctx, res, 1);
				}
				else
				{
					var __v7 = use("BayLang.OpCodes.OpPipe");
					kind = __v7.KIND_CALL;
					var res = parser.parser_base.constructor.readDynamic(ctx, parser);
					parser = Runtime.rtl.attr(ctx, res, 0);
					value = Runtime.rtl.attr(ctx, res, 1);
				}
				var __v0 = use("BayLang.OpCodes.OpPipe");
				op_code = new __v0(ctx, use("Runtime.Map").from({"obj":op_code,"kind":kind,"value":value,"is_async":is_async,"is_monad":is_monad,"caret_start":caret_start,"caret_end":parser.caret}));
				var res = parser.parser_base.constructor.readToken(ctx, parser);
				look = Runtime.rtl.attr(ctx, res, 0);
				look_token = Runtime.rtl.attr(ctx, res, 1);
				is_next_attr = false;
			}
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read expression
	 */
	readExpression: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "<")
		{
			return parser.parser_html.constructor.readHTML(ctx, parser);
		}
		else if (token.content == "curry")
		{
			return parser.parser_base.constructor.readCurry(ctx, parser);
		}
		else if (token.content == "@css")
		{
			return parser.parser_html.constructor.readCss(ctx, parser);
		}
		return this.ExpressionPipe(ctx, parser);
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