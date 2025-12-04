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
Runtime.Method = class extends use("Runtime.BaseObject")
{
	/**
	 * Constructor
	 */
	constructor(obj, name, tag)
	{
		if (tag == undefined) tag = null;
		super();
		/* Init object */
		this._init();
		/* Set variables */
		this.obj = obj;
		this.name = name;
		this.tag = tag;
	}
	
	
	/**
	 * Check if method exists
	 */
	exists()
	{
		if (!rtl.methodExists(this.obj, this.name))
		{
			return false;
		}
		return true;
	}
	
	
	/**
	 * Check method
	 */
	check()
	{
		const RuntimeException = use("Runtime.Exceptions.RuntimeException");
		if (!this.exists())
		{
			throw new RuntimeException("Method '" + String(this.name) + String("' not found in ") + String(rtl.className(this.obj)));
		}
	}
	
	
	/**
	 * Apply
	 */
	apply(args)
	{
		if (args == undefined) args = null;
		this.check();
		if (args == null) args = [];
		
		var obj = this.obj;
		if (typeof obj == "string") obj = Runtime.rtl.findClass(obj);
		return obj[this.name].bind(obj).apply(null, args);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.tag = null;
	}
	static getClassName(){ return "Runtime.Method"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Method);
module.exports = {
	"Method": Runtime.Method,
};