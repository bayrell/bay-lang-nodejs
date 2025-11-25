"use strict;"
const use = require('bay-lang').use;
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
Runtime.ChainAsync = class extends use("Runtime.Chain")
{
	/**
	 * Apply chain
	 */
	apply(args)
	{
		if (args == undefined) args = null;
		let f = async () =>
		{
			for (let i = 0; i < this.chain.count(); i++)
			{
				let item = this.chain.get(i);
				let f = item.get("method");
				let res = f.apply(args);
				if (res instanceof Promise) await res;
			}
		};
		return f();
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "Runtime.ChainAsync"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.ChainAsync);
module.exports = {
	"ChainAsync": Runtime.ChainAsync,
};