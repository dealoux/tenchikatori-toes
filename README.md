# [Tenchikatori ~ Testament of Empyrean Songbird](https://ennacord.github.io/tenchikatori-toes/)
- An [Enna Alouette](https://www.youtube.com/channel/UCR6qhsLpn62WVxCBK1dkLow?sub_confirmation=1) themed danmaku fangame prototype.

## Gameplay Guide

| Key | Description |
|---------|-------------|
| `W`, `Up arrow` | Move Up |
| `S`, `Down arrow` | Move Down |
| `A`, `Left arrow` | Move Left |
| `D`, `Right arrow` | Move Right |
| `J`, `Z`, `Enter` | Shoot, Confirm |
| `K`. `X` | Special Ability |
| `C`, `L` | Switch Shield |
| `Shift` | Focus Mode |
| `Esc` | Pause |

- There are `2` types of enemies bullet with corresponding shield types for the player: `Red` and `Blue`.
- The player will be immune to either of the bullet type by equipping the corresponding shield colour.
- The player's current shield type is being indicated by a coloured card under the status bar.
- Stage 1: A prototype stage with multiple enemies, a boss, dialogs.
- Stage 2: Endless stage with 2 respawning enemies.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Builds project and open web server, watching for changes |
| `npm run build` | Builds code bundle with production settings  |
| `npm run serve` | Run a web server to serve built code bundle |

## Development

After cloning the repo, run `npm install` from your project directory. Then, you can start the local development
server by running `npm run dev` and navigate to localhost.

## Production

After running `npm run build`, the files you need for production will be on the `dist` folder. To the build, run `npm run serve` and navigate to localhost

## Important Links

- Game Engine: [Phaser 3](https://newdocs.phaser.io/docs/) 
- Examples: [Phaser 3 examples](http://labs.phaser.io/index.html).

A product of [EnnaCord](https://discord.gg/enna).
