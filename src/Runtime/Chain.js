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
Runtime.Chain = function(ctx)
{
	use("Runtime.Callback").call(this, ctx, null, null);
};
Runtime.Chain.prototype = Object.create(use("Runtime.Callback").prototype);
Runtime.Chain.prototype.constructor = Runtime.Chain;
Object.assign(Runtime.Chain.prototype,
{
	/**
	 * Check if method exists
	 */
	exists: function(ctx)
	{
		return true;
	},
	/**
	 * Check callback
	 */
	check: function(ctx)
	{
	},
	/**
	 * Returns true if async
	 */
	isAsync: function(ctx)
	{
		return this.is_async;
	},
	/**
	 * Returns true if chain functions must returns value
	 */
	isReturnValue: function(ctx)
	{
		return this.is_return_value;
	},
	/**
	 * Setting the behavior, the chain functions should return a value or not
	 */
	setReturnValue: function(ctx, value)
	{
		this.is_return_value = value;
	},
	/**
	 * Returns true if async
	 */
	getChain: function(ctx)
	{
		return this.chain.slice(ctx);
	},
	/**
	 * Add function to chain
	 */
	add: function(ctx, f, priority)
	{
		if (priority == undefined) priority = 100;
		this.chain.push(ctx, use("Runtime.Map").from({"async":false,"callback":f,"priority":priority}));
		return this;
	},
	/**
	 * Add async function to chain
	 */
	addAsync: function(ctx, f, priority)
	{
		if (priority == undefined) priority = 100;
		this.is_async = true;
		this.chain.push(ctx, use("Runtime.Map").from({"async":true,"callback":f,"priority":priority}));
		return this;
	},
	/**
	 * Sort chain
	 */
	sort: function(ctx)
	{
		var __v0 = use("Runtime.lib");
		this.chain = this.chain.sort(ctx, __v0.sortAttr(ctx, "priority", "asc"));
	},
	/**
	 * Apply chain
	 */
	apply: function(ctx, args)
	{
		if (args == undefined) args = null;
		var __v0 = use("Runtime.Monad");
		var monada = new __v0(ctx, args.get(ctx, 0));
		if (!this.is_async)
		{
			this.applyChain(ctx, monada);
			return monada.value(ctx);
		}
		else
		{
			var f = async (ctx, monada) =>
			{
				await this.applyChainAsync(ctx, monada);
				return Promise.resolve(monada.value(ctx));
			};
			return f(ctx, monada);
		}
	},
	/**
	 * Apply async chain
	 */
	applyAsync: async function(ctx, args)
	{
		if (args == undefined) args = null;
		var __v0 = use("Runtime.Monad");
		var monada = new __v0(ctx, args.get(ctx, 0));
		await this.applyChainAsync(ctx, monada);
		return Promise.resolve(monada.value(ctx));
	},
	/**
	 * Apply chain
	 */
	applyChain: function(ctx, monada)
	{
		for (var i = 0; i < this.chain.count(ctx); i++)
		{
			var item = this.chain.get(ctx, i);
			var f = item.get(ctx, "callback");
			monada.map(ctx, f, this.is_return_value);
		}
		return monada;
	},
	/**
	 * Apply async chain
	 */
	applyChainAsync: async function(ctx, monada)
	{
		for (var i = 0; i < this.chain.count(ctx); i++)
		{
			var item = this.chain.get(ctx, i);
			var f = item.get(ctx, "callback");
			await monada.mapAsync(ctx, f, this.is_return_value);
		}
		return Promise.resolve(monada);
	},
	_init: function(ctx)
	{
		use("Runtime.Callback").prototype._init.call(this,ctx);
		this.chain = use("Runtime.Vector").from([]);
		this.is_async = false;
		this.is_return_value = true;
	},
});
Object.assign(Runtime.Chain, use("Runtime.Callback"));
Object.assign(Runtime.Chain,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.Chain";
	},
	getParentClassName: function()
	{
		return "Runtime.Callback";
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
});use.add(Runtime.Chain);
module.exports = Runtime.Chain;