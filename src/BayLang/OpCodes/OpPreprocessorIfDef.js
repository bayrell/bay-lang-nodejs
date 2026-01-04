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
BayLang.OpCodes.OpPreprocessorIfDef = class extends use("BayLang.OpCodes.BaseOpCode")
{
	static KIND_PROGRAM = "program";
	static KIND_CLASS_BODY = "class_body";
	static KIND_CLASS_INIT = "class_init";
	static KIND_COMPONENT_BODY = "component_body";
	static KIND_OPERATOR = "operator";
	static KIND_COLLECTION = "collection";
	static KIND_DICT = "dict";
	static KIND_EXPRESSION = "expression";
	
	
	/**
	 * Serialize object
	 */
	static serialize(rules)
	{
		const OpCodeType = use("BayLang.OpCodes.OpCodeType");
		super.serialize(rules);
		rules.addType("condition", new OpCodeType());
		rules.addType("items", new OpCodeType());
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.op = "op_preprocessor_ifdef";
		this.condition = null;
		this.content = null;
	}
	static getClassName(){ return "BayLang.OpCodes.OpPreprocessorIfDef"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.OpCodes.OpPreprocessorIfDef);
module.exports = {
	"OpPreprocessorIfDef": BayLang.OpCodes.OpPreprocessorIfDef,
};