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
BayLang.Test.LangBay.Html = function(ctx)
{
};
Object.assign(BayLang.Test.LangBay.Html.prototype,
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
		this.translator.html.translate(ctx, op_code, result);
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
	test1: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	test2: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<use name=\"App.Test\" />","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	test3: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<use name=\"App.Test\" as=\"TestAlias\" />","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	test4: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<use name=\"Runtime.Web.Button\" component=\"true\" />","<use name=\"Runtime.Web.Text\" component=\"true\" />","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testTemplate1: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<template>","</template>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testTemplate2: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<template name=\"renderItem\">","</template>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testTemplate3: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<template name=\"renderItem\" args=\"int a, int b\">","</template>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testComponent1: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<use name=\"Runtime.Web.Button\" />","","<template>","\t<Button />","</template>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testComponent2: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<use name=\"Runtime.Web.Button\" />","","<template>","\t<Button>","\t\tContent","\t</Button>","</template>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testComponent3: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<use name=\"Runtime.Web.Button\" />","","<template>","\t<Button>","\t\t{{ this.model.content }}","\t</Button>","</template>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testComponent4: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<use name=\"Runtime.Web.Button\" />","","<template>","\t<Button @model={{ this.model }} />","</template>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testComponent5: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<use name=\"Runtime.Web.Button\" />","","<template>","\t<Button name=\"test\" />","</template>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testContent1: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<template>","\t<div class=\"widget_test\">Text</div>","</template>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testContent2: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<template>","\t<div class=\"widget_test\">{{ \"Text\" }}</div>","</template>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testContent3: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<template>","\t<div class=\"widget_test\">@raw{{ \"Text\" }}</div>","</template>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testClick: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<template>","\t<button","\t\tclass=\"widget_test\"","\t\t@event:click={{","\t\t\tvoid ()","\t\t\t{","\t\t\t\tthis.onClick();","\t\t\t}","\t\t}}","\t>","\t\tTest","\t</button>","</template>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testScript1: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<use name=\"Runtime.Web.Button\" />","","<template>","</template>","","<script>","","void test(){}","","</script>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testSlot1: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<use name=\"Runtime.Widget.Button\" component=\"true\" />","<use name=\"Runtime.Widget.Image\" component=\"true\" />","<use name=\"Runtime.Widget.TextImage\" component=\"true\" />","","<template>","\t<TextImage>","\t\t<slot name=\"image\">","\t\t\t<Image src=\"/assets/images/test.jpeg\" />","\t\t</slot>","\t\t<slot name=\"text\">","\t\t\t<div class=\"image_text\">Text</div>","\t\t</slot>","\t</TextImage>","</template>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testSlot2: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<use name=\"Runtime.Widget.Button\" component=\"true\" />","<use name=\"Runtime.Widget.Image\" component=\"true\" />","<use name=\"Runtime.Widget.TextImage\" component=\"true\" />","","<template>","\t<TextImage>","\t\t<slot name=\"image\" args=\"Dict params\">","\t\t\t<Image src={{ params.get(\"image\") }} />","\t\t</slot>","\t\t<slot name=\"text\" args=\"Dict params\">","\t\t\t<div class=\"image_text\">{{ params.get(\"label\") }}</div>","\t\t</slot>","\t</TextImage>","</template>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testStyle1: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<style>",".page_title{","\tfont-size: 18px;","\ttext-align: center;","}","</style>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testStyle2: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<style global=\"true\">",".page_title{","\tfont-size: 18px;","\ttext-align: center;","}","</style>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testStyle3: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<style global=\"true\">",".main_page{","background-image: ${ \"test\" };","}","</style>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testStyle4: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<style global=\"true\">","@font-face{","}","</style>","","</class>"]));
		var res = this.translate(ctx, content);
		var __v1 = use("Runtime.Unit.AssertHelper");
		__v1.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testStyle5: function(ctx)
	{
		this.reset(ctx);
		var __v0 = use("Runtime.rs");
		var content = __v0.join(ctx, "\n", use("Runtime.Vector").from(["<class name=\"App.Component\">","","<style global=\"true\">",".main_page{",".test{","font-size: 16px;","}","}","</style>","","</class>"]));
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
Object.assign(BayLang.Test.LangBay.Html,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Test.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.Test.LangBay.Html";
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
			"test1",
			"test2",
			"test3",
			"test4",
			"testTemplate1",
			"testTemplate2",
			"testTemplate3",
			"testComponent1",
			"testComponent2",
			"testComponent3",
			"testComponent4",
			"testComponent5",
			"testContent1",
			"testContent2",
			"testContent3",
			"testClick",
			"testScript1",
			"testSlot1",
			"testSlot2",
			"testStyle1",
			"testStyle2",
			"testStyle3",
			"testStyle4",
			"testStyle5",
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		if (field_name == "test1")
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
		if (field_name == "test2")
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
		if (field_name == "test3")
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
					new __v3(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testTemplate1")
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
		if (field_name == "testTemplate2")
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
		if (field_name == "testTemplate3")
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
		if (field_name == "testComponent1")
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
		if (field_name == "testComponent2")
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
		if (field_name == "testComponent3")
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
		if (field_name == "testComponent4")
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
		if (field_name == "testComponent5")
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
		if (field_name == "testContent1")
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
		if (field_name == "testContent2")
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
		if (field_name == "testContent3")
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
		if (field_name == "testClick")
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
		if (field_name == "testScript1")
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
		if (field_name == "testSlot1")
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
		if (field_name == "testSlot2")
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
		if (field_name == "testStyle1")
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
		if (field_name == "testStyle2")
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
		if (field_name == "testStyle3")
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
		if (field_name == "testStyle4")
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
		if (field_name == "testStyle5")
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
		return null;
	},
});use.add(BayLang.Test.LangBay.Html);
module.exports = BayLang.Test.LangBay.Html;