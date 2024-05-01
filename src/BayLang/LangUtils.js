"use strict;"
var use = require('bay-lang').use;
/*!
 *  Bayrell Language
 *
 *  (c) Copyright 2016-2023 "Ildar Bikmamatov" <support@bayrell.org>
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
Bayrell.Lang.LangUtils = function(ctx)
{
};
Object.assign(Bayrell.Lang.LangUtils.prototype,
{
});
Object.assign(Bayrell.Lang.LangUtils,
{
	/**
	 * Parse file and convert to BaseOpCode
	 */
	parse: function(ctx, parser, text)
	{
		var res = parser.constructor.parse(ctx, parser, text);
		return Runtime.rtl.attr(ctx, res, 1);
	},
	/**
	 * Translate BaseOpCode to string
	 */
	translate: function(ctx, translator, op_code)
	{
		var res = translator.constructor.translate(ctx, translator, op_code);
		return Runtime.rtl.attr(ctx, res, 1);
	},
	/**
	 * Create translator
	 */
	createTranslator: function(ctx, lang)
	{
		if (lang == undefined) lang = "";
		var t = null;
		if (lang == "php")
		{
			var __v0 = use("Bayrell.Lang.LangPHP.TranslatorPHP");
			t = new __v0(ctx);
		}
		if (lang == "es6")
		{
			var __v0 = use("Bayrell.Lang.LangES6.TranslatorES6");
			t = new __v0(ctx);
		}
		if (lang == "nodejs")
		{
			var __v0 = use("Bayrell.Lang.LangNode.TranslatorNode");
			t = new __v0(ctx);
		}
		return t;
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Bayrell.Lang";
	},
	getClassName: function()
	{
		return "Bayrell.Lang.LangUtils";
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
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		return null;
	},
});use.add(Bayrell.Lang.LangUtils);
module.exports = Bayrell.Lang.LangUtils;