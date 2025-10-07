"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
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
BayLang.OpCodes.OpHtmlStyle = class extends BaseOpCode
{
	
	
	/**
	 * Serialize object
	 */
	serialize(serializer, data)
	{
		super.serialize(serializer, data);
		serializer.process(this, "content", data);
		serializer.process(this, "is_global", data);
		serializer.process(this, "value", data);
	}
	
	
	/**
	 * Read styles from content
	 */
	readStyles()
	{
		const TokenReader = use("BayLang.TokenReader");
		const Caret = use("BayLang.Caret");
		const Reference = use("Runtime.Reference");
		var reader = new TokenReader();
		reader.init(new Caret(Map.create({
			"content": new Reference(this.content),
		})));
		var styles = new Map();
		while (!reader.eof() && reader.nextToken() == ".")
		{
			var selector = this.readSelector(reader);
			var code = this.readCssBlock(reader);
			styles.set(selector, code);
		}
		return styles;
	}
	
	
	/**
	 * Read selector
	 */
	readSelector(reader)
	{
		var items = [];
		while (!reader.eof() && reader.nextToken() != "{")
		{
			items.push(reader.readToken());
		}
		return rs.join("", items);
	}
	
	
	/**
	 * Read css block
	 */
	readCssBlock(reader)
	{
		reader.matchToken("{");
		var caret = reader.main_caret;
		var level = 0;
		var items = [];
		while (!caret.eof() && (caret.nextChar() != "}" && level == 0 || level > 0))
		{
			var ch = caret.readChar();
			if (ch == "{") level = level + 1;
			if (ch == "}") level = level - 1;
			items.push(ch);
		}
		reader.init(caret);
		reader.matchToken("}");
		return rs.join("", items);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.op = "op_html_style";
		this.content = "";
		this.is_global = false;
		this.value = null;
	}
	static getClassName(){ return "BayLang.OpCodes.OpHtmlStyle"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.OpCodes.OpHtmlStyle);
module.exports = {
	"OpHtmlStyle": BayLang.OpCodes.OpHtmlStyle,
};