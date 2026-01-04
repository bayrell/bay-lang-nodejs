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
	static serialize(rules)
	{
		const VectorType = use("Runtime.Serializer.VectorType");
		const ObjectType = use("Runtime.Serializer.ObjectType");
		const Map = use("Runtime.Map");
		const BooleanType = use("Runtime.Serializer.BooleanType");
		const OpCodeType = use("BayLang.OpCodes.OpCodeType");
		const StringType = use("Runtime.Serializer.StringType");
		super.serialize(rules);
		rules.addType("annotations", new VectorType(new ObjectType(Map.create({
			"class_name": "BayLang.OpCodes.OpAnnotation",
		}))));
		rules.addType("class_extends", new ObjectType(Map.create({
			"class_name": "BayLang.OpCodes.OpTypeIdentifier",
		})));
		rules.addType("class_implements", new VectorType(new ObjectType(Map.create({
			"class_name": "BayLang.OpCodes.OpTypeIdentifier",
		}))));
		rules.addType("comments", new ObjectType(Map.create({
			"class_name": "BayLang.OpCodes.OpComment",
		})));
		rules.addType("flags", new ObjectType(Map.create({
			"class_name": "BayLang.OpCodes.OpFlags",
		})));
		rules.addType("fn_create", new ObjectType(Map.create({
			"class_name": "BayLang.OpCodes.OpDeclareFunction",
		})));
		rules.addType("fn_destroy", new ObjectType(Map.create({
			"class_name": "BayLang.OpCodes.OpDeclareFunction",
		})));
		rules.addType("is_abstract", new BooleanType());
		rules.addType("is_component", new BooleanType());
		rules.addType("is_declare", new BooleanType());
		rules.addType("is_model", new BooleanType());
		rules.addType("content", new OpCodeType());
		rules.addType("kind", new StringType());
		rules.addType("name", new ObjectType(Map.create({
			"class_name": "BayLang.OpCodes.OpTypeIdentifier",
		})));
		rules.addType("template", new VectorType());
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