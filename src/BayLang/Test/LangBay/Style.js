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
BayLang.Test.LangBay.Style = class
{
	/**
	 * Reset
	 */
	reset()
	{
		const ParserBay = use("BayLang.LangBay.ParserBay");
		/* Create parser */
		let parser = new ParserBay();
		parser.current_namespace_name = "App";
		parser.current_class_name = "Test";
		parser.uses.set("Button", "Runtime.Widget.Button");
		this.parser = parser;
	}
	
	
	/**
	 * Set content
	 */
	setContent(content)
	{
		this.parser.setContent(content);
	}
	
	
	/**
	 * Translate
	 */
	translate(content, debug)
	{
		const Vector = use("Runtime.Vector");
		if (debug == undefined) debug = false;
		this.setContent(content + String("}"));
		/* Parse */
		let items = new Vector();
		let res = this.parser.parser_html.readCssBodyItems(this.parser, items, new Vector());
		let op_code = res.get(1);
		/* Get items */
		items = items.map((op_code) => { return op_code.value; });
		let result = rs.join("\n", items);
		/* Debug output */
		if (debug)
		{
			console.log(items);
			console.log(result);
		}
		return new Vector(op_code, result);
	}
	
	
	test1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			".main_page{",
			"\tpadding: 20px;",
			"}",
		));
		let css_content = rs.join("\n", new Vector(
			".main_page.h-71c3{padding: 20px}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(css_content, res.get(1), css_content);
	}
	
	
	test2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			".main_page{",
			"\t.test1{",
			"\t\tpadding: 20px;",
			"\t}",
			"}",
		));
		let css_content = rs.join("\n", new Vector(
			".main_page.h-71c3 .test1.h-71c3{padding: 20px}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(css_content, res.get(1), css_content);
	}
	
	
	test3()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			".main_page{",
			"\t&__test1{",
			"\t\tpadding: 20px;",
			"\t}",
			"}",
		));
		let css_content = rs.join("\n", new Vector(
			".main_page__test1.h-71c3{padding: 20px}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(css_content, res.get(1), css_content);
	}
	
	
	test4()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			".main_page{",
			"\t&__test1{",
			"\t\t&_test2{",
			"\t\t\tpadding: 20px;",
			"\t\t}",
			"\t}",
			"}",
		));
		let css_content = rs.join("\n", new Vector(
			".main_page__test1_test2.h-71c3{padding: 20px}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(css_content, res.get(1), css_content);
	}
	
	
	test5()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			".main_page{",
			"\t&__test1{",
			"\t\t.test2{",
			"\t\t\tpadding: 20px;",
			"\t\t}",
			"\t}",
			"}",
		));
		let css_content = rs.join("\n", new Vector(
			".main_page__test1.h-71c3 .test2.h-71c3{padding: 20px}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(css_content, res.get(1), css_content);
	}
	
	
	test6()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			".main_page{",
			"\t.test1{",
			"\t\t&__test2{",
			"\t\t\tpadding: 20px;",
			"\t\t}",
			"\t}",
			"}",
		));
		let css_content = rs.join("\n", new Vector(
			".main_page.h-71c3 .test1__test2.h-71c3{padding: 20px}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(css_content, res.get(1), css_content);
	}
	
	
	test7()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			".main_page{",
			"\t%(Button)widget_button{",
			"\t\tpadding: 20px;",
			"\t}",
			"}",
		));
		let css_content = rs.join("\n", new Vector(
			".main_page.h-71c3 .widget_button.h-8dd7{padding: 20px}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(css_content, res.get(1), css_content);
	}
	
	
	test8()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			".main_page{",
			"\t%(Button)widget_button{",
			"\t\t&__test1{",
			"\t\t\tpadding: 20px;",
			"\t\t}",
			"\t}",
			"}",
		));
		let css_content = rs.join("\n", new Vector(
			".main_page.h-71c3 .widget_button__test1.h-8dd7{padding: 20px}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(css_content, res.get(1), css_content);
	}
	
	
	test9()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			".main_page{",
			"\t%(Button)widget_button{",
			"\t\t.test1{",
			"\t\t\tpadding: 20px;",
			"\t\t}",
			"\t}",
			"}",
		));
		let css_content = rs.join("\n", new Vector(
			".main_page.h-71c3 .widget_button.h-8dd7 .test1.h-71c3{padding: 20px}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(css_content, res.get(1), css_content);
	}
	
	
	test10()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			".main_page{",
			"\tp{",
			"\t\tfont-weight: bold;",
			"\t}",
			"}",
		));
		let css_content = rs.join("\n", new Vector(
			".main_page.h-71c3 p{font-weight: bold}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(css_content, res.get(1), css_content);
	}
	
	
	test11()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			".main_page{",
			"\tpadding: 20px;",
			"\tcolor: green;",
			"}",
		));
		let css_content = rs.join("\n", new Vector(
			".main_page.h-71c3{padding: 20px;color: green}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(css_content, res.get(1), css_content);
	}
	
	
	test12()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			".main_page{",
			"\tpadding: 20px;",
			"\tcolor: green;",
			"\t@media (max-width: 950px){",
			"\t\tdisplay: none;",
			"\t}",
			"}",
		));
		let css_content = rs.join("\n", new Vector(
			".main_page.h-71c3{padding: 20px;color: green}",
			"@media (max-width: 950px){.main_page.h-71c3{display: none}}",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(css_content, res.get(1), css_content);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "BayLang.Test.LangBay.Style"; }
	static getMethodsList()
	{
		const Vector = use("Runtime.Vector");
		return new Vector("test1", "test2", "test3", "test4", "test5", "test6", "test7", "test8", "test9", "test10", "test11", "test12");
	}
	static getMethodInfoByName(field_name)
	{
		const Vector = use("Runtime.Vector");
		if (field_nane == "test1") return new Vector(
			new Test(new Map())
		);if (field_nane == "test2") return new Vector(
			new Test(new Map())
		);if (field_nane == "test3") return new Vector(
			new Test(new Map())
		);if (field_nane == "test4") return new Vector(
			new Test(new Map())
		);if (field_nane == "test5") return new Vector(
			new Test(new Map())
		);if (field_nane == "test6") return new Vector(
			new Test(new Map())
		);if (field_nane == "test7") return new Vector(
			new Test(new Map())
		);if (field_nane == "test8") return new Vector(
			new Test(new Map())
		);if (field_nane == "test9") return new Vector(
			new Test(new Map())
		);if (field_nane == "test10") return new Vector(
			new Test(new Map())
		);if (field_nane == "test11") return new Vector(
			new Test(new Map())
		);if (field_nane == "test12") return new Vector(
			new Test(new Map())
		);
		return null;
	}
	static getInterfaces(){ return []; }
};
use.add(BayLang.Test.LangBay.Style);
module.exports = {
	"Style": BayLang.Test.LangBay.Style,
};