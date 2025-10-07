"use strict;"
var use = require('bay-lang').use;
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
BayLang.Test.LangBay.Base = function()
{
};
Object.assign(BayLang.Test.LangBay.Base.prototype,
{
	/**
	 * Reset
	 */
	reset: function()
	{
		var __v0 = use("BayLang.LangBay.ParserBay");
		this.parser = new __v0();
		this.parser = this.parser.constructor.reset(this.parser);
		var __v1 = use("BayLang.LangBay.TranslatorBay");
		this.translator = new __v1();
		this.translator.reset();
	},
	/**
	 * Set content
	 */
	setContent: function(content)
	{
		this.parser.setContent(content);
	},
	/**
	 * Add variable
	 */
	addVar: function(var_name)
	{
		var parser = this.parser;
		parser.vars.set(var_name, true);
		this.parser = parser;
	},
	/**
	 * Translate
	 */
	translate: function(content, debug)
	{
		if (debug == undefined) debug = false;
		var result = use("Runtime.Vector").from([]);
		this.setContent(content);
		/* Parse */
		var res = this.parser.parser_expression.constructor.readExpression(this.parser);
		var op_code = res.get(1);
		/* Translate */
		this.translator.expression.translate(op_code, result);
		/* Debug output */
		if (debug)
		{
			console.log(op_code);
			console.log(result);
			var __v0 = use("Runtime.rs");
			console.log(__v0.join("", result));
		}
		var __v1 = use("Runtime.rs");
		return use("Runtime.Vector").from([op_code,__v1.join("", result)]);
	},
	testNumber: function()
	{
		this.reset();
		var content = "1";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testReal: function()
	{
		this.reset();
		var content = "0.1";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testString: function()
	{
		this.reset();
		var content = "\"test\"";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testIdentifier: function()
	{
		this.reset();
		this.addVar("a");
		var content = "a";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testAttr1: function()
	{
		this.reset();
		var content = "this.a";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testAttr2: function()
	{
		this.reset();
		var content = "this.a.b";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testAttr3: function()
	{
		this.reset();
		var content = "static::a";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testAttr4: function()
	{
		this.reset();
		var content = "parent::a";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testAttr5: function()
	{
		this.reset();
		this.addVar("a");
		var content = "a[1]";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testAttr6: function()
	{
		this.reset();
		this.addVar("a");
		var content = "a[1, 2]";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testAttr7: function()
	{
		this.reset();
		this.addVar("a");
		this.addVar("name");
		var content = "a[name]";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testCollection1: function()
	{
		this.reset();
		var content = "[]";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testCollection2: function()
	{
		this.reset();
		var content = "[1, 2, 3]";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testCollection3: function()
	{
		this.reset();
		this.addVar("a");
		this.addVar("b");
		this.addVar("c");
		var content = "[a, b, c]";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testCollection4: function()
	{
		this.reset();
		var content = "[\"a\", \"b\", \"c\"]";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testCollection5: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from(["[","\t\"a\",","\t\"b\",","\t\"c\",","]"]));
		var res = this.translate(content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(content, res.get(1), content);
	},
	testDict1: function()
	{
		this.reset();
		var content = "{}";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testDict2: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from(["{","\t\"name\": \"test\",","}"]));
		var res = this.translate(content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(content, res.get(1), content);
	},
	testDict3: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from(["{","\t\"name\": \"test\",","\t\"value\": 10,","}"]));
		var res = this.translate(content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(content, res.get(1), content);
	},
	testDict4: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from(["{","\t\"obj\": {},","}"]));
		var res = this.translate(content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(content, res.get(1), content);
	},
	testDict5: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from(["{","\t\"obj\": {","\t},","}"]));
		var res = this.translate(content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(content, res.get(1), content);
	},
	testDict6: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from(["{","\t\"obj\": [","\t],","}"]));
		var res = this.translate(content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(content, res.get(1), content);
	},
	testDict7: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from(["{","\t\"obj\": {","\t\t\"name\": \"test\",","\t\t\"value\": 10,","\t},","}"]));
		var res = this.translate(content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(content, res.get(1), content);
	},
	testDict8: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from(["{","\t\"obj\": {\"name\": \"test\", \"value\": 10},","}"]));
		var res = this.translate(content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(content, res.get(1), content);
	},
	testPreprocessor1: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from(["[","\t\"1\",","\t#ifdef BACKEND then","\t\"2\",","\t\"3\",","\t#endif","\t\"4\",","]"]));
		var res = this.translate(content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(content, res.get(1), content);
	},
	testPreprocessor2: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from(["{","\t\"name\": \"test\",","\t#ifdef BACKEND then","\t\"value1\": 1,","\t\"value2\": 2,","\t#endif","}"]));
		var res = this.translate(content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(content, res.get(1), content);
	},
	testFn1: function()
	{
		this.reset();
		this.addVar("a");
		var content = "a()";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testFn2: function()
	{
		this.reset();
		this.addVar("a");
		var content = "a(1, 2)";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testFn3: function()
	{
		this.reset();
		var content = "this.a(1, 2)";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testFn4: function()
	{
		this.reset();
		var content = "parent(1, 2)";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testFn5: function()
	{
		this.reset();
		var content = "static::getName(1, 2)";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testFn6: function()
	{
		this.reset();
		this.addVar("a");
		this.addVar("b");
		this.addVar("c");
		var content = "a(b, c)";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testFn7: function()
	{
		this.reset();
		this.addVar("a");
		var content = "a().b()";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testFn8: function()
	{
		this.reset();
		this.addVar("a");
		var content = "a{}";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testFn9: function()
	{
		this.reset();
		this.addVar("a");
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from(["a{","\t\"name\": \"test\",","\t\"value\": 10,","}"]));
		var res = this.translate(content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(content, res.get(1), content);
	},
	testNew1: function()
	{
		this.reset();
		this.addVar("Test");
		var content = "new Test()";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testNew2: function()
	{
		this.reset();
		this.addVar("Test");
		var content = "new Test(this.name, this.value)";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testNew3: function()
	{
		this.reset();
		this.addVar("Test");
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from(["new Test{","\t\"name\": \"test\",","\t\"value\": 10,","}"]));
		var res = this.translate(content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(content, res.get(1), content);
	},
	testNew4: function()
	{
		this.reset();
		this.addVar("Query");
		var content = "new Query().select(\"table\")";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testNew5: function()
	{
		this.reset();
		var content = "new Collection<string>()";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	_init: function()
	{
		this.parser = null;
		this.translator = null;
	},
});
Object.assign(BayLang.Test.LangBay.Base,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Test.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.Test.LangBay.Base";
	},
	getParentClassName: function()
	{
		return "";
	},
	getClassInfo: function()
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function()
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function()
	{
		var a=[
			"testNumber",
			"testReal",
			"testString",
			"testIdentifier",
			"testAttr1",
			"testAttr2",
			"testAttr3",
			"testAttr4",
			"testAttr5",
			"testAttr6",
			"testAttr7",
			"testCollection1",
			"testCollection2",
			"testCollection3",
			"testCollection4",
			"testCollection5",
			"testDict1",
			"testDict2",
			"testDict3",
			"testDict4",
			"testDict5",
			"testDict6",
			"testDict7",
			"testDict8",
			"testPreprocessor1",
			"testPreprocessor2",
			"testFn1",
			"testFn2",
			"testFn3",
			"testFn4",
			"testFn5",
			"testFn6",
			"testFn7",
			"testFn8",
			"testFn9",
			"testNew1",
			"testNew2",
			"testNew3",
			"testNew4",
			"testNew5",
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(field_name)
	{
		if (field_name == "testNumber")
		{
			var __v0 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v0(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testReal")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v1(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testString")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v2(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testIdentifier")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v3(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAttr1")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v4(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAttr2")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v5(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAttr3")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v6(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAttr4")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v7(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAttr5")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v8(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAttr6")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v9(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAttr7")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v10(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testCollection1")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v11(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testCollection2")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v12(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testCollection3")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v13(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testCollection4")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v14(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testCollection5")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v15(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testDict1")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v16(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testDict2")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v17(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testDict3")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v18(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testDict4")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v19(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testDict5")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v20(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testDict6")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v21(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testDict7")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v22(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testDict8")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v23(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testPreprocessor1")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v24(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testPreprocessor2")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var __v25 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v25(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testFn1")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var __v25 = use("Runtime.Unit.Test");
			var __v26 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v26(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testFn2")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var __v25 = use("Runtime.Unit.Test");
			var __v26 = use("Runtime.Unit.Test");
			var __v27 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v27(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testFn3")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var __v25 = use("Runtime.Unit.Test");
			var __v26 = use("Runtime.Unit.Test");
			var __v27 = use("Runtime.Unit.Test");
			var __v28 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v28(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testFn4")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var __v25 = use("Runtime.Unit.Test");
			var __v26 = use("Runtime.Unit.Test");
			var __v27 = use("Runtime.Unit.Test");
			var __v28 = use("Runtime.Unit.Test");
			var __v29 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v29(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testFn5")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var __v25 = use("Runtime.Unit.Test");
			var __v26 = use("Runtime.Unit.Test");
			var __v27 = use("Runtime.Unit.Test");
			var __v28 = use("Runtime.Unit.Test");
			var __v29 = use("Runtime.Unit.Test");
			var __v30 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v30(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testFn6")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var __v25 = use("Runtime.Unit.Test");
			var __v26 = use("Runtime.Unit.Test");
			var __v27 = use("Runtime.Unit.Test");
			var __v28 = use("Runtime.Unit.Test");
			var __v29 = use("Runtime.Unit.Test");
			var __v30 = use("Runtime.Unit.Test");
			var __v31 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v31(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testFn7")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var __v25 = use("Runtime.Unit.Test");
			var __v26 = use("Runtime.Unit.Test");
			var __v27 = use("Runtime.Unit.Test");
			var __v28 = use("Runtime.Unit.Test");
			var __v29 = use("Runtime.Unit.Test");
			var __v30 = use("Runtime.Unit.Test");
			var __v31 = use("Runtime.Unit.Test");
			var __v32 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v32(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testFn8")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var __v25 = use("Runtime.Unit.Test");
			var __v26 = use("Runtime.Unit.Test");
			var __v27 = use("Runtime.Unit.Test");
			var __v28 = use("Runtime.Unit.Test");
			var __v29 = use("Runtime.Unit.Test");
			var __v30 = use("Runtime.Unit.Test");
			var __v31 = use("Runtime.Unit.Test");
			var __v32 = use("Runtime.Unit.Test");
			var __v33 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v33(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testFn9")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var __v25 = use("Runtime.Unit.Test");
			var __v26 = use("Runtime.Unit.Test");
			var __v27 = use("Runtime.Unit.Test");
			var __v28 = use("Runtime.Unit.Test");
			var __v29 = use("Runtime.Unit.Test");
			var __v30 = use("Runtime.Unit.Test");
			var __v31 = use("Runtime.Unit.Test");
			var __v32 = use("Runtime.Unit.Test");
			var __v33 = use("Runtime.Unit.Test");
			var __v34 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v34(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testNew1")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var __v25 = use("Runtime.Unit.Test");
			var __v26 = use("Runtime.Unit.Test");
			var __v27 = use("Runtime.Unit.Test");
			var __v28 = use("Runtime.Unit.Test");
			var __v29 = use("Runtime.Unit.Test");
			var __v30 = use("Runtime.Unit.Test");
			var __v31 = use("Runtime.Unit.Test");
			var __v32 = use("Runtime.Unit.Test");
			var __v33 = use("Runtime.Unit.Test");
			var __v34 = use("Runtime.Unit.Test");
			var __v35 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v35(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testNew2")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var __v25 = use("Runtime.Unit.Test");
			var __v26 = use("Runtime.Unit.Test");
			var __v27 = use("Runtime.Unit.Test");
			var __v28 = use("Runtime.Unit.Test");
			var __v29 = use("Runtime.Unit.Test");
			var __v30 = use("Runtime.Unit.Test");
			var __v31 = use("Runtime.Unit.Test");
			var __v32 = use("Runtime.Unit.Test");
			var __v33 = use("Runtime.Unit.Test");
			var __v34 = use("Runtime.Unit.Test");
			var __v35 = use("Runtime.Unit.Test");
			var __v36 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v36(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testNew3")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var __v25 = use("Runtime.Unit.Test");
			var __v26 = use("Runtime.Unit.Test");
			var __v27 = use("Runtime.Unit.Test");
			var __v28 = use("Runtime.Unit.Test");
			var __v29 = use("Runtime.Unit.Test");
			var __v30 = use("Runtime.Unit.Test");
			var __v31 = use("Runtime.Unit.Test");
			var __v32 = use("Runtime.Unit.Test");
			var __v33 = use("Runtime.Unit.Test");
			var __v34 = use("Runtime.Unit.Test");
			var __v35 = use("Runtime.Unit.Test");
			var __v36 = use("Runtime.Unit.Test");
			var __v37 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v37(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testNew4")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var __v25 = use("Runtime.Unit.Test");
			var __v26 = use("Runtime.Unit.Test");
			var __v27 = use("Runtime.Unit.Test");
			var __v28 = use("Runtime.Unit.Test");
			var __v29 = use("Runtime.Unit.Test");
			var __v30 = use("Runtime.Unit.Test");
			var __v31 = use("Runtime.Unit.Test");
			var __v32 = use("Runtime.Unit.Test");
			var __v33 = use("Runtime.Unit.Test");
			var __v34 = use("Runtime.Unit.Test");
			var __v35 = use("Runtime.Unit.Test");
			var __v36 = use("Runtime.Unit.Test");
			var __v37 = use("Runtime.Unit.Test");
			var __v38 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v38(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testNew5")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var __v11 = use("Runtime.Unit.Test");
			var __v12 = use("Runtime.Unit.Test");
			var __v13 = use("Runtime.Unit.Test");
			var __v14 = use("Runtime.Unit.Test");
			var __v15 = use("Runtime.Unit.Test");
			var __v16 = use("Runtime.Unit.Test");
			var __v17 = use("Runtime.Unit.Test");
			var __v18 = use("Runtime.Unit.Test");
			var __v19 = use("Runtime.Unit.Test");
			var __v20 = use("Runtime.Unit.Test");
			var __v21 = use("Runtime.Unit.Test");
			var __v22 = use("Runtime.Unit.Test");
			var __v23 = use("Runtime.Unit.Test");
			var __v24 = use("Runtime.Unit.Test");
			var __v25 = use("Runtime.Unit.Test");
			var __v26 = use("Runtime.Unit.Test");
			var __v27 = use("Runtime.Unit.Test");
			var __v28 = use("Runtime.Unit.Test");
			var __v29 = use("Runtime.Unit.Test");
			var __v30 = use("Runtime.Unit.Test");
			var __v31 = use("Runtime.Unit.Test");
			var __v32 = use("Runtime.Unit.Test");
			var __v33 = use("Runtime.Unit.Test");
			var __v34 = use("Runtime.Unit.Test");
			var __v35 = use("Runtime.Unit.Test");
			var __v36 = use("Runtime.Unit.Test");
			var __v37 = use("Runtime.Unit.Test");
			var __v38 = use("Runtime.Unit.Test");
			var __v39 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v39(use("Runtime.Map").from({})),
				]),
			});
		}
		return null;
	},
});use.add(BayLang.Test.LangBay.Base);
module.exports = BayLang.Test.LangBay.Base;