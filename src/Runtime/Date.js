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
Runtime.Date = function(ctx, data)
{
	if (data == undefined) data = null;
	use("Runtime.BaseObject").call(this, ctx);
	if (data != null)
	{
		if (data.has(ctx, "y"))
		{
			this.y = data.get(ctx, "y");
		}
		if (data.has(ctx, "m"))
		{
			this.m = data.get(ctx, "m");
		}
		if (data.has(ctx, "d"))
		{
			this.d = data.get(ctx, "d");
		}
	}
};
Runtime.Date.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.Date.prototype.constructor = Runtime.Date;
Object.assign(Runtime.Date.prototype,
{
	/**
	 * toMap
	 */
	toMap: function(ctx)
	{
		return use("Runtime.Map").from({"y":this.y,"m":this.m,"d":this.d});
	},
	/**
	 * Return date
	 * @return string
	 */
	getDate: function(ctx)
	{
		return this.y + use("Runtime.rtl").toStr("-") + use("Runtime.rtl").toStr(this.m) + use("Runtime.rtl").toStr("-") + use("Runtime.rtl").toStr(this.d);
	},
	/**
	 * Normalize date time
	 */
	normalize: function(ctx)
	{
		return this;
	},
	/**
	 * Return db datetime
	 * @return string
	 */
	toString: function(ctx)
	{
		return this.y + use("Runtime.rtl").toStr("-") + use("Runtime.rtl").toStr(this.m) + use("Runtime.rtl").toStr("-") + use("Runtime.rtl").toStr(this.d);
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.y = 0;
		this.m = 0;
		this.d = 0;
	},
});
Object.assign(Runtime.Date, use("Runtime.BaseObject"));
Object.assign(Runtime.Date,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.Date";
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
	__implements__:
	[
		use("Runtime.StringInterface"),
	],
});use.add(Runtime.Date);
module.exports = Runtime.Date;
Runtime.Date.prototype.toObject = function(ctx)
{
	var dt = new Date(this.y, this.m - 1, this.d);
	return dt;
}
Runtime.Date.fromObject = function(ctx, dt)
{
	var Dict = use("Runtime.Dict");
	var y = Number(dt.getFullYear());
	var m = Number(dt.getMonth()) + 1;
	var d = Number(dt.getDate());
	var dt = new Runtime.Date( ctx, Dict.from({"y":y,"m":m,"d":d}) );
	return dt;
}