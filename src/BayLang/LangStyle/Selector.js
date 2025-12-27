"use strict;"
const use = require('bay-lang').use;
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
if (typeof BayLang == 'undefined') BayLang = {};
if (typeof BayLang.LangStyle == 'undefined') BayLang.LangStyle = {};
BayLang.LangStyle.Selector = class extends use("Runtime.BaseObject")
{
	/**
	 * Copy selector
	 */
	copy()
	{
		let item = new BayLang.LangStyle.Selector();
		item.path = this.path.slice();
		item.media = this.media.slice();
		item.css_hash = this.css_hash;
		return item;
	}
	
	
	/**
	 * Returns media
	 */
	getMedia(){ return rs.join(" ", this.media); }
	
	
	/**
	 * Returns selector
	 */
	getSelector(){ return rs.join(" ", this.path); }
	
	
	/**
	 * Add hash
	 */
	static addHash(selector, css_hash)
	{
		let selectors = rs.split(",", selector);
		for (let i = 0; i < selectors.count(); i++)
		{
			let selector_item = selectors.get(i);
			let items = rs.split(" ", rs.trim(selector_item));
			let item = items.get(0);
			let arr = rs.split(":", item);
			let prefix = arr.get(0);
			let postfix = rs.join(":", arr.slice(1));
			if (postfix != "") postfix = ":" + String(postfix);
			items.set(0, prefix + String(".h-") + String(css_hash) + String(postfix));
			selectors.set(i, rs.join(" ", items));
		}
		return rs.join(", ", selectors);
	}
	
	
	/**
	 * Concat selector
	 */
	concat(last_item, selector)
	{
		const Vector = use("Runtime.Vector");
		let result = Vector.create([]);
		let last_items = rs.split(",", last_item);
		for (let i = 0; i < last_items.count(); i++)
		{
			let last_item = rs.trim(last_items.get(i));
			let arr = rs.split(",", selector);
			for (let j = 0; j < arr.count(); j++)
			{
				let selector_item = rs.trim(arr.get(j));
				let index = rs.indexOf(selector_item, "&");
				if (index == -1)
				{
					if (last_item)
					{
						result.push(last_item + String(" ") + String(selector_item));
					}
					else
					{
						result.push(selector_item);
					}
				}
				else
				{
					let prefix = rs.substr(selector_item, 0, index);
					let postfix = rs.substr(selector_item, index + 1);
					let css_hash = ".h-" + String(this.css_hash);
					if (rs.indexOf(last_item, css_hash) >= 0)
					{
						last_item = rs.replace(css_hash, "", last_item);
						last_item = this.constructor.addHash(last_item + String(postfix), this.css_hash);
					}
					else
					{
						last_item = last_item + String(postfix);
					}
					result.push(prefix + String(last_item));
				}
			}
		}
		return rs.join(", ", result);
	}
	
	
	/**
	 * Combine selector
	 */
	add(selector)
	{
		const Vector = use("Runtime.Vector");
		if (rs.charAt(selector, 0) == "@")
		{
			this.media.push(selector);
		}
		else
		{
			let last_item = rs.join(" ", this.path);
			last_item = this.concat(last_item, selector);
			this.path = Vector.create([last_item]);
		}
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Vector = use("Runtime.Vector");
		this.path = Vector.create([]);
		this.media = Vector.create([]);
		this.css_hash = "";
	}
	static getClassName(){ return "BayLang.LangStyle.Selector"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangStyle.Selector);
module.exports = {
	"Selector": BayLang.LangStyle.Selector,
};