"use strict;"
const use = require('bay-lang').use;
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
Runtime.Serializer.VectorType = class extends use("Runtime.BaseObject")
{
	/**
	 * Create object
	 */
	constructor(fields)
	{
		const rtl = use("rtl");
		const Vector = use("Runtime.Vector");
		super();
		if (rtl.isImplements(fields, "Runtime.Serializer.BaseType")) this.fields = Vector.create([fields]);
		else if (fields instanceof Vector) this.fields = fields;
	}
	
	
	/**
	 * Walk item
	 */
	walk(value, errors, f)
	{
		const Vector = use("Runtime.Vector");
		const rtl = use("rtl");
		const TypeError = use("Runtime.Serializer.TypeError");
		let new_value = Vector.create([]);
		for (let i = 0; i < value.count(); i++)
		{
			let item_errors = Vector.create([]);
			let new_item = value.get(i);
			for (let j = 0; j < this.fields.count(); j++)
			{
				let field = this.fields.get(j);
				if (rtl.isImplements(field, "Runtime.Serializer.BaseType"))
				{
					new_item = f(field, new_item, item_errors, i);
				}
			}
			new_value.push(new_item);
			TypeError.addFieldErrors(item_errors, i);
			errors.appendItems(item_errors);
		}
		return new_value;
	}
	
	
	/**
	 * Filter value
	 */
	filter(value, errors, old_value, prev)
	{
		const Vector = use("Runtime.Vector");
		if (old_value == undefined) old_value = null;
		if (prev == undefined) prev = null;
		if (value === null) return null;
		if (!(value instanceof Vector)) return null;
		let new_value = this.walk(value, errors, (field, new_item, item_errors, i) =>
		{
			return field.filter(new_item, item_errors, old_value ? old_value.get(i) : null, prev);
		});
		return new_value;
	}
	
	
	/**
	 * Returns data
	 */
	encode(value)
	{
		const Vector = use("Runtime.Vector");
		if (value === null) return null;
		if (!(value instanceof Vector)) return null;
		let errors = Vector.create([]);
		let new_value = this.walk(value, errors, (field, new_item, item_errors, i) =>
		{
			return field.encode(new_item);
		});
		return new_value;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Vector = use("Runtime.Vector");
		this.fields = Vector.create([]);
	}
	static getClassName(){ return "Runtime.Serializer.VectorType"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return ["Runtime.Serializer.BaseType"]; }
};
use.add(Runtime.Serializer.VectorType);
module.exports = {
	"VectorType": Runtime.Serializer.VectorType,
};