"use strict;"
var use = require('bay-lang').use;
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
Runtime.DateTime = function(data)
{
	if (data == undefined) data = null;
	use("Runtime.BaseObject").call(this);
	if (data != null)
	{
		if (data.has("y"))
		{
			this.y = data.get("y");
		}
		if (data.has("m"))
		{
			this.m = data.get("m");
		}
		if (data.has("d"))
		{
			this.d = data.get("d");
		}
		if (data.has("h"))
		{
			this.h = data.get("h");
		}
		if (data.has("i"))
		{
			this.i = data.get("i");
		}
		if (data.has("s"))
		{
			this.s = data.get("s");
		}
		if (data.has("ms"))
		{
			this.ms = data.get("ms");
		}
		if (data.has("o"))
		{
			this.o = data.get("o");
		}
	}
};
Runtime.DateTime.prototype = Object.create(use("Runtime.BaseObject").prototype);
Runtime.DateTime.prototype.constructor = Runtime.DateTime;
Object.assign(Runtime.DateTime.prototype,
{
	/**
	 * toMap
	 */
	toMap: function()
	{
		return use("Runtime.Map").from({"y":this.y,"m":this.m,"d":this.d,"h":this.h,"i":this.i,"s":this.s,"ms":this.ms,"o":this.o});
	},
	/**
	 * Returns timestamp
	 * @return int
	 */
	getTimestamp: function()
	{
		var dt = this.toObject();
		return Math.round(dt.getTime() / 1000);
		return null;
	},
	timestamp: function()
	{
		return this.getTimestamp();
	},
	/**
	 * Returns day of week
	 * @return int
	 */
	getDayOfWeek: function()
	{
		var dt = this.toObject();
		return dt.getDay();
		return null;
	},
	/**
	 * Return db datetime
	 * @return string
	 */
	toString: function()
	{
		var m = (this.m < 10) ? ("0" + use("Runtime.rtl").toStr(this.m)) : ("" + use("Runtime.rtl").toStr(this.m));
		var d = (this.d < 10) ? ("0" + use("Runtime.rtl").toStr(this.d)) : ("" + use("Runtime.rtl").toStr(this.d));
		var h = (this.h < 10) ? ("0" + use("Runtime.rtl").toStr(this.h)) : ("" + use("Runtime.rtl").toStr(this.h));
		var i = (this.i < 10) ? ("0" + use("Runtime.rtl").toStr(this.i)) : ("" + use("Runtime.rtl").toStr(this.i));
		var s = (this.s < 10) ? ("0" + use("Runtime.rtl").toStr(this.s)) : ("" + use("Runtime.rtl").toStr(this.s));
		/* Get offset */
		var offset = this.o * 60;
		var __v0 = use("Runtime.Math");
		var __v1 = use("Runtime.Math");
		var offset_h = __v0.abs(__v1.floor(offset / 60));
		var offset_m = offset % 60;
		offset_h = (offset_h < 10) ? ("0" + use("Runtime.rtl").toStr(offset_h)) : ("" + use("Runtime.rtl").toStr(offset_h));
		offset_m = (offset_m < 10) ? ("0" + use("Runtime.rtl").toStr(offset_m)) : ("" + use("Runtime.rtl").toStr(offset_m));
		var offset_str = offset_h + use("Runtime.rtl").toStr(offset_m);
		offset_str = (offset < 0) ? ("-" + use("Runtime.rtl").toStr(offset_str)) : ("+" + use("Runtime.rtl").toStr(offset_str));
		/* Return string */
		return this.y + use("Runtime.rtl").toStr("-") + use("Runtime.rtl").toStr(m) + use("Runtime.rtl").toStr("-") + use("Runtime.rtl").toStr(d) + use("Runtime.rtl").toStr("T") + use("Runtime.rtl").toStr(h) + use("Runtime.rtl").toStr(":") + use("Runtime.rtl").toStr(i) + use("Runtime.rtl").toStr(":") + use("Runtime.rtl").toStr(s) + use("Runtime.rtl").toStr(offset_str);
	},
	/**
	 * Returns date time string
	 */
	getDateTimeString: function()
	{
		var m = (this.m < 10) ? ("0" + use("Runtime.rtl").toStr(this.m)) : ("" + use("Runtime.rtl").toStr(this.m));
		var d = (this.d < 10) ? ("0" + use("Runtime.rtl").toStr(this.d)) : ("" + use("Runtime.rtl").toStr(this.d));
		var h = (this.h < 10) ? ("0" + use("Runtime.rtl").toStr(this.h)) : ("" + use("Runtime.rtl").toStr(this.h));
		var i = (this.i < 10) ? ("0" + use("Runtime.rtl").toStr(this.i)) : ("" + use("Runtime.rtl").toStr(this.i));
		var s = (this.s < 10) ? ("0" + use("Runtime.rtl").toStr(this.s)) : ("" + use("Runtime.rtl").toStr(this.s));
		return this.y + use("Runtime.rtl").toStr("-") + use("Runtime.rtl").toStr(m) + use("Runtime.rtl").toStr("-") + use("Runtime.rtl").toStr(d) + use("Runtime.rtl").toStr(" ") + use("Runtime.rtl").toStr(h) + use("Runtime.rtl").toStr(":") + use("Runtime.rtl").toStr(i) + use("Runtime.rtl").toStr(":") + use("Runtime.rtl").toStr(s);
	},
	/**
	 * Normalize
	 */
	normalize: function()
	{
		var dt = this;
		var offset = use("Runtime.rtl").getContext().env("TZ_OFFSET");
		if (offset)
		{
			dt = dt.shiftOffset(offset);
		}
		return dt;
	},
	/**
	 * Shift tz
	 */
	shift: function(seconds)
	{
		var timestamp = this.getTimestamp();
		var dt = this.constructor.create(timestamp + seconds);
		dt.shiftOffset(this.o);
		return dt;
	},
	/**
	 * Shift offset
	 */
	shiftOffset: function(offset)
	{
		var dt = this.toObject();
		var dt_offset;
		dt_offset = -dt.getTimezoneOffset() * 60;
		/* Modify offset */
		var delta = offset * 60 * 60 - dt_offset;
		dt = this.constructor.modify(dt, delta);
		var obj = this.constructor.fromObject(dt);
		obj.o = offset;
		return obj;
	},
	/**
	 * Convert to native object
	 */
	toObject: function()
	{
		var dt = new Date(this.y, this.m - 1, this.d, this.h, this.i, this.s);
		offset = dt.getTimezoneOffset() + this.o * 60;
		dt = this.constructor.modify(dt, -offset * 60);
		return dt;
	},
	_init: function()
	{
		use("Runtime.BaseObject").prototype._init.call(this);
		this.y = 1970;
		this.m = 1;
		this.d = 1;
		this.h = 0;
		this.i = 0;
		this.s = 0;
		this.ms = 0;
		this.o = 0;
	},
});
Object.assign(Runtime.DateTime, use("Runtime.BaseObject"));
Object.assign(Runtime.DateTime,
{
	/**
	 * Create date time from timestamp
	 */
	create: function(time)
	{
		if (time == undefined) time = -1;
		var dt = null;
		if (time == -1) dt = new Date();
		else dt = new Date(time*1000);
		return this.fromObject(dt);
		return null;
	},
	/**
	 * Returns datetime
	 * @param string tz
	 * @return DateTime
	 */
	now: function()
	{
		return this.create(-1);
	},
	/**
	 * Create DateTime from string
	 */
	fromString: function(s)
	{
		var __v0 = use("Runtime.DateTime");
		var dt = new __v0();
		var __v1 = use("Runtime.rs");
		dt.y = use("Runtime.rtl").to(__v1.substr(s, 0, 4), {"e":"int"});
		var __v2 = use("Runtime.rs");
		dt.m = use("Runtime.rtl").to(__v2.substr(s, 5, 2), {"e":"int"});
		var __v3 = use("Runtime.rs");
		dt.d = use("Runtime.rtl").to(__v3.substr(s, 8, 2), {"e":"int"});
		var __v4 = use("Runtime.rs");
		dt.h = use("Runtime.rtl").to(__v4.substr(s, 11, 2), {"e":"int"});
		var __v5 = use("Runtime.rs");
		dt.i = use("Runtime.rtl").to(__v5.substr(s, 14, 2), {"e":"int"});
		var __v6 = use("Runtime.rs");
		dt.s = use("Runtime.rtl").to(__v6.substr(s, 17, 2), {"e":"int"});
		dt.o = 0;
		var __v7 = use("Runtime.rs");
		if (__v7.strlen(s) > 19)
		{
			var __v8 = use("Runtime.rs");
			var sign = __v8.substr(s, 19, 1);
			var __v9 = use("Runtime.rs");
			var tz_h = use("Runtime.rtl").to(__v9.substr(s, 20, 2), {"e":"int"});
			var __v10 = use("Runtime.rs");
			var tz_m = use("Runtime.rtl").to(__v10.substr(s, 23, 2), {"e":"int"});
			dt.o = (tz_h * 60 + tz_m) / 60;
			if (sign == "-")
			{
				dt.o = 0 - dt.o;
			}
		}
		return dt;
	},
	/**
	 * Add seconds
	 */
	modify: function(dt, seconds)
	{
		if (seconds == 0)
		{
			return dt;
		}
		var offset = Math.floor(seconds / 60);
		var h = Math.floor(offset / 60);
		var m = offset % 60;
		dt.setMinutes(dt.getMinutes() + m);
		dt.setHours(dt.getHours() + h);
		return dt;
	},
	fromObject: function(dt)
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
	},
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "Runtime";
	},
	getClassName: function()
	{
		return "Runtime.DateTime";
	},
	getParentClassName: function()
	{
		return "Runtime.BaseObject";
	},
	getClassInfo: function()
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function()
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function()
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(field_name)
	{
		return null;
	},
	__implements__:
	[
		use("Runtime.StringInterface"),
	],
});use.add(Runtime.DateTime);
module.exports = Runtime.DateTime;