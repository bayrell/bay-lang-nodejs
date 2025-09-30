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
Runtime.BaseProvider = function(params)
{
	if (params == undefined) params = null;
	use("Runtime.BaseObject").call(this);
	this.params = (params != null) ? (params.toDict()) : (null);
};
Runtime.BaseProvider.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.BaseProvider.prototype.constructor = Runtime.BaseProvider;
Object.assign(Runtime.BaseProvider.prototype,
{
	/**
	 * Returns true if started
	 */
	isStarted: function()
	{
		return this.started;
	},
	/**
	 * Return param
	 */
	getParam: function(param_name, def_value)
	{
		if (this.param == null)
		{
			return def_value;
		}
		if (this.param.has(param_name))
		{
			return def_value;
		}
		return this.param.get(param_name);
	},
	/**
	 * Init provider
	 */
	init: async function()
	{
	},
	/**
	 * Start provider
	 */
	start: async function()
	{
		this.started = true;
	},
	_init: function()
	{
		use("Runtime.BaseObject").prototype._init.call(this);
		this.started = false;
		this.params = null;
	},
});
Object.assign(Runtime.BaseProvider, use("Runtime.BaseObject"));
Object.assign(Runtime.BaseProvider,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.BaseProvider";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
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
});use.add(Runtime.BaseProvider);
module.exports = Runtime.BaseProvider;