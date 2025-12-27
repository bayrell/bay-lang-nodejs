"use strict;"
const use = require('bay-lang').use;
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
BayLang.LangES6.TranslatorES6Expression = class extends use("Runtime.BaseObject")
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
	 * OpIdentifier
	 */
	OpIdentifier(op_code, result)
	{
		if (op_code.value == "print" || op_code.value == "var_dump") result.push("console.log");
		else if (op_code.value == "static")
		{
			if (this.translator.class_function && this.translator.class_function.isStatic())
			{
				result.push("this");
			}
			else
			{
				result.push("this.constructor");
			}
		}
		else if (op_code.value == "parent")
		{
			result.push("super");
		}
		else if (op_code.value == "@")
		{
			result.push("Runtime.rtl.getContext()");
		}
		else result.push(op_code.value);
		this.translator.opcode_level = 20;
	}
	
	
	/**
	 * OpNumber
	 */
	OpNumber(op_code, result)
	{
		result.push(op_code.value);
		this.translator.opcode_level = 20;
	}
	
	
	/**
	 * OpString
	 */
	OpString(op_code, result)
	{
		result.push(this.translator.toString(op_code.value));
		this.translator.opcode_level = 20;
	}
	
	
	/**
	 * OpCode generics
	 */
	OpCodeGenerics(items, result)
	{
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		const OpTypeIdentifier = use("BayLang.OpCodes.OpTypeIdentifier");
		if (!items) return;
		/* Get items count */
		let items_count = items.count();
		if (items_count == 0) return;
		/* Output generics */
		result.push("<");
		for (let i = 0; i < items_count; i++)
		{
			let op_code_item = items.get(i);
			if (op_code_item instanceof OpIdentifier)
			{
				this.OpIdentifier(op_code_item, result);
			}
			else if (op_code_item instanceof OpTypeIdentifier)
			{
				this.OpTypeIdentifier(op_code_item, result);
			}
			if (i < items_count - 1) result.push(", ");
		}
		result.push(">");
	}
	
	
	/**
	 * OpTypeIdentifier
	 */
	OpTypeIdentifier(op_code, result)
	{
		let name = op_code.entity_name.getName();
		if (name == "static")
		{
			if (this.translator.class_function && this.translator.class_function.isStatic())
			{
				result.push("this");
			}
			else
			{
				result.push("this.constructor");
			}
		}
		else if (name == "parent")
		{
			result.push("super");
		}
		else if (this.translator.uses.has(name))
		{
			result.push(this.translator.useModule(this.translator.uses.get(name)));
		}
		else
		{
			let pattern = op_code.entity_name.items.last();
			result.push(this.translator.useModule(pattern.value));
		}
	}
	
	
	/**
	 * OpCollection
	 */
	OpCollection(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		const OpPreprocessorIfCode = use("BayLang.OpCodes.OpPreprocessorIfCode");
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		const OpPreprocessorSwitch = use("BayLang.OpCodes.OpPreprocessorSwitch");
		let is_multiline = this.translator.allow_multiline && op_code.isMultiLine();
		result.push(this.translator.getUseModule("Vector") + String(".create"));
		result.push("([");
		if (is_multiline)
		{
			this.translator.levelInc();
		}
		let i = 0;
		let items_count = op_code.items.count();
		let last_result = true;
		while (i < items_count)
		{
			let op_code_item = op_code.items.get(i);
			let result1 = Vector.create([]);
			/* Preprocessor */
			let is_result = false;
			let is_preprocessor = true;
			if (op_code_item instanceof OpPreprocessorIfCode)
			{
				is_result = this.translator.program.OpPreprocessorIfCode(op_code_item, result1);
			}
			else if (op_code_item instanceof OpPreprocessorIfDef)
			{
				is_result = this.translator.program.OpPreprocessorIfDef(op_code_item, result1, OpPreprocessorIfDef.KIND_COLLECTION);
			}
			else if (op_code_item instanceof OpPreprocessorSwitch)
			{
				is_result = this.translator.program.OpPreprocessorSwitch(op_code_item, result1, OpPreprocessorSwitch.KIND_COLLECTION);
			}
			else
			{
				is_preprocessor = false;
				this.translate(op_code_item, result1);
			}
			last_result = !is_preprocessor || is_result;
			if (last_result && result1.count() > 0)
			{
				if (is_multiline) result.push(this.translator.newLine());
				result.appendItems(result1);
				if (is_multiline) result.push(",");
				else if (i < items_count - 1) result.push(", ");
			}
			i++;
		}
		if (is_multiline)
		{
			this.translator.levelDec();
			result.push(this.translator.newLine());
		}
		result.push("])");
	}
	
	
	/**
	 * OpDict
	 */
	OpDict(op_code, result)
	{
		let is_multiline = this.translator.allow_multiline && op_code.isMultiLine();
		if (op_code.items.count() == 0 && !is_multiline)
		{
			result.push("new ");
			result.push(this.translator.getUseModule("Map"));
			result.push("()");
			return;
		}
		/* Begin bracket */
		result.push(this.translator.getUseModule("Map"));
		result.push(".create({");
		if (is_multiline)
		{
			this.translator.levelInc();
		}
		/* Items */
		let i = 0;
		let items_count = op_code.items.count();
		while (i < items_count)
		{
			let op_code_item = op_code.items.get(i);
			/* Preprocessor */
			if (op_code_item.condition != null)
			{
				let name = op_code_item.condition.value;
				if (!this.translator.preprocessor_flags.has(name))
				{
					i++;
					continue;
				}
			}
			/* Add new line */
			if (is_multiline)
			{
				result.push(this.translator.newLine());
			}
			/* Translate item */
			result.push(this.translator.toString(op_code_item.key.value));
			result.push(": ");
			this.translate(op_code_item.expression, result);
			if (is_multiline) result.push(",");
			else if (i < items_count - 1) result.push(", ");
			i++;
		}
		/* End bracket */
		if (is_multiline)
		{
			this.translator.levelDec();
			result.push(this.translator.newLine());
		}
		result.push("})");
	}
	
	
	/**
	 * OpAttr
	 */
	OpAttr(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		const OpAttr = use("BayLang.OpCodes.OpAttr");
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		let attrs = new Vector();
		let op_code_first = op_code;
		while (op_code_first instanceof OpAttr)
		{
			attrs.push(op_code_first);
			op_code_first = op_code_first.prev;
		}
		attrs.reverse();
		/* First op_code */
		this.translateItem(op_code_first, result);
		/* Attrs */
		for (let i = 0; i < attrs.count(); i++)
		{
			let item_attr = attrs.get(i);
			if (item_attr.kind == OpAttr.KIND_ATTR || item_attr.kind == OpAttr.KIND_STATIC)
			{
				let prev_attr = i > 0 ? attrs.get(i - 1) : op_code_first;
				if (prev_attr instanceof OpIdentifier && item_attr.kind == OpAttr.KIND_STATIC)
				{
					result.push(".constructor.");
				}
				else
				{
					result.push(".");
				}
				result.push(item_attr.next.value);
			}
			else if (item_attr.kind == OpAttr.KIND_DYNAMIC)
			{
				result.push("[");
				for (let j = 0; j < item_attr.next.items.count(); j++)
				{
					this.translate(item_attr.next.items.get(j), result);
					if (j < item_attr.next.items.count() - 1) result.push(", ");
				}
				result.push("]");
			}
		}
		this.translator.opcode_level = 20;
	}
	
	
	/**
	 * OpClassOf
	 */
	OpClassOf(op_code, result)
	{
		if (op_code.entity_name.items.count() == 1)
		{
			let item = op_code.entity_name.items.last();
			let name = item.value;
			if (this.translator.uses.has(name))
			{
				result.push(this.translator.toString(this.translator.uses.get(name)));
			}
			else
			{
				result.push(this.translator.toString(name));
			}
		}
		else
		{
			result.push(this.translator.toString(op_code.entity_name.getName()));
		}
	}
	
	
	/**
	 * OpCall
	 */
	OpCall(op_code, result)
	{
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		if (op_code.is_await)
		{
			result.push("await ");
		}
		let is_html = false;
		if (op_code.item instanceof OpIdentifier && op_code.item.value == "parent")
		{
			if (this.translator.class_function && this.translator.class_function.is_html)
			{
				is_html = true;
				result.push(this.translator.parent_class_name + String(".methods.") + String(this.translator.class_function.name) + String(".call"));
			}
			else if (this.translator.class_function && this.translator.class_function.name != "constructor")
			{
				result.push("super." + String(this.translator.class_function.name));
			}
			else
			{
				result.push("super");
			}
		}
		else
		{
			this.translateItem(op_code.item, result);
		}
		result.push("(");
		if (is_html)
		{
			result.push("this");
			if (op_code.args.count() > 0) result.push(", ");
		}
		let args_count = op_code.args.count();
		for (let i = 0; i < args_count; i++)
		{
			let op_code_item = op_code.args.get(i);
			this.Expression(op_code_item, result);
			if (i < args_count - 1) result.push(", ");
		}
		result.push(")");
		this.translator.opcode_level = 20;
	}
	
	
	/**
	 * OpNew
	 */
	OpNew(op_code, result)
	{
		result.push("new ");
		this.OpTypeIdentifier(op_code.pattern, result);
		result.push("(");
		let args_count = op_code.args.count();
		for (let i = 0; i < args_count; i++)
		{
			let op_code_item = op_code.args.get(i);
			this.Expression(op_code_item, result);
			if (i < args_count - 1) result.push(", ");
		}
		result.push(")");
		this.translator.opcode_level = 20;
	}
	
	
	/**
	 * OpMath
	 */
	OpMath(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		let result1 = Vector.create([]);
		this.Expression(op_code.value1, result1);
		let opcode_level1 = this.translator.opcode_level;
		let op = "";
		let opcode_level = 0;
		if (op_code.math == "!")
		{
			opcode_level = 16;
			op = "!";
		}
		if (op_code.math == ">>")
		{
			opcode_level = 12;
			op = ">>";
		}
		if (op_code.math == "<<")
		{
			opcode_level = 12;
			op = "<<";
		}
		if (op_code.math == "&")
		{
			opcode_level = 9;
			op = "&";
		}
		if (op_code.math == "xor")
		{
			opcode_level = 8;
			op = "^";
		}
		if (op_code.math == "|")
		{
			opcode_level = 7;
			op = "|";
		}
		if (op_code.math == "*")
		{
			opcode_level = 14;
			op = "*";
		}
		if (op_code.math == "/")
		{
			opcode_level = 14;
			op = "/";
		}
		if (op_code.math == "%")
		{
			opcode_level = 14;
			op = "%";
		}
		if (op_code.math == "div")
		{
			opcode_level = 14;
			op = "div";
		}
		if (op_code.math == "mod")
		{
			opcode_level = 14;
			op = "mod";
		}
		if (op_code.math == "+")
		{
			opcode_level = 13;
			op = "+";
		}
		if (op_code.math == "-")
		{
			opcode_level = 13;
			op = "-";
		}
		if (op_code.math == "~")
		{
			opcode_level = 13;
			op = "~";
		}
		if (op_code.math == "===")
		{
			opcode_level = 10;
			op = "===";
		}
		if (op_code.math == "!==")
		{
			opcode_level = 10;
			op = "!==";
		}
		if (op_code.math == "==")
		{
			opcode_level = 10;
			op = "==";
		}
		if (op_code.math == "!=")
		{
			opcode_level = 10;
			op = "!=";
		}
		if (op_code.math == ">=")
		{
			opcode_level = 10;
			op = ">=";
		}
		if (op_code.math == "<=")
		{
			opcode_level = 10;
			op = "<=";
		}
		if (op_code.math == ">")
		{
			opcode_level = 10;
			op = ">";
		}
		if (op_code.math == "<")
		{
			opcode_level = 10;
			op = "<";
		}
		if (op_code.math == "is")
		{
			opcode_level = 10;
			op = "instanceof";
		}
		if (op_code.math == "instanceof")
		{
			opcode_level = 10;
			op = "instanceof";
		}
		if (op_code.math == "implements")
		{
			opcode_level = 10;
			op = "implements";
		}
		if (op_code.math == "bitnot")
		{
			opcode_level = 16;
			op = "bitnot";
		}
		if (op_code.math == "neg")
		{
			opcode_level = 16;
			op = "neg";
		}
		if (op_code.math == "not")
		{
			opcode_level = 16;
			op = "!";
		}
		if (op_code.math == "and" || op_code.math == "&&")
		{
			opcode_level = 6;
			op = "&&";
		}
		if (op_code.math == "or" || op_code.math == "||")
		{
			opcode_level = 5;
			op = "||";
		}
		if (op_code.math == "neg" || op_code.math == "not" || op_code.math == "bitnot")
		{
			if (op_code.math == "bitnot") result.push("~");
			else if (op_code.math == "neg") result.push("-");
			else result.push(op);
			if (opcode_level1 < opcode_level)
			{
				result.push("(");
				result.appendItems(result1);
				result.push(")");
			}
			else
			{
				result.appendItems(result1);
			}
		}
		else if (op_code.math == "implements")
		{
			let class_name = op_code.value2;
			let interface_name = this.translator.getFullName(class_name.entity_name.getName());
			result.push(this.translator.useModule("rtl") + String(".isImplements(") + String(result1) + String(", ") + String(this.translator.toString(interface_name)) + String(")"));
		}
		else
		{
			if (opcode_level1 < opcode_level)
			{
				result.push("(");
				result.appendItems(result1);
				result.push(")");
			}
			else
			{
				result.appendItems(result1);
			}
			if (op == "~") result.push(" + ");
			else result.push(" " + String(op) + String(" "));
			let result2 = Vector.create([]);
			this.Expression(op_code.value2, result2);
			let opcode_level2 = this.translator.opcode_level;
			if (opcode_level2 < opcode_level)
			{
				if (op == "~") result.push("String");
				result.push("(");
				result.appendItems(result2);
				result.push(")");
			}
			else
			{
				if (op == "~")
				{
					result.push("String(");
					result.appendItems(result2);
					result.push(")");
				}
				else
				{
					result.appendItems(result2);
				}
			}
		}
		this.translator.opcode_level = opcode_level;
	}
	
	
	/**
	 * Translate ternary
	 */
	OpTernary(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		let result1 = Vector.create([]);
		this.translate(op_code.condition, result1);
		if (this.translator.opcode_level < 9)
		{
			result.push("(");
			result.appendItems(result1);
			result.push(")");
		}
		else
		{
			result.appendItems(result1);
		}
		result1 = Vector.create([]);
		result.push(" ? ");
		this.translate(op_code.if_true, result1);
		if (this.translator.opcode_level < 9)
		{
			result.push("(");
			result.appendItems(result1);
			result.push(")");
		}
		else
		{
			result.appendItems(result1);
		}
		result1 = Vector.create([]);
		result.push(" : ");
		this.translate(op_code.if_false, result1);
		if (this.translator.opcode_level < 9)
		{
			result.push("(");
			result.appendItems(result1);
			result.push(")");
		}
		else
		{
			result.appendItems(result1);
		}
		this.translator.opcode_level = 0;
	}
	
	
	/**
	 * Translate item
	 */
	translateItem(op_code, result)
	{
		const OpNumber = use("BayLang.OpCodes.OpNumber");
		const OpString = use("BayLang.OpCodes.OpString");
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		const OpAttr = use("BayLang.OpCodes.OpAttr");
		const OpClassOf = use("BayLang.OpCodes.OpClassOf");
		const OpCollection = use("BayLang.OpCodes.OpCollection");
		const OpDict = use("BayLang.OpCodes.OpDict");
		const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");
		const OpCall = use("BayLang.OpCodes.OpCall");
		const OpNew = use("BayLang.OpCodes.OpNew");
		const OpTernary = use("BayLang.OpCodes.OpTernary");
		const OpTypeIdentifier = use("BayLang.OpCodes.OpTypeIdentifier");
		if (op_code instanceof OpNumber)
		{
			this.OpNumber(op_code, result);
		}
		if (op_code instanceof OpString)
		{
			this.OpString(op_code, result);
		}
		else if (op_code instanceof OpIdentifier)
		{
			this.OpIdentifier(op_code, result);
		}
		else if (op_code instanceof OpAttr)
		{
			this.OpAttr(op_code, result);
		}
		else if (op_code instanceof OpClassOf)
		{
			this.OpClassOf(op_code, result);
		}
		else if (op_code instanceof OpCollection)
		{
			this.OpCollection(op_code, result);
		}
		else if (op_code instanceof OpDict)
		{
			this.OpDict(op_code, result);
		}
		else if (op_code instanceof OpDeclareFunction)
		{
			if (op_code.is_html) this.translator.html.OpDeclareFunction(op_code, result);
			else this.translator.program.OpDeclareFunction(op_code, result);
		}
		else if (op_code instanceof OpCall)
		{
			this.OpCall(op_code, result);
		}
		else if (op_code instanceof OpNew)
		{
			this.OpNew(op_code, result);
		}
		else if (op_code instanceof OpTernary)
		{
			this.OpTernary(op_code, result);
		}
		else if (op_code instanceof OpTypeIdentifier)
		{
			this.OpTypeIdentifier(op_code, result);
		}
	}
	
	
	/**
	 * Expression
	 */
	Expression(op_code, result)
	{
		const OpMath = use("BayLang.OpCodes.OpMath");
		if (op_code instanceof OpMath)
		{
			this.OpMath(op_code, result);
		}
		else
		{
			this.translateItem(op_code, result);
		}
	}
	
	
	/**
	 * Translate expression
	 */
	translate(op_code, result)
	{
		this.Expression(op_code, result);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.translator = null;
	}
	static getClassName(){ return "BayLang.LangES6.TranslatorES6Expression"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangES6.TranslatorES6Expression);
module.exports = {
	"TranslatorES6Expression": BayLang.LangES6.TranslatorES6Expression,
};