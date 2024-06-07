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
if (typeof Bayrell == 'undefined') Bayrell = {};
if (typeof Bayrell.Lang == 'undefined') Bayrell.Lang = {};
if (typeof Bayrell.Lang.Test == 'undefined') Bayrell.Lang.Test = {};
if (typeof Bayrell.Lang.Test.LangBay == 'undefined') Bayrell.Lang.Test.LangBay = {};
Bayrell.Lang.Test.LangBay.Main = function(ctx)
{
};
Object.assign(Bayrell.Lang.Test.LangBay.Main.prototype,
{
	/**
	 * Reset
	 */
	reset: function(ctx)
	{
		var __v0 = use("Bayrell.Lang.LangBay.ParserBay");
		this.parser = new __v0(ctx);
		this.parser = this.parser.constructor.reset(ctx, this.parser);
		var __v1 = use("Bayrell.Lang.LangBay.TranslatorBay");
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
	translate: function(ctx, content)
	{
		var result = use("Runtime.Vector").from([]);
		this.setContent(ctx, content);
		/* Parse */
		var res = this.parser.parser_expression.constructor.readExpression(ctx, this.parser);
		var op_code = res.get(ctx, 1);
		/* Translate */
		this.translator.expression.translate(ctx, op_code, result);
		var __v0 = use("Runtime.rs");
		return use("Runtime.Vector").from([op_code,__v0.join(ctx, "", result)]);
	},
	testNumber: function(ctx)
	{
		this.reset(ctx);
		var content = "1";
		var res = this.translate(ctx, content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	testIdentifier: function(ctx)
	{
		this.reset(ctx);
		this.addVar(ctx, "a");
		var content = "a";
		var res = this.translate(ctx, content);
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(ctx, content, res.get(ctx, 1), content);
	},
	_init: function(ctx)
	{
		this.parser = null;
		this.translator = null;
	},
});
Object.assign(Bayrell.Lang.Test.LangBay.Main,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Bayrell.Lang.Test.LangBay";
	},
	getClassName: function()
	{
		return "Bayrell.Lang.Test.LangBay.Main";
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
			"testNumber",
			"testIdentifier",
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		if (field_name == "testNumber")
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
		if (field_name == "testIdentifier")
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
		return null;
	},
});use.add(Bayrell.Lang.Test.LangBay.Main);
module.exports = Bayrell.Lang.Test.LangBay.Main;