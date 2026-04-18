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
Runtime.Component = class extends use("Runtime.BaseObject")
{
	renderWidget(model, attrs)
	{
		const rs = use("Runtime.rs");
		const componentHash = rs.getComponentHash(this.constructor.getClassName());
		let __v = new Runtime.VirtualDom(this);
		
		const Map = use("Runtime.Map");
		if (model)
		{
			let component = model.component;
			if (!attrs)
			{
				attrs = new Map();
			}
			
			/* Element component */
			__v.element(component, new Runtime.Map({"model": model}).concat(attrs));
		}
		
		return __v;
	}
	
	
	render()
	{
		const rs = use("Runtime.rs");
		const componentHash = rs.getComponentHash(this.constructor.getClassName());
		let __v = new Runtime.VirtualDom(this);
		return __v;
	}
	
	
	/**
	 * Returns layout
	 */
	layout()
	{
		return this.$layout;
	}
	
	
	/**
	 * Returns true if slot is exists
	 */
	slot(name)
	{
		return this.$slots[name] != undefined;
	}
	
	
	/**
	 * Render slot
	 */
	renderSlot(slot_name, args)
	{
		if (args == undefined) args = null;
		if (!args) args = [];
	var f = this.$slots[slot_name];
	return f ? f.apply(null, args) : null;
	}
	
	
	/**
	 * Returns parent
	 */
	getParent()
	{
		return this.$parent;
	}
	
	
	/**
	 * Returns ref
	 */
	getRef(name)
	{
		return this.$refs[name];
	}
	
	
	/**
	 * Emit message
	 */
	emit(message)
	{
		message.src = this;
	this.$emit(message.name, message);
	}
	
	
	/**
	 * Next tick
	 */
	nextTick(f)
	{
		this.$nextTick(f);
	}
	
	
	
	hash(s, f){ if (f == undefined) f = null;return f; }
	
	
	render()
	{
		let vdom = this.render();
		return Runtime.rtl.getContext().provider("render").render(vdom);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.model = null;
		this.class = "";
		this.parent_component = null;
	}
	static getClassName(){ return "Runtime.Component"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getComputed(){ return ["layout"]; }
	static getComponentStyle(){ return ""; }
	static getRequiredComponents(){ return new Runtime.Vector(); }
};
use.add(Runtime.Component);
module.exports = {
	"Component": Runtime.Component,
};