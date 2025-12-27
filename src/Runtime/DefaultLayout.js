"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
/*
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
 *
*/
if (typeof Runtime == 'undefined') Runtime = {};
Runtime.DefaultLayout = {
	name: "Runtime.DefaultLayout",
	extends: Runtime.Component,
	data: function()
	{
		return {
			container: null,
		};
	},
	methods:
	{
		renderCurrentPage: function()
		{
			const rs = use("Runtime.rs");
			const componentHash = rs.getComponentHash(this.getClassName());
			let __v = new Runtime.VirtualDom(this);
			
			let model = this.layout.getPageModel();
			let class_name = model ? model.component : "";
			if (class_name)
			{
				/* Element class_name */
				__v.element(class_name, new Runtime.Map({"model": model}));
			}
			
			return __v;
		},
		render: function()
		{
			const rs = use("Runtime.rs");
			const componentHash = rs.getComponentHash(this.getClassName());
			let __v = new Runtime.VirtualDom(this);
			
			__v.push(this.renderCurrentPage());
			
			return __v;
		},
		renderComponents: function(components)
		{
			const rs = use("Runtime.rs");
			const componentHash = rs.getComponentHash(this.getClassName());
			let __v = new Runtime.VirtualDom(this);
			
			const VirtualDom = use("Runtime.VirtualDom");
			for (let i = 0; i < components.count(); i++)
			{
				let class_name = components.get(i);
				if (class_name instanceof VirtualDom)
				{
					__v.push(class_name);
				}
				else if (rtl.isString(class_name))
				{
					/* Element class_name */
					__v.element(class_name);
				}
			}
			
			return __v;
		},
		renderHeader: function()
		{
			const rs = use("Runtime.rs");
			const componentHash = rs.getComponentHash(this.getClassName());
			let __v = new Runtime.VirtualDom(this);
			
			const RuntimeHook = use("Runtime.Hooks.RuntimeHook");
			/* Element title */
			let __v0 = __v.element("title");
			__v0.push(this.layout.title);
			
			/* Element meta */
			__v.element("meta", new Runtime.Map({"name": "viewport", "content": "width=device-width, initial-scale=1.0"}));
			__v.push(this.renderComponents(this.getComponents(RuntimeHook.LAYOUT_HEADER)));
			
			return __v;
		},
		renderFooter: function()
		{
			const rs = use("Runtime.rs");
			const componentHash = rs.getComponentHash(this.getClassName());
			let __v = new Runtime.VirtualDom(this);
			
			const RuntimeHook = use("Runtime.Hooks.RuntimeHook");
			__v.push(this.renderComponents(this.getComponents(RuntimeHook.LAYOUT_FOOTER)));
			
			/* Element script */
			let __v0 = __v.element("script");
			__v0.push("var app_data =");
			__v0.push(rtl.jsonEncode(this.container.getData()));
			__v0.push(";\n\t\tRuntime.rtl.mount(app_data, document.querySelector(\".root_container\"), function (result){\n\t\t\twindow[\"app\"] = result.get(\"app\");\n\t\t\twindow[\"app_layout\"] = result.get(\"layout\");\n\t\t});");
			
			return __v;
		},
		renderStyle: function()
		{
			const rs = use("Runtime.rs");
			const componentHash = rs.getComponentHash(this.getClassName());
			let __v = new Runtime.VirtualDom(this);
			
			/* Element style */
			let __v0 = __v.element("style");
			__v0.push(this.layout.getStyle());
			
			return __v;
		},
		renderApp: function()
		{
			const rs = use("Runtime.rs");
			const componentHash = rs.getComponentHash(this.getClassName());
			let __v = new Runtime.VirtualDom(this);
			
			/* Element html */
			let __v0 = __v.element("html", new Runtime.Map({"lang": this.layout.lang}));
			
			/* Element head */
			let __v1 = __v0.element("head");
			__v1.push(this.renderHeader());
			__v1.push(this.renderStyle());
			
			/* Element body */
			let __v2 = __v0.element("body", new Runtime.Map({"class": rs.className(["theme_" + String(this.layout.theme), componentHash])}));
			
			/* Element div */
			let __v3 = __v2.element("div", new Runtime.Map({"class": rs.className(["root_container", componentHash])}));
			__v3.push(this.render());
			__v2.push(this.renderFooter());
			
			return __v;
		},
		getComponents: function(name)
		{
			const Map = use("Runtime.Map");
			const Vector = use("Runtime.Vector");
			let d = Runtime.rtl.getContext().hook(name, Map.create({
				"layout": this.layout,
				"components": Vector.create([]),
			}));
			return d.get("components");
		},
		getClassName: function(){ return "Runtime.DefaultLayout"; },
	},
	getComponentStyle: function(){ return ""; },
	getRequiredComponents: function(){ return new Runtime.Vector(); },
};
use.add(Runtime.DefaultLayout);
module.exports = {
	"DefaultLayout": Runtime.DefaultLayout,
};