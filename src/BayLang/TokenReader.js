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
BayLang.TokenReader = function(ctx)
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
	init: function(ctx, caret)
	{
		this.main_caret = caret;
		this.next_caret = caret.copy(ctx);
		this.readToken(ctx);
	},
	/**
	 * Returns caret
	 */
	caret: function(ctx)
	{
		return this.main_caret.copy(ctx);
	},
	/**
	 * Returns eof
	 */
	eof: function(ctx)
	{
		return this.main_caret.eof(ctx);
	},
	/**
	 * Returns next token
	 */
	nextToken: function(ctx)
	{
		return this.next_token;
	},
	/**
	 * Read token
	 */
	readToken: function(ctx)
	{
		var token = this.next_token;
		this.main_caret.seek(ctx, this.next_caret);
		this.next_token = this.next_caret.readToken(ctx);
		return token;
	},
	/**
	 * Returns parser error
	 */
	error: function(ctx, message)
	{
		return this.main_caret.error(ctx, message);
	},
	/**
	 * Returns expected error
	 */
	expected: function(ctx, message)
	{
		return this.main_caret.expected(ctx, message);
	},
	/**
	 * Match next token
	 */
	matchToken: function(ctx, ch)
	{
		if (this.nextToken(ctx) != ch)
		{
			throw this.expected(ctx, ch)
		}
		this.readToken(ctx);
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
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
});use.add(BayLang.TokenReader);
module.exports = BayLang.TokenReader;