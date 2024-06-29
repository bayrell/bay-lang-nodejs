"use strict;"
var use = require('bay-lang').use;
/*!
 *  BayLang Constructor
 */
if (typeof BayLang == 'undefined') BayLang = {};
if (typeof BayLang.Constructor == 'undefined') BayLang.Constructor = {};
if (typeof BayLang.Constructor.WidgetDebug == 'undefined') BayLang.Constructor.WidgetDebug = {};
BayLang.Constructor.WidgetDebug.AppHook = function(ctx)
{
	use("Runtime.Web.Hooks.AppHook").apply(this, arguments);
};
BayLang.Constructor.WidgetDebug.AppHook.prototype = Object.create(use("Runtime.Web.Hooks.AppHook").prototype);
BayLang.Constructor.WidgetDebug.AppHook.prototype.constructor = BayLang.Constructor.WidgetDebug.AppHook;
Object.assign(BayLang.Constructor.WidgetDebug.AppHook.prototype,
{
	/**
	 * Register hooks
	 */
	register_hooks: function(ctx)
	{
		this.register(ctx, this.constructor.CALL_API_BEFORE);
		this.register(ctx, this.constructor.VUE_MODULES);
	},
	/**
	 * Call api before
	 */
	call_api_before: function(ctx, params)
	{
		var post_data = params.get(ctx, "post_data");
		var service = post_data.get(ctx, "service");
		var api_name = post_data.get(ctx, "api_name");
		var method_name = post_data.get(ctx, "method_name");
		if (service != "constructor")
		{
			return ;
		}
		var api_url_arr = use("Runtime.Vector").from(["api","app",api_name,method_name]);
		api_url_arr = api_url_arr.filter(ctx, (ctx, s) =>
		{
			return s != "";
		});
		var api_url = "/" + use("Runtime.rtl").toStr(api_url_arr.join(ctx, "/")) + use("Runtime.rtl").toStr("/");
		params.set(ctx, "api_url", api_url);
	},
	/**
	 * Init vue app
	 */
	vue_modules: function(ctx, params)
	{
		var registerComponent = null;
		registerComponent = () => {
			const mixin =
			{
				mounted: function () {
					this.$el.__component__ = this;
				}
			};
			return {
				install: () => {
					vue_app.mixin(mixin);
				},
			};
		};
		var vue_app = params.get(ctx, "vue");
		vue_app.use(ctx, registerComponent(ctx));
	},
});
Object.assign(BayLang.Constructor.WidgetDebug.AppHook, use("Runtime.Web.Hooks.AppHook"));
Object.assign(BayLang.Constructor.WidgetDebug.AppHook,
{
	/* ======================= Class Init Functions ======================= */
	getNamespace: function()
	{
		return "BayLang.Constructor.WidgetDebug";
	},
	getClassName: function()
	{
		return "BayLang.Constructor.WidgetDebug.AppHook";
	},
	getParentClassName: function()
	{
		return "Runtime.Web.Hooks.AppHook";
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
});use.add(BayLang.Constructor.WidgetDebug.AppHook);
module.exports = BayLang.Constructor.WidgetDebug.AppHook;