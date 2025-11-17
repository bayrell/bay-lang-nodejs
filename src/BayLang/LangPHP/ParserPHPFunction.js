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
if (typeof BayLang.LangPHP == 'undefined') BayLang.LangPHP = {};
BayLang.LangPHP.ParserPHPFunction = class extends use("Runtime.BaseObject")
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
		if (pattern instanceof OpEntityName)
		{
			return pattern.items.first();
		}
		else if (pattern instanceof OpIdentifier)
		{
			if (pattern.value == "echo") pattern.value = "print";
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
			pattern = this.parser.parser_base.readItem(reader);
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
	static getClassName(){ return "BayLang.LangPHP.ParserPHPFunction"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangPHP.ParserPHPFunction);
module.exports = {
	"ParserPHPFunction": BayLang.LangPHP.ParserPHPFunction,
};