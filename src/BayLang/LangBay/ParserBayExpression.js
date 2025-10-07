"use strict;"
const use = require('bay-lang').use;
const BaseObject = use("Runtime.BaseObject");
/*!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2025 "Ildar Bikmamatov" <support@bayrell.org>
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
BayLang.LangBay.ParserBayExpression = class extends BaseObject
{
	
	
	/**
	 * Constructor
	 */
	constructor(parser)
	{
		super();
		this.parser = parser;
	}
	
	
	/**
	 * Read item
	 */
	readItem(reader)
	{
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		/* Save caret */
		var save_caret = reader.caret();
		/* Read expression */
		if (reader.nextToken() == "(")
		{
			reader.matchToken("(");
			var op_code = this.readExpression(reader);
			reader.matchToken(")");
			return op_code;
		}
		/* Read op_code */
		var op_code = this.parser.parser_base.readDynamic(reader);
		if (op_code instanceof OpIdentifier && this.parser.find_variable)
		{
			this.parser.findVariable(op_code);
		}
		return op_code;
	}
	
	
	/**
	 * Read negative
	 */
	readNegative(reader)
	{
		const OpMath = use("BayLang.OpCodes.OpMath");
		var caret_start = reader.start();
		if (reader.nextToken() == "-")
		{
			reader.readToken();
			var op_code = this.readItem(reader);
			return new OpMath(Map.create({
				"value1": op_code,
				"math": "neg",
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		return this.readItem(reader);
	}
	
	
	/**
	 * Read bit not
	 */
	readBitNot(reader)
	{
		const OpMath = use("BayLang.OpCodes.OpMath");
		var caret_start = reader.start();
		var operations = ["not", "bitnot", "!"];
		if (operations.indexOf(reader.nextToken()) >= 0)
		{
			var op = reader.readToken();
			if (op == "!") op = "not";
			var op_code = this.readNegative(reader);
			return new OpMath(Map.create({
				"value1": op_code,
				"math": op,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		return this.readNegative(reader);
	}
	
	
	/**
	 * Read bit shift
	 */
	readBitShift(reader)
	{
		const OpMath = use("BayLang.OpCodes.OpMath");
		var caret_start = reader.start();
		var operations = ["<<", ">>"];
		/* Read operators */
		var op_code = this.readBitNot(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			var math = reader.readToken();
			var value = this.readBitNot(reader);
			op_code = new OpMath(Map.create({
				"value1": op_code,
				"value2": value,
				"math": math,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		return op_code;
	}
	
	
	/**
	 * Read bit and
	 */
	readBitAnd(reader)
	{
		const OpMath = use("BayLang.OpCodes.OpMath");
		var caret_start = reader.start();
		var operations = ["&"];
		/* Read operators */
		var op_code = this.readBitShift(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			var math = reader.readToken();
			var value = this.readBitShift(reader);
			op_code = new OpMath(Map.create({
				"value1": op_code,
				"value2": value,
				"math": math,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		return op_code;
	}
	
	
	/**
	 * Read bit or
	 */
	readBitOr(reader)
	{
		const OpMath = use("BayLang.OpCodes.OpMath");
		var caret_start = reader.start();
		var operations = ["|", "xor"];
		/* Read operators */
		var op_code = this.readBitAnd(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			var math = reader.readToken();
			var value = this.readBitAnd(reader);
			op_code = new OpMath(Map.create({
				"value1": op_code,
				"value2": value,
				"math": math,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		return op_code;
	}
	
	
	/**
	 * Read factor
	 */
	readFactor(reader)
	{
		const OpMath = use("BayLang.OpCodes.OpMath");
		var caret_start = reader.start();
		var operations = ["*", "/", "%", "div", "mod"];
		/* Read operators */
		var op_code = this.readBitOr(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			var math = reader.readToken();
			var value = this.readBitOr(reader);
			op_code = new OpMath(Map.create({
				"value1": op_code,
				"value2": value,
				"math": math,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		return op_code;
	}
	
	
	/**
	 * Read arithmetic
	 */
	readArithmetic(reader)
	{
		const OpMath = use("BayLang.OpCodes.OpMath");
		var caret_start = reader.start();
		var operations = ["+", "-"];
		/* Read operators */
		var op_code = this.readFactor(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			var math = reader.readToken();
			var value = this.readFactor(reader);
			op_code = new OpMath(Map.create({
				"value1": op_code,
				"value2": value,
				"math": math,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		return op_code;
	}
	
	
	/**
	 * Read concat
	 */
	readConcat(reader)
	{
		const OpMath = use("BayLang.OpCodes.OpMath");
		var caret_start = reader.start();
		var operations = ["~"];
		/* Read operators */
		var op_code = this.readArithmetic(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			var math = reader.readToken();
			var value = this.readArithmetic(reader);
			op_code = new OpMath(Map.create({
				"value1": op_code,
				"value2": value,
				"math": math,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		return op_code;
	}
	
	
	/**
	 * Read compare
	 */
	readCompare(reader)
	{
		const OpMath = use("BayLang.OpCodes.OpMath");
		var caret_start = reader.start();
		var op_code = this.readConcat(reader);
		var operations1 = ["===", "!==", "==", "!=", ">=", "<=", ">", "<"];
		var operations2 = ["is", "implements", "instanceof"];
		/* Read operators */
		if (operations1.indexOf(reader.nextToken()) >= 0)
		{
			var math = reader.readToken();
			var value = this.readConcat(reader);
			op_code = new OpMath(Map.create({
				"value1": op_code,
				"value2": value,
				"math": math,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		else if (operations2.indexOf(reader.nextToken()) >= 0)
		{
			var math = reader.readToken();
			var value = this.parser.parser_base.readTypeIdentifier(reader, true, false);
			op_code = new OpMath(Map.create({
				"value1": op_code,
				"value2": value,
				"math": math,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		return op_code;
	}
	
	
	/**
	 * Read and
	 */
	readAnd(reader)
	{
		const OpMath = use("BayLang.OpCodes.OpMath");
		var caret_start = reader.start();
		var operations = ["and", "&&"];
		/* Read operators */
		var op_code = this.readCompare(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			var math = reader.readToken();
			var value = this.readCompare(reader);
			op_code = new OpMath(Map.create({
				"value1": op_code,
				"value2": value,
				"math": math,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		return op_code;
	}
	
	
	/**
	 * Read or
	 */
	readOr(reader)
	{
		const OpMath = use("BayLang.OpCodes.OpMath");
		var caret_start = reader.start();
		var operations = ["or", "||"];
		/* Read operators */
		var op_code = this.readAnd(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			var math = reader.readToken();
			var value = this.readAnd(reader);
			op_code = new OpMath(Map.create({
				"value1": op_code,
				"value2": value,
				"math": math,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		return op_code;
	}
	
	
	/**
	 * Read element
	 */
	readElement(reader)
	{
		/* Read collection */
		if (reader.nextToken() == "[")
		{
			return this.parser.parser_base.readCollection(reader);
		}
		/* Read collection */
		if (reader.nextToken() == "{")
		{
			return this.parser.parser_base.readDict(reader);
		}
		/* Try to read function */
		var op_code = this.parser.parser_function.tryReadFunction(reader, false);
		if (op_code) return op_code;
		/* Read expression */
		return this.readOr(reader);
	}
	
	
	/**
	 * Read ternary operation
	 */
	readTernary(reader)
	{
		const OpTernary = use("BayLang.OpCodes.OpTernary");
		var caret_start = reader.start();
		/* Detect ternary operation */
		var op_code = this.readElement(reader);
		if (reader.nextToken() != "?") return op_code;
		/* Read expression */
		reader.matchToken("?");
		var if_true = this.readElement(reader);
		var if_false = null;
		if (reader.nextToken() == ":")
		{
			reader.matchToken(":");
			if_false = this.readElement(reader);
		}
		return new OpTernary(Map.create({
			"condition": op_code,
			"if_true": if_true,
			"if_false": if_false,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read expression
	 */
	readExpression(reader)
	{
		return this.readTernary(reader);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.parser = null;
	}
	static getClassName(){ return "BayLang.LangBay.ParserBayExpression"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.LangBay.ParserBayExpression);
module.exports = {
	"ParserBayExpression": BayLang.LangBay.ParserBayExpression,
};