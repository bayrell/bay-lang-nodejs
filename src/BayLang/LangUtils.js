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
BayLang.LangUtils = class
{
	static ERROR_PARSER = -1000;
	static ERROR_PARSER_EOF = -1001;
	static ERROR_PARSER_EXPECTED = -1002;
	
	
	/**
	 * Parse command
	 */
	static parseCommand(command)
	{
		const Map = use("Runtime.Map");
		let from_lang = "";
		let to_lang = "";
		if (command == "bay_to_bay")
		{
			from_lang = "bay";
			to_lang = "bay";
		}
		if (command == "bay_to_php")
		{
			from_lang = "bay";
			to_lang = "php";
		}
		if (command == "bay_to_es6")
		{
			from_lang = "bay";
			to_lang = "es6";
		}
		if (command == "php_to_php")
		{
			from_lang = "php";
			to_lang = "php";
		}
		if (command == "php_to_bay")
		{
			from_lang = "php";
			to_lang = "bay";
		}
		if (command == "php_to_es6")
		{
			from_lang = "php";
			to_lang = "es6";
		}
		if (command == "es6_to_es6")
		{
			from_lang = "es6";
			to_lang = "es6";
		}
		if (command == "es6_to_bay")
		{
			from_lang = "es6";
			to_lang = "bay";
		}
		if (command == "es6_to_php")
		{
			from_lang = "es6";
			to_lang = "php";
		}
		return Map.create({
			"from": from_lang,
			"to": to_lang,
		});
	}
	
	
	/**
	 * Create parser
	 */
	static createParser(lang)
	{
		const ParserBay = use("BayLang.LangBay.ParserBay");
		const ParserES6 = use("BayLang.LangES6.ParserES6");
		const ParserPHP = use("BayLang.LangPHP.ParserPHP");
		if (lang == undefined) lang = "";
		if (lang == "bay") return new ParserBay();
		else if (lang == "es6") return new ParserES6();
		else if (lang == "php") return new ParserPHP();
		return null;
	}
	
	
	/**
	 * Create translator
	 */
	static createTranslator(lang)
	{
		const TranslatorBay = use("BayLang.LangBay.TranslatorBay");
		const TranslatorES6 = use("BayLang.LangES6.TranslatorES6");
		const TranslatorNode = use("BayLang.LangNode.TranslatorNode");
		const TranslatorPHP = use("BayLang.LangPHP.TranslatorPHP");
		if (lang == undefined) lang = "";
		if (lang == "bay") return new TranslatorBay();
		else if (lang == "es6") return new TranslatorES6();
		else if (lang == "nodejs") return new TranslatorNode();
		else if (lang == "php") return new TranslatorPHP();
		return null;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "BayLang.LangUtils"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.LangUtils);
module.exports = {
	"LangUtils": BayLang.LangUtils,
};