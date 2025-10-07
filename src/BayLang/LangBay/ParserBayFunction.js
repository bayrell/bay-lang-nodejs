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
BayLang.LangBay.ParserBayFunction = class extends BaseObject
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
	readFunctionArgs(reader)
	{
		reader.matchToken("(");
		var args = [];
		while (!reader.eof() && reader.nextToken() != ")")
		{
			var expression = this.parser.parser_expression.readExpression(reader);
			args.push(expression);
			if (reader.nextToken() != ")")
			{
				reader.matchToken(",");
			}
		}
		reader.matchToken(")");
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
		if (pattern == undefined) pattern = null;
		var caret_start = reader.start();
		/* Read identifier */
		var is_await = false;
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
		var args = this.readFunctionArgs(reader);
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
	readDeclareFunctionArgs(reader)
	{
		const OpDeclareFunctionArg = use("BayLang.OpCodes.OpDeclareFunctionArg");
		const OpItems = use("BayLang.OpCodes.OpItems");
		var caret_start = reader.start();
		var items = [];
		reader.matchToken("(");
		while (!reader.eof() && reader.nextToken() != ")")
		{
			var caret_start_item = reader.start();
			/* Read argument */
			var pattern = this.parser.parser_base.readTypeIdentifier(reader);
			var name = this.parser.parser_base.readIdentifier(reader);
			var expression = null;
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
			if (reader.nextToken() != ")")
			{
				reader.matchToken(",");
			}
		}
		reader.matchToken(")");
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
		if (reader.nextToken() != "use") return [];
		var items = [];
		reader.matchToken("use");
		reader.matchToken("(");
		while (!reader.eof() && reader.nextToken() != ")")
		{
			var item = this.parser.parser_base.readIdentifier(reader);
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
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");
		if (read_name == undefined) read_name = true;
		var caret_start = reader.start();
		/* Read async */
		var is_async = false;
		if (reader.nextToken() == "async")
		{
			is_async = true;
			reader.matchToken("async");
		}
		var flags = new OpFlags(Map.create({
			"items": Map.create({
				"async": is_async,
			}),
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
		/* Read function name */
		var name = "";
		var content = null;
		var pattern = this.parser.parser_base.readTypeIdentifier(reader);
		if (read_name) name = this.parser.parser_base.readIdentifier(reader).value;
		var args = this.readDeclareFunctionArgs(reader);
		var vars = this.readDeclareFunctionUse(reader);
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
		var save_caret = reader.caret();
		var error = false;
		try
		{
			if (reader.nextToken() == "async") reader.matchToken("async");
			var pattern = this.parser.parser_base.readTypeIdentifier(reader);
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
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.LangBay.ParserBayFunction);
module.exports = {
	"ParserBayFunction": BayLang.LangBay.ParserBayFunction,
};