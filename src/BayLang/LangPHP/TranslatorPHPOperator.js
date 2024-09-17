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
if (typeof BayLang.LangPHP == 'undefined') BayLang.LangPHP = {};
BayLang.LangPHP.TranslatorPHPOperator = function(ctx)
{
};
Object.assign(BayLang.LangPHP.TranslatorPHPOperator.prototype,
{
});
Object.assign(BayLang.LangPHP.TranslatorPHPOperator,
{
	/**
	 * OpAssign
	 */
	OpAssignStruct: function(ctx, t, op_code, pos)
	{
		if (pos == undefined) pos = 0;
		var content = "";
		var var_name = op_code.var_name;
		var res = t.expression.constructor.Expression(ctx, t, op_code.expression);
		t = Runtime.rtl.attr(ctx, res, 0);
		var expr = Runtime.rtl.attr(ctx, res, 1);
		var names = op_code.names.map(ctx, (ctx, item) =>
		{
			var __v0 = use("BayLang.OpCodes.BaseOpCode");
			if (item instanceof __v0)
			{
				var res = t.expression.constructor.Expression(ctx, t, item);
				t = Runtime.rtl.attr(ctx, res, 0);
				return Runtime.rtl.attr(ctx, res, 1);
			}
			return t.expression.constructor.toString(ctx, item);
		});
		var __v0 = use("Runtime.rs");
		content = "\\Runtime\\rtl::setAttr($ctx, $" + use("Runtime.rtl").toStr(var_name) + use("Runtime.rtl").toStr(", [") + use("Runtime.rtl").toStr(__v0.join(ctx, ", ", names)) + use("Runtime.rtl").toStr("], ") + use("Runtime.rtl").toStr(expr) + use("Runtime.rtl").toStr(")");
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpAssign
	 */
	OpAssign: function(ctx, t, op_code, flag_indent)
	{
		if (flag_indent == undefined) flag_indent = true;
		var content = "";
		var __v0 = use("BayLang.OpCodes.OpAssign");
		var __v1 = use("BayLang.OpCodes.OpAssign");
		var __v2 = use("BayLang.OpCodes.OpAssign");
		if (op_code.kind == __v0.KIND_ASSIGN || op_code.kind == __v1.KIND_DECLARE)
		{
			for (var i = 0; i < op_code.values.count(ctx); i++)
			{
				var item = op_code.values.item(ctx, i);
				var index_s = "";
				var s = "";
				var op = item.op;
				if (op == "")
				{
					op = "=";
				}
				if (item.expression == null)
				{
					continue;
				}
				/* Expression */
				var item_expression = "";
				var res = t.expression.constructor.Expression(ctx, t, item.expression);
				t = Runtime.rtl.attr(ctx, res, 0);
				if (op == "~=")
				{
					item_expression = t.expression.constructor.rtlToStr(ctx, t, Runtime.rtl.attr(ctx, res, 1));
				}
				else
				{
					item_expression = Runtime.rtl.attr(ctx, res, 1);
				}
				var __v2 = use("BayLang.OpCodes.OpAttr");
				if (item.op_code instanceof __v2)
				{
					var __v3 = use("Runtime.Vector");
					var items = new __v3(ctx);
					var __v4 = use("Runtime.Vector");
					var items2 = new __v4(ctx);
					var op_code_next = item.op_code;
					var __v5 = use("BayLang.OpCodes.OpAttr");
					while (op_code_next instanceof __v5)
					{
						items.push(ctx, op_code_next);
						op_code_next = op_code_next.obj;
					}
					items = items.reverse(ctx);
					var res = t.expression.constructor.OpIdentifier(ctx, t, op_code_next);
					t = Runtime.rtl.attr(ctx, res, 0);
					var obj_s = Runtime.rtl.attr(ctx, res, 1);
					for (var j = 0; j < items.count(ctx); j++)
					{
						var item_attr = Runtime.rtl.attr(ctx, items, j);
						var __v5 = use("BayLang.OpCodes.OpAttr");
						var __v6 = use("BayLang.OpCodes.OpAttr");
						var __v7 = use("BayLang.OpCodes.OpAttr");
						if (item_attr.kind == __v5.KIND_ATTR)
						{
							obj_s += use("Runtime.rtl").toStr("->" + use("Runtime.rtl").toStr(item_attr.value.value));
							items2.push(ctx, t.expression.constructor.toString(ctx, item_attr.value.value));
						}
						else if (item_attr.kind == __v6.KIND_DYNAMIC)
						{
							var res = t.expression.constructor.Expression(ctx, t, item_attr.value);
							t = Runtime.rtl.attr(ctx, res, 0);
							obj_s += use("Runtime.rtl").toStr("[" + use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1)) + use("Runtime.rtl").toStr("]"));
							items2.push(ctx, Runtime.rtl.attr(ctx, res, 1));
						}
						else if (item_attr.kind == __v7.KIND_DYNAMIC_ATTRS)
						{
							if (item_attr.attrs != null)
							{
								for (var j = item_attr.attrs.count(ctx) - 1; j >= 0; j--)
								{
									var res = t.expression.constructor.Expression(ctx, t, Runtime.rtl.attr(ctx, item_attr.attrs, j));
									t = Runtime.rtl.attr(ctx, res, 0);
									obj_s += use("Runtime.rtl").toStr("[" + use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1)) + use("Runtime.rtl").toStr("]"));
									items2.push(ctx, Runtime.rtl.attr(ctx, res, 1));
								}
							}
						}
					}
					if (op == "~=" || op == "+=" || op == "-=")
					{
						var op2 = "+";
						if (op == "~=" || op == "+=")
						{
							op2 = "+";
						}
						else if (op == "-=")
						{
							op2 = "-";
						}
						var __v5 = use("Runtime.rs");
						item_expression = "\\Runtime\\rtl\\attr($ctx, " + use("Runtime.rtl").toStr(obj_s) + use("Runtime.rtl").toStr(", [") + use("Runtime.rtl").toStr(__v5.join(ctx, ", ", items2)) + use("Runtime.rtl").toStr("]) ") + use("Runtime.rtl").toStr(op2) + use("Runtime.rtl").toStr(" ") + use("Runtime.rtl").toStr(item_expression);
					}
					index_s = obj_s + use("Runtime.rtl").toStr(" = ") + use("Runtime.rtl").toStr(item_expression) + use("Runtime.rtl").toStr(";");
				}
				else
				{
					if (item.op_code != null && item.op_code.value == "@" && t.enable_context == false)
					{
						index_s = "\\Runtime\\rtl::setContext(" + use("Runtime.rtl").toStr(item_expression) + use("Runtime.rtl").toStr(");");
					}
					else
					{
						var __v5 = use("BayLang.OpCodes.OpAssign");
						if (op_code.kind == __v5.KIND_DECLARE)
						{
							s = "$" + use("Runtime.rtl").toStr(item.var_name);
						}
						else
						{
							var res = t.expression.constructor.OpIdentifier(ctx, t, item.op_code);
							t = Runtime.rtl.attr(ctx, res, 0);
							s = Runtime.rtl.attr(ctx, res, 1);
						}
						if (item_expression != "")
						{
							if (op == "~=")
							{
								s += use("Runtime.rtl").toStr(" .= " + use("Runtime.rtl").toStr(item_expression));
							}
							else
							{
								s += use("Runtime.rtl").toStr(" " + use("Runtime.rtl").toStr(op) + use("Runtime.rtl").toStr(" ") + use("Runtime.rtl").toStr(item_expression));
							}
							index_s = s + use("Runtime.rtl").toStr(";");
						}
					}
				}
				if (item.var_name != "" && t.save_vars.indexOf(ctx, item.var_name) == -1)
				{
					t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_vars"]), t.save_vars.pushIm(ctx, item.var_name));
				}
				if (index_s != "")
				{
					content += use("Runtime.rtl").toStr((flag_indent) ? (t.s(ctx, index_s)) : (index_s));
				}
			}
		}
		else if (op_code.kind == __v2.KIND_STRUCT)
		{
			var s = "$" + use("Runtime.rtl").toStr(op_code.var_name) + use("Runtime.rtl").toStr(" = ");
			var res = this.OpAssignStruct(ctx, t, op_code, 0);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = t.s(ctx, s + use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1)) + use("Runtime.rtl").toStr(";"));
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpDelete
	 */
	OpDelete: function(ctx, t, op_code)
	{
		var content = "";
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpFor
	 */
	OpFor: function(ctx, t, op_code)
	{
		var content = "";
		var s1 = "";
		var s2 = "";
		var s3 = "";
		var __v0 = use("BayLang.OpCodes.OpAssign");
		if (op_code.expr1 instanceof __v0)
		{
			var res = this.OpAssign(ctx, t, op_code.expr1, false);
			t = Runtime.rtl.attr(ctx, res, 0);
			s1 = Runtime.rtl.attr(ctx, res, 1);
		}
		else
		{
			var res = t.expression.constructor.Expression(ctx, t, op_code.expr1);
			t = Runtime.rtl.attr(ctx, res, 0);
			s1 = Runtime.rtl.attr(ctx, res, 1);
		}
		var res = t.expression.constructor.Expression(ctx, t, op_code.expr2);
		t = Runtime.rtl.attr(ctx, res, 0);
		s2 = Runtime.rtl.attr(ctx, res, 1);
		var res = t.expression.constructor.Expression(ctx, t, op_code.expr3);
		t = Runtime.rtl.attr(ctx, res, 0);
		s3 = Runtime.rtl.attr(ctx, res, 1);
		content = t.s(ctx, "for (" + use("Runtime.rtl").toStr(s1) + use("Runtime.rtl").toStr(" ") + use("Runtime.rtl").toStr(s2) + use("Runtime.rtl").toStr("; ") + use("Runtime.rtl").toStr(s3) + use("Runtime.rtl").toStr(")"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		var res = this.Operators(ctx, t, op_code.value);
		t = Runtime.rtl.attr(ctx, res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpIf
	 */
	OpIf: function(ctx, t, op_code)
	{
		var content = "";
		var res = t.expression.constructor.Expression(ctx, t, op_code.condition);
		t = Runtime.rtl.attr(ctx, res, 0);
		var s1 = Runtime.rtl.attr(ctx, res, 1);
		content = t.s(ctx, "if (" + use("Runtime.rtl").toStr(s1) + use("Runtime.rtl").toStr(")"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		var res = this.Operators(ctx, t, op_code.if_true);
		t = Runtime.rtl.attr(ctx, res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		for (var i = 0; i < op_code.if_else.count(ctx); i++)
		{
			var if_else = op_code.if_else.item(ctx, i);
			var res = t.expression.constructor.Expression(ctx, t, if_else.condition);
			t = Runtime.rtl.attr(ctx, res, 0);
			var s2 = Runtime.rtl.attr(ctx, res, 1);
			content += use("Runtime.rtl").toStr(t.s(ctx, "else if (" + use("Runtime.rtl").toStr(s2) + use("Runtime.rtl").toStr(")")));
			content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
			var res = this.Operators(ctx, t, if_else.if_true);
			t = Runtime.rtl.attr(ctx, res, 0);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		}
		if (op_code.if_false != null)
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, "else"));
			content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
			var res = this.Operators(ctx, t, op_code.if_false);
			t = Runtime.rtl.attr(ctx, res, 0);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpReturn
	 */
	OpReturn: function(ctx, t, op_code)
	{
		var content = "";
		var s1 = "";
		if (op_code.expression)
		{
			var res = t.expression.constructor.Expression(ctx, t, op_code.expression);
			t = Runtime.rtl.attr(ctx, res, 0);
			s1 = Runtime.rtl.attr(ctx, res, 1);
		}
		if (t.current_function.flags != null && t.current_function.flags.isFlag(ctx, "memorize"))
		{
			var content = t.s(ctx, "$__memorize_value = " + use("Runtime.rtl").toStr(s1) + use("Runtime.rtl").toStr(";"));
			content += use("Runtime.rtl").toStr(t.s(ctx, t.expression.constructor.getModuleName(ctx, t, "Runtime.rtl") + use("Runtime.rtl").toStr("::_memorizeSave(\"") + use("Runtime.rtl").toStr(t.current_class_full_name) + use("Runtime.rtl").toStr(".") + use("Runtime.rtl").toStr(t.current_function.name) + use("Runtime.rtl").toStr("\", func_get_args(), $__memorize_value);")));
			content += use("Runtime.rtl").toStr(t.s(ctx, "return $__memorize_value;"));
			return use("Runtime.Vector").from([t,content]);
		}
		content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(s1) + use("Runtime.rtl").toStr(";")));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpThrow
	 */
	OpThrow: function(ctx, t, op_code)
	{
		var res = t.expression.constructor.Expression(ctx, t, op_code.expression);
		t = Runtime.rtl.attr(ctx, res, 0);
		var content = t.s(ctx, "throw " + use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1)) + use("Runtime.rtl").toStr(";"));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpTryCatch
	 */
	OpTryCatch: function(ctx, t, op_code)
	{
		var content = "";
		content += use("Runtime.rtl").toStr(t.s(ctx, "try"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		var res = this.Operators(ctx, t, op_code.op_try);
		t = Runtime.rtl.attr(ctx, res, 0);
		content += use("Runtime.rtl").toStr(t.s(ctx, Runtime.rtl.attr(ctx, res, 1)));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "catch (\\Exception $_ex)"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		for (var i = 0; i < op_code.items.count(ctx); i++)
		{
			var s = "";
			var pattern = "";
			var item = op_code.items.item(ctx, i);
			var res = t.expression.constructor.OpTypeIdentifier(ctx, t, item.pattern);
			t = Runtime.rtl.attr(ctx, res, 0);
			pattern += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			if (pattern != "\\var")
			{
				s = "if ($_ex instanceof " + use("Runtime.rtl").toStr(pattern) + use("Runtime.rtl").toStr(")");
			}
			else
			{
				s = "if (true)";
			}
			s += use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
			s += use("Runtime.rtl").toStr((s != "") ? (t.s(ctx, "$" + use("Runtime.rtl").toStr(item.name) + use("Runtime.rtl").toStr(" = $_ex;"))) : ("$" + use("Runtime.rtl").toStr(item.name) + use("Runtime.rtl").toStr(" = $_ex;")));
			var res = this.Operators(ctx, t, item.value);
			t = Runtime.rtl.attr(ctx, res, 0);
			s += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			t = t.levelDec(ctx);
			s += use("Runtime.rtl").toStr(t.s(ctx, "}"));
			if (i != 0)
			{
				s = "else " + use("Runtime.rtl").toStr(s);
			}
			content += use("Runtime.rtl").toStr(t.s(ctx, s));
		}
		content += use("Runtime.rtl").toStr(t.s(ctx, "else"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "throw $_ex;"));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpWhile
	 */
	OpWhile: function(ctx, t, op_code)
	{
		var content = "";
		var res = t.expression.constructor.Expression(ctx, t, op_code.condition);
		t = Runtime.rtl.attr(ctx, res, 0);
		var s1 = Runtime.rtl.attr(ctx, res, 1);
		content += use("Runtime.rtl").toStr(t.s(ctx, "while (" + use("Runtime.rtl").toStr(s1) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		var res = this.Operators(ctx, t, op_code.value);
		t = Runtime.rtl.attr(ctx, res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpPreprocessorIfCode
	 */
	OpPreprocessorIfCode: function(ctx, t, op_code)
	{
		var content = "";
		if (Runtime.rtl.attr(ctx, t.preprocessor_flags, op_code.condition.value) == true)
		{
			var __v0 = use("Runtime.rs");
			content = __v0.trim(ctx, op_code.content);
		}
		return use("Runtime.Vector").from([t,t.s(ctx, content)]);
	},
	/**
	 * OpPreprocessorIfDef
	 */
	OpPreprocessorIfDef: function(ctx, t, op_code, kind)
	{
		if (!(Runtime.rtl.attr(ctx, t.preprocessor_flags, op_code.condition.value) == true))
		{
			return use("Runtime.Vector").from([t,""]);
		}
		var __v0 = use("BayLang.OpCodes.OpPreprocessorIfDef");
		var __v1 = use("BayLang.OpCodes.OpPreprocessorIfDef");
		if (kind == __v0.KIND_OPERATOR)
		{
			return this.Operators(ctx, t, op_code.items);
		}
		else if (kind == __v1.KIND_EXPRESSION)
		{
			return t.expression.constructor.Expression(ctx, t, op_code.items);
		}
		var content = "";
		for (var i = 0; i < op_code.items.count(ctx); i++)
		{
			var item = op_code.items.item(ctx, i);
			var __v0 = use("BayLang.OpCodes.OpComment");
			var __v1 = use("BayLang.OpCodes.OpDeclareFunction");
			if (item instanceof __v0)
			{
				var res = t.operator.constructor.OpComment(ctx, t, item);
				t = Runtime.rtl.attr(ctx, res, 0);
				content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
			else if (item instanceof __v1)
			{
				var res = t.program.constructor.OpDeclareFunction(ctx, t, item);
				t = Runtime.rtl.attr(ctx, res, 0);
				content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpComment
	 */
	OpComment: function(ctx, t, op_code)
	{
		var content = t.s(ctx, "/*" + use("Runtime.rtl").toStr(op_code.value) + use("Runtime.rtl").toStr("*/"));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpComments
	 */
	OpComments: function(ctx, t, comments)
	{
		var content = "";
		for (var i = 0; i < comments.count(ctx); i++)
		{
			var res = this.OpComment(ctx, t, comments.item(ctx, i));
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpComments
	 */
	AddComments: function(ctx, t, comments, content)
	{
		if (comments && comments.count(ctx) > 0)
		{
			var res = this.OpComments(ctx, t, comments);
			var s = Runtime.rtl.attr(ctx, res, 1);
			if (s != "")
			{
				content = s + use("Runtime.rtl").toStr(content);
			}
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Operator
	 */
	Operator: function(ctx, t, op_code)
	{
		var content = "";
		/* Save op codes */
		var save_op_codes = t.save_op_codes;
		var save_op_code_inc = t.save_op_code_inc;
		var __v0 = use("BayLang.OpCodes.OpAssign");
		var __v1 = use("BayLang.OpCodes.OpAssignStruct");
		var __v2 = use("BayLang.OpCodes.OpBreak");
		var __v3 = use("BayLang.OpCodes.OpCall");
		var __v4 = use("BayLang.OpCodes.OpContinue");
		var __v5 = use("BayLang.OpCodes.OpDelete");
		var __v6 = use("BayLang.OpCodes.OpFor");
		var __v7 = use("BayLang.OpCodes.OpIf");
		var __v8 = use("BayLang.OpCodes.OpPipe");
		var __v9 = use("BayLang.OpCodes.OpReturn");
		var __v10 = use("BayLang.OpCodes.OpThrow");
		var __v11 = use("BayLang.OpCodes.OpTryCatch");
		var __v12 = use("BayLang.OpCodes.OpWhile");
		var __v13 = use("BayLang.OpCodes.OpInc");
		var __v14 = use("BayLang.OpCodes.OpPreprocessorIfCode");
		var __v15 = use("BayLang.OpCodes.OpPreprocessorIfDef");
		var __v17 = use("BayLang.OpCodes.OpPreprocessorSwitch");
		var __v18 = use("BayLang.OpCodes.OpComment");
		var __v19 = use("BayLang.OpCodes.OpSafe");
		if (op_code instanceof __v0)
		{
			var res = this.OpAssign(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			var content = Runtime.rtl.attr(ctx, res, 1);
			/* Output save op code */
			var save = t.constructor.outputSaveOpCode(ctx, t, save_op_codes.count(ctx));
			if (save != "")
			{
				content = save + use("Runtime.rtl").toStr(content);
			}
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_codes"]), save_op_codes);
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_code_inc"]), save_op_code_inc);
			return use("Runtime.Vector").from([t,content]);
		}
		else if (op_code instanceof __v1)
		{
			var res = this.OpAssignStruct(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			var s1 = Runtime.rtl.attr(ctx, res, 1);
			/* Output save op code */
			var save = t.constructor.outputSaveOpCode(ctx, t, save_op_codes.count(ctx));
			if (save != "")
			{
				content = save;
			}
			content += use("Runtime.rtl").toStr(t.s(ctx, "$" + use("Runtime.rtl").toStr(op_code.var_name) + use("Runtime.rtl").toStr(" = ") + use("Runtime.rtl").toStr(s1) + use("Runtime.rtl").toStr(";")));
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_codes"]), save_op_codes);
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_code_inc"]), save_op_code_inc);
			return use("Runtime.Vector").from([t,content]);
		}
		else if (op_code instanceof __v2)
		{
			content = t.s(ctx, "break;");
		}
		else if (op_code instanceof __v3)
		{
			var res = t.expression.constructor.OpCall(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = t.s(ctx, Runtime.rtl.attr(ctx, res, 1) + use("Runtime.rtl").toStr(";"));
		}
		else if (op_code instanceof __v4)
		{
			content = t.s(ctx, "continue;");
		}
		else if (op_code instanceof __v5)
		{
			var res = this.OpDelete(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = Runtime.rtl.attr(ctx, res, 1);
		}
		else if (op_code instanceof __v6)
		{
			var res = this.OpFor(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = Runtime.rtl.attr(ctx, res, 1);
		}
		else if (op_code instanceof __v7)
		{
			var res = this.OpIf(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = Runtime.rtl.attr(ctx, res, 1);
		}
		else if (op_code instanceof __v8)
		{
			var res = t.expression.constructor.OpPipe(ctx, t, op_code, false);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = t.s(ctx, Runtime.rtl.attr(ctx, res, 1) + use("Runtime.rtl").toStr(";"));
		}
		else if (op_code instanceof __v9)
		{
			var res = this.OpReturn(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = Runtime.rtl.attr(ctx, res, 1);
		}
		else if (op_code instanceof __v10)
		{
			var res = this.OpThrow(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = Runtime.rtl.attr(ctx, res, 1);
		}
		else if (op_code instanceof __v11)
		{
			var res = this.OpTryCatch(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = Runtime.rtl.attr(ctx, res, 1);
		}
		else if (op_code instanceof __v12)
		{
			var res = this.OpWhile(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = Runtime.rtl.attr(ctx, res, 1);
		}
		else if (op_code instanceof __v13)
		{
			var res = t.expression.constructor.OpInc(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = t.s(ctx, Runtime.rtl.attr(ctx, res, 1) + use("Runtime.rtl").toStr(";"));
		}
		else if (op_code instanceof __v14)
		{
			var res = this.OpPreprocessorIfCode(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = Runtime.rtl.attr(ctx, res, 1);
		}
		else if (op_code instanceof __v15)
		{
			var __v16 = use("BayLang.OpCodes.OpPreprocessorIfDef");
			var res = this.OpPreprocessorIfDef(ctx, t, op_code, __v16.KIND_OPERATOR);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = Runtime.rtl.attr(ctx, res, 1);
		}
		else if (op_code instanceof __v17)
		{
			for (var i = 0; i < op_code.items.count(ctx); i++)
			{
				var res = this.OpPreprocessorIfCode(ctx, t, op_code.items.item(ctx, i));
				var s = Runtime.rtl.attr(ctx, res, 1);
				if (s == "")
				{
					continue;
				}
				content += use("Runtime.rtl").toStr(s);
			}
		}
		else if (op_code instanceof __v18)
		{
			var res = this.OpComment(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = Runtime.rtl.attr(ctx, res, 1);
		}
		else if (op_code instanceof __v19)
		{
			var res = this.Operators(ctx, t, op_code.items);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = Runtime.rtl.attr(ctx, res, 1);
		}
		/* Output save op code */
		var save = t.constructor.outputSaveOpCode(ctx, t, save_op_codes.count(ctx));
		if (save != "")
		{
			content = save + use("Runtime.rtl").toStr(content);
		}
		/* Restore save op codes */
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_codes"]), save_op_codes);
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_code_inc"]), save_op_code_inc);
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Operators
	 */
	Operators: function(ctx, t, op_code)
	{
		var content = "";
		var f1 = (ctx, op_code) =>
		{
			var __v0 = use("BayLang.OpCodes.OpBreak");
			var __v1 = use("BayLang.OpCodes.OpCall");
			var __v2 = use("BayLang.OpCodes.OpContinue");
			var __v3 = use("BayLang.OpCodes.OpReturn");
			var __v4 = use("BayLang.OpCodes.OpThrow");
			return op_code instanceof __v0 || op_code instanceof __v1 || op_code instanceof __v2 || op_code instanceof __v3 || op_code instanceof __v4;
		};
		var __v0 = use("BayLang.OpCodes.OpItems");
		var __v1 = use("BayLang.OpCodes.OpHtmlItems");
		if (op_code instanceof __v0)
		{
			for (var i = 0; i < op_code.items.count(ctx); i++)
			{
				var item = op_code.items.item(ctx, i);
				var res = this.Operator(ctx, t, item);
				t = Runtime.rtl.attr(ctx, res, 0);
				content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
		}
		else if (op_code instanceof __v1)
		{
			var save_html_var_name = t.html_var_name;
			var save_is_html = t.is_html;
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["is_html"]), true);
			var res = t.html.constructor.OpHtmlItems(ctx, t, op_code, save_html_var_name, false);
			t = Runtime.rtl.attr(ctx, res, 0);
			content = Runtime.rtl.attr(ctx, res, 1);
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["is_html"]), save_is_html);
		}
		else
		{
			var res = this.Operator(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpDeclareFunction Arguments
	 */
	OpDeclareFunctionArgs: function(ctx, t, f)
	{
		var content = "";
		if (f.args != null)
		{
			var flag = false;
			if (f.is_context)
			{
				content += use("Runtime.rtl").toStr("$ctx");
				flag = true;
			}
			/*
			if (f.is_html)
			{
				flag = true;
				content ~= (flag ? ", " : "") ~
					"$layout, $model_path, $render_params, $render_content";
			}
			*/
			for (var i = 0; i < f.args.count(ctx, i); i++)
			{
				var arg = f.args.item(ctx, i);
				var name = arg.name;
				var expr = "";
				if (arg.expression != null)
				{
					var res = t.expression.constructor.Expression(ctx, t, arg.expression);
					t = Runtime.rtl.attr(ctx, res, 0);
					expr = Runtime.rtl.attr(ctx, res, 1);
				}
				content += use("Runtime.rtl").toStr(((flag) ? (", ") : ("")) + use("Runtime.rtl").toStr("$") + use("Runtime.rtl").toStr(name) + use("Runtime.rtl").toStr(((expr != "") ? ("=" + use("Runtime.rtl").toStr(expr)) : (""))));
				flag = true;
			}
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpDeclareFunction Body
	 */
	OpDeclareFunctionBody: function(ctx, t, f)
	{
		var save_t = t;
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["is_pipe"]), false);
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["is_html"]), false);
		var content = "";
		t = t.levelInc(ctx);
		/*
		if (f.is_html)
		{
			content ~= t.s("$model = \\Runtime\\rtl::attr($layout, $model_path);");
		}
		*/
		if (f.items)
		{
			var res = t.operator.constructor.Operators(ctx, t, f.items);
			t = Runtime.rtl.attr(ctx, res, 0);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		}
		else if (f.expression)
		{
			/* Clear save op codes */
			t = t.constructor.clearSaveOpCode(ctx, t);
			var res = t.expression.constructor.Expression(ctx, t, f.expression);
			t = Runtime.rtl.attr(ctx, res, 0);
			var expr = Runtime.rtl.attr(ctx, res, 1);
			var s = "";
			if (f.flags != null && f.flags.isFlag(ctx, "memorize"))
			{
				s = "$__memorize_value = " + use("Runtime.rtl").toStr(expr) + use("Runtime.rtl").toStr(";");
				s += use("Runtime.rtl").toStr(t.s(ctx, t.expression.constructor.getModuleName(ctx, t, "Runtime.rtl") + use("Runtime.rtl").toStr("::_memorizeSave(\"") + use("Runtime.rtl").toStr(t.current_class_full_name) + use("Runtime.rtl").toStr(".") + use("Runtime.rtl").toStr(f.name) + use("Runtime.rtl").toStr("\", func_get_args(), $__memorize_value);")));
				s += use("Runtime.rtl").toStr(t.s(ctx, "return $__memorize_value;"));
			}
			else
			{
				s = t.s(ctx, "return " + use("Runtime.rtl").toStr(expr) + use("Runtime.rtl").toStr(";"));
			}
			/* Output save op code */
			var save = t.constructor.outputSaveOpCode(ctx, t);
			if (save != "")
			{
				content += use("Runtime.rtl").toStr(save);
			}
			content += use("Runtime.rtl").toStr(s);
		}
		if (f.flags != null && f.flags.isFlag(ctx, "memorize"))
		{
			var s = "";
			s += use("Runtime.rtl").toStr(t.s(ctx, "$__memorize_value = " + use("Runtime.rtl").toStr(t.expression.constructor.getModuleName(ctx, t, "Runtime.rtl")) + use("Runtime.rtl").toStr("::_memorizeValue(\"") + use("Runtime.rtl").toStr(t.current_class_full_name) + use("Runtime.rtl").toStr(".") + use("Runtime.rtl").toStr(f.name) + use("Runtime.rtl").toStr("\", func_get_args());")));
			s += use("Runtime.rtl").toStr(t.s(ctx, "if ($__memorize_value != " + use("Runtime.rtl").toStr(t.expression.constructor.getModuleName(ctx, t, "Runtime.rtl")) + use("Runtime.rtl").toStr("::$_memorize_not_found) return $__memorize_value;")));
			content = s + use("Runtime.rtl").toStr(content);
		}
		t = t.levelDec(ctx);
		content = t.s(ctx, "{") + use("Runtime.rtl").toStr(content);
		content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		return use("Runtime.Vector").from([save_t,content]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangPHP";
	},
	getClassName: function()
	{
		return "BayLang.LangPHP.TranslatorPHPOperator";
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
});use.add(BayLang.LangPHP.TranslatorPHPOperator);
module.exports = BayLang.LangPHP.TranslatorPHPOperator;