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
Runtime.Serializer.IntegerType = class extends use("Runtime.BaseObject")
{
	/**
	 * Create type
	 */
	constructor(params)
	{
		if (params == undefined) params = null;
		super();
		if (!params) return;
		if (params.has("convert")) this.conver = params.get("convert");
		if (params.has("default")) this.default_value = params.get("default");
	}
	
	
	/**
	 * Filter type
	 */
	filter(value, errors)
	{
		const TypeError = use("Runtime.Serializer.TypeError");
		if (value === null) return this.default_value;
		if (this.convert)
		{
			if (rtl.isInteger(value) || rtl.isBoolean(value)) value = rtl.toInt(value);
			else if (rtl.isString(value)) value = rtl.toInt(value);
		}
		if (!rtl.isInteger(value))
		{
			errors.push(new TypeError("Does not integer"));
			return "";
		}
		return value;
	}
	
	
	/**
	 * Serialize
	 */
	encode(value)
	{
		if (rtl.isInteger(value)) return value;
		if (rtl.isBoolean(value) || rtl.isString(value)) return rtl.toInt(value);
		return 0;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.convert = true;
		this.default_value = 0;
	}
	static getClassName(){ return "Runtime.Serializer.IntegerType"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return ["Runtime.Serializer.BaseType"]; }
};
use.add(Runtime.Serializer.IntegerType);
module.exports = {
	"IntegerType": Runtime.Serializer.IntegerType,
};