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
if (typeof BayLang.OpCodes == 'undefined') BayLang.OpCodes = {};
BayLang.OpCodes.OpUse = function()
{
	use("BayLang.OpCodes.BaseOpCode").apply(this, arguments);
};
BayLang.OpCodes.OpUse.prototype = Object.create(use("BayLang.OpCodes.BaseOpCode").prototype);
BayLang.OpCodes.OpUse.prototype.constructor = BayLang.OpCodes.OpUse;
Object.assign(BayLang.OpCodes.OpUse.prototype,
{
	/**
	 * Serialize object
	 */
	serialize: function(serializer, data)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype.serialize.call(this, serializer, data);
		serializer.process(this, "alias", data);
		serializer.process(this, "name", data);
		serializer.process(this, "is_component", data);
	},
	_init: function()
	{
		use("BayLang.OpCodes.BaseOpCode").prototype._init.call(this);
		this.op = "op_use";
		this.alias = "";
		this.name = "";
		this.is_component = false;
	},
});
Object.assign(BayLang.OpCodes.OpUse, use("BayLang.OpCodes.BaseOpCode"));
Object.assign(BayLang.OpCodes.OpUse,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.OpCodes";
	},
	getClassName: function()
	{
		return "BayLang.OpCodes.OpUse";
	},
	getParentClassName: function()
	{
		return "BayLang.OpCodes.BaseOpCode";
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
});use.add(BayLang.OpCodes.OpUse);
module.exports = BayLang.OpCodes.OpUse;