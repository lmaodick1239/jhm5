//var kanhan_engine = "sc1.hkeaa.edu.hk/TuniS/";

$(document).ready(function () {
    $("#skiptocontent").click(function () {
        $('#main_content').attr('tabIndex', -1).focus();
    });
    $("#skiptonav").click(function () {
        $('#navigation').attr('tabIndex', -1).focus();
    });

    $(document).on("click", ":focus", function () {
        console.log(this.id);
    });

    // Mobile Menu
	/*$('.mobile.icon-nav img').click(function () {
		$('.nav').addClass('active')
	})
	$('.nav').click(function () {
		$('.nav').removeClass('active')
	})
	$('.btn-close').click(function () {
		$('.nav').removeClass('active')
	})
	$('.nav ul').click(function (event) {
		event.stopPropagation();
	})*/

    var patt = new RegExp("(http|https):\\\/\\\/(" + kanhan_engine + ")?([a-z0-9.]*hkeaa.edu.hk){1}\\\/(mobile\\\/)?(en|tc|sc){1}\\\/[a-zA-Z\/_]*(.html)?(\\?[A-Z]?[0-9]{1}(&[0-9](&[0-9](_[0-9])?)?)?)?");
    var patt1 = new RegExp("(http|https):\\\/\\\/(" + kanhan_engine + ")?([a-z0-9.-]*(hkeaa.local|cannan.edu.hk)){1}\\\/(mobile\\\/)?(en|tc|sc){1}\\\/[a-zA-Z\/_]*(.html)?(\\?[A-Z]?[0-9]{1}(&[0-9](&[0-9](_[0-9])?)?)?)?");

    var url = location.href;
    var sc = 0;
    $('.nonsc').show();
    $('.yessc').hide();
    if (patt.test(url)) {
        $('#chtc').attr('href', url.replace(kanhan_engine, '').replace('/en/', '/tc/'));
        $('#chtc2').attr('href', url.replace(kanhan_engine, '').replace('/en/', '/tc/'));
        $('#chen').attr('href', url.replace(kanhan_engine, '').replace('/tc/', '/en/'));
        $('#chen2').attr('href', url.replace(kanhan_engine, '').replace('/tc/', '/en/'));
        $('#chsc').attr('href', 'https://' + kanhan_engine + url.replace('http://', '').replace('https://', '').replace('/en/', '/tc/'));
        $('#chsc2').attr('href', 'https://' + kanhan_engine + url.replace('http://', '').replace('https://', '').replace('/en/', '/tc/'));

        if (url.search(kanhan_engine) != -1) {
            $('#tcorsc').html('<span lang="zh-Hant">繁</span>');
            $('#tcorsc').attr("href", url.replace(kanhan_engine, ""));
            $('#tcorsc').attr("onclick", "gb('tc')");
            $('#tcorsc2').html('<span lang="zh-Hant">繁</span>');
            $('#tcorsc2').attr("href", url.replace(kanhan_engine, ""));
            $('#tcorsc2').attr("onclick", "gb('tc')");
            $('#html').attr("lang", "zh-Hans-HK");
            $('#html').attr("xml:lang", "zh-Hans-HK");
            sc = 1;
        } else {
            $('#tcorsc').html('<span lang="zh-Hans">簡</span>');
            $('#tcorsc').attr("href", 'https://' + kanhan_engine + url.replace('http://', '').replace('https://', '').replace('/en/', '/tc/'));
            $('#tcorsc').attr("onclick", "gb('sc')");
            $('#tcorsc2').html('<span lang="zh-Hans">簡</span>');
            $('#tcorsc2').attr("href", 'https://' + kanhan_engine + url.replace('http://', '').replace('https://', '').replace('/en/', '/tc/'));
            $('#tcorsc2').attr("onclick", "gb('sc')");
            //$('#html').attr("lang", "zh-Hans-HK");
            //$('#html').attr("xml:lang", "zh-Hans-HK");
        }
        //$("#moben").attr("href", url.replace('/en/', '/mobile/en/'));
        //$("#mobtc").attr("href", url.replace('/tc/', '/mobile/tc/'));
    }

    if (patt1.test(url)) {
        $('#chtc').attr('href', url.replace(kanhan_engine, '').replace('/en/', '/tc/'));
        $('#chtc2').attr('href', url.replace(kanhan_engine, '').replace('/en/', '/tc/'));
        $('#chen').attr('href', url.replace(kanhan_engine, '').replace('/tc/', '/en/'));
        $('#chen2').attr('href', url.replace(kanhan_engine, '').replace('/tc/', '/en/'));
        $('#chsc').attr('href', 'https://' + kanhan_engine + url.replace('http://', '').replace('https://', '').replace('/en/', '/tc/'));
        $('#chsc2').attr('href', 'https://' + kanhan_engine + url.replace('http://', '').replace('https://', '').replace('/en/', '/tc/'));
        if (url.search(kanhan_engine) != -1) {
            $('#tcorsc').html('<span lang="zh-Hant">繁</span>');
            $('#tcorsc').attr("href", url.replace(kanhan_engine, ""));
            $('#tcorsc').attr("onclick", "gb('tc')");
            $('#tcorsc2').html('<span lang="zh-Hant">繁</span>');
            $('#tcorsc2').attr("href", url.replace(kanhan_engine, ""));
            $('#tcorsc2').attr("onclick", "gb('tc')");
            sc = 1;
            //$('#html').attr("lang", "zh-Hans-HK");
            //$('#html').attr("xml:lang", "zh-Hans-HK");
        } else {
            $('#tcorsc').html('<span lang="zh-Hans">簡</span>');
            $('#tcorsc').attr("href", 'https://' + kanhan_engine + url.replace('http://', '').replace('https://', '').replace('/en/', '/tc/'));
            $('#tcorsc').attr("onclick", "gb('sc')");
            $('#tcorsc2').html('<span lang="zh-Hans">簡</span>');
            $('#tcorsc2').attr("href", 'https://' + kanhan_engine + url.replace('http://', '').replace('https://', '').replace('/en/', '/tc/'));
            $('#tcorsc2').attr("onclick", "gb('sc')");
        }
        //$("#moben").attr("href", url.replace('/en/', '/mobile/en/'));
        //$("#mobtc").attr("href", url.replace('/tc/', '/mobile/tc/'));
    }

    if (sc == 1) {
        $('.nonsc').hide();
        $('.yessc').show();
    }

    $('#q1').on('keypress', function (e) {
        if (e.which === 13) {
            gotoSearch1();
        }
    });

    $('#q2').on('keypress', function (e) {
        if (e.which === 13) {
            gotoSearch2();
        }
    });

});

function tabMainMenu(thismid, l) {
    console.log(thismid);
    HideMainMenu(l);
    //$('#' + thismid).css("z-index", "10000");
    $('#' + thismid).show();
    $('#' + thismid).css("opacity", "1");
}

function HideMainMenu(l) {
    //var hasFocus = $('#' + thismid).is(':focus');
    for (var i = 1; i <= l; i++) {
        $('#submenu' + i).hide();
    }
}