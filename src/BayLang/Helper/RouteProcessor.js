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
if (typeof BayLang.Helper == 'undefined') BayLang.Helper = {};
BayLang.Helper.RouteProcessor = function(ctx, module)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.module = module;
};
BayLang.Helper.RouteProcessor.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.Helper.RouteProcessor.prototype.constructor = BayLang.Helper.RouteProcessor;
Object.assign(BayLang.Helper.RouteProcessor.prototype,
{
	/**
	 * Returns file path
	 */
	getRoutesFilePath: function(ctx)
	{
		var __v0 = use("Runtime.fs");
		return __v0.join(ctx, use("Runtime.Vector").from([this.module.getSourcePath(ctx),"Routes.bay"]));
	},
	/**
	 * Load routes
	 */
	load: async function(ctx)
	{
		var file_path = this.getRoutesFilePath(ctx);
		/* Read file */
		var __v0 = use("Runtime.fs");
		if (!await __v0.isFile(ctx, file_path))
		{
			return Promise.resolve();
		}
		var __v0 = use("Runtime.fs");
		var content = await __v0.readFile(ctx, file_path);
		var __v2 = use("BayLang.Exceptions.ParserUnknownError");
		try
		{
			/* Parse file */
			var __v1 = use("BayLang.LangBay.ParserBay");
			var parser = new __v1(ctx);
			var res = parser.constructor.parse(ctx, parser, content);
			var op_code = res.get(ctx, 1);
			/* Get routes */
			this.module.routes = this.constructor.getRoutes(ctx, op_code);
		}
		catch (_ex)
		{
			if (_ex instanceof __v2)
			{
				var e = _ex;
			}
			else
			{
				throw _ex;
			}
		}
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.module = null;
	},
});
Object.assign(BayLang.Helper.RouteProcessor, use("Runtime.BaseObject"));
Object.assign(BayLang.Helper.RouteProcessor,
{
	/**
	 * Returns routes
	 */
	getRoutes: function(ctx, op_code)
	{
		var class_op_code = this.findClass(ctx, op_code);
		if (!class_op_code)
		{
			return use("Runtime.Vector").from([]);
		}
		var routes_op_code = this.findFunction(ctx, class_op_code);
		if (!routes_op_code)
		{
			return use("Runtime.Vector").from([]);
		}
		return this.findRoutes(ctx, routes_op_code);
	},
	/**
	 * Find class
	 */
	findClass: function(ctx, op_code)
	{
		var __v0 = use("BayLang.OpCodes.OpModule");
		var __v1 = use("Runtime.lib");
		return (op_code instanceof __v0) ? (op_code.items.findItem(ctx, __v1.isInstance(ctx, "BayLang.OpCodes.OpDeclareClass"))) : (null);
	},
	/**
	 * Find function
	 */
	findFunction: function(ctx, op_code)
	{
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		return (op_code instanceof __v0) ? (op_code.items.findItem(ctx, (ctx, op_code) =>
		{
			var __v1 = use("BayLang.OpCodes.OpDeclareFunction");
			return op_code instanceof __v1 && op_code.name == "getRoutes";
		})) : (null);
	},
	/**
	 * Find expression
	 */
	findExpression: function(ctx, op_code)
	{
		if (op_code.expression != null)
		{
			return op_code.expression;
		}
		var __v0 = use("BayLang.OpCodes.OpItems");
		if (!(op_code.items instanceof __v0))
		{
			return null;
		}
		var op_code_item = op_code.items.items.get(ctx, 0);
		var __v0 = use("BayLang.OpCodes.OpReturn");
		if (!(op_code_item instanceof __v0))
		{
			return null;
		}
		return op_code_item.expression;
	},
	/**
	 * Find routes
	 */
	findRoutes: function(ctx, op_code)
	{
		var expression = this.findExpression(ctx, op_code);
		if (expression == null)
		{
			return use("Runtime.Vector").from([]);
		}
		if (expression.values == null)
		{
			return use("Runtime.Vector").from([]);
		}
		return expression.values.filter(ctx, (ctx, op_code) =>
		{
			return this.isRoute(ctx, op_code);
		}).map(ctx, (ctx, op_code) =>
		{
			var res = use("Runtime.Map").from({});
			var values = op_code.args.get(ctx, 0).values;
			for (var i = 0; i < values.count(ctx); i++)
			{
				var value = values.get(ctx, i);
				var __v0 = use("BayLang.OpCodes.OpString");
				if (value.value instanceof __v0)
				{
					res.set(ctx, value.key, value.value.value);
				}
			}
			return res;
		});
	},
	/**
	 * Returns true if op_code is route
	 */
	isRoute: function(ctx, op_code)
	{
		var __v0 = use("BayLang.OpCodes.OpNew");
		if (!(op_code instanceof __v0))
		{
			return false;
		}
		var __v0 = use("BayLang.OpCodes.OpTypeIdentifier");
		if (!(op_code.value instanceof __v0))
		{
			return false;
		}
		if (op_code.value.entity_name.names.count(ctx) != 1)
		{
			return false;
		}
		if (op_code.value.entity_name.names.get(ctx, 0) != "RouteInfo")
		{
			return false;
		}
		if (op_code.args.count(ctx) != 1)
		{
			return false;
		}
		var __v0 = use("BayLang.OpCodes.OpDict");
		if (!(op_code.args.get(ctx, 0) instanceof __v0))
		{
			return false;
		}
		return true;
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Helper";
	},
	getClassName: function()
	{
		return "BayLang.Helper.RouteProcessor";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
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
});use.add(BayLang.Helper.RouteProcessor);
module.exports = BayLang.Helper.RouteProcessor;