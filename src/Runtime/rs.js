"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
/*
!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2024 "Ildar Bikmamatov" <support@bayrell.org>
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
if (typeof Runtime == 'undefined') Runtime = {};
Runtime.rs = class
{
	/**
	 * Returns string lenght
	 * @param string s The string
	 * @return int
	 */
	static strlen(s)
	{
		return use("Runtime.rtl").toStr(s).length;
	}
	
	
	/**
	 * Returns substring
	 * @param string s The string
	 * @param int start
	 * @param int length
	 * @return string
	 */
	static substr(s, start, length)
	{
		if (length == undefined) length = null;
		var _rtl = use("Runtime.rtl");
		if (start < 0) start = s.length + start;
		if (length === null){
			return _rtl.toStr(s).substring(start);
		}
		var end = start + length;
		if (length < 0){
			var sz = this.strlen(s);
			end = sz + length;
		}
		return _rtl.toStr(s).substring(start, end);
	}
	
	
	/**
	 * Returns char from string at the position
	 * @param string s The string
	 * @param int pos The position
	 * @return string
	 */
	static charAt(s, pos)
	{
		return this.substr(s, pos, 1);
	}
	
	
	/**
	 * Returns ASCII symbol by code
	 * @param int code
	 */
	static chr(code)
	{
		return String.fromCharCode(code);
	}
	
	
	/**
	 * Returns ASCII symbol code
	 * @param char ch
	 */
	static ord(ch)
	{
		return use("Runtime.rtl").toStr(ch).charCodeAt(0);
	}
	
	
	/**
	 * Convert string to lower case
	 * @param string s
	 * @return string
	 */
	static lower(s)
	{
		return use("Runtime.rtl").toStr(s).toLowerCase();
	}
	
	
	/**
	 * Convert string to upper case
	 * @param string s
	 * @return string
	 */
	static upper(s)
	{
		return use("Runtime.rtl").toStr(s).toUpperCase();
	}
	
	
	/**
	 * Compare strings
	 */
	static compare(a, b)
	{
		if (a == b) return 0;
		if (a < b) return -1;
		if (a > b) return 1;
	}
	
	
	/**
	 * Заменяет одну строку на другую
	 */
	static replace(search, item, s)
	{
		return s.replaceAll(search, item);
	}
	
	
	/**
	 * Возвращает повторяющуюся строку
	 * @param {string} s - повторяемая строка
	 * @param {integer} n - количество раз, которые нужно повторить строку s
	 * @return {string} строка
	 */
	static str_repeat(s, n)
	{
		if (n <= 0) return "";
		var res = '';
		for (var i=0; i < n; i++){
			res += s;
		}
		return res;
	}
	
	
	/**
	 * Разбивает строку на подстроки
	 * @param string delimiter - regular expression
	 * @param string s - строка, которую нужно разбить
	 * @param integer limit - ограничение
	 * @return Collection<string>
	 */
	static split(delimiter, s, limit)
	{
		if (limit == undefined) limit = -1;
		const rtl = use("Runtime.rtl");
		const RuntimeVector = use("Runtime.Vector");
		
		var arr = null;
		if (!rtl.exists(limit))
			arr = s.split(delimiter);
		arr = s.split(delimiter, limit);
		return RuntimeVector.create(arr);
	}
	
	
	/**
	 * Разбивает строку на подстроки
	 * @param string ch - разделитель
	 * @param string s - строка, которую нужно разбить
	 * @param integer limit - ограничение 
	 * @return Collection<string>
	 */
	static splitArr(delimiters, s, limit)
	{
		if (limit == undefined) limit = -1;
		const rtl = use("Runtime.rtl");
		const RuntimeVector = use("Runtime.Vector");
		
		var arr = null;
		var delimiter = new RegExp("[" + delimiters.join("") + "]", "g");
		if (!rtl.exists(limit))
		{
			arr = s.split(delimiter);
		}
		else
		{
			arr = s.split(delimiter, limit);
		}
		return RuntimeVector.create(arr);
	}
	
	
	/**
	 * Соединяет строки
	 * @param string ch - разделитель
	 * @param string s - строка, которую нужно разбить
	 * @param integer limit - ограничение 
	 * @return Vector<string>
	 */
	static join(ch, arr)
	{
		if (arr == null) return "";
		return Array.prototype.join.call(arr, ch);
	}
	
	
	/**
	 * Join
	 */
	static join_path(arr)
	{
		const re = use("Runtime.re");
		let path = this.join("/", arr);
		path = re.replace("\\/+", "/", path);
		path = re.replace("\\/\\.\\/", "/", path);
		path = re.replace("\\/+$", "", path);
		return path;
	}
	
	
	/**
	 * Удаляет лишние символы слева и справа
	 * @param {string} s - входная строка
	 * @return {integer} новая строка
	 */
	static trim(s, ch)
	{
		if (ch == undefined) ch = "";
		if (ch == undefined) ch = "";
		
		s = use("Runtime.rtl").toStr(s);
		
		if (ch == ""){
			return s.trim();
		}
		return s.replace(new RegExp("^[" + ch + "]+", "g"),"")
			.replace(new RegExp("[" + ch + "]+$", "g"),"")
		;
	}
	
	
	/**
	 * Remove first slash
	 */
	static removeFirstSlash(path)
	{
		let i = 0;
		let sz = this.strlen(path);
		while (i < sz && this.substr(path, i, 1) == "/") i++;
		return this.substr(path, i);
	}
	
	
	/**
	 * Remove last slash
	 */
	static removeLastSlash(path)
	{
		let i = this.strlen(path) - 1;
		while (i >= 0 && this.substr(path, i, 1) == "/") i--;
		return this.substr(path, 0, i + 1);
	}
	
	
	/**
	 * Add first slash
	 */
	static addFirstSlash(path)
	{
		if (Runtime.rs.substr(path, 0, 1) == "/") return path;
		return "/" + String(path);
	}
	
	
	/**
	 * Add last slash
	 */
	static addLastSlash(path)
	{
		if (Runtime.rs.substr(path, Runtime.rs.strlen(path) - 1, 1) == "/") return path;
		return path + String("/");
	}
	
	
	/**
	 * Разбивает путь файла на составляющие
	 * @param {string} filepath путь к файлу
	 * @return {json} Объект вида:
	 *         dirname    - папка, в которой находиться файл
	 *         basename   - полное имя файла
	 *         extension  - расширение файла
	 *         filename   - имя файла без расширения
	 */
	static pathinfo(filepath)
	{
		const Map = use("Runtime.Map");
		let arr1 = this.split(".", filepath);
		let arr2 = this.split("/", filepath);
		let extension = arr1.pop();
		let basename = arr2.pop();
		let dirname = this.join("/", arr2);
		let ext_length = this.strlen(extension);
		if (ext_length > 0) ext_length++;
		let filename = this.substr(basename, 0, -1 * ext_length);
		return Map.create({
			"filepath": filepath,
			"extension": extension,
			"basename": basename,
			"dirname": dirname,
			"filename": filename,
		});
	}
	
	
	/**
	 * Возвращает имя файла без расширения
	 * @param {string} filepath - путь к файлу
	 * @return {string} полное имя файла
	 */
	static filename(filepath)
	{
		let ret = this.pathinfo(filepath);
		let res = ret.get("basename");
		let ext = ret.get("extension");
		if (ext != "")
		{
			let sz = 0 - Runtime.rs.strlen(ext) - 1;
			res = Runtime.rs.substr(res, 0, sz);
		}
		return res;
	}
	
	
	/**
	 * Возвращает полное имя файла
	 * @param {string} filepath - путь к файлу
	 * @return {string} полное имя файла
	 */
	static basename(filepath)
	{
		let ret = this.pathinfo(filepath);
		let res = ret.get("basename");
		return res;
	}
	
	
	/**
	 * Возвращает расширение файла
	 * @param {string} filepath - путь к файлу
	 * @return {string} расширение файла
	 */
	static extname(filepath)
	{
		let ret = this.pathinfo(filepath);
		let res = ret.get("extension");
		return res;
	}
	
	
	/**
	 * Возвращает путь к папке, содержащий файл
	 * @param {string} filepath - путь к файлу
	 * @return {string} путь к папке, содержащий файл
	 */
	static dirname(filepath)
	{
		let ret = this.pathinfo(filepath);
		let res = ret.get("dirname");
		return res;
	}
	
	
	/**
	 * New line to br
	 */
	static nl2br(s)
	{
		return this.replace("\n", "<br/>", s);
	}
	
	
	/**
	 * Remove spaces
	 */
	static spaceless(s)
	{
		const re = use("Runtime.re");
		s = re.replace(" +", " ", s);
		s = re.replace("\t", "", s);
		s = re.replace("\n", "", s);
		return s;
	}
	
	
	/**
	 * Ищет позицию первого вхождения подстроки search в строке s.
	 * @param {string} s - строка, в которой производится поиск 
	 * @param {string} search - строка, которую ищем 
	 * @param {string} offset - если этот параметр указан, 
	 *                 то поиск будет начат с указанного количества символов с начала строки.  
	 * @return {variable} Если строка найдена, то возвращает позицию вхождения, начиная с 0.
	 *                    Если строка не найдена, то вернет -1
	 */
	static indexOf(s, search, offset)
	{
		if (offset == undefined) offset = 0;
		var _rtl = use("Runtime.rtl");
		
		if (!_rtl.exists(offset)) offset = 0;
		var res = _rtl.toStr(s).indexOf(search);
		return res;
	}
	
	
	/**
	 * URL encode
	 * @param string s
	 * @return string
	 */
	static url_encode(s)
	{
		return encodeURIComponent(s);
	}
	
	
	/**
	 * Decode HTML
	 */
	static htmlDecode(s)
	{
		const he = require("he");
		return he.decode(s);
	}
	
	
	static decodeHtml(s){ return this.htmlDecode(s); }
	
	
	/**
	 * Escape HTML special chars
	 * @param string s
	 * @return string
	 */
	static htmlEscape(s)
	{
		if (s == null) return "";
		var obj = {
			"<": "&lt;",
			">": "&gt;", 
			"&": "&amp;",
			'"': '&quot;',
			"'": '&#39;',
			'`': '&#x60;',
			'=': '&#x3D;'
		};
		return (new String(s)).replace(/[<>&"'`=]/g, function(v){ return obj[v]; });
	}
	
	
	static escapeHtml(s){ return this.htmlEscape(s); }
	
	
	/**
	 * Base64 encode
	 * @param string s
	 * @return string
	 */
	static base64_encode(s)
	{
		return Buffer.from(s).toString('base64');
	}
	
	
	/**
	 * Base64 decode
	 * @param string s
	 * @return string
	 */
	static base64_decode(s)
	{
		return Buffer.from(s, 'base64').toString('ascii');
	}
	
	
	/**
	 * Base64 encode
	 * @param string s
	 * @return string
	 */
	static base64_encode_url(s)
	{
		return Buffer.from(s).toString('base64');
	}
	
	
	/**
	 * Base64 decode
	 * @param string s
	 * @return string
	 */
	static base64_decode_url(s)
	{
		return Buffer.from(s, 'base64').toString('ascii');
	}
	
	
	/**
	 * Parser url
	 * @param string s The string
	 * @return int
	 */
	static parse_url(s)
	{
		const Map = use("Runtime.Map");
		let pos;
		let uri, query, hash;
		pos = this.indexOf(s, "#");
		s = pos >= 0 ? this.substr(s, 0, pos) : s;
		hash = pos >= 0 ? this.substr(s, pos + 1) : "";
		pos = this.indexOf(s, "?");
		uri = pos >= 0 ? this.substr(s, 0, pos) : s;
		query = pos >= 0 ? this.substr(s, pos + 1) : "";
		let arr = this.split("&", query);
		let arr2 = arr.filter((s) => { return s != ""; }).transition((item) =>
		{
			const Vector = use("Runtime.Vector");
			let arr = this.split("=", item);
			return new Vector(arr[1], arr[0]);
		});
		return Map.create({
			"uri": uri,
			"query": query,
			"query_arr": arr2,
			"hash": hash,
		});
	}
	
	
	/**
	 * Returns string lenght
	 * @param string s The string
	 * @return int
	 */
	static url_get_add(s, key, value)
	{
		let r = this.parse_url(s);
		let s1 = r.get("uri");
		let s2 = r.get("query");
		let find = false;
		let arr = this.split("&", s2);
		arr = arr.map((s) =>
		{
			let arr = this.split("=", s);
			if (arr[0] == key)
			{
				find = true;
				if (value != "") return key + String("=") + String(this.htmlEscape(value));
				return "";
			}
			return s;
		}).filter((s) => { return s != ""; });
		if (!find && value != "")
		{
			arr.push(key + String("=") + String(this.htmlEscape(value)));
		}
		s = s1;
		s2 = this.join("&", arr);
		if (s2 != "") s = s + String("?") + String(s2);
		return s;
	}
	
	
	/**
	 * Strip tags
	 */
	static strip_tags(content, allowed_tags)
	{
		const re = use("Runtime.re");
		if (allowed_tags == undefined) allowed_tags = null;
		if (allowed_tags == null)
		{
			content = re.replace("<[^>]+>", "", content);
			content = Runtime.rs.trim(Runtime.rs.spaceless(content));
			return content;
		}
		let matches = re.matchAll("<[^>]+>", content, "i");
		if (matches)
		{
			for (let i = 0; i < matches.count(); i++)
			{
				let match = matches[i];
				let tag_str = match[0];
				let tag_match = re.matchAll("<(\\/|)([a-zA-Z]+)(|[^>]*)>", tag_str, "i");
				if (tag_match)
				{
					let tag_name = this.lower(tag_match[0][2]);
					if (allowed_tags.indexOf(tag_name) == -1)
					{
						content = this.replace(tag_str, "", content);
					}
				}
			}
		}
		content = Runtime.rs.trim(Runtime.rs.spaceless(content));
		return content;
	}
	
	
	/**
	 * Generate uuid
	 */
	static uid()
	{
		
	}
	
	
	/**
	 * Generate timestamp based uuid
	 */
	static time_uid()
	{
		
	}
	
	
	/**
	 * Join class name
	 */
	static className(arr)
	{
		return Runtime.rs.join(" ", arr.map((s) => { return this.trim(s); }).filter((s) => { return s != ""; }));
	}
	
	
	/**
	 * Merge styles
	 */
	static mergeStyles(class_name, items)
	{
		return Runtime.rs.join(" ", items.map((s) => { return this.trim(s); }).filter((s) => { return s != ""; }).map((item) => { return class_name + String("--") + String(item); }));
	}
	
	
	/**
	 * Hash function
	 * @param string
	 * @return int hash
	 */
	static hash(s, x, p)
	{
		if (x == undefined) x = 257;
		if (p == undefined) p = 1000000007;
		let h = 0;
		let sz = Runtime.rs.strlen(s);
		for (let i = 0; i < sz; i++)
		{
			let ch = Runtime.rs.ord(Runtime.rs.charAt(s, i, 1));
			h = (h * x + ch) % p;
		}
		return h;
	}
	
	
	/**
	 * Returns CSS Hash
	 */
	static getCssHash(class_name)
	{
		let h = Runtime.rs.hash(class_name, 337, 65537) + 65537;
		let res = Runtime.rs.toHex(h * 337 % 65537);
		return Runtime.rs.substr(res, -4);
	}
	
	
	/**
	 * Returns component hash
	 */
	static getComponentHash(class_name)
	{
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		if (!rtl.isString(class_name)) class_name = rtl.className(class_name);
		let global_hash = Runtime.rtl.getContext().provider("hash");
		let component_hash = global_hash.get("component_hash");
		if (!component_hash)
		{
			component_hash = new Map();
			global_hash.set("component_hash", component_hash);
		}
		if (component_hash.has(class_name)) return component_hash.get(class_name);
		let result = new Vector();
		let item_name = class_name;
		while (item_name != "" && item_name != "Runtime.Component")
		{
			result.push("h-" + String(this.getCssHash(item_name)));
			item_name = rtl.parentClassName(item_name);
		}
		let value = Runtime.rs.join(" ", result);
		component_hash.set(class_name, value);
		return value;
	}
	
	
	/**
	 * Convert int to hex
	 * @param int
	 * @return string
	 */
	static toHex(h)
	{
		let r = "";
		let a = "0123456789abcdef";
		while (h >= 0)
		{
			let c = h & 15;
			h = h >> 4;
			r = Runtime.rs.charAt(a, c) + String(r);
			if (h == 0) break;
		}
		return r;
	}
	
	
	/**
	 * Hex decode
	 */
	static hexdec(s)
	{
		return parseInt(s, 16);
	}
	
	
	/**
	 * Generate random string
	 * @var len - string length
	 * @var spec
	 *   - a - alpha
	 *   - n - numberic
	 * @return string
	 */
	static random_string(len, spec)
	{
		if (len == undefined) len = 8;
		if (spec == undefined) spec = "aun";
		let s = "";
		let res = "";
		let sz = Runtime.rs.strlen(spec);
		for (let i = 0; i < sz; i++)
		{
			let ch = spec[i];
			if (ch == "a")
			{
				s += "qwertyuiopasdfghjklzxcvbnm";
			}
			if (ch == "u")
			{
				s += "QWERTYUIOPASDFGHJKLZXCVBNM";
			}
			else if (ch == "n")
			{
				s += "0123456789";
			}
			else if (ch == "s")
			{
				s += "!@#$%^&*()-_+='\":;'.,<>?/|~";
			}
		}
		let sz_s = Runtime.rs.strlen(s);
		for (let i = 0; i < len; i++)
		{
			let code = rtl.random(0, sz_s - 1);
			res += s[code];
		}
		return res;
	}
	
	
	/**
	 * Format string
	 */
	static format(s, params)
	{
		if (params == undefined) params = null;
		if (params == null) return s;
		params.each((value, key) =>
		{
			s = Runtime.rs.replace("%" + String(key) + String("%"), value, s);
		});
		return s;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "Runtime.rs"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.rs);
module.exports = {
	"rs": Runtime.rs,
};