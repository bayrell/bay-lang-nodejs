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
BayLang.Exceptions.ParserUnknownError = function(ctx, s, code, prev)
{
	if (prev == undefined) prev = null;
	if (code == -1)
	{
		var __v0 = use("BayLang.LangUtils");
		code = __v0.ERROR_PARSER;
	}
	use("Runtime.Exceptions.AbstractException").call(this, ctx, s, code, prev);
};
BayLang.Exceptions.ParserUnknownError.prototype = Object.create(use("Runtime.Exceptions.AbstractException").prototype);
BayLang.Exceptions.ParserUnknownError.prototype.constructor = BayLang.Exceptions.ParserUnknownError;
Object.assign(BayLang.Exceptions.ParserUnknownError.prototype,
{
});
Object.assign(BayLang.Exceptions.ParserUnknownError, use("Runtime.Exceptions.AbstractException"));
Object.assign(BayLang.Exceptions.ParserUnknownError,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Exceptions";
	},
	getClassName: function()
	{
		return "BayLang.Exceptions.ParserUnknownError";
	},
	getParentClassName: function()
	{
		return "Runtime.Exceptions.AbstractException";
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
});use.add(BayLang.Exceptions.ParserUnknownError);
module.exports = BayLang.Exceptions.ParserUnknownError;