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
BayLang.LangES6.ParserES6Program = class extends use("Runtime.BaseObject")
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
	 * Read module
	 */
	readModuleItem(reader)
	{
		return this.parser.parser_operator.readOperator(reader);
	}
	
	
	/**
	 * Parse program
	 */
	parse(reader)
	{
		const Vector = use("Runtime.Vector");
		const OpModule = use("BayLang.OpCodes.OpModule");
		const Map = use("Runtime.Map");
		let items = new Vector();
		let caret_start = reader.start();
		/* Read module */
		while (!reader.eof() && reader.nextToken() != "")
		{
			let next_token = reader.nextToken();
			/* Read module item */
			let op_code = this.readModuleItem(reader);
			if (op_code)
			{
				items.push(op_code);
			}
			else
			{
				break;
			}
			/* Match semicolon */
			if (reader.nextToken() == ";")
			{
				reader.matchToken(";");
			}
		}
		/* Returns op_code */
		return new OpModule(Map.create({
			"caret_start": caret_start,
			"caret_end": reader.caret(),
			"items": items,
		}));
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.parser = null;
	}
	static getClassName(){ return "BayLang.LangES6.ParserES6Program"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangES6.ParserES6Program);
module.exports = {
	"ParserES6Program": BayLang.LangES6.ParserES6Program,
};