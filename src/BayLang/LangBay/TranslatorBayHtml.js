"use strict;"
var use = require('bay-lang').use;
/*!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2024 "Ildar Bikmamatov" <support@bayrell.org>
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
BayLang.LangBay.TranslatorBayHtml = function(translator)
{
	use("Runtime.BaseObject").call(this);
	this.translator = translator;
};
BayLang.LangBay.TranslatorBayHtml.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangBay.TranslatorBayHtml.prototype.constructor = BayLang.LangBay.TranslatorBayHtml;
Object.assign(BayLang.LangBay.TranslatorBayHtml.prototype,
{
	/**
	 * OpAssign
	 */
	OpAssign: function(op_code, result)
	{
		result.push("%set ");
		this.translator.operator.OpAssign(op_code, result);
		result.push(";");
	},
	/**
	 * OpUse
	 */
	OpUse: function(op_code, result)
	{
		var __v0 = use("Runtime.rs");
		var items = __v0.split(".", op_code.name);
		var last_name = items.last();
		/* Get attrs */
		var attrs = use("Runtime.Vector").from(["name=\"" + use("Runtime.rtl").toStr(op_code.name) + use("Runtime.rtl").toStr("\"")]);
		/* Add alias name */
		if (op_code.alias != "" && op_code.alias != last_name)
		{
			attrs.push("as=\"" + use("Runtime.rtl").toStr(op_code.alias) + use("Runtime.rtl").toStr("\""));
		}
		/* Add component */
		if (op_code.is_component)
		{
			attrs.push("component=\"true\"");
		}
		/* Add result */
		var __v1 = use("Runtime.rs");
		result.push("<use " + use("Runtime.rtl").toStr(__v1.join(" ", attrs)) + use("Runtime.rtl").toStr(" />"));
	},
	/**
	 * Translate html content
	 */
	OpHtmlContent: function(op_code, result)
	{
		result.push(op_code.value);
	},
	/**
	 * Translate attrs
	 */
	OpHtmlAttrs: function(op_code_attrs, result, is_multiline)
	{
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
		if (is_multiline)
		{
			this.translator.levelInc();
		}
		var attrs_count = op_code_attrs.count();
		for (var i = 0; i < attrs_count; i++)
		{
			var op_code_attr = op_code_attrs.get(i);
			if (is_multiline)
			{
				result.push(this.translator.newLine());
			}
			result.push(op_code_attr.key);
			result.push("=");
			/* Value */
			var __v0 = use("BayLang.OpCodes.OpString");
			var __v1 = use("BayLang.OpCodes.OpDeclareFunction");
			if (op_code_attr.value instanceof __v0)
			{
				this.translator.expression.translate(op_code_attr.value, result);
			}
			else if (op_code_attr.value instanceof __v1)
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
			if (i < attrs_count - 1 && !is_multiline)
			{
				result.push(" ");
			}
		}
		if (is_multiline)
		{
			this.translator.levelDec();
			result.push(this.translator.newLine());
		}
	},
	/**
	 * Html code multiline
	 */
	isOpHtmlTagMultiline: function(op_code)
	{
		var attrs_count = 0;
		for (var i = 0; i < op_code.attrs.count(); i++)
		{
			var op_code_attr = op_code.attrs.get(i);
			if (op_code_attr.key != "@key_debug")
			{
				attrs_count++;
			}
			if (op_code_attr.caret_start && op_code_attr.caret_start.y > 0)
			{
				if (op_code_attr.isMultiLine())
				{
					return true;
				}
				if (op_code.caret_start.y > 0 && op_code_attr.caret_start.y != op_code.caret_start.y)
				{
					return true;
				}
			}
			var __v0 = use("BayLang.OpCodes.OpDeclareFunction");
			if (op_code_attr.value instanceof __v0)
			{
				return true;
			}
		}
		if (attrs_count > 3)
		{
			return true;
		}
		return false;
	},
	/**
	 * Translate html tag
	 */
	OpHtmlTag: function(op_code, result)
	{
		var is_multiline = op_code.isMultiLine();
		var is_multiline_attrs = this.isOpHtmlTagMultiline(op_code);
		/* Component attrs */
		var args_content = use("Runtime.Vector").from([]);
		this.OpHtmlAttrs(op_code.attrs, args_content, is_multiline_attrs);
		var __v0 = use("Runtime.rs");
		var args = __v0.join("", args_content);
		if (args != "" && !is_multiline_attrs)
		{
			args = " " + use("Runtime.rtl").toStr(args);
		}
		if (op_code.items == null)
		{
			result.push("<" + use("Runtime.rtl").toStr(op_code.tag_name) + use("Runtime.rtl").toStr(args) + use("Runtime.rtl").toStr(" />"));
		}
		else
		{
			/* Begin tag */
			result.push("<" + use("Runtime.rtl").toStr(op_code.tag_name) + use("Runtime.rtl").toStr(args) + use("Runtime.rtl").toStr(">"));
			if (is_multiline)
			{
				this.translator.levelInc();
			}
			/* Items */
			this.OpHtmlItems(op_code.items, result, is_multiline);
			/* End tag */
			if (is_multiline)
			{
				this.translator.levelDec();
				result.push(this.translator.newLine());
			}
			result.push("</" + use("Runtime.rtl").toStr(op_code.tag_name) + use("Runtime.rtl").toStr(">"));
		}
	},
	/**
	 * OpHtmlSlot
	 */
	OpHtmlSlot: function(op_code, result)
	{
		/* Slot attrs */
		var args_content = use("Runtime.Vector").from([]);
		this.OpHtmlAttrs(op_code.attrs, args_content);
		/* Add slot args */
		if (op_code.args)
		{
			var args = op_code.args.map((item) =>
			{
				var __v0 = use("Runtime.Vector");
				var res = new __v0();
				this.translator.expression.OpTypeIdentifier(item.pattern, res);
				res.push(" ");
				res.push(item.name);
				var __v1 = use("Runtime.rs");
				return __v1.join("", res);
			});
			if (args_content.count() > 0)
			{
				args_content.push(" ");
			}
			var __v0 = use("Runtime.rs");
			args_content.push("args=\"" + use("Runtime.rtl").toStr(__v0.join(",", args)) + use("Runtime.rtl").toStr("\""));
		}
		/* Add slot vars */
		if (op_code.vars)
		{
			var vars = op_code.vars.map((item) =>
			{
				return item.value;
			});
			if (args_content.count() > 0)
			{
				args_content.push(" ");
			}
			var __v0 = use("Runtime.rs");
			args_content.push("use=\"" + use("Runtime.rtl").toStr(__v0.join(",", vars)) + use("Runtime.rtl").toStr("\""));
		}
		/* Slot args */
		var __v0 = use("Runtime.rs");
		var args = __v0.join("", args_content);
		if (args != "")
		{
			args = " " + use("Runtime.rtl").toStr(args);
		}
		/* Begin slot */
		result.push("<slot name=\"" + use("Runtime.rtl").toStr(op_code.name) + use("Runtime.rtl").toStr("\"") + use("Runtime.rtl").toStr(args) + use("Runtime.rtl").toStr(">"));
		/* Items */
		this.translator.levelInc();
		this.OpHtmlItems(op_code.items, result);
		this.translator.levelDec();
		/* End slot */
		result.push(this.translator.newLine());
		result.push("</slot>");
	},
	/**
	 * Translate html item
	 */
	OpHtmlItem: function(op_code, result)
	{
		var __v0 = use("BayLang.OpCodes.OpAssign");
		var __v1 = use("BayLang.OpCodes.OpHtmlTag");
		var __v2 = use("BayLang.OpCodes.OpHtmlContent");
		var __v3 = use("BayLang.OpCodes.OpHtmlSlot");
		var __v4 = use("BayLang.OpCodes.OpCall");
		var __v5 = use("BayLang.OpCodes.OpHtmlValue");
		if (op_code instanceof __v0)
		{
			this.OpAssign(op_code, result);
		}
		else if (op_code instanceof __v1)
		{
			this.OpHtmlTag(op_code, result);
		}
		else if (op_code instanceof __v2)
		{
			this.OpHtmlContent(op_code, result);
		}
		else if (op_code instanceof __v3)
		{
			this.OpHtmlSlot(op_code, result);
		}
		else if (op_code instanceof __v4 && op_code.is_html)
		{
			result.push("%render ");
			this.translator.expression.translate(op_code, result);
			result.push(";");
		}
		else if (op_code instanceof __v5)
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
	},
	/**
	 * Translate html items
	 */
	OpHtmlItems: function(op_code, result, is_multiline)
	{
		if (is_multiline == undefined) is_multiline = true;
		var items_count = op_code.items.count();
		for (var i = 0; i < items_count; i++)
		{
			if (is_multiline)
			{
				result.push(this.translator.newLine());
			}
			this.OpHtmlItem(op_code.items.get(i), result);
		}
	},
	/**
	 * Translate template
	 */
	translateTemplate: function(op_code, result)
	{
		if (!op_code.is_html)
		{
			return ;
		}
		/* Begin template */
		if (op_code.name == "render")
		{
			result.push("<template>");
		}
		else
		{
			var args_content = use("Runtime.Vector").from([]);
			if (op_code.args && op_code.args.count() > 0)
			{
				this.translator.program.OpDeclareFunctionArgs(op_code, args_content);
			}
			var __v0 = use("Runtime.rs");
			var args = __v0.join("", args_content);
			if (args != "")
			{
				args = " args=\"" + use("Runtime.rtl").toStr(args) + use("Runtime.rtl").toStr("\"");
			}
			result.push("<template name=\"" + use("Runtime.rtl").toStr(op_code.name) + use("Runtime.rtl").toStr("\"") + use("Runtime.rtl").toStr(args) + use("Runtime.rtl").toStr(">"));
		}
		/* Items */
		this.translator.levelInc();
		this.OpHtmlItems(op_code.expression, result);
		this.translator.levelDec();
		/* End template */
		result.push(this.translator.newLine());
		result.push("</template>");
		result.push(this.translator.newLine());
	},
	/**
	 * Translate class item
	 */
	translateClassItem: function(op_code, result)
	{
		var __v0 = use("BayLang.OpCodes.OpDeclareFunction");
		if (op_code instanceof __v0)
		{
			this.translateTemplate(op_code, result);
		}
	},
	/**
	 * Translate style
	 */
	translateStyle: function(op_code, result)
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
	},
	/**
	 * Translate class
	 */
	translateClassBody: function(op_code, result)
	{
		if (op_code.items.count() == 0)
		{
			return ;
		}
		/* Get styles */
		var styles = op_code.items.filter((op_code) =>
		{
			var __v0 = use("BayLang.OpCodes.OpHtmlStyle");
			return op_code instanceof __v0;
		});
		/* Translate styles */
		for (var i = 0; i < styles.count(); i++)
		{
			result.push(this.translator.newLine());
			var op_code_item = styles.get(i);
			this.translateStyle(op_code_item, result);
		}
		/* Get templates */
		var templates = op_code.items.filter((op_code) =>
		{
			var __v0 = use("BayLang.OpCodes.OpDeclareFunction");
			return op_code instanceof __v0 && op_code.is_html;
		});
		/* Translate template */
		for (var i = 0; i < templates.count(); i++)
		{
			result.push(this.translator.newLine());
			var op_code_item = templates.get(i);
			this.translateClassItem(op_code_item, result);
		}
		/* Get scripts */
		var scripts = op_code.items.filter((op_code) =>
		{
			var __v0 = use("BayLang.OpCodes.OpAnnotation");
			var __v1 = use("BayLang.OpCodes.OpAssign");
			var __v2 = use("BayLang.OpCodes.OpDeclareFunction");
			return op_code instanceof __v0 || op_code instanceof __v1 || op_code instanceof __v2 && !op_code.is_html && !(op_code.name == "components");
		});
		/* Translate scripts */
		if (scripts.count() > 0)
		{
			result.push(this.translator.newLine());
			result.push("<script>");
			result.push(this.translator.newLine());
			result.push(this.translator.newLine());
			for (var i = 0; i < scripts.count(); i++)
			{
				var op_code_item = scripts.get(i);
				this.translator.program.translateClassItem(op_code_item, result);
				result.push(this.translator.newLine());
			}
			result.push(this.translator.newLine());
			result.push("</script>");
			result.push(this.translator.newLine());
		}
	},
	/**
	 * Translate
	 */
	translate: function(op_code, result)
	{
		var __v0 = use("Runtime.lib");
		var space = op_code.items.findItem(__v0.isInstance("BayLang.OpCodes.OpNamespace"));
		var __v1 = use("Runtime.lib");
		var component = op_code.items.findItem(__v1.isInstance("BayLang.OpCodes.OpDeclareClass"));
		var __v2 = use("Runtime.lib");
		var uses = op_code.items.filter(__v2.isInstance("BayLang.OpCodes.OpUse"));
		if (!component)
		{
			return ;
		}
		/* Get component name */
		var component_names = use("Runtime.Vector").from([]);
		if (space)
		{
			component_names.push(space.name);
		}
		component_names.push(component.name);
		var __v3 = use("Runtime.rs");
		var component_name = __v3.join(".", component_names);
		result.push("<class name=\"" + use("Runtime.rtl").toStr(component_name) + use("Runtime.rtl").toStr("\">"));
		result.push(this.translator.newLine());
		/* Add uses */
		if (uses.count() > 0)
		{
			result.push(this.translator.newLine());
			for (var i = 0; i < uses.count(); i++)
			{
				var use_item = uses.get(i);
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
	},
	_init: function()
	{
		use("Runtime.BaseObject").prototype._init.call(this);
		this.translator = null;
	},
});
Object.assign(BayLang.LangBay.TranslatorBayHtml, use("Runtime.BaseObject"));
Object.assign(BayLang.LangBay.TranslatorBayHtml,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.LangBay.TranslatorBayHtml";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
	},
	getClassInfo: function()
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function()
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function()
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(field_name)
	{
		return null;
	},
});use.add(BayLang.LangBay.TranslatorBayHtml);
module.exports = BayLang.LangBay.TranslatorBayHtml;