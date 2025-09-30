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
if (typeof Runtime.Exceptions == 'undefined') Runtime.Exceptions = {};
if (typeof Runtime == 'undefined') Runtime = {};
if (typeof Runtime.Exceptions == 'undefined') Runtime.Exceptions = {};
Runtime.Exceptions.ClassException = function(message, code, prev)
{
	Error.call(this);
	Error.captureStackTrace(this, this.constructor);
	this.message = message;
	this.code = code;
	this.prev = prev;
}
Runtime.Exceptions.ClassException.prototype = Object.create(Error.prototype);
Runtime.Exceptions.ClassException.prototype.constructor = Runtime.Exceptions.ClassException;
Object.assign(Runtime.Exceptions.ClassException.prototype,
{
	_init: function(){},
});
Object.assign(Runtime.Exceptions.ClassException,
{
	getNamespace: function(){ return "Runtime.Exceptions"; },
	getClassName: function(){ return "Runtime.Exceptions.ClassException"; },
	getParentClassName: function(){ return ""; },
});
use.add(Runtime.Exceptions.ClassException);
Runtime.Exceptions.AbstractException = function(message, code, prev)
{
	if (message == undefined) message = "";
	if (code == undefined) code = -1;
	if (prev == undefined) prev = null;
	Runtime.Exceptions.ClassException.call(this, message, code, prev);
	this._init();
	this.error_message = message;
	this.error_code = code;
	this.prev = prev;
};
Runtime.Exceptions.AbstractException.prototype = Object.create(use("Runtime.Exceptions.ClassException").prototype);
Runtime.Exceptions.AbstractException.prototype.constructor = Runtime.Exceptions.AbstractException;
Object.assign(Runtime.Exceptions.AbstractException.prototype,
{
	/**
	 * Returns previous exception
	 */
	getPreviousException: function()
	{
		return this.prev;
	},
	/**
	 * Build error message
	 */
	buildErrorMessage: function()
	{
		return this.error_message;
	},
	/**
	 * Returns error message
	 */
	getErrorMessage: function()
	{
		return this.error_message;
	},
	/**
	 * Returns error code
	 */
	getErrorCode: function()
	{
		return this.error_code;
	},
	/**
	 * Returns error file name
	 */
	getFileName: function()
	{
		return this.error_file;
	},
	/**
	 * Returns error line
	 */
	getErrorLine: function()
	{
		return this.error_line;
	},
	/**
	 * Returns error position
	 */
	getErrorPos: function()
	{
		return this.error_pos;
	},
	/**
	 * Convert exception to string
	 */
	toString: function()
	{
		return this.buildErrorMessage();
	},
	/**
	 * Returns trace
	 */
	getTraceStr: function()
	{
	},
	/**
	 * Returns trace
	 */
	getTraceCollection: function()
	{
	},
	_init: function()
	{
		use("Runtime.Exceptions.ClassException").prototype._init.call(this);
		this.prev = null;
		this.error_message = "";
		this.error_code = 0;
		this.error_file = "";
		this.error_line = "";
		this.error_pos = "";
	},
});
Object.assign(Runtime.Exceptions.AbstractException, use("Runtime.Exceptions.ClassException"));
Object.assign(Runtime.Exceptions.AbstractException,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime.Exceptions";
	},
	getClassName: function()
	{
		return "Runtime.Exceptions.AbstractException";
	},
	getParentClassName: function()
	{
		return "Runtime.Exceptions.ClassException";
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
});use.add(Runtime.Exceptions.AbstractException);
module.exports = Runtime.Exceptions.AbstractException;