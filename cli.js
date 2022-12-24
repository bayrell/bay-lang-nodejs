#!/usr/bin/env node

/*!
 *  Bayrell Language
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
const fs = require('fs');
const { resolve } = require('path');

async function create_context()
{
	var Collection = use("Runtime.Collection");
	let Context = use("Runtime.Context");
	let rtl = use("Runtime.rtl");
	
	/* Create global context */
	let ctx = new Context(null, {
		"start_time": Date.now(),
		"cli_args": Collection.from(process.argv.slice(1)),
		"base_path": process.cwd(),
		"modules": Collection.from([
			"Runtime",
			"Bayrell.Lang"
		]),
	});
	
	/* Init context */
	ctx = await Context.init(ctx, ctx);
	
	/* Read config */
	let file_path = ctx.base_path + "/" + "project.json";
	let config = fs.readFileSync(resolve(file_path), { "encoding": "utf8" });
	config = rtl.json_decode(ctx, config);
	ctx = ctx.copy(ctx, {
		"settings": ctx.settings.setIm(ctx, "config", config),
	})
	
	/* Setup global context */
	rtl.setContext(ctx);
	
	return ctx;
}


async function main()
{
	
	let context = await create_context();
	
	console.log(context);
	
}

main();
