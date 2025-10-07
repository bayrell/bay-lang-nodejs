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
Runtime.Curl = class extends BaseObject
{
	
	
	/**
	 * Constructor
	 */
	constructor(url, params)
	{
		if (params == undefined) params = null;
		super();
		this.url = url;
		/* Setup params */
		if (params == null) return;
		if (params.has("post")) this.post = params.get("post");
	}
	
	
	/**
	 * Send
	 */
	async send()
	{
		this.code = 0;
		this.response = "";
		return this.response;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.url = "";
		this.post = null;
		this.code = 0;
		this.response = "";
	}
	static getClassName(){ return "Runtime.Curl"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(Runtime.Curl);

module.exports = {
	"Curl": Runtime.Curl,
};