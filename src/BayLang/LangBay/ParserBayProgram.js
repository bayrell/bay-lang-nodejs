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
BayLang.LangBay.ParserBayProgram = function()
{
};
Object.assign(BayLang.LangBay.ParserBayProgram.prototype,
{
});
Object.assign(BayLang.LangBay.ParserBayProgram,
{
	/**
	 * Read namespace
	 */
	readNamespace: function(parser)
	{
		var token = null;
		var name = null;
		var res = parser.parser_base.constructor.matchToken(parser, "namespace");
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		var res = parser.parser_base.constructor.readEntityName(parser, false);
		parser = Runtime.rtl.attr(res, 0);
		name = Runtime.rtl.attr(res, 1);
		var __v0 = use("Runtime.rs");
		var current_namespace_name = __v0.join(".", name.names);
		var __v1 = use("BayLang.OpCodes.OpNamespace");
		var current_namespace = new __v1(use("Runtime.Map").from({"name":current_namespace_name,"caret_start":caret_start,"caret_end":parser.caret}));
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["current_namespace"]), current_namespace);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["current_namespace_name"]), current_namespace_name);
		return use("Runtime.Vector").from([parser,current_namespace]);
	},
	/**
	 * Read use
	 */
	readUse: function(parser)
	{
		var look = null;
		var token = null;
		var name = null;
		var alias = "";
		var res = parser.parser_base.constructor.matchToken(parser, "use");
		parser = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		var res = parser.parser_base.constructor.readEntityName(parser, false);
		parser = Runtime.rtl.attr(res, 0);
		name = Runtime.rtl.attr(res, 1);
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "as")
		{
			var parser_value = null;
			parser = look;
			var res = parser.parser_base.constructor.readIdentifier(parser);
			parser = Runtime.rtl.attr(res, 0);
			parser_value = Runtime.rtl.attr(res, 1);
			alias = parser_value.value;
		}
		var __v0 = use("BayLang.OpCodes.OpUse");
		var __v1 = use("Runtime.rs");
		return use("Runtime.Vector").from([parser,new __v0(use("Runtime.Map").from({"name":__v1.join(".", name.names),"alias":alias,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/**
	 * Read class body
	 */
	readClassBody: function(parser, end_tag)
	{
		if (end_tag == undefined) end_tag = "}";
		var look = null;
		var token = null;
		var __v0 = use("Runtime.Vector");
		var items = new __v0();
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), false);
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), true);
		while (!token.eof && token.content != end_tag)
		{
			var item = null;
			if (token.content == "/")
			{
				var res = parser.parser_base.constructor.readComment(parser);
				parser = Runtime.rtl.attr(res, 0);
				item = Runtime.rtl.attr(res, 1);
				if (item != null)
				{
					items.push(item);
				}
			}
			else if (token.content == "@")
			{
				var res = parser.parser_operator.constructor.readAnnotation(parser);
				parser = Runtime.rtl.attr(res, 0);
				item = Runtime.rtl.attr(res, 1);
				items.push(item);
			}
			else if (token.content == "#switch" || token.content == "#ifcode")
			{
				var res = parser.parser_preprocessor.constructor.readPreprocessor(parser);
				parser = Runtime.rtl.attr(res, 0);
				item = Runtime.rtl.attr(res, 1);
				if (item != null)
				{
					items.push(item);
				}
			}
			else if (token.content == "#ifdef")
			{
				var __v1 = use("BayLang.OpCodes.OpPreprocessorIfDef");
				var res = parser.parser_preprocessor.constructor.readPreprocessorIfDef(parser, __v1.KIND_CLASS_BODY);
				parser = Runtime.rtl.attr(res, 0);
				item = Runtime.rtl.attr(res, 1);
				if (item != null)
				{
					items.push(item);
				}
			}
			else if (token.content == "<")
			{
				break;
			}
			else
			{
				var flags = null;
				var res = parser.parser_operator.constructor.readFlags(parser);
				parser = Runtime.rtl.attr(res, 0);
				flags = Runtime.rtl.attr(res, 1);
				if (parser.parser_operator.constructor.tryReadFunction(parser, true, flags))
				{
					var res = parser.parser_operator.constructor.readDeclareFunction(parser, true);
					parser = Runtime.rtl.attr(res, 0);
					item = Runtime.rtl.attr(res, 1);
					if (item.expression != null)
					{
						if (!item.is_html)
						{
							var res = parser.parser_base.constructor.matchToken(parser, ";");
							parser = Runtime.rtl.attr(res, 0);
						}
						else
						{
							var res = parser.parser_base.constructor.readToken(parser);
							look = Runtime.rtl.attr(res, 0);
							token = Runtime.rtl.attr(res, 1);
							if (token.content == ";")
							{
								parser = look;
							}
						}
					}
				}
				else
				{
					var res = parser.parser_operator.constructor.readAssign(parser);
					parser = Runtime.rtl.attr(res, 0);
					item = Runtime.rtl.attr(res, 1);
					var res = parser.parser_base.constructor.matchToken(parser, ";");
					parser = Runtime.rtl.attr(res, 0);
				}
				item = Runtime.rtl.setAttr(item, Runtime.Collection.from(["flags"]), flags);
				if (item != null)
				{
					items.push(item);
				}
			}
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), false);
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), true);
		}
		return use("Runtime.Vector").from([parser,items]);
	},
	/**
	 * Class body analyze
	 */
	classBodyAnalyze: function(parser, arr)
	{
		var __v0 = use("Runtime.Map");
		var names = new __v0();
		var __v1 = use("Runtime.Vector");
		var vars = new __v1();
		var __v2 = use("Runtime.Vector");
		var functions = new __v2();
		var __v3 = use("Runtime.Vector");
		var items = new __v3();
		var __v4 = use("Runtime.Vector");
		var annotations = new __v4();
		var __v5 = use("Runtime.Vector");
		var comments = new __v5();
		var fn_create = null;
		var fn_destroy = null;
		for (var i = 0; i < arr.count(); i++)
		{
			var item = arr.item(i);
			var __v6 = use("BayLang.OpCodes.OpAnnotation");
			var __v7 = use("BayLang.OpCodes.OpComment");
			var __v8 = use("BayLang.OpCodes.OpAssign");
			var __v9 = use("BayLang.OpCodes.OpDeclareFunction");
			var __v10 = use("BayLang.OpCodes.OpPreprocessorIfDef");
			if (item instanceof __v6)
			{
				annotations.push(item);
			}
			else if (item instanceof __v7)
			{
				comments.push(item);
			}
			else if (item instanceof __v8)
			{
				for (var j = 0; j < item.values.count(); j++)
				{
					var assign_value = item.values.item(j);
					var value_name = assign_value.var_name;
					if (names.has(value_name))
					{
						var __v9 = use("BayLang.Exceptions.ParserError");
						throw new __v9("Dublicate identifier " + use("Runtime.rtl").toStr(value_name), assign_value.caret_start, parser.file_name)
					}
					names.set(value_name, true);
				}
				item = item.copy(use("Runtime.Map").from({"annotations":annotations.slice(),"comments":comments.slice()}));
				vars.push(item);
				annotations.clear();
				comments.clear();
			}
			else if (item instanceof __v9)
			{
				item = item.copy(use("Runtime.Map").from({"annotations":annotations.slice(),"comments":comments.slice()}));
				if (names.has(item.name))
				{
					var __v10 = use("BayLang.Exceptions.ParserError");
					throw new __v10("Dublicate identifier " + use("Runtime.rtl").toStr(item.name), item.caret_start, parser.file_name)
				}
				names.set(item.name, true);
				if (item.name == "constructor")
				{
					fn_create = item;
				}
				else if (item.name == "destructor")
				{
					fn_destroy = item;
				}
				else
				{
					functions.push(item);
				}
				annotations.clear();
				comments.clear();
			}
			else if (item instanceof __v10)
			{
				var d = this.classBodyAnalyze(parser, item.items);
				var d_vars = Runtime.rtl.attr(d, "vars");
				d_vars = d_vars.map((v) =>
				{
					v = Runtime.rtl.setAttr(v, Runtime.Collection.from(["condition"]), item.condition);
					return v;
				});
				vars.appendItems(d_vars);
			}
			else
			{
				items.push(item);
			}
		}
		items.appendItems(comments);
		return use("Runtime.Map").from({"annotations":annotations,"comments":comments,"functions":functions,"items":items,"vars":vars,"fn_create":fn_create,"fn_destroy":fn_destroy});
	},
	/**
	 * Read class
	 */
	readClass: function(parser)
	{
		var look = null;
		var token = null;
		var op_code = null;
		var template = null;
		var is_abstract = false;
		var is_declare = false;
		var is_static = false;
		var is_struct = false;
		var class_kind = "";
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		if (token.content == "abstract")
		{
			parser = look;
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			is_abstract = true;
		}
		if (token.content == "declare")
		{
			parser = look;
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			is_declare = true;
		}
		if (token.content == "static")
		{
			parser = look;
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			is_static = true;
		}
		if (token.content == "class")
		{
			var res = parser.parser_base.constructor.matchToken(parser, "class");
			parser = Runtime.rtl.attr(res, 0);
			var __v0 = use("BayLang.OpCodes.OpDeclareClass");
			class_kind = __v0.KIND_CLASS;
		}
		else if (token.content == "struct")
		{
			var res = parser.parser_base.constructor.matchToken(parser, "struct");
			parser = Runtime.rtl.attr(res, 0);
			var __v1 = use("BayLang.OpCodes.OpDeclareClass");
			class_kind = __v1.KIND_STRUCT;
		}
		else if (token.content == "interface")
		{
			var res = parser.parser_base.constructor.matchToken(parser, "interface");
			parser = Runtime.rtl.attr(res, 0);
			var __v2 = use("BayLang.OpCodes.OpDeclareClass");
			class_kind = __v2.KIND_INTERFACE;
		}
		else
		{
			var res = parser.parser_base.constructor.matchToken(parser, "class");
		}
		var res = parser.parser_base.constructor.readIdentifier(parser);
		parser = Runtime.rtl.attr(res, 0);
		op_code = Runtime.rtl.attr(res, 1);
		var class_name = op_code.value;
		/* Set class name */
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["current_class_abstract"]), is_abstract);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["current_class_declare"]), is_declare);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["current_class_name"]), class_name);
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["current_class_kind"]), class_kind);
		/* Register module in parser */
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["uses"]), parser.uses.setIm(class_name, parser.current_namespace_name + use("Runtime.rtl").toStr(".") + use("Runtime.rtl").toStr(class_name)));
		var save_uses = parser.uses;
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "<")
		{
			var __v0 = use("Runtime.Vector");
			template = new __v0();
			var res = parser.parser_base.constructor.matchToken(parser, "<");
			parser = Runtime.rtl.attr(res, 0);
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			while (!token.eof && token.content != ">")
			{
				var parser_value = null;
				var res = parser.parser_base.constructor.readIdentifier(parser);
				parser = Runtime.rtl.attr(res, 0);
				parser_value = Runtime.rtl.attr(res, 1);
				template.push(parser_value);
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["uses"]), parser.uses.setIm(parser_value.value, parser_value.value));
				var res = parser.parser_base.constructor.readToken(parser);
				look = Runtime.rtl.attr(res, 0);
				token = Runtime.rtl.attr(res, 1);
				if (token.content != ">")
				{
					var res = parser.parser_base.constructor.matchToken(parser, ",");
					parser = Runtime.rtl.attr(res, 0);
					var res = parser.parser_base.constructor.readToken(parser);
					look = Runtime.rtl.attr(res, 0);
					token = Runtime.rtl.attr(res, 1);
				}
			}
			var res = parser.parser_base.constructor.matchToken(parser, ">");
			parser = Runtime.rtl.attr(res, 0);
		}
		var class_extends = null;
		var class_implements = null;
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "extends")
		{
			var res = parser.parser_base.constructor.readTypeIdentifier(look);
			parser = Runtime.rtl.attr(res, 0);
			class_extends = Runtime.rtl.attr(res, 1);
		}
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		if (token.content == "implements")
		{
			var __v0 = use("Runtime.Vector");
			class_implements = new __v0();
			var res = parser.parser_base.constructor.readTypeIdentifier(look);
			parser = Runtime.rtl.attr(res, 0);
			op_code = Runtime.rtl.attr(res, 1);
			class_implements.push(op_code);
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			while (!token.eof && token.content == ",")
			{
				parser = look;
				var res = parser.parser_base.constructor.readTypeIdentifier(look);
				parser = Runtime.rtl.attr(res, 0);
				op_code = Runtime.rtl.attr(res, 1);
				class_implements.push(op_code);
				var res = parser.parser_base.constructor.readToken(parser);
				look = Runtime.rtl.attr(res, 0);
				token = Runtime.rtl.attr(res, 1);
			}
		}
		var arr = null;
		var res = parser.parser_base.constructor.matchToken(parser, "{");
		parser = Runtime.rtl.attr(res, 0);
		var res = this.readClassBody(parser);
		parser = Runtime.rtl.attr(res, 0);
		arr = Runtime.rtl.attr(res, 1);
		var d = this.classBodyAnalyze(parser, arr);
		var res = parser.parser_base.constructor.matchToken(parser, "}");
		parser = Runtime.rtl.attr(res, 0);
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		var current_class = new __v0(use("Runtime.Map").from({"kind":class_kind,"name":class_name,"is_abstract":is_abstract,"is_static":is_static,"is_declare":is_declare,"class_extends":class_extends,"class_implements":(class_implements != null) ? (class_implements) : (null),"template":(template != null) ? (template) : (null),"vars":d.item("vars"),"functions":d.item("functions"),"fn_create":d.item("fn_create"),"fn_destroy":d.item("fn_destroy"),"items":arr,"caret_start":caret_start,"caret_end":parser.caret}));
		/* Restore uses */
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["uses"]), save_uses);
		return use("Runtime.Vector").from([parser.copy(use("Runtime.Map").from({"current_class":current_class})),current_class]);
	},
	/**
	 * Read program
	 */
	readProgram: function(parser, end_tag)
	{
		if (end_tag == undefined) end_tag = "";
		var look = null;
		var token = null;
		var op_code = null;
		var __v0 = use("Runtime.Vector");
		var annotations = new __v0();
		var __v1 = use("Runtime.Vector");
		var comments = new __v1();
		var __v2 = use("Runtime.Vector");
		var items = new __v2();
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), false);
		var res = parser.parser_base.constructor.readToken(parser);
		look = Runtime.rtl.attr(res, 0);
		token = Runtime.rtl.attr(res, 1);
		var caret_start = token.caret_start;
		parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), true);
		if (token.eof)
		{
			return use("Runtime.Vector").from([parser,null]);
		}
		if (token.content == "<")
		{
			return parser.parser_html.constructor.readUI(parser);
		}
		while (!token.eof && (end_tag == "" || end_tag != "" && token.content == end_tag))
		{
			if (token.content == "/")
			{
				var res = parser.parser_base.constructor.readComment(parser);
				parser = Runtime.rtl.attr(res, 0);
				op_code = Runtime.rtl.attr(res, 1);
				if (op_code != null)
				{
					comments.push(op_code);
				}
			}
			else if (token.content == "@")
			{
				var res = parser.parser_operator.constructor.readAnnotation(parser);
				parser = Runtime.rtl.attr(res, 0);
				op_code = Runtime.rtl.attr(res, 1);
				annotations.push(op_code);
			}
			else if (token.content == "#switch" || token.content == "#ifcode")
			{
				/* Append comments */
				items.appendItems(comments);
				comments.clear();
				var res = parser.parser_preprocessor.constructor.readPreprocessor(parser);
				parser = Runtime.rtl.attr(res, 0);
				op_code = Runtime.rtl.attr(res, 1);
				if (op_code != null)
				{
					items.appendItems(comments);
					items.push(op_code);
				}
			}
			else if (token.content == "#ifdef")
			{
				/* Append comments */
				items.appendItems(comments);
				comments.clear();
				var __v3 = use("BayLang.OpCodes.OpPreprocessorIfDef");
				var res = parser.parser_preprocessor.constructor.readPreprocessorIfDef(parser, __v3.KIND_PROGRAM);
				parser = Runtime.rtl.attr(res, 0);
				op_code = Runtime.rtl.attr(res, 1);
				if (op_code != null)
				{
					items.appendItems(comments);
					items.push(op_code);
				}
			}
			else if (token.content == "namespace")
			{
				/* Append comments */
				items.appendItems(comments);
				comments.clear();
				var res = this.readNamespace(parser);
				parser = Runtime.rtl.attr(res, 0);
				op_code = Runtime.rtl.attr(res, 1);
				items.push(op_code);
				var res = parser.parser_base.constructor.matchToken(parser, ";");
				parser = Runtime.rtl.attr(res, 0);
			}
			else if (token.content == "use")
			{
				/* Append comments */
				items.appendItems(comments);
				comments.clear();
				var res = this.readUse(parser);
				parser = Runtime.rtl.attr(res, 0);
				op_code = Runtime.rtl.attr(res, 1);
				var full_name = op_code.name;
				var short_name = "";
				if (op_code.alias == "")
				{
					var __v4 = use("Runtime.rs");
					short_name = __v4.split(".", full_name).last();
				}
				else
				{
					short_name = op_code.alias;
				}
				/* Register module in parser */
				parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["uses"]), parser.uses.setIm(short_name, full_name));
				items.push(op_code);
				var res = parser.parser_base.constructor.matchToken(parser, ";");
				parser = Runtime.rtl.attr(res, 0);
			}
			else if (token.content == "class" || token.content == "struct" || token.content == "static" || token.content == "declare" || token.content == "interface" || token.content == "abstract")
			{
				var item = null;
				var res = this.readClass(parser);
				parser = Runtime.rtl.attr(res, 0);
				item = Runtime.rtl.attr(res, 1);
				item = item.copy(use("Runtime.Map").from({"annotations":annotations,"comments":comments}));
				items.push(item);
				annotations.clear();
				comments.clear();
			}
			else
			{
				break;
			}
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), false);
			var res = parser.parser_base.constructor.readToken(parser);
			look = Runtime.rtl.attr(res, 0);
			token = Runtime.rtl.attr(res, 1);
			parser = Runtime.rtl.setAttr(parser, Runtime.Collection.from(["skip_comments"]), true);
		}
		items.appendItems(comments);
		var __v3 = use("BayLang.OpCodes.OpModule");
		return use("Runtime.Vector").from([parser,new __v3(use("Runtime.Map").from({"uses":parser.uses.toDict(),"items":items,"caret_start":caret_start,"caret_end":parser.caret}))]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.LangBay.ParserBayProgram";
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
});use.add(BayLang.LangBay.ParserBayProgram);
module.exports = BayLang.LangBay.ParserBayProgram;