"use strict;"
var use = require('bay-lang').use;
/*!
 *  Bayrell Language
 *
 *  (c) Copyright 2016-2023 "Ildar Bikmamatov" <support@bayrell.org>
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
if (typeof Bayrell == 'undefined') Bayrell = {};
if (typeof Bayrell.Lang == 'undefined') Bayrell.Lang = {};
if (typeof Bayrell.Lang.LangPHP == 'undefined') Bayrell.Lang.LangPHP = {};
Bayrell.Lang.LangPHP.TranslatorPHPHtml = function(ctx)
{
};
Object.assign(Bayrell.Lang.LangPHP.TranslatorPHPHtml.prototype,
{
});
Object.assign(Bayrell.Lang.LangPHP.TranslatorPHPHtml,
{
	/**
	 * Is component
	 */
	isComponent: function(ctx, tag_name)
	{
		var __v0 = use("Runtime.rs");
		var ch1 = __v0.substr(ctx, tag_name, 0, 1);
		var __v1 = use("Runtime.rs");
		var ch2 = __v1.upper(ctx, ch1);
		return tag_name != "" && (ch1 == "{" || ch1 == ch2) && tag_name != "Teleport";
	},
	/**
	 * Is single tag
	 */
	isSingleTag: function(ctx, tag_name)
	{
		var tokens = use("Runtime.Vector").from(["img","meta","input","link","br"]);
		if (tokens.indexOf(ctx, tag_name) == -1)
		{
			return false;
		}
		return true;
	},
	/**
	 * Translator html attr
	 */
	OpHtmlAttr: function(ctx, t, attr)
	{
		var op_code = attr.value;
		var __v0 = use("Bayrell.Lang.OpCodes.OpString");
		if (op_code instanceof __v0)
		{
			return use("Runtime.Vector").from([t,t.expression.constructor.toString(ctx, op_code.value)]);
		}
		var __v0 = use("Bayrell.Lang.OpCodes.OpHtmlValue");
		if (op_code instanceof __v0)
		{
			var __v1 = use("Bayrell.Lang.OpCodes.OpHtmlValue");
			var __v2 = use("Bayrell.Lang.OpCodes.OpHtmlValue");
			if (op_code.kind == __v1.KIND_RAW)
			{
				var res = t.expression.constructor.Expression(ctx, t, op_code.value);
				t = Runtime.rtl.attr(ctx, res, 0);
				var value = Runtime.rtl.attr(ctx, res, 1);
				return use("Runtime.Vector").from([t,value]);
			}
			else if (op_code.kind == __v2.KIND_JSON)
			{
				var res = t.expression.constructor.Expression(ctx, t, op_code.value);
				t = Runtime.rtl.attr(ctx, res, 0);
				var value = Runtime.rtl.attr(ctx, res, 1);
				value = "\\Runtime\\rtl::json_encode(" + use("Runtime.rtl").toStr(value) + use("Runtime.rtl").toStr(")");
				return use("Runtime.Vector").from([t,value]);
			}
		}
		var res = t.expression.constructor.Expression(ctx, t, op_code);
		t = Runtime.rtl.attr(ctx, res, 0);
		var value = Runtime.rtl.attr(ctx, res, 1);
		value = t.o(ctx, value, Runtime.rtl.attr(ctx, res, 0).opcode_level, 13);
		return use("Runtime.Vector").from([t,value]);
	},
	/**
	 * Translator html template
	 */
	OpHtmlAttrs: function(ctx, t, attrs)
	{
		var __v0 = use("Runtime.Vector");
		var attr_class = new __v0(ctx);
		var attr_s = "null";
		var attr_key_value = "";
		var attr_elem_name = "";
		var has_attr_key = false;
		var __v1 = use("Runtime.Vector");
		var res_attrs = new __v1(ctx);
		for (var attrs_i = 0; attrs_i < attrs.count(ctx); attrs_i++)
		{
			var attr = Runtime.rtl.attr(ctx, attrs, attrs_i);
			if (attr.is_spread)
			{
				continue;
			}
			var attr_key = attr.key;
			var __v2 = use("Runtime.rs");
			var ch = __v2.substr(ctx, attr_key, 0, 1);
			if (ch == "@" && attr_key != "@model" && attr_key != "@global")
			{
				continue;
			}
			var res = this.OpHtmlAttr(ctx, t, attr);
			t = Runtime.rtl.attr(ctx, res, 0);
			var attr_value = Runtime.rtl.attr(ctx, res, 1);
			if (attr_key == "class")
			{
				attr_class.push(ctx, attr_value);
				var __v3 = use("Bayrell.Lang.OpCodes.OpString");
				if (attr_elem_name == "" && attr.value instanceof __v3)
				{
					var __v4 = use("Runtime.rs");
					var arr = __v4.split(ctx, " ", attr.value.value);
					attr_elem_name = t.expression.constructor.toString(ctx, Runtime.rtl.attr(ctx, arr, 0));
				}
				continue;
			}
			else if (attr_key == "@global")
			{
				attr_key = "model";
				attr_value = "$this->_model(" + use("Runtime.rtl").toStr(attr_value) + use("Runtime.rtl").toStr(", true)");
			}
			else if (attr_key == "@model")
			{
				attr_key = "model";
				attr_value = "$this->_model(" + use("Runtime.rtl").toStr(attr_value) + use("Runtime.rtl").toStr(")");
			}
			res_attrs.push(ctx, t.expression.constructor.toString(ctx, attr_key) + use("Runtime.rtl").toStr(" => ") + use("Runtime.rtl").toStr(attr_value));
		}
		res_attrs = res_attrs.filter(ctx, (ctx, s) => 
		{
			return s != "";
		});
		if (attr_class.count(ctx) > 0)
		{
			res_attrs.push(ctx, "\"class\" => " + use("Runtime.rtl").toStr("$this->_class_name([") + use("Runtime.rtl").toStr(attr_class) + use("Runtime.rtl").toStr("])"));
		}
		if (res_attrs.count(ctx) > 0)
		{
			var __v2 = use("Runtime.rs");
			attr_s = "[" + use("Runtime.rtl").toStr(__v2.join(ctx, ",", res_attrs)) + use("Runtime.rtl").toStr("]");
		}
		else
		{
			attr_s = "[]";
		}
		/* Add spreads */
		for (var i = 0; i < attrs.count(ctx); i++)
		{
			var attr = Runtime.rtl.attr(ctx, attrs, i);
			if (!attr.is_spread)
			{
				continue;
			}
			attr_s = "$this->_merge_attrs(" + use("Runtime.rtl").toStr(attr_s) + use("Runtime.rtl").toStr(", $") + use("Runtime.rtl").toStr(attr.value.value) + use("Runtime.rtl").toStr(")");
		}
		return use("Runtime.Vector").from([t,attr_s]);
	},
	/**
	 * Translator html template
	 */
	OpHtmlTag: function(ctx, t, op_code, var_name)
	{
		var content = "";
		var __v0 = use("Bayrell.Lang.OpCodes.OpHtmlContent");
		var __v1 = use("Bayrell.Lang.OpCodes.OpHtmlValue");
		var __v2 = use("Bayrell.Lang.OpCodes.OpHtmlTag");
		if (op_code instanceof __v0)
		{
			var item_value = t.expression.constructor.toString(ctx, op_code.value);
			content += use("Runtime.rtl").toStr(t.s(ctx, "/* Text */"));
			content += use("Runtime.rtl").toStr(t.s(ctx, "$this->_t(" + use("Runtime.rtl").toStr(var_name) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(item_value) + use("Runtime.rtl").toStr(");")));
		}
		else if (op_code instanceof __v1)
		{
			/* Save op codes */
			var save_op_codes = t.save_op_codes;
			/*int save_op_code_inc = t.save_op_code_inc;*/
			var res = t.expression.constructor.Expression(ctx, t, op_code.value);
			t = Runtime.rtl.attr(ctx, res, 0);
			var item_value = Runtime.rtl.attr(ctx, res, 1);
			/* Restore op codes */
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_codes"]), save_op_codes);
			/*t <= save_op_code_inc <= save_op_code_inc;*/
			var __v2 = use("Bayrell.Lang.OpCodes.OpHtmlValue");
			var __v3 = use("Bayrell.Lang.OpCodes.OpHtmlValue");
			if (op_code.kind == __v2.KIND_RAW)
			{
				content += use("Runtime.rtl").toStr(t.s(ctx, "/* Raw */"));
				content += use("Runtime.rtl").toStr(t.s(ctx, "$this->_t(" + use("Runtime.rtl").toStr(var_name) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr("new \\Runtime\\RawString(") + use("Runtime.rtl").toStr(item_value) + use("Runtime.rtl").toStr("));")));
			}
			else if (op_code.kind == __v3.KIND_JSON)
			{
				content += use("Runtime.rtl").toStr(t.s(ctx, "/* Text */"));
				item_value = "\\Runtime\\rtl::json_encode(" + use("Runtime.rtl").toStr(item_value) + use("Runtime.rtl").toStr(")");
				content += use("Runtime.rtl").toStr(t.s(ctx, "$this->_t(" + use("Runtime.rtl").toStr(var_name) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(item_value) + use("Runtime.rtl").toStr(");")));
			}
		}
		else if (op_code instanceof __v2)
		{
			var new_var_name = "";
			var res = t.constructor.incSaveOpCode(ctx, t);
			t = Runtime.rtl.attr(ctx, res, 0);
			new_var_name = Runtime.rtl.attr(ctx, res, 1);
			var has_childs = op_code.items != null && op_code.items.items != null && op_code.items.items.count(ctx) > 0;
			var is_component = this.isComponent(ctx, op_code.tag_name);
			var op_code_attrs = op_code.attrs.filter(ctx, (ctx, attr) => 
			{
				return attr.key != "@render";
			});
			var res = this.OpHtmlAttrs(ctx, t, op_code_attrs);
			t = Runtime.rtl.attr(ctx, res, 0);
			var attrs = Runtime.rtl.attr(ctx, res, 1);
			if (op_code.tag_name == "")
			{
			}
			else if (is_component)
			{
				var tag_name = "";
				if (op_code.op_code_name)
				{
					var res = t.expression.constructor.Expression(ctx, t, op_code.op_code_name);
					t = Runtime.rtl.attr(ctx, res, 0);
					tag_name = Runtime.rtl.attr(ctx, res, 1);
				}
				else
				{
					tag_name = t.expression.constructor.toString(ctx, t.expression.constructor.findModuleName(ctx, t, op_code.tag_name));
				}
				if (has_childs)
				{
					var res = this.OpHtmlItemsAsFunction(ctx, t, op_code.items);
					t = Runtime.rtl.attr(ctx, res, 0);
					var f = Runtime.rtl.attr(ctx, res, 1);
					content += use("Runtime.rtl").toStr(t.s(ctx, "/* Component '" + use("Runtime.rtl").toStr(op_code.tag_name) + use("Runtime.rtl").toStr("' */")));
					content += use("Runtime.rtl").toStr(t.s(ctx, "$this->_c(" + use("Runtime.rtl").toStr(var_name) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(tag_name) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(attrs) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(f) + use("Runtime.rtl").toStr(");")));
					has_childs = false;
				}
				else
				{
					content += use("Runtime.rtl").toStr(t.s(ctx, "/* Component '" + use("Runtime.rtl").toStr(op_code.tag_name) + use("Runtime.rtl").toStr("' */")));
					content += use("Runtime.rtl").toStr(t.s(ctx, "$this->_c(" + use("Runtime.rtl").toStr(var_name) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(tag_name) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(attrs) + use("Runtime.rtl").toStr(");")));
				}
			}
			else
			{
				var tag_name = t.expression.constructor.toString(ctx, op_code.tag_name);
				if (has_childs)
				{
					content += use("Runtime.rtl").toStr(t.s(ctx, "/* Element '" + use("Runtime.rtl").toStr(op_code.tag_name) + use("Runtime.rtl").toStr("' */")));
					content += use("Runtime.rtl").toStr(t.s(ctx, new_var_name + use("Runtime.rtl").toStr(" = new \\Runtime\\Vector();")));
					var res = this.OpHtmlItems(ctx, t, op_code.items, new_var_name, true);
					t = Runtime.rtl.attr(ctx, res, 0);
					content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
					content += use("Runtime.rtl").toStr(t.s2(ctx, ""));
					if (op_code.tag_name == "Teleport")
					{
						content += use("Runtime.rtl").toStr(t.s(ctx, "/* Teleport */"));
						content += use("Runtime.rtl").toStr(t.s(ctx, "$this->_teleport(" + use("Runtime.rtl").toStr(var_name) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(attrs) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(new_var_name) + use("Runtime.rtl").toStr(");")));
					}
					else
					{
						content += use("Runtime.rtl").toStr(t.s(ctx, "/* Element '" + use("Runtime.rtl").toStr(op_code.tag_name) + use("Runtime.rtl").toStr("' */")));
						content += use("Runtime.rtl").toStr(t.s(ctx, "$this->_e(" + use("Runtime.rtl").toStr(var_name) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(tag_name) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(attrs) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(new_var_name) + use("Runtime.rtl").toStr(");")));
					}
				}
				else
				{
					if (op_code.tag_name == "Teleport")
					{
						content += use("Runtime.rtl").toStr(t.s(ctx, "/* Teleport */"));
						content += use("Runtime.rtl").toStr(t.s(ctx, "$this->_teleport(" + use("Runtime.rtl").toStr(var_name) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(attrs) + use("Runtime.rtl").toStr(");")));
					}
					else
					{
						content += use("Runtime.rtl").toStr(t.s(ctx, "/* Element '" + use("Runtime.rtl").toStr(op_code.tag_name) + use("Runtime.rtl").toStr("' */")));
						content += use("Runtime.rtl").toStr(t.s(ctx, "$this->_e(" + use("Runtime.rtl").toStr(var_name) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(tag_name) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(attrs) + use("Runtime.rtl").toStr(");")));
					}
				}
			}
		}
		else
		{
			/* Save op codes */
			var save_op_codes = t.save_op_codes;
			/*int save_op_code_inc = t.save_op_code_inc;*/
			var item_value = "";
			var __v3 = use("Bayrell.Lang.OpCodes.OpCall");
			if (op_code instanceof __v3)
			{
				var res = t.expression.constructor.OpCall(ctx, t, op_code);
				t = Runtime.rtl.attr(ctx, res, 0);
				item_value += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
				if (!op_code.is_html)
				{
					item_value = "$this->_escape(" + use("Runtime.rtl").toStr(item_value) + use("Runtime.rtl").toStr(")");
				}
			}
			else
			{
				var res = t.expression.constructor.Expression(ctx, t, op_code);
				t = Runtime.rtl.attr(ctx, res, 0);
				item_value = Runtime.rtl.attr(ctx, res, 1);
				item_value = "$this->_escape(" + use("Runtime.rtl").toStr(item_value) + use("Runtime.rtl").toStr(")");
			}
			/* Output save op code */
			var save = t.constructor.outputSaveOpCode(ctx, t, save_op_codes.count(ctx));
			if (save != "")
			{
				content += use("Runtime.rtl").toStr(save);
			}
			/* Restore op codes */
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_codes"]), save_op_codes);
			/*t <= save_op_code_inc <= save_op_code_inc;*/
			content += use("Runtime.rtl").toStr(t.s(ctx, "/* Text */"));
			content += use("Runtime.rtl").toStr(t.s(ctx, "$this->_t(" + use("Runtime.rtl").toStr(var_name) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(item_value) + use("Runtime.rtl").toStr(");")));
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Translator html items
	 */
	OpHtmlExpression: function(ctx, t, op_code, detect_multiblock)
	{
		if (detect_multiblock == undefined) detect_multiblock = true;
		var content = "";
		content += use("Runtime.rtl").toStr(t.s(ctx, "$__v = new \\Runtime\\Vector();"));
		var res = this.OpHtmlItems(ctx, t, op_code, "$__v", true);
		t = Runtime.rtl.attr(ctx, res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		content += use("Runtime.rtl").toStr(t.s2(ctx, ""));
		var res = t.constructor.addSaveOpCode(ctx, t, use("Runtime.Map").from({"content":content}));
		t = Runtime.rtl.attr(ctx, res, 0);
		if (detect_multiblock && t.current_function.flags.isFlag(ctx, "multiblock") && op_code.items.count(ctx) > 1)
		{
			return use("Runtime.Vector").from([t,"$this->_flatten($__v)"]);
		}
		return use("Runtime.Vector").from([t,"$__v->join(\"\")"]);
	},
	/**
	 * Translator html items as function
	 */
	OpHtmlItemsAsFunction: function(ctx, t, op_code)
	{
		var save_op_codes = t.save_op_codes;
		var save_op_code_inc = t.save_op_code_inc;
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_code_inc"]), 0);
		/* Get used vars */
		var use_vars = "";
		var used_vars = use("Runtime.Vector").from([]);
		this.exportUsedVars(ctx, used_vars, op_code);
		if (used_vars.count(ctx) > 0)
		{
			used_vars = used_vars.map(ctx, (ctx, s) => 
			{
				return "$" + use("Runtime.rtl").toStr(s);
			});
			use_vars = " use (" + use("Runtime.rtl").toStr(used_vars.join(ctx, ", ")) + use("Runtime.rtl").toStr(") ");
		}
		var content = "function ()" + use("Runtime.rtl").toStr(use_vars) + use("Runtime.rtl").toStr("{");
		t = t.levelInc(ctx);
		var res = this.OpHtmlExpression(ctx, t, op_code, false);
		t = Runtime.rtl.attr(ctx, res, 0);
		/* Output save op code */
		var save = t.constructor.outputSaveOpCode(ctx, t, save_op_codes.count(ctx));
		if (save != "")
		{
			content += use("Runtime.rtl").toStr(save);
		}
		content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1)) + use("Runtime.rtl").toStr(";")));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		/* Restore save op codes */
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_codes"]), save_op_codes);
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_code_inc"]), save_op_code_inc);
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Translator html items
	 */
	OpHtmlItems: function(ctx, t, op_code, var_name, first_space)
	{
		if (var_name == undefined) var_name = "";
		if (first_space == undefined) first_space = false;
		if (op_code == null || op_code.items.count(ctx) == 0)
		{
			return use("Runtime.Vector").from([t,""]);
		}
		var save_html_var_name = t.html_var_name;
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["html_var_name"]), var_name);
		var content = "";
		var next_space = true;
		var add_space = (ctx, i) => 
		{
			if (i > 0 && next_space)
			{
				content += use("Runtime.rtl").toStr(t.s2(ctx, ""));
			}
			if (i == 0 && first_space)
			{
				content += use("Runtime.rtl").toStr(t.s2(ctx, ""));
			}
			if (!next_space)
			{
				next_space = true;
			}
		};
		for (var i = 0; i < op_code.items.count(ctx); i++)
		{
			var item = op_code.items.item(ctx, i);
			var item_value = "";
			var op_content = "";
			/* Save op codes */
			var save_op_codes = t.save_op_codes;
			var save_op_code_inc = t.save_op_code_inc;
			var __v0 = use("Bayrell.Lang.OpCodes.OpAssign");
			var __v1 = use("Bayrell.Lang.OpCodes.OpComment");
			var __v2 = use("Bayrell.Lang.OpCodes.OpFor");
			var __v3 = use("Bayrell.Lang.OpCodes.OpIf");
			var __v4 = use("Bayrell.Lang.OpCodes.OpWhile");
			if (item instanceof __v0)
			{
				var res = t.operator.constructor.OpAssign(ctx, t, item);
				t = Runtime.rtl.attr(ctx, res, 0);
				op_content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
			else if (item instanceof __v1)
			{
				add_space(ctx, i);
				var res = t.operator.constructor.OpComment(ctx, t, item);
				t = Runtime.rtl.attr(ctx, res, 0);
				op_content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
				next_space = false;
			}
			else if (item instanceof __v2)
			{
				add_space(ctx, i);
				var res = t.operator.constructor.OpFor(ctx, t, item);
				t = Runtime.rtl.attr(ctx, res, 0);
				op_content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
			else if (item instanceof __v3)
			{
				add_space(ctx, i);
				var res = t.operator.constructor.OpIf(ctx, t, item);
				t = Runtime.rtl.attr(ctx, res, 0);
				op_content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
			else if (item instanceof __v4)
			{
				add_space(ctx, i);
				var res = t.operator.constructor.OpWhile(ctx, t, item);
				t = Runtime.rtl.attr(ctx, res, 0);
				op_content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
			else
			{
				add_space(ctx, i);
				var res = this.OpHtmlTag(ctx, t, item, var_name);
				t = Runtime.rtl.attr(ctx, res, 0);
				op_content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
			/* Output save op code */
			var save = t.constructor.outputSaveOpCode(ctx, t, save_op_codes.count(ctx));
			if (save != "")
			{
				content += use("Runtime.rtl").toStr(save);
			}
			if (op_content != "")
			{
				content += use("Runtime.rtl").toStr(op_content);
			}
			/* Restore save op codes */
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_codes"]), save_op_codes);
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_code_inc"]), save_op_code_inc);
		}
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["html_var_name"]), save_html_var_name);
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Export used vars
	 */
	exportUsedVars: function(ctx, used_vars, op_code)
	{
		var __v0 = use("Bayrell.Lang.OpCodes.OpHtmlItems");
		var __v1 = use("Bayrell.Lang.OpCodes.OpCall");
		var __v2 = use("Bayrell.Lang.OpCodes.OpAttr");
		var __v3 = use("Bayrell.Lang.OpCodes.OpIdentifier");
		if (op_code instanceof __v0)
		{
			for (var i = 0; i < op_code.items.count(ctx); i++)
			{
				this.exportUsedVars(ctx, used_vars, op_code.items.get(ctx, i));
			}
		}
		else if (op_code instanceof __v1)
		{
			this.exportUsedVars(ctx, used_vars, op_code.obj);
			if (op_code.args != null)
			{
				for (var i = 0; i < op_code.args.count(ctx); i++)
				{
					this.exportUsedVars(ctx, used_vars, op_code.args.get(ctx, i));
				}
			}
		}
		else if (op_code instanceof __v2)
		{
			this.exportUsedVars(ctx, used_vars, op_code.obj);
		}
		else if (op_code instanceof __v3)
		{
			var __v4 = use("Bayrell.Lang.OpCodes.OpIdentifier");
			if (op_code.kind == __v4.KIND_VARIABLE)
			{
				used_vars.push(ctx, op_code.value);
			}
		}
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Bayrell.Lang.LangPHP";
	},
	getClassName: function()
	{
		return "Bayrell.Lang.LangPHP.TranslatorPHPHtml";
	},
	getParentClassName: function()
	{
		return "";
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
});use.add(Bayrell.Lang.LangPHP.TranslatorPHPHtml);
module.exports = Bayrell.Lang.LangPHP.TranslatorPHPHtml;