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
BayLang.LangPHP.ParserPHPOperator = function(ctx, parser)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.parser = parser;
};
BayLang.LangPHP.ParserPHPOperator.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangPHP.ParserPHPOperator.prototype.constructor = BayLang.LangPHP.ParserPHPOperator;
Object.assign(BayLang.LangPHP.ParserPHPOperator.prototype,
{
	/**
	 * Read if
	 */
	readIf: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		var if_true = null;
		var if_false = null;
		var if_else = use("Runtime.Vector").from([]);
		/* Read condition */
		reader.matchToken(ctx, "if");
		reader.matchToken(ctx, "(");
		var condition = this.parser.parser_expression.readExpression(ctx, reader);
		reader.matchToken(ctx, ")");
		/* Read content */
		if_true = this.readContent(ctx, reader);
		/* Read content */
		var operations = use("Runtime.Vector").from(["else","elseif"]);
		while (!reader.eof(ctx) && operations.indexOf(ctx, reader.nextToken(ctx)) >= 0)
		{
			var token = reader.readToken(ctx);
			if (token == "elseif" || token == "else" && reader.nextToken(ctx) == "if")
			{
				/* Read condition */
				reader.matchToken(ctx, "(");
				var if_else_condition = this.parser.parser_expression.readExpression(ctx, reader);
				reader.matchToken(ctx, ")");
				/* Read content */
				var if_else_content = this.readContent(ctx, reader);
				/* Add op_code */
				var __v0 = use("BayLang.OpCodes.OpIfElse");
				if_else.push(ctx, new __v0(ctx, use("Runtime.Map").from({"condition":if_else_condition,"content":if_else_content,"caret_start":caret_start,"caret_end":reader.caret(ctx)})));
			}
			else if (token == "else")
			{
				if_false = this.readContent(ctx, reader);
			}
		}
		var __v0 = use("BayLang.OpCodes.OpIf");
		return new __v0(ctx, use("Runtime.Map").from({"condition":condition,"if_true":if_true,"if_false":if_false,"if_else":if_else,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
	},
	/**
	 * Read For
	 */
	readFor: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		/* Read for */
		reader.matchToken(ctx, "for");
		reader.matchToken(ctx, "(");
		/* Read assing */
		var expr1 = this.readAssign(ctx, reader);
		reader.matchToken(ctx, ";");
		/* Read expression */
		var expr2 = this.parser.parser_expression.readExpression(ctx, reader);
		reader.matchToken(ctx, ";");
		/* Read operator */
		var expr3 = this.readInc(ctx, reader);
		reader.matchToken(ctx, ")");
		/* Read content */
		var content = this.readContent(ctx, reader);
		/* Returns op_code */
		var __v0 = use("BayLang.OpCodes.OpFor");
		return new __v0(ctx, use("Runtime.Map").from({"expr1":expr1,"expr2":expr2,"expr3":expr3,"content":content,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
	},
	/**
	 * Read While
	 */
	readWhile: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		/* Read condition */
		reader.matchToken(ctx, "while");
		reader.matchToken(ctx, "(");
		var condition = this.parser.parser_expression.readExpression(ctx, reader);
		reader.matchToken(ctx, ")");
		/* Read items */
		var content = null;
		if (reader.nextToken(ctx) == "{")
		{
			content = this.parse(ctx, reader);
		}
		else
		{
			content = this.readOperator(ctx, reader);
		}
		/* Returns op_code */
		var __v0 = use("BayLang.OpCodes.OpWhile");
		return new __v0(ctx, use("Runtime.Map").from({"content":content,"condition":condition,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
	},
	/**
	 * Read assign
	 */
	readAssign: function(ctx, reader, pattern)
	{
		if (pattern == undefined) pattern = null;
		var caret_start = reader.caret(ctx);
		var items = use("Runtime.Vector").from([]);
		/* Read pattern */
		if (pattern == null)
		{
			pattern = this.parser.parser_base.readTypeIdentifier(ctx, reader);
		}
		/* Read items */
		if (reader.nextToken(ctx) != "=")
		{
			while (!reader.eof(ctx))
			{
				var caret_value_start = reader.caret(ctx);
				/* Read assign value */
				var value = this.parser.parser_base.readIdentifier(ctx, reader);
				/* Register variable */
				this.parser.addVariable(ctx, value);
				/* Read expression */
				var expression = null;
				if (reader.nextToken(ctx) == "=")
				{
					reader.matchToken(ctx, "=");
					expression = this.parser.parser_expression.readExpression(ctx, reader);
				}
				/* Add op_code */
				var __v0 = use("BayLang.OpCodes.OpAssignValue");
				items.push(ctx, new __v0(ctx, use("Runtime.Map").from({"value":value,"expression":expression,"caret_start":caret_value_start,"caret_end":reader.caret(ctx)})));
				/* Read next token */
				if (reader.nextToken(ctx) != ",")
				{
					break;
				}
				reader.readToken(ctx);
			}
		}
		else
		{
			/* Get value */
			var value = pattern;
			pattern = null;
			/* Find identifier */
			var __v0 = use("BayLang.OpCodes.OpTypeIdentifier");
			if (value instanceof __v0)
			{
				value = value.entity_name.items.last(ctx);
			}
			var __v0 = use("BayLang.OpCodes.OpIdentifier");
			if (!(value instanceof __v0))
			{
				throw value.caret_end.error(ctx, "Wrong type identifier")
			}
			var find = this.parser.findVariable(ctx, value);
			if (!find)
			{
				var __v0 = use("BayLang.OpCodes.OpTypeIdentifier");
				var __v1 = use("BayLang.OpCodes.OpEntityName");
				var __v2 = use("BayLang.OpCodes.OpIdentifier");
				pattern = new __v0(ctx, use("Runtime.Map").from({"entity_name":new __v1(ctx, use("Runtime.Map").from({"items":use("Runtime.Vector").from([new __v2(ctx, use("Runtime.Map").from({"value":"var"}))])}))}));
				this.parser.addVariable(ctx, value);
			}
			/* Read expression */
			reader.matchToken(ctx, "=");
			var expression = this.parser.parser_expression.readExpression(ctx, reader);
			var __v0 = use("BayLang.OpCodes.OpAssignValue");
			items.push(ctx, new __v0(ctx, use("Runtime.Map").from({"value":value,"expression":expression,"caret_start":caret_start,"caret_end":reader.caret(ctx)})));
		}
		/* Returns op_code */
		var __v0 = use("BayLang.OpCodes.OpAssign");
		var __v1 = use("BayLang.OpCodes.OpFlags");
		return new __v0(ctx, use("Runtime.Map").from({"flags":new __v1(ctx),"pattern":pattern,"items":items,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
	},
	/**
	 * Read operator
	 */
	readInc: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		/* Read identifier */
		var item = this.parser.parser_base.readIdentifier(ctx, reader);
		/* Read kind */
		var kind = reader.readToken(ctx);
		if (kind == "++")
		{
			var __v0 = use("BayLang.OpCodes.OpInc");
			kind = __v0.KIND_INC;
		}
		else if (kind == "--")
		{
			var __v1 = use("BayLang.OpCodes.OpInc");
			kind = __v1.KIND_DEC;
		}
		else
		{
			throw reader.expected(ctx, "++ or --")
		}
		/* Returns op_code */
		var __v0 = use("BayLang.OpCodes.OpInc");
		return new __v0(ctx, use("Runtime.Map").from({"kind":kind,"item":item,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
	},
	/**
	 * Read operator
	 */
	readOperator: function(ctx, reader)
	{
		var next_token = reader.nextToken(ctx);
		var caret_start = reader.caret(ctx);
		/* Comment */
		if (next_token == "/")
		{
			return this.parser.parser_base.readComment(ctx, reader);
		}
		else if (next_token == "#switch" || next_token == "#ifcode")
		{
			return this.parser.parser_preprocessor.readPreprocessor(ctx, reader);
		}
		else if (next_token == "#ifdef")
		{
			var __v0 = use("BayLang.OpCodes.OpPreprocessorIfDef");
			return this.parser.parser_preprocessor.readPreprocessorIfDef(ctx, reader, __v0.KIND_OPERATOR);
		}
		else if (next_token == "break")
		{
			var __v1 = use("BayLang.OpCodes.OpBreak");
			return new __v1(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
		}
		else if (next_token == "continue")
		{
			var __v2 = use("BayLang.OpCodes.OpContinue");
			return new __v2(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
		}
		else if (next_token == "delete")
		{
			return this.readDelete(ctx, reader);
		}
		else if (next_token == "return")
		{
			return this.readReturn(ctx, reader);
		}
		else if (next_token == "throw")
		{
			return this.readThrow(ctx, reader);
		}
		else if (next_token == "try")
		{
			return this.readTry(ctx, reader);
		}
		else if (next_token == "if")
		{
			return this.readIf(ctx, reader);
		}
		else if (next_token == "for")
		{
			return this.readFor(ctx, reader);
		}
		else if (next_token == "while")
		{
			return this.readWhile(ctx, reader);
		}
		/* Save caret */
		var save_caret = reader.caret(ctx);
		/* Try to read call function */
		var pattern = this.parser.parser_base.readItem(ctx, reader);
		if (reader.nextToken(ctx) == "(")
		{
			var op_code = this.parser.parser_function.readCallFunction(ctx, reader, pattern);
			if (op_code)
			{
				return op_code;
			}
		}
		/* Restore reader */
		reader.init(ctx, save_caret);
		/* Assign operator */
		return this.readAssign(ctx, reader);
	},
	/**
	 * Read content
	 */
	readContent: function(ctx, reader)
	{
		if (reader.nextToken(ctx) == "{")
		{
			return this.parse(ctx, reader);
		}
		var content = this.readOperator(ctx, reader);
		reader.matchToken(ctx, ";");
		return content;
	},
	/**
	 * Read operators
	 */
	parse: function(ctx, reader)
	{
		var caret_start = reader.caret(ctx);
		var items = use("Runtime.Vector").from([]);
		/* Read begin tag */
		reader.matchToken(ctx, "{");
		/* Read operators */
		while (!reader.eof(ctx) && reader.nextToken(ctx) != "}")
		{
			var op_code = this.readOperator(ctx, reader);
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
		/* Read end tag */
		reader.matchToken(ctx, "}");
		/* Returns value */
		var __v0 = use("BayLang.OpCodes.OpItems");
		return new __v0(ctx, use("Runtime.Map").from({"items":items,"caret_start":caret_start,"caret_end":reader.caret(ctx)}));
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.parser = null;
	},
});
Object.assign(BayLang.LangPHP.ParserPHPOperator, use("Runtime.BaseObject"));
Object.assign(BayLang.LangPHP.ParserPHPOperator,
{
	/**
	 * Read annotation
	 */
	readAnnotation: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var name = null;
		var params = null;
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "@");
		parser = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = token.caret_start;
		var res = parser.parser_base.constructor.readTypeIdentifier(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		name = Runtime.rtl.attr(ctx, res, 1);
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "{")
		{
			var res = parser.parser_base.constructor.readDict(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			params = Runtime.rtl.attr(ctx, res, 1);
		}
		var __v0 = use("BayLang.OpCodes.OpAnnotation");
		return use("Runtime.Vector").from([parser,new __v0(ctx, use("Runtime.Map").from({"name":name,"params":params}))]);
	},
	/**
	 * Read return
	 */
	readReturn: function(ctx, parser)
	{
		var token = null;
		var op_code = null;
		var look = null;
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "return");
		parser = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = token.caret_start;
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content != ";")
		{
			var res = parser.parser_expression.constructor.readExpression(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			op_code = Runtime.rtl.attr(ctx, res, 1);
		}
		var __v0 = use("BayLang.OpCodes.OpReturn");
		return use("Runtime.Vector").from([parser,new __v0(ctx, use("Runtime.Map").from({"expression":op_code,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/**
	 * Read delete
	 */
	readDelete: function(ctx, parser)
	{
		var token = null;
		var op_code = null;
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "delete");
		parser = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = token.caret_start;
		var res = parser.parser_base.constructor.readDynamic(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_code = Runtime.rtl.attr(ctx, res, 1);
		var __v0 = use("BayLang.OpCodes.OpDelete");
		return use("Runtime.Vector").from([parser,new __v0(ctx, use("Runtime.Map").from({"op_code":op_code,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/**
	 * Read throw
	 */
	readThrow: function(ctx, parser)
	{
		var token = null;
		var op_code = null;
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "throw");
		parser = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = token.caret_start;
		var res = parser.parser_expression.constructor.readExpression(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_code = Runtime.rtl.attr(ctx, res, 1);
		var __v0 = use("BayLang.OpCodes.OpThrow");
		return use("Runtime.Vector").from([parser,new __v0(ctx, use("Runtime.Map").from({"expression":op_code,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/**
	 * Read try
	 */
	readTry: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var op_try = null;
		var __v0 = use("Runtime.Vector");
		var items = new __v0(ctx);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "try");
		parser = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = token.caret_start;
		/* Try */
		var res = this.readOperators(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		op_try = Runtime.rtl.attr(ctx, res, 1);
		/* Catch */
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		while (!token.eof && token.content == "catch")
		{
			parser = look;
			var op_catch = null;
			var var_op_code = null;
			var pattern = null;
			var item_caret_start = token.caret_start;
			/* Read ident */
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "(");
			parser = Runtime.rtl.attr(ctx, res, 0);
			var res = parser.parser_base.constructor.readTypeIdentifier(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			pattern = Runtime.rtl.attr(ctx, res, 1);
			var res = parser.parser_base.constructor.readIdentifier(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			var_op_code = Runtime.rtl.attr(ctx, res, 1);
			var var_name = var_op_code.value;
			var res = parser.parser_base.constructor.matchToken(ctx, parser, ")");
			parser = Runtime.rtl.attr(ctx, res, 0);
			/* Save vars */
			var save_vars = parser.vars;
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), parser.vars.setIm(ctx, var_name, true));
			/* Catch operators */
			var res = this.readOperators(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			op_catch = Runtime.rtl.attr(ctx, res, 1);
			/* Restore vars */
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), save_vars);
			var __v1 = use("BayLang.OpCodes.OpTryCatchItem");
			var item = new __v1(ctx, use("Runtime.Map").from({"name":var_name,"pattern":pattern,"value":op_catch,"caret_start":item_caret_start,"caret_end":parser.caret}));
			items.push(ctx, item);
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
		}
		var __v1 = use("BayLang.OpCodes.OpTryCatch");
		return use("Runtime.Vector").from([parser,new __v1(ctx, use("Runtime.Map").from({"op_try":op_try,"items":items,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/**
	 * Read then
	 */
	readThen: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "then")
		{
			return use("Runtime.Vector").from([look,token]);
		}
		return use("Runtime.Vector").from([parser,token]);
	},
	/**
	 * Read do
	 */
	readDo: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "do")
		{
			return use("Runtime.Vector").from([look,token]);
		}
		return use("Runtime.Vector").from([parser,token]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangPHP";
	},
	getClassName: function()
	{
		return "BayLang.LangPHP.ParserPHPOperator";
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
});use.add(BayLang.LangPHP.ParserPHPOperator);
module.exports = BayLang.LangPHP.ParserPHPOperator;