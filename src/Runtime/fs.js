"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
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
if (typeof Runtime == 'undefined') Runtime = {};
const fs = require('fs');
const { promisify } = require('util');
const { resolve } = require('path');

const fileExists = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const rename = promisify(fs.rename);
const symlink = promisify(fs.symlink);
const unlink = promisify(fs.unlink);
const lstat = promisify(fs.lstat);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
Runtime.fs = class
{
	static DIRECTORY_SEPARATOR = "/";
	
	
	/**
	 * Join
	 */
	static join(arr)
	{
		const re = use("Runtime.re");
		let path = rs.join(this.DIRECTORY_SEPARATOR, arr);
		path = re.replace("\\/+", "/", path);
		path = re.replace("\\/\\.\\/", "/", path);
		path = re.replace("\\/+$", "", path);
		return path;
	}
	
	
	/**
	 * Return true if path is exists
	 * @param string path
	 * @param boolean
	 */
	static async exists(filepath)
	{
		var is_exists = await fileExists(filepath);
		if (!is_exists) return Promise.resolve( false );
		return Promise.resolve( true );
	}
	
	
	/**
	 * Return true if path is folder
	 * @param string path
	 * @param boolean
	 */
	static async isDir(filepath){ return await this.isFolder(filepath); }
	
	
	/**
	 * Return true if path is folder
	 * @param string path
	 * @param boolean
	 */
	static async isFolder(filepath)
	{
		var is_exists = await fileExists(filepath);
		if (!is_exists) return Promise.resolve( false );
		
		filepath = resolve(filepath);
		var stat = await lstat(filepath);
		return Promise.resolve( stat.isDirectory() );
	}
	
	
	/**
	 * Return true if path is file
	 * @param string path
	 * @param boolean
	 */
	static async isFile(filepath)
	{
		var is_exists = await fileExists(filepath);
		if (!is_exists) return Promise.resolve( false );
		
		filepath = resolve(filepath);
		var stat = await lstat(filepath);
		return Promise.resolve( stat.isFile() );
	}
	
	
	/**
	 * Read local file
	 */
	static async readFile(filepath, ch)
	{
		if (ch == undefined) ch = "utf8";
		var content = await readFile( resolve(filepath), { "encoding": ch } );
		return Promise.resolve( content );
		return "";
	}
	
	
	/**
	 * Save local file
	 */
	static async saveFile(filepath, content, ch)
	{
		if (content == undefined) content = "";
		if (ch == undefined) ch = "utf8";
		await writeFile( resolve(filepath), content, { "encoding": ch } );
		return "";
	}
	
	
	/**
	 * Rename file
	 */
	static async rename(file_path, file_new_path)
	{
		await rename(file_path, file_new_path);
	}
	
	
	/**
	 * Remove file
	 */
	static async unlink(file_path)
	{
		await unlink(file_path);
	}
	
	
	/**
	 * Scan directory
	 */
	static async listDir(dirpath)
	{
		dirpath = resolve(dirpath);
		var Vector = use("Runtime.Vector");
		var arr = await readdir(dirpath);
		arr = arr.filter( (s) => s != "." && s != ".." ).sort();
		arr = Vector.from(arr);
		return Promise.resolve(arr);
		return null;
	}
	
	
	/**
	 * Scan directory recursive
	 */
	static async listDirRecursive(dirpath, parent_name)
	{
		const Vector = use("Runtime.Vector");
		if (parent_name == undefined) parent_name = "";
		let res = new Vector();
		let items = await this.listDir(dirpath);
		for (let i = 0; i < items.count(); i++)
		{
			let item_name = items.get(i);
			let item_path = this.join(new Vector(dirpath, item_name));
			let item_name2 = this.join(new Vector(parent_name, item_name));
			if (item_name == "." || item_name == "..") continue;
			item_name2 = rs.removeFirstSlash(item_name2);
			res.push(item_name2);
			let is_dir = await this.isDir(item_path);
			if (is_dir)
			{
				let sub_items = await this.listDirRecursive(item_path, item_name2);
				res.appendItems(sub_items);
			}
		}
		return res;
	}
	
	
	/**
	 * Make dir recursive
	 */
	static async mkdir(filepath, mode)
	{
		if (mode == undefined) mode = "755";
		filepath = resolve(filepath);
		var exists = await fileExists(filepath);
		if (!exists)
		{
			await mkdir(filepath, { "mode": mode, "recursive": true });
		}
		return "";
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
	}
	static getClassName(){ return "Runtime.fs"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.fs);
module.exports = {
	"fs": Runtime.fs,
};