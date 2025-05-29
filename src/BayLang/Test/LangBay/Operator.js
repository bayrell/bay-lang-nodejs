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
BayLang.Test.LangBay.Operator = function(ctx)
{
};
Object.assign(BayLang.Test.LangBay.Operator.prototype,
{
	/**
	 * Reset
	 */
	reset: function(ctx)
	{
		var __v0 = use("BayLang.LangBay.ParserBay");
		this.parser = new __v0(ctx);
		this.parser = this.parser.constructor.reset(ctx, this.parser);
		var __v1 = use("BayLang.LangBay.TranslatorBay");
		this.translator = new __v1(ctx);
		this.translator.reset(ctx);
	},
	/**
	 * Set content
	 */
	setContent: function(ctx, content)
	{
		this.parser = this.parser.constructor.setContent(ctx, this.parser, content);
	},
	/**
	 * Add variable
	 */
	addVar: function(ctx, var_name)
	{
		var parser = this.parser;
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), parser.vars.setIm(ctx, var_name, true));
		this.parser = parser;
	},
	/**
	 * Translate
	 */
	translate: function(ctx, content, debug)
	{
		if (debug == undefined) debug = false;
		var result = use("Runtime.Vector").from([]);
		this.setContent(ctx, content);
		/* Parse */
		var res = this.parser.parser_operator.constructor.readOperators(ctx, this.parser);
		var op_code = res.get(ctx, 1);
		/* Translate */
		this.translator.operator.translateItems(ctx, op_code, result);
		/* Debug output */
		if (debug)
		{
			console.log(op_code);
			console.log(result);
			var __v0 = use("Runtime.rs");
			console.log(__v0.join(ctx, "", result));
		}
		var __v0 = use("Runtime.rs");
		return use("Runtime.Vector").from([op_code,__v0.join(ctx, "", result)]);
	},
	testAssign1: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\tint a;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testAssign2: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\tint a = 1;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testAssign3: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\tint a = 1;","\ta = 2;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testAssign4: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\tint a = 1, b = 2;","\ta = a + b;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testAssign5: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\tthis.a = 1;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testAssign6: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\tCollection<string> content = [];","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testAssign7: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "content");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\tstring content = rs::join(\"\\n\", content);","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testBreak: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\tbreak;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testContinue: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\tcontinue;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testReturn1: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\treturn;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testReturn2: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\treturn 1;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testReturn3: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\treturn true;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testReturn4: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\treturn this.result;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testInc1: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "a");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\ta++;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testInc2: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "a");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\t++a;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testDec1: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "a");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\ta--;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testDec2: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "a");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\t--a;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testFor1: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "io");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\tfor (int i = 0; i < 10; i++)","\t{","\t\tio::print(i);","\t}","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testIf1: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "a");
		this.addVar(ctx, "b");
		this.addVar(ctx, "io");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\tif (a > b)","\t{","\t\tio::print(\"Yes\");","\t}","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testIf2: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "a");
		this.addVar(ctx, "b");
		this.addVar(ctx, "io");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\tif (a > b)","\t{","\t\tio::print(\"Yes\");","\t}","\telse","\t{","\t\tio::print(\"No\");","\t}","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testIf3: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "a");
		this.addVar(ctx, "io");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\tif (a == 1)","\t{","\t\tio::print(1);","\t}","\telse if (a == 2)","\t{","\t\tio::print(2);","\t}","\telse if (a == 3)","\t{","\t\tio::print(3);","\t}","\telse","\t{","\t\tio::print(\"No\");","\t}","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testThrow1: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "RuntimeException");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\tthrow new RuntimeException(\"Error\");","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testTry1: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "io");
		this.addVar(ctx, "RuntimeException");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\ttry","\t{","\t\tthis.translate();","\t}","\tcatch (RuntimeException e)","\t{","\t\tio::print_error(e.toString());","\t}","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testWhile1: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "i");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\twhile (i < 10)","\t{","\t\ti++;","\t}","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testComment1: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "i");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["{","\t/* Increment value */","\ti++;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	_init: function(ctx)
	{
		this.parser = null;
		this.translator = null;
	},
});
Object.assign(BayLang.Test.LangBay.Operator,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Test.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.Test.LangBay.Operator";
	},
	getParentClassName: function()
	{
		return "";
	},
	getClassInfo: function(ctx)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function(ctx)
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function(ctx)
	{
		var a=[
			"testAssign1",
			"testAssign2",
			"testAssign3",
			"testAssign4",
			"testAssign5",
			"testAssign6",
			"testAssign7",
			"testBreak",
			"testContinue",
			"testReturn1",
			"testReturn2",
			"testReturn3",
			"testReturn4",
			"testInc1",
			"testInc2",
			"testDec1",
			"testDec2",
			"testFor1",
			"testIf1",
			"testIf2",
			"testIf3",
			"testThrow1",
			"testTry1",
			"testWhile1",
			"testComment1",
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		if (field_name == "testAssign1")
		{
			var __v0 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v0(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAssign2")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v1(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAssign3")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v2(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAssign4")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v3(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAssign5")
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
					new __v4(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAssign6")
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
					new __v5(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAssign7")
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
					new __v6(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testBreak")
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
					new __v7(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testContinue")
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
					new __v8(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testReturn1")
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
					new __v9(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testReturn2")
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
					new __v10(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testReturn3")
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
					new __v11(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testReturn4")
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
					new __v12(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testInc1")
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
					new __v13(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testInc2")
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
					new __v14(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testDec1")
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
					new __v15(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testDec2")
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
					new __v16(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testFor1")
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
					new __v17(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testIf1")
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
					new __v18(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testIf2")
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
					new __v19(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testIf3")
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
					new __v20(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testThrow1")
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
					new __v21(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testTry1")
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
					new __v22(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testWhile1")
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
					new __v23(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testComment1")
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
					new __v24(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		return null;
	},
});use.add(BayLang.Test.LangBay.Operator);
module.exports = BayLang.Test.LangBay.Operator;