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
BayLang.Helper.Widget = function(module)
{
	use("Runtime.BaseObject").call(this);
	this.module = module;
};
BayLang.Helper.Widget.prototype = Object.create(use("Runtime.BaseObject").prototype);
BayLang.Helper.Widget.prototype.constructor = BayLang.Helper.Widget;
Object.assign(BayLang.Helper.Widget.prototype,
{
	/**
	 * Is model based widget
	 */
	isModelBased: function()
	{
		var __v0 = use("Runtime.rs");
		return __v0.substr(this.name, -5) == "Model";
	},
	/**
	 * Process project cache
	 */
	serialize: function(serializer, data)
	{
		serializer.process(this, "kind", data);
		serializer.process(this, "name", data);
	},
	/**
	 * Returns project
	 */
	getProject: function()
	{
		return (this.module) ? (this.module.getProject()) : (null);
	},
	/**
	 * Load widget
	 */
	load: async function(is_force)
	{
		if (is_force == undefined) is_force = false;
		var is_loaded = false;
		if (!is_force)
		{
			is_loaded = await this.readCache();
		}
		if (!is_loaded)
		{
			/* Load widget */
			await this.loadWidget();
			/* Save to cache */
			await this.saveCache();
		}
	},
	/**
	 * Read widget from cache
	 */
	readCache: async function()
	{
		if (this.isModelBased())
		{
			await this.loadModelFromCache();
			await this.loadComponentFromCache();
			return Promise.resolve(this.model !== null && this.component !== null);
		}
		await this.loadComponentFromCache();
		return Promise.resolve(this.component !== null);
	},
	/**
	 * Save widget to cache
	 */
	saveCache: async function()
	{
	},
	/**
	 * Load widget from file system
	 */
	loadWidget: async function()
	{
		if (this.isModelBased())
		{
			await this.loadModelFromFile();
		}
		await this.loadComponentFromFile();
	},
	/** Model **/
	/**
	 * Returns model name
	 */
	getModelName: function()
	{
		return (this.isModelBased()) ? (this.name) : ("");
	},
	/**
	 * Returns model path
	 */
	getModelPath: function()
	{
		if (!this.isModelBased())
		{
			return "";
		}
		return this.module.resolveClassName(this.getModelName());
	},
	/**
	 * Returns model content
	 */
	getModelContent: async function()
	{
		return this.model_content;
	},
	/**
	 * Read model op_code
	 */
	loadModelFromCache: async function()
	{
	},
	/**
	 * Read model op_code
	 */
	loadModelFromFile: async function()
	{
		if (this.model_content !== null)
		{
			return Promise.resolve();
		}
		this.model_content = "";
		var file_path = this.getModelPath();
		var __v0 = use("Runtime.fs");
		if (!await __v0.isFile(file_path))
		{
			return Promise.resolve();
		}
		var __v1 = use("Runtime.fs");
		this.model_content = await __v1.readFile(file_path);
		/* Parse model */
		var __v3 = use("BayLang.Exceptions.ParserUnknownError");
		try
		{
			/* Parse file */
			var __v2 = use("BayLang.LangBay.ParserBay");
			var parser = new __v2();
			var res = parser.constructor.parse(parser, this.model_content);
			this.model = res.get(1);
		}
		catch (_ex)
		{
			if (_ex instanceof __v3)
			{
				var e = _ex;
				
				this.model = false;
				this.model_error = e;
			}
			else
			{
				throw _ex;
			}
		}
		/* Get component name */
		this.component_name = this.getComponentNameFromModel();
	},
	/**
	 * Returns model op code
	 */
	getModelOpCode: async function()
	{
		return this.model;
	},
	/** Component **/
	/**
	 * Returns component name from model
	 */
	getComponentNameFromModel: function()
	{
		if (this.model == null)
		{
			return "";
		}
		var op_code_class = this.constructor.findClass(this.model);
		var op_code_assign = this.constructor.findComponentName(op_code_class);
		return this.constructor.extractComponentName(this.model, op_code_assign);
	},
	/**
	 * Returns component name
	 */
	getComponentName: function()
	{
		if (!this.isModelBased())
		{
			return this.name;
		}
		return this.component_name;
	},
	/**
	 * Returns component path
	 */
	getComponentPath: function()
	{
		return this.module.resolveClassName(this.getComponentName());
	},
	/**
	 * Returns component content
	 */
	getComponentContent: async function()
	{
		return this.component_content;
	},
	/**
	 * Read component op_code
	 */
	loadComponentFromCache: async function()
	{
	},
	/**
	 * Read component op_code
	 */
	loadComponentFromFile: async function()
	{
		if (this.component_content !== null)
		{
			return Promise.resolve();
		}
		this.component_content = "";
		var file_path = this.getComponentPath();
		var __v0 = use("Runtime.fs");
		if (!await __v0.isFile(file_path))
		{
			return Promise.resolve();
		}
		var __v1 = use("Runtime.fs");
		this.component_content = await __v1.readFile(file_path);
		/* Parse component */
		var __v3 = use("BayLang.Exceptions.ParserUnknownError");
		try
		{
			/* Parse file */
			var __v2 = use("BayLang.LangBay.ParserBay");
			var parser = new __v2();
			var res = parser.constructor.parse(parser, this.component_content);
			this.component = res.get(1);
		}
		catch (_ex)
		{
			if (_ex instanceof __v3)
			{
				var e = _ex;
				
				this.component = false;
				this.component_error = e;
			}
			else
			{
				throw _ex;
			}
		}
	},
	/**
	 * Returns component op code
	 */
	getComponentOpCode: async function()
	{
		return this.component;
	},
	_init: function()
	{
		use("Runtime.BaseObject").prototype._init.call(this);
		this.module = null;
		this.kind = "";
		this.name = "";
		this.model = null;
		this.component = null;
		this.component_name = "";
		this.model_content = null;
		this.component_content = null;
		this.model_error = null;
		this.component_error = null;
	},
});
Object.assign(BayLang.Helper.Widget, use("Runtime.BaseObject"));
Object.assign(BayLang.Helper.Widget,
{
	/**
	 * Find class
	 */
	findClass: function(op_code)
	{
		var __v0 = use("BayLang.OpCodes.OpModule");
		var __v1 = use("Runtime.lib");
		return (op_code instanceof __v0) ? (op_code.items.findItem(__v1.isInstance("BayLang.OpCodes.OpDeclareClass"))) : (null);
	},
	/**
	 * Find component name
	 */
	findComponentName: function(op_code)
	{
		if (op_code == null)
		{
			return null;
		}
		var __v0 = use("BayLang.OpCodes.OpDeclareClass");
		if (!(op_code instanceof __v0))
		{
			return null;
		}
		var items = op_code.items.filter((op_code) =>
		{
			var __v1 = use("BayLang.OpCodes.OpAssign");
			return op_code instanceof __v1;
		}).map((op_code) =>
		{
			return op_code.values;
		}).flatten();
		var op_code_component = items.findItem((op_code) =>
		{
			return op_code.var_name == "component";
		});
		return op_code_component;
	},
	/**
	 * Extract component name
	 */
	extractComponentName: function(component, op_code)
	{
		if (op_code == null)
		{
			return null;
		}
		var __v0 = use("BayLang.OpCodes.OpClassOf");
		var __v1 = use("BayLang.OpCodes.OpString");
		if (op_code.expression instanceof __v0)
		{
			var class_name = op_code.expression.entity_name.names.get(0);
			return component.uses.get(class_name);
		}
		else if (op_code.expression instanceof __v1)
		{
			return op_code.expression.value;
		}
		return "";
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Helper";
	},
	getClassName: function()
	{
		return "BayLang.Helper.Widget";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
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
	__implements__:
	[
		use("BayLang.Helper.CacheInterface"),
		use("Runtime.SerializeInterface"),
	],
});use.add(BayLang.Helper.Widget);
module.exports = BayLang.Helper.Widget;