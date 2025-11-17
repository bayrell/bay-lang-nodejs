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
BayLang.LangBay.TranslatorBayHtml = class extends use("Runtime.BaseObject")
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
		result.push("%set ");
		this.translator.operator.OpAssign(op_code, result);
		result.push(";");
	}
	
	
	/**
	 * OpUse
	 */
	OpUse(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		let items = rs.split(".", op_code.name);
		let last_name = items.last();
		/* Get attrs */
		let attrs = new Vector(
			"name=\"" + String(op_code.name) + String("\""),
		);
		/* Add alias name */
		if (op_code.alias != "" && op_code.alias != last_name)
		{
			attrs.push("as=\"" + String(op_code.alias) + String("\""));
		}
		/* Add component */
		if (op_code.is_component)
		{
			attrs.push("component=\"true\"");
		}
		/* Add result */
		result.push("<use " + String(rs.join(" ", attrs)) + String(" />"));
	}
	
	
	/**
	 * Translate html content
	 */
	OpHtmlContent(op_code, result)
	{
		result.push(op_code.value);
	}
	
	
	/**
	 * Translate attrs
	 */
	OpHtmlAttrs(op_code_attrs, result, is_multiline)
	{
		const OpString = use("BayLang.OpCodes.OpString");
		const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");
		/* Filter attrs */
		op_code_attrs = op_code_attrs.filter((op_code_attr) =>
		{
			/* Skip @key_debug attr */
			if (!this.translator.preprocessor_flags.get("DEBUG_COMPONENT") && op_code_attr.key == "@key_debug")
			{
				return false;
			}
			return true;
		});
		if (is_multiline) this.translator.levelInc();
		let attrs_count = op_code_attrs.count();
		for (let i = 0; i < attrs_count; i++)
		{
			let op_code_attr = op_code_attrs.get(i);
			if (is_multiline) result.push(this.translator.newLine());
			result.push(op_code_attr.key);
			result.push("=");
			/* Value */
			if (op_code_attr.value instanceof OpString)
			{
				this.translator.expression.translate(op_code_attr.value, result);
			}
			else if (op_code_attr.value instanceof OpDeclareFunction)
			{
				result.push("{{");
				this.translator.levelInc();
				result.push(this.translator.newLine());
				this.translator.expression.translate(op_code_attr.value, result);
				this.translator.levelDec();
				result.push(this.translator.newLine());
				result.push("}}");
			}
			else
			{
				result.push("{{ ");
				this.translator.expression.translate(op_code_attr.value, result);
				result.push(" }}");
			}
			if (i < attrs_count - 1 && !is_multiline) result.push(" ");
		}
		if (is_multiline)
		{
			this.translator.levelDec();
			result.push(this.translator.newLine());
		}
	}
	
	
	/**
	 * Html code multiline
	 */
	isOpHtmlTagMultiline(op_code)
	{
		const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");
		let attrs_count = 0;
		for (let i = 0; i < op_code.attrs.count(); i++)
		{
			let op_code_attr = op_code.attrs.get(i);
			if (op_code_attr.key != "@key_debug") attrs_count++;
			if (op_code_attr.caret_start && op_code_attr.caret_start.y > 0)
			{
				if (op_code_attr.isMultiLine()) return true;
				if (op_code.caret_start.y > 0 && op_code_attr.caret_start.y != op_code.caret_start.y)
				{
					return true;
				}
			}
			if (op_code_attr.value instanceof OpDeclareFunction) return true;
		}
		if (attrs_count > 3) return true;
		return false;
	}
	
	
	/**
	 * Translate html tag
	 */
	OpHtmlTag(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		let is_multiline = op_code.isMultiLine();
		let is_multiline_attrs = this.isOpHtmlTagMultiline(op_code);
		/* Component attrs */
		let args_content = new Vector();
		this.OpHtmlAttrs(op_code.attrs, args_content, is_multiline_attrs);
		let args = rs.join("", args_content);
		if (args != "" && !is_multiline_attrs) args = " " + String(args);
		if (op_code.items == null)
		{
			result.push("<" + String(op_code.tag_name) + String(args) + String(" />"));
		}
		else
		{
			/* Begin tag */
			result.push("<" + String(op_code.tag_name) + String(args) + String(">"));
			if (is_multiline) this.translator.levelInc();
			/* Items */
			this.OpHtmlItems(op_code.items, result, is_multiline);
			/* End tag */
			if (is_multiline)
			{
				this.translator.levelDec();
				result.push(this.translator.newLine());
			}
			result.push("</" + String(op_code.tag_name) + String(">"));
		}
	}
	
	
	/**
	 * OpHtmlSlot
	 */
	OpHtmlSlot(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		/* Slot attrs */
		let args_content = new Vector();
		this.OpHtmlAttrs(op_code.attrs, args_content);
		/* Add slot args */
		if (op_code.args)
		{
			let args = op_code.args.map((item) =>
			{
				const Vector = use("Runtime.Vector");
				let res = new Vector();
				this.translator.expression.OpTypeIdentifier(item.pattern, res);
				res.push(" ");
				res.push(item.name);
				return rs.join("", res);
			});
			if (args_content.count() > 0) args_content.push(" ");
			args_content.push("args=\"" + String(rs.join(",", args)) + String("\""));
		}
		/* Add slot vars */
		if (op_code.vars)
		{
			let vars = op_code.vars.map((item) => { return item.value; });
			if (args_content.count() > 0) args_content.push(" ");
			args_content.push("use=\"" + String(rs.join(",", vars)) + String("\""));
		}
		/* Slot args */
		let args = rs.join("", args_content);
		if (args != "") args = " " + String(args);
		/* Begin slot */
		result.push("<slot name=\"" + String(op_code.name) + String("\"") + String(args) + String(">"));
		/* Items */
		this.translator.levelInc();
		this.OpHtmlItems(op_code.items, result);
		this.translator.levelDec();
		/* End slot */
		result.push(this.translator.newLine());
		result.push("</slot>");
	}
	
	
	/**
	 * Translate html item
	 */
	OpHtmlItem(op_code, result)
	{
		const OpAssign = use("BayLang.OpCodes.OpAssign");
		const OpHtmlTag = use("BayLang.OpCodes.OpHtmlTag");
		const OpHtmlContent = use("BayLang.OpCodes.OpHtmlContent");
		const OpHtmlSlot = use("BayLang.OpCodes.OpHtmlSlot");
		const OpCall = use("BayLang.OpCodes.OpCall");
		const OpHtmlValue = use("BayLang.OpCodes.OpHtmlValue");
		if (op_code instanceof OpAssign)
		{
			this.OpAssign(op_code, result);
		}
		else if (op_code instanceof OpHtmlTag)
		{
			this.OpHtmlTag(op_code, result);
		}
		else if (op_code instanceof OpHtmlContent)
		{
			this.OpHtmlContent(op_code, result);
		}
		else if (op_code instanceof OpHtmlSlot)
		{
			this.OpHtmlSlot(op_code, result);
		}
		else if (op_code instanceof OpCall && op_code.is_html)
		{
			result.push("%render ");
			this.translator.expression.translate(op_code, result);
			result.push(";");
		}
		else if (op_code instanceof OpHtmlValue)
		{
			if (op_code.kind == "raw")
			{
				result.push("@raw{{ ");
				this.translator.expression.translate(op_code.value, result);
				result.push(" }}");
			}
			else
			{
				result.push("{{ ");
				this.translator.expression.translate(op_code.value, result);
				result.push(" }}");
			}
		}
		else
		{
			result.push("{{ ");
			this.translator.expression.translate(op_code, result);
			result.push(" }}");
		}
	}
	
	
	/**
	 * Translate html items
	 */
	OpHtmlItems(op_code, result, is_multiline)
	{
		if (is_multiline == undefined) is_multiline = true;
		let items_count = op_code.items.count();
		for (let i = 0; i < items_count; i++)
		{
			if (is_multiline) result.push(this.translator.newLine());
			this.OpHtmlItem(op_code.items.get(i), result);
		}
	}
	
	
	/**
	 * Translate template
	 */
	translateTemplate(op_code, result)
	{
		const Vector = use("Runtime.Vector");
		if (!op_code.is_html) return;
		/* Begin template */
		if (op_code.name == "render")
		{
			result.push("<template>");
		}
		else
		{
			let args_content = new Vector();
			if (op_code.args && op_code.args.count() > 0)
			{
				this.translator.program.OpDeclareFunctionArgs(op_code, args_content);
			}
			let args = rs.join("", args_content);
			if (args != "") args = " args=\"" + String(args) + String("\"");
			result.push("<template name=\"" + String(op_code.name) + String("\"") + String(args) + String(">"));
		}
		/* Items */
		this.translator.levelInc();
		this.OpHtmlItems(op_code.expression, result);
		this.translator.levelDec();
		/* End template */
		result.push(this.translator.newLine());
		result.push("</template>");
		result.push(this.translator.newLine());
	}
	
	
	/**
	 * Translate class item
	 */
	translateClassItem(op_code, result)
	{
		const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");
		if (op_code instanceof OpDeclareFunction)
		{
			this.translateTemplate(op_code, result);
		}
	}
	
	
	/**
	 * Translate style
	 */
	translateStyle(op_code, result)
	{
		if (op_code.is_global)
		{
			result.push("<style global=\"true\">");
		}
		else
		{
			result.push("<style>");
		}
		result.push(this.translator.newLine());
		if (op_code.content)
		{
			result.push(op_code.content);
			result.push(this.translator.newLine());
		}
		result.push("</style>");
		result.push(this.translator.newLine());
	}
	
	
	/**
	 * Translate class
	 */
	translateClassBody(op_code, result)
	{
		if (op_code.items.count() == 0) return;
		/* Get styles */
		let styles = op_code.items.filter((op_code) => { const OpHtmlStyle = use("BayLang.OpCodes.OpHtmlStyle");return op_code instanceof OpHtmlStyle; });
		/* Translate styles */
		for (let i = 0; i < styles.count(); i++)
		{
			result.push(this.translator.newLine());
			let op_code_item = styles.get(i);
			this.translateStyle(op_code_item, result);
		}
		/* Get templates */
		let templates = op_code.items.filter((op_code) => { const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");return op_code instanceof OpDeclareFunction && op_code.is_html; });
		/* Translate template */
		for (let i = 0; i < templates.count(); i++)
		{
			result.push(this.translator.newLine());
			let op_code_item = templates.get(i);
			this.translateClassItem(op_code_item, result);
		}
		/* Get scripts */
		let scripts = op_code.items.filter((op_code) =>
		{
			const OpAnnotation = use("BayLang.OpCodes.OpAnnotation");
			const OpAssign = use("BayLang.OpCodes.OpAssign");
			const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");
			return op_code instanceof OpAnnotation || op_code instanceof OpAssign || op_code instanceof OpDeclareFunction && !op_code.is_html && !op_code.name == "components";
		});
		/* Translate scripts */
		if (scripts.count() > 0)
		{
			result.push(this.translator.newLine());
			result.push("<script>");
			result.push(this.translator.newLine());
			result.push(this.translator.newLine());
			for (let i = 0; i < scripts.count(); i++)
			{
				let op_code_item = scripts.get(i);
				this.translator.program.translateClassItem(op_code_item, result);
				result.push(this.translator.newLine());
			}
			result.push(this.translator.newLine());
			result.push("</script>");
			result.push(this.translator.newLine());
		}
	}
	
	
	/**
	 * Translate
	 */
	translate(op_code, result)
	{
		const lib = use("Runtime.lib");
		const Vector = use("Runtime.Vector");
		let space = op_code.items.findItem(lib.isInstance("BayLang.OpCodes.OpNamespace"));
		let component = op_code.items.findItem(lib.isInstance("BayLang.OpCodes.OpDeclareClass"));
		let uses = op_code.items.filter(lib.isInstance("BayLang.OpCodes.OpUse"));
		if (!component) return;
		/* Get component name */
		let component_names = new Vector();
		if (space) component_names.push(space.name);
		component_names.push(component.name);
		let component_name = rs.join(".", component_names);
		result.push("<class name=\"" + String(component_name) + String("\">"));
		result.push(this.translator.newLine());
		/* Add uses */
		if (uses.count() > 0)
		{
			result.push(this.translator.newLine());
			for (let i = 0; i < uses.count(); i++)
			{
				let use_item = uses.get(i);
				this.OpUse(use_item, result);
				result.push(this.translator.newLine());
			}
		}
		/* Declare class */
		this.translateClassBody(component, result);
		if (component.items.count() > 0 || uses.count() > 0)
		{
			result.push(this.translator.newLine());
		}
		result.push("</class>");
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.translator = null;
	}
	static getClassName(){ return "BayLang.LangBay.TranslatorBayHtml"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangBay.TranslatorBayHtml);
module.exports = {
	"TranslatorBayHtml": BayLang.LangBay.TranslatorBayHtml,
};