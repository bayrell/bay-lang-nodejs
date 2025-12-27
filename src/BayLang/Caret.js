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
BayLang.Caret = class extends use("Runtime.BaseObject")
{
	/**
	 * Constructor
	 */
	constructor(items)
	{
		if (items == undefined) items = null;
		super();
		if (items)
		{
			if (items.has("file_name")) this.file_name = items.get("file_name");
			if (items.has("content")) this.content = items.get("content");
			if (items.has("content_sz")) this.content_sz = items.get("content_sz");
			if (items.has("content") && !items.has("content_sz"))
			{
				this.content_sz = rs.strlen(this.content.ref);
			}
			if (items.has("tab_size")) this.tab_size = items.get("tab_size");
			if (items.has("pos")) this.pos = items.get("pos");
			if (items.has("x")) this.x = items.get("x");
			if (items.has("y")) this.y = items.get("y");
		}
	}
	
	
	/**
	 * Clone
	 */
	clone(items)
	{
		const Map = use("Runtime.Map");
		if (items == undefined) items = null;
		return new BayLang.Caret(Map.create({
			"file_name": items ? items.get("file_name", this.file_name) : this.file_name,
			"content": items ? items.get("content", this.content) : this.content,
			"content_sz": items ? items.get("content_sz", this.content_sz) : this.content_sz,
			"tab_size": items ? items.get("tab_size", this.tab_size) : this.tab_size,
			"pos": items ? items.get("pos", this.pos) : this.pos,
			"x": items ? items.get("x", this.x) : this.x,
			"y": items ? items.get("y", this.y) : this.y,
		}));
	}
	
	
	/**
	 * Copy caret
	 */
	copy(items){ if (items == undefined) items = null;return this.clone(items); }
	
	
	/**
	 * Serialize object
	 */
	serialize(serializer, data)
	{
		serializer.process(this, "pos", data);
		serializer.process(this, "x", data);
		serializer.process(this, "y", data);
	}
	
	
	/**
	 * Seek caret
	 */
	seek(caret)
	{
		this.pos = caret.pos;
		this.x = caret.x;
		this.y = caret.y;
	}
	
	
	/**
	 * Returns caret position
	 */
	getPosition()
	{
		const Map = use("Runtime.Map");
		return Map.create({
			"offset": this.x + 1,
			"line": this.y + 1,
		});
	}
	
	
	/**
	 * Returns true if eof
	 */
	eof(){ return this.pos >= this.content_sz; }
	
	
	/**
	 * Returns next X
	 */
	nextX(ch, direction)
	{
		if (direction == undefined) direction = 1;
		if (ch == "\t") return this.x + this.tab_size * direction;
		if (ch == "\n") return 0;
		return this.x + direction;
	}
	
	
	/**
	 * Returns next Y
	 */
	nextY(ch, direction)
	{
		if (direction == undefined) direction = 1;
		if (ch == "\n") return this.y + direction;
		return this.y;
	}
	
	
	/**
	 * Returns next char
	 */
	nextChar(){ return rs.charAt(this.content.ref, this.pos, 1); }
	
	
	/**
	 * Returns string
	 */
	getString(start_pos, count){ return rs.substr(this.content.ref, start_pos, count); }
	
	
	/**
	 * Returns next string
	 */
	nextString(count){ return rs.substr(this.content.ref, this.pos, count); }
	
	
	/**
	 * Returns true if next char
	 */
	isNextChar(ch){ return this.nextChar() == ch; }
	
	
	/**
	 * Returns true if next string
	 */
	isNextString(s){ return this.nextString(rs.strlen(s)) == s; }
	
	
	/**
	 * Shift by char
	 */
	shift(ch)
	{
		this.x = this.nextX(ch);
		this.y = this.nextY(ch);
		this.pos = this.pos + 1;
	}
	
	
	/**
	 * Read char
	 */
	readChar()
	{
		let ch = rs.charAt(this.content.ref, this.pos);
		this.shift(ch);
		return ch;
	}
	
	
	/**
	 * Read char
	 */
	readString(count)
	{
		let s = this.nextString(count);
		let count_chars = rs.strlen(s);
		for (let i = 0; i < count_chars; i++)
		{
			let ch = rs.charAt(s, i);
			this.shift(ch);
		}
		return s;
	}
	
	
	/**
	 * Returns parser error
	 */
	error(message)
	{
		const ParserError = use("BayLang.Exceptions.ParserError");
		return new ParserError(message, this, this.file_name);
	}
	
	
	/**
	 * Returns expected error
	 */
	expected(message)
	{
		const ParserExpected = use("BayLang.Exceptions.ParserExpected");
		return new ParserExpected(message, this, this.file_name);
	}
	
	
	/**
	 * Match char
	 */
	matchChar(ch)
	{
		let next = this.nextChar();
		if (next != ch)
		{
			throw this.expected(ch);
		}
		this.readChar();
	}
	
	
	/**
	 * Match string
	 */
	matchString(s)
	{
		let count = rs.strlen(s);
		let next_string = this.nextString(count);
		if (next_string != s)
		{
			throw this.expected(s);
		}
		this.readString(count);
	}
	
	
	/**
	 * Return true if is char
	 * @param char ch
	 * @return boolean
	 */
	static isChar(ch){ return rs.indexOf("qazwsxedcrfvtgbyhnujmikolp", rs.lower(ch)) !== -1; }
	
	
	/**
	 * Return true if is number
	 * @param char ch
	 * @return boolean
	 */
	static isNumberChar(ch){ return rs.indexOf("0123456789", ch) !== -1; }
	
	
	/**
	 * Return true if char is number
	 * @param char ch
	 * @return boolean
	 */
	static isHexChar(ch){ return rs.indexOf("0123456789abcdef", rs.lower(ch)) !== -1; }
	
	
	/**
	 * Return true if is string of numbers
	 * @param string s
	 * @return boolean
	 */
	static isNumber(s)
	{
		let sz = rs.strlen(s);
		for (let i = 0; i < sz; i++)
		{
			if (!this.isNumberChar(rs.charAt(s, i))) return false;
		}
		return true;
	}
	
	
	/**
	 * Return true if char is system or space. ASCII code <= 32.
	 * @param char ch
	 * @return boolean
	 */
	static isSkipChar(ch)
	{
		if (rs.ord(ch) <= 32) return true;
		return false;
	}
	
	
	/**
	 * Skip chars
	 */
	skipChar(ch)
	{
		if (this.nextChar() == ch)
		{
			this.readChar();
			return true;
		}
		return false;
	}
	
	
	/**
	 * Skip space
	 */
	skipSpace()
	{
		while (!this.eof() && this.constructor.isSkipChar(this.nextChar())) this.readChar();
		return this;
	}
	
	
	/**
	 * Skip comment
	 */
	skipComment()
	{
		if (this.nextString(2) == "/*")
		{
			this.readChar();
			while (!this.eof() && this.nextString(2) != "*/") this.readChar();
			this.readString(2);
		}
		return this;
	}
	
	
	/**
	 * Skip token
	 */
	skipToken()
	{
		this.skipSpace();
		if (this.skip_comments)
		{
			while (!this.eof() && this.nextString(2) == "/*")
			{
				this.skipComment();
				this.skipSpace();
			}
		}
		return this;
	}
	
	
	/**
	 * Returns true if token char
	 */
	isTokenChar(ch)
	{
		return rs.indexOf("qazwsxedcrfvtgbyhnujmikolp0123456789_", rs.lower(ch)) !== -1;
	}
	
	
	/**
	 * Read next token
	 */
	readToken()
	{
		const Vector = use("Runtime.Vector");
		/* Skip token */
		this.skipToken();
		if (this.eof()) return "";
		/* Read special token */
		let token = this.readSpecialToken();
		if (token)
		{
			this.readString(rs.strlen(token));
			return token;
		}
		/* Read char */
		if (!this.isTokenChar(this.nextChar())) return this.readChar();
		/* Read token */
		let items = Vector.create([]);
		while (!this.eof() && this.isTokenChar(this.nextChar()))
		{
			items.push(this.readChar());
		}
		return rs.join("", items);
	}
	
	
	/**
	 * Read special token
	 */
	readSpecialToken()
	{
		if (this.eof()) return "";
		let s = this.nextString(10);
		if (s == "#endswitch") return s;
		s = this.nextString(7);
		if (s == "#ifcode" || s == "#switch" || s == "#elseif" || s == "%render") return s;
		s = this.nextString(6);
		if (s == "#endif" || s == "#ifdef" || s == "%while") return s;
		s = this.nextString(5);
		if (s == "#case" || s == "%else" || s == "<?php") return s;
		s = this.nextString(4);
		if (s == "@css" || s == "%for" || s == "%var" || s == "%set") return s;
		s = this.nextString(3);
		if (s == "!--" || s == "!==" || s == "===" || s == "..." || s == "#if" || s == "%if") return s;
		s = this.nextString(2);
		if (s == "{{" || s == "}}" || s == "==" || s == "!=" || s == "<=" || s == ">=" || s == "=>" || s == "->" || s == "|>" || s == "</" || s == "/>" || s == "||" || s == "&&" || s == "::" || s == "+=" || s == "-=" || s == "~=" || s == "**" || s == "<<" || s == ">>" || s == "++" || s == "--") return s;
		return "";
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.file_name = null;
		this.content = null;
		this.content_sz = 0;
		this.pos = 0;
		this.x = 0;
		this.y = 0;
		this.tab_size = 4;
		this.skip_comments = true;
	}
	static getClassName(){ return "BayLang.Caret"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return ["Runtime.SerializeInterface"]; }
};
use.add(BayLang.Caret);
module.exports = {
	"Caret": BayLang.Caret,
};