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
BayLang.LangES6.ParserES6 = class extends use("BayLang.CoreParser")
{
	/**
	 * Returns true if registered variable
	 */
	isRegisteredVariable(name)
	{
		const Vector = use("Runtime.Vector");
		let variables = Vector.create([
			"console",
			"document",
			"window",
			"String",
		]);
		if (variables.indexOf(name) == -1) return false;
		return true;
	}
	
	
	/**
	 * Find variable
	 */
	findVariable(op_code)
	{
		let name = op_code.value;
		if (this.vars.has(name)) return;
		if (this.isRegisteredVariable(name)) return;
		throw op_code.caret_end.error("Unknown identifier '" + String(name) + String("'"));
	}
	
	
	/**
	 * Parse file and convert to BaseOpCode
	 */
	parse()
	{
		let reader = this.createReader();
		return this.parser_program.parse(reader);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const ParserES6Base = use("BayLang.LangES6.ParserES6Base");
		const ParserES6Expression = use("BayLang.LangES6.ParserES6Expression");
		const ParserES6Function = use("BayLang.LangES6.ParserES6Function");
		const ParserES6Operator = use("BayLang.LangES6.ParserES6Operator");
		const ParserES6Program = use("BayLang.LangES6.ParserES6Program");
		this.parser_base = new ParserES6Base(this);
		this.parser_expression = new ParserES6Expression(this);
		this.parser_function = new ParserES6Function(this);
		this.parser_operator = new ParserES6Operator(this);
		this.parser_program = new ParserES6Program(this);
	}
	static getClassName(){ return "BayLang.LangES6.ParserES6"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangES6.ParserES6);
module.exports = {
	"ParserES6": BayLang.LangES6.ParserES6,
};