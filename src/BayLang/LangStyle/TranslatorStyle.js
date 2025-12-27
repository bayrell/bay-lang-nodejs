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
if (typeof BayLang == 'undefined') BayLang = {};
if (typeof BayLang.LangStyle == 'undefined') BayLang.LangStyle = {};
BayLang.LangStyle.TranslatorStyle = class extends use("Runtime.BaseObject")
{
	/**
	 * Constructor
	 */
	constructor(translator)
	{
		super();
		this.translator = translator;
	}
	
	
	/**
	 * Add selector content
	 */
	addSelectorContent(result, media, content)
	{
		const Vector = use("Runtime.Vector");
		if (!result.has(media)) result.set(media, Vector.create([]));
		let items = result.get(media);
		if (rtl.isString(content)) items.push(content);
		else if (content instanceof Vector) items.appendItems(content);
	}
	
	
	/**
	 * Translate CSS
	 */
	OpHtmlCSS(op_code, result, selector, is_global)
	{
		const Vector = use("Runtime.Vector");
		const Map = use("Runtime.Map");
		const Selector = use("BayLang.LangStyle.Selector");
		const OpHtmlCSS = use("BayLang.OpCodes.OpHtmlCSS");
		const OpHtmlCSSAttribute = use("BayLang.OpCodes.OpHtmlCSSAttribute");
		let item_content = Vector.create([]);
		let item_result = new Map();
		/* Get hash */
		let css_hash = rs.getCssHash(this.translator.current_class_name);
		/* Add selector */
		if (!is_global && rs.charAt(op_code.selector, 0) != "@")
		{
			selector.add(Selector.addHash(op_code.selector, css_hash));
			is_global = true;
		}
		else
		{
			selector.add(op_code.selector);
		}
		let media = selector.getMedia();
		let selector_path = selector.getSelector();
		for (let i = 0; i < op_code.items.count(); i++)
		{
			let op_code_item = op_code.items.get(i);
			if (op_code_item instanceof OpHtmlCSS)
			{
				this.OpHtmlCSS(op_code_item, item_result, selector.copy(), is_global);
			}
			else if (op_code_item instanceof OpHtmlCSSAttribute)
			{
				item_content.push(op_code_item.key + String(": ") + String(op_code_item.value) + String(";"));
			}
		}
		if (item_content.count() > 0)
		{
			let content = selector_path + String("{") + String(rs.substr(rs.join("", item_content), 0, -1)) + String("}");
			this.addSelectorContent(result, media, content);
		}
		let keys = rtl.list(item_result.keys());
		for (let i = 0; i < keys.count(); i++)
		{
			let key = keys.get(i);
			this.addSelectorContent(result, key, item_result.get(key));
		}
	}
	
	
	/**
	 * Translate HTML Style
	 */
	OpHtmlStyle(op_code, result)
	{
		const Selector = use("BayLang.LangStyle.Selector");
		const Map = use("Runtime.Map");
		let selector = new Selector();
		selector.css_hash = rs.getCssHash(this.translator.current_class_name);
		for (let i = 0; i < op_code.content.count(); i++)
		{
			let op_code_item = op_code.content.get(i);
			let item_result = new Map();
			this.OpHtmlCSS(op_code_item, item_result, selector.copy(), op_code.is_global);
			let media_keys = rtl.list(item_result.keys());
			for (let j = 0; j < media_keys.count(); j++)
			{
				let media = media_keys.get(j);
				let items = item_result.get(media);
				let content = rs.join("", items);
				if (media != "") result.push(rs.trim(media) + String("{") + String(content) + String("}"));
				else result.push(content);
			}
		}
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.translator = null;
	}
	static getClassName(){ return "BayLang.LangStyle.TranslatorStyle"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangStyle.TranslatorStyle);
module.exports = {
	"TranslatorStyle": BayLang.LangStyle.TranslatorStyle,
};