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
if (typeof BayLang.OpCodes == 'undefined') BayLang.OpCodes = {};
BayLang.OpCodes.OpHtmlStyle = function()
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
	serialize: function(serializer, data)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype.serialize.call(this, serializer, data);
		serializer.process(this, "content", data);
		serializer.process(this, "is_global", data);
		serializer.process(this, "value", data);
	},
	/**
	 * Read styles from content
	 */
	readStyles: function()
	{
		var __v0 = use("BayLang.TokenReader");
		var reader = new __v0();
		var __v1 = use("BayLang.Caret");
		var __v2 = use("Runtime.Reference");
		reader.init(new __v1(use("Runtime.Map").from({"content":new __v2(this.content)})));
		var styles = use("Runtime.Map").from({});
		while (!reader.eof() && reader.nextToken() == ".")
		{
			var selector = this.readSelector(reader);
			var code = this.readCssBlock(reader);
			styles.set(selector, code);
		}
		return styles;
	},
	/**
	 * Read selector
	 */
	readSelector: function(reader)
	{
		var items = use("Runtime.Vector").from([]);
		while (!reader.eof() && reader.nextToken() != "{")
		{
			items.push(reader.readToken());
		}
		var __v0 = use("Runtime.rs");
		return __v0.join("", items);
	},
	/**
	 * Read css block
	 */
	readCssBlock: function(reader)
	{
		reader.matchToken("{");
		var caret = reader.main_caret;
		var level = 0;
		var items = use("Runtime.Vector").from([]);
		while (!caret.eof() && (caret.nextChar() != "}" && level == 0 || level > 0))
		{
			var ch = caret.readChar();
			if (ch == "{")
			{
				level = level + 1;
			}
			if (ch == "}")
			{
				level = level - 1;
			}
			items.push(ch);
		}
		reader.init(caret);
		reader.matchToken("}");
		var __v0 = use("Runtime.rs");
		return __v0.join("", items);
	},
	_init: function()
	{
		use("BayLang.OpCodes.BaseOpCode").prototype._init.call(this);
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
});use.add(BayLang.OpCodes.OpHtmlStyle);
module.exports = BayLang.OpCodes.OpHtmlStyle;