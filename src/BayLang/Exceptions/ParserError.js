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
if (typeof BayLang.Exceptions == 'undefined') BayLang.Exceptions = {};
BayLang.Exceptions.ParserError = class extends use("BayLang.Exceptions.ParserUnknownError")
{
	constructor(s, caret, file, code, prev)
	{
		if (file == undefined) file = "";
		if (code == undefined) code = -1;
		if (prev == undefined) prev = null;
		super(s, code, prev);
		this.error_line = caret.y + 1;
		this.error_pos = caret.x + 1;
		this.error_file = file;
	}
	
	
	buildErrorMessage()
	{
		let error_str = this.getErrorMessage();
		let file = this.getFileName();
		let line = this.getErrorLine();
		let pos = this.getErrorPos();
		if (line != -1)
		{
			error_str += " at Ln:" + String(line) + String(pos != "" ? ", Pos:" + String(pos) : "");
		}
		if (file != "")
		{
			error_str += " in file:'" + String(file) + String("'");
		}
		return error_str;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "BayLang.Exceptions.ParserError"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.Exceptions.ParserError);
module.exports = {
	"ParserError": BayLang.Exceptions.ParserError,
};