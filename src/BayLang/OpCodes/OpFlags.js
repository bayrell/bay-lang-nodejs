"use strict;"
var use = require('bay-lang').use;
/*!
 *  Bayrell Language
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
if (typeof Bayrell == 'undefined') Bayrell = {};
if (typeof Bayrell.Lang == 'undefined') Bayrell.Lang = {};
if (typeof Bayrell.Lang.OpCodes == 'undefined') Bayrell.Lang.OpCodes = {};
Bayrell.Lang.OpCodes.OpFlags = function(ctx)
{
	use("Runtime.BaseStruct").apply(this, arguments);
};
Bayrell.Lang.OpCodes.OpFlags.prototype = Object.create(use("Runtime.BaseStruct").prototype);
Bayrell.Lang.OpCodes.OpFlags.prototype.constructor = Bayrell.Lang.OpCodes.OpFlags;
Object.assign(Bayrell.Lang.OpCodes.OpFlags.prototype,
{
	/**
	 * Read is Flag
	 */
	isFlag: function(ctx, name)
	{
		var __v0 = use("Bayrell.Lang.OpCodes.OpFlags");
		if (!__v0.hasFlag(ctx, name))
		{
			return false;
		}
		return this.takeValue(ctx, "p_" + use("Runtime.rtl").toStr(name));
	},
	_init: function(ctx)
	{
		use("Runtime.BaseStruct").prototype._init.call(this,ctx);
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
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "p_async")return this.p_async;
		else if (k == "p_export")return this.p_export;
		else if (k == "p_static")return this.p_static;
		else if (k == "p_const")return this.p_const;
		else if (k == "p_public")return this.p_public;
		else if (k == "p_private")return this.p_private;
		else if (k == "p_protected")return this.p_protected;
		else if (k == "p_declare")return this.p_declare;
		else if (k == "p_serializable")return this.p_serializable;
		else if (k == "p_cloneable")return this.p_cloneable;
		else if (k == "p_assignable")return this.p_assignable;
		else if (k == "p_memorize")return this.p_memorize;
		else if (k == "p_multiblock")return this.p_multiblock;
		else if (k == "p_lambda")return this.p_lambda;
		else if (k == "p_pure")return this.p_pure;
		else if (k == "p_props")return this.p_props;
		return use("Runtime.BaseStruct").prototype.takeValue.call(this,ctx,k,d);
	},
});
Object.assign(Bayrell.Lang.OpCodes.OpFlags, use("Runtime.BaseStruct"));
Object.assign(Bayrell.Lang.OpCodes.OpFlags,
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
		return "Bayrell.Lang.OpCodes";
	},
	getClassName: function()
	{
		return "Bayrell.Lang.OpCodes.OpFlags";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseStruct";
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
		a.push("p_async");
		a.push("p_export");
		a.push("p_static");
		a.push("p_const");
		a.push("p_public");
		a.push("p_private");
		a.push("p_protected");
		a.push("p_declare");
		a.push("p_serializable");
		a.push("p_cloneable");
		a.push("p_assignable");
		a.push("p_memorize");
		a.push("p_multiblock");
		a.push("p_lambda");
		a.push("p_pure");
		a.push("p_props");
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
});use.add(Bayrell.Lang.OpCodes.OpFlags);
module.exports = Bayrell.Lang.OpCodes.OpFlags;