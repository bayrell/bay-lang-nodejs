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
if (typeof BayLang.LangBay == 'undefined') BayLang.LangBay = {};
BayLang.LangBay.TranslatorBayExpression = class extends use("Runtime.BaseObject")
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
		result.push(op_code.value);
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
		let pattern = op_code.entity_name.items.last();
		result.push(pattern.value);
		this.OpCodeGenerics(op_code.generics, result);
	}
	
	
	/**
	 * OpCollection
	 */
	OpCollection(op_code, result)
	{
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		const Vector = use("Runtime.Vector");
		let is_multiline = op_code.isMultiLine();
		result.push("[");
		if (is_multiline)
		{
			this.translator.levelInc();
		}
		let i = 0;
		let items_count = op_code.items.count();
		while (i < items_count)
		{
			let op_code_item = op_code.items.get(i);
			if (is_multiline)
			{
				result.push(this.translator.newLine());
			}
			/* Preprocessor */
			if (op_code_item instanceof OpPreprocessorIfDef)
			{
				let items = Vector.create([]);
				let condition = op_code_item.condition.value;
				while (op_code_item != null && op_code_item instanceof OpPreprocessorIfDef && op_code_item.condition.value == condition)
				{
					items.push(op_code_item);
					/* Get next item */
					i++;
					op_code_item = op_code.items.get(i);
				}
				this.OpPreprocessorCollection(items, result);
				continue;
			}
			/* Translate item */
			this.translate(op_code_item, result);
			if (!(op_code_item instanceof OpPreprocessorIfDef))
			{
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
		result.push("]");
	}
	
	
	/**
	 * Collection preprocessor
	 */
	OpPreprocessorCollection(items, result)
	{
		let condition = items.get(0).condition.value;
		result.push("#ifdef " + String(condition) + String(" then"));
		for (let i = 0; i < items.count(); i++)
		{
			let op_code_item = items.get(i);
			result.push(this.translator.newLine());
			this.translate(op_code_item.items, result);
			result.push(",");
		}
		result.push(this.translator.newLine());
		result.push("#endif");
	}
	
	
	/**
	 * OpDict
	 */
	OpDict(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		let is_multiline = op_code.isMultiLine();
		if (op_code.items.count() == 0 && !is_multiline)
		{
			result.push("{");
			result.push("}");
			return;
		}
		/* Begin bracket */
		result.push("{");
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
			if (is_multiline)
			{
				result.push(this.translator.newLine());
			}
			/* Preprocessor */
			if (op_code_item.condition != null)
			{
				let items = Vector.create([]);
				let condition = op_code_item.condition.value;
				while (op_code_item != null && op_code_item.condition != null)
				{
					items.push(op_code_item);
					/* Get next item */
					i++;
					op_code_item = op_code.items.get(i);
				}
				this.OpPreprocessorDict(items, result);
				continue;
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
		result.push("}");
	}
	
	
	/**
	 * Dict preprocessor
	 */
	OpPreprocessorDict(items, result)
	{
		let condition = items.get(0).condition.value;
		result.push("#ifdef " + String(condition) + String(" then"));
		for (let i = 0; i < items.count(); i++)
		{
			let op_code_item = items.get(i);
			result.push(this.translator.newLine());
			result.push(this.translator.toString(op_code_item.key));
			result.push(": ");
			this.translate(op_code_item.value, result);
			result.push(",");
		}
		result.push(this.translator.newLine());
		result.push("#endif");
	}
	
	
	/**
	 * OpAttr
	 */
	OpAttr(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		const OpAttr = use("BayLang.OpCodes.OpAttr");
		let attrs = new Vector();
		let op_code_first = op_code;
		while (op_code_first instanceof OpAttr)
		{
			attrs.push(op_code_first);
			op_code_first = op_code_first.prev;
		}
		attrs.reverse();
		/* first op_code */
		this.translateItem(op_code_first, result);
		/* Attrs */
		for (let i = 0; i < attrs.count(); i++)
		{
			let item_attr = attrs.get(i);
			if (item_attr.kind == OpAttr.KIND_ATTR)
			{
				result.push(".");
				result.push(item_attr.next.value);
			}
			else if (item_attr.kind == OpAttr.KIND_STATIC)
			{
				result.push("::");
				result.push(item_attr.next.value);
			}
			else if (item_attr.kind == OpAttr.KIND_DYNAMIC)
			{
				this.OpCollection(item_attr.next, result);
			}
		}
		this.translator.opcode_level = 20;
	}
	
	
	/**
	 * OpClassOf
	 */
	OpClassOf(op_code, result)
	{
		result.push("classof ");
		result.push(op_code.entity_name.names.last());
	}
	
	
	/**
	 * OpCall
	 */
	OpCall(op_code, result)
	{
		if (op_code.is_await)
		{
			result.push("await ");
		}
		this.translateItem(op_code.item, result);
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
	 * OpNew
	 */
	OpNew(op_code, result)
	{
		const OpDict = use("BayLang.OpCodes.OpDict");
		result.push("new ");
		this.OpTypeIdentifier(op_code.pattern, result);
		if (op_code.args.count() == 1 && op_code.args.get(0) instanceof OpDict)
		{
			this.OpDict(op_code.args.get(0), result);
		}
		else
		{
			result.push("(");
			let args_count = op_code.args.count();
			for (let i = 0; i < args_count; i++)
			{
				let op_code_item = op_code.args.get(i);
				this.Expression(op_code_item, result);
				if (i < args_count - 1) result.push(", ");
			}
			result.push(")");
		}
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
			op = "not";
		}
		if (op_code.math == "and")
		{
			opcode_level = 6;
			op = "and";
		}
		if (op_code.math == "&&")
		{
			opcode_level = 6;
			op = "and";
		}
		if (op_code.math == "or")
		{
			opcode_level = 5;
			op = "or";
		}
		if (op_code.math == "||")
		{
			opcode_level = 5;
			op = "or";
		}
		if (op_code.math == "neg" || op_code.math == "not" || op_code.math == "bitnot" || op_code.math == "!")
		{
			if (op_code.math == "neg") result.push("-");
			else if (op_code.math == "not") result.push("not ");
			else if (op_code.math == "bitnot") result.push("bitnot ");
			else result.push(op_code.math);
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
			result.push(" " + String(op) + String(" "));
			let result2 = Vector.create([]);
			this.Expression(op_code.value2, result2);
			let opcode_level2 = this.translator.opcode_level;
			if (opcode_level2 < opcode_level)
			{
				result.push("(");
				result.appendItems(result2);
				result.push(")");
			}
			else
			{
				result.appendItems(result2);
			}
		}
		this.translator.opcode_level = opcode_level;
	}
	
	
	/**
	 * OpTernary
	 */
	OpTernary(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		let result1 = Vector.create([]);
		this.translate(op_code.condition, result1);
		if (this.translator.opcode_level < 19)
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
		if (this.translator.opcode_level < 19)
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
		if (this.translator.opcode_level < 19)
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
			this.translator.program.OpDeclareFunction(op_code, result);
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
	static getClassName(){ return "BayLang.LangBay.TranslatorBayExpression"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangBay.TranslatorBayExpression);
module.exports = {
	"TranslatorBayExpression": BayLang.LangBay.TranslatorBayExpression,
};