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
if (typeof BayLang == 'undefined') BayLang = {};
BayLang.BuilderOpCode = function(ctx)
{
	use("Runtime.BaseObject").apply(this, arguments);
};
BayLang.BuilderOpCode.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.BuilderOpCode.prototype.constructor = BayLang.BuilderOpCode;
Object.assign(BayLang.BuilderOpCode.prototype,
{
	/**
	 * Add slot
	 */
	addSlot: function(ctx, op_code, name)
	{
		var __v0 = use("BayLang.OpCodes.OpHtmlSlot");
		var __v1 = use("BayLang.OpCodes.OpHtmlItems");
		var slot = new __v0(ctx, use("Runtime.Map").from({"name":name,"items":new __v1(ctx)}));
		op_code.items.items.push(ctx, slot);
		return slot;
	},
	/**
	 * Add tag
	 */
	addTag: function(ctx, op_code, name)
	{
		var __v0 = use("BayLang.OpCodes.OpHtmlTag");
		var __v1 = use("BayLang.OpCodes.OpHtmlItems");
		var tag = new __v0(ctx, use("Runtime.Map").from({"attrs":use("Runtime.Vector").from([]),"items":new __v1(ctx),"tag_name":name}));
		op_code.items.items.push(ctx, tag);
		return tag;
	},
});
Object.assign(BayLang.BuilderOpCode, use("Runtime.BaseObject"));
Object.assign(BayLang.BuilderOpCode,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang";
	},
	getClassName: function()
	{
		return "BayLang.BuilderOpCode";
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
});use.add(BayLang.BuilderOpCode);
module.exports = BayLang.BuilderOpCode;