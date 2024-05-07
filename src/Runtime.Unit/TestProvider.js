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
Runtime.Unit.TestProvider = function(ctx)
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
	start: async function(ctx)
	{
		var __v0 = use("Runtime.lib");
		this.tests_list = ctx.entities.filter(ctx, __v0.isInstance(ctx, "Runtime.Unit.UnitTest"));
	},
	/**
	 * Returns commands list
	 */
	getTests: function(ctx)
	{
		return this.tests_list;
	},
	/**
	 * Returns unit test by pos
	 */
	get: function(ctx, pos)
	{
		return this.tests_list.get(ctx, pos);
	},
	/**
	 * Returns count of unit tests
	 */
	count: function(ctx)
	{
		return this.tests_list.count(ctx);
	},
	/**
	 * Run test
	 */
	runTestByName: async function(ctx, test_name)
	{
		var error_code = 0;
		var __v0 = use("Runtime.rs");
		var arr = __v0.split(ctx, "::", test_name);
		if (arr.count(ctx) == 1)
		{
			/* Run all test in class */
			error_code = await this.runTestClass(ctx, arr.get(ctx, 0));
		}
		else
		{
			/* Run specific test */
			error_code = await this.runTestMethod(ctx, arr.get(ctx, 0), arr.get(ctx, 1));
		}
		return Promise.resolve(error_code);
	},
	/**
	 * Returns all test methods
	 */
	getTestMethods: function(ctx, class_name)
	{
		var __v0 = use("Runtime.Callback");
		var getMethodsList = new __v0(ctx, class_name, "getMethodsList");
		var __v1 = use("Runtime.Callback");
		var getMethodInfoByName = new __v1(ctx, class_name, "getMethodInfoByName");
		var __v2 = use("Runtime.rtl");
		var methods = __v2.apply(ctx, getMethodsList);
		methods = methods.filter(ctx, (ctx, method_name) => 
		{
			var __v3 = use("Runtime.rtl");
			var method_info = __v3.apply(ctx, getMethodInfoByName, use("Runtime.Vector").from([method_name]));
			return this.constructor.isTestMethod(ctx, method_info);
		});
		return methods;
	},
	/**
	 * Run all test in class
	 */
	runTestClass: async function(ctx, class_name)
	{
		var error_code = 1;
		var methods = this.getTestMethods(ctx, class_name);
		for (var i = 0; i < methods.count(ctx); i++)
		{
			var method_name = methods.get(ctx, i);
			var result = await this.runTestMethod(ctx, class_name, method_name);
			if (result != 1)
			{
				error_code = -1;
				break;
			}
		}
		return Promise.resolve(error_code);
	},
	/**
	 * Run test method
	 */
	runTestMethod: async function(ctx, class_name, method_name)
	{
		var error_code = 0;
		var __v4 = use("Runtime.Exceptions.AssertException");
		try
		{
			var __v0 = use("Runtime.Callback");
			var callback = new __v0(ctx, class_name, method_name);
			var __v1 = use("Runtime.rtl");
			await __v1.apply(ctx, callback);
			error_code = 1;
			var __v2 = use("Runtime.io");
			var __v3 = use("Runtime.io");
			__v2.print(ctx, class_name + use("Runtime.rtl").toStr("::") + use("Runtime.rtl").toStr(method_name) + use("Runtime.rtl").toStr(" ") + use("Runtime.rtl").toStr(__v3.color(ctx, "green", "Ok")));
		}
		catch (_ex)
		{
			if (_ex instanceof __v4)
			{
				var e = _ex;
				
				var __v5 = use("Runtime.io");
				var __v6 = use("Runtime.io");
				__v5.print(ctx, class_name + use("Runtime.rtl").toStr("::") + use("Runtime.rtl").toStr(method_name) + use("Runtime.rtl").toStr(" ") + use("Runtime.rtl").toStr(__v6.color(ctx, "red", "Error: " + use("Runtime.rtl").toStr(e.getErrorMessage(ctx)))));
				error_code = e.getErrorCode(ctx);
			}
			else
			{
				throw _ex;
			}
		}
		return Promise.resolve(error_code);
	},
	_init: function(ctx)
	{
		use("Runtime.BaseProvider").prototype._init.call(this,ctx);
		this.tests_list = use("Runtime.Vector").from([]);
	},
});
Object.assign(Runtime.Unit.TestProvider, use("Runtime.BaseProvider"));
Object.assign(Runtime.Unit.TestProvider,
{
	/**
	 * Run
	 */
	run: async function(ctx, test_name)
	{
		if (test_name == undefined) test_name = "";
		var __v0 = use("Runtime.Unit.TestProvider");
		var provider = new __v0(ctx);
		await provider.start(ctx);
		if (test_name == "")
		{
			var __v1 = use("Runtime.io");
			__v1.print(ctx, "List of all tests:");
			for (var i = 0; i < provider.count(ctx); i++)
			{
				var test = provider.get(ctx, i);
				var __v2 = use("Runtime.io");
				__v2.print(ctx, i + 1 + use("Runtime.rtl").toStr(") ") + use("Runtime.rtl").toStr(test.name));
			}
			return Promise.resolve();
		}
		await provider.runTestByName(ctx, test_name);
	},
	/**
	 * Returns true if TestMethod
	 */
	isTestMethod: function(ctx, method_info)
	{
		var annotations = Runtime.rtl.attr(ctx, method_info, "annotations");
		if (annotations)
		{
			for (var j = 0; j < annotations.count(ctx); j++)
			{
				var annotation = annotations.get(ctx, j);
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
});use.add(Runtime.Unit.TestProvider);
module.exports = Runtime.Unit.TestProvider;