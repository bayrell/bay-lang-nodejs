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
if (typeof BayLang.LangNode == 'undefined') BayLang.LangNode = {};
BayLang.LangNode.TranslatorNodeProgram = class extends use("BayLang.LangES6.TranslatorES6Program")
{
	/**
	 * OpUse
	 */
	OpUse(op_code, result)
	{
		this.translator.uses.set(op_code.alias, op_code.name);
		return false;
	}
	
	
	/**
	 * Translate class name
	 */
	translateClassName(class_name){ return "use(\"" + String(class_name) + String("\")"); }
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "BayLang.LangNode.TranslatorNodeProgram"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangNode.TranslatorNodeProgram);
module.exports = {
	"TranslatorNodeProgram": BayLang.LangNode.TranslatorNodeProgram,
};