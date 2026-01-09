"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
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
BayLang.CoreParser = class extends use("Runtime.BaseObject")
{
	/**
	 * Save vars
	 */
	saveVars(){ return this.vars.copy(); }
	
	
	/**
	 * Restore vars
	 */
	restoreVars(vars)
	{
		this.vars = vars;
	}
	
	
	/**
	 * Add variable
	 */
	addVariable(op_code, pattern)
	{
		const Map = use("Runtime.Map");
		let name = op_code.value;
		this.vars.set(name, Map.create({
			"pattern": pattern,
			"function_level": this.function_level,
		}));
	}
	
	
	/**
	 * Use variable
	 */
	useVariable(op_code)
	{
		const Map = use("Runtime.Map");
		let variable = this.vars.get(op_code.value);
		if (!(variable instanceof Map) || variable.get("function_level") >= this.function_level)
		{
			return;
		}
		if (!this.vars_uses.has(op_code.value))
		{
			this.vars_uses.set(op_code.value, op_code);
		}
	}
	
	
	/**
	 * Set content
	 */
	setContent(content)
	{
		this.content = content;
		this.content_size = rs.strlen(content);
		return this;
	}
	
	
	/**
	 * Create reader
	 */
	createReader()
	{
		const TokenReader = use("BayLang.TokenReader");
		const Caret = use("BayLang.Caret");
		const Map = use("Runtime.Map");
		const Reference = use("Runtime.Reference");
		let reader = new TokenReader();
		reader.init(new Caret(Map.create({
			"content": new Reference(this.content),
			"tab_size": this.tab_size,
		})));
		return reader;
	}
	
	
	/**
	 * Parse file and convert to BaseOpCode
	 */
	parse()
	{
		return null;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Map = use("Runtime.Map");
		this.file_name = "";
		this.content = "";
		this.content_size = 0;
		this.tab_size = 4;
		this.function_level = 0;
		this.find_variable = true;
		this.vars = new Map();
		this.vars_uses = new Map();
		this.uses = new Map();
		this.current_namespace = null;
		this.current_class = null;
		this.current_namespace_name = "";
	}
	static getClassName(){ return "BayLang.CoreParser"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.CoreParser);
module.exports = {
	"CoreParser": BayLang.CoreParser,
};