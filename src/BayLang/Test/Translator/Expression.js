"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
const Test = use("Runtime.Unit.Test");
const Map = use("Runtime.Map");
/*
!
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
BayLang.Test.Translator.Expression = class
{
	/**
	 * Assert value
	 */
	assert(command, value1, value2)
	{
		const Vector = use("Runtime.Vector");
		const AssertHelper = use("Runtime.Unit.AssertHelper");
		let message = new Vector(
			command,
			"Missing:",
			value1,
			"Exists:",
			value2,
		);
		AssertHelper.equalValue(value1, value2, rs.join("\n", message));
	}
	
	
	/**
	 * Test expression
	 */
	testExpression(command, src, dest, callback)
	{
		const LangUtils = use("BayLang.LangUtils");
		const Vector = use("Runtime.Vector");
		const ParserError = use("BayLang.Exceptions.ParserError");
		const AssertException = use("Runtime.Exceptions.AssertException");
		if (callback == undefined) callback = null;
		let res = LangUtils.parseCommand(command);
		let parser = LangUtils.createParser(res.get("from"));
		let translator = LangUtils.createTranslator(res.get("to"));
		/* Init function */
		if (callback) callback(parser, translator);
		/* Translate file */
		let output = new Vector();
		try
		{
			parser.setContent(src);
			let op_code = parser.parser_expression.readExpression(parser.createReader());
			translator.expression.translate(op_code, output);
		}
		catch (_ex)
		{
			if (_ex instanceof ParserError)
			{
				var error = _ex;
				throw new AssertException(command + String(" ") + String(error.toString()));
			}
			else
			{
				throw _ex;
			}
		}
		/* Check output */
		this.assert(command, dest, rs.join("", output));
	}
	
	
	/**
	 * Test lang
	 */
	test(content, init)
	{
		if (init == undefined) init = null;
		let content_bay = content.get("bay");
		let content_es6 = content.has("es6") ? content.get("es6") : content_bay;
		let content_php = content.has("php") ? content.get("php") : content_bay;
		this.testExpression("bay_to_bay", content_bay, content_bay, init);
		this.testExpression("bay_to_php", content_bay, content_php, init);
		this.testExpression("bay_to_es6", content_bay, content_es6, init);
		this.testExpression("php_to_php", content_php, content_php, init);
		this.testExpression("php_to_bay", content_php, content_bay, init);
		this.testExpression("php_to_es6", content_php, content_es6, init);
		this.testExpression("es6_to_es6", content_es6, content_es6, init);
		this.testExpression("es6_to_bay", content_es6, content_bay, init);
		this.testExpression("es6_to_php", content_es6, content_php, init);
	}
	
	
	testMath1()
	{
		const Map = use("Runtime.Map");
		let content = Map.create({
			"bay": "a + b",
			"es6": "a + b",
			"php": "$a + $b",
		});
		let init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	}
	
	
	testMath2()
	{
		const Map = use("Runtime.Map");
		let content = Map.create({
			"bay": "a * b",
			"php": "$a * $b",
		});
		let init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	}
	
	
	testMath3()
	{
		const Map = use("Runtime.Map");
		let content = Map.create({
			"bay": "a + b * c",
			"php": "$a + $b * $c",
		});
		let init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
			parser.vars.set("c", true);
		};
		this.test(content, init);
	}
	
	
	testMath4()
	{
		const Map = use("Runtime.Map");
		let content = Map.create({
			"bay": "(a + b) * c",
			"php": "($a + $b) * $c",
		});
		let init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
			parser.vars.set("c", true);
		};
		this.test(content, init);
	}
	
	
	testMath5()
	{
		const Map = use("Runtime.Map");
		let content = Map.create({
			"bay": "a * (b + c)",
			"php": "$a * ($b + $c)",
		});
		let init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
			parser.vars.set("c", true);
		};
		this.test(content, init);
	}
	
	
	testMath6()
	{
		const Map = use("Runtime.Map");
		let content = Map.create({
			"bay": "not a",
			"es6": "!a",
			"php": "!$a",
		});
		let init = (parser, translator) =>
		{
			parser.vars.set("a", true);
		};
		this.test(content, init);
	}
	
	
	testMath7()
	{
		const Map = use("Runtime.Map");
		let content = Map.create({
			"bay": "not (a or b)",
			"es6": "!(a || b)",
			"php": "!($a || $b)",
		});
		let init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	}
	
	
	testMath8()
	{
		const Map = use("Runtime.Map");
		let content = Map.create({
			"bay": "not a or not b",
			"es6": "!a || !b",
			"php": "!$a || !$b",
		});
		let init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	}
	
	
	testString()
	{
		const Map = use("Runtime.Map");
		let content = Map.create({
			"bay": "\"Hello \" ~ username ~ \"!\"",
			"es6": "\"Hello \" + String(username) + String(\"!\")",
			"php": "\"Hello \" . $username . \"!\"",
		});
		let init = (parser, translator) =>
		{
			parser.vars.set("username", true);
		};
		this.test(content);
	}
	
	
	testFn2()
	{
		const Map = use("Runtime.Map");
		let content = Map.create({
			"bay": "a() + b()",
			"es6": "a() + b()",
			"php": "$a() + $b()",
		});
		let init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	}
	
	
	testFn3()
	{
		const Map = use("Runtime.Map");
		let content = Map.create({
			"bay": "(a() + b()) * c()",
			"es6": "(a() + b()) * c()",
			"php": "($a() + $b()) * $c()",
		});
		let init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
			parser.vars.set("c", true);
		};
		this.test(content, init);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "BayLang.Test.Translator.Expression"; }
	static getMethodsList()
	{
		const Vector = use("Runtime.Vector");
		return new Vector("testMath1", "testMath2", "testMath3", "testMath4", "testMath5", "testMath6", "testMath7", "testMath8", "testString", "testFn2", "testFn3");
	}
	static getMethodInfoByName(field_name)
	{
		const Vector = use("Runtime.Vector");
		if (field_nane == "testMath1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testMath2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testMath3") return new Vector(
			new Test(new Map())
		);if (field_nane == "testMath4") return new Vector(
			new Test(new Map())
		);if (field_nane == "testMath5") return new Vector(
			new Test(new Map())
		);if (field_nane == "testMath6") return new Vector(
			new Test(new Map())
		);if (field_nane == "testMath7") return new Vector(
			new Test(new Map())
		);if (field_nane == "testMath8") return new Vector(
			new Test(new Map())
		);if (field_nane == "testString") return new Vector(
			new Test(new Map())
		);if (field_nane == "testFn2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testFn3") return new Vector(
			new Test(new Map())
		);
		return null;
	}
	static getInterfaces(){ return []; }
};
use.add(BayLang.Test.Translator.Expression);
module.exports = {
	"Expression": BayLang.Test.Translator.Expression,
};