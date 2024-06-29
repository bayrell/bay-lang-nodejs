"use strict;"
var use = require('bay-lang').use;
/*!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2018 "Ildar Bikmamatov" <support@bayrell.org>
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
if (typeof BayLang == 'undefined') BayLang = {};
if (typeof BayLang.OpCodes == 'undefined') BayLang.OpCodes = {};
BayLang.OpCodes.OpFlags = function(ctx, params)
{
	if (params == undefined) params = null;
	use("Runtime.BaseObject").call(this, ctx);
	this._assign_values(ctx, params);
};
BayLang.OpCodes.OpFlags.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.OpCodes.OpFlags.prototype.constructor = BayLang.OpCodes.OpFlags;
Object.assign(BayLang.OpCodes.OpFlags.prototype,
{
	/**
	 * Serialize object
	 */
	serialize: function(ctx, serializer, data)
	{
		serializer.process(ctx, this, "p_assignable", data);
		serializer.process(ctx, this, "p_async", data);
		serializer.process(ctx, this, "p_cloneable", data);
		serializer.process(ctx, this, "p_const", data);
		serializer.process(ctx, this, "p_declare", data);
		serializer.process(ctx, this, "p_export", data);
		serializer.process(ctx, this, "p_lambda", data);
		serializer.process(ctx, this, "p_memorize", data);
		serializer.process(ctx, this, "p_multiblock", data);
		serializer.process(ctx, this, "p_private", data);
		serializer.process(ctx, this, "p_props", data);
		serializer.process(ctx, this, "p_protected", data);
		serializer.process(ctx, this, "p_public", data);
		serializer.process(ctx, this, "p_pure", data);
		serializer.process(ctx, this, "p_serializable", data);
		serializer.process(ctx, this, "p_static", data);
	},
	/**
	 * Read is Flag
	 */
	isFlag: function(ctx, name)
	{
		var __v0 = use("BayLang.OpCodes.OpFlags");
		if (!__v0.hasFlag(ctx, name))
		{
			return false;
		}
		var __v0 = use("Runtime.rtl");
		return __v0.attr(ctx, this, "p_" + use("Runtime.rtl").toStr(name));
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.p_async = false;
		this.p_export = false;
		this.p_static = false;
		this.p_const = false;
		this.p_public = false;
		this.p_private = false;
		this.p_protected = false;
		this.p_declare = false;
		this.p_serializable = false;
		this.p_cloneable = false;
		this.p_assignable = false;
		this.p_memorize = false;
		this.p_multiblock = false;
		this.p_lambda = false;
		this.p_pure = false;
		this.p_props = false;
	},
});
Object.assign(BayLang.OpCodes.OpFlags, use("Runtime.BaseObject"));
Object.assign(BayLang.OpCodes.OpFlags,
{
	/**
	 * Get flags
	 */
	getFlags: function(ctx)
	{
		return use("Runtime.Vector").from(["async","export","static","const","public","private","declare","protected","serializable","cloneable","assignable","memorize","multiblock","pure","props"]);
	},
	/**
	 * Get flags
	 */
	hasFlag: function(ctx, flag_name)
	{
		if (flag_name == "async" || flag_name == "export" || flag_name == "static" || flag_name == "const" || flag_name == "public" || flag_name == "private" || flag_name == "declare" || flag_name == "protected" || flag_name == "serializable" || flag_name == "cloneable" || flag_name == "assignable" || flag_name == "memorize" || flag_name == "multiblock" || flag_name == "lambda" || flag_name == "pure" || flag_name == "props")
		{
			return true;
		}
		return false;
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.OpCodes";
	},
	getClassName: function()
	{
		return "BayLang.OpCodes.OpFlags";
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
		use("Runtime.SerializeInterface"),
	],
});use.add(BayLang.OpCodes.OpFlags);
module.exports = BayLang.OpCodes.OpFlags;