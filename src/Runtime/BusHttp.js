"use strict;"
const use = require('bay-lang').use;
const rs = use("Runtime.rs");
const rtl = use("Runtime.rtl");
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
Runtime.BusHttp = class extends use("Runtime.BaseProvider")
{
	/**
	 * Send api to frontend
	 */
	async send(params)
	{
		const Vector = use("Runtime.Vector");
		const ApiResult = use("Runtime.ApiResult");
		const RuntimeHook = use("Runtime.Hooks.RuntimeHook");
		const Map = use("Runtime.Map");
		const Curl = use("Runtime.Curl");
		const CurlException = use("Runtime.Exceptions.CurlException");
		let service = params.get("service", "");
		let api_name = params.get("api_name", "");
		let method_name = params.get("method_name", "");
		let data = params.get("data", null);
		/* Get route prefix */
		let api_kind = "api";
		let route_prefix = Runtime.rtl.getContext().env("ROUTE_PREFIX");
		route_prefix = rs.removeFirstSlash(route_prefix);
		route_prefix = rs.removeLastSlash(route_prefix);
		/* Get api url */
		let api_url_arr = Vector.create([
			route_prefix,
			api_kind,
			api_name,
			method_name,
		]);
		api_url_arr = api_url_arr.filter((s) => { return s != ""; });
		let api_url = "/" + String(api_url_arr.join("/"));
		let res = new ApiResult();
		/* Call api before hook */
		let d = Runtime.rtl.getContext().hook(RuntimeHook.SEND_API_BEFORE, Map.create({
			"api_url": api_url,
			"service": service,
			"api_name": api_name,
			"method_name": method_name,
			"params": params,
			"data": data,
		}));
		api_url = d.get("api_url");
		/* Create curl */
		let curl = new Curl(api_url, Map.create({
			"post": d.get("data"),
		}));
		/* Send curl */
		try
		{
			await curl.send();
		}
		catch (_ex)
		{
			if (_ex instanceof CurlException)
			{
				var e = _ex;
				res.exception(e);
			}
			else
			{
				throw _ex;
			}
		}
		/* Get answer */
		let answer = rtl.jsonDecode(curl.response);
		if (answer && answer instanceof Map)
		{
			res.importContent(answer);
		}
		else
		{
			res.ob_content = curl.response;
		}
		/* Print content */
		if (Runtime.rtl.getContext().env("DEBUG") && res.ob_content)
		{
			rtl.error(res.ob_content);
		}
		/* Print exception */
		if (Runtime.rtl.getContext().env("DEBUG") && res.isException() && res.error_trace)
		{
			let arr = Vector.create([
				"Error message: " + String(res.message),
				"in file " + String(res.error_file) + String(":") + String(res.error_line),
			]);
			arr.appendItems(res.error_trace.map((value, pos) => { return pos + 1 + String(") ") + String(value); }));
			rtl.error(rs.join("\n", arr));
		}
		return res;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
	}
	static getClassName(){ return "Runtime.BusHttp"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return ["Runtime.BusInterface"]; }
};
use.add(Runtime.BusHttp);
module.exports = {
	"BusHttp": Runtime.BusHttp,
};