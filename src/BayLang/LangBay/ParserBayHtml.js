"use strict;"
var use = require('bay-lang').use;
/*!
 *  Bayrell Language
 *
 *  (c) Copyright 2016-2023 "Ildar Bikmamatov" <support@bayrell.org>
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
if (typeof Bayrell.Lang.LangBay == 'undefined') Bayrell.Lang.LangBay = {};
Bayrell.Lang.LangBay.ParserBayHtml = function(ctx)
{
	use("Runtime.BaseObject").apply(this, arguments);
};
Bayrell.Lang.LangBay.ParserBayHtml.prototype = Object.create(use("Runtime.BaseObject").prototype);
Bayrell.Lang.LangBay.ParserBayHtml.prototype.constructor = Bayrell.Lang.LangBay.ParserBayHtml;
Object.assign(Bayrell.Lang.LangBay.ParserBayHtml.prototype,
{
});
Object.assign(Bayrell.Lang.LangBay.ParserBayHtml, use("Runtime.BaseObject"));
Object.assign(Bayrell.Lang.LangBay.ParserBayHtml,
{
	/**
	 * Hash function
	 * @param string
	 * @return int hash
	 */
	hash: function(ctx, s, last, x, p)
	{
		if (last == undefined) last = true;
		if (x == undefined) x = 257;
		if (p == undefined) p = 1000000007;
		var h = 0;
		var __v0 = use("Runtime.rs");
		var sz = __v0.strlen(ctx, s);
		for (var i = 0; i < sz; i++)
		{
			var __v1 = use("Runtime.rs");
			var __v2 = use("Runtime.rs");
			var ch = __v1.ord(ctx, __v2.substr(ctx, s, i, 1));
			h = (h * x + ch) % p;
		}
		if (last)
		{
			h = h * x % p;
		}
		return h;
	},
	/**
	 * Convert int to hex
	 * @param int
	 * @return string
	 */
	toHex: function(ctx, h)
	{
		var r = "";
		var a = "0123456789abcdef";
		while (h >= 0)
		{
			var c = h & 15;
			h = h >> 4;
			var __v0 = use("Runtime.rs");
			r = __v0.substr(ctx, a, c, 1) + use("Runtime.rtl").toStr(r);
			if (h == 0)
			{
				break;
			}
		}
		return r;
	},
	/**
	 * Retuns css hash
	 * @param string component class name
	 * @return string hash
	 */
	getCssHash: function(ctx, s)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("Bayrell.Lang.LangBay.ParserBayHtml.getCssHash", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		var h = this.hash(ctx, s, true, 337, 65537) + 65537;
		var res = this.toHex(ctx, h);
		var __v0 = use("Runtime.rs");
		var __memorize_value = __v0.substr(ctx, res, -4);
		use("Runtime.rtl")._memorizeSave("Bayrell.Lang.LangBay.ParserBayHtml.getCssHash", arguments, __memorize_value);
		return __memorize_value;
	},
	/**
	 * Read css component name
	 */
	readCssComponentName: function(ctx, parser)
	{
		var flag = false;
		var class_name = "";
		/* Get caret */
		var caret = parser.getCaret(ctx);
		/* Read char */
		var ch = caret.nextChar(ctx);
		if (ch == "(")
		{
			flag = true;
			/* Read ( */
			caret.readChar(ctx);
			/* Next char */
			ch = caret.nextChar(ctx);
			/* Read class name */
			var start_pos = caret.pos;
			while (!caret.eof(ctx) && ch != ")")
			{
				caret.readChar(ctx);
				ch = caret.nextChar(ctx);
			}
			class_name = caret.getString(ctx, start_pos, caret.pos - start_pos);
			/* Recognize class name */
			if (parser.uses.has(ctx, class_name))
			{
				class_name = parser.uses.item(ctx, class_name);
			}
			/* Read ) */
			caret.matchChar(ctx, ")");
		}
		parser = parser.copy(ctx, use("Runtime.Map").from({"caret":caret}));
		return use("Runtime.Vector").from([parser,class_name,flag]);
	},
	/**
	 * Read css class name
	 */
	readCssClassName: function(ctx, parser, default_component_name)
	{
		if (default_component_name == undefined) default_component_name = true;
		/* Get caret */
		var caret = parser.getCaret(ctx);
		/* Component name */
		var use_component_name = default_component_name;
		var component_name = parser.current_namespace_name + use("Runtime.rtl").toStr(".") + use("Runtime.rtl").toStr(parser.current_class_name);
		/* Read start selector */
		var start_ch = caret.nextChar(ctx);
		if (start_ch == "." || start_ch == "%")
		{
			caret.readChar(ctx);
		}
		else if (start_ch == "#" || start_ch == ":")
		{
			caret.readChar(ctx);
			if (start_ch == ":")
			{
				use_component_name = false;
			}
		}
		else if (start_ch == "*")
		{
			caret.readChar(ctx);
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
			return use("Runtime.Vector").from([parser,"*"]);
		}
		else
		{
			start_ch = "";
		}
		/* Save caret */
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
		/* Read class name */
		if (start_ch == "%")
		{
			start_ch = ".";
			var res = this.readCssComponentName(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			if (Runtime.rtl.attr(ctx, res, 2) != "")
			{
				component_name = Runtime.rtl.attr(ctx, res, 1);
				use_component_name = true;
			}
		}
		/* Start position */
		caret = parser.getCaret(ctx);
		var start_pos = caret.pos;
		/* Read selector */
		var ch = caret.nextChar(ctx);
		while (!caret.eof(ctx) && ch != " " && ch != "," && ch != ":" && ch != "[" && ch != "{")
		{
			caret.readChar(ctx);
			ch = caret.nextChar(ctx);
		}
		var postfix = caret.getString(ctx, start_pos, caret.pos - start_pos);
		var __v0 = use("Runtime.rs");
		postfix = __v0.trim(ctx, postfix);
		/* Read suffix */
		var start_pos = caret.pos;
		while (!caret.eof(ctx) && ch != " " && ch != "," && ch != "." && ch != "{")
		{
			caret.readChar(ctx);
			ch = caret.nextChar(ctx);
		}
		var suffix = caret.getString(ctx, start_pos, caret.pos - start_pos);
		var __v1 = use("Runtime.rs");
		suffix = __v1.trim(ctx, suffix);
		var class_name = start_ch + use("Runtime.rtl").toStr(postfix) + use("Runtime.rtl").toStr(((use_component_name) ? (".h-" + use("Runtime.rtl").toStr(this.getCssHash(ctx, component_name))) : (""))) + use("Runtime.rtl").toStr(suffix);
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
		return use("Runtime.Vector").from([parser,class_name]);
	},
	/**
	 * Read css selector
	 */
	readCssSelector: function(ctx, parser, default_component_name)
	{
		if (default_component_name == undefined) default_component_name = true;
		/* Get caret */
		var caret = parser.getCaret(ctx);
		var __v0 = use("Runtime.Vector");
		var selectors = new __v0(ctx);
		while (!caret.eof(ctx))
		{
			var res = this.readCssClassName(ctx, parser, default_component_name);
			parser = Runtime.rtl.attr(ctx, res, 0);
			var selector = Runtime.rtl.attr(ctx, res, 1);
			default_component_name = false;
			selectors.push(ctx, selector);
			/* Skip empty chars */
			var caret = parser.parser_base.constructor.skipChar(ctx, parser, parser.content, parser.caret);
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
			/* Get caret */
			caret = parser.caret.clone(ctx, use("Runtime.Map").from({"file_name":parser.file_name,"content":parser.content,"content_sz":parser.content_sz}));
			var ch = caret.nextChar(ctx);
			if (ch == "{" || ch == "}" || ch == "<" || ch == ",")
			{
				break;
			}
		}
		var __v1 = use("Runtime.rs");
		var selector = __v1.join(ctx, " ", selectors);
		return use("Runtime.Vector").from([parser,selector]);
	},
	/**
	 * Concat op_code_item with selector
	 */
	readCssBodyConcatItem: function(ctx, caret_start, caret_end, selector, op_code_item)
	{
		var __v0 = use("Bayrell.Lang.OpCodes.OpString");
		if (op_code_item instanceof __v0)
		{
			var __v1 = use("Bayrell.Lang.OpCodes.OpString");
			op_code_item = new __v1(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":caret_end,"value":op_code_item.value + use("Runtime.rtl").toStr("}")}));
		}
		else
		{
			var __v2 = use("Bayrell.Lang.OpCodes.OpMath");
			var __v3 = use("Bayrell.Lang.OpCodes.OpString");
			op_code_item = new __v2(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":caret_end,"value1":op_code_item,"value2":new __v3(ctx, use("Runtime.Map").from({"value":"}"})),"math":"~"}));
		}
		var __v0 = use("Bayrell.Lang.OpCodes.OpString");
		if (op_code_item instanceof __v0)
		{
			var __v1 = use("Bayrell.Lang.OpCodes.OpString");
			op_code_item = new __v1(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":caret_end,"value":selector + use("Runtime.rtl").toStr("{") + use("Runtime.rtl").toStr(op_code_item.value)}));
		}
		else
		{
			var __v2 = use("Bayrell.Lang.OpCodes.OpMath");
			var __v3 = use("Bayrell.Lang.OpCodes.OpString");
			op_code_item = new __v2(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":caret_end,"value1":new __v3(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":caret_end,"value":selector + use("Runtime.rtl").toStr("{")})),"value2":op_code_item,"math":"~"}));
		}
		return op_code_item;
	},
	/**
	 * Returns true if next string is css selector
	 */
	isNextSelector: function(ctx, caret)
	{
		caret = caret.clone(ctx);
		var ch = caret.nextChar(ctx);
		if (ch == "%" || ch == "." || ch == "#" || ch == ":" || ch == "*")
		{
			return true;
		}
		if (!caret.constructor.isChar(ctx, ch))
		{
			return false;
		}
		while (!caret.eof(ctx) && ch != "{" && ch != "}" && ch != "<")
		{
			if (ch == ";" || ch == "(" || ch == ")")
			{
				return false;
			}
			caret.nextChar(ctx);
			ch = caret.readChar(ctx);
		}
		if (ch == "{")
		{
			return true;
		}
		return false;
	},
	/**
	 * Get selectors from collection
	 */
	getSelectors: function(ctx, start_selectors)
	{
		var result = use("Runtime.Vector").from([""]);
		for (var i = 0; i < start_selectors.count(ctx); i++)
		{
			var prev_result = result;
			result = use("Runtime.Vector").from([]);
			var items = start_selectors.get(ctx, i);
			for (var j = 0; j < prev_result.count(ctx); j++)
			{
				var prev_selector = prev_result.get(ctx, j);
				for (var k = 0; k < items.count(ctx); k++)
				{
					var selector = items.get(ctx, k);
					result.push(ctx, prev_selector + use("Runtime.rtl").toStr(" ") + use("Runtime.rtl").toStr(selector));
				}
			}
		}
		return result;
	},
	/**
	 * Read css body
	 */
	readCssBodyItems: function(ctx, parser, items, start_selectors, end_tag, default_component_name)
	{
		var css_content = use("Runtime.Vector").from([]);
		/* Get caret */
		var caret_start = parser.getCaret(ctx);
		/* Skip empty chars */
		var caret = parser.parser_base.constructor.skipChar(ctx, parser, parser.content, parser.caret);
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
		caret = parser.getCaret(ctx);
		var op_code = null;
		while (!caret.eof(ctx) && caret.nextChar(ctx) != end_tag && caret.nextChar(ctx) != "}")
		{
			var op_code_item = null;
			/* Read media css */
			if (caret.isNextString(ctx, "@media"))
			{
				/* Read selector */
				var __v0 = use("Runtime.Vector");
				var arr = new __v0(ctx);
				var ch = caret.nextChar(ctx);
				while (!caret.eof(ctx) && ch != "{")
				{
					if (ch != "\t" && ch != "\n")
					{
						arr.push(ctx, ch);
					}
					caret.readChar(ctx);
					ch = caret.nextChar(ctx);
				}
				var __v1 = use("Runtime.rs");
				var __v2 = use("Runtime.rs");
				var media_selector = __v1.trim(ctx, __v2.join(ctx, "", arr));
				/* Setup caret */
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
				var caret_start_item2 = parser.getCaret(ctx);
				/* Read body */
				var __v3 = use("Runtime.Vector");
				var new_items = new __v3(ctx);
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "{");
				parser = Runtime.rtl.attr(ctx, res, 0);
				parser = this.readCssBodyItems(ctx, parser, new_items, start_selectors, "}", default_component_name);
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "}");
				parser = Runtime.rtl.attr(ctx, res, 0);
				/* Items */
				for (var i = 0; i < new_items.count(ctx); i++)
				{
					var item = new_items.get(ctx, i);
					item = this.readCssBodyConcatItem(ctx, item.caret_start, item.caret_end, media_selector, item);
					items.push(ctx, item);
				}
				/* Get caret */
				caret = parser.getCaret(ctx);
			}
			else if (this.isNextSelector(ctx, caret))
			{
				var selectors = use("Runtime.Vector").from([]);
				/* Read css selector */
				while (this.isNextSelector(ctx, caret))
				{
					parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
					var res = this.readCssSelector(ctx, parser, default_component_name);
					parser = Runtime.rtl.attr(ctx, res, 0);
					selectors.push(ctx, Runtime.rtl.attr(ctx, res, 1));
					caret = parser.getCaret(ctx);
					caret.skipChar(ctx);
					if (caret.isNextChar(ctx, ","))
					{
						caret.readChar(ctx);
						caret.skipNullChar(ctx);
					}
				}
				/* Setup caret */
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
				var caret_start_item2 = parser.getCaret(ctx);
				/* Read body */
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "{");
				parser = Runtime.rtl.attr(ctx, res, 0);
				parser = this.readCssBodyItems(ctx, parser, items, start_selectors.pushIm(ctx, selectors), "}", false);
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "}");
				parser = Runtime.rtl.attr(ctx, res, 0);
				/* Get caret */
				caret = parser.getCaret(ctx);
			}
			else
			{
				var __v4 = use("Runtime.Vector");
				var arr = new __v4(ctx);
				var ch = caret.nextChar(ctx);
				while (!caret.eof(ctx) && ch != "}" && ch != ";")
				{
					if (ch != "\t" && ch != "\n")
					{
						arr.push(ctx, ch);
					}
					caret.readChar(ctx);
					ch = caret.nextChar(ctx);
				}
				var __v5 = use("Runtime.rs");
				var __v6 = use("Runtime.rs");
				var s = __v5.trim(ctx, __v6.join(ctx, "", arr));
				css_content.push(ctx, s);
				caret.skipChar(ctx, ";");
				/* Setup caret */
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
			}
			/* Skip empty chars */
			caret = parser.parser_base.constructor.skipChar(ctx, parser, parser.content, caret);
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
			caret = parser.getCaret(ctx);
		}
		if (css_content.count(ctx) > 0)
		{
			/* Get content */
			var __v0 = use("Runtime.rs");
			var content = __v0.join(ctx, ";", css_content);
			var selectors = this.getSelectors(ctx, start_selectors);
			var __v1 = use("Runtime.rs");
			content = __v1.join(ctx, ",", selectors) + use("Runtime.rtl").toStr("{") + use("Runtime.rtl").toStr(content) + use("Runtime.rtl").toStr("}");
			/* Create op code */
			var __v2 = use("Bayrell.Lang.OpCodes.OpString");
			var __v3 = use("Runtime.rs");
			var op_code_item = new __v2(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.getCaret(ctx),"value":__v3.trim(ctx, content)}));
			items.push(ctx, op_code_item);
		}
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
		return parser;
	},
	/**
	 * Read css body
	 */
	readCssBody: function(ctx, parser, end_tag, default_component_name)
	{
		if (end_tag == undefined) end_tag = "}";
		if (default_component_name == undefined) default_component_name = true;
		/* Get caret */
		var caret_start = parser.getCaret(ctx);
		var op_code = null;
		var __v0 = use("Runtime.Vector");
		var items = new __v0(ctx);
		/* Read items */
		parser = this.readCssBodyItems(ctx, parser, items, use("Runtime.Vector").from([]), end_tag, default_component_name);
		for (var i = 0; i < items.count(ctx); i++)
		{
			var op_code_item = items.get(ctx, i);
			if (op_code == null)
			{
				op_code = op_code_item;
			}
			else
			{
				var __v1 = use("Bayrell.Lang.OpCodes.OpString");
				var __v2 = use("Bayrell.Lang.OpCodes.OpString");
				if (op_code instanceof __v1 && op_code_item instanceof __v2)
				{
					var __v3 = use("Bayrell.Lang.OpCodes.OpString");
					op_code = new __v3(ctx, use("Runtime.Map").from({"caret_start":op_code.caret_start,"caret_end":op_code_item.caret_end,"value":op_code.value + use("Runtime.rtl").toStr(op_code_item.value)}));
				}
				else
				{
					var __v4 = use("Bayrell.Lang.OpCodes.OpMath");
					op_code = new __v4(ctx, use("Runtime.Map").from({"caret_start":op_code.caret_start,"caret_end":op_code_item.caret_end,"value1":op_code,"value2":op_code_item,"math":"~"}));
				}
			}
		}
		if (op_code == null)
		{
			var __v1 = use("Bayrell.Lang.OpCodes.OpString");
			op_code = new __v1(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"value":""}));
		}
		op_code = Runtime.rtl.setAttr(ctx, op_code, Runtime.Collection.from(["caret_start"]), caret_start);
		op_code = Runtime.rtl.setAttr(ctx, op_code, Runtime.Collection.from(["caret_end"]), parser.caret);
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read css
	 */
	readCss: function(ctx, parser)
	{
		var caret_start = parser.caret;
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "@css");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "{");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = this.readCssBody(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		var op_code = Runtime.rtl.attr(ctx, res, 1);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "}");
		parser = Runtime.rtl.attr(ctx, res, 0);
		if (op_code == null)
		{
			var __v0 = use("Bayrell.Lang.OpCodes.OpString");
			op_code = new __v0(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"value":""}));
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read style
	 */
	readStyle: function(ctx, parser, item_attrs, items, caret_start)
	{
		/* Save vars */
		var save_vars = parser.vars;
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), parser.vars.setIm(ctx, "vars", true));
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["is_local_css"]), true);
		/* Check if local css */
		var is_global = item_attrs.get(ctx, "global", "");
		if (is_global == "true")
		{
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["is_local_css"]), false);
		}
		/* Read css */
		var res = this.readCssBody(ctx, parser, "<", parser.is_local_css);
		parser = Runtime.rtl.attr(ctx, res, 0);
		var css_op_code = Runtime.rtl.attr(ctx, res, 1);
		/* Restore vars */
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), save_vars);
		/* Read style footer */
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "/");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "style");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var __v0 = use("Bayrell.Lang.OpCodes.OpHtmlStyle");
		var op_code = new __v0(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"value":css_op_code}));
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read html comment
	 */
	readHTMLComment: function(ctx, parser)
	{
		var start = parser;
		var token = null;
		var look = null;
		var caret_start = parser.caret;
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["skip_comments"]), false);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "!--");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var content = parser.content;
		var content_sz = parser.content_sz;
		var pos = parser.caret.pos;
		var x = parser.caret.x;
		var y = parser.caret.y;
		var pos_start = pos;
		var __v0 = use("Runtime.rs");
		var ch = __v0.charAt(ctx, content.ref, pos);
		var __v1 = use("Runtime.rs");
		var ch3 = __v1.substr(ctx, content.ref, pos, 3);
		while (ch3 != "-->" && pos < content_sz)
		{
			x = parser.parser_base.constructor.nextX(ctx, parser, ch, x);
			y = parser.parser_base.constructor.nextY(ctx, parser, ch, y);
			pos = pos + 1;
			if (pos >= parser.content_sz)
			{
				break;
			}
			var __v2 = use("Runtime.rs");
			ch = __v2.charAt(ctx, content.ref, pos);
			var __v3 = use("Runtime.rs");
			ch3 = __v3.substr(ctx, content.ref, pos, 3);
		}
		var pos_end = pos;
		if (ch3 == "-->")
		{
			x = x + 3;
			pos = pos + 3;
		}
		else
		{
			var __v2 = use("Bayrell.Lang.Exceptions.ParserExpected");
			var __v3 = use("Bayrell.Lang.Caret");
			throw new __v2(ctx, "End of comment", new __v3(ctx, use("Runtime.Map").from({"x":x,"y":y,"pos":pos})), start.file_name)
		}
		/* Return result */
		var __v2 = use("Runtime.rs");
		var value_str = __v2.substr(ctx, content.ref, pos_start, pos_end - pos_start);
		var __v3 = use("Bayrell.Lang.Caret");
		var caret_end = new __v3(ctx, use("Runtime.Map").from({"x":x,"y":y,"pos":pos}));
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["skip_comments"]), true);
		var __v4 = use("Bayrell.Lang.OpCodes.OpComment");
		return use("Runtime.Vector").from([start.copy(ctx, use("Runtime.Map").from({"caret":caret_end})),new __v4(ctx, use("Runtime.Map").from({"value":value_str,"caret_start":caret_start,"caret_end":caret_end}))]);
		return use("Runtime.Vector").from([parser,null]);
	},
	/**
	 * Read html value
	 */
	readHTMLValue: function(ctx, parser)
	{
		var item = null;
		var caret = parser.caret;
		var content = parser.content;
		var pos = parser.caret.pos;
		var x = parser.caret.x;
		var y = parser.caret.y;
		var __v0 = use("Runtime.rs");
		var ch = __v0.substr(ctx, content.ref, pos, 1);
		var __v1 = use("Runtime.rs");
		var ch2 = __v1.substr(ctx, content.ref, pos, 2);
		if (ch == "<")
		{
			var res = this.readHTMLTag(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			item = Runtime.rtl.attr(ctx, res, 1);
		}
		else if (ch == "{")
		{
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "{");
			parser = Runtime.rtl.attr(ctx, res, 0);
			/* Look token */
			var flag = false;
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			var look = Runtime.rtl.attr(ctx, res, 0);
			var token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == "{")
			{
				flag = true;
				parser = look;
			}
			var res = parser.parser_expression.constructor.readExpression(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			item = Runtime.rtl.attr(ctx, res, 1);
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "}");
			parser = Runtime.rtl.attr(ctx, res, 0);
			if (flag)
			{
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "}");
				parser = Runtime.rtl.attr(ctx, res, 0);
			}
		}
		else if (ch == "@")
		{
			x = parser.parser_base.constructor.nextX(ctx, parser, ch, x);
			y = parser.parser_base.constructor.nextY(ctx, parser, ch, y);
			pos = pos + 1;
			var __v2 = use("Runtime.rs");
			var ch3 = __v2.substr(ctx, content.ref, pos, 3);
			var __v3 = use("Runtime.rs");
			var ch4 = __v3.substr(ctx, content.ref, pos, 4);
			if (ch3 == "raw" || ch4 == "json" || ch4 == "html")
			{
				var res;
				if (ch3 == "raw")
				{
					res = parser.parser_base.constructor.next(ctx, parser, ch3, x, y, pos);
				}
				if (ch4 == "json")
				{
					res = parser.parser_base.constructor.next(ctx, parser, ch4, x, y, pos);
				}
				if (ch4 == "html")
				{
					res = parser.parser_base.constructor.next(ctx, parser, ch4, x, y, pos);
				}
				x = Runtime.rtl.attr(ctx, res, 0);
				y = Runtime.rtl.attr(ctx, res, 1);
				pos = Runtime.rtl.attr(ctx, res, 2);
			}
			var __v4 = use("Bayrell.Lang.Caret");
			caret = new __v4(ctx, use("Runtime.Map").from({"x":x,"y":y,"pos":pos}));
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "{");
			parser = Runtime.rtl.attr(ctx, res, 0);
			/* Look bracket */
			var res = parser.parser_base.constructor.lookToken(ctx, parser, "{");
			var look = Runtime.rtl.attr(ctx, res, 0);
			var find_bracket = Runtime.rtl.attr(ctx, res, 2);
			if (find_bracket)
			{
				parser = look;
			}
			var res = parser.parser_expression.constructor.readExpression(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			item = Runtime.rtl.attr(ctx, res, 1);
			if (ch3 == "raw")
			{
				var __v5 = use("Bayrell.Lang.OpCodes.OpHtmlValue");
				var __v6 = use("Bayrell.Lang.OpCodes.OpHtmlValue");
				item = new __v5(ctx, use("Runtime.Map").from({"kind":__v6.KIND_RAW,"value":item,"caret_start":caret,"caret_end":parser.caret}));
			}
			else if (ch4 == "json")
			{
				var __v7 = use("Bayrell.Lang.OpCodes.OpHtmlValue");
				var __v8 = use("Bayrell.Lang.OpCodes.OpHtmlValue");
				item = new __v7(ctx, use("Runtime.Map").from({"kind":__v8.KIND_JSON,"value":item,"caret_start":caret,"caret_end":parser.caret}));
			}
			else if (ch4 == "html")
			{
				var __v9 = use("Bayrell.Lang.OpCodes.OpHtmlValue");
				var __v10 = use("Bayrell.Lang.OpCodes.OpHtmlValue");
				item = new __v9(ctx, use("Runtime.Map").from({"kind":__v10.KIND_HTML,"value":item,"caret_start":caret,"caret_end":parser.caret}));
			}
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "}");
			parser = Runtime.rtl.attr(ctx, res, 0);
			if (find_bracket)
			{
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "}");
				parser = Runtime.rtl.attr(ctx, res, 0);
			}
		}
		return use("Runtime.Vector").from([parser,item]);
	},
	/**
	 * Read html attribute key
	 */
	readHTMLAttrKey: function(ctx, parser)
	{
		var token = null;
		var look = null;
		var ident = null;
		var key = "";
		/* Look token */
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "@")
		{
			parser = look;
			key = "@";
		}
		var res = parser.parser_base.constructor.readIdentifier(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		ident = Runtime.rtl.attr(ctx, res, 1);
		key += use("Runtime.rtl").toStr(ident.value);
		/* Read attr */
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		while (token.content == "-")
		{
			var res = parser.parser_base.constructor.readIdentifier(ctx, look);
			parser = Runtime.rtl.attr(ctx, res, 0);
			ident = Runtime.rtl.attr(ctx, res, 1);
			key += use("Runtime.rtl").toStr("-" + use("Runtime.rtl").toStr(ident.value));
			/* Look next token */
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
		}
		/* Look token */
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == ":")
		{
			parser = look;
			key += use("Runtime.rtl").toStr(":");
			var res = parser.parser_base.constructor.readIdentifier(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			ident = Runtime.rtl.attr(ctx, res, 1);
			key += use("Runtime.rtl").toStr(ident.value);
		}
		return use("Runtime.Vector").from([parser,key]);
	},
	/**
	 * Read html attribute value
	 */
	readHTMLAttrValue: function(ctx, parser, attr_key)
	{
		var token = null;
		var look = null;
		var op_code = null;
		var ident = null;
		var pos = parser.caret.pos;
		var content = parser.content;
		var __v0 = use("Runtime.rs");
		var ch = __v0.substr(ctx, content.ref, pos, 1);
		var __v1 = use("Runtime.rs");
		var ch2 = __v1.substr(ctx, content.ref, pos, 2);
		/* Look token */
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var __v2 = use("Runtime.rs");
		if (__v2.substr(ctx, attr_key, 0, 7) == "@event:")
		{
			/* Look token */
			var res = parser.parser_base.constructor.lookToken(ctx, parser, "{");
			var look = Runtime.rtl.attr(ctx, res, 0);
			var token = Runtime.rtl.attr(ctx, res, 1);
			var is_fn = Runtime.rtl.attr(ctx, res, 2);
			if (is_fn)
			{
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "{");
				parser = Runtime.rtl.attr(ctx, res, 0);
				/* Look token */
				var res = parser.parser_base.constructor.lookToken(ctx, parser, "{");
				var look = Runtime.rtl.attr(ctx, res, 0);
				var token = Runtime.rtl.attr(ctx, res, 1);
				var find = Runtime.rtl.attr(ctx, res, 2);
				if (find)
				{
					parser = look;
				}
				/* Add msg to vars */
				var parser_vars = parser.vars;
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), parser.vars.concat(ctx, use("Runtime.Map").from({"component":true,"msg":true})));
				/* Read expression */
				var res = parser.parser_expression.constructor.readExpression(ctx, parser);
				parser = Runtime.rtl.attr(ctx, res, 0);
				op_code = Runtime.rtl.attr(ctx, res, 1);
				/* Restore vars */
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), parser_vars);
				/* Parse brackets */
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "}");
				parser = Runtime.rtl.attr(ctx, res, 0);
				if (find)
				{
					var res = parser.parser_base.constructor.matchToken(ctx, parser, "}");
					parser = Runtime.rtl.attr(ctx, res, 0);
				}
			}
			else
			{
				var res = parser.parser_base.constructor.readString(ctx, parser);
				parser = Runtime.rtl.attr(ctx, res, 0);
				op_code = Runtime.rtl.attr(ctx, res, 1);
			}
		}
		else if (ch == "{")
		{
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "{");
			parser = Runtime.rtl.attr(ctx, res, 0);
			/* Look token */
			var res = parser.parser_base.constructor.lookToken(ctx, parser, "{");
			var look = Runtime.rtl.attr(ctx, res, 0);
			var token = Runtime.rtl.attr(ctx, res, 1);
			var find = Runtime.rtl.attr(ctx, res, 2);
			if (find)
			{
				parser = look;
			}
			var res = parser.parser_expression.constructor.readExpression(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			op_code = Runtime.rtl.attr(ctx, res, 1);
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "}");
			parser = Runtime.rtl.attr(ctx, res, 0);
			if (find)
			{
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "}");
				parser = Runtime.rtl.attr(ctx, res, 0);
			}
		}
		else if (token.content == "@")
		{
			var res = this.readHTMLValue(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			op_code = Runtime.rtl.attr(ctx, res, 1);
		}
		else if (token.content == "[")
		{
			var res = parser.parser_base.constructor.readCollection(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			op_code = Runtime.rtl.attr(ctx, res, 1);
		}
		else
		{
			var res = parser.parser_base.constructor.readString(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			op_code = Runtime.rtl.attr(ctx, res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read html attributes
	 */
	readHTMLAttrs: function(ctx, parser)
	{
		var __v0 = use("Runtime.Vector");
		var items = new __v0(ctx);
		var token = null;
		var look = null;
		var content = parser.content;
		var content_sz = parser.content_sz;
		var caret = parser.parser_base.constructor.skipChar(ctx, parser, content, parser.caret);
		var __v1 = use("Runtime.rs");
		var ch = __v1.substr(ctx, content.ref, caret.pos, 1);
		while (ch != "/" && ch != ">" && caret.pos < content_sz)
		{
			var caret_start = caret;
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == "...")
			{
				var ident = null;
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "...");
				parser = Runtime.rtl.attr(ctx, res, 0);
				var res = parser.parser_base.constructor.readIdentifier(ctx, look);
				parser = Runtime.rtl.attr(ctx, res, 0);
				ident = Runtime.rtl.attr(ctx, res, 1);
				var __v2 = use("Bayrell.Lang.OpCodes.OpHtmlAttribute");
				items.push(ctx, new __v2(ctx, use("Runtime.Map").from({"value":ident,"is_spread":true,"caret_start":caret_start,"caret_end":parser.caret})));
			}
			else
			{
				var res = this.readHTMLAttrKey(ctx, parser);
				parser = Runtime.rtl.attr(ctx, res, 0);
				var key = Runtime.rtl.attr(ctx, res, 1);
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "=");
				parser = Runtime.rtl.attr(ctx, res, 0);
				var res = this.readHTMLAttrValue(ctx, parser, key);
				parser = Runtime.rtl.attr(ctx, res, 0);
				var value = Runtime.rtl.attr(ctx, res, 1);
				var __v3 = use("Bayrell.Lang.OpCodes.OpHtmlAttribute");
				items.push(ctx, new __v3(ctx, use("Runtime.Map").from({"key":key,"value":value,"caret_start":caret_start,"caret_end":parser.caret})));
			}
			caret = parser.parser_base.constructor.skipChar(ctx, parser, content, parser.caret);
			var __v2 = use("Runtime.rs");
			ch = __v2.substr(ctx, content.ref, caret.pos, 1);
			var __v3 = use("Runtime.rs");
			var ch2 = __v3.substr(ctx, content.ref, caret.pos, 2);
			if (ch2 == "/>")
			{
				break;
			}
		}
		return use("Runtime.Vector").from([parser,items.toCollection(ctx)]);
	},
	/**
	 * Read html template
	 */
	readHTMLContent: function(ctx, parser, end_tag)
	{
		var __v0 = use("Runtime.Vector");
		var items = new __v0(ctx);
		var item = null;
		var token = null;
		var look = null;
		var caret = null;
		var caret_start = parser.caret;
		var content = parser.content;
		var content_sz = parser.content_sz;
		var pos = parser.caret.pos;
		var x = parser.caret.x;
		var y = parser.caret.y;
		var start_pos = pos;
		var __v1 = use("Runtime.rs");
		var end_tag_sz = __v1.strlen(ctx, end_tag);
		var __v2 = use("Runtime.rs");
		var ch_pos = __v2.substr(ctx, content.ref, pos, end_tag_sz);
		var flag_first = true;
		var first_html_tag = false;
		if (end_tag == "")
		{
			first_html_tag = true;
		}
		while ((end_tag == "" || end_tag != "" && ch_pos != end_tag) && pos < content_sz)
		{
			var __v3 = use("Runtime.rs");
			var ch = __v3.substr(ctx, content.ref, pos, 1);
			var __v4 = use("Runtime.rs");
			var ch2 = __v4.substr(ctx, content.ref, pos, 2);
			var __v5 = use("Runtime.rs");
			var ch3 = __v5.substr(ctx, content.ref, pos, 3);
			var __v6 = use("Runtime.rs");
			var ch4 = __v6.substr(ctx, content.ref, pos, 4);
			var __v7 = use("Runtime.rs");
			var ch6 = __v7.substr(ctx, content.ref, pos, 6);
			var __v8 = use("Runtime.rs");
			var ch7 = __v8.substr(ctx, content.ref, pos, 7);
			/* Html comment */
			if (ch4 == "<!--")
			{
				var __v9 = use("Runtime.rs");
				var value = __v9.substr(ctx, content.ref, start_pos, pos - start_pos);
				var __v10 = use("Bayrell.Lang.Caret");
				caret = new __v10(ctx, use("Runtime.Map").from({"x":x,"y":y,"pos":pos}));
				var __v11 = use("Runtime.rs");
				value = __v11.trim(ctx, value, "\t\r\n");
				var __v12 = use("Runtime.rs");
				value = __v12.trim(ctx, value, " ");
				if (value != "")
				{
					var __v13 = use("Bayrell.Lang.OpCodes.OpHtmlContent");
					item = new __v13(ctx, use("Runtime.Map").from({"value":value,"caret_start":caret_start,"caret_end":caret}));
					items.push(ctx, item);
				}
				/* Read HTML Comment */
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
				var res = this.readHTMLComment(ctx, parser);
				parser = Runtime.rtl.attr(ctx, res, 0);
				items.push(ctx, Runtime.rtl.attr(ctx, res, 1));
				/* Set pos, x, y */
				caret_start = parser.caret;
				pos = parser.caret.pos;
				x = parser.caret.x;
				y = parser.caret.y;
				start_pos = pos;
			}
			else if (ch == "<" || ch2 == "{{" || ch == "@")
			{
				var __v13 = use("Runtime.rs");
				var value = __v13.substr(ctx, content.ref, start_pos, pos - start_pos);
				var __v14 = use("Bayrell.Lang.Caret");
				caret = new __v14(ctx, use("Runtime.Map").from({"x":x,"y":y,"pos":pos}));
				var __v15 = use("Runtime.rs");
				value = __v15.trim(ctx, value, "\t\r\n");
				if (flag_first && first_html_tag)
				{
					var __v16 = use("Runtime.rs");
					value = __v16.trim(ctx, value, " ");
				}
				if (value != "")
				{
					var __v16 = use("Bayrell.Lang.OpCodes.OpHtmlContent");
					item = new __v16(ctx, use("Runtime.Map").from({"value":value,"caret_start":caret_start,"caret_end":caret}));
					items.push(ctx, item);
				}
				/* Read HTML Value */
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
				var res = this.readHTMLValue(ctx, parser);
				parser = Runtime.rtl.attr(ctx, res, 0);
				item = Runtime.rtl.attr(ctx, res, 1);
				items.push(ctx, item);
				/* Set pos, x, y */
				caret_start = parser.caret;
				pos = parser.caret.pos;
				x = parser.caret.x;
				y = parser.caret.y;
				start_pos = pos;
			}
			else if (ch3 == "%if" || ch4 == "%for" || ch4 == "%var" || ch4 == "%set" || ch6 == "%while" || ch7 == "%render")
			{
				var __v16 = use("Runtime.rs");
				var value = __v16.substr(ctx, content.ref, start_pos, pos - start_pos);
				var __v17 = use("Bayrell.Lang.Caret");
				caret = new __v17(ctx, use("Runtime.Map").from({"x":x,"y":y,"pos":pos}));
				var __v18 = use("Runtime.rs");
				value = __v18.trim(ctx, value, "\t\r\n");
				var __v19 = use("Runtime.rs");
				value = __v19.trim(ctx, value, " ");
				if (value != "")
				{
					var __v20 = use("Bayrell.Lang.OpCodes.OpHtmlContent");
					item = new __v20(ctx, use("Runtime.Map").from({"value":value,"caret_start":caret_start,"caret_end":caret}));
					items.push(ctx, item);
				}
				/* Read HTML Operator */
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
				var res = this.readHTMLOperator(ctx, parser);
				parser = Runtime.rtl.attr(ctx, res, 0);
				item = Runtime.rtl.attr(ctx, res, 1);
				items.push(ctx, item);
				/* Set pos, x, y */
				caret_start = parser.caret;
				pos = parser.caret.pos;
				x = parser.caret.x;
				y = parser.caret.y;
				start_pos = pos;
			}
			else
			{
				if (first_html_tag && ch != " " && ch != "\t" && ch != "\r" && ch != "\n")
				{
					break;
				}
				x = parser.parser_base.constructor.nextX(ctx, parser, ch, x);
				y = parser.parser_base.constructor.nextY(ctx, parser, ch, y);
				pos = pos + 1;
			}
			var __v9 = use("Runtime.rs");
			ch_pos = __v9.substr(ctx, content.ref, pos, end_tag_sz);
		}
		/* Push item */
		var __v3 = use("Runtime.rs");
		var value = __v3.substr(ctx, content.ref, start_pos, pos - start_pos);
		var __v4 = use("Runtime.rs");
		value = __v4.trim(ctx, value, "\t\r\n");
		var __v5 = use("Bayrell.Lang.Caret");
		caret = new __v5(ctx, use("Runtime.Map").from({"x":x,"y":y,"pos":pos}));
		if (first_html_tag)
		{
			var __v6 = use("Runtime.rs");
			value = __v6.trim(ctx, value, " ");
		}
		if (value != "")
		{
			var __v6 = use("Bayrell.Lang.OpCodes.OpHtmlContent");
			item = new __v6(ctx, use("Runtime.Map").from({"value":value,"caret_start":caret_start,"caret_end":caret}));
			items.push(ctx, item);
		}
		return use("Runtime.Vector").from([parser.copy(ctx, use("Runtime.Map").from({"caret":caret})),items]);
	},
	/**
	 * Read html tag
	 */
	readHTMLTag: function(ctx, parser)
	{
		var token = null;
		var look = null;
		var ident = null;
		var caret_items_start = null;
		var caret_items_end = null;
		var caret_start = parser.caret;
		var items = null;
		var op_code_name = null;
		var is_single_flag = false;
		var op_code_flag = false;
		var tag_name = "";
		/* Tag start */
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
		parser = Runtime.rtl.attr(ctx, res, 0);
		/* Look token */
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "{")
		{
			op_code_flag = true;
			var caret1 = parser.caret;
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "{");
			parser = Runtime.rtl.attr(ctx, res, 0);
			var res = parser.parser_expression.constructor.readExpression(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			op_code_name = Runtime.rtl.attr(ctx, res, 1);
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "}");
			parser = Runtime.rtl.attr(ctx, res, 0);
			var caret2 = parser.caret;
			var __v0 = use("Runtime.rs");
			tag_name = __v0.substr(ctx, parser.content.ref, caret1.pos, caret2.pos - caret1.pos);
		}
		else if (token.content == ">")
		{
			op_code_flag = true;
			tag_name = "";
		}
		else
		{
			var res = parser.parser_base.constructor.readIdentifier(ctx, parser, false);
			parser = Runtime.rtl.attr(ctx, res, 0);
			ident = Runtime.rtl.attr(ctx, res, 1);
			tag_name = ident.value;
		}
		var res = this.readHTMLAttrs(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		var attrs = Runtime.rtl.attr(ctx, res, 1);
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "/")
		{
			parser = look;
			is_single_flag = true;
		}
		var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
		parser = Runtime.rtl.attr(ctx, res, 0);
		if (!is_single_flag)
		{
			if (tag_name == "svg")
			{
				var res = parser.parser_base.constructor.readUntilStringArr(ctx, parser, use("Runtime.Vector").from(["</svg>"]), false);
				parser = Runtime.rtl.attr(ctx, res, 0);
				var content = Runtime.rtl.attr(ctx, res, 1);
				var __v0 = use("Runtime.re");
				content = __v0.replace(ctx, "[\t\n]", "", content);
				var __v1 = use("Bayrell.Lang.OpCodes.OpHtmlValue");
				var __v2 = use("Bayrell.Lang.OpCodes.OpHtmlValue");
				var __v3 = use("Bayrell.Lang.OpCodes.OpString");
				var items = use("Runtime.Vector").from([new __v1(ctx, use("Runtime.Map").from({"kind":__v2.KIND_RAW,"value":new __v3(ctx, use("Runtime.Map").from({"caret_start":parser.caret,"caret_end":parser.caret,"value":content})),"caret_start":caret_start,"caret_end":parser.caret}))]);
			}
			else
			{
				/* Read items */
				caret_items_start = parser.caret;
				var res = this.readHTMLContent(ctx, parser, "</" + use("Runtime.rtl").toStr(tag_name));
				parser = Runtime.rtl.attr(ctx, res, 0);
				var items = Runtime.rtl.attr(ctx, res, 1);
				caret_items_end = parser.caret;
			}
			/* Tag end */
			if (op_code_flag)
			{
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
				parser = Runtime.rtl.attr(ctx, res, 0);
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "/");
				parser = Runtime.rtl.attr(ctx, res, 0);
				if (tag_name)
				{
					var res = parser.parser_base.constructor.matchString(ctx, parser, tag_name);
					parser = Runtime.rtl.attr(ctx, res, 0);
				}
				var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
				parser = Runtime.rtl.attr(ctx, res, 0);
			}
			else
			{
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
				parser = Runtime.rtl.attr(ctx, res, 0);
				var res = parser.parser_base.constructor.matchToken(ctx, parser, "/");
				parser = Runtime.rtl.attr(ctx, res, 0);
				if (ident != null)
				{
					var res = parser.parser_base.constructor.matchToken(ctx, parser, tag_name);
					parser = Runtime.rtl.attr(ctx, res, 0);
				}
				var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
				parser = Runtime.rtl.attr(ctx, res, 0);
			}
		}
		var __v0 = use("Bayrell.Lang.OpCodes.OpHtmlTag");
		var __v1 = use("Bayrell.Lang.OpCodes.OpHtmlItems");
		var op_code = new __v0(ctx, use("Runtime.Map").from({"attrs":attrs,"tag_name":tag_name,"op_code_name":op_code_name,"caret_start":caret_start,"caret_end":parser.caret,"items":(items != null) ? (new __v1(ctx, use("Runtime.Map").from({"caret_start":caret_items_start,"caret_end":caret_items_end,"items":items.toCollection(ctx)}))) : (null)}));
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read html operator
	 */
	readHTMLOperator: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		if (token.content == "%if")
		{
			return parser.parser_operator.constructor.readIf(ctx, parser);
		}
		else if (token.content == "%for")
		{
			return parser.parser_operator.constructor.readFor(ctx, parser);
		}
		else if (token.content == "%while")
		{
			return parser.parser_operator.constructor.readWhile(ctx, parser);
		}
		else if (token.content == "%var")
		{
			var op_code = null;
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "%var");
			parser = Runtime.rtl.attr(ctx, res, 0);
			var res = parser.parser_operator.constructor.readAssign(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			op_code = Runtime.rtl.attr(ctx, res, 1);
			var res = parser.parser_base.constructor.matchToken(ctx, parser, ";");
			parser = Runtime.rtl.attr(ctx, res, 0);
			return use("Runtime.Vector").from([parser,op_code]);
		}
		else if (token.content == "%set")
		{
			var op_code = null;
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "%set");
			parser = Runtime.rtl.attr(ctx, res, 0);
			var res = parser.parser_operator.constructor.readAssign(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			op_code = Runtime.rtl.attr(ctx, res, 1);
			var res = parser.parser_base.constructor.matchToken(ctx, parser, ";");
			parser = Runtime.rtl.attr(ctx, res, 0);
			return use("Runtime.Vector").from([parser,op_code]);
		}
		else if (token.content == "%render")
		{
			var op_code = null;
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "%render");
			parser = Runtime.rtl.attr(ctx, res, 0);
			var res = parser.parser_base.constructor.readDynamic(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			op_code = Runtime.rtl.attr(ctx, res, 1);
			var __v0 = use("Bayrell.Lang.OpCodes.OpCall");
			if (op_code instanceof __v0)
			{
				op_code = Runtime.rtl.setAttr(ctx, op_code, Runtime.Collection.from(["is_html"]), true);
			}
			var res = parser.parser_base.constructor.matchToken(ctx, parser, ";");
			parser = Runtime.rtl.attr(ctx, res, 0);
			return use("Runtime.Vector").from([parser,op_code]);
		}
		return use("Runtime.Vector").from([parser,null]);
	},
	/**
	 * Read html operator
	 */
	readHTML: function(ctx, parser, end_tag)
	{
		if (end_tag == undefined) end_tag = "";
		var caret_start = parser.caret;
		/* Enable html flag */
		var save_is_html = parser.is_html;
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["is_html"]), true);
		var res = this.readHTMLContent(ctx, parser, end_tag);
		parser = Runtime.rtl.attr(ctx, res, 0);
		var items = Runtime.rtl.attr(ctx, res, 1);
		var __v0 = use("Bayrell.Lang.OpCodes.OpHtmlItems");
		var op_code = new __v0(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"items":items}));
		/* Disable html flag */
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["is_html"]), save_is_html);
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read html operator
	 */
	readHTMLTemplate: function(ctx, parser, item_attrs, caret_start)
	{
		var fn_name = item_attrs.get(ctx, "name", "render");
		var fn_args_str = item_attrs.get(ctx, "args", "");
		var parser2_vars = use("Runtime.Map").from({});
		/*
		Collection<OpDeclareFunctionArg> fn_args =
		[
			new OpDeclareFunctionArg
			{
				"name": "component",
				"caret_start": caret_start,
				"caret_end": parser.caret,
			},
			new OpDeclareFunctionArg
			{
				"name": "layout",
				"caret_start": caret_start,
				"caret_end": parser.caret,
			},
			new OpDeclareFunctionArg
			{
				"name": "model_path",
				"caret_start": caret_start,
				"caret_end": parser.caret,
			},
			new OpDeclareFunctionArg
			{
				"name": "render_params",
				"caret_start": caret_start,
				"caret_end": parser.caret,
			},
			new OpDeclareFunctionArg
			{
				"name": "render_content",
				"caret_start": caret_start,
				"caret_end": parser.caret,
			},
		];
		*/
		var fn_args = use("Runtime.Vector").from([]);
		if (item_attrs.has(ctx, "args"))
		{
			var parser2 = parser.constructor.setContent(ctx, parser, fn_args_str);
			var __v0 = use("Bayrell.Lang.Caret");
			parser2 = Runtime.rtl.setAttr(ctx, parser2, Runtime.Collection.from(["caret"]), new __v0(ctx, use("Runtime.Map").from({})));
			/* Parse args */
			var res = parser.parser_operator.constructor.readDeclareFunctionArgs(ctx, parser2, false, false);
			parser2 = Runtime.rtl.attr(ctx, res, 0);
			var fn_args2 = Runtime.rtl.attr(ctx, res, 1);
			parser2_vars = parser2.vars;
			fn_args = fn_args.concat(ctx, fn_args2);
		}
		/* If multiblock */
		var is_multiblock = false;
		if (fn_name == "render")
		{
			is_multiblock = true;
		}
		if (item_attrs.has(ctx, "multiblock"))
		{
			if (item_attrs.get(ctx, "multiblock") == "true")
			{
				is_multiblock = true;
			}
			else if (item_attrs.get(ctx, "multiblock") == "false")
			{
				is_multiblock = false;
			}
		}
		/* Register variable in parser */
		parser2_vars = parser2_vars.setIm(ctx, "layout", true).setIm(ctx, "model", true).setIm(ctx, "model_path", true).setIm(ctx, "render_params", true).setIm(ctx, "render_content", true);
		/* Read template content */
		var save_vars = parser.vars;
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), parser.vars.concat(ctx, parser2_vars));
		var res = this.readHTML(ctx, parser, "</template");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var expression = Runtime.rtl.attr(ctx, res, 1);
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["vars"]), save_vars);
		/* Read template footer */
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "/");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "template");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var __v0 = use("Bayrell.Lang.OpCodes.OpDeclareFunction");
		var __v1 = use("Bayrell.Lang.OpCodes.OpFlags");
		var f = new __v0(ctx, use("Runtime.Map").from({"args":fn_args,"vars":use("Runtime.Vector").from([]),"flags":new __v1(ctx, use("Runtime.Map").from({"p_static":false,"p_pure":false,"p_multiblock":is_multiblock})),"name":fn_name,"result_type":"html","is_html":true,"expression":expression,"items":null,"caret_start":caret_start,"caret_end":parser.caret}));
		return use("Runtime.Vector").from([parser,f]);
	},
	/**
	 * Read html attributes
	 */
	readAttrs: function(ctx, parser)
	{
		var look = null;
		var op_code = null;
		var token = null;
		var look_token = null;
		var __v0 = use("Runtime.Map");
		var items = new __v0(ctx);
		var content = parser.content;
		var content_sz = parser.content_sz;
		var caret = parser.parser_base.constructor.skipChar(ctx, parser, content, parser.caret);
		var __v1 = use("Runtime.rs");
		var ch = __v1.substr(ctx, content.ref, caret.pos, 1);
		while (ch != "/" && ch != ">" && caret.pos < content_sz)
		{
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "=");
			parser = Runtime.rtl.attr(ctx, res, 0);
			var attr_name = token.content;
			/* Look token */
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look_token = Runtime.rtl.attr(ctx, res, 1);
			if (look_token.content == "{")
			{
				var res = parser.parser_base.constructor.readDict(ctx, parser);
				parser = Runtime.rtl.attr(ctx, res, 0);
				op_code = Runtime.rtl.attr(ctx, res, 1);
				caret = parser.caret;
				items.set(ctx, attr_name, op_code);
			}
			else
			{
				var res = parser.parser_base.constructor.readString(ctx, parser);
				parser = Runtime.rtl.attr(ctx, res, 0);
				op_code = Runtime.rtl.attr(ctx, res, 1);
				items.set(ctx, attr_name, op_code.value);
			}
			caret = parser.parser_base.constructor.skipChar(ctx, parser, content, parser.caret);
			var __v2 = use("Runtime.rs");
			ch = __v2.substr(ctx, content.ref, caret.pos, 1);
			var __v3 = use("Runtime.rs");
			var ch2 = __v3.substr(ctx, content.ref, caret.pos, 2);
			if (ch2 == "/>")
			{
				break;
			}
		}
		return use("Runtime.Vector").from([parser,items.toDict(ctx)]);
	},
	/**
	 * Read item
	 */
	readWidget: function(ctx, parser)
	{
		var __v0 = use("Runtime.Map");
		var settings = new __v0(ctx);
		var __v1 = use("Runtime.Vector");
		var items = new __v1(ctx);
		/* Read item */
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "widget");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var token = null;
		var look = null;
		var caret = parser.getCaret(ctx);
		var caret_start = parser.getCaret(ctx);
		var end_tag = "</widget>";
		var __v2 = use("Runtime.rs");
		var end_tag_sz = __v2.strlen(ctx, end_tag);
		/* Skip empty chars */
		caret = parser.parser_base.constructor.skipChar(ctx, parser, parser.content, caret);
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
		/* Read next string */
		var caret = parser.getCaret(ctx);
		var next_tag = caret.nextString(ctx, end_tag_sz);
		while (next_tag != end_tag && !caret.eof(ctx))
		{
			/* Save caret */
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
			var parser_item = parser;
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
			parser = Runtime.rtl.attr(ctx, res, 0);
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			/* HTML Comment */
			if (token.content == "!--")
			{
				var res = this.readHTMLComment(ctx, parser_item);
				parser = Runtime.rtl.attr(ctx, res, 0);
			}
			else
			{
				var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
				parser = Runtime.rtl.attr(ctx, res, 0);
				var props_name = token.content;
				var props_value = "";
				/* Read widget */
				if (props_name == "widget")
				{
					var res = this.readWidget(ctx, parser_item);
					parser = Runtime.rtl.attr(ctx, res, 0);
					var item = Runtime.rtl.attr(ctx, res, 1);
					items.push(ctx, item);
				}
				else if (props_name == "style")
				{
					var res = this.readWidgetStyle(ctx, parser_item);
					parser = Runtime.rtl.attr(ctx, res, 0);
					var item = Runtime.rtl.attr(ctx, res, 1);
					items.push(ctx, item);
				}
				else
				{
					/* Get caret */
					var caret = parser.getCaret(ctx);
					/* Read content */
					var item_ch = caret.nextChar(ctx);
					while (item_ch != "<" && !caret.eof(ctx))
					{
						props_value += item_ch;
						caret.readChar(ctx);
						item_ch = caret.nextChar(ctx);
					}
					/* Save caret */
					parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
					var __v3 = use("Bayrell.Lang.OpCodes.OpString");
					settings.set(ctx, props_name, new __v3(ctx, use("Runtime.Map").from({"caret_start":caret,"caret_end":parser.caret,"value":props_value})));
					/* Read end tag */
					var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
					parser = Runtime.rtl.attr(ctx, res, 0);
					var res = parser.parser_base.constructor.matchToken(ctx, parser, "/");
					parser = Runtime.rtl.attr(ctx, res, 0);
					var res = parser.parser_base.constructor.matchToken(ctx, parser, props_name);
					parser = Runtime.rtl.attr(ctx, res, 0);
					var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
					parser = Runtime.rtl.attr(ctx, res, 0);
				}
			}
			/* Skip empty chars */
			caret = parser.parser_base.constructor.skipChar(ctx, parser, parser.content, parser.caret);
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
			/* Read next string */
			var caret = parser.getCaret(ctx);
			next_tag = caret.nextString(ctx, end_tag_sz);
		}
		/* Read item */
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "/");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "widget");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
		parser = Runtime.rtl.attr(ctx, res, 0);
		/* Create widget data */
		var __v3 = use("Bayrell.Lang.OpCodes.OpWidget");
		var op_code = new __v3(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"items":items.toCollection(ctx),"settings":settings.toDict(ctx)}));
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read widget data
	 */
	readWidgetData: function(ctx, parser)
	{
		var token = null;
		var __v0 = use("Runtime.Vector");
		var items = new __v0(ctx);
		/* Read data */
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "data");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var caret = parser.getCaret(ctx);
		var caret_start = parser.getCaret(ctx);
		var end_tag = "</data>";
		var __v1 = use("Runtime.rs");
		var end_tag_sz = __v1.strlen(ctx, end_tag);
		/* Skip empty chars */
		caret = parser.parser_base.constructor.skipChar(ctx, parser, parser.content, caret);
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
		/* Read next string */
		var caret = parser.getCaret(ctx);
		var next_tag = caret.nextString(ctx, end_tag_sz);
		while (next_tag != end_tag && !caret.eof(ctx))
		{
			/* Save caret */
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
			var parser_item = parser;
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
			parser = Runtime.rtl.attr(ctx, res, 0);
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			/* HTML Comment */
			if (token.content == "!--")
			{
				var res = this.readHTMLComment(ctx, parser_item);
				parser = Runtime.rtl.attr(ctx, res, 0);
			}
			else
			{
				var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
				parser = Runtime.rtl.attr(ctx, res, 0);
				var item_name = token.content;
				/* Read widget */
				if (item_name == "widget")
				{
					var res = this.readWidget(ctx, parser_item);
					parser = Runtime.rtl.attr(ctx, res, 0);
					var item = Runtime.rtl.attr(ctx, res, 1);
					items.push(ctx, item);
				}
				else if (item_name == "class")
				{
					var res = this.readWidgetClass(ctx, parser_item);
					parser = Runtime.rtl.attr(ctx, res, 0);
					var item = Runtime.rtl.attr(ctx, res, 1);
					items.push(ctx, item);
				}
				else
				{
					var __v2 = use("Bayrell.Lang.Exceptions.ParserError");
					throw new __v2(ctx, "Unknown identifier '" + use("Runtime.rtl").toStr(item_name) + use("Runtime.rtl").toStr("'"), parser_item.caret, parser.file_name)
				}
			}
			/* Skip empty chars */
			caret = parser.parser_base.constructor.skipChar(ctx, parser, parser.content, parser.caret);
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
			/* Read next string */
			var caret = parser.getCaret(ctx);
			next_tag = caret.nextString(ctx, end_tag_sz);
		}
		/* Read data */
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "/");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "data");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
		parser = Runtime.rtl.attr(ctx, res, 0);
		/* Create widget data */
		var __v2 = use("Bayrell.Lang.OpCodes.OpWidgetData");
		var op_code = new __v2(ctx, use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"widget":items}));
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read UI
	 */
	readUIClass: function(ctx, parser)
	{
		var __v0 = use("Runtime.Vector");
		var items = new __v0(ctx);
		var __v1 = use("Runtime.Vector");
		var components = new __v1(ctx);
		var class_caret_start = parser.caret;
		var token = null;
		var class_name = "";
		var class_extends = "";
		var class_version = "";
		var class_model = "";
		var item_name = "";
		var namespace_name = "";
		var short_name = "";
		var full_name = "";
		var is_component = "";
		var class_name_last = "";
		var __v2 = use("Runtime.Vector");
		var class_annotations = new __v2(ctx);
		/* Content */
		var content = parser.content;
		var content_sz = parser.content_sz;
		/* Read class header */
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "class");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = this.readAttrs(ctx, parser);
		parser = Runtime.rtl.attr(ctx, res, 0);
		var attrs = Runtime.rtl.attr(ctx, res, 1);
		class_name = attrs.get(ctx, "name", "");
		class_extends = attrs.get(ctx, "extends", null);
		class_version = attrs.get(ctx, "version", "1.0");
		class_model = attrs.get(ctx, "model", "Runtime.Dict");
		var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var flag_is_component = true;
		var flag_is_model = false;
		if (attrs.get(ctx, "type") == "model")
		{
			flag_is_component = false;
			flag_is_model = true;
		}
		/* Default class extends */
		if (class_extends == null)
		{
			if (flag_is_component)
			{
				class_extends = "Runtime.Web.Component";
			}
			else
			{
				class_extends = "Runtime.Web.BaseModel";
			}
		}
		var getClassShortName = (ctx, class_name) => 
		{
			var __v3 = use("Runtime.Monad");
			var __v4 = new __v3(ctx, class_name);
			var __v5 = use("Runtime.rs");
			var __v6 = (ctx, __varg0) => __v5.split(ctx, ".", __varg0);
			__v4 = __v4.call(ctx, __v6);
			__v4 = __v4.callMethod(ctx, "last", []);
			return __v4.value(ctx);
		};
		if (class_name == "Runtime.Web.Component")
		{
			class_extends = "Runtime.BaseObject";
		}
		else
		{
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["uses"]), parser.uses.setIm(ctx, getClassShortName(ctx, class_name), class_name));
		}
		if (class_extends != "" && class_extends != null)
		{
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["uses"]), parser.uses.setIm(ctx, getClassShortName(ctx, class_extends), class_extends));
			if (class_extends != "Runtime.BaseObject" && class_extends != "Runtime.Web.Component" && class_extends != "Runtime.Web.BaseModel")
			{
				components.push(ctx, class_extends);
			}
		}
		if (class_model != "" && class_model != "Runtime.Dict")
		{
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["uses"]), parser.uses.setIm(ctx, getClassShortName(ctx, class_model), class_model));
		}
		var __v3 = use("Runtime.rs");
		var class_name_arr = __v3.split(ctx, ".", class_name);
		class_name_last = class_name_arr.last(ctx);
		class_name_arr = class_name_arr.slice(ctx, 0, -1);
		var __v4 = use("Runtime.rs");
		namespace_name = __v4.join(ctx, ".", class_name_arr);
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["current_class_name"]), class_name_last);
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["current_namespace_name"]), namespace_name);
		var class_extend_op_code = null;
		if (class_extends != null)
		{
			var __v5 = use("Bayrell.Lang.OpCodes.OpTypeIdentifier");
			var __v6 = use("Bayrell.Lang.OpCodes.OpEntityName");
			var __v7 = use("Runtime.rs");
			class_extend_op_code = new __v5(ctx, use("Runtime.Map").from({"entity_name":new __v6(ctx, use("Runtime.Map").from({"caret_start":class_caret_start,"caret_end":parser.caret,"names":__v7.split(ctx, ".", class_extends)})),"template":null,"caret_start":class_caret_start,"caret_end":parser.caret}));
		}
		/* Read class body */
		var caret = parser.parser_base.constructor.skipChar(ctx, parser, content, parser.caret);
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
		var __v5 = use("Runtime.rs");
		var ch2 = __v5.substr(ctx, content.ref, caret.pos, 2);
		while (ch2 != "</" && caret.pos < content_sz)
		{
			var parser_start = parser;
			var caret_start = parser.caret;
			var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
			parser = Runtime.rtl.attr(ctx, res, 0);
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			var item_token = Runtime.rtl.attr(ctx, res, 1);
			item_name = item_token.content;
			/* Html comment */
			if (item_name == "!--")
			{
				var res = this.readHTMLComment(ctx, parser_start);
				parser = Runtime.rtl.attr(ctx, res, 0);
				items.push(ctx, Runtime.rtl.attr(ctx, res, 1));
				caret = parser.parser_base.constructor.skipChar(ctx, parser, content, parser.caret);
				var __v6 = use("Runtime.rs");
				ch2 = __v6.substr(ctx, content.ref, caret.pos, 2);
				continue;
			}
			var res = this.readAttrs(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			var item_attrs = Runtime.rtl.attr(ctx, res, 1);
			if (item_name == "annotation")
			{
				var annotation_name = item_attrs.get(ctx, "name", "");
				var annotation_op_code = item_attrs.get(ctx, "value", null);
				var __v6 = use("Bayrell.Lang.OpCodes.OpAnnotation");
				var __v7 = use("Bayrell.Lang.OpCodes.OpTypeIdentifier");
				var __v8 = use("Bayrell.Lang.OpCodes.OpEntityName");
				var __v9 = use("Runtime.rs");
				class_annotations.push(ctx, new __v6(ctx, use("Runtime.Map").from({"name":new __v7(ctx, use("Runtime.Map").from({"entity_name":new __v8(ctx, use("Runtime.Map").from({"names":__v9.split(ctx, ".", annotation_name)}))})),"params":annotation_op_code})));
			}
			else if (item_name == "use")
			{
				full_name = item_attrs.get(ctx, "name", "");
				short_name = item_attrs.get(ctx, "as", "");
				is_component = item_attrs.get(ctx, "component", "false");
				if (short_name == "")
				{
					var __v10 = use("Runtime.rs");
					short_name = __v10.split(ctx, ".", full_name).last(ctx);
				}
				parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["uses"]), parser.uses.setIm(ctx, short_name, full_name));
				if (is_component == "true" || is_component == "1")
				{
					components.push(ctx, full_name);
				}
			}
			/* Read body */
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			parser = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == ">")
			{
				if (item_name == "template")
				{
					var res = this.readHTMLTemplate(ctx, parser, item_attrs, caret_start);
					parser = Runtime.rtl.attr(ctx, res, 0);
					var op_code = Runtime.rtl.attr(ctx, res, 1);
					items.push(ctx, op_code);
				}
				else if (item_name == "style")
				{
					var res = this.readStyle(ctx, parser, item_attrs, items, caret_start);
					parser = Runtime.rtl.attr(ctx, res, 0);
					var op_code = Runtime.rtl.attr(ctx, res, 1);
					items.push(ctx, op_code);
				}
				else if (item_name == "script")
				{
					var res = parser.parser_program.constructor.readClassBody(ctx, parser, "</");
					parser = Runtime.rtl.attr(ctx, res, 0);
					var arr = Runtime.rtl.attr(ctx, res, 1);
					items.appendItems(ctx, arr);
					/* Read script footer */
					var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
					parser = Runtime.rtl.attr(ctx, res, 0);
					var res = parser.parser_base.constructor.matchToken(ctx, parser, "/");
					parser = Runtime.rtl.attr(ctx, res, 0);
					var res = parser.parser_base.constructor.matchToken(ctx, parser, "script");
					parser = Runtime.rtl.attr(ctx, res, 0);
					var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
					parser = Runtime.rtl.attr(ctx, res, 0);
				}
				else
				{
					var __v6 = use("Bayrell.Lang.Exceptions.ParserError");
					throw new __v6(ctx, "Unknown identifier '" + use("Runtime.rtl").toStr(item_name) + use("Runtime.rtl").toStr("'"), item_token.caret_start, parser.file_name)
				}
			}
			else if (token.content == "/")
			{
				var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
				parser = Runtime.rtl.attr(ctx, res, 0);
			}
			else
			{
				var __v6 = use("Bayrell.Lang.Exceptions.ParserError");
				throw new __v6(ctx, "Unknown identifier '" + use("Runtime.rtl").toStr(token.content) + use("Runtime.rtl").toStr("'"), token.caret_start, parser.file_name)
			}
			caret = parser.parser_base.constructor.skipChar(ctx, parser, content, parser.caret);
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["caret"]), caret);
			var __v6 = use("Runtime.rs");
			ch2 = __v6.substr(ctx, content.ref, caret.pos, 2);
		}
		/* Add components function */
		if (components.count(ctx) > 0)
		{
			var __v6 = use("Bayrell.Lang.OpCodes.OpDeclareFunction");
			var __v7 = use("Bayrell.Lang.OpCodes.OpFlags");
			var __v8 = use("Bayrell.Lang.OpCodes.OpCollection");
			var f = new __v6(ctx, use("Runtime.Map").from({"args":use("Runtime.Vector").from([]),"vars":use("Runtime.Vector").from([]),"flags":new __v7(ctx, use("Runtime.Map").from({"p_static":true,"p_pure":true})),"name":"components","result_type":"var","expression":new __v8(ctx, use("Runtime.Map").from({"caret_start":parser.caret,"caret_end":parser.caret,"values":components.toCollection(ctx).map(ctx, (ctx, class_name) => 
			{
				var __v9 = use("Bayrell.Lang.OpCodes.OpString");
				return new __v9(ctx, use("Runtime.Map").from({"caret_start":parser.caret,"caret_end":parser.caret,"value":class_name}));
			})})),"items":null,"caret_start":parser.caret,"caret_end":parser.caret}));
			items.push(ctx, f);
		}
		/* Read class footer */
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "<");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "/");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, "class");
		parser = Runtime.rtl.attr(ctx, res, 0);
		var res = parser.parser_base.constructor.matchToken(ctx, parser, ">");
		parser = Runtime.rtl.attr(ctx, res, 0);
		/* Analyze class body */
		var class_body = parser.parser_program.constructor.classBodyAnalyze(ctx, parser, items);
		var __v6 = use("Bayrell.Lang.OpCodes.OpNamespace");
		var __v7 = use("Bayrell.Lang.OpCodes.OpDeclareClass");
		var __v8 = use("Bayrell.Lang.OpCodes.OpDeclareClass");
		return use("Runtime.Vector").from([parser,use("Runtime.Vector").from([new __v6(ctx, use("Runtime.Map").from({"name":namespace_name})),new __v7(ctx, use("Runtime.Map").from({"kind":__v8.KIND_CLASS,"name":class_name_last,"is_static":true,"is_component":flag_is_component,"is_model":flag_is_model,"is_declare":false,"class_extends":class_extend_op_code,"class_implements":null,"annotations":use("Runtime.Vector").from([]),"template":null,"vars":class_body.item(ctx, "vars"),"annotations":class_annotations.toCollection(ctx),"functions":class_body.item(ctx, "functions"),"fn_create":class_body.item(ctx, "fn_create"),"fn_destroy":class_body.item(ctx, "fn_destroy"),"items":items,"caret_start":class_caret_start,"caret_end":parser.caret}))])]);
	},
	/**
	 * Read UI
	 */
	readUI: function(ctx, parser)
	{
		var look = null;
		var token = null;
		var __v0 = use("Runtime.Vector");
		var items = new __v0(ctx);
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["skip_comments"]), false);
		var res = parser.parser_base.constructor.readToken(ctx, parser);
		look = Runtime.rtl.attr(ctx, res, 0);
		token = Runtime.rtl.attr(ctx, res, 1);
		var caret_start = token.caret_start;
		parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["skip_comments"]), true);
		while (token.content == "<")
		{
			var parser_start = parser;
			parser = look;
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			if (token.content == "class")
			{
				var res = this.readUIClass(ctx, parser_start);
				parser = Runtime.rtl.attr(ctx, res, 0);
				items.appendItems(ctx, Runtime.rtl.attr(ctx, res, 1));
			}
			else if (token.content == "!--")
			{
				var res = this.readHTMLComment(ctx, parser_start);
				parser = Runtime.rtl.attr(ctx, res, 0);
				items.push(ctx, Runtime.rtl.attr(ctx, res, 1));
			}
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["skip_comments"]), false);
			var res = parser.parser_base.constructor.readToken(ctx, parser);
			look = Runtime.rtl.attr(ctx, res, 0);
			token = Runtime.rtl.attr(ctx, res, 1);
			parser = Runtime.rtl.setAttr(ctx, parser, Runtime.Collection.from(["skip_comments"]), true);
		}
		var __v1 = use("Bayrell.Lang.OpCodes.OpModule");
		return use("Runtime.Vector").from([parser,new __v1(ctx, use("Runtime.Map").from({"uses":parser.uses.toDict(ctx),"items":items.toCollection(ctx),"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Bayrell.Lang.LangBay";
	},
	getClassName: function()
	{
		return "Bayrell.Lang.LangBay.ParserBayHtml";
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
});use.add(Bayrell.Lang.LangBay.ParserBayHtml);
module.exports = Bayrell.Lang.LangBay.ParserBayHtml;