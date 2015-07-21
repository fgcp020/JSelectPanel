/************************
 *
 *  jselectpanel by jwagra
 *  mailto:jwagra@yandex.ru
 *  v 17.07.2013
 *
 ************************/
(function($, document) {
    var defaultOptions = {
            width: null, // panel width, for example: "father", 300
            height: null, // panel height
            itemWidth: null, // item width
            itemHeight: null, // item height
            items: [], // items list, for example: [{ value: 1, title: '1'}]
            change: function(result) { return false; }, // change event callback
            changeTextItemId: null, // text container id
            changeTextDefaultValue: '', // default text container value
            additionalPanelClass: '', // additional css class for panel
            additionalItemClass: '', // additional css class for item,
            filter: false, // show list filter,
            filterBy: 'value', // filter by field: title | value
            filterEmptyText: '' // text in filter when it is empty
        },
        results = {},
        DOD = {},
        COUNT = 0,
        methods = {
            // initialize
            init: function(options) {
                var fatherId = $(this).attr('id'), panelId = getUniqueId('jselectpanel');
                DOD[fatherId] = $.extend({}, defaultOptions, options);
                var O = DOD[fatherId];
                results[fatherId] = { value: null, title: null };
                var result = results[fatherId];
                $(this) .clickOutside(function() { $('#'+ fatherId +' .jselectpanel').fadeOut(); })
                        .bind('click', function() { $(this).find('.jselectpanel:hidden').fadeIn(); })
                        .prepend('<div id="'+ panelId +'" class="jselectpanel">'+'</div>');
                var JSP = $('#'+ panelId);
                if (O.additionalPanelClass) JSP.addClass(O.additionalPanelClass);
                JSP.css('margin-top', $(this).height());
                if (O.height) JSP.css('height', O.height);
                if (O.width == 'father') JSP.css('width', $(this).width());
                else if (O.width > 0) JSP.css('width', O.width);
                if (O.filter) {
                    JSP.append('<div class="jselectpanel-filter-holder"></div>');
                    JSP.find('.jselectpanel-filter-holder').first().append('<input type="text" value="'+ O.filterEmptyText +'" class="jselectpanel-filter" id="'+ getUniqueId('jselectpanel-filter') +'" />');
                    var filter = $(this).find('.jselectpanel-filter').first();
                    filter.change(function(e) { $('#'+ fatherId).jselectpanel('filter', filter.val()); });
                    filter.keyup(function(e) { $('#'+ fatherId).jselectpanel('filter', filter.val()); });
                    filter.focusin(function() { if ($(this).val() == O.filterEmptyText) $(this).val(''); });
                    filter.focusout(function() { if ($(this).val() == '') $(this).val(O.filterEmptyText); });
                }
                $.each(O.items, function(k, v) {
                    var item = $('<div id="'+ getUniqueId('jselectpanel-item') +'" class="jselectpanel-item '+ O.additionalItemClass +'" father="'+ fatherId +'" value="'+ v.value +'">'+ v.title +'</div>');
                    if (O.itemWidth) item.css('width', O.itemWidth);
                    if (O.itemHeight) item.css('height', O.itemHeight);
                    if (result.value == v.value) item.addClass('selected');
                    JSP.append(item);
                });
                JSP.append('<div class="jselectpanel-clear"></div>');
                $(this).find('.jselectpanel-item').click(function(e) {
                    $(this).parent().find('.jselectpanel-item').removeClass('selected');
                    $(this).addClass('selected');
                    var oldValue = result.value;
                    results[fatherId] = { value: $(this).attr('value'), title: $(this).html() }; result = results[fatherId];
                    if ($(this).attr('value') != oldValue) O.change(result);
                    if (O.changeTextItemId) $('#'+ O.changeTextItemId).html(result.title);
                    JSP.fadeOut();
                });
            },
            // update panel items
            update: function(items, params) {
                var fatherId = $(this).attr('id'), O = DOD[fatherId],
                    JSP = $(this).find('.jselectpanel').first();
                O.items = items;
                var result = results[fatherId];
                if (!params || !params.doNotclearFilter) {
                    results[fatherId] = { value: null, title: null };
                    result = results[fatherId];
                    if (O.changeTextItemId && O.changeTextDefaultValue) $('#'+ O.changeTextItemId).html(O.changeTextDefaultValue);
                    $('#'+ fatherId).jselectpanel('clearFilter');
                }
                JSP.find('.jselectpanel-item').remove(); JSP.find('.jselectpanel-clear').remove(); JSP.find('.jselectpanel-html').remove();
                $.each(items, function(k, v) {
                    var item = $('<div id="'+ getUniqueId('jselectpanel-item') +'" class="jselectpanel-item '+ O.additionalItemClass +'" father="'+ fatherId +'" value="'+ v.value +'">'+ v.title +'</div>');
                    if (O.itemWidth) item.css('width', O.itemWidth);
                    if (O.itemHeight) item.css('height', O.itemHeight);
                    if (result.value == v.value) item.addClass('selected');
                    JSP.append(item);
                });
                JSP.append('<div class="jselectpanel-clear"></div>');
                $(this).find('.jselectpanel-item').click(function(e) {
                    $(this).parent().find('.jselectpanel-item').removeClass('selected');
                    $(this).addClass('selected');
                    var oldValue = result.value;
                    results[fatherId] = { value: $(this).attr('value'), title: $(this).html() }; result = results[fatherId];
                    if ($(this).attr('value') != oldValue) O.change(result);
                    if (O.changeTextItemId) $('#'+ O.changeTextItemId).html(result.title);
                    JSP.fadeOut();
                });
            },
            // get value
            getValue: function() { return results[$(this).attr('id')]; },
            // set value
            setValue: function(value, findBy) {
                var fatherId = $(this).attr('id'), O = DOD[fatherId],
                    res = false
                    items = $(this).find('.jselectpanel').first().find('.jselectpanel-item'),
                    result = results[fatherId];
                $('#'+ fatherId).jselectpanel('clearFilter');
                $.each(items, function(k, v) {
                    var item = $(v);
                    item.removeClass('selected');
                    if (jQuery.trim(!findBy || findBy == 'value' ? item.attr('value') : item.html()) == jQuery.trim(value)) {
                        item.addClass('selected');
                        var oldValue = result.value;
                        results[fatherId] = { value: item.attr('value'), title: item.html() }; result = results[fatherId];
                        if (O.changeTextItemId) $('#'+ O.changeTextItemId).html(item.html());
                        res = true;
                        if (value != oldValue) {
                            O.change(result);
                        }
                    }
                });
                return res;
            },
            // reset value to default value
            reset: function(value) {
                var fatherId = $(this).attr('id'), O = DOD[fatherId],
                    result = results[fatherId], oldValue = result.value;
                results[fatherId] = { value: null, title: null }; result = results[fatherId];
                if (O.changeTextItemId && O.changeTextDefaultValue) $('#'+ O.changeTextItemId).html(O.changeTextDefaultValue);
                $('#'+ fatherId).jselectpanel('clearFilter');
                if (null != oldValue) O.change(result);
            },
            // hide panel
            hide: function() { $(this).find('.jselectpanel').first().fadeOut(); },
            // show panel
            show: function() { $(this).find('.jselectpanel').first().fadeIn(); },
            // append html to panel
            appendHtml: function(html) { $(this).find('.jselectpanel').first().append('<div class="jselectpanel-html">'+ html +'</div>'); },
            // filter items list
            filter: function(value) {
                var fatherId = $(this).attr('id'), O = DOD[fatherId],
                    items = $(this).find('.jselectpanel-item');
                $.each(items, function(k, v) {
                    var item = $(v);
                    if (O.filterBy && value != O.filterEmptyText) {
                        var pattern = '^'+ jQuery.trim(value).toLowerCase() +'.*',
                            regexp = new RegExp(pattern);
                        if (!jQuery.trim(!O.filterBy || O.filterBy == 'value' ? item.attr('value') : item.html()).toLowerCase().match(regexp)) item.hide();
                        else item.show();
                    } else item.show();
                });
            },
            // clear items list filter
            clearFilter: function() {
                var O = DOD[$(this).attr('id')],
                    filter = $(this).find('.jselectpanel-filter').first();
                filter.val(O.filterEmptyText);
                filter.trigger('change');
            }
        };
    $.fn.jselectpanel = function(method) {
        if (methods[method]) return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        else if (typeof method === 'object' || !method) return methods.init.apply(this, arguments);
    };
    function getUniqueId(text) {
        COUNT++; return text +'-'+ COUNT;
    }
})(jQuery, document);
//////////////////////////////////////
(function($) {
    $.fn.hasParent = function(objs) {
        objs = $(objs);
        var found = false;
        $(this[0]).parents().andSelf().each(function() {
            if ($.inArray(this, objs) != -1) {
                found = true;
                return false;
            }
        });
        return found;
    }
    var objid = 0,
        expando = 'cOId';
    $.fn.clickOutside = function(fn, once) {
        once = (once) ? true : false;
        return $(this).each(function() {
            var id = this[expando];
            if (!id) id = this[expando] = ++objid;
            var obj = this;
            $(document).bind('click.'+ expando +'.'+ id, function(e) {
                if (!e) var e = window.event;
                if (!$(e.target).hasParent(obj)) {
                    if (once) $(document).unbind('click.'+ expando +'.'+ id);
                    fn.call(obj);
                }
            });
        });
    };
}(jQuery));
