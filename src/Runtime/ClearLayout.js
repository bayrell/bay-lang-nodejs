"use strict;"
const use = require('bay-lang').use;
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
Runtime.ClearLayout = {
	name: "Runtime.ClearLayout",
	extends: Runtime.Component,
	methods:
	{
		renderHeader: function()
		{
			const rs = use("Runtime.rs");
			const componentHash = rs.getComponentHash(this.getClassName());
			let __v = new Runtime.VirtualDom(this);
			
			/* Element title */
			let __v0 = __v.element("title");
			__v0.push(this.layout.title);
			
			/* Element meta */
			__v.element("meta", new Runtime.Map({"name": "viewport", "content": "width=device-width, initial-scale=1.0"}));
			
			return __v;
		},
		renderStyle: function()
		{
			const rs = use("Runtime.rs");
			const componentHash = rs.getComponentHash(this.getClassName());
			let __v = new Runtime.VirtualDom(this);
			
			const BaseLayout = use("Runtime.BaseLayout");
			let style = BaseLayout.getStyle(this.getComponents());
			if (style)
			{
				/* Element style */
				let __v0 = __v.element("style");
				__v0.push(style);
			}
			
			return __v;
		},
		renderFooter: function()
		{
			const rs = use("Runtime.rs");
			const componentHash = rs.getComponentHash(this.getClassName());
			let __v = new Runtime.VirtualDom(this);
			return __v;
		},
		renderCurrentPage: function()
		{
			const rs = use("Runtime.rs");
			const componentHash = rs.getComponentHash(this.getClassName());
			let __v = new Runtime.VirtualDom(this);
			
			if (this.layout.current_component != "")
			{
				let component = this.layout.current_component;
				
				/* Element component */
				__v.element(component, new Runtime.Map({}).concat(this.layout.component_props));
			}
			else
			{
				let model = this.layout.getPageModel();
				let class_name = model ? model.component : "";
				if (class_name)
				{
					/* Element class_name */
					__v.element(class_name, new Runtime.Map({"model": model}));
				}
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
		/**
		 * Returns layout components
		 */
		getComponents: function()
		{
			const Map = use("Runtime.Map");
			const Vector = use("Runtime.Vector");
			const BaseLayout = use("Runtime.BaseLayout");
			let hash = new Map();
			let result_components = Vector.create([]);
			let components = this.layout.components.slice();
			for (let i = 0; i < components.count(); i++)
			{
				let class_name = components.get(i);
				BaseLayout.getRequiredComponents(class_name, result_components, hash);
			}
			return components;
		},
		getClassName: function(){ return "Runtime.ClearLayout"; },
	},
	getComponentStyle: function(){ return ""; },
	getRequiredComponents: function(){ return new Runtime.Vector(); },
};
use.add(Runtime.ClearLayout);
module.exports = {
	"ClearLayout": Runtime.ClearLayout,
};