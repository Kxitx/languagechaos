function sidebar() {
    $(document).ready(function () {
            // open or close navbar
            $('#sidebar').toggleClass('active');
            $('#content').toggleClass('active');
            // close dropdowns
            $('.collapse.in').toggleClass('in');
            // and also adjust aria-expanded attributes we use for the open/closed arrows
            // in our CSS
            $('a[aria-expanded=true]').attr('aria-expanded', 'false');          
    });
}

$(document).ready(function () {

    $("#sidebar").mCustomScrollbar({
         theme: "minimal"
    });
});
