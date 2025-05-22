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
Runtime.Monad = function(ctx, value, err)
{
	if (err == undefined) err = null;
	this.val = value;
	this.err = err;
};
Object.assign(Runtime.Monad.prototype,
{
	/**
	 * Return attr of object
	 */
	attr: function(ctx, attr_name)
	{
		if (this.val === null || this.err != null)
		{
			return this;
		}
		var __v0 = use("Runtime.Monad");
		var __v1 = use("Runtime.rtl");
		return new __v0(ctx, __v1.attr(ctx, this.val, attr_name, null));
	},
	/**
	 * Call function on value
	 */
	call: function(ctx, f, is_return_value)
	{
		if (is_return_value == undefined) is_return_value = true;
		if (this.val === null || this.err != null)
		{
			return this;
		}
		try
		{
			var __v0 = use("Runtime.rtl");
			var value = __v0.apply(ctx, f, use("Runtime.Vector").from([this.val]));
			if (is_return_value)
			{
				this.val = value;
			}
		}
		catch (_ex)
		{
			if (true)
			{
				var e = _ex;
				
				this.res = null;
				this.err = e;
			}
			else
			{
				throw _ex;
			}
		}
		return this;
	},
	/**
	 * Call async function on value
	 */
	callAsync: async function(ctx, f, is_return_value)
	{
		if (is_return_value == undefined) is_return_value = true;
		if (this.val === null || this.err != null)
		{
			return Promise.resolve(this);
		}
		try
		{
			var __v0 = use("Runtime.rtl");
			var value = __v0.apply(ctx, f, use("Runtime.Vector").from([this.val]));
			var __v1 = use("Runtime.rtl");
			if (__v1.isPromise(ctx, value))
			{
				var __v2 = use("Runtime.rtl");
				await __v2.resolvePromise(ctx, value);
			}
			if (is_return_value)
			{
				this.val = value;
			}
		}
		catch (_ex)
		{
			if (true)
			{
				var e = _ex;
				
				this.val = null;
				this.err = e;
			}
			else
			{
				throw _ex;
			}
		}
		return Promise.resolve(this);
	},
	/**
	 * Call function on value
	 */
	map: function(ctx, f, is_return)
	{
		if (is_return == undefined) is_return = true;
		return this.call(ctx, f, is_return);
	},
	/**
	 * Call function on value
	 */
	mapAsync: async function(ctx, f, is_return)
	{
		if (is_return == undefined) is_return = true;
		return Promise.resolve(await this.callAsync(ctx, f, is_return));
	},
	/**
	 * Call method on value
	 */
	callMethod: function(ctx, method_name, args)
	{
		if (args == undefined) args = null;
		if (this.val === null || this.err != null)
		{
			return this;
		}
		try
		{
			var __v0 = use("Runtime.Callback");
			var f = new __v0(ctx, this.val, method_name);
			var __v1 = use("Runtime.rtl");
			this.val = __v1.apply(ctx, f, args);
		}
		catch (_ex)
		{
			if (true)
			{
				var e = _ex;
				
				this.val = null;
				this.err = e;
			}
			else
			{
				throw _ex;
			}
		}
		return this;
	},
	/**
	 * Call async method on value
	 */
	callMethodAsync: async function(ctx, method_name, args)
	{
		if (args == undefined) args = null;
		if (this.val === null || this.err != null)
		{
			return Promise.resolve(this);
		}
		try
		{
			var __v0 = use("Runtime.Callback");
			var f = new __v0(ctx, this.val, method_name);
			var __v1 = use("Runtime.rtl");
			this.val = await __v1.apply(ctx, f, args);
		}
		catch (_ex)
		{
			if (true)
			{
				var e = _ex;
				
				this.val = null;
				this.err = e;
			}
			else
			{
				throw _ex;
			}
		}
		return Promise.resolve(this);
	},
	/**
	 * Call function on monad
	 */
	monad: function(ctx, f)
	{
		var __v0 = use("Runtime.rtl");
		return __v0.apply(ctx, f, use("Runtime.Vector").from([this]));
	},
	/**
	 * Returns value
	 */
	value: function(ctx)
	{
		if (this.err != null)
		{
			throw this.err
		}
		if (this.val === null || this.err != null)
		{
			return null;
		}
		return this.val;
	},
	_init: function(ctx)
	{
		this.val = null;
		this.err = null;
	},
});
Object.assign(Runtime.Monad,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.Monad";
	},
	getParentClassName: function()
	{
		return "";
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
});use.add(Runtime.Monad);
module.exports = Runtime.Monad;