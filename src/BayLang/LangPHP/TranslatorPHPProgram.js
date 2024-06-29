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
BayLang.LangPHP.TranslatorPHPProgram = function(ctx)
{
};
Object.assign(BayLang.LangPHP.TranslatorPHPProgram.prototype,
{
});
Object.assign(BayLang.LangPHP.TranslatorPHPProgram,
{
	/**
	 * OpNamespace
	 */
	OpNamespace: function(ctx, t, op_code)
	{
		var __v0 = use("Runtime.rs");
		var arr = __v0.split(ctx, ".", op_code.name);
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["current_namespace_name"]), op_code.name);
		var __v1 = use("Runtime.rs");
		return use("Runtime.Vector").from([t,t.s(ctx, "namespace " + use("Runtime.rtl").toStr(__v1.join(ctx, "\\", arr)) + use("Runtime.rtl").toStr(";"))]);
	},
	/**
	 * OpDeclareFunction
	 */
	OpDeclareFunction: function(ctx, t, op_code)
	{
		if (op_code.isFlag(ctx, "declare"))
		{
			return use("Runtime.Vector").from([t,""]);
		}
		var content = "";
		/* Set current function */
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["current_function"]), op_code);
		var s1 = "";
		var s2 = "";
		if (op_code.isStatic(ctx))
		{
			s1 += use("Runtime.rtl").toStr("static ");
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["is_static_function"]), true);
		}
		else
		{
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["is_static_function"]), false);
		}
		var res = t.operator.constructor.OpDeclareFunctionArgs(ctx, t, op_code);
		var args = Runtime.rtl.attr(ctx, res, 1);
		s1 += use("Runtime.rtl").toStr("function " + use("Runtime.rtl").toStr(op_code.name) + use("Runtime.rtl").toStr("(") + use("Runtime.rtl").toStr(args) + use("Runtime.rtl").toStr(")"));
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		if (t.current_class.kind != __v0.KIND_INTERFACE)
		{
			var res = t.operator.constructor.OpDeclareFunctionBody(ctx, t, op_code);
			s2 += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		}
		else
		{
			s2 += use("Runtime.rtl").toStr(";");
		}
		s1 = t.s(ctx, s1);
		/* Function comments */
		var res = t.operator.constructor.AddComments(ctx, t, op_code.comments, s1 + use("Runtime.rtl").toStr(s2));
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
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
		content += use("Runtime.rtl").toStr(t.s(ctx, "if ($field_name == " + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, f.name)) + use("Runtime.rtl").toStr(")")));
		t = t.levelInc(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "return \\Runtime\\Dict::from(["));
		t = t.levelInc(ctx);
		if (f.flags.isFlag(ctx, "async"))
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, "\"async\"=>true,"));
		}
		content += use("Runtime.rtl").toStr(t.s(ctx, "\"annotations\"=>\\Runtime\\Collection::from(["));
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
			content += use("Runtime.rtl").toStr(t.s(ctx, "new " + use("Runtime.rtl").toStr(name) + use("Runtime.rtl").toStr("($ctx, ") + use("Runtime.rtl").toStr(params) + use("Runtime.rtl").toStr("),")));
		}
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "]),"));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "]);"));
		t = t.levelDec(ctx);
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
	 * OpDeclareClass
	 */
	OpDeclareClassConstructor: function(ctx, t, op_code)
	{
		if (op_code.fn_create == null)
		{
			return use("Runtime.Vector").from([t,""]);
		}
		var open = "";
		var content = "";
		var save_t = t;
		/* Set function name */
		t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["current_function"]), op_code.fn_create);
		/* Clear save op codes */
		t = t.constructor.clearSaveOpCode(ctx, t);
		open += use("Runtime.rtl").toStr(t.s(ctx, "function __construct("));
		var res = t.operator.constructor.OpDeclareFunctionArgs(ctx, t, op_code.fn_create);
		t = Runtime.rtl.attr(ctx, res, 0);
		open += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		open += use("Runtime.rtl").toStr(")");
		open += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		/* Function body */
		var res = t.operator.constructor.Operators(ctx, t, (op_code.fn_create.expression) ? (op_code.fn_create.expression) : (op_code.fn_create.items));
		t = Runtime.rtl.attr(ctx, res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		/* Constructor end */
		var save = t.constructor.outputSaveOpCode(ctx, t);
		if (save != "")
		{
			content = open + use("Runtime.rtl").toStr(t.s(ctx, save + use("Runtime.rtl").toStr(content)));
		}
		else
		{
			content = open + use("Runtime.rtl").toStr(content);
		}
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		return use("Runtime.Vector").from([save_t,content]);
	},
	/**
	 * Declare component functions
	 */
	OpDeclareComponentFunctions: function(ctx, t, op_code)
	{
		var content = "";
		/* CSS */
		content += use("Runtime.rtl").toStr(t.s(ctx, "static function css($vars)"));
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "$res = \"\";"));
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
			content += use("Runtime.rtl").toStr(t.s(ctx, "$res .= \\Runtime\\rtl::toStr(" + use("Runtime.rtl").toStr(s) + use("Runtime.rtl").toStr(");")));
		}
		content += use("Runtime.rtl").toStr(t.s(ctx, "return $res;"));
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		/* Meta data */
		var __v0 = use("Runtime.lib");
		var op_code_meta = op_code.items.findItem(ctx, __v0.isInstance(ctx, "BayLang.OpCodes.OpHtmlMeta"));
		if (op_code_meta)
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, "static function getMetaData()"));
			content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
			var res = t.expression.constructor.Expression(ctx, t, op_code_meta.value);
			t = Runtime.rtl.attr(ctx, res, 0);
			var s = Runtime.rtl.attr(ctx, res, 1);
			content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(s) + use("Runtime.rtl").toStr(";")));
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpDeclareClass
	 */
	OpDeclareClassBody: function(ctx, t, op_code)
	{
		var content = "";
		var class_kind = op_code.kind;
		var save_op_codes = t.save_op_codes;
		var save_op_code_inc = t.save_op_code_inc;
		t = t.constructor.clearSaveOpCode(ctx, t);
		content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
		t = t.levelInc(ctx);
		/* Static variables */
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		if (class_kind != __v0.KIND_INTERFACE && op_code.vars != null)
		{
			for (var i = 0; i < op_code.vars.count(ctx); i++)
			{
				var variable = op_code.vars.item(ctx, i);
				var __v1 = use("BayLang.OpCodes.OpAssign");
				if (variable.kind != __v1.KIND_DECLARE)
				{
					continue;
				}
				if (variable.condition && Runtime.rtl.attr(ctx, t.preprocessor_flags, variable.condition.value) != true)
				{
					continue;
				}
				var is_static = variable.flags.isFlag(ctx, "static");
				var is_const = variable.flags.isFlag(ctx, "const");
				for (var j = 0; j < variable.values.count(ctx); j++)
				{
					var value = variable.values.item(ctx, j);
					var res = t.expression.constructor.Expression(ctx, t, value.expression);
					var s = (value.expression != null) ? (Runtime.rtl.attr(ctx, res, 1)) : ("null");
					var __v1 = use("BayLang.OpCodes.OpDeclareClass");
					if (is_static && is_const)
					{
						content += use("Runtime.rtl").toStr(t.s(ctx, "const " + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr("=") + use("Runtime.rtl").toStr(s) + use("Runtime.rtl").toStr(";")));
					}
					else if (is_static)
					{
						content += use("Runtime.rtl").toStr(t.s(ctx, "static $" + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr("=") + use("Runtime.rtl").toStr(s) + use("Runtime.rtl").toStr(";")));
					}
					else if (class_kind == __v1.KIND_STRUCT)
					{
						content += use("Runtime.rtl").toStr(t.s(ctx, "public $__" + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr(";")));
					}
					else
					{
						content += use("Runtime.rtl").toStr(t.s(ctx, "public $" + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr(";")));
					}
				}
			}
		}
		/* Constructor */
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		if (class_kind != __v0.KIND_INTERFACE)
		{
			var res = this.OpDeclareClassConstructor(ctx, t, op_code);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		}
		/* Functions */
		if (op_code.functions != null)
		{
			for (var i = 0; i < op_code.functions.count(ctx); i++)
			{
				var f = op_code.functions.item(ctx, i);
				var res = this.OpDeclareFunction(ctx, t, f);
				t = Runtime.rtl.attr(ctx, res, 0);
				content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
		}
		/* Class items */
		for (var i = 0; i < op_code.items.count(ctx); i++)
		{
			var item = op_code.items.item(ctx, i);
			var __v0 = use("BayLang.OpCodes.OpPreprocessorIfCode");
			var __v1 = use("BayLang.OpCodes.OpPreprocessorIfDef");
			var __v3 = use("BayLang.OpCodes.OpPreprocessorSwitch");
			if (item instanceof __v0)
			{
				var res = t.operator.constructor.OpPreprocessorIfCode(ctx, t, item);
				content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
			else if (item instanceof __v1)
			{
				var __v2 = use("BayLang.OpCodes.OpPreprocessorIfDef");
				var res = t.operator.constructor.OpPreprocessorIfDef(ctx, t, item, __v2.KIND_CLASS_BODY);
				content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
			}
			else if (item instanceof __v3)
			{
				for (var j = 0; j < item.items.count(ctx); j++)
				{
					var res = t.operator.constructor.OpPreprocessorIfCode(ctx, t, item.items.item(ctx, j));
					var s = Runtime.rtl.attr(ctx, res, 1);
					if (s == "")
					{
						continue;
					}
					content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
				}
			}
		}
		/* Declare component functions */
		if (op_code.is_model || op_code.is_component)
		{
			var res = this.OpDeclareComponentFunctions(ctx, t, op_code);
			t = Runtime.rtl.attr(ctx, res, 0);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		}
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		if (class_kind != __v0.KIND_INTERFACE)
		{
			content += use("Runtime.rtl").toStr(t.s(ctx, "/* ======================= Class Init Functions ======================= */"));
		}
		/* Init variables */
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		if (class_kind != __v0.KIND_INTERFACE && op_code.vars != null)
		{
			var vars = op_code.vars.filter(ctx, (ctx, variable) =>
			{
				return !variable.flags.isFlag(ctx, "static");
			});
			if (t.current_class_full_name != "Runtime.BaseObject" && vars.count(ctx) > 0)
			{
				content += use("Runtime.rtl").toStr(t.s(ctx, "function _init($ctx)"));
				content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
				t = t.levelInc(ctx);
				if (t.current_class_extends_name != "")
				{
					content += use("Runtime.rtl").toStr(t.s(ctx, "parent::_init($ctx);"));
				}
				for (var i = 0; i < op_code.vars.count(ctx); i++)
				{
					var variable = op_code.vars.item(ctx, i);
					var is_static = variable.flags.isFlag(ctx, "static");
					if (is_static)
					{
						continue;
					}
					var __v1 = use("BayLang.OpCodes.OpAssign");
					if (variable.kind != __v1.KIND_DECLARE)
					{
						continue;
					}
					if (variable.condition && Runtime.rtl.attr(ctx, t.preprocessor_flags, variable.condition.value) != true)
					{
						continue;
					}
					var prefix = "";
					var __v1 = use("BayLang.OpCodes.OpDeclareClass");
					var __v2 = use("BayLang.OpCodes.OpDeclareClass");
					if (class_kind == __v1.KIND_STRUCT)
					{
						prefix = "__";
					}
					else if (class_kind == __v2.KIND_CLASS)
					{
						prefix = "";
					}
					for (var j = 0; j < variable.values.count(ctx); j++)
					{
						var value = variable.values.item(ctx, j);
						var res = t.expression.constructor.Expression(ctx, t, value.expression);
						var s = (value.expression != null) ? (Runtime.rtl.attr(ctx, res, 1)) : ("null");
						content += use("Runtime.rtl").toStr(t.s(ctx, "$this->" + use("Runtime.rtl").toStr(prefix) + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr(" = ") + use("Runtime.rtl").toStr(s) + use("Runtime.rtl").toStr(";")));
					}
				}
				t = t.levelDec(ctx);
				content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
			}
			/* Struct */
			var __v1 = use("BayLang.OpCodes.OpDeclareClass");
			if (op_code.is_component == false && class_kind == __v1.KIND_STRUCT)
			{
				var __v2 = use("BayLang.OpCodes.OpDeclareClass");
				var is_struct = class_kind == __v2.KIND_STRUCT;
				var var_prefix = (is_struct) ? ("__") : ("");
				if (!is_struct && false)
				{
					/* Assign Object */
					content += use("Runtime.rtl").toStr(t.s(ctx, "function assignObject($ctx,$o)"));
					content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
					t = t.levelInc(ctx);
					var __v3 = use("Runtime.rs");
					content += use("Runtime.rtl").toStr(t.s(ctx, "if ($o instanceof \\" + use("Runtime.rtl").toStr(__v3.replace(ctx, "\\.", "\\", t.current_class_full_name)) + use("Runtime.rtl").toStr(")")));
					content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
					t = t.levelInc(ctx);
					for (var i = 0; i < op_code.vars.count(ctx); i++)
					{
						var variable = op_code.vars.item(ctx, i);
						var __v4 = use("BayLang.OpCodes.OpAssign");
						if (variable.kind != __v4.KIND_DECLARE)
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
							content += use("Runtime.rtl").toStr(t.s(ctx, "$this->" + use("Runtime.rtl").toStr(var_prefix) + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr(" = $o->") + use("Runtime.rtl").toStr(var_prefix) + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr(";")));
						}
					}
					t = t.levelDec(ctx);
					content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
					if (t.current_class.extend_name)
					{
						content += use("Runtime.rtl").toStr(t.s(ctx, "parent::assignObject($ctx,$o);"));
					}
					t = t.levelDec(ctx);
					content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
					/* Assign Value */
					content += use("Runtime.rtl").toStr(t.s(ctx, "function assignValue($ctx,$k,$v)"));
					content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
					t = t.levelInc(ctx);
					var flag = false;
					for (var i = 0; i < op_code.vars.count(ctx); i++)
					{
						var variable = op_code.vars.item(ctx, i);
						var __v4 = use("BayLang.OpCodes.OpAssign");
						if (variable.kind != __v4.KIND_DECLARE)
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
								content += use("Runtime.rtl").toStr(t.s(ctx, ((flag) ? ("else ") : ("")) + use("Runtime.rtl").toStr("if ($k == ") + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, value.var_name)) + use("Runtime.rtl").toStr(")") + use("Runtime.rtl").toStr("$this->") + use("Runtime.rtl").toStr(var_prefix) + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr(" = Runtime.rtl.to($v, null, ") + use("Runtime.rtl").toStr(this.toPattern(ctx, t, variable.pattern)) + use("Runtime.rtl").toStr(");")));
							}
							else
							{
								content += use("Runtime.rtl").toStr(t.s(ctx, ((flag) ? ("else ") : ("")) + use("Runtime.rtl").toStr("if ($k == ") + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, value.var_name)) + use("Runtime.rtl").toStr(")") + use("Runtime.rtl").toStr("$this->") + use("Runtime.rtl").toStr(var_prefix) + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr(" = $v;")));
							}
							flag = true;
						}
					}
					if (t.current_class.extend_name)
					{
						content += use("Runtime.rtl").toStr(t.s(ctx, ((flag) ? ("else ") : ("")) + use("Runtime.rtl").toStr("parent::assignValue($ctx,$k,$v);")));
					}
					t = t.levelDec(ctx);
					content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
				}
				/* Take Value */
				content += use("Runtime.rtl").toStr(t.s(ctx, "function takeValue($ctx,$k,$d=null)"));
				content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
				t = t.levelInc(ctx);
				var flag = false;
				for (var i = 0; i < op_code.vars.count(ctx); i++)
				{
					var variable = op_code.vars.item(ctx, i);
					var __v3 = use("BayLang.OpCodes.OpAssign");
					if (variable.kind != __v3.KIND_DECLARE)
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
						content += use("Runtime.rtl").toStr(t.s(ctx, ((flag) ? ("else ") : ("")) + use("Runtime.rtl").toStr("if ($k == ") + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, value.var_name)) + use("Runtime.rtl").toStr(")return $this->") + use("Runtime.rtl").toStr(var_prefix) + use("Runtime.rtl").toStr(value.var_name) + use("Runtime.rtl").toStr(";")));
						flag = true;
					}
				}
				if (t.current_class.extend_name)
				{
					content += use("Runtime.rtl").toStr(t.s(ctx, "return parent::takeValue($ctx,$k,$d);"));
				}
				t = t.levelDec(ctx);
				content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
			}
		}
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		if (class_kind != __v0.KIND_INTERFACE)
		{
			/* Get current namespace function */
			content += use("Runtime.rtl").toStr(t.s(ctx, "static function getNamespace()"));
			content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, t.current_namespace_name)) + use("Runtime.rtl").toStr(";")));
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
			/* Get current class name function */
			content += use("Runtime.rtl").toStr(t.s(ctx, "static function getClassName()"));
			content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, t.current_class_full_name)) + use("Runtime.rtl").toStr(";")));
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
			/* Get parent class name function */
			content += use("Runtime.rtl").toStr(t.s(ctx, "static function getParentClassName()"));
			content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, t.expression.constructor.findModuleName(ctx, t, t.current_class_extends_name))) + use("Runtime.rtl").toStr(";")));
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
			/* Class info */
			content += use("Runtime.rtl").toStr(t.s(ctx, "static function getClassInfo($ctx)"));
			content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
			t = t.constructor.clearSaveOpCode(ctx, t);
			content += use("Runtime.rtl").toStr(t.s(ctx, "return \\Runtime\\Dict::from(["));
			t = t.levelInc(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "\"annotations\"=>\\Runtime\\Collection::from(["));
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
					content += use("Runtime.rtl").toStr(t.s(ctx, "new " + use("Runtime.rtl").toStr(name) + use("Runtime.rtl").toStr("($ctx, ") + use("Runtime.rtl").toStr(params) + use("Runtime.rtl").toStr("),")));
				}
				else
				{
					content += use("Runtime.rtl").toStr(t.s(ctx, "new " + use("Runtime.rtl").toStr(name) + use("Runtime.rtl").toStr("($ctx),")));
				}
			}
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "]),"));
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "]);"));
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
			/* Get fields list of the function */
			content += use("Runtime.rtl").toStr(t.s(ctx, "static function getFieldsList($ctx)"));
			content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "$a = [];"));
			if (op_code.vars != null)
			{
				var __v1 = use("Runtime.Map");
				var vars = new __v1(ctx);
				for (var i = 0; i < op_code.vars.count(ctx); i++)
				{
					var variable = op_code.vars.item(ctx, i);
					var is_const = variable.flags.isFlag(ctx, "const");
					var is_static = variable.flags.isFlag(ctx, "static");
					var is_protected = variable.flags.isFlag(ctx, "protected");
					var is_private = variable.flags.isFlag(ctx, "private");
					var has_annotation = variable.annotations != null && variable.annotations.count(ctx) > 0;
					if (is_const || is_static)
					{
						continue;
					}
					if (is_protected || is_private)
					{
						continue;
					}
					var __v2 = use("BayLang.OpCodes.OpAssign");
					if (variable.kind != __v2.KIND_DECLARE)
					{
						continue;
					}
					var __v2 = use("BayLang.OpCodes.OpDeclareClass");
					if (class_kind != __v2.KIND_STRUCT)
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
						content += use("Runtime.rtl").toStr(t.s(ctx, "$a[]=" + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, value.var_name)) + use("Runtime.rtl").toStr(";")));
					}
				}
			}
			content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(t.expression.constructor.getModuleName(ctx, t, "Runtime.Collection")) + use("Runtime.rtl").toStr("::from($a);")));
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
			/* Get field info by name */
			content += use("Runtime.rtl").toStr(t.s(ctx, "static function getFieldInfoByName($ctx,$field_name)"));
			content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
			if (op_code.vars != null)
			{
				for (var i = 0; i < op_code.vars.count(ctx); i++)
				{
					var variable = op_code.vars.item(ctx, i);
					var __v1 = use("BayLang.OpCodes.OpAssign");
					if (variable.kind != __v1.KIND_DECLARE)
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
						return "$field_name == " + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, var_name));
					});
					var __v1 = use("Runtime.rs");
					var var_type = __v1.join(ctx, ".", t.expression.constructor.findModuleNames(ctx, t, variable.pattern.entity_name.names));
					var var_sub_types = (variable.pattern.template != null) ? (variable.pattern.template.map(ctx, (ctx, op_code) =>
					{
						var __v2 = use("Runtime.rs");
						return __v2.join(ctx, ".", t.expression.constructor.findModuleNames(ctx, t, op_code.entity_name.names));
					})) : (use("Runtime.Vector").from([]));
					var_sub_types = var_sub_types.map(ctx, t.expression.constructor.toString);
					t = t.constructor.clearSaveOpCode(ctx, t);
					var __v2 = use("Runtime.rs");
					content += use("Runtime.rtl").toStr(t.s(ctx, "if (" + use("Runtime.rtl").toStr(__v2.join(ctx, " or ", v)) + use("Runtime.rtl").toStr(") ") + use("Runtime.rtl").toStr("return \\Runtime\\Dict::from([")));
					t = t.levelInc(ctx);
					content += use("Runtime.rtl").toStr(t.s(ctx, "\"t\"=>" + use("Runtime.rtl").toStr(t.expression.constructor.toString(ctx, var_type)) + use("Runtime.rtl").toStr(",")));
					if (var_sub_types.count(ctx) > 0)
					{
						var __v3 = use("Runtime.rs");
						content += use("Runtime.rtl").toStr(t.s(ctx, "\"s\"=> [" + use("Runtime.rtl").toStr(__v3.join(ctx, ", ", var_sub_types)) + use("Runtime.rtl").toStr("],")));
					}
					content += use("Runtime.rtl").toStr(t.s(ctx, "\"annotations\"=>\\Runtime\\Collection::from(["));
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
						content += use("Runtime.rtl").toStr(t.s(ctx, "new " + use("Runtime.rtl").toStr(name) + use("Runtime.rtl").toStr("($ctx, ") + use("Runtime.rtl").toStr(params) + use("Runtime.rtl").toStr("),")));
					}
					t = t.levelDec(ctx);
					content += use("Runtime.rtl").toStr(t.s(ctx, "]),"));
					t = t.levelDec(ctx);
					content += use("Runtime.rtl").toStr(t.s(ctx, "]);"));
				}
			}
			content += use("Runtime.rtl").toStr(t.s(ctx, "return null;"));
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
			/* Get methods list of the function */
			content += use("Runtime.rtl").toStr(t.s(ctx, "static function getMethodsList($ctx)"));
			content += use("Runtime.rtl").toStr(t.s(ctx, "{"));
			t = t.levelInc(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "$a=["));
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
			content += use("Runtime.rtl").toStr(t.s(ctx, "return " + use("Runtime.rtl").toStr(t.expression.constructor.getModuleName(ctx, t, "Runtime.Collection")) + use("Runtime.rtl").toStr("::from($a);")));
			t = t.levelDec(ctx);
			content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
			/* Get method info by name */
			content += use("Runtime.rtl").toStr(t.s(ctx, "static function getMethodInfoByName($ctx,$field_name)"));
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
			content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		}
		t = t.levelDec(ctx);
		content += use("Runtime.rtl").toStr(t.s(ctx, "}"));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpDeclareClassFooter
	 */
	OpDeclareClassFooter: function(ctx, t, op_code)
	{
		var content = "";
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
		var __v2 = use("BayLang.OpCodes.OpDeclareClass");
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
		else if (op_code.kind == __v2.KIND_STRUCT)
		{
			t = Runtime.rtl.setAttr(ctx, t, Runtime.Collection.from(["current_class_extends_name"]), "");
		}
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		if (op_code.kind != __v0.KIND_INTERFACE)
		{
			if (op_code.class_extends != null)
			{
				content = "class " + use("Runtime.rtl").toStr(t.current_class_name) + use("Runtime.rtl").toStr(" extends ") + use("Runtime.rtl").toStr(t.expression.constructor.getModuleName(ctx, t, t.current_class_extends_name));
			}
			else
			{
				content = "class " + use("Runtime.rtl").toStr(t.current_class_name);
			}
		}
		else
		{
			content = "interface " + use("Runtime.rtl").toStr(t.current_class_name);
		}
		/* Add implements */
		if (op_code.class_implements != null && op_code.class_implements.count(ctx) > 0)
		{
			var arr = op_code.class_implements.map(ctx, (ctx, item) =>
			{
				return t.expression.constructor.getModuleNames(ctx, t, item.entity_name.names);
			});
			var __v0 = use("Runtime.rs");
			var s1 = __v0.join(ctx, ", ", arr);
			content += use("Runtime.rtl").toStr(" implements " + use("Runtime.rtl").toStr(s1));
		}
		/* Class body */
		var res = this.OpDeclareClassBody(ctx, t, op_code);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		/* Class comments */
		var res = t.operator.constructor.AddComments(ctx, t, op_code.comments, content);
		content = Runtime.rtl.attr(ctx, res, 1);
		/* Class footer */
		var res = this.OpDeclareClassFooter(ctx, t, op_code);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, res, 1));
		return use("Runtime.Vector").from([t,t.s(ctx, content)]);
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
		var content = "<?php";
		return use("Runtime.Vector").from([t,content]);
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
			var __v1 = use("Runtime.rs");
			content = __v1.replace(ctx, "($ctx)", "()", content);
			var __v2 = use("Runtime.rs");
			content = __v2.replace(ctx, "($ctx, ", "(", content);
			var __v3 = use("Runtime.rs");
			content = __v3.replace(ctx, "($ctx,", "(", content);
			var __v4 = use("Runtime.rs");
			content = __v4.replace(ctx, ",$ctx,", ",", content);
		}
		return use("Runtime.Vector").from([t,content]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangPHP";
	},
	getClassName: function()
	{
		return "BayLang.LangPHP.TranslatorPHPProgram";
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
});use.add(BayLang.LangPHP.TranslatorPHPProgram);
module.exports = BayLang.LangPHP.TranslatorPHPProgram;