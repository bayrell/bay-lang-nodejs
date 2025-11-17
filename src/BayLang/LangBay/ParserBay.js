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
if (typeof BayLang.LangBay == 'undefined') BayLang.LangBay = {};
BayLang.LangBay.ParserBay = class extends use("BayLang.CoreParser")
{
	/**
	 * Returns true if registered variable
	 */
	isRegisteredVariable(name)
	{
		const Vector = use("Runtime.Vector");
		let variables = new Vector(
			"print",
			"var_dump",
			"rs",
			"rtl",
			"parent",
			"this",
			"@",
			"null",
			"true",
			"false",
			"document",
			"window",
		);
		if (variables.indexOf(name) == -1) return false;
		return true;
	}
	
	
	/**
	 * Returns true if system type
	 */
	isSystemType(name)
	{
		const Vector = use("Runtime.Vector");
		let variables = new Vector(
			"var",
			"void",
			"bool",
			"byte",
			"int",
			"char",
			"real",
			"double",
			"string",
			"list",
			"scalar",
			"primitive",
			"html",
			"fn",
			"Error",
			"Object",
			"DateTime",
			"Collection",
			"Dict",
			"Vector",
			"Map",
			"ArrayInterface",
		);
		if (variables.indexOf(name) == -1) return false;
		return true;
	}
	
	
	/**
	 * Find identifier
	 */
	findIdentifier(op_code)
	{
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		let name = op_code.value;
		if (this.vars.has(name) || this.isRegisteredVariable(name))
		{
			op_code.kind = OpIdentifier.KIND_VARIABLE;
		}
		if (this.uses.has(name) || this.isSystemType(name))
		{
			op_code.kind = OpIdentifier.KIND_TYPE;
		}
	}
	
	
	/**
	 * Find variable
	 */
	findVariable(op_code)
	{
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		let name = op_code.value;
		this.findIdentifier(op_code);
		if (op_code.kind == OpIdentifier.KIND_VARIABLE) return;
		throw op_code.caret_end.error("Unknown variable '" + String(name) + String("'"));
	}
	
	
	/**
	 * Find type
	 */
	findType(op_code)
	{
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		let name = op_code.value;
		if (op_code.kind == OpIdentifier.KIND_TYPE) return;
		throw op_code.caret_end.error("Unknown type '" + String(name) + String("'"));
	}
	
	
	/**
	 * Find entity
	 */
	findEntity(op_code)
	{
		/* Find name */
		if (op_code.items.count() != 1) return;
		let op_code_item = op_code.items.get(0);
		if (this.uses.has(op_code_item.value)) return;
		if (this.isSystemType(op_code_item.value)) return;
		throw op_code.caret_end.error("Unknown identifier '" + String(op_code_item.value) + String("'"));
	}
	
	
	/**
	 * Add use
	 */
	addGenericUse(items)
	{
		if (items && items.count() > 0)
		{
			for (let i = 0; i < items.count(); i++)
			{
				let item = items.get(i);
				this.uses.set(item.entity_name.getName(), item);
				this.addGenericUse(item.generics);
			}
		}
	}
	
	
	/**
	 * Parse file and convert to BaseOpCode
	 */
	parse()
	{
		let reader = this.createReader();
		if (reader.nextToken() == "<")
		{
			return this.parser_html.parse(reader);
		}
		return this.parser_program.parse(reader);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const ParserBayBase = use("BayLang.LangBay.ParserBayBase");
		const ParserBayClass = use("BayLang.LangBay.ParserBayClass");
		const ParserBayExpression = use("BayLang.LangBay.ParserBayExpression");
		const ParserBayFunction = use("BayLang.LangBay.ParserBayFunction");
		const ParserBayHtml = use("BayLang.LangBay.ParserBayHtml");
		const ParserBayOperator = use("BayLang.LangBay.ParserBayOperator");
		const ParserBayPreprocessor = use("BayLang.LangBay.ParserBayPreprocessor");
		const ParserBayProgram = use("BayLang.LangBay.ParserBayProgram");
		this.parser_base = new ParserBayBase(this);
		this.parser_class = new ParserBayClass(this);
		this.parser_expression = new ParserBayExpression(this);
		this.parser_function = new ParserBayFunction(this);
		this.parser_html = new ParserBayHtml(this);
		this.parser_operator = new ParserBayOperator(this);
		this.parser_preprocessor = new ParserBayPreprocessor(this);
		this.parser_program = new ParserBayProgram(this);
	}
	static getClassName(){ return "BayLang.LangBay.ParserBay"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangBay.ParserBay);
module.exports = {
	"ParserBay": BayLang.LangBay.ParserBay,
};