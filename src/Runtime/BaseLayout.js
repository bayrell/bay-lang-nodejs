"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
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
		this.storage = this.createWidget("Runtime.BaseStorage");
	}
	
	
	/**
	 * Serialize object
	 */
	static serialize(rules)
	{
		const StringType = use("Runtime.Serializer.StringType");
		const VectorType = use("Runtime.Serializer.VectorType");
		const ObjectType = use("Runtime.Serializer.ObjectType");
		const Map = use("Runtime.Map");
		const MapType = use("Runtime.Serializer.MapType");
		super.serialize(rules);
		rules.addType("component_props", new StringType());
		rules.addType("components", new VectorType(new StringType()));
		rules.addType("current_component", new StringType());
		rules.addType("current_page_model", new StringType());
		rules.addType("lang", new StringType());
		rules.addType("theme", new StringType());
		rules.addType("title", new StringType());
		rules.addType("storage", new ObjectType(Map.create({"class_name": "Runtime.BaseStorage"})));
		rules.addType("pages", new MapType(new ObjectType(Map.create({
			"autocreate": true,
			"extends": "Runtime.BaseModel",
			"create": (layout, rules, data) =>
			{
				return layout.createWidget(rules.class_name, data);
			},
		}))));
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
	getPageModel(){ return this.pages.get(this.current_page_model); }
	
	
	/**
	 * Set page model
	 */
	setPageModel(class_name, params)
	{
		const Map = use("Runtime.Map");
		if (params == undefined) params = null;
		if (!params) params = new Map();
		this.current_page_model = class_name;
		let page = this.pages.get(class_name);
		if (!page)
		{
			page = this.createWidget(class_name, params);
			this.pages.set(class_name, page);
		}
		return page;
	}
	
	
	/**
	 * Set current page
	 */
	setCurrentPage(component_name, props)
	{
		if (props == undefined) props = null;
		this.current_component = component_name;
		this.component_props = props;
	}
	
	
	/**
	 * Set page title
	 */
	setPageTitle(title, full_title)
	{
		const RuntimeHook = use("Runtime.Hooks.RuntimeHook");
		const Map = use("Runtime.Map");
		if (full_title == undefined) full_title = false;
		let res = Runtime.rtl.getContext().hook(RuntimeHook.TITLE, Map.create({
			"layout": this,
			"title": title,
			"title_orig": title,
			"full_title": full_title,
		}));
		this.title = res.get("title");
	}
	
	
	/**
	 * Returns object
	 */
	get(name){ return this.storage.frontend.get(name); }
	
	
	/**
	 * Returns site name
	 */
	getSiteName(){ return ""; }
	
	
	/**
	 * Create url
	 */
	url(name, params)
	{
		if (params == undefined) params = null;
		let router = this.get("router");
		return router.url(name, params);
	}
	
	
	/**
	 * Send api
	 */
	sendApi(params)
	{
		let api = Runtime.rtl.getContext().provider("api");
		params.set("storage", this.storage.backend);
		return api.send(params);
	}
	
	
	/**
	 * Translate
	 */
	translate(text, params)
	{
		if (params == undefined) params = null;
		let s = text.has(this.lang) ? text.get(this.lang) : text.get(this.getDefaultLang());
		return rs.format(s, params);
	}
	
	
	/**
	 * Returns default lang
	 */
	getDefaultLang(){ return "en"; }
	
	
	/**
	 * Assets
	 */
	assets(path)
	{
		const RuntimeHook = use("Runtime.Hooks.RuntimeHook");
		const Map = use("Runtime.Map");
		let res = Runtime.rtl.getContext().hook(RuntimeHook.ASSETS, Map.create({
			"layout": this,
			"path": path,
		}));
		return res.get("path");
	}
	
	
	/**
	 * Returns required components
	 */
	static getRequiredComponents(component, result, hash)
	{
		const Method = use("Runtime.Method");
		if (hash.has(component)) return;
		let components = rtl.getParents(component, "Runtime.Component").filter((class_name) => { return !hash.has(class_name); });
		components.each((class_name) =>
		{
			hash.set(class_name, true);
		});
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
		result.appendItems(components);
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
		let result_components = Vector.create([]);
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
	static getStyle(components)
	{
		const Vector = use("Runtime.Vector");
		const Method = use("Runtime.Method");
		let content = Vector.create([]);
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
		const Map = use("Runtime.Map");
		this.storage = null;
		this.components = Vector.create([]);
		this.pages = new Map();
		this.component_props = new Map();
		this.component = "Runtime.DefaultLayout";
		this.current_component = "";
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