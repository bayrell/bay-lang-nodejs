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
if (typeof BayLang.LangBay == 'undefined') BayLang.LangBay = {};
BayLang.LangBay.ParserBayExpression = class extends use("Runtime.BaseObject")
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
		let save_caret = reader.caret();
		/* Read expression */
		if (reader.nextToken() == "(")
		{
			reader.matchToken("(");
			let op_code = this.readExpression(reader);
			reader.matchToken(")");
			return op_code;
		}
		else if (reader.nextToken() == "await")
		{
			return this.readAwait(reader);
		}
		/* Read op_code */
		let op_code = this.parser.parser_base.readDynamic(reader);
		if (op_code instanceof OpIdentifier && this.parser.find_variable)
		{
			this.parser.useVariable(op_code);
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
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		if (reader.nextToken() == "-")
		{
			reader.readToken();
			let op_code = this.readItem(reader);
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
		const Vector = use("Runtime.Vector");
		const OpMath = use("BayLang.OpCodes.OpMath");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let operations = Vector.create(["not", "bitnot", "!"]);
		if (operations.indexOf(reader.nextToken()) >= 0)
		{
			let op = reader.readToken();
			if (op == "!") op = "not";
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
			let value = this.parser.parser_base.readTypeIdentifier(reader, true, false);
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
	 * Read await
	 */
	readAwait(reader)
	{
		const OpAwait = use("BayLang.OpCodes.OpAwait");
		const Map = use("Runtime.Map");
		let caret_start = reader.caret();
		reader.matchToken("await");
		let op_code = this.parser.parser_base.readDynamic(reader);
		return new OpAwait(Map.create({
			"caret_start": caret_start,
			"caret_end": reader.caret(),
			"item": op_code,
		}));
	}
	
	
	/**
	 * Read method
	 */
	readMethod(reader)
	{
		const OpAttr = use("BayLang.OpCodes.OpAttr");
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		const OpMethod = use("BayLang.OpCodes.OpMethod");
		const Map = use("Runtime.Map");
		let caret_start = reader.caret();
		reader.matchToken("method");
		let op_code = this.parser.parser_base.readDynamic(reader);
		if (!(op_code instanceof OpAttr))
		{
			throw reader.expected("Attribute");
		}
		if (!(op_code.next instanceof OpIdentifier))
		{
			throw reader.expected("Identifier");
		}
		let value1 = op_code.prev;
		let value2 = op_code.next.value;
		return new OpMethod(Map.create({
			"caret_start": caret_start,
			"caret_end": reader.caret(),
			"value1": value1,
			"value2": value2,
		}));
	}
	
	
	/**
	 * Read element
	 */
	readElement(reader)
	{
		/* Read vector */
		if (reader.nextToken() == "[")
		{
			return this.parser.parser_base.readCollection(reader);
		}
		else if (reader.nextToken() == "{")
		{
			return this.parser.parser_base.readDict(reader);
		}
		else if (reader.nextToken() == "<")
		{
			return this.parser.parser_html.readTemplate(reader);
		}
		else if (reader.nextToken() == "method")
		{
			return this.readMethod(reader);
		}
		/* Try to read function */
		let op_code = this.parser.parser_function.tryReadFunction(reader, false);
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
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		/* Detect ternary operation */
		let op_code = this.readElement(reader);
		if (reader.nextToken() != "?") return op_code;
		/* Read expression */
		reader.matchToken("?");
		let if_true = this.readTernary(reader);
		let if_false = null;
		if (reader.nextToken() == ":")
		{
			reader.matchToken(":");
			if_false = this.readTernary(reader);
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
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangBay.ParserBayExpression);
module.exports = {
	"ParserBayExpression": BayLang.LangBay.ParserBayExpression,
};