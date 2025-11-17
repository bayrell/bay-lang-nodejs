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
BayLang.Test.LangBay.Expression = class
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
	
	
	testMath1()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("b");
		let content = "a + b";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testMath2()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("b");
		let content = "a * b";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testMath3()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("b");
		this.addVar("c");
		let content = "a + b * c";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testMath4()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("b");
		this.addVar("c");
		let content = "(a + b) * c";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testMath5()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("b");
		this.addVar("c");
		let content = "a * (b + c)";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testMath6()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		let content = "not a";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testMath7()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("b");
		let content = "not (a or b)";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testMath8()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("b");
		let content = "not a or b";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn1()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("b");
		let content = "a(this.a + this.b)";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn2()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("b");
		let content = "a() + b()";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn3()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("a");
		this.addVar("b");
		this.addVar("c");
		let content = "(a() + b()) * c()";
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	test1()
	{
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("io");
		this.addVar("class_name");
		this.addVar("method_name");
		let content = "io::print(class_name ~ \"::\" ~ method_name ~ " + String("\" \" ~ io::color(\"green\", \"Ok\"))");
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "BayLang.Test.LangBay.Expression"; }
	static getMethodsList()
	{
		const Vector = use("Runtime.Vector");
		return new Vector("testMath1", "testMath2", "testMath3", "testMath4", "testMath5", "testMath6", "testMath7", "testMath8", "testFn1", "testFn2", "testFn3", "test1");
	}
	static getMethodInfoByName(field_name)
	{
		const Vector = use("Runtime.Vector");
		if (field_nane == "testMath1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testMath2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testMath3") return new Vector(
			new Test(new Map())
		);if (field_nane == "testMath4") return new Vector(
			new Test(new Map())
		);if (field_nane == "testMath5") return new Vector(
			new Test(new Map())
		);if (field_nane == "testMath6") return new Vector(
			new Test(new Map())
		);if (field_nane == "testMath7") return new Vector(
			new Test(new Map())
		);if (field_nane == "testMath8") return new Vector(
			new Test(new Map())
		);if (field_nane == "testFn1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testFn2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testFn3") return new Vector(
			new Test(new Map())
		);if (field_nane == "test1") return new Vector(
			new Test(new Map())
		);
		return null;
	}
	static getInterfaces(){ return []; }
};
use.add(BayLang.Test.LangBay.Expression);
module.exports = {
	"Expression": BayLang.Test.LangBay.Expression,
};