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
if (typeof BayLang == 'undefined') BayLang = {};
if (typeof BayLang.LangNode == 'undefined') BayLang.LangNode = {};
BayLang.LangNode.TranslatorNodeProgram = function()
{
	use("BayLang.LangES6.TranslatorES6Program").apply(this, arguments);
};
BayLang.LangNode.TranslatorNodeProgram.prototype = Object.create(use("BayLang.LangES6.TranslatorES6Program").prototype);
BayLang.LangNode.TranslatorNodeProgram.prototype.constructor = BayLang.LangNode.TranslatorNodeProgram;
Object.assign(BayLang.LangNode.TranslatorNodeProgram.prototype,
{
});
Object.assign(BayLang.LangNode.TranslatorNodeProgram, use("BayLang.LangES6.TranslatorES6Program"));
Object.assign(BayLang.LangNode.TranslatorNodeProgram,
{
	/**
	 * Translate program
	 */
	translateProgramHeader: function(t, op_code)
	{
		var content = "\"use strict;\"";
		content += use("Runtime.rtl").toStr(t.s("var use = require('bay-lang').use;"));
		return use("Runtime.Vector").from([t,content]);
	},
	/**
	 * OpDeclareClassFooter
	 */
	OpDeclareClassFooter: function(t, op_code)
	{
		var content = "";
		var name = "";
		content += use("Runtime.rtl").toStr("use.add(" + use("Runtime.rtl").toStr(t.current_class_full_name) + use("Runtime.rtl").toStr(");"));
		/*
		content ~= t.s("if (module.exports == undefined) module.exports = {};");
		Collection<string> arr = rs::split(".", t.current_namespace_name);
		for (int i=0; i<arr.count(); i++)
		{
			name = name ~ ((i == 0) ? "" : ".") ~ arr.item(i);
			string s = "if (module.exports." ~ name ~ " == undefined) module.exports." ~ name ~ " = {};";
			content ~= (content == 0) ? s : t.s(s);
		}
		
		content ~= t.s("module.exports." ~
			t.current_class_full_name ~ " = " ~ t.current_class_full_name ~ ";");
		*/
		content += use("Runtime.rtl").toStr(t.s("module.exports = " + use("Runtime.rtl").toStr(t.current_class_full_name) + use("Runtime.rtl").toStr(";")));
		return use("Runtime.Vector").from([t,content]);
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.LangNode";
	},
	getClassName: function()
	{
		return "BayLang.LangNode.TranslatorNodeProgram";
	},
	getParentClassName: function()
	{
		return "BayLang.LangES6.TranslatorES6Program";
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
});use.add(BayLang.LangNode.TranslatorNodeProgram);
module.exports = BayLang.LangNode.TranslatorNodeProgram;