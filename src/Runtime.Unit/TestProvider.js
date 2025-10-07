"use strict;"
var use = require('bay-lang').use;
/*!
 *  Bayrell Runtime Library
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
if (typeof Runtime.Unit == 'undefined') Runtime.Unit = {};
Runtime.Unit.TestProvider = function()
{
	use("Runtime.BaseProvider").apply(this, arguments);
};
Runtime.Unit.TestProvider.prototype = Object.create(use("Runtime.BaseProvider").prototype);
Runtime.Unit.TestProvider.prototype.constructor = Runtime.Unit.TestProvider;
Object.assign(Runtime.Unit.TestProvider.prototype,
{
	/**
	 * Start provider
	 */
	start: async function()
	{
		var __v0 = use("Runtime.lib");
		this.tests_list = use("Runtime.rtl").getContext().entities.filter(__v0.isInstance("Runtime.Unit.UnitTest"));
	},
	/**
	 * Returns commands list
	 */
	getTests: function()
	{
		return this.tests_list;
	},
	/**
	 * Returns unit test by pos
	 */
	get: function(pos)
	{
		return this.tests_list.get(pos);
	},
	/**
	 * Returns count of unit tests
	 */
	count: function()
	{
		return this.tests_list.count();
	},
	/**
	 * Run test
	 */
	runTestByName: async function(test_name)
	{
		var error_code = 0;
		var __v0 = use("Runtime.rs");
		var arr = __v0.split("::", test_name);
		if (arr.count() == 1)
		{
			/* Run all test in class */
			error_code = await this.runTestClass(arr.get(0));
		}
		else
		{
			/* Run specific test */
			error_code = await this.runTestMethod(arr.get(0), arr.get(1));
		}
		return Promise.resolve(error_code);
	},
	/**
	 * Returns all test methods
	 */
	getTestMethods: function(class_name)
	{
		var __v0 = use("Runtime.Callback");
		var getMethodsList = new __v0(class_name, "getMethodsList");
		var __v1 = use("Runtime.Callback");
		var getMethodInfoByName = new __v1(class_name, "getMethodInfoByName");
		var __v2 = use("Runtime.rtl");
		var methods = __v2.apply(getMethodsList);
		methods = methods.filter((method_name) =>
		{
			var __v3 = use("Runtime.rtl");
			var method_info = __v3.apply(getMethodInfoByName, use("Runtime.Vector").from([method_name]));
			return this.constructor.isTestMethod(method_info);
		});
		return methods;
	},
	/**
	 * Run all test in class
	 */
	runTestClass: async function(class_name)
	{
		var error_code = 1;
		var methods = this.getTestMethods(class_name);
		for (var i = 0; i < methods.count(); i++)
		{
			var method_name = methods.get(i);
			var result = await this.runTestMethod(class_name, method_name);
			if (result != 1)
			{
				error_code = -1;
				break;
			}
		}
		if (error_code == 1)
		{
			var __v0 = use("Runtime.io");
			var __v1 = use("Runtime.io");
			__v0.print(__v1.color("green", "Success"));
		}
		return Promise.resolve(error_code);
	},
	/**
	 * Run test method
	 */
	runTestMethod: async function(class_name, method_name)
	{
		var error_code = 0;
		var __v7 = use("Runtime.Exceptions.AssertException");
		try
		{
			var __v0 = use("Runtime.Callback");
			var callback = new __v0(class_name, method_name);
			if (!callback.exists())
			{
				var __v1 = use("Runtime.rtl");
				var obj = __v1.newInstance(class_name);
				var __v2 = use("Runtime.Callback");
				callback = new __v2(obj, method_name);
			}
			if (callback.exists())
			{
				var __v3 = use("Runtime.rtl");
				await __v3.apply(callback);
				error_code = 1;
				var __v4 = use("Runtime.io");
				var __v5 = use("Runtime.io");
				__v4.print(class_name + use("Runtime.rtl").toStr("::") + use("Runtime.rtl").toStr(method_name) + use("Runtime.rtl").toStr(" ") + use("Runtime.rtl").toStr(__v5.color("green", "Ok")));
			}
			else
			{
				var __v6 = use("Runtime.Exceptions.ItemNotFound");
				throw new __v6(class_name + use("Runtime.rtl").toStr("::") + use("Runtime.rtl").toStr(method_name), "Method")
			}
		}
		catch (_ex)
		{
			if (_ex instanceof __v7)
			{
				var e = _ex;
				
				var __v8 = use("Runtime.io");
				var __v9 = use("Runtime.io");
				__v8.print(class_name + use("Runtime.rtl").toStr("::") + use("Runtime.rtl").toStr(method_name) + use("Runtime.rtl").toStr(" ") + use("Runtime.rtl").toStr(__v9.color("red", "Error: " + use("Runtime.rtl").toStr(e.getErrorMessage()))));
				error_code = e.getErrorCode();
			}
			else
			{
				throw _ex;
			}
		}
		return Promise.resolve(error_code);
	},
	_init: function()
	{
		use("Runtime.BaseProvider").prototype._init.call(this);
		this.tests_list = use("Runtime.Vector").from([]);
	},
});
Object.assign(Runtime.Unit.TestProvider, use("Runtime.BaseProvider"));
Object.assign(Runtime.Unit.TestProvider,
{
	/**
	 * Run
	 */
	run: async function(test_name)
	{
		if (test_name == undefined) test_name = "";
		var __v0 = use("Runtime.Unit.TestProvider");
		var provider = new __v0();
		await provider.start();
		if (test_name == "")
		{
			var __v1 = use("Runtime.io");
			__v1.print("List of all tests:");
			for (var i = 0; i < provider.count(); i++)
			{
				var test = provider.get(i);
				var __v2 = use("Runtime.io");
				__v2.print(i + 1 + use("Runtime.rtl").toStr(") ") + use("Runtime.rtl").toStr(test.name));
			}
			return Promise.resolve();
		}
		await provider.runTestByName(test_name);
	},
	/**
	 * Run
	 */
	runAll: async function()
	{
		var __v0 = use("Runtime.Unit.TestProvider");
		var provider = new __v0();
		await provider.start();
		for (var i = 0; i < provider.count(); i++)
		{
			var test = provider.get(i);
			var __v1 = use("Runtime.io");
			__v1.print("Run " + use("Runtime.rtl").toStr(test.name));
			var error_code = await provider.runTestByName(test.name);
			if (error_code != 1)
			{
				return Promise.resolve();
			}
		}
	},
	/**
	 * Returns true if TestMethod
	 */
	isTestMethod: function(method_info)
	{
		var annotations = Runtime.rtl.attr(method_info, "annotations");
		if (annotations)
		{
			for (var j = 0; j < annotations.count(); j++)
			{
				var annotation = annotations.get(j);
				var __v0 = use("Runtime.Unit.Test");
				if (annotation instanceof __v0)
				{
					return true;
				}
			}
		}
		return false;
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime.Unit";
	},
	getClassName: function()
	{
		return "Runtime.Unit.TestProvider";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseProvider";
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
});use.add(Runtime.Unit.TestProvider);
module.exports = Runtime.Unit.TestProvider;