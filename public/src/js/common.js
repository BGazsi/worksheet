setTimeout(() => { console.log('ES2015 FTW') }, 1000)

$('[data-toggle="modal"]').click(function (event) {
    $('#' + $(this).attr('data-target')).modal('show')
});

let gtmClick = function () {
    [...document.querySelectorAll('[data-component~="gtm-click"]')].map(element => {
        element.addEventListener('click', () => {
            try {
                dataLayer.push(JSON.parse(element.getAttribute('data-gtm-click-options')));
            } catch (e) {
                console.error(e);
            }
        })
    })
};

gtmClick();

