"use strict;"
var use = require('bay-lang').use;
/*!
 *  Bayrell Parser Library.
 *
 *  (c) Copyright 2016-2018 "Ildar Bikmamatov" <support@bayrell.org>
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
if (typeof Bayrell.Lang.Exceptions == 'undefined') Bayrell.Lang.Exceptions = {};
Bayrell.Lang.Exceptions.ParserError = function(ctx, s, caret, file, code, context, prev)
{
	if (file == undefined) file = "";
	if (prev == undefined) prev = null;
	use("Bayrell.Lang.Exceptions.ParserUnknownError").call(this, ctx, s, code, context, prev);
	this.error_line = caret.y + 1;
	this.error_pos = caret.x + 1;
	this.error_file = file;
};
Bayrell.Lang.Exceptions.ParserError.prototype = Object.create(use("Bayrell.Lang.Exceptions.ParserUnknownError").prototype);
Bayrell.Lang.Exceptions.ParserError.prototype.constructor = Bayrell.Lang.Exceptions.ParserError;
Object.assign(Bayrell.Lang.Exceptions.ParserError.prototype,
{
	buildMessage: function(ctx)
	{
		var error_str = this.error_str;
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
Object.assign(Bayrell.Lang.Exceptions.ParserError, use("Bayrell.Lang.Exceptions.ParserUnknownError"));
Object.assign(Bayrell.Lang.Exceptions.ParserError,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Bayrell.Lang.Exceptions";
	},
	getClassName: function()
	{
		return "Bayrell.Lang.Exceptions.ParserError";
	},
	getParentClassName: function()
	{
		return "Bayrell.Lang.Exceptions.ParserUnknownError";
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
});use.add(Bayrell.Lang.Exceptions.ParserError);
module.exports = Bayrell.Lang.Exceptions.ParserError;