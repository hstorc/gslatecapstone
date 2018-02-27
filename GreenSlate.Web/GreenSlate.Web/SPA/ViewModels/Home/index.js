define(
    // == INTERFACE NAME ==
    "ViewModels.Home.Index",

    // == DEPENDENCIES ==
    [
        "Util.layout",
        
    ],
    function (
        // == DEPENDENCY INJECTIONS ==
        util,
     
    ) {
        // == CONSTRUCTOR ==
        function HomeIndex(render) {
            console.log("HomeIndex view constructor executing.");
            //   console.log(q, users);

        }

        function renderGrid(users) {
            var hubUrl = "http://localhost:50336/signalr/hubs";
            var connection = $.hubConnection(hubUrl, { useDefaultPath: false });
            var hub = connection.createHubProxy("ToDoTasksHub");
            connection.logging = true;
            var hubStart = connection.start({ jsonp: true });
            //  return HomeController;

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
                    autoSync: false,
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
                        console.log(stacktrace());
                        //refresh();
                        // alert(e);
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
                dataBound: function (e) {

                    var dataItems = e.sender.dataSource.view();
                    for (var j = 0; j < dataItems.length; j++) {
                        var completed = dataItems[j].get("Completed");

                        var row = e.sender.tbody.find("[data-uid='" + dataItems[j].uid + "']");
                        if (!completed) {
                            row.addClass("notCompleted");
                        }
                        else {
                            row.addClass("completed");
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
                //detailTemplate: kendo.template($("#taskDetails").html()),
                detailInit: detailInit,
                edit: function (e) {
                    $(".k-grid-update").text("Save")
                    var title = "Edit mode";
                    if (e.model.isNew()) {
                        title = "Insert mode";
                    }

                    var wnd = e.container.data("kendoWindow");
                    wnd.title(title);
                }
            });

            //renderTestGrid();
            //originalGrid();
        }       

        function error_handler(args) {
            console.log('error_handler,args=', args);
            if (args.errors) {
                var grid = $("#toDoTasks").data("kendoGrid");
                grid.one("dataBinding", function (e) {
                    e.preventDefault();   // cancel grid rebind if error occurs                             

                    for (var error in args.errors) {
                        showMessage(grid.editable.element, error, args.errors[error].errors);
                    }
                });
            }
        }

        function showMessage(container, name, errors) {
            //add the validation message to the form
            container.find("[data-valmsg-for=" + name + "],[data-val-msg-for=" + name + "]")
                .replaceWith(validationMessageTmpl({ field: name, message: errors[0] }))
        }

        function detailInit(e) {
            /*   console.log(e);
               var detailRow = e.detailRow;
               var model = e.data;
               kendo.bind(detailRow, model);
               model.bind('change',
                   function (e) {
                       var tr = $('tr[data-uid=' + model.uid + ']');
                       $('#grid').data().kendoGrid.expandRow(tr);
                   });*/
        }

        function GetUsers() {
            $.ajax(
                { url: "/api/users" })
                .done(function (u) {
                    console.log(u);
                    return u;
                });
        }

        //function GetUsers() {
        var users = new kendo.data.DataSource({
            transport: {
                read: {
                    url: '/api/users',
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
                optionLabel: "--Select User--"
            });
        }
        
        return {
            HomeIndex: HomeIndex,
            renderGrid: renderGrid
        }
    }
);