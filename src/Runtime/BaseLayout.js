"use strict;"
const use = require('bay-lang').use;
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
Runtime.BaseLayout = class extends use("Runtime.BaseModel")
{
	/**
	 * Init params
	 */
	initParams(params)
	{
		super.initParams(params);
		this.layout = this;
	}
	
	
	/**
	 * Init widget settings
	 */
	initWidget(params)
	{
		super.initWidget(params);
		/* Init storage */
		this.initStorage();
	}
	
	
	/**
	 * Init storage
	 */
	initStorage()
	{
		this.storage = this.addWidget("Runtime.BaseStorage");
	}
	
	
	/**
	 * Serialize object
	 */
	serialize(serializer, data)
	{
		super.serialize(serializer, data);
		serializer.process(this, "components", data);
		serializer.process(this, "current_page_model", data);
		serializer.process(this, "lang", data);
		serializer.process(this, "title", data);
	}
	
	
	/**
	 * Add component
	 */
	addComponent(class_name)
	{
		this.components.push(class_name);
	}
	
	
	/**
	 * Returns page model
	 */
	getPageModel(){ return this.widgets.get(this.current_page_model); }
	
	
	/**
	 * Set page model
	 */
	setPageModel(class_name, params)
	{
		const Map = use("Runtime.Map");
		if (params == undefined) params = null;
		if (!params) params = new Map();
		this.current_page_model = class_name;
		let page = this.getWidget(class_name);
		if (!page)
		{
			params.set("widget_name", class_name);
			page = this.addWidget(class_name, params);
		}
		return page;
	}
	
	
	/**
	 * Set page title
	 */
	setPageTitle(title, full_title)
	{
		const RuntimeHook = use("Runtime.Hooks.RuntimeHook");
		const Map = use("Runtime.Map");
		if (full_title == undefined) full_title = false;
		let d = Runtime.rtl.getContext().hook(RuntimeHook.TITLE, Map.create({
			"layout": this,
			"title": title,
			"title_orig": title,
			"full_title": full_title,
		}));
		this.title = d.get("title");
	}
	
	
	/**
	 * Returns required components
	 */
	static getRequiredComponents(component, result, hash)
	{
		const Method = use("Runtime.Method");
		if (hash.has(component)) return;
		hash.set(component, true);
		let f = new Method(component, "getRequiredComponents");
		if (f.exists())
		{
			let items = f.apply();
			for (let i = 0; i < items.count(); i++)
			{
				let name = items.get(i);
				if (!hash.has(name))
				{
					this.getRequiredComponents(name, result, hash);
				}
			}
		}
		result.push(component);
	}
	
	
	/**
	 * Returns all components
	 */
	getComponents()
	{
		const Map = use("Runtime.Map");
		const RuntimeHook = use("Runtime.Hooks.RuntimeHook");
		const Vector = use("Runtime.Vector");
		let hash = new Map();
		let res = Runtime.rtl.getContext().hook(RuntimeHook.COMPONENTS, Map.create({
			"components": this.components.slice(),
		}));
		let result_components = new Vector();
		let components = res.get("components");
		for (let i = 0; i < components.count(); i++)
		{
			let class_name = components.get(i);
			this.constructor.getRequiredComponents(class_name, result_components, hash);
		}
		return result_components;
	}
	
	
	/**
	 * Returns style
	 */
	getStyle()
	{
		const Vector = use("Runtime.Vector");
		const Method = use("Runtime.Method");
		let content = new Vector();
		let components = this.getComponents();
		for (let i = 0; i < components.count(); i++)
		{
			let class_name = components.get(i);
			let f = new Method(class_name, "getComponentStyle");
			if (!f.exists()) continue;
			content.push(f.apply());
		}
		return rs.join("", content);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Vector = use("Runtime.Vector");
		this.storage = null;
		this.components = new Vector();
		this.component = "Runtime.DefaultLayout";
		this.current_page_model = "";
		this.name = "";
		this.lang = "en";
		this.title = "";
		this.theme = "light";
	}
	static getClassName(){ return "Runtime.BaseLayout"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.BaseLayout);
module.exports = {
	"BaseLayout": Runtime.BaseLayout,
};