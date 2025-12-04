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
BayLang.OpCodes.OpDeclareFunction = class extends use("BayLang.OpCodes.BaseOpCode")
{
	/**
	 * Serialize object
	 */
	serialize(serializer, data)
	{
		super.serialize(serializer, data);
		serializer.process(this, "annotations", data);
		serializer.process(this, "args", data);
		serializer.process(this, "comments", data);
		serializer.process(this, "expression", data);
		serializer.process(this, "flags", data);
		serializer.process(this, "is_context", data);
		serializer.process(this, "is_html", data);
		serializer.process(this, "is_html_default_args", data);
		serializer.process(this, "items", data);
		serializer.process(this, "name", data);
		serializer.process(this, "result_type", data);
		serializer.process(this, "vars", data);
	}
	
	
	/**
	 * Returns true if static function
	 */
	isStatic()
	{
		return this.flags != null && (this.flags.isFlag("static") || this.flags.isFlag("lambda") || this.flags.isFlag("pure"));
	}
	
	
	/**
	 * Returns true if is flag
	 */
	isFlag(flag_name){ return this.flags != null && this.flags.isFlag(flag_name); }
	
	
	/**
	 * Returns offset
	 */
	getOffset()
	{
		let res = super.getOffset();
		let op_comment = this.comments ? this.comments.first() : null;
		if (op_comment)
		{
			res.set("start", op_comment.caret_start.y);
		}
		return res;
	}
	
	
	/**
	 * Returns function expression
	 */
	getExpression()
	{
		const OpItems = use("BayLang.OpCodes.OpItems");
		const OpReturn = use("BayLang.OpCodes.OpReturn");
		if (this.expression != null)
		{
			return this.expression;
		}
		if (!(this.items instanceof OpItems)) return null;
		let op_code_item = this.items.items.get(0);
		if (!(op_code_item instanceof OpReturn)) return null;
		return op_code_item.expression;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.op = "op_function";
		this.name = "";
		this.args = null;
		this.annotations = null;
		this.comments = null;
		this.vars = null;
		this.pattern = null;
		this.content = null;
		this.flags = null;
		this.is_context = true;
		this.is_html = false;
		this.is_html_default_args = false;
	}
	static getClassName(){ return "BayLang.OpCodes.OpDeclareFunction"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.OpCodes.OpDeclareFunction);
module.exports = {
	"OpDeclareFunction": BayLang.OpCodes.OpDeclareFunction,
};