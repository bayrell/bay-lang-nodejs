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
Runtime.RenderContainer = class extends use("Runtime.BaseObject")
{
	/**
	 * Create layout
	 */
	createLayout(layout_name)
	{
		const RuntimeHook = use("Runtime.Hooks.RuntimeHook");
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		let class_name = "Runtime.BaseLayout";
		/* Get layout params */
		let params = Runtime.rtl.getContext().hook(RuntimeHook.LAYOUT_NAME, Map.create({
			"class_name": class_name,
			"layout_name": layout_name,
		}));
		this.layout = rtl.newInstance(params.get("class_name"), Vector.create([params]));
		this.layout.name = layout_name;
		/* Call create layout */
		Runtime.rtl.getContext().hook(RuntimeHook.CREATE_LAYOUT, Map.create({
			"container": this,
		}));
		return this.layout;
	}
	
	
	/**
	 * Change layout
	 */
	changeLayout(layout_name)
	{
		const Map = use("Runtime.Map");
		const RuntimeHook = use("Runtime.Hooks.RuntimeHook");
		if (this.layout && this.layout.name == layout_name) return;
		/* Save widgets */
		let old_widgets = this.layout ? this.layout.widgets : new Map();
		/* Create new layout */
		this.createLayout(layout_name);
		/* Restore widgets */
		let keys = rtl.list(old_widgets.keys());
		for (let i = 0; i < keys.count(); i++)
		{
			let key = keys.get(i);
			let widget = old_widgets.get(key);
			widget.parent_widget = this.layout;
			this.layout.widgets.set(key, widget);
		}
		/* Restore storage */
		if (old_widgets.has("storage")) this.layout.storage = old_widgets.get("storage");
		/* Call create layout */
		Runtime.rtl.getContext().hook(RuntimeHook.CHANGE_LAYOUT, Map.create({
			"container": this,
		}));
	}
	
	
	/**
	 * Resolve container
	 */
	async resolve()
	{
	}
	
	
	/**
	 * Render page model
	 */
	async renderPageModel(model_name, params)
	{
		if (params == undefined) params = null;
		/* Set page model */
		this.layout.setPageModel(model_name, params);
		/* Action index */
		let page_model = this.layout.getPageModel();
		if (page_model)
		{
			await page_model.loadData(this);
			if (page_model == this.layout.getPageModel()) page_model.buildTitle(this);
		}
	}
	
	
	/**
	 * Load data
	 */
	async loadData()
	{
		await this.layout.loadData();
	}
	
	
	/**
	 * Returns data
	 */
	getData()
	{
		const Map = use("Runtime.Map");
		const RuntimeHook = use("Runtime.Hooks.RuntimeHook");
		let layout_data = rtl.serialize(this.layout);
		let data = Map.create({
			"modules": Runtime.rtl.getContext().modules,
			"class": this.layout.getClassName(),
			"layout": layout_data,
			"environments": Map.create({
				"CLOUD_ENV": Runtime.rtl.getContext().env("CLOUD_ENV"),
				"DEBUG": Runtime.rtl.getContext().env("DEBUG"),
				"LOCALE": Runtime.rtl.getContext().env("LOCALE"),
				"TZ": Runtime.rtl.getContext().env("TZ"),
				"TZ_OFFSET": Runtime.rtl.getContext().env("TZ_OFFSET"),
			}),
		});
		let res = Runtime.rtl.getContext().hook(RuntimeHook.CREATE_CONTAINER_DATA, Map.create({
			"container": this,
			"data": data,
		}));
		return res.get("data");
	}
	
	
	/**
	 * Render app
	 */
	renderApp()
	{
		let component = rtl.newInstance(this.layout.component);
		component.container = this;
		component.layout = this.layout;
		let vdom = component.renderApp();
		return vdom.render();
	}
	
	
	/**
	 * Render layout
	 */
	render()
	{
		const VirtualDom = use("Runtime.VirtualDom");
		const Map = use("Runtime.Map");
		let vdom = new VirtualDom();
		vdom.setName(this.layout.component);
		vdom.setAttrs(Map.create({"layout": this.layout}));
		return vdom.render();
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.layout = null;
	}
	static getClassName(){ return "Runtime.RenderContainer"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.RenderContainer);
module.exports = {
	"RenderContainer": Runtime.RenderContainer,
};