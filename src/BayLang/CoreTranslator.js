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
BayLang.CoreTranslator = function(ctx)
{
	use("Runtime.BaseObject").apply(this, arguments);
};
BayLang.CoreTranslator.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.CoreTranslator.prototype.constructor = BayLang.CoreTranslator;
Object.assign(BayLang.CoreTranslator.prototype,
{
	/**
	 * Set flag
	 */
	setFlag: function(ctx, flag_name, value)
	{
		this.preprocessor_flags.set(ctx, flag_name, value);
		return this;
	},
	/**
	 * Increment indent level
	 */
	levelInc: function(ctx)
	{
		this.indent_level = this.indent_level + 1;
	},
	/**
	 * Decrease indent level
	 */
	levelDec: function(ctx)
	{
		this.indent_level = this.indent_level - 1;
	},
	/**
	 * Returns new line with indent
	 */
	newLine: function(ctx)
	{
		var __v0 = use("Runtime.rs");
		return this.crlf + use("Runtime.rtl").toStr(__v0.str_repeat(ctx, this.indent, this.indent_level));
	},
	/**
	 * Returns string
	 */
	toString: function(ctx, s)
	{
		return s;
	},
	/**
	 * Translate BaseOpCode
	 */
	translate: function(ctx, op_code)
	{
		return "";
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.opcode_level = 0;
		this.indent_level = 0;
		this.last_semicolon = false;
		this.indent = "\t";
		this.crlf = "\n";
		this.preprocessor_flags = use("Runtime.Map").from({});
	},
});
Object.assign(BayLang.CoreTranslator, use("Runtime.BaseObject"));
Object.assign(BayLang.CoreTranslator,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang";
	},
	getClassName: function()
	{
		return "BayLang.CoreTranslator";
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
});use.add(BayLang.CoreTranslator);
module.exports = BayLang.CoreTranslator;