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
if (typeof Runtime.Exceptions == 'undefined') Runtime.Exceptions = {};
Runtime.Exceptions.IndexOutOfRange = function(pos, prev)
{
	if (prev == undefined) prev = null;
	var __v0 = use("Runtime.rtl");
	use("Runtime.Exceptions.AbstractException").call(this.constructor.translate("Runtime", "Index out of range. Pos: %pos%", use("Runtime.Map").from({"pos":pos})), __v0.ERROR_INDEX_OUT_OF_RANGE, prev);
};
Runtime.Exceptions.IndexOutOfRange.prototype = Object.create(use("Runtime.Exceptions.AbstractException").prototype);
Runtime.Exceptions.IndexOutOfRange.prototype.constructor = Runtime.Exceptions.IndexOutOfRange;
Object.assign(Runtime.Exceptions.IndexOutOfRange.prototype,
{
});
Object.assign(Runtime.Exceptions.IndexOutOfRange, use("Runtime.Exceptions.AbstractException"));
Object.assign(Runtime.Exceptions.IndexOutOfRange,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime.Exceptions";
	},
	getClassName: function()
	{
		return "Runtime.Exceptions.IndexOutOfRange";
	},
	getParentClassName: function()
	{
		return "Runtime.Exceptions.AbstractException";
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
});use.add(Runtime.Exceptions.IndexOutOfRange);
module.exports = Runtime.Exceptions.IndexOutOfRange;