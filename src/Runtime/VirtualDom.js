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
Runtime.VirtualDom = class extends use("Runtime.BaseObject")
{
	/**
	 * Constructor
	 */
	constructor(component)
	{
		if (component == undefined) component = null;
		super();
		this.component = component;
	}
	
	
	/**
	 * Returns true if tag_name is component
	 */
	static isComponent(tag_name)
	{
		if (tag_name == "") return false;
		let first = rs.substr(tag_name, 0, 1);
		return rs.upper(first) == first;
	}
	
	
	/**
	 * Set name
	 */
	setName(name)
	{
		this.name = name;
		this.is_component = this.constructor.isComponent(name);
	}
	
	
	/**
	 * Set attrs
	 */
	setAttrs(attrs)
	{
		if (attrs) this.attrs = attrs;
	}
	
	
	/**
	 * Add element
	 */
	element(name, attrs)
	{
		const Vector = use("Runtime.Vector");
		if (attrs == undefined) attrs = null;
		let item = this.constructor.newInstance(Vector.create([this.component]));
		item.setName(name);
		item.setAttrs(attrs);
		if (name == "script" || name == "style") item.is_raw = true;
		this.push(item);
		return item;
	}
	
	
	/**
	 * Push content
	 */
	push(content)
	{
		if (Array.isArray(content))
		{
			this.items.appendItems(content);
			return;
		}
		if (!(content instanceof Runtime.VirtualDom) && !rtl.isString(content))
		{
			content = rtl.toStr(content);
		}
		if (this.items.count() > 0 && rtl.isString(content))
		{
			let item = this.items.last();
			if (rtl.isString(item))
			{
				this.items.set(this.items.count() - 1, item + String(content));
				return;
			}
		}
		this.items.push(content);
	}
	
	
	/**
	 * Add slot
	 */
	slot(slot_name, content)
	{
		this.slots.set(slot_name, content);
	}
	
	
	/**
	 * Render vdom to string
	 */
	render()
	{
		const Vector = use("Runtime.Vector");
		const RenderContent = use("Runtime.Providers.RenderContent");
		let content = Vector.create([]);
		let provider = new RenderContent();
		provider.components = Runtime.rtl.getContext().provider("render").components;
		provider.render(this, content);
		return rs.join("", content);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		this.component = null;
		this.attrs = new Map();
		this.slots = new Map();
		this.items = Vector.create([]);
		this.is_raw = false;
		this.is_render = false;
		this.is_component = false;
		this.name = "";
	}
	static getClassName(){ return "Runtime.VirtualDom"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.VirtualDom);
module.exports = {
	"VirtualDom": Runtime.VirtualDom,
};