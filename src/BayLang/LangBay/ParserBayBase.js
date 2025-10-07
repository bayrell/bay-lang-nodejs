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
if (typeof BayLang.LangBay == 'undefined') BayLang.LangBay = {};
BayLang.LangBay.ParserBayBase = function()
{
};
Object.assign(BayLang.LangBay.ParserBayBase.prototype,
{
});
Object.assign(BayLang.LangBay.ParserBayBase,
{
	/**
	 * Return true if is char
	 * @param char ch
	 * @return boolean
	 */
	isChar: function(ch)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("BayLang.LangBay.ParserBayBase.isChar", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		var __v0 = use("Runtime.rs");
		var __v1 = use("Runtime.rs");
		var __memorize_value = __v0.indexOf("qazwsxedcrfvtgbyhnujmikolp", __v1.lower(ch)) !== -1;
		use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isChar", arguments, __memorize_value);
		return __memorize_value;
	},
	/**
	 * Return true if is number
	 * @param char ch
	 * @return boolean
	 */
	isNumber: function(ch)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("BayLang.LangBay.ParserBayBase.isNumber", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		var __v0 = use("Runtime.rs");
		var __memorize_value = __v0.indexOf("0123456789", ch) !== -1;
		use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isNumber", arguments, __memorize_value);
		return __memorize_value;
	},
	/**
	 * Return true if char is number
	 * @param char ch
	 * @return boolean
	 */
	isHexChar: function(ch)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("BayLang.LangBay.ParserBayBase.isHexChar", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		var __v0 = use("Runtime.rs");
		var __v1 = use("Runtime.rs");
		var __memorize_value = __v0.indexOf("0123456789abcdef", __v1.lower(ch)) !== -1;
		use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isHexChar", arguments, __memorize_value);
		return __memorize_value;
	},
	/**
	 * Return true if is string of numbers
	 * @param string s
	 * @return boolean
	 */
	isStringOfNumbers: function(s)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("BayLang.LangBay.ParserBayBase.isStringOfNumbers", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		var __v0 = use("Runtime.rs");
		var sz = __v0.strlen(s);
		for (var i = 0; i < sz; i++)
		{
			var __v1 = use("Runtime.rs");
			if (!this.isNumber(__v1.charAt(s, i)))
			{
				var __memorize_value = false;
				use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isStringOfNumbers", arguments, __memorize_value);
				return __memorize_value;
			}
		}
		var __memorize_value = true;
		use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isStringOfNumbers", arguments, __memorize_value);
		return __memorize_value;
	},
	/**
	 * Is system type
	 */
	isSystemType: function(name)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("BayLang.LangBay.ParserBayBase.isSystemType", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		if (name == "var")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "void")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "bool")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "byte")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "int")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "double")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "float")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "char")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "string")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "list")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "scalar")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "primitive")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "html")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "Error")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "Object")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "DateTime")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "Collection")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "Dict")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "Vector")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "Map")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "rs")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "rtl")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "ArrayInterface")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
			return __memorize_value;
		}
		var __memorize_value = false;
		use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSystemType", arguments, __memorize_value);
		return __memorize_value;
	},
	/**
	 * Returns true if name is identifier
	 */
	isIdentifier: function(name)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("BayLang.LangBay.ParserBayBase.isIdentifier", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		if (name == "")
		{
			var __memorize_value = false;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isIdentifier", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "@")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isIdentifier", arguments, __memorize_value);
			return __memorize_value;
		}
		var __v0 = use("Runtime.rs");
		if (this.isNumber(__v0.charAt(name, 0)))
		{
			var __memorize_value = false;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isIdentifier", arguments, __memorize_value);
			return __memorize_value;
		}
		var __v1 = use("Runtime.rs");
		var sz = __v1.strlen(name);
		for (var i = 0; i < sz; i++)
		{
			var __v2 = use("Runtime.rs");
			var ch = __v2.charAt(name, i);
			if (this.isChar(ch) || this.isNumber(ch) || ch == "_")
			{
				continue;
			}
			var __memorize_value = false;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isIdentifier", arguments, __memorize_value);
			return __memorize_value;
		}
		var __memorize_value = true;
		use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isIdentifier", arguments, __memorize_value);
		return __memorize_value;
	},
	/**
	 * Returns true if reserved words
	 */
	isReserved: function(name)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("BayLang.LangBay.ParserBayBase.isReserved", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		if (name == "__async_t")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isReserved", arguments, __memorize_value);
			return __memorize_value;
		}
		if (name == "__async_var")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isReserved", arguments, __memorize_value);
			return __memorize_value;
		}
		/*if (name == "__ctx") return true;*/
		/*if (name == "ctx") return true;*/
		var __v0 = use("Runtime.rs");
		if (__v0.substr(name, 0, 3) == "__v")
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isReserved", arguments, __memorize_value);
			return __memorize_value;
		}
		var __memorize_value = false;
		use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isReserved", arguments, __memorize_value);
		return __memorize_value;
	},
	/**
	 * Returns kind of identifier or thrown Error
	 */
	findIdentifier: function(parser, name, caret)
	{
		var kind = "";
		if (parser.vars.has(name))
		{
			var __v0 = use("BayLang.OpCodes.OpIdentifier");
			kind = __v0.KIND_VARIABLE;
		}
		else if (parser.uses.has(name))
		{
			var __v1 = use("BayLang.OpCodes.OpIdentifier");
			kind = __v1.KIND_CLASS;
		}
		else if (this.isSystemType(name))
		{
			var __v2 = use("BayLang.OpCodes.OpIdentifier");
			kind = __v2.KIND_SYS_TYPE;
		}
		else if (name == "log" || name == "print")
		{
			var __v3 = use("BayLang.OpCodes.OpIdentifier");
			kind = __v3.KIND_SYS_FUNCTION;
		}
		else if (name == "window" || name == "document")
		{
			var __v4 = use("BayLang.OpCodes.OpIdentifier");
			kind = __v4.KIND_VARIABLE;
		}
		else if (name == "null" || name == "true" || name == "false")
		{
			var __v5 = use("BayLang.OpCodes.OpIdentifier");
			kind = __v5.KIND_CONSTANT;
		}
		else if (name == "fn")
		{
			var __v6 = use("BayLang.OpCodes.OpIdentifier");
			kind = __v6.KIND_FUNCTION;
		}
		else if (name == "@" || name == "_")
		{
			var __v7 = use("BayLang.OpCodes.OpIdentifier");
			kind = __v7.KIND_CONTEXT;
		}
		else if (name == "static" || name == "self" || name == "this" || name == "parent")
		{
			var __v8 = use("BayLang.OpCodes.OpIdentifier");
			kind = __v8.KIND_CLASSREF;
		}
		return kind;
	},
	/**
	 * Return true if char is token char
	 * @param {char} ch
	 * @return {boolean}
	 */
	isTokenChar: function(ch)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("BayLang.LangBay.ParserBayBase.isTokenChar", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		var __v0 = use("Runtime.rs");
		var __v1 = use("Runtime.rs");
		var __memorize_value = __v0.indexOf("qazwsxedcrfvtgbyhnujmikolp0123456789_", __v1.lower(ch)) !== -1;
		use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isTokenChar", arguments, __memorize_value);
		return __memorize_value;
	},
	/**
	 * Return true if char is system or space. ASCII code <= 32.
	 * @param char ch
	 * @return boolean
	 */
	isSkipChar: function(ch)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("BayLang.LangBay.ParserBayBase.isSkipChar", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		var __v0 = use("Runtime.rs");
		if (__v0.ord(ch) <= 32)
		{
			var __memorize_value = true;
			use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSkipChar", arguments, __memorize_value);
			return __memorize_value;
		}
		var __memorize_value = false;
		use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayBase.isSkipChar", arguments, __memorize_value);
		return __memorize_value;
	},
	/**
	 * Returns next X
	 */
	nextX: function(parser, ch, x, direction)
	{
		if (direction == undefined) direction = 1;
		if (ch == "\t")
		{
			return x + parser.tab_size * direction;
		}
		if (ch == "\n")
		{
			return 0;
		}
		return x + direction;
	},
	/**
	 * Returns next Y
	 */
	nextY: function(parser, ch, y, direction)
	{
		if (direction == undefined) direction = 1;
		if (ch == "\n")
		{
			return y + direction;
		}
		return y;
	},
	/**
	 * Returns next
	 */
	next: function(parser, s, x, y, pos)
	{
		var __v0 = use("Runtime.rs");
		var sz = __v0.strlen(s);
		for (var i = 0; i < sz; i++)
		{
			var __v1 = use("Runtime.rs");
			var ch = __v1.substr(s, i, 1);
			x = this.nextX(parser, ch, x);
			y = this.nextY(parser, ch, y);
			pos = pos + 1;
		}
		return use("Runtime.Vector").from([x,y,pos]);
	},
	/**
	 * Open comment
	 */
	isCommentOpen: function(parser, str)
	{
		return parser.skip_comments && ((parser.is_html) ? (str == "<!--") : (str == "/*"));
	},
	/**
	 * Close comment
	 */
	isCommentClose: function(parser, str)
	{
		return (parser.is_html) ? (str == "-->") : (str == "*/");
	},
	/**
	 * Skip char
	 */
	skipChar: function(parser, content, start_pos)
	{
		var x = start_pos.x;
		var y = start_pos.y;
		var pos = start_pos.pos;
		var skip_comments = parser.skip_comments;
		/* Check boundaries */
		if (pos >= parser.content_sz)
		{
			var __v0 = use("BayLang.Exceptions.ParserEOF");
			throw new __v0()
		}
		var __v1 = use("Runtime.rs");
		var ch = __v1.charAt(content.ref, pos);
		var __v2 = use("Runtime.rs");
		var ch2 = __v2.substr(content.ref, pos, 2);
		var __v3 = use("Runtime.rs");
		var ch4 = __v3.substr(content.ref, pos, 4);
		while ((this.isSkipChar(ch) || this.isCommentOpen(parser, ch2) || this.isCommentOpen(parser, ch4)) && pos < parser.content_sz)
		{
			if (this.isCommentOpen(parser, ch2))
			{
				var __v4 = use("Runtime.rs");
				ch2 = __v4.substr(content.ref, pos, 2);
				while (!this.isCommentClose(parser, ch2) && pos < parser.content_sz)
				{
					x = this.nextX(parser, ch, x);
					y = this.nextY(parser, ch, y);
					pos = pos + 1;
					if (pos >= parser.content_sz)
					{
						break;
					}
					var __v5 = use("Runtime.rs");
					ch = __v5.charAt(content.ref, pos);
					var __v6 = use("Runtime.rs");
					ch2 = __v6.substr(content.ref, pos, 2);
				}
				if (this.isCommentClose(parser, ch2))
				{
					x = x + 2;
					pos = pos + 2;
				}
			}
			else if (this.isCommentOpen(parser, ch4))
			{
				var __v7 = use("Runtime.rs");
				var ch3 = __v7.substr(content.ref, pos, 3);
				while (!this.isCommentClose(parser, ch3) && pos < parser.content_sz)
				{
					x = this.nextX(parser, ch, x);
					y = this.nextY(parser, ch, y);
					pos = pos + 1;
					if (pos >= parser.content_sz)
					{
						break;
					}
					var __v8 = use("Runtime.rs");
					ch = __v8.charAt(content.ref, pos);
					var __v9 = use("Runtime.rs");
					ch3 = __v9.substr(content.ref, pos, 3);
				}
				if (this.isCommentClose(parser, ch3))
				{
					x = x + 3;
					pos = pos + 3;
				}
			}
			else
			{
				x = this.nextX(parser, ch, x);
				y = this.nextY(parser, ch, y);
				pos = pos + 1;
			}
			if (pos >= parser.content_sz)
			{
				break;
			}
			var __v10 = use("Runtime.rs");
			ch = __v10.charAt(content.ref, pos);
			var __v11 = use("Runtime.rs");
			ch2 = __v11.substr(content.ref, pos, 2);
			var __v12 = use("Runtime.rs");
			ch4 = __v12.substr(content.ref, pos, 4);
		}
		var __v13 = use("BayLang.Caret");
		return new __v13(use("Runtime.Map").from({"pos":pos,"x":x,"y":y}));
	},
	/**
	 * Read special token
	 */
	readSpecialToken: function(parser, content, start_pos)
	{
		var pos = start_pos.pos;
		var s = "";
		var __v0 = use("Runtime.rs");
		s = __v0.substr(content.ref, pos, 10);
		if (s == "#endswitch")
		{
			return s;
		}
		var __v1 = use("Runtime.rs");
		s = __v1.substr(content.ref, pos, 7);
		if (s == "#ifcode" || s == "#switch" || s == "#elseif" || s == "%render")
		{
			return s;
		}
		var __v2 = use("Runtime.rs");
		s = __v2.substr(content.ref, pos, 6);
		if (s == "#endif" || s == "#ifdef" || s == "%while")
		{
			return s;
		}
		var __v3 = use("Runtime.rs");
		s = __v3.substr(content.ref, pos, 5);
		if (s == "#case" || s == "%else")
		{
			return s;
		}
		var __v4 = use("Runtime.rs");
		s = __v4.substr(content.ref, pos, 4);
		if (s == "@css" || s == "%for" || s == "%var" || s == "%set")
		{
			return s;
		}
		var __v5 = use("Runtime.rs");
		s = __v5.substr(content.ref, pos, 3);
		if (s == "!--" || s == "!==" || s == "===" || s == "..." || s == "#if" || s == "%if")
		{
			return s;
		}
		var __v6 = use("Runtime.rs");
		s = __v6.substr(content.ref, pos, 2);
		if (s == "==" || s == "!=" || s == "<=" || s == ">=" || s == "=>" || s == "->" || s == "|>" || s == "::" || s == "+=" || s == "-=" || s == "~=" || s == "**" || s == "<<" || s == ">>" || s == "++" || s == "--")
		{
			return s;
		}
		return "";
	},
	/**
	 * Read next token and return caret end
	 */
	nextToken: function(parser, content, start_pos)
	{
		var is_first = true;
		var x = start_pos.x;
		var y = start_pos.y;
		var pos = start_pos.pos;
		/* Check boundaries */
		if (pos >= parser.content_sz)
		{
			var __v0 = use("BayLang.Exceptions.ParserEOF");
			throw new __v0()
		}
		var s = this.readSpecialToken(parser, content, start_pos);
		if (s != "")
		{
			var __v1 = use("Runtime.rs");
			var sz = __v1.strlen(s);
			for (var i = 0; i < sz; i++)
			{
				var __v2 = use("Runtime.rs");
				var ch = __v2.charAt(s, i);
				x = this.nextX(parser, ch, x);
				y = this.nextY(parser, ch, y);
				pos = pos + 1;
			}
			var __v3 = use("BayLang.Caret");
			return new __v3(use("Runtime.Map").from({"pos":pos,"x":x,"y":y}));
		}
		var __v4 = use("Runtime.rs");
		var ch = __v4.charAt(content.ref, pos);
		if (!this.isTokenChar(ch))
		{
			x = this.nextX(parser, ch, x);
			y = this.nextY(parser, ch, y);
			pos = pos + 1;
		}
		else
		{
			while (this.isTokenChar(ch))
			{
				x = this.nextX(parser, ch, x);
				y = this.nextY(parser, ch, y);
				pos = pos + 1;
				if (pos >= parser.content_sz)
				{
					break;
				}
				var __v5 = use("Runtime.rs");
				ch = __v5.charAt(content.ref, pos);
			}
		}
		var __v6 = use("BayLang.Caret");
		return new __v6(use("Runtime.Map").from({"pos":pos,"x":x,"y":y}));
	},
	/**
	 * Read back
	 */
	readBack: function(parser, search)
	{
		if (search == undefined) search = "";
		var content = parser.content;
		var caret = parser.caret;
		var x = caret.x;
		var y = caret.y;
		var pos = caret.pos;
		var __v0 = use("Runtime.rs");
		var search_sz = __v0.strlen(search);
		var s = "";
		while (pos >= 0)
		{
			var __v1 = use("Runtime.rs");
			var ch = __v1.charAt(content.ref, pos);
			x = this.nextX(parser, ch, x, -1);
			y = this.nextY(parser, ch, y, -1);
			pos--;
			var __v2 = use("Runtime.rs");
			s = __v2.substr(content.ref, pos, search_sz);
			if (s == search)
			{
				break;
			}
		}
		var __v3 = use("BayLang.Caret");
		return parser.copy(use("Runtime.Map").from({"caret":new __v3(use("Runtime.Map").from({"pos":pos,"x":x,"y":y}))}));
	},
	/**
	 * Read next token
	 */
	readToken: function(parser)
	{
		var caret_start = null;
		var caret_end = null;
		var eof = false;
		var __v0 = use("BayLang.Exceptions.ParserEOF");
		try
		{
			caret_start = this.skipChar(parser, parser.content, parser.caret);
			caret_end = this.nextToken(parser, parser.content, caret_start);
		}
		catch (_ex)
		{
			if (_ex instanceof __v0)
			{
				var e = _ex;
				
				if (caret_start == null)
				{
					caret_start = parser.caret;
				}
				if (caret_end == null)
				{
					caret_end = caret_start;
				}
				eof = true;
			}
			else if (true)
			{
				var e = _ex;
				
				throw e
			}
			else
			{
				throw _ex;
			}
		}
		var __v1 = use("BayLang.CoreToken");
		var __v2 = use("Runtime.rs");
		return use("Runtime.Vector").from([parser.copy(use("Runtime.Map").from({"caret":caret_end})),new __v1(use("Runtime.Map").from({"content":__v2.substr(parser.content.ref, caret_start.pos, caret_end.pos - caret_start.pos),"caret_start":caret_start,"caret_end":caret_end,"eof":eof}))]);
	},
	/**
	 * Look next token
	 */
	lookToken: function(parser, token)
	{
		var token_content = "";
		var content = parser.content;
		var caret_start = null;
		var caret_end = null;
		var __v0 = use("Runtime.rs");
		var sz = __v0.strlen(token);
		var eof = false;
		var find = false;
		var __v3 = use("BayLang.Exceptions.ParserEOF");
		try
		{
			caret_start = this.skipChar(parser, content, parser.caret);
			var pos = caret_start.pos;
			var x = caret_start.x;
			var y = caret_start.y;
			var __v1 = use("Runtime.rs");
			token_content = __v1.substr(content.ref, pos, sz);
			if (token_content == token)
			{
				find = true;
			}
			var res = this.next(parser, token_content, x, y, pos);
			x = Runtime.rtl.attr(res, 0);
			y = Runtime.rtl.attr(res, 1);
			pos = Runtime.rtl.attr(res, 2);
			var __v2 = use("BayLang.Caret");
			caret_end = new __v2(use("Runtime.Map").from({"pos":pos,"x":x,"y":y}));
		}
		catch (_ex)
		{
			if (_ex instanceof __v3)
			{
				var e = _ex;
				
				if (caret_start == null)
				{
					caret_start = parser.caret;
				}
				if (caret_end == null)
				{
					caret_end = caret_start;
				}
				eof = true;
			}
			else if (true)
			{
				var e = _ex;
				
				throw e
			}
			else
			{
				throw _ex;
			}
		}
		var __v4 = use("BayLang.CoreToken");
		return use("Runtime.Vector").from([parser.copy(use("Runtime.Map").from({"caret":caret_end})),new __v4(use("Runtime.Map").from({"content":token_content,"caret_start":caret_start,"caret_end":caret_end,"eof":eof})),find]);
	},
	/**
	 * Match next token
	 */
	matchToken: function(parser, next_token)
	{
		var token = null;
		/* Look token */
		var res = this.lookToken(parser, next_token);
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var find = Runtime.rtl.attr(res, 2);
		if (!find)
		{
			var __v0 = use("BayLang.Exceptions.ParserExpected");
			throw new __v0(next_token, token.caret_start, parser.file_name)
		}
		return use("Runtime.Vector").from([parser,token]);
	},
	/**
	 * Match next string
	 */
	matchString: function(parser, str1)
	{
		var caret = parser.caret;
		var __v0 = use("Runtime.rs");
		var sz = __v0.strlen(str1);
		var __v1 = use("Runtime.rs");
		var str2 = __v1.substr(parser.content.ref, caret.pos, sz);
		if (str1 != str2)
		{
			var __v2 = use("BayLang.Exceptions.ParserExpected");
			throw new __v2(str1, caret, parser.file_name)
		}
		var res = this.next(parser, str1, caret.x, caret.y, caret.pos);
		var __v3 = use("BayLang.Caret");
		caret = new __v3(use("Runtime.Map").from({"x":Runtime.rtl.attr(res, 0),"y":Runtime.rtl.attr(res, 1),"pos":Runtime.rtl.attr(res, 2)}));
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
		return use("Runtime.Vector").from([parser,null]);
	},
	/**
	 * Read number
	 */
	readNumber: function(parser, flag_negative)
	{
		if (flag_negative == undefined) flag_negative = false;
		var token = null;
		var start = parser;
		/* Read token */
		var res = this.readToken(parser);
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		if (token.content == "")
		{
			var __v0 = use("BayLang.Exceptions.ParserExpected");
			throw new __v0("Number", caret_start, parser.file_name)
		}
		if (!this.isStringOfNumbers(token.content))
		{
			var __v1 = use("BayLang.Exceptions.ParserExpected");
			throw new __v1("Number", caret_start, parser.file_name)
		}
		var value = token.content;
		/* Look dot */
		var res = this.readToken(parser);
		var look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == ".")
		{
			value += use("Runtime.rtl").toStr(".");
			var res = this.readToken(look);
			parser = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			value += use("Runtime.rtl").toStr(token.content);
		}
		var __v2 = use("BayLang.OpCodes.OpNumber");
		return use("Runtime.Vector").from([parser,new __v2(use("Runtime.Map").from({"value":value,"caret_start":caret_start,"caret_end":parser.caret,"negative":flag_negative}))]);
	},
	/**
	 * Read string
	 */
	readUntilStringArr: function(parser, arr, flag_include)
	{
		if (flag_include == undefined) flag_include = true;
		var token = null;
		var look = null;
		var content = parser.content;
		var content_sz = parser.content_sz;
		var pos = parser.caret.pos;
		var x = parser.caret.x;
		var y = parser.caret.y;
		/* Search next string in arr */
		var search = (pos) =>
		{
			for (var i = 0; i < arr.count(); i++)
			{
				var item = arr.item(i);
				var __v0 = use("Runtime.rs");
				var sz = __v0.strlen(item);
				var __v1 = use("Runtime.rs");
				var str = __v1.substr(content.ref, pos, sz);
				if (str == item)
				{
					return i;
				}
			}
			return -1;
		};
		/* Start and end positionss */
		var start_pos = pos;
		var end_pos = pos;
		/* Read string value */
		var ch = "";
		var arr_pos = search(pos);
		while (pos < content_sz && arr_pos == -1)
		{
			var __v0 = use("Runtime.rs");
			ch = __v0.charAt(content.ref, pos);
			x = this.nextX(parser, ch, x);
			y = this.nextY(parser, ch, y);
			pos = pos + 1;
			if (pos >= content_sz)
			{
				var __v1 = use("BayLang.Exceptions.ParserExpected");
				var __v2 = use("Runtime.rs");
				var __v3 = use("BayLang.Caret");
				throw new __v1(__v2.join(",", arr), new __v3(use("Runtime.Map").from({"x":x,"y":y,"pos":pos})), parser.file_name)
			}
			arr_pos = search(pos);
		}
		if (arr_pos == -1)
		{
			var __v4 = use("BayLang.Exceptions.ParserExpected");
			var __v5 = use("BayLang.Caret");
			throw new __v4("End of string", new __v5(use("Runtime.Map").from({"x":x,"y":y,"pos":pos})), parser.file_name)
		}
		if (!flag_include)
		{
			end_pos = pos;
		}
		else
		{
			var item = arr.item(arr_pos);
			var __v6 = use("Runtime.rs");
			var sz = __v6.strlen(item);
			for (var i = 0; i < sz; i++)
			{
				var __v7 = use("Runtime.rs");
				ch = __v7.charAt(content.ref, pos);
				x = this.nextX(parser, ch, x);
				y = this.nextY(parser, ch, y);
				pos = pos + 1;
			}
			end_pos = pos;
		}
		/* Return result */
		var __v8 = use("BayLang.Caret");
		var caret_end = new __v8(use("Runtime.Map").from({"x":x,"y":y,"pos":end_pos}));
		var __v9 = use("Runtime.rs");
		return use("Runtime.Vector").from([parser.copy(use("Runtime.Map").from({"caret":caret_end})),__v9.substr(content.ref, start_pos, end_pos - start_pos)]);
	},
	/**
	 * Read string
	 */
	readString: function(parser)
	{
		var token = null;
		var look = null;
		/* Read token */
		var res = this.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		var str_char = token.content;
		/* Read begin string char */
		if (str_char != "'" && str_char != "\"")
		{
			var __v0 = use("BayLang.Exceptions.ParserExpected");
			throw new __v0("String", caret_start, parser.file_name)
		}
		var content = look.content;
		var content_sz = look.content_sz;
		var pos = look.caret.pos;
		var x = look.caret.x;
		var y = look.caret.y;
		/* Read string value */
		var value_str = "";
		var __v1 = use("Runtime.rs");
		var ch = __v1.charAt(content.ref, pos);
		while (pos < content_sz && ch != str_char)
		{
			if (ch == "\\")
			{
				x = this.nextX(parser, ch, x);
				y = this.nextY(parser, ch, y);
				pos = pos + 1;
				if (pos >= content_sz)
				{
					var __v2 = use("BayLang.Exceptions.ParserExpected");
					var __v3 = use("BayLang.Caret");
					throw new __v2("End of string", new __v3(use("Runtime.Map").from({"x":x,"y":y,"pos":pos})), parser.file_name)
				}
				var __v4 = use("Runtime.rs");
				var ch2 = __v4.charAt(content.ref, pos);
				if (ch2 == "n")
				{
					value_str += use("Runtime.rtl").toStr("\n");
				}
				else if (ch2 == "r")
				{
					value_str += use("Runtime.rtl").toStr("\r");
				}
				else if (ch2 == "t")
				{
					value_str += use("Runtime.rtl").toStr("\t");
				}
				else if (ch2 == "s")
				{
					value_str += use("Runtime.rtl").toStr(" ");
				}
				else if (ch2 == "\\")
				{
					value_str += use("Runtime.rtl").toStr("\\");
				}
				else if (ch2 == "'")
				{
					value_str += use("Runtime.rtl").toStr("'");
				}
				else if (ch2 == "\"")
				{
					value_str += use("Runtime.rtl").toStr("\"");
				}
				else
				{
					value_str += use("Runtime.rtl").toStr(ch + use("Runtime.rtl").toStr(ch2));
				}
				x = this.nextX(parser, ch2, x);
				y = this.nextY(parser, ch2, y);
				pos = pos + 1;
			}
			else
			{
				value_str += use("Runtime.rtl").toStr(ch);
				x = this.nextX(parser, ch, x);
				y = this.nextY(parser, ch, y);
				pos = pos + 1;
			}
			if (pos >= content_sz)
			{
				var __v5 = use("BayLang.Exceptions.ParserExpected");
				var __v6 = use("BayLang.Caret");
				throw new __v5("End of string", new __v6(use("Runtime.Map").from({"x":x,"y":y,"pos":pos})), parser.file_name)
			}
			var __v7 = use("Runtime.rs");
			ch = __v7.charAt(content.ref, pos);
		}
		/* Read end string char */
		if (ch != "'" && ch != "\"")
		{
			var __v8 = use("BayLang.Exceptions.ParserExpected");
			var __v9 = use("BayLang.Caret");
			throw new __v8("End of string", new __v9(use("Runtime.Map").from({"x":x,"y":y,"pos":pos})), parser.file_name)
		}
		x = this.nextX(parser, ch, x);
		y = this.nextY(parser, ch, y);
		pos = pos + 1;
		/* Return result */
		var __v10 = use("BayLang.Caret");
		var caret_end = new __v10(use("Runtime.Map").from({"x":x,"y":y,"pos":pos}));
		var __v11 = use("BayLang.OpCodes.OpString");
		return use("Runtime.Vector").from([parser.copy(use("Runtime.Map").from({"caret":caret_end})),new __v11(use("Runtime.Map").from({"value":value_str,"caret_start":caret_start,"caret_end":caret_end}))]);
	},
	/**
	 * Read comment
	 */
	readComment: function(parser)
	{
		var start = parser;
		var token = null;
		var look = null;
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), false);
		var __v0 = use("BayLang.LangBay.ParserBayBase");
		var res = __v0.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), true);
		if (token.content == "/")
		{
			parser = look;
			var content = look.content;
			var content_sz = look.content_sz;
			var pos = look.caret.pos;
			var x = look.caret.x;
			var y = look.caret.y;
			var pos_start = pos;
			var __v1 = use("Runtime.rs");
			var ch = __v1.charAt(content.ref, pos);
			var __v2 = use("Runtime.rs");
			var ch2 = __v2.substr(content.ref, pos, 2);
			while (!this.isCommentClose(parser, ch2) && pos < content_sz)
			{
				x = this.nextX(parser, ch, x);
				y = this.nextY(parser, ch, y);
				pos = pos + 1;
				if (pos >= parser.content_sz)
				{
					break;
				}
				var __v3 = use("Runtime.rs");
				ch = __v3.charAt(content.ref, pos);
				var __v4 = use("Runtime.rs");
				ch2 = __v4.substr(content.ref, pos, 2);
			}
			var pos_end = pos;
			if (this.isCommentClose(parser, ch2))
			{
				x = x + 2;
				pos = pos + 2;
			}
			else
			{
				var __v5 = use("BayLang.Exceptions.ParserExpected");
				var __v6 = use("BayLang.Caret");
				throw new __v5("End of comment", new __v6(use("Runtime.Map").from({"x":x,"y":y,"pos":pos})), start.file_name)
			}
			/* Return result */
			var __v7 = use("Runtime.rs");
			var value_str = __v7.substr(content.ref, pos_start + 1, pos_end - pos_start - 1);
			var __v8 = use("BayLang.Caret");
			var caret_end = new __v8(use("Runtime.Map").from({"x":x,"y":y,"pos":pos}));
			var __v9 = use("BayLang.OpCodes.OpComment");
			return use("Runtime.Vector").from([start.copy(use("Runtime.Map").from({"caret":caret_end})),new __v9(use("Runtime.Map").from({"value":value_str,"caret_start":caret_start,"caret_end":caret_end}))]);
		}
		return use("Runtime.Vector").from([parser,null]);
	},
	/**
	 * Read identifier
	 */
	readIdentifier: function(parser, find_ident)
	{
		if (find_ident == undefined) find_ident = false;
		var start = parser;
		var token = null;
		var look = null;
		var name = "";
		var __v0 = use("BayLang.LangBay.ParserBayBase");
		var res = __v0.readToken(parser);
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "")
		{
			var __v1 = use("BayLang.Exceptions.ParserExpected");
			throw new __v1("Identifier", token.caret_start, parser.file_name)
		}
		if (!this.isIdentifier(token.content))
		{
			var __v2 = use("BayLang.Exceptions.ParserExpected");
			throw new __v2("Identifier", token.caret_start, parser.file_name)
		}
		if (this.isReserved(token.content))
		{
			var __v3 = use("BayLang.Exceptions.ParserExpected");
			throw new __v3("Identifier " + use("Runtime.rtl").toStr(token.content) + use("Runtime.rtl").toStr(" is reserverd"), token.caret_start, parser.file_name)
		}
		name = token.content;
		var kind = this.findIdentifier(parser, name, token.caret_start);
		if (parser.find_ident && find_ident && kind == "")
		{
			var __v4 = use("BayLang.Exceptions.ParserError");
			throw new __v4("Unknown identifier '" + use("Runtime.rtl").toStr(name) + use("Runtime.rtl").toStr("'"), token.caret_start, parser.file_name)
		}
		var __v5 = use("BayLang.OpCodes.OpIdentifier");
		return use("Runtime.Vector").from([parser,new __v5(use("Runtime.Map").from({"kind":kind,"value":name,"caret_start":token.caret_start,"caret_end":token.caret_end}))]);
	},
	/**
	 * Read entity name
	 */
	readEntityName: function(parser, find_ident)
	{
		if (find_ident == undefined) find_ident = true;
		var look = null;
		var token = null;
		var ident = null;
		var __v0 = use("Runtime.Vector");
		var names = new __v0();
		var res = parser.parser_base.constructor.readIdentifier(parser, find_ident);
		parser = Runtime.rtl.attr(res, 0);
		ident = Runtime.rtl.attr(res, 1);
		var caret_start = ident.caret_start;
		var name = ident.value;
		names.push(name);
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		while (!token.eof && token.content == ".")
		{
			var res = parser.parser_base.constructor.matchToken(parser, ".");
			parser = Runtime.rtl.attr(res, 0);
			var res = parser.parser_base.constructor.readIdentifier(parser);
			parser = Runtime.rtl.attr(res, 0);
			ident = Runtime.rtl.attr(res, 1);
			name = ident.value;
			names.push(name);
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
		}
		var __v1 = use("BayLang.OpCodes.OpEntityName");
		return use("Runtime.Vector").from([parser,new __v1(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"names":names}))]);
	},
	/**
	 * Read type identifier
	 */
	readTypeIdentifier: function(parser, find_ident)
	{
		if (find_ident == undefined) find_ident = true;
		var start = parser;
		var look = null;
		var token = null;
		var op_code = null;
		var entity_name = null;
		var template = null;
		var res = this.readEntityName(parser, find_ident);
		parser = Runtime.rtl.attr(res, 0);
		entity_name = Runtime.rtl.attr(res, 1);
		var caret_start = entity_name.caret_start;
		var flag_open_caret = false;
		var flag_end_caret = false;
		var res = this.lookToken(parser, "<");
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		flag_open_caret = Runtime.rtl.attr(res, 2);
		if (flag_open_caret)
		{
			var __v0 = use("Runtime.Vector");
			template = new __v0();
			var res = this.matchToken(parser, "<");
			parser = Runtime.rtl.attr(res, 0);
			var res = this.lookToken(parser, ">");
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			flag_end_caret = Runtime.rtl.attr(res, 2);
			while (!token.eof && !flag_end_caret)
			{
				var parser_value = null;
				var res = this.readTypeIdentifier(parser);
				parser = Runtime.rtl.attr(res, 0);
				parser_value = Runtime.rtl.attr(res, 1);
				template.push(parser_value);
				var res = this.lookToken(parser, ">");
				look = Runtime.rtl.attr(res, 0);
				token = Runtime.rtl.attr(res, 1);
				flag_end_caret = Runtime.rtl.attr(res, 2);
				if (!flag_end_caret)
				{
					var res = this.matchToken(parser, ",");
					parser = Runtime.rtl.attr(res, 0);
					var res = this.lookToken(parser, ">");
					look = Runtime.rtl.attr(res, 0);
					token = Runtime.rtl.attr(res, 1);
					flag_end_caret = Runtime.rtl.attr(res, 2);
				}
			}
			var res = this.matchToken(parser, ">");
			parser = Runtime.rtl.attr(res, 0);
		}
		var __v1 = use("BayLang.OpCodes.OpTypeIdentifier");
		return use("Runtime.Vector").from([parser,new __v1(use("Runtime.Map").from({"entity_name":entity_name,"template":template,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/**
	 * Read collection
	 */
	readCollection: function(parser)
	{
		var start = parser;
		var look = null;
		var token = null;
		var __v0 = use("Runtime.Vector");
		var values = new __v0();
		var ifdef_condition = null;
		var flag_ifdef = false;
		var res = this.matchToken(parser, "[");
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		var res = this.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		while (!token.eof && token.content != "]")
		{
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			if (token.content == "#ifdef")
			{
				parser = look;
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["find_ident"]), false);
				var res = parser.parser_expression.constructor.readExpression(parser);
				parser = Runtime.rtl.attr(res, 0);
				ifdef_condition = Runtime.rtl.attr(res, 1);
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["find_ident"]), true);
				var res = parser.parser_base.constructor.matchToken(parser, "then");
				parser = Runtime.rtl.attr(res, 0);
				token = Runtime.rtl.attr(res, 1);
				flag_ifdef = true;
			}
			var parser_value = null;
			var res = parser.parser_expression.constructor.readExpression(parser);
			parser = Runtime.rtl.attr(res, 0);
			parser_value = Runtime.rtl.attr(res, 1);
			var res = this.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			if (token.content == ",")
			{
				parser = look;
				var res = this.readToken(parser);
				look = Runtime.rtl.attr(res, 0);
				token = Runtime.rtl.attr(res, 1);
			}
			if (flag_ifdef)
			{
				var __v1 = use("BayLang.OpCodes.OpPreprocessorIfDef");
				parser_value = new __v1(use("Runtime.Map").from({"items":parser_value,"condition":ifdef_condition}));
			}
			values.push(parser_value);
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			if (token.content == "#endif")
			{
				parser = look;
				flag_ifdef = false;
				ifdef_condition = null;
			}
			var res = this.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
		}
		var res = this.matchToken(parser, "]");
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var __v2 = use("BayLang.OpCodes.OpCollection");
		return use("Runtime.Vector").from([parser,new __v2(use("Runtime.Map").from({"values":values,"caret_start":caret_start,"caret_end":token.caret_end}))]);
	},
	/**
	 * Read collection
	 */
	readDict: function(parser)
	{
		var look = null;
		var token = null;
		var __v0 = use("Runtime.Vector");
		var values = new __v0();
		var ifdef_condition = null;
		var flag_ifdef = false;
		var res = this.matchToken(parser, "{");
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		var res = this.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		while (!token.eof && token.content != "}")
		{
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			if (token.content == "#ifdef")
			{
				parser = look;
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["find_ident"]), false);
				var res = parser.parser_expression.constructor.readExpression(parser);
				parser = Runtime.rtl.attr(res, 0);
				ifdef_condition = Runtime.rtl.attr(res, 1);
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["find_ident"]), true);
				var res = parser.parser_base.constructor.matchToken(parser, "then");
				parser = Runtime.rtl.attr(res, 0);
				token = Runtime.rtl.attr(res, 1);
				flag_ifdef = true;
			}
			var parser_value = null;
			var res = this.readString(parser);
			parser = Runtime.rtl.attr(res, 0);
			parser_value = Runtime.rtl.attr(res, 1);
			var key = parser_value.value;
			var res = this.matchToken(parser, ":");
			parser = Runtime.rtl.attr(res, 0);
			var res = parser.parser_expression.constructor.readExpression(parser);
			parser = Runtime.rtl.attr(res, 0);
			parser_value = Runtime.rtl.attr(res, 1);
			var res = this.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			if (token.content == ",")
			{
				parser = look;
			}
			var __v1 = use("BayLang.OpCodes.OpDictPair");
			values.push(new __v1(use("Runtime.Map").from({"key":key,"value":parser_value,"condition":ifdef_condition})));
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			if (token.content == "#endif")
			{
				parser = look;
				flag_ifdef = false;
				ifdef_condition = null;
			}
			var res = this.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
		}
		var res = this.matchToken(parser, "}");
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var __v2 = use("BayLang.OpCodes.OpDict");
		return use("Runtime.Vector").from([parser,new __v2(use("Runtime.Map").from({"values":values,"caret_start":caret_start,"caret_end":token.caret_end}))]);
	},
	/**
	 * Read fixed
	 */
	readFixed: function(parser)
	{
		var look = null;
		var token = null;
		var start = parser;
		var caret_start = parser.caret;
		var flag_negative = false;
		var res = this.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "")
		{
			var __v0 = use("BayLang.Exceptions.ParserExpected");
			throw new __v0("Identifier", token.caret_start, look.file_name)
		}
		/* Read string */
		if (token.content == "'" || token.content == "\"")
		{
			return this.readString(parser);
		}
		/* Read Collection */
		if (token.content == "[")
		{
			return this.readCollection(parser);
		}
		/* Read Dict */
		if (token.content == "{")
		{
			return this.readDict(parser);
		}
		/* Negative number */
		if (token.content == "-")
		{
			flag_negative = true;
			parser = look;
			var res = this.readToken(look);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
		}
		/* Read Number */
		if (this.isStringOfNumbers(token.content))
		{
			return this.readNumber(parser, flag_negative);
		}
		return this.readIdentifier(parser, true);
	},
	/**
	 * Read call args
	 */
	readCallArgs: function(parser)
	{
		var look = null;
		var token = null;
		var __v0 = use("Runtime.Vector");
		var items = new __v0();
		var res = this.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "{")
		{
			var res = this.readDict(parser);
			parser = Runtime.rtl.attr(res, 0);
			var d = Runtime.rtl.attr(res, 1);
			items = use("Runtime.Vector").from([d]);
		}
		else if (token.content == "(")
		{
			var res = this.matchToken(parser, "(");
			parser = Runtime.rtl.attr(res, 0);
			var res = this.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			while (!token.eof && token.content != ")")
			{
				var parser_value = null;
				var res = parser.parser_expression.constructor.readExpression(parser);
				parser = Runtime.rtl.attr(res, 0);
				parser_value = Runtime.rtl.attr(res, 1);
				items.push(parser_value);
				var res = this.readToken(parser);
				look = Runtime.rtl.attr(res, 0);
				token = Runtime.rtl.attr(res, 1);
				if (token.content == ",")
				{
					parser = look;
					var res = this.readToken(parser);
					look = Runtime.rtl.attr(res, 0);
					token = Runtime.rtl.attr(res, 1);
				}
			}
			var res = this.matchToken(parser, ")");
			parser = Runtime.rtl.attr(res, 0);
		}
		return use("Runtime.Vector").from([parser,items]);
	},
	/**
	 * Read new instance
	 */
	readNew: function(parser, match_new)
	{
		if (match_new == undefined) match_new = true;
		var look = null;
		var token = null;
		var op_code = null;
		var caret_start = parser.caret;
		var args = use("Runtime.Vector").from([]);
		if (match_new)
		{
			var res = this.matchToken(parser, "new");
			parser = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			caret_start = token.caret_start;
		}
		var res = this.readTypeIdentifier(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		var res = this.readToken(parser);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "(" || token.content == "{")
		{
			var res = this.readCallArgs(parser);
			parser = Runtime.rtl.attr(res, 0);
			args = Runtime.rtl.attr(res, 1);
		}
		var __v0 = use("BayLang.OpCodes.OpNew");
		return use("Runtime.Vector").from([parser,new __v0(use("Runtime.Map").from({"args":args,"value":op_code,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/**
	 * Read method
	 */
	readMethod: function(parser, match)
	{
		if (match == undefined) match = true;
		var look = null;
		var token = null;
		var parser_value = null;
		var op_code = null;
		var value1 = "";
		var value2 = "";
		var kind = "";
		var caret_start = parser.caret;
		if (match)
		{
			var res = this.matchToken(parser, "method");
			parser = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
		}
		var save = parser;
		/* Read static method */
		var __v3 = use("BayLang.Exceptions.ParserError");
		try
		{
			var res = this.readIdentifier(parser);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
			var res = this.matchToken(parser, "::");
			parser = Runtime.rtl.attr(res, 0);
			var res = this.readToken(parser);
			parser = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			var __v0 = use("BayLang.OpCodes.OpIdentifier");
			if (op_code.kind == __v0.KIND_VARIABLE)
			{
				var __v1 = use("BayLang.OpCodes.OpMethod");
				kind = __v1.KIND_STATIC;
			}
			else
			{
				var __v2 = use("BayLang.OpCodes.OpMethod");
				kind = __v2.KIND_CLASS;
			}
			value1 = op_code;
			value2 = token.content;
		}
		catch (_ex)
		{
			if (_ex instanceof __v3)
			{
				var e = _ex;
			}
			else
			{
				throw _ex;
			}
		}
		/* Read instance method */
		if (kind == "")
		{
			parser = save;
			var __v5 = use("BayLang.Exceptions.ParserError");
			try
			{
				var res = this.readIdentifier(parser);
				parser = Runtime.rtl.attr(res, 0);
				op_code = Runtime.rtl.attr(res, 1);
				var res = this.matchToken(parser, ".");
				parser = Runtime.rtl.attr(res, 0);
				var res = this.readToken(parser);
				parser = Runtime.rtl.attr(res, 0);
				token = Runtime.rtl.attr(res, 1);
				var __v4 = use("BayLang.OpCodes.OpMethod");
				kind = __v4.KIND_ATTR;
				value1 = op_code;
				value2 = token.content;
			}
			catch (_ex)
			{
				if (_ex instanceof __v5)
				{
					var e = _ex;
				}
				else
				{
					throw _ex;
				}
			}
		}
		/* Error */
		if (kind == "")
		{
			var __v6 = use("BayLang.Exceptions.ParserExpected");
			throw new __v6("'.' or '::'", parser.caret, parser.file_name)
		}
		var __v7 = use("BayLang.OpCodes.OpMethod");
		return use("Runtime.Vector").from([parser,new __v7(use("Runtime.Map").from({"value1":value1,"value2":value2,"kind":kind,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/**
	 * Read curry
	 */
	readCurry: function(parser)
	{
		var look = null;
		var token = null;
		var obj = null;
		var __v0 = use("Runtime.Vector");
		var args = new __v0();
		var res = this.matchToken(parser, "curry");
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var res = this.readDynamic(parser, 14);
		parser = Runtime.rtl.attr(res, 0);
		obj = Runtime.rtl.attr(res, 1);
		var res = this.matchToken(parser, "(");
		parser = Runtime.rtl.attr(res, 0);
		var res = this.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		while (!token.eof && token.content != ")")
		{
			var arg = null;
			if (token.content == "?")
			{
				var pos = 0;
				parser = look;
				var res = this.readToken(look);
				look = Runtime.rtl.attr(res, 0);
				token = Runtime.rtl.attr(res, 1);
				if (this.isStringOfNumbers(token.content))
				{
					pos = use("Runtime.rtl").to(token.content, {"e":"int"});
					parser = look;
				}
				var __v1 = use("BayLang.OpCodes.OpCurryArg");
				arg = new __v1(use("Runtime.Map").from({"pos":pos}));
				args.push(arg);
			}
			else
			{
				var res = parser.parser_expression.constructor.readExpression(parser);
				parser = Runtime.rtl.attr(res, 0);
				arg = Runtime.rtl.attr(res, 1);
				args.push(arg);
			}
			var res = this.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			if (token.content == ",")
			{
				parser = look;
				var res = this.readToken(parser);
				look = Runtime.rtl.attr(res, 0);
				token = Runtime.rtl.attr(res, 1);
			}
		}
		var res = this.matchToken(parser, ")");
		parser = Runtime.rtl.attr(res, 0);
		var __v2 = use("BayLang.OpCodes.OpCurry");
		return use("Runtime.Vector").from([parser,new __v2(use("Runtime.Map").from({"obj":obj,"args":args}))]);
	},
	/**
	 * Read base item
	 */
	readBaseItem: function(parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var res = this.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = look.caret;
		if (token.content == "new")
		{
			var res = this.readNew(parser);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
		}
		else if (token.content == "method")
		{
			var res = this.readMethod(parser);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
		}
		else if (token.content == "classof")
		{
			var res = this.readClassOf(parser);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
		}
		else if (token.content == "classref")
		{
			var res = this.readClassRef(parser);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
		}
		else if (token.content == "(")
		{
			var save_parser = parser;
			parser = look;
			/* Try to read OpTypeConvert */
			var __v1 = use("BayLang.Exceptions.ParserError");
			try
			{
				var res = this.readTypeIdentifier(parser);
				parser = Runtime.rtl.attr(res, 0);
				var op_type = Runtime.rtl.attr(res, 1);
				var res = this.readToken(parser);
				parser = Runtime.rtl.attr(res, 0);
				token = Runtime.rtl.attr(res, 1);
				if (token.content == ")")
				{
					var res = this.readDynamic(parser);
					parser = Runtime.rtl.attr(res, 0);
					op_code = Runtime.rtl.attr(res, 1);
					var __v0 = use("BayLang.OpCodes.OpTypeConvert");
					return use("Runtime.Vector").from([parser,new __v0(use("Runtime.Map").from({"pattern":op_type,"value":op_code,"caret_start":caret_start,"caret_end":parser.caret}))]);
				}
			}
			catch (_ex)
			{
				if (_ex instanceof __v1)
				{
					var e = _ex;
				}
				else
				{
					throw _ex;
				}
			}
			/* Read Expression */
			var res = this.matchToken(save_parser, "(");
			parser = Runtime.rtl.attr(res, 0);
			var res = parser.parser_expression.constructor.readExpression(parser);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
			var res = this.matchToken(parser, ")");
			parser = Runtime.rtl.attr(res, 0);
		}
		else
		{
			var res = this.readFixed(parser);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read classof
	 */
	readClassOf: function(parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var res = this.matchToken(parser, "classof");
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		var res = this.readEntityName(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		var __v0 = use("BayLang.OpCodes.OpClassOf");
		return use("Runtime.Vector").from([parser,new __v0(use("Runtime.Map").from({"entity_name":op_code,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/**
	 * Read classref
	 */
	readClassRef: function(parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var res = this.matchToken(parser, "classref");
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		var res = parser.parser_expression.constructor.readExpression(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		var __v0 = use("BayLang.OpCodes.OpClassRef");
		return use("Runtime.Vector").from([parser,new __v0(use("Runtime.Map").from({"value":op_code,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/**
	 * Read dynamic
	 */
	readDynamic: function(parser, dynamic_flags)
	{
		if (dynamic_flags == undefined) dynamic_flags = -1;
		var look = null;
		var token = null;
		var parser_items = null;
		var op_code = null;
		var op_code_first = null;
		var is_await = false;
		var is_context_call = true;
		var caret_start = null;
		/* Dynamic flags */
		var flag_call = 1;
		var flag_attr = 2;
		var flag_static = 4;
		var flag_dynamic = 8;
		var f_next = (s) =>
		{
			if ((dynamic_flags & 1) == 1)
			{
				if (s == "{" || s == "(" || s == "@")
				{
					return true;
				}
			}
			if ((dynamic_flags & 2) == 2)
			{
				if (s == ".")
				{
					return true;
				}
			}
			if ((dynamic_flags & 4) == 4)
			{
				if (s == "::")
				{
					return true;
				}
			}
			if ((dynamic_flags & 8) == 8)
			{
				if (s == "[")
				{
					return true;
				}
			}
			return false;
		};
		var res = this.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "await")
		{
			caret_start = token.caret_start;
			is_await = true;
			parser = look;
		}
		var res = this.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "@")
		{
			var res = this.readToken(look);
			var look2 = Runtime.rtl.attr(res, 0);
			var token2 = Runtime.rtl.attr(res, 1);
			if (!f_next(token2.content))
			{
				if (this.isIdentifier(token2.content))
				{
					parser = look;
					is_context_call = false;
				}
			}
		}
		var res = this.readBaseItem(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		op_code_first = op_code;
		if (caret_start == null)
		{
			caret_start = op_code.caret_start;
		}
		var __v0 = use("BayLang.OpCodes.OpIdentifier");
		var __v1 = use("BayLang.OpCodes.OpIdentifier");
		var __v2 = use("BayLang.OpCodes.OpIdentifier");
		if (op_code instanceof __v0 && (op_code.kind == __v1.KIND_CONTEXT || op_code.kind == __v2.KIND_SYS_FUNCTION))
		{
			is_context_call = false;
		}
		var res = this.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (f_next(token.content))
		{
			var __v3 = use("BayLang.OpCodes.OpIdentifier");
			var __v11 = use("BayLang.OpCodes.OpNew");
			var __v12 = use("BayLang.OpCodes.OpCollection");
			var __v13 = use("BayLang.OpCodes.OpDict");
			if (op_code instanceof __v3)
			{
				var __v4 = use("BayLang.OpCodes.OpIdentifier");
				var __v5 = use("BayLang.OpCodes.OpIdentifier");
				var __v6 = use("BayLang.OpCodes.OpIdentifier");
				var __v7 = use("BayLang.OpCodes.OpIdentifier");
				var __v8 = use("BayLang.OpCodes.OpIdentifier");
				var __v9 = use("BayLang.OpCodes.OpIdentifier");
				if (parser.find_ident && op_code.kind != __v4.KIND_SYS_TYPE && op_code.kind != __v5.KIND_SYS_FUNCTION && op_code.kind != __v6.KIND_VARIABLE && op_code.kind != __v7.KIND_CLASS && op_code.kind != __v8.KIND_CLASSREF && op_code.kind != __v9.KIND_CONTEXT)
				{
					var __v10 = use("BayLang.Exceptions.ParserExpected");
					throw new __v10("Module or variable '" + use("Runtime.rtl").toStr(op_code.value) + use("Runtime.rtl").toStr("'"), op_code.caret_start, parser.file_name)
				}
			}
			else if (op_code instanceof __v11 || op_code instanceof __v12 || op_code instanceof __v13)
			{
			}
			else
			{
				var __v14 = use("BayLang.Exceptions.ParserExpected");
				throw new __v14("Module or variable", op_code.caret_start, parser.file_name)
			}
		}
		/* If is pipe */
		var __v15 = use("BayLang.OpCodes.OpIdentifier");
		if (parser.is_pipe && op_code instanceof __v15)
		{
			var __v16 = use("BayLang.OpCodes.OpAttr");
			var __v17 = use("BayLang.OpCodes.OpIdentifier");
			var __v18 = use("BayLang.OpCodes.OpIdentifier");
			op_code = new __v16(use("Runtime.Map").from({"kind":parser.pipe_kind,"obj":new __v17(use("Runtime.Map").from({"kind":__v18.KIND_PIPE,"caret_start":op_code.caret_start,"caret_end":op_code.caret_end})),"value":op_code,"caret_start":op_code.caret_start,"caret_end":op_code.caret_end}));
		}
		while (!token.eof && f_next(token.content))
		{
			var token_content = token.content;
			/* Static call */
			if (token_content == "(" || token_content == "{" || token_content == "@")
			{
				if ((dynamic_flags & flag_call) != flag_call)
				{
					var __v19 = use("BayLang.Exceptions.ParserError");
					throw new __v19("Call are not allowed", token.caret_start, parser.file_name)
				}
				if (token_content == "@")
				{
					parser = look;
					is_context_call = false;
				}
				var res = this.readCallArgs(parser);
				parser = Runtime.rtl.attr(res, 0);
				parser_items = Runtime.rtl.attr(res, 1);
				var __v20 = use("BayLang.OpCodes.OpCall");
				op_code = new __v20(use("Runtime.Map").from({"obj":op_code,"args":parser_items,"caret_start":caret_start,"caret_end":parser.caret,"is_await":is_await,"is_context":is_context_call}));
				is_context_call = true;
			}
			else if (token_content == "." || token_content == "::" || token_content == "[")
			{
				var kind = "";
				var look_values = null;
				var look_value = null;
				parser = look;
				is_context_call = true;
				if (token_content == ".")
				{
					var __v21 = use("BayLang.OpCodes.OpAttr");
					kind = __v21.KIND_ATTR;
					if ((dynamic_flags & flag_attr) != flag_attr)
					{
						var __v22 = use("BayLang.Exceptions.ParserError");
						throw new __v22("Attr are not allowed", token.caret_start, parser.file_name)
					}
				}
				else if (token_content == "::")
				{
					var __v23 = use("BayLang.OpCodes.OpAttr");
					kind = __v23.KIND_STATIC;
					if ((dynamic_flags & flag_static) != flag_static)
					{
						var __v24 = use("BayLang.Exceptions.ParserError");
						throw new __v24("Static attr are not allowed", token.caret_start, parser.file_name)
					}
				}
				else if (token_content == "[")
				{
					var __v25 = use("BayLang.OpCodes.OpAttr");
					kind = __v25.KIND_DYNAMIC;
					if ((dynamic_flags & flag_dynamic) != flag_dynamic)
					{
						var __v26 = use("BayLang.Exceptions.ParserError");
						throw new __v26("Dynamic attr are not allowed", token.caret_start, parser.file_name)
					}
				}
				if (token_content == "[")
				{
					var res = parser.parser_expression.constructor.readExpression(parser);
					parser = Runtime.rtl.attr(res, 0);
					look_value = Runtime.rtl.attr(res, 1);
					var res = this.readToken(parser);
					look = Runtime.rtl.attr(res, 0);
					token = Runtime.rtl.attr(res, 1);
					if (token.content == ",")
					{
						var __v27 = use("Runtime.Vector");
						look_values = new __v27();
						look_values.push(look_value);
					}
					while (token.content == ",")
					{
						parser = look;
						var res = parser.parser_expression.constructor.readExpression(parser);
						parser = Runtime.rtl.attr(res, 0);
						look_value = Runtime.rtl.attr(res, 1);
						look_values.push(look_value);
						var res = this.readToken(parser);
						look = Runtime.rtl.attr(res, 0);
						token = Runtime.rtl.attr(res, 1);
					}
					var res = this.matchToken(parser, "]");
					parser = Runtime.rtl.attr(res, 0);
					if (look_values != null)
					{
						var __v28 = use("BayLang.OpCodes.OpAttr");
						kind = __v28.KIND_DYNAMIC_ATTRS;
					}
				}
				else
				{
					var res = this.readToken(parser);
					look = Runtime.rtl.attr(res, 0);
					token = Runtime.rtl.attr(res, 1);
					if (token.content == "@")
					{
						parser = look;
						is_context_call = false;
					}
					var res = this.readIdentifier(parser);
					parser = Runtime.rtl.attr(res, 0);
					look_value = Runtime.rtl.attr(res, 1);
				}
				var __v29 = use("BayLang.OpCodes.OpAttr");
				op_code = new __v29(use("Runtime.Map").from({"kind":kind,"obj":op_code,"attrs":(look_values != null) ? (look_values) : (null),"value":(look_values == null) ? (look_value) : (null),"caret_start":caret_start,"caret_end":parser.caret}));
			}
			else
			{
				var __v30 = use("BayLang.Exceptions.ParserExpected");
				throw new __v30("Next attr", token.caret_start, parser.file_name)
			}
			var res = this.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			var __v31 = use("BayLang.OpCodes.OpAttr");
			var __v32 = use("BayLang.OpCodes.OpAttr");
			if (op_code instanceof __v31 && op_code.kind == __v32.KIND_PIPE && token.content != "(" && token.content != "{")
			{
				var __v33 = use("BayLang.Exceptions.ParserExpected");
				throw new __v33("Call", token.caret_start, parser.file_name)
			}
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.LangBay.ParserBayBase";
	},
	getParentClassName: function()
	{
		return "";
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
});use.add(BayLang.LangBay.ParserBayBase);
module.exports = BayLang.LangBay.ParserBayBase;