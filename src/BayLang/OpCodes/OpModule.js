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
BayLang.OpCodes.OpModule = function(ctx)
{
	use("BayLang.OpCodes.BaseOpCode").apply(this, arguments);
};
BayLang.OpCodes.OpModule.prototype = Object.create(use("BayLang.OpCodes.BaseOpCode").prototype);
BayLang.OpCodes.OpModule.prototype.constructor = BayLang.OpCodes.OpModule;
Object.assign(BayLang.OpCodes.OpModule.prototype,
{
	/**
	 * Serialize object
	 */
	serialize: function(ctx, serializer, data)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype.serialize.call(this, ctx, serializer, data);
		serializer.process(ctx, this, "is_component", data);
		serializer.process(ctx, this, "items", data);
		serializer.process(ctx, this, "uses", data);
	},
	/**
	 * Add module
	 */
	addModule: function(ctx, class_name, alias_name)
	{
		if (this.uses.has(ctx, alias_name))
		{
			var __v0 = use("Runtime.Exceptions.RuntimeException");
			throw new __v0(ctx, alias_name + use("Runtime.rtl").toStr(" already exists"))
		}
		this.uses.set(ctx, alias_name, class_name);
		/* Add op_code */
		var __v0 = use("Runtime.lib");
		var pos = this.items.find(ctx, __v0.isInstance(ctx, "BayLang.OpCodes.OpNamespace"));
		var __v1 = use("BayLang.OpCodes.OpUse");
		var op_code = new __v1(ctx, use("Runtime.Map").from({"alias":alias_name,"name":class_name}));
		if (pos != -1)
		{
			pos = pos + 1;
			while (pos < this.items.count(ctx))
			{
				var item = this.items.get(ctx, pos);
				if (item == null)
				{
					break;
				}
				var __v2 = use("BayLang.OpCodes.OpUse");
				if (!(item instanceof __v2))
				{
					break;
				}
				var __v2 = use("Runtime.rs");
				if (__v2.compare(ctx, class_name, item.name) == -1)
				{
					break;
				}
				pos = pos + 1;
			}
			this.items.insert(ctx, pos, op_code);
		}
		else
		{
			this.items.prepend(ctx, op_code);
		}
	},
	/**
	 * Has module
	 */
	hasModule: function(ctx, alias_name)
	{
		return this.uses.has(ctx, alias_name);
	},
	/**
	 * Find module
	 */
	findModule: function(ctx, class_name)
	{
		var keys = this.uses.keys(ctx);
		for (var i = 0; i < keys.count(ctx); i++)
		{
			var key_name = keys.get(ctx, i);
			if (this.uses.get(ctx, key_name) == class_name)
			{
				return key_name;
			}
		}
		return null;
	},
	/**
	 * Find class
	 */
	findClass: function(ctx)
	{
		var __v0 = use("Runtime.lib");
		return (this.items) ? (this.items.findItem(ctx, __v0.isInstance(ctx, "BayLang.OpCodes.OpDeclareClass"))) : (null);
	},
	/**
	 * Find class by name
	 */
	findClassByName: function(ctx, name)
	{
		return this.items.findItem(ctx, (ctx, item) =>
		{
			var __v0 = use("BayLang.OpCodes.OpDeclareClass");
			if (!(item instanceof __v0))
			{
				return false;
			}
			if (item.name == name)
			{
				return false;
			}
			return true;
		});
	},
	_init: function(ctx)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype._init.call(this,ctx);
		this.uses = null;
		this.items = null;
		this.is_component = false;
	},
});
Object.assign(BayLang.OpCodes.OpModule, use("BayLang.OpCodes.BaseOpCode"));
Object.assign(BayLang.OpCodes.OpModule,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.OpCodes";
	},
	getClassName: function()
	{
		return "BayLang.OpCodes.OpModule";
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
});use.add(BayLang.OpCodes.OpModule);
module.exports = BayLang.OpCodes.OpModule;