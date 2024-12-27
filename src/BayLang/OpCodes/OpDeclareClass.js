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
BayLang.OpCodes.OpDeclareClass = function(ctx)
{
	use("BayLang.OpCodes.BaseOpCode").apply(this, arguments);
};
BayLang.OpCodes.OpDeclareClass.prototype = Object.create(use("BayLang.OpCodes.BaseOpCode").prototype);
BayLang.OpCodes.OpDeclareClass.prototype.constructor = BayLang.OpCodes.OpDeclareClass;
Object.assign(BayLang.OpCodes.OpDeclareClass.prototype,
{
	/**
	 * Serialize object
	 */
	serialize: function(ctx, serializer, data)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype.serialize.call(this, ctx, serializer, data);
		serializer.process(ctx, this, "annotations", data);
		serializer.process(ctx, this, "class_extends", data);
		serializer.process(ctx, this, "class_implements", data);
		serializer.process(ctx, this, "comments", data);
		serializer.process(ctx, this, "extend_name", data);
		serializer.process(ctx, this, "flags", data);
		serializer.process(ctx, this, "fn_create", data);
		serializer.process(ctx, this, "fn_destroy", data);
		serializer.process(ctx, this, "functions", data);
		serializer.process(ctx, this, "is_abstract", data);
		serializer.process(ctx, this, "is_component", data);
		serializer.process(ctx, this, "is_declare", data);
		serializer.process(ctx, this, "is_model", data);
		serializer.process(ctx, this, "items", data);
		serializer.process(ctx, this, "kind", data);
		serializer.process(ctx, this, "name", data);
		serializer.process(ctx, this, "template", data);
		serializer.process(ctx, this, "vars", data);
	},
	/**
	 * Find function
	 */
	findFunction: function(ctx, name)
	{
		return this.items.findItem(ctx, (ctx, op_code) =>
		{
			var __v0 = use("BayLang.OpCodes.OpDeclareFunction");
			return op_code instanceof __v0 && op_code.name == name;
		});
	},
	_init: function(ctx)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype._init.call(this,ctx);
		this.op = "op_class";
		this.kind = "";
		this.name = "";
		this.extend_name = "";
		this.annotations = null;
		this.comments = null;
		this.template = null;
		this.flags = null;
		this.fn_create = null;
		this.fn_destroy = null;
		this.class_extends = null;
		this.class_implements = null;
		this.vars = null;
		this.functions = null;
		this.items = null;
		this.is_abstract = false;
		this.is_static = false;
		this.is_declare = false;
		this.is_component = false;
		this.is_model = false;
	},
});
Object.assign(BayLang.OpCodes.OpDeclareClass, use("BayLang.OpCodes.BaseOpCode"));
Object.assign(BayLang.OpCodes.OpDeclareClass,
{
	KIND_CLASS: "class",
	KIND_STRUCT: "struct",
	KIND_INTERFACE: "interface",
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.OpCodes";
	},
	getClassName: function()
	{
		return "BayLang.OpCodes.OpDeclareClass";
	},
	getParentClassName: function()
	{
		return "BayLang.OpCodes.BaseOpCode";
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
});use.add(BayLang.OpCodes.OpDeclareClass);
module.exports = BayLang.OpCodes.OpDeclareClass;