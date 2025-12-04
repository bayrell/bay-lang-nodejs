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
Runtime.Date = class extends use("Runtime.BaseObject")
{
	/**
	 * Constructor
	 */
	constructor(data)
	{
		if (data == undefined) data = null;
		super();
		if (data != null)
		{
			if (data.has("y")) this.y = data.get("y");
			if (data.has("m")) this.m = data.get("m");
			if (data.has("d")) this.d = data.get("d");
		}
	}
	
	
	/**
	 * toMap
	 */
	toMap()
	{
		const Map = use("Runtime.Map");
		return Map.create({
			"y": this.y,
			"m": this.m,
			"d": this.d,
		});
	}
	
	
	/**
	 * Return date
	 * @return string
	 */
	getDate()
	{
		return this.y + String("-") + String(this.m) + String("-") + String(this.d);
	}
	
	
	/**
	 * Normalize date time
	 */
	normalize(){ return this; }
	
	
	/**
	 * Return db datetime
	 * @return string
	 */
	toString()
	{
		return this.y + String("-") + String(this.m) + String("-") + String(this.d);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.y = 0;
		this.m = 0;
		this.d = 0;
	}
	static getClassName(){ return "Runtime.Date"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return ["Runtime.StringInterface"]; }
};
use.add(Runtime.Date);
Runtime.Date.prototype.toObject = function()
{
	var dt = new Date(this.y, this.m - 1, this.d);
	return dt;
}
Runtime.Date.fromObject = function(dt)
{
	var Dict = use("Runtime.Dict");
	var y = Number(dt.getFullYear());
	var m = Number(dt.getMonth()) + 1;
	var d = Number(dt.getDate());
	var dt = new Runtime.Date(Dict.from({"y":y,"m":m,"d":d}));
	return dt;
}
module.exports = {
	"Date": Runtime.Date,
};