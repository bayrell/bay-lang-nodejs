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
let Collection = use("Runtime.Collection");
let Context = use("Runtime.Context");
let rtl = use("Runtime.rtl");

async function create_context()
{
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
	
	/* Setup global context */
	rtl.setContext(ctx);
	
	return ctx;
}


async function main()
{
	let ctx = await create_context();
	let cmd = ctx.cli_args[1];
	let cli = use("Bayrell.Lang.Compiler.CLI");
	
	await cli.init(ctx);
	
	if (cmd == undefined)
	{
		console.log("Methods:");
		console.log("  watch");
		console.log("  make");
		console.log("  modules");
		console.log("  version");
		return;
	}
	
	/* Show version */
	else if (cmd == "version")
	{
		let lang_module = use("Bayrell.Lang.ModuleDescription");
		let runtime_module = use("Runtime.ModuleDescription");
		console.log("Lang version: " + lang_module.getModuleVersion());
		console.log("Runtime version: " + runtime_module.getModuleVersion());
		return;
	}
	
	/* Show modules */
	else if (cmd == "modules")
	{
		let modules = cli.getModules(ctx);
		let modules_names = modules.keys().sort();
		for (let i=0; i<modules_names.length; i++)
		{
			let module_name = modules_names[i];
			let module = modules.get(ctx, module_name);
			console.log( (i + 1) + ") " + module_name + " - " + module.path );
		}
		return;
	}
	
	/* Make module */
	else if (cmd == "make")
	{
	}
	
	/* Watch changes */
	else if (cmd == "watch")
	{
		let on_change_file = async (ctx, changed_file_path) =>
		{
			let log_message = (ctx, msg) =>
			{
				console.log(msg);
			};
			
			try
			{
				await cli.compileFile(ctx, changed_file_path, log_message);
			}
			catch (e)
			{
				let ParserUnknownError = use("Bayrell.Lang.Exceptions.ParserUnknownError");
				if (e instanceof ParserUnknownError)
				{
					console.log ("Error " + e.getMessage());
				}
				else
				{
					console.log(e);
				}
				return;
			}
		};
		
		let watch_dir = async (ctx) =>
		{
			const m_path = require('path');
			const chokidar = require('chokidar');
			console.log("Start watch");
			chokidar
				.watch('.')
				.on('change', (path, stat) => {
					path = m_path.join(ctx.base_path, path);
					setTimeout(()=>{ on_change_file(ctx, path); }, 500);
				})
			;
		};
		
		await watch_dir(ctx);
		
		return;
	}
	
	/* Test */
	else if (cmd == "test")
	{
		let path = "";
		
		//path = "/home/ubuntu/lang/bayrell-web-lang/example/app/Templates/Index.bay";
		path = "/home/ubuntu/lang/bayrell-web-lang/example/app/Models/Main.bay";
		//path = "/home/ubuntu/lang/bayrell-web-lang/example/app/ModuleDescription.php";
		//path = "/home/ubuntu/lang/bayrell-web-lang/example/lib/Runtime/bay/RawString.php";
		//path = "/home/ubuntu/lang/bayrell-web-lang/example/lib/Runtime/module.json";
		//path = "/home/ubuntu/lang/bayrell-web-lang/example/lib/Bayrell.Lang/bay/CoreToken.bay";
		//path = "/home/ubuntu/lang/bayrell-web-lang/example/lib/Bayrell.Lang/bay";
		
		let log_message = (ctx, msg) =>
		{
			console.log(msg);
		};
		
		try
		{
			await cli.compileFile(ctx, path, log_message);
		}
		catch (e)
		{
			let ParserUnknownError = use("Bayrell.Lang.Exceptions.ParserUnknownError");
			if (e instanceof ParserUnknownError)
			{
				console.log ("Error " + e.getMessage());
			}
			else
			{
				console.log(e);
			}
			return;
		}
		
		return;
	}
}


main();