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
BayLang.Helper.WidgetProcessor = function(ctx, module)
{
	use("Runtime.BaseObject").call(this, ctx);
	this.module = module;
};
BayLang.Helper.WidgetProcessor.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.Helper.WidgetProcessor.prototype.constructor = BayLang.Helper.WidgetProcessor;
Object.assign(BayLang.Helper.WidgetProcessor.prototype,
{
	/**
	 * Returns file path
	 */
	getModuleDescriptionFilePath: function(ctx)
	{
		var __v0 = use("Runtime.fs");
		return __v0.join(ctx, use("Runtime.Vector").from([this.module.getSourceFolderPath(ctx),"ModuleDescription.bay"]));
	},
	/**
	 * Load widgets
	 */
	load: async function(ctx)
	{
		var file_path = this.getModuleDescriptionFilePath(ctx);
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
			/* Get widgets */
			var widgets = this.constructor.getWidgets(ctx, op_code);
			this.module.widgets = widgets.map(ctx, (ctx, widget_name) =>
			{
				var __v2 = use("BayLang.Helper.Widget");
				var widget = new __v2(ctx, this.module);
				widget.name = widget_name;
				return widget;
			});
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
Object.assign(BayLang.Helper.WidgetProcessor, use("Runtime.BaseObject"));
Object.assign(BayLang.Helper.WidgetProcessor,
{
	/**
	 * Returns widgets
	 */
	getWidgets: function(ctx, op_code)
	{
		var __v0 = use("BayLang.OpCodes.OpModule");
		if (!(op_code instanceof __v0))
		{
			return use("Runtime.Vector").from([]);
		}
		var class_op_code = op_code.findClass(ctx);
		if (!class_op_code)
		{
			return use("Runtime.Vector").from([]);
		}
		var entities_op_code = class_op_code.findFunction(ctx, "entities");
		if (!entities_op_code)
		{
			return use("Runtime.Vector").from([]);
		}
		return this.findWidgets(ctx, entities_op_code);
	},
	/**
	 * Find widgets
	 */
	findWidgets: function(ctx, op_code)
	{
		var expression = op_code.getExpression(ctx);
		if (expression == null)
		{
			return use("Runtime.Vector").from([]);
		}
		var __v0 = use("BayLang.OpCodes.OpCollection");
		if (!(expression instanceof __v0))
		{
			return use("Runtime.Vector").from([]);
		}
		if (expression.values == null)
		{
			return use("Runtime.Vector").from([]);
		}
		return expression.values.filter(ctx, (ctx, op_code) =>
		{
			return this.isWidget(ctx, op_code);
		}).map(ctx, (ctx, op_code) =>
		{
			return op_code.args.get(ctx, 0).value;
		});
	},
	/**
	 * Returns true if op_code is widget
	 */
	isWidget: function(ctx, op_code)
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
		if (op_code.value.entity_name.names.get(ctx, 0) != "Widget")
		{
			return false;
		}
		if (op_code.args.count(ctx) != 1)
		{
			return false;
		}
		var __v0 = use("BayLang.OpCodes.OpString");
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
		return "BayLang.Helper.WidgetProcessor";
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
});use.add(BayLang.Helper.WidgetProcessor);
module.exports = BayLang.Helper.WidgetProcessor;