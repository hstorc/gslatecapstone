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

            // var hubUrl = "http://localhost:42471//signalr/hubs";
            var hubUrl = "http://localhost:50336/signalr/hubs";
            var connection = $.hubConnection(hubUrl, { useDefaultPath: false });
            var hub = connection.createHubProxy("ToDoTasksHub");
            connection.logging = true;
            var hubStart = connection.start({ jsonp: true });

            $("#notification").kendoNotification({
                width: "100%",
                position: {
                    top: 0,
                    left: 0
                }
            });
            $("#toDoTasks").kendoGrid({
                height: 550,
                //editable:true,
                editable: {
                    mode: "popup",
                    template: kendo.template($("#taskDetails").html())
                },
                sortable: true,
                columns: [
                    { field: "Actions", command: ["destroy", "edit"] },
                    {
                        field: "Completed",
                        width: 120, template: '<input type="radio" name="Completed#=Id #" id="yesCompleted#=Id #" value="true" #= Completed ? "checked=checked" : "" # class="chkbx" ></input>' +
                            ' <label for="yesCompleted#=Id #">Yes</label>' +
                            '<input type="radio" name="Completed#=Id #" id="noCompleted#=Id #" value="false" #= !Completed ? "checked=checked" : "" # class="chkbx" ></input>' +
                            ' <label for="noCompleted#=Id #">No</label>'
                    },
                    { field: "Title" },
                    { field: "Estimation" },
                    {
                        field: "CreatedBy", filterable: {
                            ui: userFilter
                        }
                    }
                   
                ],
                toolbar: ["create"],
                dataSource: {
                    type: "signalr",
                    autoSync: true,
                    // Handle the push event to display notifications when push updates arrive
                    push: function (e) {
                        var notification = $("#notification").data("kendoNotification");
                        notification.success(e.type);
                    },
                    schema: {
                        model: {
                            id: "Id",
                            fields: {
                                "ID": { editable: false, nullable: true },
                                "CreatedBy": { editable: true, nullable: true },
                                "Title": { editable: true, nullable: true },
                                "Estimation": { type: "number" },
                                "Completed": { editable: true, nullable: true }
                            }
                        },
                        errors: "Errors"
                    },
                    error: function (e) {
                        console.log('onerror', e);
                        alert(e.errors);
                    },
                    sort: [{ field: "Id", dir: "desc" }],
                    transport: {
                        signalr: {
                            promise: hubStart,
                            hub: hub,
                            server: {
                                read: "read",
                                update: "update",
                                destroy: "destroy",
                                create: "create"
                            },
                            client: {
                                read: "read",
                                update: "update",
                                destroy: "destroy",
                                create: "create"
                            }
                        }
                    }
                },
                filterable: {
                    extra: false,
                    operators: {
                        string: {
                            startswith: "Starts with",
                            eq: "Is equal to",
                            neq: "Is not equal to"
                        }
                    }
                },
                detailTemplate: kendo.template($("#taskDetails").html()),
                detailInit: detailInit
            });

        }

        function detailInit(e) {
            console.log(e);
            var detailRow = e.detailRow;
            var model = e.data;
            kendo.bind(detailRow, model);
            model.bind('change',
                function (e) {
                    var tr = $('tr[data-uid=' + model.uid + ']');
                    $('#grid').data().kendoGrid.expandRow(tr);
                });
        }


        function preventPost(e) {
            // if (e.keyCode === 13) {
            console.log(e);
            e.preventDefault();
            // }
        }

        var users = new kendo.data.DataSource({
            transport: {
                read: {
                    url: 'api/users',
                    dataType: "json"
                }
            },
            schema: {
                model: {
                    id: "name"
                }
            }
        });

        function userFilter(element) {
            element.kendoDropDownList({
                dataSource: users,
                optionLabel: "--Select Value--"
            });
        }

        $("title").focusout(preventPost);
        $("testimsationitle").focusout(preventPost);
        $("title").keyup(preventPost);
        $("estimsation").keyup(preventPost);
        $("title").keydown(preventPost);
        $("estimsation").keydown(preventPost);

        return HomeController;

    }
);