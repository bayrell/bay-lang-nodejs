"use strict;"
const use = require('bay-lang').use;
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
if (typeof Runtime == 'undefined') Runtime = {};
Runtime.BaseStorage = class extends use("Runtime.BaseModel")
{
	/**
	 * Returns object schema
	 */
	static serialize(serializer)
	{
		const MapType = use("Runtime.Serializer.MapType");
		const ObjectType = use("Runtime.Serializer.ObjectType");
		const Map = use("Runtime.Map");
		super.serialize(serializer);
		serializer.addType("frontend", new MapType(new ObjectType(Map.create({
			"autocreate": true,
		}))));
	}
	
	
	/**
	 * Set frontend params
	 */
	set(key, value)
	{
		this.frontend.set(key, value);
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Map = use("Runtime.Map");
		this.widget_name = "storage";
		this.frontend = new Map();
	}
	static getClassName(){ return "Runtime.BaseStorage"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.BaseStorage);
module.exports = {
	"BaseStorage": Runtime.BaseStorage,
};