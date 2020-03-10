var btn = document.getElementById("getPh");
btn.addEventListener("click", GetPhoto);
var body = document.getElementsByTagName("div")[0];
/**
 * @return {string}
 */
var img;
function GetPhoto() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (!document.getElementById('content')) {
                img = document.createElement('div');
                img.id='content';
                body.appendChild(img);
            }
            img.innerHTML=this.responseText;
//            body.appendChild(this.responseText);
        }
    };
    xhttp.open("GET", "Request", true);
    xhttp.send();
}