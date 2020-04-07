var arrHeader = []; // {"Header":"", "result":,"sub":null,"cmd":,"text":""}
var menuArr = [];
var callbackCounter = 1400020000;
var sameMenu=true;
var currentMessage = '';
var lastMessage = '';
var tempMenuArr = [];
var oldMessageID = []
var lastMenu = [];
var timeoutSameMenu = null;
var inline_keyboard = false;
const cMenuTimeoutTime = 20*60*1000;

var messageObj = [
    { //callback_data:'DWDUZWNINA#!§$'
        text: 'Menü',
        title: 'Menü',
        callback_data: 'Menu',
        submenu: [[
            {
                text: 'Warnungen',
                title: 'Warnungsmenü',
                submenu: [[{ text: 'Warnungen kurz', callback_data: 'DWDUZWNINA#!§$TT' },
                { text: 'Warnungen lang', callback_data: 'DWDUZWNINA#!§$LONG' }],
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
                        text: 'Beleuchtung', title: 'Auswahl der Räume',command: getRoomsLightsSum, args:['state[role=switch](functions=beleuchtung)']
                    }
                ]]
            }
        ]]
    }
]
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

on ({id:'telegram.0.communicate.botSendMessageId', change:'ne'}, (obj) =>
{
    if (oldMessageID.length === 0 || oldMessageID[oldMessageID.length-1] !== obj.state.val) {
        oldMessageID.push(obj.state.val);
    }
    while (oldMessageID.length > 2) {
        let id = oldMessageID[0];
        oldMessageID.shift();
        sendTo('telegram', {
            //user: user,
            deleteMessage: {
                options: {
                    chat_id: getState("telegram.0.communicate.requestChatId").val,
                    message_id: id
                }
            }
        });
    }
})

on({ id: 'telegram.0.communicate.request', change: "any", ack: false }, (obj)=> {setTimeout(mainTrigger, 2, obj);});

function mainTrigger(obj) {
    //var chatid = getState('telegram.0.communicate.requestChatId').val;
    //var users = JSON.parse(getState('telegram.0.communicate.users').val);
    var msg = obj.state.val;
    var user = msg.substring(1, msg.indexOf(']'));
    msg = msg.substring(msg.indexOf(']') + 1);
    if (lastMenu.length > 0 && lastMenu.findIndex((a)=>{return a.text === msg}) != -1) {
        sendTo('telegram', {
            //user: user,
            deleteMessage: {
                options: {
                    chat_id: getState("telegram.0.communicate.requestChatId").val,
                    message_id: getState("telegram.0.communicate.requestMessageId").val
                }
            }
        });
        let i = lastMenu.findIndex((a)=>{return a.text === msg});
        msg = '['+user+']'+lastMenu[i].callback_data;
        lastMenu = [];
        return setState('telegram.0.communicate.request', msg);
    }
    lastMessage = currentMessage;
    let currMenu = [];
    currMenu = currMenu.concat(menuArr);
    currMenu = currMenu.concat(tempMenuArr);
    currentMessage = msg;
    let a = currMenu.findIndex((a) => { return a.callback_data === currentMessage; });
    if (a == -1) {
        sendTo('telegram.0', { user: user, answerCallbackQuery: { text: 'Error #1', showAlert: false } });
        log('#1 Dont find callback_data in menuArr. ' + msg, 'warn');

        return;
    }
    if (a < menuArr.length) tempMenuArr = [];

    let m = currMenu[a]; m.user = user;
    if (m.command !== undefined) {
        let result = doCmd(m);
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
            sendTo('telegram.0', { user: m.user, answerCallbackQuery: { text: 'done', showAlert: false } });
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
    sendTo('telegram.0', { user: m.user, answerCallbackQuery: { text: m.text, showAlert: false } });
    newmsg.user = m.user;
    newmsg.text = m.title;
    newmsg.disable_notification = true;
    //newmsg.parse_mode = 'Markdown';
    let menu = [];
    if ( m.menu !== undefined) {
        menu = m.menu.slice();
    }
    if (m.parent_data !== undefined && m.parent_data) {menu.push([{text:'Zurück', callback_data:m.parent_data}]);};
    lastMenu = [];
    if (!edit || !inline_keyboard) {
        if ( menu.length ) {
            if ( !inline_keyboard) {
                let newMenu = [];
                menu.forEach((a)=>{
                    let c = [];
                    a.forEach((b, i) => {
                        lastMenu.push(b);
                        c.push(b.text);
                    });
                    newMenu.push(c);
                });
                newmsg.reply_markup = { keyboard: newMenu, resize_keyboard: true, one_time_keyboard: true };
            } else {
                newmsg.reply_markup = { inline_keyboard: menu };
            }
        }
    } else {
        let options = {};
        options.chat_id = getState("telegram.0.communicate.requestChatId").val;
        options.message_id = getState("telegram.0.communicate.requestMessageId").val;
        if ( menu.length ) options.reply_markup = { keyboard: menu };
        newmsg.editMessageText = {options};
    }
    sendTo('telegram.0', newmsg);
}

function _sendMenu(user='') {
    let m = menuArr[0];
    if (user) m.user = user;
    _sendMessage(m, false);
}

function doCmd(m) {
    try {
        let result;
        switch (m.args.length) {
            case 5:
            result = m.command(m.args[0], m.args[1], m.args[2], m.args[3], m.args[4]);
            break;
            case 4:
            result = m.command(m.args[0], m.args[1], m.args[2], m.args[3]);
            break;
            case 3:
            result = m.command(m.args[0], m.args[1], m.args[2]);
            break;
            case 2:
            result = m.command(m.args[0], m.args[1]);
            break;
            case 1:
            result = m.command(m.args[0]);
            break;
            case 0:
            result = m.command();
            break;
        }
        if (result) {
            return result;
        } else {
            sendTo('telegram.0', { user: m.user, answerCallbackQuery: { text: 'done', showAlert: false } });
        }
    } catch (e) {
        sendTo('telegram.0', { user: m.user, answerCallbackQuery: { text: 'Error #2: '+e, showAlert: true } });
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

function getValuePerRoom(arr, id = false) {
    var data = {};
    arr.each((obj) => {
        var rooms = getObject(obj.replace('.available', ''), 'rooms').enumNames;
        if (rooms === undefined) return;
        var temp;
        if (id) temp = id;
        else temp = getState(obj).val
        var cName = getObject(obj).common.name;
        rooms.forEach((room) => {
            let r = room.de;
            if (r === undefined) r = room;
            if (data[r] === undefined) data[r] = {name: cName, values:[]};
            data[r].values.push(temp);
        });
    });
    return data;
}

function getLightsOfRoom(tRoom, selectArr, id = '') {
    const prefix = '1-##**22';
    const prefixState = '#^#';
    var data = {};
    selectArr.each((obj) => {
        var rooms = getObject(obj, 'rooms').enumNames;
        if (rooms === undefined) return;
        rooms.forEach((room) => {
            let r = room.de;
            if (r === undefined) r = room;
            if (r === tRoom ){
                let name = getObject(obj.substring(0,obj.lastIndexOf('.'))).common.name;
                data[obj] = {name: name, value: getState(obj).val};
            }
        });

    });
    var result = {};
    for (let obj in data) {
        if (result.submenu === undefined) {
            result.submenu = [];
            result.title = 'Lampen im ' + tRoom;
        }
        // vorwegnahme des Umschaltens, um mit getState() den Umschaltvorgang zu bestätigen wäre ein Timeout nötig.
        if (id == obj) data[obj].value = !data[obj].value;
        result.submenu.push(
            [{text:data[obj].name + ' ' + (data[obj].value ? 'an 💡' : 'aus') , callback_data: prefix + obj}],
        );
        if ( tempMenuArr.findIndex((a) => { return a.callback_data === prefix + obj }) == -1 ) {
            tempMenuArr.push({text:data[obj].name, title:'', parent_data: lastMessage, callback_data: prefix + obj, command: getLightsOfRoom, args:[tRoom, selectArr, obj]});
        }
    }
    if (id) {
        switchState(id);
    }
    return result;
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
            [{text:room +' (' + count + '/' + all_count + ')' , callback_data: prefix + room}]
        );
        result.title = 'Auswahl der Räume';
        if ( tempMenuArr.findIndex((a) => { return a.callback_data === prefix + room }) == -1 ) {
            tempMenuArr.push({text:room, title:result.title, parent_data: currentMessage, callback_data: prefix + room, command: getLightsOfRoom, args:[room, $(selector), '']})
        }
    }
    return result;
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

_sendMenu();