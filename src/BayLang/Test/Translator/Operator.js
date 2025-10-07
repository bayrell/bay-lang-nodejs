"use strict;"
var use = require('bay-lang').use;
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
if (typeof BayLang.Test == 'undefined') BayLang.Test = {};
if (typeof BayLang.Test.Translator == 'undefined') BayLang.Test.Translator = {};
BayLang.Test.Translator.Operator = function()
{
};
Object.assign(BayLang.Test.Translator.Operator.prototype,
{
	/**
	 * Assert value
	 */
	assert: function(command, value1, value2)
	{
		var message = use("Runtime.Vector").from([command,"Missing:",value1,"Exists:",value2]);
		var __v0 = use("Runtime.Unit.AssertHelper");
		var __v1 = use("Runtime.rs");
		__v0.equalValue(value1, value2, __v1.join("\n", message));
	},
	/**
	 * Test expression
	 */
	testExpression: function(command, src, dest, callback)
	{
		if (callback == undefined) callback = null;
		var __v0 = use("BayLang.LangUtils");
		var res = __v0.parseCommand(command);
		var __v1 = use("BayLang.LangUtils");
		var parser = __v1.createParser(res.get("from"));
		var __v2 = use("BayLang.LangUtils");
		var translator = __v2.createTranslator(res.get("to"));
		/* Init function */
		if (callback)
		{
			callback(parser, translator);
		}
		/* Translate file */
		var output = use("Runtime.Vector").from([]);
		var __v3 = use("BayLang.Exceptions.ParserError");
		try
		{
			parser.setContent(src);
			var op_code = parser.parser_program.parse(parser.createReader());
			if (this.debug)
			{
				console.log(op_code);
			}
			translator.program.translate(op_code, output);
		}
		catch (_ex)
		{
			if (_ex instanceof __v3)
			{
				var error = _ex;
				
				var __v4 = use("Runtime.Exceptions.AssertException");
				throw new __v4(command + use("Runtime.rtl").toStr(" ") + use("Runtime.rtl").toStr(error.toString()))
			}
			else
			{
				throw _ex;
			}
		}
		/* Check output */
		var __v5 = use("Runtime.rs");
		this.assert(command, dest, __v5.join("", output));
	},
	/**
	 * Test lang
	 */
	test: function(content, init, arr)
	{
		if (init == undefined) init = null;
		if (arr == undefined) arr = null;
		var content_bay = content.get("bay");
		var content_es6 = (content.has("es6")) ? (content.get("es6")) : (content_bay);
		var content_php = (content.has("php")) ? (content.get("php")) : (content_bay);
		var __v0 = use("Runtime.Collection");
		if (content_bay instanceof __v0)
		{
			var __v1 = use("Runtime.rs");
			content_bay = __v1.join("\n", content_bay);
		}
		var __v2 = use("Runtime.Collection");
		if (content_es6 instanceof __v2)
		{
			var __v3 = use("Runtime.rs");
			content_es6 = __v3.join("\n", content_es6);
		}
		var __v4 = use("Runtime.Collection");
		if (content_php instanceof __v4)
		{
			var __v5 = use("Runtime.rs");
			content_php = __v5.join("\n", content_php);
		}
		if (arr == null)
		{
			arr = use("Runtime.Vector").from(["bay_to_bay","bay_to_php","bay_to_es6","php_to_php","php_to_bay","php_to_es6","es6_to_es6","es6_to_bay","es6_to_php"]);
		}
		if (arr.indexOf("bay_to_bay") >= 0)
		{
			this.testExpression("bay_to_bay", content_bay, content_bay, init);
		}
		if (arr.indexOf("bay_to_php") >= 0)
		{
			this.testExpression("bay_to_php", content_bay, content_php, init);
		}
		if (arr.indexOf("bay_to_es6") >= 0)
		{
			this.testExpression("bay_to_es6", content_bay, content_es6, init);
		}
		if (arr.indexOf("php_to_php") >= 0)
		{
			this.testExpression("php_to_php", content_php, content_php, init);
		}
		if (arr.indexOf("php_to_bay") >= 0)
		{
			this.testExpression("php_to_bay", content_php, content_bay, init);
		}
		if (arr.indexOf("php_to_es6") >= 0)
		{
			this.testExpression("php_to_es6", content_php, content_es6, init);
		}
		if (arr.indexOf("es6_to_es6") >= 0)
		{
			this.testExpression("es6_to_es6", content_es6, content_es6, init);
		}
		if (arr.indexOf("es6_to_bay") >= 0)
		{
			this.testExpression("es6_to_bay", content_es6, content_bay, init);
		}
		if (arr.indexOf("es6_to_php") >= 0)
		{
			this.testExpression("es6_to_php", content_es6, content_php, init);
		}
	},
	testAssign2: function()
	{
		var content = use("Runtime.Map").from({"bay":"var a = 1;","php":use("Runtime.Vector").from(["<?php","$a = 1;"])});
		this.test(content);
	},
	testAssign3: function()
	{
		var content = use("Runtime.Map").from({"bay":use("Runtime.Vector").from(["var a = 1;","a = 2;"]),"php":use("Runtime.Vector").from(["<?php","$a = 1;","$a = 2;"])});
		this.test(content);
	},
	testAssign4: function()
	{
		var content = use("Runtime.Map").from({"bay":use("Runtime.Vector").from(["var a = 1, b = 2;","a = a + b;"]),"php":use("Runtime.Vector").from(["<?php","$a = 1;","$b = 2;","$a = $a + $b;"])});
		this.test(content, null, use("Runtime.Vector").from(["bay_to_bay","bay_to_php","bay_to_es6","php_to_php","es6_to_es6","es6_to_bay","es6_to_php"]));
	},
	testFor1: function()
	{
		var content = use("Runtime.Map").from({"bay":use("Runtime.Vector").from(["for (var i = 0; i < 10; i++)","{","\tprint(i);","}"]),"es6":use("Runtime.Vector").from(["for (var i = 0; i < 10; i++)","{","\tconsole.log(i);","}"]),"php":use("Runtime.Vector").from(["<?php","for ($i = 0; $i < 10; $i++)","{","\techo($i);","}"])});
		this.test(content);
	},
	testIf1: function()
	{
		var content = use("Runtime.Map").from({"bay":use("Runtime.Vector").from(["if (a > b)","{","\tprint(\"Yes\");","}"]),"es6":use("Runtime.Vector").from(["if (a > b)","{","\tconsole.log(\"Yes\");","}"]),"php":use("Runtime.Vector").from(["<?php","if ($a > $b)","{","\techo(\"Yes\");","}"])});
		var init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	},
	testIf2: function()
	{
		var content = use("Runtime.Map").from({"bay":use("Runtime.Vector").from(["if (a > b)","{","\tprint(\"Yes\");","}","else","{","\tprint(\"No\");","}"]),"es6":use("Runtime.Vector").from(["if (a > b)","{","\tconsole.log(\"Yes\");","}","else","{","\tconsole.log(\"No\");","}"]),"php":use("Runtime.Vector").from(["<?php","if ($a > $b)","{","\techo(\"Yes\");","}","else","{","\techo(\"No\");","}"])});
		var init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	},
	testIf3: function()
	{
		var content = use("Runtime.Map").from({"bay":use("Runtime.Vector").from(["if (a == 1)","{","\tprint(1);","}","else if (a == 2)","{","\tprint(2);","}","else if (a == 3)","{","\tprint(3);","}","else","{","\tprint(\"No\");","}"]),"es6":use("Runtime.Vector").from(["if (a == 1)","{","\tconsole.log(1);","}","else if (a == 2)","{","\tconsole.log(2);","}","else if (a == 3)","{","\tconsole.log(3);","}","else","{","\tconsole.log(\"No\");","}"]),"php":use("Runtime.Vector").from(["<?php","if ($a == 1)","{","\techo(1);","}","else if ($a == 2)","{","\techo(2);","}","else if ($a == 3)","{","\techo(3);","}","else","{","\techo(\"No\");","}"])});
		var init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	},
	testWhile1: function()
	{
		var content = use("Runtime.Map").from({"bay":use("Runtime.Vector").from(["var i = 0;","while (i < 10)","{","\ti++;","}"]),"php":use("Runtime.Vector").from(["<?php","$i = 0;","while ($i < 10)","{","\t$i++;","}"])});
		this.test(content);
	},
	_init: function()
	{
		this.debug = false;
	},
});
Object.assign(BayLang.Test.Translator.Operator,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Test.Translator";
	},
	getClassName: function()
	{
		return "BayLang.Test.Translator.Operator";
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
			"testAssign2",
			"testAssign3",
			"testAssign4",
			"testFor1",
			"testIf1",
			"testIf2",
			"testIf3",
			"testWhile1",
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(field_name)
	{
		if (field_name == "testAssign2")
		{
			var __v0 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v0(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAssign3")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v1(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testAssign4")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v2(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testFor1")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v3(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testIf1")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v4(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testIf2")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v5(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testIf3")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v6(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testWhile1")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v7(use("Runtime.Map").from({})),
				]),
			});
		}
		return null;
	},
});use.add(BayLang.Test.Translator.Operator);
module.exports = BayLang.Test.Translator.Operator;