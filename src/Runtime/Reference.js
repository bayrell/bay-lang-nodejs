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
Runtime.Reference = function(ctx, ref)
{
	if (ref == undefined) ref = null;
	use("Runtime.BaseObject").call(this, ctx);
	this.ref = ref;
};
Runtime.Reference.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.Reference.prototype.constructor = Runtime.Reference;
Object.assign(Runtime.Reference.prototype,
{
	/**
	 * Returns value
	 */
	setValue: function(ctx, new_value)
	{
		this.ref = new_value;
	},
	/**
	 * Returns value
	 */
	value: function(ctx)
	{
		return this.ref;
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		var __v0 = use("Runtime.rtl");
		this.uq = __v0.unique(ctx);
		this.ref = null;
	},
});
Object.assign(Runtime.Reference, use("Runtime.BaseObject"));
Object.assign(Runtime.Reference,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.Reference";
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
});use.add(Runtime.Reference);
module.exports = Runtime.Reference;