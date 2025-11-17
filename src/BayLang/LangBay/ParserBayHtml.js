"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
/*
!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2025 "Ildar Bikmamatov" <support@bayrell.org>
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
BayLang.LangBay.ParserBayHtml = class extends use("Runtime.BaseObject")
{
	/**
	 * Constructor
	 */
	constructor(parser)
	{
		super();
		this.parser = parser;
	}
	
	
	/**
	 * Read comment
	 */
	readComment(reader)
	{
		const Vector = use("Runtime.Vector");
		const OpComment = use("BayLang.OpCodes.OpComment");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		reader.matchToken("<");
		reader.matchToken("!--");
		let value = new Vector();
		while (!reader.main_caret.eof() && reader.main_caret.nextString(3) != "-->")
		{
			value.push(reader.main_caret.readChar());
		}
		reader.init(reader.main_caret);
		reader.matchToken("--");
		reader.matchToken(">");
		return new OpComment(Map.create({
			"value": rs.join("", value),
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read open string
	 */
	readOpenString(reader)
	{
		if (reader.nextToken() == "\"")
		{
			reader.matchToken("\"");
			return "\"";
		}
		else if (reader.nextToken() == "'")
		{
			reader.matchToken("'");
			return "'";
		}
		else
		{
			throw reader.expected("\"");
		}
	}
	
	
	/**
	 * Read attr expression
	 */
	readAttrExpression(reader, key, kind)
	{
		const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");
		const Map = use("Runtime.Map");
		const OpItems = use("BayLang.OpCodes.OpItems");
		const Vector = use("Runtime.Vector");
		const OpDeclareFunctionArg = use("BayLang.OpCodes.OpDeclareFunctionArg");
		const OpTypeIdentifier = use("BayLang.OpCodes.OpTypeIdentifier");
		if (kind == undefined) kind = "";
		let expression = null;
		if (kind == "type")
		{
			let open_tag = this.readOpenString(reader);
			expression = this.parser.parser_base.readTypeIdentifier(reader, false);
			reader.matchToken(open_tag);
		}
		else if (kind == "template" || kind == "style")
		{
			if (key == "name")
			{
				let open_tag = this.readOpenString(reader);
				expression = this.parser.parser_base.readIdentifier(reader);
				reader.matchToken(open_tag);
			}
			else if (key == "args")
			{
				let open_tag = this.readOpenString(reader);
				expression = this.parser.parser_function.readDeclareFunctionArgs(reader, false, open_tag);
				reader.matchToken(open_tag);
			}
			else
			{
				expression = this.parser.parser_base.readString(reader);
			}
		}
		else if (kind == "expression")
		{
			let next_token = reader.nextToken();
			let is_function = rs.substr(key, 0, 7) == "@event:";
			if ((next_token == "\"" || next_token == "'") && !is_function)
			{
				expression = this.parser.parser_base.readString(reader);
			}
			else if (next_token == "{{" || next_token == "{")
			{
				if (next_token == "{{") reader.matchToken("{{");
				else reader.matchToken("{");
				expression = this.parser.parser_expression.readExpression(reader);
				if (next_token == "{{") reader.matchToken("}}");
				else reader.matchToken("}");
			}
			else if (next_token == "[")
			{
				expression = this.parser.parser_base.readCollection(reader);
			}
			else if (is_function)
			{
				let open_tag = this.readOpenString(reader);
				let save_vars = this.parser.vars.copy();
				this.parser.vars.set("event", true);
				expression = this.parser.parser_operator.parse(reader, false, open_tag);
				expression = new OpDeclareFunction(Map.create({
					"args": new OpItems(Map.create({
						"items": new Vector(
							new OpDeclareFunctionArg(Map.create({
								"pattern": OpTypeIdentifier.create("var"),
								"name": "event",
							})),
						),
					})),
					"content": expression,
					"caret_start": expression.caret_start,
					"caret_end": expression.caret_end,
				}));
				this.parser.vars = save_vars;
				reader.matchToken(open_tag);
			}
		}
		else
		{
			expression = this.parser.parser_base.readString(reader);
		}
		return expression;
	}
	
	
	/**
	 * Read attr key
	 */
	readAttrKey(reader)
	{
		let arr = "qazwsxedcrfvtgbyhnujmikolp01234567890_";
		let key = "";
		let caret = reader.caret();
		while (!caret.eof() && (rs.indexOf(arr, rs.lower(caret.nextChar())) >= 0 || caret.nextChar() == "-"))
		{
			key += caret.readChar();
		}
		if (caret.nextChar() == ":")
		{
			key += caret.readChar();
			while (!caret.eof() && rs.indexOf(arr, rs.lower(caret.nextChar())) >= 0)
			{
				key += caret.readChar();
			}
		}
		reader.init(caret);
		return key;
	}
	
	
	/**
	 * Read attrs
	 */
	readAttrs(reader, kind)
	{
		const Vector = use("Runtime.Vector");
		const OpHtmlAttribute = use("BayLang.OpCodes.OpHtmlAttribute");
		const Map = use("Runtime.Map");
		if (kind == undefined) kind = "";
		let attrs = new Vector();
		reader.main_caret.skipToken();
		while (!reader.main_caret.eof() && reader.main_caret.nextChar() != ">" && reader.main_caret.nextString(2) != "/>")
		{
			let caret_start = reader.start();
			let is_system_attr = false;
			if (reader.nextToken() == "@")
			{
				is_system_attr = true;
				reader.matchToken("@");
			}
			let is_spread = false;
			let key = "";
			let key_value = "";
			let expression = null;
			if (reader.nextToken() == "...")
			{
				is_spread = true;
				reader.matchToken("...");
				expression = this.parser.parser_base.readDynamic(reader);
			}
			else
			{
				key = this.readAttrKey(reader);
				key_value = is_system_attr ? "@" + String(key) : key;
				reader.main_caret.skipToken();
				reader.init(reader.main_caret);
				reader.matchToken("=");
				expression = this.readAttrExpression(reader, key_value, kind);
			}
			reader.main_caret.skipToken();
			attrs.push(new OpHtmlAttribute(Map.create({
				"key": key_value,
				"is_spread": is_spread,
				"expression": expression,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			})));
		}
		return attrs;
	}
	
	
	/**
	 * Read selector
	 */
	readSelector(reader)
	{
		const Vector = use("Runtime.Vector");
		let selector = new Vector();
		reader.main_caret.skipToken();
		while (!reader.main_caret.eof() && reader.main_caret.nextChar() != "{" && reader.main_caret.nextChar() != "}")
		{
			selector.push(reader.main_caret.readChar());
		}
		reader.init(reader.main_caret);
		return rs.join("", selector);
	}
	
	
	/**
	 * Returns true if next is selector
	 */
	isNextSelector(reader)
	{
		let caret = reader.main_caret.copy();
		while (!caret.eof())
		{
			let ch = caret.readChar();
			if (ch == ":" || ch == ";" || ch == "}") return false;
			if (ch == "{" || ch == "(" || ch == "&" || ch == ".") return true;
		}
		return false;
	}
	
	
	/**
	 * Read CSS Item
	 */
	readCSSItem(reader)
	{
		const Vector = use("Runtime.Vector");
		let caret = reader.main_caret;
		let content = new Vector();
		while (!caret.eof() && !(caret.isNextString(":") || caret.isNextString(";") || caret.isNextString("}")))
		{
			content.push(caret.readChar());
		}
		reader.init(caret);
		return rs.trim(rs.join("", content));
	}
	
	
	/**
	 * Read CSS
	 */
	readCSS(reader)
	{
		const Vector = use("Runtime.Vector");
		const OpHtmlCSSAttribute = use("BayLang.OpCodes.OpHtmlCSSAttribute");
		const Map = use("Runtime.Map");
		const OpHtmlCSS = use("BayLang.OpCodes.OpHtmlCSS");
		let caret_start = reader.start();
		let selector = this.readSelector(reader);
		reader.matchToken("{");
		let items = new Vector();
		while (!reader.eof() && reader.nextToken() != "}")
		{
			reader.main_caret.skipToken();
			if (reader.main_caret.nextChar() == "}") break;
			if (this.isNextSelector(reader))
			{
				let op_code_item = this.readCSS(reader);
				items.push(op_code_item);
			}
			else
			{
				let caret_start_item = reader.start();
				let key = this.readCSSItem(reader);
				reader.matchToken(":");
				let value = this.readCSSItem(reader);
				items.push(new OpHtmlCSSAttribute(Map.create({
					"key": key,
					"value": value,
					"caret_start": caret_start_item,
					"caret_end": reader.caret(),
				})));
				reader.main_caret.skipToken();
				reader.init(reader.main_caret);
				if (reader.main_caret.nextChar() != "}") reader.matchToken(";");
			}
		}
		reader.main_caret.skipToken();
		reader.main_caret.matchChar("}");
		reader.init(reader.main_caret);
		return new OpHtmlCSS(Map.create({
			"selector": selector,
			"items": items,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read style content
	 */
	readStyleContent(reader, end_tag)
	{
		const Vector = use("Runtime.Vector");
		const OpItems = use("BayLang.OpCodes.OpItems");
		const Map = use("Runtime.Map");
		if (end_tag == undefined) end_tag = "}";
		let caret_start = reader.start();
		let items = new Vector();
		while (!reader.eof() && reader.nextToken() != end_tag)
		{
			let op_code_item = this.readCSS(reader);
			items.push(op_code_item);
		}
		return new OpItems(Map.create({
			"items": items,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read style
	 */
	readStyle(reader)
	{
		const OpHtmlStyle = use("BayLang.OpCodes.OpHtmlStyle");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		reader.matchToken("<");
		reader.matchToken("style");
		let attrs = this.readAttrs(reader, "style");
		reader.matchToken(">");
		let content = this.readStyleContent(reader, "</");
		reader.matchToken("</");
		reader.matchToken("style");
		reader.matchToken(">");
		let global = attrs.find((attr) => { return attr.key == "global"; });
		let is_global = global ? global.expression.value == "true" : false;
		return new OpHtmlStyle(Map.create({
			"content": content,
			"is_global": is_global,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read html content
	 */
	readHtmlContent(reader)
	{
		const Vector = use("Runtime.Vector");
		const OpHtmlContent = use("BayLang.OpCodes.OpHtmlContent");
		const Map = use("Runtime.Map");
		let caret_start = reader.main_caret.copy();
		let caret = caret_start.copy();
		let tokens = new Vector("</", "{{");
		let content = new Vector();
		while (!caret.eof() && !caret.isNextChar("<") && tokens.indexOf(caret.nextString(2)) == -1)
		{
			content.push(caret.readChar());
		}
		reader.init(caret);
		let value = rs.trim(rs.join("", content), "\n\t");
		value = rs.decodeHtml(value);
		return new OpHtmlContent(Map.create({
			"value": value,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read html expression
	 */
	readHtmlExpression(reader)
	{
		reader.matchToken("{{");
		let expression = this.parser.parser_expression.readExpression(reader);
		reader.matchToken("}}");
		return expression;
	}
	
	
	/**
	 * Read html render
	 */
	reaHtmlRender(reader)
	{
		reader.matchToken("%render");
		let expression = this.parser.parser_expression.readExpression(reader);
		reader.matchToken(";");
		return expression;
	}
	
	
	/**
	 * Returns true if tag_name is component
	 */
	static isComponent(tag_name)
	{
		let first = rs.substr(tag_name, 0, 1);
		return rs.upper(first) == first;
	}
	
	
	/**
	 * Read html tag
	 */
	readHtmlTag(reader)
	{
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		const OpHtmlSlot = use("BayLang.OpCodes.OpHtmlSlot");
		const Map = use("Runtime.Map");
		const OpHtmlTag = use("BayLang.OpCodes.OpHtmlTag");
		let caret_start = reader.start();
		reader.matchToken("<");
		if (reader.nextToken() == "!--")
		{
			reader.init(caret_start);
			return this.readComment(reader);
		}
		let tag_name = null;
		let is_variable = false;
		if (reader.nextToken() == "{")
		{
			is_variable = true;
			reader.matchToken("{");
			tag_name = this.parser.parser_base.readDynamic(reader);
			reader.matchToken("}");
		}
		else
		{
			tag_name = this.parser.parser_base.readIdentifier(reader);
		}
		let attrs = this.readAttrs(reader, (!is_variable && tag_name.value == "slot") ? "template" : "expression");
		let content = null;
		if (reader.nextToken() != "/>")
		{
			reader.matchToken(">");
			content = this.readHtml(reader);
			reader.matchToken("</");
			if (is_variable) reader.matchToken("{");
			if (tag_name instanceof OpIdentifier) reader.matchToken(tag_name.value);
			if (is_variable) reader.matchToken("}");
			reader.matchToken(">");
		}
		else
		{
			reader.matchToken("/>");
		}
		if (tag_name.value == "slot")
		{
			let name = "";
			let args = null;
			for (let i = 0; i < attrs.count(); i++)
			{
				let item = attrs.get(i);
				if (item.key == "name") name = item.expression.value;
				else if (item.key == "args") args = item.expression;
			}
			return new OpHtmlSlot(Map.create({
				"args": args,
				"name": name,
				"content": content,
				"caret_start": caret_start,
				"caret_end": reader.caret(),
			}));
		}
		let is_component = true;
		if (!is_variable) is_component = this.constructor.isComponent(tag_name.value);
		return new OpHtmlTag(Map.create({
			"attrs": attrs,
			"content": content,
			"is_component": is_component,
			"tag_name": is_variable ? tag_name : tag_name.value,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read HTML Assign
	 */
	readHtmlAssign(reader)
	{
		if (reader.nextToken() == "%set") reader.matchToken("%set");
		else reader.matchToken("%var");
		let op_code = this.parser.parser_operator.readAssign(reader);
		reader.matchToken(";");
		return op_code;
	}
	
	
	/**
	 * Read HTML for
	 */
	readHtmlFor(reader)
	{
		const OpFor = use("BayLang.OpCodes.OpFor");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		/* Read for */
		reader.matchToken("%for");
		reader.matchToken("(");
		/* Read assing */
		let expr1 = this.parser.parser_operator.readAssign(reader);
		reader.matchToken(";");
		/* Read expression */
		let expr2 = this.parser.parser_expression.readExpression(reader);
		reader.matchToken(";");
		/* Read operator */
		let expr3 = this.parser.parser_operator.readInc(reader);
		reader.matchToken(")");
		/* Read content */
		let content = this.readHtml(reader, true, "}");
		/* Returns op_code */
		return new OpFor(Map.create({
			"expr1": expr1,
			"expr2": expr2,
			"expr3": expr3,
			"content": content,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read HTML if
	 */
	readHtmlIf(reader)
	{
		const Vector = use("Runtime.Vector");
		const OpIfElse = use("BayLang.OpCodes.OpIfElse");
		const Map = use("Runtime.Map");
		const OpIf = use("BayLang.OpCodes.OpIf");
		let caret_start = reader.start();
		let if_true = null;
		let if_false = null;
		let if_else = new Vector();
		/* Read condition */
		reader.matchToken("%if");
		reader.matchToken("(");
		let condition = this.parser.parser_expression.readExpression(reader);
		reader.matchToken(")");
		/* Read content */
		if_true = this.readHtml(reader, true, "}");
		this.parser.parser_base.skipComment(reader);
		/* Read content */
		let caret_last = null;
		let operations = new Vector("%else", "%elseif");
		while (!reader.eof() && operations.indexOf(reader.nextToken()) >= 0)
		{
			let token = reader.readToken();
			if (token == "%elseif" || token == "%else" && reader.nextToken() == "if")
			{
				/* Read condition */
				if (reader.nextToken() == "if") reader.readToken();
				reader.matchToken("(");
				let if_else_condition = this.parser.parser_expression.readExpression(reader);
				reader.matchToken(")");
				/* Read content */
				let if_else_content = this.readHtml(reader, true, "}");
				/* Add op_code */
				if_else.push(new OpIfElse(Map.create({
					"condition": if_else_condition,
					"content": if_else_content,
					"caret_start": caret_start,
					"caret_end": reader.caret(),
				})));
			}
			else if (token == "%else")
			{
				if_false = this.readHtml(reader, true, "}");
			}
			caret_last = reader.caret();
			this.parser.parser_base.skipComment(reader);
		}
		/* Restore caret */
		if (caret_last) reader.init(caret_last);
		return new OpIf(Map.create({
			"condition": condition,
			"if_true": if_true,
			"if_false": if_false,
			"if_else": if_else,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read HTML item
	 */
	readHtmlItem(reader)
	{
		let next_token = reader.nextToken();
		if (next_token == "<") return this.readHtmlTag(reader);
		else if (next_token == "{{") return this.readHtmlExpression(reader);
		else if (next_token == "%render") return this.reaHtmlRender(reader);
		else if (next_token == "%set" || next_token == "%var") return this.readHtmlAssign(reader);
		else if (next_token == "%for") return this.readHtmlFor(reader);
		else if (next_token == "%if") return this.readHtmlIf(reader);
		return this.readHtmlContent(reader);
	}
	
	
	/**
	 * Read html
	 */
	readHtml(reader, match_brackets, end_tag)
	{
		const Vector = use("Runtime.Vector");
		const OpHtmlItems = use("BayLang.OpCodes.OpHtmlItems");
		const Map = use("Runtime.Map");
		if (match_brackets == undefined) match_brackets = false;
		if (end_tag == undefined) end_tag = "";
		let caret_start = reader.start();
		let items = new Vector();
		if (match_brackets && reader.nextToken() == "<")
		{
			let op_code_item = this.readHtmlItem(reader);
			items.push(op_code_item);
		}
		else
		{
			if (match_brackets) reader.matchToken("{");
			while (!reader.eof() && reader.nextToken() != "</" && reader.nextToken() != end_tag)
			{
				let op_code_item = this.readHtmlItem(reader);
				items.push(op_code_item);
			}
			if (match_brackets) reader.matchToken("}");
		}
		return new OpHtmlItems(Map.create({
			"items": items,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read use
	 */
	readUse(reader)
	{
		const OpUse = use("BayLang.OpCodes.OpUse");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		reader.matchToken("<");
		reader.matchToken("use");
		let attrs = this.readAttrs(reader);
		reader.matchToken("/>");
		let alias = "";
		let name = "";
		let is_component = false;
		for (let i = 0; i < attrs.count(); i++)
		{
			let item = attrs.get(i);
			let value = item.expression.value;
			if (item.key == "name") name = value;
			else if (item.key == "as") alias = value;
			else if (item.key == "component")
			{
				if (value == "true" || value == "1") is_component = true;
			}
		}
		/* Get alias */
		if (alias == "")
		{
			let arr = rs.split(".", name);
			alias = arr.last();
		}
		/* Add use */
		this.parser.uses.set(alias, name);
		return new OpUse(Map.create({
			"alias": alias,
			"name": name,
			"is_component": is_component,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read template
	 */
	readTemplate(reader)
	{
		const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		reader.matchToken("<");
		reader.matchToken("template");
		let attrs = this.readAttrs(reader, "template");
		reader.matchToken(">");
		let content = this.readHtml(reader);
		reader.matchToken("</");
		reader.matchToken("template");
		reader.matchToken(">");
		let name = null;
		let args = null;
		for (let i = 0; i < attrs.count(); i++)
		{
			let item = attrs.get(i);
			if (item.key == "name") name = item.expression.value;
			else if (item.key == "args") args = item.expression;
		}
		return new OpDeclareFunction(Map.create({
			"name": name ? name : "render",
			"args": args ? args : null,
			"is_html": true,
			"content": content,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read script
	 */
	readScript(reader)
	{
		let caret_start = reader.start();
		reader.matchToken("<");
		reader.matchToken("script");
		let attrs = this.readAttrs(reader, "script");
		reader.matchToken(">");
		let items = this.parser.parser_class.readBody(reader, false, "</");
		reader.matchToken("</");
		reader.matchToken("script");
		reader.matchToken(">");
		return items;
	}
	
	
	/**
	 * Read item
	 */
	readItem(reader)
	{
		let caret_save = reader.caret();
		reader.matchToken("<");
		let next_token = reader.nextToken();
		reader.init(caret_save);
		if (next_token == "style") return this.readStyle(reader);
		else if (next_token == "template") return this.readTemplate(reader);
		else if (next_token == "script") return this.readScript(reader);
		else if (next_token == "use") return this.readUse(reader);
		else if (next_token == "!--") return this.readComment(reader);
		else throw reader.next_caret.error("Unknown token " + String(next_token));
		return null;
	}
	
	
	/**
	 * Read class content
	 */
	readContent(reader)
	{
		const Vector = use("Runtime.Vector");
		const OpItems = use("BayLang.OpCodes.OpItems");
		const Map = use("Runtime.Map");
		let caret_start = reader.start();
		let items = new Vector();
		while (!reader.eof() && reader.nextToken() != "</")
		{
			let op_code_item = this.readItem(reader);
			if (op_code_item instanceof OpItems) items.appendItems(op_code_item.items);
			else items.push(op_code_item);
		}
		return new OpItems(Map.create({
			"items": items,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Parse HTML
	 */
	parse(reader)
	{
		const Vector = use("Runtime.Vector");
		const OpNamespace = use("BayLang.OpCodes.OpNamespace");
		const Map = use("Runtime.Map");
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		const OpModule = use("BayLang.OpCodes.OpModule");
		let caret_start = reader.start();
		let items = new Vector();
		/* Read comment */
		if (caret_start.skipSpace().nextString(2) == "<!")
		{
			items.push(this.readComment(reader));
		}
		/* Read class */
		reader.matchToken("<");
		reader.matchToken("class");
		/* Read attrs */
		let attrs = this.readAttrs(reader, "type");
		let class_name = attrs.find((attr) => { return attr.key == "name"; });
		let extend_name = attrs.find((attr) => { return attr.key == "extends"; });
		reader.matchToken(">");
		/* Read component content */
		let class_content = this.readContent(reader);
		/*string class_name_value = class_name.entity_name.items.last();*/
		let namespace_name = rs.join(".", class_name.expression.entity_name.items.slice(0, class_name.expression.entity_name.items.count() - 1).map((item) => { return item.value; }));
		/* Change class name */
		class_name.expression.entity_name.items = new Vector(class_name.expression.entity_name.items.last());
		/* Add namespace */
		items.push(new OpNamespace(Map.create({
			"name": namespace_name,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		})));
		/* Add use */
		let uses = class_content.items.filter((item) => { const OpUse = use("BayLang.OpCodes.OpUse");return item instanceof OpUse; });
		items.appendItems(uses);
		/* Filter content */
		class_content.items = class_content.items.filter((item) => { const OpUse = use("BayLang.OpCodes.OpUse");return !(item instanceof OpUse); });
		items.push(new OpDeclareClass(Map.create({
			"name": class_name.expression,
			"kind": OpDeclareClass.KIND_CLASS,
			"class_extends": extend_name ? extend_name.expression : null,
			"is_component": true,
			"content": class_content,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		})));
		return new OpModule(Map.create({
			"items": items,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.parser = null;
	}
	static getClassName(){ return "BayLang.LangBay.ParserBayHtml"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangBay.ParserBayHtml);
module.exports = {
	"ParserBayHtml": BayLang.LangBay.ParserBayHtml,
};