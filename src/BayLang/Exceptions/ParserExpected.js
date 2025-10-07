"use strict;"
const use = require('bay-lang').use;
const ParserError = use("BayLang.Exceptions.ParserError");
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
if (typeof BayLang.Exceptions == 'undefined') BayLang.Exceptions = {};
BayLang.Exceptions.ParserExpected = class extends ParserError
{
	constructor(s, caret, file, prev)
	{
		const LangUtils = use("BayLang.LangUtils");
		if (file == undefined) file = "";
		if (prev == undefined) prev = null;
		super(s + String(" expected"), caret, file, LangUtils.ERROR_PARSER_EXPECTED, prev);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "BayLang.Exceptions.ParserExpected"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.Exceptions.ParserExpected);
module.exports = {
	"ParserExpected": BayLang.Exceptions.ParserExpected,
};