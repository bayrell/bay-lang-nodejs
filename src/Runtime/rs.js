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
Runtime.rs = function(ctx)
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
	strlen: function(ctx, s)
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
	substr: function(ctx, s, start, length)
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
			var sz = _rs.strlen(ctx, s);
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
	charAt: function(ctx, s, pos)
	{
		return this.substr(ctx, s, pos, 1);
	},
	/**
	 * Returns ASCII symbol by code
	 * @param int code
	 */
	chr: function(ctx, code)
	{
		return String.fromCharCode(code);
	},
	/**
	 * Returns ASCII symbol code
	 * @param char ch
	 */
	ord: function(ctx, ch)
	{
		return use("Runtime.rtl").toStr(ch).charCodeAt(0);
	},
	/**
	 * Convert string to lower case
	 * @param string s
	 * @return string
	 */
	lower: function(ctx, s)
	{
		return use("Runtime.rtl").toStr(s).toLowerCase();
	},
	/**
	 * Convert string to upper case
	 * @param string s
	 * @return string
	 */
	upper: function(ctx, s)
	{
		return use("Runtime.rtl").toStr(s).toUpperCase();
	},
	/**
	 * Compare strings
	 */
	compare: function(ctx, a, b)
	{
		if (a == b) return 0;
		if (a < b) return -1;
		if (a > b) return 1;
	},
	/**
	 * Заменяет одну строку на другую
	 */
	replace: function(ctx, search, item, s)
	{
		return s.replaceAll(search, item);
	},
	/**
	 * Возвращает повторяющуюся строку
	 * @param {string} s - повторяемая строка
	 * @param {integer} n - количество раз, которые нужно повторить строку s
	 * @return {string} строка
	 */
	str_repeat: function(ctx, s, n)
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
	split: function(ctx, delimiter, s, limit)
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
	splitArr: function(ctx, delimiters, s, limit)
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
	join: function(ctx, ch, arr)
	{
		if (arr == null) return "";
		return Array.prototype.join.call(arr, ch);
	},
	/**
	 * Join
	 */
	join_path: function(ctx, arr)
	{
		var path = this.join(ctx, "/", arr);
		var __v0 = use("Runtime.re");
		path = __v0.replace(ctx, "\\/+", "/", path);
		var __v1 = use("Runtime.re");
		path = __v1.replace(ctx, "\\/\\.\\/", "/", path);
		var __v2 = use("Runtime.re");
		path = __v2.replace(ctx, "\\/+$", "", path);
		return path;
	},
	/**
	 * Удаляет лишние символы слева и справа
	 * @param {string} s - входная строка
	 * @return {integer} новая строка
	 */
	trim: function(ctx, s, ch)
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
	removeFirstSlash: function(ctx, path)
	{
		var i = 0;
		var sz = this.strlen(ctx, path);
		while (i < sz && this.substr(ctx, path, i, 1) == "/")
		{
			i++;
		}
		return this.substr(ctx, path, i);
	},
	/**
	 * Remove last slash
	 */
	removeLastSlash: function(ctx, path)
	{
		var i = this.strlen(ctx, path) - 1;
		while (i >= 0 && this.substr(ctx, path, i, 1) == "/")
		{
			i--;
		}
		return this.substr(ctx, path, 0, i + 1);
	},
	/**
	 * Add first slash
	 */
	addFirstSlash: function(ctx, path)
	{
		var __v0 = use("Runtime.rs");
		if (__v0.substr(ctx, path, 0, 1) == "/")
		{
			return path;
		}
		return "/" + use("Runtime.rtl").toStr(path);
	},
	/**
	 * Add last slash
	 */
	addLastSlash: function(ctx, path)
	{
		var __v0 = use("Runtime.rs");
		var __v1 = use("Runtime.rs");
		if (__v0.substr(ctx, path, __v1.strlen(ctx, path) - 1, 1) == "/")
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
	pathinfo: function(ctx, filepath)
	{
		var arr1 = this.split(ctx, ".", filepath).toVector(ctx);
		var arr2 = this.split(ctx, "/", filepath).toVector(ctx);
		var filepath = filepath;
		var extension = arr1.pop(ctx);
		var basename = arr2.pop(ctx);
		var dirname = this.join(ctx, "/", arr2);
		var ext_length = this.strlen(ctx, extension);
		if (ext_length > 0)
		{
			ext_length++;
		}
		var filename = this.substr(ctx, basename, 0, -1 * ext_length);
		return use("Runtime.Map").from({"filepath":filepath,"extension":extension,"basename":basename,"dirname":dirname,"filename":filename});
	},
	/**
	 * Возвращает имя файла без расширения
	 * @param {string} filepath - путь к файлу
	 * @return {string} полное имя файла
	 */
	filename: function(ctx, filepath)
	{
		var ret = this.pathinfo(ctx, filepath);
		var res = Runtime.rtl.attr(ctx, ret, "basename");
		var ext = Runtime.rtl.attr(ctx, ret, "extension");
		if (ext != "")
		{
			var __v0 = use("Runtime.rs");
			var sz = 0 - __v0.strlen(ctx, ext) - 1;
			var __v1 = use("Runtime.rs");
			res = __v1.substr(ctx, res, 0, sz);
		}
		return res;
	},
	/**
	 * Возвращает полное имя файла
	 * @param {string} filepath - путь к файлу
	 * @return {string} полное имя файла
	 */
	basename: function(ctx, filepath)
	{
		var ret = this.pathinfo(ctx, filepath);
		var res = Runtime.rtl.attr(ctx, ret, "basename");
		return res;
	},
	/**
	 * Возвращает расширение файла
	 * @param {string} filepath - путь к файлу
	 * @return {string} расширение файла
	 */
	extname: function(ctx, filepath)
	{
		var ret = this.pathinfo(ctx, filepath);
		var res = Runtime.rtl.attr(ctx, ret, "extension");
		return res;
	},
	/**
	 * Возвращает путь к папке, содержащий файл
	 * @param {string} filepath - путь к файлу
	 * @return {string} путь к папке, содержащий файл
	 */
	dirname: function(ctx, filepath)
	{
		var ret = this.pathinfo(ctx, filepath);
		var res = Runtime.rtl.attr(ctx, ret, "dirname");
		return res;
	},
	/**
	 * New line to br
	 */
	nl2br: function(ctx, s)
	{
		return this.replace(ctx, "\n", "<br/>", s);
	},
	/**
	 * Remove spaces
	 */
	spaceless: function(ctx, s)
	{
		var __v0 = use("Runtime.re");
		s = __v0.replace(ctx, " +", " ", s);
		var __v1 = use("Runtime.re");
		s = __v1.replace(ctx, "\t", "", s);
		var __v2 = use("Runtime.re");
		s = __v2.replace(ctx, "\n", "", s);
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
	indexOf: function(ctx, s, search, offset)
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
	url_encode: function(ctx, s)
	{
		return encodeURIComponent(s);
	},
	/**
	 * Escape HTML special chars
	 * @param string s
	 * @return string
	 */
	htmlEscape: function(ctx, s)
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
	escapeHtml: function(ctx, s)
	{
		return this.htmlEscape(ctx, s);
	},
	/**
	 * Base64 encode
	 * @param string s
	 * @return string
	 */
	base64_encode: function(ctx, s)
	{
		return Buffer.from(s).toString('base64');
	},
	/**
	 * Base64 decode
	 * @param string s
	 * @return string
	 */
	base64_decode: function(ctx, s)
	{
		return Buffer.from(s, 'base64').toString('ascii');
	},
	/**
	 * Base64 encode
	 * @param string s
	 * @return string
	 */
	base64_encode_url: function(ctx, s)
	{
		return Buffer.from(s).toString('base64');
	},
	/**
	 * Base64 decode
	 * @param string s
	 * @return string
	 */
	base64_decode_url: function(ctx, s)
	{
		return Buffer.from(s, 'base64').toString('ascii');
	},
	/**
	 * Parser url
	 * @param string s The string
	 * @return int
	 */
	parse_url: function(ctx, s)
	{
		var pos;
		var uri;
		var query;
		var hash;
		pos = this.indexOf(ctx, s, "#");
		s = (pos >= 0) ? (this.substr(ctx, s, 0, pos)) : (s);
		hash = (pos >= 0) ? (this.substr(ctx, s, pos + 1)) : ("");
		pos = this.indexOf(ctx, s, "?");
		uri = (pos >= 0) ? (this.substr(ctx, s, 0, pos)) : (s);
		query = (pos >= 0) ? (this.substr(ctx, s, pos + 1)) : ("");
		var arr = this.split(ctx, "&", query);
		var arr2 = arr.filter(ctx, (ctx, s) =>
		{
			return s != "";
		}).transition(ctx, (ctx, item) =>
		{
			var arr = this.split(ctx, "=", item);
			return use("Runtime.Vector").from([Runtime.rtl.attr(ctx, arr, 1),Runtime.rtl.attr(ctx, arr, 0)]);
		});
		return use("Runtime.Map").from({"uri":uri,"query":query,"query_arr":arr2,"hash":hash});
	},
	/**
	 * Returns string lenght
	 * @param string s The string
	 * @return int
	 */
	url_get_add: function(ctx, s, key, value)
	{
		var r = this.parse_url(ctx, s);
		var s1 = Runtime.rtl.attr(ctx, r, "uri");
		var s2 = Runtime.rtl.attr(ctx, r, "query");
		var find = false;
		var arr = this.split(ctx, "&", s2);
		arr = arr.map(ctx, (ctx, s) =>
		{
			var arr = this.split(ctx, "=", s);
			if (Runtime.rtl.attr(ctx, arr, 0) == key)
			{
				find = true;
				if (value != "")
				{
					return key + use("Runtime.rtl").toStr("=") + use("Runtime.rtl").toStr(this.htmlEscape(ctx, value));
				}
				return "";
			}
			return s;
		}).filter(ctx, (ctx, s) =>
		{
			return s != "";
		});
		if (!find && value != "")
		{
			arr.push(ctx, key + use("Runtime.rtl").toStr("=") + use("Runtime.rtl").toStr(this.htmlEscape(ctx, value)));
		}
		s = s1;
		s2 = this.join(ctx, "&", arr);
		if (s2 != "")
		{
			s = s + use("Runtime.rtl").toStr("?") + use("Runtime.rtl").toStr(s2);
		}
		return s;
	},
	/**
	 * Strip tags
	 */
	strip_tags: function(ctx, content, allowed_tags)
	{
		if (allowed_tags == undefined) allowed_tags = null;
		if (allowed_tags == null)
		{
			var __v0 = use("Runtime.re");
			content = __v0.replace(ctx, "<[^>]+>", "", content);
			var __v1 = use("Runtime.rs");
			var __v2 = use("Runtime.rs");
			content = __v1.trim(ctx, __v2.spaceless(ctx, content));
			return content;
		}
		var __v0 = use("Runtime.re");
		var matches = __v0.matchAll(ctx, "<[^>]+>", content, "i");
		if (matches)
		{
			for (var i = 0; i < matches.count(ctx); i++)
			{
				var match = Runtime.rtl.attr(ctx, matches, i);
				var tag_str = Runtime.rtl.attr(ctx, match, 0);
				var __v1 = use("Runtime.re");
				var tag_match = __v1.matchAll(ctx, "<(\\/|)([a-zA-Z]+)(|[^>]*)>", tag_str, "i");
				if (tag_match)
				{
					var tag_name = this.lower(ctx, Runtime.rtl.attr(ctx, Runtime.rtl.attr(ctx, tag_match, 0), 2));
					if (allowed_tags.indexOf(ctx, tag_name) == -1)
					{
						content = this.replace(ctx, tag_str, "", content);
					}
				}
			}
		}
		var __v1 = use("Runtime.rs");
		var __v2 = use("Runtime.rs");
		content = __v1.trim(ctx, __v2.spaceless(ctx, content));
		return content;
	},
	/**
	 * Generate uuid
	 */
	uid: function(ctx)
	{
	},
	/**
	 * Generate timestamp based uuid
	 */
	time_uid: function(ctx)
	{
	},
	/**
	 * Hash function
	 * @param string
	 * @return int hash
	 */
	hash: function(ctx, s, last, x, p)
	{
		if (last == undefined) last = true;
		if (x == undefined) x = 257;
		if (p == undefined) p = 1000000007;
		var h = 0;
		var __v0 = use("Runtime.rs");
		var sz = __v0.strlen(ctx, s);
		for (var i = 0; i < sz; i++)
		{
			var __v1 = use("Runtime.rs");
			var __v2 = use("Runtime.rs");
			var ch = __v1.ord(ctx, __v2.substr(ctx, s, i, 1));
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
	toHex: function(ctx, h)
	{
		var r = "";
		var a = "0123456789abcdef";
		while (h >= 0)
		{
			var c = h & 15;
			h = h >> 4;
			var __v0 = use("Runtime.rs");
			r = __v0.substr(ctx, a, c, 1) + use("Runtime.rtl").toStr(r);
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
	hexdec: function(ctx, s)
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
	random_string: function(ctx, len, spec)
	{
		if (len == undefined) len = 8;
		if (spec == undefined) spec = "aun";
		var s = "";
		var res = "";
		var __v0 = use("Runtime.rs");
		var sz = __v0.strlen(ctx, spec);
		for (var i = 0; i < sz; i++)
		{
			var ch = Runtime.rtl.attr(ctx, spec, i);
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
		var sz_s = __v1.strlen(ctx, s);
		for (var i = 0; i < len; i++)
		{
			var __v2 = use("Runtime.Math");
			var code = __v2.random(ctx, 0, sz_s - 1);
			res += use("Runtime.rtl").toStr(Runtime.rtl.attr(ctx, s, code));
		}
		return res;
	},
	/**
	 * Format string
	 */
	format: function(ctx, s, params)
	{
		if (params == undefined) params = null;
		if (params == null)
		{
			return s;
		}
		params.each(ctx, (ctx, value, key) =>
		{
			var __v0 = use("Runtime.rs");
			s = __v0.replace(ctx, "%" + use("Runtime.rtl").toStr(key) + use("Runtime.rtl").toStr("%"), value, s);
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
	getClassInfo: function(ctx)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function(ctx)
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function(ctx)
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		return null;
	},
});use.add(Runtime.rs);
module.exports = Runtime.rs;