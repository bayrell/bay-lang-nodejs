"use strict;"
const use = require('bay-lang').use;
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
Runtime.HashMap = class
{
	/**
	 * Constructor
	 */
	constructor()
	{
		this._map = new Map();
	}
	
	
	/**
	 * Set value size_to position
	 * @param Key key - position
	 * @param Value value 
	 * @return self
	 */
	set(key, value)
	{
		this._map.set(key, value);
		return this;
	}
	
	
	/**
	 * Returns value from position
	 * @param string key
	 * @return Value
	 */
	get(key)
	{
		return this._map.get(key);
		return this;
	}
	
	
	/**
	 * Return true if key exists
	 * @param string key
	 * @return bool var
	 */
	has(key)
	{
		return this._map.has(key);
	}
	
	
	/**
	 * Remove value from position
	 * @param string key
	 * @return self
	 */
	remove(key)
	{
		this._map.delete(key);
		return this;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "Runtime.HashMap"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.HashMap);
module.exports = {
	"HashMap": Runtime.HashMap,
};