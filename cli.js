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

let use = require("./use.js");


async function create_context()
{
	var Collection = use("Runtime.Collection");
	let Context = use("Runtime.Context");
	let rtl = use("Runtime.rtl");
	
	/* Create global context */
	let ctx = new Context(null, {
		"modules": Collection.from([
			"Runtime",
			"Bayrell.Lang"
		]),
	});

	/* Init context */
	ctx = await Context.init(ctx, ctx);
	
	/* Setup global context */
	rtl.setContext(ctx);
	
	return ctx;
}
