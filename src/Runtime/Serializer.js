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
Runtime.Serializer = class extends use("Runtime.BaseObject")
{
	static ASSIGN_DATA = 1;
	static ENCODE_DATA = 2;
	
	
	isAssign(){ return this.kind == this.constructor.ASSIGN_DATA; }
	
	
	isEncode(){ return this.kind == this.constructor.ENCODE_DATA; }
	
	
	/**
	 * Assign data to object
	 */
	assign(obj, data)
	{
		const rtl = use("rtl");
		if (!(rtl.isImplements(obj, "Runtime.SerializeInterface"))) return;
		this.kind = this.constructor.ASSIGN_DATA;
		obj.serialize(this, data);
	}
	
	
	/**
	 * Convert value to object
	 */
	decode(value, create)
	{
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		if (create == undefined) create = null;
		this.kind = this.constructor.ASSIGN_DATA;
		let new_value = value;
		if (value instanceof Map && value.has("__class_name__"))
		{
			let class_name = value.get("__class_name__");
			new_value = create ? create.apply(new Vector(this, value)) : rtl.newInstance(class_name);
			this.assign(new_value, value);
		}
		else if (value instanceof Vector || value instanceof Map)
		{
			new_value = value.map((item) =>
			{
				let new_item = this.decode(item, create);
				return new_item;
			});
		}
		return new_value;
	}
	
	
	/**
	 * Convert object to Map
	 */
	encode(obj)
	{
		const rtl = use("rtl");
		const Map = use("Runtime.Map");
		this.kind = this.constructor.ENCODE_DATA;
		let data = obj;
		if (rtl.isObject(obj) && rtl.isImplements(obj, "Runtime.SerializeInterface"))
		{
			data = Map.create({
				"__class_name__": rtl.className(obj),
			});
			obj.serialize(this, data);
		}
		return data;
	}
	
	
	/**
	 * Serialize item
	 */
	process(obj, field_name, data, create)
	{
		const Vector = use("Runtime.Vector");
		const Map = use("Runtime.Map");
		if (create == undefined) create = null;
		if (this.kind == this.constructor.ASSIGN_DATA)
		{
			let value = data.get(field_name);
			let new_value = this.decode(value, create);
			rtl.setAttr(obj, field_name, new_value);
		}
		else
		{
			let value = rtl.attr(obj, field_name);
			let new_value = value;
			if (value instanceof Vector || value instanceof Map)
			{
				new_value = value.map((item) => { return this.encode(item); });
			}
			else
			{
				new_value = this.encode(value);
			}
			data.set(field_name, new_value);
		}
	}
	
	
	/**
	 * Copy object
	 */
	static copy(obj)
	{
		let serializer = new Runtime.Serializer();
		let data = serializer.encode(obj);
		let s = rtl.jsonEncode(data);
		data = rtl.jsonDecode(s);
		return serializer.decode(obj);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.kind = 0;
	}
	static getClassName(){ return "Runtime.Serializer"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Serializer);
module.exports = {
	"Serializer": Runtime.Serializer,
};