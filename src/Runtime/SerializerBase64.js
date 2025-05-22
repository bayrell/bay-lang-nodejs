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
Runtime.SerializerBase64 = function(ctx)
{
	use("Runtime.SerializerJson").apply(this, arguments);
};
Runtime.SerializerBase64.prototype = Object.create(use("Runtime.SerializerJson").prototype);
Runtime.SerializerBase64.prototype.constructor = Runtime.SerializerBase64;
Object.assign(Runtime.SerializerBase64.prototype,
{
	/**
	 * Export object to data
	 */
	encode: function(ctx, object)
	{
		var s = use("Runtime.SerializerJson").prototype.encode.bind(this)(ctx, object);
		var __v0 = use("Runtime.rs");
		return __v0.base64_encode(ctx, s);
	},
	/**
	 * Import from string
	 */
	decode: function(ctx, s)
	{
		var __v0 = use("Runtime.rs");
		s = __v0.base64_decode(ctx, s);
		return use("Runtime.SerializerJson").prototype.decode.bind(this)(ctx, s);
	},
});
Object.assign(Runtime.SerializerBase64, use("Runtime.SerializerJson"));
Object.assign(Runtime.SerializerBase64,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.SerializerBase64";
	},
	getParentClassName: function()
	{
		return "Runtime.SerializerJson";
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
});use.add(Runtime.SerializerBase64);
module.exports = Runtime.SerializerBase64;