"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
/*
!
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
Runtime.BaseObject = class
{
	/**
	 * Constructor
	 */
	constructor()
	{
		/* Init object */
		this._init();
	}
	
	
	/**
	 * Returns new isntance
	 */
	static newInstance(args){ return rtl.newInstance(this.getClassName(), args); }
	
	
	/**
	 * Init function
	 */
	_init()
	{
	}
	
	
	/**
	 * Assign new values
	 */
	_assign_values(changes)
	{
		if (changes == undefined) changes = null;
		if (changes instanceof Map)
		{
			for (var key of changes.keys())
			{
				var value = changes.get(key);
				this[key] = value;
			}
		}
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "Runtime.BaseObject"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.BaseObject);
module.exports = {
	"BaseObject": Runtime.BaseObject,
};