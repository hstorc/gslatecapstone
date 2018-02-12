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

                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/jszip.min.js",

                    "~/3rdParty/jquery-ui/jquery-ui.min.js",

                    "~/3rdParty/loadash/lodash.js",

                    "~/3rdParty/pubsub/pubsub.js",

                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.core.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.data.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.groupable.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.data.signalr.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.upload.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.binder.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.router.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.pager.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.ooxml.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.excel.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.color.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.drawing.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.pdf.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.progressbar.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.columnsorter.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.grid.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.filtercell.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.resizable.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.userevents.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.draganddrop.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.reorderable.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.selectable.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.editable.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.sortable.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.popup.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.tooltip.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.validator.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.view.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.list.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.dropdownlist.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.combobox.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.maskedtextbox.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.numerictextbox.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.multiselect.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.listview.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.slider.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.calendar.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.datepicker.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.touch.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.window.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.autocomplete.js",
                    "~/3rdParty/Kendo-UI-Professional-3-1111-2015/js/kendo.tabstrip.js",

                    "~/3rdParty/signalr/jquery.signalR-2.2.1.min.js",
                    "~/3rdParty/requirejs/require.js",
                    "~/SPA/requireConfig.js",
                    "~/SPA/App.js",
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
