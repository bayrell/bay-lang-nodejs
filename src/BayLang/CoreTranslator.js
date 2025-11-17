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
BayLang.CoreTranslator = class extends use("Runtime.BaseObject")
{
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
	 * Use module
	 */
	useModule(module_name)
	{
		return module_name;
	}
	
	
	/**
	 * Returns module name
	 */
	getUseModule(module_name)
	{
		if (this.uses.get(module_name))
		{
			return this.useModule(this.uses.get(module_name));
		}
		return this.useModule(module_name);
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
			if (rs.indexOf(class_name, ".") >= 0) return class_name;
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
	 * Increment component hash
	 */
	componentHashInc()
	{
		this.component_hash_inc = this.component_hash_inc + 1;
		return this.component_hash_inc - 1;
	}
	
	
	/**
	 * Increment variable
	 */
	varInc()
	{
		this.var_inc = this.var_inc + 1;
		return "__v" + String(this.var_inc - 1);
	}
	
	
	/**
	 * Decrement variable
	 */
	varDec()
	{
		this.var_inc = this.var_inc - 1;
	}
	
	
	/**
	 * Save var
	 */
	saveVar(content)
	{
		const Map = use("Runtime.Map");
		let var_name = this.varInc();
		this.save_var.push(Map.create({"name": var_name, "content": content}));
		return var_name;
	}
	
	
	/**
	 * Returns new line with indent
	 */
	newLine(count)
	{
		const Vector = use("Runtime.Vector");
		if (count == undefined) count = 1;
		if (!this.allow_multiline) return "";
		if (count == 1) return this.crlf + String(rs.str_repeat(this.indent, this.indent_level));
		let arr = new Vector();
		for (let i = 0; i < count; i++)
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
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
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
		this.current_module = null;
		this.html_var_names = new Vector();
		this.save_var = new Vector();
		this.var_inc = 0;
		this.component_hash_inc = 0;
		this.current_block = "";
		this.current_class_name = "";
		this.current_namespace_name = "";
		this.html_kind = "";
		this.parent_class_name = "";
		this.allow_multiline = true;
		this.is_html_props = false;
		this.is_operator_block = false;
	}
	static getClassName(){ return "BayLang.CoreTranslator"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.CoreTranslator);
module.exports = {
	"CoreTranslator": BayLang.CoreTranslator,
};