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
Runtime.Serializer.ObjectType = class extends use("Runtime.Serializer.MapType")
{
	/**
	 * Create object
	 */
	constructor(params)
	{
		if (params == undefined) params = null;
		super();
		this.params = params;
		if (!params) return;
		if (params.has("autocreate")) this.autocreate();
		if (params.has("create")) this.fn_create = params.get("create");
		if (params.has("class_name")) this.class_name = params.get("class_name");
		if (params.has("class_extends")) this.class_extends = params.get("extends");
		if (params.has("class_implements")) this.class_implements = params.get("implements");
		if (params.has("rules")) this.fn_rules = params.get("rules");
		if (params.has("serialize")) this.fn_serialize = params.get("serialize");
	}
	
	
	/**
	 * Set class name
	 */
	setClassName(class_name)
	{
		this.class_name = class_name;
	}
	
	
	/**
	 * Copy object
	 */
	copy()
	{
		let rules = new Runtime.Serializer.ObjectType();
		rules.fn_create = this.fn_create;
		rules.fn_rules = this.fn_rules;
		rules.fn_serialize = this.fn_serialize;
		rules.setup = this.setup;
		rules.items = this.items.map((items) => { return items.slice(); });
		rules.class_name = this.class_name;
		rules.class_extends = this.class_extends;
		rules.class_implements = this.class_implements;
		return rules;
	}
	
	
	/**
	 * Autocreate
	 */
	autocreate()
	{
		this.fn_rules = (rules, value) =>
		{
			rules.class_name = value.get("__class_name__");
		};
		this.fn_serialize = (item, value) =>
		{
			value.set("__class_name__", item.constructor.getClassName());
		};
	}
	
	
	/**
	 * Create object
	 */
	createObject(value, errors, prev)
	{
		const Vector = use("Runtime.Vector");
		if (this.class_name == "") return null;
		if (!rtl.classExists(this.class_name))
		{
			errors.push("Class '" + String(this.class_name) + String("' does not exists"));
			return null;
		}
		if (this.class_extends != "" && !rtl.isInstanceOf(this.class_name, this.class_extends))
		{
			errors.push("Class '" + String(this.class_name) + String("' does not extends '") + String(this.class_extends) + String("'"));
			return null;
		}
		if (this.class_implements != "" && !rtl.isImplements(this.class_name, this.class_implements))
		{
			errors.push("Class '" + String(this.class_name) + String("' does not implements '") + String(this.class_implements) + String("'"));
			return null;
		}
		if (this.fn_create)
		{
			let fn_create = this.fn_create;
			return fn_create(prev, this, value);
		}
		return rtl.newInstance(this.class_name, Vector.create([value]));
	}
	
	
	/**
	 * Init rules
	 */
	initRules(value)
	{
		if (this.fn_rules)
		{
			let rules = this.fn_rules;
			rules(this, value);
		}
		return this;
	}
	
	
	/**
	 * Filter value
	 */
	filter(value, errors, old_value, prev)
	{
		const rtl = use("rtl");
		const Vector = use("Runtime.Vector");
		if (old_value == undefined) old_value = null;
		if (prev == undefined) prev = null;
		if (value == null) return null;
		if (rtl.isImplements(value, "Runtime.SerializeInterface")) return value;
		let new_value = old_value;
		if (!new_value)
		{
			let rules = this.copy().initRules(value);
			new_value = rules.createObject(value, errors, prev);
		}
		if (!new_value) return null;
		let rules = new Runtime.Serializer.ObjectType(this.params);
		new_value.constructor.serialize(rules);
		rules.setup.apply(Vector.create([new_value, rules]));
		rules.walk(value, errors, (field, new_item, item_errors, key) =>
		{
			if (!value.has(key)) return;
			let old_item = new_value ? rtl.attr(new_value, key) : null;
			new_item = field.filter(new_item, item_errors, old_item, new_value);
			if (key != "__class_name__")
			{
				rtl.setAttr(new_value, key, new_item);
			}
		});
		return new_value;
	}
	
	
	/**
	 * Returns data
	 */
	encode(value)
	{
		const rtl = use("rtl");
		const Vector = use("Runtime.Vector");
		if (value === null) return null;
		if (!(rtl.isImplements(value, "Runtime.SerializeInterface"))) return null;
		let rules = new Runtime.Serializer.ObjectType(this.params);
		value.constructor.serialize(rules);
		let errors = Vector.create([]);
		let new_value = rules.walk(value, errors, (field, new_item, item_errors) =>
		{
			return field.encode(new_item);
		});
		let serialize = this.fn_serialize;
		if (serialize) serialize(value, new_value);
		return new_value;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Chain = use("Runtime.Chain");
		const Map = use("Runtime.Map");
		this.fn_create = null;
		this.fn_rules = null;
		this.fn_serialize = null;
		this.setup = new Chain();
		this.class_name = "";
		this.class_extends = "";
		this.class_implements = "";
		this.params = new Map();
	}
	static getClassName(){ return "Runtime.Serializer.ObjectType"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Serializer.ObjectType);
module.exports = {
	"ObjectType": Runtime.Serializer.ObjectType,
};