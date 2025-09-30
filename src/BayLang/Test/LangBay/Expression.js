"use strict;"
var use = require('bay-lang').use;
/*!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2024 "Ildar Bikmamatov" <support@bayrell.org>
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
BayLang.Test.LangBay.Expression = function()
{
};
Object.assign(BayLang.Test.LangBay.Expression.prototype,
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
		this.parser = this.parser.constructor.setContent(this.parser, content);
	},
	/**
	 * Add variable
	 */
	addVar: function(var_name)
	{
		var parser = this.parser;
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["vars"]), parser.vars.setIm(var_name, true));
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
		var __v0 = use("Runtime.rs");
		return use("Runtime.Vector").from([op_code,__v0.join("", result)]);
	},
	testMath1: function()
	{
		this.reset();
		this.addVar("a");
		this.addVar("b");
		var content = "a + b";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testMath2: function()
	{
		this.reset();
		this.addVar("a");
		this.addVar("b");
		var content = "a * b";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testMath3: function()
	{
		this.reset();
		this.addVar("a");
		this.addVar("b");
		this.addVar("c");
		var content = "a + b * c";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testMath4: function()
	{
		this.reset();
		this.addVar("a");
		this.addVar("b");
		this.addVar("c");
		var content = "(a + b) * c";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testMath5: function()
	{
		this.reset();
		this.addVar("a");
		this.addVar("b");
		this.addVar("c");
		var content = "a * (b + c)";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testMath6: function()
	{
		this.reset();
		this.addVar("a");
		var content = "not a";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testMath7: function()
	{
		this.reset();
		this.addVar("a");
		this.addVar("b");
		var content = "not (a or b)";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testMath8: function()
	{
		this.reset();
		this.addVar("a");
		this.addVar("b");
		var content = "not a or b";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testFn1: function()
	{
		this.reset();
		this.addVar("a");
		this.addVar("b");
		var content = "a(this.a + this.b)";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testFn2: function()
	{
		this.reset();
		this.addVar("a");
		this.addVar("b");
		var content = "a() + b()";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	testFn3: function()
	{
		this.reset();
		this.addVar("a");
		this.addVar("b");
		this.addVar("c");
		var content = "(a() + b()) * c()";
		var res = this.translate(content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(content, res.get(1), content);
	},
	test1: function()
	{
		this.reset();
		this.addVar("io");
		this.addVar("class_name");
		this.addVar("method_name");
		var content = "io::print(class_name ~ \"::\" ~ method_name ~ " + use("Runtime.rtl").toStr("\" \" ~ io::color(\"green\", \"Ok\"))");
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
Object.assign(BayLang.Test.LangBay.Expression,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Test.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.Test.LangBay.Expression";
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
			"testMath1",
			"testMath2",
			"testMath3",
			"testMath4",
			"testMath5",
			"testMath6",
			"testMath7",
			"testMath8",
			"testFn1",
			"testFn2",
			"testFn3",
			"test1",
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(field_name)
	{
		if (field_name == "testMath1")
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
		if (field_name == "testMath2")
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
		if (field_name == "testMath3")
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
		if (field_name == "testMath4")
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
		if (field_name == "testMath5")
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
		if (field_name == "testMath6")
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
		if (field_name == "testMath7")
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
		if (field_name == "testMath8")
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
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v8(use("Runtime.Map").from({})),
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
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v9(use("Runtime.Map").from({})),
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
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v10(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "test1")
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
		return null;
	},
});use.add(BayLang.Test.LangBay.Expression);
module.exports = BayLang.Test.LangBay.Expression;