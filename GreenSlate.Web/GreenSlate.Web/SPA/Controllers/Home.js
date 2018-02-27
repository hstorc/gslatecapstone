define(
    // == INTERFACE NAME ==
    "Controllers.Home",

    // == DEPENDENCIES ==
    [
        //"Util.getViewResources",
       // "Util.layout",
        "ViewModels.Home.Index",
        // "ViewModels.PurchaseOrder.ListVM"
    ],
    function (
        // == DEPENDENCY INJECTIONS ==
       //  getViewResources,
       // layout,
        HomeVM,
        // ListVM
    ) {
        // == CONSTRUCTOR ==
        function HomeController(render) {
            console.log("HomeController constructor executing.", render);
           // console.log(HomeVM);
            this.render = render;
        }

        // == PROPERTIES & METHODS ==
        HomeController.prototype.index = function () {
            HomeVM.renderGrid();
            require(['ViewModels.Home.Index'], function (vm) {
                vm.renderGrid();
            });
        }

     

        return HomeController;

    }
);