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
Runtime.HashMap = function(ctx)
{
	this._map = new Map();
};
Object.assign(Runtime.HashMap.prototype,
{
	/**
	 * Set value size_to position
	 * @param Key key - position
	 * @param Value value 
	 * @return self
	 */
	set: function(ctx, key, value)
	{
		this._map.set(key, value);
		return this;
	},
	/**
	 * Returns value from position
	 * @param string key
	 * @return Value
	 */
	get: function(ctx, key)
	{
		return this._map.get(key);
		return this;
	},
	/**
	 * Return true if key exists
	 * @param string key
	 * @return bool var
	 */
	has: function(ctx, key)
	{
		return this._map.has(key);
	},
	/**
	 * Remove value from position
	 * @param string key
	 * @return self
	 */
	remove: function(ctx, key)
	{
		this._map.delete(key);
		return this;
	},
	_init: function(ctx)
	{
		this._map = null;
	},
});
Object.assign(Runtime.HashMap,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.HashMap";
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
});use.add(Runtime.HashMap);
module.exports = Runtime.HashMap;