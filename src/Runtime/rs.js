"use strict;"
var use = require('bay-lang').use;
/*!
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
Runtime.rs = function()
{
};
Object.assign(Runtime.rs.prototype,
{
});
Object.assign(Runtime.rs,
{
	/**
	 * Returns string lenght
	 * @param string s The string
	 * @return int
	 */
	strlen: function(s)
	{
		return use("Runtime.rtl").toStr(s).length;
	},
	/**
	 * Returns substring
	 * @param string s The string
	 * @param int start
	 * @param int length
	 * @return string
	 */
	substr: function(s, start, length)
	{
		if (length == undefined) length = null;
		var _rtl = use("Runtime.rtl");
		var _rs = use("Runtime.rs");
		if (start < 0) start = s.length + start;
		if (length === null){
			return _rtl.toStr(s).substring(start);
		}
		var end = start + length;
		if (length < 0){
			var sz = _rs.strlen(s);
			end = sz + length;
		}
		return _rtl.toStr(s).substring(start, end);
	},
	/**
	 * Returns char from string at the position
	 * @param string s The string
	 * @param int pos The position
	 * @return string
	 */
	charAt: function(s, pos)
	{
		return this.substr(s, pos, 1);
	},
	/**
	 * Returns ASCII symbol by code
	 * @param int code
	 */
	chr: function(code)
	{
		return String.fromCharCode(code);
	},
	/**
	 * Returns ASCII symbol code
	 * @param char ch
	 */
	ord: function(ch)
	{
		return use("Runtime.rtl").toStr(ch).charCodeAt(0);
	},
	/**
	 * Convert string to lower case
	 * @param string s
	 * @return string
	 */
	lower: function(s)
	{
		return use("Runtime.rtl").toStr(s).toLowerCase();
	},
	/**
	 * Convert string to upper case
	 * @param string s
	 * @return string
	 */
	upper: function(s)
	{
		return use("Runtime.rtl").toStr(s).toUpperCase();
	},
	/**
	 * Compare strings
	 */
	compare: function(a, b)
	{
		if (a == b) return 0;
		if (a < b) return -1;
		if (a > b) return 1;
	},
	/**
	 * Заменяет одну строку на другую
	 */
	replace: function(search, item, s)
	{
		return s.replaceAll(search, item);
	},
	/**
	 * Возвращает повторяющуюся строку
	 * @param {string} s - повторяемая строка
	 * @param {integer} n - количество раз, которые нужно повторить строку s
	 * @return {string} строка
	 */
	str_repeat: function(s, n)
	{
		if (n <= 0) return "";
		var res = '';
		for (var i=0; i < n; i++){
			res += s;
		}
		return res;
	},
	/**
	 * Разбивает строку на подстроки
	 * @param string delimiter - regular expression
	 * @param string s - строка, которую нужно разбить
	 * @param integer limit - ограничение
	 * @return Collection<string>
	 */
	split: function(delimiter, s, limit)
	{
		if (limit == undefined) limit = -1;
		var _rtl = use("Runtime.rtl");
		var _Vector = use("Runtime.Vector");
		
		var arr = null;
		if (!_rtl.exists(limit))
			arr = s.split(delimiter);
		arr = s.split(delimiter, limit);
		return _Vector.from(arr);
	},
	/**
	 * Разбивает строку на подстроки
	 * @param string ch - разделитель
	 * @param string s - строка, которую нужно разбить
	 * @param integer limit - ограничение 
	 * @return Collection<string>
	 */
	splitArr: function(delimiters, s, limit)
	{
		if (limit == undefined) limit = -1;
		var _rtl = use("Runtime.rtl");
		var _Collection = use("Runtime.Collection");
		
		var arr = null;
		var delimiter = new RegExp("[" + delimiters.join("") + "]", "g");
		if (!_rtl.exists(limit))
		{
			arr = s.split(delimiter);
		}
		else
		{
			arr = s.split(delimiter, limit);
		}
		return _Collection.from(arr);
	},
	/**
	 * Соединяет строки
	 * @param string ch - разделитель
	 * @param string s - строка, которую нужно разбить
	 * @param integer limit - ограничение 
	 * @return Vector<string>
	 */
	join: function(ch, arr)
	{
		if (arr == null) return "";
		return Array.prototype.join.call(arr, ch);
	},
	/**
	 * Join
	 */
	join_path: function(arr)
	{
		var path = this.join("/", arr);
		var __v0 = use("Runtime.re");
		path = __v0.replace("\\/+", "/", path);
		var __v1 = use("Runtime.re");
		path = __v1.replace("\\/\\.\\/", "/", path);
		var __v2 = use("Runtime.re");
		path = __v2.replace("\\/+$", "", path);
		return path;
	},
	/**
	 * Удаляет лишние символы слева и справа
	 * @param {string} s - входная строка
	 * @return {integer} новая строка
	 */
	trim: function(s, ch)
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
	},
	/**
	 * Remove first slash
	 */
	removeFirstSlash: function(path)
	{
		var i = 0;
		var sz = this.strlen(path);
		while (i < sz && this.substr(path, i, 1) == "/")
		{
			i++;
		}
		return this.substr(path, i);
	},
	/**
	 * Remove last slash
	 */
	removeLastSlash: function(path)
	{
		var i = this.strlen(path) - 1;
		while (i >= 0 && this.substr(path, i, 1) == "/")
		{
			i--;
		}
		return this.substr(path, 0, i + 1);
	},
	/**
	 * Add first slash
	 */
	addFirstSlash: function(path)
	{
		var __v0 = use("Runtime.rs");
		if (__v0.substr(path, 0, 1) == "/")
		{
			return path;
		}
		return "/" + use("Runtime.rtl").toStr(path);
	},
	/**
	 * Add last slash
	 */
	addLastSlash: function(path)
	{
		var __v0 = use("Runtime.rs");
		var __v1 = use("Runtime.rs");
		if (__v0.substr(path, __v1.strlen(path) - 1, 1) == "/")
		{
			return path;
		}
		return path + use("Runtime.rtl").toStr("/");
	},
	/**
	 * Разбивает путь файла на составляющие
	 * @param {string} filepath путь к файлу
	 * @return {json} Объект вида:
	 *         dirname    - папка, в которой находиться файл
	 *         basename   - полное имя файла
	 *         extension  - расширение файла
	 *         filename   - имя файла без расширения
	 */
	pathinfo: function(filepath)
	{
		var arr1 = this.split(".", filepath).toVector();
		var arr2 = this.split("/", filepath).toVector();
		var filepath = filepath;
		var extension = arr1.pop();
		var basename = arr2.pop();
		var dirname = this.join("/", arr2);
		var ext_length = this.strlen(extension);
		if (ext_length > 0)
		{
			ext_length++;
		}
		var filename = this.substr(basename, 0, -1 * ext_length);
		return use("Runtime.Map").from({"filepath":filepath,"extension":extension,"basename":basename,"dirname":dirname,"filename":filename});
	},
	/**
	 * Возвращает имя файла без расширения
	 * @param {string} filepath - путь к файлу
	 * @return {string} полное имя файла
	 */
	filename: function(filepath)
	{
		var ret = this.pathinfo(filepath);
		var res = Runtime.rtl.attr(ret, "basename");
		var ext = Runtime.rtl.attr(ret, "extension");
		if (ext != "")
		{
			var __v0 = use("Runtime.rs");
			var sz = 0 - __v0.strlen(ext) - 1;
			var __v1 = use("Runtime.rs");
			res = __v1.substr(res, 0, sz);
		}
		return res;
	},
	/**
	 * Возвращает полное имя файла
	 * @param {string} filepath - путь к файлу
	 * @return {string} полное имя файла
	 */
	basename: function(filepath)
	{
		var ret = this.pathinfo(filepath);
		var res = Runtime.rtl.attr(ret, "basename");
		return res;
	},
	/**
	 * Возвращает расширение файла
	 * @param {string} filepath - путь к файлу
	 * @return {string} расширение файла
	 */
	extname: function(filepath)
	{
		var ret = this.pathinfo(filepath);
		var res = Runtime.rtl.attr(ret, "extension");
		return res;
	},
	/**
	 * Возвращает путь к папке, содержащий файл
	 * @param {string} filepath - путь к файлу
	 * @return {string} путь к папке, содержащий файл
	 */
	dirname: function(filepath)
	{
		var ret = this.pathinfo(filepath);
		var res = Runtime.rtl.attr(ret, "dirname");
		return res;
	},
	/**
	 * New line to br
	 */
	nl2br: function(s)
	{
		return this.replace("\n", "<br/>", s);
	},
	/**
	 * Remove spaces
	 */
	spaceless: function(s)
	{
		var __v0 = use("Runtime.re");
		s = __v0.replace(" +", " ", s);
		var __v1 = use("Runtime.re");
		s = __v1.replace("\t", "", s);
		var __v2 = use("Runtime.re");
		s = __v2.replace("\n", "", s);
		return s;
	},
	/**
	 * Ищет позицию первого вхождения подстроки search в строке s.
	 * @param {string} s - строка, в которой производится поиск 
	 * @param {string} search - строка, которую ищем 
	 * @param {string} offset - если этот параметр указан, 
	 *                 то поиск будет начат с указанного количества символов с начала строки.  
	 * @return {variable} Если строка найдена, то возвращает позицию вхождения, начиная с 0.
	 *                    Если строка не найдена, то вернет -1
	 */
	indexOf: function(s, search, offset)
	{
		if (offset == undefined) offset = 0;
		var _rtl = use("Runtime.rtl");
		
		if (!_rtl.exists(offset)) offset = 0;
		var res = _rtl.toStr(s).indexOf(search);
		return res;
	},
	/**
	 * URL encode
	 * @param string s
	 * @return string
	 */
	url_encode: function(s)
	{
		return encodeURIComponent(s);
	},
	/**
	 * Escape HTML special chars
	 * @param string s
	 * @return string
	 */
	htmlEscape: function(s)
	{
		var obj = {
			"<":"&lt;",
			">": "&gt;", 
			"&": "&amp;",
			'"': '&quot;',
			"'": '&#39;',
			'`': '&#x60;',
			'=': '&#x3D;'
		};
		return (new String(s)).replace(/[<>&"'`=]/g, function(v){ return obj[v]; });
	},
	escapeHtml: function(s)
	{
		return this.htmlEscape(s);
	},
	/**
	 * Base64 encode
	 * @param string s
	 * @return string
	 */
	base64_encode: function(s)
	{
		return Buffer.from(s).toString('base64');
	},
	/**
	 * Base64 decode
	 * @param string s
	 * @return string
	 */
	base64_decode: function(s)
	{
		return Buffer.from(s, 'base64').toString('ascii');
	},
	/**
	 * Base64 encode
	 * @param string s
	 * @return string
	 */
	base64_encode_url: function(s)
	{
		return Buffer.from(s).toString('base64');
	},
	/**
	 * Base64 decode
	 * @param string s
	 * @return string
	 */
	base64_decode_url: function(s)
	{
		return Buffer.from(s, 'base64').toString('ascii');
	},
	/**
	 * Parser url
	 * @param string s The string
	 * @return int
	 */
	parse_url: function(s)
	{
		var pos;
		var uri;
		var query;
		var hash;
		pos = this.indexOf(s, "#");
		s = (pos >= 0) ? (this.substr(s, 0, pos)) : (s);
		hash = (pos >= 0) ? (this.substr(s, pos + 1)) : ("");
		pos = this.indexOf(s, "?");
		uri = (pos >= 0) ? (this.substr(s, 0, pos)) : (s);
		query = (pos >= 0) ? (this.substr(s, pos + 1)) : ("");
		var arr = this.split("&", query);
		var arr2 = arr.filter((s) =>
		{
			return s != "";
		}).transition((item) =>
		{
			var arr = this.split("=", item);
			return use("Runtime.Vector").from([Runtime.rtl.attr(arr, 1),Runtime.rtl.attr(arr, 0)]);
		});
		return use("Runtime.Map").from({"uri":uri,"query":query,"query_arr":arr2,"hash":hash});
	},
	/**
	 * Returns string lenght
	 * @param string s The string
	 * @return int
	 */
	url_get_add: function(s, key, value)
	{
		var r = this.parse_url(s);
		var s1 = Runtime.rtl.attr(r, "uri");
		var s2 = Runtime.rtl.attr(r, "query");
		var find = false;
		var arr = this.split("&", s2);
		arr = arr.map((s) =>
		{
			var arr = this.split("=", s);
			if (Runtime.rtl.attr(arr, 0) == key)
			{
				find = true;
				if (value != "")
				{
					return key + use("Runtime.rtl").toStr("=") + use("Runtime.rtl").toStr(this.htmlEscape(value));
				}
				return "";
			}
			return s;
		}).filter((s) =>
		{
			return s != "";
		});
		if (!find && value != "")
		{
			arr.push(key + use("Runtime.rtl").toStr("=") + use("Runtime.rtl").toStr(this.htmlEscape(value)));
		}
		s = s1;
		s2 = this.join("&", arr);
		if (s2 != "")
		{
			s = s + use("Runtime.rtl").toStr("?") + use("Runtime.rtl").toStr(s2);
		}
		return s;
	},
	/**
	 * Strip tags
	 */
	strip_tags: function(content, allowed_tags)
	{
		if (allowed_tags == undefined) allowed_tags = null;
		if (allowed_tags == null)
		{
			var __v0 = use("Runtime.re");
			content = __v0.replace("<[^>]+>", "", content);
			var __v1 = use("Runtime.rs");
			var __v2 = use("Runtime.rs");
			content = __v1.trim(__v2.spaceless(content));
			return content;
		}
		var __v0 = use("Runtime.re");
		var matches = __v0.matchAll("<[^>]+>", content, "i");
		if (matches)
		{
			for (var i = 0; i < matches.count(); i++)
			{
				var match = Runtime.rtl.attr(matches, i);
				var tag_str = Runtime.rtl.attr(match, 0);
				var __v1 = use("Runtime.re");
				var tag_match = __v1.matchAll("<(\\/|)([a-zA-Z]+)(|[^>]*)>", tag_str, "i");
				if (tag_match)
				{
					var tag_name = this.lower(Runtime.rtl.attr(Runtime.rtl.attr(tag_match, 0), 2));
					if (allowed_tags.indexOf(tag_name) == -1)
					{
						content = this.replace(tag_str, "", content);
					}
				}
			}
		}
		var __v1 = use("Runtime.rs");
		var __v2 = use("Runtime.rs");
		content = __v1.trim(__v2.spaceless(content));
		return content;
	},
	/**
	 * Generate uuid
	 */
	uid: function()
	{
	},
	/**
	 * Generate timestamp based uuid
	 */
	time_uid: function()
	{
	},
	/**
	 * Hash function
	 * @param string
	 * @return int hash
	 */
	hash: function(s, last, x, p)
	{
		if (last == undefined) last = true;
		if (x == undefined) x = 257;
		if (p == undefined) p = 1000000007;
		var h = 0;
		var __v0 = use("Runtime.rs");
		var sz = __v0.strlen(s);
		for (var i = 0; i < sz; i++)
		{
			var __v1 = use("Runtime.rs");
			var __v2 = use("Runtime.rs");
			var ch = __v1.ord(__v2.substr(s, i, 1));
			h = (h * x + ch) % p;
		}
		if (last)
		{
			h = h * x % p;
		}
		return h;
	},
	/**
	 * Convert int to hex
	 * @param int
	 * @return string
	 */
	toHex: function(h)
	{
		var r = "";
		var a = "0123456789abcdef";
		while (h >= 0)
		{
			var c = h & 15;
			h = h >> 4;
			var __v0 = use("Runtime.rs");
			r = __v0.substr(a, c, 1) + use("Runtime.rtl").toStr(r);
			if (h == 0)
			{
				break;
			}
		}
		return r;
	},
	/**
	 * Hex decode
	 */
	hexdec: function(s)
	{
		return parseInt(s, 16);
	},
	/**
	 * Generate random string
	 * @var len - string length
	 * @var spec
	 *   - a - alpha
	 *   - n - numberic
	 * @return string
	 */
	random_string: function(len, spec)
	{
		if (len == undefined) len = 8;
		if (spec == undefined) spec = "aun";
		var s = "";
		var res = "";
		var __v0 = use("Runtime.rs");
		var sz = __v0.strlen(spec);
		for (var i = 0; i < sz; i++)
		{
			var ch = Runtime.rtl.attr(spec, i);
			if (ch == "a")
			{
				s += use("Runtime.rtl").toStr("qwertyuiopasdfghjklzxcvbnm");
			}
			if (ch == "u")
			{
				s += use("Runtime.rtl").toStr("QWERTYUIOPASDFGHJKLZXCVBNM");
			}
			else if (ch == "n")
			{
				s += use("Runtime.rtl").toStr("0123456789");
			}
			else if (ch == "s")
			{
				s += use("Runtime.rtl").toStr("!@#$%^&*()-_+='\":;'.,<>?/|~");
			}
		}
		var __v1 = use("Runtime.rs");
		var sz_s = __v1.strlen(s);
		for (var i = 0; i < len; i++)
		{
			var __v2 = use("Runtime.Math");
			var code = __v2.random(0, sz_s - 1);
			res += use("Runtime.rtl").toStr(Runtime.rtl.attr(s, code));
		}
		return res;
	},
	/**
	 * Format string
	 */
	format: function(s, params)
	{
		if (params == undefined) params = null;
		if (params == null)
		{
			return s;
		}
		params.each((value, key) =>
		{
			var __v0 = use("Runtime.rs");
			s = __v0.replace("%" + use("Runtime.rtl").toStr(key) + use("Runtime.rtl").toStr("%"), value, s);
		});
		return s;
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.rs";
	},
	getParentClassName: function()
	{
		return "";
	},
	getClassInfo: function()
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function()
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function()
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(field_name)
	{
		return null;
	},
});use.add(Runtime.rs);
module.exports = Runtime.rs;