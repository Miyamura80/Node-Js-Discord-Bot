**Node JS Discord Bot**


![my discord server](https://img.shields.io/discord/452917471817760788?label=my%20server&logo=discord&style=for-the-badge)
![Follow me on github](https://img.shields.io/github/followers/miyamura80?style=for-the-badge)
![fork this repo](https://img.shields.io/github/forks/miyamura80/Node-Js-Discord-Bot?color=%23058ed9&style=for-the-badge)
![watch this repo](https://img.shields.io/github/watchers/miyamura80/Node-Js-Discord-Bot?color=058ed9&style=for-the-badge)
![license](https://img.shields.io/github/license/miyamura80/Node-Js-Discord-Bot?color=058ed9&style=for-the-badge)
![repo size](https://img.shields.io/github/repo-size/miyamura80/Node-Js-Discord-Bot?color=058ed9&style=for-the-badge)

This bot was designed with augmenting my own original campaign on dungeons and dragons, a tabletop role playing game.  

Before you start, you must add a `config.json` file to the root directory, which may look something like the following:


config.json
```json
{
	"prefix": "!",
	"token": "your token here",
	"passwords_array": ["pass1", "pass2", "pass3", "pass4"],
	"secret_passcodes": {
		"sp1": 12414,
		"sp2": 19183
	}
}
```

To run the discord bot, install [Node JS](https://nodejs.org/en/download/) and run `node index.js` in the directory.
