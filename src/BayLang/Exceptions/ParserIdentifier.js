"use strict;"
var use = require('bay-lang').use;
/*!
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
if (typeof BayLang.Exceptions == 'undefined') BayLang.Exceptions = {};
BayLang.Exceptions.ParserIdentifier = function(s, caret, file, code, prev)
{
	if (file == undefined) file = "";
	if (code == undefined) code = -1;
	if (prev == undefined) prev = null;
	use("BayLang.Exceptions.ParserError").call(this, s, caret, file, code, prev);
};
BayLang.Exceptions.ParserIdentifier.prototype = Object.create(use("BayLang.Exceptions.ParserError").prototype);
BayLang.Exceptions.ParserIdentifier.prototype.constructor = BayLang.Exceptions.ParserIdentifier;
Object.assign(BayLang.Exceptions.ParserIdentifier.prototype,
{
});
Object.assign(BayLang.Exceptions.ParserIdentifier, use("BayLang.Exceptions.ParserError"));
Object.assign(BayLang.Exceptions.ParserIdentifier,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Exceptions";
	},
	getClassName: function()
	{
		return "BayLang.Exceptions.ParserIdentifier";
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
});use.add(BayLang.Exceptions.ParserIdentifier);
module.exports = BayLang.Exceptions.ParserIdentifier;