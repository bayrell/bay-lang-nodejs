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
Runtime.Serializer.DateTimeType = class extends use("Runtime.BaseObject")
{
	/**
	 * Filter value
	 */
	filter(value, errors)
	{
		const DateTime = use("Runtime.DateTime");
		const Map = use("Runtime.Map");
		if (value === null) return null;
		if (value instanceof DateTime) return value;
		if (!(value instanceof Map))
		{
			errors.push("Must be Map");
			return null;
		}
		return new DateTime(value);
	}
	
	
	/**
	 * Returns data
	 */
	encode(value)
	{
		if (value === null) return null;
		return value.toMap();
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "Runtime.Serializer.DateTimeType"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return ["Runtime.Serializer.BaseType"]; }
};
use.add(Runtime.Serializer.DateTimeType);
module.exports = {
	"DateTimeType": Runtime.Serializer.DateTimeType,
};