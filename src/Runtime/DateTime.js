"use strict;"
const use = require('bay-lang').use;
const rtl = use("Runtime.rtl");
const rs = use("Runtime.rs");
const BaseObject = use("Runtime.BaseObject");
/*!
 *  BayLang Technology
 *
 *  (c) Copyright 2016-2024 "Ildar Bikmamatov" <support@bayrell.org>
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
Runtime.DateTime = class extends BaseObject
{
	
	
	/**
	 * Constructor
	 */
	constructor(data)
	{
		if (data == undefined) data = null;
		super();
		if (data != null)
		{
			if (data.has("y")) this.y = data.get("y");
			if (data.has("m")) this.m = data.get("m");
			if (data.has("d")) this.d = data.get("d");
			if (data.has("h")) this.h = data.get("h");
			if (data.has("i")) this.i = data.get("i");
			if (data.has("s")) this.s = data.get("s");
			if (data.has("ms")) this.ms = data.get("ms");
			if (data.has("o")) this.o = data.get("o");
		}
	}
	
	
	/**
	 * toMap
	 */
	toMap()
	{
		return Map.create({
			"y": this.y,
			"m": this.m,
			"d": this.d,
			"h": this.h,
			"i": this.i,
			"s": this.s,
			"ms": this.ms,
			"o": this.o,
		});
	}
	
	
	/**
	 * Create date time from timestamp
	 */
	static create(time)
	{
		if (time == undefined) time = -1;
		var dt = null;
		if (time == -1) dt = new Date();
		else dt = new Date(time*1000);
		return this.fromObject(dt);
		return null;
	}
	
	
	/**
	 * Returns datetime
	 * @param string tz
	 * @return DateTime
	 */
	static now(){ return this.create(-1); }
	
	
	/**
	 * Returns timestamp
	 * @return int
	 */
	getTimestamp()
	{
		var dt = this.toObject();
		return Math.round(dt.getTime() / 1000);
		return null;
	}
	timestamp(){ return this.getTimestamp(); }
	
	
	/**
	 * Returns day of week
	 * @return int
	 */
	getDayOfWeek()
	{
		var dt = this.toObject();
		return dt.getDay();
		return null;
	}
	
	
	/**
	 * Return db datetime
	 * @return string
	 */
	toString()
	{
		const Math = use("Runtime.Math");
		var m = (this.m < 10) ? ("0" + String(this.m)) : ("" + String(this.m));
		var d = (this.d < 10) ? ("0" + String(this.d)) : ("" + String(this.d));
		var h = (this.h < 10) ? ("0" + String(this.h)) : ("" + String(this.h));
		var i = (this.i < 10) ? ("0" + String(this.i)) : ("" + String(this.i));
		var s = (this.s < 10) ? ("0" + String(this.s)) : ("" + String(this.s));
		/* Get offset */
		var offset = this.o * 60;
		var offset_h = Math.abs(Math.floor(offset / 60));
		var offset_m = offset % 60;
		offset_h = (offset_h < 10) ? ("0" + String(offset_h)) : ("" + String(offset_h));
		offset_m = (offset_m < 10) ? ("0" + String(offset_m)) : ("" + String(offset_m));
		var offset_str = offset_h + String(offset_m);
		offset_str = (offset < 0) ? ("-" + String(offset_str)) : ("+" + String(offset_str));
		/* Return string */
		return this.y + String("-") + String(m) + String("-") + String(d) + String("T") + String(h) + String(":") + String(i) + String(":") + String(s) + String(offset_str);
	}
	
	
	/**
	 * Create DateTime from string
	 */
	static fromString(s)
	{
		var dt = new Runtime.DateTime();
		dt.y = rtl.toInt(rs.substr(s, 0, 4));
		dt.m = rtl.toInt(rs.substr(s, 5, 2));
		dt.d = rtl.toInt(rs.substr(s, 8, 2));
		dt.h = rtl.toInt(rs.substr(s, 11, 2));
		dt.i = rtl.toInt(rs.substr(s, 14, 2));
		dt.s = rtl.toInt(rs.substr(s, 17, 2));
		dt.o = 0;
		if (rs.strlen(s) > 19)
		{
			var sign = rs.substr(s, 19, 1);
			var tz_h = rtl.toInt(rs.substr(s, 20, 2));
			var tz_m = rtl.toInt(rs.substr(s, 23, 2));
			dt.o = (tz_h * 60 + tz_m) / 60;
			if (sign == "-") dt.o = 0 - dt.o;
		}
		return dt;
	}
	
	
	/**
	 * Returns date time string
	 */
	getDateTimeString()
	{
		var m = (this.m < 10) ? ("0" + String(this.m)) : ("" + String(this.m));
		var d = (this.d < 10) ? ("0" + String(this.d)) : ("" + String(this.d));
		var h = (this.h < 10) ? ("0" + String(this.h)) : ("" + String(this.h));
		var i = (this.i < 10) ? ("0" + String(this.i)) : ("" + String(this.i));
		var s = (this.s < 10) ? ("0" + String(this.s)) : ("" + String(this.s));
		return this.y + String("-") + String(m) + String("-") + String(d) + String(" ") + String(h) + String(":") + String(i) + String(":") + String(s);
	}
	
	
	/**
	 * Normalize
	 */
	normalize()
	{
		var dt = this;
		var offset = Runtime.rtl.getContext().env("TZ_OFFSET");
		if (offset) dt = dt.setOffset(offset);
		return dt;
	}
	
	
	/**
	 * Shift tz
	 */
	shift(seconds)
	{
		var timestamp = this.getTimestamp();
		var dt = this.constructor.create(timestamp + seconds);
		dt.setOffset(this.o);
		return dt;
	}
	
	
	/**
	 * Set offset
	 */
	setOffset(offset)
	{
		var dt = this.toObject();
		var dt_offset;
		dt_offset = -dt.getTimezoneOffset() * 60;
		/* Modify offset */
		var delta = offset - dt_offset;
		dt = this.constructor.modify(dt, delta);
		var obj = this.constructor.fromObject(dt);
		obj.o = offset;
		return obj;
	}
	
	
	/**
	 * Get tz offset
	 */
	static getOffset(tz)
	{
	}
	
	
	/**
	 * Add seconds
	 */
	static modify(dt, seconds)
	{
		if (seconds == 0) return dt;
		var offset = Math.floor(seconds / 60);
		var h = Math.floor(offset / 60);
		var m = offset % 60;
		dt.setMinutes(dt.getMinutes() + m);
		dt.setHours(dt.getHours() + h);
		return dt;
	}
	
	
	/**
	 * Convert to native object
	 */
	toObject()
	{
		var dt = new Date(this.y, this.m - 1, this.d, this.h, this.i, this.s);
		offset = dt.getTimezoneOffset() + this.o * 60;
		dt = this.constructor.modify(dt, -offset * 60);
		return dt;
	}
	
	
	/**
	 * Create from native object
	 */
	static fromObject(dt)
	{
		var Dict = use("Runtime.Dict");
		offset = -dt.getTimezoneOffset() / 60;
		var y = Number(dt.getFullYear());
		var m = Number(dt.getMonth()) + 1;
		var d = Number(dt.getDate());
		var h = Number(dt.getHours());
		var i = Number(dt.getMinutes());
		var s = Number(dt.getSeconds());
		var obj = new Runtime.DateTime(Dict.from({
			"y":y,"m":m,"d":d,"h":h,"i":i,"s":s,"o":offset
		}));
		return obj;
	}
	
	
	/* ========= Class init functions ========= */
	_init()
	{
		super._init();
		this.y = 1970;
		this.m = 1;
		this.d = 1;
		this.h = 0;
		this.i = 0;
		this.s = 0;
		this.ms = 0;
		this.o = 0;
	}
	static getClassName(){ return "Runtime.DateTime"; }
	static getMethodsList(){ return []; }
	static getMethodInfoByName(field_name){ return null; }
	static getInterfaces(field_name){ return ["Runtime.StringInterface"]; }
};
use.add(Runtime.DateTime);
module.exports = {
	"DateTime": Runtime.DateTime,
};