"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const rs = use("Runtime.rs");
/*
!
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
Runtime.RawString = class
{
	/**
	 * Constructor
	 */
	constructor(s)
	{
		this.s = "";
		if (rtl.isString(s))
		{
			this.s = s;
		}
	}
	
	
	/**
	 * To string
	 */
	toString()
	{
		return this.s;
	}
	
	
	/**
	 * Normalize array
	 */
	static normalize(item)
	{
		const Collection = use("Runtime.Collection");
		if (rtl.isString(item))
		{
			return item;
		}
		else if (item instanceof Runtime.RawString)
		{
			return item.s;
		}
		else if (item instanceof Collection)
		{
			item = item.map((item) => { return this.normalize(item); });
			return rs.join("", item);
		}
		return "";
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "Runtime.RawString"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return ["Runtime.StringInterface"]; }
};
use.add(Runtime.RawString);
module.exports = {
	"RawString": Runtime.RawString,
};