(function () {
    console.log('validate is on', $("#TaskForm"));
    var validator = $("#TaskForm").kendoValidator({

        rules: {

            validtitlelength: function (input) {
                var min = input.data("minlength");
                var max = input.data("maxlength");
                if (typeof min !== 'undefined' && !isNaN(min)
                    && typeof max !== 'undefined' && !isNaN(max)) {

                    if ($.trim(input.val().length) > min
                        && $.trim(input.val().length) < max) {

                        // the fields match
                        return true;

                    } else {

                        return false;

                    }

                }
                return true;

            },

            estimationrange: function (input) {
                var min = input.data('estimationrangemin');
                var max = input.data('estimationrangemax');
                if (typeof min !== 'undefined' && !isNaN(min)
                    && typeof max !== 'undefined' && !isNaN(max)) {
                    var estimation = $.trim(input.val());
                    if (isNaN(estimation))
                        return false;
                    estimation = parseInt(estimation);
                    if (estimation > min && estimation < max) {
                        return true;
                    }
                    return false;

                }
                return true;

            }
        },

        messages: {

            estimationrange: function (input) {
                console.log('print error:', input.data('estimationrangemsg'));
                return input.data('estimationrangemsg');
            },
            required: 'This is required!!',
            validtitlelength: function (input) {
                console.log('print error:', input.data('validtitlelengthmsg'));
                return input.data('validtitlelengthmsg');
            }
        }

    }).data('kendoValidator');

}());

