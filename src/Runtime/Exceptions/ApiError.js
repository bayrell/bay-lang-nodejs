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
Runtime.Exceptions.ApiError = function(prev)
{
	if (prev == undefined) prev = null;
	var __v0 = use("Runtime.rtl");
	use("Runtime.Exceptions.AbstractException").call(this, prev.getErrorMessage(), __v0.ERROR_API_ERROR, prev);
};
Runtime.Exceptions.ApiError.prototype = Object.create(use("Runtime.Exceptions.AbstractException").prototype);
Runtime.Exceptions.ApiError.prototype.constructor = Runtime.Exceptions.ApiError;
Object.assign(Runtime.Exceptions.ApiError.prototype,
{
	/**
	 * Returns error message
	 */
	getErrorMessage: function()
	{
		return this.prev.getErrorMessage();
	},
	/**
	 * Returns error code
	 */
	getErrorCode: function()
	{
		return this.prev.getErrorCode();
	},
	/**
	 * Returns error file name
	 */
	getFileName: function()
	{
		return this.prev.getFileName();
	},
	/**
	 * Returns error line
	 */
	getErrorLine: function()
	{
		return this.prev.getErrorLine();
	},
	/**
	 * Returns error position
	 */
	getErrorPos: function()
	{
		return this.prev.getErrorPos();
	},
});
Object.assign(Runtime.Exceptions.ApiError, use("Runtime.Exceptions.AbstractException"));
Object.assign(Runtime.Exceptions.ApiError,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime.Exceptions";
	},
	getClassName: function()
	{
		return "Runtime.Exceptions.ApiError";
	},
	getParentClassName: function()
	{
		return "Runtime.Exceptions.AbstractException";
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
});use.add(Runtime.Exceptions.ApiError);
module.exports = Runtime.Exceptions.ApiError;