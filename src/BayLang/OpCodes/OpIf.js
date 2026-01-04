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
BayLang.OpCodes.OpIf = class extends use("BayLang.OpCodes.BaseOpCode")
{
	/**
	 * Serialize object
	 */
	static serialize(rules)
	{
		const OpCodeType = use("BayLang.OpCodes.OpCodeType");
		const VectorType = use("Runtime.Serializer.VectorType");
		super.serialize(rules);
		rules.addType("condition", new OpCodeType());
		rules.addType("if_else", new OpCodeType());
		rules.addType("if_false", new OpCodeType());
		rules.addType("if_true", new VectorType(new OpCodeType()));
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.op = "op_if";
		this.condition = null;
		this.if_true = null;
		this.if_false = null;
		this.if_else = null;
	}
	static getClassName(){ return "BayLang.OpCodes.OpIf"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.OpCodes.OpIf);
module.exports = {
	"OpIf": BayLang.OpCodes.OpIf,
};