using System.Web.Optimization;

namespace GreenSlate.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            //-----CSS-----
            var styleBundle = new StyleBundle("~/Content/all")

                .Include("~/3rdParty/Kendo-UI-Professional-3-1111-2015/src/styles/web/kendo.common-bootstrap.css",
                    new System.Web.Optimization.CssRewriteUrlTransform())
                .Include("~/3rdParty/bootstrap-3.3.4/css/bootstrap.css", new CssRewriteUrlTransform());

            //styleBundle.Transforms.Add(new FileHashVersionBundleTransform());
            bundles.Add(styleBundle);

            var scriptBundle = new ScriptBundle("~/bundles/all").Include(
                    // 3rd party scripts                   
                    "~/3rdParty/jquery/js/jquery-1.9.1.min.js",

                     "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.all.min.js",

                    "~/3rdParty/jquery-ui/jquery-ui.min.js",

                    "~/3rdParty/loadash/lodash.js",

                    "~/3rdParty/pubsub/pubsub.js",

                    "~/3rdParty/signalr/jquery.signalR-2.2.1.js",
                    "~/3rdParty/requirejs/require.js",
                    "~/SPA/Global/requireConfig.js",
                    "~/SPA/Global/globalVariables.js",
                    "~/SPA/Util/layout.js",
                    "~/SPA/Router.js",
                    "~/SPA/App.js",
                    "~/SPA/Global/globalVariables.js",
                    "~/3rdParty/bootstrap-3.3.4/js/bootstrap.min.js",
                    "~/3rdParty/bootstrap-notify/bootstrap-notify.min.js",
                    "~/3rdParty/bootstrap-slides/jquery.slides.min.js"
                );

            bundles.Add(scriptBundle);

            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/modernizr-*"));



        }
    }
}
