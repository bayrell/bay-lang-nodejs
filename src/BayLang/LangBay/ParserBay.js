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
BayLang.LangBay.ParserBay = function(ctx)
{
	use("BayLang.CoreParser").apply(this, arguments);
};
BayLang.LangBay.ParserBay.prototype = Object.create(use("BayLang.CoreParser").prototype);
BayLang.LangBay.ParserBay.prototype.constructor = BayLang.LangBay.ParserBay;
Object.assign(BayLang.LangBay.ParserBay.prototype,
{
	/**
	 * Returns true if registered variable
	 */
	isRegisteredVariable: function(ctx, name)
	{
		var variables = use("Runtime.Vector").from(["print","rs","rtl"]);
		if (variables.indexOf(ctx, name) == -1)
		{
			return false;
		}
		return true;
	},
	/**
	 * Returns true if system type
	 */
	isSystemType: function(ctx, name)
	{
		var variables = use("Runtime.Vector").from(["var","void","bool","byte","int","char","string","list","scalar","primitive","html","Error","Object","DateTime","Collection","Dict","Vector","Map","ArrayInterface"]);
		if (variables.indexOf(ctx, name) == -1)
		{
			return false;
		}
		return true;
	},
	/**
	 * Add variable
	 */
	addVariable: function(ctx, op_code)
	{
		var name = op_code.value;
		this.vars.set(ctx, name, true);
	},
	/**
	 * Find identifier
	 */
	findIdentifier: function(ctx, op_code)
	{
		var name = op_code.value;
		if (this.vars.has(ctx, name) || this.isRegisteredVariable(ctx, name))
		{
			var __v0 = use("BayLang.OpCodes.OpIdentifier");
			op_code.kind = __v0.KIND_VARIABLE;
		}
		if (this.uses.has(ctx, name) || this.isSystemType(ctx, name))
		{
			var __v0 = use("BayLang.OpCodes.OpIdentifier");
			op_code.kind = __v0.KIND_TYPE;
		}
	},
	/**
	 * Find variable
	 */
	findVariable: function(ctx, op_code)
	{
		var name = op_code.value;
		this.findIdentifier(ctx, op_code);
		var __v0 = use("BayLang.OpCodes.OpIdentifier");
		if (op_code.kind == __v0.KIND_VARIABLE)
		{
			return ;
		}
		throw op_code.caret_end.error(ctx, "Unknown identifier '" + use("Runtime.rtl").toStr(name) + use("Runtime.rtl").toStr("'"))
	},
	/**
	 * Find type
	 */
	findType: function(ctx, op_code)
	{
		var name = op_code.value;
		var __v0 = use("BayLang.OpCodes.OpIdentifier");
		if (op_code.kind == __v0.KIND_TYPE)
		{
			return ;
		}
		throw op_code.caret_end.error(ctx, "Unknown type '" + use("Runtime.rtl").toStr(name) + use("Runtime.rtl").toStr("'"))
	},
	/**
	 * Parse file and convert to BaseOpCode
	 */
	parse: function(ctx)
	{
		var reader = this.createReader(ctx);
		return this.parser_program.parse(ctx, reader);
	},
	_init: function(ctx)
	{
		use("BayLang.CoreParser").prototype._init.call(this,ctx);
		var __v0 = use("BayLang.LangBay.ParserBayBase");
		var __v1 = use("BayLang.LangBay.ParserBayExpression");
		var __v2 = use("BayLang.LangBay.ParserBayFunction");
		var __v3 = use("BayLang.LangBay.ParserBayHtml");
		var __v4 = use("BayLang.LangBay.ParserBayOperator");
		var __v5 = use("BayLang.LangBay.ParserBayPreprocessor");
		var __v6 = use("BayLang.LangBay.ParserBayProgram");
		this.vars = use("Runtime.Map").from({});
		this.uses = use("Runtime.Map").from({});
		this.current_namespace = null;
		this.current_class = null;
		this.current_namespace_name = "";
		this.current_class_name = "";
		this.current_class_kind = "";
		this.current_class_abstract = false;
		this.current_class_declare = false;
		this.find_identifier = true;
		this.skip_comments = true;
		this.pipe_kind = "";
		this.is_pipe = false;
		this.is_html = false;
		this.is_local_css = false;
		this.parser_base = new __v0(ctx, this);
		this.parser_expression = new __v1(ctx, this);
		this.parser_function = new __v2(ctx, this);
		this.parser_html = new __v3(ctx, this);
		this.parser_operator = new __v4(ctx, this);
		this.parser_preprocessor = new __v5(ctx, this);
		this.parser_program = new __v6(ctx, this);
	},
});
Object.assign(BayLang.LangBay.ParserBay, use("BayLang.CoreParser"));
Object.assign(BayLang.LangBay.ParserBay,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangBay";
	},
	getClassName: function()
	{
		return "BayLang.LangBay.ParserBay";
	},
	getParentClassName: function()
	{
		return "BayLang.CoreParser";
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
});use.add(BayLang.LangBay.ParserBay);
module.exports = BayLang.LangBay.ParserBay;