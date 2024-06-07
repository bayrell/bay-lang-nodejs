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
if (typeof BayLang.LangES6 == 'undefined') BayLang.LangES6 = {};
BayLang.LangES6.TranslatorES6Program = function(ctx)
{
	use("Runtime.BaseStruct").apply(this, arguments);
};
BayLang.LangES6.TranslatorES6Program.prototype = Object.create(use("Runtime.BaseStruct").prototype);
BayLang.LangES6.TranslatorES6Program.prototype.constructor = BayLang.LangES6.TranslatorES6Program;
Object.assign(BayLang.LangES6.TranslatorES6Program.prototype,
{
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		return use("Runtime.BaseStruct").prototype.takeValue.call(this,ctx,k,d);
	},
});
Object.assign(BayLang.LangES6.TranslatorES6Program, use("Runtime.BaseStruct"));
Object.assign(BayLang.LangES6.TranslatorES6Program,
{
	/**
	 * To pattern
	 */
	toPattern: function(ctx, t, pattern)
	{
		var names = t.expression.constructor.findModuleNames(ctx, t, pattern.entity_name.names);
		var __v0 = use("Runtime.rs");
		var e = __v0.join(ctx, ".", names);
		var a = (pattern.template != null) ? (pattern.template.map(ctx, (ctx, pattern) =>
		{
			return this.toPattern(ctx, t, pattern);
		})) : (null);
		var __v1 = use("Runtime.rs");
		var b = (a != null) ? (",\"t\":[" + use("Runtime.rtl").toStr(__v1.join(ctx, ",", a)) + use("Runtime.rtl").toStr("]")) : ("");
		return "{\"e\":" + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, e)) + use("Runtime.rtl").toStr(b) + use("Runtime.rtl").toStr("}");
	},
	/**
	 * OpNamespace
	 */
	OpNamespace: function(ctx, t, op_code)
	{
		var content = "";
		var name = "";
		var s = "";
		var __v0 = use("Runtime.rs");
		var arr = __v0.split(ctx, ".", op_code.name);
		for (var i = 0; i < arr.count(ctx); i++)
		{
			name = name + use("Runtime.rtl").toStr(((i == 0) ? ("") : ("."))) + use("Runtime.rtl").toStr(arr.item(ctx, i));
			s = "if (typeof " + use("Runtime.rtl").toStr(name) + use("Runtime.rtl").toStr(" == 'undefined') ") + use("Runtime.rtl").toStr(name) + use("Runtime.rtl").toStr(" = {};");
			content += use("Runtime.rtl").toStr(t.s(ctx, s));
		}
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["current_namespace_name"]), op_code.name);
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpDeclareFunction
	 */
	OpDeclareFunction: function(ctx, t, op_code)
	{
		var is_static_function = t.is_static_function;
		var is_static = op_code.isStatic(ctx);
		var content = "";
		if (op_code.isFlag(ctx, "declare"))
		{
			return use("Runtime.Vector").from([t,""]);
		}
		if (!is_static && is_static_function || is_static && !is_static_function)
		{
			return use("Runtime.Vector").from([t,""]);
		}
		/* Set current function */
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["current_function"]), op_code);
		var is_async = "";
		if (op_code.isFlag(ctx, "async") && t.isAsyncAwait(ctx))
		{
			is_async = "async ";
		}
		var s = "";
		var res = t.operator.constructor.OpDeclareFunctionArgs(ctx, t, op_code);
		var args = Runtime.rtl.attr(ctx, res, 1);
		s += use("Runtime.rtl").toStr(op_code.name + use("Runtime.rtl").toStr(": ") + use("Runtime.rtl").toStr(is_async) + use("Runtime.rtl").toStr("function(") + use("Runtime.rtl").toStr(args) + use("Runtime.rtl").toStr(")"));
		var res = t.operator.constructor.OpDeclareFunctionBody(ctx, t, op_code);
		s += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		s += use("Runtime.rtl").toStr(",");
		/* Function comments */
		var res = t.operator.constructor.AddComments(ctx, t, op_code.comments, t.s(ctx, s));
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpDeclareClass
	 */
	OpDeclareClassConstructor: function(ctx, t, op_code)
	{
		var open = "";
		var content = "";
		var save_t = t;
		/* Set function name */
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["current_function"]), op_code.fn_create);
		/* Clear save op codes */
		t = t.constructor.clearSaveOpCode(ctx, t);
		if (op_code.fn_create == null)
		{
			open += use("Runtime.rtl").toStr(t.current_class_full_name + use("Runtime.rtl").toStr(" = "));
			open += use("Runtime.rtl").toStr("function(ctx)");
			open = t.s(ctx, open) + use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
			/* Call parent */
			if (t.current_class_extends_name != "")
			{
				content += use("Runtime.rtl").toStr(t.s(ctx, t.expression.constructor.useModuleName(ctx, t, t.current_class_extends_name) + use("Runtime.rtl").toStr(".apply(this, arguments);")));
			}
		}
		else
		{
			open += use("Runtime.rtl").toStr(t.current_class_full_name + use("Runtime.rtl").toStr(" = function("));
			var res = t.operator.constructor.OpDeclareFunctionArgs(ctx, t, op_code.fn_create);
			t = Runtime.rtl.attr(ctx, res, 0);
			open += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			open += use("Runtime.rtl").toStr(")");
			open = t.s(ctx, open) + use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
		}
		/* Function body */
		if (op_code.fn_create != null)
		{
			if (op_code.fn_create.args)
			{
				for (var i = 0; i < op_code.fn_create.args.count(ctx); i++)
				{
					var arg = op_code.fn_create.args.item(ctx, i);
					if (arg.expression == null)
					{
						continue;
					}
					var res = t.expression.constructor.Expression(ctx, t, arg.expression);
					t = Runtime.rtl.attr(ctx, res, 0);
					var s = Runtime.rtl.attr(ctx, res, 1);
					s = "if (" + use("Runtime.rtl").toStr(arg.name) + use("Runtime.rtl").toStr(" == undefined) ") + use("Runtime.rtl").toStr(arg.name) + use("Runtime.rtl").toStr(" = ") + use("Runtime.rtl").toStr(s) + use("Runtime.rtl").toStr(";");
					content += use("Runtime.rtl").toStr(t.s(ctx, s));
				}
			}
			var res = t.operator.constructor.Operators(ctx, t, (op_code.fn_create.expression) ? (op_code.fn_create.expression) : (op_code.fn_create.items));
			t = Runtime.rtl.attr(ctx, res, 0);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		}
		/* Constructor end */
		content = open + use("Runtime.rtl").toStr(content);
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "};"));
		return use("Runtime.Vector").from([save_t,content]);
	},
	/**
	 * OpDeclareClassBodyItem
	 */
	OpDeclareClassBodyItem: function(ctx, t, item)
	{
		var content = "";
		var __v0 = use("BayLang.OpCodes.OpPreprocessorIfDef");
		if (item instanceof __v0)
		{
			var __v1 = use("BayLang.OpCodes.OpPreprocessorIfDef");
			var res = t.operator.constructor.OpPreprocessorIfDef(ctx, t, item, __v1.KIND_CLASS_BODY);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpFunctionAnnotations
	 */
	OpFunctionAnnotations: function(ctx, t, f)
	{
		var content = "";
		if (f.flags.isFlag(ctx, "declare"))
		{
			return use("Runtime.Vector").from([t,content]);
		}
		if (!f.annotations)
		{
			return use("Runtime.Vector").from([t,content]);
		}
		if (f.annotations.count(ctx) == 0)
		{
			return use("Runtime.Vector").from([t,content]);
		}
		content += use("Runtime.rtl").toStr(t.s(ctx, "if (field_name == " + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, f.name)) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		var s1 = "";
		t = t.levelInc(ctx);
		s1 += use("Runtime.rtl").toStr(t.s(ctx, "var Vector = " + use("Runtime.rtl").toStr(t.expression.constructor.useModuleName(ctx, t, "Runtime.Vector")) + use("Runtime.rtl").toStr(";")));
		s1 += use("Runtime.rtl").toStr(t.s(ctx, "var Map = " + use("Runtime.rtl").toStr(t.expression.constructor.useModuleName(ctx, t, "Runtime.Map")) + use("Runtime.rtl").toStr(";")));
		s1 += use("Runtime.rtl").toStr(t.s(ctx, "return Map.from({"));
		t = t.levelInc(ctx);
		if (f.flags.isFlag(ctx, "async"))
		{
			s1 += use("Runtime.rtl").toStr(t.s(ctx, "\"async\": true,"));
		}
		s1 += use("Runtime.rtl").toStr(t.s(ctx, "\"annotations\": Vector.from(["));
		t = t.levelInc(ctx);
		for (var j = 0; j < f.annotations.count(ctx); j++)
		{
			var annotation = f.annotations.item(ctx, j);
			var res = t.expression.constructor.OpTypeIdentifier(ctx, t, annotation.name);
			t = Runtime.rtl.attr(ctx, res, 0);
			var name = Runtime.rtl.attr(ctx, res, 1);
			var params = "";
			if (annotation.params != null)
			{
				var res = t.expression.constructor.OpDict(ctx, t, annotation.params, true);
				t = Runtime.rtl.attr(ctx, res, 0);
				params = Runtime.rtl.attr(ctx, res, 1);
			}
			s1 += use("Runtime.rtl").toStr(t.s(ctx, "new " + use("Runtime.rtl").toStr(name) + use("Runtime.rtl").toStr("(ctx, ") + use("Runtime.rtl").toStr(params) + use("Runtime.rtl").toStr("),")));
		}
		t = t.levelDec(ctx);
		s1 += use("Runtime.rtl").toStr(t.s(ctx, "]),"));
		t = t.levelDec(ctx);
		s1 += use("Runtime.rtl").toStr(t.s(ctx, "});"));
		var save = t.constructor.outputSaveOpCode(ctx, t);
		if (save != "")
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, save));
		}
		content += use("Runtime.rtl").toStr(s1);
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpClassBodyItemMethodsList
	 */
	OpClassBodyItemMethodsList: function(ctx, t, item)
	{
		var content = "";
		var __v0 = use("BayLang.OpCodes.OpPreprocessorIfDef");
		var __v1 = use("BayLang.OpCodes.OpDeclareFunction");
		if (item instanceof __v0)
		{
			if (Runtime.rtl.attr(ctx, t.preprocessor_flags, item.condition.value) == true)
			{
				for (var i = 0; i < item.items.count(ctx); i++)
				{
					var op_code = item.items.item(ctx, i);
					var res = this.OpClassBodyItemMethodsList(ctx, t, op_code);
					t = Runtime.rtl.attr(ctx, res, 0);
					content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
				}
			}
		}
		else if (item instanceof __v1)
		{
			if (!item.flags.isFlag(ctx, "declare") && !item.flags.isFlag(ctx, "protected") && !item.flags.isFlag(ctx, "private") && !(item.annotations == null) && !(item.annotations.count(ctx) == 0))
			{
				content += use("Runtime.rtl").toStr(t.s(ctx, t.expression.constructor.toString(ctx, item.name) + use("Runtime.rtl").toStr(",")));
			}
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpClassBodyItemAnnotations
	 */
	OpClassBodyItemAnnotations: function(ctx, t, item)
	{
		var content = "";
		var __v0 = use("BayLang.OpCodes.OpPreprocessorIfDef");
		var __v1 = use("BayLang.OpCodes.OpDeclareFunction");
		if (item instanceof __v0)
		{
			if (Runtime.rtl.attr(ctx, t.preprocessor_flags, item.condition.value) == true)
			{
				for (var i = 0; i < item.items.count(ctx); i++)
				{
					var op_code = item.items.item(ctx, i);
					var res = this.OpClassBodyItemAnnotations(ctx, t, op_code);
					t = Runtime.rtl.attr(ctx, res, 0);
					content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
				}
			}
		}
		else if (item instanceof __v1)
		{
			var res = this.OpFunctionAnnotations(ctx, t, item);
			t = Runtime.rtl.attr(ctx, res, 0);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Static variables
	 */
	OpDeclareClassStaticVariables: function(ctx, t, op_code)
	{
		var content = "";
		if (op_code.vars != null)
		{
			for (var i = 0; i < op_code.vars.count(ctx); i++)
			{
				var variable = op_code.vars.item(ctx, i);
				var __v0 = use("BayLang.OpCodes.OpAssign");
				if (variable.kind != __v0.KIND_DECLARE)
				{
					continue;
				}
				if (variable.condition && Runtime.rtl.attr(ctx, t.preprocessor_flags, variable.condition.value) != true)
				{
					continue;
				}
				var is_static = variable.flags.isFlag(ctx, "static");
				if (!is_static)
				{
					continue;
				}
				for (var j = 0; j < variable.values.count(ctx); j++)
				{
					var value = variable.values.item(ctx, j);
					var res = t.expression.constructor.Expression(ctx, t, value.expression);
					var s = (value.expression != null) ? (Runtime.rtl.attr(ctx, res, 1)) : ("null");
					content += use("Runtime.rtl").toStr(t.s(ctx, value.var_name + use("Runtime.rtl").toStr(": ") + use("Runtime.rtl").toStr(s) + use("Runtime.rtl").toStr(",")));
				}
			}
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Static functions
	 */
	OpDeclareClassStaticFunctions: function(ctx, t, op_code)
	{
		var content = "";
		/* Static Functions */
		if (op_code.functions != null)
		{
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["is_static_function"]), true);
			for (var i = 0; i < op_code.functions.count(ctx); i++)
			{
				var f = op_code.functions.item(ctx, i);
				if (f.flags.isFlag(ctx, "declare"))
				{
					continue;
				}
				if (!f.isStatic(ctx))
				{
					continue;
				}
				/* Set function name */
				t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["current_function"]), f);
				var is_async = "";
				if (f.isFlag(ctx, "async") && t.isAsyncAwait(ctx))
				{
					is_async = "async ";
				}
				var s = "";
				var res = t.operator.constructor.OpDeclareFunctionArgs(ctx, t, f);
				var args = Runtime.rtl.attr(ctx, res, 1);
				s += use("Runtime.rtl").toStr(f.name + use("Runtime.rtl").toStr(": ") + use("Runtime.rtl").toStr(is_async) + use("Runtime.rtl").toStr("function(") + use("Runtime.rtl").toStr(args) + use("Runtime.rtl").toStr(")"));
				var res = t.operator.constructor.OpDeclareFunctionBody(ctx, t, f);
				s += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
				s += use("Runtime.rtl").toStr(",");
				/* Function comments */
				var res = t.operator.constructor.AddComments(ctx, t, f.comments, t.s(ctx, s));
				content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
		}
		/* Items */
		if (op_code.items != null)
		{
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["is_static_function"]), true);
			for (var i = 0; i < op_code.items.count(ctx); i++)
			{
				var item = op_code.items.item(ctx, i);
				var res = this.OpDeclareClassBodyItem(ctx, t, item);
				t = Runtime.rtl.attr(ctx, res, 0);
				content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpDeclareClass
	 */
	OpDeclareClassBodyStatic: function(ctx, t, op_code)
	{
		var content = "";
		var class_kind = op_code.kind;
		var current_class_extends_name = t.expression.constructor.findModuleName(ctx, t, t.current_class_extends_name);
		var save_op_codes = t.save_op_codes;
		var save_op_code_inc = t.save_op_code_inc;
		t = t.constructor.clearSaveOpCode(ctx, t);
		/* Returns parent class name */
		var parent_class_name = "";
		if (op_code.class_extends != null)
		{
			var res = t.expression.constructor.OpTypeIdentifier(ctx, t, op_code.class_extends);
			parent_class_name = Runtime.rtl.attr(ctx, res, 1);
		}
		/* Extends */
		if (current_class_extends_name != "" && !op_code.is_component)
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, "Object.assign(" + use("Runtime.rtl").toStr(t.current_class_full_name) + use("Runtime.rtl").toStr(", ") + use("Runtime.rtl").toStr(t.expression.constructor.useModuleName(ctx, t, current_class_extends_name)) + use("Runtime.rtl").toStr(");")));
		}
		content += use("Runtime.rtl").toStr(t.s(ctx, "Object.assign(" + use("Runtime.rtl").toStr(t.current_class_full_name) + use("Runtime.rtl").toStr(",")));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		/* Static variables */
		var res = this.OpDeclareClassStaticVariables(ctx, t, op_code);
		t = Runtime.rtl.attr(ctx, res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		/* Static Functions */
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		if (class_kind != __v0.KIND_INTERFACE)
		{
			var res = this.OpDeclareClassStaticFunctions(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		}
		/* Declare component functions */
		if (op_code.is_model || op_code.is_component)
		{
			var res = this.OpDeclareComponentFunctions(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		}
		/* Static init Functions */
		var res = this.OpDeclareClassStaticInitFunctions(ctx, t, op_code);
		t = Runtime.rtl.attr(ctx, res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "});"));
		/* Restore save op codes */
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_codes"]), save_op_codes);
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_code_inc"]), save_op_code_inc);
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Static init functions
	 */
	OpDeclareClassStaticInitFunctions: function(ctx, t, op_code)
	{
		var content = "";
		var class_kind = op_code.kind;
		var current_class_extends_name = t.expression.constructor.findModuleName(ctx, t, t.current_class_extends_name);
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		if (class_kind == __v0.KIND_INTERFACE)
		{
			/* Get current namespace function */
			content += use("Runtime.rtl").toStr(t.s(ctx, "getNamespace: function()"));
			content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, t.current_namespace_name)) + use("Runtime.rtl").toStr(";")));
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
			/* Get current class name function */
			content += use("Runtime.rtl").toStr(t.s(ctx, "getClassName: function()"));
			content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, t.current_class_full_name)) + use("Runtime.rtl").toStr(";")));
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
			return use("Runtime.Vector").from([t,content]);
		}
		if (op_code.is_component == false)
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, "/* ======================= Class Init Functions ======================= */"));
		}
		/* Get current namespace function */
		content += use("Runtime.rtl").toStr(t.s(ctx, "getNamespace: function()"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, t.current_namespace_name)) + use("Runtime.rtl").toStr(";")));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		/* Get current class name function */
		content += use("Runtime.rtl").toStr(t.s(ctx, "getClassName: function()"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, t.current_class_full_name)) + use("Runtime.rtl").toStr(";")));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		/* Get parent class name function */
		content += use("Runtime.rtl").toStr(t.s(ctx, "getParentClassName: function()"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, current_class_extends_name)) + use("Runtime.rtl").toStr(";")));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		/* Class info */
		content += use("Runtime.rtl").toStr(t.s(ctx, "getClassInfo: function(ctx)"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		t = t.constructor.clearSaveOpCode(ctx, t);
		var s1 = "";
		s1 += use("Runtime.rtl").toStr(t.s(ctx, "var Vector = " + use("Runtime.rtl").toStr(t.expression.constructor.useModuleName(ctx, t, "Runtime.Vector")) + use("Runtime.rtl").toStr(";")));
		s1 += use("Runtime.rtl").toStr(t.s(ctx, "var Map = " + use("Runtime.rtl").toStr(t.expression.constructor.useModuleName(ctx, t, "Runtime.Map")) + use("Runtime.rtl").toStr(";")));
		s1 += use("Runtime.rtl").toStr(t.s(ctx, "return Map.from({"));
		t = t.levelInc(ctx);
		s1 += use("Runtime.rtl").toStr(t.s(ctx, "\"annotations\": Vector.from(["));
		t = t.levelInc(ctx);
		for (var j = 0; j < op_code.annotations.count(ctx); j++)
		{
			var annotation = op_code.annotations.item(ctx, j);
			var res = t.expression.constructor.OpTypeIdentifier(ctx, t, annotation.name);
			t = Runtime.rtl.attr(ctx, res, 0);
			var name = Runtime.rtl.attr(ctx, res, 1);
			if (annotation.params != null)
			{
				var res = t.expression.constructor.OpDict(ctx, t, annotation.params, true);
				t = Runtime.rtl.attr(ctx, res, 0);
				var params = Runtime.rtl.attr(ctx, res, 1);
				s1 += use("Runtime.rtl").toStr(t.s(ctx, "new " + use("Runtime.rtl").toStr(name) + use("Runtime.rtl").toStr("(ctx, ") + use("Runtime.rtl").toStr(params) + use("Runtime.rtl").toStr("),")));
			}
			else
			{
				s1 += use("Runtime.rtl").toStr(t.s(ctx, "new " + use("Runtime.rtl").toStr(name) + use("Runtime.rtl").toStr("(ctx),")));
			}
		}
		t = t.levelDec(ctx);
		s1 += use("Runtime.rtl").toStr(t.s(ctx, "]),"));
		t = t.levelDec(ctx);
		s1 += use("Runtime.rtl").toStr(t.s(ctx, "});"));
		var save = t.constructor.outputSaveOpCode(ctx, t);
		if (save != "")
		{
			content += use("Runtime.rtl").toStr(save);
		}
		content += use("Runtime.rtl").toStr(s1);
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		/* Get fields list of the function */
		t = t.constructor.clearSaveOpCode(ctx, t);
		content += use("Runtime.rtl").toStr(t.s(ctx, "getFieldsList: function(ctx)"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "var a = [];"));
		if (op_code.vars != null)
		{
			var __v0 = use("Runtime.Map");
			var vars = new __v0(ctx);
			for (var i = 0; i < op_code.vars.count(ctx); i++)
			{
				var variable = op_code.vars.item(ctx, i);
				var is_const = variable.flags.isFlag(ctx, "const");
				var is_static = variable.flags.isFlag(ctx, "static");
				var is_protected = variable.flags.isFlag(ctx, "protected");
				var is_private = variable.flags.isFlag(ctx, "private");
				var is_serializable = variable.flags.isFlag(ctx, "serializable");
				var is_assignable = true;
				var has_annotation = variable.annotations != null && variable.annotations.count(ctx) > 0;
				if (is_const || is_static)
				{
					continue;
				}
				if (is_protected || is_private)
				{
					continue;
				}
				var __v1 = use("BayLang.OpCodes.OpAssign");
				if (variable.kind != __v1.KIND_DECLARE)
				{
					continue;
				}
				var __v1 = use("BayLang.OpCodes.OpDeclareClass");
				if (class_kind != __v1.KIND_STRUCT)
				{
					if (variable.annotations == null)
					{
						continue;
					}
					if (variable.annotations.count(ctx) == 0)
					{
						continue;
					}
				}
				if (variable.condition && Runtime.rtl.attr(ctx, t.preprocessor_flags, variable.condition.value) != true)
				{
					continue;
				}
				for (var j = 0; j < variable.values.count(ctx); j++)
				{
					var value = variable.values.item(ctx, j);
					content += use("Runtime.rtl").toStr(t.s(ctx, "a.push(" + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, value.var_name)) + use("Runtime.rtl").toStr(");")));
				}
			}
		}
		content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(t.expression.constructor.useModuleName(ctx, t, "Runtime.Vector")) + use("Runtime.rtl").toStr(".from(a);")));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		/* Get field info by name */
		content += use("Runtime.rtl").toStr(t.s(ctx, "getFieldInfoByName: function(ctx,field_name)"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		if (op_code.vars != null)
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, "var Vector = " + use("Runtime.rtl").toStr(t.expression.constructor.useModuleName(ctx, t, "Runtime.Vector")) + use("Runtime.rtl").toStr(";")));
			content += use("Runtime.rtl").toStr(t.s(ctx, "var Map = " + use("Runtime.rtl").toStr(t.expression.constructor.useModuleName(ctx, t, "Runtime.Map")) + use("Runtime.rtl").toStr(";")));
			for (var i = 0; i < op_code.vars.count(ctx); i++)
			{
				var variable = op_code.vars.item(ctx, i);
				var __v0 = use("BayLang.OpCodes.OpAssign");
				if (variable.kind != __v0.KIND_DECLARE)
				{
					continue;
				}
				if (variable.condition && Runtime.rtl.attr(ctx, t.preprocessor_flags, variable.condition.value) != true)
				{
					continue;
				}
				var is_const = variable.flags.isFlag(ctx, "const");
				var is_static = variable.flags.isFlag(ctx, "static");
				var is_protected = variable.flags.isFlag(ctx, "protected");
				var is_private = variable.flags.isFlag(ctx, "private");
				if (is_const || is_static)
				{
					continue;
				}
				if (is_protected || is_private)
				{
					continue;
				}
				if (variable.annotations == null)
				{
					continue;
				}
				if (variable.annotations.count(ctx) == 0)
				{
					continue;
				}
				var v = variable.values.map(ctx, (ctx, value) =>
				{
					return value.var_name;
				});
				v = v.map(ctx, (ctx, var_name) =>
				{
					return "field_name == " + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, var_name));
				});
				var __v0 = use("Runtime.rs");
				var var_type = __v0.join(ctx, ".", t.expression.constructor.findModuleNames(ctx, t, variable.pattern.entity_name.names));
				var var_sub_types = (variable.pattern.template != null) ? (variable.pattern.template.map(ctx, (ctx, op_code) =>
				{
					var __v1 = use("Runtime.rs");
					return __v1.join(ctx, ".", t.expression.constructor.findModuleNames(ctx, t, op_code.entity_name.names));
				})) : (use("Runtime.Vector").from([]));
				var_sub_types = var_sub_types.map(ctx, t.expression.constructor.toString);
				t = t.constructor.clearSaveOpCode(ctx, t);
				var s1 = "";
				var __v1 = use("Runtime.rs");
				s1 += use("Runtime.rtl").toStr(t.s(ctx, "if (" + use("Runtime.rtl").toStr(__v1.join(ctx, " or ", v)) + use("Runtime.rtl").toStr(") return Map.from({")));
				t = t.levelInc(ctx);
				s1 += use("Runtime.rtl").toStr(t.s(ctx, "\"t\": " + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, var_type)) + use("Runtime.rtl").toStr(",")));
				if (var_sub_types.count(ctx) > 0)
				{
					var __v2 = use("Runtime.rs");
					s1 += use("Runtime.rtl").toStr(t.s(ctx, "\"s\": [" + use("Runtime.rtl").toStr(__v2.join(ctx, ", ", var_sub_types)) + use("Runtime.rtl").toStr("],")));
				}
				s1 += use("Runtime.rtl").toStr(t.s(ctx, "\"annotations\": Vector.from(["));
				t = t.levelInc(ctx);
				for (var j = 0; j < variable.annotations.count(ctx); j++)
				{
					var annotation = variable.annotations.item(ctx, j);
					var res = t.expression.constructor.OpTypeIdentifier(ctx, t, annotation.name);
					t = Runtime.rtl.attr(ctx, res, 0);
					var name = Runtime.rtl.attr(ctx, res, 1);
					var res = t.expression.constructor.OpDict(ctx, t, annotation.params, true);
					t = Runtime.rtl.attr(ctx, res, 0);
					var params = Runtime.rtl.attr(ctx, res, 1);
					s1 += use("Runtime.rtl").toStr(t.s(ctx, "new " + use("Runtime.rtl").toStr(name) + use("Runtime.rtl").toStr("(ctx, ") + use("Runtime.rtl").toStr(params) + use("Runtime.rtl").toStr("),")));
				}
				t = t.levelDec(ctx);
				s1 += use("Runtime.rtl").toStr(t.s(ctx, "]),"));
				t = t.levelDec(ctx);
				s1 += use("Runtime.rtl").toStr(t.s(ctx, "});"));
				var save = t.constructor.outputSaveOpCode(ctx, t);
				if (save != "")
				{
					content += use("Runtime.rtl").toStr(save);
				}
				content += use("Runtime.rtl").toStr(s1);
			}
		}
		content += use("Runtime.rtl").toStr(t.s(ctx, "return null;"));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		/* Get methods list of the function */
		t = t.constructor.clearSaveOpCode(ctx, t);
		content += use("Runtime.rtl").toStr(t.s(ctx, "getMethodsList: function(ctx)"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "var a=["));
		t = t.levelInc(ctx);
		if (op_code.functions != null)
		{
			for (var i = 0; i < op_code.functions.count(ctx); i++)
			{
				var f = op_code.functions.item(ctx, i);
				if (f.flags.isFlag(ctx, "declare"))
				{
					continue;
				}
				if (f.flags.isFlag(ctx, "protected"))
				{
					continue;
				}
				if (f.flags.isFlag(ctx, "private"))
				{
					continue;
				}
				if (f.annotations.count(ctx) == 0)
				{
					continue;
				}
				content += use("Runtime.rtl").toStr(t.s(ctx, t.expression.constructor.toString(ctx, f.name) + use("Runtime.rtl").toStr(",")));
			}
		}
		if (op_code.items != null)
		{
			for (var i = 0; i < op_code.items.count(ctx); i++)
			{
				var item = op_code.items.item(ctx, i);
				var res = this.OpClassBodyItemMethodsList(ctx, t, item);
				t = Runtime.rtl.attr(ctx, res, 0);
				content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
		}
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "];"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(t.expression.constructor.useModuleName(ctx, t, "Runtime.Vector")) + use("Runtime.rtl").toStr(".from(a);")));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		/* Get method info by name */
		t = t.constructor.clearSaveOpCode(ctx, t);
		content += use("Runtime.rtl").toStr(t.s(ctx, "getMethodInfoByName: function(ctx,field_name)"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		if (op_code.functions != null)
		{
			for (var i = 0; i < op_code.functions.count(ctx); i++)
			{
				var f = op_code.functions.item(ctx, i);
				var res = this.OpFunctionAnnotations(ctx, t, f);
				t = Runtime.rtl.attr(ctx, res, 0);
				content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
		}
		if (op_code.items != null)
		{
			for (var i = 0; i < op_code.items.count(ctx); i++)
			{
				var item = op_code.items.item(ctx, i);
				var res = this.OpClassBodyItemAnnotations(ctx, t, item);
				t = Runtime.rtl.attr(ctx, res, 0);
				content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
		}
		content += use("Runtime.rtl").toStr(t.s(ctx, "return null;"));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		/* Add implements */
		if (op_code.class_implements != null && op_code.class_implements.count(ctx) > 0)
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, "__implements__:"));
			content += use("Runtime.rtl").toStr(t.s(ctx, "["));
			t = t.levelInc(ctx);
			for (var i = 0; i < op_code.class_implements.count(ctx); i++)
			{
				var item = op_code.class_implements.item(ctx, i);
				var module_name = item.entity_name.names.first(ctx);
				var s = t.expression.constructor.useModuleName(ctx, t, module_name);
				if (s == "")
				{
					continue;
				}
				content += use("Runtime.rtl").toStr(t.s(ctx, s + use("Runtime.rtl").toStr(",")));
			}
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "],"));
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Class variables
	 */
	OpDeclareClassInitVariables: function(ctx, t, op_code)
	{
		var content = "";
		var class_kind = op_code.kind;
		var vars = op_code.vars.filter(ctx, (ctx, variable) =>
		{
			return !variable.flags.isFlag(ctx, "static");
		});
		if (t.current_class_full_name != "Runtime.BaseObject" && vars.count(ctx) > 0)
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, "_init: function(ctx)"));
			content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
			/* Clear save op codes */
			var save_op_codes = t.save_op_codes;
			var save_op_code_inc = t.save_op_code_inc;
			if (t.current_class_extends_name != "")
			{
				content += use("Runtime.rtl").toStr(t.s(ctx, t.expression.constructor.useModuleName(ctx, t, t.current_class_extends_name) + use("Runtime.rtl").toStr(".prototype._init.call(this,ctx);")));
			}
			var s1 = "";
			for (var i = 0; i < op_code.vars.count(ctx); i++)
			{
				var variable = op_code.vars.item(ctx, i);
				var is_static = variable.flags.isFlag(ctx, "static");
				if (is_static)
				{
					continue;
				}
				var __v0 = use("BayLang.OpCodes.OpAssign");
				if (variable.kind != __v0.KIND_DECLARE)
				{
					continue;
				}
				if (variable.condition && Runtime.rtl.attr(ctx, t.preprocessor_flags, variable.condition.value) != true)
				{
					continue;
				}
				var prefix = "";
				var __v0 = use("BayLang.OpCodes.OpDeclareClass");
				var __v1 = use("BayLang.OpCodes.OpDeclareClass");
				if (class_kind == __v0.KIND_STRUCT)
				{
					/* prefix = "__"; */
					prefix = "";
				}
				else if (class_kind == __v1.KIND_CLASS)
				{
					prefix = "";
				}
				for (var j = 0; j < variable.values.count(ctx); j++)
				{
					var value = variable.values.item(ctx, j);
					var res = t.expression.constructor.Expression(ctx, t, value.expression);
					t = Runtime.rtl.attr(ctx, res, 0);
					var s = (value.expression != null) ? (Runtime.rtl.attr(ctx, res, 1)) : ("null");
					s1 += use("Runtime.rtl").toStr(t.s(ctx, "this." + use("Runtime.rtl").toStr(prefix) + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr(" = ") + use("Runtime.rtl").toStr(s) + use("Runtime.rtl").toStr(";")));
				}
			}
			/* Output save op code */
			var save = t.constructor.outputSaveOpCode(ctx, t, save_op_codes.count(ctx));
			if (save != "")
			{
				content += use("Runtime.rtl").toStr(save);
			}
			/* Restore save op codes */
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_codes"]), save_op_codes);
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["save_op_code_inc"]), save_op_code_inc);
			/* Add content */
			content += use("Runtime.rtl").toStr(s1);
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Component props
	 */
	OpDeclareComponentProps: function(ctx, t, op_code)
	{
		var vars = op_code.vars.filter(ctx, (ctx, variable) =>
		{
			return variable.flags.isFlag(ctx, "props");
		});
		if (vars.count(ctx) == 0)
		{
			return use("Runtime.Vector").from([t,""]);
		}
		var content = "";
		content += use("Runtime.rtl").toStr(t.s(ctx, "props: {"));
		t = t.levelInc(ctx);
		for (var i = 0; i < vars.count(ctx); i++)
		{
			var variable = vars.item(ctx, i);
			var __v0 = use("BayLang.OpCodes.OpAssign");
			if (variable.kind != __v0.KIND_DECLARE)
			{
				continue;
			}
			if (variable.condition && Runtime.rtl.attr(ctx, t.preprocessor_flags, variable.condition.value) != true)
			{
				continue;
			}
			for (var j = 0; j < variable.values.count(ctx); j++)
			{
				var value = variable.values.item(ctx, j);
				var res = t.expression.constructor.Expression(ctx, t, value.expression);
				t = Runtime.rtl.attr(ctx, res, 0);
				var s = (value.expression != null) ? (Runtime.rtl.attr(ctx, res, 1)) : ("null");
				content += use("Runtime.rtl").toStr(t.s(ctx, t.expression.constructor.toString(ctx, value.var_name) + use("Runtime.rtl").toStr(": {")));
				t = t.levelInc(ctx);
				content += use("Runtime.rtl").toStr(t.s(ctx, "default: " + use("Runtime.rtl").toStr(s) + use("Runtime.rtl").toStr(",")));
				t = t.levelDec(ctx);
				content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
			}
		}
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Component variables
	 */
	OpDeclareComponentVariables: function(ctx, t, op_code)
	{
		var vars = op_code.vars.filter(ctx, (ctx, variable) =>
		{
			return !variable.flags.isFlag(ctx, "static") && !variable.flags.isFlag(ctx, "props");
		});
		if (vars.count(ctx) == 0)
		{
			return use("Runtime.Vector").from([t,""]);
		}
		var content = "";
		content += use("Runtime.rtl").toStr(t.s(ctx, "data: function ()"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "return {"));
		t = t.levelInc(ctx);
		for (var i = 0; i < vars.count(ctx); i++)
		{
			var variable = vars.item(ctx, i);
			var __v0 = use("BayLang.OpCodes.OpAssign");
			if (variable.kind != __v0.KIND_DECLARE)
			{
				continue;
			}
			if (variable.condition && Runtime.rtl.attr(ctx, t.preprocessor_flags, variable.condition.value) != true)
			{
				continue;
			}
			for (var j = 0; j < variable.values.count(ctx); j++)
			{
				var value = variable.values.item(ctx, j);
				var res = t.expression.constructor.Expression(ctx, t, value.expression);
				t = Runtime.rtl.attr(ctx, res, 0);
				var s = (value.expression != null) ? (Runtime.rtl.attr(ctx, res, 1)) : ("null");
				content += use("Runtime.rtl").toStr(t.s(ctx, value.var_name + use("Runtime.rtl").toStr(": ") + use("Runtime.rtl").toStr(s) + use("Runtime.rtl").toStr(",")));
			}
		}
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "};"));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Declare component functions
	 */
	OpDeclareComponentFunctions: function(ctx, t, op_code)
	{
		var content = "";
		/* CSS */
		content += use("Runtime.rtl").toStr(t.s(ctx, "css: function(vars)"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "var res = \"\";"));
		for (var i = 0; i < op_code.items.count(ctx); i++)
		{
			var item = op_code.items.get(ctx, i);
			var __v0 = use("BayLang.OpCodes.OpHtmlStyle");
			if (!(item instanceof __v0))
			{
				continue;
			}
			var res = t.expression.constructor.Expression(ctx, t, item.value);
			t = Runtime.rtl.attr(ctx, res, 0);
			var s = Runtime.rtl.attr(ctx, res, 1);
			content += use("Runtime.rtl").toStr(t.s(ctx, "res += Runtime.rtl.toStr(" + use("Runtime.rtl").toStr(s) + use("Runtime.rtl").toStr(");")));
		}
		content += use("Runtime.rtl").toStr(t.s(ctx, "return res;"));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		/* Widget data */
		/*
		OpWidget op_code_widget = op_code.items.findItem(lib::isInstance(classof OpWidget));
		OpHtmlMeta op_code_meta = op_code.items.findItem(lib::isInstance(classof OpHtmlMeta));
		if (op_code_widget)
		{
			content ~= t.s("getWidgetData: function()");
			content ~= t.s("{");
			t = t.levelInc();
			content ~= t.s("return {");
			t = t.levelInc();
			content ~= t.s("\"data\": null,");
			content ~= t.s("\"info\": null,");
			t = t.levelDec();
			content ~= t.s("};");
			t = t.levelDec();
			content ~= t.s("}");
		}
		*/
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Class functions
	 */
	OpDeclareClassFunctions: function(ctx, t, op_code)
	{
		var content = "";
		/* Functions */
		if (op_code.functions != null)
		{
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["is_static_function"]), false);
			for (var i = 0; i < op_code.functions.count(ctx); i++)
			{
				var f = op_code.functions.item(ctx, i);
				if (f.flags.isFlag(ctx, "declare"))
				{
					continue;
				}
				if (f.isStatic(ctx))
				{
					continue;
				}
				/* Set function name */
				t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["current_function"]), f);
				var is_async = "";
				if (f.isFlag(ctx, "async") && t.isAsyncAwait(ctx))
				{
					is_async = "async ";
				}
				var s = "";
				var res = t.operator.constructor.OpDeclareFunctionArgs(ctx, t, f);
				var args = Runtime.rtl.attr(ctx, res, 1);
				s += use("Runtime.rtl").toStr(f.name + use("Runtime.rtl").toStr(": ") + use("Runtime.rtl").toStr(is_async) + use("Runtime.rtl").toStr("function(") + use("Runtime.rtl").toStr(args) + use("Runtime.rtl").toStr(")"));
				var res = t.operator.constructor.OpDeclareFunctionBody(ctx, t, f);
				s += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
				s += use("Runtime.rtl").toStr(",");
				/* Function comments */
				var res = t.operator.constructor.AddComments(ctx, t, f.comments, t.s(ctx, s));
				content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
		}
		/* Items */
		if (op_code.items != null)
		{
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["is_static_function"]), false);
			for (var i = 0; i < op_code.items.count(ctx); i++)
			{
				var item = op_code.items.item(ctx, i);
				var res = this.OpDeclareClassBodyItem(ctx, t, item);
				t = Runtime.rtl.attr(ctx, res, 0);
				content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Class assignObject function
	 */
	OpDeclareClassAssignObject: function(ctx, t, op_code)
	{
		var content = "";
		var var_prefix = "";
		/* Assign Object */
		content += use("Runtime.rtl").toStr(t.s(ctx, "assignObject: function(ctx,o)"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "if (o instanceof " + use("Runtime.rtl").toStr(t.expression.constructor.useModuleName(ctx, t, t.current_class_full_name)) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		for (var i = 0; i < op_code.vars.count(ctx); i++)
		{
			var variable = op_code.vars.item(ctx, i);
			var __v0 = use("BayLang.OpCodes.OpAssign");
			if (variable.kind != __v0.KIND_DECLARE)
			{
				continue;
			}
			if (variable.condition && Runtime.rtl.attr(ctx, t.preprocessor_flags, variable.condition.value) != true)
			{
				continue;
			}
			var is_const = variable.flags.isFlag(ctx, "const");
			var is_static = variable.flags.isFlag(ctx, "static");
			var is_protected = variable.flags.isFlag(ctx, "protected");
			var is_private = variable.flags.isFlag(ctx, "private");
			if (is_const || is_static)
			{
				continue;
			}
			if (is_protected || is_private)
			{
				continue;
			}
			for (var j = 0; j < variable.values.count(ctx); j++)
			{
				var value = variable.values.item(ctx, j);
				content += use("Runtime.rtl").toStr(t.s(ctx, "this." + use("Runtime.rtl").toStr(var_prefix) + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr(" = o.") + use("Runtime.rtl").toStr(var_prefix) + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr(";")));
			}
		}
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		if (t.current_class_extends_name != "")
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, t.expression.constructor.useModuleName(ctx, t, t.current_class_extends_name) + use("Runtime.rtl").toStr(".prototype.assignObject.call(this,ctx,o);")));
		}
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Class assignValue function
	 */
	OpDeclareClassAssignValue: function(ctx, t, op_code)
	{
		var content = "";
		var var_prefix = "";
		/* Assign Value */
		content += use("Runtime.rtl").toStr(t.s(ctx, "assignValue: function(ctx,k,v)"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		var flag = false;
		for (var i = 0; i < op_code.vars.count(ctx); i++)
		{
			var variable = op_code.vars.item(ctx, i);
			var __v0 = use("BayLang.OpCodes.OpAssign");
			if (variable.kind != __v0.KIND_DECLARE)
			{
				continue;
			}
			if (variable.condition && Runtime.rtl.attr(ctx, t.preprocessor_flags, variable.condition.value) != true)
			{
				continue;
			}
			var is_const = variable.flags.isFlag(ctx, "const");
			var is_static = variable.flags.isFlag(ctx, "static");
			var is_protected = variable.flags.isFlag(ctx, "protected");
			var is_private = variable.flags.isFlag(ctx, "private");
			if (is_const || is_static)
			{
				continue;
			}
			if (is_protected || is_private)
			{
				continue;
			}
			for (var j = 0; j < variable.values.count(ctx); j++)
			{
				var value = variable.values.item(ctx, j);
				if (t.flag_struct_check_types)
				{
					content += use("Runtime.rtl").toStr(t.s(ctx, ((flag) ? ("else ") : ("")) + use("Runtime.rtl").toStr("if (k == ") + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, value.var_name)) + use("Runtime.rtl").toStr(")") + use("Runtime.rtl").toStr("this.") + use("Runtime.rtl").toStr(var_prefix) + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr(" = Runtime.rtl.to(v, null, ") + use("Runtime.rtl").toStr(this.toPattern(ctx, t, variable.pattern)) + use("Runtime.rtl").toStr(");")));
				}
				else
				{
					content += use("Runtime.rtl").toStr(t.s(ctx, ((flag) ? ("else ") : ("")) + use("Runtime.rtl").toStr("if (k == ") + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, value.var_name)) + use("Runtime.rtl").toStr(")") + use("Runtime.rtl").toStr("this.") + use("Runtime.rtl").toStr(var_prefix) + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr(" = v;")));
				}
				flag = true;
			}
		}
		if (t.current_class_extends_name != "")
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, ((flag) ? ("else ") : ("")) + use("Runtime.rtl").toStr(t.expression.constructor.useModuleName(ctx, t, t.current_class_extends_name)) + use("Runtime.rtl").toStr(".prototype.assignValue.call(this,ctx,k,v);")));
		}
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Class takeValue function
	 */
	OpDeclareClassTakeValue: function(ctx, t, op_code)
	{
		var content = "";
		var var_prefix = "";
		/* Take Value */
		content += use("Runtime.rtl").toStr(t.s(ctx, "takeValue: function(ctx,k,d)"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "if (d == undefined) d = null;"));
		var flag = false;
		for (var i = 0; i < op_code.vars.count(ctx); i++)
		{
			var variable = op_code.vars.item(ctx, i);
			var __v0 = use("BayLang.OpCodes.OpAssign");
			if (variable.kind != __v0.KIND_DECLARE)
			{
				continue;
			}
			if (variable.condition && Runtime.rtl.attr(ctx, t.preprocessor_flags, variable.condition.value) != true)
			{
				continue;
			}
			var is_const = variable.flags.isFlag(ctx, "const");
			var is_static = variable.flags.isFlag(ctx, "static");
			var is_protected = variable.flags.isFlag(ctx, "protected");
			var is_private = variable.flags.isFlag(ctx, "private");
			if (is_const || is_static)
			{
				continue;
			}
			if (is_protected || is_private)
			{
				continue;
			}
			for (var j = 0; j < variable.values.count(ctx); j++)
			{
				var value = variable.values.item(ctx, j);
				content += use("Runtime.rtl").toStr(t.s(ctx, ((flag) ? ("else ") : ("")) + use("Runtime.rtl").toStr("if (k == ") + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, value.var_name)) + use("Runtime.rtl").toStr(")return this.") + use("Runtime.rtl").toStr(var_prefix) + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr(";")));
				flag = true;
			}
		}
		if (t.current_class_extends_name != "")
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(t.expression.constructor.useModuleName(ctx, t, t.current_class_extends_name)) + use("Runtime.rtl").toStr(".prototype.takeValue.call(this,ctx,k,d);")));
		}
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpDeclareClass
	 */
	OpDeclareClassBody: function(ctx, t, op_code)
	{
		var content = "";
		var class_kind = op_code.kind;
		content += use("Runtime.rtl").toStr(t.s(ctx, "Object.assign(" + use("Runtime.rtl").toStr(t.current_class_full_name) + use("Runtime.rtl").toStr(".prototype,")));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		/* Functions */
		var res = this.OpDeclareClassFunctions(ctx, t, op_code);
		t = Runtime.rtl.attr(ctx, res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		/* Init variables */
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		if (class_kind != __v0.KIND_INTERFACE && op_code.vars != null)
		{
			var res = this.OpDeclareClassInitVariables(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		}
		/* Init struct */
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		if (class_kind == __v0.KIND_STRUCT && op_code.vars != null)
		{
			/* Assign object */
			/*
			list res = static::OpDeclareClassAssignObject(t, op_code);
			t = res[0];
			content ~= res[1];
			*/
			/* Assign value */
			/*
			list res = static::OpDeclareClassAssignValue(t, op_code);
			t = res[0];
			content ~= res[1];
			*/
			/* Take Value */
			var res = this.OpDeclareClassTakeValue(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		}
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "});"));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpDeclareClassFooter
	 */
	OpDeclareClassFooter: function(ctx, t, op_code)
	{
		var content = "";
		var rtl_module_name = t.expression.constructor.useModuleName(ctx, t, "Runtime.rtl");
		if (!t.use_module_name)
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, rtl_module_name + use("Runtime.rtl").toStr(".defClass(") + use("Runtime.rtl").toStr(t.current_class_full_name) + use("Runtime.rtl").toStr(");")));
			content += use("Runtime.rtl").toStr(t.s(ctx, "window[\"" + use("Runtime.rtl").toStr(t.current_class_full_name) + use("Runtime.rtl").toStr("\"] = ") + use("Runtime.rtl").toStr(t.current_class_full_name) + use("Runtime.rtl").toStr(";")));
		}
		content += use("Runtime.rtl").toStr(t.s(ctx, "if (typeof module != \"undefined\" && typeof module.exports != \"undefined\") " + use("Runtime.rtl").toStr("module.exports = ") + use("Runtime.rtl").toStr(t.current_class_full_name) + use("Runtime.rtl").toStr(";")));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpDeclareComponent
	 */
	OpDeclareComponent: function(ctx, t, op_code)
	{
		var content = "";
		content += use("Runtime.rtl").toStr(t.s(ctx, t.current_class_full_name + use("Runtime.rtl").toStr(" = {")));
		t = t.levelInc(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "name: " + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, t.current_class_full_name)) + use("Runtime.rtl").toStr(",")));
		if (t.current_class_extends_name && t.current_class_extends_name != "Runtime.BaseObject")
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, "extends: " + use("Runtime.rtl").toStr(t.expression.constructor.useModuleName(ctx, t, t.current_class_extends_name)) + use("Runtime.rtl").toStr(",")));
		}
		/* Props */
		var res = this.OpDeclareComponentProps(ctx, t, op_code);
		t = Runtime.rtl.attr(ctx, res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		/* Variables */
		var res = this.OpDeclareComponentVariables(ctx, t, op_code);
		t = Runtime.rtl.attr(ctx, res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		/* Methods */
		content += use("Runtime.rtl").toStr(t.s(ctx, "methods:"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		var res = this.OpDeclareClassFunctions(ctx, t, op_code);
		t = Runtime.rtl.attr(ctx, res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "},"));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "};"));
		/* Class static functions */
		var res = this.OpDeclareClassBodyStatic(ctx, t, op_code);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		/* Class footer */
		var res = this.OpDeclareClassFooter(ctx, t, op_code);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpDeclareClass
	 */
	OpDeclareClass: function(ctx, t, op_code)
	{
		if (op_code.is_abstract)
		{
			return use("Runtime.Vector").from([t,""]);
		}
		if (op_code.is_declare)
		{
			var __v0 = use("BayLang.Exceptions.DeclaredClass");
			throw new __v0(ctx)
			return use("Runtime.Vector").from([t,""]);
		}
		var content = "";
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["current_class"]), op_code);
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["current_class_name"]), op_code.name);
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["current_class_full_name"]), t.current_namespace_name + use("Runtime.rtl").toStr(".") + use("Runtime.rtl").toStr(t.current_class_name));
		var __v1 = use("BayLang.OpCodes.OpDeclareClass");
		if (op_code.class_extends != null)
		{
			var __v0 = use("Runtime.rs");
			var extends_name = __v0.join(ctx, ".", op_code.class_extends.entity_name.names);
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["current_class_extends_name"]), extends_name);
		}
		else if (op_code.kind == __v1.KIND_STRUCT)
		{
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["current_class_extends_name"]), "Runtime.BaseStruct");
		}
		if (op_code.is_component)
		{
			return this.OpDeclareComponent(ctx, t, op_code);
		}
		/* Constructor */
		var res = this.OpDeclareClassConstructor(ctx, t, op_code);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		/* Extends */
		if (op_code.class_extends != null)
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, t.current_class_full_name + use("Runtime.rtl").toStr(".prototype = Object.create(") + use("Runtime.rtl").toStr(t.expression.constructor.useModuleName(ctx, t, t.current_class_extends_name)) + use("Runtime.rtl").toStr(".prototype);")));
			content += use("Runtime.rtl").toStr(t.s(ctx, t.current_class_full_name + use("Runtime.rtl").toStr(".prototype.constructor = ") + use("Runtime.rtl").toStr(t.current_class_full_name) + use("Runtime.rtl").toStr(";")));
		}
		/* Class body */
		var res = this.OpDeclareClassBody(ctx, t, op_code);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		/* Class static functions */
		var res = this.OpDeclareClassBodyStatic(ctx, t, op_code);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		/* Class comments */
		var res = t.operator.constructor.AddComments(ctx, t, op_code.comments, content);
		content = Runtime.rtl.attr(ctx, res, 1);
		/* Class footer */
		var res = this.OpDeclareClassFooter(ctx, t, op_code);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Translate item
	 */
	translateItem: function(ctx, t, op_code)
	{
		var __v0 = use("BayLang.OpCodes.OpNamespace");
		var __v1 = use("BayLang.OpCodes.OpDeclareClass");
		var __v2 = use("BayLang.OpCodes.OpComment");
		var __v3 = use("BayLang.OpCodes.OpPreprocessorIfCode");
		var __v4 = use("BayLang.OpCodes.OpPreprocessorSwitch");
		if (op_code instanceof __v0)
		{
			return this.OpNamespace(ctx, t, op_code);
		}
		else if (op_code instanceof __v1)
		{
			return this.OpDeclareClass(ctx, t, op_code);
		}
		else if (op_code instanceof __v2)
		{
			return t.operator.constructor.OpComment(ctx, t, op_code);
		}
		else if (op_code instanceof __v3)
		{
			return t.operator.constructor.OpPreprocessorIfCode(ctx, t, op_code);
		}
		else if (op_code instanceof __v4)
		{
			var content = "";
			for (var i = 0; i < op_code.items.count(ctx); i++)
			{
				var res = t.operator.constructor.OpPreprocessorIfCode(ctx, t, op_code.items.item(ctx, i));
				var s = Runtime.rtl.attr(ctx, res, 1);
				if (s == "")
				{
					continue;
				}
				content += use("Runtime.rtl").toStr(s);
			}
			return use("Runtime.Vector").from([t,content]);
		}
		return use("Runtime.Vector").from([t,""]);
	},
	/**
	 * Translate program
	 */
	translateProgramHeader: function(ctx, t, op_code)
	{
		var content = "";
		if (t.use_strict)
		{
			content = t.s(ctx, "\"use strict;\"");
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * Remove ctx
	 */
	removeContext: function(ctx, content)
	{
		var __v0 = use("Runtime.rs");
		content = __v0.replace(ctx, "\\(" + use("Runtime.rtl").toStr("ctx\\)"), "()", content);
		var __v1 = use("Runtime.rs");
		content = __v1.replace(ctx, "\\(" + use("Runtime.rtl").toStr("ctx, "), "(", content);
		var __v2 = use("Runtime.rs");
		content = __v2.replace(ctx, "\\(" + use("Runtime.rtl").toStr("ctx,"), "(", content);
		var __v3 = use("Runtime.rs");
		content = __v3.replace(ctx, "," + use("Runtime.rtl").toStr("ctx,"), ",", content);
		var __v4 = use("Runtime.rs");
		content = __v4.replace(ctx, "this," + use("Runtime.rtl").toStr("ctx"), "this", content);
		var __v5 = use("Runtime.rs");
		content = __v5.replace(ctx, "this," + use("Runtime.rtl").toStr(" ctx"), "this", content);
		return content;
	},
	/**
	 * Translate program
	 */
	translateProgram: function(ctx, t, op_code)
	{
		var content = "";
		if (op_code == null)
		{
			return use("Runtime.Vector").from([t,content]);
		}
		if (op_code.uses != null)
		{
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["modules"]), op_code.uses);
		}
		if (op_code.items != null)
		{
			var res = this.translateProgramHeader(ctx, t, op_code);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			for (var i = 0; i < op_code.items.count(ctx); i++)
			{
				var item = op_code.items.item(ctx, i);
				var res = this.translateItem(ctx, t, item);
				t = Runtime.rtl.attr(ctx, res, 0);
				var s = Runtime.rtl.attr(ctx, res, 1);
				if (s == "")
				{
					continue;
				}
				content += use("Runtime.rtl").toStr(s);
			}
		}
		var __v0 = use("Runtime.rs");
		content = __v0.trim(ctx, content);
		/* Disable context */
		if (t.enable_context == false)
		{
			content = this.removeContext(ctx, content);
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangES6";
	},
	getClassName: function()
	{
		return "BayLang.LangES6.TranslatorES6Program";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseStruct";
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
});use.add(BayLang.LangES6.TranslatorES6Program);
module.exports = BayLang.LangES6.TranslatorES6Program;