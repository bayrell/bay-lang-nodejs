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
Runtime.Math = function()
{
};
Object.assign(Runtime.Math.prototype,
{
});
Object.assign(Runtime.Math,
{
	/**
	 * Round up
	 * @param double value
	 * @return int
	 */
	ceil: function(value)
	{
		return Math.ceil(value);
	},
	/**
	 * Round down
	 * @param double value
	 * @return int
	 */
	floor: function(value)
	{
		return Math.floor(value);
	},
	/**
	 * Round down
	 * @param double value
	 * @return int
	 */
	round: function(value)
	{
		return Math.round(value);
	},
	/**
	 * Returns abs
	 */
	abs: function(a)
	{
		if (a < 0)
		{
			return 0 - a;
		}
		else
		{
			return a;
		}
	},
	/**
	 * Returns max
	 */
	max: function(a, b)
	{
		if (a > b)
		{
			return a;
		}
		else
		{
			return b;
		}
	},
	/**
	 * Returns min
	 */
	min: function(a, b)
	{
		if (a < b)
		{
			return a;
		}
		else
		{
			return b;
		}
	},
	/**
	 * Returns random value x, where 0 <= x < 1
	 * @return double
	 */
	urandom: function()
	{
		if (
			window != undefined && window.crypto != undefined &&
			window.crypto.getRandomValues != undefined)
		{
			var s = new Uint32Array(1);
			window.crypto.getRandomValues(s);
			return s[0] / 4294967296;
		}
		
		return Math.random();
	},
	/**
	 * Returns random value x, where a <= x <= b
	 * @param int a
	 * @param int b
	 * @return int
	 */
	random: function(a, b)
	{
		return this.round(this.urandom() * (b - a) + a);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.Math";
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
});use.add(Runtime.Math);
module.exports = Runtime.Math;