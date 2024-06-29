"use strict;"
var use = require('bay-lang').use;
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
Runtime.Curl = function(ctx, url, params)
{
	if (params == undefined) params = null;
	use("Runtime.BaseObject").call(this, ctx);
	this.url = url;
	/* Setup params */
	if (params == null)
	{
		return ;
	}
	if (params.has(ctx, "post"))
	{
		this.post = params.get(ctx, "post");
	}
};
Runtime.Curl.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.Curl.prototype.constructor = Runtime.Curl;
Object.assign(Runtime.Curl.prototype,
{
	/**
	 * Send
	 */
	send: async function(ctx)
	{
		this.code = 0;
		this.response = "";
		return Promise.resolve(this.response);
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.url = "";
		this.post = null;
		this.code = 0;
		this.response = "";
	},
});
Object.assign(Runtime.Curl, use("Runtime.BaseObject"));
Object.assign(Runtime.Curl,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.Curl";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
	},
	getClassInfo: function(ctx)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function(ctx)
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function(ctx)
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		return null;
	},
});use.add(Runtime.Curl);
module.exports = Runtime.Curl;