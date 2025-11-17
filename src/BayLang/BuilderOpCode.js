"use strict;"
const use = require('bay-lang').use;
/*
!
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
BayLang.BuilderOpCode = class extends use("Runtime.BaseObject")
{
	/**
	 * Add slot
	 */
	addSlot(op_code, name)
	{
		const OpHtmlSlot = use("BayLang.OpCodes.OpHtmlSlot");
		const Map = use("Runtime.Map");
		const OpHtmlItems = use("BayLang.OpCodes.OpHtmlItems");
		let slot = new OpHtmlSlot(Map.create({
			"name": name,
			"items": new OpHtmlItems(),
		}));
		op_code.items.items.push(slot);
		return slot;
	}
	
	
	/**
	 * Add tag
	 */
	addTag(op_code, name)
	{
		const OpHtmlTag = use("BayLang.OpCodes.OpHtmlTag");
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		const OpHtmlItems = use("BayLang.OpCodes.OpHtmlItems");
		let tag = new OpHtmlTag(Map.create({
			"attrs": new Vector(),
			"items": new OpHtmlItems(),
			"tag_name": name,
		}));
		op_code.items.items.push(tag);
		return tag;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "BayLang.BuilderOpCode"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.BuilderOpCode);
module.exports = {
	"BuilderOpCode": BayLang.BuilderOpCode,
};