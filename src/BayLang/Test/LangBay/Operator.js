"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
const Test = use("Runtime.Unit.Test");
const Map = use("Runtime.Map");
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
if (typeof BayLang.Test == 'undefined') BayLang.Test = {};
if (typeof BayLang.Test.LangBay == 'undefined') BayLang.Test.LangBay = {};
BayLang.Test.LangBay.Operator = class
{
	/**
	 * Reset
	 */
	reset()
	{
		const ParserBay = use("BayLang.LangBay.ParserBay");
		const TranslatorBay = use("BayLang.LangBay.TranslatorBay");
		this.parser = new ParserBay();
		this.parser = this.parser.reset(this.parser);
		this.translator = new TranslatorBay();
		this.translator.reset();
	}
	
	
	/**
	 * Set content
	 */
	setContent(content)
	{
		this.parser.setContent(content);
	}
	
	
	/**
	 * Add variable
	 */
	addVar(var_name)
	{
		let parser = this.parser;
		parser.vars.set(var_name, true);
		this.parser = parser;
	}
	
	
	/**
	 * Translate
	 */
	translate(content, debug)
	{
		const Vector = use("Runtime.Vector");
		if (debug == undefined) debug = false;
		let result = Vector.create([]);
		this.setContent(content);
		/* Parse */
		let res = this.parser.parser_operator.readOperators(this.parser);
		let op_code = res.get(1);
		/* Translate */
		this.translator.operator.translateItems(op_code, result);
		/* Debug output */
		if (debug)
		{
			console.log(op_code);
			console.log(result);
			console.log(rs.join("", result));
		}
		return Vector.create([op_code, rs.join("", result)]);
	}
	
	
	testAssign1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"{",
			"\tint a;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testAssign2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"{",
			"\tint a = 1;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testAssign3()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"{",
			"\tint a = 1;",
			"\ta = 2;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testAssign4()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"{",
			"\tint a = 1, b = 2;",
			"\ta = a + b;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testAssign5()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"{",
			"\tthis.a = 1;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testAssign6()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"{",
			"\tCollection<string> content = [];",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testAssign7()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("content");
		let content = rs.join("\n", Vector.create([
			"{",
			"\tstring content = rs::join(\"\\n\", content);",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testBreak()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"{",
			"\tbreak;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testContinue()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"{",
			"\tcontinue;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testReturn1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"{",
			"\treturn;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testReturn2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"{",
			"\treturn 1;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testReturn3()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"{",
			"\treturn true;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testReturn4()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"{",
			"\treturn this.result;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testInc1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		let content = rs.join("\n", Vector.create([
			"{",
			"\ta++;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testInc2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		let content = rs.join("\n", Vector.create([
			"{",
			"\t++a;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testDec1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		let content = rs.join("\n", Vector.create([
			"{",
			"\ta--;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testDec2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		let content = rs.join("\n", Vector.create([
			"{",
			"\t--a;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFor1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("io");
		let content = rs.join("\n", Vector.create([
			"{",
			"\tfor (int i = 0; i < 10; i++)",
			"\t{",
			"\t\tio::print(i);",
			"\t}",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testIf1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("b");
		this.addVar("io");
		let content = rs.join("\n", Vector.create([
			"{",
			"\tif (a > b)",
			"\t{",
			"\t\tio::print(\"Yes\");",
			"\t}",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testIf2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("b");
		this.addVar("io");
		let content = rs.join("\n", Vector.create([
			"{",
			"\tif (a > b)",
			"\t{",
			"\t\tio::print(\"Yes\");",
			"\t}",
			"\telse",
			"\t{",
			"\t\tio::print(\"No\");",
			"\t}",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testIf3()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("io");
		let content = rs.join("\n", Vector.create([
			"{",
			"\tif (a == 1)",
			"\t{",
			"\t\tio::print(1);",
			"\t}",
			"\telse if (a == 2)",
			"\t{",
			"\t\tio::print(2);",
			"\t}",
			"\telse if (a == 3)",
			"\t{",
			"\t\tio::print(3);",
			"\t}",
			"\telse",
			"\t{",
			"\t\tio::print(\"No\");",
			"\t}",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testThrow1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("RuntimeException");
		let content = rs.join("\n", Vector.create([
			"{",
			"\tthrow new RuntimeException(\"Error\");",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testTry1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("io");
		this.addVar("RuntimeException");
		let content = rs.join("\n", Vector.create([
			"{",
			"\ttry",
			"\t{",
			"\t\tthis.translate();",
			"\t}",
			"\tcatch (RuntimeException e)",
			"\t{",
			"\t\tio::print_error(e.toString());",
			"\t}",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testWhile1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("i");
		let content = rs.join("\n", Vector.create([
			"{",
			"\twhile (i < 10)",
			"\t{",
			"\t\ti++;",
			"\t}",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testComment1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("i");
		let content = rs.join("\n", Vector.create([
			"{",
			"\t/* Increment value */",
			"\ti++;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "BayLang.Test.LangBay.Operator"; }
	static getMethodsList()
	{
		const Vector = use("Runtime.Vector");
		return new Vector("testAssign1", "testAssign2", "testAssign3", "testAssign4", "testAssign5", "testAssign6", "testAssign7", "testBreak", "testContinue", "testReturn1", "testReturn2", "testReturn3", "testReturn4", "testInc1", "testInc2", "testDec1", "testDec2", "testFor1", "testIf1", "testIf2", "testIf3", "testThrow1", "testTry1", "testWhile1", "testComment1");
	}
	static getMethodInfoByName(field_name)
	{
		const Vector = use("Runtime.Vector");
		if (field_name == "testAssign1") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testAssign2") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testAssign3") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testAssign4") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testAssign5") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testAssign6") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testAssign7") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testBreak") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testContinue") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testReturn1") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testReturn2") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testReturn3") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testReturn4") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testInc1") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testInc2") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testDec1") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testDec2") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testFor1") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testIf1") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testIf2") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testIf3") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testThrow1") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testTry1") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testWhile1") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testComment1") return new Vector(
			new Test(new Map())
		);
		return null;
	}
	static getInterfaces(){ return []; }
};
use.add(BayLang.Test.LangBay.Operator);
module.exports = {
	"Operator": BayLang.Test.LangBay.Operator,
};