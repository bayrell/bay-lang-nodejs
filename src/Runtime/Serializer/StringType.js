"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const rs = use("Runtime.rs");
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
Runtime.Serializer.StringType = class extends use("Runtime.BaseObject")
{
	/**
	 * Constructor
	 */
	constructor(params)
	{
		if (params == undefined) params = null;
		super();
		if (!params) return;
		if (params.has("convert")) this.convert = params.get("convert");
		if (params.has("multiline")) this.multiline = params.get("multiline");
		if (params.has("default")) this.default_value = params.get("default");
	}
	
	
	/**
	 * Filter type
	 */
	filter(value, errors)
	{
		const TypeError = use("Runtime.Serializer.TypeError");
		if (value === null)
		{
			if (!this.convert) errors.push(new TypeError("Does not string"));
			return this.default_value;
		}
		if (this.convert && (rtl.isInteger(value) || rtl.isBoolean(value)))
		{
			value = rtl.toStr(value);
		}
		if (!rtl.isString(value))
		{
			errors.push(new TypeError("Does not string"));
			return "";
		}
		if (this.multiline) value = rs.replace("\r\n", "\n", value);
		return value;
	}
	
	
	/**
	 * Serialize data
	 */
	encode(value)
	{
		if (value === null) return "";
		if (rtl.isString(value)) return value;
		if (rtl.isBoolean(value) || rtl.isInteger(value)) return rtl.toStr(value);
		return "";
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.convert = true;
		this.multiline = true;
		this.default_value = "";
	}
	static getClassName(){ return "Runtime.Serializer.StringType"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return ["Runtime.Serializer.BaseType"]; }
};
use.add(Runtime.Serializer.StringType);
module.exports = {
	"StringType": Runtime.Serializer.StringType,
};