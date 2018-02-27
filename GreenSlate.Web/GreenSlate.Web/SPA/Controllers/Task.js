define(
    // == INTERFACE NAME ==
    "Controllers.Task",

    // == DEPENDENCIES ==
    [
        "Util.layout",
        "ViewModels.Task.TaskIndex",
        "ViewModels.Task.Create",
        "Utils"
    ],
    function (
        // == DEPENDENCY INJECTIONS ==
        layout,
        taskIndex,
        taskCreate,
        utils
    ) {
        // == CONSTRUCTOR ==

        function TaskController(render) {   
            console.log("TaskController constructor executing.");
            this.render = render;
            this.htmlContatinerId = ".app-content-body";
        }

        // == PROPERTIES & METHODS ==
        TaskController.prototype.index = function () {
            console.log("TaskController index executing.", this.htmlContatinerId);            
            utils.getView("Task/Index", null, function (viewsource) {
               // console.log('getView:', taskIndex);
                // debugger;
                // $('#grid').empty();
                 var kmodel = taskIndex;
                 $(this.htmlContatinerId).empty();
                $.get("/api/users/", function (data) {
                    //         console.log(data);
                    taskIndex.renderGrid(data);
                });
                var view = new kendo.View(viewsource, { wrap: false, model: kmodel });
                view.render(".app-content-body");
            });
        };

        TaskController.prototype.indexWorks = function () {
            console.log("TaskController index executing.");
            require(['ViewModels.Task.Index'], function (vm) {
                //vm.renderGrid();
                $('#grid').empty();
                $.get("/api/users/", function (data) {
                    //         console.log(data);
                    vm.renderGrid(data);
                });


            });
        };

        TaskController.prototype.create = function () {
            console.log("TaskController create htmlContatinerId", this.htmlContatinerId);
            var obj = this;
            utils.getView("Task/Create", null, function (viewsource, data) {
                console.log('htmlContatinerId:', obj.htmlContatinerId);
                $(obj.htmlContatinerId).empty();
                var kmodel = taskCreate(null);
                var view = new kendo.View(viewsource, { wrap: false, model: kmodel });
                console.log('view on edit:', (obj.htmlContatinerId));
                view.render(obj.htmlContatinerId);
            });
        };

        TaskController.prototype.edit = function (id) {
            console.log('task edit id:', id);
            var obj = this;
            //figure how to get the patram..location.url?
            utils.getView("Task/Create", "/api/todotasks/" + id, function (viewsource, data) {
                $(obj.htmlContatinerId).empty();
                var kmodel = taskCreate(data);
                var view = new kendo.View(viewsource, { wrap: false, model: kmodel });
                console.log('view on edit:', (obj.htmlContatinerId));
                view.render(obj.htmlContatinerId);
            });
        };

        return TaskController;
    }
);