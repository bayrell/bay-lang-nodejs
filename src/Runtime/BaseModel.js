"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
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
Runtime.BaseModel = class extends use("Runtime.BaseObject")
{
	/**
	 * Create model
	 */
	constructor(params)
	{
		if (params == undefined) params = null;
		super();
		/* Setup widget params */
		this.initParams(params);
		/* Init widget settings */
		this.initWidget(params);
		/* Add component */
		if (this.layout != null && this.component != "")
		{
			this.layout.addComponent(this.component);
		}
	}
	
	
	/**
	 * Init widget params
	 */
	initParams(params)
	{
		if (!params) return;
		this.parent_widget = params.get("parent_widget");
		this.layout = this.parent_widget ? this.parent_widget.layout : null;
		/* Setup params */
		this.component = params.has("component") ? params.get("component") : this.component;
	}
	
	
	/**
	 * Init widget settings
	 */
	initWidget(params)
	{
	}
	
	
	/**
	 * Serialize object
	 */
	serialize(serializer, data)
	{
		serializer.process(this, "component", data);
	}
	
	
	/**
	 * Load widget data
	 */
	async loadData(container)
	{
	}
	
	
	/**
	 * Build page title
	 */
	buildTitle(container)
	{
	}
	
	
	/**
	 * Create widget
	 */
	createWidget(class_name, params)
	{
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		if (params == undefined) params = null;
		if (params == null) params = new Map();
		if (!params.has("parent_widget")) params.set("parent_widget", this);
		let widget = rtl.newInstance(class_name, Vector.create([params]));
		return widget;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Listener = use("Runtime.Listener");
		this.layout = null;
		this.parent_widget = null;
		this.listener = new Listener(this);
		this.component = "";
	}
	static getClassName(){ return "Runtime.BaseModel"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return ["Runtime.SerializeInterface"]; }
};
use.add(Runtime.BaseModel);
module.exports = {
	"BaseModel": Runtime.BaseModel,
};