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
BayLang.LangES6.TranslatorES6AsyncAwait = function()
{
	use("Runtime.BaseStruct").apply(this, arguments);
};
BayLang.LangES6.TranslatorES6AsyncAwait.prototype = Object.create(use("Runtime.BaseStruct").prototype);
BayLang.LangES6.TranslatorES6AsyncAwait.prototype.constructor = BayLang.LangES6.TranslatorES6AsyncAwait;
Object.assign(BayLang.LangES6.TranslatorES6AsyncAwait.prototype,
{
	_init: function()
	{
		use("Runtime.BaseStruct").prototype._init.call(this);
		var __v0 = use("Runtime.Collection");
		this.async_stack = new __v0();
		this.pos = use("Runtime.Vector").from([0]);
		this.async_t = "__async_t";
		this.async_var = "__async_var";
	},
	takeValue: function(k,d)
	{
		if (d == undefined) d = null;
		if (k == "async_stack")return this.async_stack;
		else if (k == "pos")return this.pos;
		else if (k == "async_t")return this.async_t;
		else if (k == "async_var")return this.async_var;
		return use("Runtime.BaseStruct").prototype.takeValue.call(this,k,d);
	},
});
Object.assign(BayLang.LangES6.TranslatorES6AsyncAwait, use("Runtime.BaseStruct"));
Object.assign(BayLang.LangES6.TranslatorES6AsyncAwait,
{
	/**
	 * Returns current pos
	 */
	currentPos: function(t)
	{
		var __v0 = use("Runtime.rs");
		return t.expression.constructor.toString(__v0.join(".", t.async_await.pos));
	},
	/**
	 * Returns current pos
	 */
	nextPos: function(t)
	{
		var pos = t.async_await.pos;
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["async_await", "pos"]), pos.setIm(pos.count() - 1, pos.last() + 1));
		var __v0 = use("Runtime.rs");
		var res = t.expression.constructor.toString(__v0.join(".", t.async_await.pos));
		return use("Runtime.Vector").from([t,res]);
	},
	/**
	 * Returns push pos
	 */
	pushPos: function(t)
	{
		var pos = t.async_await.pos;
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["async_await", "pos"]), pos.setIm(pos.count() - 1, pos.last() + 1).pushIm(0));
		var __v0 = use("Runtime.rs");
		var res = t.expression.constructor.toString(__v0.join(".", t.async_await.pos));
		return use("Runtime.Vector").from([t,res]);
	},
	/**
	 * Returns inc pos
	 */
	levelIncPos: function(t)
	{
		var pos = t.async_await.pos;
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["async_await", "pos"]), pos.setIm(pos.count() - 1, pos.last()).pushIm(0));
		var __v0 = use("Runtime.rs");
		var res = t.expression.constructor.toString(__v0.join(".", t.async_await.pos));
		return use("Runtime.Vector").from([t,res]);
	},
	/**
	 * Returns pop pos
	 */
	popPos: function(t)
	{
		var pos = t.async_await.pos.removeLastIm();
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["async_await", "pos"]), pos.setIm(pos.count() - 1, pos.last() + 1));
		var __v0 = use("Runtime.rs");
		var res = t.expression.constructor.toString(__v0.join(".", t.async_await.pos));
		return use("Runtime.Vector").from([t,res]);
	},
	/**
	 * OpCall
	 */
	OpCall: function(t, op_code, is_expression)
	{
		if (is_expression == undefined) is_expression = true;
		var s = "";
		var flag = false;
		if (s == "")
		{
			var res = t.expression.constructor.Dynamic(t, op_code.obj);
			t = Runtime.rtl.attr(res, 0);
			s = Runtime.rtl.attr(res, 1);
			if (s == "parent")
			{
				s = t.expression.constructor.useModuleName(t, t.current_class_extends_name);
				if (t.current_function.name != "constructor")
				{
					if (t.current_function.isStatic())
					{
						s += use("Runtime.rtl").toStr("." + use("Runtime.rtl").toStr(t.current_function.name));
					}
					else
					{
						s += use("Runtime.rtl").toStr(".prototype." + use("Runtime.rtl").toStr(t.current_function.name));
					}
				}
				s += use("Runtime.rtl").toStr(".call(this");
				flag = true;
			}
			else
			{
				s += use("Runtime.rtl").toStr("(");
			}
		}
		var content = s;
		if (t.current_function.is_context && op_code.is_context)
		{
			content += use("Runtime.rtl").toStr("ctx");
			flag = true;
		}
		for (var i = 0; i < op_code.args.count(); i++)
		{
			var item = op_code.args.item(i);
			var res = t.expression.constructor.Expression(t, item);
			t = Runtime.rtl.attr(res, 0);
			var s = Runtime.rtl.attr(res, 1);
			content += use("Runtime.rtl").toStr(((flag) ? (", ") : ("")) + use("Runtime.rtl").toStr(s));
			flag = true;
		}
		content += use("Runtime.rtl").toStr(")");
		var res = t.constructor.incSaveOpCode(t);
		t = Runtime.rtl.attr(res, 0);
		var var_name = Runtime.rtl.attr(res, 1);
		var res = this.nextPos(t);
		t = Runtime.rtl.attr(res, 0);
		var next_pos = Runtime.rtl.attr(res, 1);
		var async_t = t.async_await.async_t;
		content = t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(next_pos) + use("Runtime.rtl").toStr(")") + use("Runtime.rtl").toStr(".call(") + use("Runtime.rtl").toStr(content) + use("Runtime.rtl").toStr(",") + use("Runtime.rtl").toStr(t.expression.constructor.toString(var_name)) + use("Runtime.rtl").toStr(");"));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(next_pos) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		var res = t.constructor.addSaveOpCode(t, use("Runtime.Map").from({"op_code":op_code,"var_name":var_name,"content":content}));
		t = Runtime.rtl.attr(res, 0);
		if (is_expression)
		{
			return use("Runtime.Vector").from([t,async_t + use("Runtime.rtl").toStr(".getVar(") + use("Runtime.rtl").toStr(t.expression.constructor.toString(var_name)) + use("Runtime.rtl").toStr(")")]);
		}
		return use("Runtime.Vector").from([t,""]);
	},
	/**
	 * OpPipe
	 */
	OpPipe: function(t, op_code, is_expression)
	{
		if (is_expression == undefined) is_expression = true;
		var content = "";
		var var_name = "";
		var flag = false;
		var res = t.expression.constructor.Expression(t, op_code.obj);
		t = Runtime.rtl.attr(res, 0);
		var_name = Runtime.rtl.attr(res, 1);
		var __v0 = use("BayLang.OpCodes.OpPipe");
		if (op_code.kind == __v0.KIND_METHOD)
		{
			content = var_name + use("Runtime.rtl").toStr(".constructor.") + use("Runtime.rtl").toStr(op_code.method_name.value);
		}
		else
		{
			var res = t.expression.constructor.OpTypeIdentifier(t, op_code.class_name);
			t = Runtime.rtl.attr(res, 0);
			content = Runtime.rtl.attr(res, 1) + use("Runtime.rtl").toStr(".") + use("Runtime.rtl").toStr(op_code.method_name.value);
		}
		var flag = false;
		content += use("Runtime.rtl").toStr("(");
		if (t.current_function.is_context && op_code.is_context)
		{
			content += use("Runtime.rtl").toStr("ctx");
			flag = true;
		}
		content += use("Runtime.rtl").toStr(((flag) ? (", ") : ("")) + use("Runtime.rtl").toStr(var_name));
		flag = true;
		for (var i = 0; i < op_code.args.count(); i++)
		{
			var item = op_code.args.item(i);
			var res = t.expression.constructor.Expression(t, item);
			t = Runtime.rtl.attr(res, 0);
			var s1 = Runtime.rtl.attr(res, 1);
			content += use("Runtime.rtl").toStr(((flag) ? (", ") : ("")) + use("Runtime.rtl").toStr(s1));
			flag = true;
		}
		content += use("Runtime.rtl").toStr(")");
		var res = t.constructor.incSaveOpCode(t);
		t = Runtime.rtl.attr(res, 0);
		var var_name = Runtime.rtl.attr(res, 1);
		var res = this.nextPos(t);
		t = Runtime.rtl.attr(res, 0);
		var next_pos = Runtime.rtl.attr(res, 1);
		var async_t = t.async_await.async_t;
		content = t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(next_pos) + use("Runtime.rtl").toStr(")") + use("Runtime.rtl").toStr(".call(") + use("Runtime.rtl").toStr(content) + use("Runtime.rtl").toStr(",") + use("Runtime.rtl").toStr(t.expression.constructor.toString(var_name)) + use("Runtime.rtl").toStr(");"));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(next_pos) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		var res = t.constructor.addSaveOpCode(t, use("Runtime.Map").from({"op_code":op_code,"var_name":var_name,"content":content}));
		t = Runtime.rtl.attr(res, 0);
		if (is_expression)
		{
			return use("Runtime.Vector").from([t,async_t + use("Runtime.rtl").toStr(".getVar(") + use("Runtime.rtl").toStr(t.expression.constructor.toString(var_name)) + use("Runtime.rtl").toStr(")")]);
		}
		return use("Runtime.Vector").from([t,""]);
	},
	/**
	 * OpFor
	 */
	OpFor: function(t, op_code)
	{
		var save_t = null;
		var async_t = t.async_await.async_t;
		var async_var = t.async_await.async_var;
		var content = "";
		var res = this.pushPos(t);
		t = Runtime.rtl.attr(res, 0);
		var start_pos = Runtime.rtl.attr(res, 1);
		var res = this.popPos(t);
		save_t = Runtime.rtl.attr(res, 0);
		var end_pos = Runtime.rtl.attr(res, 1);
		var __v0 = use("BayLang.LangES6.AsyncAwait");
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["async_await", "async_stack"]), t.async_await.async_stack.pushIm(new __v0(use("Runtime.Map").from({"start_pos":start_pos,"end_pos":end_pos}))));
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(start_pos) + use("Runtime.rtl").toStr(");")));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("/* Start Loop */"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(start_pos) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		/* Loop Assign */
		var __v1 = use("BayLang.OpCodes.OpAssign");
		if (op_code.expr1 instanceof __v1)
		{
			var __v2 = use("Runtime.rtl");
			var res = t.constructor.saveOpCodeCall(t, __v2.method(t.operator.getClassName(), "OpAssign"), use("Runtime.Vector").from([op_code.expr1]));
			t = Runtime.rtl.attr(res, 0);
			var save = Runtime.rtl.attr(res, 1);
			var value = Runtime.rtl.attr(res, 2);
			if (save != "")
			{
				content += use("Runtime.rtl").toStr(save);
			}
			content += use("Runtime.rtl").toStr(value);
		}
		else
		{
			var __v3 = use("Runtime.rtl");
			var res = t.constructor.saveOpCodeCall(t, __v3.method(t.expression.getClassName(), "Expression"), use("Runtime.Vector").from([op_code.expr1]));
			t = Runtime.rtl.attr(res, 0);
			var save = Runtime.rtl.attr(res, 1);
			var value = Runtime.rtl.attr(res, 2);
			if (save != "")
			{
				content += use("Runtime.rtl").toStr(save);
			}
			content += use("Runtime.rtl").toStr(value);
		}
		/* Loop Expression */
		var res = this.nextPos(t);
		t = Runtime.rtl.attr(res, 0);
		var loop_expression = Runtime.rtl.attr(res, 1);
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(loop_expression) + use("Runtime.rtl").toStr(");")));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("/* Loop Expression */"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(loop_expression) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		/* Call condition expression */
		var __v4 = use("Runtime.rtl");
		var res = t.constructor.saveOpCodeCall(t, __v4.method(t.expression.getClassName(), "Expression"), use("Runtime.Vector").from([op_code.expr2]));
		t = Runtime.rtl.attr(res, 0);
		var save = Runtime.rtl.attr(res, 1);
		var value = Runtime.rtl.attr(res, 2);
		if (save != "")
		{
			content += use("Runtime.rtl").toStr(save);
		}
		/* Loop condition */
		content += use("Runtime.rtl").toStr(t.s("var " + use("Runtime.rtl").toStr(async_var) + use("Runtime.rtl").toStr(" = ") + use("Runtime.rtl").toStr(value) + use("Runtime.rtl").toStr(";")));
		var res = this.nextPos(t);
		t = Runtime.rtl.attr(res, 0);
		var start_loop = Runtime.rtl.attr(res, 1);
		content += use("Runtime.rtl").toStr(t.s("if (" + use("Runtime.rtl").toStr(async_var) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(start_loop) + use("Runtime.rtl").toStr(");")));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(end_pos) + use("Runtime.rtl").toStr(");")));
		/* Start Loop */
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("/* Loop */"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(start_loop) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		var res = t.expression.constructor.Expression(t, op_code.expr3);
		t = Runtime.rtl.attr(res, 0);
		content += use("Runtime.rtl").toStr(t.s(Runtime.rtl.attr(res, 1) + use("Runtime.rtl").toStr(";")));
		var res = t.operator.constructor.Operators(t, op_code.value);
		t = Runtime.rtl.attr(res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(res, 1));
		/* End Loop */
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(loop_expression) + use("Runtime.rtl").toStr(");")));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("/* End Loop */"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(end_pos) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["async_await", "async_stack"]), t.async_await.async_stack.removeLastIm());
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["async_await", "pos"]), save_t.async_await.pos);
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpIfBlock
	 */
	OpIfBlock: function(t, condition, op_code, end_pos)
	{
		var content = "";
		var async_t = t.async_await.async_t;
		var async_var = t.async_await.async_var;
		/* Call condition expression */
		var __v0 = use("Runtime.rtl");
		var res = t.constructor.saveOpCodeCall(t, __v0.method(t.expression.getClassName(), "Expression"), use("Runtime.Vector").from([condition]));
		t = Runtime.rtl.attr(res, 0);
		var save = Runtime.rtl.attr(res, 1);
		var value = Runtime.rtl.attr(res, 2);
		if (save != "")
		{
			content += use("Runtime.rtl").toStr(save);
		}
		var res = this.nextPos(t);
		t = Runtime.rtl.attr(res, 0);
		var start_if = Runtime.rtl.attr(res, 1);
		var res = this.nextPos(t);
		t = Runtime.rtl.attr(res, 0);
		var next_if = Runtime.rtl.attr(res, 1);
		/* If condition */
		content += use("Runtime.rtl").toStr(t.s("var " + use("Runtime.rtl").toStr(async_var) + use("Runtime.rtl").toStr(" = ") + use("Runtime.rtl").toStr(value) + use("Runtime.rtl").toStr(";")));
		content += use("Runtime.rtl").toStr(t.s("if (" + use("Runtime.rtl").toStr(async_var) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(start_if) + use("Runtime.rtl").toStr(");")));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(next_if) + use("Runtime.rtl").toStr(");")));
		/* Start Loop */
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("/* If true */"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(start_if) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		var res = t.operator.constructor.Operators(t, op_code);
		t = Runtime.rtl.attr(res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(res, 1));
		/* End if */
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(end_pos) + use("Runtime.rtl").toStr(");")));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("/* Next If */"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(next_if) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpIf
	 */
	OpIf: function(t, op_code)
	{
		var save_t = null;
		var async_t = t.async_await.async_t;
		var async_var = t.async_await.async_var;
		var content = "";
		var if_true_pos = "";
		var if_false_pos = "";
		var res = this.pushPos(t);
		t = Runtime.rtl.attr(res, 0);
		var start_pos = Runtime.rtl.attr(res, 1);
		var res = this.popPos(t);
		save_t = Runtime.rtl.attr(res, 0);
		var end_pos = Runtime.rtl.attr(res, 1);
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(start_pos) + use("Runtime.rtl").toStr(");")));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("/* Start if */"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(start_pos) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		/* If true */
		var res = this.OpIfBlock(t, op_code.condition, op_code.if_true, end_pos);
		t = Runtime.rtl.attr(res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(res, 1));
		/* If else */
		for (var i = 0; i < op_code.if_else.count(); i++)
		{
			var if_else = op_code.if_else.item(i);
			var res = this.OpIfBlock(t, if_else.condition, if_else.if_true, end_pos);
			t = Runtime.rtl.attr(res, 0);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(res, 1));
		}
		/* Else */
		if (op_code.if_false)
		{
			content += use("Runtime.rtl").toStr(t.s("/* If false */"));
			var res = t.operator.constructor.Operators(t, op_code.if_false);
			t = Runtime.rtl.attr(res, 0);
			content += use("Runtime.rtl").toStr(Runtime.rtl.attr(res, 1));
		}
		/* End if */
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(end_pos) + use("Runtime.rtl").toStr(");")));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("/* End if */"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(end_pos) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["async_await", "pos"]), save_t.async_await.pos);
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpReturn
	 */
	OpReturn: function(t, op_code)
	{
		var content = "";
		var s1 = "";
		if (op_code.expression)
		{
			var res = t.expression.constructor.Expression(t, op_code.expression);
			t = Runtime.rtl.attr(res, 0);
			s1 = Runtime.rtl.attr(res, 1);
		}
		else
		{
			s1 = "null";
		}
		var async_t = t.async_await.async_t;
		content = t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".ret(") + use("Runtime.rtl").toStr(s1) + use("Runtime.rtl").toStr(");"));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpTryCatch
	 */
	OpTryCatch: function(t, op_code)
	{
		var save_t = null;
		var content = "";
		var async_t = t.async_await.async_t;
		var async_var = t.async_await.async_var;
		var res = this.nextPos(t);
		t = Runtime.rtl.attr(res, 0);
		var start_pos = Runtime.rtl.attr(res, 1);
		var res = this.nextPos(t);
		save_t = Runtime.rtl.attr(res, 0);
		var end_pos = Runtime.rtl.attr(res, 1);
		var __v0 = use("BayLang.LangES6.AsyncAwait");
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["async_await", "async_stack"]), t.async_await.async_stack.pushIm(new __v0(use("Runtime.Map").from({"start_pos":start_pos,"end_pos":end_pos}))));
		/* Start Try Catch */
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(start_pos) + use("Runtime.rtl").toStr(");")));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("/* Start Try */"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(start_pos) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		var res = this.levelIncPos(t);
		t = Runtime.rtl.attr(res, 0);
		var start_catch = Runtime.rtl.attr(res, 1);
		content += use("Runtime.rtl").toStr(t.s(async_t + use("Runtime.rtl").toStr(" = ") + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".catch_push(") + use("Runtime.rtl").toStr(start_catch) + use("Runtime.rtl").toStr(");")));
		var res = t.operator.constructor.Operators(t, op_code.op_try);
		t = Runtime.rtl.attr(res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(res, 1));
		/* Start Catch */
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".catch_pop().jump(") + use("Runtime.rtl").toStr(end_pos) + use("Runtime.rtl").toStr(");")));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("/* Start Catch */"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(start_catch) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		content += use("Runtime.rtl").toStr(t.s("var _ex = " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".getErr();")));
		for (var i = 0; i < op_code.items.count(); i++)
		{
			var s = "";
			var pattern = "";
			var item = op_code.items.item(i);
			var res = t.expression.constructor.OpTypeIdentifier(t, item.pattern);
			t = Runtime.rtl.attr(res, 0);
			pattern += use("Runtime.rtl").toStr(Runtime.rtl.attr(res, 1));
			if (pattern != "var")
			{
				s = "if (_ex instanceof " + use("Runtime.rtl").toStr(pattern) + use("Runtime.rtl").toStr(")");
			}
			else
			{
				s = "if (true)";
			}
			s += use("Runtime.rtl").toStr(t.s("{"));
			t = t.levelInc();
			s += use("Runtime.rtl").toStr((s != "") ? (t.s("var " + use("Runtime.rtl").toStr(item.name) + use("Runtime.rtl").toStr(" = _ex;"))) : ("var " + use("Runtime.rtl").toStr(item.name) + use("Runtime.rtl").toStr(" = _ex;")));
			var res = t.operator.constructor.Operators(t, item.value);
			t = Runtime.rtl.attr(res, 0);
			s += use("Runtime.rtl").toStr(Runtime.rtl.attr(res, 1));
			t = t.levelDec();
			s += use("Runtime.rtl").toStr(t.s("}"));
			if (i != 0)
			{
				s = "else " + use("Runtime.rtl").toStr(s);
			}
			content += use("Runtime.rtl").toStr(t.s(s));
		}
		content += use("Runtime.rtl").toStr(t.s("else"));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		content += use("Runtime.rtl").toStr(t.s("throw _ex;"));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		/* End Try Catch */
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(end_pos) + use("Runtime.rtl").toStr(");")));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("/* End Catch */"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(end_pos) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["async_await", "async_stack"]), t.async_await.async_stack.removeLastIm());
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["async_await", "pos"]), save_t.async_await.pos);
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpWhile
	 */
	OpWhile: function(t, op_code)
	{
		var save_t = null;
		var async_t = t.async_await.async_t;
		var async_var = t.async_await.async_var;
		var content = "";
		var res = this.pushPos(t);
		t = Runtime.rtl.attr(res, 0);
		var start_pos = Runtime.rtl.attr(res, 1);
		var res = this.popPos(t);
		save_t = Runtime.rtl.attr(res, 0);
		var end_pos = Runtime.rtl.attr(res, 1);
		var __v0 = use("BayLang.LangES6.AsyncAwait");
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["async_await", "async_stack"]), t.async_await.async_stack.pushIm(new __v0(use("Runtime.Map").from({"start_pos":start_pos,"end_pos":end_pos}))));
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(start_pos) + use("Runtime.rtl").toStr(");")));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("/* Start while */"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(start_pos) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		/* Call condition expression */
		var __v1 = use("Runtime.rtl");
		var res = t.constructor.saveOpCodeCall(t, __v1.method(t.expression.getClassName(), "Expression"), use("Runtime.Vector").from([op_code.condition]));
		t = Runtime.rtl.attr(res, 0);
		var save = Runtime.rtl.attr(res, 1);
		var value = Runtime.rtl.attr(res, 2);
		if (save != "")
		{
			content += use("Runtime.rtl").toStr(save);
		}
		/* Loop condition */
		content += use("Runtime.rtl").toStr(t.s("var " + use("Runtime.rtl").toStr(async_var) + use("Runtime.rtl").toStr(" = ") + use("Runtime.rtl").toStr(value) + use("Runtime.rtl").toStr(";")));
		var res = this.nextPos(t);
		t = Runtime.rtl.attr(res, 0);
		var start_loop = Runtime.rtl.attr(res, 1);
		content += use("Runtime.rtl").toStr(t.s("if (" + use("Runtime.rtl").toStr(async_var) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(start_loop) + use("Runtime.rtl").toStr(");")));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(end_pos) + use("Runtime.rtl").toStr(");")));
		/* Start Loop */
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("/* Loop while */"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(start_loop) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		var res = t.operator.constructor.Operators(t, op_code.value);
		t = Runtime.rtl.attr(res, 0);
		content += use("Runtime.rtl").toStr(Runtime.rtl.attr(res, 1));
		/* End Loop */
		content += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".jump(") + use("Runtime.rtl").toStr(start_pos) + use("Runtime.rtl").toStr(");")));
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		content += use("Runtime.rtl").toStr(t.s("/* End while */"));
		content += use("Runtime.rtl").toStr(t.s("else if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(end_pos) + use("Runtime.rtl").toStr(")")));
		content += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["async_await", "async_stack"]), t.async_await.async_stack.removeLastIm());
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["async_await", "pos"]), save_t.async_await.pos);
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpDeclareFunction Body
	 */
	OpDeclareFunctionBody: function(t, f)
	{
		var save_t = t;
		/* Save op codes */
		var save_vars = t.save_vars;
		var save_op_codes = t.save_op_codes;
		var save_op_code_inc = t.save_op_code_inc;
		t = t.constructor.clearSaveOpCode(t);
		var async_t = t.async_await.async_t;
		t = t.levelInc();
		var s1 = t.s("return (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(") =>"));
		s1 += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		s1 += use("Runtime.rtl").toStr(t.s("if (" + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".pos() == ") + use("Runtime.rtl").toStr(this.currentPos(t)) + use("Runtime.rtl").toStr(")")));
		s1 += use("Runtime.rtl").toStr(t.s("{"));
		t = t.levelInc();
		if (f.items)
		{
			var res = t.operator.constructor.Operators(t, f.items);
			t = Runtime.rtl.attr(res, 0);
			s1 += use("Runtime.rtl").toStr(Runtime.rtl.attr(res, 1));
		}
		else if (f.expression)
		{
			/* Save op codes */
			var save_op_codes = t.save_op_codes;
			var save_op_code_inc = t.save_op_code_inc;
			var res = t.expression.constructor.Expression(t, f.expression);
			t = Runtime.rtl.attr(res, 0);
			var expr = Runtime.rtl.attr(res, 1);
			/* Output save op code */
			var save = t.constructor.outputSaveOpCode(t, save_op_codes.count());
			if (save != "")
			{
				s1 += use("Runtime.rtl").toStr(save);
			}
			/* Restore save op codes */
			t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["save_op_codes"]), save_op_codes);
			t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["save_op_code_inc"]), save_op_code_inc);
			s1 += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".ret(") + use("Runtime.rtl").toStr(expr) + use("Runtime.rtl").toStr(");")));
		}
		t = t.levelDec();
		s1 += use("Runtime.rtl").toStr(t.s("}"));
		s1 += use("Runtime.rtl").toStr(t.s("return " + use("Runtime.rtl").toStr(async_t) + use("Runtime.rtl").toStr(".ret_void();")));
		t = t.levelDec();
		s1 += use("Runtime.rtl").toStr(t.s("};"));
		t = t.levelDec();
		/* Content */
		var content = "";
		content = t.s("{");
		t = t.levelInc();
		if (t.save_vars.count() > 0)
		{
			var __v0 = use("Runtime.rs");
			content += use("Runtime.rtl").toStr(t.s("var " + use("Runtime.rtl").toStr(__v0.join(",", t.save_vars)) + use("Runtime.rtl").toStr(";")));
		}
		content += use("Runtime.rtl").toStr(s1);
		t = t.levelDec();
		content += use("Runtime.rtl").toStr(t.s("}"));
		/* Restore save op codes */
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["save_vars"]), save_vars);
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["save_op_codes"]), save_op_codes);
		t = Runtime.rtl.setAttr(t, Runtime.Collection.from(["save_op_code_inc"]), save_op_code_inc);
		return use("Runtime.Vector").from([save_t,content]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangES6";
	},
	getClassName: function()
	{
		return "BayLang.LangES6.TranslatorES6AsyncAwait";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseStruct";
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
		a.push("async_stack");
		a.push("pos");
		a.push("async_t");
		a.push("async_var");
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
});use.add(BayLang.LangES6.TranslatorES6AsyncAwait);
module.exports = BayLang.LangES6.TranslatorES6AsyncAwait;