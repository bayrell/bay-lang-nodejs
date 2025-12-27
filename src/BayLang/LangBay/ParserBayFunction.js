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
BayLang.LangBay.ParserBayFunction = class extends use("Runtime.BaseObject")
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
	 * Read function arguments
	 */
	readFunctionArgs(reader, match_brackets)
	{
		const Vector = use("Runtime.Vector");
		if (match_brackets == undefined) match_brackets = true;
		if (match_brackets) reader.matchToken("(");
		let args = Vector.create([]);
		while (!reader.eof() && reader.nextToken() != ")")
		{
			let expression = this.parser.parser_expression.readExpression(reader);
			args.push(expression);
			if (reader.nextToken() != ")")
			{
				reader.matchToken(",");
			}
		}
		if (match_brackets) reader.matchToken(")");
		return args;
	}
	
	
	/**
	 * Read call function
	 */
	readCallFunction(reader, pattern)
	{
		const OpTypeIdentifier = use("BayLang.OpCodes.OpTypeIdentifier");
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		const OpCall = use("BayLang.OpCodes.OpCall");
		const Map = use("Runtime.Map");
		if (pattern == undefined) pattern = null;
		let caret_start = reader.start();
		/* Read identifier */
		let is_await = false;
		if (pattern == null)
		{
			if (reader.nextToken() == "await")
			{
				is_await = true;
				reader.matchToken("await");
			}
			pattern = this.parser.parser_base.readDynamic(reader, false);
		}
		/* Next token should be bracket */
		if (reader.nextToken() != "(") return null;
		/* Find identifier */
		if (pattern instanceof OpTypeIdentifier) pattern = pattern.entity_name.items.last();
		else if (pattern instanceof OpIdentifier)
		{
			this.parser.findVariable(pattern);
		}
		/* Read arguments */
		let args = this.readFunctionArgs(reader);
		return new OpCall(Map.create({
			"args": args,
			"item": pattern,
			"is_await": is_await,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read function args
	 */
	readDeclareFunctionArgs(reader, match_brackets, end_tag)
	{
		const Vector = use("Runtime.Vector");
		const OpDeclareFunctionArg = use("BayLang.OpCodes.OpDeclareFunctionArg");
		const Map = use("Runtime.Map");
		const OpItems = use("BayLang.OpCodes.OpItems");
		if (match_brackets == undefined) match_brackets = true;
		if (end_tag == undefined) end_tag = "";
		let caret_start = reader.start();
		let items = Vector.create([]);
		if (match_brackets) reader.matchToken("(");
		while (!reader.eof() && reader.nextToken() != ")" && reader.nextToken() != end_tag)
		{
			let caret_start_item = reader.start();
			/* Read argument */
			let pattern = this.parser.parser_base.readTypeIdentifier(reader);
			let name = this.parser.parser_base.readIdentifier(reader);
			let expression = null;
			/* Read expression */
			if (reader.nextToken() == "=")
			{
				reader.matchToken("=");
				expression = this.parser.parser_expression.readExpression(reader);
			}
			/* Add item */
			this.parser.addVariable(name, pattern);
			items.push(new OpDeclareFunctionArg(Map.create({
				"pattern": pattern,
				"name": name.value,
				"expression": expression,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			})));
			if (reader.nextToken() != ")" && reader.nextToken() != end_tag)
			{
				reader.matchToken(",");
			}
		}
		if (match_brackets) reader.matchToken(")");
		return new OpItems(Map.create({
			"items": items,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read function variables
	 */
	readDeclareFunctionUse(reader)
	{
		const Vector = use("Runtime.Vector");
		if (reader.nextToken() != "use") return Vector.create([]);
		let items = Vector.create([]);
		reader.matchToken("use");
		reader.matchToken("(");
		while (!reader.eof() && reader.nextToken() != ")")
		{
			let item = this.parser.parser_base.readIdentifier(reader);
			items.push(item);
			if (reader.nextToken() != ")") reader.matchToken(",");
		}
		reader.matchToken(")");
		return items;
	}
	
	
	/**
	 * Read function
	 */
	readDeclareFunction(reader, read_name)
	{
		const OpFlags = use("BayLang.OpCodes.OpFlags");
		const Map = use("Runtime.Map");
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");
		if (read_name == undefined) read_name = true;
		let caret_start = reader.start();
		/* Read async */
		let is_async = false;
		if (reader.nextToken() == "async")
		{
			is_async = true;
			reader.matchToken("async");
		}
		let flags = new OpFlags(Map.create({
			"items": Map.create({
				"async": is_async,
			}),
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
		/* Read function name */
		let name = "";
		let content = null;
		let pattern = this.parser.parser_base.readTypeIdentifier(reader);
		if (read_name) name = this.parser.parser_base.readIdentifier(reader).value;
		let args = this.readDeclareFunctionArgs(reader);
		let vars = this.readDeclareFunctionUse(reader);
		/* Read content */
		if (this.parser.current_class != null && this.parser.current_class.kind == OpDeclareClass.KIND_INTERFACE)
		{
			if (reader.nextToken() == "{")
			{
				reader.matchToken("{");
				reader.matchToken("}");
			}
			else
			{
				reader.matchToken(";");
			}
		}
		else if (reader.nextToken() == "{") content = this.parser.parser_operator.parse(reader);
		else
		{
			reader.matchToken("=>");
			content = this.parser.parser_expression.readExpression(reader);
		}
		return new OpDeclareFunction(Map.create({
			"args": args,
			"flags": flags,
			"name": name,
			"vars": vars,
			"pattern": pattern,
			"content": content,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Try to read function
	 */
	tryReadFunction(reader, read_name)
	{
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		const ParserError = use("BayLang.Exceptions.ParserError");
		if (read_name == undefined) read_name = true;
		let save_caret = reader.caret();
		let error = false;
		try
		{
			if (reader.nextToken() == "async") reader.matchToken("async");
			let pattern = this.parser.parser_base.readTypeIdentifier(reader);
			if (read_name) this.parser.parser_base.readIdentifier(reader);
			/* Read function args */
			reader.matchToken("(");
			while (!reader.eof() && reader.nextToken() != ")")
			{
				this.parser.parser_base.readTypeIdentifier(reader, false);
				this.parser.parser_base.readIdentifier(reader);
				if (reader.nextToken() == "=")
				{
					reader.matchToken("=");
					this.parser.parser_expression.readExpression(reader);
				}
				if (reader.nextToken() != ")") reader.matchToken(",");
			}
			reader.matchToken(")");
			/* Read use */
			if (reader.nextToken() == "use")
			{
				reader.matchToken("use");
				reader.matchToken("(");
				while (!reader.eof() && reader.nextToken() != ")")
				{
					this.parser.parser_base.readIdentifier(reader);
					if (reader.nextToken() != ")") reader.matchToken(",");
				}
				reader.matchToken(")");
			}
			if (this.parser.current_class != null && this.parser.current_class.kind == OpDeclareClass.KIND_INTERFACE && reader.nextToken() == ";")
			{
				reader.matchToken(";");
			}
			else if (reader.nextToken() != "=>" && reader.nextToken() != "use")
			{
				reader.matchToken("{");
			}
		}
		catch (_ex)
		{
			if (_ex instanceof ParserError)
			{
				var e = _ex;
				error = true;
			}
			else
			{
				throw _ex;
			}
		}
		reader.init(save_caret);
		if (error) return null;
		return this.readDeclareFunction(reader, read_name);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.parser = null;
	}
	static getClassName(){ return "BayLang.LangBay.ParserBayFunction"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangBay.ParserBayFunction);
module.exports = {
	"ParserBayFunction": BayLang.LangBay.ParserBayFunction,
};