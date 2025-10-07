"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
const BaseObject = use("Runtime.BaseObject");
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
BayLang.CoreTranslator = class extends BaseObject
{
	/* State */
	
	
	/**
	 * Constructor
	 */
	constructor()
	{
		super();
		this.uses.set("Collection", "Runtime.Collection");
		this.uses.set("Dict", "Runtime.Dict");
	}
	
	
	/**
	 * Get full entity name
	 */
	getFullName(class_name)
	{
		if (this.uses.has(class_name))
		{
			return this.uses.get(class_name);
		}
		else
		{
			return this.current_namespace_name + String(".") + String(class_name);
		}
	}
	
	
	/**
	 * Set flag
	 */
	setFlag(flag_name, value)
	{
		this.preprocessor_flags.set(flag_name, value);
		return this;
	}
	
	
	/**
	 * Increment indent level
	 */
	levelInc()
	{
		this.indent_level = this.indent_level + 1;
	}
	
	
	/**
	 * Decrease indent level
	 */
	levelDec()
	{
		this.indent_level = this.indent_level - 1;
	}
	
	
	/**
	 * Returns new line with indent
	 */
	newLine(count)
	{
		if (count == undefined) count = 1;
		if (count == 1) return this.crlf + String(rs.str_repeat(this.indent, this.indent_level));
		var arr = [];
		for (var i = 0; i < count; i++)
		{
			arr.push(this.crlf + String(rs.str_repeat(this.indent, this.indent_level)));
		}
		return rs.join("", arr);
	}
	
	
	/**
	 * Returns string
	 */
	toString(s)
	{
		return s;
	}
	
	
	/**
	 * Translate BaseOpCode
	 */
	translate(op_code)
	{
		return "";
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.opcode_level = 0;
		this.indent_level = 0;
		this.last_semicolon = false;
		this.indent = "\t";
		this.crlf = "\n";
		this.preprocessor_flags = new Map();
		this.vars = new Map();
		this.uses = new Map();
		this.class_items = new Map();
		this.current_class = null;
		this.class_function = null;
		this.current_block = "";
		this.current_class_name = "";
		this.current_namespace_name = "";
		this.parent_class_name = "";
		this.is_operator_block = false;
	}
	static getClassName(){ return "BayLang.CoreTranslator"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.CoreTranslator);
module.exports = {
	"CoreTranslator": BayLang.CoreTranslator,
};