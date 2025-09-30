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
BayLang.SaveOpCode = function()
{
	use("Runtime.BaseStruct").apply(this, arguments);
};
BayLang.SaveOpCode.prototype = Object.create(use("Runtime.BaseStruct").prototype);
BayLang.SaveOpCode.prototype.constructor = BayLang.SaveOpCode;
Object.assign(BayLang.SaveOpCode.prototype,
{
	_init: function()
	{
		use("Runtime.BaseStruct").prototype._init.call(this);
		this.var_name = "";
		this.var_content = "";
		this.content = "";
		this.op_code = null;
	},
	takeValue: function(k,d)
	{
		if (d == undefined) d = null;
		if (k == "var_name")return this.var_name;
		else if (k == "var_content")return this.var_content;
		else if (k == "content")return this.content;
		else if (k == "op_code")return this.op_code;
		return use("Runtime.BaseStruct").prototype.takeValue.call(this,k,d);
	},
});
Object.assign(BayLang.SaveOpCode, use("Runtime.BaseStruct"));
Object.assign(BayLang.SaveOpCode,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang";
	},
	getClassName: function()
	{
		return "BayLang.SaveOpCode";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseStruct";
	},
	getClassInfo: function()
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function()
	{
		var a = [];
		a.push("var_name");
		a.push("var_content");
		a.push("content");
		a.push("op_code");
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function()
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(field_name)
	{
		return null;
	},
});use.add(BayLang.SaveOpCode);
module.exports = BayLang.SaveOpCode;