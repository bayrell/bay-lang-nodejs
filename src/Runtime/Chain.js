"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const Callback = use("Runtime.Callback");
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
Runtime.Chain = class extends Callback
{
	
	
	/**
	 * Constructor
	 */
	constructor()
	{
		super(null, null);
	}
	
	
	/**
	 * Check if method exists
	 */
	exists(){ return true; }
	
	
	/**
	 * Check callback
	 */
	check()
	{
	}
	
	
	/**
	 * Returns true if async
	 */
	getChain(){ return this.chain.slice(); }
	
	
	/**
	 * Add function to chain
	 */
	add(f, priority)
	{
		if (priority == undefined) priority = 100;
		this.chain.push(Map.create({
			"callback": f,
			"priority": priority,
		}));
		return this;
	}
	
	
	/**
	 * Sort chain
	 */
	sort()
	{
		this.chain = this.chain.sort(rtl.compare((item) => { return item.get("priority"); }));
	}
	
	
	/**
	 * Apply chain
	 */
	apply(args)
	{
		if (args == undefined) args = null;
		for (var i = 0; i < this.chain.count(); i++)
		{
			var item = this.chain.get(i);
			var f = item.get("callback");
			obj[this.name].bind(obj).apply(null, args);
		}
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.chain = [];
	}
	static getClassName(){ return "Runtime.Chain"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(Runtime.Chain);
module.exports = {
	"Chain": Runtime.Chain,
};