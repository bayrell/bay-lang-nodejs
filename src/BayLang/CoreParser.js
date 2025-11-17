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
		let name = op_code.value;
		this.vars.set(name, pattern);
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
		this.find_variable = true;
		this.vars = new Map();
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