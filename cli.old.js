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
let Dict = use("Runtime.Dict");
let Context = use("Runtime.Context");
let rtl = use("Runtime.rtl");
const m_path = require('path');
const fs = require('fs');
const { resolve } = require('path');

function is_dir(dir_path)
{
	let stat = fs.lstatSync(dir_path);
	return stat.isDirectory();
}

function read_dir_recursive(ctx, folder_path, relative_path)
{
	if (!relative_path) relative_path = "";
	
	let res = [];
	let files = fs.readdirSync(folder_path);
	files = files.filter( (s) => s != "." && s != ".." ).sort();
	
	for (let i=0; i<files.length; i++)
	{
		let file_path = files[i];
		let file_path_relative = m_path.join(relative_path, file_path);
		let file_path_full = m_path.join(folder_path, file_path);
		if (is_dir(file_path_full))
		{
			res = res.concat( read_dir_recursive(ctx, file_path_full, file_path_relative) );
		}
		else
		{
			res.push(file_path_relative);
		}
	}
	
	return res;
}

function file_save(ctx, path, content)
{
	let rs = use("Runtime.rs");
	
	path = resolve(path);
	let path_info = rs.pathinfo(ctx, path);
	let dir_name = path_info.get(ctx, "dirname");
	
	fs.mkdirSync(dir_name, { recursive: true });
	fs.writeFileSync(path, content, { "encoding": "utf8" });
}

function read_modules(ctx)
{
	let modules = [];
	let modules_names = [];
	let folders = rtl.attr(ctx, ctx, ["settings", "config", "modules"]);
	
	for (let i=0; i<folders.length; i++)
	{
		let folder_name = folders[i];
		let modules_path = m_path.join(ctx.base_path, folder_name);
		
		let lib_modules = fs.readdirSync(modules_path);
		lib_modules = lib_modules.filter( (s) => s != "." && s != ".." ).sort();
		
		for (let lib_modules_index=0; lib_modules_index<lib_modules.length; lib_modules_index++)
		{
			let module_name = lib_modules[lib_modules_index];
			if (modules_names.indexOf(module_name) == -1)
			{
				modules_names.push(module_name);
				modules.push({
					"name": module_name,
					"path": m_path.join(modules_path, module_name),
				});
			}
		}
	}
	
	return modules;
}

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
	
	/* Read config */
	let file_path = m_path.join(ctx.base_path, "project.json");
	let config = fs.readFileSync(resolve(file_path), { "encoding": "utf8" });
	config = rtl.json_decode(ctx, config);
	ctx = ctx.copy(ctx, {
		"settings": ctx.settings.setIm(ctx, "config", config),
	});
	
	/* Setup global context */
	rtl.setContext(ctx);
	
	/* Read modules */
	let modules = read_modules(ctx);
	ctx = ctx.copy(ctx, {
		"settings": ctx.settings.setIm(ctx, "modules", modules),
	});
	
	return ctx;
}

function create_parser(ctx)
{
	let cls = use("Bayrell.Lang.LangBay.ParserBay");
	return new cls
	(
		ctx,
		{
		}
	)
}

function create_translator(ctx, lang)
{
	let cls;
	if (lang == "php")
	{
		cls = use("Bayrell.Lang.LangPHP.TranslatorPHP");
		return new cls(ctx,
		{
			"enable_context": false,
		});
	}
	if (lang == "es6")
	{
		cls = use("Bayrell.Lang.LangES6.TranslatorES6");
		return new cls(ctx,
		{
			"enable_context": false,
		});
	}
	if (lang == "nodejs")
	{
		cls = use("Bayrell.Lang.LangNode.TranslatorNode");
		return new cls(ctx,
		{
			"enable_context": true,
		});
	}
	return null;
}

function find_module(ctx, module_name)
{
	let modules = rtl.attr(ctx, ctx, ["settings", "modules"], []);
	let module = modules.find((item)=>{
		return item.name == module_name;
	});
	return module;
}

function translate_file(ctx, module_path, file_name, op_code, lang, log_out)
{
	let translator = create_translator(ctx, lang);
	if (!translator)
	{
		throw new Error("Lang " + lang + " does not supported");
	}
	
	let re = use("Runtime.re");
	let LangUtils = use("Bayrell.Lang.LangUtils");
	let dest_content = LangUtils.translate(ctx, translator, op_code);
	let dest_name = file_name;
	let dest_path = "";
	
	if (lang == "php")
	{
		dest_name = re.replace(ctx, "\\.bay$", ".php", dest_name);
		dest_name = re.replace(ctx, "\\.ui$", ".php", dest_name);
		dest_path = m_path.join(module_path, "php", dest_name);
	}
	else if (lang == "es6")
	{
		dest_name = re.replace(ctx, "\\.bay$", ".js", dest_name);
		dest_name = re.replace(ctx, "\\.ui$", ".js", dest_name);
		dest_path = m_path.join(module_path, "es6", dest_name);
	}
	else if (lang == "nodejs")
	{
		dest_name = re.replace(ctx, "\\.bay$", ".js", dest_name);
		dest_name = re.replace(ctx, "\\.ui$", ".js", dest_name);
		dest_path = m_path.join(module_path, "nodejs", dest_name);
	}
	
	if (log_out)
	{
		console.log("=>" + dest_path);
	}
	
	file_save(ctx, dest_path, dest_content);
}

function parse_file(ctx, module_path, file_name)
{
	let parser = create_parser(ctx);
	let op_code = null;
	
	if (!parser) return op_code;
	
	let file_path = resolve( m_path.join(module_path, "bay", file_name) );
	let file_content = fs.readFileSync(file_path, { "encoding": "utf8" });
	
	let LangUtils = use("Bayrell.Lang.LangUtils");
	op_code = LangUtils.parse(ctx, parser, file_content);
	
	return op_code;
}

function make_module(ctx, module_name, lang)
{
	let module = find_module(ctx, module_name);
	if (!module) return;
	
	let files = read_dir_recursive( ctx, m_path.join(module.path, "bay") );
	for (let i in files)
	{
		let file_name = files[i];
		
		let file_path = resolve( m_path.join(module.path, "bay", file_name) );
		console.log(file_path);
		
		let op_code = parse_file(ctx, module.path, file_name);
		
		if (lang == undefined)
		{
			let languages = rtl.attr(ctx, ctx, ["settings", "config", "languages"]);
			for (let j=0; j<languages.length; j++)
			{
				let lang = languages[j];
				translate_file(ctx, module.path, file_name, op_code, lang, false);
			}
		}
		else
		{
			translate_file(ctx, module.path, file_name, op_code, lang, false);
		}
	}
	if (lang == "es6")
	{
		make_bundle_by_module_name(ctx, module_name);
	}
}

function make_bundle(ctx, bundle)
{
	let dest_path = bundle.get(ctx, "dest");
	let bundle_path = m_path.join(ctx.base_path, dest_path);
	let modules = bundle.get(ctx, "modules");
	
	let bundle_content = "";
	for (let i=0; i<modules.length; i++)
	{
		let module_name = modules[i];
		let module = find_module(ctx, module_name);
		if (!module) continue;
		
		let module_json_path = resolve(m_path.join(module.path, "module.json"));
		let module_config = fs.readFileSync(module_json_path, { "encoding": "utf8" });
		module_config = rtl.json_decode(ctx, module_config);
		if (!module_config) continue;
		
		let assets = module_config.get(ctx, "assets");
		for (let j=0; j<assets.length; j++)
		{
			let asset_name = assets[j];
			let asset_path = resolve(m_path.join(module.path, "es6", asset_name + ".js"));
			let asset_content = fs.readFileSync(asset_path, { "encoding": "utf8" });
			bundle_content += asset_content + "\n";
		}
	}
	
	console.log("Bundle to => " + dest_path);
	file_save(ctx, bundle_path, bundle_content);
}

function make_bundle_by_module_name(ctx, module_name)
{
	let bundles = rtl.attr(ctx, ctx, ["settings", "config", "bundles"]);
	for (let i=0; i<bundles.length; i++)
	{
		let bundle = bundles[i];
		let lang = bundle.get(ctx, "lang");
		if (lang != "es6") continue;
		
		let modules = bundle.get(ctx, "modules");
		let is_module = modules.indexOf(ctx, module_name);
		if (is_module == -1) continue;
		
		make_bundle(ctx, bundle);
	}
}

function find_module_by_name(ctx, file_path)
{
	let file_path_relative = "";
	
	let modules = rtl.attr(ctx, ctx, ["settings", "modules"], []);
	let module = modules.find((item)=>{
		let path = m_path.join(item.path, "bay");
		return file_path.indexOf(path) == 0;
	});
	
	if (module)
	{
		let path = m_path.join(module.path, "bay");
		file_path_relative = file_path.substr( path.length );
		file_path_relative = file_path_relative.replace(new RegExp("^\/+", "g"), "");
	}
	
	return { module, file_path_relative };
}

async function on_change_file(ctx, changed_file_path)
{
	let { module, file_path_relative } = find_module_by_name(ctx, changed_file_path);
	
	// console.log( changed_file_path, module, file_path_relative );
	
	if (!module) return;
	
	let languages = rtl.attr(ctx, ctx, ["settings", "config", "languages"]);
	let file_path = resolve( m_path.join(module.path, "bay", file_path_relative) );
	
	console.log(file_path);
	//let op_code = parse_file(ctx, module.path, file_path_relative);
	try
	{
		let op_code = parse_file(ctx, module.path, file_path_relative);
		for (let j=0; j<languages.length; j++)
		{
			let lang = languages[j];
			translate_file(ctx, module.path, file_path_relative, op_code, lang, true);
		}
	}
	catch (e)
	{
		console.log ("Error " + e.error_message);
		return;
	}
	console.log("Ok");
	
	make_bundle_by_module_name(ctx, module.name );
}

async function watch_dir(ctx)
{
	
	//on_change_file(ctx, m_path.join(ctx.base_path, "lib/Bayrell.Lang/bay/Caret.bay") );
	//return;
	
	const chokidar = require('chokidar');
	console.log("Start watch");
	chokidar.watch('.').on('change', (path, stat) => {
		path = m_path.join(ctx.base_path, path);
		setTimeout(()=>{ on_change_file(ctx, path); }, 500);
	});
	
}

async function main()
{
	let ctx = await create_context();
	
	let cmd = ctx.cli_args[1];
	
	if (cmd == undefined)
	{
		console.log("Methods:");
		console.log("  watch");
		console.log("  make");
		console.log("  bundle");
		console.log("  modules");
		console.log("  version");
		return;
	}
	
	/* Show version */
	if (cmd == "version")
	{
		let lang_module = use("Bayrell.Lang.ModuleDescription");
		let runtime_module = use("Runtime.ModuleDescription");
		console.log("Lang version: " + lang_module.getModuleVersion());
		console.log("Runtime version: " + runtime_module.getModuleVersion());
		return;
	}
	
	/* Show modules */
	if (cmd == "modules")
	{
		let modules = rtl.attr(ctx, ctx, ["settings", "modules"], []);
		for (let i=0; i<modules.length; i++)
		{
			console.log(modules[i].name);
		}
		return;
	}
	
	/* Make module */
	if (cmd == "bundle")
	{
		let module_name = ctx.cli_args[2];
		if (module_name == undefined)
		{
			let modules = rtl.attr(ctx, ctx, ["settings", "modules"], []);
			for (let i=0; i<modules.length; i++)
			{
				console.log(modules[i].name);
			}
			return;
		}
		make_bundle_by_module_name(ctx, module_name);
		return;
	}
	
	/* Make module */
	if (cmd == "make")
	{
		let module_name = ctx.cli_args[2];
		let lang = ctx.cli_args[3];
		
		if (module_name == undefined)
		{
			let modules = rtl.attr(ctx, ctx, ["settings", "modules"], []);
			for (let i=0; i<modules.length; i++)
			{
				console.log(modules[i].name);
			}
			return;
		}
		
		make_module(ctx, module_name, lang);
		
		return;
	}
	
	/* Watch module */
	if (cmd == "watch")
	{
		await watch_dir(ctx);
		
		return;
	}
}

main();
