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
BayLang.Test.LangBay.Program = class
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
		let res = this.parser.parser_program.readProgram(this.parser);
		let op_code = res.get(1);
		/* Translate */
		this.translator.program.translateItems(op_code.items, result);
		/* Debug output */
		if (debug)
		{
			console.log(op_code);
			console.log(result);
			console.log(rs.join("", result));
		}
		return Vector.create([op_code, rs.join("", result)]);
	}
	
	
	testNamespace()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"namespace App;",
			"",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testUse1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"use Runtime.Unit.Test;",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testUse2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"use Runtime.Unit.Test as TestAlias;",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testClass1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"class Test",
			"{",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testClass2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("BaseObject");
		let content = rs.join("\n", Vector.create([
			"class Test extends BaseObject",
			"{",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testClass3()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("TestInterface");
		let content = rs.join("\n", Vector.create([
			"class Test implements TestInterface",
			"{",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testClass4()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		this.addVar("TestInterface1");
		this.addVar("TestInterface2");
		let content = rs.join("\n", Vector.create([
			"class Test implements TestInterface1, TestInterface2",
			"{",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testClass5()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"class Test<T> extends Collection<T>",
			"{",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testInterface1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"interface Test",
			"{",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testStruct1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"struct Test",
			"{",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"class Test",
			"{",
			"\tvoid main(){}",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"class Test",
			"{",
			"\tvoid main(int a, int b = 1){}",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn3()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"class Test",
			"{",
			"\tbool main()",
			"\t{",
			"\t\treturn true;",
			"\t}",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn4()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"class Test",
			"{",
			"\tbool main() => true;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testFn5()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"class Test",
			"{",
			"\tstatic bool main() => true;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testAssign1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", Vector.create([
			"namespace App;",
			"",
			"use App.IndexPage;",
			"",
			"class Test",
			"{",
			"\tstring component = classof IndexPage;",
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
			"namespace App;",
			"",
			"use App.IndexPage;",
			"use Runtime.Web.Annotations.Param;",
			"",
			"",
			"class Test",
			"{",
			"\t@Param{}",
			"\tstring component = classof IndexPage;",
			"}",
		]));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "BayLang.Test.LangBay.Program"; }
	static getMethodsList()
	{
		const Vector = use("Runtime.Vector");
		return new Vector("testNamespace", "testUse1", "testUse2", "testClass1", "testClass2", "testClass3", "testClass4", "testClass5", "testInterface1", "testStruct1", "testFn1", "testFn2", "testFn3", "testFn4", "testFn5", "testAssign1", "testAssign2");
	}
	static getMethodInfoByName(field_name)
	{
		const Vector = use("Runtime.Vector");
		if (field_name == "testNamespace") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testUse1") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testUse2") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testClass1") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testClass2") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testClass3") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testClass4") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testClass5") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testInterface1") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testStruct1") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testFn1") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testFn2") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testFn3") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testFn4") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testFn5") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testAssign1") return new Vector(
			new Test(new Map())
		);
		if (field_name == "testAssign2") return new Vector(
			new Test(new Map())
		);
		return null;
	}
	static getInterfaces(){ return []; }
};
use.add(BayLang.Test.LangBay.Program);
module.exports = {
	"Program": BayLang.Test.LangBay.Program,
};