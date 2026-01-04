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
if (typeof Runtime.Unit == 'undefined') Runtime.Unit = {};
Runtime.Unit.AssertHelper = class
{
	/**
	 * Check equals of types
	 */
	static equalValueType(value1, value2)
	{
		let message = "Type mismatch \"" + String(value1) + String("\" and \"") + String(value2) + String("\"");
		let type1 = rtl.getType(value1);
		let type2 = rtl.getType(value2);
		rtl.assert(type1 == type2, message);
	}
	
	
	/**
	 * Check equals of types
	 */
	static equalType(value1, type1)
	{
		let type2 = rtl.getType(value1);
		let message = "Type mismatch. Needs \"" + String(type1) + String("\". Exists \"") + String(type2) + String("\"");
		rtl.assert(type1 == type2, message);
	}
	
	
	/**
	 * Check class name
	 */
	static equalClass(value, class_name)
	{
		const BaseObject = use("Runtime.BaseObject");
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		let message = "Class \"" + String(class_name) + String("\" not found");
		let is_object = value instanceof BaseObject || value instanceof Map || value instanceof Vector;
		rtl.assert(is_object, message);
		rtl.assert(value.constructor.getClassName() == class_name, message);
	}
	
	
	/**
	 * Check equals of values
	 */
	static equalValue(value1, value2, message)
	{
		const Vector = use("Runtime.Vector");
		const Map = use("Runtime.Map");
		if (message == undefined) message = "";
		this.equalValueType(value1, value2);
		if (value1 instanceof Vector)
		{
			this.equalVector(value1, value2);
			return;
		}
		if (value1 instanceof Map)
		{
			this.equalMap(value1, value2);
			return;
		}
		if (message == "") message = "\"" + String(value1) + String("\" != \"") + String(value2) + String("\"");
		rtl.assert(value1 === value2, message);
	}
	
	
	/**
	 * Check equals of two vectors
	 */
	static equalVector(c1, c2)
	{
		if (c1.count() != c2.count())
		{
			let message = "Vectors has different counts";
			rtl.assert(false, message);
		}
		for (let i = 0; i < c1.count(); i++)
		{
			let value1 = c1.get(i);
			let value2 = c2.get(i);
			this.equalValue(value1, value2);
		}
	}
	
	
	/**
	 * Check equals of two maps
	 */
	static equalMap(d1, d2)
	{
		let d1_keys = rtl.list(d1.keys());
		let d2_keys = rtl.list(d2.keys());
		for (let i = 0; i < d1_keys.count(); i++)
		{
			let key1 = d1_keys.get(i);
			if (!d2.has(key1))
			{
				let message = "Map does not has key \"" + String(key1) + String("\"");
				rtl.assert(false, message);
			}
			let value1 = d1.get(key1);
			let value2 = d2.get(key1);
			this.equalValue(value1, value2);
		}
		for (let i = 0; i < d2_keys.count(); i++)
		{
			let key2 = d2_keys.get(i);
			if (!d1.has(key2))
			{
				let message = "Map does not has key \"" + String(key2) + String("\"");
				rtl.assert(false, message);
			}
		}
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "Runtime.Unit.AssertHelper"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Unit.AssertHelper);
module.exports = {
	"AssertHelper": Runtime.Unit.AssertHelper,
};