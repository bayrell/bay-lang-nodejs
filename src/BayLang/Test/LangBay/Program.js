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
BayLang.Test.LangBay.Program = function(ctx)
{
};
Object.assign(BayLang.Test.LangBay.Program.prototype,
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
		var res = this.parser.parser_program.constructor.readProgram(ctx, this.parser);
		var op_code = res.get(ctx, 1);
		/* Translate */
		this.translator.program.translateItems(ctx, op_code.items, result);
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
	testNamespace: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["namespace App;",""]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testUse1: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["use Runtime.Unit.Test;"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testClass1: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["class Test","{","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testClass2: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "BaseObject");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["class Test extends BaseObject","{","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testClass3: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "TestInterface");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["class Test implements TestInterface","{","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testClass4: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "TestInterface1");
		this.addVar(ctx, "TestInterface2");
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["class Test implements TestInterface1, TestInterface2","{","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testClass5: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["class Test<T> extends Collection<T>","{","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testInterface1: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["interface Test","{","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testStruct1: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["struct Test","{","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testFn1: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["class Test","{","\tvoid main(){}","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testFn2: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["class Test","{","\tvoid main(int a, int b = 1){}","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testFn3: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["class Test","{","\tvoid main()","\t{","\t\treturn true;","\t}","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testAssign1: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["namespace App;","","use App.IndexPage;","","class Test","{","\tstring component = classof IndexPage;","}"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testAssign2: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["namespace App;","","use App.IndexPage;","use Runtime.Web.Annotations.Param;","","","class Test","{","\t@Param{}","\tstring component = classof IndexPage;","}"]));
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
Object.assign(BayLang.Test.LangBay.Program,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Test.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.Test.LangBay.Program";
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
			"testNamespace",
			"testUse1",
			"testClass1",
			"testClass2",
			"testClass3",
			"testClass4",
			"testClass5",
			"testInterface1",
			"testStruct1",
			"testFn1",
			"testFn2",
			"testFn3",
			"testAssign1",
			"testAssign2",
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		if (field_name == "testNamespace")
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
		if (field_name == "testUse1")
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
		if (field_name == "testClass1")
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
		if (field_name == "testClass2")
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
		if (field_name == "testClass3")
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
		if (field_name == "testClass4")
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
		if (field_name == "testClass5")
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
		if (field_name == "testInterface1")
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
		if (field_name == "testStruct1")
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
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v9(ctx, use("Runtime.Map").from({})),
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
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v10(ctx, use("Runtime.Map").from({})),
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
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v11(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAssign1")
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
		if (field_name == "testAssign2")
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
		return null;
	},
});use.add(BayLang.Test.LangBay.Program);
module.exports = BayLang.Test.LangBay.Program;