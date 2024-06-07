"use strict;"
var use = require('bay-lang').use;
/*!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2018 "Ildar Bikmamatov" <support@bayrell.org>
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
BayLang.OpCodes.OpAssignValue = function(ctx)
{
	use("BayLang.OpCodes.BaseOpCode").apply(this, arguments);
};
BayLang.OpCodes.OpAssignValue.prototype = Object.create(use("BayLang.OpCodes.BaseOpCode").prototype);
BayLang.OpCodes.OpAssignValue.prototype.constructor = BayLang.OpCodes.OpAssignValue;
Object.assign(BayLang.OpCodes.OpAssignValue.prototype,
{
	/**
	 * Serialize object
	 */
	serialize: function(ctx, serializer, data)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype.serialize.call(this, ctx, serializer, data);
		serializer.process(ctx, this, "expression", data);
		serializer.process(ctx, this, "op_code", data);
		serializer.process(ctx, this, "var_name", data);
	},
	_init: function(ctx)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype._init.call(this,ctx);
		this.op = "";
		this.var_name = "";
		this.op_code = null;
		this.expression = null;
	},
});
Object.assign(BayLang.OpCodes.OpAssignValue, use("BayLang.OpCodes.BaseOpCode"));
Object.assign(BayLang.OpCodes.OpAssignValue,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.OpCodes";
	},
	getClassName: function()
	{
		return "BayLang.OpCodes.OpAssignValue";
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
});use.add(BayLang.OpCodes.OpAssignValue);
module.exports = BayLang.OpCodes.OpAssignValue;