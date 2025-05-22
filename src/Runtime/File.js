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
Runtime.File = function(ctx, params)
{
	use("Runtime.BaseObject").call(this, ctx);
	this._assign_values(ctx, params);
};
Runtime.File.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.File.prototype.constructor = Runtime.File;
Object.assign(Runtime.File.prototype,
{
	/**
	 * Returns file name
	 */
	getName: function(ctx)
	{
		return this.name;
	},
	/**
	 * Returns file path
	 */
	getPath: function(ctx)
	{
		return this.path;
	},
	/**
	 * Returns file size
	 */
	getSize: function(ctx)
	{
		return this.size;
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.name = "";
		this.path = "";
		this.size = 0;
	},
});
Object.assign(Runtime.File, use("Runtime.BaseObject"));
Object.assign(Runtime.File,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.File";
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
});use.add(Runtime.File);
module.exports = Runtime.File;