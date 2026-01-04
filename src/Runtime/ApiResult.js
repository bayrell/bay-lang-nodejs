"use strict;"
const use = require('bay-lang').use;
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
Runtime.ApiResult = class extends use("Runtime.BaseObject")
{
	/**
	 * Returns true if error
	 */
	isError(){ return this.code < 0; }
	
	
	/**
	 * Returns true if is exception
	 */
	isException(){ return this.is_exception; }
	
	
	/**
	 * Returns true if success
	 */
	isSuccess(){ return this.code > 0; }
	
	
	/**
	 * Get error message
	 */
	getErrorMessage(){ return this.message; }
	
	
	/**
	 * Get error code
	 */
	getErrorCode(){ return this.code; }
	
	
	/**
	 * Returns content
	 */
	getContent()
	{
		const Map = use("Runtime.Map");
		let res = Map.create({
			"api_name": this.api_name,
			"method_name": this.method_name,
			"code": this.code,
			"message": this.message,
			"data": this.data,
		});
		if (this.error_name != "") res.set("error_name", this.error_name);
		if (this.error_file != "") res.set("error_file", this.error_file);
		if (this.error_line != "") res.set("error_line", this.error_line);
		if (this.error_pos != "") res.set("error_pos", this.error_pos);
		if (this.error_trace != "") res.set("error_trace", this.error_trace);
		return res;
	}
	
	
	/**
	 * Import content
	 */
	importContent(content)
	{
		const Vector = use("Runtime.Vector");
		this.api_name = content.get("api_name", "");
		this.method_name = content.get("method_name", "");
		this.data = content.get("data", null);
		this.code = content.get("code", -1);
		this.message = content.get("message", "Unknown error");
		this.ob_content = content.get("ob_content", "");
		this.error_name = content.get("error_name", "");
		this.error_file = content.get("error_file", "");
		this.error_line = content.get("error_line", "");
		this.error_trace = content.get("error_trace", Vector.create([]));
		this.error_pos = content.get("error_pos", "");
		this.is_exception = this.error_file != "";
		return this;
	}
	
	
	/**
	 * Set data
	 */
	setData(data)
	{
		const Dict = use("Runtime.Dict");
		if (data == null) return;
		if (data instanceof Dict)
		{
			let keys = data.keys();
			for (let i = 0; i < keys.count(); i++)
			{
				let key = keys.get(i);
				this.data.set(key, data.get(key));
			}
		}
		else
		{
			this.data = data;
		}
		return this;
	}
	
	
	/**
	 * Setup success
	 */
	success(data)
	{
		if (data == undefined) data = null;
		this.code = rtl.ERROR_OK;
		this.message = "Ok";
		if (!data) return this;
		/* Set code */
		if (data.has("code")) this.code = data.get("code");
		else this.code = rtl.ERROR_OK;
		/* Set message */
		if (data.has("message")) this.message = data.get("message");
		else this.message = "Ok";
		/* Set data */
		if (data.has("data")) this.setData(data.get("data"));
		return this;
	}
	
	
	/**
	 * Setup exception
	 */
	exception(e)
	{
		const rtl = use("rtl");
		this.code = e.getErrorCode();
		this.message = e.getErrorMessage();
		this.error_name = e.constructor.getClassName();
		this.error_file = e.getFileName();
		this.error_line = e.getErrorLine();
		this.error_pos = e.getErrorPos();
		if (Runtime.rtl.getContext().env("DEBUG"))
		{
			this.error_trace = e.getTraceCollection();
		}
		if (rtl.isImplements(e, "Runtime.Exceptions.DataError")) this.data = e.getData();
		this.is_exception = true;
		return this;
	}
	
	
	/**
	 * Setup fail
	 */
	fail(data)
	{
		const RuntimeException = use("Runtime.Exceptions.RuntimeException");
		const rtl = use("rtl");
		const Map = use("Runtime.Map");
		if (data == undefined) data = null;
		this.code = rtl.ERROR_UNKNOWN;
		this.message = "Unknown error";
		if (data instanceof RuntimeException)
		{
			this.code = data.getErrorCode();
			this.message = data.getErrorMessage();
			this.error_name = data.constructor.getClassName();
			if (rtl.isImplements(data, "Runtime.Exceptions.DataError")) this.data = data.getData();
		}
		else if (data instanceof Map)
		{
			/* Set code */
			if (data.has("code")) this.code = data.get("code");
			else this.code = rtl.ERROR_UNKNOWN;
			/* Set message */
			if (data.has("message")) this.message = data.get("message");
			else this.message = "Error";
			/* Set data */
			if (data.has("data")) this.setData(data.get("data"));
		}
		else
		{
			this.code = rtl.ERROR_UNKNOWN;
			this.message = "Error";
		}
		return this;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		const Map = use("Runtime.Map");
		this.code = 0;
		this.message = "";
		this.data = new Map();
		this.api_name = "";
		this.method_name = "";
		this.ob_content = "";
		this.error_name = null;
		this.error_file = "";
		this.error_line = "";
		this.error_pos = 0;
		this.error_trace = null;
		this.is_exception = false;
	}
	static getClassName(){ return "Runtime.ApiResult"; }
	static getMethodsList(){ return null; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(){ return []; }
};
use.add(Runtime.ApiResult);
module.exports = {
	"ApiResult": Runtime.ApiResult,
};