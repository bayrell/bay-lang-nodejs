"use strict;"
const use = require('bay-lang').use;
const Chain = use("Runtime.Chain");
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
Runtime.ChainAsync = class extends Chain
{
	/**
	 * Apply chain
	 */
	apply(args)
	{
		if (args == undefined) args = null;
		var f = async () =>
		{
			for (var i = 0; i < this.chain.count(); i++)
			{
				var item = this.chain.get(i);
				var f = item.get("callback");
				var res = obj[this.name].bind(obj).apply(null, args);
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
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(Runtime.ChainAsync);
module.exports = {
	"ChainAsync": Runtime.ChainAsync,
};