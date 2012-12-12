
var merge = function (a,b,c){
    for(c in b)b.hasOwnProperty(c)&&((typeof a[c])[0]=='o'?merge(a[c],b[c]):a[c]=b[c])
};

var process = function () {
    var prodChain = [], consumeChain = [], crunch, use, run;

    crunch = function (step) {
        prodChain.push(step);
        return {crunch:crunch, use:use, run:run};
    };

    use = function(step) {
        consumeChain.push(step);
        return {crunch:crunch, use:use, run:run};
    };

    run = function (id, content, callback) {
        var doc = {id:id}, o={};
        for (var i = 0; i < prodChain.length; i++) {
            merge(doc, prodChain[i].apply(o, [id, content]));
        }
        for(var i=0; i<consumeChain.length; i++) {
            consumeChain[i].apply(o, [id, doc])
        }
        if (callback) callback(id, doc);
        return doc;
    };
    return {crunch:crunch, use:use, run:run};
};

exports.process = process;