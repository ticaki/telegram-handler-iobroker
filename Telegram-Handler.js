var telegramInstanz = 'telegram.0';

var inline_keyboard = false;
const backText = 'Zurück';
const cMenuTimeoutTime = 20*60*1000;

/* erklärungen zum Menu (messageObj) sind unterhalb der Konfiguration */


var messageObj = [
    {
        text: 'Menü',
        title: 'Menü',
        callback_data: 'Menu',
        submenu: [[
            {
                text: 'Warnungen',
                title: 'Warnungsmenü',
                submenu: [[{ text: 'Warnungen kurz', command: switchState, args:['javascript.0.wetterwarnung.commands.telegram_short'] },
                { text: 'Warnungen lang', command: switchState, args:['javascript.0.wetterwarnung.commands.telegram_long'] }],
                [{ text: 'Debug An', callback_data: 'DWDUZWNINA#!§$debugan', new_menu: true},
                { text: 'Debug Aus', callback_data: 'DWDUZWNINA#!§$debugaus', new_menu: true }],
                [{ text: 'Debug Email', callback_data: 'DWDUZWNINA#!§$DEBUGEMAIL', new_menu: true }]]

            }
        ], [
            {
                text: 'Benzinpreis',
                title: 'Auswahl der Sorte',
                submenu: [[{ text: 'Favorit Diesel', callback_data: '#+!4%2TankPreisDIESEL' }],
                [
                    {
                        text: 'E10',
                        title: 'Auswahl der Preisübersicht',
                        submenu: [[{ text: 'Bester Preis', callback_data: '#+!4%2TankPreisE10curr', new_menu: true }],
                        [{ text: 'Favorit Preisübersicht 7 Tage', callback_data: '#+!4%2TankPreisE107', new_menu: true }],
                        [{ text: 'Favorit Preisübersicht max/min', callback_data: '#+!4%2TankPreisE10', new_menu: true }]]
                    }
                    ,
                    {
                        text: 'Diesel',
                        title: 'Auswahl der Preisübersicht',
                        submenu: [[{ text: 'Bester Preis', callback_data: '#+!4%2TankPreisDIESELcurr', new_menu: true }],
                        [{ text: 'Favorit Preisübersicht 7 Tage', callback_data: '#+!4%2TankPreisDIESEL7', new_menu: true }],
                        [{ text: 'Favorit Preisübersicht max/min', callback_data: '#+!4%2TankPreisDIESEL', new_menu: true }]]
                    }
                    ,
                    {
                        text: 'E5',
                        title: 'Auswahl der Preisübersicht',
                        submenu: [[{ text: 'Bester Preis', callback_data: '#+!4%2TankPreisE5curr', new_menu: true }],
                        [{ text: 'Favorit Preisübersicht 7 Tage', callback_data: '#+!4%2TankPreisE57', new_menu: true }],
                        [{ text: 'Favorit Preisübersicht max/min', callback_data: '#+!4%2TankPreisE5', new_menu: true }]]
                    }
                ]]
            }
        ], [
            {
                text: 'Haus', title: 'Auswahl',submenu:
                [[
                    {
                        text: 'Sensoren', title: 'Auswahl der Sensoren',submenu:
                        [
                            [{ text: 'Temperaturübersicht', new_menu: true, command: getTemperatur, args:['state[role=value.temperature][state.id=linkeddevices.0.Haus.*](functions=temperatursensor)'] }],
                            [{ text: 'Luftfeuchtigkeitsübersicht', new_menu: true, command: getFeuchtigkeit, args:['state[state.id=linkeddevices.0.Haus.*][role=value.humidity](functions=luftfeuchtigkeit_sensor)'] }]
                        ]
                    }
                ], [
                    {
                        text: 'Batteriestand', title: 'Auswahl der Geräte',submenu:
                        [
                            [{ text: 'Sensoren', new_menu: true, command: getBatt, args:['Sensoren','channel[state.id=deconz.0.*.battery]',100] }]
                        ]
                    }
                ], [
                    {
                        text: 'Beleuchtung', title: 'Auswahl der Räume', command: getRoomsLightsSum, args:['state[role=switch](functions=beleuchtung)']
                    }
                ]]
            }
        ]]
    }
]

/* Konfigurationende */
//123456

/* Konfiguration des Menüs
Vorlage
{
    text: 'Angezeiger Text im Knopf',
    title: 'Verwendeter Nachrichtentext wenn dieser Knopf gedrückt wird.', // wird nur benötigt wenn ein neues Menü angezeigt wird
    callback_data: 'eine eindeutige ID', //optional, das Script erstellt selbstständig solche Ids
    submenu: [[]], // optional enthält die Vorlage [[Zeile1], [Zeile2]] oder [[Zeile1_Spalte1, Zeile1_Spalte2], [Zeile 2]]
    new_menu: true, // optional für inline_keyboard die letzte Nachricht wird nicht mit neuen Daten editiert.
    command: function, // optional vorhande oder selbsterstellte Funktion
    args: [], // optional bis zu 5 Argumente, die der Funktion übergeben werden.
}

Eingebaute Funktionen für command und args

command: switchState
Schalte einen Boolean Schalter um
args:['Objekt-ID']

command: getTemperatur, args:['state[role=value.temperature][state.id=linkeddevices.0.Haus.*](functions=temperatursensor)']
Gibt eine Liste von Raum + Temperatur zurück
args: ist der Stringanteil eines Selectors

command: getFeuchtigkeit, args:['state[state.id=linkeddevices.0.Haus.*][role=value.humidity](functions=luftfeuchtigkeit_sensor)'] }]
Gibt eine Liste von Raum + Luftfeuchtigkeit zurück
args: ist der Stringanteil eines Selectors

getBatt, args:['Sensoren','channel[state.id=deconz.0.*.battery]',100] }]
Gibt eine Liste von Batterieständen zurück mit common.name der übergeordneten Datenppunkte.
args: 1. Letztes Wort der Überschrift (Ladestand der Sensoren)
args: 2. ist der Stinganteil eines Selectors
args: 3. Nur Battererien mit niedrigerem Ladestand werden ausgegeben.

command: getRoomsLightsSum, args:['state[role=switch](functions=beleuchtung)']
Gibt eine Menu mit einer Liste der Räume zurück mit der Anzahl der Lampen in diesen und der Anzahl der angeschaltenen Lampen. (Wohnzimmer (1/5)).
dieses Menu ruft die Funktion getLightsOfRoom  auf.
args: ist der Stringanteil eines Selectors

command: getLightsOfRoom, args: [tRoom, selector, id = '', all = 0]
Gibt eine Liste von Lampen aus dem Raum tRoom (enum.common.name) zurück.
Lampen die Stats mit der Role level.brightness oder level.color.temperature enthalten, erhalten ein Detailfeld.
Abhängig von der Lampenanzahl und der Anzahl der angeschalteten Lampen wird "Alle an" oder "Alle aus" dem Menu hinzugefügt.
Diese Menu ruft sich selbst oder getDetailsOfLight
args: 1. der Raum als enum.common.name
args: 2. selector von getRoomsLightsSum
args: 3. optional, die ObjectId der Lampe deren Status mit switchState umgeschaltet wird
args: 4. optional, 0 = ignoriere diesen Parameter, 1 = schalte alle an, 2 = schalte alle aus.

command: getDetailsOfLight,  args:[id, setId=null, value=0]
Gibt ein Menü zurück mit Heller, Dunkler, Wärmer, Kälter zurück, mit dem die Lampe genau das tut. Ist für Deconz eingestellt.
Dieses Menü ruft sich selbst auf.
args: 1. Die ID zu einem der Datenpunkte der Lampe.
args: 2. optional, der Datenpunkt der verändert wird
args: 3. optional, der Wert der dem Datenpunkt 2. hinzuaddiert wird

*/

var arrHeader = []; // {"Header":"", "result":,"sub":null,"cmd":,"text":""}
var menuArr = [];
var callbackCounter = 1400020000;
var sameMenu=true;
var currentMessage = '';
var lastMessage = '';
var temporaeresMenuArray = [];
var oldMessageID = []
var lastMenu = [];
var timeoutSameMenu = null;

setCallbackData(messageObj);
fillMenuArray(messageObj);

function fillMenuArray(objitem, parent_data='') {
    objitem.forEach((item, i) => {
        if (Array.isArray(item)) {
            fillMenuArray(item, parent_data);
            // zurück hier gibt es nichts zu tun.
            return;
        }
        var o = {};
        o.parent_data = parent_data;
        o.callback_data = item.callback_data;
        if (item.new_menu !== undefined) o.new_menu = true;
        if (item.command !== undefined) {
            o.command = item.command;
            o.args = item.args;
        }
        if (item.submenu !== undefined) {
            o.title = item.title;
            o.menu = getMenu(item.submenu, []);
            menuArr.push(o);
            fillMenuArray(item.submenu, item.callback_data);
            return;
        }
        menuArr.push(o);
        function getMenu(bitem, obj) {
            bitem.forEach((item, i) => {
                if (Array.isArray(item)) obj.push(getMenu(item, []));
                else {
                    var arr = {};
                    arr.text = item.text;
                    arr.callback_data = item.callback_data;
                    obj.push(arr);
                }
            });
            return obj;
        }
    });
}

function setCallbackData(mobj) {
    mobj.forEach((item, i) => {
        if (Array.isArray(item)) setCallbackData(item);
        else if (item.callback_data === undefined) item.callback_data = '§4%&#<ß<' + callbackCounter++;
        if (item.submenu !== undefined) setCallbackData(item.submenu);
        if (item.command !== undefined && item.args === undefined) item.args = [];
    });
}

on ({id: telegramInstanz + '.communicate.botSendMessageId', change:'ne'}, (obj) =>
{
    if (oldMessageID.length === 0 || oldMessageID.indexOf(obj.state.val) == -1) {
        oldMessageID.push(obj.state.val);
    }
    while (oldMessageID.length > 2) {
        let id = oldMessageID[0];
        oldMessageID.shift();
        sendTo('telegram', {
            //user: user,
            deleteMessage: {
                options: {
                    chat_id: getState(telegramInstanz + ".communicate.requestChatId").val,
                    message_id: id
                }
            }
        });
    }
})

on({ id: telegramInstanz + '.communicate.request', change: "any", ack: false }, (obj)=> {setTimeout(mainTrigger, 2, obj);});

const mainTrigger = async function (obj) {
    //var chatid = getState(telegramInstanz + '.communicate.requestChatId').val;
    //var users = JSON.parse(getState(telegramInstanz + '.communicate.users').val);
    var msg = obj.state.val;
    var user = msg.substring(1, msg.indexOf(']'));
    msg = msg.substring(msg.indexOf(']') + 1);
    if (lastMenu.length > 0 && lastMenu.findIndex((a)=>{return a.text === msg}) != -1) {
        sendTo('telegram', {
            //user: user,
            deleteMessage: {
                options: {
                    chat_id: getState(telegramInstanz + ".communicate.requestChatId").val,
                    message_id: getState(telegramInstanz + ".communicate.requestMessageId").val
                }
            }
        });
        let i = lastMenu.findIndex((a)=>{return a.text === msg});
        msg = '['+user+']'+lastMenu[i].callback_data;
        //lastMenu = [];
        return setState(telegramInstanz + '.communicate.request', msg);
    }
    lastMessage = currentMessage;
    let currMenu = [];
    currMenu = currMenu.concat(menuArr);
    currMenu = currMenu.concat(temporaeresMenuArray);
    currentMessage = msg;
    let a = currMenu.findIndex((a) => { return a.callback_data === currentMessage; });
    if (a == -1) {
        if (inline_keyboard) sendTo(telegramInstanz, { user: user, answerCallbackQuery: { text: 'Error #1', showAlert: false } });
        log('#1 Dont find callback_data in menuArr. ' + msg, 'warn');

        return;
    }
    if (a < menuArr.length) temporaeresMenuArray = [];

    let m = currMenu[a]; m.user = user;
    if (m.command !== undefined) {
        const result = await doCmd(m);
        if (result) {
            if (typeof result !== 'object') {
                m.title = result;
                _sendMessage(m, sameMenu, false);
            } else {
                if ( result.title !== undefined ) m.title = result.title;
                if ( result.submenu !== undefined ) m.menu = result.submenu;
                if ( result.text !== undefined ) m.text = result.text;
                if ( result.callback_data !== undefined ) m.callback_data = result.callback_data;
                _sendMessage(m, sameMenu);
            }
        } else {
            if ( inline_keyboard ) sendTo(telegramInstanz, { user: m.user, answerCallbackQuery: { text: 'done', showAlert: false } });
        }
    } else {
        if (m.menu !== undefined) _sendMessage(m, sameMenu);
        else log('dont find callback_data maybe external script:' + msg,'info');
    }
    sameMenu = m.new_menu === undefined ? true : false;
    if (timeoutSameMenu) clearTimeout(timeoutSameMenu);
    timeoutSameMenu = setTimeout(()=>{ sameMenu = false; }, 20*60*1000);
}

function _sendMessage(m, edit=true, kb = true) {
    let newmsg = {};
    if ( inline_keyboard ) sendTo(telegramInstanz, { user: m.user, answerCallbackQuery: { text: m.text, showAlert: false } });
    newmsg.user = m.user;
    newmsg.text = m.title;
    newmsg.disable_notification = true;
    //newmsg.parse_mode = 'Markdown';
    let menu = [];
    if ( m.menu !== undefined) {
        menu = m.menu.slice();
    }
    if (m.parent_data !== undefined && m.parent_data) {
        menu.push([{text: backText, callback_data:m.parent_data}]);
        // Zurückfunktion immer zur Verfügungstellen
        lastMenu = [[{text: backText, callback_data:m.parent_data}]];
    };
    if (!edit || !inline_keyboard) {
        if ( menu.length ) {
            if ( !inline_keyboard) {
                // Zurückfunktion wieder löschen, ist ja in menu enthalten.
                lastMenu = [];
                let newMenu = [];
                menu.forEach((a)=>{
                    let c = [];
                    a.forEach((b, i) => {
                        b.text = getIdText(b.text,lastMenu);
                        lastMenu.push(b);
                        c.push(b.text);
                    });
                    newMenu.push(c);
                });
                newmsg.reply_markup = { keyboard: newMenu, resize_keyboard: true };
            } else {
                newmsg.reply_markup = { inline_keyboard: menu };
            }
        }
    } else {
        let options = {};
        options.chat_id = getState(telegramInstanz + ".communicate.requestChatId").val;
        options.message_id = getState(telegramInstanz + ".communicate.requestMessageId").val;
        if ( menu.length ) options.reply_markup = { keyboard: menu };
        newmsg.editMessageText = {options};
    }
    sendTo(telegramInstanz, newmsg);
}

function _sendMenu(user='') {
    let m = menuArr[0];
    if (user) m.user = user;
    _sendMessage(m, false);
}

const doCmd = async function (m) {
    try {
        let result;
        switch (m.args.length) {
            case 5:
            result = await m.command(m.args[0], m.args[1], m.args[2], m.args[3], m.args[4]);
            break;
            case 4:
            result = await m.command(m.args[0], m.args[1], m.args[2], m.args[3]);
            break;
            case 3:
            result = await m.command(m.args[0], m.args[1], m.args[2]);
            break;
            case 2:
            result = await m.command(m.args[0], m.args[1]);
            break;
            case 1:
            result = await m.command(m.args[0]);
            break;
            case 0:
            result = await m.command();
            break;
        }
        if (result) {
            return result;
        } else {
            if ( inline_keyboard ) sendTo(telegramInstanz, { user: m.user, answerCallbackQuery: { text: 'done', showAlert: false } });
        }
    } catch (e) {
        if ( inline_keyboard ) sendTo(telegramInstanz, { user: m.user, answerCallbackQuery: { text: 'Error #2: '+e, showAlert: true } });
        log('#2 ' + e, 'warn');
    }
}

function switchState(id, ack = false, callback = null) {
    setState(id, !getState(id).val, ack, callback);
}

function getTemperatur(selector) {
    var data = getValuePerRoom($(selector));
    var msg = '';
    for (let room in data) msg += room + ': ' + round((data[room].values.reduce((a, b) => a + b) / data[room].values.length), 1) + '°C\n';
    if (msg) msg = 'Temperaturübersicht:\n' + msg;
    else msg = 'Keine Temperatur gefunden!';
    return msg;
}

function getFeuchtigkeit(selector) {
    var data = getValuePerRoom($(selector));
    var msg = '';
    for (let room in data) msg += room + ': ' + round((data[room].values.reduce((a, b) => a + b) / data[room].values.length), 1) + '%\n';
    if (msg) msg = 'Luftfeuchtigkeitsübersicht:\n' + msg;
    else msg = 'Keine Werte gefunden!';
    return msg;
}

function getLightsOfRoom(tRoom, selector, id = '', all = 0) {
    const prefix = '1-##**22';
    const prefixState = '#^#';
    var data = {};
    $(selector).each((obj) => {
        var rooms = getObject(obj.replace('.available', ''), 'rooms').enumIds;
        if (rooms === undefined) return;
        rooms.forEach((room) => {
            // workaround manche Geräte enthalten Räume die ihnen nicht zugewiesen sind.
            var enumObj = getObject(room);
            if (enumObj.common.members.findIndex((a) => {return obj.includes(a)}) == -1 ) return;
            room = enumObj.common.name;
            let r = room.de;
            if (r === undefined) r = room;
            if (r === tRoom ){
                let name = getObject(obj.substring(0,obj.lastIndexOf('.'))).common.name;
                data[obj] = {name: name, value: getState(obj).val};
            }
        });

    });
    var result = {};
    var allOn = {on:false, off:false};
    for (let obj in data) {
        if (result.submenu === undefined) {
            result.submenu = [];
            result.title = 'Lampen im ' + tRoom;
        }
        // vorwegnahme des Umschaltens, um mit getState() den Umschaltvorgang zu bestätigen wäre ein Timeout nötig.
        if (id == obj) data[obj].value = !data[obj].value;
        else if ( all != 0 ) {
            data[obj].value = (all ==1);
            setState(obj, data[obj].value)
        }
        if (data[obj].value) allOn.off = true;
        else allOn.on = true;

        let sId = obj.substring(0,obj.lastIndexOf('.'));
        let menu = [{text:data[obj].name + ' ' + (data[obj].value ? 'an 💡' : 'aus') , callback_data: prefix + obj}];
        if ($('state[role=level.brightness][state.id='+sId+'.*]').length > 0|| $('state[role=level.color.temperature][state.id='+sId+'.*]').length > 0) {
            menu.push({text:'Details' , callback_data: prefix + obj + 'details'});
        }
        result.submenu.push(menu);
        if ( temporaeresMenuArray.findIndex((a) => { return a.callback_data === prefix + obj }) == -1 ) {
            temporaeresMenuArray.push({text:data[obj].name, title:'', parent_data: lastMessage, callback_data: prefix + obj, command: getLightsOfRoom, args:[tRoom, selector, obj]});
            temporaeresMenuArray.push({text:'Details', title:'', parent_data: currentMessage, callback_data: prefix + obj + 'details', command: getDetailsOfLight, args:[obj]});
        }
    }
    // füge dynamsche Alle an/aus hinzu nur wenn mehr als 1 Lampe vorhanden ist und wenn nicht alle Lampen den selben Status haben.
    if ( result.submenu !== undefined && result.submenu.length > 1 && tRoom) {
        let o1 = {text:'Alle an', callback_data: prefix + '#!' + tRoom};
        let o2 = {text:'Alle aus', callback_data: prefix + '!#' + tRoom};
        let menu = [];
        if (allOn.on) menu.push(o1);
        if (allOn.off) menu.push(o2);
        result.submenu.unshift(menu);
        if ( temporaeresMenuArray.findIndex((a) => { return a.callback_data === o1.callback_data }) == -1 ) {
            temporaeresMenuArray.push({text: o1.text, title:'', parent_data: lastMessage, callback_data: o1.callback_data, command: getLightsOfRoom, args:[tRoom, selector, '', 1]});
        }
        if ( temporaeresMenuArray.findIndex((a) => { return a.callback_data === o2.callback_data }) == -1 ) {
            temporaeresMenuArray.push({text: o2.text, title:'', parent_data: lastMessage, callback_data: o2.callback_data, command: getLightsOfRoom, args:[tRoom, selector, '', 2]});
        }
    }
    if (id) {
        switchState(id);
    }
    return result;
}

const getDetailsOfLight = async function (id, setId=null, value=0) {
    const prefix = '1-##**25';
    if (setId) {
         setState(setId, getState(setId).val + value)
        await sleep(20);
    }
    let sId = id.substring(0,id.lastIndexOf('.'));
    let briGroup = $('state[role=level.brightness][state.id='+sId+'.*]');
    let ctGroup = $('state[role=level.color.temperature][state.id='+sId+'.*]');
    let data = {};
    let title = '';

    _getData(sId, briGroup, 'Helligkeit: ', 'heller', 'dunkler');
    _getData(sId, ctGroup, 'Lichttemperatur: ', 'wärmer', 'kälter');
    let count = 0;
    let result = {};
    for (let sobj in data) {
        let obj = data[sobj];
        if (result.submenu === undefined) {
            result.submenu = [];
            result.title = obj.name+'\n';
        }
        result.title += obj.text + obj.value +'\n';
        if (count == 0 ) {
            result.submenu.push([{text:obj.up , callback_data: prefix + sobj + 'up'}]);
            result.submenu.push([{text:obj.down , callback_data: prefix + sobj + 'down'}]);
        } else {
            result.submenu[result.submenu.length-2].push({text:obj.up , callback_data: prefix + sobj + 'up'});
            result.submenu[result.submenu.length-1].push({text:obj.down , callback_data: prefix + sobj + 'down'});
        }
        let o1 = result.submenu[result.submenu.length-2][count];
        let o2 = result.submenu[result.submenu.length-1][count++];
        if ( temporaeresMenuArray.findIndex((a) => { return a.callback_data === o1.callback_data || a.callback_data === o2.callback_data;}) == -1 ) {
            temporaeresMenuArray.push({text:o1.text, title:'', parent_data: lastMessage, callback_data: o1.callback_data, command: getDetailsOfLight, args:[id, sobj, +25]});
            temporaeresMenuArray.push({text:o2.text, title:'', parent_data: lastMessage, callback_data: o2.callback_data, command: getDetailsOfLight, args:[id, sobj, -25]});
        }
    }
    return result;

    function _getData(id, arr, text, up, down) {
            let obj = arr[0];
            data[obj] = {name: getObject(id).common.name, value: getState(obj).val, text: text ,up: up, down: down};
    }
}
function getRoomsLightsSum(selector) {
    const prefix = '1-##**22';
    const prefixState = '#^#';
    var rooms = getValuePerRoom($(selector), false);
    if (rooms === {} ) return null;
    var result = {};
    for (let room in rooms) {
        let all_count = rooms[room].values.length;
        let count = rooms[room].values.filter((a) => {return a==true}).length;
        if ( result.submenu === undefined ) result.submenu = [];
        result.submenu.push(
            [{text:room + ' (' + count + '/' + all_count + ')', callback_data: prefix + room}/*,
        {text:(count == 0 ? 'An':'Aus') + ' (' + count + '/' + all_count + ')' , callback_data: prefix + room + (count == 0 ? '#an':'#aus'), temp:count}*/]
        );
        result.title = 'Auswahl der Räume';
        let o1 = result.submenu[result.submenu.length-1][0];
        let o2 = result.submenu[result.submenu.length-1][1];
        if ( temporaeresMenuArray.findIndex((a) => { return  a.callback_data === o1.callback_data }) == -1 ) {
            temporaeresMenuArray.push({text:room, title:result.title, parent_data: currentMessage, callback_data: o1.callback_data, command: getLightsOfRoom, args:[room, selector, '']})
        }
        //if ( temporaeresMenuArray.findIndex((a) => { return a.callback_data === o2.callback_data }) == -1 ) {
        //    temporaeresMenuArray.push({text:room, title:'', parent_data: lastMessage, callback_data: o2.callback_data, command: getRoomsLightsSum, args:[selector, room, (o2.temp==0)]})
        //}
    }
    return result;
}

function getValuePerRoom(arr, id = false, sRoom = '', value = false) {
    var data = {};
    arr.each((obj) => {
        var rooms = getObject(obj.replace('.available', ''), 'rooms').enumIds;
        if (rooms === undefined) return;
        var temp;
        if (id) temp = id;
        else temp = getState(obj).val
        var cName = getObject(obj.substring(0,obj.lastIndexOf('.'))).common.name;;
        rooms.forEach((room) => {
            // workaround manche Geräte enthalten Räume die ich nicht entfernen kann.
            var enumObj = getObject(room);
            if (enumObj.common.members.findIndex((a) => {return obj.includes(a)}) == -1 ) return;
            room = enumObj.common.name;
            let r = room.de;
            if (r === undefined) r = room;
            if (data[r] === undefined) data[r] = {name: cName, values:[]};
            data[r].values.push(temp);
        });
    });
    return data;
}

function getBatt(name, id, min) {
    var Infos = [[]];
    var result = '';
    $(id).each(checkBatt);
    Infos.shift();
    Infos.sort((a,b) => {return a[1]-b[1];});

    if(Infos.length) {
        var InfoMessage = '';
        for(let i = 0; i < Infos.length; i++) {
            InfoMessage += Infos[i][0] + ': ' + Infos[i][1] + '%\n';
        }
        result = 'Ladestand der '+name+':\n' + InfoMessage;
    }
    return result;

    function checkBatt(id, i) {
        var value = round(getState(id).val);
        if(value < min) { // Anpassen !
            var pathname = id.substring(0, id.lastIndexOf('.'));
            var name = getObject(pathname).common.name;
            let i = 0;
            for( i = 0; i < Infos.length; i++) {
                if (Infos[i][0] == name) break;
            }
            if (i == Infos.length) Infos.push([name,value]);
        }
    }
}

function round(n, d = 0) { return (Math.floor((n * Math.pow(10, d)) + 0.5) / Math.pow(10, d)); }

function getIdText(text, arr) {
    let test = text;
    let prefix = '<>*';
    let d=0;
    while (arr.findIndex((a)=>{return a.text == test}) != -1 ) {
        test = '';
        let e = d++
        while (true) {
            let c = e % prefix.length;
            test += prefix[c];
            e -= c;
            if ( e == 0 ) break;
            e /= prefix.length;
        }
        test += ' ' + text;
    }
    return test;
}

async function sleep (ms) {
    return new Promise( resolve => {setTimeout(()=>{ resolve();},ms);});
}

_sendMenu();
