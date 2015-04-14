var retina = window.devicePixelRatio >= 2,
    HTML = [],
    colors = [{
        c_file: "red",
        c_ref: "#f88484"
    }, {
        c_file: "green",
        c_ref: "#76dcc0"
    }, {
        c_file: "violet",
        c_ref: "#94aafc"
    }, {
        c_file: "yellow",
        c_ref: "#e5bd50"
    }, {
        c_file: "salmon",
        c_ref: "#fdbfac"
    }, {
        c_file: "turquoise",
        c_ref: "#7cd9dc"
    }, {
        c_file: "pink",
        c_ref: "#d37fb3"
    }, {
        c_file: "pistachio",
        c_ref: "#bcdb73"
    }],
    patterns = [{
        //COLOQUEI TUDO 2 AQUI PRA TESTAR MAS NAO DEU CERTO
        p_path: "pattern-2.jpg",
        p_retina: "pattern-2.jpg",
        p_size: "109px 130px"
    }, {
        p_path: "pattern-1.png",
        p_retina: "pattern-1.png",
        p_size: "21px 34px"
    }, {
        p_path: "pattern-2.jpg",
        p_retina: "pattern-2.jpg",
        p_size: "118px 80px"
    }, {
        p_path: "pattern-3.png",
        p_retina: "pattern-3.png",
        p_size: "36px 36px"
    }, {
        p_path: "pattern-4.jpg",
        p_retina: "pattern-4.jpg",
        p_size: "97px 150px"
    }, {
        p_path: "pattern-5.png",
        p_retina: "pattern-5@2x.png",
        p_size: "60px 23px"
    }, {
        p_path: "pattern-6.png",
        p_retina: "pattern-6.png",
        p_size: "68px 58px"
    }, {
        p_path: "pattern-7.jpg",
        p_retina: "pattern-7.jpg",
        p_size: "75px 75px"
    }, {
        p_path: "pattern-8.jpg",
        p_retina: "pattern-8.jpg",
        p_size: "75px 75px"
    }, {
        p_path: "pattern-9.jpg",
        p_retina: "pattern-9.jpg",
        p_size: "75px 75px"
    }];
//HTML.push('<!-- START Settings --><div id="settings">');
//HTML.push('<div id="toggle"></div>');
//HTML.push(" <form> ");
//HTML.push("<h4>Select the main color</h4>");
//HTML.push('<ul class="colors">');
for (var i = 0; i < colors.length; i++) {
    var file = colors[i].c_file,
        checked = i === 0 ? "checked" : "";
    //HTML.push(" <li><input type='radio' name='style' value='" + file + "' id='" + file + "' " + checked + "><label style = 'background:" + colors[i].c_ref + "' for='" + file + "'></label></li>")
}
//HTML.push(" </ul> ");
//HTML.push("<h4>Select the pattern</h4>");
//HTML.push('<ul class="patterns">');
for (var i = 0; i < patterns.length; i++) {
    var file = retina ? "images/" + patterns[i].p_retina : "images/" + patterns[i].p_path,
        bgsize = retina ? "background-size: " + patterns[i].p_size : "",
        checked = i === 0 ? "checked" : "";
    //HTML.push(" <li><input type='radio' name='background' value='" + file + "' id='pat" + i + "' data-size='" + patterns[i].p_size + "' " + checked + " ><label style = 'background-image:url(" + file + "); " + bgsize + "' for='pat" + i + "' ></label></li>")
}
//HTML.push(" </ul> ");
//HTML.push("</form> </div><!-- END Settings -->");
$(document).ready(function() {
    $("body").append(HTML.join(""));
    $("#settings input[name='style']").change(function() {
        var e = "stylesheets/" + $(this).val() + ".css";
        $("#colors[rel=stylesheet]").attr("href", e)
    });
    $("#settings input[name='background']").change(function() {
        var e = $(this).val();
        $("body").css("background-image", "url(" + e + ")");
        retina && $("body").css("background-size", $(this).attr("data-size"))
    });
    $("#toggle").click(function() {
        $(this).parent().toggleClass("visible")
    })
});