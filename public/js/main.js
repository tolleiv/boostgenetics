$(document).ready(function () {
    var socket = io.connect(document.location.origin);

    $("#addterm").click(function () {
        $(".terms").append($("<div class=\"term controls\">").append($(".terms .term:first").html()))
        $(".terms .term:last input").val("");
    });

    var storedData = JSON.parse(localStorage.getItem('data'));
    if (storedData) {
        $("input[name='host']").val(storedData.host),
        $("input[name='port']").val(storedData.port),
        $("input[name='path']").val(storedData.path),
        $("input[name='fields']").val(storedData.fields),
        $("input[name='iterations']").val(storedData.iterations),
        $("input[name='domain']").val(JSON.stringify(storedData.domain)),
        $("input[name='vector']").val(JSON.stringify(storedData.vector)),
        $.each(storedData.data, function (i, e) {
            if (!e.search || e.search == '') return;
            $(".terms").prepend($("<div class=\"term controls\">").append($(".terms .term:first").html()))
            $(".terms .term:first input[name='search']").val(e.search);
            $(".terms .term:first input[name='doc']").val(e.doc);
            $(".terms .term:first input[name='pos']").val(e.pos);
        });
    }
    var running = false;
    var currentConsole = '';
    var runner = function(selector) {
        if (running) {
            alert("Something is in process already.")
            return;
        }
        currentConsole=selector;
        $(selector).html("<div>Start....</div>")
        var data = [];
        $(".term").each(function (i, element) {
            if ($(element).find("input[name='search']").val() == '') return;
            var o = {
                search:$(element).find("input[name='search']").val(),
                doc:$(element).find("input[name='doc']").val(),
                pos:$(element).find("input[name='pos']").val(),
            };
            data.push(o);
        });
        var o = {
            host:$("input[name='host']").val(),
            port:$("input[name='port']").val(),
            path:$("input[name='path']").val(),
            fields:$("input[name='fields']").val(),
            iterations:$("input[name='iterations']").val(),
            domain:JSON.parse($("input[name='domain']").val()),
            vector:JSON.parse($("input[name='vector']").val()),
            data:data
        };
        localStorage.setItem('data', JSON.stringify(o));
        return o;
    }

    $("#train").click(function () {
        socket.emit('train', runner('.training .console'));
        });
    $("#fitness").click(function() {
        var o = runner('.fitness .console');
        socket.emit('test', runner('.fitness .console'));
    });
    socket.on('vector', function (message) {
        running=!message.done;
        $(currentConsole).append($((message.done?"<div class='done'>":"<div>")).html(JSON.stringify(message.v) + " : " + Math.round(100*message.c)/100 + " => √" + Math.round(100*Math.sqrt(message.c))/100));
    });

})
