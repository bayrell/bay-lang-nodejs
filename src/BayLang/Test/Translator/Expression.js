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
BayLang.Test.Translator.Expression = function()
{
};
Object.assign(BayLang.Test.Translator.Expression.prototype,
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
			var op_code = parser.parser_expression.readExpression(parser.createReader());
			translator.expression.translate(op_code, output);
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
	test: function(content, init)
	{
		if (init == undefined) init = null;
		var content_bay = content.get("bay");
		var content_es6 = (content.has("es6")) ? (content.get("es6")) : (content_bay);
		var content_php = (content.has("php")) ? (content.get("php")) : (content_bay);
		this.testExpression("bay_to_bay", content_bay, content_bay, init);
		this.testExpression("bay_to_php", content_bay, content_php, init);
		this.testExpression("bay_to_es6", content_bay, content_es6, init);
		this.testExpression("php_to_php", content_php, content_php, init);
		this.testExpression("php_to_bay", content_php, content_bay, init);
		this.testExpression("php_to_es6", content_php, content_es6, init);
		this.testExpression("es6_to_es6", content_es6, content_es6, init);
		this.testExpression("es6_to_bay", content_es6, content_bay, init);
		this.testExpression("es6_to_php", content_es6, content_php, init);
	},
	testMath1: function()
	{
		var content = use("Runtime.Map").from({"bay":"a + b","es6":"a + b","php":"$a + $b"});
		var init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	},
	testMath2: function()
	{
		var content = use("Runtime.Map").from({"bay":"a * b","php":"$a * $b"});
		var init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	},
	testMath3: function()
	{
		var content = use("Runtime.Map").from({"bay":"a + b * c","php":"$a + $b * $c"});
		var init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
			parser.vars.set("c", true);
		};
		this.test(content, init);
	},
	testMath4: function()
	{
		var content = use("Runtime.Map").from({"bay":"(a + b) * c","php":"($a + $b) * $c"});
		var init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
			parser.vars.set("c", true);
		};
		this.test(content, init);
	},
	testMath5: function()
	{
		var content = use("Runtime.Map").from({"bay":"a * (b + c)","php":"$a * ($b + $c)"});
		var init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
			parser.vars.set("c", true);
		};
		this.test(content, init);
	},
	testMath6: function()
	{
		var content = use("Runtime.Map").from({"bay":"not a","es6":"!a","php":"!$a"});
		var init = (parser, translator) =>
		{
			parser.vars.set("a", true);
		};
		this.test(content, init);
	},
	testMath7: function()
	{
		var content = use("Runtime.Map").from({"bay":"not (a or b)","es6":"!(a || b)","php":"!($a || $b)"});
		var init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	},
	testMath8: function()
	{
		var content = use("Runtime.Map").from({"bay":"not a or not b","es6":"!a || !b","php":"!$a || !$b"});
		var init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	},
	testString: function()
	{
		var content = use("Runtime.Map").from({"bay":"\"Hello \" ~ username ~ \"!\"","es6":"\"Hello \" + String(username) + String(\"!\")","php":"\"Hello \" . $username . \"!\""});
		var init = (parser, translator) =>
		{
			parser.vars.set("username", true);
		};
		this.test(content);
	},
	testFn2: function()
	{
		var content = use("Runtime.Map").from({"bay":"a() + b()","es6":"a() + b()","php":"$a() + $b()"});
		var init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	},
	testFn3: function()
	{
		var content = use("Runtime.Map").from({"bay":"(a() + b()) * c()","es6":"(a() + b()) * c()","php":"($a() + $b()) * $c()"});
		var init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
			parser.vars.set("c", true);
		};
		this.test(content, init);
	},
});
Object.assign(BayLang.Test.Translator.Expression,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Test.Translator";
	},
	getClassName: function()
	{
		return "BayLang.Test.Translator.Expression";
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
			"testMath1",
			"testMath2",
			"testMath3",
			"testMath4",
			"testMath5",
			"testMath6",
			"testMath7",
			"testMath8",
			"testString",
			"testFn2",
			"testFn3",
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(field_name)
	{
		if (field_name == "testMath1")
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
		if (field_name == "testMath2")
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
		if (field_name == "testMath3")
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
		if (field_name == "testMath4")
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
		if (field_name == "testMath5")
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
		if (field_name == "testMath6")
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
		if (field_name == "testMath7")
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
		if (field_name == "testMath8")
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
		if (field_name == "testString")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v8(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testFn2")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v9(use("Runtime.Map").from({})),
				]),
			});
		}
		if (field_name == "testFn3")
		{
			var __v0 = use("Runtime.Unit.Test");
			var __v1 = use("Runtime.Unit.Test");
			var __v2 = use("Runtime.Unit.Test");
			var __v3 = use("Runtime.Unit.Test");
			var __v4 = use("Runtime.Unit.Test");
			var __v5 = use("Runtime.Unit.Test");
			var __v6 = use("Runtime.Unit.Test");
			var __v7 = use("Runtime.Unit.Test");
			var __v8 = use("Runtime.Unit.Test");
			var __v9 = use("Runtime.Unit.Test");
			var __v10 = use("Runtime.Unit.Test");
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v10(use("Runtime.Map").from({})),
				]),
			});
		}
		return null;
	},
});use.add(BayLang.Test.Translator.Expression);
module.exports = BayLang.Test.Translator.Expression;