"use strict;"
const use = require('bay-lang').use;
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
if (typeof BayLang.OpCodes == 'undefined') BayLang.OpCodes = {};
BayLang.OpCodes.OpAssign = class extends use("BayLang.OpCodes.BaseOpCode")
{
	static KIND_ASSIGN = "assign";
	static KIND_DECLARE = "declare";
	static KIND_STRUCT = "struct";
	
	
	/**
	 * Serialize object
	 */
	static serialize(rules)
	{
		const ObjectType = use("Runtime.Serializer.ObjectType");
		const Map = use("Runtime.Map");
		const VectorType = use("Runtime.Serializer.VectorType");
		super.serialize(rules);
		rules.addType("flags", new ObjectType(Map.create({"class_name": "BayLang.OpCodes.OpFlags"})));
		rules.addType("pattern", new ObjectType(Map.create({"class_name": "BayLang.OpCodes.OpTypeIdentifier"})));
		rules.addType("items", new VectorType(new ObjectType(Map.create({
			"class_name": "BayLang.OpCodes.OpAssignValue",
		}))));
	}
	
	
	/**
	 * Returns true if static
	 */
	isStatic(){ return this.flags && (this.flags.isFlag("static") || this.flags.isFlag("const")); }
	
	
	/**
	 * Find variable
	 */
	findVariable(name)
	{
		return this.items.find((item) => { const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");return item.value instanceof OpIdentifier && item.value.value == name; });
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.op = "op_assign";
		this.flags = null;
		this.pattern = null;
		this.items = null;
	}
	static getClassName(){ return "BayLang.OpCodes.OpAssign"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.OpCodes.OpAssign);
module.exports = {
	"OpAssign": BayLang.OpCodes.OpAssign,
};