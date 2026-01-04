"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
/*!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2025 "Ildar Bikmamatov" <support@bayrell.org>
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
if (typeof Runtime.Serializer == 'undefined') Runtime.Serializer = {};
Runtime.Serializer.MapType = class extends use("Runtime.BaseObject")
{
	/**
	 * Fields
	 */
	constructor(params)
	{
		const rtl = use("rtl");
		const Vector = use("Runtime.Vector");
		const Map = use("Runtime.Map");
		if (params == undefined) params = null;
		super();
		if (rtl.isImplements(params, "Runtime.Serializer.BaseType")) this.fields = Vector.create([params]);
		else if (params instanceof Vector) this.fields = params;
		else if (params instanceof Map) this.items = params;
	}
	
	
	/**
	 * Add type
	 */
	addType(key, rule)
	{
		const Vector = use("Runtime.Vector");
		if (!this.items.has(key)) this.items.set(key, Vector.create([]));
		let items = this.items.get(key);
		items.push(rule);
	}
	
	
	/**
	 * Returns rules
	 */
	getRules(field_name)
	{
		const Vector = use("Runtime.Vector");
		if (this.items && this.items.has(field_name))
		{
			let fields = this.items.get(field_name);
			if (!(fields instanceof Vector)) fields = Vector.create([fields]);
			return fields;
		}
		if (this.fields) return this.fields;
		return null;
	}
	
	
	/**
	 * Returns keys
	 */
	keys(value){ if (value == undefined) value = null;return rtl.list((this.fields && value) ? value.keys() : this.items.keys()); }
	
	
	/**
	 * Walk fields
	 */
	walk(value, errors, f)
	{
		const Map = use("Runtime.Map");
		const rtl = use("rtl");
		const Vector = use("Runtime.Vector");
		const TypeError = use("Runtime.Serializer.TypeError");
		let new_value = new Map();
		let keys = this.keys(value);
		for (let i = 0; i < keys.count(); i++)
		{
			let key = keys.get(i);
			let item_value = null;
			if (rtl.isImplements(value, "Runtime.SerializeInterface")) item_value = rtl.attr(value, key);
			else if (value instanceof Map) item_value = value.get(key);
			let fields = this.getRules(key);
			let item_errors = Vector.create([]);
			if (fields)
			{
				for (let j = 0; j < fields.count(); j++)
				{
					let item = fields.get(j);
					if (rtl.isImplements(item, "Runtime.Serializer.BaseType"))
					{
						item_value = f(item, item_value, item_errors, key);
					}
				}
			}
			new_value.set(key, item_value);
			errors.appendItems(item_errors);
			TypeError.addFieldErrors(item_errors, key);
		}
		return new_value;
	}
	
	
	/**
	 * Filter type
	 */
	filter(value, errors, old_value, prev)
	{
		const Map = use("Runtime.Map");
		if (old_value == undefined) old_value = null;
		if (prev == undefined) prev = null;
		if (!(value instanceof Map)) return null;
		let new_value = this.walk(value, errors, (rule, item_value, item_errors, key) =>
		{
			return rule.filter(item_value, item_errors, old_value ? old_value.get(key) : null, prev);
		});
		return new_value;
	}
	
	
	/**
	 * Serialize
	 */
	encode(value)
	{
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		if (!(value instanceof Map)) return null;
		let errors = Vector.create([]);
		let new_value = this.walk(value, errors, (rule, item_value, item_errors) =>
		{
			return rule.encode(item_value);
		});
		return new_value;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Map = use("Runtime.Map");
		this.fields = null;
		this.items = new Map();
	}
	static getClassName(){ return "Runtime.Serializer.MapType"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return ["Runtime.Serializer.BaseType"]; }
};
use.add(Runtime.Serializer.MapType);
module.exports = {
	"MapType": Runtime.Serializer.MapType,
};