"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const rs = use("Runtime.rs");
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
if (typeof Runtime.Unit == 'undefined') Runtime.Unit = {};
Runtime.Unit.TestProvider = class extends use("Runtime.BaseProvider")
{
	/**
	 * Start provider
	 */
	async start()
	{
		this.tests_list = Runtime.rtl.getContext().getEntities("Runtime.Unit.UnitTest");
	}
	
	
	/**
	 * Returns commands list
	 */
	getTests(){ return this.tests_list; }
	
	
	/**
	 * Returns unit test by pos
	 */
	get(pos){ return this.tests_list.get(pos); }
	
	
	/**
	 * Returns count of unit tests
	 */
	count(){ return this.tests_list.count(); }
	
	
	/**
	 * Run
	 */
	static async run(test_name)
	{
		if (test_name == undefined) test_name = "";
		let provider = new Runtime.Unit.TestProvider();
		await provider.start();
		if (test_name == "")
		{
			rtl.print("List of all tests:");
			for (let i = 0; i < provider.count(); i++)
			{
				let test = provider.get(i);
				rtl.print(i + 1 + String(") ") + String(test.name));
			}
			return;
		}
		await provider.runTestByName(test_name);
	}
	
	
	/**
	 * Run
	 */
	static async runAll()
	{
		let provider = new Runtime.Unit.TestProvider();
		await provider.start();
		for (let i = 0; i < provider.count(); i++)
		{
			let test = provider.get(i);
			rtl.print("Run " + String(test.name));
			let error_code = await provider.runTestByName(test.name);
			if (error_code != 1)
			{
				return;
			}
		}
	}
	
	
	/**
	 * Run test
	 */
	async runTestByName(test_name)
	{
		let error_code = 0;
		let arr = rs.split("::", test_name);
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
		return error_code;
	}
	
	
	/**
	 * Returns true if TestMethod
	 */
	static isTestMethod(method_info)
	{
		const Test = use("Runtime.Unit.Test");
		let annotations = method_info["annotations"];
		if (annotations)
		{
			for (let j = 0; j < annotations.count(); j++)
			{
				let annotation = annotations.get(j);
				if (annotation instanceof Test)
				{
					return true;
				}
			}
		}
		return false;
	}
	
	
	/**
	 * Returns all test methods
	 */
	getTestMethods(class_name)
	{
		const Callback = use("Runtime.Callback");
		let getMethodsList = new Callback(class_name, "getMethodsList");
		let getMethodInfoByName = new Callback(class_name, "getMethodInfoByName");
		let methods = getMethodsList.apply();
		methods = methods.filter((method_name) =>
		{
			const Vector = use("Runtime.Vector");
			let method_info = getMethodInfoByName.apply(new Vector(method_name));
			return this.constructor.isTestMethod(method_info);
		});
		return methods;
	}
	
	
	/**
	 * Run all test in class
	 */
	async runTestClass(class_name)
	{
		let error_code = 1;
		let methods = this.getTestMethods(class_name);
		for (let i = 0; i < methods.count(); i++)
		{
			let method_name = methods.get(i);
			let result = await this.runTestMethod(class_name, method_name);
			if (result != 1)
			{
				error_code = -1;
				break;
			}
		}
		if (error_code == 1)
		{
			rtl.print(rtl.color("green", "Success"));
		}
		return error_code;
	}
	
	
	/**
	 * Run test method
	 */
	async runTestMethod(class_name, method_name)
	{
		const Callback = use("Runtime.Callback");
		const ItemNotFound = use("Runtime.Exceptions.ItemNotFound");
		const AssertException = use("Runtime.Exceptions.AssertException");
		let error_code = 0;
		try
		{
			let callback = new Callback(class_name, method_name);
			if (!callback.exists())
			{
				let obj = rtl.newInstance(class_name);
				callback = new Callback(obj, method_name);
			}
			if (callback.exists())
			{
				await rtl.apply(callback);
				error_code = 1;
				rtl.print(class_name + String("::") + String(method_name) + String(" ") + String(rtl.color("green", "Ok")));
			}
			else
			{
				throw new ItemNotFound(class_name + String("::") + String(method_name), "Method");
			}
		}
		catch (_ex)
		{
			if (_ex instanceof AssertException)
			{
				var e = _ex;
				rtl.print(class_name + String("::") + String(method_name) + String(" ") + String(rtl.color("red", "Error: " + String(e.getErrorMessage()))));
				error_code = e.getErrorCode();
			}
			else
			{
				throw _ex;
			}
		}
		return error_code;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Vector = use("Runtime.Vector");
		this.tests_list = new Vector();
	}
	static getClassName(){ return "Runtime.Unit.TestProvider"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Unit.TestProvider);
module.exports = {
	"TestProvider": Runtime.Unit.TestProvider,
};