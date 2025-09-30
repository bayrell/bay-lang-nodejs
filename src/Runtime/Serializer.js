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
Runtime.Serializer = function()
{
	use("Runtime.BaseObject").apply(this, arguments);
};
Runtime.Serializer.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.Serializer.prototype.constructor = Runtime.Serializer;
Object.assign(Runtime.Serializer.prototype,
{
	allowObjects: function()
	{
		return (this.flags & this.constructor.ALLOW_OBJECTS) == this.constructor.ALLOW_OBJECTS;
	},
	isDecode: function()
	{
		return (this.flags & this.constructor.DECODE) == this.constructor.DECODE;
	},
	isEncode: function()
	{
		return (this.flags & this.constructor.ENCODE) == this.constructor.ENCODE;
	},
	/**
	 * Set flag
	 */
	setFlag: function(flag)
	{
		this.flags = this.flags | flag;
	},
	/**
	 * Remove flag
	 */
	removeFlag: function(flag)
	{
		this.flags = this.flags & ~flag;
	},
	/**
	 * Check flag
	 */
	hasFlag: function(flag)
	{
		return (this.flags & flag) == flag;
	},
	/**
	 * Set callback
	 */
	setCallback: function(value)
	{
		this.callback_name = value;
	},
	/**
	 * Serialize item
	 */
	process: function(object, field_name, data, create)
	{
		if (create == undefined) create = null;
		if (this.isDecode())
		{
			var value = data.get(field_name);
			var object_value = this.constructor.getAttr(object, field_name);
			var new_value = this.decodeItem(value, object_value, create);
			this.constructor.setAttr(object, field_name, new_value);
		}
		else if (this.isEncode())
		{
			var value = this.constructor.getAttr(object, field_name);
			var new_value = this.encodeItem(value);
			data.set(field_name, new_value);
		}
	},
	/**
	 * Process items
	 */
	processItems: function(object, field_name, data, create)
	{
		if (create == undefined) create = null;
		if (this.isDecode())
		{
			var value = data.get(field_name);
			var object_value = this.constructor.getAttr(object, field_name);
			var new_value = this.decodeItems(value, object_value, create);
			this.constructor.setAttr(object, field_name, new_value);
		}
		if (this.isEncode())
		{
			var value = this.constructor.getAttr(object, field_name);
			var new_value = this.encodeItem(value);
			data.set(field_name, new_value);
		}
	},
	/**
	 * Decode collection
	 */
	decodeCollection: function(value, object_value, create)
	{
		if (object_value == undefined) object_value = null;
		if (create == undefined) create = null;
		var new_value = use("Runtime.Vector").from([]);
		for (var i = 0; i < value.count(); i++)
		{
			var item = value.get(i);
			var __v0 = use("Runtime.Collection");
			var old_item = (object_value instanceof __v0) ? (object_value.get(i)) : (null);
			var new_item = this.decodeItem(item, old_item, create);
			new_value.push(new_item);
		}
		return new_value;
	},
	/**
	 * Decode dict
	 */
	decodeDict: function(value, object_value, create)
	{
		if (object_value == undefined) object_value = null;
		if (create == undefined) create = null;
		var new_value = use("Runtime.Map").from({});
		var keys = value.keys();
		for (var i = 0; i < keys.count(); i++)
		{
			var key = keys.get(i);
			var item = value.get(key);
			var old_item = this.constructor.getAttr(object_value, key);
			var new_item = this.decodeItem(item, old_item, create);
			new_value.set(key, new_item);
		}
		return new_value;
	},
	/**
	 * Create object
	 */
	createObject: function(value, object_value, create)
	{
		if (object_value == undefined) object_value = null;
		if (create == undefined) create = null;
		var class_name = value.get("__class_name__");
		/* Create instance */
		var instance = object_value;
		if (object_value != null)
		{
			instance = object_value;
		}
		else if (create != null)
		{
			instance = create(this, value);
		}
		else
		{
			var __v0 = use("Runtime.rtl");
			instance = __v0.newInstance(class_name);
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
			var callback = new __v0(instance, this.callback_name);
			if (callback.exists())
			{
				callback = null;
			}
		}
		/* Apply object serialize */
		var __v1 = use("Runtime.SerializeInterface");
		if (callback)
		{
			var __v0 = use("Runtime.rtl");
			__v0.apply(callback, use("Runtime.Vector").from([this,value]));
		}
		else if (Runtime.rtl.is_implements(instance, __v1))
		{
			instance.serialize(this, value);
		}
		/* Return instance */
		return instance;
	},
	/**
	 * Decode object
	 */
	decodeObject: function(value, object_value, create)
	{
		if (object_value == undefined) object_value = null;
		if (create == undefined) create = null;
		/* Convert to Dict if objects is not allowed */
		if (!this.allowObjects())
		{
			return this.decodeDict(value);
		}
		/* Create object by create */
		if (create != null)
		{
			return this.createObject(value, object_value, create);
		}
		/* Convert Dict if does not has class name */
		if (!value.has("__class_name__"))
		{
			return this.decodeDict(value);
		}
		var class_name = value.get("__class_name__");
		/* Is date */
		if (class_name == "Runtime.Date")
		{
			var __v0 = use("Runtime.Date");
			return new __v0(value);
		}
		else if (class_name == "Runtime.DateTime")
		{
			var __v1 = use("Runtime.DateTime");
			return new __v1(value);
		}
		/* Struct */
		var __v0 = use("Runtime.rtl");
		if (__v0.is_instanceof(class_name, "Runtime.BaseStruct"))
		{
			value.remove("__class_name__");
			value = this.decodeDict(value);
			var __v1 = use("Runtime.rtl");
			var object = __v1.newInstance(class_name, use("Runtime.Vector").from([value]));
			return object;
		}
		/* Create object by class name */
		var __v0 = use("Runtime.rtl");
		var __v1 = use("Runtime.rtl");
		var __v2 = use("Runtime.rtl");
		if (__v0.exists(__v1.find_class(class_name)) && __v2.is_instanceof(class_name, "Runtime.BaseObject"))
		{
			return this.createObject(value, object_value, create);
		}
		return this.decodeDict(value);
	},
	/**
	 * Decode item from primitive data
	 */
	decodeItem: function(value, object_value, create)
	{
		if (object_value == undefined) object_value = null;
		if (create == undefined) create = null;
		if (value === null)
		{
			return null;
		}
		var __v0 = use("Runtime.rtl");
		if (__v0.isScalarValue(value))
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
		if (this.allowObjects() && value instanceof __v0 && (value.has("__class_name__") || create))
		{
			return this.decodeObject(value, object_value, create);
		}
		return this.decodeItems(value, object_value);
	},
	/**
	 * Decode items
	 */
	decodeItems: function(value, object_value, create)
	{
		if (object_value == undefined) object_value = null;
		if (create == undefined) create = null;
		/* Decode Collection */
		var __v0 = use("Runtime.Collection");
		var __v1 = use("Runtime.Dict");
		if (value instanceof __v0)
		{
			return this.decodeCollection(value, object_value, create);
		}
		else if (value instanceof __v1)
		{
			return this.decodeDict(value, object_value, create);
		}
		return null;
	},
	/**
	 * Encode object
	 */
	encodeObject: function(value)
	{
		var new_value = null;
		/* Get new value */
		var __v0 = use("Runtime.BaseStruct");
		if (value instanceof __v0)
		{
			new_value = value.toMap();
		}
		else
		{
			new_value = use("Runtime.Map").from({});
		}
		/* Add class_name */
		if (this.allowObjects())
		{
			new_value.set("__class_name__", value.constructor.getClassName());
		}
		/* Get callback */
		var callback = null;
		if (this.callback_name != null)
		{
			var __v0 = use("Runtime.Callback");
			var callback = new __v0(value, this.callback_name);
			if (callback.exists())
			{
				callback = null;
			}
		}
		/* Apply object serialize */
		var __v1 = use("Runtime.SerializeInterface");
		if (callback)
		{
			var __v0 = use("Runtime.rtl");
			__v0.apply(callback, use("Runtime.Vector").from([this,new_value]));
		}
		else if (Runtime.rtl.is_implements(value, __v1))
		{
			value.serialize(this, new_value);
		}
		return new_value;
	},
	/**
	 * Encode date
	 */
	encodeDate: function(value)
	{
		value = value.toMap();
		if (this.allowObjects())
		{
			value.set("__class_name__", "Runtime.Date");
		}
		return value;
	},
	/**
	 * Encode date time
	 */
	encodeDateTime: function(value)
	{
		value = value.toMap();
		if (this.allowObjects())
		{
			value.set("__class_name__", "Runtime.DateTime");
		}
		return value;
	},
	/**
	 * Encode collection
	 */
	encodeCollection: function(value)
	{
		var new_value = use("Runtime.Vector").from([]);
		for (var i = 0; i < value.count(); i++)
		{
			var item = value.get(i);
			var new_item = this.encodeItem(item);
			new_value.push(new_item);
		}
		return new_value;
	},
	/**
	 * Encode dict
	 */
	encodeDict: function(value)
	{
		var new_value = use("Runtime.Map").from({});
		value.each((item, key) =>
		{
			var new_item = this.encodeItem(item);
			new_value.set(key, new_item);
		});
		return new_value;
	},
	/**
	 * Encode item to primitive data
	 */
	encodeItem: function(value)
	{
		if (value === null)
		{
			return null;
		}
		var __v0 = use("Runtime.rtl");
		if (__v0.isScalarValue(value))
		{
			return value;
		}
		/* Encode Collection or Dict */
		var __v0 = use("Runtime.Collection");
		if (value instanceof __v0)
		{
			return this.encodeCollection(value);
		}
		var __v0 = use("Runtime.Dict");
		if (value instanceof __v0)
		{
			return this.encodeDict(value);
		}
		/* Encode Object */
		var __v0 = use("Runtime.Date");
		var __v1 = use("Runtime.DateTime");
		var __v2 = use("Runtime.BaseObject");
		if (value instanceof __v0)
		{
			return this.encodeDate(value);
		}
		else if (value instanceof __v1)
		{
			return this.encodeDateTime(value);
		}
		else if (value instanceof __v2)
		{
			return this.encodeObject(value);
		}
		return null;
	},
	/**
	 * Export object to data
	 */
	encode: function(object)
	{
		this.setFlag(this.constructor.ENCODE);
		var res = this.encodeItem(object);
		this.removeFlag(this.constructor.ENCODE);
		return res;
	},
	/**
	 * Import from object
	 */
	decode: function(object)
	{
		this.setFlag(this.constructor.DECODE);
		var res = this.decodeItem(object);
		this.removeFlag(this.constructor.DECODE);
		return res;
	},
	_init: function()
	{
		use("Runtime.BaseObject").prototype._init.call(this);
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
	getAttr: function(object, field_name)
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
	setAttr: function(object, field_name, value)
	{
		object[field_name] = value;
	},
	/**
	 * Copy object
	 */
	copy: function(obj)
	{
		var __v0 = use("Runtime.rtl");
		var serializer = __v0.newInstance(this.getClassName());
		serializer.setFlag(this.ALLOW_OBJECTS);
		var encoded = serializer.encode(obj);
		return serializer.decode(encoded);
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
});use.add(Runtime.Serializer);
module.exports = Runtime.Serializer;