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
BayLang.LangBay.ParserBayHtml = function()
{
	use("Runtime.BaseObject").apply(this, arguments);
};
BayLang.LangBay.ParserBayHtml.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangBay.ParserBayHtml.prototype.constructor = BayLang.LangBay.ParserBayHtml;
Object.assign(BayLang.LangBay.ParserBayHtml.prototype,
{
});
Object.assign(BayLang.LangBay.ParserBayHtml, use("Runtime.BaseObject"));
Object.assign(BayLang.LangBay.ParserBayHtml,
{
	/**
	 * Hash function
	 * @param string
	 * @return int hash
	 */
	hash: function(s, last, x, p)
	{
		if (last == undefined) last = true;
		if (x == undefined) x = 257;
		if (p == undefined) p = 1000000007;
		var h = 0;
		var __v0 = use("Runtime.rs");
		var sz = __v0.strlen(s);
		for (var i = 0; i < sz; i++)
		{
			var __v1 = use("Runtime.rs");
			var __v2 = use("Runtime.rs");
			var ch = __v1.ord(__v2.substr(s, i, 1));
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
	toHex: function(h)
	{
		var r = "";
		var a = "0123456789abcdef";
		while (h >= 0)
		{
			var c = h & 15;
			h = h >> 4;
			var __v0 = use("Runtime.rs");
			r = __v0.substr(a, c, 1) + use("Runtime.rtl").toStr(r);
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
	getCssHash: function(s)
	{
		var __memorize_value = use("Runtime.rtl")._memorizeValue("BayLang.LangBay.ParserBayHtml.getCssHash", arguments);
		if (__memorize_value != use("Runtime.rtl")._memorize_not_found) return __memorize_value;
		var h = this.hash(s, true, 337, 65537) + 65537;
		var res = this.toHex(h);
		var __v0 = use("Runtime.rs");
		var __memorize_value = __v0.substr(res, -4);
		use("Runtime.rtl")._memorizeSave("BayLang.LangBay.ParserBayHtml.getCssHash", arguments, __memorize_value);
		return __memorize_value;
	},
	/**
	 * Read css component name
	 */
	readCssComponentName: function(parser)
	{
		var flag = false;
		var class_name = "";
		/* Get caret */
		var caret = parser.getCaret();
		/* Read char */
		var ch = caret.nextChar();
		if (ch == "(")
		{
			flag = true;
			/* Read ( */
			caret.readChar();
			/* Next char */
			ch = caret.nextChar();
			/* Read class name */
			var start_pos = caret.pos;
			while (!caret.eof() && ch != ")")
			{
				caret.readChar();
				ch = caret.nextChar();
			}
			class_name = caret.getString(start_pos, caret.pos - start_pos);
			/* Recognize class name */
			if (parser.uses.has(class_name))
			{
				class_name = parser.uses.item(class_name);
			}
			/* Read ) */
			caret.matchChar(")");
		}
		parser = parser.copy(use("Runtime.Map").from({"caret":caret}));
		return use("Runtime.Vector").from([parser,class_name,flag]);
	},
	/**
	 * Read css class name
	 */
	readCssClassName: function(parser, default_component_name)
	{
		if (default_component_name == undefined) default_component_name = true;
		/* Get caret */
		var caret = parser.getCaret();
		/* Component name */
		var use_component_name = default_component_name;
		var component_name = parser.current_namespace_name + use("Runtime.rtl").toStr(".") + use("Runtime.rtl").toStr(parser.current_class_name);
		/* Read start selector */
		var start_ch = caret.nextChar();
		if (start_ch == "." || start_ch == "%")
		{
			caret.readChar();
		}
		else if (start_ch == "&")
		{
			caret.readChar();
			use_component_name = false;
		}
		else if (start_ch == "#" || start_ch == ":")
		{
			caret.readChar();
			if (start_ch == ":")
			{
				use_component_name = false;
			}
		}
		else if (start_ch == "*")
		{
			caret.readChar();
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
			return use("Runtime.Vector").from([parser,"*"]);
		}
		else
		{
			start_ch = "";
			use_component_name = false;
		}
		/* Save caret */
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
		/* Read class name */
		if (start_ch == "%")
		{
			start_ch = ".";
			var res = this.readCssComponentName(parser);
			parser = Runtime.rtl.attr(res, 0);
			if (Runtime.rtl.attr(res, 2) != "")
			{
				component_name = Runtime.rtl.attr(res, 1);
				use_component_name = true;
			}
		}
		/* Start position */
		caret = parser.getCaret();
		var start_pos = caret.pos;
		/* Read selector */
		var ch = caret.nextChar();
		while (!caret.eof() && ch != " " && ch != "," && ch != ":" && ch != "[" && ch != "{")
		{
			caret.readChar();
			ch = caret.nextChar();
		}
		var postfix = caret.getString(start_pos, caret.pos - start_pos);
		var __v0 = use("Runtime.rs");
		postfix = __v0.trim(postfix);
		/* Read suffix */
		var start_pos = caret.pos;
		while (!caret.eof() && ch != " " && ch != "," && ch != "." && ch != "{")
		{
			caret.readChar();
			ch = caret.nextChar();
		}
		var suffix = caret.getString(start_pos, caret.pos - start_pos);
		var __v1 = use("Runtime.rs");
		suffix = __v1.trim(suffix);
		var class_name = start_ch + use("Runtime.rtl").toStr(postfix) + use("Runtime.rtl").toStr(((use_component_name) ? (".h-" + use("Runtime.rtl").toStr(this.getCssHash(component_name))) : (""))) + use("Runtime.rtl").toStr(suffix);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
		return use("Runtime.Vector").from([parser,class_name]);
	},
	/**
	 * Read css selector
	 */
	readCssSelector: function(parser, default_component_name)
	{
		if (default_component_name == undefined) default_component_name = true;
		/* Get caret */
		var caret = parser.getCaret();
		var __v0 = use("Runtime.Vector");
		var selectors = new __v0();
		while (!caret.eof())
		{
			var res = this.readCssClassName(parser, default_component_name);
			parser = Runtime.rtl.attr(res, 0);
			var selector = Runtime.rtl.attr(res, 1);
			default_component_name = false;
			selectors.push(selector);
			/* Skip empty chars */
			var caret = parser.parser_base.constructor.skipChar(parser, parser.content, parser.caret);
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
			/* Get caret */
			caret = parser.caret.clone(use("Runtime.Map").from({"file_name":parser.file_name,"content":parser.content,"content_sz":parser.content_sz}));
			var ch = caret.nextChar();
			if (ch == "{" || ch == "}" || ch == "<" || ch == ",")
			{
				break;
			}
		}
		var __v1 = use("Runtime.rs");
		var selector = __v1.join(" ", selectors);
		return use("Runtime.Vector").from([parser,selector]);
	},
	/**
	 * Concat op_code_item with selector
	 */
	readCssBodyConcatItem: function(caret_start, caret_end, selector, op_code_item)
	{
		var __v0 = use("BayLang.OpCodes.OpString");
		if (op_code_item instanceof __v0)
		{
			var __v1 = use("BayLang.OpCodes.OpString");
			op_code_item = new __v1(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":caret_end,"value":op_code_item.value + use("Runtime.rtl").toStr("}")}));
		}
		else
		{
			var __v2 = use("BayLang.OpCodes.OpMath");
			var __v3 = use("BayLang.OpCodes.OpString");
			op_code_item = new __v2(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":caret_end,"value1":op_code_item,"value2":new __v3(use("Runtime.Map").from({"value":"}"})),"math":"~"}));
		}
		var __v4 = use("BayLang.OpCodes.OpString");
		if (op_code_item instanceof __v4)
		{
			var __v5 = use("BayLang.OpCodes.OpString");
			op_code_item = new __v5(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":caret_end,"value":selector + use("Runtime.rtl").toStr("{") + use("Runtime.rtl").toStr(op_code_item.value)}));
		}
		else
		{
			var __v6 = use("BayLang.OpCodes.OpMath");
			var __v7 = use("BayLang.OpCodes.OpString");
			op_code_item = new __v6(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":caret_end,"value1":new __v7(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":caret_end,"value":selector + use("Runtime.rtl").toStr("{")})),"value2":op_code_item,"math":"~"}));
		}
		return op_code_item;
	},
	/**
	 * Returns true if next string is css selector
	 */
	isNextSelector: function(caret)
	{
		caret = caret.clone();
		var ch = caret.nextChar();
		if (ch == "@" || ch == "%" || ch == "&" || ch == "." || ch == ":" || ch == "#" || ch == "*")
		{
			return true;
		}
		if (!caret.constructor.isChar(ch))
		{
			return false;
		}
		while (!caret.eof() && ch != "{" && ch != "}" && ch != "<")
		{
			if (ch == ";" || ch == "(" || ch == ")" || ch == "$")
			{
				return false;
			}
			caret.nextChar();
			ch = caret.readChar();
		}
		if (ch == "{")
		{
			return true;
		}
		return false;
	},
	/**
	 * Split selector by dot
	 */
	splitSelector: function(selector)
	{
		var __v0 = use("Runtime.rs");
		var arr1 = __v0.split(" ", selector);
		var __v1 = use("Runtime.rs");
		var prefix = __v1.join(" ", arr1.slice(0, -1));
		if (prefix != "")
		{
			prefix = prefix + use("Runtime.rtl").toStr(" ");
		}
		var __v2 = use("Runtime.rs");
		var arr2 = __v2.split(".", arr1.last());
		var first = "";
		var second = "";
		if (arr2.get(0) == "")
		{
			first = "." + use("Runtime.rtl").toStr(arr2.get(1));
			var __v3 = use("Runtime.rs");
			second = __v3.join(".", arr2.slice(2));
		}
		else
		{
			first = arr2.get(0);
			var __v4 = use("Runtime.rs");
			second = __v4.join(".", arr2.slice(1));
		}
		if (second != "")
		{
			second = "." + use("Runtime.rtl").toStr(second);
		}
		return use("Runtime.Vector").from([prefix + use("Runtime.rtl").toStr(first),second]);
	},
	/**
	 * Concat selectors
	 */
	concatSelectors: function(prev_selector, selector)
	{
		if (prev_selector == "")
		{
			return selector;
		}
		/* If first symbol is & */
		var __v0 = use("Runtime.rs");
		if (__v0.charAt(selector, 0) == "&")
		{
			var res = this.splitSelector(prev_selector);
			var __v1 = use("Runtime.rs");
			return res.get(0) + use("Runtime.rtl").toStr(__v1.substr(selector, 1)) + use("Runtime.rtl").toStr(res.get(1));
		}
		return prev_selector + use("Runtime.rtl").toStr(" ") + use("Runtime.rtl").toStr(selector);
	},
	/**
	 * Get selectors from collection
	 */
	getSelectors: function(start_selectors)
	{
		var result = use("Runtime.Vector").from([""]);
		for (var i = 0; i < start_selectors.count(); i++)
		{
			var prev_result = result;
			result = use("Runtime.Vector").from([]);
			var items = start_selectors.get(i);
			for (var j = 0; j < prev_result.count(); j++)
			{
				var prev_selector = prev_result.get(j);
				for (var k = 0; k < items.count(); k++)
				{
					var selector = items.get(k);
					result.push(this.concatSelectors(prev_selector, selector));
				}
			}
		}
		return result;
	},
	/**
	 * Read css body
	 */
	readCssBodyItems: function(parser, items, start_selectors, end_tag, default_component_name)
	{
		var css_content = use("Runtime.Vector").from([]);
		var sub_items = use("Runtime.Vector").from([]);
		/* Get caret */
		var caret_start = parser.getCaret();
		/* Skip empty chars */
		var caret = parser.parser_base.constructor.skipChar(parser, parser.content, parser.caret);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
		caret = parser.getCaret();
		var op_code = null;
		while (!caret.eof() && caret.nextChar() != end_tag && caret.nextChar() != "}")
		{
			var op_code_item = null;
			/* Read media css */
			if (caret.isNextString("@media"))
			{
				/* Read selector */
				var __v0 = use("Runtime.Vector");
				var arr = new __v0();
				var ch = caret.nextChar();
				while (!caret.eof() && ch != "{")
				{
					if (ch != "\t" && ch != "\n")
					{
						arr.push(ch);
					}
					caret.readChar();
					ch = caret.nextChar();
				}
				var __v1 = use("Runtime.rs");
				var __v2 = use("Runtime.rs");
				var media_selector = __v1.trim(__v2.join("", arr));
				/* Setup caret */
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
				var caret_start_item2 = parser.getCaret();
				/* Read body */
				var __v3 = use("Runtime.Vector");
				var new_items = new __v3();
				var res = parser.parser_base.constructor.matchToken(parser, "{");
				parser = Runtime.rtl.attr(res, 0);
				parser = this.readCssBodyItems(parser, new_items, start_selectors, "}", default_component_name);
				var res = parser.parser_base.constructor.matchToken(parser, "}");
				parser = Runtime.rtl.attr(res, 0);
				/* Items */
				for (var i = 0; i < new_items.count(); i++)
				{
					var item = new_items.get(i);
					item = this.readCssBodyConcatItem(item.caret_start, item.caret_end, media_selector, item);
					sub_items.push(item);
				}
				/* Get caret */
				caret = parser.getCaret();
			}
			else if (this.isNextSelector(caret))
			{
				var selectors = use("Runtime.Vector").from([]);
				/* Read css selector */
				while (this.isNextSelector(caret))
				{
					parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
					var res = this.readCssSelector(parser, default_component_name);
					parser = Runtime.rtl.attr(res, 0);
					selectors.push(Runtime.rtl.attr(res, 1));
					caret = parser.getCaret();
					if (caret.isNextChar(","))
					{
						caret.readChar();
						caret.skipSpace();
					}
				}
				/* Setup caret */
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
				var caret_start_item2 = parser.getCaret();
				/* Read body */
				var res = parser.parser_base.constructor.matchToken(parser, "{");
				parser = Runtime.rtl.attr(res, 0);
				parser = this.readCssBodyItems(parser, sub_items, start_selectors.pushIm(selectors), "}", default_component_name);
				var res = parser.parser_base.constructor.matchToken(parser, "}");
				parser = Runtime.rtl.attr(res, 0);
				/* Get caret */
				caret = parser.getCaret();
			}
			else
			{
				var __v4 = use("Runtime.Vector");
				var arr = new __v4();
				var ch = caret.nextChar();
				var ch2 = caret.nextString(2);
				while (!caret.eof() && ch != "}" && ch != ";")
				{
					if (ch2 == "${")
					{
						/* Save caret */
						caret.matchString("${");
						parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
						/* Read expression */
						var res = parser.parser_expression.constructor.readExpression(parser);
						parser = Runtime.rtl.attr(res, 0);
						/* Append to css content */
						if (arr.count() != 0)
						{
							var __v5 = use("Runtime.rs");
							css_content.push(__v5.join("", arr));
						}
						css_content.push(Runtime.rtl.attr(res, 1));
						arr = use("Runtime.Vector").from([]);
						/* Restore caret */
						caret = parser.getCaret();
						caret.skipSpace();
						caret.matchChar("}");
					}
					else
					{
						if (ch != "\t" && ch != "\n")
						{
							arr.push(ch);
						}
						caret.readChar();
					}
					ch = caret.nextChar();
					ch2 = caret.nextString(2);
				}
				/* Skip semicolon */
				if (caret.skipChar(";"))
				{
					arr.push(";");
				}
				var __v6 = use("Runtime.rs");
				var __v7 = use("Runtime.rs");
				var s = __v6.trim(__v7.join("", arr));
				css_content.push(s);
				/* Setup caret */
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
			}
			/* Skip empty chars */
			caret = parser.parser_base.constructor.skipChar(parser, parser.content, caret);
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
			caret = parser.getCaret();
		}
		/* Add CSS content to items */
		if (css_content.count() > 0)
		{
			/* Filter css content */
			css_content = css_content.filter((item) =>
			{
				return item != "";
			});
			/* Remove last semicolon */
			var __v8 = use("Runtime.rtl");
			if (css_content.count() > 0 && __v8.isString(css_content.last()))
			{
				var item = css_content.last();
				var __v9 = use("Runtime.rs");
				if (__v9.substr(item, -1) == ";")
				{
					var __v10 = use("Runtime.rs");
					item = __v10.substr(item, 0, -1);
				}
				css_content.set(css_content.count() - 1, item);
			}
			/* Extend op code */
			var extendItem = (op_code_item, arr) =>
			{
				if (arr.count() > 0)
				{
					var __v11 = use("BayLang.OpCodes.OpString");
					var __v12 = use("Runtime.rs");
					var css_str_op_code = new __v11(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.getCaret(),"value":__v12.join("", arr)}));
					if (op_code_item != null)
					{
						var __v13 = use("BayLang.OpCodes.OpMath");
						op_code_item = new __v13(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.getCaret(),"value1":op_code_item,"value2":css_str_op_code,"math":"~"}));
					}
					else
					{
						op_code_item = css_str_op_code;
					}
				}
				return op_code_item;
			};
			/* Init arr */
			var __v11 = use("Runtime.Vector");
			var arr = new __v11();
			var selectors = this.getSelectors(start_selectors);
			var __v12 = use("Runtime.rs");
			arr.push(__v12.join(",", selectors) + use("Runtime.rtl").toStr("{"));
			/* Build op_code_item */
			var op_code_item = null;
			for (var i = 0; i < css_content.count(); i++)
			{
				var item = css_content.get(i);
				var __v13 = use("Runtime.rtl");
				if (__v13.isString(item))
				{
					arr.push(item);
				}
				else
				{
					op_code_item = extendItem(op_code_item, arr);
					if (op_code_item != null)
					{
						var __v14 = use("BayLang.OpCodes.OpMath");
						op_code_item = new __v14(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.getCaret(),"value1":op_code_item,"value2":item,"math":"~"}));
					}
					else
					{
						op_code_item = item;
					}
					arr = use("Runtime.Vector").from([]);
				}
			}
			/* Add close bracket */
			arr.push("}");
			/* Extend op_code */
			op_code_item = extendItem(op_code_item, arr);
			/* Append op_code */
			items.push(op_code_item);
		}
		/* Add sub items */
		items.appendItems(sub_items);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
		return parser;
	},
	/**
	 * Read css body
	 */
	readCssBody: function(parser, end_tag, default_component_name)
	{
		if (end_tag == undefined) end_tag = "}";
		if (default_component_name == undefined) default_component_name = true;
		/* Get caret */
		var caret_start = parser.getCaret();
		var op_code = null;
		var __v0 = use("Runtime.Vector");
		var items = new __v0();
		/* Read items */
		parser = this.readCssBodyItems(parser, items, use("Runtime.Vector").from([]), end_tag, default_component_name);
		for (var i = 0; i < items.count(); i++)
		{
			var op_code_item = items.get(i);
			if (op_code == null)
			{
				op_code = op_code_item;
			}
			else
			{
				var __v1 = use("BayLang.OpCodes.OpString");
				var __v2 = use("BayLang.OpCodes.OpString");
				if (op_code instanceof __v1 && op_code_item instanceof __v2)
				{
					var __v3 = use("BayLang.OpCodes.OpString");
					op_code = new __v3(use("Runtime.Map").from({"caret_start":op_code.caret_start,"caret_end":op_code_item.caret_end,"value":op_code.value + use("Runtime.rtl").toStr(op_code_item.value)}));
				}
				else
				{
					var __v4 = use("BayLang.OpCodes.OpMath");
					op_code = new __v4(use("Runtime.Map").from({"caret_start":op_code.caret_start,"caret_end":op_code_item.caret_end,"value1":op_code,"value2":op_code_item,"math":"~"}));
				}
			}
		}
		if (op_code == null)
		{
			var __v5 = use("BayLang.OpCodes.OpString");
			op_code = new __v5(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"value":""}));
		}
		op_code = Runtime.rtl.setAttr(op_code, Runtime.Collection.from(["caret_start"]), caret_start);
		op_code = Runtime.rtl.setAttr(op_code, Runtime.Collection.from(["caret_end"]), parser.caret);
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read css
	 */
	readCss: function(parser)
	{
		var caret_start = parser.caret;
		var res = parser.parser_base.constructor.matchToken(parser, "@css");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, "{");
		parser = Runtime.rtl.attr(res, 0);
		var res = this.readCssBody(parser);
		parser = Runtime.rtl.attr(res, 0);
		var op_code = Runtime.rtl.attr(res, 1);
		var res = parser.parser_base.constructor.matchToken(parser, "}");
		parser = Runtime.rtl.attr(res, 0);
		if (op_code == null)
		{
			var __v0 = use("BayLang.OpCodes.OpString");
			op_code = new __v0(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"value":""}));
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read style
	 */
	readStyle: function(parser, item_attrs, items, caret_start)
	{
		/* Save vars */
		var save_vars = parser.vars;
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["vars"]), parser.vars.setIm("vars", true));
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["is_local_css"]), true);
		/* Check if local css */
		var is_global = item_attrs.get("global", "");
		if (is_global == "true")
		{
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["is_local_css"]), false);
		}
		/* Read css */
		var res = this.readCssBody(parser, "<", parser.is_local_css);
		parser = Runtime.rtl.attr(res, 0);
		var css_op_code = Runtime.rtl.attr(res, 1);
		/* Restore vars */
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["vars"]), save_vars);
		/* Read style footer */
		var res = parser.parser_base.constructor.matchToken(parser, "<");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, "/");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, "style");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, ">");
		parser = Runtime.rtl.attr(res, 0);
		/* Get style content */
		var start_pos = css_op_code.caret_start.pos;
		var end_pos = css_op_code.caret_end.pos;
		var __v0 = use("Runtime.rs");
		var __v1 = use("Runtime.rs");
		var style_content = __v0.trim(__v1.substr(parser.content.ref, start_pos, end_pos - start_pos));
		/* Create op code */
		var __v2 = use("BayLang.OpCodes.OpHtmlStyle");
		var op_code = new __v2(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"content":style_content,"is_global":is_global,"value":css_op_code}));
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read html comment
	 */
	readHTMLComment: function(parser)
	{
		var start = parser;
		var token = null;
		var look = null;
		var caret_start = parser.caret;
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), false);
		var res = parser.parser_base.constructor.matchToken(parser, "<");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, "!--");
		parser = Runtime.rtl.attr(res, 0);
		var content = parser.content;
		var content_sz = parser.content_sz;
		var pos = parser.caret.pos;
		var x = parser.caret.x;
		var y = parser.caret.y;
		var pos_start = pos;
		var __v0 = use("Runtime.rs");
		var ch = __v0.charAt(content.ref, pos);
		var __v1 = use("Runtime.rs");
		var ch3 = __v1.substr(content.ref, pos, 3);
		while (ch3 != "-->" && pos < content_sz)
		{
			x = parser.parser_base.constructor.nextX(parser, ch, x);
			y = parser.parser_base.constructor.nextY(parser, ch, y);
			pos = pos + 1;
			if (pos >= parser.content_sz)
			{
				break;
			}
			var __v2 = use("Runtime.rs");
			ch = __v2.charAt(content.ref, pos);
			var __v3 = use("Runtime.rs");
			ch3 = __v3.substr(content.ref, pos, 3);
		}
		var pos_end = pos;
		if (ch3 == "-->")
		{
			x = x + 3;
			pos = pos + 3;
		}
		else
		{
			var __v4 = use("BayLang.Exceptions.ParserExpected");
			var __v5 = use("BayLang.Caret");
			throw new __v4("End of comment", new __v5(use("Runtime.Map").from({"x":x,"y":y,"pos":pos})), start.file_name)
		}
		/* Return result */
		var __v6 = use("Runtime.rs");
		var value_str = __v6.substr(content.ref, pos_start, pos_end - pos_start);
		var __v7 = use("BayLang.Caret");
		var caret_end = new __v7(use("Runtime.Map").from({"x":x,"y":y,"pos":pos}));
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), true);
		var __v8 = use("BayLang.OpCodes.OpComment");
		return use("Runtime.Vector").from([start.copy(use("Runtime.Map").from({"caret":caret_end})),new __v8(use("Runtime.Map").from({"value":value_str,"caret_start":caret_start,"caret_end":caret_end}))]);
		return use("Runtime.Vector").from([parser,null]);
	},
	/**
	 * Read html value
	 */
	readHTMLValue: function(parser)
	{
		var item = null;
		var caret = parser.caret;
		var content = parser.content;
		var pos = parser.caret.pos;
		var x = parser.caret.x;
		var y = parser.caret.y;
		var __v0 = use("Runtime.rs");
		var ch = __v0.substr(content.ref, pos, 1);
		var __v1 = use("Runtime.rs");
		var ch2 = __v1.substr(content.ref, pos, 2);
		if (ch == "<")
		{
			var res = this.readHTMLTag(parser);
			parser = Runtime.rtl.attr(res, 0);
			item = Runtime.rtl.attr(res, 1);
		}
		else if (ch == "{")
		{
			var res = parser.parser_base.constructor.matchToken(parser, "{");
			parser = Runtime.rtl.attr(res, 0);
			/* Look token */
			var flag = false;
			var res = parser.parser_base.constructor.readToken(parser);
			var look = Runtime.rtl.attr(res, 0);
			var token = Runtime.rtl.attr(res, 1);
			if (token.content == "{")
			{
				flag = true;
				parser = look;
			}
			var res = parser.parser_expression.constructor.readExpression(parser);
			parser = Runtime.rtl.attr(res, 0);
			item = Runtime.rtl.attr(res, 1);
			var res = parser.parser_base.constructor.matchToken(parser, "}");
			parser = Runtime.rtl.attr(res, 0);
			if (flag)
			{
				var res = parser.parser_base.constructor.matchToken(parser, "}");
				parser = Runtime.rtl.attr(res, 0);
			}
		}
		else if (ch == "@")
		{
			x = parser.parser_base.constructor.nextX(parser, ch, x);
			y = parser.parser_base.constructor.nextY(parser, ch, y);
			pos = pos + 1;
			var __v2 = use("Runtime.rs");
			var ch3 = __v2.substr(content.ref, pos, 3);
			var __v3 = use("Runtime.rs");
			var ch4 = __v3.substr(content.ref, pos, 4);
			if (ch3 == "raw" || ch4 == "json" || ch4 == "html")
			{
				var res;
				if (ch3 == "raw")
				{
					res = parser.parser_base.constructor.next(parser, ch3, x, y, pos);
				}
				if (ch4 == "json")
				{
					res = parser.parser_base.constructor.next(parser, ch4, x, y, pos);
				}
				if (ch4 == "html")
				{
					res = parser.parser_base.constructor.next(parser, ch4, x, y, pos);
				}
				x = Runtime.rtl.attr(res, 0);
				y = Runtime.rtl.attr(res, 1);
				pos = Runtime.rtl.attr(res, 2);
			}
			var __v4 = use("BayLang.Caret");
			caret = new __v4(use("Runtime.Map").from({"x":x,"y":y,"pos":pos}));
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
			var res = parser.parser_base.constructor.matchToken(parser, "{");
			parser = Runtime.rtl.attr(res, 0);
			/* Look bracket */
			var res = parser.parser_base.constructor.lookToken(parser, "{");
			var look = Runtime.rtl.attr(res, 0);
			var find_bracket = Runtime.rtl.attr(res, 2);
			if (find_bracket)
			{
				parser = look;
			}
			var res = parser.parser_expression.constructor.readExpression(parser);
			parser = Runtime.rtl.attr(res, 0);
			item = Runtime.rtl.attr(res, 1);
			if (ch3 == "raw")
			{
				var __v5 = use("BayLang.OpCodes.OpHtmlValue");
				var __v6 = use("BayLang.OpCodes.OpHtmlValue");
				item = new __v5(use("Runtime.Map").from({"kind":__v6.KIND_RAW,"value":item,"caret_start":caret,"caret_end":parser.caret}));
			}
			else if (ch4 == "json")
			{
				var __v7 = use("BayLang.OpCodes.OpHtmlValue");
				var __v8 = use("BayLang.OpCodes.OpHtmlValue");
				item = new __v7(use("Runtime.Map").from({"kind":__v8.KIND_JSON,"value":item,"caret_start":caret,"caret_end":parser.caret}));
			}
			else if (ch4 == "html")
			{
				var __v9 = use("BayLang.OpCodes.OpHtmlValue");
				var __v10 = use("BayLang.OpCodes.OpHtmlValue");
				item = new __v9(use("Runtime.Map").from({"kind":__v10.KIND_HTML,"value":item,"caret_start":caret,"caret_end":parser.caret}));
			}
			var res = parser.parser_base.constructor.matchToken(parser, "}");
			parser = Runtime.rtl.attr(res, 0);
			if (find_bracket)
			{
				var res = parser.parser_base.constructor.matchToken(parser, "}");
				parser = Runtime.rtl.attr(res, 0);
			}
		}
		return use("Runtime.Vector").from([parser,item]);
	},
	/**
	 * Read html attribute key
	 */
	readHTMLAttrKey: function(parser)
	{
		var token = null;
		var look = null;
		var ident = null;
		var key = "";
		/* Look token */
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "@")
		{
			parser = look;
			key = "@";
		}
		var res = parser.parser_base.constructor.readIdentifier(parser);
		parser = Runtime.rtl.attr(res, 0);
		ident = Runtime.rtl.attr(res, 1);
		key += use("Runtime.rtl").toStr(ident.value);
		/* Read attr */
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		while (token.content == "-")
		{
			var res = parser.parser_base.constructor.readIdentifier(look);
			parser = Runtime.rtl.attr(res, 0);
			ident = Runtime.rtl.attr(res, 1);
			key += use("Runtime.rtl").toStr("-" + use("Runtime.rtl").toStr(ident.value));
			/* Look next token */
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
		}
		/* Look token */
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == ":")
		{
			parser = look;
			key += use("Runtime.rtl").toStr(":");
			var res = parser.parser_base.constructor.readIdentifier(parser);
			parser = Runtime.rtl.attr(res, 0);
			ident = Runtime.rtl.attr(res, 1);
			key += use("Runtime.rtl").toStr(ident.value);
		}
		return use("Runtime.Vector").from([parser,key]);
	},
	/**
	 * Read html attribute value
	 */
	readHTMLAttrValue: function(parser, attr_key)
	{
		var token = null;
		var look = null;
		var op_code = null;
		var ident = null;
		var pos = parser.caret.pos;
		var content = parser.content;
		var __v0 = use("Runtime.rs");
		var ch = __v0.substr(content.ref, pos, 1);
		var __v1 = use("Runtime.rs");
		var ch2 = __v1.substr(content.ref, pos, 2);
		/* Look token */
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var __v2 = use("Runtime.rs");
		if (__v2.substr(attr_key, 0, 7) == "@event:")
		{
			/* Look token */
			var res = parser.parser_base.constructor.lookToken(parser, "{");
			var look = Runtime.rtl.attr(res, 0);
			var token = Runtime.rtl.attr(res, 1);
			var is_fn = Runtime.rtl.attr(res, 2);
			if (is_fn)
			{
				var res = parser.parser_base.constructor.matchToken(parser, "{");
				parser = Runtime.rtl.attr(res, 0);
				/* Look token */
				var res = parser.parser_base.constructor.lookToken(parser, "{");
				var look = Runtime.rtl.attr(res, 0);
				var token = Runtime.rtl.attr(res, 1);
				var find = Runtime.rtl.attr(res, 2);
				if (find)
				{
					parser = look;
				}
				/* Add msg to vars */
				var parser_vars = parser.vars;
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["vars"]), parser.vars.concat(use("Runtime.Map").from({"component":true,"msg":true})));
				/* Read expression */
				var res = parser.parser_expression.constructor.readExpression(parser);
				parser = Runtime.rtl.attr(res, 0);
				op_code = Runtime.rtl.attr(res, 1);
				/* Restore vars */
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["vars"]), parser_vars);
				/* Parse brackets */
				var res = parser.parser_base.constructor.matchToken(parser, "}");
				parser = Runtime.rtl.attr(res, 0);
				if (find)
				{
					var res = parser.parser_base.constructor.matchToken(parser, "}");
					parser = Runtime.rtl.attr(res, 0);
				}
			}
			else
			{
				var res = parser.parser_base.constructor.readString(parser);
				parser = Runtime.rtl.attr(res, 0);
				op_code = Runtime.rtl.attr(res, 1);
			}
		}
		else if (ch == "{")
		{
			var res = parser.parser_base.constructor.matchToken(parser, "{");
			parser = Runtime.rtl.attr(res, 0);
			/* Look token */
			var res = parser.parser_base.constructor.lookToken(parser, "{");
			var look = Runtime.rtl.attr(res, 0);
			var token = Runtime.rtl.attr(res, 1);
			var find = Runtime.rtl.attr(res, 2);
			if (find)
			{
				parser = look;
			}
			var res = parser.parser_expression.constructor.readExpression(parser);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
			var res = parser.parser_base.constructor.matchToken(parser, "}");
			parser = Runtime.rtl.attr(res, 0);
			if (find)
			{
				var res = parser.parser_base.constructor.matchToken(parser, "}");
				parser = Runtime.rtl.attr(res, 0);
			}
		}
		else if (token.content == "@")
		{
			var res = this.readHTMLValue(parser);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
		}
		else if (token.content == "[")
		{
			var res = parser.parser_base.constructor.readCollection(parser);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
		}
		else
		{
			var res = parser.parser_base.constructor.readString(parser);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read html attributes
	 */
	readHTMLAttrs: function(parser)
	{
		var __v0 = use("Runtime.Vector");
		var items = new __v0();
		var token = null;
		var look = null;
		var content = parser.content;
		var content_sz = parser.content_sz;
		var caret = parser.parser_base.constructor.skipChar(parser, content, parser.caret);
		var __v1 = use("Runtime.rs");
		var ch = __v1.substr(content.ref, caret.pos, 1);
		while (ch != "/" && ch != ">" && caret.pos < content_sz)
		{
			var caret_start = caret;
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			if (token.content == "...")
			{
				var ident = null;
				var res = parser.parser_base.constructor.matchToken(parser, "...");
				parser = Runtime.rtl.attr(res, 0);
				var res = parser.parser_base.constructor.readIdentifier(look);
				parser = Runtime.rtl.attr(res, 0);
				ident = Runtime.rtl.attr(res, 1);
				var __v2 = use("BayLang.OpCodes.OpHtmlAttribute");
				items.push(new __v2(use("Runtime.Map").from({"value":ident,"is_spread":true,"caret_start":caret_start,"caret_end":parser.caret})));
			}
			else
			{
				var res = this.readHTMLAttrKey(parser);
				parser = Runtime.rtl.attr(res, 0);
				var key = Runtime.rtl.attr(res, 1);
				var res = parser.parser_base.constructor.matchToken(parser, "=");
				parser = Runtime.rtl.attr(res, 0);
				var res = this.readHTMLAttrValue(parser, key);
				parser = Runtime.rtl.attr(res, 0);
				var value = Runtime.rtl.attr(res, 1);
				var __v3 = use("BayLang.OpCodes.OpHtmlAttribute");
				items.push(new __v3(use("Runtime.Map").from({"key":key,"value":value,"caret_start":caret_start,"caret_end":parser.caret})));
			}
			caret = parser.parser_base.constructor.skipChar(parser, content, parser.caret);
			var __v4 = use("Runtime.rs");
			ch = __v4.substr(content.ref, caret.pos, 1);
			var __v5 = use("Runtime.rs");
			var ch2 = __v5.substr(content.ref, caret.pos, 2);
			if (ch2 == "/>")
			{
				break;
			}
		}
		return use("Runtime.Vector").from([parser,items]);
	},
	/**
	 * Read html template
	 */
	readHTMLContent: function(parser, end_tag)
	{
		var __v0 = use("Runtime.Vector");
		var items = new __v0();
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
		var end_tag_sz = __v1.strlen(end_tag);
		var __v2 = use("Runtime.rs");
		var ch_pos = __v2.substr(content.ref, pos, end_tag_sz);
		var flag_first = true;
		var first_html_tag = false;
		if (end_tag == "")
		{
			first_html_tag = true;
		}
		while ((end_tag == "" || end_tag != "" && ch_pos != end_tag) && pos < content_sz)
		{
			var __v3 = use("Runtime.rs");
			var ch = __v3.substr(content.ref, pos, 1);
			var __v4 = use("Runtime.rs");
			var ch2 = __v4.substr(content.ref, pos, 2);
			var __v5 = use("Runtime.rs");
			var ch3 = __v5.substr(content.ref, pos, 3);
			var __v6 = use("Runtime.rs");
			var ch4 = __v6.substr(content.ref, pos, 4);
			var __v7 = use("Runtime.rs");
			var ch6 = __v7.substr(content.ref, pos, 6);
			var __v8 = use("Runtime.rs");
			var ch7 = __v8.substr(content.ref, pos, 7);
			/* Html comment */
			if (ch4 == "<!--")
			{
				var __v9 = use("Runtime.rs");
				var value = __v9.substr(content.ref, start_pos, pos - start_pos);
				var __v10 = use("BayLang.Caret");
				caret = new __v10(use("Runtime.Map").from({"x":x,"y":y,"pos":pos}));
				var __v11 = use("Runtime.rs");
				value = __v11.trim(value, "\t\r\n");
				var __v12 = use("Runtime.rs");
				value = __v12.trim(value, " ");
				if (value != "")
				{
					var __v13 = use("BayLang.OpCodes.OpHtmlContent");
					item = new __v13(use("Runtime.Map").from({"value":value,"caret_start":caret_start,"caret_end":caret}));
					items.push(item);
				}
				/* Read HTML Comment */
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
				var res = this.readHTMLComment(parser);
				parser = Runtime.rtl.attr(res, 0);
				items.push(Runtime.rtl.attr(res, 1));
				/* Set pos, x, y */
				caret_start = parser.caret;
				pos = parser.caret.pos;
				x = parser.caret.x;
				y = parser.caret.y;
				start_pos = pos;
			}
			else if (ch == "<" || ch2 == "{{" || ch == "@")
			{
				var __v14 = use("Runtime.rs");
				var value = __v14.substr(content.ref, start_pos, pos - start_pos);
				var __v15 = use("BayLang.Caret");
				caret = new __v15(use("Runtime.Map").from({"x":x,"y":y,"pos":pos}));
				var __v16 = use("Runtime.rs");
				value = __v16.trim(value, "\t\r\n");
				if (flag_first && first_html_tag)
				{
					var __v17 = use("Runtime.rs");
					value = __v17.trim(value, " ");
				}
				if (value != "")
				{
					var __v18 = use("BayLang.OpCodes.OpHtmlContent");
					item = new __v18(use("Runtime.Map").from({"value":value,"caret_start":caret_start,"caret_end":caret}));
					items.push(item);
				}
				/* Read HTML Value */
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
				var res = this.readHTMLValue(parser);
				parser = Runtime.rtl.attr(res, 0);
				item = Runtime.rtl.attr(res, 1);
				items.push(item);
				/* Set pos, x, y */
				caret_start = parser.caret;
				pos = parser.caret.pos;
				x = parser.caret.x;
				y = parser.caret.y;
				start_pos = pos;
			}
			else if (ch3 == "%if" || ch4 == "%for" || ch4 == "%var" || ch4 == "%set" || ch6 == "%while" || ch7 == "%render")
			{
				var __v19 = use("Runtime.rs");
				var value = __v19.substr(content.ref, start_pos, pos - start_pos);
				var __v20 = use("BayLang.Caret");
				caret = new __v20(use("Runtime.Map").from({"x":x,"y":y,"pos":pos}));
				var __v21 = use("Runtime.rs");
				value = __v21.trim(value, "\t\r\n");
				var __v22 = use("Runtime.rs");
				value = __v22.trim(value, " ");
				if (value != "")
				{
					var __v23 = use("BayLang.OpCodes.OpHtmlContent");
					item = new __v23(use("Runtime.Map").from({"value":value,"caret_start":caret_start,"caret_end":caret}));
					items.push(item);
				}
				/* Read HTML Operator */
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
				var res = this.readHTMLOperator(parser);
				parser = Runtime.rtl.attr(res, 0);
				item = Runtime.rtl.attr(res, 1);
				items.push(item);
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
				x = parser.parser_base.constructor.nextX(parser, ch, x);
				y = parser.parser_base.constructor.nextY(parser, ch, y);
				pos = pos + 1;
			}
			var __v24 = use("Runtime.rs");
			ch_pos = __v24.substr(content.ref, pos, end_tag_sz);
		}
		/* Push item */
		var __v25 = use("Runtime.rs");
		var value = __v25.substr(content.ref, start_pos, pos - start_pos);
		var __v26 = use("Runtime.rs");
		value = __v26.trim(value, "\t\r\n");
		var __v27 = use("BayLang.Caret");
		caret = new __v27(use("Runtime.Map").from({"x":x,"y":y,"pos":pos}));
		if (first_html_tag)
		{
			var __v28 = use("Runtime.rs");
			value = __v28.trim(value, " ");
		}
		if (value != "")
		{
			var __v29 = use("BayLang.OpCodes.OpHtmlContent");
			item = new __v29(use("Runtime.Map").from({"value":value,"caret_start":caret_start,"caret_end":caret}));
			items.push(item);
		}
		return use("Runtime.Vector").from([parser.copy(use("Runtime.Map").from({"caret":caret})),items]);
	},
	/**
	 * Read html tag
	 */
	readHTMLTag: function(parser)
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
		var res = parser.parser_base.constructor.matchToken(parser, "<");
		parser = Runtime.rtl.attr(res, 0);
		/* Look token */
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "{")
		{
			op_code_flag = true;
			var caret1 = parser.caret;
			var res = parser.parser_base.constructor.matchToken(parser, "{");
			parser = Runtime.rtl.attr(res, 0);
			var res = parser.parser_expression.constructor.readExpression(parser);
			parser = Runtime.rtl.attr(res, 0);
			op_code_name = Runtime.rtl.attr(res, 1);
			var res = parser.parser_base.constructor.matchToken(parser, "}");
			parser = Runtime.rtl.attr(res, 0);
			var caret2 = parser.caret;
			var __v0 = use("Runtime.rs");
			tag_name = __v0.substr(parser.content.ref, caret1.pos, caret2.pos - caret1.pos);
		}
		else if (token.content == ">")
		{
			op_code_flag = true;
			tag_name = "";
		}
		else
		{
			var res = parser.parser_base.constructor.readIdentifier(parser, false);
			parser = Runtime.rtl.attr(res, 0);
			ident = Runtime.rtl.attr(res, 1);
			tag_name = ident.value;
		}
		var res = this.readHTMLAttrs(parser);
		parser = Runtime.rtl.attr(res, 0);
		var attrs = Runtime.rtl.attr(res, 1);
		/* Save vars */
		var save_vars = parser.vars;
		var slot_args = null;
		var slot_use = null;
		/* Read slot args */
		if (tag_name == "slot")
		{
			/* Slot args */
			var __v1 = use("Runtime.lib");
			var args_item = attrs.findItem(__v1.equalAttr("key", "args"));
			if (args_item)
			{
				var args_str = args_item.value.value;
				/* Create parser */
				var __v2 = use("BayLang.LangBay.ParserBay");
				var parser2 = new __v2();
				parser2 = parser2.constructor.reset(parser2);
				parser2 = parser2.constructor.setContent(parser2, args_str);
				var __v3 = use("BayLang.Caret");
				parser2 = Runtime.rtl.setAttr(parser2, Runtime.Collection.from(["caret"]), new __v3(use("Runtime.Map").from({})));
				/* Parse args */
				var res = parser2.parser_operator.constructor.readDeclareFunctionArgs(parser2, false, false);
				parser2 = Runtime.rtl.attr(res, 0);
				slot_args = Runtime.rtl.attr(res, 1);
				var parser2_vars = parser2.vars;
				/* Add slot args */
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["vars"]), parser2_vars);
			}
			/* Slot use */
			var __v4 = use("Runtime.lib");
			args_item = attrs.findItem(__v4.equalAttr("key", "use"));
			if (args_item)
			{
				var args_str = args_item.value.value;
				var __v5 = use("Runtime.Vector");
				slot_use = new __v5();
				/* Each items */
				var parser2_vars = use("Runtime.Map").from({});
				var __v6 = use("Runtime.rs");
				var items = __v6.split(",", args_str);
				for (var i = 0; i < items.count(); i++)
				{
					var __v7 = use("BayLang.OpCodes.OpIdentifier");
					var __v8 = use("BayLang.OpCodes.OpIdentifier");
					slot_use.push(new __v7(use("Runtime.Map").from({"value":items.get(i),"kind":__v8.KIND_VARIABLE})));
					parser2_vars.set(items.get(i), true);
				}
				/* Add slot args */
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["vars"]), parser.vars.concat(parser2_vars));
			}
		}
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "/")
		{
			parser = look;
			is_single_flag = true;
		}
		var res = parser.parser_base.constructor.matchToken(parser, ">");
		parser = Runtime.rtl.attr(res, 0);
		if (!is_single_flag)
		{
			if (tag_name == "svg")
			{
				var res = parser.parser_base.constructor.readUntilStringArr(parser, use("Runtime.Vector").from(["</svg>"]), false);
				parser = Runtime.rtl.attr(res, 0);
				var content = Runtime.rtl.attr(res, 1);
				var __v9 = use("Runtime.re");
				content = __v9.replace("[\t\n]", "", content);
				var __v10 = use("BayLang.OpCodes.OpHtmlValue");
				var __v11 = use("BayLang.OpCodes.OpHtmlValue");
				var __v12 = use("BayLang.OpCodes.OpString");
				var items = use("Runtime.Vector").from([new __v10(use("Runtime.Map").from({"kind":__v11.KIND_RAW,"value":new __v12(use("Runtime.Map").from({"caret_start":parser.caret,"caret_end":parser.caret,"value":content})),"caret_start":caret_start,"caret_end":parser.caret}))]);
			}
			else
			{
				/* Read items */
				caret_items_start = parser.caret;
				var res = this.readHTMLContent(parser, "</" + use("Runtime.rtl").toStr(tag_name));
				parser = Runtime.rtl.attr(res, 0);
				var items = Runtime.rtl.attr(res, 1);
				caret_items_end = parser.caret;
			}
			/* Tag end */
			if (op_code_flag)
			{
				var res = parser.parser_base.constructor.matchToken(parser, "<");
				parser = Runtime.rtl.attr(res, 0);
				var res = parser.parser_base.constructor.matchToken(parser, "/");
				parser = Runtime.rtl.attr(res, 0);
				if (tag_name)
				{
					var res = parser.parser_base.constructor.matchString(parser, tag_name);
					parser = Runtime.rtl.attr(res, 0);
				}
				var res = parser.parser_base.constructor.matchToken(parser, ">");
				parser = Runtime.rtl.attr(res, 0);
			}
			else
			{
				var res = parser.parser_base.constructor.matchToken(parser, "<");
				parser = Runtime.rtl.attr(res, 0);
				var res = parser.parser_base.constructor.matchToken(parser, "/");
				parser = Runtime.rtl.attr(res, 0);
				if (ident != null)
				{
					var res = parser.parser_base.constructor.matchToken(parser, tag_name);
					parser = Runtime.rtl.attr(res, 0);
				}
				var res = parser.parser_base.constructor.matchToken(parser, ">");
				parser = Runtime.rtl.attr(res, 0);
			}
		}
		/* Restore vars */
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["vars"]), save_vars);
		/* Create op_code */
		var op_code = null;
		if (tag_name == "slot")
		{
			var __v13 = use("Runtime.lib");
			var op_attr_name = attrs.findItem(__v13.equalAttr("key", "name"));
			/* Filter attrs */
			var __v14 = use("Runtime.lib");
			attrs = attrs.filter(__v14.equalAttrNot("key", "args"));
			var __v15 = use("Runtime.lib");
			attrs = attrs.filter(__v15.equalAttrNot("key", "name"));
			var __v16 = use("Runtime.lib");
			attrs = attrs.filter(__v16.equalAttrNot("key", "use"));
			var name = "";
			var __v17 = use("BayLang.OpCodes.OpString");
			if (op_attr_name && op_attr_name.value instanceof __v17)
			{
				name = op_attr_name.value.value;
			}
			var __v18 = use("BayLang.OpCodes.OpHtmlSlot");
			var __v19 = use("BayLang.OpCodes.OpHtmlItems");
			op_code = new __v18(use("Runtime.Map").from({"args":slot_args,"attrs":attrs,"name":name,"vars":slot_use,"caret_start":caret_start,"caret_end":parser.caret,"items":(items != null) ? (new __v19(use("Runtime.Map").from({"caret_start":caret_items_start,"caret_end":caret_items_end,"items":items}))) : (null)}));
		}
		else
		{
			var __v20 = use("BayLang.OpCodes.OpHtmlTag");
			var __v21 = use("BayLang.OpCodes.OpHtmlItems");
			op_code = new __v20(use("Runtime.Map").from({"attrs":attrs,"tag_name":tag_name,"op_code_name":op_code_name,"caret_start":caret_start,"caret_end":parser.caret,"items":(items != null) ? (new __v21(use("Runtime.Map").from({"caret_start":caret_items_start,"caret_end":caret_items_end,"items":items}))) : (null)}));
		}
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read html operator
	 */
	readHTMLOperator: function(parser)
	{
		var look = null;
		var token = null;
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "%if")
		{
			return parser.parser_operator.constructor.readIf(parser);
		}
		else if (token.content == "%for")
		{
			return parser.parser_operator.constructor.readFor(parser);
		}
		else if (token.content == "%while")
		{
			return parser.parser_operator.constructor.readWhile(parser);
		}
		else if (token.content == "%var")
		{
			var op_code = null;
			var res = parser.parser_base.constructor.matchToken(parser, "%var");
			parser = Runtime.rtl.attr(res, 0);
			var res = parser.parser_operator.constructor.readAssign(parser);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
			var res = parser.parser_base.constructor.matchToken(parser, ";");
			parser = Runtime.rtl.attr(res, 0);
			return use("Runtime.Vector").from([parser,op_code]);
		}
		else if (token.content == "%set")
		{
			var op_code = null;
			var res = parser.parser_base.constructor.matchToken(parser, "%set");
			parser = Runtime.rtl.attr(res, 0);
			var res = parser.parser_operator.constructor.readAssign(parser);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
			var res = parser.parser_base.constructor.matchToken(parser, ";");
			parser = Runtime.rtl.attr(res, 0);
			return use("Runtime.Vector").from([parser,op_code]);
		}
		else if (token.content == "%render")
		{
			var op_code = null;
			var res = parser.parser_base.constructor.matchToken(parser, "%render");
			parser = Runtime.rtl.attr(res, 0);
			var res = parser.parser_base.constructor.readDynamic(parser);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
			var __v0 = use("BayLang.OpCodes.OpCall");
			if (op_code instanceof __v0)
			{
				op_code = Runtime.rtl.setAttr(op_code, Runtime.Collection.from(["is_html"]), true);
			}
			var res = parser.parser_base.constructor.matchToken(parser, ";");
			parser = Runtime.rtl.attr(res, 0);
			return use("Runtime.Vector").from([parser,op_code]);
		}
		return use("Runtime.Vector").from([parser,null]);
	},
	/**
	 * Read html operator
	 */
	readHTML: function(parser, end_tag)
	{
		if (end_tag == undefined) end_tag = "";
		var caret_start = parser.caret;
		/* Enable html flag */
		var save_is_html = parser.is_html;
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["is_html"]), true);
		var res = this.readHTMLContent(parser, end_tag);
		parser = Runtime.rtl.attr(res, 0);
		var items = Runtime.rtl.attr(res, 1);
		var __v0 = use("BayLang.OpCodes.OpHtmlItems");
		var op_code = new __v0(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"items":items}));
		/* Disable html flag */
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["is_html"]), save_is_html);
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read html operator
	 */
	readHTMLTemplate: function(parser, item_attrs, caret_start)
	{
		var fn_name = item_attrs.get("name", "render");
		var fn_args_str = item_attrs.get("args", "");
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
		if (item_attrs.has("args"))
		{
			var parser2 = parser.constructor.setContent(parser, fn_args_str);
			var __v0 = use("BayLang.Caret");
			parser2 = Runtime.rtl.setAttr(parser2, Runtime.Collection.from(["caret"]), new __v0(use("Runtime.Map").from({})));
			/* Parse args */
			var res = parser.parser_operator.constructor.readDeclareFunctionArgs(parser2, false, false);
			parser2 = Runtime.rtl.attr(res, 0);
			var fn_args2 = Runtime.rtl.attr(res, 1);
			parser2_vars = parser2.vars;
			fn_args = fn_args.concat(fn_args2);
		}
		/* If multiblock */
		var is_multiblock = false;
		if (item_attrs.has("multiblock"))
		{
			if (item_attrs.get("multiblock") == "true")
			{
				is_multiblock = true;
			}
			else if (item_attrs.get("multiblock") == "false")
			{
				is_multiblock = false;
			}
		}
		/* Register variable in parser */
		/*parser2_vars = parser2_vars
			.setIm("layout", true)
			.setIm("model", true)
			.setIm("model_path", true)
			.setIm("render_params", true)
			.setIm("render_content", true)
		;*/
		/* Read template content */
		var save_vars = parser.vars;
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["vars"]), parser.vars.concat(parser2_vars));
		var res = this.readHTML(parser, "</template");
		parser = Runtime.rtl.attr(res, 0);
		var expression = Runtime.rtl.attr(res, 1);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["vars"]), save_vars);
		/* Read template footer */
		var res = parser.parser_base.constructor.matchToken(parser, "<");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, "/");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, "template");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, ">");
		parser = Runtime.rtl.attr(res, 0);
		var __v1 = use("BayLang.OpCodes.OpDeclareFunction");
		var __v2 = use("BayLang.OpCodes.OpFlags");
		var f = new __v1(use("Runtime.Map").from({"args":fn_args,"vars":use("Runtime.Vector").from([]),"flags":new __v2(use("Runtime.Map").from({"p_static":false,"p_pure":false,"p_multiblock":is_multiblock})),"name":fn_name,"result_type":"html","is_html":true,"expression":expression,"items":null,"caret_start":caret_start,"caret_end":parser.caret}));
		return use("Runtime.Vector").from([parser,f]);
	},
	/**
	 * Read html attributes
	 */
	readAttrs: function(parser)
	{
		var look = null;
		var op_code = null;
		var token = null;
		var look_token = null;
		var __v0 = use("Runtime.Map");
		var items = new __v0();
		var content = parser.content;
		var content_sz = parser.content_sz;
		var caret = parser.parser_base.constructor.skipChar(parser, content, parser.caret);
		var __v1 = use("Runtime.rs");
		var ch = __v1.substr(content.ref, caret.pos, 1);
		while (ch != "/" && ch != ">" && caret.pos < content_sz)
		{
			var res = parser.parser_base.constructor.readToken(parser);
			parser = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			var res = parser.parser_base.constructor.matchToken(parser, "=");
			parser = Runtime.rtl.attr(res, 0);
			var attr_name = token.content;
			/* Look token */
			var res = parser.parser_base.constructor.readToken(parser);
			look_token = Runtime.rtl.attr(res, 1);
			if (look_token.content == "{")
			{
				var res = parser.parser_base.constructor.readDict(parser);
				parser = Runtime.rtl.attr(res, 0);
				op_code = Runtime.rtl.attr(res, 1);
				caret = parser.caret;
				items.set(attr_name, op_code);
			}
			else
			{
				var res = parser.parser_base.constructor.readString(parser);
				parser = Runtime.rtl.attr(res, 0);
				op_code = Runtime.rtl.attr(res, 1);
				items.set(attr_name, op_code.value);
			}
			caret = parser.parser_base.constructor.skipChar(parser, content, parser.caret);
			var __v2 = use("Runtime.rs");
			ch = __v2.substr(content.ref, caret.pos, 1);
			var __v3 = use("Runtime.rs");
			var ch2 = __v3.substr(content.ref, caret.pos, 2);
			if (ch2 == "/>")
			{
				break;
			}
		}
		return use("Runtime.Vector").from([parser,items]);
	},
	/**
	 * Read item
	 */
	readWidget: function(parser)
	{
		var __v0 = use("Runtime.Map");
		var settings = new __v0();
		var __v1 = use("Runtime.Vector");
		var items = new __v1();
		/* Read item */
		var res = parser.parser_base.constructor.matchToken(parser, "<");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, "widget");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, ">");
		parser = Runtime.rtl.attr(res, 0);
		var token = null;
		var look = null;
		var caret = parser.getCaret();
		var caret_start = parser.getCaret();
		var end_tag = "</widget>";
		var __v2 = use("Runtime.rs");
		var end_tag_sz = __v2.strlen(end_tag);
		/* Skip empty chars */
		caret = parser.parser_base.constructor.skipChar(parser, parser.content, caret);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
		/* Read next string */
		var caret = parser.getCaret();
		var next_tag = caret.nextString(end_tag_sz);
		while (next_tag != end_tag && !caret.eof())
		{
			/* Save caret */
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
			var parser_item = parser;
			var res = parser.parser_base.constructor.matchToken(parser, "<");
			parser = Runtime.rtl.attr(res, 0);
			var res = parser.parser_base.constructor.readToken(parser);
			parser = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			/* HTML Comment */
			if (token.content == "!--")
			{
				var res = this.readHTMLComment(parser_item);
				parser = Runtime.rtl.attr(res, 0);
			}
			else
			{
				var res = parser.parser_base.constructor.matchToken(parser, ">");
				parser = Runtime.rtl.attr(res, 0);
				var props_name = token.content;
				var props_value = "";
				/* Read widget */
				if (props_name == "widget")
				{
					var res = this.readWidget(parser_item);
					parser = Runtime.rtl.attr(res, 0);
					var item = Runtime.rtl.attr(res, 1);
					items.push(item);
				}
				else if (props_name == "style")
				{
					var res = this.readWidgetStyle(parser_item);
					parser = Runtime.rtl.attr(res, 0);
					var item = Runtime.rtl.attr(res, 1);
					items.push(item);
				}
				else
				{
					/* Get caret */
					var caret = parser.getCaret();
					/* Read content */
					var item_ch = caret.nextChar();
					while (item_ch != "<" && !caret.eof())
					{
						props_value += item_ch;
						caret.readChar();
						item_ch = caret.nextChar();
					}
					/* Save caret */
					parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
					var __v3 = use("BayLang.OpCodes.OpString");
					settings.set(props_name, new __v3(use("Runtime.Map").from({"caret_start":caret,"caret_end":parser.caret,"value":props_value})));
					/* Read end tag */
					var res = parser.parser_base.constructor.matchToken(parser, "<");
					parser = Runtime.rtl.attr(res, 0);
					var res = parser.parser_base.constructor.matchToken(parser, "/");
					parser = Runtime.rtl.attr(res, 0);
					var res = parser.parser_base.constructor.matchToken(parser, props_name);
					parser = Runtime.rtl.attr(res, 0);
					var res = parser.parser_base.constructor.matchToken(parser, ">");
					parser = Runtime.rtl.attr(res, 0);
				}
			}
			/* Skip empty chars */
			caret = parser.parser_base.constructor.skipChar(parser, parser.content, parser.caret);
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
			/* Read next string */
			var caret = parser.getCaret();
			next_tag = caret.nextString(end_tag_sz);
		}
		/* Read item */
		var res = parser.parser_base.constructor.matchToken(parser, "<");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, "/");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, "widget");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, ">");
		parser = Runtime.rtl.attr(res, 0);
		/* Create widget data */
		var __v4 = use("BayLang.OpCodes.OpWidget");
		var op_code = new __v4(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"items":items,"settings":settings}));
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read widget data
	 */
	readWidgetData: function(parser)
	{
		var token = null;
		var __v0 = use("Runtime.Vector");
		var items = new __v0();
		/* Read data */
		var res = parser.parser_base.constructor.matchToken(parser, "<");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, "data");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, ">");
		parser = Runtime.rtl.attr(res, 0);
		var caret = parser.getCaret();
		var caret_start = parser.getCaret();
		var end_tag = "</data>";
		var __v1 = use("Runtime.rs");
		var end_tag_sz = __v1.strlen(end_tag);
		/* Skip empty chars */
		caret = parser.parser_base.constructor.skipChar(parser, parser.content, caret);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
		/* Read next string */
		var caret = parser.getCaret();
		var next_tag = caret.nextString(end_tag_sz);
		while (next_tag != end_tag && !caret.eof())
		{
			/* Save caret */
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
			var parser_item = parser;
			var res = parser.parser_base.constructor.matchToken(parser, "<");
			parser = Runtime.rtl.attr(res, 0);
			var res = parser.parser_base.constructor.readToken(parser);
			parser = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			/* HTML Comment */
			if (token.content == "!--")
			{
				var res = this.readHTMLComment(parser_item);
				parser = Runtime.rtl.attr(res, 0);
			}
			else
			{
				var res = parser.parser_base.constructor.matchToken(parser, ">");
				parser = Runtime.rtl.attr(res, 0);
				var item_name = token.content;
				/* Read widget */
				if (item_name == "widget")
				{
					var res = this.readWidget(parser_item);
					parser = Runtime.rtl.attr(res, 0);
					var item = Runtime.rtl.attr(res, 1);
					items.push(item);
				}
				else if (item_name == "class")
				{
					var res = this.readWidgetClass(parser_item);
					parser = Runtime.rtl.attr(res, 0);
					var item = Runtime.rtl.attr(res, 1);
					items.push(item);
				}
				else
				{
					var __v2 = use("BayLang.Exceptions.ParserError");
					throw new __v2("Unknown identifier '" + use("Runtime.rtl").toStr(item_name) + use("Runtime.rtl").toStr("'"), parser_item.caret, parser.file_name)
				}
			}
			/* Skip empty chars */
			caret = parser.parser_base.constructor.skipChar(parser, parser.content, parser.caret);
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
			/* Read next string */
			var caret = parser.getCaret();
			next_tag = caret.nextString(end_tag_sz);
		}
		/* Read data */
		var res = parser.parser_base.constructor.matchToken(parser, "<");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, "/");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, "data");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, ">");
		parser = Runtime.rtl.attr(res, 0);
		/* Create widget data */
		var __v3 = use("BayLang.OpCodes.OpWidgetData");
		var op_code = new __v3(use("Runtime.Map").from({"caret_start":caret_start,"caret_end":parser.caret,"widget":items}));
		return use("Runtime.Vector").from([parser,op_code]);
	},
	/**
	 * Read UI
	 */
	readUIClass: function(parser)
	{
		var __v0 = use("Runtime.Vector");
		var module_items = new __v0();
		var __v1 = use("Runtime.Vector");
		var items = new __v1();
		var __v2 = use("Runtime.Vector");
		var components = new __v2();
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
		var __v3 = use("Runtime.Vector");
		var class_annotations = new __v3();
		/* Content */
		var content = parser.content;
		var content_sz = parser.content_sz;
		/* Read class header */
		var res = parser.parser_base.constructor.matchToken(parser, "<");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, "class");
		parser = Runtime.rtl.attr(res, 0);
		var res = this.readAttrs(parser);
		parser = Runtime.rtl.attr(res, 0);
		var attrs = Runtime.rtl.attr(res, 1);
		class_name = attrs.get("name", "");
		class_extends = attrs.get("extends", null);
		class_version = attrs.get("version", "1.0");
		class_model = attrs.get("model", "Runtime.Dict");
		var res = parser.parser_base.constructor.matchToken(parser, ">");
		parser = Runtime.rtl.attr(res, 0);
		var flag_is_component = true;
		var flag_is_model = false;
		if (attrs.get("type") == "model")
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
		var getClassShortName = (class_name) =>
		{
			var __v4 = use("Runtime.Monad");
			var __v5 = new __v4(class_name);
			var __v6 = use("Runtime.rs");
			var __v7 = (__varg0) => __v6.split(".", __varg0);
			__v5 = __v5.call(__v7);
			__v5 = __v5.callMethod("last", []);
			return __v5.value();
		};
		if (class_name == "Runtime.Web.Component")
		{
			class_extends = "Runtime.BaseObject";
		}
		else
		{
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["uses"]), parser.uses.setIm(getClassShortName(class_name), class_name));
		}
		if (class_extends != "" && class_extends != null)
		{
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["uses"]), parser.uses.setIm(getClassShortName(class_extends), class_extends));
			if (class_extends != "Runtime.BaseObject" && class_extends != "Runtime.Web.Component" && class_extends != "Runtime.Web.BaseModel")
			{
				components.push(class_extends);
			}
		}
		if (class_model != "" && class_model != "Runtime.Dict")
		{
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["uses"]), parser.uses.setIm(getClassShortName(class_model), class_model));
		}
		var __v4 = use("Runtime.rs");
		var class_name_arr = __v4.split(".", class_name);
		class_name_last = class_name_arr.last();
		class_name_arr = class_name_arr.slice(0, -1);
		var __v5 = use("Runtime.rs");
		namespace_name = __v5.join(".", class_name_arr);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["current_class_name"]), class_name_last);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["current_namespace_name"]), namespace_name);
		var class_extend_op_code = null;
		if (class_extends != null)
		{
			var __v6 = use("BayLang.OpCodes.OpTypeIdentifier");
			var __v7 = use("BayLang.OpCodes.OpEntityName");
			var __v8 = use("Runtime.rs");
			class_extend_op_code = new __v6(use("Runtime.Map").from({"entity_name":new __v7(use("Runtime.Map").from({"caret_start":class_caret_start,"caret_end":parser.caret,"names":__v8.split(".", class_extends)})),"template":null,"caret_start":class_caret_start,"caret_end":parser.caret}));
		}
		/* Add namespace */
		var __v9 = use("BayLang.OpCodes.OpNamespace");
		module_items.push(new __v9(use("Runtime.Map").from({"name":namespace_name})));
		/* Read class body */
		var caret = parser.parser_base.constructor.skipChar(parser, content, parser.caret);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
		var __v10 = use("Runtime.rs");
		var ch2 = __v10.substr(content.ref, caret.pos, 2);
		while (ch2 != "</" && caret.pos < content_sz)
		{
			var parser_start = parser;
			var caret_start = parser.caret;
			var res = parser.parser_base.constructor.matchToken(parser, "<");
			parser = Runtime.rtl.attr(res, 0);
			var res = parser.parser_base.constructor.readToken(parser);
			parser = Runtime.rtl.attr(res, 0);
			var item_token = Runtime.rtl.attr(res, 1);
			item_name = item_token.content;
			/* Html comment */
			if (item_name == "!--")
			{
				var res = this.readHTMLComment(parser_start);
				parser = Runtime.rtl.attr(res, 0);
				items.push(Runtime.rtl.attr(res, 1));
				caret = parser.parser_base.constructor.skipChar(parser, content, parser.caret);
				var __v11 = use("Runtime.rs");
				ch2 = __v11.substr(content.ref, caret.pos, 2);
				continue;
			}
			var res = this.readAttrs(parser);
			parser = Runtime.rtl.attr(res, 0);
			var item_attrs = Runtime.rtl.attr(res, 1);
			if (item_name == "annotation")
			{
				var annotation_name = item_attrs.get("name", "");
				var annotation_op_code = item_attrs.get("value", null);
				var __v12 = use("BayLang.OpCodes.OpAnnotation");
				var __v13 = use("BayLang.OpCodes.OpTypeIdentifier");
				var __v14 = use("BayLang.OpCodes.OpEntityName");
				var __v15 = use("Runtime.rs");
				class_annotations.push(new __v12(use("Runtime.Map").from({"name":new __v13(use("Runtime.Map").from({"entity_name":new __v14(use("Runtime.Map").from({"names":__v15.split(".", annotation_name)}))})),"params":annotation_op_code})));
			}
			else if (item_name == "use")
			{
				full_name = item_attrs.get("name", "");
				short_name = item_attrs.get("as", "");
				is_component = item_attrs.get("component", "false");
				is_component = is_component == "true" || is_component == "1";
				if (short_name == "")
				{
					var __v16 = use("Runtime.rs");
					short_name = __v16.split(".", full_name).last();
				}
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["uses"]), parser.uses.setIm(short_name, full_name));
				if (is_component)
				{
					components.push(full_name);
				}
				var __v17 = use("BayLang.OpCodes.OpUse");
				module_items.push(new __v17(use("Runtime.Map").from({"name":full_name,"alias":short_name,"is_component":is_component})));
			}
			/* Read body */
			var res = parser.parser_base.constructor.readToken(parser);
			parser = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			if (token.content == ">")
			{
				if (item_name == "template")
				{
					var res = this.readHTMLTemplate(parser, item_attrs, caret_start);
					parser = Runtime.rtl.attr(res, 0);
					var op_code = Runtime.rtl.attr(res, 1);
					items.push(op_code);
				}
				else if (item_name == "style")
				{
					var res = this.readStyle(parser, item_attrs, items, caret_start);
					parser = Runtime.rtl.attr(res, 0);
					var op_code = Runtime.rtl.attr(res, 1);
					items.push(op_code);
				}
				else if (item_name == "script")
				{
					var res = parser.parser_program.constructor.readClassBody(parser, "</");
					parser = Runtime.rtl.attr(res, 0);
					var arr = Runtime.rtl.attr(res, 1);
					items.appendItems(arr);
					/* Read script footer */
					var res = parser.parser_base.constructor.matchToken(parser, "<");
					parser = Runtime.rtl.attr(res, 0);
					var res = parser.parser_base.constructor.matchToken(parser, "/");
					parser = Runtime.rtl.attr(res, 0);
					var res = parser.parser_base.constructor.matchToken(parser, "script");
					parser = Runtime.rtl.attr(res, 0);
					var res = parser.parser_base.constructor.matchToken(parser, ">");
					parser = Runtime.rtl.attr(res, 0);
				}
				else
				{
					var __v18 = use("BayLang.Exceptions.ParserError");
					throw new __v18("Unknown identifier '" + use("Runtime.rtl").toStr(item_name) + use("Runtime.rtl").toStr("'"), item_token.caret_start, parser.file_name)
				}
			}
			else if (token.content == "/")
			{
				var res = parser.parser_base.constructor.matchToken(parser, ">");
				parser = Runtime.rtl.attr(res, 0);
			}
			else
			{
				var __v19 = use("BayLang.Exceptions.ParserError");
				throw new __v19("Unknown identifier '" + use("Runtime.rtl").toStr(token.content) + use("Runtime.rtl").toStr("'"), token.caret_start, parser.file_name)
			}
			caret = parser.parser_base.constructor.skipChar(parser, content, parser.caret);
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["caret"]), caret);
			var __v20 = use("Runtime.rs");
			ch2 = __v20.substr(content.ref, caret.pos, 2);
		}
		/* Add components function */
		if (components.count() > 0)
		{
			var __v21 = use("BayLang.OpCodes.OpDeclareFunction");
			var __v22 = use("BayLang.OpCodes.OpFlags");
			var __v23 = use("BayLang.OpCodes.OpCollection");
			var f = new __v21(use("Runtime.Map").from({"args":use("Runtime.Vector").from([]),"vars":use("Runtime.Vector").from([]),"flags":new __v22(use("Runtime.Map").from({"p_static":true,"p_pure":true})),"name":"components","result_type":"var","expression":new __v23(use("Runtime.Map").from({"caret_start":parser.caret,"caret_end":parser.caret,"values":components.map((class_name) =>
			{
				var __v24 = use("BayLang.OpCodes.OpString");
				return new __v24(use("Runtime.Map").from({"caret_start":parser.caret,"caret_end":parser.caret,"value":class_name}));
			})})),"items":null,"caret_start":parser.caret,"caret_end":parser.caret}));
			items.push(f);
		}
		/* Read class footer */
		var res = parser.parser_base.constructor.matchToken(parser, "<");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, "/");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, "class");
		parser = Runtime.rtl.attr(res, 0);
		var res = parser.parser_base.constructor.matchToken(parser, ">");
		parser = Runtime.rtl.attr(res, 0);
		/* Analyze class body */
		var class_body = parser.parser_program.constructor.classBodyAnalyze(parser, items);
		/* Add class */
		var __v24 = use("BayLang.OpCodes.OpDeclareClass");
		var __v25 = use("BayLang.OpCodes.OpDeclareClass");
		module_items.push(new __v24(use("Runtime.Map").from({"kind":__v25.KIND_CLASS,"name":class_name_last,"is_static":true,"is_component":flag_is_component,"is_model":flag_is_model,"is_declare":false,"class_extends":class_extend_op_code,"class_implements":null,"annotations":use("Runtime.Vector").from([]),"template":null,"vars":class_body.item("vars"),"annotations":class_annotations,"functions":class_body.item("functions"),"fn_create":class_body.item("fn_create"),"fn_destroy":class_body.item("fn_destroy"),"items":items,"caret_start":class_caret_start,"caret_end":parser.caret})));
		return use("Runtime.Vector").from([parser,module_items]);
	},
	/**
	 * Read UI
	 */
	readUI: function(parser)
	{
		var look = null;
		var token = null;
		var __v0 = use("Runtime.Vector");
		var items = new __v0();
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), false);
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), true);
		while (token.content == "<")
		{
			var parser_start = parser;
			parser = look;
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			if (token.content == "class")
			{
				var res = this.readUIClass(parser_start);
				parser = Runtime.rtl.attr(res, 0);
				items.appendItems(Runtime.rtl.attr(res, 1));
			}
			else if (token.content == "!--")
			{
				var res = this.readHTMLComment(parser_start);
				parser = Runtime.rtl.attr(res, 0);
				items.push(Runtime.rtl.attr(res, 1));
			}
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), false);
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), true);
		}
		var __v1 = use("BayLang.OpCodes.OpModule");
		return use("Runtime.Vector").from([parser,new __v1(use("Runtime.Map").from({"is_component":true,"uses":parser.uses,"items":items,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.LangBay.ParserBayHtml";
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
});use.add(BayLang.LangBay.ParserBayHtml);
module.exports = BayLang.LangBay.ParserBayHtml;