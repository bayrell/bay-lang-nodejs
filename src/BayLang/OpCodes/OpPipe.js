"use strict;"
const use = require('bay-lang').use;
const BaseOpCode = use("BayLang.OpCodes.BaseOpCode");
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
BayLang.OpCodes.OpPipe = class extends BaseOpCode
{
	static KIND_ATTR = "attr";
	static KIND_CALL = "call";
	static KIND_METHOD = "method";
	
	
	/**
	 * Serialize object
	 */
	serialize(serializer, data)
	{
		super.serialize(serializer, data);
		serializer.process(this, "is_async", data);
		serializer.process(this, "is_monad", data);
		serializer.process(this, "kind", data);
		serializer.process(this, "obj", data);
		serializer.process(this, "value", data);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.op = "op_pipe";
		this.kind = "";
		this.obj = null;
		this.value = null;
		this.is_async = false;
		this.is_monad = false;
	}
	static getClassName(){ return "BayLang.OpCodes.OpPipe"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.OpCodes.OpPipe);
module.exports = {
	"OpPipe": BayLang.OpCodes.OpPipe,
};