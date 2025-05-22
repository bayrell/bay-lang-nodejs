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
Runtime.Exceptions.ItemNotFound = function(ctx, object, name, prev)
{
	if (object == undefined) object = "Item";
	if (name == undefined) name = "";
	if (prev == undefined) prev = null;
	var message = "";
	if (name != "")
	{
		var __v0 = use("Runtime.rs");
		message = __v0.format(ctx, "%object% '%name%' not found", use("Runtime.Map").from({"name":name,"object":object}));
	}
	else
	{
		var __v1 = use("Runtime.rs");
		message = __v1.format(ctx, "%object% not found", use("Runtime.Map").from({"object":object}));
	}
	var __v0 = use("Runtime.rtl");
	use("Runtime.Exceptions.AbstractException").call(this, ctx, message, __v0.ERROR_ITEM_NOT_FOUND, prev);
};
Runtime.Exceptions.ItemNotFound.prototype = Object.create(use("Runtime.Exceptions.AbstractException").prototype);
Runtime.Exceptions.ItemNotFound.prototype.constructor = Runtime.Exceptions.ItemNotFound;
Object.assign(Runtime.Exceptions.ItemNotFound.prototype,
{
});
Object.assign(Runtime.Exceptions.ItemNotFound, use("Runtime.Exceptions.AbstractException"));
Object.assign(Runtime.Exceptions.ItemNotFound,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime.Exceptions";
	},
	getClassName: function()
	{
		return "Runtime.Exceptions.ItemNotFound";
	},
	getParentClassName: function()
	{
		return "Runtime.Exceptions.AbstractException";
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
});use.add(Runtime.Exceptions.ItemNotFound);
module.exports = Runtime.Exceptions.ItemNotFound;