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
BayLang.OpCodes.OpFlags = class extends use("BayLang.OpCodes.BaseOpCode")
{
	/**
	 * Serialize object
	 */
	serialize(serializer, data)
	{
		serializer.process(this, "items", data);
	}
	
	
	/**
	 * Read is Flag
	 */
	isFlag(name)
	{
		if (!BayLang.OpCodes.OpFlags.hasFlag(name)) return false;
		return this.items.get(name);
	}
	
	
	/**
	 * Get flags
	 */
	static getFlags()
	{
		const Vector = use("Runtime.Vector");
		return new Vector(
			"async",
			"export",
			"static",
			"const",
			"public",
			"private",
			"declare",
			"protected",
			"serializable",
			"computed",
			"cloneable",
			"assignable",
			"memorize",
			"multiblock",
			"pure",
			"props",
		);
	}
	
	
	/**
	 * Get flags
	 */
	static hasFlag(flag_name)
	{
		if (flag_name == "async" || flag_name == "export" || flag_name == "static" || flag_name == "const" || flag_name == "public" || flag_name == "private" || flag_name == "declare" || flag_name == "protected" || flag_name == "serializable" || flag_name == "computed" || flag_name == "cloneable" || flag_name == "assignable" || flag_name == "memorize" || flag_name == "multiblock" || flag_name == "lambda" || flag_name == "pure" || flag_name == "props")
		{
			return true;
		}
		return false;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Vector = use("Runtime.Vector");
		this.items = new Vector();
	}
	static getClassName(){ return "BayLang.OpCodes.OpFlags"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return ["Runtime.SerializeInterface"]; }
};
use.add(BayLang.OpCodes.OpFlags);
module.exports = {
	"OpFlags": BayLang.OpCodes.OpFlags,
};