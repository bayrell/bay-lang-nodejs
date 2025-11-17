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
BayLang.LangBay.TranslatorBayProgram = class extends use("Runtime.BaseObject")
{
	/**
	 * Constructor
	 */
	constructor(translator)
	{
		super();
		this.translator = translator;
	}
	
	
	/**
	 * OpNamespace
	 */
	OpNamespace(op_code, result)
	{
		result.push("namespace ");
		result.push(op_code.name);
		result.push(";");
		result.push(this.translator.newLine());
	}
	
	
	/**
	 * OpUse
	 */
	OpUse(op_code, result)
	{
		let items = rs.split(".", op_code.name);
		let last_name = items.last();
		result.push("use ");
		result.push(op_code.name);
		if (op_code.alias != "" && op_code.alias != last_name)
		{
			result.push(" as ");
			result.push(op_code.alias);
		}
		result.push(";");
	}
	
	
	/**
	 * OpAnnotation
	 */
	OpAnnotation(op_code, result)
	{
		result.push("@");
		this.translator.expression.OpTypeIdentifier(op_code.name, result);
		this.translator.expression.OpDict(op_code.params, result);
	}
	
	
	/**
	 * OpAssign
	 */
	OpAssign(op_code, result)
	{
		this.translator.operator.OpAssign(op_code, result);
		result.push(";");
	}
	
	
	/**
	 * OpComment
	 */
	OpComment(op_code, result)
	{
		result.push("/*");
		result.push(op_code.value);
		result.push("*/");
	}
	
	
	/**
	 * OpDeclareFunctionArg
	 */
	OpDeclareFunctionArg(op_code, result)
	{
		this.translator.expression.OpTypeIdentifier(op_code.pattern, result);
		result.push(" ");
		result.push(op_code.name);
		if (op_code.expression)
		{
			result.push(" = ");
			this.translator.expression.translate(op_code.expression, result);
		}
	}
	
	
	/**
	 * OpDeclareFunctionArgs
	 */
	OpDeclareFunctionArgs(op_code, result)
	{
		if (op_code.args && op_code.args.count() > 0)
		{
			let args_count = op_code.args.count();
			for (let i = 0; i < args_count; i++)
			{
				let op_code_item = op_code.args.get(i);
				this.OpDeclareFunctionArg(op_code_item, result);
				if (i < args_count - 1) result.push(", ");
			}
		}
	}
	
	
	/**
	 * OpDeclareFunction
	 */
	OpDeclareFunction(op_code, result)
	{
		const OpTypeIdentifier = use("BayLang.OpCodes.OpTypeIdentifier");
		const Vector = use("Runtime.Vector");
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		const OpItems = use("BayLang.OpCodes.OpItems");
		if (!(op_code.pattern instanceof OpTypeIdentifier)) return;
		/* Comments */
		if (op_code.comments)
		{
			for (let i = 0; i < op_code.comments.count(); i++)
			{
				let op_code_item = op_code.comments.get(i);
				this.OpComment(op_code_item, result);
				result.push(this.translator.newLine());
			}
		}
		/* Function flags */
		let flags = new Vector("async", "static", "pure");
		flags = flags.filter((flag_name) => { return op_code.flags ? op_code.flags.isFlag(flag_name) : false; });
		result.push(rs.join(" ", flags));
		if (flags.count() > 0) result.push(" ");
		/* Function result type */
		this.translator.expression.OpTypeIdentifier(op_code.pattern, result);
		/* Function name */
		result.push(" ");
		result.push(op_code.name);
		/* Arguments */
		result.push("(");
		this.OpDeclareFunctionArgs(op_code, result);
		result.push(")");
		/* If interface */
		if (this.translator.current_class && this.translator.current_class.kind == OpDeclareClass.KIND_INTERFACE)
		{
			result.push(";");
			return;
		}
		/* Expression */
		let is_expression = !(op_code.content instanceof OpItems);
		if (is_expression)
		{
			let is_multiline = op_code.content.isMultiLine();
			if (is_multiline)
			{
				result.push(" =>");
				result.push(this.translator.newLine());
			}
			else
			{
				result.push(" => ");
			}
			this.translator.expression.translate(op_code.content, result);
		}
		else
		{
			this.translator.operator.translateItems(op_code.content, result);
		}
	}
	
	
	/**
	 * Translate class item
	 */
	translateClassItem(op_code, result)
	{
		const OpAnnotation = use("BayLang.OpCodes.OpAnnotation");
		const OpAssign = use("BayLang.OpCodes.OpAssign");
		const OpComment = use("BayLang.OpCodes.OpComment");
		const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");
		const OpItems = use("BayLang.OpCodes.OpItems");
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		if (op_code instanceof OpAnnotation)
		{
			this.OpAnnotation(op_code, result);
		}
		else if (op_code instanceof OpAssign)
		{
			this.OpAssign(op_code, result);
		}
		else if (op_code instanceof OpComment)
		{
			this.OpComment(op_code, result);
		}
		else if (op_code instanceof OpDeclareFunction)
		{
			this.OpDeclareFunction(op_code, result);
			if (!(op_code.content instanceof OpItems) && this.translator.current_class.kind != OpDeclareClass.KIND_INTERFACE)
			{
				result.push(";");
			}
		}
		else
		{
			return false;
		}
		return true;
	}
	
	
	/**
	 * Translate class body
	 */
	translateClassBody(op_code, result)
	{
		/* Begin bracket */
		result.push("{");
		this.translator.levelInc();
		/* Class body items */
		let prev_op_code = null;
		let next_new_line = true;
		for (let i = 0; i < op_code.content.count(); i++)
		{
			let op_code_item = op_code.content.get(i);
			if (next_new_line)
			{
				let lines = 1;
				if (prev_op_code)
				{
					lines = op_code_item.getOffset().get("start") - prev_op_code.getOffset().get("end");
				}
				for (let j = 0; j < lines; j++) result.push(this.translator.newLine());
			}
			next_new_line = this.translateClassItem(op_code_item, result);
			prev_op_code = op_code_item;
		}
		/* End bracket */
		this.translator.levelDec();
		result.push(this.translator.newLine());
		result.push("}");
	}
	
	
	/**
	 * Translate class
	 */
	translateClass(op_code, result)
	{
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		/* Current class */
		this.translator.current_class = op_code;
		/* Abstract class */
		if (op_code.is_abstract) result.push("abstract ");
		/* Class kind */
		if (op_code.kind == OpDeclareClass.KIND_CLASS)
		{
			result.push("class ");
		}
		else if (op_code.kind == OpDeclareClass.KIND_INTERFACE)
		{
			result.push("interface ");
		}
		/* Class name */
		this.translator.expression.OpTypeIdentifier(op_code.name, result);
		/* Template */
		if (op_code.template)
		{
			this.translator.expression.OpTypeTemplate(op_code.template, result);
		}
		/* Extends */
		if (op_code.class_extends)
		{
			result.push(" extends ");
			this.translator.expression.OpTypeIdentifier(op_code.class_extends, result);
		}
		/* Implements */
		if (op_code.class_implements && op_code.class_implements.count() > 0)
		{
			result.push(" implements ");
			let items_count = op_code.class_implements.count();
			for (let i = 0; i < items_count; i++)
			{
				let op_code_item = op_code.class_implements.get(i);
				this.translator.expression.OpTypeIdentifier(op_code_item, result);
				if (i < items_count - 1) result.push(", ");
			}
		}
		/* Class body */
		if (!op_code.is_abstract)
		{
			result.push(this.translator.newLine());
			this.translateClassBody(op_code, result);
		}
		else result.push(";");
		this.translator.current_class = null;
	}
	
	
	/**
	 * Translate item
	 */
	translateItem(op_code, result)
	{
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		const OpNamespace = use("BayLang.OpCodes.OpNamespace");
		const OpUse = use("BayLang.OpCodes.OpUse");
		if (op_code instanceof OpDeclareClass)
		{
			this.translateClass(op_code, result);
		}
		else if (op_code instanceof OpNamespace)
		{
			this.OpNamespace(op_code, result);
		}
		else if (op_code instanceof OpUse)
		{
			this.OpUse(op_code, result);
		}
		else
		{
			this.translator.last_semicolon = false;
			this.translator.operator.translateItem(op_code, result);
			this.translator.operator.addSemicolon(op_code, result);
		}
	}
	
	
	/**
	 * Translate items
	 */
	translateItems(items, result)
	{
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		const OpUse = use("BayLang.OpCodes.OpUse");
		let op_code_use_count = 0;
		let prev_op_code_use = false;
		for (let i = 0; i < items.count(); i++)
		{
			let op_code_item = items.get(i);
			if (op_code_item instanceof OpDeclareClass)
			{
				if (op_code_use_count > 0)
				{
					result.push(this.translator.newLine(op_code_use_count > 1 ? 3 : 2));
				}
				else
				{
					result.push(this.translator.newLine(3));
				}
			}
			else if (i > 0) result.push(this.translator.newLine());
			if (op_code_item instanceof OpUse) op_code_use_count++;
			else op_code_use_count = 0;
			this.translateItem(items.get(i), result);
		}
	}
	
	
	/**
	 * Translate
	 */
	translate(op_code, result)
	{
		this.translateItems(op_code.items, result);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.translator = null;
	}
	static getClassName(){ return "BayLang.LangBay.TranslatorBayProgram"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangBay.TranslatorBayProgram);
module.exports = {
	"TranslatorBayProgram": BayLang.LangBay.TranslatorBayProgram,
};