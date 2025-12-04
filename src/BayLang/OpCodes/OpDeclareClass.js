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
BayLang.OpCodes.OpDeclareClass = class extends use("BayLang.OpCodes.BaseOpCode")
{
	static KIND_CLASS = "class";
	static KIND_STRUCT = "struct";
	static KIND_INTERFACE = "interface";
	
	
	/**
	 * Serialize object
	 */
	serialize(serializer, data)
	{
		super.serialize(serializer, data);
		serializer.process(this, "annotations", data);
		serializer.process(this, "class_extends", data);
		serializer.process(this, "class_implements", data);
		serializer.process(this, "comments", data);
		serializer.process(this, "extend_name", data);
		serializer.process(this, "flags", data);
		serializer.process(this, "fn_create", data);
		serializer.process(this, "fn_destroy", data);
		serializer.process(this, "functions", data);
		serializer.process(this, "is_abstract", data);
		serializer.process(this, "is_component", data);
		serializer.process(this, "is_declare", data);
		serializer.process(this, "is_model", data);
		serializer.process(this, "items", data);
		serializer.process(this, "kind", data);
		serializer.process(this, "name", data);
		serializer.process(this, "template", data);
		serializer.process(this, "vars", data);
	}
	
	
	/**
	 * Returns offset
	 */
	getOffset()
	{
		let res = super.getOffset();
		let op_comment = this.comments.first();
		if (op_comment)
		{
			res.set("start", op_comment.caret_start.y);
		}
		return res;
	}
	
	
	/**
	 * Find function
	 */
	findFunction(name)
	{
		return this.content.items.find((op_code) => { const OpDeclareFunction = use("BayLang.OpCodes.OpDeclareFunction");return op_code instanceof OpDeclareFunction && op_code.name == name; });
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.op = "op_class";
		this.kind = "";
		this.annotations = null;
		this.comments = null;
		this.template = null;
		this.flags = null;
		this.fn_create = null;
		this.fn_destroy = null;
		this.name = null;
		this.class_extends = null;
		this.class_implements = null;
		this.content = null;
		this.is_abstract = false;
		this.is_static = false;
		this.is_declare = false;
		this.is_component = false;
		this.is_model = false;
	}
	static getClassName(){ return "BayLang.OpCodes.OpDeclareClass"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.OpCodes.OpDeclareClass);
module.exports = {
	"OpDeclareClass": BayLang.OpCodes.OpDeclareClass,
};