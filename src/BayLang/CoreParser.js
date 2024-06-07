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
	use("Runtime.BaseStruct").apply(this, arguments);
};
BayLang.CoreParser.prototype = Object.create(use("Runtime.BaseStruct").prototype);
BayLang.CoreParser.prototype.constructor = BayLang.CoreParser;
Object.assign(BayLang.CoreParser.prototype,
{
	/**
	 * Returns true if eof
	 */
	isEof: function(ctx)
	{
		return this.caret.pos >= this.content_sz;
	},
	/**
	 * Returns caret
	 */
	getCaret: function(ctx)
	{
		return this.caret.clone(ctx, use("Runtime.Map").from({"file_name":this.file_name,"content":this.content,"content_sz":this.content_sz}));
	},
	_init: function(ctx)
	{
		use("Runtime.BaseStruct").prototype._init.call(this,ctx);
		this.tab_size = 4;
		this.file_name = "";
		this.content = null;
		this.content_sz = 0;
		this.caret = null;
		this.find_ident = true;
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "tab_size")return this.tab_size;
		else if (k == "file_name")return this.file_name;
		else if (k == "content")return this.content;
		else if (k == "content_sz")return this.content_sz;
		else if (k == "caret")return this.caret;
		else if (k == "find_ident")return this.find_ident;
		return use("Runtime.BaseStruct").prototype.takeValue.call(this,ctx,k,d);
	},
});
Object.assign(BayLang.CoreParser, use("Runtime.BaseStruct"));
Object.assign(BayLang.CoreParser,
{
	/**
	 * Reset parser
	 */
	reset: function(ctx, parser)
	{
		var __v0 = use("BayLang.Caret");
		return parser.copy(ctx, use("Runtime.Map").from({"caret":new __v0(ctx, use("Runtime.Map").from({})),"token":null}));
	},
	/**
	 * Set content
	 */
	setContent: function(ctx, parser, content)
	{
		var __v0 = use("Runtime.Reference");
		var __v1 = use("Runtime.rs");
		return parser.copy(ctx, use("Runtime.Map").from({"content":new __v0(ctx, content),"content_sz":__v1.strlen(ctx, content)}));
	},
	/**
	 * Parse file and convert to BaseOpCode
	 */
	parse: function(ctx, parser, content)
	{
		parser = this.reset(ctx, parser);
		parser = this.setContent(ctx, parser, content);
		while (parser.caret.pos < parser.content_sz)
		{
			parser = parser.constructor.nextToken(ctx, parser);
		}
		return parser;
	},
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
		return "Runtime.BaseStruct";
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
		a.push("tab_size");
		a.push("file_name");
		a.push("content");
		a.push("content_sz");
		a.push("caret");
		a.push("find_ident");
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