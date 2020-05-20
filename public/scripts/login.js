window.onload = initialize();


function initialize() {
    if (localStorage['Username'] != null) {
        window.location.replace('./index.html');
    }
}