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
BayLang.LangUtils = function(ctx)
{
};
Object.assign(BayLang.LangUtils.prototype,
{
});
Object.assign(BayLang.LangUtils,
{
	ERROR_PARSER: -1000,
	ERROR_PARSER_EOF: -1001,
	ERROR_PARSER_EXPECTED: -1002,
	/**
	 * Create parser
	 */
	createParser: function(ctx, lang)
	{
		if (lang == undefined) lang = "";
		if (lang == "bay")
		{
			var __v0 = use("BayLang.LangBay.ParserBay");
			return new __v0(ctx);
		}
		else if (lang == "es6")
		{
			var __v1 = use("BayLang.LangES6.ParserES6");
			return new __v1(ctx);
		}
		else if (lang == "php")
		{
			var __v2 = use("BayLang.LangPHP.ParserPHP");
			return new __v2(ctx);
		}
		return null;
	},
	/**
	 * Create translator
	 */
	createTranslator: function(ctx, lang)
	{
		if (lang == undefined) lang = "";
		if (lang == "bay")
		{
			var __v0 = use("BayLang.LangBay.TranslatorBay");
			return new __v0(ctx);
		}
		else if (lang == "es6")
		{
			var __v1 = use("BayLang.LangES6.TranslatorES6");
			return new __v1(ctx);
		}
		else if (lang == "nodejs")
		{
			var __v2 = use("BayLang.LangNode.TranslatorNode");
			return new __v2(ctx);
		}
		else if (lang == "php")
		{
			var __v3 = use("BayLang.LangPHP.TranslatorPHP");
			return new __v3(ctx);
		}
		return null;
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang";
	},
	getClassName: function()
	{
		return "BayLang.LangUtils";
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
});use.add(BayLang.LangUtils);
module.exports = BayLang.LangUtils;