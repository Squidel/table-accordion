//change the data attributes for accordion to the data-bs attribute for the newer version of bootstrap
const accordionContainer = `<div class="accordion" id="accordionExample"></div>`; // change id
const accordionItem = `<div class="accordion-item"></div>`;
const accordionItemHeader = `<h4 class="accordion-header fs-1"><button class="accordion-button collapsed" type="button" data-toggle="collapse" aria-expanded="true"></button></h4>`; // add this to button -data-bs-target
const accordionItemBody = `<div id="tempId" class="accordion-collapse collapse table-accordion-body" aria-labelledBy="headingOne"><div class="accordion-body"></div></div>`; //change parent id -- add to html()

const containers = `<div class="obj-container"><div class="accordion-container"></div></div>`;
const itemBodyIdBase = "item-body";
let isMobile = false;
function checkScreenSize(parentEl) {
    var windowWidth = $(window).width();
    if (windowWidth <= 1200) {
        getBootStrapTables(parentEl);
    }
}
$(document).ready(function () {
    console.log("table-accordion load");
    hideEmptyFooterColumns();
    checkScreenSize(document.body);
    //$(window).on("resize", function () {
    //    checkScreenSize(document.body);

    //});

});
$(document.body).on('load-success.bs.table', function () {
    checkScreenSize();
});
$(document.body).on('post-body.bs.table', function (e) {
    let tableId = $(e.target).attr('id');
    //if (tableId === 'activitiesTable') {
    //    let objContainer = $(`#${tableId}`).siblings('.obj-container');
    //    if (objContainer.length === 0) {
    //        checkScreenSize();
    //    }
    //} else {
    //    checkScreenSize();
    //}
    checkScreenSize();

})
$(document.body).on('hide.bs.modal', function () {
    checkTable(document.body);
})
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {

    var contentId = $(e.target).attr('href');

    if (contentId) {
        checkTable(contentId);
    }
});
function checkTable(contentId) {
    var content = $(contentId);
    var table = $(content).find('table');
    if (table.length !== 0) {
        checkScreenSize($(content));
    } else {
        setTimeout(function () {
            checkTable(contentId);
        }, 1000);
    }
}

function getBootStrapTables(parentEl) {
    $('.obj-container').remove();
    var tables = null;
    if (parentEl) {
        tables = $(parentEl).find("table");
    } else {
        tables = $("table");
    }

    $.each(tables, function (key, value) {
        let tableClass = $(value).hasClass("table");
        //var parent = $(value).parents('.table-responsive'); // table parent
        //var objContainer = $(parent[0]).find('.obj-container');
        //if (objContainer.length === 0) {
        //    $(parent[0]).after(containers);
        //}
        if (tableClass) {
            $(value).hide();
            $(".fixed-table-pagination").hide();
            $(".fixed-table-toolbar > .btn-group").hide();
            $(".fixed-table-loading").hide();
            let accordionId = `accordionId-${$(value).attr("id")}-${key}`;
            createAccordionBasedOnTable(value, accordionId);

        }
    });
}

function createAccordionBasedOnTable(bootstrapTableEl, accordionId) {
    var parentElement = $(bootstrapTableEl).parents('.table-responsive'); // table parent
    var trows = $(bootstrapTableEl).find('tr');
    let prevButton = null;
    let moreButton = null;

    if (trows.length > 1) {
        var hd = trows.splice(0, 1);
        var theaders = $(hd).find('th');
        var columnObj = $(bootstrapTableEl).bootstrapTable("getVisibleColumns");
        //console.log('columnObj: ', columnObj);
        var columns = [];
        columns = columnObj.map((item, index) => {
            return item.field;
        });

        //console.log('columns: ', columns);
        //$(".accordion-container").empty();
        let accordionCont = $(accordionContainer);
        $(accordionCont).prop("id", accordionId);
        let buttons = { prevButton, moreButton };

        var options = {
            unfiltered: true,
            includeHiddenRows: false,
            useCurrentPage: true,
        };

        var rows = $(bootstrapTableEl).bootstrapTable("getData", options);
        // console.log('row data: ', rows);
        if (columns.length > 0) {
            buttons = createAccordionFromBootrapTable(bootstrapTableEl, accordionId, rows, accordionCont, trows, columnObj);
        }
        else {

            buttons = createAccordionFromRegularTable(accordionId, trows, theaders, accordionCont)
        }

        appendAccordion(bootstrapTableEl, accordionCont, buttons);

    } else {
        ////console.log('table was empty')
    }

}

$(document.body).on("click", "#load-next", function () {
    var select = "#" + $(this).val();
    $(select).bootstrapTable("nextPage");
});
$(document.body).on("click", "#load-prev", function () {
    var select = "#" + $(this).val();
    $(select).bootstrapTable("prevPage");
});

function isElement(html) {
    // Check if the html string is a valid HTML element
    var element = $('<div>').append(html);
    //console.log('checking el: ', $(element).children())
    var children = $(element).children();
    var isBR = children.toArray().some((item) => { return item.tagName === "BR" });
    //console.log('are any elements br: ', isBR)
    if ($(element).children()[0] && !isBR) {
        return true;
    } else {
        return false;
    }
}
function returnElement(html) {
    var element = $('<div>').append(html);
    //console.log('checking el: ', $(element).children())
    var children = $(element).children();
    var isBR = children.toArray().some((item) => { return item.tagName === "BR" });
    //let allInputs = $(children).find('input');
    //if (allInputs && allInputs.length > 0) {
    //    $.each(allInputs, function (key, value) {
    //        let inputValu = $(value).val();
    //        console.log('input value: ', $(value), $(value).val());
    //    })
    //}
    //console.log('are any elements br: ', isBR)
    if ($(element).children()[0] && !isBR) {
        return element;
    } else {
        return false;
    }
}
function getUrlParameter(url, sParam) {
    var params = {};
    var queryString = url.substring(1);
    var urlSegments = queryString.split('?');
    queryString = urlSegments[1];
    var paramPairs = queryString.split('&');
    for (var i = 0; i < paramPairs.length; i++) {
        var paramPair = paramPairs[i].split('=');
        var paramName = paramPair[0];
        var paramValue = paramPair[1];
        params[paramName] = paramValue;
    }
    return params[sParam] ? params[sParam] : false;
};
$(document.body).on('focus', '.dynamic-element', function (e) {
    //console.log('el focused');
    e.preventDefault();
    let itemBody = $(e.target).parents('.accordion-collapse')[0];
    //console.log('this is the accordion body: ', itemBody);
    $(itemBody).addClass('in');
});
$(document.body).on('change', '.dynamic-element', function (e) {
    e.preventDefault();
    //console.log('testing if accordion closes when el is changed');
    var input = $(this).find('input')[0];

    //console.log('testing this thing: ', $(this).data("func"))
    //console.log('can func be in attr: ', $(this).attr("data-func"))
    let row = $(this).data("row-value");
    let index = $(this).data("row-index");
    let oldVal = $(this).data("old-val");
    //console.log('old value: ', oldVal);
    //console.log('row value: ', $(input).val());
    //console.log('function called: ', $(this).data("func")[$(this).attr("data-func")]);
    $(this).data("func")[$(this).attr("data-func")].call(input, {}, oldVal, row, index);
    $(this).data('old-val', $(input).val());
})
$(document.body).on('click', '.select-row', function (e) {
    //let allRadio = $('.accordion-container').find("input[type='radio']");
    //console.log('radio buttons: ', allRadio);
    //$.each(allRadio, function (key, value) {
    //    if ($(value).attr('id') !== $(e.target).attr('id')) {
    //        $(value).prop('checked', false);
    //    }
        
    //});
    //console.log('checkbox changed: ', e.target);
    //console.log('is checked: ', $(e.target).is(':checked'))
    let rowIndex = $(e.target).val();
    let tableId = $(e.target).data('table');
    if ($(e.target).is(':checked')) {
        $(`#${tableId}`).bootstrapTable('check', rowIndex);
    } else {
        $(`#${tableId}`).bootstrapTable('uncheck', rowIndex);
    }
    
    //console.log('table id: ', tableId);
    //let rows = $(`#${tableId}`).find('tr');
    //let relRow = $(`#${tableId}`).find(`[data-index='${rowIndex}']`);
    //console.log('relevant row: ', relRow);
    //let rowValue = $(e.target).data('rowValue')
    //rowValue.select = $(e.target).is(':checked');
    //$.each(relRow, function (key, value) {
    //    console.log('value: ', value)
    //    if (value.nodeName === 'TR') {
    //        console.log('this row: ', $(value))
    //        $(value).trigger('click');
    //    }
    //    if (value.nodeName === 'TR') {
    //        if ($(e.target).is(':checked')) {
    //            $(value).addClass('selected');
    //        } else {
    //            $(value).removeClass('selected');
    //        }
    //    } else if (value.nodeName === 'INPUT') {
    //        $(value).trigger('click');
    //        $(value).prop('checked', $(e.target).is(':checked'));
    //        console.log('input value checked: ', $(value).prop('checked'));
    //    }
    //});
    //console.log('selected: ',$(`#${tableId}`).bootstrapTable('getAllSelections'))
    //if ($(e.target).is(':checked')) {
    //    $(row).addClass('selected');
    //} else {
    //    $(row).removeClass('selected');
    //}
})
function getPrevValue(element) {
    let prevVal = $(element).val();
    if (!prevVal) {
        let inputEl = $(element).find('input');
        prevVal = $(inputEl).val();
    }
    return prevVal;
}

function appendAccordion(bootstrapTableEl, accordionCont, buttons) {
    const parentElement = $(bootstrapTableEl).parents('.table-responsive');
    var objContainer = $(bootstrapTableEl).siblings('.obj-container');
    if (objContainer.length === 0) {
        $(bootstrapTableEl).after(containers)
        var new_accordion = $(parentElement).find(".accordion-container")[0];
        $(new_accordion).append(accordionCont);
    } else {
        var existingObj = $(objContainer).find(".accordion-container")[0];
        $(existingObj[0]).html(accordionCont);
    }
    var doesButtonExist = $($(parentElement).siblings(".obj-container")).find("#load-next").length > 0;
    var hasContent = $(accordionCont).find('.accordion-item').length > 0;
    if (!doesButtonExist && hasContent) {
        $($(bootstrapTableEl).siblings('.obj-container')).append(buttons.prevButton);
        $($(bootstrapTableEl).siblings('.obj-container')).append(buttons.moreButton);
    }
}

function createAccordionFromBootrapTable(bootstrapTableEl, accordionId, rows, accordionCont, trows, columnObj) {
    console.log('create from bootstrap: ', bootstrapTableEl);
    var colOptions = $(bootstrapTableEl).bootstrapTable('getOptions');
    //console.log('options: ', colOptions, colOptions.clickToSelect);
    let clickToSelect = colOptions.clickToSelect;
    var columns = [];
    columns = columnObj.map((item, index) => {
        return item.field;
    });
    console.log('columns: ', columns);
    var allEvents = $._data(bootstrapTableEl)["events"];
    //console.log('all events: ', $(bootstrapTableEl));
    var events = allEvents ? allEvents["click-row"] : null;
    //var isClickRow = events[0].type === "click-row";
    //console.log($(bootstrapTableEl).attr('id')+" event: ", events);
    //console.log("click row: ", isClickRow);
    $.each(rows, function (key, value) {
        //console.log('row value: ', value);
        //console.log('columns: ', columns);
        var tableRow = trows[key];
        //console.log("data? : ", $._data(tableRow))
        //console.log('current row: ', $(tableRow));

        let itemBodyId = `${itemBodyIdBase}-${$(bootstrapTableEl).attr("id")}-${key}`;
        //console.log('item body id: ', itemBodyId);
        let item = $(accordionItem);

        let itemBody = $(accordionItemBody);
        let container = "#" + accordionId;
        $(itemBody).attr("data-parent", container);
        $(itemBody).prop("id", itemBodyId);

        let alternating = key % 2 === 0 ? "acc-alt-bg" : "acc-bg";
        let itemHeader = $(accordionItemHeader);
        var headerButton = $(itemHeader).find("button")[0];
        let target = "#" + itemBodyId;
        $(headerButton).attr("data-target", target);
        $(headerButton).addClass(alternating);
        //console.log('first text value from row: ', getFirstTextFromRow(value, columns));
        var firstText = null;
        //Supervision Contracts Start
        let supervisionContracts = document.getElementById("supervisionContracts");
        if (supervisionContracts) {
            firstText = supervisionContracts_FirstText(value, columns);
        }
        //Supervision Contracts End
        else if (!$.isArray(value)) {
            firstText = getFirstTextFromRow(value, columns);
        } else {
            firstText = getFirstTextFromRow(value[0], columns); //value[0][columns[0]];
        }
        $(headerButton).html(firstText); // unique header


        let keys = Object.keys(value);
        let htmlBody = $("<div class='acc-cont'/>");
        var guid = $(tableRow).data("uniqueid");
        //console.log('row id: ', guid);
        if (guid) {
            $(htmlBody).append($(`<p class='table-accordion-hidden'>${guid}</p>`));
        }
        let rowIndex = $(tableRow).data("index");
        var eventAnchor = $("<a/>", {
            href: '#',
            name: 'bs-event-action',
            id: `custom-${$(bootstrapTableEl).attr('id')}-${rowIndex}`,
            html: 'Manage',
            click: function (e) {
                var test = $(tableRow).trigger('click-row.bs.table', [value, tableRow]);
            }
        });
        var actionP = $("<p/>", {
            class: `${events ? 'table-accordion-content-action' : 'triggered-event-none'}`
        });
        $(actionP).append(eventAnchor);
        $.each(columns, function (valKey, valValue) {
            //console.log('keys and value: ', keys, valValue);
            if (keys.indexOf(valValue) !== -1) {
                //console.log('exists in data and column: ', valValue);
                var columnTitleItem = columnObj.filter((item, index) => {
                    if (item.field == valValue) {
                        return item;
                    }
                });

                if (columnTitleItem[0].formatter) {
                    //console.log('about to check: ', columnTitleItem[0]);
                    //console.log('about to check event: ', columnTitleItem[0].events)
                    //console.log('about to check event: ', Object.keys(columnTitleItem[0].events)[0])
                    //console.log(columnTitleItem[0].title + " : " + value[valValue]);
                    //console.log('formatted: ', columnTitleItem[0].formatter({}, value, key))
                    //console.log('input value: ', value[valValue]);
                    var formattedCell = columnTitleItem[0].formatter(value[valValue], value, key);
                    //console.log('formatted cell: ', $(formattedCell));
                    //console.log('formatted cell value: ', getPrevValue($(formattedCell)));
                    //$('.panel-footer').append(formattedCell);
                    //var evObj = Object.keys(columnTitleItem[0].events)[0].split(' ');
                    var sumn = $("<p/>", {
                        text: `${columnTitleItem[0].title} : `,
                        class: 'dynamic-element'
                    })
                    if (columnTitleItem[0].events) {
                        $(sumn).data("row-value", value);
                        $(sumn).data('row-index', rowIndex);
                        $(sumn).attr("data-func", Object.keys(columnTitleItem[0].events)[0]);
                        $(sumn).data("func", columnTitleItem[0].events);
                    }
                    $(sumn).data("old-val", getPrevValue($(formattedCell)));
                    $(sumn).append(formattedCell);
                    $(htmlBody).append(sumn);
                } else {
                    if (!value[valValue]) {
                        if (clickToSelect) {
                            var sumn = $("<p/>", {
                                class: 'table-accordion-content-action'
                            });
                            let checkbox = $('<input />', { type: 'checkbox', id: `cb-${valKey}-${key}`, value: $(tableRow).data('index'), class: 'select-row' });
                            $(checkbox).data('table', $(bootstrapTableEl).attr('id'));
                            $(checkbox).data('rowValue', value);
                            $(sumn).append(checkbox);
                            $(htmlBody).append(sumn);
                        }
                    } else {
                        $(htmlBody).append($("<p class='table-accordion-content'>" + columnTitleItem[0].title + " : " + value[valValue] + "</p>"));
                    }
                }

            } else if (valValue.split('.').length > 1) {
                //console.log('does not exists in data and column: ', valValue);
                var subs = valValue.split('.');
                let cellVal = value[subs[0]][subs[1]];
                //console.log('cell value when column has . ', cellVal);
            }
            else {
                //console.log('column value when does not exist and not split: ', valValue);
                var unfoundCell = $(tableRow).find('td')[valKey];
                var columnName = $(bootstrapTableEl).find('th')[$(unfoundCell).index()];
                //console.log('unfoundCell: ', unfoundCell);
                //console.log("cell index: ", $(unfoundCell).index());
                //console.log("column name: ", columnName);
                if (isElement($(unfoundCell).html())) {
                    var inner = $(unfoundCell).html();
                    if ($(inner).is(":button") || $(inner).is("a") || $(inner).is(":radio") || $(inner).is("textarea")) {
                        $(htmlBody).append($("<p class='table-accordion-content-action'>" + $(unfoundCell).html() + "</p>"));
                    } else {
                        //console.log('element is not reg action')
                        $(htmlBody).append($("<p class='table-accordion-content'>" + $(columnName).data("field") + " : " + $(unfoundCell).html() + "</p>"));
                    }
                } else {
                    $(htmlBody).append($("<p class='table-accordion-content'>" + $(columnName).data("field") + " : " + $(unfoundCell).html() + "</p>"));
                }

            }

        });
        $($(itemBody).find(".accordion-body")).html(htmlBody); //unique body
        $($(itemBody).find(".accordion-body")).append(actionP)
        $(item).append(itemHeader);
        $(item).append(itemBody);

        $(accordionCont).append(item);
    });

    moreButton = $(
        '<button id="load-next" value=' +
        $(bootstrapTableEl).attr("id") +
        ">Next</button>"
    );
    prevButton = $(
        '<button id="load-prev" value=' +
        $(bootstrapTableEl).attr("id") +
        ">Prev</button>"
    );


    let accordion = { prevButton, moreButton };
    return accordion;
}

function createAccordionFromRegularTable(accordionId, trows, theaders, accordionCont) {
   // console.log('create from reg: ', accordionId)
    $.each(trows, function (key, valueEl) {
        let itemBodyId = `${itemBodyIdBase}-${accordionId}-${key}`;
        let item = $(accordionItem);

        let itemBody = $(accordionItemBody);
        let container = "#" + accordionId;
        $(itemBody).attr("data-parent", container);
        $(itemBody).prop("id", itemBodyId);

        let alternating = key % 2 === 0 ? "acc-alt-bg" : "acc-bg";
        let itemHeader = $(accordionItemHeader);
        var headerButton = $(itemHeader).find("button")[0];
        let target = "#" + itemBodyId;
        $(headerButton).attr("data-target", target);
        $(headerButton).addClass(alternating);

        let htmlBody = $("<div class='acc-cont'/>");
        var cells = $(valueEl).find('td');

        var labels = $(cells).filter(() => {
            return $(this).text().length > 0;
        })
        var firstVal = getFirstTextFromTD(labels);
        $(headerButton).html(firstVal);
        $.each(cells, function (cellKey, cellValue) {
            var columnName = $(theaders[cellKey]).text();
            var columnValue = $(cellValue).html();
            returnedEle = returnElement(columnValue);
            //console.log('returned element: ', returnedEle);
            let getDivText = $(returnedEle).text() ? $(returnedEle).text().replace(/^\s+|\s+|\$/g, ''):'';
            if (getDivText) {
                columnValue = getDivText;
            } else {
                columnValue = $($(returnedEle).clone()).children()[0] ? $($(returnedEle).clone()).children()[0] : columnValue;
            }
           // console.log('column value: ', columnValue);
            if (!isElement(columnValue)) {
                if (columnValue) {
                    $(htmlBody).append($("<p class='table-accordion-content'>" + columnName + " : " + columnValue + "</p>"));
                }
            } else {       
                //console.log('column value: ', $(columnValue));
                //console.log('col value: ', $($(returnedEle).children()[0]));
                // if ($(columnValue).is(":button") || $(columnValue).is("a") || $(columnValue).is("textarea") || $(columnValue).is("span") || $(columnValue).is(":radio") || $(columnValue).is("input")) {
                if ($(columnValue).hasClass('empty-cell')) {
                    returnedEle = 'Desktop View Only';
                }
                var accBodyEl = $("<p/>", { class: 'table-accordion-content-action', text: `${columnName} : `})
                    $(accBodyEl).append(returnedEle);
                    //htmlBody += "<p class='table-accordion-content-action'>" + returnElement(columnValue) + "</p>";
                    $(htmlBody).append(accBodyEl);
                //}
            }
        })


        $($(itemBody).find("div")).html(htmlBody); //unique body

        $(item).append(itemHeader);
        $(item).append(itemBody);
        $(accordionCont).append(item);
    })
    var defNext = $(".PagedList-skipToNext")[0];
    var anchor = $(defNext).find("a")[0];
    if (anchor) {
        //console.log('next anchor: ', anchor)
        var nextUrl = "";
        let page = "";
        if (defNext && anchor) {
            nextUrl = $(anchor).attr("href")
            page = getUrlParameter(nextUrl, "page");
        }
        let prevPage = (page - 2) > 0 ? (page - 2) : null;
        let prevUrl = '';
        prevButton = $(`<a id="load-prev" href="" rel="prev" disabled="disabled">Prev</a>`);
        if (prevPage) {
            prevUrl = nextUrl.replace(`page=${page}`, `page=${prevPage}`);

            prevButton = $(`<a id="load-prev" href="${prevUrl}" rel="next">Prev</a>`);
        } else {
            prevButton = $(`<a id="load-prev" href="" rel="prev" disabled="disabled">Prev</a>`);
        }
        moreButton = $(`<a id="load-next" href="${nextUrl}" rel="next">Next</a>`);

        return { prevButton, moreButton };
    } else {
        return true;
    }
}
function getFirstTextFromRow(row, columns) {
    //console.log('row and column: ', row, columns);
    var firstText = null;
    $.each(columns, function (key, value) {
        //console.log('each col item: ', value);
        let val = row[value];
        //console.log('column and value: ', value, val)
        if (val && !$.isNumeric(val)) {
            //console.log('first non-numeric: ', val, value, typeof val);
            if (typeof val === 'object') {
                //console.log('invitation? ', row.Invitation.InvitationId);
                let valName = row.Invitation ? row.Invitation.InvitationDesc : (val.FullName ? val.FullName : (val.LastName ? val.LastName : ''));
                firstText = valName;
            } else {
                firstText = val;
            }
            return false;
        }
    })
    
    //console.log('first text: ', firstText);
    return firstText;
}

function supervisionContracts_FirstText(row, columns) {
    //console.log('row and column: ', row, columns);
    var firstText = null;
    $.each(columns, function (key, value) {
        //console.log('each col item: ', value);
        let val = row[value];
        //console.log('column and value: ', value, val)
        if (val && !$.isNumeric(val)) {
            //console.log('first non-numeric: ', val, value, typeof val);
            if (typeof val === 'object') {
                //console.log('invitation? ', row.Invitation.InvitationId);
                let valName = row.Invitation ? row.Invitation.InvitationDesc : (val.FullName ? val.FullName : (val.LastName ? val.LastName : ''));
                firstText = valName;
            } else {
                firstText = val + " : " + row.ContractDescription + " : " + row.Contractor;
            }

            return false;
        }
    })
    return firstText;
}

function getFirstTextFromTD(tds) {
    let firstText = null;
    $.each(tds, function (key, value) {
        let val = $(value).text();
        val = val ? val.replace(/\n/g, ' ') : '';
        let emptyString = val ? val.replace(/^\s+|\s+|\$/g, '') : '';
        if (val && emptyString && !$.isNumeric(val)) {
            firstText = val;
            return false;
        }
    });
    return firstText;
}
function hideEmptyFooterColumns() {
    let tableFooter = $('.fixed-table-footer')[0];
    //console.log('table footer: ', tableFooter)
    let thInners = $(tableFooter).find('.th-inner');
    //console.log('th inners: ', thInners, $(thInners));
    $.each(thInners, function (key, value) {
        let hasChildren = $(value).children().length > 0;
        //console.log('this inner: ', value, $(value).children(), hasChildren);
        let parent = $(value).parent();
        if (!hasChildren) {
            $(parent).addClass('empty-cell');
        }

    });
}

