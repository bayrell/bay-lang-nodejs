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
if (typeof BayLang.LangES6 == 'undefined') BayLang.LangES6 = {};
BayLang.LangES6.TranslatorES6Html = class extends use("Runtime.BaseObject")
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
		result.push(var_name + String(".push(") + String(this.translator.toString(op_code.value)) + String(");"));
	}
	
	
	/**
	 * OpHtmlExpression
	 */
	OpHtmlExpression(op_code, result)
	{
		let var_name = this.translator.html_var_names.last();
		result.push(var_name + String(".push("));
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
		result.push(var_name + String(".slot("));
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
		const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");
		let attrs = op_code.attrs;
		let spread = Vector.create([]);
		let result = new Map();
		for (let i = 0; i < attrs.count(); i++)
		{
			let item = attrs.get(i);
			if (item.is_spread)
			{
				let item_result = Vector.create([]);
				this.translator.expression.translate(item.expression, item_result);
				spread.push(rs.join("", item_result));
				continue;
			}
			let key = item.key;
			if (key == "@key") key = "key";
			else if (rs.substr(key, 0, 7) == "@event:")
			{
				key = "on" + String(rs.upper(rs.charAt(key, 7))) + String(rs.substr(key, 8));
			}
			let item_value = Vector.create([]);
			let is_function = item.expression instanceof OpDeclareFunction;
			if (is_function)
			{
				let hash_value = this.translator.componentHashInc();
				item_value.push("this.hash(" + String(hash_value) + String(") ? this.hash(") + String(hash_value) + String(") : this.hash(") + String(hash_value) + String(", "));
			}
			this.translator.expression.translate(item.expression, item_value);
			let value = rs.join("", item_value) + String(is_function ? ")" : "");
			if (result.has(key))
			{
				let arr = result.get(key);
				if (key == "class") arr.push(value);
				result.set(key, arr);
			}
			else
			{
				if (key == "class") value = Vector.create([value]);
				result.set(key, value);
			}
		}
		/* Add class name */
		let class_name = result.get("class");
		if (class_name)
		{
			class_name.push("componentHash");
		}
		/* Get attrs */
		let new_attrs = result.transition((value, key) =>
		{
			if (key == "class")
			{
				return this.translator.toString(key) + String(": rs.className([") + String(rs.join(", ", value)) + String("])");
			}
			return this.translator.toString(key) + String(": ") + String(value);
		});
		return Vector.create([new_attrs, spread]);
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
			let item_result = Vector.create([]);
			this.translator.expression.translate(tag_name, item_result);
			let value = rs.join("", item_result);
			return Vector.create([value, value]);
		}
		if (ParserBayHtml.isComponent(tag_name))
		{
			let module_name = this.translator.getUseModule(tag_name);
			return Vector.create([module_name, this.translator.toString(module_name)]);
		}
		return Vector.create([tag_name, this.translator.toString(tag_name)]);
	}
	
	
	/**
	 * OpHtmlTag
	 */
	OpHtmlTag(op_code, result)
	{
		const ParserBayHtml = use("BayLang.LangBay.ParserBayHtml");
		const OpHtmlSlot = use("BayLang.OpCodes.OpHtmlSlot");
		const Map = use("Runtime.Map");
		let attrs_str = "";
		let var_name = this.translator.html_var_names.last();
		let current_var_name = "";
		let res = this.OpHtmlAttrs(op_code);
		let attrs = res.get(0);
		let spread = res.get(1);
		if (attrs.count() > 0 || spread.count() > 0)
		{
			attrs_str = ", new Runtime.Map({" + String(rs.join(", ", attrs)) + String("})");
			for (let i = 0; i < spread.count(); i++)
			{
				attrs_str = attrs_str + String(".concat(") + String(spread.get(i)) + String(")");
			}
		}
		let tag_name = this.getTagName(op_code.tag_name);
		result.push("/* Element " + String(tag_name.get(0)) + String(" */"));
		result.push(this.translator.newLine());
		if (op_code.content && op_code.content.count() > 0)
		{
			current_var_name = this.translator.varInc();
			result.push("let " + String(current_var_name) + String(" = "));
		}
		result.push(var_name + String(".element(") + String(tag_name.get(1)) + String(attrs_str) + String(");"));
		if (op_code.content && op_code.content.count() > 0)
		{
			this.translator.html_var_names.push(current_var_name);
			let is_slot = op_code.content.items.filter((item) => { const OpHtmlSlot = use("BayLang.OpCodes.OpHtmlSlot");return item instanceof OpHtmlSlot; }).count() == op_code.content.count();
			if (ParserBayHtml.isComponent(op_code.tag_name) && !is_slot)
			{
				let op_code_item = new OpHtmlSlot(Map.create({
					"is_html": true,
					"content": op_code.content,
				}));
				result.push(this.translator.newLine());
				result.push(this.translator.newLine());
				result.push("/* Content */");
				result.push(this.translator.newLine());
				result.push(current_var_name + String(".slot(\"default\", "));
				this.OpDeclareFunction(op_code_item, result);
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
	 * OpDeclareFunction
	 */
	OpDeclareFunction(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		const OpHtmlContent = use("BayLang.OpCodes.OpHtmlContent");
		/* Setup current function */
		let old_function = this.translator.current_function;
		this.translator.current_function = op_code;
		/* Comments */
		if (op_code.comments)
		{
			for (let i = 0; i < op_code.comments.count(); i++)
			{
				let op_code_item = op_code.comments.get(i);
				this.translator.program.OpComment(op_code_item, result);
				result.push(this.translator.newLine());
			}
		}
		/* Function name */
		if (old_function == null)
		{
			result.push(op_code.name);
			result.push(": ");
		}
		/* Function flags */
		if (op_code.flags)
		{
			let flags = Vector.create([]);
			if (op_code.flags.isFlag("async")) flags.push("async");
			result.push(rs.join(" ", flags));
			if (flags.count() > 0) result.push(" ");
		}
		if (old_function == null) result.push("function");
		result.push("(");
		this.translator.program.OpDeclareFunctionArgs(op_code, result);
		result.push(")");
		/* Add arrow */
		if (this.translator.is_operator_block)
		{
			result.push(" =>");
		}
		result.push(this.translator.newLine());
		result.push("{");
		this.translator.levelInc();
		/* Add rs */
		result.push(this.translator.newLine());
		result.push("const rs = use(\"Runtime.rs\");");
		result.push(this.translator.newLine());
		result.push("const componentHash = rs.getComponentHash(this.getClassName());");
		/* Create Virtual Dom */
		result.push(this.translator.newLine());
		result.push("let __v = new Runtime.VirtualDom(this);");
		result.push(this.translator.newLine());
		/* Save old var names */
		let old_var_inc = this.translator.var_inc;
		this.translator.var_inc = 0;
		let old_var_names = this.translator.html_var_names.slice();
		this.translator.html_var_names = Vector.create([]);
		this.translator.html_var_names.push("__v");
		/* Save modules */
		let save_use_modules = this.translator.setUseModules();
		/* Function content */
		let item_result = Vector.create([]);
		let save_operator_block = this.translator.is_operator_block;
		this.translator.is_operator_block = true;
		/* Translate HTML items */
		if (op_code.content.items.count() == 1 && op_code.content.get(0) instanceof OpHtmlContent)
		{
			this.OpHtmlContent(op_code.content.get(0), result);
		}
		else if (op_code.content.items.count() > 0)
		{
			this.OpHtmlItems(op_code.content, item_result);
			item_result.push(this.translator.newLine());
		}
		this.translator.is_operator_block = save_operator_block;
		/* Add modules */
		this.translator.addUseModules(result);
		result.appendItems(item_result);
		/* Restore */
		this.translator.var_inc = old_var_inc;
		this.translator.html_var_names = old_var_names;
		this.translator.setUseModules(save_use_modules);
		/* Return Virtual Dom */
		if (op_code.content.items.count() > 0)
		{
			result.push(this.translator.newLine());
		}
		result.push("return __v;");
		this.translator.levelDec();
		result.push(this.translator.newLine());
		result.push("}");
		/* Restore old function */
		this.translator.current_function = old_function;
		return true;
	}
	
	
	/**
	 * Translate component body item
	 */
	translateComponentBodyItem(op_code, result)
	{
		const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");
		const Vector = use("Runtime.Vector");
		const OpItems = use("BayLang.OpCodes.OpItems");
		const OpPreprocessorIfCode = use("BayLang.OpCodes.OpPreprocessorIfCode");
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		const OpPreprocessorSwitch = use("BayLang.OpCodes.OpPreprocessorSwitch");
		let kind = this.translator.html_kind;
		if (op_code instanceof OpDeclareFunction)
		{
			/* Check if static */
			let is_static = op_code.flags != null && (op_code.flags.isFlag("static") || op_code.flags.isFlag("pure"));
			let static_methods = Vector.create([
				"beforeMount",
				"mounted",
				"beforeUpdate",
				"updated",
				"beforeUnmount",
				"unmounted",
			]);
			if (static_methods.indexOf(op_code.name) >= 0) is_static = true;
			if ((kind == "methods" || kind == "computed") && is_static || kind == "static" && !is_static)
			{
				return false;
			}
			if (kind == "methods" && op_code.flags && op_code.flags.isFlag("computed"))
			{
				return false;
			}
			if (kind == "computed")
			{
				if (!op_code.flags) return false;
				else if (!op_code.flags.isFlag("computed")) return false;
			}
			/* Check if html function */
			if (!op_code.is_html)
			{
				result.push(this.translator.newLine());
				this.translator.class_function = op_code;
				this.translator.program.OpDeclareFunction(op_code, result);
				this.translator.class_function = null;
				result.push(",");
				return true;
			}
			result.push(this.translator.newLine());
			this.translator.class_function = op_code;
			this.OpDeclareFunction(op_code, result, false);
			this.translator.class_function = null;
			result.push(",");
			return true;
		}
		else if (op_code instanceof OpItems)
		{
			return this.translateComponentBody(op_code, result, kind);
		}
		else if (op_code instanceof OpPreprocessorIfCode)
		{
			return this.translator.program.OpPreprocessorIfCode(op_code, result);
		}
		else if (op_code instanceof OpPreprocessorIfDef)
		{
			return this.translator.program.OpPreprocessorIfDef(op_code, result, OpPreprocessorIfDef.KIND_COMPONENT_BODY);
		}
		else if (op_code instanceof OpPreprocessorSwitch)
		{
			return this.translator.program.OpPreprocessorSwitch(op_code, result, OpPreprocessorIfDef.KIND_COMPONENT_BODY);
		}
	}
	
	
	/**
	 * Translate component body
	 */
	translateComponentBody(op_code, result)
	{
		const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
		if (op_code instanceof OpDeclareClass) op_code = op_code.content;
		for (let i = 0; i < op_code.count(); i++)
		{
			let op_code_item = op_code.get(i);
			this.translateComponentBodyItem(op_code_item, result);
		}
	}
	
	
	/**
	 * Translate component style
	 */
	translateComponentStyle(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		let items = op_code.content.items.filter((item) => { const OpHtmlStyle = use("BayLang.OpCodes.OpHtmlStyle");return item instanceof OpHtmlStyle; });
		let css_content = Vector.create([]);
		for (let i = 0; i < items.count(); i++)
		{
			let op_code_item = items.get(i);
			this.translator.style.OpHtmlStyle(op_code_item, css_content);
		}
		result.push(this.translator.newLine());
		result.push("getComponentStyle: function(){ ");
		result.push("return " + String(this.translator.toString(rs.join("", css_content))) + String("; "));
		result.push("},");
	}
	
	
	/**
	 * Translate module components
	 */
	translateModuleComponents(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		const OpUse = use("BayLang.OpCodes.OpUse");
		let components = Vector.create([]);
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
		result.push("getRequiredComponents: function(){ ");
		result.push("return new Runtime.Vector(" + String(rs.join(", ", components)) + String("); "));
		result.push("},");
	}
	
	
	/**
	 * Translate component data items
	 */
	OpDeclareComponentDataItems(op_code, result)
	{
		const OpAssign = use("BayLang.OpCodes.OpAssign");
		const OpPreprocessorIfCode = use("BayLang.OpCodes.OpPreprocessorIfCode");
		const OpPreprocessorIfDef = use("BayLang.OpCodes.OpPreprocessorIfDef");
		const OpPreprocessorSwitch = use("BayLang.OpCodes.OpPreprocessorSwitch");
		for (let i = 0; i < op_code.count(); i++)
		{
			let op_code_item = op_code.get(i);
			if (op_code_item instanceof OpAssign && (this.translator.is_html_props && op_code_item.flags.isFlag("props") || !this.translator.is_html_props && !op_code_item.flags.isFlag("props")))
			{
				for (let j = 0; j < op_code_item.items.count(); j++)
				{
					let op_code_assign = op_code_item.items.get(j);
					let item = op_code_assign.value;
					result.push(this.translator.newLine());
					if (this.translator.is_html_props) result.push(item.value + String(": {default: "));
					else result.push(item.value + String(": "));
					this.translator.expression.translate(op_code_assign.expression, result);
					if (this.translator.is_html_props) result.push("},");
					else result.push(",");
				}
			}
			else if (op_code_item instanceof OpPreprocessorIfCode)
			{
				return this.translator.program.OpPreprocessorIfCode(op_code_item, result);
			}
			else if (op_code_item instanceof OpPreprocessorIfDef)
			{
				return this.translator.program.OpPreprocessorIfDef(op_code_item, result, OpPreprocessorIfDef.KIND_CLASS_INIT);
			}
			else if (op_code_item instanceof OpPreprocessorSwitch)
			{
				return this.translator.program.OpPreprocessorSwitch(op_code_item, result, OpPreprocessorIfDef.KIND_CLASS_INIT);
			}
		}
	}
	
	
	/**
	 * Translate component data
	 */
	OpDeclareComponentData(op_code, result, is_props)
	{
		const Vector = use("Runtime.Vector");
		let item_result = Vector.create([]);
		item_result.push(this.translator.newLine());
		if (is_props) item_result.push("props: {");
		else item_result.push("data: function()");
		if (!is_props)
		{
			item_result.push(this.translator.newLine());
			item_result.push("{");
			this.translator.levelInc();
			item_result.push(this.translator.newLine());
			item_result.push("return {");
		}
		this.translator.levelInc();
		this.translator.is_html_props = is_props;
		let item_content = Vector.create([]);
		this.OpDeclareComponentDataItems(op_code.content, item_content);
		item_result.appendItems(item_content);
		this.translator.levelDec();
		if (!is_props)
		{
			item_result.push(this.translator.newLine());
			item_result.push("};");
			this.translator.levelDec();
		}
		item_result.push(this.translator.newLine());
		item_result.push("},");
		if (item_content.count() > 0)
		{
			result.appendItems(item_result);
		}
	}
	
	
	/**
	 * Translate component
	 */
	translateComponent(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		/* Class name */
		let class_name = op_code.name.entity_name.items.last().value;
		this.translator.parent_class_name = "";
		this.translator.current_class = op_code;
		this.translator.current_class_name = this.translator.current_namespace_name + String(".") + String(op_code.name.entity_name.getName());
		/* Add use */
		this.translator.uses.set(class_name, this.translator.current_class_name);
		this.translator.class_items.set(class_name, this.translator.current_class_name);
		/* Extends */
		if (op_code.class_extends)
		{
			this.translator.parent_class_name = this.translator.getFullName(op_code.class_extends.entity_name.getName());
		}
		else
		{
			if (this.translator.current_class_name != "Runtime.Component")
			{
				this.translator.parent_class_name = "Runtime.Component";
			}
		}
		/* Define class */
		result.push(this.translator.current_class_name + String(" = {"));
		this.translator.levelInc();
		result.push(this.translator.newLine());
		/* Component name */
		result.push("name: " + String(this.translator.toString(this.translator.current_class_name)) + String(","));
		if (this.translator.parent_class_name)
		{
			result.push(this.translator.newLine());
			result.push("extends: " + String(this.translator.parent_class_name) + String(","));
		}
		/* Component data */
		this.OpDeclareComponentData(op_code, result, true);
		this.OpDeclareComponentData(op_code, result, false);
		/* Component methods */
		result.push(this.translator.newLine());
		result.push("methods:");
		result.push(this.translator.newLine());
		result.push("{");
		this.translator.levelInc();
		/* Component methods */
		this.translator.html_kind = "methods";
		this.translateComponentBody(op_code, result);
		if (this.translator.html_kind == "methods")
		{
			result.push(this.translator.newLine());
			result.push("getClassName: function(){ ");
			result.push("return \"" + String(this.translator.current_class_name) + String("\"; },"));
		}
		this.translator.levelDec();
		result.push(this.translator.newLine());
		result.push("},");
		/* Component computed */
		let computed_result = Vector.create([]);
		computed_result.push(this.translator.newLine());
		computed_result.push("computed:");
		computed_result.push(this.translator.newLine());
		computed_result.push("{");
		this.translator.levelInc();
		/* Translate items */
		let item_result = Vector.create([]);
		this.translator.html_kind = "computed";
		this.translateComponentBody(op_code, item_result);
		computed_result.appendItems(item_result);
		this.translator.levelDec();
		computed_result.push(this.translator.newLine());
		computed_result.push("},");
		if (item_result.count() > 0) result.appendItems(computed_result);
		/* Static functions */
		this.translator.html_kind = "static";
		this.translateComponentBody(op_code, result);
		this.translateComponentStyle(op_code, result);
		this.translateModuleComponents(op_code, result);
		this.translator.program.translateClassInit(op_code, result, false);
		this.translator.levelDec();
		result.push(this.translator.newLine());
		result.push("};");
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
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.translator = null;
	}
	static getClassName(){ return "BayLang.LangES6.TranslatorES6Html"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangES6.TranslatorES6Html);
module.exports = {
	"TranslatorES6Html": BayLang.LangES6.TranslatorES6Html,
};