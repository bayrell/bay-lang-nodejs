"use strict;"
const use = require('bay-lang').use;
/*
!
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
Runtime.Exceptions.RuntimeException = class extends use("Runtime.Exceptions.ClassException")
{
	/**
	 * Constructor
	 */
	constructor(message, code, prev)
	{
		if (message == undefined) message = "";
		if (code == undefined) code = -1;
		if (prev == undefined) prev = null;
		super(message, code, prev);
		this._init();
		this.error_message = message;
		this.error_code = code;
		this.prev = prev;
	}
	
	
	/**
	 * Returns previous exception
	 */
	getPreviousException()
	{
		return this.prev;
	}
	
	
	/**
	 * Build error message
	 */
	buildErrorMessage()
	{
		return this.error_message;
	}
	
	
	/**
	 * Returns error message
	 */
	getErrorMessage()
	{
		return this.error_message;
	}
	
	
	/**
	 * Returns error code
	 */
	getErrorCode()
	{
		return this.error_code;
	}
	
	
	/**
	 * Returns error file name
	 */
	getFileName()
	{
		return this.error_file;
	}
	
	
	/**
	 * Returns error line
	 */
	getErrorLine()
	{
		return this.error_line;
	}
	
	
	/**
	 * Returns error position
	 */
	getErrorPos()
	{
		return this.error_pos;
	}
	
	
	/**
	 * Convert exception to string
	 */
	toString()
	{
		return this.buildErrorMessage();
	}
	
	
	/**
	 * Returns trace
	 */
	getTraceStr()
	{
	}
	
	
	/**
	 * Returns trace
	 */
	getTraceCollection()
	{
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.prev = null;
		this.error_message = "";
		this.error_code = 0;
		this.error_file = "";
		this.error_line = "";
		this.error_pos = "";
	}
	static getClassName(){ return "Runtime.Exceptions.RuntimeException"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Exceptions.RuntimeException);
module.exports = {
	"ClassException": Runtime.Exceptions.ClassException,
	"RuntimeException": Runtime.Exceptions.RuntimeException,
};