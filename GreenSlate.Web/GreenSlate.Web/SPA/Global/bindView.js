
function bindView(viewSource, fields) {
  //  console.log('bindView:', viewSource, fields, typeof fields);
    window.viewModel = undefined;
    if (typeof fields === 'object') {
        window.viewModel = fields.model;
    }
    var view = new kendo.View(viewSource, fields);
    return view;
}
