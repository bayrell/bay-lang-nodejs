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
BayLang.LangPHP.ParserPHP = function(ctx)
{
	use("BayLang.CoreParser").apply(this, arguments);
};
BayLang.LangPHP.ParserPHP.prototype = Object.create(use("BayLang.CoreParser").prototype);
BayLang.LangPHP.ParserPHP.prototype.constructor = BayLang.LangPHP.ParserPHP;
Object.assign(BayLang.LangPHP.ParserPHP.prototype,
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
	 * Add variable
	 */
	addVariable: function(ctx, op_code)
	{
		var name = op_code.value;
		this.vars.set(ctx, name, true);
	},
	/**
	 * Find variable
	 */
	findVariable: function(ctx, op_code)
	{
		var name = op_code.value;
		if (this.vars.has(ctx, name))
		{
			return true;
		}
		if (this.isRegisteredVariable(ctx, name))
		{
			return true;
		}
		return false;
	},
	/**
	 * Parse file and convert to BaseOpCode
	 */
	parse: function(ctx)
	{
		var __v0 = use("BayLang.TokenReader");
		var reader = new __v0(ctx);
		var __v1 = use("BayLang.Caret");
		var __v2 = use("Runtime.Reference");
		reader.init(ctx, new __v1(ctx, use("Runtime.Map").from({"content":new __v2(ctx, this.content),"tab_size":this.tab_size})));
		return this.parser_program.parse(ctx, reader);
	},
	_init: function(ctx)
	{
		use("BayLang.CoreParser").prototype._init.call(this,ctx);
		var __v0 = use("BayLang.LangPHP.ParserPHPBase");
		var __v1 = use("BayLang.LangPHP.ParserPHPExpression");
		var __v2 = use("BayLang.LangPHP.ParserPHPFunction");
		var __v3 = use("BayLang.LangPHP.ParserPHPOperator");
		var __v4 = use("BayLang.LangPHP.ParserPHPProgram");
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
		this.parser_operator = new __v3(ctx, this);
		this.parser_program = new __v4(ctx, this);
	},
});
Object.assign(BayLang.LangPHP.ParserPHP, use("BayLang.CoreParser"));
Object.assign(BayLang.LangPHP.ParserPHP,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangPHP";
	},
	getClassName: function()
	{
		return "BayLang.LangPHP.ParserPHP";
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
});use.add(BayLang.LangPHP.ParserPHP);
module.exports = BayLang.LangPHP.ParserPHP;