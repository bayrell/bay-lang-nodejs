"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
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
BayLang.LangES6.ParserES6Base = class extends use("Runtime.BaseObject")
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
		if (Caret.isNumber(rs.charAt(name, 0))) return false;
		let sz = rs.strlen(name);
		for (let i = 0; i < sz; i++)
		{
			let ch = rs.charAt(name, i);
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
		const Map = use("Runtime.Map");
		if (flag_negative == undefined) flag_negative = false;
		let caret_start = reader.start();
		/* Read number */
		let value = reader.readToken();
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
			"value": flag_negative ? "-" + String(value) : value,
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
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let str_char = reader.readToken();
		/* Read begin string char */
		if (str_char != "'" && str_char != "\"")
		{
			throw caret_start.expected("String");
		}
		/* Read string value */
		let caret = reader.caret();
		let value_str = "";
		let ch = caret.nextChar();
		while (!caret.eof() && ch != str_char)
		{
			if (ch == "\\")
			{
				caret.readChar();
				if (caret.eof())
				{
					throw caret.expected("End of string");
				}
				let ch2 = caret.readChar();
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
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let str_char = reader.readToken();
		/* Read begin coment */
		reader.matchToken("/");
		reader.matchToken("*");
		/* Read comment value */
		let caret = reader.caret();
		let value_str = "";
		let ch2 = caret.nextString(2);
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
	 * Read identifier
	 */
	readIdentifier(reader)
	{
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		/* Read identifier */
		let name = reader.readToken();
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
		const Vector = use("Runtime.Vector");
		const OpEntityName = use("BayLang.OpCodes.OpEntityName");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let items = new Vector();
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
	readTypeIdentifier(reader, read_generic)
	{
		const OpTypeIdentifier = use("BayLang.OpCodes.OpTypeIdentifier");
		const Map = use("Runtime.Map");
		const OpEntityName = use("BayLang.OpCodes.OpEntityName");
		const Vector = use("Runtime.Vector");
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		if (read_generic == undefined) read_generic = true;
		let caret_start = reader.start();
		/* Read var */
		if (reader.nextToken() == "var")
		{
			reader.readToken();
			let caret_end = reader.caret();
			return new OpTypeIdentifier(Map.create({
				"entity_name": new OpEntityName(Map.create({
					"items": new Vector(
						new OpIdentifier(Map.create({
							"value": "var",
							"caret_start": caret_start,
							"caret_end": caret_end,
						})),
					),
					"caret_start": caret_start,
					"caret_end": caret_end,
				})),
				"caret_start": caret_start,
				"caret_end": caret_end,
			}));
		}
		/* Read entity name */
		let entity_name = this.readEntityName(reader);
		return new OpTypeIdentifier(Map.create({
			"entity_name": entity_name,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read collection
	 */
	readCollection(reader)
	{
	}
	
	
	/**
	 * Read collection
	 */
	readDict(reader)
	{
	}
	
	
	/**
	 * Read new instance
	 */
	readNew(reader)
	{
	}
	
	
	/**
	 * Read item
	 */
	readItem(reader)
	{
		const Caret = use("BayLang.Caret");
		if (Caret.isNumber(reader.nextToken()))
		{
			return this.readNumber(reader);
		}
		else if (reader.nextToken() == "'" || reader.nextToken() == "\"")
		{
			return this.readString(reader);
		}
		return this.readIdentifier(reader);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.parser = null;
	}
	static getClassName(){ return "BayLang.LangES6.ParserES6Base"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangES6.ParserES6Base);
module.exports = {
	"ParserES6Base": BayLang.LangES6.ParserES6Base,
};