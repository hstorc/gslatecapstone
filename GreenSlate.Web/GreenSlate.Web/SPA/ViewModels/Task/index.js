
define(
    // == INTERFACE NAME ==
    "ViewModels.Task.TaskIndex",

    // == DEPENDENCIES ==
    [
        "Util.layout",

    ],
    function (
        // == DEPENDENCY INJECTIONS ==
        util,
    ) {
        // == CONSTRUCTOR ==


        function TaskIndex(render) {
            console.log("TaskIndex view constructor executing.");
            //   console.log(q, users);

        }

        function renderGrid(users) {
            console.log(users.length);
            //Without the generated proxy
            var hubUrl = "http://localhost:50336/signalr/hubs";
            var connection = $.hubConnection(hubUrl, { useDefaultPath: false });
            connection.logging = true;
           //no generated proxy
            var hub = connection.createHubProxy("ToDoTasksHub");
            var hubStart = connection.start({ jsonp: true });

            //  return HomeController;

            $("#notification").kendoNotification({
                width: "100%",
                position: {
                    top: 0,
                    left: 0
                }
            });

            $("#TasksGrid").kendoGrid({
                height: 550,
                editable: false,
                sortable: true,
                columns: [
                    { field: "Actions", command: { text: "Edit", click: goEdit }, title: " ", width: "180px" },
                    {
                        field: "Completed",
                        width: 120, template: '<input type="radio" name="Completed#=Id #" id="yesCompleted#=Id #" value="true" #= Completed ? "checked=checked" : "" # class="chkbx" ></input>' +
                        ' <label for="yesCompleted#=Id #">Yes</label>' +
                        '<input type="radio" name="Completed#=Id #" id="noCompleted#=Id #" value="false" #= !Completed ? "checked=checked" : "" # class="chkbx" ></input>' +
                        ' <label for="noCompleted#=Id #">No</label>',
                        filterable: {
                            multi: true
                        }
                    },
                    {
                        field: "Title",
                        filterable: {
                            extra: false,
                            operators: {
                                string: {
                                    contains: "Contains"
                                }
                            }
                        }
                    },
                    {
                        field: "Estimation",
                        filterable: {
                            extra: false,
                            operators: {
                                number: {
                                    gte: "More than"
                                }
                            }
                        }},
                    {
                        field: "CreatedBy", filterable: {
                            ui: userFilter
                        }
                    }

                ],
                //toolbar: ["create"],
                dataSource: {
                    type: "signalr",
                    autoSync: true,
                    // Handle the push event to display notifications when push updates arrive
                    push: function (e) {
                        console.log('!!!!!!push happenned!!!!!!!', e);
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
                        errors: "Errors",
                        data: "Data",
                        total: "Total"
                    },
                    error: function (e) {
                        console.log('onerror', e);
                       // console.trace();
                        //refresh();
                        // alert(e);
                    },
                    sort: [{ field: "Title", dir: "desc" }],

                    transport: {
                        signalr: {
                            promise: hubStart,
                            hub: hub,
                            server: {
                                read: "data",
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
                    },
                    serverFiltering: true,
                    serverSorting: true,
                    pageSize: 20,
                    serverPaging: true

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
                    extra: false/*,
                    operators: {
                        string: {
                            contains: "Contains"
                        }
                    }*/
                },
               /* filterable: {
                    mode: "row"
                },*/
                //detailTemplate: kendo.template($("#taskDetails").html()),
              //  detailInit: detailInit,
                edit: function (e) {
                    $(".k-grid-update").text("Save")
                    var title = "Edit mode";
                    if (e.model.isNew()) {
                        title = "Insert mode";
                    }

                    var wnd = e.container.data("kendoWindow");
                    wnd.title(title);
                }/*,
                filterMenuInit: onFilterMenuInit*/
            });

            function goEdit(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                dataItem.ID = dataItem.id;
                window.location.href = "#/task/create/" + dataItem.ID;
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

            //function GetUsers() {
            var usersList = new kendo.data.DataSource(
                { data: users }
            );

            function userFilter(element) {
                element.kendoDropDownList({
                    dataSource: usersList,
                    optionLabel: "--Select User--"
                });
            }

            function onFilterMenuInit(e) {
                console.log('onFilterMenuInit',e.field);
                if (e.field == "Completed") {
                    initCheckboxFilter.call(this, e);
                }
            }

            function initCheckboxFilter(e) {
                var popup = e.container.data("kendoPopup");
                var dataSource = this.dataSource;
                var field = e.field;
                var checkboxesDataSource = new kendo.data.DataSource({
                    data: uniqueForField(dataSource.data(), field)
                });
                var helpTextElement = e.container.children(":first").children(":first");
                helpTextElement.nextUntil(":has(.k-button)").remove();
                var element = $("<div class='checkbox-ontainer'></div>").insertAfter(helpTextElement).kendoListView({
                    dataSource: checkboxesDataSource,
                    template: "<div><input type='checkbox' value='#:" + field + "#'/>#:" + field + "#</div>"
                });
                e.container.find("[type='submit']").click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var filter = dataSource.filter() || { logic: "and", filters: [] };
                    var fieldFilters = $.map(element.find(":checkbox:checked"), function (input) {
                        return {
                            field: field,
                            operator: "eq",
                            value: input.value
                        };
                    });
                    if (fieldFilters.length) {
                        removeFiltersForField(filter, field);
                        filter.filters.push({
                            logic: "or",
                            filters: fieldFilters
                        });
                        dataSource.filter(filter);
                    }
                    popup.close();
                });
            }

            function removeFiltersForField(expression, field) {
                if (expression.filters) {
                    expression.filters = $.grep(expression.filters, function (filter) {
                        removeFiltersForField(filter, field);
                        if (filter.filters) {
                            return filter.filters.length;
                        } else {
                            return filter.field != field;
                        }
                    });
                }
            }


            function uniqueForField(data, field) {
                console.log('uniqueForField',data, field);
                var map = {};
                var result = [];
                var item;
                for (var i = 0; i < data.length; i++) {
                    item = data[i];
                    if (!map[item[field]]) {
                        console.log('item.toJSON()=', item[field]);

                        result.push(item[field].toJSON());
                        map[item[field]] = true;
                    }
                }
                console.log(result);
                return result;
            }
        }

        return {
            TaskIndex: TaskIndex,
            renderGrid: renderGrid
        }
    }


);        