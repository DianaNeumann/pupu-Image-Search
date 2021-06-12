const Engines_List = ['yandex', 'google', 'tineye'];

let services = {
    "all": ["All", "Искать везде", "", "image"],
    "yandex": ["Yandex", "Yandex Фото", "https://yandex.com/images/search?rpt=imageview&url=", "image"],
    "google": ["Google", "Google Фото", "https://www.google.com/searchbyimage?image_url=", "image"],
    "tineye": ["TinEye", "TinEye Search", "https://www.tineye.com/search/?url=", "image"]
};


// тут будут хранится id выбранных поисковиков 
let menus = {};


function upgradeOptions(){
    if(localStorage.menutype){
        localStorage.removeItem("munetype");
        localStorage.services = Engines_List;
    }
    if(localStorage.service){
        localStorage.removeItem("service");
        localStorage.services = Engines_List;
    }
}

function initializeOptions(){
    if(localStorage.getItem("services") === null){
        localStorage.services = Engines_List;
    }
}

function updateContextMenu(){
    chrome.contextMenus.removeAll();

    let myEngines = localStorage.services.split(',');
    if(myEngines.length > 1){
        create_submenu();
    } 
    else{
        create_single_submenu();
    }
}


function create_submenu(){
    // создание вкладки
    let rootMenu = chrome.contextMenus.create({
        "title": "Ну-ка поищем",
        "type": "normal",
        "contexts": ["image"]
    });

    let myEngines = localStorage.services.split(',');
    myEngines.unshift('all'); // добавляем в начало вариант "выбрать всё"

    // создание подвкладки
    for(let i=0; i < myEngines.length; i++){
        
        let subMenu = chrome.contextMenus.create({
            "title": services[myEngines[i]][1],
            "type": "normal",
            "contexts": services[myEngines[i]].slice(3), // = "image"
            "parentId": rootMenu,
            onclick: contextClick
        });

        
        
        menus[subMenu] = myEngines[i];
    }
}

// если выбран только один поисковый движок, то недобности в большом меню нет,
// сразу делаем поиск
function create_single_submenu(){
    let myEngines = localStorage.services.split(',');
    let service = services[myEngines[0]];
    
    let simpleMenu = chrome.contextMenus.create({
        "title": "Поищем в " + service[0],
        "type": "normal",
        "contexts": service.slice(3),
        onclick: contextClick  
    });
    menus[simpleMenu] = myEngines[0];
}


function contextClick(info, tab){
    console.log('contextClick');

    var query = info.pageUrl;
    if(info.mediaType == "image"){
        var query = info.srcUrl;
    }
    imageSearch(menus[info.menuItemId], query);
}


function imageSearch(service, query){
    let myEngines = localStorage.services.split(',');

    if(service == "all"){
        for(let i = 0; i < myEngines.length; i++){
            openService(myEngines[i], query);
        }
    } 
    else{
        openService(service, query);
    }
}

function openService(service, query){
    let url = services[service][2] + encodeURIComponent(query);
    
    chrome.tabs.create({
        "url": url,
        "selected": false // открывать окно с поиском в фоне, можно сделать возможность менять это в настройках 
    });
}


initializeOptions();
upgradeOptions();
updateContextMenu();

chrome.extension.onRequest.addListener(
    function(request){
        switch(request.action){
            case "updateContextMenu":
                updateContextMenu();
                break;
        }
});