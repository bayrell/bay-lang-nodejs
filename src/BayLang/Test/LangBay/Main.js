"use strict;"
var use = require('bay-lang').use;
/*!
 *  Bayrell Language
 *
 *  (c) Copyright 2016-2023 "Ildar Bikmamatov" <support@bayrell.org>
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
if (typeof Bayrell == 'undefined') Bayrell = {};
if (typeof Bayrell.Lang == 'undefined') Bayrell.Lang = {};
if (typeof Bayrell.Lang.Test == 'undefined') Bayrell.Lang.Test = {};
if (typeof Bayrell.Lang.Test.LangBay == 'undefined') Bayrell.Lang.Test.LangBay = {};
Bayrell.Lang.Test.LangBay.Main = function(ctx)
{
};
Object.assign(Bayrell.Lang.Test.LangBay.Main.prototype,
{
});
Object.assign(Bayrell.Lang.Test.LangBay.Main,
{
	test1: function(ctx)
	{
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(ctx, 1, 1, "Test");
	},
	test2: function(ctx)
	{
		var __v0 = use("Runtime.Unit.AssertHelper");
		__v0.equalValue(ctx, 1, 1, "Test");
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Bayrell.Lang.Test.LangBay";
	},
	getClassName: function()
	{
		return "Bayrell.Lang.Test.LangBay.Main";
	},
	getParentClassName: function()
	{
		return "";
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
			"test1",
			"test2",
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		if (field_name == "test1")
		{
			
			var __v0 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v0(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "test2")
		{
			
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v1(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		return null;
	},
});use.add(Bayrell.Lang.Test.LangBay.Main);
module.exports = Bayrell.Lang.Test.LangBay.Main;