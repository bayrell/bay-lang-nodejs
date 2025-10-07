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
if (typeof BayLang.OpCodes == 'undefined') BayLang.OpCodes = {};
BayLang.OpCodes.OpDeclareFunction = function()
{
	use("BayLang.OpCodes.BaseOpCode").apply(this, arguments);
};
BayLang.OpCodes.OpDeclareFunction.prototype = Object.create(use("BayLang.OpCodes.BaseOpCode").prototype);
BayLang.OpCodes.OpDeclareFunction.prototype.constructor = BayLang.OpCodes.OpDeclareFunction;
Object.assign(BayLang.OpCodes.OpDeclareFunction.prototype,
{
	/**
	 * Serialize object
	 */
	serialize: function(serializer, data)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype.serialize.call(this, serializer, data);
		serializer.process(this, "annotations", data);
		serializer.process(this, "args", data);
		serializer.process(this, "comments", data);
		serializer.process(this, "expression", data);
		serializer.process(this, "flags", data);
		serializer.process(this, "is_context", data);
		serializer.process(this, "is_html", data);
		serializer.process(this, "is_html_default_args", data);
		serializer.process(this, "items", data);
		serializer.process(this, "name", data);
		serializer.process(this, "result_type", data);
		serializer.process(this, "vars", data);
	},
	/**
	 * Returns true if static function
	 */
	isStatic: function()
	{
		return this.flags != null && (this.flags.isFlag("static") || this.flags.isFlag("lambda") || this.flags.isFlag("pure"));
	},
	/**
	 * Returns true if is flag
	 */
	isFlag: function(flag_name)
	{
		return this.flags != null && this.flags.isFlag(flag_name);
	},
	/**
	 * Returns function expression
	 */
	getExpression: function()
	{
		if (this.expression != null)
		{
			return this.expression;
		}
		var __v0 = use("BayLang.OpCodes.OpItems");
		if (!(this.items instanceof __v0))
		{
			return null;
		}
		var op_code_item = this.items.items.get(0);
		var __v1 = use("BayLang.OpCodes.OpReturn");
		if (!(op_code_item instanceof __v1))
		{
			return null;
		}
		return op_code_item.expression;
	},
	_init: function()
	{
		use("BayLang.OpCodes.BaseOpCode").prototype._init.call(this);
		this.op = "op_function";
		this.name = "";
		this.annotations = null;
		this.comments = null;
		this.args = null;
		this.vars = null;
		this.result_type = null;
		this.expression = null;
		this.items = null;
		this.flags = null;
		this.is_context = true;
		this.is_html = false;
		this.is_html_default_args = false;
	},
});
Object.assign(BayLang.OpCodes.OpDeclareFunction, use("BayLang.OpCodes.BaseOpCode"));
Object.assign(BayLang.OpCodes.OpDeclareFunction,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.OpCodes";
	},
	getClassName: function()
	{
		return "BayLang.OpCodes.OpDeclareFunction";
	},
	getParentClassName: function()
	{
		return "BayLang.OpCodes.BaseOpCode";
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
});use.add(BayLang.OpCodes.OpDeclareFunction);
module.exports = BayLang.OpCodes.OpDeclareFunction;