"use strict;"
var use = require('bay-lang').use;
/*!
 *  Bayrell Runtime Library
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
if (typeof Runtime == 'undefined') Runtime = {};
if (typeof Runtime.Entity == 'undefined') Runtime.Entity = {};
Runtime.Entity.Provider = function(ctx, name, value, params)
{
	if (value == undefined) value = null;
	if (params == undefined) params = null;
	var __v0 = use("Runtime.Dict");
	if (value instanceof __v0)
	{
		params = value;
		value = null;
	}
	if (value == null)
	{
		value = name;
	}
	use("Runtime.Entity.Entity").call(this, ctx, use("Runtime.Map").from({"name":name,"value":value,"params":params}));
};
Runtime.Entity.Provider.prototype = Object.create(use("Runtime.Entity.Entity").prototype);
Runtime.Entity.Provider.prototype.constructor = Runtime.Entity.Provider;
Object.assign(Runtime.Entity.Provider.prototype,
{
	/**
	 * Create provider
	 */
	createProvider: function(ctx)
	{
		var provider = null;
		var class_name = this.value;
		if (class_name == null)
		{
			class_name = this.name;
		}
		var __v0 = use("Runtime.BaseProvider");
		var __v1 = use("Runtime.rtl");
		if (class_name instanceof __v0)
		{
			provider = class_name;
		}
		else if (__v1.isString(ctx, class_name))
		{
			var __v2 = use("Runtime.rtl");
			provider = __v2.newInstance(ctx, class_name, use("Runtime.Vector").from([this.params]));
		}
		return provider;
	},
	_init: function(ctx)
	{
		use("Runtime.Entity.Entity").prototype._init.call(this,ctx);
		this.value = null;
		this.params = null;
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "value")return this.value;
		else if (k == "params")return this.params;
		return use("Runtime.Entity.Entity").prototype.takeValue.call(this,ctx,k,d);
	},
});
Object.assign(Runtime.Entity.Provider, use("Runtime.Entity.Entity"));
Object.assign(Runtime.Entity.Provider,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime.Entity";
	},
	getClassName: function()
	{
		return "Runtime.Entity.Provider";
	},
	getParentClassName: function()
	{
		return "Runtime.Entity.Entity";
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
		a.push("value");
		a.push("params");
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
});use.add(Runtime.Entity.Provider);
module.exports = Runtime.Entity.Provider;