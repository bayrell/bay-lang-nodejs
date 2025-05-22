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
Runtime.DateTime = function(ctx, data)
{
	if (data == undefined) data = null;
	use("Runtime.BaseObject").call(this, ctx);
	if (data != null)
	{
		if (data.has(ctx, "y"))
		{
			this.y = data.get(ctx, "y");
		}
		if (data.has(ctx, "m"))
		{
			this.m = data.get(ctx, "m");
		}
		if (data.has(ctx, "d"))
		{
			this.d = data.get(ctx, "d");
		}
		if (data.has(ctx, "h"))
		{
			this.h = data.get(ctx, "h");
		}
		if (data.has(ctx, "i"))
		{
			this.i = data.get(ctx, "i");
		}
		if (data.has(ctx, "s"))
		{
			this.s = data.get(ctx, "s");
		}
		if (data.has(ctx, "ms"))
		{
			this.ms = data.get(ctx, "ms");
		}
		if (data.has(ctx, "o"))
		{
			this.o = data.get(ctx, "o");
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
	toMap: function(ctx)
	{
		return use("Runtime.Map").from({"y":this.y,"m":this.m,"d":this.d,"h":this.h,"i":this.i,"s":this.s,"ms":this.ms,"o":this.o});
	},
	/**
	 * Returns timestamp
	 * @return int
	 */
	getTimestamp: function(ctx)
	{
		var dt = this.toObject();
		return Math.round(dt.getTime() / 1000);
		return null;
	},
	timestamp: function(ctx)
	{
		return this.getTimestamp(ctx);
	},
	/**
	 * Returns day of week
	 * @return int
	 */
	getDayOfWeek: function(ctx)
	{
		var dt = this.toObject();
		return dt.getDay();
		return null;
	},
	/**
	 * Return db datetime
	 * @return string
	 */
	toString: function(ctx)
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
		var offset_h = __v0.abs(ctx, __v1.floor(ctx, offset / 60));
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
	getDateTimeString: function(ctx)
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
	normalize: function(ctx)
	{
		var dt = this;
		var offset = ctx.env(ctx, "TZ_OFFSET");
		if (offset)
		{
			dt = dt.setOffset(ctx, offset);
		}
		return dt;
	},
	/**
	 * Shift tz
	 */
	shift: function(ctx, seconds)
	{
		var timestamp = this.getTimestamp(ctx);
		var dt = this.constructor.create(ctx, timestamp + seconds);
		dt.setOffset(ctx, this.o);
		return dt;
	},
	/**
	 * Set offset
	 */
	setOffset: function(ctx, offset)
	{
		var dt = this.toObject(ctx);
		var dt_offset;
		dt_offset = -dt.getTimezoneOffset() * 60;
		/* Modify offset */
		var delta = offset - dt_offset;
		dt = this.constructor.modify(ctx, dt, delta);
		var obj = this.constructor.fromObject(ctx, dt);
		obj.o = offset;
		return obj;
	},
	/**
	 * Convert to native object
	 */
	toObject: function(ctx)
	{
		var dt = new Date(this.y, this.m - 1, this.d, this.h, this.i, this.s);
		offset = dt.getTimezoneOffset() + this.o * 60;
		dt = this.constructor.modify(dt, -offset * 60);
		return dt;
	},
	_init: function(ctx)
	{
		use("Runtime.BaseObject").prototype._init.call(this,ctx);
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
	create: function(ctx, time)
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
	now: function(ctx)
	{
		return this.create(ctx, -1);
	},
	/**
	 * Create DateTime from string
	 */
	fromString: function(ctx, s)
	{
		var __v0 = use("Runtime.DateTime");
		var dt = new __v0(ctx);
		var __v1 = use("Runtime.rs");
		dt.y = use("Runtime.rtl").to(__v1.substr(ctx, s, 0, 4), {"e":"int"});
		var __v2 = use("Runtime.rs");
		dt.m = use("Runtime.rtl").to(__v2.substr(ctx, s, 5, 2), {"e":"int"});
		var __v3 = use("Runtime.rs");
		dt.d = use("Runtime.rtl").to(__v3.substr(ctx, s, 8, 2), {"e":"int"});
		var __v4 = use("Runtime.rs");
		dt.h = use("Runtime.rtl").to(__v4.substr(ctx, s, 11, 2), {"e":"int"});
		var __v5 = use("Runtime.rs");
		dt.i = use("Runtime.rtl").to(__v5.substr(ctx, s, 14, 2), {"e":"int"});
		var __v6 = use("Runtime.rs");
		dt.s = use("Runtime.rtl").to(__v6.substr(ctx, s, 17, 2), {"e":"int"});
		dt.o = 0;
		var __v7 = use("Runtime.rs");
		if (__v7.strlen(ctx, s) > 19)
		{
			var __v8 = use("Runtime.rs");
			var sign = __v8.substr(ctx, s, 19, 1);
			var __v9 = use("Runtime.rs");
			var tz_h = use("Runtime.rtl").to(__v9.substr(ctx, s, 20, 2), {"e":"int"});
			var __v10 = use("Runtime.rs");
			var tz_m = use("Runtime.rtl").to(__v10.substr(ctx, s, 23, 2), {"e":"int"});
			dt.o = (tz_h * 60 + tz_m) / 60;
			if (sign == "-")
			{
				dt.o = 0 - dt.o;
			}
		}
		return dt;
	},
	/**
	 * Get tz offset
	 */
	getOffset: function(ctx, tz)
	{
	},
	/**
	 * Add seconds
	 */
	modify: function(ctx, dt, seconds)
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
	/**
	 * Create from native object
	 */
	fromObject: function(ctx, dt)
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
	getClassInfo: function(ctx)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return Map.from({
			"annotations": Vector.from([
			]),
		});
	},
	getFieldsList: function(ctx)
	{
		var a = [];
		return use("Runtime.Vector").from(a);
	},
	getFieldInfoByName: function(ctx,field_name)
	{
		var Vector = use("Runtime.Vector");
		var Map = use("Runtime.Map");
		return null;
	},
	getMethodsList: function(ctx)
	{
		var a=[
		];
		return use("Runtime.Vector").from(a);
	},
	getMethodInfoByName: function(ctx,field_name)
	{
		return null;
	},
	__implements__:
	[
		use("Runtime.StringInterface"),
	],
});use.add(Runtime.DateTime);
module.exports = Runtime.DateTime;