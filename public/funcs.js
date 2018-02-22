function turnon(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
             //document.getElementById("demo").innerHTML = this.responseText;
            console.log(this.responseText);
        }
     }; 
    xhttp.open("POST", "/toggle", true);
    xhttp.send();
}
function update()
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4) {
            if(this.status == 200) {
                if(this.responseText == 1)
                {
                    document.getElementById("onbutton").innerHTML = "Turn Off";
                    document.getElementById("brewbutton").style.display = "none";
                }   
                else
                {
                    document.getElementById("onbutton").innerHTML = "Turn On";
                    document.getElementById("brewbutton").style.display = "inline";
                }
                //Send new poll on response (Long polling);
            }

            xhttp.open("POST", "/status", true);
            xhttp.send();
        }
     }; 
 
    //Send first long poll
    xhttp.open("POST", "/status", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({first: "true"}));
    

    //Constantly poll for status (Can I push status instead?)   
    //setInterval(() =>
    //{
    //    xhttp.open("POST", "/status", true);
    //    xhttp.send();
    //}, 100);
}
function brew(num_cups)
{
    //1 - 6 cups possible
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        console.log(this.responseText);
     }; 
    xhttp.open("POST", "/brew", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({number: num_cups}));
}
