define(
    // == INTERFACE NAME ==
    "Controllers.ToDoTasks",

    // == DEPENDENCIES ==
    [
        "Util.getViewResources",
        "Util.layout",
        "ViewModels.PurchaseOrder.EditVM",
        "ViewModels.PurchaseOrder.ListVM"
    ],
    function(
        // == DEPENDENCY INJECTIONS ==
        getViewResources,
        layout,
        EditVM,
        ListVM
    ) {
        // == CONSTRUCTOR ==
        function ToDoTasksController(render) {
            console.log("ToDoTasksController constructor executing.");
            this.render = render;
        }

        // == PROPERTIES & METHODS ==
        ToDoTasksController.prototype.index = function() {
            getViewResources("ToDoTasks/index",
                "/api/todotasks",
                function(viewSource, viewModel) {
                    console.log("Executing PurchaseOrders.index...");
                    //Initialze Kendo VM
                    var vm = new ListVM(viewModel);

                    //Bind VM to razor HTML
                    var view = bindView(viewSource, { model: vm });

                    //Render
                    this.render(view, "/purchaseOrders");
                }.bind(this)
            );
        }

        return ToDoTasksController;
    }