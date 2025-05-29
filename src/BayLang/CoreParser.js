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
BayLang.CoreParser = function(ctx)
{
	use("Runtime.BaseObject").apply(this, arguments);
};
BayLang.CoreParser.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.CoreParser.prototype.constructor = BayLang.CoreParser;
Object.assign(BayLang.CoreParser.prototype,
{
	/**
	 * Set content
	 */
	setContent: function(ctx, content)
	{
		this.content = content;
		var __v0 = use("Runtime.rs");
		this.content_size = __v0.strlen(ctx, content);
		return this;
	},
	/**
	 * Create reader
	 */
	createReader: function(ctx)
	{
		var __v0 = use("BayLang.TokenReader");
		var reader = new __v0(ctx);
		var __v1 = use("BayLang.Caret");
		var __v2 = use("Runtime.Reference");
		reader.init(ctx, new __v1(ctx, use("Runtime.Map").from({"content":new __v2(ctx, this.content),"tab_size":this.tab_size})));
		return reader;
	},
	/**
	 * Parse file and convert to BaseOpCode
	 */
	parse: function(ctx)
	{
		return null;
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.file_name = "";
		this.content = "";
		this.content_size = 0;
		this.tab_size = 4;
	},
});
Object.assign(BayLang.CoreParser, use("Runtime.BaseObject"));
Object.assign(BayLang.CoreParser,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang";
	},
	getClassName: function()
	{
		return "BayLang.CoreParser";
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
});use.add(BayLang.CoreParser);
module.exports = BayLang.CoreParser;