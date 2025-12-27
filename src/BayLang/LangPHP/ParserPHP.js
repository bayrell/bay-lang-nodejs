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
if (typeof BayLang.LangPHP == 'undefined') BayLang.LangPHP = {};
BayLang.LangPHP.ParserPHP = class extends use("BayLang.CoreParser")
{
	/**
	 * Returns true if registered variable
	 */
	isRegisteredVariable(name)
	{
		const Vector = use("Runtime.Vector");
		let variables = Vector.create([
			"echo",
		]);
		if (variables.indexOf(name) == -1) return false;
		return true;
	}
	
	
	/**
	 * Add variable
	 */
	addVariable(op_code)
	{
		let name = op_code.value;
		this.vars.set(name, true);
	}
	
	
	/**
	 * Find variable
	 */
	findVariable(op_code)
	{
		let name = op_code.value;
		if (this.vars.has(name)) return true;
		if (this.isRegisteredVariable(name)) return true;
		return false;
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
		const ParserPHPBase = use("BayLang.LangPHP.ParserPHPBase");
		const ParserPHPExpression = use("BayLang.LangPHP.ParserPHPExpression");
		const ParserPHPFunction = use("BayLang.LangPHP.ParserPHPFunction");
		const ParserPHPOperator = use("BayLang.LangPHP.ParserPHPOperator");
		const ParserPHPProgram = use("BayLang.LangPHP.ParserPHPProgram");
		this.parser_base = new ParserPHPBase(this);
		this.parser_expression = new ParserPHPExpression(this);
		this.parser_function = new ParserPHPFunction(this);
		this.parser_operator = new ParserPHPOperator(this);
		this.parser_program = new ParserPHPProgram(this);
	}
	static getClassName(){ return "BayLang.LangPHP.ParserPHP"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangPHP.ParserPHP);
module.exports = {
	"ParserPHP": BayLang.LangPHP.ParserPHP,
};