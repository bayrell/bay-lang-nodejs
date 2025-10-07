"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
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
if (typeof BayLang.LangPHP == 'undefined') BayLang.LangPHP = {};
BayLang.LangPHP.TranslatorPHPProgram = class extends BaseObject
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
		this.translator.current_namespace_name = op_code.name;
		result.push("namespace ");
		result.push(this.translator.getModuleName(op_code.name));
		result.push(";");
	}
	
	
	/**
	 * OpUse
	 */
	OpUse(op_code, result)
	{
		this.translator.uses.set(op_code.alias, op_code.name);
		var items = rs.split(".", op_code.name);
		var last_name = items.last();
		result.push("use ");
		result.push(this.translator.getModuleName(op_code.name));
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
	OpAssign(op_code, result, is_expression)
	{
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		if (is_expression == undefined) is_expression = true;
		var last_result = false;
		for (var i = 0; i < op_code.items.count(); i++)
		{
			var op_code_item = op_code.items.get(i);
			if (last_result)
			{
				result.push(this.translator.newLine());
			}
			if (op_code_item.value instanceof OpIdentifier)
			{
				if (op_code.flags.isFlag("const"))
				{
					result.push("const ");
				}
				else if (op_code.flags.isFlag("static"))
				{
					result.push("static ");
				}
				else
				{
					result.push("var ");
				}
				this.translator.expression.OpIdentifier(op_code_item.value, result);
			}
			else
			{
				last_result = false;
				continue;
			}
			if (op_code_item.expression && (is_expression || op_code.isStatic()))
			{
				result.push(" = ");
				this.translator.expression.translate(op_code_item.expression, result);
			}
			result.push(";");
			last_result = true;
		}
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
	 * OpPreprocessorIfCode
	 */
	OpPreprocessorIfCode(op_code, result)
	{
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		if (op_code.condition instanceof OpIdentifier)
		{
			var name = op_code.condition.value;
			if (this.translator.preprocessor_flags.get(name))
			{
				result.push(op_code.content);
				return true;
			}
		}
		return false;
	}
	
	
	/**
	 * OpPreprocessorIfDef
	 */
	OpPreprocessorIfDef(op_code, result, current_block)
	{
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		if (current_block == undefined) current_block = "";
		if (op_code.condition instanceof OpIdentifier)
		{
			var name = op_code.condition.value;
			if (this.translator.preprocessor_flags.get(name))
			{
				if (current_block == OpPreprocessorIfDef.KIND_PROGRAM)
				{
					this.translate(op_code.content, result);
				}
				else if (current_block == OpPreprocessorIfDef.KIND_CLASS_BODY)
				{
					this.translateClassBody(op_code, result, false);
				}
				else if (current_block == OpPreprocessorIfDef.KIND_OPERATOR)
				{
					this.translator.operator.translateItems(op_code.content, result, false);
				}
				else if (current_block == OpPreprocessorIfDef.KIND_COLLECTION)
				{
					for (var i = 0; i < op_code.content.items.count(); i++)
					{
						var op_code_item = op_code.content.items.get(i);
						if (i > 0) result.push(this.translator.newLine());
						this.translator.expression.translate(op_code_item, result);
						if (i < op_code.content.items.count() - 1) result.push(",");
					}
				}
				else if (current_block == OpPreprocessorIfDef.KIND_EXPRESSION)
				{
					this.translator.expression.translate(op_code.content, result);
				}
				return true;
			}
		}
		return false;
	}
	
	
	/**
	 * OpPreprocessorSwitch
	 */
	OpPreprocessorSwitch(op_code, result, current_block)
	{
		const OpPreprocessorIfCode = use("BayLang.OpCodes.OpPreprocessorIfCode");
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		if (current_block == undefined) current_block = "";
		var last_result = false;
		for (var i = 0; i < op_code.items.count(); i++)
		{
			var item = op_code.items.get(i);
			if (item instanceof OpPreprocessorIfCode)
			{
				var result1 = [];
				if (this.OpPreprocessorIfCode(item, result1))
				{
					result.push(this.translator.newLine());
					result.appendItems(result1);
					last_result = true;
				}
			}
			else if (item instanceof OpPreprocessorIfDef)
			{
				if (this.OpPreprocessorIfDef(item, result, current_block))
				{
					last_result = true;
				}
			}
		}
		return last_result;
	}
	
	
	/**
	 * OpDeclareFunctionArg
	 */
	OpDeclareFunctionArg(op_code, result)
	{
		result.push("$" + String(op_code.name));
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
			var args_count = op_code.args.count();
			for (var i = 0; i < args_count; i++)
			{
				var op_code_item = op_code.args.get(i);
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
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		const OpItems = use("BayLang.OpCodes.OpItems");
		if (!(op_code.pattern instanceof OpTypeIdentifier)) return;
		/* Comments */
		if (op_code.comments)
		{
			for (var i = 0; i < op_code.comments.count(); i++)
			{
				var op_code_item = op_code.comments.get(i);
				this.OpComment(op_code_item, result);
				result.push(this.translator.newLine());
			}
		}
		/* Function flags */
		if (op_code.flags && (op_code.flags.isFlag("static") || op_code.flags.isFlag("pure")))
		{
			result.push("static ");
		}
		/* Function name */
		result.push("function " + String(op_code.name));
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
		/* Variables */
		if (op_code.vars && op_code.vars.count() > 0)
		{
			result.push(" use (");
			var vars = op_code.vars.map((item) => { return "&$" + String(item.value); });
			result.push(rs.join(", ", vars));
			result.push(")");
		}
		/* If content is empty */
		if (op_code.content == null)
		{
			result.push("{");
			result.push("}");
			return;
		}
		/* Expression */
		var is_expression = !(op_code.content instanceof OpItems);
		if (is_expression)
		{
			var is_multiline = op_code.content.isMultiLine();
			if (is_multiline)
			{
				result.push(this.translator.newLine());
			}
			result.push("{");
			if (is_multiline)
			{
				this.translator.levelInc();
				result.push(this.translator.newLine());
			}
			else
			{
				result.push(" ");
			}
			result.push("return ");
			this.translator.expression.translate(op_code.content, result);
			result.push(";");
			if (is_multiline)
			{
				this.translator.levelDec();
				result.push(this.translator.newLine());
			}
			else
			{
				result.push(" ");
			}
			result.push("}");
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
		const OpPreprocessorIfCode = use("BayLang.OpCodes.OpPreprocessorIfCode");
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		const OpPreprocessorSwitch = use("BayLang.OpCodes.OpPreprocessorSwitch");
		if (op_code instanceof OpAnnotation)
		{
			this.OpAnnotation(op_code, result);
		}
		else if (op_code instanceof OpAssign)
		{
			this.OpAssign(op_code, result, false);
		}
		else if (op_code instanceof OpComment)
		{
			this.OpComment(op_code, result);
		}
		else if (op_code instanceof OpDeclareFunction)
		{
			this.translator.class_function = op_code;
			this.OpDeclareFunction(op_code, result);
			this.translator.class_function = null;
		}
		else if (op_code instanceof OpPreprocessorIfCode)
		{
			return this.OpPreprocessorIfCode(op_code, result);
		}
		else if (op_code instanceof OpPreprocessorIfDef)
		{
			return this.OpPreprocessorIfDef(op_code, result, OpPreprocessorIfDef.KIND_CLASS_BODY);
		}
		else if (op_code instanceof OpPreprocessorSwitch)
		{
			return this.OpPreprocessorSwitch(op_code, result, OpPreprocessorSwitch.KIND_CLASS_BODY);
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
	translateClassBody(op_code, result, match_brackets)
	{
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		if (match_brackets == undefined) match_brackets = true;
		/* Begin bracket */
		if (match_brackets)
		{
			result.push("{");
			this.translator.levelInc();
		}
		/* Class body items */
		var prev_op_code = null;
		var next_new_line = true;
		for (var i = 0; i < op_code.content.count(); i++)
		{
			var item_result = [];
			var op_code_item = op_code.content.get(i);
			if (next_new_line)
			{
				var lines = 1;
				if (prev_op_code)
				{
					lines = op_code_item.getOffset().get("start") - prev_op_code.getOffset().get("end");
				}
				for (var j = 0; j < lines; j++) item_result.push(this.translator.newLine());
			}
			next_new_line = this.translateClassItem(op_code_item, item_result);
			if (rs.trim(rs.join("", item_result)) != "") result.appendItems(item_result);
			prev_op_code = op_code_item;
		}
		/* Class init */
		if (op_code instanceof OpDeclareClass)
		{
			this.translateClassInit(op_code, result);
		}
		/* End bracket */
		if (match_brackets)
		{
			this.translator.levelDec();
			result.push(this.translator.newLine());
			result.push("}");
		}
	}
	
	
	/**
	 * Translate class init
	 */
	translateClassInit(op_code, result)
	{
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		const OpAssign = use("BayLang.OpCodes.OpAssign");
		if (op_code.kind == OpDeclareClass.KIND_INTERFACE) return;
		result.push(this.translator.newLine((op_code.content.count() > 0) ? 3 : 1));
		result.push("/* ========= Class init functions ========= */");
		result.push(this.translator.newLine());
		result.push("function _init()");
		result.push(this.translator.newLine());
		result.push("{");
		this.translator.levelInc();
		result.push(this.translator.newLine());
		if (op_code.class_extends)
		{
			result.push("parent::_init();");
			result.push(this.translator.newLine());
		}
		var is_assign_first = true;
		for (var i = 0; i < op_code.content.items.count(); i++)
		{
			var op_code_item = op_code.content.items.get(i);
			if (op_code_item instanceof OpAssign && !op_code_item.isStatic())
			{
				for (var j = 0; j < op_code_item.items.count(); j++)
				{
					var assign_item = op_code_item.items.get(j);
					if (assign_item.expression)
					{
						if (!is_assign_first) result.push(this.translator.newLine());
						result.push("$this->" + String(assign_item.value.value) + String(" = "));
						this.translator.expression.translate(assign_item.expression, result);
						result.push(";");
						is_assign_first = false;
					}
				}
			}
		}
		this.translator.levelDec();
		result.push(this.translator.newLine());
		result.push("}");
		result.push(this.translator.newLine());
		result.push("static function getClassName(){ " + String("return \"") + String(this.translator.current_class_name) + String("\"; }"));
		result.push(this.translator.newLine());
		result.push("static function getMethodsList(){ return []; }");
		result.push(this.translator.newLine());
		result.push("static function getMethodInfoByName($field_name){ return null; }");
	}
	
	
	/**
	 * Translate class
	 */
	translateClass(op_code, result)
	{
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		/* Current class */
		this.translator.current_class = op_code;
		/* Class name */
		var class_name = op_code.name.entity_name.items.last().value;
		this.translator.current_class_name = this.translator.current_namespace_name + String(".") + String(op_code.name.entity_name.getName());
		this.translator.uses.set(class_name, this.translator.current_class_name);
		/* Abstract class */
		if (op_code.is_abstract) return false;
		/* Class kind */
		if (op_code.kind == OpDeclareClass.KIND_CLASS)
		{
			result.push("class ");
		}
		else if (op_code.kind == OpDeclareClass.KIND_INTERFACE)
		{
			result.push("interface ");
		}
		result.push(class_name);
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
			var items_count = op_code.class_implements.count();
			for (var i = 0; i < items_count; i++)
			{
				var op_code_item = op_code.class_implements.get(i);
				this.translator.expression.OpTypeIdentifier(op_code_item, result);
				if (i < items_count - 1) result.push(", ");
			}
		}
		result.push(this.translator.newLine());
		this.translateClassBody(op_code, result);
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
		const OpPreprocessorIfCode = use("BayLang.OpCodes.OpPreprocessorIfCode");
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		const OpPreprocessorSwitch = use("BayLang.OpCodes.OpPreprocessorSwitch");
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
		else if (op_code instanceof OpPreprocessorIfCode)
		{
			return this.OpPreprocessorIfCode(op_code, result);
		}
		else if (op_code instanceof OpPreprocessorIfDef)
		{
			return this.OpPreprocessorIfDef(op_code, result, OpPreprocessorIfDef.KIND_PROGRAM);
		}
		else if (op_code instanceof OpPreprocessorSwitch)
		{
			return this.OpPreprocessorSwitch(op_code, result, OpPreprocessorSwitch.KIND_PROGRAM);
		}
		else
		{
			this.translator.last_semicolon = false;
			var res = this.translator.operator.translateItem(op_code, result);
			this.translator.operator.addSemicolon(op_code, result);
			return res;
		}
		return true;
	}
	
	
	/**
	 * Translate items
	 */
	translateItems(items, result)
	{
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		const OpUse = use("BayLang.OpCodes.OpUse");
		var op_code_use_count = 0;
		var prev_op_code_use = false;
		var last_result = false;
		for (var i = 0; i < items.count(); i++)
		{
			var op_code_item = items.get(i);
			if (op_code_item instanceof OpDeclareClass)
			{
				if (!op_code_item.is_abstract)
				{
					if (op_code_use_count > 0)
					{
						result.push(this.translator.newLine((op_code_use_count > 1) ? 3 : 2));
					}
					else
					{
						result.push(this.translator.newLine(last_result ? 3 : 2));
					}
				}
			}
			else if (last_result) result.push(this.translator.newLine());
			if (op_code_item instanceof OpUse)
			{
				if (op_code_use_count == 0) result.push(this.translator.newLine());
				op_code_use_count++;
			}
			else op_code_use_count = 0;
			last_result = this.translateItem(items.get(i), result);
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
	static getClassName(){ return "BayLang.LangPHP.TranslatorPHPProgram"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.LangPHP.TranslatorPHPProgram);
module.exports = {
	"TranslatorPHPProgram": BayLang.LangPHP.TranslatorPHPProgram,
};