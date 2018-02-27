define(
    // == CLASS NAME ==
    "ViewModels.Task.Create",
    // == DEPENDENCIES ==
    [
        "Util.ajax",
        "Utils"
    ],
    function (
        // == DEPENDENCY INJECTIONS ==
        ajax,
        utils
    ) {
        function CreateTask(data) {
            console.log("CreateTask constructor executing.", data);
            var observableSelf = kendo.observable({
                Title: (data !== null ? data.Title : ""),
                Estimation: (data !== null ? data.Estimation : 0),
                Completed: (data !== null ? data.Completed : false),
                Id: (data !== null ? data.Id : 0),
                apiURL: "/api/todotasks",
                OnClick: function (e) {
                    console.log("CreateTask click, observableSelf.Completed=", observableSelf.Completed);
                    var form = $("#TaskForm");
                    var validatable = form.data("kendoValidator");
                    //validate the input elements and check if there are any errors
                    if (validatable.validate() === false) {
                        // get the errors and write them out to the "errors" html container
                        console.log("form wasn't validated", validatable.errors());
                        var errors = validatable.errors();
                        $(errors).each(function () {
                            $("#errors").html(this);
                        });

                    }
                    else {
                        var action = (isNaN(this.Id) || this.Id === 0) ? "POST" : "PUT";
                        $.ajax({
                            url: observableSelf.apiURL + "/",
                            method: action,
                            data: {
                                Title: observableSelf.Title,
                                Estimation: observableSelf.Estimation,
                                Completed: observableSelf.Completed,
                                Id: observableSelf.Id
                            }

                        })
                            .fail(function (x, s, e) {
                                console.log(x, s, e);
                            })
                            .done(function (x, s, e) {
                                console.log('click ajax,' + action + ' is done')
                                console.log(x, s, e);
                               // window.location.href = "#/task";
                                utils.redirectToList();
                            });
                    }
                },
                Cancel: function (e) {
                    console.log('cancel');
                    utils.redirectToList();
                }
            }
            );
       

            return observableSelf;
        }
       
        return CreateTask;

    }
);
