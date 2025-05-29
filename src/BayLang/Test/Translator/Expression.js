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
BayLang.Test.Translator.Expression = function(ctx)
{
};
Object.assign(BayLang.Test.Translator.Expression.prototype,
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
			var op_code = parser.parser_expression.readExpression(ctx, parser.createReader(ctx));
			translator.expression.translate(ctx, op_code, output);
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
	test: function(ctx, content, init)
	{
		if (init == undefined) init = null;
		var content_bay = content.get(ctx, "bay");
		var content_es6 = (content.has(ctx, "es6")) ? (content.get(ctx, "es6")) : (content_bay);
		var content_php = (content.has(ctx, "php")) ? (content.get(ctx, "php")) : (content_bay);
		this.testExpression(ctx, "bay_to_bay", content_bay, content_bay, init);
		this.testExpression(ctx, "bay_to_php", content_bay, content_php, init);
		this.testExpression(ctx, "bay_to_es6", content_bay, content_es6, init);
		this.testExpression(ctx, "php_to_php", content_php, content_php, init);
		this.testExpression(ctx, "php_to_bay", content_php, content_bay, init);
		this.testExpression(ctx, "php_to_es6", content_php, content_es6, init);
		this.testExpression(ctx, "es6_to_es6", content_es6, content_es6, init);
		this.testExpression(ctx, "es6_to_bay", content_es6, content_bay, init);
		this.testExpression(ctx, "es6_to_php", content_es6, content_php, init);
	},
	testMath1: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":"a + b","es6":"a + b","php":"$a + $b"});
		var init = (ctx, parser, translator) =>
		{
			parser.vars.set(ctx, "a", true);
			parser.vars.set(ctx, "b", true);
		};
		this.test(ctx, content, init);
	},
	testMath2: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":"a * b","php":"$a * $b"});
		var init = (ctx, parser, translator) =>
		{
			parser.vars.set(ctx, "a", true);
			parser.vars.set(ctx, "b", true);
		};
		this.test(ctx, content, init);
	},
	testMath3: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":"a + b * c","php":"$a + $b * $c"});
		var init = (ctx, parser, translator) =>
		{
			parser.vars.set(ctx, "a", true);
			parser.vars.set(ctx, "b", true);
			parser.vars.set(ctx, "c", true);
		};
		this.test(ctx, content, init);
	},
	testMath4: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":"(a + b) * c","php":"($a + $b) * $c"});
		var init = (ctx, parser, translator) =>
		{
			parser.vars.set(ctx, "a", true);
			parser.vars.set(ctx, "b", true);
			parser.vars.set(ctx, "c", true);
		};
		this.test(ctx, content, init);
	},
	testMath5: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":"a * (b + c)","php":"$a * ($b + $c)"});
		var init = (ctx, parser, translator) =>
		{
			parser.vars.set(ctx, "a", true);
			parser.vars.set(ctx, "b", true);
			parser.vars.set(ctx, "c", true);
		};
		this.test(ctx, content, init);
	},
	testMath6: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":"not a","es6":"!a","php":"!$a"});
		var init = (ctx, parser, translator) =>
		{
			parser.vars.set(ctx, "a", true);
		};
		this.test(ctx, content, init);
	},
	testMath7: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":"not (a or b)","es6":"!(a || b)","php":"!($a || $b)"});
		var init = (ctx, parser, translator) =>
		{
			parser.vars.set(ctx, "a", true);
			parser.vars.set(ctx, "b", true);
		};
		this.test(ctx, content, init);
	},
	testMath8: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":"not a or not b","es6":"!a || !b","php":"!$a || !$b"});
		var init = (ctx, parser, translator) =>
		{
			parser.vars.set(ctx, "a", true);
			parser.vars.set(ctx, "b", true);
		};
		this.test(ctx, content, init);
	},
	testFn2: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":"a() + b()","es6":"a() + b()","php":"$a() + $b()"});
		var init = (ctx, parser, translator) =>
		{
			parser.vars.set(ctx, "a", true);
			parser.vars.set(ctx, "b", true);
		};
		this.test(ctx, content, init);
	},
	testFn3: function(ctx)
	{
		var content = use("Runtime.Map").from({"bay":"(a() + b()) * c()","es6":"(a() + b()) * c()","php":"($a() + $b()) * $c()"});
		var init = (ctx, parser, translator) =>
		{
			parser.vars.set(ctx, "a", true);
			parser.vars.set(ctx, "b", true);
			parser.vars.set(ctx, "c", true);
		};
		this.test(ctx, content, init);
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
			"testMath1",
			"testMath2",
			"testMath3",
			"testMath4",
			"testMath5",
			"testMath6",
			"testMath7",
			"testMath8",
			"testFn2",
			"testFn3",
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		if (field_name == "testMath1")
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
		if (field_name == "testMath2")
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
		if (field_name == "testMath3")
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
					new __v3(ctx, use("Runtime.Map").from({})),
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
					new __v4(ctx, use("Runtime.Map").from({})),
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
					new __v5(ctx, use("Runtime.Map").from({})),
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
					new __v6(ctx, use("Runtime.Map").from({})),
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
					new __v7(ctx, use("Runtime.Map").from({})),
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
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v8(ctx, use("Runtime.Map").from({})),
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
			var Vector = use("Runtime.Vector");
			var Map = use("Runtime.Map");
			return Map.from({
				"annotations": Vector.from([
					new __v9(ctx, use("Runtime.Map").from({})),
				]),
			});
		}
		return null;
	},
});use.add(BayLang.Test.Translator.Expression);
module.exports = BayLang.Test.Translator.Expression;