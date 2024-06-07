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
BayLang.LangBay.TranslatorBayHtml = function(ctx, translator)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.translator = translator;
};
BayLang.LangBay.TranslatorBayHtml.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.LangBay.TranslatorBayHtml.prototype.constructor = BayLang.LangBay.TranslatorBayHtml;
Object.assign(BayLang.LangBay.TranslatorBayHtml.prototype,
{
	/**
	 * Translate html content
	 */
	OpHtmlContent: function(ctx, op_code, result)
	{
		result.push(ctx, op_code.value);
	},
	/**
	 * Translate attrs
	 */
	OpHtmlAttrs: function(ctx, op_code_attrs, result)
	{
		var attrs_count = op_code_attrs.count(ctx);
		for (var i = 0; i < attrs_count; i++)
		{
			var op_code_attr = op_code_attrs.get(ctx, i);
			result.push(ctx, op_code_attr.key);
			result.push(ctx, "=");
			/* Value */
			var __v0 = use("BayLang.OpCodes.OpString");
			if (op_code_attr.value instanceof __v0)
			{
				this.translator.expression.translate(ctx, op_code_attr.value, result);
			}
			else
			{
				result.push(ctx, "{{ ");
				this.translator.expression.translate(ctx, op_code_attr.value, result);
				result.push(ctx, " }}");
			}
			if (i < attrs_count - 1)
			{
				result.push(ctx, " ");
			}
		}
	},
	/**
	 * Translate html tag
	 */
	OpHtmlTag: function(ctx, op_code, result)
	{
		/* Component attrs */
		var args_content = use("Runtime.Vector").from([]);
		this.OpHtmlAttrs(ctx, op_code.attrs, args_content);
		var __v0 = use("Runtime.rs");
		var args = __v0.join(ctx, "", args_content);
		if (args != "")
		{
			args = " " + use("Runtime.rtl").toStr(args);
		}
		if (op_code.items == null)
		{
			result.push(ctx, "<" + use("Runtime.rtl").toStr(op_code.tag_name) + use("Runtime.rtl").toStr(args) + use("Runtime.rtl").toStr(" />"));
		}
		else
		{
			/* Begin tag */
			result.push(ctx, "<" + use("Runtime.rtl").toStr(op_code.tag_name) + use("Runtime.rtl").toStr(args) + use("Runtime.rtl").toStr(">"));
			this.translator.levelInc(ctx);
			/* Items */
			this.OpHtmlItems(ctx, op_code.items, result);
			/* End tag */
			this.translator.levelDec(ctx);
			result.push(ctx, this.translator.newLine(ctx));
			result.push(ctx, "</" + use("Runtime.rtl").toStr(op_code.tag_name) + use("Runtime.rtl").toStr(">"));
		}
	},
	/**
	 * Translate html item
	 */
	OpHtmlItem: function(ctx, op_code, result)
	{
		var __v0 = use("BayLang.OpCodes.OpHtmlTag");
		var __v1 = use("BayLang.OpCodes.OpHtmlContent");
		if (op_code instanceof __v0)
		{
			this.OpHtmlTag(ctx, op_code, result);
		}
		else if (op_code instanceof __v1)
		{
			this.OpHtmlContent(ctx, op_code, result);
		}
		else
		{
			result.push(ctx, "{{ ");
			this.translator.expression.translate(ctx, op_code, result);
			result.push(ctx, " }}");
		}
	},
	/**
	 * Translate html items
	 */
	OpHtmlItems: function(ctx, op_code, result)
	{
		var items_count = op_code.items.count(ctx);
		for (var i = 0; i < items_count; i++)
		{
			result.push(ctx, this.translator.newLine(ctx));
			this.OpHtmlItem(ctx, op_code.items.get(ctx, i), result);
		}
	},
	/**
	 * Translate template
	 */
	translateTemplate: function(ctx, op_code, result)
	{
		if (!op_code.is_html)
		{
			return ;
		}
		/* Begin template */
		if (op_code.name == "render")
		{
			result.push(ctx, "<template>");
		}
		else
		{
			var args_content = use("Runtime.Vector").from([]);
			if (op_code.args && op_code.args.count(ctx) > 0)
			{
				this.translator.program.OpDeclareFunctionArgs(ctx, op_code, args_content);
			}
			var __v0 = use("Runtime.rs");
			var args = __v0.join(ctx, "", args_content);
			if (args != "")
			{
				args = " args=\"" + use("Runtime.rtl").toStr(args) + use("Runtime.rtl").toStr("\"");
			}
			result.push(ctx, "<template name=\"" + use("Runtime.rtl").toStr(op_code.name) + use("Runtime.rtl").toStr("\"") + use("Runtime.rtl").toStr(args) + use("Runtime.rtl").toStr(">"));
		}
		/* Items */
		this.translator.levelInc(ctx);
		this.OpHtmlItems(ctx, op_code.expression, result);
		this.translator.levelDec(ctx);
		/* End template */
		result.push(ctx, this.translator.newLine(ctx));
		result.push(ctx, "</template>");
		result.push(ctx, this.translator.newLine(ctx));
	},
	/**
	 * Translate class item
	 */
	translateClassItem: function(ctx, op_code, result)
	{
		var __v0 = use("BayLang.OpCodes.OpDeclareFunction");
		if (op_code instanceof __v0)
		{
			this.translateTemplate(ctx, op_code, result);
		}
	},
	/**
	 * Translate style
	 */
	translateStyle: function(ctx, op_code, result)
	{
		if (op_code.is_global)
		{
			result.push(ctx, "<style global=\"true\">");
		}
		else
		{
			result.push(ctx, "<style>");
		}
		result.push(ctx, this.translator.newLine(ctx));
		result.push(ctx, op_code.content);
		result.push(ctx, this.translator.newLine(ctx));
		result.push(ctx, "</style>");
		result.push(ctx, this.translator.newLine(ctx));
	},
	/**
	 * Translate class
	 */
	translateClassBody: function(ctx, op_code, result)
	{
		if (op_code.items.count(ctx) == 0)
		{
			return ;
		}
		/* Get styles */
		var styles = op_code.items.filter(ctx, (ctx, op_code) =>
		{
			var __v0 = use("BayLang.OpCodes.OpHtmlStyle");
			return op_code instanceof __v0;
		});
		/* Translate styles */
		for (var i = 0; i < styles.count(ctx); i++)
		{
			result.push(ctx, this.translator.newLine(ctx));
			var op_code_item = styles.get(ctx, i);
			this.translateStyle(ctx, op_code_item, result);
		}
		/* Get templates */
		var templates = op_code.items.filter(ctx, (ctx, op_code) =>
		{
			var __v0 = use("BayLang.OpCodes.OpDeclareFunction");
			return op_code instanceof __v0 && op_code.is_html;
		});
		/* Translate template */
		for (var i = 0; i < templates.count(ctx); i++)
		{
			result.push(ctx, this.translator.newLine(ctx));
			var op_code_item = templates.get(ctx, i);
			this.translateClassItem(ctx, op_code_item, result);
		}
		/* Get scripts */
		var scripts = op_code.items.filter(ctx, (ctx, op_code) =>
		{
			var __v0 = use("BayLang.OpCodes.OpDeclareFunction");
			return op_code instanceof __v0 && !op_code.is_html;
		});
		/* Translate scripts */
		if (scripts.count(ctx) > 0)
		{
			result.push(ctx, this.translator.newLine(ctx));
			result.push(ctx, "<script>");
			result.push(ctx, this.translator.newLine(ctx));
			result.push(ctx, this.translator.newLine(ctx));
			for (var i = 0; i < scripts.count(ctx); i++)
			{
				var op_code_item = scripts.get(ctx, i);
				this.translator.program.translateClassItem(ctx, op_code_item, result);
				result.push(ctx, this.translator.newLine(ctx));
			}
			result.push(ctx, this.translator.newLine(ctx));
			result.push(ctx, "</script>");
			result.push(ctx, this.translator.newLine(ctx));
		}
	},
	/**
	 * Translate
	 */
	translate: function(ctx, op_code, result)
	{
		var __v0 = use("Runtime.lib");
		var space = op_code.items.findItem(ctx, __v0.isInstance(ctx, "BayLang.OpCodes.OpNamespace"));
		var __v1 = use("Runtime.lib");
		var component = op_code.items.findItem(ctx, __v1.isInstance(ctx, "BayLang.OpCodes.OpDeclareClass"));
		var __v2 = use("Runtime.lib");
		var uses = op_code.items.filter(ctx, __v2.isInstance(ctx, "BayLang.OpCodes.OpUse"));
		if (!component)
		{
			return ;
		}
		/* Get component name */
		var component_names = use("Runtime.Vector").from([]);
		if (space)
		{
			component_names.push(ctx, space.name);
		}
		component_names.push(ctx, component.name);
		var __v3 = use("Runtime.rs");
		var component_name = __v3.join(ctx, ".", component_names);
		result.push(ctx, "<class name=\"" + use("Runtime.rtl").toStr(component_name) + use("Runtime.rtl").toStr("\">"));
		result.push(ctx, this.translator.newLine(ctx));
		/* Add uses */
		if (uses.count(ctx) > 0)
		{
			result.push(ctx, this.translator.newLine(ctx));
			for (var i = 0; i < uses.count(ctx); i++)
			{
				result.push(ctx, "<use name=\"" + use("Runtime.rtl").toStr(uses.get(ctx, i).name) + use("Runtime.rtl").toStr("\" />"));
				result.push(ctx, this.translator.newLine(ctx));
			}
		}
		/* Declare class */
		this.translateClassBody(ctx, component, result);
		if (component.items.count(ctx) > 0 || uses.count(ctx) > 0)
		{
			result.push(ctx, this.translator.newLine(ctx));
		}
		result.push(ctx, "</class>");
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
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
	getClassInfo: function(ctx)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function(ctx)
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function(ctx)
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		return null;
	},
});use.add(BayLang.LangBay.TranslatorBayHtml);
module.exports = BayLang.LangBay.TranslatorBayHtml;