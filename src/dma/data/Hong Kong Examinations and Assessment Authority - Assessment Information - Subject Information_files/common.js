$(".link-detail").click(function () {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active')
        $(this).parent().find('.activity-list').slideUp()
    } else {
        $(this).addClass('active')
        $(this).parent().find('.activity-list').slideDown()
    }
});

// 左侧菜单
/*$('.mobile.icon-nav .menubutton').click(function () {
    $('.nav').addClass('active');
    $('.btn-close').focus();
});
$('.mobile.icon-nav .menubutton').keydown(function (e) {
    var key = e.which;
    if (key == 13) {
        $('.nav').addClass('active');
        $('.btn-close').focus();
    }
});
$('.nav').click(function () {
    $('.nav').removeClass('active');
});
$('.nav').keydown(function (e) {
    var key = e.which;
    if (key == 13) {
        $('.nav').removeClass('active');
    }
})
$('.btn-close .menuclosebutton').click(function () {
    $('.nav').removeClass('active')
});
$('.btn-close .menuclosebutton').keydown(function (e) {
    var key = e.which;
    if (key == 13) {
        $('.nav').removeClass('active');
    }
});
$('.nav ul').click(function (event) {
    event.stopPropagation();
});
$('.nav ul').keydown(function (event) {
    event.stopPropagation();
});*/
function OpenNav() {
    $('.nav').addClass('active');
    $('.btn-close').focus();
}

function CloseNav() {
    $('.nav').removeClass('active');
}

// PC菜单
if (document.getElementById("menu")) {
    var menu = function () {
        var t = 15, z = 50, s = 6, a;
        function dd(n) { this.n = n; this.h = []; this.c = [] }
        dd.prototype.init = function (p, c) {
            a = c; var w = document.getElementById(p), s = w.getElementsByTagName('ul'), l = s.length, i = 0;
            for (i; i < l; i++) {
                var h = s[i].parentNode; this.h[i] = h; this.c[i] = s[i];
                h.onmouseover = new Function(this.n + '.st(' + i + ',true)');
                h.onmouseout = new Function(this.n + '.st(' + i + ')');
            }
        }
        dd.prototype.st = function (x, f) {
            var c = this.c[x], h = this.h[x], p = h.getElementsByTagName('a')[0];
            clearInterval(c.t); c.style.overflow = 'hidden';
            if (f) {
                p.className += ' ' + a;
                if (!c.mh) { c.style.display = 'block'; c.style.height = ''; c.mh = c.offsetHeight; c.style.height = 0 }
                if (c.mh == c.offsetHeight) { c.style.overflow = 'visible' }
                else { c.style.zIndex = z; z++; c.t = setInterval(function () { sl(c, 1) }, t) }
            } else { p.className = p.className.replace(a, ''); c.t = setInterval(function () { sl(c, -1) }, t) }
        }
        function sl(c, f) {
            var h = c.offsetHeight;
            if ((h <= 0 && f != 1) || (h >= c.mh && f == 1)) {
                if (f == 1) { c.style.filter = ''; c.style.opacity = 1; c.style.overflow = 'visible' }
                clearInterval(c.t); return
            }
            var d = (f == 1) ? Math.ceil((c.mh - h) / s) : Math.ceil(h / s), o = 0;//o = h / c.mh;
            c.style.opacity = o; c.style.filter = 'alpha(opacity=' + (o * 100) + ')';
            c.style.height = h + (d * f) + 'px'
        }
        return { dd: dd }
    }();
    var menu = new menu.dd("menu");
    menu.init("menu", "menuhover");
    function tabthisMenu(thismid) {
        console.log(thismid)
        HideSecondMenu();
        $('#' + thismid).css("z-index", "10000");
        $('#' + thismid).show();
    }
    function HideSecondMenu() {
        for (var i = 1; i < 10; i++) {
            $('#submenu' + i).hide();
        }
        for (var i = 1; i < 10; i++) {
            $('#subsubmenu' + i).hide();
        }
    }
}

// mobile菜单
$(".nav .option .submenu-btn").click(function (e) {
    /*alert(e.pageX + ' , ' + $(window).width());*/
    if ($(window).width() < 800) $(this).attr("href", "#");
    var el = $(this).next(".submenu")
    if (el.hasClass("on")) {
        el.slideUp(300, function () {
            el.removeClass("on")
        });
    } else {
        el.slideDown(300, function () {
            el.addClass("on")
        });
    }
})

/*$(".nav .option .submenu-btn").each(function (i) {
    $(this).attr("href", "#");
});*/

// 打印
function PrintElem(elem, hldr, ttl, lng, opr, url, elem2, elem3) {
    //Popup($(elem).html(), hldr, ttl, lng, opr, url, [].slice.call(arguments, 5));
    var news_html = "";
    if ($("#news").length) {
        news_html = $("#news").html();
    }

    if (elem2 == "" || !$(elem2).length) {
        Popup($(elem).html(), hldr, ttl, lng, opr, url, "", "", news_html);
    } else {
        if (elem3 == "" || !$(elem3).length) {
            Popup($(elem).html(), hldr, ttl, lng, opr, url, $(elem2).html(), "", news_html);
        } else {
            Popup($(elem).html(), hldr, ttl, lng, opr, url, $(elem2).html(), $(elem3).html(), news_html);
        }
    }
}
//function Popup(data, header, title, lang, elem) {
function Popup(data, header, title, lang, elem, url, data2, data3, news_html) {
    if (data != null) {
        var ts = (new Date()).toISOString().slice(0, 19).replace(/-/g, "").replace(/:/g, "").replace(/T/g, "");
        var mywindow = window.open('', ts, 'height=600,width=620');
        if (lang == "en") {
            mywindow.document.write('<html><head><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>Hong Kong Examinations and Assessment Authority - Printer Friendly</title>');
        } else {
            mywindow.document.write('<html><head><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>香港考試及評核局 - 列印</title>');
        }
        mywindow.document.write('<link rel="stylesheet" href="' + url + '/Content/common.css" type="text/css" />');
        mywindow.document.write('<link rel="stylesheet" href="' + url + '/Content/main.css" type="text/css" />');

        mywindow.document.write('<link rel="stylesheet" href="' + url + '/Content/style_inside.css" type="text/css" />');
        mywindow.document.write('<script type="text/javascript" src="' + url + '/Scripts/jquery-3.7.1.min.js"></script>');
        mywindow.document.write('</head><body>');
        mywindow.document.write('<div align="left"><br><img src="' + url + '/Content/images/logo.svg" width="200" alt="HKEAA Logo"></div><br>');
        if (title) mywindow.document.write('<div class="inner_hldr inner_hldr_' + header + '" style="width:595px;"><h1><span id="thetitle">' + title + '</span></h1>');
        mywindow.document.write('<div class="inner_hldr_body contact-list">' + data + '</div>');
        if (data2 != "") mywindow.document.write('<div class="inner_hldr_body contact-list">' + data2 + '</div>');
        if (data3 != "") mywindow.document.write('<div class="inner_hldr_body contact-list">' + data3 + '</div>');
        if (news_html != "") mywindow.document.write('<div class="inner_hldr_body news">' + news_html + '</div>');
        /*arguments[5].forEach(function (id) {
            mywindow.document.write('<div class="inner_hldr_body contact-list">' + $(id).html() + '</div>');
        });*/
        mywindow.document.write('<div align="right"><a class="print_btn" href="#" onclick="printpage();">' + (lang == "en" ? "Print this page" : "列印此頁") + '</a></div>');
        /*if (lang == "en")
            mywindow.document.write('<p>&nbsp;</p><div class="copyright_forprint">Copyright © 2013 HKEAA, All rights reserved. <br>Last modified Date: ' + elem + '</div>');
        else
            mywindow.document.write('<p>&nbsp;</p><div class="copyright_forprint">Copyright © 2013 保留版權所有 香港考試及評核局 <br>上次修改日期: ' + elem + '</div>');*/
        mywindow.document.write('</body>');
        mywindow.document.write('<script>$(".pager").hide(); function printpage(){  window.print();} </script>');
        mywindow.document.write('</html>');
        mywindow.focus();
    } else {
        alert('Not support in this page.');
    }
    return true;
}

// search
function gotoSearch1() {
    var q1 = $("#q1").val();
    //window.open("https://search.hkeaa.edu.hk/search.aspx?q=" + escape(q1));
    window.open(site_search + "/search.aspx?q=" + escape(q1));
}

function gotoSearch2() {
    var q2 = $("#q2").val();
    //window.open("https://search.hkeaa.edu.hk/search.aspx?q=" + escape(q2));
    window.open(site_search + "/search.aspx?q=" + escape(q2));
}

// email to friend
function EmailtoFriend(thislang) {
    var url = window.location.toString();
    post_to_url("/" + thislang + "/email/emailtofrd.html", { 'p1': document.title, 'p2': document.location }, "post");
}

// event registration
function EventRegistration(thislang, alias) {
    post_to_url("/" + thislang + "/events/registration.html", { 'p1': alias }, "post");
}

function post_to_url(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

// Special Annoucement
function SpecialAnnouncement() {
    //$(function () {
    $('#myModal').reveal({
        animation: 'fadeAndPop',                   //fade, fadeAndPop, none
        animationspeed: 200,                       //how fast animtions are
        closeonbackgroundclick: true,              //if you click background will modal close?
        dismissmodalclass: 'close-reveal-modal'    //the class of a button or element that will close an open modal
    });
    //});
}

// Print Newsletter
// 打印
function PrintElem_Newsletter(elem, hldr, ttl, lng, opr, url, elem2, elem3) {
    //Popup($(elem).html(), hldr, ttl, lng, opr, url, [].slice.call(arguments, 5));
    var news_html = "";
    if ($("#news").length) {
        news_html = $("#news").html();
    }

    if (elem2 == "" || !$(elem2).length) {
        Popup_Newsletter($(elem).html(), hldr, ttl, lng, opr, url, "", "", news_html);
    } else {
        if (elem3 == "" || !$(elem3).length) {
            Popup_Newsletter($(elem).html(), hldr, ttl, lng, opr, url, $(elem2).html(), "", news_html);
        } else {
            Popup_Newsletter($(elem).html(), hldr, ttl, lng, opr, url, $(elem2).html(), $(elem3).html(), news_html);
        }
    }
}
//function Popup(data, header, title, lang, elem) {
function Popup_Newsletter(data, header, title, lang, elem, url, data2, data3, news_html) {
    if (data != null) {
        var ts = (new Date()).toISOString().slice(0, 19).replace(/-/g, "").replace(/:/g, "").replace(/T/g, "");
        var mywindow = window.open('', ts, 'height=600,width=720');
        if (lang == "en") {
            mywindow.document.write('<html><head><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>Hong Kong Examinations and Assessment Authority - Printer Friendly</title>');
        } else {
            mywindow.document.write('<html><head><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>香港考試及評核局 - 列印</title>');
        }
        mywindow.document.write('<link rel="stylesheet" href="' + url + '/Content/newsletter.css" type="text/css" />');
        mywindow.document.write('<script type="text/javascript" src="' + url + '/Scripts/jquery-3.7.1.min.js"></script>');
        mywindow.document.write('</head><body>');
        if (title) mywindow.document.write('<div class="inner_hldr inner_hldr_' + header + '" style="width:595px;"><h1><span id="thetitle">' + title + '</span></h1>');
        mywindow.document.write('<div class="inner_hldr_body contact-list">' + data + '</div>');
        if (data2 != "") mywindow.document.write('<div class="inner_hldr_body contact-list">' + data2 + '</div>');
        if (data3 != "") mywindow.document.write('<div class="inner_hldr_body contact-list">' + data3 + '</div>');
        if (news_html != "") mywindow.document.write('<div class="inner_hldr_body news">' + news_html + '</div>');
        /*arguments[5].forEach(function (id) {
            mywindow.document.write('<div class="inner_hldr_body contact-list">' + $(id).html() + '</div>');
        });*/
        mywindow.document.write('<div align="right"><a class="print_btn" href="#" onclick="printpage();">' + (lang == "en" ? "Print this page" : "列印此頁") + '</a></div>');
        /*if (lang == "en")
            mywindow.document.write('<p>&nbsp;</p><div class="copyright_forprint">Copyright © 2013 HKEAA, All rights reserved. <br>Last modified Date: ' + elem + '</div>');
        else
            mywindow.document.write('<p>&nbsp;</p><div class="copyright_forprint">Copyright © 2013 保留版權所有 香港考試及評核局 <br>上次修改日期: ' + elem + '</div>');*/
        mywindow.document.write('</body>');
        mywindow.document.write('<script>$(".pager").hide(); function printpage(){  window.print();} </script>');
        mywindow.document.write('</html>');
        mywindow.focus();
    } else {
        alert('Not support in this page.');
    }
    return true;
}