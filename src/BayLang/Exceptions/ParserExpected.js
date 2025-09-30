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
if (typeof BayLang.Exceptions == 'undefined') BayLang.Exceptions = {};
BayLang.Exceptions.ParserExpected = function(s, caret, file, prev)
{
	if (file == undefined) file = "";
	if (prev == undefined) prev = null;
	var __v0 = use("BayLang.LangConstant");
	use("BayLang.Exceptions.ParserError").call(this, s + use("Runtime.rtl").toStr(" expected"), caret, file, __v0.ERROR_PARSER_EXPECTED, prev);
};
BayLang.Exceptions.ParserExpected.prototype = Object.create(use("BayLang.Exceptions.ParserError").prototype);
BayLang.Exceptions.ParserExpected.prototype.constructor = BayLang.Exceptions.ParserExpected;
Object.assign(BayLang.Exceptions.ParserExpected.prototype,
{
});
Object.assign(BayLang.Exceptions.ParserExpected, use("BayLang.Exceptions.ParserError"));
Object.assign(BayLang.Exceptions.ParserExpected,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Exceptions";
	},
	getClassName: function()
	{
		return "BayLang.Exceptions.ParserExpected";
	},
	getParentClassName: function()
	{
		return "BayLang.Exceptions.ParserError";
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
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(field_name)
	{
		return null;
	},
});use.add(BayLang.Exceptions.ParserExpected);
module.exports = BayLang.Exceptions.ParserExpected;