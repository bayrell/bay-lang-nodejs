"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
/*
!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2024 "Ildar Bikmamatov" <support@bayrell.org>
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
if (typeof Runtime == 'undefined') Runtime = {};
if (typeof Runtime.Exceptions == 'undefined') Runtime.Exceptions = {};
Runtime.Exceptions.IndexOutOfRange = class extends use("Runtime.Exceptions.RuntimeException")
{
	constructor(pos, prev)
	{
		const Map = use("Runtime.Map");
		if (prev == undefined) prev = null;
		super(rtl.translate("Index out of range. Pos: %pos%", Map.create({"pos": pos})), rtl.ERROR_INDEX_OUT_OF_RANGE, prev);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "Runtime.Exceptions.IndexOutOfRange"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.Exceptions.IndexOutOfRange);
module.exports = {
	"IndexOutOfRange": Runtime.Exceptions.IndexOutOfRange,
};