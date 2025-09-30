"use strict;"
var use = require('bay-lang').use;
/*!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2020 "Ildar Bikmamatov" <support@bayrell.org>
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
Runtime.Monad = function(value, err)
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
	attr: function(attr_name)
	{
		if (this.val === null || this.err != null)
		{
			return this;
		}
		var __v0 = use("Runtime.Monad");
		var __v1 = use("Runtime.rtl");
		return new __v0(__v1.attr(this.val, attr_name, null));
	},
	/**
	 * Call function on value
	 */
	call: function(f)
	{
		if (this.val === null || this.err != null)
		{
			return this;
		}
		try
		{
			var __v0 = use("Runtime.rtl");
			this.val = __v0.apply(f, use("Runtime.Vector").from([this.val]));
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
	callAsync: async function(f)
	{
		if (this.val === null || this.err != null)
		{
			return Promise.resolve(this);
		}
		try
		{
			var __v0 = use("Runtime.rtl");
			this.val = await __v0.apply(f, use("Runtime.Vector").from([this.val]));
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
	 * Call method on value
	 */
	callMethod: function(method_name, args)
	{
		if (args == undefined) args = null;
		if (this.val === null || this.err != null)
		{
			return this;
		}
		try
		{
			var __v0 = use("Runtime.Callback");
			var f = new __v0(this.val, method_name);
			var __v1 = use("Runtime.rtl");
			this.val = __v1.apply(f, args);
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
	callMethodAsync: async function(method_name, args)
	{
		if (args == undefined) args = null;
		if (this.val === null || this.err != null)
		{
			return Promise.resolve(this);
		}
		try
		{
			var __v0 = use("Runtime.Callback");
			var f = new __v0(this.val, method_name);
			var __v1 = use("Runtime.rtl");
			this.val = await __v1.apply(f, args);
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
	monad: function(f)
	{
		var __v0 = use("Runtime.rtl");
		return __v0.apply(f, use("Runtime.Vector").from([this]));
	},
	/**
	 * Returns value
	 */
	value: function()
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
	_init: function()
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
});use.add(Runtime.Monad);
module.exports = Runtime.Monad;