# obsidian-auto-embed
 Obsidian plugin to help embed links using markdown instead of iframe
 
## Features
Auto embeds popular websites like YouTube, Twitter, and Steam. 

### Supported websites:
- YouTube
- Twitter
- Reddit (Has some resizing bugs)
- CodePen
- Steam

## Tasks
### TODO:
- [ ] Let users choose when they want to embed the link. Maybe can be similar to obsidian's [Embed Web Pages](https://help.obsidian.md/Editing+and+formatting/Embed+web+pages) - `![](link)`. Can check for some other special character like '@' to avoid conflict
- [ ] Add support for embedding non-supported websites. But only do when task above ^ task is done.
- [ ] Add support for other websites (Suggest some examples?)
- [ ] Add tests
- [ ] Updated Readme.md
	- [ ]  Add images / gifs to show examples
 	- [ ]  Add installation instructions
- [ ]  Submit to Obsidian plugin directory?

### Known Bugs: 
- [ ] Incorrect resizing of Reddit embeds when multiple Reddit embeds;

Credits:
- Based on [Simple Embeds](https://github.com/samwarnick/obsidian-simple-embeds/blob/main/README.md) but since I couldn't get it to work since its deprecated, I built my own. Most of the code and embedding implementation is quite different in the end anyway.
