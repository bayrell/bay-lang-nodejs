"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
const rtl = use("Runtime.rtl");
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
if (typeof BayLang.LangES6 == 'undefined') BayLang.LangES6 = {};
BayLang.LangES6.TranslatorES6Program = class extends use("Runtime.BaseObject")
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
		let arr = rs.split(".", op_code.name);
		for (let i = 0; i < arr.count(); i++)
		{
			let name = rs.join(".", arr.slice(0, i + 1));
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
	OpAnnotation(annotations, result)
	{
		result.push("return new Vector(");
		this.translator.levelInc();
		for (let j = 0; j < annotations.count(); j++)
		{
			let annotation = annotations.get(j);
			result.push(this.translator.newLine());
			result.push("new ");
			this.translator.expression.OpTypeIdentifier(annotation.name, result);
			result.push("(");
			if (annotation.params != null)
			{
				this.translator.expression.OpDict(annotation.params, result);
			}
			result.push(")");
			if (j < annotations.count() - 1)
			{
				result.push(",");
				result.push(this.translator.newLine());
			}
		}
		this.translator.levelDec();
		result.push(this.translator.newLine());
		result.push(");");
	}
	
	
	/**
	 * OpAssign
	 */
	OpAssign(op_code, result, is_expression)
	{
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		if (is_expression == undefined) is_expression = true;
		let last_result = false;
		for (let i = 0; i < op_code.items.count(); i++)
		{
			let op_code_item = op_code.items.get(i);
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
		let lines = rs.split("\n", op_code.value);
		if (lines.count() == 1)
		{
			result.push("/*");
			result.push(op_code.value);
			result.push("*/");
			return;
		}
		let first_line = rs.trim(lines.get(0));
		let is_comment_function = first_line == "*";
		if (first_line == "" || first_line == "*") lines = lines.slice(1);
		if (rs.trim(lines.get(lines.count() - 1)) == "" && lines.count() > 1)
		{
			lines = lines.slice(0, lines.count() - 1);
		}
		if (is_comment_function) result.push("/**");
		else result.push("/*");
		for (let i = 0; i < lines.count(); i++)
		{
			let line = lines.get(i);
			let start = 0;
			let len = rs.strlen(line);
			while (start < len && (rs.charAt(line, start) == " " || rs.charAt(line, start) == "\t")) start++;
			if (start < len && rs.charAt(line, start) == "*") start++;
			result.push(this.translator.newLine());
			if (is_comment_function) result.push(" *");
			result.push(rs.substr(line, start));
		}
		result.push(this.translator.newLine());
		if (is_comment_function) result.push(" */");
		else result.push("*/");
	}
	
	
	/**
	 * OpPreprocessorIfCode
	 */
	OpPreprocessorIfCode(op_code, result)
	{
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		if (op_code.condition instanceof OpIdentifier)
		{
			let name = op_code.condition.value;
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
			let name = op_code.condition.value;
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
				else if (current_block == OpPreprocessorIfDef.KIND_CLASS_INIT)
				{
					this.translator.html.OpDeclareComponentDataItems(op_code.content, result);
				}
				else if (current_block == OpPreprocessorIfDef.KIND_COMPONENT_BODY)
				{
					return this.translator.html.translateComponentBodyItem(op_code.content, result, false);
				}
				else if (current_block == OpPreprocessorIfDef.KIND_OPERATOR)
				{
					this.translator.operator.translateItems(op_code.content, result, false);
				}
				else if (current_block == OpPreprocessorIfDef.KIND_COLLECTION)
				{
					for (let i = 0; i < op_code.content.items.count(); i++)
					{
						let op_code_item = op_code.content.items.get(i);
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
		const Vector = use("Runtime.Vector");
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		if (current_block == undefined) current_block = "";
		let last_result = false;
		for (let i = 0; i < op_code.items.count(); i++)
		{
			let item = op_code.items.get(i);
			if (item instanceof OpPreprocessorIfCode)
			{
				let result1 = new Vector();
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
			let args_count = op_code.args.count();
			for (let i = 0; i < args_count; i++)
			{
				let op_code_item = op_code.args.get(i);
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
			let args_count = op_code.args.count();
			for (let i = 0; i < args_count; i++)
			{
				let op_code_item = op_code.args.get(i);
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
		const Vector = use("Runtime.Vector");
		const OpItems = use("BayLang.OpCodes.OpItems");
		/*if (not (op_code.pattern instanceof OpTypeIdentifier)) return;*/
		if (op_code.is_html)
		{
			this.html.OpDeclareFunction(op_code, result);
			return;
		}
		let is_component = this.translator.current_class.is_component;
		/* Setup current function */
		let old_function = this.translator.current_function;
		this.translator.current_function = op_code;
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
		let flags = new Vector();
		if (op_code.flags)
		{
			if (!is_component && (op_code.flags.isFlag("static") || op_code.flags.isFlag("pure")))
			{
				flags.push("static");
			}
			if (op_code.flags.isFlag("async")) flags.push("async");
		}
		/* Add flags if class is not component */
		if (!is_component)
		{
			result.push(rs.join(" ", flags));
			if (flags.count() > 0) result.push(" ");
		}
		/* Function name */
		if (old_function == null) result.push(op_code.name);
		/* Add flags if class is component */
		if (is_component)
		{
			if (old_function == null)
			{
				flags.push("function");
				result.push(": ");
			}
			result.push(rs.join(" ", flags));
		}
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
		let is_multiline = this.translator.allow_multiline && (op_code.content.isMultiLine() || op_code.content instanceof OpItems);
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
		}
		else
		{
			result.push(" ");
		}
		/* Save modules */
		let save_use_modules = this.translator.setUseModules();
		/* Expression */
		let result1 = new Vector();
		let is_expression = !(op_code.content instanceof OpItems);
		if (is_expression)
		{
			this.OpDeclareFunctionInitArgs(op_code, result1, is_multiline);
			if (is_multiline) result1.push(this.translator.newLine());
			result1.push("return ");
			let save_operator_block = this.translator.is_operator_block;
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
		/* Restore function */
		this.translator.current_function = old_function;
	}
	
	
	/**
	 * Translate class item
	 */
	translateClassItem(op_code, result)
	{
		const OpAssign = use("BayLang.OpCodes.OpAssign");
		const OpComment = use("BayLang.OpCodes.OpComment");
		const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");
		const OpPreprocessorIfCode = use("BayLang.OpCodes.OpPreprocessorIfCode");
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		const OpPreprocessorSwitch = use("BayLang.OpCodes.OpPreprocessorSwitch");
		if (op_code instanceof OpAssign)
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
			if (op_code.is_html) this.translator.html.OpDeclareFunction(op_code, result);
			else this.OpDeclareFunction(op_code, result);
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
			return this.OpPreprocessorSwitch(op_code, result, OpPreprocessorIfDef.KIND_CLASS_BODY);
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
		const Vector = use("Runtime.Vector");
		const OpAssign = use("BayLang.OpCodes.OpAssign");
		const OpAnnotation = use("BayLang.OpCodes.OpAnnotation");
		const OpComment = use("BayLang.OpCodes.OpComment");
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		if (match_brackets == undefined) match_brackets = true;
		/* Begin bracket */
		if (match_brackets)
		{
			result.push("{");
			this.translator.levelInc();
		}
		/* Class body items */
		let prev_op_code = null;
		let result_count = result.count();
		let next_new_line = true, prev_next_new_line = true, is_first = true;
		for (let i = 0; i < op_code.content.count(); i++)
		{
			let item_result = new Vector();
			let op_code_item = op_code.content.get(i);
			if (op_code_item instanceof OpAssign && !op_code_item.isStatic() || op_code_item instanceof OpAnnotation || op_code_item instanceof OpComment)
			{
				/*prev_op_code = null;*/
				continue;
			}
			if (next_new_line)
			{
				let lines = !is_first ? 3 : 1;
				if (prev_op_code instanceof OpAssign && op_code_item instanceof OpAssign)
				{
					lines = 1;
					prev_op_code = null;
				}
				for (let j = 0; j < lines; j++) item_result.push(this.translator.newLine());
			}
			prev_op_code = op_code_item;
			prev_next_new_line = next_new_line;
			next_new_line = this.translateClassItem(op_code_item, item_result);
			if (rs.trim(rs.join("", item_result)) != "")
			{
				is_first = false;
				result.appendItems(item_result);
			}
			else next_new_line = prev_next_new_line;
		}
		/* Class init */
		if (op_code instanceof OpDeclareClass)
		{
			this.translateClassInit(op_code, result, result_count != result.count());
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
	 * Translate class init item
	 */
	translateClassInitItem(op_code, result)
	{
		const OpAssign = use("BayLang.OpCodes.OpAssign");
		if (op_code instanceof OpAssign && !op_code.isStatic())
		{
			for (let j = 0; j < op_code.items.count(); j++)
			{
				let assign_item = op_code.items.get(j);
				if (assign_item.expression)
				{
					result.push(this.translator.newLine());
					result.push("this." + String(assign_item.value.value) + String(" = "));
					this.translator.expression.translate(assign_item.expression, result);
					result.push(";");
				}
			}
		}
	}
	
	
	/**
	 * Translate class init
	 */
	translateClassInit(op_code, result, newline)
	{
		const Vector = use("Runtime.Vector");
		if (newline == undefined) newline = true;
		if (!op_code.is_component)
		{
			result.push(this.translator.newLine((newline && op_code.content.count() > 0) ? 3 : 1));
			result.push("/* ========= Class init functions ========= */");
			result.push(this.translator.newLine());
			result.push("_init()");
			result.push(this.translator.newLine());
			result.push("{");
			this.translator.levelInc();
			if (this.translator.parent_class_name != "")
			{
				result.push(this.translator.newLine());
				result.push("super._init();");
			}
			let save_use_modules = this.translator.setUseModules();
			let result1 = new Vector();
			for (let i = 0; i < op_code.content.items.count(); i++)
			{
				let op_code_item = op_code.content.items.get(i);
				this.translateClassInitItem(op_code_item, result1);
			}
			this.translator.addUseModules(result);
			this.translator.setUseModules(save_use_modules);
			result.appendItems(result1);
			this.translator.levelDec();
			result.push(this.translator.newLine());
			result.push("}");
		}
		if (!op_code.is_component)
		{
			result.push(this.translator.newLine());
			/* Get class name */
			result.push("static getClassName(){ ");
			result.push("return \"" + String(this.translator.current_class_name) + String("\"; }"));
			result.push(this.translator.newLine());
			/* Get class annotations */
			if (op_code.annotations.count() > 0)
			{
				result.push("static getClassInfo()");
				result.push(this.translator.newLine());
				result.push("{");
				this.translator.levelInc();
				let result1 = new Vector();
				let save_use_modules = this.translator.setUseModules();
				result1.push(this.translator.newLine());
				this.OpAnnotation(op_code.annotations, result1);
				this.translator.addUseModules(result);
				result.appendItems(result1);
				this.translator.setUseModules(save_use_modules);
				this.translator.levelDec();
				result.push(this.translator.newLine());
				result.push("}");
				result.push(this.translator.newLine());
			}
			/* Get methods with annotations */
			let methods = new Vector();
			this.translator.helper.getMethodsWithAnnotations(op_code.content, methods);
			/* Get methods list */
			result.push("static getMethodsList()");
			if (methods.count() > 0)
			{
				result.push(this.translator.newLine());
				result.push("{");
				this.translator.levelInc();
				result.push(this.translator.newLine());
				result.push("const Vector = use(\"Runtime.Vector\");");
				result.push(this.translator.newLine());
				result.push("return new Vector(");
				for (let i = 0; i < methods.count(); i++)
				{
					let op_code_item = methods.get(i);
					result.push(this.translator.toString(op_code_item.name));
					if (i < methods.count() - 1) result.push(", ");
				}
				result.push(");");
				this.translator.levelDec();
				result.push(this.translator.newLine());
				result.push("}");
			}
			else result.push("{ return null; }");
			result.push(this.translator.newLine());
			/* Get method info by name */
			result.push("static getMethodInfoByName(field_name)");
			if (methods.count() > 0)
			{
				result.push(this.translator.newLine());
				result.push("{");
				this.translator.levelInc();
				result.push(this.translator.newLine());
				result.push("const Vector = use(\"Runtime.Vector\");");
				result.push(this.translator.newLine());
				for (let i = 0; i < methods.count(); i++)
				{
					let op_code_item = methods.get(i);
					let method_name = this.translator.toString(op_code_item.name);
					result.push("if (field_nane == " + String(method_name) + String(") "));
					this.OpAnnotation(op_code_item.annotations, result);
				}
				result.push(this.translator.newLine());
				result.push("return null;");
				this.translator.levelDec();
				result.push(this.translator.newLine());
				result.push("}");
			}
			else result.push("{ return null; }");
			/* Implements */
			if (op_code.class_implements)
			{
				let class_implements = op_code.class_implements.map((class_name) =>
				{
					return this.translator.toString(this.translator.getFullName(class_name.entity_name.getName()));
				});
				result.push(this.translator.newLine());
				/* Get interfaces */
				result.push("static getInterfaces(){ ");
				result.push("return [" + String(rs.join(",", class_implements)) + String("]; }"));
			}
		}
	}
	
	
	/**
	 * Translate class name
	 */
	translateClassName(class_name){ return class_name; }
	
	
	/**
	 * Translate class
	 */
	translateClass(op_code, result)
	{
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		if (op_code.kind == OpDeclareClass.KIND_INTERFACE) return false;
		if (op_code.is_component) return this.translator.html.translateComponent(op_code, result);
		/* Class name */
		let class_name = op_code.name.entity_name.items.last().value;
		this.translator.parent_class_name = "";
		this.translator.current_class = op_code;
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
			this.translator.parent_class_name = this.translator.getFullName(op_code.class_extends.entity_name.getName());
			result.push(this.translateClassName(this.translator.parent_class_name));
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
			return this.OpPreprocessorSwitch(op_code, result, OpPreprocessorIfDef.KIND_PROGRAM);
		}
		else
		{
			this.translator.last_semicolon = false;
			let res = this.translator.operator.translateItem(op_code, result);
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
		let op_code_use_count = 0;
		let prev_op_code_use = false;
		let last_result = false;
		let prev_op_code = null;
		for (let i = 0; i < items.count(); i++)
		{
			let op_code_item = items.get(i);
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
		let keys = rtl.list(this.translator.class_items.keys());
		for (let i = 0; i < keys.count(); i++)
		{
			let class_name = keys.get(i);
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
		this.translator.current_module = op_code;
		this.translateItems(op_code.items, result);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.translator = null;
	}
	static getClassName(){ return "BayLang.LangES6.TranslatorES6Program"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangES6.TranslatorES6Program);
module.exports = {
	"TranslatorES6Program": BayLang.LangES6.TranslatorES6Program,
};