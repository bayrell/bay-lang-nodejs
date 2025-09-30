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
Runtime.SerializerNative = function()
{
	use("Runtime.Serializer").apply(this, arguments);
};
Runtime.SerializerNative.prototype = Object.create(use("Runtime.Serializer").prototype);
Runtime.SerializerNative.prototype.constructor = Runtime.SerializerNative;
Object.assign(Runtime.SerializerNative.prototype,
{
	/**
	 * Decode item
	 */
	decodeItem: function(value, object_value, create)
	{
		if (object_value == undefined) object_value = null;
		if (create == undefined) create = null;
		if (value === null)
		{
			return null;
		}
		var __v0 = use("Runtime.BaseObject");
		if (value instanceof __v0)
		{
			return value;
		}
		/* Is native array */
		if (Array.isArray(value))
		{
			var _Vector = use("Runtime.Vector");
			value = _Vector.from(value);
		}
		
		else if (typeof value == 'object')
		{
			var _Map = use("Runtime.Map");
			value = _Map.from(value);
		}
		value = use("Runtime.Serializer").prototype.decodeItem.call(this, value, object_value, create);
		return value;
	},
	/**
	 * Encode item
	 */
	encodeItem: function(encode_value)
	{
		if (encode_value === null)
		{
			return null;
		}
		var value = use("Runtime.Serializer").prototype.encodeItem.call(this, encode_value);
		var __v0 = use("Runtime.Collection");
		if (value instanceof __v0)
		{
			return value.toArray();
		}
		var __v0 = use("Runtime.Dict");
		if (value instanceof __v0)
		{
			return value.toObject();
		}
		return value;
	},
});
Object.assign(Runtime.SerializerNative, use("Runtime.Serializer"));
Object.assign(Runtime.SerializerNative,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.SerializerNative";
	},
	getParentClassName: function()
	{
		return "Runtime.Serializer";
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
});use.add(Runtime.SerializerNative);
module.exports = Runtime.SerializerNative;