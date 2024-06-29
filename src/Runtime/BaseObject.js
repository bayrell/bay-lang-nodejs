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
Runtime.BaseObject = function(ctx)
{
	/* Init object */
	this._init(ctx);
};
Object.assign(Runtime.BaseObject.prototype,
{
	/**
	 * Init function
	 */
	_init: function(ctx)
	{
	},
	/**
	 * Init struct data
	 */
	_changes: function(ctx, changes)
	{
	},
	/**
	 * Assign new values
	 */
	_assign_values: function(ctx, changes)
	{
		if (changes == undefined) changes = null;
		if (typeof changes == 'object' && !(changes instanceof Runtime.Dict))
		{
			changes = new Runtime.Map(ctx, changes);
		}
		if (changes == null)
		{
			return ;
		}
		if (changes.keys(ctx).count(ctx) == 0)
		{
			return ;
		}
		var __v0 = use("Runtime.Map");
		if (!(changes instanceof __v0))
		{
			changes = changes.toMap(ctx);
		}
		this._changes(ctx, changes);
		var _Dict = use("Runtime.Dict");
		var rtl = use("Runtime.rtl");
		if (changes instanceof _Dict) changes = changes.toObject();
		for (var key in changes)
		{
			var value = changes[key];
			this[key] = value;
		}
	},
});
Object.assign(Runtime.BaseObject,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.BaseObject";
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
});use.add(Runtime.BaseObject);
module.exports = Runtime.BaseObject;