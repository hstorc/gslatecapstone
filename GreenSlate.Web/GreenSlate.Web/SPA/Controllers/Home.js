define(
    // == INTERFACE NAME ==
    "Controllers.Home",

    // == DEPENDENCIES ==
    [
        //"Util.getViewResources",
        "Util.layout",
       // "ViewModels.PurchaseOrder.EditVM",
       // "ViewModels.PurchaseOrder.ListVM"
    ],
    function (
        // == DEPENDENCY INJECTIONS ==
       // getViewResources,
        layout,
       // EditVM,
       // ListVM
    ) {
        // == CONSTRUCTOR ==
        function HomeController(render) {
            //console.log("ToDoTasksController constructor executing.", render);
            this.render = render;
        }

        // == PROPERTIES & METHODS ==
        HomeController.prototype.index = function () {
            $("#toDoTasks").kendoGrid({
                dataSource: {
                    transport: {
                        read: { url: "/api/todotasks", type: "GET" },
                        update: { url: "/api/todotasks/1002", type: "PUT" },
                        create: { url: "/api/todotasks", type: "POST" },
                        destroy: { url: "/api/todotasks/1042", type: "DELETE" }
                    },
                    schema: {
                        model: {
                            id: "Id",
                            fields: {
                                Id: { editable: false, nullable: true },
                                Completed: { editable: true, nullable: true },
                                Title: { editable: true, nullable: false, validation: { required: true } },
                                Estimation: { editable: true, nullable: false, validation: { required: true } },
                                createdByName: { editable: true, nullable: false, validation: { required: true } }
                            }
                        }
                    },
                    sort: [{ field: "Id", dir: "asc" }],
                    pageSize: 10
                },
                columns: [
                    { field: "Title", title: "Title", width: "120px" },
                    { field: "Estimation", title: "Estimated Hours", width: "100px" },
                    { field: "CreatedByName", title: "created By" },
                    { command: ["edit", "destroy"], title: "&nbsp;", width: "240px" }],
                editable: "inline",
                pageable: true,
                sortable: true,
                toolbar: ["create"]
            });

            function models(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
               // window.location.href = "/Maintenance/Models/" + dataItem.Id;
            }
        }

        return HomeController;
    }
)