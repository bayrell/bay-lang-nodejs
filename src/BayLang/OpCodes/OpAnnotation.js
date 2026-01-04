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
BayLang.OpCodes.OpAnnotation = class extends use("BayLang.OpCodes.BaseOpCode")
{
	/**
	 * Serialize object
	 */
	static serialize(rules)
	{
		const OpCodeType = use("BayLang.OpCodes.OpCodeType");
		const ObjectType = use("Runtime.Serializer.ObjectType");
		const Map = use("Runtime.Map");
		super.serialize(rules);
		rules.addType("name", new OpCodeType());
		rules.addType("params", new ObjectType(Map.create({
			"class_name": "BayLang.OpCodes.OpDict",
		})));
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.op = "op_annotation";
		this.name = null;
		this.params = null;
	}
	static getClassName(){ return "BayLang.OpCodes.OpAnnotation"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.OpCodes.OpAnnotation);
module.exports = {
	"OpAnnotation": BayLang.OpCodes.OpAnnotation,
};