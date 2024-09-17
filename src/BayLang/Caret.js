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
BayLang.Caret = function(ctx, items)
{
	if (items == undefined) items = null;
	use("Runtime.BaseObject").call(this, ctx);
	if (items)
	{
		if (items.has(ctx, "file_name"))
		{
			this.file_name = items.get(ctx, "file_name");
		}
		if (items.has(ctx, "content"))
		{
			this.content = items.get(ctx, "content");
		}
		if (items.has(ctx, "content_sz"))
		{
			this.content_sz = items.get(ctx, "content_sz");
		}
		if (items.has(ctx, "content") && !items.has(ctx, "content_sz"))
		{
			var __v0 = use("Runtime.rs");
			this.content_sz = __v0.strlen(ctx, this.content.ref);
		}
		if (items.has(ctx, "tab_size"))
		{
			this.tab_size = items.get(ctx, "tab_size");
		}
		if (items.has(ctx, "pos"))
		{
			this.pos = items.get(ctx, "pos");
		}
		if (items.has(ctx, "x"))
		{
			this.x = items.get(ctx, "x");
		}
		if (items.has(ctx, "y"))
		{
			this.y = items.get(ctx, "y");
		}
	}
};
BayLang.Caret.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.Caret.prototype.constructor = BayLang.Caret;
Object.assign(BayLang.Caret.prototype,
{
	/**
	 * Clone
	 */
	clone: function(ctx, items)
	{
		if (items == undefined) items = null;
		var __v0 = use("BayLang.Caret");
		return new __v0(ctx, use("Runtime.Map").from({"file_name":(items) ? (items.get(ctx, "file_name", this.file_name)) : (this.file_name),"content":(items) ? (items.get(ctx, "content", this.content)) : (this.content),"content_sz":(items) ? (items.get(ctx, "content_sz", this.content_sz)) : (this.content_sz),"tab_size":(items) ? (items.get(ctx, "tab_size", this.tab_size)) : (this.tab_size),"pos":(items) ? (items.get(ctx, "pos", this.pos)) : (this.pos),"x":(items) ? (items.get(ctx, "x", this.x)) : (this.x),"y":(items) ? (items.get(ctx, "y", this.y)) : (this.y)}));
	},
	/**
	 * Copy caret
	 */
	copy: function(ctx, items)
	{
		if (items == undefined) items = null;
		return this.clone(ctx, items);
	},
	/**
	 * Serialize object
	 */
	serialize: function(ctx, serializer, data)
	{
		serializer.process(ctx, this, "pos", data);
		serializer.process(ctx, this, "x", data);
		serializer.process(ctx, this, "y", data);
	},
	/**
	 * Seek caret
	 */
	seek: function(ctx, caret)
	{
		this.pos = caret.pos;
		this.x = caret.x;
		this.y = caret.y;
	},
	/**
	 * Returns true if eof
	 */
	eof: function(ctx)
	{
		return this.pos >= this.content_sz;
	},
	/**
	 * Returns next X
	 */
	nextX: function(ctx, ch, direction)
	{
		if (direction == undefined) direction = 1;
		if (ch == "\t")
		{
			return this.x + this.tab_size * direction;
		}
		if (ch == "\n")
		{
			return 0;
		}
		return this.x + direction;
	},
	/**
	 * Returns next Y
	 */
	nextY: function(ctx, ch, direction)
	{
		if (direction == undefined) direction = 1;
		if (ch == "\n")
		{
			return this.y + direction;
		}
		return this.y;
	},
	/**
	 * Returns next char
	 */
	nextChar: function(ctx)
	{
		var __v0 = use("Runtime.rs");
		return __v0.charAt(ctx, this.content.ref, this.pos, 1);
	},
	/**
	 * Returns string
	 */
	getString: function(ctx, start_pos, count)
	{
		var __v0 = use("Runtime.rs");
		return __v0.substr(ctx, this.content.ref, start_pos, count);
	},
	/**
	 * Returns next string
	 */
	nextString: function(ctx, count)
	{
		var __v0 = use("Runtime.rs");
		return __v0.substr(ctx, this.content.ref, this.pos, count);
	},
	/**
	 * Returns true if next char
	 */
	isNextChar: function(ctx, ch)
	{
		return this.nextChar(ctx) == ch;
	},
	/**
	 * Returns true if next string
	 */
	isNextString: function(ctx, s)
	{
		var __v0 = use("Runtime.rs");
		return this.nextString(ctx, __v0.strlen(ctx, s)) == s;
	},
	/**
	 * Shift by char
	 */
	shift: function(ctx, ch)
	{
		this.x = this.nextX(ctx, ch);
		this.y = this.nextY(ctx, ch);
		this.pos = this.pos + 1;
	},
	/**
	 * Read char
	 */
	readChar: function(ctx)
	{
		var __v0 = use("Runtime.rs");
		var ch = __v0.charAt(ctx, this.content.ref, this.pos);
		this.shift(ctx, ch);
		return ch;
	},
	/**
	 * Read char
	 */
	readString: function(ctx, count)
	{
		var s = this.nextString(ctx, count);
		var __v0 = use("Runtime.rs");
		var count = __v0.strlen(ctx, s);
		for (var i = 0; i < count; i++)
		{
			var __v1 = use("Runtime.rs");
			var ch = __v1.charAt(ctx, s, i);
			this.shift(ctx, ch);
		}
		return s;
	},
	/**
	 * Match char
	 */
	matchChar: function(ctx, ch)
	{
		var next = this.nextChar(ctx);
		if (next != ch)
		{
			var __v0 = use("BayLang.Exceptions.ParserExpected");
			throw new __v0(ctx, ch, this, this.file_name)
		}
		this.readChar(ctx);
	},
	/**
	 * Match string
	 */
	matchString: function(ctx, s)
	{
		var __v0 = use("Runtime.rs");
		var count = __v0.strlen(ctx, s);
		var next_string = this.nextString(ctx, count);
		if (next_string != s)
		{
			var __v1 = use("BayLang.Exceptions.ParserExpected");
			throw new __v1(ctx, s, this, this.file_name)
		}
		this.readString(ctx, count);
	},
	/**
	 * Skip chars
	 */
	skipChar: function(ctx, ch)
	{
		if (this.nextChar(ctx) == ch)
		{
			this.readChar(ctx);
			return true;
		}
		return false;
	},
	/**
	 * Skip space
	 */
	skipSpace: function(ctx)
	{
		while (!this.eof(ctx) && this.constructor.isSkipChar(ctx, this.nextChar(ctx)))
		{
			this.readChar(ctx);
		}
	},
	/**
	 * Returns true if token char
	 */
	isTokenChar: function(ctx, ch)
	{
		var __v0 = use("Runtime.rs");
		var __v1 = use("Runtime.rs");
		return __v0.indexOf(ctx, "qazwsxedcrfvtgbyhnujmikolp0123456789_", __v1.lower(ctx, ch)) !== -1;
	},
	/**
	 * Read next token
	 */
	readToken: function(ctx)
	{
		var items = use("Runtime.Vector").from([]);
		this.skipSpace(ctx);
		if (this.eof(ctx))
		{
			return "";
		}
		if (!this.isTokenChar(ctx, this.nextChar(ctx)))
		{
			return this.readChar(ctx);
		}
		while (!this.eof(ctx) && this.isTokenChar(ctx, this.nextChar(ctx)))
		{
			items.push(ctx, this.readChar(ctx));
		}
		var __v0 = use("Runtime.rs");
		return __v0.join(ctx, "", items);
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.file_name = null;
		this.content = null;
		this.content_sz = 0;
		this.pos = 0;
		this.x = 0;
		this.y = 0;
		this.tab_size = 4;
	},
});
Object.assign(BayLang.Caret, use("Runtime.BaseObject"));
Object.assign(BayLang.Caret,
{
	/**
	 * Return true if is char
	 * @param char ch
	 * @return boolean
	 */
	isChar: function(ctx, ch)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("BayLang.Caret.isChar", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		var __v0 = use("Runtime.rs");
		var __v1 = use("Runtime.rs");
		var __memorize_value = __v0.indexOf(ctx, "qazwsxedcrfvtgbyhnujmikolp", __v1.lower(ctx, ch)) !== -1;
		use("Runtime.rtl")._memorizeSave("BayLang.Caret.isChar", arguments, __memorize_value);
		return __memorize_value;
	},
	/**
	 * Return true if is number
	 * @param char ch
	 * @return boolean
	 */
	isNumber: function(ctx, ch)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("BayLang.Caret.isNumber", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		var __v0 = use("Runtime.rs");
		var __memorize_value = __v0.indexOf(ctx, "0123456789", ch) !== -1;
		use("Runtime.rtl")._memorizeSave("BayLang.Caret.isNumber", arguments, __memorize_value);
		return __memorize_value;
	},
	/**
	 * Return true if char is number
	 * @param char ch
	 * @return boolean
	 */
	isHexChar: function(ctx, ch)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("BayLang.Caret.isHexChar", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		var __v0 = use("Runtime.rs");
		var __v1 = use("Runtime.rs");
		var __memorize_value = __v0.indexOf(ctx, "0123456789abcdef", __v1.lower(ctx, ch)) !== -1;
		use("Runtime.rtl")._memorizeSave("BayLang.Caret.isHexChar", arguments, __memorize_value);
		return __memorize_value;
	},
	/**
	 * Return true if is string of numbers
	 * @param string s
	 * @return boolean
	 */
	isStringOfNumbers: function(ctx, s)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("BayLang.Caret.isStringOfNumbers", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		var __v0 = use("Runtime.rs");
		var sz = __v0.strlen(ctx, s);
		for (var i = 0; i < sz; i++)
		{
			var __v1 = use("Runtime.rs");
			if (!this.isNumber(ctx, __v1.charAt(ctx, s, i)))
			{
				var __memorize_value = false;
				use("Runtime.rtl")._memorizeSave("BayLang.Caret.isStringOfNumbers", arguments, __memorize_value);
				return __memorize_value;
			}
		}
		var __memorize_value = true;
		use("Runtime.rtl")._memorizeSave("BayLang.Caret.isStringOfNumbers", arguments, __memorize_value);
		return __memorize_value;
	},
	/**
	 * Return true if char is system or space. ASCII code <= 32.
	 * @param char ch
	 * @return boolean
	 */
	isSkipChar: function(ctx, ch)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("BayLang.Caret.isSkipChar", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		var __v0 = use("Runtime.rs");
		if (__v0.ord(ctx, ch) <= 32)
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.Caret.isSkipChar", arguments, __memorize_value);
			return __memorize_value;
		}
		var __memorize_value = false;
		use("Runtime.rtl")._memorizeSave("BayLang.Caret.isSkipChar", arguments, __memorize_value);
		return __memorize_value;
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang";
	},
	getClassName: function()
	{
		return "BayLang.Caret";
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
	__implements__:
	[
		use("Runtime.SerializeInterface"),
	],
});use.add(BayLang.Caret);
module.exports = BayLang.Caret;