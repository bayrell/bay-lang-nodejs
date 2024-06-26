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
if (typeof Runtime == 'undefined') Runtime = {};
Runtime.Money = function(ctx, value, currency)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.value = value;
	this.currency = currency;
};
Runtime.Money.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.Money.prototype.constructor = Runtime.Money;
Object.assign(Runtime.Money.prototype,
{
	/**
	 * Returns value
	 */
	getValue: function(ctx)
	{
		return this.value;
	},
	/**
	 * Returns currency
	 */
	getCurrency: function(ctx)
	{
		return this.currency;
	},
	/**
	 * Add money
	 */
	add: function(ctx, money)
	{
		if (this.currency != money.currency)
		{
			var __v0 = use("Runtime.Exceptions.RuntimeException");
			throw new __v0(ctx, "Money currency mismatch")
		}
		this.value = Runtime.rtl.attr(ctx, this.value, ["value"]) + money.currency;
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.value = 0;
		this.currency = "";
	},
});
Object.assign(Runtime.Money, use("Runtime.BaseObject"));
Object.assign(Runtime.Money,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.Money";
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
});use.add(Runtime.Money);
module.exports = Runtime.Money;