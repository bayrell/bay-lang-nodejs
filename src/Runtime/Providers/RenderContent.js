"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
const rtl = use("Runtime.rtl");
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
if (typeof Runtime.Providers == 'undefined') Runtime.Providers = {};
Runtime.Providers.RenderContent = class extends use("Runtime.BaseObject")
{
	/**
	 * Render
	 */
	render(vdom, content, parent_vdom)
	{
		const VirtualDom = use("Runtime.VirtualDom");
		const Vector = use("Runtime.Vector");
		if (parent_vdom == undefined) parent_vdom = null;
		if (!vdom) return;
		if (!(vdom instanceof VirtualDom))
		{
			if (parent_vdom && (parent_vdom.name == "style" || parent_vdom.name == "script" || parent_vdom.is_raw))
			{
				content.push(vdom);
			}
			else content.push(rs.escapeHtml(vdom));
			return;
		}
		if (vdom.is_component)
		{
			let component = rtl.newInstance(vdom.name);
			component.layout = vdom.component ? vdom.component.layout : null;
			component._slots = vdom.slots;
			let keys = rtl.list(vdom.attrs.keys());
			for (let i = 0; i < keys.count(); i++)
			{
				let attr_name = keys.get(i);
				rtl.setAttr(component, attr_name, vdom.attrs.get(attr_name));
			}
			let item = component.render();
			this.render(item, content);
		}
		else
		{
			let item_result = new Vector();
			if (!vdom.attrs.has("@raw"))
			{
				for (let i = 0; i < vdom.items.count(); i++)
				{
					let item = vdom.items.get(i);
					this.render(item, item_result, vdom);
				}
			}
			else
			{
				item_result.push(vdom.attrs.get("@raw"));
			}
			if (vdom.name != "")
			{
				let attr_items = new Vector();
				if (vdom.attrs)
				{
					let keys = rtl.list(vdom.attrs.keys());
					for (let i = 0; i < keys.count(); i++)
					{
						let attr_name = keys.get(i);
						let value = rs.trim(vdom.attrs.get(attr_name));
						if (value == "") continue;
						if (rs.charAt(attr_name, 0) == "@") continue;
						attr_items.push(attr_name + String("=\"") + String(rs.escapeHtml(value)) + String("\""));
					}
				}
				let attrs = attr_items.count() > 0 ? " " + String(rs.join(" ", attr_items)) : "";
				if (vdom.name == "br" || vdom.name == "hr" || vdom.name == "link")
				{
					content.push("<" + String(vdom.name) + String(attrs) + String("/>"));
				}
				else
				{
					content.push("<" + String(vdom.name) + String(attrs) + String(">"));
					content.appendItems(item_result);
					content.push("</" + String(vdom.name) + String(">"));
				}
			}
			else
			{
				let is_fragment = vdom.is_render && vdom.items.count() > 1;
				if (is_fragment) content.push("<!--[-->");
				content.appendItems(item_result);
				if (is_fragment) content.push("<!--]-->");
			}
		}
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "Runtime.Providers.RenderContent"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Providers.RenderContent);
module.exports = {
	"RenderContent": Runtime.Providers.RenderContent,
};