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
BayLang.OpCodes.OpAssignStruct = function()
{
	use("BayLang.OpCodes.BaseOpCode").apply(this, arguments);
};
BayLang.OpCodes.OpAssignStruct.prototype = Object.create(use("BayLang.OpCodes.BaseOpCode").prototype);
BayLang.OpCodes.OpAssignStruct.prototype.constructor = BayLang.OpCodes.OpAssignStruct;
Object.assign(BayLang.OpCodes.OpAssignStruct.prototype,
{
	/**
	 * Serialize object
	 */
	serialize: function(serializer, data)
	{
		use("BayLang.OpCodes.BaseOpCode").prototype.serialize.call(this, serializer, data);
		serializer.process(this, "annotations", data);
		serializer.process(this, "comments", data);
		serializer.process(this, "expression", data);
		serializer.process(this, "names", data);
		serializer.process(this, "var_name", data);
	},
	_init: function()
	{
		use("BayLang.OpCodes.BaseOpCode").prototype._init.call(this);
		this.var_name = "";
		this.annotations = null;
		this.comments = null;
		this.names = null;
		this.expression = null;
	},
});
Object.assign(BayLang.OpCodes.OpAssignStruct, use("BayLang.OpCodes.BaseOpCode"));
Object.assign(BayLang.OpCodes.OpAssignStruct,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.OpCodes";
	},
	getClassName: function()
	{
		return "BayLang.OpCodes.OpAssignStruct";
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
});use.add(BayLang.OpCodes.OpAssignStruct);
module.exports = BayLang.OpCodes.OpAssignStruct;