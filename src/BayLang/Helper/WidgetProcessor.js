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
	load: async function(ctx, force)
	{
		if (force == undefined) force = false;
		if (this.is_loaded && !force)
		{
			return Promise.resolve();
		}
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
			this.op_code = res.get(ctx, 1);
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
		this.is_loaded = true;
	},
	/**
	 * Save op_code
	 */
	save: async function(ctx)
	{
		var file_path = this.getModuleDescriptionFilePath(ctx);
		/* Translate */
		var __v0 = use("BayLang.LangBay.TranslatorBay");
		var translator = new __v0(ctx);
		var res = translator.constructor.translate(ctx, translator, this.op_code);
		var content = res.get(ctx, 1);
		/* Save content */
		var __v1 = use("Runtime.fs");
		await __v1.saveFile(ctx, file_path, content);
	},
	/**
	 * Add widget
	 */
	addWidget: async function(ctx, widget_name)
	{
		var expression = this.getEntityExpression(ctx);
		if (!expression)
		{
			return Promise.resolve();
		}
		/* Create op_code */
		var __v0 = use("BayLang.OpCodes.OpNew");
		var __v1 = use("BayLang.OpCodes.OpString");
		var __v2 = use("BayLang.OpCodes.OpTypeIdentifier");
		var __v3 = use("BayLang.OpCodes.OpEntityName");
		var op_code_widget = new __v0(ctx, use("Runtime.Map").from({"args":use("Runtime.Vector").from([new __v1(ctx, use("Runtime.Map").from({"value":widget_name}))]),"value":new __v2(ctx, use("Runtime.Map").from({"entity_name":new __v3(ctx, use("Runtime.Map").from({"names":use("Runtime.Vector").from(["Widget"])}))}))}));
		/* Add widget */
		expression.values.push(ctx, op_code_widget);
	},
	/**
	 * Remove widget
	 */
	removeWidget: async function(ctx, widget_name)
	{
		var expression = this.getEntityExpression(ctx);
		if (!expression)
		{
			return Promise.resolve();
		}
		for (var i = expression.values.count(ctx) - 1; i >= 0; i--)
		{
			var op_code = expression.values.get(ctx, i);
			if (!this.constructor.isWidget(ctx, op_code))
			{
				continue;
			}
			if (op_code.args.get(ctx, 0).value != widget_name)
			{
				continue;
			}
			expression.values.remove(ctx, i);
		}
	},
	/**
	 * Get widgets
	 */
	getEntityExpression: function(ctx)
	{
		var op_code = this.op_code;
		var __v0 = use("BayLang.OpCodes.OpModule");
		if (!(op_code instanceof __v0))
		{
			return null;
		}
		var class_op_code = op_code.findClass(ctx);
		if (!class_op_code)
		{
			return null;
		}
		var entities_op_code = class_op_code.findFunction(ctx, "entities");
		if (!entities_op_code)
		{
			return null;
		}
		var expression = entities_op_code.getExpression(ctx);
		if (expression == null)
		{
			return null;
		}
		var __v0 = use("BayLang.OpCodes.OpCollection");
		if (!(expression instanceof __v0))
		{
			return null;
		}
		if (expression.values == null)
		{
			return null;
		}
		return expression;
	},
	/**
	 * Find widgets
	 */
	getWidgets: function(ctx)
	{
		var expression = this.getEntityExpression(ctx);
		if (!expression)
		{
			return use("Runtime.Vector").from([]);
		}
		return expression.values.filter(ctx, (ctx, op_code) =>
		{
			return this.constructor.isWidget(ctx, op_code);
		}).map(ctx, (ctx, op_code) =>
		{
			return op_code.args.get(ctx, 0).value;
		});
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
		this.module = null;
		this.op_code = null;
		this.is_loaded = false;
	},
});
Object.assign(BayLang.Helper.WidgetProcessor, use("Runtime.BaseObject"));
Object.assign(BayLang.Helper.WidgetProcessor,
{
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