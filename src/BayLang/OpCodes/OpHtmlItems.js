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
BayLang.OpCodes.OpHtmlItems = function(ctx)
{
	use("BayLang.OpCodes.BaseOpCode").apply(this, arguments);
};
BayLang.OpCodes.OpHtmlItems.prototype = Object.create(use("BayLang.OpCodes.BaseOpCode").prototype);
BayLang.OpCodes.OpHtmlItems.prototype.constructor = BayLang.OpCodes.OpHtmlItems;
Object.assign(BayLang.OpCodes.OpHtmlItems.prototype,
{
	/**
	 * Serialize object
	 */
	serialize: function(ctx, serializer, data)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype.serialize.call(this, ctx, serializer, data);
		serializer.process(ctx, this, "items", data);
	},
	/**
	 * Find op_code position
	 */
	find: function(ctx, op_code)
	{
		return (op_code) ? (this.items.indexOf(ctx, op_code)) : (-1);
	},
	/**
	 * Add op_code
	 */
	addItem: function(ctx, op_code, dest, kind)
	{
		if (dest == undefined) dest = null;
		if (kind == undefined) kind = "after";
		if (this.items == null)
		{
			this.items = use("Runtime.Vector").from([]);
		}
		var pos = -1;
		if (dest != null)
		{
			pos = this.find(ctx, dest);
		}
		if (pos >= 0)
		{
			if (kind == "before")
			{
				this.items.insert(ctx, pos, op_code);
			}
			else
			{
				this.items.insert(ctx, pos + 1, op_code);
			}
		}
		else
		{
			if (kind == "before")
			{
				this.items.prepend(ctx, op_code);
			}
			else
			{
				this.items.push(ctx, op_code);
			}
		}
		return op_code;
	},
	/**
	 * Remove op_code
	 */
	removeItem: function(ctx, op_code)
	{
		var pos = this.find(ctx, op_code);
		this.items.remove(ctx, pos);
	},
	_init: function(ctx)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype._init.call(this,ctx);
		this.op = "op_html";
		this.items = use("Runtime.Vector").from([]);
	},
});
Object.assign(BayLang.OpCodes.OpHtmlItems, use("BayLang.OpCodes.BaseOpCode"));
Object.assign(BayLang.OpCodes.OpHtmlItems,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.OpCodes";
	},
	getClassName: function()
	{
		return "BayLang.OpCodes.OpHtmlItems";
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
});use.add(BayLang.OpCodes.OpHtmlItems);
module.exports = BayLang.OpCodes.OpHtmlItems;