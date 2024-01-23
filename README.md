# Game name - undecided

This game Is a tower defence game on roblox that is actively being worked on. 

This game was made using the Rojo framework alongside Roblox-ts which compiles typescript into luau (language used by Roblox), (used because luau doesn't provide proper type checking, with typescript being supported better in IDEs), and also Roact (A UI framework made for Roblox in the style of React)

I've taught myself to structure my code reading other Roblox creators' public repositories. I am making this repository public in case someone like me is trying to make a similar game. If you're able to learn anything, I'm happy!

# Motivation for starting

I started developing this game as I thought that traditional tower defence games lacked lots of strategies that could make the game more interesting.

# process of development

the game is still in development, and in the process of developing, I learned many things, in common with the first game I developed. I learned the typescript programming language, a language based on JavaScript that includes type checking. I used algorithms such as binary trees and structured the code modularly.

# Code Explanation

All codes by me are stored in the src folder. The code is written in typescript, and Roblox-ts compiles it into lua, then Rojo transfers the code to roblox studio.

All code is in typescript, though executed in lua.

Roact, a Roblox version of React is used to crete guis.

Knit, a Client-Server communication library, is used to manage Client-Server communication without the direct use of remote events and to make it easier to manage data.

.client.ts is a PlayerScript, in which only the client is affected

.server.ts is a ServerScript, in which everything is affected

.ts is a ModuleScript, in which it can affect things based on the executor of the code

There aren't many comments on the code, as its names are self-explanatory, but still created an explanation in this page to explain how it is structured as a whole

## ReplicatedStorage

Data and modules available to both the client and server are stored in ReplicatedStorage.

Gui, Traits, Mob, Tower, and Map Data are stored in ReplicatedStorage.

- Game

The GuiAssets.tsx file is for GUI components in Roact, in JSX syntax.

Traits.ts file is for the Trait instance, which users gain throughout the playthrough

- Maps

All files in this file are for storing data of each map in the game

- Mobs

MobMechanics.ts creates the mechanic for Mob instances (spawning, movement, health, etc.) As the game gets further into development, mobs will be just like towers, with each mob having a unique power.

- Towers

All files in this folder are for storing data of each tower in the game. Since each tower has a unique mechanics,

TowerMechanics.ts creates the mechanic for Tower instances (finding the best target, level, stats, etc.)

- Data

The data.ts file manages the game data. This code is fairly short since it utilizes a very efficient table system that Roblox provides, which tables unless cloned, are a reference to a single table and not a separate one from other tables pointing to the same data.

## ServerScriptService

- Modules

BaseManager.ts manages the player's base's health.

CoinManager.ts manages the player's coins.

MapManager.ts manages loading maps and placing them in the correct place, utilizing the Maps file in ReplicatedStorage.

MobManager.ts manages mob behaviour, spawning, despawning, giving damage to, and moving them, utilizing the Mobs file in ReplicatedStorage.

ShopManager.ts used to manage the shop, but the shop is currently gone.

TowerManager.ts manages placing, upgrading, selling, and changing the tower, along with attacking them.

TraitsManager.ts manages choosing traits, and invoking them at the right time.

WaveManager.ts manages each wave, determining how many and how strong the mobs are going to be, by assigning weights and a degree of randomness.

- Game

In this part, I will explain the execution process of the game code.

All server-side codes are ultimately done in this file (Game.server.ts).

(The players join the lobby of the game first, a different codebase that isn't public yet, then gets sent to this instance) When the player joins the game, it sends a signal to the server once loaded.
Then, the server sets up a knit service to communicate and creates an instance of the player, which manages player data and executes code whenever the player sends a signal to it.

The game updates every 0.1 seconds (Tower Attacks, movement, etc) and sends data to the client every 0.5 seconds (coin, health, etc)

## StarterPlayer
