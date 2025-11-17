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
if (typeof BayLang.LangBay == 'undefined') BayLang.LangBay = {};
BayLang.LangBay.TranslatorBay = class extends use("BayLang.CoreTranslator")
{
	/**
	 * Returns string
	 */
	toString(s)
	{
		const re = use("Runtime.re");
		s = re.replace("\\\\", "\\\\", s);
		s = re.replace("\"", "\\\"", s);
		s = re.replace("\n", "\\n", s);
		s = re.replace("\r", "\\r", s);
		s = re.replace("\t", "\\t", s);
		return "\"" + String(s) + String("\"");
	}
	
	
	/**
	 * Translate BaseOpCode
	 */
	translate(op_code)
	{
		const Vector = use("Runtime.Vector");
		let content = new Vector();
		if (op_code.is_component)
		{
			this.html.translate(op_code, content);
		}
		else
		{
			this.program.translate(op_code, content);
		}
		return rs.join("", content);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const TranslatorBayExpression = use("BayLang.LangBay.TranslatorBayExpression");
		const TranslatorBayOperator = use("BayLang.LangBay.TranslatorBayOperator");
		const TranslatorBayProgram = use("BayLang.LangBay.TranslatorBayProgram");
		const TranslatorBayHtml = use("BayLang.LangBay.TranslatorBayHtml");
		this.expression = new TranslatorBayExpression(this);
		this.operator = new TranslatorBayOperator(this);
		this.program = new TranslatorBayProgram(this);
		this.html = new TranslatorBayHtml(this);
	}
	static getClassName(){ return "BayLang.LangBay.TranslatorBay"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangBay.TranslatorBay);
module.exports = {
	"TranslatorBay": BayLang.LangBay.TranslatorBay,
};