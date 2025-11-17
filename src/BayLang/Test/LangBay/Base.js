"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
const Test = use("Runtime.Unit.Test");
const Map = use("Runtime.Map");
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
if (typeof BayLang.Test == 'undefined') BayLang.Test = {};
if (typeof BayLang.Test.LangBay == 'undefined') BayLang.Test.LangBay = {};
BayLang.Test.LangBay.Base = class
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
		let result = new Vector();
		this.setContent(content);
		/* Parse */
		let res = this.parser.parser_expression.readExpression(this.parser);
		let op_code = res.get(1);
		/* Translate */
		this.translator.expression.translate(op_code, result);
		/* Debug output */
		if (debug)
		{
			console.log(op_code);
			console.log(result);
			console.log(rs.join("", result));
		}
		return new Vector(op_code, rs.join("", result));
	}
	
	
	testNumber()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = "1";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testReal()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = "0.1";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testString()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = "\"test\"";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testIdentifier()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		let content = "a";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testAttr1()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = "this.a";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testAttr2()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = "this.a.b";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testAttr3()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = "static::a";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testAttr4()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = "parent::a";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testAttr5()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		let content = "a[1]";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testAttr6()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		let content = "a[1, 2]";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testAttr7()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("name");
		let content = "a[name]";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testCollection1()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = "[]";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testCollection2()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = "[1, 2, 3]";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testCollection3()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("b");
		this.addVar("c");
		let content = "[a, b, c]";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testCollection4()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = "[\"a\", \"b\", \"c\"]";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testCollection5()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"[",
			"\t\"a\",",
			"\t\"b\",",
			"\t\"c\",",
			"]",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testDict1()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = "{}";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testDict2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"{",
			"\t\"name\": \"test\",",
			"}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testDict3()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"{",
			"\t\"name\": \"test\",",
			"\t\"value\": 10,",
			"}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testDict4()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"{",
			"\t\"obj\": {},",
			"}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testDict5()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"{",
			"\t\"obj\": {",
			"\t},",
			"}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testDict6()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"{",
			"\t\"obj\": [",
			"\t],",
			"}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testDict7()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"{",
			"\t\"obj\": {",
			"\t\t\"name\": \"test\",",
			"\t\t\"value\": 10,",
			"\t},",
			"}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testDict8()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"{",
			"\t\"obj\": {\"name\": \"test\", \"value\": 10},",
			"}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testPreprocessor1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"[",
			"\t\"1\",",
			"\t#ifdef BACKEND then",
			"\t\"2\",",
			"\t\"3\",",
			"\t#endif",
			"\t\"4\",",
			"]",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testPreprocessor2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"{",
			"\t\"name\": \"test\",",
			"\t#ifdef BACKEND then",
			"\t\"value1\": 1,",
			"\t\"value2\": 2,",
			"\t#endif",
			"}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn1()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		let content = "a()";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn2()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		let content = "a(1, 2)";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn3()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = "this.a(1, 2)";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn4()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = "parent(1, 2)";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn5()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = "static::getName(1, 2)";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn6()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("b");
		this.addVar("c");
		let content = "a(b, c)";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn7()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		let content = "a().b()";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn8()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		let content = "a{}";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn9()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		let content = rs.join("\n", new Vector(
			"a{",
			"\t\"name\": \"test\",",
			"\t\"value\": 10,",
			"}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testNew1()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("Test");
		let content = "new Test()";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testNew2()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("Test");
		let content = "new Test(this.name, this.value)";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testNew3()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("Test");
		let content = rs.join("\n", new Vector(
			"new Test{",
			"\t\"name\": \"test\",",
			"\t\"value\": 10,",
			"}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testNew4()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("Query");
		let content = "new Query().select(\"table\")";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testNew5()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = "new Collection<string>()";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "BayLang.Test.LangBay.Base"; }
	static getMethodsList()
	{
		const Vector = use("Runtime.Vector");
		return new Vector("testNumber", "testReal", "testString", "testIdentifier", "testAttr1", "testAttr2", "testAttr3", "testAttr4", "testAttr5", "testAttr6", "testAttr7", "testCollection1", "testCollection2", "testCollection3", "testCollection4", "testCollection5", "testDict1", "testDict2", "testDict3", "testDict4", "testDict5", "testDict6", "testDict7", "testDict8", "testPreprocessor1", "testPreprocessor2", "testFn1", "testFn2", "testFn3", "testFn4", "testFn5", "testFn6", "testFn7", "testFn8", "testFn9", "testNew1", "testNew2", "testNew3", "testNew4", "testNew5");
	}
	static getMethodInfoByName(field_name)
	{
		const Vector = use("Runtime.Vector");
		if (field_nane == "testNumber") return new Vector(
			new Test(new Map())
		);if (field_nane == "testReal") return new Vector(
			new Test(new Map())
		);if (field_nane == "testString") return new Vector(
			new Test(new Map())
		);if (field_nane == "testIdentifier") return new Vector(
			new Test(new Map())
		);if (field_nane == "testAttr1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testAttr2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testAttr3") return new Vector(
			new Test(new Map())
		);if (field_nane == "testAttr4") return new Vector(
			new Test(new Map())
		);if (field_nane == "testAttr5") return new Vector(
			new Test(new Map())
		);if (field_nane == "testAttr6") return new Vector(
			new Test(new Map())
		);if (field_nane == "testAttr7") return new Vector(
			new Test(new Map())
		);if (field_nane == "testCollection1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testCollection2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testCollection3") return new Vector(
			new Test(new Map())
		);if (field_nane == "testCollection4") return new Vector(
			new Test(new Map())
		);if (field_nane == "testCollection5") return new Vector(
			new Test(new Map())
		);if (field_nane == "testDict1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testDict2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testDict3") return new Vector(
			new Test(new Map())
		);if (field_nane == "testDict4") return new Vector(
			new Test(new Map())
		);if (field_nane == "testDict5") return new Vector(
			new Test(new Map())
		);if (field_nane == "testDict6") return new Vector(
			new Test(new Map())
		);if (field_nane == "testDict7") return new Vector(
			new Test(new Map())
		);if (field_nane == "testDict8") return new Vector(
			new Test(new Map())
		);if (field_nane == "testPreprocessor1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testPreprocessor2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testFn1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testFn2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testFn3") return new Vector(
			new Test(new Map())
		);if (field_nane == "testFn4") return new Vector(
			new Test(new Map())
		);if (field_nane == "testFn5") return new Vector(
			new Test(new Map())
		);if (field_nane == "testFn6") return new Vector(
			new Test(new Map())
		);if (field_nane == "testFn7") return new Vector(
			new Test(new Map())
		);if (field_nane == "testFn8") return new Vector(
			new Test(new Map())
		);if (field_nane == "testFn9") return new Vector(
			new Test(new Map())
		);if (field_nane == "testNew1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testNew2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testNew3") return new Vector(
			new Test(new Map())
		);if (field_nane == "testNew4") return new Vector(
			new Test(new Map())
		);if (field_nane == "testNew5") return new Vector(
			new Test(new Map())
		);
		return null;
	}
	static getInterfaces(){ return []; }
};
use.add(BayLang.Test.LangBay.Base);
module.exports = {
	"Base": BayLang.Test.LangBay.Base,
};