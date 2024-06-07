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
if (typeof BayLang == 'undefined') BayLang = {};
if (typeof BayLang.LangES6 == 'undefined') BayLang.LangES6 = {};
BayLang.LangES6.AsyncAwait = function(ctx)
{
	use("Runtime.BaseStruct").apply(this, arguments);
};
BayLang.LangES6.AsyncAwait.prototype = Object.create(use("Runtime.BaseStruct").prototype);
BayLang.LangES6.AsyncAwait.prototype.constructor = BayLang.LangES6.AsyncAwait;
Object.assign(BayLang.LangES6.AsyncAwait.prototype,
{
	_init: function(ctx)
	{
		use("Runtime.BaseStruct").prototype._init.call(this,ctx);
		this.start_pos = "";
		this.end_pos = "";
	},
	takeValue: function(ctx,k,d)
	{
		if (d == undefined) d = null;
		if (k == "start_pos")return this.start_pos;
		else if (k == "end_pos")return this.end_pos;
		return use("Runtime.BaseStruct").prototype.takeValue.call(this,ctx,k,d);
	},
});
Object.assign(BayLang.LangES6.AsyncAwait, use("Runtime.BaseStruct"));
Object.assign(BayLang.LangES6.AsyncAwait,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangES6";
	},
	getClassName: function()
	{
		return "BayLang.LangES6.AsyncAwait";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseStruct";
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
		a.push("start_pos");
		a.push("end_pos");
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
});use.add(BayLang.LangES6.AsyncAwait);
module.exports = BayLang.LangES6.AsyncAwait;