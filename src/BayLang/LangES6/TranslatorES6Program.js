"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
const rtl = use("Runtime.rtl");
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
if (typeof BayLang.LangES6 == 'undefined') BayLang.LangES6 = {};
BayLang.LangES6.TranslatorES6Program = class extends BaseObject
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
		var arr = rs.split(".", op_code.name);
		for (var i = 0; i < arr.count(); i++)
		{
			var name = rs.join(".", arr.slice(0, i + 1));
			result.push("if (typeof " + String(name) + String(" == 'undefined') ") + String(name) + String(" = {};"));
			if (i < arr.count() - 1) result.push(this.translator.newLine());
		}
	}
	
	
	/**
	 * OpUse
	 */
	OpUse(op_code, result)
	{
		this.translator.uses.set(op_code.alias, op_code.name);
		return false;
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
			if (op_code.isStatic()) result.push("static ");
			if (op_code_item.value instanceof OpIdentifier)
			{
				this.translator.expression.OpIdentifier(op_code_item.value, result);
			}
			else
			{
				last_result = false;
				continue;
			}
			if (op_code_item.expression && is_expression)
			{
				result.push(" = ");
				this.translator.expression.translate(op_code_item.expression, result);
			}
			result.push(";");
			last_result = true;
		}
		return true;
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
			var args_count = op_code.args.count();
			for (var i = 0; i < args_count; i++)
			{
				var op_code_item = op_code.args.get(i);
				result.push(op_code_item.name);
				if (i < args_count - 1) result.push(", ");
			}
		}
	}
	
	
	/**
	 * OpDeclareFunctionInitArgs
	 */
	OpDeclareFunctionInitArgs(op_code, result, is_multiline)
	{
		if (is_multiline == undefined) is_multiline = true;
		if (op_code.args && op_code.args.count() > 0)
		{
			var args_count = op_code.args.count();
			for (var i = 0; i < args_count; i++)
			{
				var op_code_item = op_code.args.get(i);
				if (op_code_item.expression != null)
				{
					if (is_multiline)
					{
						result.push(this.translator.newLine());
					}
					result.push("if (" + String(op_code_item.name) + String(" == undefined) "));
					result.push(op_code_item.name + String(" = "));
					this.translator.expression.translate(op_code_item.expression, result);
					result.push(";");
				}
			}
		}
	}
	
	
	/**
	 * OpDeclareFunction
	 */
	OpDeclareFunction(op_code, result)
	{
		const OpTypeIdentifier = use("BayLang.OpCodes.OpTypeIdentifier");
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
		if (op_code.flags)
		{
			var flags = [];
			if (op_code.flags.isFlag("static") || op_code.flags.isFlag("pure")) flags.push("static");
			if (op_code.flags.isFlag("async")) flags.push("async");
			result.push(rs.join(" ", flags));
			if (flags.count() > 0) result.push(" ");
		}
		/* Function name */
		result.push(op_code.name);
		/* Arguments */
		result.push("(");
		this.OpDeclareFunctionArgs(op_code, result);
		result.push(")");
		/* Add arrow */
		if (this.translator.is_operator_block)
		{
			result.push(" =>");
		}
		/* Multiline */
		var is_multiline = op_code.content.isMultiLine() || op_code.content instanceof OpItems;
		if (is_multiline)
		{
			result.push(this.translator.newLine());
		}
		else
		{
			if (this.translator.is_operator_block) result.push(" ");
		}
		result.push("{");
		if (is_multiline)
		{
			this.translator.levelInc();
			if (!(op_code.content instanceof OpItems))
			{
				result.push(this.translator.newLine());
			}
		}
		else
		{
			result.push(" ");
		}
		/* Save modules */
		var save_use_modules = this.translator.setUseModules();
		/* Expression */
		var result1 = [];
		var is_expression = !(op_code.content instanceof OpItems);
		if (is_expression)
		{
			this.OpDeclareFunctionInitArgs(op_code, result1, is_multiline);
			result1.push("return ");
			var save_operator_block = this.translator.is_operator_block;
			this.translator.is_operator_block = true;
			this.translator.expression.translate(op_code.content, result1);
			this.translator.is_operator_block = save_operator_block;
			result1.push(";");
		}
		else
		{
			this.OpDeclareFunctionInitArgs(op_code, result1);
			this.translator.operator.translateItems(op_code.content, result1, false);
		}
		/* Add modules */
		this.translator.addUseModules(result, is_multiline);
		result.appendItems(result1);
		/* Restore */
		this.translator.setUseModules(save_use_modules);
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
			if (op_code.isStatic())
			{
				return this.OpAssign(op_code, result);
			}
			return true;
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
		const OpAssign = use("BayLang.OpCodes.OpAssign");
		result.push(this.translator.newLine((op_code.content.count() > 0) ? 3 : 1));
		result.push("/* ========= Class init functions ========= */");
		result.push(this.translator.newLine());
		result.push("_init()");
		result.push(this.translator.newLine());
		result.push("{");
		this.translator.levelInc();
		if (op_code.class_extends)
		{
			result.push(this.translator.newLine());
			result.push("super._init();");
		}
		var save_use_modules = this.translator.setUseModules();
		var result1 = [];
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
						result1.push(this.translator.newLine());
						result1.push("this." + String(assign_item.value.value) + String(" = "));
						this.translator.expression.translate(assign_item.expression, result1);
						result1.push(";");
						is_assign_first = false;
					}
				}
			}
		}
		this.translator.addUseModules(result);
		this.translator.setUseModules(save_use_modules);
		result.appendItems(result1);
		this.translator.levelDec();
		result.push(this.translator.newLine());
		result.push("}");
		result.push(this.translator.newLine());
		result.push("static getClassName(){ " + String("return \"") + String(this.translator.current_class_name) + String("\"; }"));
		result.push(this.translator.newLine());
		result.push("static getMethodsList(){ return []; }");
		result.push(this.translator.newLine());
		result.push("static getMethodInfoByName(field_name){ return null; }");
		/* Implements */
		if (op_code.class_implements)
		{
			var class_implements = op_code.class_implements.map((class_name) =>
			{
				return this.translator.toString(this.translator.getFullName(class_name.entity_name.getName()));
			});
			result.push(this.translator.newLine());
			result.push("static getInterfaces(field_name){ return [" + String(rs.join(",", class_implements)) + String("]; }"));
		}
	}
	
	
	/**
	 * Translate class
	 */
	translateClass(op_code, result)
	{
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		if (op_code.kind == OpDeclareClass.KIND_INTERFACE) return false;
		/* Class name */
		var class_name = op_code.name.entity_name.items.last().value;
		this.translator.parent_class_name = "";
		this.translator.current_class_name = this.translator.current_namespace_name + String(".") + String(op_code.name.entity_name.getName());
		/* Add use */
		this.translator.uses.set(class_name, this.translator.current_class_name);
		this.translator.class_items.set(class_name, this.translator.current_class_name);
		/* Abstract class */
		if (op_code.is_abstract)
		{
			return false;
		}
		/* Define class */
		result.push(this.translator.current_class_name + String(" = class"));
		/* Extends */
		if (op_code.class_extends)
		{
			result.push(" extends ");
			this.translator.expression.OpTypeIdentifier(op_code.class_extends, result);
			this.translator.parent_class_name = this.translator.getFullName(op_code.class_extends.entity_name.getName());
		}
		result.push(this.translator.newLine());
		this.translateClassBody(op_code, result);
		result.push(";");
		/* Register class */
		if (this.translator.use_module_name)
		{
			result.push(this.translator.newLine());
			result.push("use.add(" + String(this.translator.current_class_name) + String(");"));
		}
		if (this.translator.use_window)
		{
			result.push(this.translator.newLine());
			result.push("window[\"" + String(this.translator.current_class_name) + String("\"] = ") + String(this.translator.current_class_name) + String(";"));
		}
		return true;
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
			return this.translateClass(op_code, result);
		}
		else if (op_code instanceof OpNamespace)
		{
			this.OpNamespace(op_code, result);
		}
		else if (op_code instanceof OpUse)
		{
			return this.OpUse(op_code, result);
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
		var op_code_use_count = 0;
		var prev_op_code_use = false;
		var last_result = false;
		var prev_op_code = null;
		for (var i = 0; i < items.count(); i++)
		{
			var op_code_item = items.get(i);
			if (last_result)
			{
				result.push(this.translator.newLine());
			}
			last_result = this.translateItem(items.get(i), result);
			prev_op_code = op_code_item;
		}
	}
	
	
	/**
	 * Add exports
	 */
	addModuleExports(result)
	{
		result.push(this.translator.newLine());
		result.push("module.exports = {");
		this.translator.levelInc();
		var keys = rtl.list(this.translator.class_items.keys());
		for (var i = 0; i < keys.count(); i++)
		{
			var class_name = keys.get(i);
			result.push(this.translator.newLine());
			result.push(this.translator.toString(class_name) + String(": ") + String(this.translator.uses.get(class_name)) + String(","));
		}
		this.translator.levelDec();
		result.push(this.translator.newLine());
		result.push("};");
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
	static getClassName(){ return "BayLang.LangES6.TranslatorES6Program"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.LangES6.TranslatorES6Program);
module.exports = {
	"TranslatorES6Program": BayLang.LangES6.TranslatorES6Program,
};