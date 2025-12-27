"use strict;"
const use = require('bay-lang').use;
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
if (typeof BayLang.LangES6 == 'undefined') BayLang.LangES6 = {};
BayLang.LangES6.ParserES6Expression = class extends use("Runtime.BaseObject")
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
	 * Read function
	 */
	readFunction(reader)
	{
		/* Save caret */
		let save_caret = reader.caret();
		/* Read expression */
		if (reader.nextToken() == "(")
		{
			reader.matchToken("(");
			let op_code = this.readExpression(reader);
			reader.matchToken(")");
			return op_code;
		}
		/* Try to read function */
		let op_code = this.parser.parser_function.readCallFunction(reader);
		if (op_code) return op_code;
		/* Restore reader */
		reader.init(save_caret);
		/* Read op_code */
		return this.parser.parser_base.readItem(reader);
	}
	
	
	/**
	 * Read negative
	 */
	readNegative(reader)
	{
		const OpMath = use("BayLang.OpCodes.OpMath");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		if (reader.nextToken() == "-")
		{
			reader.readToken();
			let op_code = this.readFunction(reader);
			return new OpMath(Map.create({
				"value1": op_code,
				"math": "!",
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		return this.readFunction(reader);
	}
	
	
	/**
	 * Read bit not
	 */
	readBitNot(reader)
	{
		const Vector = use("Runtime.Vector");
		const OpMath = use("BayLang.OpCodes.OpMath");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let operations = Vector.create(["~", "!"]);
		if (operations.indexOf(reader.nextToken()) >= 0)
		{
			let op = reader.readToken();
			if (op == "!") op = "not";
			else if (op == "~") op = "bitnot";
			let op_code = this.readNegative(reader);
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
		const Vector = use("Runtime.Vector");
		const OpMath = use("BayLang.OpCodes.OpMath");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let operations = Vector.create(["<<", ">>"]);
		/* Read operators */
		let op_code = this.readBitNot(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			let math = reader.readToken();
			let value = this.readBitNot(reader);
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
		const Vector = use("Runtime.Vector");
		const OpMath = use("BayLang.OpCodes.OpMath");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let operations = Vector.create(["&"]);
		/* Read operators */
		let op_code = this.readBitShift(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			let math = reader.readToken();
			let value = this.readBitShift(reader);
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
		const Vector = use("Runtime.Vector");
		const OpMath = use("BayLang.OpCodes.OpMath");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let operations = Vector.create(["|", "xor"]);
		/* Read operators */
		let op_code = this.readBitAnd(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			let math = reader.readToken();
			let value = this.readBitAnd(reader);
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
		const Vector = use("Runtime.Vector");
		const OpMath = use("BayLang.OpCodes.OpMath");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let operations = Vector.create(["*", "/", "%", "div", "mod"]);
		/* Read operators */
		let op_code = this.readBitOr(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			let math = reader.readToken();
			let value = this.readBitOr(reader);
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
		const Vector = use("Runtime.Vector");
		const OpCall = use("BayLang.OpCodes.OpCall");
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		const OpString = use("BayLang.OpCodes.OpString");
		const OpMath = use("BayLang.OpCodes.OpMath");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let operations = Vector.create(["+", "-"]);
		/* Read operators */
		let op_code = this.readFactor(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			let math = reader.readToken();
			let value = this.readFactor(reader);
			if (value instanceof OpCall && math == "+" && value.args.count() == 1 && value.item instanceof OpIdentifier && value.item.value == "String")
			{
				math = "~";
				value = value.args.get(0);
			}
			else if (value instanceof OpString && math == "+")
			{
				math = "~";
			}
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
		const Vector = use("Runtime.Vector");
		const OpMath = use("BayLang.OpCodes.OpMath");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let operations = Vector.create(["~"]);
		/* Read operators */
		let op_code = this.readArithmetic(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			let math = reader.readToken();
			let value = this.readArithmetic(reader);
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
		const Vector = use("Runtime.Vector");
		const OpMath = use("BayLang.OpCodes.OpMath");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let op_code = this.readConcat(reader);
		let operations1 = Vector.create(["===", "!==", "==", "!=", ">=", "<=", ">", "<"]);
		let operations2 = Vector.create(["is", "implements", "instanceof"]);
		/* Read operators */
		if (operations1.indexOf(reader.nextToken()) >= 0)
		{
			let math = reader.readToken();
			let value = this.readConcat(reader);
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
			let math = reader.readToken();
			let value = this.parser.parser_base.readTypeIdentifier(reader, false);
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
		const Vector = use("Runtime.Vector");
		const OpMath = use("BayLang.OpCodes.OpMath");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let operations = Vector.create(["and", "&&"]);
		/* Read operators */
		let op_code = this.readCompare(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			let math = reader.readToken();
			let value = this.readCompare(reader);
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
		const Vector = use("Runtime.Vector");
		const OpMath = use("BayLang.OpCodes.OpMath");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let operations = Vector.create(["or", "||"]);
		/* Read operators */
		let op_code = this.readAnd(reader);
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			let math = reader.readToken();
			let value = this.readAnd(reader);
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
		/* Try to read function */
		/*
		OpDeclareFunction op_code = this.parser.parser_function.tryReadFunction(reader);
		if (op_code) return op_code;
		*/
		return this.readOr(reader);
	}
	
	
	/**
	 * Read ternary operation
	 */
	readTernary(reader)
	{
		const OpTernary = use("BayLang.OpCodes.OpTernary");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		/* Detect ternary operation */
		let op_code = this.readElement(reader);
		if (reader.nextToken() != "?") return op_code;
		/* Read expression */
		reader.matchToken("?");
		let if_true = this.readElement(reader);
		let if_false = null;
		if (reader.nextToken() == ":")
		{
			reader.matchToken("?");
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
	static getClassName(){ return "BayLang.LangES6.ParserES6Expression"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangES6.ParserES6Expression);
module.exports = {
	"ParserES6Expression": BayLang.LangES6.ParserES6Expression,
};