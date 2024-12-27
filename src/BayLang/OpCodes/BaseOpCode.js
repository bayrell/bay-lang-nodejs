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
BayLang.OpCodes.BaseOpCode = function(ctx, params)
{
	if (params == undefined) params = null;
	use("Runtime.BaseObject").call(this, ctx);
	this._assign_values(ctx, params);
};
BayLang.OpCodes.BaseOpCode.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.OpCodes.BaseOpCode.prototype.constructor = BayLang.OpCodes.BaseOpCode;
Object.assign(BayLang.OpCodes.BaseOpCode.prototype,
{
	/**
	 * Serialize object
	 */
	serialize: function(ctx, serializer, data)
	{
		serializer.process(ctx, this, "caret_start", data);
		serializer.process(ctx, this, "caret_end", data);
	},
	/**
	 * Is multiline
	 */
	isMultiLine: function(ctx)
	{
		if (!this.caret_start)
		{
			return true;
		}
		if (!this.caret_end)
		{
			return true;
		}
		return this.caret_start.y != this.caret_end.y;
	},
	/**
	 * Clone this struct with new values
	 * @param Map obj = null
	 * @return BaseStruct
	 */
	clone: function(ctx, obj)
	{
		if (obj == undefined) obj = null;
		if (obj == null)
		{
			return this;
		}
		var proto = Object.getPrototypeOf(this);
		var item = Object.create(proto);
		item = Object.assign(item, this);
		item._assign_values(ctx, obj);
		
		return item;
		return this;
	},
	/**
	 * Copy this struct with new values
	 * @param Map obj = null
	 * @return BaseStruct
	 */
	copy: function(ctx, obj)
	{
		if (obj == undefined) obj = null;
		return this.clone(ctx, obj);
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.caret_start = null;
		this.caret_end = null;
	},
});
Object.assign(BayLang.OpCodes.BaseOpCode, use("Runtime.BaseObject"));
Object.assign(BayLang.OpCodes.BaseOpCode,
{
	op: "",
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.OpCodes";
	},
	getClassName: function()
	{
		return "BayLang.OpCodes.BaseOpCode";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
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
	__implements__:
	[
		use("Runtime.SerializeInterface"),
	],
});use.add(BayLang.OpCodes.BaseOpCode);
module.exports = BayLang.OpCodes.BaseOpCode;