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
BayLang.OpCodes.OpHtmlTag = class extends use("BayLang.OpCodes.BaseOpCode")
{
	/**
	 * Serialize object
	 */
	serialize(serializer, data)
	{
		super.serialize(serializer, data);
		serializer.process(this, "attrs", data);
		serializer.process(this, "content", data);
		serializer.process(this, "op_code_name", data);
		serializer.process(this, "spreads", data);
		serializer.process(this, "tag_name", data);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.op = "op_html_tag";
		this.tag_name = "";
		this.is_component = false;
		this.op_code_name = null;
		this.attrs = null;
		this.spreads = null;
		this.content = null;
	}
	static getClassName(){ return "BayLang.OpCodes.OpHtmlTag"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(BayLang.OpCodes.OpHtmlTag);
module.exports = {
	"OpHtmlTag": BayLang.OpCodes.OpHtmlTag,
};