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
BayLang.OpCodes.OpHtmlTag = function(ctx)
{
	use("BayLang.OpCodes.BaseOpCode").apply(this, arguments);
};
BayLang.OpCodes.OpHtmlTag.prototype = Object.create(use("BayLang.OpCodes.BaseOpCode").prototype);
BayLang.OpCodes.OpHtmlTag.prototype.constructor = BayLang.OpCodes.OpHtmlTag;
Object.assign(BayLang.OpCodes.OpHtmlTag.prototype,
{
	/**
	 * Serialize object
	 */
	serialize: function(ctx, serializer, data)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype.serialize.call(this, ctx, serializer, data);
		serializer.process(ctx, this, "attrs", data);
		serializer.process(ctx, this, "items", data);
		serializer.process(ctx, this, "op_code_name", data);
		serializer.process(ctx, this, "spreads", data);
		serializer.process(ctx, this, "tag_name", data);
	},
	_init: function(ctx)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype._init.call(this,ctx);
		this.op = "op_html_tag";
		this.tag_name = "";
		this.op_code_name = null;
		this.attrs = null;
		this.spreads = null;
		this.items = null;
	},
});
Object.assign(BayLang.OpCodes.OpHtmlTag, use("BayLang.OpCodes.BaseOpCode"));
Object.assign(BayLang.OpCodes.OpHtmlTag,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.OpCodes";
	},
	getClassName: function()
	{
		return "BayLang.OpCodes.OpHtmlTag";
	},
	getParentClassName: function()
	{
		return "BayLang.OpCodes.BaseOpCode";
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
});use.add(BayLang.OpCodes.OpHtmlTag);
module.exports = BayLang.OpCodes.OpHtmlTag;