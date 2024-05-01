#!/usr/bin/env node

/*!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2023 "Ildar Bikmamatov" <support@bayrell.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0.txt
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

let use = require('bay-lang').use;

/* Load modules */
require(__dirname + "/src/Runtime/index.js");
require(__dirname + "/src/Runtime.Console/index.js");
require(__dirname + "/src/Runtime.Unit/index.js");
require(__dirname + "/src/BayLang/index.js");

/* Get classes */
let rtl = use("Runtime.rtl");
let Vector = use("Runtime.Vector");

rtl.runApp(null, "Bayrell.Lang.Compiler.ConsoleApp", Vector.from(["Bayrell.Lang.Compiler"]));

/*
let main = async () => {
    let context = await rtl.createContext(
        null,
        Runtime.Map.from({
            "entry_point": "Bayrell.Lang.Compiler.ConsoleApp",
            "modules": Vector.from(["Bayrell.Lang.Compiler"]),
        })
    );

    console.log( Runtime.io.color(context, "yellow", "test") );
};
main();
*/
