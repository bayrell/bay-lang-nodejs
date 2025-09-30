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
BayLang.Test.LangBay.Style = function()
{
};
Object.assign(BayLang.Test.LangBay.Style.prototype,
{
	/**
	 * Reset
	 */
	reset: function()
	{
		/* Create parser */
		var __v0 = use("BayLang.LangBay.ParserBay");
		var parser = new __v0();
		parser = parser.constructor.reset(parser);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["current_namespace_name"]), "App");
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["current_class_name"]), "Test");
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["uses"]), parser.uses.setIm("Button", "Runtime.Widget.Button"));
		this.parser = parser;
	},
	/**
	 * Set content
	 */
	setContent: function(content)
	{
		this.parser = this.parser.constructor.setContent(this.parser, content);
	},
	/**
	 * Translate
	 */
	translate: function(content, debug)
	{
		if (debug == undefined) debug = false;
		this.setContent(content + use("Runtime.rtl").toStr("}"));
		/* Parse */
		var items = use("Runtime.Vector").from([]);
		var res = this.parser.parser_html.constructor.readCssBodyItems(this.parser, items, use("Runtime.Vector").from([]));
		var op_code = res.get(1);
		/* Get items */
		items = items.map((op_code) =>
		{
			return op_code.value;
		});
		var __v0 = use("Runtime.rs");
		var result = __v0.join("\n", items);
		/* Debug output */
		if (debug)
		{
			console.log(items);
			console.log(result);
		}
		return use("Runtime.Vector").from([op_code,result]);
	},
	test1: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from([".main_page{","\tpadding: 20px;","}"]));
		var __v1 = use("Runtime.rs");
		var css_content = __v1.join("\n", use("Runtime.Vector").from([".main_page.h-71c3{padding: 20px}"]));
		var res = this.translate(content);
		var __v2 = use("Runtime.Unit.AssertHelper");
		__v2.equalValue(css_content, res.get(1), css_content);
	},
	test2: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from([".main_page{","\t.test1{","\t\tpadding: 20px;","\t}","}"]));
		var __v1 = use("Runtime.rs");
		var css_content = __v1.join("\n", use("Runtime.Vector").from([".main_page.h-71c3 .test1.h-71c3{padding: 20px}"]));
		var res = this.translate(content);
		var __v2 = use("Runtime.Unit.AssertHelper");
		__v2.equalValue(css_content, res.get(1), css_content);
	},
	test3: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from([".main_page{","\t&__test1{","\t\tpadding: 20px;","\t}","}"]));
		var __v1 = use("Runtime.rs");
		var css_content = __v1.join("\n", use("Runtime.Vector").from([".main_page__test1.h-71c3{padding: 20px}"]));
		var res = this.translate(content);
		var __v2 = use("Runtime.Unit.AssertHelper");
		__v2.equalValue(css_content, res.get(1), css_content);
	},
	test4: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from([".main_page{","\t&__test1{","\t\t&_test2{","\t\t\tpadding: 20px;","\t\t}","\t}","}"]));
		var __v1 = use("Runtime.rs");
		var css_content = __v1.join("\n", use("Runtime.Vector").from([".main_page__test1_test2.h-71c3{padding: 20px}"]));
		var res = this.translate(content);
		var __v2 = use("Runtime.Unit.AssertHelper");
		__v2.equalValue(css_content, res.get(1), css_content);
	},
	test5: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from([".main_page{","\t&__test1{","\t\t.test2{","\t\t\tpadding: 20px;","\t\t}","\t}","}"]));
		var __v1 = use("Runtime.rs");
		var css_content = __v1.join("\n", use("Runtime.Vector").from([".main_page__test1.h-71c3 .test2.h-71c3{padding: 20px}"]));
		var res = this.translate(content);
		var __v2 = use("Runtime.Unit.AssertHelper");
		__v2.equalValue(css_content, res.get(1), css_content);
	},
	test6: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from([".main_page{","\t.test1{","\t\t&__test2{","\t\t\tpadding: 20px;","\t\t}","\t}","}"]));
		var __v1 = use("Runtime.rs");
		var css_content = __v1.join("\n", use("Runtime.Vector").from([".main_page.h-71c3 .test1__test2.h-71c3{padding: 20px}"]));
		var res = this.translate(content);
		var __v2 = use("Runtime.Unit.AssertHelper");
		__v2.equalValue(css_content, res.get(1), css_content);
	},
	test7: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from([".main_page{","\t%(Button)widget_button{","\t\tpadding: 20px;","\t}","}"]));
		var __v1 = use("Runtime.rs");
		var css_content = __v1.join("\n", use("Runtime.Vector").from([".main_page.h-71c3 .widget_button.h-8dd7{padding: 20px}"]));
		var res = this.translate(content);
		var __v2 = use("Runtime.Unit.AssertHelper");
		__v2.equalValue(css_content, res.get(1), css_content);
	},
	test8: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from([".main_page{","\t%(Button)widget_button{","\t\t&__test1{","\t\t\tpadding: 20px;","\t\t}","\t}","}"]));
		var __v1 = use("Runtime.rs");
		var css_content = __v1.join("\n", use("Runtime.Vector").from([".main_page.h-71c3 .widget_button__test1.h-8dd7{padding: 20px}"]));
		var res = this.translate(content);
		var __v2 = use("Runtime.Unit.AssertHelper");
		__v2.equalValue(css_content, res.get(1), css_content);
	},
	test9: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from([".main_page{","\t%(Button)widget_button{","\t\t.test1{","\t\t\tpadding: 20px;","\t\t}","\t}","}"]));
		var __v1 = use("Runtime.rs");
		var css_content = __v1.join("\n", use("Runtime.Vector").from([".main_page.h-71c3 .widget_button.h-8dd7 .test1.h-71c3{padding: 20px}"]));
		var res = this.translate(content);
		var __v2 = use("Runtime.Unit.AssertHelper");
		__v2.equalValue(css_content, res.get(1), css_content);
	},
	test10: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from([".main_page{","\tp{","\t\tfont-weight: bold;","\t}","}"]));
		var __v1 = use("Runtime.rs");
		var css_content = __v1.join("\n", use("Runtime.Vector").from([".main_page.h-71c3 p{font-weight: bold}"]));
		var res = this.translate(content);
		var __v2 = use("Runtime.Unit.AssertHelper");
		__v2.equalValue(css_content, res.get(1), css_content);
	},
	test11: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from([".main_page{","\tpadding: 20px;","\tcolor: green;","}"]));
		var __v1 = use("Runtime.rs");
		var css_content = __v1.join("\n", use("Runtime.Vector").from([".main_page.h-71c3{padding: 20px;color: green}"]));
		var res = this.translate(content);
		var __v2 = use("Runtime.Unit.AssertHelper");
		__v2.equalValue(css_content, res.get(1), css_content);
	},
	test12: function()
	{
		this.reset();
		var __v0 = use("Runtime.rs");
		var content = __v0.join("\n", use("Runtime.Vector").from([".main_page{","\tpadding: 20px;","\tcolor: green;","\t@media (max-width: 950px){","\t\tdisplay: none;","\t}","}"]));
		var __v1 = use("Runtime.rs");
		var css_content = __v1.join("\n", use("Runtime.Vector").from([".main_page.h-71c3{padding: 20px;color: green}","@media (max-width: 950px){.main_page.h-71c3{display: none}}"]));
		var res = this.translate(content);
		var __v2 = use("Runtime.Unit.AssertHelper");
		__v2.equalValue(css_content, res.get(1), css_content);
	},
	_init: function()
	{
		this.parser = null;
	},
});
Object.assign(BayLang.Test.LangBay.Style,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Test.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.Test.LangBay.Style";
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
			"test1",
			"test2",
			"test3",
			"test4",
			"test5",
			"test6",
			"test7",
			"test8",
			"test9",
			"test10",
			"test11",
			"test12",
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(field_name)
	{
		if (field_name == "test1")
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
		if (field_name == "test2")
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
		if (field_name == "test3")
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
		if (field_name == "test4")
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
		if (field_name == "test5")
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
		if (field_name == "test6")
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
		if (field_name == "test7")
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
		if (field_name == "test8")
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
		if (field_name == "test9")
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
		if (field_name == "test10")
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
		if (field_name == "test11")
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
		if (field_name == "test12")
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
});use.add(BayLang.Test.LangBay.Style);
module.exports = BayLang.Test.LangBay.Style;