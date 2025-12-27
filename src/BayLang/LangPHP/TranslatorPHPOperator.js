"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
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
BayLang.LangPHP.TranslatorPHPOperator = class extends use("Runtime.BaseObject")
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
		const OpAttr = use("BayLang.OpCodes.OpAttr");
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		let flag = false;
		let values_count = op_code.items.count();
		for (let i = 0; i < values_count; i++)
		{
			let op_code_item = op_code.items.get(i);
			if (!op_code_item.expression) continue;
			if (i > 0) result.push(this.translator.newLine());
			flag = true;
			if (op_code_item.value instanceof OpAttr)
			{
				this.translator.expression.OpAttr(op_code_item.value, result);
			}
			else if (op_code_item.value instanceof OpIdentifier)
			{
				this.translator.expression.OpIdentifier(op_code_item.value, result);
			}
			if (op_code_item.expression)
			{
				let op = op_code_item.op;
				if (op == "~=") op = ".=";
				else if (op == "") op = "=";
				result.push(" " + String(op) + String(" "));
				this.translator.expression.translate(op_code_item.expression, result);
			}
			if (i != values_count - 1) result.push(";");
		}
		return flag;
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
				if (op_code_item.pattern.entity_name.getName() == "var")
				{
					result.push("\\Exception");
				}
				else
				{
					this.translator.expression.OpTypeIdentifier(op_code_item.pattern, result);
				}
				result.push(" ");
				result.push("$" + String(op_code_item.name.value));
				result.push(")");
				this.translateItems(op_code_item.content, result);
			}
		}
		else
		{
			result.push(this.translator.newLine());
			result.push("catch (Exception $e) { throw e; }");
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
		let lines = rs.split("\n", op_code.value);
		if (lines.count() == 1)
		{
			result.push("/*");
			result.push(op_code.value);
			result.push("*/");
			return;
		}
		let first_line = rs.trim(lines.get(0));
		let is_comment_function = first_line == "*" || first_line == "!";
		if (is_comment_function || first_line == "") lines = lines.slice(1);
		if (rs.trim(lines.get(lines.count() - 1)) == "" && lines.count() > 1)
		{
			lines = lines.slice(0, lines.count() - 1);
		}
		result.push("/*" + String(is_comment_function ? first_line : ""));
		for (let i = 0; i < lines.count(); i++)
		{
			let line = lines.get(i);
			let start = 0;
			let len = rs.strlen(line);
			while (start < len && rs.charAt(line, start) == "\t") start++;
			if (start < len && rs.charAt(line, start) == "*") start++;
			result.push(this.translator.newLine());
			result.push(rs.substr(line, start));
		}
		result.push(this.translator.newLine());
		if (is_comment_function) result.push(" */");
		else result.push("*/");
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
		const OpPreprocessorIfCode = use("BayLang.OpCodes.OpPreprocessorIfCode");
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		const OpPreprocessorSwitch = use("BayLang.OpCodes.OpPreprocessorSwitch");
		if (op_code instanceof OpAssign)
		{
			return this.OpAssign(op_code, result);
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
		else if (op_code instanceof OpPreprocessorIfCode)
		{
			return this.translator.program.OpPreprocessorIfCode(op_code, result);
		}
		else if (op_code instanceof OpPreprocessorIfDef)
		{
			return this.translator.program.OpPreprocessorIfDef(op_code, result, OpPreprocessorIfDef.KIND_OPERATOR);
		}
		else if (op_code instanceof OpPreprocessorSwitch)
		{
			return this.translator.program.OpPreprocessorSwitch(op_code, result, OpPreprocessorIfDef.KIND_OPERATOR);
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
	translateItems(op_code, result, match_brackets)
	{
		const OpItems = use("BayLang.OpCodes.OpItems");
		const Vector = use("Runtime.Vector");
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		const OpPreprocessorSwitch = use("BayLang.OpCodes.OpPreprocessorSwitch");
		if (match_brackets == undefined) match_brackets = true;
		if (this.translator.current_function.is_html)
		{
			result.push(this.translator.newLine());
			result.push("{");
			this.translator.levelInc();
			this.translator.html.OpHtmlItems(op_code, result);
			this.translator.levelDec();
			result.push(this.translator.newLine());
			result.push("}");
			return;
		}
		if (!(op_code instanceof OpItems))
		{
			result.push(" ");
			this.translateItem(op_code, result);
			result.push(";");
			this.translator.last_semicolon = true;
			return;
		}
		if (op_code.items.count() == 0 && match_brackets)
		{
			result.push("{");
			result.push("}");
			return;
		}
		/* Begin bracket */
		if (match_brackets)
		{
			result.push(this.translator.newLine());
			result.push("{");
			this.translator.levelInc();
		}
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
				if (!(op_code_item instanceof OpPreprocessorIfDef || op_code_item instanceof OpPreprocessorSwitch))
				{
					result.push(this.translator.newLine());
				}
				result.appendItems(result_items);
				this.addSemicolon(op_code_item, result);
			}
		}
		/* End bracket */
		if (match_brackets)
		{
			this.translator.levelDec();
			result.push(this.translator.newLine());
			result.push("}");
		}
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.translator = null;
	}
	static getClassName(){ return "BayLang.LangPHP.TranslatorPHPOperator"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangPHP.TranslatorPHPOperator);
module.exports = {
	"TranslatorPHPOperator": BayLang.LangPHP.TranslatorPHPOperator,
};