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
BayLang.LangBay.TranslatorBayOperator = class extends use("Runtime.BaseObject")
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
	 * OpAssign
	 */
	OpAssign(op_code, result)
	{
		if (op_code.pattern)
		{
			this.translator.expression.OpTypeIdentifier(op_code.pattern, result);
		}
		let values_count = op_code.items.count();
		for (let i = 0; i < values_count; i++)
		{
			let op_code_value = op_code.items.get(i);
			if (op_code.pattern || i > 0)
			{
				result.push(" ");
			}
			if (op_code_value.op_code)
			{
				this.translator.expression.translate(op_code_value.op_code, result);
			}
			else
			{
				this.translator.expression.OpIdentifier(op_code_value.value, result);
			}
			if (op_code_value.expression)
			{
				result.push(" = ");
				this.translator.expression.translate(op_code_value.expression, result);
			}
			if (i < values_count - 1) result.push(",");
		}
	}
	
	
	/**
	 * OpBreak
	 */
	OpBreak(op_code, result)
	{
		result.push("break");
	}
	
	
	/**
	 * OpContinue
	 */
	OpContinue(op_code, result)
	{
		result.push("continue");
	}
	
	
	/**
	 * OpReturn
	 */
	OpReturn(op_code, result)
	{
		result.push("return");
		if (op_code.expression)
		{
			result.push(" ");
			this.translator.expression.translate(op_code.expression, result);
		}
	}
	
	
	/**
	 * OpInc
	 */
	OpInc(op_code, result)
	{
		const OpInc = use("BayLang.OpCodes.OpInc");
		if (op_code.kind == OpInc.KIND_INC)
		{
			this.translator.expression.translate(op_code.item, result);
			result.push("++");
		}
		if (op_code.kind == OpInc.KIND_DEC)
		{
			this.translator.expression.translate(op_code.item, result);
			result.push("--");
		}
	}
	
	
	/**
	 * OpFor
	 */
	OpFor(op_code, result)
	{
		result.push("for (");
		this.translateItem(op_code.expr1, result);
		result.push("; ");
		this.translator.expression.translate(op_code.expr2, result);
		result.push("; ");
		this.translateItem(op_code.expr3, result);
		result.push(")");
		this.translateItems(op_code.content, result);
	}
	
	
	/**
	 * OpIf
	 */
	OpIf(op_code, result)
	{
		result.push("if (");
		this.translator.expression.translate(op_code.condition, result);
		result.push(")");
		this.translateItems(op_code.if_true, result);
		if (op_code.if_else && op_code.if_else.count() > 0)
		{
			for (let i = 0; i < op_code.if_else.count(); i++)
			{
				let op_code_item = op_code.if_else.get(i);
				result.push(this.translator.newLine());
				result.push("else if (");
				this.translator.expression.translate(op_code_item.condition, result);
				result.push(")");
				this.translateItems(op_code_item.content, result);
			}
		}
		if (op_code.if_false)
		{
			result.push(this.translator.newLine());
			result.push("else");
			this.translateItems(op_code.if_false, result);
		}
	}
	
	
	/**
	 * OpThrow
	 */
	OpThrow(op_code, result)
	{
		result.push("throw ");
		this.translator.expression.translate(op_code.expression, result);
	}
	
	
	/**
	 * OpTryCatch
	 */
	OpTryCatch(op_code, result)
	{
		result.push("try");
		this.translateItems(op_code.op_try, result);
		if (op_code.items && op_code.items.count() > 0)
		{
			let items_count = op_code.items.count();
			for (let i = 0; i < items_count; i++)
			{
				let op_code_item = op_code.items.get(i);
				result.push(this.translator.newLine());
				result.push("catch (");
				this.translator.expression.OpTypeIdentifier(op_code_item.pattern, result);
				result.push(" ");
				result.push(op_code_item.name);
				result.push(")");
				this.translateItems(op_code_item.value, result);
			}
		}
	}
	
	
	/**
	 * OpWhile
	 */
	OpWhile(op_code, result)
	{
		result.push("while (");
		this.translator.expression.translate(op_code.condition, result);
		result.push(")");
		this.translateItems(op_code.content, result);
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
	 * Add semicolon
	 */
	addSemicolon(op_code, result)
	{
		const OpAssign = use("BayLang.OpCodes.OpAssign");
		const OpBreak = use("BayLang.OpCodes.OpBreak");
		const OpCall = use("BayLang.OpCodes.OpCall");
		const OpContinue = use("BayLang.OpCodes.OpContinue");
		const OpInc = use("BayLang.OpCodes.OpInc");
		const OpReturn = use("BayLang.OpCodes.OpReturn");
		const OpThrow = use("BayLang.OpCodes.OpThrow");
		if (op_code instanceof OpAssign || op_code instanceof OpBreak || op_code instanceof OpCall || op_code instanceof OpContinue || op_code instanceof OpInc || op_code instanceof OpReturn || op_code instanceof OpThrow)
		{
			if (!this.translator.last_semicolon) result.push(";");
		}
	}
	
	
	/**
	 * Translate item
	 */
	translateItem(op_code, result)
	{
		const OpAssign = use("BayLang.OpCodes.OpAssign");
		const OpBreak = use("BayLang.OpCodes.OpBreak");
		const OpCall = use("BayLang.OpCodes.OpCall");
		const OpContinue = use("BayLang.OpCodes.OpContinue");
		const OpReturn = use("BayLang.OpCodes.OpReturn");
		const OpInc = use("BayLang.OpCodes.OpInc");
		const OpFor = use("BayLang.OpCodes.OpFor");
		const OpIf = use("BayLang.OpCodes.OpIf");
		const OpThrow = use("BayLang.OpCodes.OpThrow");
		const OpTryCatch = use("BayLang.OpCodes.OpTryCatch");
		const OpWhile = use("BayLang.OpCodes.OpWhile");
		const OpComment = use("BayLang.OpCodes.OpComment");
		if (op_code instanceof OpAssign)
		{
			this.OpAssign(op_code, result);
		}
		else if (op_code instanceof OpBreak)
		{
			this.OpBreak(op_code, result);
		}
		else if (op_code instanceof OpCall)
		{
			this.translator.expression.OpCall(op_code, result);
		}
		else if (op_code instanceof OpContinue)
		{
			this.OpContinue(op_code, result);
		}
		else if (op_code instanceof OpReturn)
		{
			this.OpReturn(op_code, result);
		}
		else if (op_code instanceof OpInc)
		{
			this.OpInc(op_code, result);
		}
		else if (op_code instanceof OpFor)
		{
			this.OpFor(op_code, result);
		}
		else if (op_code instanceof OpIf)
		{
			this.OpIf(op_code, result);
		}
		else if (op_code instanceof OpThrow)
		{
			this.OpThrow(op_code, result);
		}
		else if (op_code instanceof OpTryCatch)
		{
			this.OpTryCatch(op_code, result);
		}
		else if (op_code instanceof OpWhile)
		{
			this.OpWhile(op_code, result);
		}
		else if (op_code instanceof OpComment)
		{
			this.OpComment(op_code, result);
		}
		else
		{
			return false;
		}
		return true;
	}
	
	
	/**
	 * Translate OpItems
	 */
	translateItems(op_code, result)
	{
		const OpItems = use("BayLang.OpCodes.OpItems");
		const Vector = use("Runtime.Vector");
		if (!(op_code instanceof OpItems))
		{
			result.push(" ");
			this.translateItem(op_code, result);
			result.push(";");
			this.translator.last_semicolon = true;
			return;
		}
		if (op_code.items.count() == 0)
		{
			result.push("{");
			result.push("}");
			return;
		}
		/* Begin bracket */
		result.push(this.translator.newLine());
		result.push("{");
		this.translator.levelInc();
		/* Items */
		let items_count = op_code.items.count();
		for (let i = 0; i < items_count; i++)
		{
			let op_code_item = op_code.items.get(i);
			let result_items = Vector.create([]);
			this.translator.last_semicolon = false;
			let flag = this.translateItem(op_code_item, result_items);
			if (flag)
			{
				result.push(this.translator.newLine());
				result.appendItems(result_items);
				this.addSemicolon(op_code_item, result);
			}
		}
		/* End bracket */
		this.translator.levelDec();
		result.push(this.translator.newLine());
		result.push("}");
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.translator = null;
	}
	static getClassName(){ return "BayLang.LangBay.TranslatorBayOperator"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangBay.TranslatorBayOperator);
module.exports = {
	"TranslatorBayOperator": BayLang.LangBay.TranslatorBayOperator,
};