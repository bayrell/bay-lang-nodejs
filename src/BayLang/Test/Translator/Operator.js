"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
const Test = use("Runtime.Unit.Test");
const Map = use("Runtime.Map");
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
BayLang.Test.Translator.Operator = class
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
			let op_code = parser.parser_program.parse(parser.createReader());
			if (this.debug) console.log(op_code);
			translator.program.translate(op_code, output);
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
	test(content, init, arr)
	{
		const Collection = use("Runtime.Collection");
		const Vector = use("Runtime.Vector");
		if (init == undefined) init = null;
		if (arr == undefined) arr = null;
		let content_bay = content.get("bay");
		let content_es6 = content.has("es6") ? content.get("es6") : content_bay;
		let content_php = content.has("php") ? content.get("php") : content_bay;
		if (content_bay instanceof Collection) content_bay = rs.join("\n", content_bay);
		if (content_es6 instanceof Collection) content_es6 = rs.join("\n", content_es6);
		if (content_php instanceof Collection) content_php = rs.join("\n", content_php);
		if (arr == null)
		{
			arr = new Vector(
				"bay_to_bay",
				"bay_to_php",
				"bay_to_es6",
				"php_to_php",
				"php_to_bay",
				"php_to_es6",
				"es6_to_es6",
				"es6_to_bay",
				"es6_to_php",
			);
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
	}
	
	
	testAssign2()
	{
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		let content = Map.create({
			"bay": "var a = 1;",
			"php": new Vector(
				"<?php",
				"$a = 1;",
			),
		});
		this.test(content);
	}
	
	
	testAssign3()
	{
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		let content = Map.create({
			"bay": new Vector(
				"var a = 1;",
				"a = 2;",
			),
			"php": new Vector(
				"<?php",
				"$a = 1;",
				"$a = 2;",
			),
		});
		this.test(content);
	}
	
	
	testAssign4()
	{
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		let content = Map.create({
			"bay": new Vector(
				"var a = 1, b = 2;",
				"a = a + b;",
			),
			"php": new Vector(
				"<?php",
				"$a = 1;",
				"$b = 2;",
				"$a = $a + $b;",
			),
		});
		this.test(content, null, new Vector(
			"bay_to_bay",
			"bay_to_php",
			"bay_to_es6",
			"php_to_php",
			"es6_to_es6",
			"es6_to_bay",
			"es6_to_php",
		));
	}
	
	
	testFor1()
	{
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		let content = Map.create({
			"bay": new Vector(
				"for (var i = 0; i < 10; i++)",
				"{",
				"\tprint(i);",
				"}",
			),
			"es6": new Vector(
				"for (var i = 0; i < 10; i++)",
				"{",
				"\tconsole.log(i);",
				"}",
			),
			"php": new Vector(
				"<?php",
				"for ($i = 0; $i < 10; $i++)",
				"{",
				"\techo($i);",
				"}",
			),
		});
		this.test(content);
	}
	
	
	testIf1()
	{
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		let content = Map.create({
			"bay": new Vector(
				"if (a > b)",
				"{",
				"\tprint(\"Yes\");",
				"}",
			),
			"es6": new Vector(
				"if (a > b)",
				"{",
				"\tconsole.log(\"Yes\");",
				"}",
			),
			"php": new Vector(
				"<?php",
				"if ($a > $b)",
				"{",
				"\techo(\"Yes\");",
				"}",
			),
		});
		let init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	}
	
	
	testIf2()
	{
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		let content = Map.create({
			"bay": new Vector(
				"if (a > b)",
				"{",
				"\tprint(\"Yes\");",
				"}",
				"else",
				"{",
				"\tprint(\"No\");",
				"}",
			),
			"es6": new Vector(
				"if (a > b)",
				"{",
				"\tconsole.log(\"Yes\");",
				"}",
				"else",
				"{",
				"\tconsole.log(\"No\");",
				"}",
			),
			"php": new Vector(
				"<?php",
				"if ($a > $b)",
				"{",
				"\techo(\"Yes\");",
				"}",
				"else",
				"{",
				"\techo(\"No\");",
				"}",
			),
		});
		let init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	}
	
	
	testIf3()
	{
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		let content = Map.create({
			"bay": new Vector(
				"if (a == 1)",
				"{",
				"\tprint(1);",
				"}",
				"else if (a == 2)",
				"{",
				"\tprint(2);",
				"}",
				"else if (a == 3)",
				"{",
				"\tprint(3);",
				"}",
				"else",
				"{",
				"\tprint(\"No\");",
				"}",
			),
			"es6": new Vector(
				"if (a == 1)",
				"{",
				"\tconsole.log(1);",
				"}",
				"else if (a == 2)",
				"{",
				"\tconsole.log(2);",
				"}",
				"else if (a == 3)",
				"{",
				"\tconsole.log(3);",
				"}",
				"else",
				"{",
				"\tconsole.log(\"No\");",
				"}",
			),
			"php": new Vector(
				"<?php",
				"if ($a == 1)",
				"{",
				"\techo(1);",
				"}",
				"else if ($a == 2)",
				"{",
				"\techo(2);",
				"}",
				"else if ($a == 3)",
				"{",
				"\techo(3);",
				"}",
				"else",
				"{",
				"\techo(\"No\");",
				"}",
			),
		});
		let init = (parser, translator) =>
		{
			parser.vars.set("a", true);
			parser.vars.set("b", true);
		};
		this.test(content, init);
	}
	
	
	testWhile1()
	{
		const Map = use("Runtime.Map");
		const Vector = use("Runtime.Vector");
		let content = Map.create({
			"bay": new Vector(
				"var i = 0;",
				"while (i < 10)",
				"{",
				"\ti++;",
				"}",
			),
			"php": new Vector(
				"<?php",
				"$i = 0;",
				"while ($i < 10)",
				"{",
				"\t$i++;",
				"}",
			),
		});
		this.test(content);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		this.debug = false;
	}
	static getClassName(){ return "BayLang.Test.Translator.Operator"; }
	static getMethodsList()
	{
		const Vector = use("Runtime.Vector");
		return new Vector("testAssign2", "testAssign3", "testAssign4", "testFor1", "testIf1", "testIf2", "testIf3", "testWhile1");
	}
	static getMethodInfoByName(field_name)
	{
		const Vector = use("Runtime.Vector");
		if (field_nane == "testAssign2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testAssign3") return new Vector(
			new Test(new Map())
		);if (field_nane == "testAssign4") return new Vector(
			new Test(new Map())
		);if (field_nane == "testFor1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testIf1") return new Vector(
			new Test(new Map())
		);if (field_nane == "testIf2") return new Vector(
			new Test(new Map())
		);if (field_nane == "testIf3") return new Vector(
			new Test(new Map())
		);if (field_nane == "testWhile1") return new Vector(
			new Test(new Map())
		);
		return null;
	}
	static getInterfaces(){ return []; }
};
use.add(BayLang.Test.Translator.Operator);
module.exports = {
	"Operator": BayLang.Test.Translator.Operator,
};