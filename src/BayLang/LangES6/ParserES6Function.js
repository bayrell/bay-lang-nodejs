"use strict;"
const use = require('bay-lang').use;
/*
!
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
BayLang.LangES6.ParserES6Function = class extends use("Runtime.BaseObject")
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
	 * Returns pattern
	 */
	getPattern(pattern)
	{
		const OpEntityName = use("BayLang.OpCodes.OpEntityName");
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		const Map = use("Runtime.Map");
		if (pattern instanceof OpEntityName)
		{
			if (pattern.items.count() == 2 && pattern.items.get(0).value == "console" && pattern.items.get(1).value == "log")
			{
				return new OpIdentifier(Map.create({
					"value": "print",
					"caret_start": pattern.caret_start,
					"caret_end": pattern.caret_end,
				}));
			}
			else
			{
				return pattern.items.first();
			}
		}
		return pattern;
	}
	
	
	/**
	 * Read call function
	 */
	readCallFunction(reader, pattern)
	{
		const Vector = use("Runtime.Vector");
		const OpCall = use("BayLang.OpCodes.OpCall");
		const Map = use("Runtime.Map");
		if (pattern == undefined) pattern = null;
		let caret_start = reader.start();
		/* Read identifier */
		if (pattern == null)
		{
			if (!this.parser.parser_base.isIdentifier(reader.nextToken())) return null;
			pattern = this.parser.parser_base.readEntityName(reader);
		}
		/* Next token should be bracket */
		if (reader.nextToken() != "(") return null;
		/* Update pattern */
		pattern = this.getPattern(pattern);
		/* Read arguments */
		reader.matchToken("(");
		let args = new Vector();
		while (!reader.eof() && reader.nextToken() != ")")
		{
			let expression = this.parser.parser_expression.readExpression(reader);
			args.push(expression);
			if (reader.nextToken() == ",")
			{
				reader.matchToken(",");
			}
		}
		reader.matchToken(")");
		return new OpCall(Map.create({
			"args": args,
			"item": pattern,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.parser = null;
	}
	static getClassName(){ return "BayLang.LangES6.ParserES6Function"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangES6.ParserES6Function);
module.exports = {
	"ParserES6Function": BayLang.LangES6.ParserES6Function,
};