"use strict;"
const use = require('bay-lang').use;
/*
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
 *
*/
if (typeof Runtime == 'undefined') Runtime = {};
Runtime.Component = {
	name: "Runtime.Component",
	props: {
		model: {default: null},
		class: {default: ""},
	},
	methods:
	{
		render: function()
		{
			const rs = use("Runtime.rs");
			const componentHash = rs.getComponentHash(this.getClassName());
			let __v = new Runtime.VirtualDom(this);
			return __v;
		},
		/**
		 * Render slot
		 */
		renderSlot: function(slot_name)
		{
			var f = this.$slots[slot_name];
	return f ? f() : null;
		},
		/**
		 * Returns ref
		 */
		getRef: function(name)
		{
			return this.$refs[name];
		},
		hash: function(s, f){ if (f == undefined) f = null;return f; },
		getClassName: function(){ return "Runtime.Component"; },
	},
	computed:
	{
		/**
		 * Returns layout
		 */
		layout: function()
		{
			return this.$layout;
		},
	},
	render: function()
	{
		let vdom = this.render();
		return Runtime.rtl.getContext().provider("render").render(vdom);
	},
	getComponentStyle: function(){ return ""; },
	getRequiredComponents: function(){ return new Runtime.Vector(); },
};
use.add(Runtime.Component);
module.exports = {
	"Component": Runtime.Component,
};