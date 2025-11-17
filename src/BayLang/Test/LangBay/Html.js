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
BayLang.Test.LangBay.Html = class
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
		let res = this.parser.parser_program.readProgram(this.parser);
		let op_code = res.get(1);
		/* Translate */
		this.translator.html.translate(op_code, result);
		/* Debug output */
		if (debug)
		{
			console.log(op_code);
			console.log(result);
			console.log(rs.join("", result));
		}
		return new Vector(op_code, rs.join("", result));
	}
	
	
	test1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	test2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<use name=\"App.Test\" />",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	test3()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<use name=\"App.Test\" as=\"TestAlias\" />",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	test4()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<use name=\"Runtime.Web.Button\" component=\"true\" />",
			"<use name=\"Runtime.Web.Text\" component=\"true\" />",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testTemplate1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<template>",
			"</template>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testTemplate2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<template name=\"renderItem\">",
			"</template>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testTemplate3()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<template name=\"renderItem\" args=\"int a, int b\">",
			"</template>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testComponent1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<use name=\"Runtime.Web.Button\" />",
			"",
			"<template>",
			"\t<Button />",
			"</template>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testComponent2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<use name=\"Runtime.Web.Button\" />",
			"",
			"<template>",
			"\t<Button>",
			"\t\tContent",
			"\t</Button>",
			"</template>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testComponent3()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<use name=\"Runtime.Web.Button\" />",
			"",
			"<template>",
			"\t<Button>",
			"\t\t{{ this.model.content }}",
			"\t</Button>",
			"</template>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testComponent4()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<use name=\"Runtime.Web.Button\" />",
			"",
			"<template>",
			"\t<Button @model={{ this.model }} />",
			"</template>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testComponent5()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<use name=\"Runtime.Web.Button\" />",
			"",
			"<template>",
			"\t<Button name=\"test\" />",
			"</template>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testContent1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<template>",
			"\t<div class=\"widget_test\">Text</div>",
			"</template>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testContent2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<template>",
			"\t<div class=\"widget_test\">{{ \"Text\" }}</div>",
			"</template>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testContent3()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<template>",
			"\t<div class=\"widget_test\">@raw{{ \"Text\" }}</div>",
			"</template>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testClick()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<template>",
			"\t<button",
			"\t\tclass=\"widget_test\"",
			"\t\t@event:click={{",
			"\t\t\tvoid ()",
			"\t\t\t{",
			"\t\t\t\tthis.onClick();",
			"\t\t\t}",
			"\t\t}}",
			"\t>",
			"\t\tTest",
			"\t</button>",
			"</template>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testScript1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<use name=\"Runtime.Web.Button\" />",
			"",
			"<template>",
			"</template>",
			"",
			"<script>",
			"",
			"void test(){}",
			"",
			"</script>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testSlot1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<use name=\"Runtime.Widget.Button\" component=\"true\" />",
			"<use name=\"Runtime.Widget.Image\" component=\"true\" />",
			"<use name=\"Runtime.Widget.TextImage\" component=\"true\" />",
			"",
			"<template>",
			"\t<TextImage>",
			"\t\t<slot name=\"image\">",
			"\t\t\t<Image src=\"/assets/images/test.jpeg\" />",
			"\t\t</slot>",
			"\t\t<slot name=\"text\">",
			"\t\t\t<div class=\"image_text\">Text</div>",
			"\t\t</slot>",
			"\t</TextImage>",
			"</template>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testSlot2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<use name=\"Runtime.Widget.Button\" component=\"true\" />",
			"<use name=\"Runtime.Widget.Image\" component=\"true\" />",
			"<use name=\"Runtime.Widget.TextImage\" component=\"true\" />",
			"",
			"<template>",
			"\t<TextImage>",
			"\t\t<slot name=\"image\" args=\"Dict params\">",
			"\t\t\t<Image src={{ params.get(\"image\") }} />",
			"\t\t</slot>",
			"\t\t<slot name=\"text\" args=\"Dict params\">",
			"\t\t\t<div class=\"image_text\">{{ params.get(\"label\") }}</div>",
			"\t\t</slot>",
			"\t</TextImage>",
			"</template>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testStyle1()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<style>",
			".page_title{",
			"\tfont-size: 18px;",
			"\ttext-align: center;",
			"}",
			"</style>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testStyle2()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<style global=\"true\">",
			".page_title{",
			"\tfont-size: 18px;",
			"\ttext-align: center;",
			"}",
			"</style>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testStyle3()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<style global=\"true\">",
			".main_page{",
			"background-image: ${ \"test\" };",
			"}",
			"</style>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testStyle4()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<style global=\"true\">",
			"@font-face{",
			"}",
			"</style>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	testStyle5()
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		this.reset();
		let content = rs.join("\n", new Vector(
			"<class name=\"App.Component\">",
			"",
			"<style global=\"true\">",
			".main_page{",
			".test{",
			"font-size: 16px;",
			"}",
			"}",
			"</style>",
			"",
			"</class>",
		));
		let res = this.translate(content);
		AssertHelper.equalValue(content, res.get(1), content);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "BayLang.Test.LangBay.Html"; }
	static getMethodsList()
	{
		const Vector = use("Runtime.Vector");
		return new Vector("test1", "test2", "test3", "test4", "testTemplate1", "testTemplate2", "testTemplate3", "testComponent1", "testComponent2", "testComponent3", "testComponent4", "testComponent5", "testContent1", "testContent2", "testContent3", "testClick", "testScript1", "testSlot1", "testSlot2", "testStyle1", "testStyle2", "testStyle3", "testStyle4", "testStyle5");
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
		);if (field_nane == "testTemplate1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testTemplate2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testTemplate3") return new Vector(
			new Test(new Map())
		);if (field_nane == "testComponent1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testComponent2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testComponent3") return new Vector(
			new Test(new Map())
		);if (field_nane == "testComponent4") return new Vector(
			new Test(new Map())
		);if (field_nane == "testComponent5") return new Vector(
			new Test(new Map())
		);if (field_nane == "testContent1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testContent2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testContent3") return new Vector(
			new Test(new Map())
		);if (field_nane == "testClick") return new Vector(
			new Test(new Map())
		);if (field_nane == "testScript1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testSlot1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testSlot2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testStyle1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testStyle2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testStyle3") return new Vector(
			new Test(new Map())
		);if (field_nane == "testStyle4") return new Vector(
			new Test(new Map())
		);if (field_nane == "testStyle5") return new Vector(
			new Test(new Map())
		);
		return null;
	}
	static getInterfaces(){ return []; }
};
use.add(BayLang.Test.LangBay.Html);
module.exports = {
	"Html": BayLang.Test.LangBay.Html,
};