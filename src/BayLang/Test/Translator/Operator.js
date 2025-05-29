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
if (typeof BayLang.Test == 'undefined') BayLang.Test = {};
if (typeof BayLang.Test.Translator == 'undefined') BayLang.Test.Translator = {};
BayLang.Test.Translator.Operator = function(ctx)
{
};
Object.assign(BayLang.Test.Translator.Operator.prototype,
{
	/**
	 * Assert value
	 */
	assert: function(ctx, command, value1, value2)
	{
		var message = use("Runtime.Vector").from([command,"Missing:",value1,"Exists:",value2]);
		var __v0 = use("Runtime.Unit.AssertHelper");
		var __v1 = use("Runtime.rs");
		__v0.equalValue(ctx, value1, value2, __v1.join(ctx, "\n", message));
	},
	/**
	 * Test expression
	 */
	testExpression: function(ctx, command, src, dest, callback)
	{
		if (callback == undefined) callback = null;
		var __v0 = use("BayLang.LangUtils");
		var res = __v0.parseCommand(ctx, command);
		var __v1 = use("BayLang.LangUtils");
		var parser = __v1.createParser(ctx, res.get(ctx, "from"));
		var __v2 = use("BayLang.LangUtils");
		var translator = __v2.createTranslator(ctx, res.get(ctx, "to"));
		/* Init function */
		if (callback)
		{
			callback(ctx, parser, translator);
		}
		/* Translate file */
		var output = use("Runtime.Vector").from([]);
		var __v3 = use("BayLang.Exceptions.ParserError");
		try
		{
			parser.setContent(ctx, src);
			var op_code = parser.parser_program.parse(ctx, parser.createReader(ctx));
			if (this.debug)
			{
				console.log(op_code);
			}
			translator.program.translate(ctx, op_code, output);
		}
		catch (_ex)
		{
			if (_ex instanceof __v3)
			{
				var error = _ex;
				
				var __v4 = use("Runtime.Exceptions.AssertException");
				throw new __v4(ctx, command + use("Runtime.rtl").toStr(" ") + use("Runtime.rtl").toStr(error.toString(ctx)))
			}
			else
			{
				throw _ex;
			}
		}
		/* Check output */
		var __v3 = use("Runtime.rs");
		this.assert(ctx, command, dest, __v3.join(ctx, "", output));
	},
	/**
	 * Test lang
	 */
	test: function(ctx, content, init, arr)
	{
		if (init == undefined) init = null;
		if (arr == undefined) arr = null;
		var content_bay = content.get(ctx, "bay");
		var content_es6 = (content.has(ctx, "es6")) ? (content.get(ctx, "es6")) : (content_bay);
		var content_php = (content.has(ctx, "php")) ? (content.get(ctx, "php")) : (content_bay);
		var __v0 = use("Runtime.Collection");
		if (content_bay instanceof __v0)
		{
			var __v1 = use("Runtime.rs");
			content_bay = __v1.join(ctx, "\n", content_bay);
		}
		var __v0 = use("Runtime.Collection");
		if (content_es6 instanceof __v0)
		{
			var __v1 = use("Runtime.rs");
			content_es6 = __v1.join(ctx, "\n", content_es6);
		}
		var __v0 = use("Runtime.Collection");
		if (content_php instanceof __v0)
		{
			var __v1 = use("Runtime.rs");
			content_php = __v1.join(ctx, "\n", content_php);
		}
		if (arr == null)
		{
			arr = use("Runtime.Vector").from(["bay_to_bay","bay_to_php","bay_to_es6","php_to_php","php_to_bay","php_to_es6","es6_to_es6","es6_to_bay","es6_to_php"]);
		}
		if (arr.indexOf(ctx, "bay_to_bay") >= 0)
		{
			this.testExpression(ctx, "bay_to_bay", content_bay, content_bay, init);
		}
		if (arr.indexOf(ctx, "bay_to_php") >= 0)
		{
			this.testExpression(ctx, "bay_to_php", content_bay, content_php, init);
		}
		if (arr.indexOf(ctx, "bay_to_es6") >= 0)
		{
			this.testExpression(ctx, "bay_to_es6", content_bay, content_es6, init);
		}
		if (arr.indexOf(ctx, "php_to_php") >= 0)
		{
			this.testExpression(ctx, "php_to_php", content_php, content_php, init);
		}
		if (arr.indexOf(ctx, "php_to_bay") >= 0)
		{
			this.testExpression(ctx, "php_to_bay", content_php, content_bay, init);
		}
		if (arr.indexOf(ctx, "php_to_es6") >= 0)
		{
			this.testExpression(ctx, "php_to_es6", content_php, content_es6, init);
		}
		if (arr.indexOf(ctx, "es6_to_es6") >= 0)
		{
			this.testExpression(ctx, "es6_to_es6", content_es6, content_es6, init);
		}
		if (arr.indexOf(ctx, "es6_to_bay") >= 0)
		{
			this.testExpression(ctx, "es6_to_bay", content_es6, content_bay, init);
		}
		if (arr.indexOf(ctx, "es6_to_php") >= 0)
		{
			this.testExpression(ctx, "es6_to_php", content_es6, content_php, init);
		}
	},
	testAssign2: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":"var a = 1;","php":use("Runtime.Vector").from(["<?php","$a = 1;"])});
		this.test(ctx, content);
	},
	testAssign3: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":use("Runtime.Vector").from(["var a = 1;","a = 2;"]),"php":use("Runtime.Vector").from(["<?php","$a = 1;","$a = 2;"])});
		this.test(ctx, content);
	},
	testAssign4: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":use("Runtime.Vector").from(["var a = 1, b = 2;","a = a + b;"]),"php":use("Runtime.Vector").from(["<?php","$a = 1;","$b = 2;","$a = $a + $b;"])});
		this.test(ctx, content, null, use("Runtime.Vector").from(["bay_to_bay","bay_to_php","bay_to_es6","php_to_php","es6_to_es6","es6_to_bay","es6_to_php"]));
	},
	testFor1: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":use("Runtime.Vector").from(["for (var i = 0; i < 10; i++)","{","\tprint(i);","}"]),"es6":use("Runtime.Vector").from(["for (var i = 0; i < 10; i++)","{","\tconsole.log(i);","}"]),"php":use("Runtime.Vector").from(["<?php","for ($i = 0; $i < 10; $i++)","{","\techo($i);","}"])});
		this.test(ctx, content);
	},
	testIf1: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":use("Runtime.Vector").from(["if (a > b)","{","\tprint(\"Yes\");","}"]),"es6":use("Runtime.Vector").from(["if (a > b)","{","\tconsole.log(\"Yes\");","}"]),"php":use("Runtime.Vector").from(["<?php","if ($a > $b)","{","\techo(\"Yes\");","}"])});
		var init = (ctx, parser, translator) =>
		{
			parser.vars.set(ctx, "a", true);
			parser.vars.set(ctx, "b", true);
		};
		this.test(ctx, content, init);
	},
	testIf2: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":use("Runtime.Vector").from(["if (a > b)","{","\tprint(\"Yes\");","}","else","{","\tprint(\"No\");","}"]),"es6":use("Runtime.Vector").from(["if (a > b)","{","\tconsole.log(\"Yes\");","}","else","{","\tconsole.log(\"No\");","}"]),"php":use("Runtime.Vector").from(["<?php","if ($a > $b)","{","\techo(\"Yes\");","}","else","{","\techo(\"No\");","}"])});
		var init = (ctx, parser, translator) =>
		{
			parser.vars.set(ctx, "a", true);
			parser.vars.set(ctx, "b", true);
		};
		this.test(ctx, content, init);
	},
	testIf3: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":use("Runtime.Vector").from(["if (a == 1)","{","\tprint(1);","}","else if (a == 2)","{","\tprint(2);","}","else if (a == 3)","{","\tprint(3);","}","else","{","\tprint(\"No\");","}"]),"es6":use("Runtime.Vector").from(["if (a == 1)","{","\tconsole.log(1);","}","else if (a == 2)","{","\tconsole.log(2);","}","else if (a == 3)","{","\tconsole.log(3);","}","else","{","\tconsole.log(\"No\");","}"]),"php":use("Runtime.Vector").from(["<?php","if ($a == 1)","{","\techo(1);","}","else if ($a == 2)","{","\techo(2);","}","else if ($a == 3)","{","\techo(3);","}","else","{","\techo(\"No\");","}"])});
		var init = (ctx, parser, translator) =>
		{
			parser.vars.set(ctx, "a", true);
			parser.vars.set(ctx, "b", true);
		};
		this.test(ctx, content, init);
	},
	testWhile1: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":use("Runtime.Vector").from(["var i = 0;","while (i < 10)","{","\ti++;","}"]),"php":use("Runtime.Vector").from(["<?php","$i = 0;","while ($i < 10)","{","\t$i++;","}"])});
		this.test(ctx, content);
	},
	_init: function(ctx)
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
	getMethodInfoByName: function(ctx,field_name)
	{
		if (field_name == "testAssign2")
		{
			var __v0 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v0(ctx, use("Runtime.Map").from({})),
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
					new __v1(ctx, use("Runtime.Map").from({})),
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
					new __v2(ctx, use("Runtime.Map").from({})),
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
					new __v3(ctx, use("Runtime.Map").from({})),
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
					new __v4(ctx, use("Runtime.Map").from({})),
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
					new __v5(ctx, use("Runtime.Map").from({})),
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
					new __v6(ctx, use("Runtime.Map").from({})),
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
					new __v7(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		return null;
	},
});use.add(BayLang.Test.Translator.Operator);
module.exports = BayLang.Test.Translator.Operator;