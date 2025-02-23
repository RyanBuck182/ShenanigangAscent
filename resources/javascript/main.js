'use strict';

//------------------------------------------------------------------------------------------
//------------------------------------STATE MACHINE-----------------------------------------
//------------------------------------------------------------------------------------------

/**
 * A game state.
 * @typedef {'start' | 'mainMenu' | 'quit'} State
 */

/** Plays the game. */
async function stateMachine() {
    let state = 'start';
    while (state != 'quit') {
        switch (state) {
            case 'start':
                state = 'main-menu'; //load mods
                break;
            case 'main-menu':
                state = mainMenu();
                break;
            default:
                state = 'quit';
                break;
        }
    }
}

stateMachine();

//------------------------------------------------------------------------------------------
//--------------------------------------MAIN MENU-------------------------------------------
//------------------------------------------------------------------------------------------

/**
 * Displays the main menu.
 * @returns {State} The game state.
 */
async function mainMenu() {
    // await displayTitle();
    // await displayDivider();

    let shenaniroom = new Room({
        combatants: [
            PLAYER,
            Enemy.createInstance('shenanigang:amara'),
            Enemy.createInstance('shenanigang:cam'),
            Enemy.createInstance('shenanigang:connor'),
            Enemy.createInstance('shenanigang:ely'),
            Enemy.createInstance('shenanigang:george'),
            Enemy.createInstance('shenanigang:tenzin'),
            Enemy.createInstance('shenanigang:will'),
            Enemy.createInstance('shenanigang:wu_computer'),
        ]
    });

    {
        let speeds = [ 10, 0.1, 0 ];

        await PseudoConsole.printByChar('Choose your text speed:\n');
        await PseudoConsole.printByChar(
            ' (1) Normal\n' + 
            '     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed laoreet nisi, et\n     feugiat purus. In sed dictum orci. Sed non orci sit amet felis maximus placerat.\n     Curabitur ultricies venenatis odio quis consequat.\n'
        , speeds[0]);
        await wait(250);
        await PseudoConsole.printByChar(
            ' (2) Fast (recommended)\n' + 
            '     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed laoreet nisi, et\n     feugiat purus. In sed dictum orci. Sed non orci sit amet felis maximus placerat.\n     Curabitur ultricies venenatis odio quis consequat.\n'
        , speeds[1]);
        await wait(250);
        await PseudoConsole.printByChar(
            ' (3) Instant\n' + 
            '     Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sed laoreet nisi, et\n     feugiat purus. In sed dictum orci. Sed non orci sit amet felis maximus placerat.\n     Curabitur ultricies venenatis odio quis consequat.\n'
        , speeds[2]);
        await wait(250);
        let coords = await PseudoConsole.printByChar('Your choice: ');
        let choice = await PseudoConsole.getIntegerInput(coords.end, 1, 3);
        await PseudoConsole.printByChar('\n\n');

        PseudoConsole.DEFAULT_MILLISECONDS_PER_CHAR = speeds[choice - 1];
        PseudoConsole.DEFAULT_MILLISECONDS_PER_LINE = PseudoConsole.DEFAULT_MILLISECONDS_PER_CHAR * 20;
    }

    if (localStorage.getItem('hasWon') == 'yes') {
        await PseudoConsole.printByChar('Who do you challenge?\n');
        await PseudoConsole.printByChar(' (1) The Shenanigang\n');
        await PseudoConsole.printByChar(' (2) Amara\n');
        await PseudoConsole.printByChar(' (3) Cam\n');
        await PseudoConsole.printByChar(' (4) Connor\n');
        await PseudoConsole.printByChar(' (5) Ely\n');
        await PseudoConsole.printByChar(' (6) George\n');
        await PseudoConsole.printByChar(' (7) Tenzin\n');
        await PseudoConsole.printByChar(' (8) Will\n');
        await PseudoConsole.printByChar(' (9) Wu\n');
        let coords = await PseudoConsole.printByChar('Your choice: ');
        let choice = await PseudoConsole.getIntegerInput(coords.end, 1, 9);
        await PseudoConsole.printByChar('\n\n');

        switch (Number(choice)) {
            case 2:
                shenaniroom = new Room({
                    combatants: [
                        PLAYER,
                        Enemy.createInstance('shenanigang:amara')
                    ]
                });
                break;
            case 3:
                shenaniroom = new Room({
                    combatants: [
                        PLAYER,
                        Enemy.createInstance('shenanigang:cam')
                    ]
                });
                break;
            case 4:
                shenaniroom = new Room({
                    combatants: [
                        PLAYER,
                        Enemy.createInstance('shenanigang:connor')
                    ]
                });
                break;
            case 5:
                shenaniroom = new Room({
                    combatants: [
                        PLAYER,
                        Enemy.createInstance('shenanigang:ely')
                    ]
                });
                break;
            case 6:
                shenaniroom = new Room({
                    combatants: [
                        PLAYER,
                        Enemy.createInstance('shenanigang:george')
                    ]
                });
                break;
            case 7:
                shenaniroom = new Room({
                    combatants: [
                        PLAYER,
                        Enemy.createInstance('shenanigang:tenzin')
                    ]
                });
                break;
            case 8:
                shenaniroom = new Room({
                    combatants: [
                        PLAYER,
                        Enemy.createInstance('shenanigang:will')
                    ]
                });
                break;
            case 9:
                shenaniroom = new Room({
                    combatants: [
                        PLAYER,
                        Enemy.createInstance('shenanigang:wu')
                    ]
                });
                break;
        }
    }

    let weaponOptions = [
        // {
        //     weapon: Weapon.createInstance('ascent:bronze_sword'),
        //     chosen: false,
        //     description:
        //         '   sword\n'
        // }, {
        //     weapon: Weapon.createInstance('ascent:iron_sword'),
        //     chosen: false,
        //     description:
        //         '   sword\n'
        // }, {
        //     weapon: Weapon.createInstance('ascent:gun'),
        //     chosen: false,
        //     description:
        //         '   gun\n'
        /*},*/ {
            weapon: Weapon.createInstance('shenanigang:hot_cocoa'),
            chosen: false,
            description:
                '   A magical mug of hot cocoa which replenishes over time.\n' +
                '   Drink some to heal yourself or splash some on an enemy to damage them.\n'
        }, {
            weapon: Weapon.createInstance('shenanigang:candy_cane_crossbows'),
            chosen: false,
            description:
                '   A lethal pair of candy cane crossbows.\n' +
                '   Can attack a different enemy with each crossbow.\n'
        }, {
            weapon: Weapon.createInstance('shenanigang:ornament_artillery'),
            chosen: false,
            description:
                '   Massive ornament firing war machine.\n' +
                '   Deals AOE damage to enemies adjacent to your target.\n'
        }, {
            weapon: Weapon.createInstance('shenanigang:gingerbread_greatsword'),
            chosen: false,
            description:
                '   A greatsword of gingerbread.\n' +
                '   Absorbs the lifeforce of those it wounds, growing stronger and healing you.\n'
        }, {
            weapon: Weapon.createInstance('shenanigang:merry_machine_gun'),
            chosen: false,
            description:
                '   A machine gun filled to the brim with christmas spirit.\n' +
                '   Shoots many bullets. So inaccurate you don\'t bother aiming.\n'
        }
    ];    

    for (let i = 3; i > 0; i--) {
        let weaponMenu = `Choose ${i} of the following:\n`;
        let options = [];
        for (let j = 0; j < weaponOptions.length; j++) {
            if (!weaponOptions[j].chosen) {
                options.push(j);
                weaponMenu += '(' + (options.length) + ') ' + weaponOptions[j].weapon.name + '\n';
                weaponMenu += weaponOptions[j].description;
            }
        }
        weaponMenu += ((i == 3) ? 'First' : (i == 2) ? 'Second' : 'Third') + ' choice: ';
        
        let coords = (i < 3) ? PseudoConsole.printInstant(weaponMenu) : await PseudoConsole.printByChar(weaponMenu);
        let choice = await PseudoConsole.getIntegerInput(coords.end, 1, options.length) - 1;
        PLAYER.inventory.push(weaponOptions[options[choice]].weapon);
        weaponOptions.splice(options[choice], 1);

        PseudoConsole.clearLines(coords.start.line, undefined, true);
        await PseudoConsole.printInstant('\n');
    }
    PseudoConsole.clearLines(0, undefined, true);
    //await PseudoConsole.printByChar(`You chose:\n   ${PLAYER.inventory[0].name}\n   ${PLAYER.inventory[1].name}\n   ${PLAYER.inventory[2].name}\n`);

    await PseudoConsole.printByChar('\n');
    await shenaniroom.enterRoom();
    await shenaniroom.playRoom();
    await shenaniroom.exitRoom();

    localStorage.setItem('hasWon', 'yes');

    await PseudoConsole.printByChar('\n\nPress enter to restart...');
    await PseudoConsole.waitForEnter();
    location.reload();

    return 'quit';
}

//------------------------------------------------------------------------------------------
//-------------------------------------DISPLAY----------------------------------------------
//------------------------------------------------------------------------------------------

/** Displays the title image to the screen. */
async function displayTitle() {
    await PseudoConsole.printInstant('§line-text-christmas line-text-christmas-0 / text-bold§');
    await PseudoConsole.printByLine(
        setWidth("  ##      ## ##    ## ##   ### ###  ###  ##  #### ##", 'center') + '\n' +
        setWidth(" ## ##   ##   ##  ##   ##   ##  ##    ## ##  # ## ##", 'center') + '\n' +
        setWidth(" ##  ##  ####     ##        ##       # ## #    ##   ", 'center') + '\n' +
        setWidth(" ##  ##   #####   ##        ## ##    ## ##     ##   ", 'center') + '\n' +
        setWidth(" ## ###      ###  ##        ##       ##  ##    ##   ", 'center') + '\n' +
        setWidth(" ##  ##  ##   ##  ##   ##   ##  ##   ##  ##    ##   ", 'center') + '\n' +
        setWidth("###  ##   ## ##    ## ##   ### ###  ###  ##   ####  ", 'center') + '\n'
    );
    await PseudoConsole.printInstant('§//§');
}

/** Displays a divider to the screens. */
async function displayDivider() {
    await PseudoConsole.printByLine('§text-christmas§' + '═'.repeat(PseudoConsole.MAX_CHARS_PER_LINE) + '§/§');
}