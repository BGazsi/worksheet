setTimeout(() => { console.log('ES2015 FTW') }, 1000)

$('[data-toggle="modal"]').click(function (event) {
    $('#' + $(this).attr('data-target')).modal('show')
});

let gtmClick = function() {
    [...document.querySelectorAll('[data-component~="gtm-click"]')].map(element => {
        element.addEventListener('click', () => {
            dataLayer.push(element.getAttribute('data-gtm-click-options'));
        })
    })
};

gtmClick();

