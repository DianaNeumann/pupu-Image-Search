const Engines = ["yandex", "google", "tineye"];

function saveOptions(){
    let services = [];

    for(let i = 0; i < Engines.length; i++){
        if(document.getElementById(Engines[i]).checked){
            services.push(Engines[i]);
        }
    }

    if(services.length > 0){
        localStorage.services = services;

        let status = document.getElementById("status");
        status.innerHTML = "Сохранено.";
        setTimeout(function(){ status.innerHTML = ""}, 800);
        
        chrome.extension.sendRequest({action:"updateContextMenu"});
    }
    else{
        alert("Должен быть выбран как минимум один сервис.");
    }
}

function activateCheckboxes(){
    let myEngines = localStorage.services.split(",");

    for(let i = 0; i < Engines.length; i++){
        if(myEngines.includes(Engines[i])){
            document.getElementById(Engines[i]).checked = true;
        }
        else{
            document.getElementById(Engines[i]).checked = false;
        }
    }
}

function upgradeOptions() {
    if (localStorage.menutype){
      localStorage.removeItem("menutype");
      localStorage.services = Engines;
    }
    if (localStorage.service){
      localStorage.removeItem("service");
      localStorage.services = Engines;
    }
}

function initializeOptions() {
    if (localStorage.getItem("services") === null) {
      localStorage.services = Engines;
    }
}

function closeWindow() {
    window.close();
}

function initialize() {
    initializeOptions();
    upgradeOptions();
    activateCheckboxes();
    
    document.getElementById("save_button").addEventListener("click",saveOptions);
    
    if (document.getElementById("close_button")){
        document.getElementById("close_button").addEventListener("click",closeWindow);
    }
}
  
window.addEventListener("load", initialize);