var xpath = require('xpath') , dom = require('xmldom').DOMParser;

exports.parseDom = function (id, content) {
    var doc = new dom().parseFromString(content.replace(/&mdash;/g, ' - '));
    this.select = function (selector) {
        return xpath.select(selector, doc).toString();
    }
    this.attr = function (selector) {
        var a = xpath.select(selector, doc);
        var r = [];
        for (var i = 0; i < a.length; i++) {
            r.push(a[i].value);
        }
        return r.reverse().toString();
    }
};

exports.getFrontTexts = function () {
    return {
        title:this.select("//rfc/front/title/text()"),
        abstract:this.select("//rfc/front/abstract/t/text()"),
        author:this.attr("//rfc/front/author/@fullname")
    };
};

exports.getKeywords = function () {
    var k = this.select("//rfc/front/keyword/text()");
    return { keywords:k.replace(/,/g, ' ') };
};
exports.getCategory = function () {
    return { category:this.attr('//rfc/@category') };
};

exports.getFirstSection = function () {
    return {sec1:this.select("concat(//section[1]/@title, //section[1]/t/text())") };
};

exports.getFulltext = function () {
    var s='', c = this.select('count(//section)');
    for(var i=1;i<=parseInt(c);i++) {
        s += this.attr("//section["+i+"]/@title") + ' --- ';
        s += this.select("//section["+i+"]/t/text()");
    }
    return {
        content: s,
        titles: this.attr("//section/@title")
    };
};
exports.getReferences = function () {
    return {references:this.select("//reference/front/title/text()") };
};

exports.getPosition = function(id,content) {
    var p = parseInt(this.select("count(//result/doc/str[@name='id' and .='"+id+"'])*(count(//result/doc/str[@name='id' and .='"+id+"']/../preceding-sibling::*)+1)"));
    return { position: p || 1000 }
};