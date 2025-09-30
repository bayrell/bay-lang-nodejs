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
if (typeof Runtime == 'undefined') Runtime = {};

Runtime._Map = function(map)
{
	this._map = {};
	if (map != undefined && typeof map == 'object')
	{
		if (map instanceof Runtime.Dict)
		{
			for (var i in map._map)
			{
				this._map[i] = map._map[i];
			}
		}
		else if (typeof map == "object" && !(map instanceof Runtime._Collection))
		{
			for (var i in map)
			{
				this._map["|" + i] = map[i];
			}
		}
	}
	this.__uq__ = Symbol();
	return this;
}
/*Runtime._Map.prototype = Object.create(Map.prototype);
Runtime._Map.prototype.constructor = Runtime._Map;*/
Object.assign(Runtime._Map.prototype,
{
	toStr: function(value)
	{ 
		return use("Runtime.rtl").toStr(value);
	},
	toObject: function()
	{
		var obj = {};
		for (var key in this._map)
		{
			obj[key.substring(1)] = this._map[key];
		}
		return obj;
	},
});
Object.assign(Runtime._Map,
{
	from: function(map)
	{
		var res = this.Instance(map);
		return res;
	},
	getNamespace: function(){ return "Runtime"; },
	getClassName: function(){ return "Runtime._Map"; },
	getParentClassName: function(){ return ""; },
});
Runtime._Map.from = function(map)
{
	var res = this.Instance(map, map);
	return res;
};
use.add(Runtime._Map);
Runtime.Dict = function()
{
	use("Runtime._Map").apply(this, arguments);
};
Runtime.Dict.prototype = Object.create(use("Runtime._Map").prototype);
Runtime.Dict.prototype.constructor = Runtime.Dict;
Object.assign(Runtime.Dict.prototype,
{
	/**
	 * Copy instance
	 */
	cp: function()
	{
		var new_obj = this.constructor.Instance();
		new_obj._map = Object.assign({}, this._map);
		return new_obj;
	},
	copy: function(obj)
	{
		if (obj == undefined) obj = null;
		return (obj == null) ? (this.cp()) : (this.clone(obj));
	},
	/**
	 * Clone Dict
	 * @param int pos - position
	 */
	clone: function(obj)
	{
		if (obj == undefined) obj = null;
		if (obj == null)
		{
			var __v0 = use("Runtime.Map");
			if (this instanceof __v0)
			{
				return this.cp();
			}
			return this;
		}
		var new_obj = this.constructor.Instance();
		new_obj._map = Object.assign({}, this._map);
		if (obj != null)
		{
			var _Dict = use("Runtime.Dict");
			if (obj instanceof _Dict) 
			{
				obj = obj._map;
				for (var key in obj)
				{
					new_obj._map[key] = obj[key];
				}
			}
			else
			{
				for (var key in obj)
				{
					new_obj._map["|" + key] = obj[key];
				}
			}
		}
		return new_obj;
	},
	/**
	 * Convert to dict
	 */
	toDict: function()
	{
		var Dict = use ("Runtime.Dict");
		return new Dict(this);
	},
	/**
	 * Convert to dict
	 */
	toMap: function()
	{
		var Map = use ("Runtime.Map");
		return new Map(this);
	},
	/**
	 * Return true if key exists
	 * @param string key
	 * @return bool var
	 */
	contains: function(key)
	{
		key = this.toStr(key);
		return typeof this._map["|" + key] != "undefined";
	},
	/**
	 * Return true if key exists
	 * @param string key
	 * @return bool var
	 */
	has: function(key)
	{
		return this.contains(key);
	},
	/**
	 * Returns value from position
	 * @param string key
	 * @param T default_value
	 * @return T
	 */
	get: function(key, default_value)
	{
		if (default_value == undefined) default_value = null;
		key = this.toStr(key);
		var val = this._map["|" + key];
		if (typeof val == "undefined") return default_value;
		return val;
	},
	/**
	 * Returns value from position. Throw exception, if position does not exists
	 * @param string key - position
	 * @return T
	 */
	item: function(key)
	{
		key = this.toStr(key);
		if (typeof this._map["|" + key] == "undefined")
		{
			var _KeyNotFound = use("Runtime.Exceptions.KeyNotFound");
			throw new _KeyNotFound(key);
		}
		var val = this._map["|" + key];
		if (val === null || typeof val == "undefined") return null;
		return val;
	},
	/**
	 * Set value size_to position
	 * @param string key - position
	 * @param T value 
	 * @return self
	 */
	setIm: function(key, value)
	{
		var res = this.cp();
		key = this.toStr(key);
		res._map["|" + key] = value;
		return res;
	},
	/**
	 * Remove value from position
	 * @param string key
	 * @return self
	 */
	removeIm: function(key)
	{
		key = this.toStr(key);
		if (typeof this._map["|" + key] != "undefined")
		{
			var res = this.cp();
			delete res._map["|" + key];
			return res;
		}
		return this;
	},
	/**
	 * Returns vector of the keys
	 * @return Collection<string>
	 */
	keys: function()
	{
		var res = new Runtime.Vector();
		for (var key in this._map) res.push(key.substring(1));
		return res;
	},
	/**
	 * Returns vector of the values
	 * @return Collection<T>
	 */
	values: function()
	{
		var res = new Runtime.Vector();
		for (var key in this._map) res.push(this._map[key]);
		return res;
	},
	/**
	 * Call function map
	 * @param fn f
	 * @return Dict
	 */
	map: function(f)
	{
		var obj = this.constructor.Instance();
		for (var key in this._map)
		{
			var new_key = key.substring(1);
			var new_val = Runtime.rtl.apply(f, [this._map[key], new_key]);
			obj._map[key] = new_val;
		}
		return obj;
	},
	/**
	 * Filter items
	 * @param fn f
	 * @return Collection
	 */
	filter: function(f)
	{
		var obj = this.constructor.Instance();
		for (var key in this._map)
		{
			var new_key = key.substring(1);
			var value = this._map[key];
			var flag = Runtime.rtl.apply(f, [value, new_key]);
			if (flag) obj._map[key] = value;
		}
		return obj;
	},
	/**
	 * Call function for each item
	 * @param fn f
	 */
	each: function(f)
	{
		for (var key in this._map)
		{
			var new_key = key.substring(1);
			var value = this._map[key];
			f(value, new_key);
		}
	},
	/**
	 * Transition Dict to Vector
	 * @param fn f
	 * @return Vector
	 */
	transition: function(f)
	{
		var Vector = use("Runtime.Vector");
		var arr = new Vector();
		for (var key in this._map)
		{
			var new_value = f(this._map[key], key.substring(1));
			Array.prototype.push.call(arr, new_value);
		}
		return arr;
	},
	/**
	 * 	
	 * @param fn f
	 * @param var init_value
	 * @return init_value
	 */
	reduce: function(f, init_value)
	{
		for (var key in this._map)
		{
			init_value = Runtime.rtl.apply(f, [init_value, this._map[key], key.substring(1)]);
		}
		return init_value;
	},
	/**
	 * Clone this struct with fields
	 * @param Collection fields = null
	 * @return BaseStruct
	 */
	intersect: function(fields, skip_empty)
	{
		if (fields == undefined) fields = null;
		if (skip_empty == undefined) skip_empty = true;
		if (fields == null)
		{
			return use("Runtime.Map").from({});
		}
		var __v0 = use("Runtime.Map");
		var obj = new __v0();
		fields.each((field_name) =>
		{
			if (!this.has(field_name) && skip_empty)
			{
				return ;
			}
			obj.set(field_name, this.get(field_name, null));
		});
		var __v1 = use("Runtime.Map");
		if (this instanceof __v1)
		{
			return obj;
		}
		return obj.toDict();
	},
	/**
	 * Add values from other map
	 * @param Dict<T> map
	 * @return self
	 */
	concat: function(map)
	{
		if (map == undefined) map = null;
		if (map == null)
		{
			return this;
		}
		var _map = {};
		var f = false;
		var Dict = use("Runtime.Dict");
		if (map == null) return this.cp();
		if (map instanceof Dict) _map = map._map;
		else if (typeof map == "object") { _map = map; f = true; }
		var res = this.cp();
		for (var key in _map)
		{
			res._map[(f ? "|" : "") + key] = _map[key];
		}
		return res;
	},
	/**
	 * Check equal
	 */
	equal: function(item)
	{
		if (item == null)
		{
			return false;
		}
		var __v0 = use("Runtime.Collection");
		var keys = (new __v0()).concat(this.keys()).concat(item.keys()).removeDuplicatesIm();
		for (var i = 0; i < keys.count(); i++)
		{
			var key = Runtime.rtl.attr(keys, i);
			if (!this.has(key))
			{
				return false;
			}
			if (!item.has(key))
			{
				return false;
			}
			if (this.get(key) != item.get(key))
			{
				return false;
			}
		}
		return true;
	},
});
Object.assign(Runtime.Dict, use("Runtime._Map"));
Object.assign(Runtime.Dict,
{
	/**
	 * Returns new Instance
	 * @return Object
	 */
	Instance: function(val)
	{
		if (val == undefined) val = null;
		var __v0 = use("Runtime.Dict");
		return new __v0(val);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.Dict";
	},
	getParentClassName: function()
	{
		return "Runtime._Map";
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
});use.add(Runtime.Dict);
module.exports = Runtime.Dict;