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
Runtime.Serializer = function(ctx)
{
	use("Runtime.BaseObject").apply(this, arguments);
};
Runtime.Serializer.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.Serializer.prototype.constructor = Runtime.Serializer;
Object.assign(Runtime.Serializer.prototype,
{
	allowObjects: function(ctx)
	{
		return (this.flags & this.constructor.ALLOW_OBJECTS) == this.constructor.ALLOW_OBJECTS;
	},
	isDecode: function(ctx)
	{
		return (this.flags & this.constructor.DECODE) == this.constructor.DECODE;
	},
	isEncode: function(ctx)
	{
		return (this.flags & this.constructor.ENCODE) == this.constructor.ENCODE;
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
		this.flags = this.flags & ~flag;
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
	 * Serialize item
	 */
	process: function(ctx, object, field_name, data, create)
	{
		if (create == undefined) create = null;
		if (this.isDecode(ctx))
		{
			var value = data.get(ctx, field_name);
			var object_value = this.constructor.getAttr(ctx, object, field_name);
			var new_value = this.decodeItem(ctx, value, object_value, create);
			this.constructor.setAttr(ctx, object, field_name, new_value);
		}
		else if (this.isEncode(ctx))
		{
			var value = this.constructor.getAttr(ctx, object, field_name);
			var new_value = this.encodeItem(ctx, value);
			data.set(ctx, field_name, new_value);
		}
	},
	/**
	 * Process items
	 */
	processItems: function(ctx, object, field_name, data, create)
	{
		if (create == undefined) create = null;
		if (this.isDecode(ctx))
		{
			var value = data.get(ctx, field_name);
			var object_value = this.constructor.getAttr(ctx, object, field_name);
			var new_value = this.decodeItems(ctx, value, object_value, create);
			this.constructor.setAttr(ctx, object, field_name, new_value);
		}
		if (this.isEncode(ctx))
		{
			var value = this.constructor.getAttr(ctx, object, field_name);
			var new_value = this.encodeItem(ctx, value);
			data.set(ctx, field_name, new_value);
		}
	},
	/**
	 * Decode collection
	 */
	decodeCollection: function(ctx, value, object_value, create)
	{
		if (object_value == undefined) object_value = null;
		if (create == undefined) create = null;
		var new_value = use("Runtime.Vector").from([]);
		for (var i = 0; i < value.count(ctx); i++)
		{
			var item = value.get(ctx, i);
			var __v0 = use("Runtime.Collection");
			var old_item = (object_value instanceof __v0) ? (object_value.get(ctx, i)) : (null);
			var new_item = this.decodeItem(ctx, item, old_item, create);
			new_value.push(ctx, new_item);
		}
		return new_value;
	},
	/**
	 * Decode dict
	 */
	decodeDict: function(ctx, value, object_value, create)
	{
		if (object_value == undefined) object_value = null;
		if (create == undefined) create = null;
		var new_value = use("Runtime.Map").from({});
		var keys = value.keys(ctx);
		for (var i = 0; i < keys.count(ctx); i++)
		{
			var key = keys.get(ctx, i);
			var item = value.get(ctx, key);
			var old_item = this.constructor.getAttr(ctx, object_value, key);
			var new_item = this.decodeItem(ctx, item, old_item, create);
			new_value.set(ctx, key, new_item);
		}
		return new_value;
	},
	/**
	 * Create object
	 */
	createObject: function(ctx, value, object_value, create)
	{
		if (object_value == undefined) object_value = null;
		if (create == undefined) create = null;
		var class_name = value.get(ctx, "__class_name__");
		/* Create instance */
		var instance = object_value;
		if (object_value != null)
		{
			instance = object_value;
		}
		else if (create != null)
		{
			instance = create(ctx, this, value);
		}
		else
		{
			var __v0 = use("Runtime.rtl");
			instance = __v0.newInstance(ctx, class_name);
		}
		/* If instance is null */
		if (instance == null)
		{
			return null;
		}
		/* Get callback */
		var callback = null;
		if (this.callback_name != null)
		{
			var __v0 = use("Runtime.Callback");
			var callback = new __v0(ctx, instance, this.callback_name);
			if (callback.exists(ctx))
			{
				callback = null;
			}
		}
		/* Apply object serialize */
		var __v1 = use("Runtime.SerializeInterface");
		if (callback)
		{
			var __v0 = use("Runtime.rtl");
			__v0.apply(ctx, callback, use("Runtime.Vector").from([this,value]));
		}
		else if (Runtime.rtl.is_implements(instance, __v1))
		{
			instance.serialize(ctx, this, value);
		}
		/* Return instance */
		return instance;
	},
	/**
	 * Decode object
	 */
	decodeObject: function(ctx, value, object_value, create)
	{
		if (object_value == undefined) object_value = null;
		if (create == undefined) create = null;
		/* Convert to Dict if objects is not allowed */
		if (!this.allowObjects(ctx))
		{
			return this.decodeDict(ctx, value);
		}
		/* Create object by create */
		if (create != null)
		{
			return this.createObject(ctx, value, object_value, create);
		}
		/* Convert Dict if does not has class name */
		if (!value.has(ctx, "__class_name__"))
		{
			return this.decodeDict(ctx, value);
		}
		var class_name = value.get(ctx, "__class_name__");
		/* Is date */
		if (class_name == "Runtime.Date")
		{
			var __v0 = use("Runtime.Date");
			return new __v0(ctx, value);
		}
		else if (class_name == "Runtime.DateTime")
		{
			var __v1 = use("Runtime.DateTime");
			return new __v1(ctx, value);
		}
		/* Struct */
		var __v0 = use("Runtime.rtl");
		if (__v0.is_instanceof(ctx, class_name, "Runtime.BaseStruct"))
		{
			value.remove(ctx, "__class_name__");
			value = this.decodeDict(ctx, value);
			var __v1 = use("Runtime.rtl");
			var object = __v1.newInstance(ctx, class_name, use("Runtime.Vector").from([value]));
			return object;
		}
		/* Create object by class name */
		var __v0 = use("Runtime.rtl");
		var __v1 = use("Runtime.rtl");
		var __v2 = use("Runtime.rtl");
		if (__v0.exists(ctx, __v1.find_class(ctx, class_name)) && __v2.is_instanceof(ctx, class_name, "Runtime.BaseObject"))
		{
			return this.createObject(ctx, value, object_value, create);
		}
		return this.decodeDict(ctx, value);
	},
	/**
	 * Decode item from primitive data
	 */
	decodeItem: function(ctx, value, object_value, create)
	{
		if (object_value == undefined) object_value = null;
		if (create == undefined) create = null;
		if (value === null)
		{
			return null;
		}
		var __v0 = use("Runtime.rtl");
		if (__v0.isScalarValue(ctx, value))
		{
			return value;
		}
		var __v0 = use("Runtime.BaseObject");
		if (value instanceof __v0)
		{
			return value;
		}
		/* Decode object */
		var __v0 = use("Runtime.Dict");
		if (this.allowObjects(ctx) && value instanceof __v0 && (value.has(ctx, "__class_name__") || create))
		{
			return this.decodeObject(ctx, value, object_value, create);
		}
		return this.decodeItems(ctx, value, object_value);
	},
	/**
	 * Decode items
	 */
	decodeItems: function(ctx, value, object_value, create)
	{
		if (object_value == undefined) object_value = null;
		if (create == undefined) create = null;
		/* Decode Collection */
		var __v0 = use("Runtime.Collection");
		var __v1 = use("Runtime.Dict");
		if (value instanceof __v0)
		{
			return this.decodeCollection(ctx, value, object_value, create);
		}
		else if (value instanceof __v1)
		{
			return this.decodeDict(ctx, value, object_value, create);
		}
		return null;
	},
	/**
	 * Encode object
	 */
	encodeObject: function(ctx, value)
	{
		var new_value = null;
		/* Get new value */
		var __v0 = use("Runtime.BaseStruct");
		if (value instanceof __v0)
		{
			new_value = value.toMap(ctx);
		}
		else
		{
			new_value = use("Runtime.Map").from({});
		}
		/* Add class_name */
		if (this.allowObjects(ctx))
		{
			new_value.set(ctx, "__class_name__", value.constructor.getClassName(ctx));
		}
		/* Get callback */
		var callback = null;
		if (this.callback_name != null)
		{
			var __v0 = use("Runtime.Callback");
			var callback = new __v0(ctx, value, this.callback_name);
			if (callback.exists(ctx))
			{
				callback = null;
			}
		}
		/* Apply object serialize */
		var __v1 = use("Runtime.SerializeInterface");
		if (callback)
		{
			var __v0 = use("Runtime.rtl");
			__v0.apply(ctx, callback, use("Runtime.Vector").from([this,new_value]));
		}
		else if (Runtime.rtl.is_implements(value, __v1))
		{
			value.serialize(ctx, this, new_value);
		}
		return new_value;
	},
	/**
	 * Encode date
	 */
	encodeDate: function(ctx, value)
	{
		value = value.toMap(ctx);
		if (this.allowObjects(ctx))
		{
			value.set(ctx, "__class_name__", "Runtime.Date");
		}
		return value;
	},
	/**
	 * Encode date time
	 */
	encodeDateTime: function(ctx, value)
	{
		value = value.toMap(ctx);
		if (this.allowObjects(ctx))
		{
			value.set(ctx, "__class_name__", "Runtime.DateTime");
		}
		return value;
	},
	/**
	 * Encode collection
	 */
	encodeCollection: function(ctx, value)
	{
		var new_value = use("Runtime.Vector").from([]);
		for (var i = 0; i < value.count(ctx); i++)
		{
			var item = value.get(ctx, i);
			var new_item = this.encodeItem(ctx, item);
			new_value.push(ctx, new_item);
		}
		return new_value;
	},
	/**
	 * Encode dict
	 */
	encodeDict: function(ctx, value)
	{
		var new_value = use("Runtime.Map").from({});
		value.each(ctx, (ctx, item, key) =>
		{
			var new_item = this.encodeItem(ctx, item);
			new_value.set(ctx, key, new_item);
		});
		return new_value;
	},
	/**
	 * Encode item to primitive data
	 */
	encodeItem: function(ctx, value)
	{
		if (value === null)
		{
			return null;
		}
		var __v0 = use("Runtime.rtl");
		if (__v0.isScalarValue(ctx, value))
		{
			return value;
		}
		/* Encode Collection or Dict */
		var __v0 = use("Runtime.Collection");
		if (value instanceof __v0)
		{
			return this.encodeCollection(ctx, value);
		}
		var __v0 = use("Runtime.Dict");
		if (value instanceof __v0)
		{
			return this.encodeDict(ctx, value);
		}
		/* Encode Object */
		var __v0 = use("Runtime.Date");
		var __v1 = use("Runtime.DateTime");
		var __v2 = use("Runtime.BaseObject");
		if (value instanceof __v0)
		{
			return this.encodeDate(ctx, value);
		}
		else if (value instanceof __v1)
		{
			return this.encodeDateTime(ctx, value);
		}
		else if (value instanceof __v2)
		{
			return this.encodeObject(ctx, value);
		}
		return null;
	},
	/**
	 * Export object to data
	 */
	encode: function(ctx, object)
	{
		this.setFlag(ctx, this.constructor.ENCODE);
		var res = this.encodeItem(ctx, object);
		this.removeFlag(ctx, this.constructor.ENCODE);
		return res;
	},
	/**
	 * Import from object
	 */
	decode: function(ctx, object)
	{
		this.setFlag(ctx, this.constructor.DECODE);
		var res = this.decodeItem(ctx, object);
		this.removeFlag(ctx, this.constructor.DECODE);
		return res;
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.flags = 0;
		this.callback_name = null;
	},
});
Object.assign(Runtime.Serializer, use("Runtime.BaseObject"));
Object.assign(Runtime.Serializer,
{
	ALLOW_OBJECTS: 1,
	ENCODE: 2,
	DECODE: 4,
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
		return field_name in object ? object[field_name] : null;
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
		serializer.setFlag(ctx, this.ALLOW_OBJECTS);
		var encoded = serializer.encode(ctx, obj);
		return serializer.decode(ctx, encoded);
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