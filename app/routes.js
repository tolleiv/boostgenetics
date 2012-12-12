
exports.static = function(name) {
    return function (req, res) {
        console.log("Render " + name);
        res.render(name, { title: "Solr optinizer"});
    }
};