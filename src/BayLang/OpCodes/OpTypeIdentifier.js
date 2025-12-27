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
BayLang.OpCodes.OpTypeIdentifier = class extends use("BayLang.OpCodes.BaseOpCode")
{
	/**
	 * Serialize object
	 */
	serialize(serializer, data)
	{
		super.serialize(serializer, data);
		serializer.process(this, "entity_name", data);
		serializer.process(this, "generics", data);
	}
	
	
	/**
	 * Create Type Identifier
	 */
	static create(name)
	{
		const Map = use("Runtime.Map");
		const OpEntityName = use("BayLang.OpCodes.OpEntityName");
		const Vector = use("Runtime.Vector");
		const OpIdentifier = use("BayLang.OpCodes.OpIdentifier");
		return new BayLang.OpCodes.OpTypeIdentifier(Map.create({
			"entity_name": new OpEntityName(Map.create({
				"items": Vector.create([
					new OpIdentifier(Map.create({
						"value": name,
					})),
				]),
			})),
		}));
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.op = "op_type_identifier";
		this.entity_name = null;
		this.generics = null;
	}
	static getClassName(){ return "BayLang.OpCodes.OpTypeIdentifier"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.OpCodes.OpTypeIdentifier);
module.exports = {
	"OpTypeIdentifier": BayLang.OpCodes.OpTypeIdentifier,
};