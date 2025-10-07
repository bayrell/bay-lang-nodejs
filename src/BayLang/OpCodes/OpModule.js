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
if (typeof BayLang.OpCodes == 'undefined') BayLang.OpCodes = {};
BayLang.OpCodes.OpModule = function()
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
	serialize: function(serializer, data)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype.serialize.call(this, serializer, data);
		serializer.process(this, "is_component", data);
		serializer.process(this, "items", data);
		serializer.process(this, "uses", data);
	},
	/**
	 * Add module
	 */
	addModule: function(class_name, alias_name, is_component)
	{
		if (alias_name == undefined) alias_name = "";
		if (is_component == undefined) is_component = true;
		if (alias_name != "")
		{
			this.uses.set(alias_name, class_name);
		}
		/* Add op_code */
		var __v0 = use("Runtime.lib");
		var pos = this.items.find(__v0.isInstance("BayLang.OpCodes.OpNamespace"));
		var __v1 = use("BayLang.OpCodes.OpUse");
		var op_code = new __v1(use("Runtime.Map").from({"alias":alias_name,"name":class_name,"is_component":is_component}));
		if (pos != -1)
		{
			pos = pos + 1;
			while (pos < this.items.count())
			{
				var item = this.items.get(pos);
				if (item == null)
				{
					break;
				}
				var __v2 = use("BayLang.OpCodes.OpUse");
				if (!(item instanceof __v2))
				{
					break;
				}
				var __v3 = use("Runtime.rs");
				if (__v3.compare(class_name, item.name) == -1)
				{
					break;
				}
				pos = pos + 1;
			}
			this.items.insert(pos, op_code);
		}
		else
		{
			this.items.prepend(op_code);
		}
	},
	/**
	 * Has module
	 */
	hasModule: function(alias_name)
	{
		return this.uses.has(alias_name);
	},
	/**
	 * Find alias name
	 */
	findModule: function(class_name)
	{
		var keys = this.uses.keys();
		for (var i = 0; i < keys.count(); i++)
		{
			var key_name = keys.get(i);
			if (this.uses.get(key_name) == class_name)
			{
				return key_name;
			}
		}
		return null;
	},
	/**
	 * Find class
	 */
	findClass: function()
	{
		var __v0 = use("Runtime.lib");
		return (this.items) ? (this.items.findItem(__v0.isInstance("BayLang.OpCodes.OpDeclareClass"))) : (null);
	},
	/**
	 * Find class by name
	 */
	findClassByName: function(name)
	{
		return this.items.findItem((item) =>
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
	_init: function()
	{
		use("BayLang.OpCodes.BaseOpCode").prototype._init.call(this);
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
	getClassInfo: function()
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function()
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function()
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(field_name)
	{
		return null;
	},
});use.add(BayLang.OpCodes.OpModule);
module.exports = BayLang.OpCodes.OpModule;