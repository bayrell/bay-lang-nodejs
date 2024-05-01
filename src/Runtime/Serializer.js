"use strict;"
var use = require('bay-lang').use;
/*!
 *  Bayrell Runtime Library
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
Runtime.Serializer = function(ctx)
{
	use("Runtime.BaseObject").apply(this, arguments);
};
Runtime.Serializer.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.Serializer.prototype.constructor = Runtime.Serializer;
Object.assign(Runtime.Serializer.prototype,
{
	isImport: function(ctx)
	{
		return (this.flags & this.constructor.IMPORT) == this.constructor.IMPORT;
	},
	isExport: function(ctx)
	{
		return (this.flags & this.constructor.EXPORT) == this.constructor.EXPORT;
	},
	allowClassName: function(ctx)
	{
		return (this.flags & this.constructor.ALLOW_CLASS_NAME) == this.constructor.ALLOW_CLASS_NAME;
	},
	/**
	 * Set flag
	 */
	setFlag: function(ctx, flag)
	{
		this.flags = this.flags | flag;
	},
	/**
	 * Remove flag
	 */
	removeFlag: function(ctx, flag)
	{
		this.flags = this.flags & !flag;
	},
	/**
	 * Check flag
	 */
	hasFlag: function(ctx, flag)
	{
		return (this.flags & flag) == flag;
	},
	/**
	 * Set callback
	 */
	setCallback: function(ctx, value)
	{
		this.callback_name = value;
	},
	/**
	 * Process data
	 */
	process: function(ctx, object, field_name, data)
	{
		if (this.isImport(ctx))
		{
			this.import(ctx, object, field_name, data);
		}
		if (this.isExport(ctx))
		{
			this.export(ctx, object, field_name, data);
		}
	},
	/**
	 * Import data
	 */
	import: function(ctx, object, field_name, data)
	{
		var value = data.get(ctx, field_name);
		var old_value = this.constructor.getAttr(ctx, object, field_name);
		var new_value = this.importItem(ctx, old_value, value);
		this.constructor.setAttr(ctx, object, field_name, new_value);
	},
	/**
	 * New instance
	 */
	newInstance: function(ctx, class_name, value)
	{
		var __v0 = use("Runtime.rtl");
		return __v0.newInstance(ctx, class_name);
	},
	/**
	 * Import item
	 */
	importItem: function(ctx, old_value, value)
	{
		var __v0 = use("Runtime.rtl");
		if (__v0.isScalarValue(ctx, value))
		{
			return value;
		}
		var __v0 = use("Runtime.BaseStruct");
		if (value instanceof __v0)
		{
			return value;
		}
		var __v0 = use("Runtime.Date");
		if (value instanceof __v0)
		{
			return value;
		}
		var __v0 = use("Runtime.DateTime");
		if (value instanceof __v0)
		{
			return value;
		}
		var __v0 = use("Runtime.Dict");
		if (value instanceof __v0 && value.has(ctx, "__class_name__"))
		{
			var class_name = value.get(ctx, "__class_name__");
			var __v1 = use("Runtime.rtl");
			var __v2 = use("Runtime.rtl");
			var __v3 = use("Runtime.rtl");
			if (this.allowClassName(ctx) && __v1.exists(ctx, __v2.find_class(ctx, class_name)) && __v3.is_instanceof(ctx, class_name, "Runtime.BaseObject"))
			{
				var instance = null;
				var __v4 = use("Runtime.rtl");
				if (__v4.is_instanceof(ctx, old_value, class_name))
				{
					instance = old_value;
				}
				else
				{
					instance = this.newInstance(ctx, class_name, value);
				}
				var __v4 = use("Runtime.Callback");
				var callback = new __v4(ctx, instance, this.callback_name);
				if (callback.exists(ctx))
				{
					var __v5 = use("Runtime.rtl");
					__v5.apply(ctx, callback, use("Runtime.Vector").from([this,value]));
				}
				return instance;
			}
			return null;
		}
		var __v0 = use("Runtime.Dict");
		if (value instanceof __v0)
		{
			var new_value = use("Runtime.Map").from({});
			value.each(ctx, (ctx, item, key) => 
			{
				var old_item = this.constructor.getAttr(ctx, old_value, key);
				var new_item = this.importItem(ctx, old_item, item);
				new_value.set(ctx, key, new_item);
			});
			return new_value;
		}
		var __v0 = use("Runtime.Collection");
		if (value instanceof __v0)
		{
			var new_value = use("Runtime.Vector").from([]);
			for (var i = 0; i < value.count(ctx); i++)
			{
				var item = value.get(ctx, i);
				var __v1 = use("Runtime.Collection");
				var old_item = (old_value instanceof __v1) ? (old_value.get(ctx, i)) : (null);
				var new_item = this.importItem(ctx, old_item, item);
				new_value.push(ctx, new_item);
			}
			return new_value;
		}
		return null;
	},
	/**
	 * Export data
	 */
	export: function(ctx, object, field_name, data)
	{
		var old_value = this.constructor.getAttr(ctx, object, field_name);
		var new_value = this.exportItem(ctx, old_value);
		data.set(ctx, field_name, new_value);
	},
	/**
	 * Export item
	 */
	exportItem: function(ctx, value)
	{
		var __v0 = use("Runtime.rtl");
		if (__v0.isScalarValue(ctx, value))
		{
			return value;
		}
		var __v0 = use("Runtime.BaseStruct");
		if (value instanceof __v0)
		{
			return value;
		}
		var __v0 = use("Runtime.Date");
		if (value instanceof __v0)
		{
			return value;
		}
		var __v0 = use("Runtime.DateTime");
		if (value instanceof __v0)
		{
			return value;
		}
		var __v0 = use("Runtime.Dict");
		if (value instanceof __v0)
		{
			var new_value = use("Runtime.Map").from({});
			value.each(ctx, (ctx, item, key) => 
			{
				var new_item = this.exportItem(ctx, item);
				new_value.set(ctx, key, new_item);
			});
			return new_value;
		}
		var __v0 = use("Runtime.Collection");
		if (value instanceof __v0)
		{
			var new_value = use("Runtime.Vector").from([]);
			for (var i = 0; i < value.count(ctx); i++)
			{
				var item = value.get(ctx, i);
				var new_item = this.exportItem(ctx, item);
				new_value.push(ctx, new_item);
			}
			return new_value;
		}
		var __v0 = use("Runtime.BaseObject");
		if (value instanceof __v0)
		{
			var new_value = use("Runtime.Map").from({});
			if (this.allowClassName(ctx))
			{
				new_value.set(ctx, "__class_name__", value.constructor.getClassName(ctx));
			}
			var __v1 = use("Runtime.Callback");
			var callback = new __v1(ctx, value, this.callback_name);
			if (callback.exists(ctx))
			{
				var __v2 = use("Runtime.rtl");
				__v2.apply(ctx, callback, use("Runtime.Vector").from([this,new_value]));
			}
			return new_value;
		}
		return null;
	},
	/**
	 * Convert primitive data to native
	 */
	toNative: function(ctx, value)
	{
		var __v0 = use("Runtime.rtl");
		if (__v0.isScalarValue(ctx, value))
		{
			return value;
		}
		var allow_class_name = this.allowClassName(ctx);
		var _rtl = use("Runtime.rtl");
		var _BaseStruct = use("Runtime.BaseStruct");
		var _SerializeInterface = use("Runtime.SerializeInterface");
		var _Collection = use("Runtime.Collection");
		var _Date = use("Runtime.Date");
		var _DateTime = use("Runtime.DateTime");
		var _Dict = use("Runtime.Dict");
		
		if (value instanceof _Date)
		{
			value = value.toMap(ctx);
			if (allow_class_name) value.set(ctx, "__class_name__", "Runtime.Date");
		}
		else if (value instanceof _DateTime)
		{
			value = value.toMap(ctx);
			if (allow_class_name) value.set(ctx, "__class_name__", "Runtime.DateTime");
		}
		else if (value instanceof _BaseStruct)
		{
			let class_name = value.constructor.getClassName();
			value = value.toMap(ctx);
			if (allow_class_name) value.set(ctx, "__class_name__", class_name);
		}
		if (value instanceof _Collection)
		{
			value = value.cp(ctx);
			for(let i=0; i<value.length; i++)
			{
				value[i] = this.toNative(ctx, value[i], allow_class_name);
			}
			return value.cp(ctx);
		}
		if (value instanceof _Dict)
		{
			let res = {};
			value.each(
				(ctx, v, k) => {
					res[k] = this.toNative(ctx, v, allow_class_name);
				}
			);
			return res;
		}
		return value;
	},
	/**
	 * Convert native data to primitive
	 */
	toPrimitive: function(ctx, value)
	{
		var __v0 = use("Runtime.rtl");
		if (__v0.isScalarValue(ctx, value))
		{
			return value;
		}
		var allow_class_name = this.allowClassName(ctx);
		var _rtl = use("Runtime.rtl");
		var _Utils = use("Runtime.RuntimeUtils");
		var _Vector = use("Runtime.Vector");
		var _Date = use("Runtime.Date");
		var _DateTime = use("Runtime.DateTime");
		var _Map = use("Runtime.Map");
		
		/* Is native array */
		if (Array.isArray(value))
		{
			var new_value = _Vector.from(value);
			new_value = new_value.map(ctx, (ctx, val)=>{
				return this.toPrimitive(ctx, val);
			});
			return new_value;
		}
		
		/* Is native object */
		if (
			typeof value == 'object' &&
			!_rtl.is_instanceof(ctx, value, "Runtime.Map") &&
			!_rtl.is_instanceof(ctx, value, "Runtime.BaseObject")
		)
		{
			let class_name = value["__class_name__"];
			
			/* Convert value items */
			value = _Map.from(value);
			value = value.map(ctx, (ctx, val, key)=>{
				return this.toPrimitive(ctx, val);
			});
			
			/* Is date */
			if (class_name == "Runtime.Date")
			{
				return new _Date(ctx, value);
			}
			
			/* Is datetime */
			if (class_name == "Runtime.DateTime")
			{
				return new _DateTime(ctx, value);
			}
			
			/* Is struct */
			else if (
				allow_class_name &&
				_rtl.exists(ctx, _rtl.find_class(class_name)) &&
				_rtl.is_instanceof(ctx, class_name, "Runtime.BaseStruct")
			)
			{
				value.remove(ctx, "__class_name__");
				return _rtl.newInstance(ctx, class_name, new _Vector(ctx, value));
			}
			
			return value;
		}
		return value;
	},
	/**
	 * Json encode serializable values
	 * @param serializable value
	 * @param SerializeContainer container
	 * @return string 
	 */
	json_encode: function(ctx, value)
	{
		var _Utils = use("Runtime.RuntimeUtils");
		var _Collection = use("Runtime.Collection");
		var _Dict = use("Runtime.Dict");
		var _Date = use("Runtime.Date");
		var _DateTime = use("Runtime.DateTime");
		
		value = this.toNative(ctx, value);
		return JSON.stringify(value, (key, value) => {
			return value;
		});
	},
	/**
	 * Json decode to primitive values
	 * @param string s Encoded string
	 * @return var 
	 */
	json_decode: function(ctx, obj)
	{
		try{
			var _Serializer = use("Runtime.Serializer");
			var res = null;
			try
			{
				res = JSON.parse(obj, (key, value) => {
					if (value == null) return value;
					return this.toPrimitive(ctx, value);
				});
			}
			catch (e)
			{
				res = null;
			}
			return res;
		}
		catch(e){
			throw e;
		}
		return null;
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.flags = 1;
		this.callback_name = "";
	},
});
Object.assign(Runtime.Serializer, use("Runtime.BaseObject"));
Object.assign(Runtime.Serializer,
{
	ALLOW_CLASS_NAME: 1,
	EXPORT: 2,
	IMPORT: 4,
	JSON_PRETTY: 8,
	/**
	 * Get attr
	 */
	getAttr: function(ctx, object, field_name)
	{
		if (object == null)
		{
			return null;
		}
		return object[field_name];
		return null;
	},
	/**
	 * Set attr
	 */
	setAttr: function(ctx, object, field_name, value)
	{
		object[field_name] = value;
	},
	/**
	 * Copy object
	 */
	copy: function(ctx, obj)
	{
		var __v0 = use("Runtime.rtl");
		var serializer = __v0.newInstance(ctx, this.getClassName(ctx));
		return serializer.toPrimitive(ctx, serializer.toNative(ctx, obj));
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.Serializer";
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
});use.add(Runtime.Serializer);
module.exports = Runtime.Serializer;