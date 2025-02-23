'use strict';
{

const MOD_ID = 'shenanigang:';

PLAYER.maxHealth *= 2;
PLAYER.health *= 2;

//------------------------------------------------------------------------------------------
//---------------------------------------ENEMIES--------------------------------------------
//------------------------------------------------------------------------------------------

//Amara
new Enemy({
    name: 'Amara',
    identifier: MOD_ID + 'amara',
    image: [
        '§text-light-blue§┌─┐§/§',
        '§text-light-blue§╵§text-inherit§o§/§╵§/§',
        '/|\\',
        '/ \\'
    ],
    maxHealth: 100,
    doTurn: async(self) => {
        switch (self.turnsTaken++) {
            case 0:
                await PseudoConsole.printByChar('Amara plays pokemon and catches a Lapras.\n');
                break;
            case 1:
                await PseudoConsole.printByChar('Amara: "Go Lapras!"\n');
                await self.room.summonCombatant(Enemy.createInstance('shenanigang:lapras'));
                break;
            case 2:
                await PseudoConsole.printByChar('Amara takes out her violin.\n');
            default:
                let randomNum = generateRandomInteger(1, 10);
                if (randomNum <= 7) {
                    let damage = generateRandomInteger(self.minDamage, self.maxDamage);
                    await PseudoConsole.printByChar('Amara plays a discordant melody, dealing ' + damage + ' damage to you.\n');
                    await PLAYER.takeDamage(damage);
                }
                else {
                    await PseudoConsole.printByChar('Amara plays a pleasant melody, healing her allies.\n');
                    for (let i = 1; i < self.room.combatants.length; i++) {
                        if (self.room.combatants[i] === self)
                            continue;
                        let healing = generateRandomInteger(self.minHeal, self.maxHeal);
                        await self.room.combatants[i].takeHeal(healing);
                    }
                }
        }
        await PseudoConsole.printByChar('\nPress enter to continue...');
        await PseudoConsole.waitForEnter();
        PseudoConsole.clearLines(self.room.combatDisplayEnd.line + 1, undefined, true);
        await PseudoConsole.printByChar('\n');
    },
    die: async(self) => {
        let oldRoom = self.room;
        await self.room.removeCombatant(self);
        await PseudoConsole.printByChar('\n\n' + self.name + ' has perished.');
        
        let lapras = oldRoom.combatants.find(combatant => combatant.identifier === 'shenanigang:lapras');
        if (lapras)
            await lapras.die();
    },
    extraProperties: {
        minDamage: 1,
        maxDamage: 3,
        minHeal: 1,
        maxHeal: 3,
        turnsTaken: 0
    },
    generable: false,
    difficulty: 1
});

//Lapras
new Enemy({
    name: 'Lapras',
    identifier: MOD_ID + 'lapras',
    image: [
        '§text-lapras-blue§╭┸╮      §/§',
        '§text-lapras-blue§╰╮│§text-light-gray§╭───╮ §//§',
        '§text-lapras-blue§ │╰┴───┴╮§/§',
        '§text-lapras-blue§ │      │§/§',
        '§text-lapras-blue§ │ ╭──╮ │§/§',
        '§text-lapras-blue§ ╰─╯  ╰─╯§/§'
    ],
    maxHealth: 100,
    doTurn: async(self) => {
        let attack = generateRandomInteger(1, 4);
        let crit = generateRandomInteger(1, 10) == 10;
        let damage;
        switch (attack) {
            case 1:
                await PseudoConsole.printByChar('Lapras used Water Pulse!\n');
                damage = self.waterPulseDamage;
                break;
            case 2:
                await PseudoConsole.printByChar('Lapras used Ice Beam!\n');
                damage = self.iceBeamDamage;
                break;
            case 3:
                await PseudoConsole.printByChar('Lapras used Surf!\n');
                damage = self.surfDamage;
                break;
            case 4:
                await PseudoConsole.printByChar('Lapras used Hydro Pump!\n');
                damage = self.hydroPumpDamage;
                break;
        }
        if (crit) {
            await PseudoConsole.printByChar('A critical hit!\n');
            damage *= 2;
        }
        await PseudoConsole.printByChar('You take ' + damage + ' damage.\n');
        await PLAYER.takeDamage(damage);

        await PseudoConsole.printByChar('\nPress enter to continue...');
        await PseudoConsole.waitForEnter();
        PseudoConsole.clearLines(self.room.combatDisplayEnd.line + 1, undefined, true);
        await PseudoConsole.printByChar('\n');
    },
    die: async(self) => {
        await self.room.removeCombatant(self);
        await PseudoConsole.printByChar('\n\n' + self.name + ' has fainted.');
    },
    extraProperties: {
        waterPulseDamage: 2,
        iceBeamDamage: 3,
        surfDamage: 3,
        hydroPumpDamage: 4
    },
    generable: false,
    difficulty: 1
});

//Cam
new Enemy({
    name: 'Cam',
    identifier: MOD_ID + 'cam',
    image: [
        '§text-blue§┌─┐§/§',
        '§text-light-blue§╵§text-inherit§o§/§╵§/§',
        '/|\\',
        ' | ',
        '/ \\'
    ],
    maxHealth: 100,
    doTurn: async(self) => {
        let combatDisplayEnd = self.room.combatDisplayEnd.line;
        let randomNum = generateRandomInteger(1, 10);
        if (randomNum <= 6) {
            switch (++self.ultimate) {
                case 1:
                    await PseudoConsole.printByChar('Cam gets a nose piercing.\n');
                    await PseudoConsole.printByChar('His power increases.\n');
                    self.minDamage++;
                    self.maxDamage++;
                    break;
                case 2:
                    await PseudoConsole.printByChar('Cam dyes his hair blue.\n');
                    await PseudoConsole.printByChar('His power increases.\n');
                    self.minDamage++;
                    self.maxDamage++;
                    break;
                case 3:
                    await PseudoConsole.printByChar('Cam gets a tattoo.\n');
                    await PseudoConsole.printByChar('His power increases.\n');
                    await PseudoConsole.printByChar('§text-bold text-rainbow-sync§CAM has achieved ultimate gay.§//§\n');
                    self.room.replaceCombatant(self, Enemy.createInstance('shenanigang:cam_ultimate'));
                    break;
            }
        } else {
            let randomNum2 = generateRandomInteger(0, 1);
            let damage = generateRandomInteger(self.minDamage, self.maxDamage);
            if (randomNum2)
                await PseudoConsole.printByChar('Cam stabs you with a crochet hook for ' + damage + ' damage.\n');
            else
                await PseudoConsole.printByChar('Cam crochets a beanie and hurls it at you for ' + damage + ' damage.\n');
            await PLAYER.takeDamage(damage);
        }

        await PseudoConsole.printByChar('\nPress enter to continue...');
        await PseudoConsole.waitForEnter();
        PseudoConsole.clearLines(combatDisplayEnd + 1, undefined, true);
        await PseudoConsole.printByChar('\n');
    },
    extraProperties: {
        ultimate: 0,
        minDamage: 1,
        maxDamage: 3
    },
    generable: false,
    difficulty: 1
});

//Cam (Ultimate)
new Enemy({
    name: '§text-rainbow-sync§CAM§/§',
    identifier: MOD_ID + 'cam_ultimate',
    image: [
        '§text-blue§┌─┐§/§',
        '§text-light-blue§╵§text-bold text-rainbow-sync§o§//§╵§/§',
        '§text-bold text-rainbow-sync§/|\\§//§',
        '§text-bold text-rainbow-sync§ | §//§',
        '§text-bold text-rainbow-sync§/ \\§//§'
    ],
    maxHealth: 200,
    doTurn: async(self) => {
        if (self.room.round == 1)
            await PseudoConsole.printByChar('§text-rainbow-sync§CAM\'s presence radiates an iridescent aura of healing for his allies.\n§/§');

        await PseudoConsole.printByChar('§text-rainbow-sync§CAM\'s iridescent aura heals him and his allies.\n\n§/§');
        for (let i = 1; i < self.room.combatants.length; i++)
            if (self.room.combatants[i].health != self.room.combatants[i].maxHealth)
                await self.room.combatants[i].takeHeal(generateRandomInteger(3, 4));

        let randomNum = generateRandomInteger(1, 100);
        if (self.crochetCyclone == true) {
            await PseudoConsole.printByChar('§text-rainbow-sync§CAM unleashes a monumental, yarn-ridden cyclone of variegated hues. (2/2)§/§\n');
            let correctChoice = generateRandomInteger(1, 4);
            let chosenChoices = [];
            let choice = -1;
            do {
                await PseudoConsole.printByChar('\n');
                let hitBy = generateRandomInteger(1, 3);
                if (hitBy == 1) {
                    await PseudoConsole.printByChar('You were hit by a crochet hook.\n');
                    let damage = generateRandomInteger(5, 6);
                    await PseudoConsole.printByChar('You take ' + damage + ' damage.\n');
                    await PLAYER.takeDamage(damage);
                } else {
                    await PseudoConsole.printByChar('You were hit by a spool of yarn.\n');
                    let damage = generateRandomInteger(3, 4);
                    await PseudoConsole.printByChar('You take ' + damage + ' damage.\n');
                    await PLAYER.takeDamage(damage);
                }
                await PseudoConsole.printByChar('\n');

                let choiceWasChosen = (choiceToCheck) => chosenChoices.findIndex(chosenChoice => chosenChoice == choiceToCheck) >= 0;
                let menu = 'In which direction do you attempt to escape the cyclone?\n';
                menu += (choiceWasChosen(1) ? '§text-gray§' : '§text-inherit§') + '(1) North\n§/§';
                menu += (choiceWasChosen(2) ? '§text-gray§' : '§text-inherit§') + '(2) East\n§/§';
                menu += (choiceWasChosen(3) ? '§text-gray§' : '§text-inherit§') + '(3) South\n§/§';
                menu += (choiceWasChosen(4) ? '§text-gray§' : '§text-inherit§') + '(4) West\n§/§';
                menu += 'Your choice: ';

                let coords = await PseudoConsole.printByChar(menu);

                choice = await PseudoConsole.getIntegerInput(coords.end, 1, 4);
                chosenChoices.push(choice);

                await PseudoConsole.printByChar('\n');

                if (choice != correctChoice) {
                    await PseudoConsole.printByChar('\nYou didn\'t have much luck going ' + ((choice == 1) ? 'north' : (choice == 2) ? 'east' : (choice == 3) ? 'south' : 'west') + '.\n');
                    await PseudoConsole.printByChar('You get the sense you should try a different direction.');
                }
                await PseudoConsole.printByChar('\n');
            } while (choice != correctChoice);

            await PseudoConsole.printByChar('You manage to free yourself from the cyclone.\n');
            self.crochetCyclone = false;
        } else if (randomNum <= 35) {
            await PseudoConsole.printByChar('§text-rainbow-sync§CAM launches a torrent of vibrant rainbows, sprouting from the earth before violently thundering down upon you with resounding force.§/§\n\n');
            let hits = generateRandomInteger(4, 6);
            for (let i = 0; i < hits; i++) {
                let damage = generateRandomInteger(1, 2);
                await PseudoConsole.printByChar('A rainbow hits you for ' + damage + ' damage.\n');
                await PLAYER.takeDamage(damage);
            }
        } else if (randomNum <= 70) {
            let damage = generateRandomInteger(5, 7);
            await PseudoConsole.printByChar('§text-rainbow-sync§CAM fires a radiant beam of prismatic energy which hits you for ' + damage + ' damage.§/§\n');
            await PLAYER.takeDamage(damage);
        } else {
            await PseudoConsole.printByChar('§text-rainbow-sync§CAM prepares an attack of greater magnitude. (1/2)§/§\n');
            self.crochetCyclone = true;
        }

        await PseudoConsole.printByChar('\nPress enter to continue...');
        await PseudoConsole.waitForEnter();
        PseudoConsole.clearLines(self.room.combatDisplayEnd.line + 1, undefined, true);
        await PseudoConsole.printByChar('\n');
    },
    extraProperties: {
        crochetCyclone: false
    },
    generable: false,
    difficulty: 1
});

//Connor
new Enemy({
    name: 'Connor',
    identifier: MOD_ID + 'connor',
    image: [
        '§text-dark-green§╭─╮§/§',
        '§text-dark-gray§╵§text-inherit§o§/§╵§/§',
        '/|\\',
        ' | ',
        '/ \\'
    ],
    maxHealth: 100,
    doTurn: async(self) => {
        self.turnsAlive++;
        if (self.usedGoblinEncounter && (self.summonedCreatures.findIndex(c => c.identifier == 'shenanigang:goblin') == -1))
            self.turnsSinceGoblinDeath++;

        if (self.summonedCreatures.length > 0) {
            for (let i = 0; i < self.summonedCreatures.length; i++)
                await self.summonedCreatures[i].doConnorTurn(self.summonedCreatures[i]);
        } else if (!self.usedGoblinEncounter && self.turnsAlive >= 3) {
            self.usedGoblinEncounter = true;

            await PseudoConsole.printByChar(
                'Connor: You enter a room. ' +
                'Its oppressive darkness swallows you, your torch a mere pinprick in the face of its suffocating void. ' +
                'You continue forward. ' +
                'Your boots thump on the stone floor, echoing through the otherworldly silence. ' +
                'Suddenly, you hear the distict clatter of a blade being unsheathed. ' +
                'Three goblins are upon you.\n'
            );

            for (let i = 0; i < 3; i++) {
                let goblin = await self.room.summonCombatant(Enemy.createInstance('shenanigang:goblin', { connor: self }));
                self.summonedCreatures.push(goblin);
            }

            await PseudoConsole.printByChar('\nPress enter to roll for initiative...');
            await PseudoConsole.waitForEnter();

            let initiative = generateRandomInteger(1, 20);
            await PseudoConsole.printByChar(`\n\nYou roll a ${initiative}.\n\n`)

            let goblinJumps = 0;
            for (let i = 0; i < self.summonedCreatures.length; i++)
                if (initiative < generateRandomInteger(1, 20) + self.summonedCreatures[i].initiativeBonus || initiative == 1)
                    goblinJumps++;
                

            await PseudoConsole.printByChar('Connor: ' + ((goblinJumps == 0) ? 'None of the goblins get' : (goblinJumps == 1) ? 'One goblin gets' : (goblinJumps == 2) ? 'Two goblins get' : 'All three goblins get') + ' the jump on you.\n');

            if (goblinJumps != 0)
                await PseudoConsole.printByChar('\n');

            for (let i = 0; i < goblinJumps; i++)
                await self.summonedCreatures[i].doConnorTurn(self.summonedCreatures[i]);
        } else if (self.turnsSinceGoblinDeath >= 3 && !self.usedDragonEncounter) {
            self.usedDragonEncounter = true;

            await PseudoConsole.printByChar(
                'Connor: You enter a room. ' +
                'You feel dwarfed by its monumental vastness. ' +
                'Magnificent stone pillars of immense proportions sprout from ground to ceiling. ' +
                'Your boots clink against the mountains of gold lining the floor. ' +
                'A petrifying roar shakes the cavern. ' +
                'A gargantuan red dragon towers above you.\n'
            );

            let dragon = await self.room.summonCombatant(Enemy.createInstance('shenanigang:red_dragon', { connor: self }));
            self.summonedCreatures.push(dragon);

            await PseudoConsole.printByChar('\nPress enter to roll for initiative...');
            await PseudoConsole.waitForEnter();

            let initiative = generateRandomInteger(1, 20);
            await PseudoConsole.printByChar(`\n\nYou roll a ${initiative}.\n\n`)

            if (initiative >= generateRandomInteger(1, 20) + dragon.initiativeBonus || initiative == 20) {
                await PseudoConsole.printByChar('Connor: The dragon doesn\'t get the jump on you.\n');
            } else {
                await PseudoConsole.printByChar('Connor: The dragon gets the jump on you.\n\n');
                await dragon.doConnorTurn(dragon);
            }
        } else {
            let rand = generateRandomInteger(1, 100);
            if (rand <= 75) {
                let damage;
                let randomNum = generateRandomInteger(0, 5);

                switch (randomNum) {
                    case 0:
                        await PseudoConsole.printByChar('Connor: As you walk forward, the floor beneath you gives out. Take 1d4 damage.\n');
                        damage = generateRandomInteger(1, 4);
                        break;
                    case 1:
                        await PseudoConsole.printByChar('Connor: As you walk forward, you step into a puddle comprised of acid. Take 1d4 damage.\n');
                        damage = generateRandomInteger(1, 4);
                        break;
                    case 2:
                        await PseudoConsole.printByChar('Connor: As you walk forward, you bump into the nest of a species of magic-infused flying insect. Take 1d6 damage.\n');
                        damage = generateRandomInteger(1, 6);
                        break;
                    case 3:
                        await PseudoConsole.printByChar('Connor: You step on a pressure plate and spikes shoot up from the floor. Take 1d6 damage.\n');
                        damage = generateRandomInteger(1, 6);
                        break;
                    case 4:
                        await PseudoConsole.printByChar('Connor: You step on a pressure plate and arrows shoot from the walls. Take 1d4 damage.\n');
                        damage = generateRandomInteger(1, 4);
                        break;
                    case 5:
                        await PseudoConsole.printByChar('Connor: You step on a pressure plate and the structure around you seems to crumble. Take 1d6 damage from falling debris.\n');
                        damage = generateRandomInteger(1, 6);
                        break;
                }

                await PseudoConsole.printByChar('You take ' + damage + ' damage.\n');
                await PLAYER.takeDamage(damage);
            } else if (rand <= 90 && self.playerCoins >= 5 && !self.merchantVisited) {
                await PseudoConsole.printByChar(
                    'Connor: You enter a room, expecting to be faced with a beast of great peril or a trap of some kind. ' +
                    'Instead, you stumble upon something entirely unanticipated. ' +
                    'You find a tidy oak floor lit by flickering candles that adorn shelves and cast a warm glow on your surroundings. ' +
                    'An elderly dwarf gapes at you, startled by your sudden, and unforeseen arrival. ' +
                    'He swiftly subdues his bewilderment and assumes a more cordial expression.\n\n'
                );
                await PseudoConsole.printByChar(
                    'Connor: "Greetings Adventurer! Welcome to my humble establishment. ' +
                    'It\'s been quite a while since I\'ve had a visitor. ' +
                    'Perhaps I can upgrade your equipment, assuming you have the coin to afford it."\n\n'
                );

                let options = [];
                let i = 0;
                while (i < PLAYER.inventory.length) {
                    if (PLAYER.inventory[i].upgrade) {
                        await PseudoConsole.printByChar(`(${options.length + 1}) Upgrade your ${PLAYER.inventory[i].name}\n`);
                        options.push(i);
                    }
                    i++;
                }
                
                await PseudoConsole.printByChar(`(${options.length + 1}) Don't upgrade anything\n`);
                let coords = await PseudoConsole.printByChar(`Your choice: `);
                let choice = await PseudoConsole.getIntegerInput(coords.end, 1, options.length + 1) - 1;

                if (choice == options.length)
                    await PseudoConsole.printByChar('\n\nConnor: "Very well, carry on," said the dwarf with a tone that implied you should leave.\n');
                else {
                    await PseudoConsole.printByChar(`\n\nConnor: The dwarf upgrades your ${PLAYER.inventory[options[choice]].name}.\n`);
                    await self.upgradeWeapon(options[choice]);
                    self.playerCoins -= 5;
                    await PseudoConsole.printByChar(`Connor: You now have ${PLAYER.inventory[options[choice]].name}.\n`);
                    await PseudoConsole.printByChar('Connor: "This should serve you quite well. Thank you, Adventurer."\n');
                    await PseudoConsole.printByChar('Connor: You thank the dwarf before leaving to continue on your journey.\n');
                }

                self.merchantVisited = true;
            } else {
                await PseudoConsole.printByChar('Connor: You stumble upon a chest. It looks unlocked. Do you attempt to open it?\n');
                await PseudoConsole.printByChar('  (1) Open the chest\n');
                await PseudoConsole.printByChar('  (2) Leave the chest\n');
                let coords = await PseudoConsole.printByChar('Your choice: ');
                let choice = await PseudoConsole.getIntegerInput(coords.end, 1, 2) - 1;
                await PseudoConsole.printByChar('\n\n');

                if (choice)
                    await PseudoConsole.printByChar('Connor: You leave the chest, and whatever it may contain, untouched.\n');
                else {
                    let coinFlip = Math.random() < 0.5;
                    if (coinFlip) {
                        await PseudoConsole.printByChar('Connor: You open the chest');
                        await PseudoConsole.printByChar('... ', 450);
                        await PseudoConsole.printByChar('and find some coins.\n');
                        await self.gainCoins(self, generateRandomInteger(1, 2));
                        await PseudoConsole.printByChar('\n');
                    } else {
                        await PseudoConsole.printByChar('Connor: You open the chest');
                        await PseudoConsole.printByChar('... ', 450);
                        await PseudoConsole.printByChar('and it bursts to life. ');
                        let mimic = await self.room.summonCombatant(Enemy.createInstance('shenanigang:mimic', { connor: self }));
                        self.summonedCreatures.push(mimic);
                        await PseudoConsole.printByChar('You\'ve encountered a mimic.\n\n');
                        await PseudoConsole.printByChar('Press enter to roll for initiative...');
                        await PseudoConsole.waitForEnter();

                        let initiative = generateRandomInteger(1, 20);
                        await PseudoConsole.printByChar(`\n\nYou roll a ${initiative}.\n\n`)

                        if (initiative >= generateRandomInteger(1, 20) + mimic.initiativeBonus || initiative == 20) {
                            await PseudoConsole.printByChar('Connor: The mimic doesn\'t get the jump on you.\n');
                        } else {
                            await PseudoConsole.printByChar('Connor: The mimic gets the jump on you.\n\n');
                            await mimic.doConnorTurn(mimic);
                        }
                    }
                }
            }
        }

        await PseudoConsole.printByChar('\nPress enter to continue...');
        await PseudoConsole.waitForEnter();
        PseudoConsole.clearLines(self.room.combatDisplayEnd.line + 1, undefined, true);
        await PseudoConsole.printByChar('\n');
    },
    die: async(self) => {
        let room = self.room;
        await self.room.removeCombatant(self);
        await PseudoConsole.printByChar('\n\n' + self.name + ' has perished.');

        for (let i = 0; i < self.summonedCreatures.length; i++)
            await room.removeCombatant(self.summonedCreatures[i]);
    },
    extraProperties: {
        turnsAlive: 0,
        turnsSinceGoblinDeath: 0,
        playerCoins: 0,
        usedGoblinEncounter: false,
        usedDragonEncounter: false,
        merchantVisited: false,
        summonedCreatures: [],
        upgradeWeapon: async(inventoryIndex) => {
            let oldWeapon = PLAYER.inventory[inventoryIndex];

            if (oldWeapon.upgrade)
                PLAYER.inventory.splice(inventoryIndex, 1, oldWeapon.upgrade(oldWeapon));
            else
                console.warn(`${oldWeapon.identifier} not upgradable.`);
        },
        gainCoins: async(self, amount) => {
            self.playerCoins += amount;
            await PseudoConsole.printByChar(`Connor: You now have ${self.playerCoins} coins.`);
        }
    },
    generable: false,
    difficulty: 1
});

//Goblin
new Enemy({
    name: 'Goblin',
    identifier: MOD_ID + 'goblin',
    image: [
        '§text-dark-green§ o §/§',
        '§text-dark-green§/|\\§/§',
        '§text-dark-green§/ \\§/§'
    ],
    die: async(self) => {
        await self.room.removeCombatant(self);
        await PseudoConsole.printByChar('\n\nConnor: The goblin falls to your strength.');

        let coinFlip = Math.random() < 0.5;
        if (coinFlip) {
            await PseudoConsole.printByChar('\nYou find a coin.\n')
            await self.connor.gainCoins(self.connor, 1);
        }

        let selfIndex = self.connor.summonedCreatures.findIndex(creature => creature == self);
        self.connor.summonedCreatures.splice(selfIndex, 1);
    },
    maxHealth: 30,
    extraProperties: {
        minStabDamage: 3,
        maxStabDamage: 5,
        minSlashDamage: 2,
        maxSlashDamage: 4,
        minPunchDamage: 1,
        maxPunchDamage: 2,
        minKickDamage: 2,
        maxKickDamage: 3,
        initiativeBonus: -1,
        doConnorTurn: async(self) => {
            let attack = generateRandomInteger(1, 4);
            let damage = 0;

            switch (attack) {
                case 1:
                    damage = generateRandomInteger(self.minStabDamage, self.maxStabDamage);
                    await PseudoConsole.printByChar(`Connor: A goblin stabs you for ${damage}.\n`);
                    await PLAYER.takeDamage(damage);
                    break;
                case 2:
                    damage = generateRandomInteger(self.minSlashDamage, self.maxSlashDamage);
                    await PseudoConsole.printByChar(`Connor: A goblin slashes you for ${damage}.\n`);
                    await PLAYER.takeDamage(damage);
                    break;
                case 3:
                    damage = generateRandomInteger(self.minPunchDamage, self.maxPunchDamage);
                    await PseudoConsole.printByChar(`Connor: A goblin punches you for ${damage}.\n`);
                    await PLAYER.takeDamage(damage);
                    break;
                case 4:
                    damage = generateRandomInteger(self.minKickDamage, self.maxKickDamage);
                    await PseudoConsole.printByChar(`Connor: A goblin kicks you for ${damage}.\n`);
                    await PLAYER.takeDamage(damage);
                    break;
            }
        }
    },
    generable: false,
    difficulty: 1,
});

//Mimic
new Enemy({
    name: 'Mimic',
    identifier: MOD_ID + 'mimic',
    image: [
       ' §text-chest-brown§┌──────┐§/§',
       ' §text-chest-brown§│ §text-red§* *§/§  │§/§',
       '§text-chest-brown§┌┘ §text-inherit§vvv§/§ ┌┘§/§',
       '§text-chest-brown§│  §text-inherit§^^^§/§ │§/§ ',
       '§text-chest-brown§└──────┘§/§ '
    ],
    maxHealth: 50,
    die: async(self) => {
        await self.room.removeCombatant(self);
        await PseudoConsole.printByChar('\n\nConnor: The mimic collapses to the floor, dead.');

        let coinFlip = Math.random() < 0.5;
        if (coinFlip) {
            await PseudoConsole.printByChar('\nYou find a coin.\n')
            await self.connor.gainCoins(self.connor, 1);
        }

        let selfIndex = self.connor.summonedCreatures.findIndex(creature => creature == self);
        self.connor.summonedCreatures.splice(selfIndex, 1);
    },
    extraProperties: {
        initiativeBonus: 1,
        doConnorTurn: async(self) => {
            let damage = generateRandomInteger(3, 7);
            await PseudoConsole.printByChar(`Connor: The mimic bites you for ${damage} damage.\n`);
            await PLAYER.takeDamage(damage);
        }
    },
    generable: false,
    difficulty: 1
});

//Red Dragon
new Enemy({
    name: 'Red Dragon',
    identifier: MOD_ID + 'red_dragon',
    image: [
        '§text-red§┌──┐                §/§',
        '§text-red§└┐ │ ┌─────┐        §/§',
        '§text-red§ │ │ └┐┌───┴─┐      §/§',
        '§text-red§ │ └──┴└┐    │─┐    §/§',
        '§text-red§ │      ╵    ╵ ┝━━━─§/§',
        '§text-red§ │  ┌───────┐  │    §/§',
        '§text-red§ └──┘       └──┘    §/§'
    ],
    maxHealth: 150,
    die: async(self) => {
        await self.room.removeCombatant(self);
        await PseudoConsole.printByChar('\n\nConnor: With an ear-splitting boom, the red dragon collides with the ground, lifeless.');

        await PseudoConsole.printByChar('\nYou raid the dragon\'s hoard.\n')
        await self.connor.gainCoins(self.connor, Number.MAX_SAFE_INTEGER - self.connor.playerCoins);

        let selfIndex = self.connor.summonedCreatures.findIndex(creature => creature == self);
        self.connor.summonedCreatures.splice(selfIndex, 1);
    },
    extraProperties: {
        initiativeBonus: 8,
        minBiteDamage: 6,
        maxBiteDamage: 8,
        minClawDamage: 3,
        maxClawDamage: 4,
        minTailDamage: 5,
        maxTailDamage: 6,
        minFireDamage: 30,
        maxFireDamage: 40,
        doConnorTurn: async(self) => {
            if (Math.random() < 0.25) {
                let damage = generateRandomInteger(self.minFireDamage, self.maxFireDamage);
                await PseudoConsole.printByChar('Connor: The dragon breathes fire upon you.\n');
                await PseudoConsole.printByChar(`You take ${damage} damage.\n`);
                await PLAYER.takeDamage(damage);
            } else {
                let damage = 0;
                if (Math.random() < 0.75) {
                    damage = generateRandomInteger(self.minBiteDamage, self.maxBiteDamage);
                    await PseudoConsole.printByChar(`Connor: The dragon bites you for ${damage} damage.\n`);
                    await PLAYER.takeDamage(damage);    
                }

                damage = generateRandomInteger(self.minClawDamage, self.maxClawDamage);
                await PseudoConsole.printByChar(`Connor: The dragon claws you for ${damage} damage.\n`);
                await PLAYER.takeDamage(damage);
                if (Math.random() < 0.75) {
                    damage = generateRandomInteger(self.minClawDamage, self.maxClawDamage);
                    await PseudoConsole.printByChar(`Connor: The dragon claws you for ${damage} damage.\n`);
                    await PLAYER.takeDamage(damage);    
                }

                if (Math.random() < 0.75) {
                    damage = generateRandomInteger(self.minTailDamage, self.maxTailDamage);
                    await PseudoConsole.printByChar(`Connor: The dragon hits you with its tail for ${damage} damage.\n`);
                    await PLAYER.takeDamage(damage);
                }
            }
        }
    },
    generable: false,
    difficulty: 1
});

//Ely
new Enemy({
    name: 'Ely',
    identifier: MOD_ID + 'ely', 
    image: [
        '§text-red§┌─┐§/§',
        '§text-light-pink§╵§text-inherit§o§/§╵§/§',
        '/|\\',
        ' | ',
        '/ \\'
    ],
    maxHealth: 100,
    doTurn: async(self) => {
        let ability = generateRandomInteger(1, 2);

        if (ability == 1 || self.robotJustDied) {
            if (self.rails >= 7) {
                if (self.rails++ == 7) {
                    await PseudoConsole.printByChar('Ely finishes their railroad. (8/8)\n');
                    await PseudoConsole.printByChar('Trains from across the world flock for the chance to serve');
                    await PseudoConsole.printByChar('...\n', 750);
                    await PseudoConsole.printByChar('\n');
                    self.name = '§text-ely-purple text-bold§Ely, The Conductor§//§';
                    await self.room.displayCombatStats();
                    await PseudoConsole.printByChar(self.name, 100);
                    await wait(2000);
                    await PseudoConsole.printByChar('\n\nPress enter to continue...');
                    await PseudoConsole.waitForEnter();
                    PseudoConsole.clearLines(self.room.combatDisplayEnd.line + 1, undefined, true);
                    await PseudoConsole.printByChar('\n');
                }

                let rowCount = 13;
                let rowSize = 25;
                let minTrainLength = 10;
                let maxTrainLength = 30;
                let trainBerth = 4;
                let trainColors = ['red', 'white', 'dark-gray', 'pale-yellow', 'blue', 'light-blue', 'lime', 'dark-green', 'cotton-candy-pink', 'ice-cream-teal', 'peach', 'blood', 'some-blue', 'light-purple', 'orange', 'aquamarine', 'magenta'];

                /**
                 * @typedef Train
                 * @property {Number} leftIndex
                 * @property {Number} rightIndex
                 * @property {Number} length
                 * @property {'left' | 'right'} direction
                 * @property {String} color
                 */

                let grassTile = ' ';
                let trackTile = '§text-gray text-bold§═§//§';
                let winTile = '§text-yellow§☼§/§';
                let grassDisplay = () => new Array(rowSize).fill(grassTile);
                let trackDisplay = () => new Array(rowSize).fill(trackTile);
                let winDisplay = () => new Array(rowSize).fill(winTile);
                let grassRow = () => { return { type: 'grass', display: grassDisplay(), trains: [] } };
                let trackRow = () => { return { type: 'track', display: trackDisplay(), trains: [] } };
                let winRow = () => { return { type: 'win', display: winDisplay(), trains: [] } };

                let trainDisplay = (color, direction, length) => {
                    let colorStart = `§text-${color}§`;
                    let colorEnd = `§/§`;
                    let trainFront = colorStart + '■' + colorEnd;
                    let trainFront2 = colorStart + '■' + colorEnd;
                    let trainBody = new Array(length - 3).fill(colorStart + '█' + colorEnd);
                    let trainEnd = colorStart + ((direction == 'right') ? '▐' : '▌') + colorEnd;

                    let finishedArray = [...((direction == 'right') ? [trainEnd] : [trainFront2, trainFront]), ...trainBody, ...((direction == 'right') ? [trainFront, trainFront2] : [trainEnd])]

                    return finishedArray;
                }

                /**
                 * @type {{
                 * type: 'grass' | 'track' | 'win',
                 * display: String[],
                 * trains: Train[],
                 * }[]}
                 */
                let rows = new Array(rowCount);

                rows[0] = winRow();
                rows[generateRandomInteger(2, 5)] = grassRow();
                rows[generateRandomInteger(6, 9)] = grassRow();
                rows[11] = grassRow();
                rows[12] = grassRow();

                for (let i = 0; i < rowCount; i++) {
                    if (rows[i] == undefined)
                        rows[i] = trackRow();
                }

                let stepsWithoutNewTrain = 0;
                let playerPosition = { row: rowCount - 1, column: Math.floor(rowSize / 2) };
                let printCoords = (await PseudoConsole.printByChar(`${self.name} commands their trains to attack you.\n\n`)).end;

                let spawnTrain = () => {
                    let spawnableRowIndices = [];
                    for (let i = 0; i < rowCount; i++) {
                        if (rows[i].type != 'track')
                            continue;

                        let spawnable = true;
                        for (let j = 0; j < rows[i].trains.length; j++) {
                            let train = rows[i].trains[j];
                            if (train.direction == 'right') {
                                if (train.leftIndex < trainBerth - 1) {
                                    spawnable = false;
                                    break;
                                }
                            } else {
                                if (train.rightIndex > rowSize - trainBerth) {
                                    spawnable = false;
                                    break;
                                }
                            }
                        }

                        if (spawnable)
                            spawnableRowIndices.push(i);
                    }

                    if (spawnableRowIndices.length == 0)
                        return undefined;

                    let spawnRowIndex = spawnableRowIndices[generateRandomInteger(0, spawnableRowIndices.length - 1)];
                    let spawnRow = rows[spawnRowIndex];

                    let train = {};
                    train.direction = (spawnRow.trains[0]) ? spawnRow.trains[0].direction : (generateRandomInteger(0, 1)) ? 'right' : 'left';
                    train.length = generateRandomInteger(minTrainLength, maxTrainLength);
                    train.rightIndex = (train.direction == 'right') ? 0 : (rowSize + train.length - 2);
                    train.leftIndex = (train.direction == 'right') ? (-train.length + 1) : (rowSize - 1);

                    let colorIndex = generateRandomInteger(0, trainColors.length - 1);
                    train.color = trainColors[colorIndex];
                    
                    spawnRow.trains.push(train);
                    return { row: spawnRow, train: spawnRow.trains[spawnRow.trains.length - 1] };
                }

                for (let i = 0; i < 11; i++) {
                    let data = spawnTrain();
                    if (!data)
                        break;
                    else if (data.row.trains.length > 1)
                        continue;

                    let moveAmount = generateRandomInteger(0, rowSize - 1 + data.train.length);
                    moveAmount *= (data.train.direction == 'right') ? 1 : -1;
                    data.train.leftIndex += moveAmount;
                    data.train.rightIndex += moveAmount;
                }

                let waitForMove = async() => {
                    let moveKeys = [' ', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];

                    return new Promise(resolve => {
                        let listener;
                        document.addEventListener('keydown', listener = (event) => {
                            for (let i = 0; i < moveKeys.length; i++) {
                                if (event.key === moveKeys[i]) {
                                    document.removeEventListener('keydown', listener);
                                    event.preventDefault();
                                    resolve(event.key);
                                }
                            }
                        });
                    });
                }

                let displayBoard = () => {
                    let displayString = '§background-dark-green-faded§';
                    let playerHit = false;

                    for (let i = 0; i < rowCount; i++) {
                        let rowDisplay = rows[i].display.slice(0);

                        if (i == playerPosition.row)
                            rowDisplay[playerPosition.column] = '§text-red§♥§/§';

                        for (let j = 0; j < rows[i].trains.length; j++) {
                            let train = rows[i].trains[j];
                            let trainDisplayArray = trainDisplay(train.color, train.direction, train.length);

                            let element = -1;
                            for (let k = train.leftIndex; k <= train.rightIndex; k++) {
                                element++;

                                if (k < 0 || k > rowSize - 1)
                                    continue;

                                if (k == playerPosition.column && i == playerPosition.row)
                                    playerHit = true;

                                rowDisplay.splice(k, 1, trainDisplayArray[element]);
                            }
                        }

                        displayString += ''.concat(...rowDisplay, '\n');
                    }

                    displayString += '§/§\n';
                    displayString += 'Use the arrow keys to move.\n';
                    displayString += 'Press the spacebar to stay in place.\n';
                    displayString += 'When you move, the trains move too.\n';
                    
                    PseudoConsole.clearLines(printCoords.line, undefined, true);
                    PseudoConsole.printInstant(displayString, printCoords.line);

                    return playerHit;
                }

                displayBoard();

                while (true) {

                    //move player
                    let move = await waitForMove();
                    if (move == 'ArrowDown')
                        playerPosition.row = Math.min(rowCount - 1, playerPosition.row + 1);
                    else if (move == 'ArrowUp')
                        playerPosition.row = Math.max(0, playerPosition.row - 1);
                    else if (move == 'ArrowLeft')
                        playerPosition.column = Math.max(0, playerPosition.column - 1);
                    else if (move == 'ArrowRight')
                        playerPosition.column = Math.min(rowSize - 1, playerPosition.column + 1);

                    //check for player win
                    if (playerPosition.row == 0) {
                        displayBoard();
                        await PseudoConsole.printByChar('\nYou crossed the tracks and reached the end!\n');
                        await PseudoConsole.printByChar('You take no damage.\n');
                        break;
                    }

                    //move and remove trains
                    for (let i = 0; i < rowCount; i++) {
                        if (rows[i].type != 'track')
                            continue;

                        let trainIndicesToRemove = [];
                        for (let j = 0; j < rows[i].trains.length; j++) {
                            let train = rows[i].trains[j];
                            let moveAmount = (train.direction == 'right') ? 2 : -2;
                            train.leftIndex += moveAmount;
                            train.rightIndex += moveAmount;

                            let trainOffscreen = (train.direction == 'right') ? train.leftIndex > rowSize - 1 : train.rightIndex < 0;
                            if (trainOffscreen)
                                trainIndicesToRemove.push(j);
                        }

                        for (let j = trainIndicesToRemove.length - 1; j >= 0; j--)
                            rows[i].trains.splice(trainIndicesToRemove[j], 1);
                    }

                    //spawn train
                    let doTrainSpawn = Math.random() * ++stepsWithoutNewTrain > 0.75; // generateRandomInteger(0, stepsWithoutNewTrain++) > 0;
                    if (doTrainSpawn) {
                        spawnTrain();
                        stepsWithoutNewTrain = 0;
                    }

                    //display game
                    let playerHit = displayBoard();

                    if (playerHit) {
                        let damage = generateRandomInteger(self.minTrainDamage, self.maxTrainDamage);
                        await PseudoConsole.printByChar('\nYou were hit by a train!\n');
                        await PseudoConsole.printByChar('You take ' + damage + ' damage.\n');
                        await PLAYER.takeDamage(damage);
                        break;
                    }
                }
            } else
                await PseudoConsole.printByChar(`Ely works on the railroad. (${++self.rails}/8)\n`);
        } else {
            if (self.robot) {
                if (self.robot.health / self.robot.maxHealth < 0.5) {
                    await PseudoConsole.printByChar(`${self.name} repairs ${self.robot.name}.\n`);
                    await self.robot.takeHeal(Math.floor(self.robot.maxHealth * 0.3));
                } else {
                    await PseudoConsole.printByChar(`${self.name} upgrades ${self.robot.name}.\n`);
                    await self.robot.upgrade(self.robot);
                }
            } else {
                await PseudoConsole.printByChar(`${self.name} builds a healing robot.\n`);
                self.robot = Enemy.createInstance('shenanigang:robot');
                self.robot.ely = self;
                await self.room.summonCombatant(self.robot);
            }
        }
        self.robotJustDied = false;

        await PseudoConsole.printByChar('\nPress enter to continue...');
        await PseudoConsole.waitForEnter();
        PseudoConsole.clearLines(self.room.combatDisplayEnd.line + 1, undefined, true);
        await PseudoConsole.printByChar('\n');
    },
    die: async(self) => {
        let room = self.room
        await self.room.removeCombatant(self);
        await PseudoConsole.printByChar('\n\n' + self.name + ' has perished.');

        if (self.robot)
            self.robot.ely = undefined;
    },
    extraProperties: {
        rails: 0,
        minTrainDamage: 11,
        maxTrainDamage: 15,
        robot: undefined,
        robotJustDied: false
    },
    generable: false,
    difficulty: 1
});

//Heal Bot
new Enemy({
    name: 'Heal Bot',
    identifier: MOD_ID + 'robot',
    image: [
        '     §text-red§╶┼╴§/§',
        '§text-gray§╭─────┴╮§/§',
        '§text-gray§╰0────0╯§/§'
    ],
    maxHealth: 25,
    doTurn: async(self) => {
        if (self.speak) {
            if (self.room.combatants.length == 2) {
                switch(++self.turnsAlone) {
                    case 1:
                        await PseudoConsole.printByChar(`${self.name}: hey where did everyone go?\n\n`);
                        break;
                    case 2:
                        await PseudoConsole.printByChar(`${self.name}: i\'m serious where is everyone?\n\n`);
                        break;
                    case 3:
                        await PseudoConsole.printByChar(`${self.name}: who are you?\n`);
                        await PseudoConsole.printByChar(`${self.name}: what did you do to them?\n\n`);
                        break;
                    case 4:
                        await PseudoConsole.printByChar(`${self.name}: go away!\n\n`);
                        break;
                    case 5:
                        await PseudoConsole.printByChar(`${self.name}: leave me alone!\n\n`);
                        break;
                }
            } else {
                if (++self.turnsAlive == 1) {
                    await PseudoConsole.printByChar(`${self.name}: hi everyone!!!!\n\n`);
                } else if (self.turnLines.length > 0 || (self.turnLines.length + self.elyTurnLines.length > 0 && self.ely)) {
                    let linesLeft = self.turnLines.length;
                    if (self.ely)
                        linesLeft += self.elyTurnLines.length;

                    let randomLineIndex = generateRandomInteger(0, linesLeft - 1);
                    let line = '';
                    if (randomLineIndex < self.turnLines.length) {
                        line = self.turnLines[randomLineIndex];
                        self.turnLines.splice(randomLineIndex, 1);
                    } else {
                        line = self.elyTurnLines[randomLineIndex - self.turnLines.length];
                        self.elyTurnLines.splice(randomLineIndex - self.turnLines.length, 1);
                    }
                    await PseudoConsole.printByChar(`${self.name}: ` + line + '\n\n');
                }
            }
        }

        let healTarget = self.chooseTarget(self);
        if (healTarget) {
            await PseudoConsole.printByChar(`${self.name} heals ${healTarget.name} for ${self.heal} health.\n\n`);
            await healTarget.takeHeal(self.heal);
        } else
            await PseudoConsole.printByChar(`${self.name} wants to heal someone, but there's no one left to heal.\n\n`);

        if (self.droneProduction) {
            self.drones++;
            await PseudoConsole.printByChar(`${self.name} builds a drone. They now have ${self.drones + ' drone' + ((self.drones == 1) ? '' : 's')}.\n`);
        }

        if (self.drones > 0) {
            let droneTargets = self.chooseDroneTargets(self, self.drones);
            for (let i = 0; i < droneTargets.length; i++) {
                if (droneTargets[i]) {
                    let droneCountString = (droneTargets[i].drones == 1) ? 'a drone' : droneTargets[i].drones + ' drones';
                    let targetString = (droneTargets[i].target == self) ? 'themself' : droneTargets[i].target.name;
                    await PseudoConsole.printByChar(`${self.name} tasks ${droneCountString} with healing ${targetString}.\n`);
                    await droneTargets[i].target.takeHeal(droneTargets[i].drones);
                }
            }
            await PseudoConsole.printByChar('\n');
        }
        
        if (self.guns > 0) {
            if (self.turnsAlone != 0)
                await PseudoConsole.printByChar(`${self.name} shoots you.\n`);
            else
                await PseudoConsole.printByChar(`${self.name}: pew pew!\n`);
            
            for (let i = 0; i < self.guns && PLAYER.health > 0; i++) {
                let damage = generateRandomInteger(self.minGunDamage, self.maxGunDamage);
                await PseudoConsole.printByChar('You take ' + damage + ' damage.\n');
                await PLAYER.takeDamage(damage);
            }
            await PseudoConsole.printByChar('\n');
        }

        await PseudoConsole.printByChar('Press enter to continue...');
        await PseudoConsole.waitForEnter();
        PseudoConsole.clearLines(self.room.combatDisplayEnd.line + 1, undefined, true);
        await PseudoConsole.printByChar('\n');
    },
    takeDamage: async(self, amount) => {
        self.health = Math.max(self.health - amount, 0);
        await self.room.displayCombatStats();        
        
        if (self.health <= 0)
            await self.die();
        else if (self.speak) {
            let randomNum = generateRandomInteger(0, 3);
            switch(randomNum) {
                case 0:
                    await PseudoConsole.printByChar(`\n${self.name}: ow!`);
                    break;
                case 1:
                    await PseudoConsole.printByChar(`\n${self.name}: stop!`);
                    break;
                case 2:
                    await PseudoConsole.printByChar(`\n${self.name}: ow :(`);
                    break;
                case 3:
                    await PseudoConsole.printByChar(`\n${self.name}: stop :(`);
                    break;
            }
        }
    },
    die: async(self) => {
        if (self.speak) {
            await PseudoConsole.printByChar('\n\n' + self.name + ': §text-fade-for-goodbye§');
            let goodbye = `why please please please help someone why please why why why why why why why?`;
            goodbye = PseudoConsole.insertLineBreaks(goodbye, PseudoConsole.lines()[PseudoConsole.lastNonEmptyLine()].column);
            let printSpeed = 40;
            for (let i = 0; i < goodbye.length; i++) {
                await PseudoConsole.printByChar(goodbye[i], printSpeed);
                printSpeed *= 1.02;
            }
            PseudoConsole.printByChar('§/§');
            await wait(1500);
        }
        await self.room.removeCombatant(self);
        await PseudoConsole.printByChar('\n\n' + self.name + ' has perished.');

        if (self.ely) {
            self.ely.robot = undefined;
            self.ely.robotJustDied = true;
        }
    },
    extraProperties: {
        upgrade: async(self) => {
            switch (++self.upgrades) {
                case 1:
                    await PseudoConsole.printByChar(`${self.name}\'s effectiveness improves.\n`);
                    self.heal += 2;
                    self.maxHealth += 5;
                    await self.takeHeal(5);
                    break;
                case 2:
                    await PseudoConsole.printByChar(`${self.name}\'s resilience improves.\n`);
                    self.maxHealth += 30;
                    await self.takeHeal(30);
                    break;
                case 3:
                    await PseudoConsole.printByChar(`${self.name}\'s intelligence improves. It now heals the lowest health ally.\n`);
                    self.smart = true;
                    self.heal += 1;
                    self.maxHealth += 5;
                    await self.takeHeal(5);
                    break;
                case 4:
                    self.name = '§text-lime§Rover§/§';
                    self.image = self.image1;
                    await PseudoConsole.printByChar(`Heal Bot can now speak. ${self.ely.name} names them ${self.name}.\n`);
                    self.speak = true;
                    self.heal += 1;
                    self.maxHealth += 10;
                    await self.takeHeal(10);
                    break;
                case 5:
                    self.image = self.image2;
                    await PseudoConsole.printByChar(`${self.ely.name} gives ${self.name} a gun.\n`);
                    self.guns += 1;
                    self.maxHealth += 5;
                    await self.takeHeal(5);
                    break;
                case 6:
                    await PseudoConsole.printByChar(`${self.name} now has 3 healing drones to assist them in their healing efforts.\n`);
                    self.drones += 3;
                    self.maxHealth += 5;
                    await self.takeHeal(5);
                    break;
                case 7:
                    self.image = self.image3;
                    await PseudoConsole.printByChar(`${self.ely.name} gives ${self.name} a second gun, cause why not.\n`);
                    self.guns += 1;
                    self.maxHealth += 5;
                    await self.takeHeal(5);
                    break;
                case 8:
                    await PseudoConsole.printByChar(`${self.name} can now build healing drones.\n`);
                    self.droneProduction = true;
                    self.heal += 1;
                    self.maxHealth += 5;
                    await self.takeHeal(5);
                    break;
                case 9:
                    await PseudoConsole.printByChar(`${self.ely.name} works on something big. (1/3)\n`);
                    self.maxHealth += 5;
                    await self.takeHeal(5);
                    break;
                case 10:
                    await PseudoConsole.printByChar(`${self.ely.name} works on something big. (2/3)\n`);
                    self.maxHealth += 5;
                    await self.takeHeal(5);
                    break;
                case 11:
                    self.image = self.image4;
                    await PseudoConsole.printByChar(`${self.ely.name} attaches a massive gatling gun to ${self.name}. (3/3)\n`);
                    self.guns += 6;
                    self.maxHealth += 5;
                    await self.takeHeal(5);
                    break;
                default:
                    let coinFlip = Math.random() < 0.5;
                    if (coinFlip) {
                        await PseudoConsole.printByChar(`${self.name}\'s effectiveness improves.\n`);
                        self.heal += 1;
                    } else {
                        await PseudoConsole.printByChar(`${self.name}\'s resilience improves.\n`);
                        self.maxHealth += 10;
                        await self.takeHeal(10);
                    }
                    break;
            }
        },
        chooseTarget: (self) => {
            let potentialTargets = self.room.combatants.filter(combatant => combatant != PLAYER && combatant != self);
            
            if (potentialTargets.length == 0)
                return undefined;
            
            let target = potentialTargets[generateRandomInteger(0, potentialTargets.length - 1)];
            
            if (!self.smart)
                return target;

            for (let i = 0; i < potentialTargets.length; i++)
                if ((potentialTargets[i].health / potentialTargets[i].maxHealth) < (target.health / target.maxHealth))
                    target = potentialTargets[i];
            return target;
        },
        chooseDroneTargets: (self, droneCount) => {
            let potentialTargets = self.room.combatants.filter(combatant => combatant != PLAYER);
            let droneTasks = [];

            let getLowestHealthTarget = () => {
                let target = generateRandomInteger(0, potentialTargets.length - 1);
                for (let i = 0; i < potentialTargets.length; i++) {
                    let potentialTargetHealthPercentage = (potentialTargets[i].health + ((droneTasks[i]) ? droneTasks[i].drones : 0)) / potentialTargets[i].maxHealth;
                    let targetHealthPercentage = (potentialTargets[target].health + ((droneTasks[target]) ? droneTasks[target].drones : 0)) / potentialTargets[target].maxHealth;
                    if (potentialTargetHealthPercentage < targetHealthPercentage)
                        target = i;
                }
                return target;
            }

            for (let i = 0; i < droneCount; i++) {
                let chosenTarget = getLowestHealthTarget();
                if (droneTasks[chosenTarget])
                    droneTasks[chosenTarget].drones++;
                else
                    droneTasks[chosenTarget] = { target: potentialTargets[chosenTarget], drones: 1 };
            }

            return droneTasks;
        },
        upgrades: 0,
        heal: 2,
        guns: 0,
        minGunDamage: 2,
        maxGunDamage: 4,
        drones: 0,
        droneHeal: 1,
        smart: false,
        speak: false,
        droneProduction: false,
        ely: undefined,
        turnsAlive: 0,
        turnsAlone: 0,
        image1: [
            '     §text-red§╶┼╴§/§',
            '§text-gray text-lime§ₒ§/§─────┴╮§/§',
            '§text-gray§╰0────0╯§/§'
        ],
        image2: [
            ' §text-dark-gray§╺━┓§/§ §text-red§╶┼╴§/§',
            '§text-gray text-lime§ₒ§/§──┴──┴╮§/§',
            '§text-gray§╰0────0╯§/§'
        ],
        image3: [
            '    §text-dark-gray§╺━┓§/§ ',
            ' §text-dark-gray§╺━┓§/§ §text-red§╶┼╴§/§',
            '§text-gray text-lime§ₒ§/§──┴──┴╮§/§',
            '§text-gray§╰0────0╯§/§'
        ],
        image4: [
            '      §text-dark-gray§╻§/§   ',
            '§text-dark-gray§▄▄▄▄▄▄█▄▄§/§ ',
            '§text-dark-gray§▀▀▀▀▀████▌§/§',
            '    §text-dark-gray§╺━┓§/§ §text-gray§│§/§ ',
            ' §text-dark-gray§╺━┓§/§ §text-red§╶┼─§/§§text-gray§┘§/§ ',
            '§text-gray text-lime§ₒ§/§──┴──┴╮§/§  ',
            '§text-gray§╰0────0╯§/§  '
        ],
        turnLines: [
            'its healing time!!',
            'anyone wanna penny there was one on the ground and i picked it up and now i have it and i dont know what to do with it help',
            'did u know that healing is 10000% more effective when someone gives me a hug??',
            '§text-black text-pulse-red§♥♥♥♥♥§//§',
            'one of these days im gonna buy a pet rock and no one can stop me',
            '§text-rainbow§♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥§/§',
            'minecraft',
            'as payment for my services i require one earth worm',
            'if i had a nickel for every time i bought a tomato then realized i couldn\'t eat it, i\'d have two nickels, which isn\'t a lot, but it\'s weird that it happened twice',
            '20 dollars seems like a lot of money till u realize it isnt even enough to buy a 68 ton 1992 M1A2 Abrams main battle tank with an M256A1 120mm smoothbore gun and a Honeywell AGT1500 gas turbine engine'
        ],
        elyTurnLines: [
            'ely says if i heal good theyll take me to the among us musical',
            'i asked ely for a 68 ton 1992 M1A2 Abrams main battle tank with an M256A1 120mm smoothbore gun and a Honeywell AGT1500 gas turbine engine and she wouldnt even consider it :('
        ]
    },
    generable: false,
    difficulty: 1
});

//George
new Enemy({
    name: 'George',
    identifier: MOD_ID + 'george',
    image: [
        '§text-cotton-candy-pink§┌─┐§/§',
        '§text-ice-cream-teal§╵§text-inherit§o§/§╵§/§',
        '/|\\',
        ' | ',
        '/ \\'
    ],
    maxHealth: 100,
    doTurn: async(self) => {
        let ability = generateRandomInteger(1, 10);

        if (ability <= 4) {
            let damage = generateRandomInteger(2, 3);
            await PseudoConsole.printByChar('George smacks you with his steam deck.\n');
            await PseudoConsole.printByChar(`You take ${damage} damage.\n`);
            await PLAYER.takeDamage(damage);
        } else if (ability <= 7) {
            await PseudoConsole.printByChar('George forces you to play George\'s Platform.\n');
            let deaths = generateRandomInteger(25, 63);
            let damage = Math.floor(Math.sqrt(deaths)) - 2;
            await PseudoConsole.printByChar(`You die ${deaths} times, damaging your mental state for ${damage} damage.\n`);
            await PLAYER.takeDamage(damage);
        } else {
            let heal = generateRandomInteger(1, 3);
            await PseudoConsole.printByChar('George plays subway surfers, healing him.\n');
            await self.takeHeal(heal);
        }

        await PseudoConsole.printByChar('\nPress enter to continue...');
        await PseudoConsole.waitForEnter();
        PseudoConsole.clearLines(self.room.combatDisplayEnd.line + 1, undefined, true);
        await PseudoConsole.printByChar('\n');
    },
    die: async(self) => {
        await PseudoConsole.printByChar('\n\n' + self.name + ' has perished?');
        await wait(2000);
        await self.room.replaceCombatant(self, Enemy.createInstance('shenanigang:george_purple'));
    },
    generable: false,
    difficulty: 1
});

//George (Purple Guy)
new Enemy({
    name: '§text-bold text-purple-guy§George§//§',
    identifier: MOD_ID + 'george_purple',
    image: [
        '§text-cotton-candy-pink§┌─┐§/§',
        '§text-ice-cream-teal§╵§text-purple-guy text-bold§o§//§╵§/§',
        '§text-bold text-purple-guy§/|\\§//§',
        '§text-bold text-purple-guy§ | §//§',
        '§text-bold text-purple-guy§/ \\§//§'
    ],
    maxHealth: 100,
    doTurn: async(self) => {
        let ability = generateRandomInteger(1, 3);

        if (ability == 1) {
            let har = async(waitAmt) => { PseudoConsole.printInstant('§text-bold text-purple-guy§har §//§'); await wait(waitAmt); };
            await wait(500);
            await har(500);
            await har(350);
            await har(200);
            await har(500);
            await har(600);
            await har(350);
            await har(150);
            await har(350);
            await har(150);
            await har(500);
            await PseudoConsole.printByChar('\n\n');

            let damage = generateRandomInteger(6, 8);
            await PseudoConsole.printByChar(`You take ${damage} damage.\n`);
            await PLAYER.takeDamage(damage);
        } else if (ability == 2) {
            let damage = generateRandomInteger(4, 6);
            await PseudoConsole.printByChar(`§text-bold text-purple-guy§George consumes a portion of your soul, damaging you for ${damage} and healing himself in the process.§//§\n`);
            await PLAYER.takeDamage(damage);
            await self.takeHeal(damage);
        } else {
            await PseudoConsole.printByChar(`§text-bold text-purple-guy§George's hatred of programming grows. The code's corruption worsens.§//§\n`);
            self.DoTDamage++;
        }

        await PseudoConsole.printByChar('\nPress enter to continue...');
        await PseudoConsole.waitForEnter();
        PseudoConsole.clearLines(self.room.combatDisplayEnd.line + 1, undefined, true);
        await PseudoConsole.printByChar('\n');
    },
    onSummon: async(self) => {
        await PseudoConsole.printByChar('\n\n§text-bold text-purple-guy§I ALWAYS COME BACK§//§', 100);
        await wait(1000);

        await PseudoConsole.printByChar('§text-bold text-purple-guy§\n\nGeorge\'s hatred of programming corrupts the code. You now take damage at the start of your turn.§//§');

        let newDoTurn = async() => {
            await PseudoConsole.printByChar(`§text-bold text-purple-guy§The corrupted code deals ${self.DoTDamage} damage to you.§//§\n\n`);
            await PLAYER.takeDamage(self.DoTDamage);
            await PLAYER.doTurn();
        }
        self.room.combatTurns.queueReplaceListener(PLAYER.doTurn, newDoTurn);

        let room = self.room;
        self.disableDoT = async() => {
            await PseudoConsole.printByChar(`\n§text-bold text-purple-guy§The corrupted code ceases its attacks on you.§//§`);
            room.combatTurns.queueReplaceListener(newDoTurn, PLAYER.doTurn);
        }
    },
    takeDamage: async(self, amount) => {
        let damageReduction = generateRandomInteger(self.minDamageReduction, self.maxDamageReduction);
        let damage = Math.max(amount - damageReduction, 1);
        self.health = Math.max(self.health - damage, 0);
        await self.room.displayCombatStats();
        
        if (amount > damage) {
            let reflectedDamage = amount - damage;
            await PseudoConsole.printByChar(`\n${self.name} reflects ${reflectedDamage} damage back to you, only taking ${damage} damage.`);
            await PLAYER.takeDamage(reflectedDamage);
        }
        
        if (self.health <= 0)
            await self.die();
    },
    die: async(self) => {
        let oldRoom = self.room;
        await self.room.removeCombatant(self);

        if (oldRoom.combatants.length > 1) {
            await PseudoConsole.printByChar(`\n\nBefore ${self.name} perishes, the gang harvests his organs, increasing their max health and healing them.`);

            for (let i = 0; i < oldRoom.combatants.length; i++) {
                if (oldRoom.combatants[i] != PLAYER) {
                    oldRoom.combatants[i].maxHealth += Math.floor(100 / (oldRoom.combatants.length - 1));
                    oldRoom.combatants[i].takeHeal(Math.floor(150 / (oldRoom.combatants.length - 1)));
                }
            }
        }

        await PseudoConsole.printByChar('\n\n' + self.name + ' has perished.\n');

        await self.disableDoT();
    },
    extraProperties: {
        minDamageReduction: 2,
        maxDamageReduction: 5,
        DoTDamage: 2
    },
    generable: false,
    difficulty: 1
});

//Tenzin
new Enemy({
    name: 'Tenzin',
    identifier: MOD_ID + 'tenzin',
    image: [
        ' o ',
        '/|\\',
        ' | ',
        '/ \\'
    ],
    maxHealth: 100,
    doTurn: async(self) => {
        let room = self.room;
        if (++self.progress < self.progressNeeded) {
            await PseudoConsole.printByChar(`Tenzin works on his movie. (${self.progress}/${self.progressNeeded})\n`);
        } else {
            await PseudoConsole.printByChar(`Tenzin finishes his movie. Critics hail it as a masterpiece. It grosses billions at the box office. He asks if you'd like to watch it.\n`);
            await PseudoConsole.printByChar('  (1) Yes\n');
            await PseudoConsole.printByChar('  (2) No\n');
            let coords = await PseudoConsole.printByChar('Your choice: ');
            let input = await PseudoConsole.getIntegerInput(coords.end, 1, 2);

            if (input == 1) {
                await PseudoConsole.printByChar('\n\nYou watch Tenzin\'s magnum opus.', 75);
                await wait(1500);
                await PseudoConsole.printByChar(' §text-bold§It moves you.§/§\n', 225)
                await wait(2000)
                PLAYER.maxHealth += 200;
                await PLAYER.takeHeal(Number.MAX_SAFE_INTEGER);

                for (let i = 0; i < PLAYER.inventory.length; i++)
                    if (PLAYER.inventory[i].upgrade)
                        PLAYER.inventory.splice(i, 1, PLAYER.inventory[i].upgrade(PLAYER.inventory[i]));
            } else {
                await PseudoConsole.printByChar('\n\nYou refuse.\n', 150);
            }

            await PseudoConsole.printByChar('\nTenzin bids you farewell. He must leave to fulfill a greater purpose.\n', 45);
            await self.room.removeCombatant(self);
        }

        await PseudoConsole.printByChar('\nPress enter to continue...');
        await PseudoConsole.waitForEnter();
        PseudoConsole.clearLines(room.combatDisplayEnd.line + 1, undefined, true);
        await PseudoConsole.printByChar('\n');
    },
    extraProperties: {
        progress: 0,
        progressNeeded: 20
    },
    generable: false,
    difficulty: 1
});

//Will
new Enemy({
    name: 'Will',
    identifier: MOD_ID + 'will',
    image: [
        ' o ',
        '/|\\',
        ' | ',
        '/ \\'
    ],
    maxHealth: 100,
    doTurn: async(self) => {
        let rand = Math.random();

        if (rand < 0.45) {
            if (++self.voodooDoll >= 5) {
                await PseudoConsole.printByChar(`Will finishes crocheting, revealing a voodoo doll of you. (${self.voodooDoll}/5)\n\n`);
                self.voodooDoll = 0;
            
                await wait(500);
                let step1 = ''.concat(...self.cauldronStep1, ...self.cauldronBottom);
                let coords = PseudoConsole.printInstant(step1).start;
                await wait(250);
                PseudoConsole.clearLines(coords.line);
                let step2 = ''.concat(...self.cauldronStep2, ...self.cauldronBottom);
                PseudoConsole.printInstant(step2, coords.line).end;
                await wait(250);
                PseudoConsole.clearLines(coords.line);
                let step3 = ''.concat(...self.cauldronStep3, ...self.cauldronBottom);
                PseudoConsole.printInstant(step3, coords.line).end;
                await wait(250);
                PseudoConsole.clearLines(coords.line);
                let step4 = ''.concat(...self.cauldronStep4, ...self.cauldronBottom);
                PseudoConsole.printInstant(step4, coords.line).end;
                await wait(250);
                PseudoConsole.clearLines(coords.line);
                let step5 = ''.concat(...self.cauldronStep5, ...self.cauldronBottom);
                PseudoConsole.printInstant(step5, coords.line).end;
                await wait(250);
                PseudoConsole.clearLines(coords.line);
                let step6 = ''.concat(...self.cauldronStep6, ...self.cauldronBottom);
                PseudoConsole.printInstant(step6, coords.line).end;
                await wait(250);
                PseudoConsole.clearLines(coords.line);
                let step7 = ''.concat(...self.cauldronStep7, ...self.cauldronBottom);
                PseudoConsole.printInstant(step7, coords.line).end;
                await wait(250);
                PseudoConsole.clearLines(coords.line);
                let step8 = ''.concat(...self.cauldronStep8, ...self.cauldronBottom);
                PseudoConsole.printInstant(step8, coords.line).end;
                await wait(250);
                PseudoConsole.clearLines(coords.line);
                let step9 = ''.concat(...self.cauldronStep9, ...self.cauldronBottom);
                PseudoConsole.printInstant(step9, coords.line).end;
                await wait(250);
                PseudoConsole.clearLines(coords.line);
                let step10 = ''.concat(...self.cauldronStep10, ...self.cauldronBottom);
                PseudoConsole.printInstant(step10, coords.line).end;
                await wait(250);
                
                let damage = generateRandomInteger(20, 30);
                await PseudoConsole.printByChar(`\nYou take ${damage} damage.\n`);
                await PLAYER.takeDamage(damage);
            } else {
                await PseudoConsole.printByChar(`Will crochets something sinister. (${self.voodooDoll}/5)\n`);
            }
        } else if (rand < 0.65 && self.creatures.length > 0) {
            let index = generateRandomInteger(0, self.creatures.length - 1);
            await PseudoConsole.printByChar('Will crochets a miniature version of ' + self.creatures[index].name.slice(0, self.creatures[index].name.length - 12) + '.\n');
            await self.room.summonCombatant(Enemy.createInstance('shenanigang:crochet_creature', self.creatures[index]));
            self.creatures.splice(index, 1);
        } else {
            let damage = generateRandomInteger(3, 4);
            await PseudoConsole.printByChar('Will casts a crochet curse on you, dealing ' + damage + ' damage.\n');
            await PLAYER.takeDamage(damage);
        }

        await PseudoConsole.printByChar('\nPress enter to continue...');
        await PseudoConsole.waitForEnter();
        PseudoConsole.clearLines(self.room.combatDisplayEnd.line + 1, undefined, true);
        await PseudoConsole.printByChar('\n');
    },
    extraProperties: {
        creatures: [
            { name: 'Riley (Crocheted)' },
            { name: 'Nick (Crocheted)' },
            { name: 'Kyle (Crocheted)' }
        ],
        voodooDoll: 0,
        cauldronBottom: [
            '   §background-dark-gray§                                       §/§   \n',
            '  §background-dark-gray§                                         §/§  \n',
            '  §background-dark-gray§                                         §/§  \n',
            ' §background-dark-gray§                                           §/§ \n',
            ' §background-dark-gray§                                           §/§ \n',
            '§background-dark-gray§                                             §/§\n',
            '§background-dark-gray§                                             §/§\n',
            '§background-dark-gray§                                             §/§\n',
            ' §background-dark-gray§                                           §/§ \n',
            '  §background-dark-gray§                                         §/§  \n',
            '   §background-dark-gray§                                       §/§   \n',
            '     §background-dark-gray§                                   §/§     \n',
            '       §background-dark-gray§                               §/§       \n'
        ],
        cauldronStep1: [
                                                              '                     o                       \n',
                                                              '                    /|\\                      \n',
                                                              '                    / \\                      \n',
                                                              '                                             \n',
                                             '     §background-gray§                                   §/§     \n',
            '   §background-gray§    §background-dark-green text-lime§      ∙                ◌       §//§    §/§   \n',
            '  §background-gray§   §background-dark-green text-lime§     •             ○               §//§   §/§  \n',
            '   §background-gray§   §background-dark-green text-lime§         ◌           ●      •    §//§   §/§   \n',
                                             '    §background-gray§                                     §/§    \n',
        ],
        cauldronStep2: [
                                                              '                                             \n',
                                                              '                       o                     \n',
                                                              '                     ‾/\\                     \n',
                                                              '                     /|                      \n',
                                             '     §background-gray§                                   §/§     \n',
            '   §background-gray§    §background-dark-green text-lime§      •     ∙                  §//§    §/§   \n',
            '  §background-gray§   §background-dark-green text-lime§     ●             ◌               §//§   §/§  \n',
            '   §background-gray§   §background-dark-green text-lime§            ∙        ○      ●    §//§   §/§   \n',
                                             '    §background-gray§                                     §/§    \n',
        ],
        cauldronStep3: [
                                                              '                                             \n',
                                                              '                                             \n',
                                                              '                                             \n',
                                                              '                     >─┼o                    \n',
                                             '     §background-gray§                                   §/§     \n',
            '   §background-gray§    §background-dark-green text-lime§      ●     •                ∙ §//§    §/§   \n',
            '  §background-gray§   §background-dark-green text-lime§     ○                    ∙        §//§   §/§  \n',
            '   §background-gray§   §background-dark-green text-lime§            •        ◌      ○    §//§   §/§   \n',
                                             '    §background-gray§                                     §/§    \n',
        ],
        cauldronStep4: [
                                                              '                                             \n',
                                                              '                                             \n',
                                                              '                       |                     \n',
                                                              '                      ‾\\|                    \n',
                                             '     §background-gray§                  /o               §/§     \n',
            '   §background-gray§    §background-dark-green text-lime§      ○     ●                • §//§    §/§   \n',
            '  §background-gray§   §background-dark-green text-lime§     ◌           ∙        •        §//§   §/§  \n',
            '   §background-gray§   §background-dark-green text-lime§  ∙         ●               ◌    §//§   §/§   \n',
                                             '    §background-gray§                                     §/§    \n',
        ],
        cauldronStep5: [
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                                            '                       \\ /                   \n',
                                                           '     §background-gray§                   |               §/§     \n',
            '   §background-gray§    §background-dark-green text-lime§      ◌     ○   §text-inherit§/o\\§/§  ∙       ● §//§    §/§   \n',
            '  §background-gray§   §background-dark-green text-lime§                 •        ●        §//§   §/§  \n',
            '   §background-gray§   §background-dark-green text-lime§  •         ○         ∙          §//§   §/§   \n',
                                             '    §background-gray§                                     §/§    \n',
        ],
        cauldronStep6: [
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                           '     §background-gray§                  \\ /              §/§     \n',
            '   §background-gray§    §background-dark-green text-lime§         ∙  ◌    §text-inherit§|§/§   •       ○ §//§    §/§   \n',
            '  §background-gray§   §background-dark-green text-lime§                 ●§text-inherit§/o\\§/§          ∙   §//§   §/§  \n',
            '   §background-gray§   §background-dark-green text-lime§  ●         ◌         •          §//§   §/§   \n',
                                             '    §background-gray§                                     §/§    \n',
        ],
        cauldronStep7: [
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                           '     §background-gray§                                   §/§     \n',
            '   §background-gray§    §background-dark-green text-lime§         •      §text-inherit§\\ /§/§  ●       ◌ §//§    §/§   \n',
            '  §background-gray§   §background-dark-green text-lime§      ∙          ○ §text-inherit§|§/§           •   §//§   §/§  \n',
            '   §background-gray§   §background-dark-green text-lime§  ○                   ●     ∙    §//§   §/§   \n',
                                             '    §background-gray§                                     §/§    \n',
        ],
        cauldronStep8: [
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                           '     §background-gray§                                   §/§     \n',
            '   §background-gray§    §background-dark-green text-lime§         ●           ○   ∙     §//§    §/§   \n',
            '  §background-gray§   §background-dark-green text-lime§      •          ◌§text-inherit§\\ /§/§          ●   §//§   §/§  \n',
            '   §background-gray§   §background-dark-green text-lime§  ◌    ∙              ○     •    §//§   §/§   \n',
                                             '    §background-gray§                                     §/§    \n',
        ],
        cauldronStep9: [
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                           '     §background-gray§                                   §/§     \n',
            '   §background-gray§    §background-dark-green text-lime§         ○           ◌   •    ∙§//§    §/§   \n',
            '  §background-gray§   §background-dark-green text-lime§      ●     ∙                  ○   §//§   §/§  \n',
            '   §background-gray§   §background-dark-green text-lime§       •              ◌     ●    §//§   §/§   \n',
                                             '    §background-gray§                                     §/§    \n',
        ],
        cauldronStep10: [
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                                            '                                             \n',
                                                           '     §background-gray§                                   §/§     \n',
            '   §background-gray§    §background-dark-green text-lime§         ◌       ∙       ●    •§//§    §/§   \n',
            '  §background-gray§   §background-dark-green text-lime§      ○     •                  ◌   §//§   §/§  \n',
            '   §background-gray§   §background-dark-green text-lime§       ●              ∙     ○    §//§   §/§   \n',
                                             '    §background-gray§                                     §/§    \n',
        ]
    },
    generable: false,
    difficulty: 1
});

//Crochet Creature
new Enemy({
    name: 'Crochet Creature',
    identifier: MOD_ID + 'crochet_creature',
    image: [
        ' o ',
        '/|\\',
        '/ \\'
    ],
    maxHealth: 25,
    doTurn: async(self) => {
        let rand = generateRandomInteger(1, 3);

        if (rand < 2) {
            let damage = generateRandomInteger(self.minKickDamage, self.maxKickDamage);
            await PseudoConsole.printByChar(`${self.name.slice(0, self.name.length - 12)} kicks you for ${damage} damage.\n`);
            await PLAYER.takeDamage(damage);
        } else {
            let damage = generateRandomInteger(self.minPunchDamage, self.maxPunchDamage);
            await PseudoConsole.printByChar(`${self.name.slice(0, self.name.length - 12)} punches you for ${damage} damage.\n`);
            await PLAYER.takeDamage(damage);
        }

        await PseudoConsole.printByChar('\nPress enter to continue...');
        await PseudoConsole.waitForEnter();
        PseudoConsole.clearLines(self.room.combatDisplayEnd.line + 1, undefined, true);
        await PseudoConsole.printByChar('\n');
    },
    extraProperties: {
        minPunchDamage: 1,
        maxPunchDamage: 2,
        minKickDamage: 2,
        maxKickDamage: 3
    },
    generable: false,
    difficulty: 1
});

//Wu + Computer
new Enemy({
    name: 'Wu',
    identifier: MOD_ID + 'wu_computer',
    image: [
        ' o '  + '   §text-gray§┌──────┐§/§',
        '/|\\' + '   §text-gray§│      │§/§',
        ' | '  + '   §text-gray§└──┬┬──┘§/§',
        '/ \\' + '     §text-gray§╱__╲§/§  '
    ],
    maxHealth: 50,
    doTurn: async(self) => {
        await PseudoConsole.printByChar('Wu plays video games.\n');

        await PseudoConsole.printByChar('\nPress enter to continue...');
        await PseudoConsole.waitForEnter();
        PseudoConsole.clearLines(self.room.combatDisplayEnd.line + 1, undefined, true);
        await PseudoConsole.printByChar('\n');
    },
    takeDamage: async(self, amount) => {
        self.health = Math.max(self.health - amount, 0);
        await self.room.displayCombatStats();        
        
        if (self.health <= 0)
            await self.die();
        else {
            let randomNum = generateRandomInteger(1, 3);
            let imageChangesAtSetImage = ++self.imageChanges;
            self.image = self['image' + randomNum];
            await self.room.displayCombatStats();

            (async() => {
                await wait(self.timeBeforeImageReset * 1000);
                
                if (self.room == undefined)
                    return;
                
                if (self.imageChanges != imageChangesAtSetImage)
                    return;

                self.image = self.defaultImage;
                await self.room.displayCombatStats();
            })();
        }
    },
    die: async(self) => {
        await self.room.replaceCombatant(self, Enemy.createInstance('shenanigang:wu'));
        await PseudoConsole.printByChar('\n\nYou broke Wu\'s computer');
        await PseudoConsole.printByChar('...', 500);
        await PseudoConsole.printByChar('\n\n§text-red text-bold§He vows revenge.§//§', 150);
        await wait(2000);
    },
    extraProperties: {
        defaultImage: [
            ' o '  + '   §text-gray§┌──────┐§/§',
            '/|\\' + '   §text-gray§│      │§/§',
            ' | '  + '   §text-gray§└──┬┬──┘§/§',
            '/ \\' + '     §text-gray§╱__╲§/§  '
        ],
        image1: [
            ' o '  + '   §text-gray§┌──────┐§/§',
            '/|\\' + '   §text-gray§│  §text-dark-green§OW§/§  │§/§',
            ' | '  + '   §text-gray§└──┬┬──┘§/§',
            '/ \\' + '     §text-gray§╱__╲§/§  '
        ],
        image2: [
            ' o '  + '   §text-gray§┌──────┐§/§',
            '/|\\' + '   §text-gray§│  §text-dark-green§:(§/§  │§/§',
            ' | '  + '   §text-gray§└──┬┬──┘§/§',
            '/ \\' + '     §text-gray§╱__╲§/§  '
        ],
        image3: [
            ' o '  + '   §text-gray§┌──────┐§/§',
            '/|\\' + '   §text-gray§│ §text-dark-green§stop§/§ │§/§',
            ' | '  + '   §text-gray§└──┬┬──┘§/§',
            '/ \\' + '     §text-gray§╱__╲§/§  '
        ],
        imageChanges: 0,
        timeBeforeImageReset: 2
    },
    generable: false,
    difficulty: 1
});

//Wu
new Enemy({
    name: 'Wu',
    identifier: MOD_ID + 'wu',
    image: [
        ' o ',
        '/|\\',
        ' | ',
        '/ \\'
    ],
    maxHealth: 100,
    doTurn: async(self) => {
        let room = self.room;

        if (++self.progress < 10)
            await PseudoConsole.printByChar(`Wu works diligently. (${self.progress}/10)\n`);
        else {
            await PseudoConsole.printByChar(`Wu finishes working. (${self.progress}/10)\n`);
            await PseudoConsole.printByChar(`His final form is revealed`);
            await PseudoConsole.printByChar('...', 500);
            await self.room.replaceCombatant(self, Enemy.createInstance('shenanigang:cyber_wu'));
            await PseudoConsole.printByChar('\n\n§text-dark-green text-bold§Cyber Wu:', 50);
            await PseudoConsole.printByChar(' I WILL HAVE MY REVENGE.§//§\n', 150);
            await wait(2000);
        }

        await PseudoConsole.printByChar('\nPress enter to continue...');
        await PseudoConsole.waitForEnter();
        PseudoConsole.clearLines(room.combatDisplayEnd.line + 1, undefined, true);
        await PseudoConsole.printByChar('\n');
    },
    extraProperties: {
        progress: 0
    },
    generable: false,
    difficulty: 1
});

//Cyber Wu
new Enemy({
    name: '§text-dark-green§Cyber Wu§/§',
    identifier: MOD_ID + 'cyber_wu',
    image: [
        '§text-gray§┌───────┐§/§',
        '§text-gray§│  §text-dark-green§○_○§/§  │§/§',
        '§text-gray§└───┬───┘§/§',
        '   §text-gray§/|\\§/§  ',
         '   §text-gray§|§/§  ',
        '   §text-gray§/ \\§/§  '
    ],
    maxHealth: 100,
    doTurn: async(self) => {
        let rand = generateRandomInteger(1, 100);

        if (rand <= 30 && !self.calculated) {
            await PseudoConsole.printByChar('Wu calculates your weaknesses. His next attack is stronger.\n');            
            self.calculated = true;
        } else if (rand <= 50) {
            let imageChangesAtTimeSet = await self.setImage(self, self.imageHacker);
            await self.hack();
            await PseudoConsole.printByChar('Wu hacks the game. Your max health decreases.\n');
            await self.resetImage(self, imageChangesAtTimeSet);
            if (self.calculated) {
                self.calculated = false;
                PLAYER.maxHealth -= 7;
                await PLAYER.takeHeal(0);
            } else {
                PLAYER.maxHealth -= 4;
                await PLAYER.takeHeal(0);
            }
        } else if (rand <= 65) {
            let imageChangesAtTimeSet = await self.setImage(self, self.imageHacker);
            await self.hack();
            await PseudoConsole.printByChar('Wu hacks the game. His max health increases.\n');
            await self.resetImage(self, imageChangesAtTimeSet);
            
            if (self.calculated) {
                self.calculated = false;
                self.maxHealth += 20;
                await self.takeHeal(20);
            } else {
                self.maxHealth += 10;
                await self.takeHeal(10);
            }
        } else {
            let damage = generateRandomInteger(7, 10);
            if (self.calculated) {
                self.calculated = false;
                damage *= 2;
            }
            await PseudoConsole.printByChar('Wu steals your data and sells it to advertisers.\n');
            await PseudoConsole.printByChar(`You take ${damage} damage from the bombardment of spam.\n`);
            await PLAYER.takeDamage(damage);
        }

        await PseudoConsole.printByChar('\nPress enter to continue...');
        await PseudoConsole.waitForEnter();
        PseudoConsole.clearLines(self.room.combatDisplayEnd.line + 1, undefined, true);
        await PseudoConsole.printByChar('\n');
    },
    takeDamage: async(self, amount) => {
        self.health = Math.max(self.health - amount, 0);
        await self.room.displayCombatStats();        
        
        if (self.health <= 0) {
            await self.setImage(self, self.imageDead);
            await self.die();
        } else {
            let imageChangesAtTimeSet = await self.setImage(self, self.imageHurt);
            (async() => {
                await wait(2000);
                await self.resetImage(self, imageChangesAtTimeSet);
            })();
        }
    },
    extraProperties: {
        setImage: async(self, image) => {
            self.image = image;
            await self.room.displayCombatStats();
            return ++self.imageChanges;
        },
        resetImage: async(self, imageChangesAtTimeSet) => {
            if (self.room == undefined)
                return;
            
            if (self.imageChanges != imageChangesAtTimeSet)
                return;

            self.image = (self.health > self.maxHealth / 2) ? self.imageNormal : self.imageTired;
            await self.room.displayCombatStats();
        },
        hack: async() => {
            let lines = PseudoConsole.lines();
            let columnsByLine = [];

            for (let i = 0; i < lines.length; i++)
                columnsByLine[i] = PseudoConsole.columns(lines[i]);

            let wuHack = PseudoCSSClass.getClassFromId('wu-hack');
            let hackStepEvent = new Event('hack-step');

            let hackChar = (lineIndex, columnIndex) => {
                if (columnsByLine[lineIndex][columnIndex].hack)
                    return;

                wuHack.styleElement(columnsByLine[lineIndex][columnIndex]);

                let hackNeighbors = () => {
                    if (lineIndex < lines.length - 1)
                        hackChar(lineIndex + 1, columnIndex);
                    if (lineIndex < lines.length - 2)
                        hackChar(lineIndex + 2, columnIndex);
                    if (columnIndex < PseudoConsole.MAX_CHARS_PER_LINE - 1)
                        hackChar(lineIndex, columnIndex + 1);
                    if (columnIndex < PseudoConsole.MAX_CHARS_PER_LINE - 2)
                        hackChar(lineIndex, columnIndex + 2);
                    document.removeEventListener('hack-step', hackNeighbors);
                };
                document.addEventListener('hack-step', hackNeighbors);
            }

            hackChar(0, 0);

            while (columnsByLine[lines.length - 1][PseudoConsole.MAX_CHARS_PER_LINE - 1].hack == undefined) {
                document.dispatchEvent(hackStepEvent);
                await wait(wuHack.millisecondsPerSymbol);
            }
            while (columnsByLine[lines.length - 1][PseudoConsole.MAX_CHARS_PER_LINE - 1].hack) {
                document.dispatchEvent(hackStepEvent);
                await wait(wuHack.millisecondsPerSymbol);
            }

            await wait(1000);
        },
        imageNormal: [
            '§text-gray§┌───────┐§/§',
            '§text-gray§│  §text-dark-green§○_○§/§  │§/§',
            '§text-gray§└───┬───┘§/§',
            '   §text-gray§/|\\§/§  ',
            '   §text-gray§|§/§  ',
           '   §text-gray§/ \\§/§  '
        ],
        imageTired: [
            '§text-gray§┌───────┐§/§',
            '§text-gray§│  §text-dark-green§☼_☼§/§  │§/§',
            '§text-gray§└───┬───┘§/§',
            '   §text-gray§/|\\§/§  ',
            '   §text-gray§|§/§  ',
           '   §text-gray§/ \\§/§  '
        ],
        imageHacker: [
            '§text-gray§┌───────┐§/§',
            '§text-gray§│  §text-dark-green§▼_▼§/§  │§/§',
            '§text-gray§└───┬───┘§/§',
            '   §text-gray§/|\\§/§  ',
            '   §text-gray§|§/§  ',
           '   §text-gray§/ \\§/§  '
        ],
        imageHurt: [
            '§text-gray§┌───────┐§/§',
            '§text-gray§│  §text-dark-green§◊_◊§/§  │§/§',
            '§text-gray§└───┬───┘§/§',
            '   §text-gray§/|\\§/§  ',
            '   §text-gray§|§/§  ',
           '   §text-gray§/ \\§/§  '
        ],
        imageDead: [
            '§text-gray§┌───────┐§/§',
            '§text-gray§│  §text-dark-green§X_X§/§  │§/§',
            '§text-gray§└───┬───┘§/§',
            '   §text-gray§/|\\§/§  ',
            '   §text-gray§|§/§  ',
           '   §text-gray§/ \\§/§  '
        ],
        imageChanges: 0,
        turnsAlive: 0,
        calculated: false
    },
    generable: false,
    difficulty: 1
});

//------------------------------------------------------------------------------------------
//----------------------------------------ITEMS---------------------------------------------
//------------------------------------------------------------------------------------------

//Hot Cocoa
new Weapon({
    name: '§text-hot-cocoa§Hot Cocoa§/§',
    identifier: MOD_ID + 'hot_cocoa',
    rarity: 'Christmas',
    generable: true,
    onUse: async(self) => {
        let turnOptions = `You have ${self.hotCocoa} milliliters of hot cocoa.\n`;
        turnOptions += '(1) Heal yourself\n'
        turnOptions += '(2) Attack enemy\n'
        turnOptions += 'Your choice: ';

        let turnOptionCoords = await PseudoConsole.printByChar(turnOptions);
        let turnOption = await PseudoConsole.getIntegerInput(turnOptionCoords.end, 1, 2);

        let hotCocoaMenu = async() => {
            let hotCocoaAmountMenu = `\n\nHow much hot cocoa do you use?\n`;
            hotCocoaAmountMenu += 'Your choice: ';
            let hotCocoaCoords = await PseudoConsole.printByChar(hotCocoaAmountMenu);
            return await PseudoConsole.getIntegerInput(hotCocoaCoords.end, 0, self.hotCocoa);    
        }

        if (turnOption == 1) {
            let hotCocoaAmount = Number(await hotCocoaMenu());
            let ending = `${hotCocoaAmount} milliliters of hot cocoa.\n`;
            
            if (hotCocoaAmount <= 50)
                await PseudoConsole.printByChar('\n\nYou take a sip of ' + ending);
            else if (hotCocoaAmount <= 150)
                await PseudoConsole.printByChar('\n\nYou take a swig of ' + ending);
            else
                await PseudoConsole.printByChar('\n\nYou chug ' + ending);
            
            let overflow = (PLAYER.health + hotCocoaAmount) - PLAYER.maxHealth;
            for (let i = 0; i < overflow; i++)
                if (Math.random() < self.maxHealthChancePerOverflow)
                    PLAYER.maxHealth++;

            await PLAYER.takeHeal(hotCocoaAmount);
            self.hotCocoa -= hotCocoaAmount;
            await PseudoConsole.printByChar('You feel rejuvenated.');
        } else {
            let potentialTargets = PLAYER.room.combatants.filter(combatant => combatant instanceof Enemy);
            let attackMenu = '\n\n';
    
            let i = 0;
            potentialTargets.forEach(potentialTarget => {
                attackMenu += '(' + (++i) + ') Attack ' + potentialTarget.name + '\n';
            });
            attackMenu += 'Your choice: ';
    
            let coords = await PseudoConsole.printByChar(attackMenu);
            let choice = await PseudoConsole.getIntegerInput(coords.end, 1, i) - 1;
    
            let target = potentialTargets[choice];
            let damage = await hotCocoaMenu();
    
            await PseudoConsole.printByChar('\n\nYou splash ' + target.name + ' with your §text-hot-cocoa§Hot Cocoa§/§ for ' + damage + ' damage.');
            self.hotCocoa -= damage;
            await target.takeDamage(damage);  
        }
    },
    extraProperties: {
        onPlayerTurnStart: (self) => {
            self.hotCocoa += self.hotCocoaPerTurn;
            self.name = `§text-hot-cocoa§Hot Cocoa (${self.hotCocoa}ml)§/§`;
        },
        hotCocoa: 0,
        hotCocoaPerTurn: 25,
        maxHealthChancePerOverflow: 0.1,
        upgrade: (self) => {
            let upgradedWeapon = Weapon.createInstance(self.identifier + '+');
            upgradedWeapon.hotCocoa = self.hotCocoa;
            upgradedWeapon.name = `§text-hot-cocoa§Hot Cocoa+ (${upgradedWeapon.hotCocoa}ml)§/§`;
            return upgradedWeapon;
        }
    }
});

//Hot Cocoa+
new Weapon({
    name: '§text-hot-cocoa§Hot Cocoa+§/§',
    identifier: MOD_ID + 'hot_cocoa+',
    rarity: 'Christmas',
    generable: true,
    onUse: async(self) => {
        let turnOptions = `You have ${self.hotCocoa} milliliters of hot cocoa.\n`;
        turnOptions += '(1) Heal yourself\n'
        turnOptions += '(2) Attack enemy\n'
        turnOptions += 'Your choice: ';

        let turnOptionCoords = await PseudoConsole.printByChar(turnOptions);
        let turnOption = await PseudoConsole.getIntegerInput(turnOptionCoords.end, 1, 2);

        let hotCocoaMenu = async() => {
            let hotCocoaAmountMenu = `\n\nHow much hot cocoa do you use?\n`;
            hotCocoaAmountMenu += 'Your choice: ';
            let hotCocoaCoords = await PseudoConsole.printByChar(hotCocoaAmountMenu);
            return await PseudoConsole.getIntegerInput(hotCocoaCoords.end, 0, self.hotCocoa);    
        }

        if (turnOption == 1) {
            let hotCocoaAmount = await hotCocoaMenu();
            let ending = `${hotCocoaAmount} milliliters of hot cocoa.\n`;
            
            if (hotCocoaAmount <= 50)
                await PseudoConsole.printByChar('\n\nYou take a sip of ' + ending);
            else if (hotCocoaAmount <= 150)
                await PseudoConsole.printByChar('\n\nYou take a swig of ' + ending);
            else
                await PseudoConsole.printByChar('\n\nYou chug ' + ending);
            
            let overflow = (PLAYER.health + Number(hotCocoaAmount)) - PLAYER.maxHealth;
            for (let i = 0; i < overflow; i++)
                if (Math.random() < self.maxHealthChancePerOverflow)
                    PLAYER.maxHealth++;

            await PLAYER.takeHeal(hotCocoaAmount);
            self.hotCocoa -= hotCocoaAmount;
            await PseudoConsole.printByChar('You feel rejuvenated.');
        } else {
            let potentialTargets = PLAYER.room.combatants.filter(combatant => combatant instanceof Enemy);
            let attackMenu = '\n\n';
    
            let i = 0;
            potentialTargets.forEach(potentialTarget => {
                attackMenu += '(' + (++i) + ') Attack ' + potentialTarget.name + '\n';
            });
            attackMenu += 'Your choice: ';
    
            let coords = await PseudoConsole.printByChar(attackMenu);
            let choice = await PseudoConsole.getIntegerInput(coords.end, 1, i) - 1;
    
            let target = potentialTargets[choice];
            let damage = await hotCocoaMenu();
    
            await PseudoConsole.printByChar('\n\nYou splash ' + target.name + ' with your §text-hot-cocoa§Hot Cocoa+§/§ for ' + damage + ' damage.');
            self.hotCocoa -= damage;
            await target.takeDamage(damage);
        }
    },
    extraProperties: {
        onPlayerTurnStart: (self) => {
            self.hotCocoa += self.hotCocoaPerTurn;
            self.name = `§text-hot-cocoa§Hot Cocoa+ (${self.hotCocoa}ml)§/§`;
        },
        hotCocoa: 0,
        hotCocoaPerTurn: 50,
        maxHealthChancePerOverflow: 0.15,
    }
});

//Candy Cane Crossbows
new Weapon({
    name: '§text-candy-cane text-candy-cane-0 /§Candy Cane Crossbows§/§',
    identifier: MOD_ID + 'candy_cane_crossbows',
    rarity: 'Chrismas',
    generable: true,
    onUse: async(self) => {
        let potentialTargets = PLAYER.room.combatants.filter(combatant => combatant instanceof Enemy);
        let attackMenu1 = 'Choose your first target:\n';

        let i = 0;
        potentialTargets.forEach(potentialTarget => {
            attackMenu1 += '(' + (++i) + ') ' + potentialTarget.name + '\n';
        });
        attackMenu1 += 'Your choice: ';

        let coords1 = await PseudoConsole.printByChar(attackMenu1);
        let choice1 = await PseudoConsole.getIntegerInput(coords1.end, 1, i) - 1;

        let attackMenu2 = '\n\nChoose your second target:\n';

        let j = 0;
        potentialTargets.forEach(potentialTarget => {
            attackMenu2 += '(' + (++j) + ') ' + potentialTarget.name + '\n';
        });
        attackMenu2 += 'Your choice: ';

        let coords2 = await PseudoConsole.printByChar(attackMenu2);
        let choice2 = await PseudoConsole.getIntegerInput(coords2.end, 1, i) - 1;

        let target1 = potentialTargets[choice1];
        let target2 = potentialTargets[choice2];
        let damage1 = generateRandomInteger(self.minDamage, self.maxDamage);
        let damage2 = generateRandomInteger(self.minDamage, self.maxDamage);

        await PseudoConsole.printByChar('\n\nYou shoot ' + target1.name + ' with a candy cane for ' + damage1 + ' damage.');
        await target1.takeDamage(damage1);

        if (target1 != target2 || target1.room != undefined) {
            await PseudoConsole.printByChar('\n\nYou shoot ' + target2.name + ' with a candy cane for ' + damage2 + ' damage.');
            await target2.takeDamage(damage2);
        }
    },
    extraProperties: {
        minDamage: 20,
        maxDamage: 30,
        upgrade: (self) => {
            return Weapon.createInstance(self.identifier + '+');
        }
    }
});

//Candy Cane Crossbows+
new Weapon({
    name: '§text-candy-cane text-candy-cane-0 /§Candy Cane Crossbows+§/§',
    identifier: MOD_ID + 'candy_cane_crossbows+',
    rarity: 'Chrismas',
    generable: true,
    onUse: async(self) => {
        let potentialTargets = PLAYER.room.combatants.filter(combatant => combatant instanceof Enemy);
        let attackMenu1 = 'Choose your first target:\n';

        let i = 0;
        potentialTargets.forEach(potentialTarget => {
            attackMenu1 += '(' + (++i) + ') ' + potentialTarget.name + '\n';
        });
        attackMenu1 += 'Your choice: ';

        let coords1 = await PseudoConsole.printByChar(attackMenu1);
        let choice1 = await PseudoConsole.getIntegerInput(coords1.end, 1, i) - 1;

        let attackMenu2 = '\n\nChoose your second target:\n';
        let j = 0;
        potentialTargets.forEach(potentialTarget => {
            attackMenu2 += '(' + (++j) + ') ' + potentialTarget.name + '\n';
        });
        attackMenu2 += 'Your choice: ';

        let coords2 = await PseudoConsole.printByChar(attackMenu2);
        let choice2 = await PseudoConsole.getIntegerInput(coords2.end, 1, j) - 1;

        let attackMenu3 = '\n\nChoose your third target:\n';
        let k = 0;
        potentialTargets.forEach(potentialTarget => {
            attackMenu3 += '(' + (++k) + ') ' + potentialTarget.name + '\n';
        });
        attackMenu3 += 'Your choice: ';

        let coords3 = await PseudoConsole.printByChar(attackMenu3);
        let choice3 = await PseudoConsole.getIntegerInput(coords3.end, 1, k) - 1;

        let target1 = potentialTargets[choice1];
        let target2 = potentialTargets[choice2];
        let target3 = potentialTargets[choice3];
        let damage1 = generateRandomInteger(self.minDamage, self.maxDamage);
        let damage2 = generateRandomInteger(self.minDamage, self.maxDamage);
        let damage3 = generateRandomInteger(self.minDamage, self.maxDamage);

        await PseudoConsole.printByChar('\n\nYou shoot ' + target1.name + ' with a candy cane for ' + damage1 + ' damage.');
        await target1.takeDamage(damage1);

        if (target1 != target2 || target1.room != undefined) {
            await PseudoConsole.printByChar('\n\nYou shoot ' + target2.name + ' with a candy cane for ' + damage2 + ' damage.');
            await target2.takeDamage(damage2);
        }

        if ((target1 != target3 || target1.room != undefined) && (target2 != target3 || target3.room != undefined)) {
            await PseudoConsole.printByChar('\n\nYou shoot ' + target3.name + ' with a candy cane for ' + damage3 + ' damage.');
            await target3.takeDamage(damage3);
        }
    },
    extraProperties: {
        minDamage: 30,
        maxDamage: 40
    }
});

//Ornament Artillery
new Weapon({
    name: '§text-christmas text-christmas-0 /§Ornament Artillery§/§',
    identifier: MOD_ID + 'ornament_artillery',
    rarity: 'Christmas',
    generable: true,
    onUse: async(self) => {
        let combatants = PLAYER.room.combatants;
        let potentialTargetIndices = []

        for (let i = 0; i < combatants.length; i++)
            if (combatants[i] instanceof Enemy)
                potentialTargetIndices.push(i);

        let attackMenu = '';
        let i = 0;
        potentialTargetIndices.forEach(potentialTargetIndex => {
            attackMenu += '(' + (++i) + ') Target ' + combatants[potentialTargetIndex].name + '\n';
        });
        attackMenu += 'Your choice: ';

        let coords = await PseudoConsole.printByChar(attackMenu);
        let choice = await PseudoConsole.getIntegerInput(coords.end, 1, i) - 1;

        let targetIndex = potentialTargetIndices[choice]
        let targetColumn = (targetIndex - 1) % 2;

        let adjacentTargets = [];
        let diagonalTargets = [];

        if (targetColumn == 0) {
            if (combatants[targetIndex - 2] && combatants[targetIndex - 2] instanceof Enemy)
                adjacentTargets.push(combatants[targetIndex - 2]);
            if (combatants[targetIndex + 1] && combatants[targetIndex + 1] instanceof Enemy)
                adjacentTargets.push(combatants[targetIndex + 1]);
            if (combatants[targetIndex + 2] && combatants[targetIndex + 2] instanceof Enemy)
                adjacentTargets.push(combatants[targetIndex + 2]);
            if (combatants[targetIndex - 1] && combatants[targetIndex - 1] instanceof Enemy)
                diagonalTargets.push(combatants[targetIndex - 1]);
            if (combatants[targetIndex + 3] && combatants[targetIndex + 3] instanceof Enemy)
                diagonalTargets.push(combatants[targetIndex + 3]);
        } else {
            if (combatants[targetIndex - 1] && combatants[targetIndex - 1] instanceof Enemy)
                adjacentTargets.push(combatants[targetIndex - 1]);
            if (combatants[targetIndex - 2] && combatants[targetIndex - 2] instanceof Enemy)
                adjacentTargets.push(combatants[targetIndex - 2]);
            if (combatants[targetIndex + 2] && combatants[targetIndex + 2] instanceof Enemy)
                adjacentTargets.push(combatants[targetIndex + 2]);
            if (combatants[targetIndex - 3] && combatants[targetIndex - 3] instanceof Enemy)
                diagonalTargets.push(combatants[targetIndex - 3]);
            if (combatants[targetIndex + 1] && combatants[targetIndex + 1] instanceof Enemy)
                diagonalTargets.push(combatants[targetIndex + 1]);
        }

        {
            let target = combatants[targetIndex];
            let damage = generateRandomInteger(self.minTargetDamage, self.maxTargetDamage);
            await PseudoConsole.printByChar('\n\nYou hit ' + target.name + ' with an ornament for ' + damage + ' damage.');
            await target.takeDamage(damage);
        }

        for (let i = 0; i < adjacentTargets.length; i++) {
            let damage = generateRandomInteger(self.minAdjAOEDamage, self.maxAdjAOEDamage);
            await PseudoConsole.printByChar('\n\nYou hit ' + adjacentTargets[i].name + ' with an ornament for ' + damage + ' damage.');
            await adjacentTargets[i].takeDamage(damage);
        }

        for (let i = 0; i < diagonalTargets.length; i++) {
            let damage = generateRandomInteger(self.minDiagAOEDamage, self.maxDiagAOEDamage);
            await PseudoConsole.printByChar('\n\nYou hit ' + diagonalTargets[i].name + ' with an ornament for ' + damage + ' damage.');
            await diagonalTargets[i].takeDamage(damage);
        }
    },
    extraProperties: {
        minTargetDamage: 15,
        maxTargetDamage: 25,
        minAdjAOEDamage: 10,
        maxAdjAOEDamage: 14,
        minDiagAOEDamage: 6,
        maxDiagAOEDamage: 8,
        upgrade: (self) => {
            return Weapon.createInstance(self.identifier + '+');
        }
    }
});

//Ornament Artillery+
new Weapon({
    name: '§text-christmas text-christmas-0 /§Ornament Artillery+§/§',
    identifier: MOD_ID + 'ornament_artillery+',
    rarity: 'Christmas',
    generable: true,
    onUse: async(self) => {
        let combatants = PLAYER.room.combatants;
        let potentialTargetIndices = []

        for (let i = 0; i < combatants.length; i++)
            if (combatants[i] instanceof Enemy)
                potentialTargetIndices.push(i);

        let attackMenu = '';
        let i = 0;
        potentialTargetIndices.forEach(potentialTargetIndex => {
            attackMenu += '(' + (++i) + ') Target ' + combatants[potentialTargetIndex].name + '\n';
        });
        attackMenu += 'Your choice: ';

        let coords = await PseudoConsole.printByChar(attackMenu);
        let choice = await PseudoConsole.getIntegerInput(coords.end, 1, i) - 1;

        let targetIndex = potentialTargetIndices[choice]
        let targetColumn = (targetIndex - 1) % 2;

        let adjacentTargets = [];
        let diagonalTargets = [];

        if (targetColumn == 0) {
            if (combatants[targetIndex - 2] && combatants[targetIndex - 2] instanceof Enemy)
                adjacentTargets.push(combatants[targetIndex - 2]);
            if (combatants[targetIndex + 1] && combatants[targetIndex + 1] instanceof Enemy)
                adjacentTargets.push(combatants[targetIndex + 1]);
            if (combatants[targetIndex + 2] && combatants[targetIndex + 2] instanceof Enemy)
                adjacentTargets.push(combatants[targetIndex + 2]);
            if (combatants[targetIndex - 1] && combatants[targetIndex - 1] instanceof Enemy)
                diagonalTargets.push(combatants[targetIndex - 1]);
            if (combatants[targetIndex + 3] && combatants[targetIndex + 3] instanceof Enemy)
                diagonalTargets.push(combatants[targetIndex + 3]);
        } else {
            if (combatants[targetIndex - 1] && combatants[targetIndex - 1] instanceof Enemy)
                adjacentTargets.push(combatants[targetIndex - 1]);
            if (combatants[targetIndex - 2] && combatants[targetIndex - 2] instanceof Enemy)
                adjacentTargets.push(combatants[targetIndex - 2]);
            if (combatants[targetIndex + 2] && combatants[targetIndex + 2] instanceof Enemy)
                adjacentTargets.push(combatants[targetIndex + 2]);
            if (combatants[targetIndex - 3] && combatants[targetIndex - 3] instanceof Enemy)
                diagonalTargets.push(combatants[targetIndex - 3]);
            if (combatants[targetIndex + 1] && combatants[targetIndex + 1] instanceof Enemy)
                diagonalTargets.push(combatants[targetIndex + 1]);
        }

        {
            let target = combatants[targetIndex];
            let damage = generateRandomInteger(self.minTargetDamage, self.maxTargetDamage);
            await PseudoConsole.printByChar('\n\nYou hit ' + target.name + ' with an ornament for ' + damage + ' damage.');
            await target.takeDamage(damage);
        }

        for (let i = 0; i < adjacentTargets.length; i++) {
            let damage = generateRandomInteger(self.minAdjAOEDamage, self.maxAdjAOEDamage);
            await PseudoConsole.printByChar('\n\nYou hit ' + adjacentTargets[i].name + ' with an ornament for ' + damage + ' damage.');
            await adjacentTargets[i].takeDamage(damage);
        }

        for (let i = 0; i < diagonalTargets.length; i++) {
            let damage = generateRandomInteger(self.minDiagAOEDamage, self.maxDiagAOEDamage);
            await PseudoConsole.printByChar('\n\nYou hit ' + diagonalTargets[i].name + ' with an ornament for ' + damage + ' damage.');
            await diagonalTargets[i].takeDamage(damage);
        }
    },
    extraProperties: {
        minTargetDamage: 32,
        maxTargetDamage: 52,
        minAdjAOEDamage: 22,
        maxAdjAOEDamage: 30,
        minDiagAOEDamage: 14,
        maxDiagAOEDamage: 18
    }
});

//Gingerbread Greatsword
new Weapon({
    name: '§text-gingerbread-greatsword§Gingerbread Greatsword§/§',
    identifier: MOD_ID + 'gingerbread_greatsword',
    rarity: 'Christmas',
    generable: true,
    onUse: async(self) => {
        let potentialTargets = PLAYER.room.combatants.filter(combatant => combatant instanceof Enemy);
        let attackMenu = '';

        let i = 0;
        potentialTargets.forEach(potentialTarget => {
            attackMenu += '(' + (++i) + ') Attack ' + potentialTarget.name + '\n';
        });
        attackMenu += 'Your choice: ';

        let coords = await PseudoConsole.printByChar(attackMenu);
        let choice = await PseudoConsole.getIntegerInput(coords.end, 1, i) - 1;

        let target = potentialTargets[choice];
        let minDamage = self.baseMinDamage + Math.ceil(self.totalDamageDealt * self.damageBuffPerDamageDealt);
        let maxDamage = self.baseMaxDamage + Math.ceil(self.totalDamageDealt * self.damageBuffPerDamageDealt);
        let damage = generateRandomInteger(minDamage, maxDamage);
        self.totalDamageDealt += damage;
        let lifesteal = Math.ceil(damage * self.lifestealPercent);

        await PseudoConsole.printByChar('\n\nYou attack ' + target.name + ' with your ' + self.name + ' for ' + damage + ' damage.');
        await target.takeDamage(damage);

        await PseudoConsole.printByChar('\nYour ' + self.name + ' heals you for ' + lifesteal + ' health.');
        await PLAYER.takeHeal(lifesteal);

        let swordColorClass = PseudoCSSClass.getClassFromId('text-gingerbread-greatsword');
        let progressPercentage = self.totalDamageDealt / self.damageDealtForFullRed;
        swordColorClass.greatswordColor.r = Math.max(Math.ceil(self.defaultGreatswordColor.r + ((255 - self.defaultGreatswordColor.r) * progressPercentage)), 0);
        swordColorClass.greatswordColor.g = Math.max(Math.ceil(self.defaultGreatswordColor.g + ((0 - self.defaultGreatswordColor.g) * progressPercentage)), 0);
        swordColorClass.greatswordColor.b = Math.max(Math.ceil(self.defaultGreatswordColor.b + ((0 - self.defaultGreatswordColor.b) * progressPercentage)), 0);
    },
    extraProperties: {
        baseMinDamage: 40,
        baseMaxDamage: 50,
        lifestealPercent: 1/3,
        totalDamageDealt: 0,
        damageBuffPerDamageDealt: 0.03,
        damageDealtForFullRed: 1000,
        defaultGreatswordColor: { r: 194, g: 100, b: 12 },
        upgrade: (self) => {
            let upgradedWeapon = Weapon.createInstance(self.identifier + '+');
            upgradedWeapon.totalDamageDealt = self.totalDamageDealt;
            return upgradedWeapon;
        }
    }
});

//Gingerbread Greatsword+
new Weapon({
    name: '§text-gingerbread-greatsword text-bold text-gingerbread-greatsword-outline§Gingerbread Greatsword+§///§',
    identifier: MOD_ID + 'gingerbread_greatsword+',
    rarity: 'Christmas',
    generable: true,
    onUse: async(self) => {
        let potentialTargets = PLAYER.room.combatants.filter(combatant => combatant instanceof Enemy);
        let attackMenu = '';

        let i = 0;
        potentialTargets.forEach(potentialTarget => {
            attackMenu += '(' + (++i) + ') Attack ' + potentialTarget.name + '\n';
        });
        attackMenu += 'Your choice: ';

        let coords = await PseudoConsole.printByChar(attackMenu);
        let choice = await PseudoConsole.getIntegerInput(coords.end, 1, i) - 1;

        let target = potentialTargets[choice];
        let minDamage = self.baseMinDamage + Math.ceil(self.totalDamageDealt * self.damageBuffPerDamageDealt);
        let maxDamage = self.baseMaxDamage + Math.ceil(self.totalDamageDealt * self.damageBuffPerDamageDealt);
        let damage = generateRandomInteger(minDamage, maxDamage);
        self.totalDamageDealt += damage;
        let lifesteal = Math.ceil(damage * self.lifestealPercent);

        await PseudoConsole.printByChar('\n\nYou attack ' + target.name + ' with your ' + self.name + ' for ' + damage + ' damage.');
        await target.takeDamage(damage);

        await PseudoConsole.printByChar('\nYour ' + self.name + ' heals you for ' + lifesteal + ' health.');
        await PLAYER.takeHeal(lifesteal);

        let swordColorClass = PseudoCSSClass.getClassFromId('text-gingerbread-greatsword');
        let progressPercentage = self.totalDamageDealt / self.damageDealtForFullRed;
        swordColorClass.greatswordColor.r = Math.min(Math.ceil(self.defaultGreatswordColor.r + ((255 - self.defaultGreatswordColor.r) * progressPercentage)), 255);
        swordColorClass.greatswordColor.g = Math.max(Math.ceil(self.defaultGreatswordColor.g + ((0 - self.defaultGreatswordColor.g) * progressPercentage)), 0);
        swordColorClass.greatswordColor.b = Math.max(Math.ceil(self.defaultGreatswordColor.b + ((0 - self.defaultGreatswordColor.b) * progressPercentage)), 0);
    
        if (self.totalDamageDealt > self.damageDealtForFullRed) {
            let darkRedProgressPercentage = (self.totalDamageDealt - self.damageDealtForFullRed) / (self.damageDealtForDarkRed - self.damageDealtForFullRed);
            swordColorClass.greatswordColor.r = Math.max(Math.ceil(255 + ((50 - 255) * darkRedProgressPercentage)), 50);

            let outlineClass = PseudoCSSClass.getClassFromId('text-gingerbread-greatsword-outline');
            outlineClass.outlinePercent = Math.min((0.01 * darkRedProgressPercentage), 0.01);
        }
    },
    extraProperties: {
        baseMinDamage: 50,
        baseMaxDamage: 60,
        lifestealPercent: 1/3,
        totalDamageDealt: 0,
        damageBuffPerDamageDealt: 0.08,
        damageDealtForFullRed: 1000,
        damageDealtForDarkRed: 2500,
        defaultGreatswordColor: { r: 194, g: 100, b: 12 },
    }
});

//Merry Machine Gun
new Weapon({
    name: '§text-dark-gray text-bold§Merry Machine Gun§//§',
    identifier: MOD_ID + 'merry_machine_gun',
    rarity: 'Christmas',
    generable: true,
    onUse: async(self) => {
        await PseudoConsole.printByChar('You fire your ' + self.name + '.');
        await wait(100);

        let potentialTargets = PLAYER.room.combatants.filter(combatant => combatant instanceof Enemy);
        for (let i = 0; i < self.shots; i++) {
            if (Math.random() < Math.max(0.10, self.baseMissChance * Math.pow(self.missChanceModifier, PLAYER.room.combatants.length - 2)))
                continue;

            let target = potentialTargets[generateRandomInteger(0, potentialTargets.length - 1)];

            if (!target.room)
                continue;

            let damage = generateRandomInteger(self.minDamage, self.maxDamage);
            await PseudoConsole.printByChar('\n\nYou shot ' + target.name + ' for ' + damage + ' damage.');
            await target.takeDamage(damage);
        }
    },
    extraProperties: {
        minDamage: 6,
        maxDamage: 18,
        baseMissChance: 0.75,
        missChanceModifier: 0.8,
        shots: 10,
        upgrade: (self) => {
            return Weapon.createInstance(self.identifier + '+');
        }
    }
});

//Merry Machine Gun+
new Weapon({
    name: '§text-dark-gray text-bold§Merry Machine Gun+§//§',
    identifier: MOD_ID + 'merry_machine_gun+',
    rarity: 'Christmas',
    generable: true,
    onUse: async(self) => {
        await PseudoConsole.printByChar('You fire your ' + self.name + '.');
        await wait(100);

        let potentialTargets = PLAYER.room.combatants.filter(combatant => combatant instanceof Enemy);
        for (let i = 0; i < self.shots; i++) {
            if (Math.random() < Math.max(0.10, self.baseMissChance * Math.pow(self.missChanceModifier, PLAYER.room.combatants.length - 2)))
                continue;

            let target = potentialTargets[generateRandomInteger(0, potentialTargets.length - 1)];

            if (!target.room)
                continue;

            let damage = generateRandomInteger(self.minDamage, self.maxDamage);
            await PseudoConsole.printByChar('\n\nYou shot ' + target.name + ' for ' + damage + ' damage.');
            await target.takeDamage(damage);
        }
    },
    extraProperties: {
        minDamage: 15,
        maxDamage: 30,
        baseMissChance: 0.65,
        missChanceModifier: 0.75,
        shots: 15
    }
});

//------------------------------------------------------------------------------------------
//-----------------------------------------TEXT---------------------------------------------
//------------------------------------------------------------------------------------------

new PseudoCSSClass('text-lapras-blue', {
    styleElement: (self, element) => { element.style.color = 'rgb(88, 181, 222)' }
});
new PseudoCSSClass('text-cotton-candy-pink', {
    styleElement: (self, element) => { element.style.color = 'rgb(255, 133, 206)'; }
});
new PseudoCSSClass('text-ice-cream-teal', {
    styleElement: (self, element) => { element.style.color = 'rgb(147, 245, 245)'; }
});
new PseudoCSSClass('text-purple-guy', {
    styleElement: (self, element) => { element.style.color = 'rgb(132, 37, 147)'; }
});
new PseudoCSSClass('text-ely-purple', {
    styleElement: (self, element) => { element.style.color = 'rgb(172, 140, 213)'; }
});
new PseudoCSSClass('text-hot-cocoa', {
    styleElement: (self, element) => { element.style.color = 'rgb(170, 130, 105)'; }
});
new PseudoCSSClass('text-gingerbread-greatsword', {
    styleElement: (self, element) => { element.style.color = `rgb(${self.greatswordColor.r}, ${self.greatswordColor.g}, ${self.greatswordColor.b})`; },
    extraProperties: { greatswordColor: { r: 194, g: 100, b: 12 } }
});
new PseudoCSSClass('text-gingerbread-greatsword-outline', {
    styleElement: (self, element) => { element.style.webkitTextStroke = String(Number(element.parentElement.style.fontSize.slice(0, -2)) * self.outlinePercent) + 'px red'; },
    extraProperties: { outlinePercent: 0 }
});
new PseudoCSSClass('text-chest-brown', {
    styleElement: (self, element) => { element.style.color = 'rgb(115, 65, 0)'; }
});

new PseudoCSSClass('text-fade-for-goodbye', {
    styleElement: (self, element) => {
        element.style.opacity = 1.1 - (self.charCount++ / self.totalChars);
    },
    onRemoval: (self) => {
        self.charCount = 0;
    },
    extraProperties: { totalChars: 77, charCount: 0 }
});

new PseudoCSSClass('background-dark-green-faded', {
    styleElement: (self, element) => { element.style.backgroundColor = 'rgb(0, 64, 0)'; }
});

new PseudoCSSClass('wu-hack', {
    styleElement: (self, element) => {
        let content = element.textContent;
        let color = element.style.color;
        let backgroundColor = element.style.backgroundColor;
        element.style.color = 'rgb(0, 128, 0)';
        element.style.backgroundColor = 'rgb(0, 0, 0)';
        element.hack = true;

        let timesChanged = 0;
        let changeSymbol = () => {
            element.textContent = self.symbolArray[generateRandomInteger(0, self.totalWeight - 1)];

            if (++timesChanged >= self.symbolsToDisplay) {
                document.removeEventListener('hack-step', changeSymbol);
                element.textContent = content;
                element.style.color = color;
                element.style.backgroundColor = backgroundColor;
                element.hack = undefined;
            }
        };
        document.addEventListener('hack-step', changeSymbol);
    },
    onInitialize: (self) => {
        self.totalWeight = 0;
        for (let i = 0; i < self.symbols.length; i++)
            self.totalWeight += self.symbols[i].weight;

        self.symbolArray = new Array(self.totalWeight);
        let firstEmptyIndex = 0;
        for (let i = 0; i < self.symbols.length; i++)
            for (let j = 0; j < self.symbols[i].weight; j++)
                self.symbolArray[firstEmptyIndex++] = self.symbols[i].symbol;
    },
    extraProperties: {
        symbolsToDisplay: 70,
        millisecondsPerSymbol: 16,
        symbols: [
            { symbol: '0', weight: 50 },
            { symbol: '1', weight: 50 },
            { symbol: ' ', weight: 300 },
            { symbol: '█', weight: 30 },
            { symbol: '/', weight: 2 },
            { symbol: '\\', weight: 2 },
            { symbol: '#', weight: 2 },
            { symbol: '^', weight: 2 },
            { symbol: '&', weight: 2 },
            { symbol: '*', weight: 2 },
            { symbol: '~', weight: 2 },
            { symbol: '-', weight: 2 },
            { symbol: '$', weight: 2 },
            { symbol: '<', weight: 1 },
            { symbol: '>', weight: 1 },
            { symbol: '+', weight: 1 },
            { symbol: '=', weight: 1 },
            { symbol: '!', weight: 1 },
            { symbol: '@', weight: 1 },
            { symbol: '%', weight: 1 },
            { symbol: '_', weight: 1 },
            { symbol: '(', weight: 1 },
            { symbol: ')', weight: 1 },
            { symbol: '{', weight: 1 },
            { symbol: '}', weight: 1 },
            { symbol: '[', weight: 1 },
            { symbol: ']', weight: 1 }
        ]
    }
});

}