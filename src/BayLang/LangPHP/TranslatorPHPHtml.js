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
BayLang.LangPHP.TranslatorPHPHtml = class extends use("Runtime.BaseObject")
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
	 * OpHtmlContent
	 */
	OpHtmlContent(op_code, result)
	{
		let var_name = this.translator.html_var_names.last();
		result.push(var_name + String("->push(") + String(this.translator.toString(op_code.value)) + String(");"));
	}
	
	
	/**
	 * OpHtmlExpression
	 */
	OpHtmlExpression(op_code, result)
	{
		let var_name = this.translator.html_var_names.last();
		result.push(var_name + String("->push("));
		this.translator.expression.translate(op_code, result);
		result.push(");");
	}
	
	
	/**
	 * OpHtmlSlot
	 */
	OpHtmlSlot(op_code, result)
	{
		let var_name = this.translator.html_var_names.last();
		result.push("/* Slot " + String(op_code.name) + String(" */"));
		result.push(this.translator.newLine());
		result.push(var_name + String("->slot("));
		result.push(this.translator.toString(op_code.name) + String(", "));
		this.translator.expression.translate(op_code, result);
		result.push(");");
	}
	
	
	/**
	 * OpHtmlAttrs
	 */
	OpHtmlAttrs(op_code)
	{
		const Vector = use("Runtime.Vector");
		const Map = use("Runtime.Map");
		let attrs = op_code.attrs;
		let spread = new Vector();
		let result = new Map();
		for (let i = 0; i < attrs.count(); i++)
		{
			let item = attrs.get(i);
			if (item.is_spread)
			{
				let item_result = new Vector();
				this.translator.expression.translate(item.expression, item_result);
				spread.push(rs.join("", item_result));
				continue;
			}
			let key = item.key;
			if (rs.charAt(key, 0) == "@" && key != "@raw") continue;
			let item_value = new Vector();
			this.translator.expression.translate(item.expression, item_value);
			let value = rs.join("", item_value);
			if (result.has(key))
			{
				let arr = result.get(key);
				if (key == "class") arr.push(value);
				result.set(key, arr);
			}
			else
			{
				if (key == "class") value = new Vector(value);
				result.set(key, value);
			}
		}
		/* Add class name */
		let class_name = result.get("class");
		if (class_name)
		{
			class_name.push("$componentHash");
		}
		/* Get attrs */
		let new_attrs = result.transition((value, key) =>
		{
			if (key == "class")
			{
				return this.translator.toString(key) + String(" => \\Runtime\\rs::className(new \\Runtime\\Vector(") + String(rs.join(", ", value)) + String("))");
			}
			return this.translator.toString(key) + String(" => ") + String(value);
		});
		return new Vector(new_attrs, spread);
	}
	
	
	/**
	 * Returns tag name
	 */
	getTagName(tag_name)
	{
		const BaseOpCode = use("BayLang.OpCodes.BaseOpCode");
		const Vector = use("Runtime.Vector");
		const ParserBayHtml = use("BayLang.LangBay.ParserBayHtml");
		if (tag_name instanceof BaseOpCode)
		{
			let item_result = new Vector();
			this.translator.expression.translate(tag_name, item_result);
			let value = rs.join("", item_result);
			return new Vector(value, value);
		}
		if (ParserBayHtml.isComponent(tag_name))
		{
			let module_name = this.translator.getUseModule(tag_name);
			return new Vector(module_name, this.translator.toString(module_name));
		}
		return new Vector(tag_name, this.translator.toString(tag_name));
	}
	
	
	/**
	 * OpHtmlTag
	 */
	OpHtmlTag(op_code, result)
	{
		const ParserBayHtml = use("BayLang.LangBay.ParserBayHtml");
		const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");
		const Map = use("Runtime.Map");
		let var_name = this.translator.html_var_names.last();
		let current_var_name = "";
		let res = this.OpHtmlAttrs(op_code);
		let attrs = res.get(0);
		let spread = res.get(1);
		let attrs_str = "";
		if (attrs.count() > 0 || spread.count() > 0)
		{
			attrs_str = ", (new \\Runtime\\Map([" + String(rs.join(", ", attrs)) + String("]))");
			for (let i = 0; i < spread.count(); i++)
			{
				attrs_str = attrs_str + String("->concat(") + String(spread.get(i)) + String(")");
			}
		}
		let tag_name = this.getTagName(op_code.tag_name);
		result.push("/* Element " + String(tag_name.get(0)) + String(" */"));
		result.push(this.translator.newLine());
		if (op_code.content && op_code.content.count() > 0)
		{
			current_var_name = "$" + String(this.translator.varInc());
			result.push(current_var_name + String(" = "));
		}
		result.push(var_name + String("->element(") + String(tag_name.get(1)) + String(attrs_str) + String(");"));
		if (op_code.content && op_code.content.count() > 0)
		{
			this.translator.html_var_names.push(current_var_name);
			let is_slot = op_code.content.items.filter((item) => { const OpHtmlSlot = use("BayLang.OpCodes.OpHtmlSlot");return item instanceof OpHtmlSlot; }).count() == op_code.content.count();
			if (ParserBayHtml.isComponent(op_code.tag_name) && !is_slot)
			{
				let op_code_item = new OpDeclareFunction(Map.create({
					"is_html": true,
					"content": op_code.content,
				}));
				result.push(this.translator.newLine());
				result.push(this.translator.newLine());
				result.push("/* Content */");
				result.push(this.translator.newLine());
				result.push(current_var_name + String("->slot(\"default\", "));
				this.translator.program.OpDeclareFunction(op_code_item, result);
				result.push(");");
			}
			else
			{
				this.OpHtmlItems(op_code.content, result, true);
			}
			this.translator.html_var_names.pop();
		}
	}
	
	
	/**
	 * Translate item
	 */
	translateItem(op_code, result, new_line)
	{
		const OpHtmlContent = use("BayLang.OpCodes.OpHtmlContent");
		const OpHtmlSlot = use("BayLang.OpCodes.OpHtmlSlot");
		const OpHtmlTag = use("BayLang.OpCodes.OpHtmlTag");
		const OpAssign = use("BayLang.OpCodes.OpAssign");
		const OpFor = use("BayLang.OpCodes.OpFor");
		const OpIf = use("BayLang.OpCodes.OpIf");
		const OpComment = use("BayLang.OpCodes.OpComment");
		if (new_line == undefined) new_line = false;
		if (op_code instanceof OpHtmlContent)
		{
			this.OpHtmlContent(op_code, result);
		}
		else if (op_code instanceof OpHtmlSlot)
		{
			if (new_line) result.push(this.translator.newLine());
			this.OpHtmlSlot(op_code, result);
		}
		else if (op_code instanceof OpHtmlTag)
		{
			if (new_line) result.push(this.translator.newLine());
			this.OpHtmlTag(op_code, result);
		}
		else if (op_code instanceof OpAssign)
		{
			if (new_line) result.push(this.translator.newLine());
			this.translator.operator.OpAssign(op_code, result);
			result.push(";");
		}
		else if (op_code instanceof OpFor)
		{
			if (new_line) result.push(this.translator.newLine());
			this.translator.operator.OpFor(op_code, result);
		}
		else if (op_code instanceof OpIf)
		{
			if (new_line) result.push(this.translator.newLine());
			this.translator.operator.OpIf(op_code, result);
		}
		else if (op_code instanceof OpComment)
		{
			this.translator.operator.OpComment(op_code, result);
		}
		else
		{
			this.OpHtmlExpression(op_code, result);
		}
	}
	
	
	/**
	 * OpHtmlItems
	 */
	OpHtmlItems(op_code, result, new_line)
	{
		const OpAssign = use("BayLang.OpCodes.OpAssign");
		const OpIf = use("BayLang.OpCodes.OpIf");
		const OpFor = use("BayLang.OpCodes.OpFor");
		const OpComment = use("BayLang.OpCodes.OpComment");
		if (new_line == undefined) new_line = false;
		if (!op_code) return;
		let prev_op_code = null;
		for (let i = 0; i < op_code.count(); i++)
		{
			let op_code_item = op_code.get(i);
			result.push(this.translator.newLine());
			let next_line = true;
			if (prev_op_code == null) next_line = new_line;
			else if (prev_op_code instanceof OpAssign && (op_code_item instanceof OpAssign || op_code_item instanceof OpIf || op_code_item instanceof OpFor) || prev_op_code instanceof OpComment)
			{
				next_line = false;
			}
			this.translateItem(op_code_item, result, next_line);
			prev_op_code = op_code_item;
		}
	}
	
	
	/**
	 * Translate OpItems
	 */
	translateItems(op_code, result, match_brackets)
	{
		const Vector = use("Runtime.Vector");
		const OpHtmlContent = use("BayLang.OpCodes.OpHtmlContent");
		if (match_brackets == undefined) match_brackets = true;
		result.push(this.translator.newLine());
		result.push("{");
		this.translator.levelInc();
		/* Add component hash */
		result.push(this.translator.newLine());
		result.push("$componentHash = \\Runtime\\rs::getComponentHash(static::getClassName());");
		/* Create Virtual Dom */
		result.push(this.translator.newLine());
		result.push("$__v = new \\Runtime\\VirtualDom($this);");
		result.push(this.translator.newLine());
		/* Add is render */
		if (this.translator.current_function.name == "render")
		{
			result.push("$__v->is_render = true;");
			result.push(this.translator.newLine());
		}
		/* Save old var names */
		let old_var_inc = this.translator.var_inc;
		this.translator.var_inc = 0;
		let old_var_names = this.translator.html_var_names.slice();
		this.translator.html_var_names = new Vector();
		this.translator.html_var_names.push("$__v");
		/* Translate HTML items */
		if (op_code.items.count() == 1 && op_code.get(0) instanceof OpHtmlContent)
		{
			this.OpHtmlContent(op_code.get(0), result);
		}
		else if (op_code.items.count() > 0)
		{
			this.OpHtmlItems(op_code, result);
			result.push(this.translator.newLine());
		}
		/* Restore */
		this.translator.var_inc = old_var_inc;
		this.translator.html_var_names = old_var_names;
		/* Return Virtual Dom */
		if (op_code.items.count() > 0)
		{
			result.push(this.translator.newLine());
		}
		result.push("return $__v;");
		this.translator.levelDec();
		result.push(this.translator.newLine());
		result.push("}");
	}
	
	
	/**
	 * Translate component style
	 */
	translateComponentStyle(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		let items = op_code.content.items.filter((item) => { const OpHtmlStyle = use("BayLang.OpCodes.OpHtmlStyle");return item instanceof OpHtmlStyle; });
		let css_content = new Vector();
		for (let i = 0; i < items.count(); i++)
		{
			let op_code_item = items.get(i);
			this.translator.style.OpHtmlStyle(op_code_item, css_content);
		}
		result.push(this.translator.newLine());
		result.push("static function getComponentStyle(){ ");
		result.push("return " + String(this.translator.toString(rs.join("", css_content))) + String("; "));
		result.push("}");
	}
	
	
	/**
	 * Translate module components
	 */
	translateModuleComponents(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		const OpUse = use("BayLang.OpCodes.OpUse");
		let components = new Vector();
		for (let i = 0; i < this.translator.current_module.items.count(); i++)
		{
			let op_code_item = this.translator.current_module.items.get(i);
			if (op_code_item instanceof OpUse && op_code_item.is_component)
			{
				components.push(op_code_item.name);
			}
		}
		components = components.map((name) => { return this.translator.toString(name); });
		result.push(this.translator.newLine());
		result.push("static function getRequiredComponents(){ ");
		result.push("return new \\Runtime\\Vector(" + String(rs.join(", ", components)) + String("); "));
		result.push("}");
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.translator = null;
	}
	static getClassName(){ return "BayLang.LangPHP.TranslatorPHPHtml"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangPHP.TranslatorPHPHtml);
module.exports = {
	"TranslatorPHPHtml": BayLang.LangPHP.TranslatorPHPHtml,
};