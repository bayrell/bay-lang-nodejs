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
BayLang.TokenReader = function()
{
	use("Runtime.BaseObject").apply(this, arguments);
};
BayLang.TokenReader.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.TokenReader.prototype.constructor = BayLang.TokenReader;
Object.assign(BayLang.TokenReader.prototype,
{
	/**
	 * Init token reader
	 */
	init: function(caret)
	{
		this.main_caret = caret;
		this.next_caret = caret.copy();
		this.readToken();
	},
	/**
	 * Returns eof
	 */
	eof: function()
	{
		return this.main_caret.eof();
	},
	/**
	 * Returns next token
	 */
	nextToken: function()
	{
		return this.next_token;
	},
	/**
	 * Read token
	 */
	readToken: function()
	{
		var token = this.next_token;
		this.main_caret.seek(this.next_caret);
		this.next_token = this.next_caret.readToken();
		return token;
	},
	/**
	 * Match next token
	 */
	matchToken: function(ch)
	{
		if (this.nextToken() != ch)
		{
			var __v0 = use("BayLang.Exceptions.ParserExpected");
			throw new __v0(ch, this.main_caret, this.main_caret.file_name)
		}
		this.readToken();
	},
	_init: function()
	{
		use("Runtime.BaseObject").prototype._init.call(this);
		this.main_caret = null;
		this.next_caret = null;
		this.next_token = "";
	},
});
Object.assign(BayLang.TokenReader, use("Runtime.BaseObject"));
Object.assign(BayLang.TokenReader,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang";
	},
	getClassName: function()
	{
		return "BayLang.TokenReader";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
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
});use.add(BayLang.TokenReader);
module.exports = BayLang.TokenReader;