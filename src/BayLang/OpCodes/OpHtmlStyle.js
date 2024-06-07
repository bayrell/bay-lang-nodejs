"use strict;"
var use = require('bay-lang').use;
/*!
 *  BayLang Technology
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
if (typeof BayLang == 'undefined') BayLang = {};
if (typeof BayLang.OpCodes == 'undefined') BayLang.OpCodes = {};
BayLang.OpCodes.OpHtmlStyle = function(ctx)
{
	use("BayLang.OpCodes.BaseOpCode").apply(this, arguments);
};
BayLang.OpCodes.OpHtmlStyle.prototype = Object.create(use("BayLang.OpCodes.BaseOpCode").prototype);
BayLang.OpCodes.OpHtmlStyle.prototype.constructor = BayLang.OpCodes.OpHtmlStyle;
Object.assign(BayLang.OpCodes.OpHtmlStyle.prototype,
{
	/**
	 * Serialize object
	 */
	serialize: function(ctx, serializer, data)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype.serialize.call(this, ctx, serializer, data);
		serializer.process(ctx, this, "content", data);
		serializer.process(ctx, this, "is_global", data);
		serializer.process(ctx, this, "value", data);
	},
	/**
	 * Read styles from content
	 */
	readStyles: function(ctx)
	{
		var __v0 = use("BayLang.TokenReader");
		var reader = new __v0(ctx);
		var __v1 = use("BayLang.Caret");
		var __v2 = use("Runtime.Reference");
		reader.init(ctx, new __v1(ctx, use("Runtime.Map").from({"content":new __v2(ctx, this.content)})));
		var styles = use("Runtime.Map").from({});
		while (!reader.eof(ctx) && reader.nextToken(ctx) == ".")
		{
			var selector = this.readSelector(ctx, reader);
			var code = this.readCssBlock(ctx, reader);
			styles.set(ctx, selector, code);
		}
		return styles;
	},
	/**
	 * Read selector
	 */
	readSelector: function(ctx, reader)
	{
		var items = use("Runtime.Vector").from([]);
		while (!reader.eof(ctx) && reader.nextToken(ctx) != "{")
		{
			items.push(ctx, reader.readToken(ctx));
		}
		var __v0 = use("Runtime.rs");
		return __v0.join(ctx, "", items);
	},
	/**
	 * Read css block
	 */
	readCssBlock: function(ctx, reader)
	{
		reader.matchToken(ctx, "{");
		var caret = reader.main_caret;
		caret.skipSpace(ctx);
		var items = use("Runtime.Vector").from([]);
		while (!caret.eof(ctx) && caret.nextChar(ctx) != "}")
		{
			var ch = caret.readChar(ctx);
			if (ch != "\t")
			{
				items.push(ctx, ch);
			}
		}
		reader.init(ctx, caret);
		reader.matchToken(ctx, "}");
		var __v0 = use("Runtime.rs");
		var __v1 = use("Runtime.rs");
		return __v0.trim(ctx, __v1.join(ctx, "", items));
	},
	_init: function(ctx)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype._init.call(this,ctx);
		this.op = "op_html_style";
		this.content = "";
		this.is_global = false;
		this.value = null;
	},
});
Object.assign(BayLang.OpCodes.OpHtmlStyle, use("BayLang.OpCodes.BaseOpCode"));
Object.assign(BayLang.OpCodes.OpHtmlStyle,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.OpCodes";
	},
	getClassName: function()
	{
		return "BayLang.OpCodes.OpHtmlStyle";
	},
	getParentClassName: function()
	{
		return "BayLang.OpCodes.BaseOpCode";
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
});use.add(BayLang.OpCodes.OpHtmlStyle);
module.exports = BayLang.OpCodes.OpHtmlStyle;