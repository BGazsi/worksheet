const MAX_ITEM = 4;

let collection = function () {
    $('[data-component~="new-collection"]').on('click', function () {
        let collections = $('[data-component~="collection"]');

        if (collections.length < MAX_ITEM) {
            $(collections[0]).clone().appendTo($('[data-component~="collection-wrapper"]')).find('input').val('');
        } else {
            alert('A megrendeléshez nem tölthet fel több tételt!');
        }
    });

    $('[data-component~="new-order-form"]').submit(function () {
        $(this).find('[data-component~="collection"]').each(function (i, component) {
            $(component).find("input[name*='IDX']").each(function (j, input) {
                $(input).attr("name", $(input).attr("name").replace("IDX", i));
                $(input).attr("id", $(input).attr("id").replace("IDX", i));
            });
        });
    });
};

collection();
