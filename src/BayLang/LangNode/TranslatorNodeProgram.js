"use strict;"
const use = require('bay-lang').use;
const TranslatorES6Program = use("BayLang.LangES6.TranslatorES6Program");
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
if (typeof BayLang.LangNode == 'undefined') BayLang.LangNode = {};
BayLang.LangNode.TranslatorNodeProgram = class extends TranslatorES6Program
{
	/**
	 * OpUse
	 */
	OpUse(op_code, result)
	{
		this.translator.uses.set(op_code.alias, op_code.name);
		return false;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "BayLang.LangNode.TranslatorNodeProgram"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.LangNode.TranslatorNodeProgram);
module.exports = {
	"TranslatorNodeProgram": BayLang.LangNode.TranslatorNodeProgram,
};