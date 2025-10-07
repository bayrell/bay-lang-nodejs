"use strict;"
const use = require('bay-lang').use;
const BaseObject = use("Runtime.BaseObject");
/*!
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
BayLang.LangBay.ParserBayClass = class extends BaseObject
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
	 * Read flags
	 */
	readFlags(reader)
	{
		const OpFlags = use("BayLang.OpCodes.OpFlags");
		var caret_start = reader.start();
		var items = new Map();
		var current_flags = OpFlags.getFlags();
		while (!reader.eof() && current_flags.indexOf(reader.nextToken()) >= 0)
		{
			var flag = reader.readToken();
			items.set(flag, true);
		}
		return new OpFlags(Map.create({
			"items": items,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read class item
	 */
	readItem(reader)
	{
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		var next_token = reader.nextTokenComments();
		/* Comment */
		if (next_token == "/")
		{
			return this.parser.parser_base.readComment(reader);
		}
		else if (next_token == "#switch" || next_token == "#ifcode" || next_token == "#ifdef")
		{
			return this.parser.parser_preprocessor.readPreprocessor(reader, OpPreprocessorIfDef.KIND_CLASS_BODY);
		}
		/* Read flags */
		var flags = this.readFlags(reader);
		/* Try to read call function */
		var op_code = this.parser.parser_function.tryReadFunction(reader);
		/* Assign operator */
		if (!op_code)
		{
			op_code = this.parser.parser_operator.readAssign(reader);
		}
		op_code.flags = flags;
		op_code.caret_start = flags.caret_start;
		return op_code;
	}
	
	
	/**
	 * Process items
	 */
	processItems(items)
	{
		const OpComment = use("BayLang.OpCodes.OpComment");
		const OpAssign = use("BayLang.OpCodes.OpAssign");
		const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");
		var result = [];
		var comments = [];
		for (var i = 0; i < items.count(); i++)
		{
			var item = items.get(i);
			if (item instanceof OpComment)
			{
				comments.push(item);
			}
			else if (item instanceof OpAssign)
			{
				result.appendItems(comments);
				result.push(item);
				comments = [];
			}
			else if (item instanceof OpDeclareFunction)
			{
				item.comments = [];
				var line = item.caret_start.y - 1;
				for (var j = comments.count() - 1; j >= 0; j--)
				{
					var op_code = comments.get(j);
					if (op_code.caret_end.y == line)
					{
						item.comments.push(op_code);
						comments.remove(j);
						line = op_code.caret_start.y - 1;
					}
				}
				item.comments.reverse();
				result.appendItems(comments);
				result.push(item);
				comments = [];
			}
			else
			{
				result.push(item);
			}
		}
		return result;
	}
	
	
	/**
	 * Read class body
	 */
	readBody(reader, match_brackets)
	{
		const OpItems = use("BayLang.OpCodes.OpItems");
		if (match_brackets == undefined) match_brackets = true;
		var caret_start = reader.start();
		var items = [];
		if (match_brackets) reader.matchToken("{");
		/* Read class */
		while (!reader.eof() && reader.nextToken() != "}" && reader.nextToken() != "#endswitch" && reader.nextToken() != "#case" && reader.nextToken() != "#endif")
		{
			var op_code = this.readItem(reader);
			if (op_code)
			{
				items.push(op_code);
			}
			else
			{
				break;
			}
			/* Match semicolon */
			if (reader.nextToken() == ";")
			{
				reader.matchToken(";");
			}
		}
		if (match_brackets) reader.matchToken("}");
		/* Process items */
		items = this.processItems(items);
		return new OpItems(Map.create({
			"items": items,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
	}
	
	
	/**
	 * Read class
	 */
	readClass(reader)
	{
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		var caret_start = reader.start();
		/* Read abstract */
		var is_abstract = false;
		if (reader.nextToken() == "abstract")
		{
			is_abstract = true;
			reader.matchToken("abstract");
		}
		/* Read class or interface */
		var is_interface = false;
		if (reader.nextToken() == "interface")
		{
			is_interface = true;
			reader.matchToken("interface");
		}
		else reader.matchToken("class");
		var class_extends = null;
		var class_implements = [];
		/* Read class name */
		var class_name = this.parser.parser_base.readTypeIdentifier(reader, false);
		this.parser.uses.set(class_name.entity_name.getName(), this.parser.current_namespace + String(".") + String(class_name.entity_name.getName()));
		/* Add generics */
		var save_uses = this.parser.uses.copy();
		this.parser.addGenericUse(class_name.generics);
		/* Read extends */
		if (reader.nextToken() == "extends")
		{
			reader.readToken();
			class_extends = this.parser.parser_base.readTypeIdentifier(reader);
		}
		if (reader.nextToken() == "implements")
		{
			reader.readToken();
			while (!reader.eof() && reader.nextToken() != "{" && reader.nextToken() != ";")
			{
				var op_code_item = this.parser.parser_base.readTypeIdentifier(reader);
				class_implements.push(op_code_item);
				if (reader.nextToken() != "{" && reader.nextToken() != ";")
				{
					reader.matchToken(",");
				}
			}
		}
		/*
		if (class_extends == null)
		{
			class_extends = new OpTypeIdentifier
			{
				"entity_name": new OpEntityName
				{
					"items":
					[
						new OpIdentifier
						{
							"value": "BaseObject",
						}
					]
				}
			};
		}*/
		this.parser.current_class = new OpDeclareClass(Map.create({
			"kind": is_interface ? OpDeclareClass.KIND_INTERFACE : OpDeclareClass.KIND_CLASS,
			"name": class_name,
			"is_abstract": is_abstract,
			"class_extends": class_extends,
			"class_implements": class_implements,
			"caret_start": caret_start,
			"caret_end": reader.caret(),
		}));
		if (!is_abstract)
		{
			this.parser.current_class.content = this.readBody(reader);
		}
		else
		{
			if (reader.nextToken() == "{")
			{
				reader.matchToken("{");
				reader.matchToken("}");
			}
			else
			{
				reader.matchToken(";");
			}
		}
		this.parser.uses = save_uses;
		return this.parser.current_class;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.parser = null;
	}
	static getClassName(){ return "BayLang.LangBay.ParserBayClass"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.LangBay.ParserBayClass);
module.exports = {
	"ParserBayClass": BayLang.LangBay.ParserBayClass,
};