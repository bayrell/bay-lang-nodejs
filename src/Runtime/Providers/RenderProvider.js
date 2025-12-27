"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const rs = use("Runtime.rs");
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
if (typeof Runtime.Providers == 'undefined') Runtime.Providers = {};
Runtime.Providers.RenderProvider = class extends use("Runtime.BaseProvider")
{
	/**
	 * Create layout
	 */
	createLayout(app_data)
	{
		const Serializer = use("Runtime.Serializer");
		let layout_data = app_data.get("layout");
		let class_name = layout_data.get("__class_name__");
		let layout = rtl.newInstance(class_name);
		let serializer = new Serializer();
		serializer.assign(layout, layout_data);
		return window["Vue"].reactive(layout);
	}
	
	
	/**
	 * Create App
	 */
	createApp(layout)
	{
		const Map = use("Runtime.Map");
		let app = null;
		let registerLayout = null;
		registerLayout = (layout) =>
		{
			return {
				install: () => {
					app.config.globalProperties.$layout = layout;
				},
			};
		};
		let component = rtl.findClass(layout.component);
		let props = new Map();
		let Vue = window["Vue"];
		if (this.enable_ssr)
		{
			app = Vue.createSSRApp(component, props);
		}
		else
		{
			app = Vue.createApp(component, props);
		}
		app.use(registerLayout(layout));
		return app;
	}
	
	
	/**
	 * Mount
	 */
	mount(app_data, element)
	{
		const RuntimeHook = use("Runtime.Hooks.RuntimeHook");
		const Map = use("Runtime.Map");
		let layout = this.createLayout(app_data);
		let app = this.createApp(layout);
		app.mount(element, true);
		Runtime.rtl.getContext().hook(RuntimeHook.MOUNT, Map.create({
			"app": app,
			"layout": layout,
			"data": app_data,
		}));
		return Map.create({
			"app": app,
			"layout": layout,
		});
	}
	
	
	/**
	 * Add replace component
	 */
	addComponent(component, name)
	{
		this.components.set(component, name);
	}
	
	
	/**
	 * Returns find element
	 */
	findElement(vdom)
	{
		if (vdom.is_component)
		{
			let name = vdom.name;
			if (this.components.has(name)) name = this.components.get(name);
			return rtl.findClass(name);
		}
		return vdom.name;
	}
	
	
	/**
	 * Render
	 */
	render(vdom)
	{
		const VirtualDom = use("Runtime.VirtualDom");
		const Vector = use("Runtime.Vector");
		const Map = use("Runtime.Map");
		if (!(vdom instanceof VirtualDom)) return vdom;
		let content = Vector.create([]);
		if (!vdom.attrs.has("@raw"))
		{
			for (let i = 0; i < vdom.items.count(); i++)
			{
				let item = vdom.items.get(i);
				content.push(this.render(item));
			}
		}
		let h = window["Vue"].h;
		if (vdom.name == "")
		{
			if (content.count() == 1) return content.get(0);
			return content;
		}
		let children = content;
		if (vdom.is_component)
		{
			let slots = vdom.slots.map((f) =>
			{
				return () =>
				{
					let vdom = f();
					return this.render(vdom);
				};
			});
			children = slots.toObject();
		}
		if (children instanceof Vector) children = children.flatten();
		let attrs = vdom.attrs;
		if (attrs instanceof Map)
		{
			attrs = attrs.mapWithKeys((value, key) =>
			{
				const Vector = use("Runtime.Vector");
				if (key == "@ref") key = "ref";
				return Vector.create([value, key]);
			}).filter((value, key) => { return rs.charAt(key, 0) != "@"; });
			attrs = attrs.toObject();
			if (vdom.attrs.has("@raw"))
			{
				attrs["innerHTML"] = vdom.attrs.get("@raw");
			}
		}
		let name = this.findElement(vdom);
		return h(name, attrs, children);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Map = use("Runtime.Map");
		this.enable_ssr = true;
		this.components = new Map();
	}
	static getClassName(){ return "Runtime.Providers.RenderProvider"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Providers.RenderProvider);
module.exports = {
	"RenderProvider": Runtime.Providers.RenderProvider,
};