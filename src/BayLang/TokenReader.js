"use strict;"
const use = require('bay-lang').use;
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
BayLang.TokenReader = class extends BaseObject
{
	
	
	/**
	 * Init token reader
	 */
	init(caret)
	{
		this.main_caret = caret;
		this.next_caret = caret.copy();
		this.readToken();
	}
	
	
	/**
	 * Returns caret
	 */
	caret(){ return this.main_caret.copy(); }
	
	
	/**
	 * Returns caret start
	 */
	start(){ return this.main_caret.copy().skipSpace(); }
	
	
	/**
	 * Returns eof
	 */
	eof(){ return this.main_caret.eof(); }
	
	
	/**
	 * Returns next token
	 */
	nextToken(){ return this.next_token; }
	
	
	/**
	 * Read token
	 */
	readToken()
	{
		var token = this.next_token;
		this.main_caret.seek(this.next_caret);
		this.next_token = this.next_caret.readToken();
		return token;
	}
	
	
	/**
	 * Read next token with comments
	 */
	nextTokenComments()
	{
		var caret = this.main_caret.copy();
		caret.skip_comments = false;
		return caret.readToken();
	}
	
	
	/**
	 * Returns parser error
	 */
	error(message)
	{
		return this.main_caret.error(message);
	}
	
	
	/**
	 * Returns expected error
	 */
	expected(message)
	{
		return this.main_caret.expected(message);
	}
	
	
	/**
	 * Match next token
	 */
	matchToken(ch)
	{
		if (this.nextToken() != ch)
		{
			throw this.expected(ch);
		}
		this.readToken();
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.main_caret = null;
		this.next_caret = null;
		this.next_token = "";
	}
	static getClassName(){ return "BayLang.TokenReader"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return []; }
};
use.add(BayLang.TokenReader);
module.exports = {
	"TokenReader": BayLang.TokenReader,
};