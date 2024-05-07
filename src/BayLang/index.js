/*!
 *  Bayrell Language
 *
 *  (c) Copyright 2016-2023 "Ildar Bikmamatov" <support@bayrell.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.bayrell.org/licenses/APACHE-LICENSE-2.0.html
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var exports = {
	MODULE_NAME: 'Bayrell.Lang',
}

function add(name)
{
	var module_name = exports.MODULE_NAME;
	
	name = name
		.substr(module_name.length + 1)
		.replace(new RegExp("\\.", "g"), "/")
	;
	
	var path = __dirname + "/" + name + ".js";
	return require(path);
}

add("Bayrell.Lang.Exceptions.ParserUnknownError");
add("Bayrell.Lang.OpCodes.BaseOpCode");
add("Bayrell.Lang.Caret");
add("Bayrell.Lang.CoreParser");
add("Bayrell.Lang.CoreToken");
add("Bayrell.Lang.CoreTranslator");
add("Bayrell.Lang.LangConstant");
add("Bayrell.Lang.LangUtils");
add("Bayrell.Lang.ModuleDescription");
add("Bayrell.Lang.SaveOpCode");
add("Bayrell.Lang.Compiler.CLI");
add("Bayrell.Lang.Compiler.Commands.Make");
add("Bayrell.Lang.Compiler.Commands.MakeAll");
add("Bayrell.Lang.Compiler.Commands.Modules");
add("Bayrell.Lang.Compiler.Commands.Version");
add("Bayrell.Lang.Compiler.Commands.Watch");
add("Bayrell.Lang.Compiler.ConsoleApp");
add("Bayrell.Lang.Compiler.Module");
add("Bayrell.Lang.Compiler.ModuleDescription");
add("Bayrell.Lang.Compiler.SettingsProvider");
add("Bayrell.Lang.Exceptions.ParserEOF");
add("Bayrell.Lang.Exceptions.ParserError");
add("Bayrell.Lang.Exceptions.ParserExpected");
add("Bayrell.Lang.Exceptions.DeclaredClass");
add("Bayrell.Lang.LangBay.ParserBay");
add("Bayrell.Lang.LangBay.ParserBayBase");
add("Bayrell.Lang.LangBay.ParserBayExpression");
add("Bayrell.Lang.LangBay.ParserBayHtml");
add("Bayrell.Lang.LangBay.ParserBayOperator");
add("Bayrell.Lang.LangBay.ParserBayPreprocessor");
add("Bayrell.Lang.LangBay.ParserBayProgram");
add("Bayrell.Lang.LangES6.AsyncAwait");
add("Bayrell.Lang.LangES6.TranslatorES6");
add("Bayrell.Lang.LangES6.TranslatorES6AsyncAwait");
add("Bayrell.Lang.LangES6.TranslatorES6Expression");
add("Bayrell.Lang.LangES6.TranslatorES6Html");
add("Bayrell.Lang.LangES6.TranslatorES6Operator");
add("Bayrell.Lang.LangES6.TranslatorES6Program");
add("Bayrell.Lang.LangNode.TranslatorNode");
add("Bayrell.Lang.LangNode.TranslatorNodeExpression");
add("Bayrell.Lang.LangNode.TranslatorNodeProgram");
add("Bayrell.Lang.LangPHP.TranslatorPHP");
add("Bayrell.Lang.LangPHP.TranslatorPHPExpression");
add("Bayrell.Lang.LangPHP.TranslatorPHPHtml");
add("Bayrell.Lang.LangPHP.TranslatorPHPOperator");
add("Bayrell.Lang.LangPHP.TranslatorPHPProgram");
add("Bayrell.Lang.OpCodes.OpAnnotation");
add("Bayrell.Lang.OpCodes.OpAssign");
add("Bayrell.Lang.OpCodes.OpAssignStruct");
add("Bayrell.Lang.OpCodes.OpAssignValue");
add("Bayrell.Lang.OpCodes.OpAttr");
add("Bayrell.Lang.OpCodes.OpBreak");
add("Bayrell.Lang.OpCodes.OpCall");
add("Bayrell.Lang.OpCodes.OpClassOf");
add("Bayrell.Lang.OpCodes.OpClassRef");
add("Bayrell.Lang.OpCodes.OpCollection");
add("Bayrell.Lang.OpCodes.OpComment");
add("Bayrell.Lang.OpCodes.OpContinue");
add("Bayrell.Lang.OpCodes.OpCurry");
add("Bayrell.Lang.OpCodes.OpCurryArg");
add("Bayrell.Lang.OpCodes.OpDeclareClass");
add("Bayrell.Lang.OpCodes.OpDeclareFunction");
add("Bayrell.Lang.OpCodes.OpDeclareFunctionArg");
add("Bayrell.Lang.OpCodes.OpDelete");
add("Bayrell.Lang.OpCodes.OpDict");
add("Bayrell.Lang.OpCodes.OpDictPair");
add("Bayrell.Lang.OpCodes.OpEntityName");
add("Bayrell.Lang.OpCodes.OpFlags");
add("Bayrell.Lang.OpCodes.OpFor");
add("Bayrell.Lang.OpCodes.OpHtmlAttribute");
add("Bayrell.Lang.OpCodes.OpHtmlContent");
add("Bayrell.Lang.OpCodes.OpHtmlItems");
add("Bayrell.Lang.OpCodes.OpHtmlStyle");
add("Bayrell.Lang.OpCodes.OpHtmlTag");
add("Bayrell.Lang.OpCodes.OpHtmlValue");
add("Bayrell.Lang.OpCodes.OpIdentifier");
add("Bayrell.Lang.OpCodes.OpIf");
add("Bayrell.Lang.OpCodes.OpIfElse");
add("Bayrell.Lang.OpCodes.OpInc");
add("Bayrell.Lang.OpCodes.OpItems");
add("Bayrell.Lang.OpCodes.OpMath");
add("Bayrell.Lang.OpCodes.OpMethod");
add("Bayrell.Lang.OpCodes.OpModule");
add("Bayrell.Lang.OpCodes.OpNamespace");
add("Bayrell.Lang.OpCodes.OpNegative");
add("Bayrell.Lang.OpCodes.OpNew");
add("Bayrell.Lang.OpCodes.OpNumber");
add("Bayrell.Lang.OpCodes.OpPipe");
add("Bayrell.Lang.OpCodes.OpPreprocessorIfCode");
add("Bayrell.Lang.OpCodes.OpPreprocessorIfDef");
add("Bayrell.Lang.OpCodes.OpPreprocessorSwitch");
add("Bayrell.Lang.OpCodes.OpReturn");
add("Bayrell.Lang.OpCodes.OpSafe");
add("Bayrell.Lang.OpCodes.OpString");
add("Bayrell.Lang.OpCodes.OpTernary");
add("Bayrell.Lang.OpCodes.OpTryCatch");
add("Bayrell.Lang.OpCodes.OpTryCatchItem");
add("Bayrell.Lang.OpCodes.OpThrow");
add("Bayrell.Lang.OpCodes.OpTypeConvert");
add("Bayrell.Lang.OpCodes.OpTypeIdentifier");
add("Bayrell.Lang.OpCodes.OpUse");
add("Bayrell.Lang.OpCodes.OpWhile");
add("Bayrell.Lang.OpCodes.OpWidget");
add("Bayrell.Lang.OpCodes.OpWidgetData");

/* Test */
add("Bayrell.Lang.Test.LangBay.Main");
add("Bayrell.Lang.Test.ModuleDescription");

var use = require('bay-lang').use;
exports["VERSION"] = use("Bayrell.Lang.ModuleDescription").getModuleVersion();

module.exports = exports;
