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
BayLang.Exceptions.ParserError = function(ctx, s, caret, file, code, prev)
{
	if (file == undefined) file = "";
	if (code == undefined) code = -1;
	if (prev == undefined) prev = null;
	use("BayLang.Exceptions.ParserUnknownError").call(this, ctx, s, code, prev);
	this.error_line = caret.y + 1;
	this.error_pos = caret.x + 1;
	this.error_file = file;
};
BayLang.Exceptions.ParserError.prototype = Object.create(use("BayLang.Exceptions.ParserUnknownError").prototype);
BayLang.Exceptions.ParserError.prototype.constructor = BayLang.Exceptions.ParserError;
Object.assign(BayLang.Exceptions.ParserError.prototype,
{
	buildErrorMessage: function(ctx)
	{
		var error_str = this.getErrorMessage(ctx);
		var file = this.getFileName(ctx);
		var line = this.getErrorLine(ctx);
		var pos = this.getErrorPos(ctx);
		if (line != -1)
		{
			error_str += use("Runtime.rtl").toStr(" at Ln:" + use("Runtime.rtl").toStr(line) + use("Runtime.rtl").toStr(((pos != "") ? (", Pos:" + use("Runtime.rtl").toStr(pos)) : (""))));
		}
		if (file != "")
		{
			error_str += use("Runtime.rtl").toStr(" in file:'" + use("Runtime.rtl").toStr(file) + use("Runtime.rtl").toStr("'"));
		}
		return error_str;
	},
});
Object.assign(BayLang.Exceptions.ParserError, use("BayLang.Exceptions.ParserUnknownError"));
Object.assign(BayLang.Exceptions.ParserError,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Exceptions";
	},
	getClassName: function()
	{
		return "BayLang.Exceptions.ParserError";
	},
	getParentClassName: function()
	{
		return "BayLang.Exceptions.ParserUnknownError";
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
});use.add(BayLang.Exceptions.ParserError);
module.exports = BayLang.Exceptions.ParserError;