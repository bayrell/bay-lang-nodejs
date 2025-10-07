"use strict;"
const use = require('bay-lang').use;
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
Runtime.rtl = class
{
	/* Log level */
	
	/**
	 * Fatal error. Application stoped
	 */
	static LOG_FATAL = 0;
	
	/**
	 * Critical error. Application damaged, but works
	 */
	static LOG_CRITICAL = 2;
	
	/**
	 * Any Application error or exception
	 */
	static LOG_ERROR = 4;
	
	/**
	 * Log warning. Developer should attention to this
	 */
	static LOG_WARNING = 6;
	
	/**
	 * Information about any event
	 */
	static LOG_INFO = 8;
	
	/**
	 * Debug level 1
	 */
	static LOG_DEBUG = 10;
	
	/**
	 * Debug level 2
	 */
	static LOG_DEBUG2 = 12;
	
	/* Status codes */
	static STATUS_PLAN = 0;
	static STATUS_DONE = 1;
	static STATUS_PROCESS = 100;
	static STATUS_FAIL = -1;
	
	/* Errors */
	static ERROR_NULL = 0;
	static ERROR_OK = 1;
	static ERROR_PROCCESS = 100;
	static ERROR_FALSE = -100;
	static ERROR_RUNTIME = -1;
	static ERROR_UNKNOWN = -1;
	static ERROR_INDEX_OUT_OF_RANGE = -2;
	static ERROR_STOP_ITERATION = -3;
	static ERROR_ITEM_NOT_FOUND = -5;
	static ERROR_OBJECT_ALLREADY_EXISTS = -6;
	static ERROR_ASSERT = -7;
	static ERROR_REQUEST = -8;
	static ERROR_RESPONSE = -9;
	static ERROR_CSRF_TOKEN = -10;
	static ERROR_VALIDATION = -12;
	static ERROR_SERIALIZATION = -14;
	static ERROR_ASSIGN = -15;
	static ERROR_AUTH = -16;
	static ERROR_DUPLICATE = -17;
	static ERROR_API_NOT_FOUND = -18;
	static ERROR_API_WRONG_FORMAT = -19;
	static ERROR_API_WRONG_APP_NAME = -20;
	static ERROR_API = -21;
	static ERROR_CURL = -22;
	static ERROR_FATAL = -99;
	static ERROR_HTTP_CONTINUE = -100;
	static ERROR_HTTP_SWITCH = -101;
	static ERROR_HTTP_PROCESSING = -102;
	static ERROR_HTTP_OK = -200;
	static ERROR_HTTP_BAD_GATEWAY = -502;
	static ERROR_USER = -10000;
	
	/* Serializer */
	static ALLOW_OBJECTS = 1;
	static JSON_PRETTY = 8;
	
	
	/**
	 * Define class
	 */
	static defClass(obj)
	{
	}
	
	
	/**
	 * Find class instance by name. If class does not exists return null.
	 * @return var - class instance
	 */
	static findClass(class_name)
	{
		if (typeof class_name == "string")
		{
			class_name = typeof window != "undefined" ? window[class_name] : use(class_name);
		}
		if (class_name == undefined || class_name == null) return null;
		if (!(class_name instanceof Function)) class_name = class_name.constructor;
		
		return class_name instanceof Function ? class_name : null;
	}
	
	
	/**
	 * Return class name
	 */
	static className(class_name)
	{
		if (this.isString(class_name)) return class_name;
		var obj = this.findClass(class_name);
		return (obj && obj.getClassName) ? obj.getClassName() : "";
	}
	
	
	/**
	 * Returns parent class name
	 */
	static parentClassName(class_name)
	{
		var obj = this.findClass(class_name);
		var parentObj = obj ? Object.getPrototypeOf(obj) : null;
		return parentObj && parentObj.getClassName ? parentObj.getClassName() : "";
	}
	
	
	/**
	 * Returns true if class instanceof class_name
	 * @return bool
	 */
	static isInstanceOf(obj, class_name)
	{
		if (obj == null) return false;
		obj = this.className(obj);
		if (!this.isString(obj)) return false;
		var parent_class_name = obj;
		while (parent_class_name != "")
		{
			if (parent_class_name == class_name) return true;
			var parent_class_name = this.parentClassName(parent_class_name);
		}
	}
	
	
	/**
	 * Returns true if class implements interface
	 */
	static isImplements(obj, interface_name)
	{
		if (obj == null) return false;
		obj = this.findClass(obj);
		if (!obj) return false;
		while (obj != null)
		{
			if (obj.getInterfaces && obj.getInterfaces().indexOf(interface_name) >= 0) return true;
			obj = this.findClass(this.parentClassName(obj));
		}
	}
	
	
	/**
	 * Class exists
	 */
	static classExists(class_name)
	{
		var obj = this.findClass(class_name);
		return obj != null;
	}
	
	
	/**
	 * Returns true if class exists
	 * @return bool
	 */
	static methodExists(class_name, method_name)
	{
		if (typeof(class_name) == "object")
		{
			if (class_name[method_name] != undefined) return true;
			return false;
		}
		
		var obj = this.findClass(class_name);
		if (!this.exists(obj)) return false;
		if (this.exists(obj[method_name])) return true;
		return false;
	}
	
	
	/**
	 * Create object by class_name. If class name does not exists return null
	 * @return Object
	 */
	static newInstance(class_name, args)
	{
		if (args == undefined) args = null;
		var obj = this.findClass(class_name);
		if (!this.exists(obj) || !(obj instanceof Function))
		{
			throw new Runtime.Exceptions.ItemNotFound(class_name, "class name");
		}
		if (args == undefined || args == null){ args = []; }
		args = args.slice(); 
		args.unshift(null);
		var f = Function.prototype.bind.apply(obj, args);
		return new f;
	}
	
	
	/**
	 * Return attr value by name
	 */
	static attr(item, name, def_val)
	{
		if (def_val == undefined) def_val = null;
		return item[name] || def_val;
	}
	
	
	/**
	 * Return true if value is exists
	 * @param var value
	 * @return bool
	 */
	static exists(value)
	{
		return (value != null) && (value != undefined);
	}
	
	
	/**
	 * Returns true if value is string
	 * @param var value
	 * @return bool
	 */
	static isString(value)
	{
		if (typeof value == 'string') return true;
		else if (value instanceof String) return true;
		return false;
	}
	
	
	/**
	 * Returns true if value is collection
	 */
	static isCollection(value)
	{
		return Array.isArray(value);
	}
	
	
	/**
	 * Translate
	 */
	static translate(s, params)
	{
		return Runtime.rtl.getContext().translate(s, params);
	}
	
	
	/* ================================= Lib Functions =================================== */
	
	static compare(order, f)
	{
		if (f == undefined) f = null;
		return (a, b) =>
		{
			if (f)
			{
				a = f(a);
				b = f(b);
			}
			if (a < b) return 1;
			if (a > b) return -1;
			return 0;
		};
	}
	
	/* =============================== Convert Functions ================================= */
	
	/**
	 * Convert generator to list
	 */
	static list(generator)
	{
		return [...generator];
		return generator;
	}
	
	
	/**
	 * Convert to int
	 */
	static toInt(s)
	{
		return Number(s);
	}
	
	
	/**
	 * Convert value to string
	 * @param var value
	 * @return string
	 */
	static toStr(value)
	{
		var StringInterface = use("Runtime.StringInterface");
		
		if (value === null) return "";
		if (typeof value == 'string') return value;
		if (typeof value == 'number') return ""+value;
		if (value instanceof String) return ""+value;
		if (typeof value == 'object' && this.isImplements(value, StringInterface))
			return value.toString();
		return ""+value;
	}
	
	
	/**
	 * Json Decode
	 */
	static jsonDecode(obj)
	{
		try
		{
			obj = JSON.parse(obj, (key, value) => {
				if (value === null) return null;
				if (Array.isArray(value)) return value;
				if (typeof value == "object") return Map.create(value);
				return value;
			});
		}
		catch (e){}
		return obj;
	}
	
	
	/**
	 * Json encode
	 */
	static jsonEncode(obj)
	{
		return JSON.stringify(obj);
	}
	
	
	/* ================================== IO Functions =================================== */
	
	/**
	 * Print message to output
	 */
	static print(message, new_line, type)
	{
		if (new_line == undefined) new_line = true;
		if (type == undefined) type = "";
		var output = Runtime.rtl.getContext().provider("output");
		output.print(message, new_line, type);
	}
	
	
	/**
	 * Print error message to output
	 */
	static error(message)
	{
		var output = Runtime.rtl.getContext().provider("output");
		output.error(message);
	}
	
	
	/**
	 * Color message to output
	 */
	static color(color, message)
	{
		var output = Runtime.rtl.getContext().provider("output");
		return output.color(color, message);
	}
	
	
	/**
	 * Log message
	 */
	static log(type, message)
	{
		var p = Runtime.rtl.getContext().provider("log");
		p.log(type, message);
	}
	
	
	/**
	 * Read line from input
	 */
	static input()
	{
		var input = Runtime.rtl.getContext().provider("input");
		return input.input();
	}
	
	
	/* ================================= Math Functions ================================== */
	
	/**
	 * Returns random value x, where 0 <= x < 1
	 * @return double
	 */
	static urandom()
	{
		if (
			window != undefined && window.crypto != undefined &&
			window.crypto.getRandomValues != undefined)
		{
			var s = new Uint32Array(1);
			window.crypto.getRandomValues(s);
			return s[0] / 4294967296;
		}
		
		return Math.random();
	}
	
	
	/**
	 * Returns random value x, where a <= x <= b
	 * @param int a
	 * @param int b
	 * @return int
	 */
	static random(a, b)
	{
		return this.round(this.urandom() * (b - a) + a);
	}
	
	
	/* ================================ Context Functions ================================ */
	
	static _global_context = null;
	
	
	/**
	 * Returns global context
	 * @return Context
	 */
	static getContext()
	{
		if (!Runtime.rtl._global_context) return null;
		return Runtime.rtl._global_context;
	}
	
	
	/**
	 * Set global context
	 * @param Context context
	 */
	static setContext(context)
	{
		use("Runtime.rtl")._global_context = context;
	}
	
	
	/**
	 * Create context
	 */
	static async createContext(params)
	{
		const Context = use("Runtime.Context");
		/* Create contenxt */
		var context = new Context(Context.initParams(params));
		/* Setup global context */
		this.setContext(context);
		/* Init context */
		await context.init(params);
		return context;
	}
	
	
	/**
	 * Run app
	 */
	static async runApp(app, modules)
	{
		const Provider = use("Runtime.Entity.Provider");
		try
		{
			var params = Map.create({
				"providers": [
					new Provider("app", app),
				],
				"modules": modules,
			});
			var context = await this.createContext(params);
			await context.start();
			var app = context.provider("app");
			return await app.main();
		}
		catch (e)
		{
			process.stderr.write("\x1B[0;91m");
			process.stderr.write(e.stack);
			process.stderr.write("\x1B[0m\n");
		}
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "Runtime.rtl"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(Runtime.rtl);
module.exports = {
	"rtl": Runtime.rtl,
};