"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const rs = use("Runtime.rs");
/*
!
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
		this.layout = rtl.newInstance(params.get("class_name"), new Vector(params));
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
			page_model.buildTitle(this);
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
		const Serializer = use("Runtime.Serializer");
		const Map = use("Runtime.Map");
		let serializer = new Serializer();
		let layout_data = serializer.encode(this.layout);
		return Map.create({
			"modules": Runtime.rtl.getContext().modules,
			"layout": layout_data,
		});
	}
	
	
	/**
	 * Render layout
	 */
	render()
	{
		const Vector = use("Runtime.Vector");
		const VirtualDom = use("Runtime.VirtualDom");
		const Map = use("Runtime.Map");
		const RenderContent = use("Runtime.Providers.RenderContent");
		let content = new Vector();
		let vdom = new VirtualDom();
		vdom.setName(this.layout.component);
		vdom.setAttrs(Map.create({"layout": this.layout}));
		let provider = new RenderContent();
		provider.render(vdom, content);
		return rs.join("", content);
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