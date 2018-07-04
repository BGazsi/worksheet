setTimeout(() => { console.log('ES2015 FTW') }, 1000)

$('[data-toggle="modal"]').click(function (event) {
    $('#' + $(this).attr('data-taget')).modal('show')
});