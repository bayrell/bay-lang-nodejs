"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
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
if (typeof BayLang.OpCodes == 'undefined') BayLang.OpCodes = {};
BayLang.OpCodes.OpModule = class extends use("BayLang.OpCodes.BaseOpCode")
{
	/**
	 * Serialize object
	 */
	serialize(serializer, data)
	{
		super.serialize(serializer, data);
		serializer.process(this, "is_component", data);
		serializer.process(this, "items", data);
		serializer.process(this, "uses", data);
	}
	
	
	/**
	 * Add module
	 */
	addModule(class_name, alias_name, is_component)
	{
		const lib = use("Runtime.lib");
		const OpUse = use("BayLang.OpCodes.OpUse");
		const Map = use("Runtime.Map");
		if (alias_name == undefined) alias_name = "";
		if (is_component == undefined) is_component = true;
		if (alias_name != "")
		{
			this.uses.set(alias_name, class_name);
		}
		/* Add op_code */
		let pos = this.items.find(lib.isInstance("BayLang.OpCodes.OpNamespace"));
		let op_code = new OpUse(Map.create({
			"alias": alias_name,
			"name": class_name,
			"is_component": is_component,
		}));
		if (pos != -1)
		{
			pos = pos + 1;
			while (pos < this.items.count())
			{
				let item = this.items.get(pos);
				if (item == null) break;
				if (!(item instanceof OpUse)) break;
				if (rs.compare(class_name, item.name) == -1) break;
				pos = pos + 1;
			}
			this.items.insert(pos, op_code);
		}
		else
		{
			this.items.prepend(op_code);
		}
	}
	
	
	/**
	 * Has module
	 */
	hasModule(alias_name){ return this.uses.has(alias_name); }
	
	
	/**
	 * Find alias name
	 */
	findModule(class_name)
	{
		let keys = this.uses.keys();
		for (let i = 0; i < keys.count(); i++)
		{
			let key_name = keys.get(i);
			if (this.uses.get(key_name) == class_name) return key_name;
		}
		return null;
	}
	
	
	/**
	 * Find class
	 */
	findClass(){ const lib = use("Runtime.lib");return this.items ? this.items.findItem(lib.isInstance("BayLang.OpCodes.OpDeclareClass")) : null; }
	
	
	/**
	 * Find class by name
	 */
	findClassByName(name)
	{
		return this.items.findItem((item) =>
		{
			const OpDeclareClass = use("BayLang.OpCodes.OpDeclareClass");
			if (!(item instanceof OpDeclareClass)) return false;
			if (item.name == name) return false;
			return true;
		});
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.uses = null;
		this.items = null;
		this.is_component = false;
	}
	static getClassName(){ return "BayLang.OpCodes.OpModule"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.OpCodes.OpModule);
module.exports = {
	"OpModule": BayLang.OpCodes.OpModule,
};