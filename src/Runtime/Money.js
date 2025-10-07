"use strict;"
const use = require('bay-lang').use;
const BaseObject = use("Runtime.BaseObject");
/*!
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
Runtime.Money = class extends BaseObject
{
	
	
	/**
	 * Create new instance
	 */
	constructor(value, currency)
	{
		super();
		this.value = value;
		this.currency = currency;
	}
	
	
	/**
	 * Returns value
	 */
	getValue(){ return this.value; }
	
	
	/**
	 * Returns currency
	 */
	getCurrency(){ return this.currency; }
	
	
	/**
	 * Add money
	 */
	add(money)
	{
		const RuntimeException = use("Runtime.Exceptions.RuntimeException");
		if (this.currency != money.currency)
		{
			throw new RuntimeException("Money currency mismatch");
		}
		this.value += money.currency;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.value = 0;
		this.currency = "";
	}
	static getClassName(){ return "Runtime.Money"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(Runtime.Money);
module.exports = {
	"Money": Runtime.Money,
};