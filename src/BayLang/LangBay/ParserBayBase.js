"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
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
BayLang.LangBay.ParserBayBase = class extends BaseObject
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
	 * Returns true if name is identifier
	 */
	static isIdentifier(name)
	{
		const Caret = use("BayLang.Caret");
		if (name == "") return false;
		if (name == "@") return true;
		if (Caret.isNumber(rs.charAt(name, 0))) return false;
		var sz = rs.strlen(name);
		for (var i = 0; i < sz; i++)
		{
			var ch = rs.charAt(name, i);
			if (Caret.isChar(ch) || Caret.isNumber(ch) || ch == "_") continue;
			return false;
		}
		return true;
	}
	
	
	/**
	 * Returns true if reserved words
	 */
	static isReserved(name)
	{
		if (rs.substr(name, 0, 3) == "__v") return true;
		return false;
	}
	
	
	/**
	 * Read number
	 */
	readNumber(reader, flag_negative)
	{
		const Caret = use("BayLang.Caret");
		const OpNumber = use("BayLang.OpCodes.OpNumber");
		if (flag_negative == undefined) flag_negative = false;
		var caret_start = reader.start();
		/* Read number */
		var value = reader.readToken();
		if (value == "")
		{
			throw caret_start.expected("Number");
		}
		if (!Caret.isNumber(value))
		{
			throw caret_start.expected("Number");
		}
		/* Look dot */
		if (reader.nextToken() == ".")
		{
			value += reader.readToken();
			value += reader.readToken();
		}
		/* Returns op_code */
		return new OpNumber(Map.create({
			"value": flag_negative ? ("-" + String(value)) : value,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read string
	 */
	readString(reader)
	{
		const OpString = use("BayLang.OpCodes.OpString");
		var caret_start = reader.caret();
		var str_char = reader.readToken();
		/* Read begin string char */
		if (str_char != "'" && str_char != "\"")
		{
			throw caret_start.expected("String");
		}
		/* Read string value */
		var caret = reader.caret();
		var value_str = "";
		var ch = caret.nextChar();
		while (!caret.eof() && ch != str_char)
		{
			if (ch == "\\")
			{
				caret.readChar();
				if (caret.eof())
				{
					throw caret.expected("End of string");
				}
				var ch2 = caret.readChar();
				if (ch2 == "n") value_str += "\n";
				else if (ch2 == "r") value_str += "\r";
				else if (ch2 == "t") value_str += "\t";
				else if (ch2 == "s") value_str += " ";
				else if (ch2 == "\\") value_str += "\\";
				else if (ch2 == "'") value_str += "'";
				else if (ch2 == "\"") value_str += "\"";
				else value_str += ch + String(ch2);
			}
			else
			{
				value_str += caret.readChar();
			}
			if (caret.eof())
			{
				throw caret.expected("End of string");
			}
			ch = caret.nextChar();
		}
		/* Read end string char */
		caret.matchString(str_char);
		/* Restore reader */
		reader.init(caret);
		/* Returns op_code */
		return new OpString(Map.create({
			"value": value_str,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read comment
	 */
	readComment(reader)
	{
		const OpComment = use("BayLang.OpCodes.OpComment");
		/* Init caret */
		var caret = reader.caret();
		caret.skip_comments = false;
		/* Caret start */
		var caret_start = caret.copy().skipSpace();
		/* Read begin coment */
		caret_start.matchString("/*");
		caret.seek(caret_start);
		/* Read comment value */
		var value_str = "";
		var ch2 = caret.nextString(2);
		while (!caret.eof() && ch2 != "*/")
		{
			value_str += caret.readChar();
			if (caret.eof())
			{
				throw caret.expected("End of comment");
			}
			ch2 = caret.nextString(2);
		}
		/* Restore reader */
		reader.init(caret);
		/* Read end coment */
		reader.matchToken("*");
		reader.matchToken("/");
		/* Returns op_code */
		return new OpComment(Map.create({
			"value": value_str,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Skip comment
	 */
	skipComment(reader)
	{
		if (reader.nextToken() != "/") return false;
		this.readComment(reader);
		return true;
	}
	
	
	/**
	 * Read identifier
	 */
	readIdentifier(reader)
	{
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		var caret_start = reader.start();
		/* Read identifier */
		var name = reader.readToken();
		if (!this.constructor.isIdentifier(name) || this.constructor.isReserved(name))
		{
			throw reader.expected("Identifier");
		}
		/* Returns op_code */
		return new OpIdentifier(Map.create({
			"value": name,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read entity name
	 */
	readEntityName(reader)
	{
		const OpEntityName = use("BayLang.OpCodes.OpEntityName");
		var caret_start = reader.start();
		var items = [];
		/* Read name */
		items.push(this.readIdentifier(reader));
		/* Read names */
		while (reader.nextToken() == ".")
		{
			reader.readToken();
			items.push(this.readIdentifier(reader));
		}
		/* Returns op_code */
		return new OpEntityName(Map.create({
			"items": items,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read type identifier
	 */
	readTypeIdentifier(reader, find_entity, read_generic)
	{
		const OpTypeIdentifier = use("BayLang.OpCodes.OpTypeIdentifier");
		if (find_entity == undefined) find_entity = true;
		if (read_generic == undefined) read_generic = true;
		var caret_start = reader.start();
		var entity_name = this.readEntityName(reader);
		/* Find entity */
		if (find_entity) this.parser.findEntity(entity_name);
		/* Read generics */
		var generics = [];
		if (reader.nextToken() == "<" && read_generic)
		{
			reader.matchToken("<");
			reader.main_caret.skipToken();
			while (!reader.eof() && reader.main_caret.nextChar() != ">")
			{
				generics.push(this.readTypeIdentifier(reader, false));
				reader.main_caret.skipToken();
				reader.init(reader.main_caret);
				if (reader.main_caret.nextChar() != ">")
				{
					reader.matchToken(",");
				}
			}
			reader.main_caret.matchString(">");
			reader.init(reader.main_caret);
		}
		return new OpTypeIdentifier(Map.create({
			"entity_name": entity_name,
			"generics": generics,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read collection
	 */
	readCollection(reader)
	{
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		const OpCollection = use("BayLang.OpCodes.OpCollection");
		var caret_start = reader.start();
		reader.matchToken("[");
		var items = [];
		while (!reader.eof() && reader.nextToken() != "]")
		{
			if (this.skipComment(reader))
			{
				continue;
			}
			var op_code_item = null;
			/* Prepocessor */
			var is_preprocessor = false;
			var next_token = reader.nextToken();
			if (next_token == "#switch" || next_token == "#ifcode" || next_token == "#ifdef")
			{
				is_preprocessor = true;
				op_code_item = this.parser.parser_preprocessor.readPreprocessor(reader, OpPreprocessorIfDef.KIND_COLLECTION);
			}
			else
			{
				op_code_item = this.parser.parser_expression.readExpression(reader);
			}
			items.push(op_code_item);
			if ((reader.nextToken() == "," || reader.nextToken() != "]") && !is_preprocessor)
			{
				reader.matchToken(",");
			}
		}
		reader.matchToken("]");
		return new OpCollection(Map.create({
			"items": items,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read collection
	 */
	readDict(reader)
	{
		const OpDictPair = use("BayLang.OpCodes.OpDictPair");
		const OpDict = use("BayLang.OpCodes.OpDict");
		var caret_start = reader.start();
		reader.matchToken("{");
		var items = [];
		while (!reader.eof() && reader.nextToken() != "}")
		{
			if (reader.nextToken() == "/")
			{
				this.readComment(reader);
				continue;
			}
			var is_preprocessor = false;
			var condition = null;
			/* Prepocessor */
			var next_token = reader.nextToken();
			if (next_token == "#ifdef")
			{
				is_preprocessor = true;
				reader.matchToken("#ifdef");
				condition = this.parser.parser_expression.readExpression(reader);
				reader.matchToken("then");
			}
			var op_code_name = this.readString(reader);
			reader.matchToken(":");
			var op_code_item = this.parser.parser_expression.readExpression(reader);
			items.push(new OpDictPair(Map.create({
				"key": op_code_name,
				"expression": op_code_item,
				"condition": condition,
			})));
			if (reader.nextToken() == "," || reader.nextToken() != "}")
			{
				reader.matchToken(",");
			}
			if (is_preprocessor)
			{
				reader.matchToken("#endif");
			}
		}
		reader.matchToken("}");
		return new OpDict(Map.create({
			"items": items,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read new instance
	 */
	readNew(reader)
	{
		const OpNew = use("BayLang.OpCodes.OpNew");
		var caret_start = reader.start();
		reader.matchToken("new");
		var pattern = this.readTypeIdentifier(reader);
		var args = [];
		if (reader.nextToken() == "{")
		{
			var item = this.readDict(reader);
			args = [item];
		}
		else if (reader.nextToken() == "(")
		{
			args = this.parser.parser_function.readFunctionArgs(reader);
		}
		return new OpNew(Map.create({
			"args": args,
			"pattern": pattern,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read classof
	 */
	readClassOf(reader)
	{
		const OpClassOf = use("BayLang.OpCodes.OpClassOf");
		var caret_start = reader.start();
		reader.matchToken("classof");
		var entity_name = this.readEntityName(reader);
		return new OpClassOf(Map.create({
			"entity_name": entity_name,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read item
	 */
	readItem(reader)
	{
		const Caret = use("BayLang.Caret");
		var next_token = reader.nextToken();
		if (Caret.isNumber(next_token))
		{
			return this.readNumber(reader);
		}
		else if (next_token == "'" || next_token == "\"")
		{
			return this.readString(reader);
		}
		else if (next_token == "new")
		{
			return this.readNew(reader);
		}
		else if (next_token == "classof")
		{
			return this.readClassOf(reader);
		}
		return this.readIdentifier(reader);
	}
	
	
	/**
	 * Read dynamic
	 */
	readDynamic(reader, read_function)
	{
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		const OpTypeIdentifier = use("BayLang.OpCodes.OpTypeIdentifier");
		const OpEntityName = use("BayLang.OpCodes.OpEntityName");
		const OpAttr = use("BayLang.OpCodes.OpAttr");
		if (read_function == undefined) read_function = true;
		var caret_start = reader.start();
		/* Read await */
		var is_await = false;
		if (reader.nextToken() == "await")
		{
			is_await = true;
			reader.matchToken("await");
		}
		var item = this.readItem(reader);
		if (reader.nextToken() == ".")
		{
			this.parser.findVariable(item);
		}
		var operations = [".", "::", "[", "("];
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			var next_token = reader.nextToken();
			if (next_token == "." || next_token == "::")
			{
				if (next_token == "::" && item instanceof OpIdentifier)
				{
					item = new OpTypeIdentifier(Map.create({
						"entity_name": new OpEntityName(Map.create({
							"items": [item],
							"caret_start": item.caret_start,
							"caret_end": item.caret_end,
						})),
						"caret_start": item.caret_start,
						"caret_end": item.caret_end,
					}));
				}
				reader.matchToken(next_token);
				var op_code_item = this.readIdentifier(reader);
				item = new OpAttr(Map.create({
					"kind": (next_token == ".") ? OpAttr.KIND_ATTR : OpAttr.KIND_STATIC,
					"prev": item,
					"next": op_code_item,
					"caret_start": caret_start,
					"caret_end": reader.caret(),
				}));
			}
			else if (next_token == "(")
			{
				if (read_function)
				{
					item = this.parser.parser_function.readCallFunction(reader, item);
					item.is_await = is_await;
					item.caret_start = caret_start;
				}
				else
				{
					break;
				}
			}
			else if (next_token == "[")
			{
				var op_code_item = this.readCollection(reader);
				item = new OpAttr(Map.create({
					"kind": OpAttr.KIND_DYNAMIC,
					"prev": item,
					"next": op_code_item,
					"caret_start": caret_start,
					"caret_end": reader.caret(),
				}));
			}
		}
		return item;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.parser = null;
	}
	static getClassName(){ return "BayLang.LangBay.ParserBayBase"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.LangBay.ParserBayBase);
module.exports = {
	"ParserBayBase": BayLang.LangBay.ParserBayBase,
};