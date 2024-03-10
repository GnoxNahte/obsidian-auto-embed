# obsidian-auto-embed
 Obsidian plugin to help embed links using markdown instead of iframe
 
## Features
Auto embeds popular websites like YouTube, Twitter, and Steam. 

### Set Custom Options

### Supported websites:
- YouTube
- Twitter
- Reddit (Has some resizing bugs)
- CodePen
- Steam

### Setting the format for the content in markdown link 
Try not to modify this unless you want to:
- Embed all links by default. [See FAQ](https://github.com/GnoxNahte/obsidian-auto-embed/edit/main/README.md#can-i-make-it-embed-all-links)
- Or want to change how the markdown looks in `Source Mode` and `Live Preview` mode

The plugin uses the text inside the markdown `[text](example.com)` to identify whether a link should be embedded or not. So try to make it unique to prevent the plugin from embedding other links unintentionally. It's also used to set your [options](https://github.com/GnoxNahte/obsidian-auto-embed/edit/main/README.md#set-custom-options). 

This text will only show up in `Source Mode` and `Live Preview`. In `Reading Mode`, it'll show the embed result (iframe)

Some examples when url="https://www.youtube.com/watch?v=DbsAQSIKQXk&t=468s", options="dark-mode"
| Format | Result | Remarks |
| ---  | --- | --- | 
| `embed:{{options}}` | `embed:dark-mode` | embed: Don't need {{url}}, its just for you to know where the link points to in Live preview |
| `embed:{{url}}\|{{options}}` | `embed:https://www.youtube.com/watch?v=DbsAQSIKQXk&t=468s\|dark-mode` | Default format |
| `embed:{{url}}, {{options}}` | `embed:https://www.youtube.com/watch?v=DbsAQSIKQXk&t=468s\, dark-mode` | Changed `\|` with `,` |
| `customText-{{options}}` | `customText-dark-mode` | Don't need to start with "embed:"
| `{{options}}` | `dark-mode ` | Don't need any text at all, only options. However, this means that **ALL** links will be embedded (except those with `noembed`). 
|  |  | No format, not recommended as all links will be embedded and there's no options.

TLDR: 
- Don't need any specific text (But is better to prevent embedding other links unintentionally)
- `{{url}}` is optional
- But `{{options}}` is required if you want to have custom options for each link

Note: You can put other text other than your format. For example, 
- When `Markdown Link Format = "embed:{{options}}"`, 
- Markdown can be `[Video explaining how to use Obsidian embed:](https://www.youtube.com/watch?v=DbsAQSIKQXk&t=468s)`
- This means you can still describe your link and see it in `Live Preview`

## How it works
- When you paste a link, it suggests to embed the link
- If you accept, it replaces the markdown with the markdown format

## TODO
- [ ] Instead of the quite complicated markdown try doing something like: [Embed Web Pages](https://help.obsidian.md/Editing+and+formatting/Embed+web+pages) - `![](link)`. Can check for some other special character like '@' to avoid conflict
- [ ] Add support for embedding non-supported websites. But only do when task above ^ task is done.
- [ ] Add support for other websites (Suggest some examples?)
	- [ ] Google Maps
	- [ ] Google Docs
	- [ ] Google Calendar
	- [ ] Notion 
	- [ ] Other websites. [Iframely](https://iframely.com/domains) has a list of websites that are embeddable.
- [ ] Add tests
- [ ] Updated Readme.md
	- [ ]  Add images / gifs to show examples
 	- [ ]  Add installation instructions
- [ ]  Submit to Obsidian plugin directory?

### Current Limitations & Known Bugs 
- **Reddit**: Incorrect resizing of Reddit embeds when there are multiple Reddit embeds. 
- **Spotify**: Only able to play 30 seconds of a song. Spotify only allows when the user is logged in the browser, which is not possible in Obsidian. 

## Frequently asked questions
### The embed isn't appearing
Are you in [Editor Mode](https://help.obsidian.md/Editing+and+formatting/Edit+and+preview+Markdown#Editor+views)? The plugin only works in Reading Mode. Click the book icon on the upper right to change to Reading Mode.
### Can I make it embed all links?
Yes! This is the mode I use too. It's disabled at the start to prevent confusion to those who aren't what happened to their vaults. 

To enable it, 
- Go to `Settings -> Auto Embed -> Show Advanced Settings` 
- Then in `Markdown link format`, replace it with `{{options}}`
Done! 

This will only embed on [links that the plugin supports](https://github.com/GnoxNahte/obsidian-auto-embed/edit/main/README.md#supported-websites)

To disable embedding on a specific link, put `noembed` in the markdown. Example: `[noembed](example.com)`

# Support
If you have any questions, suggestions or issues feel free to [create a issue](https://github.com/GnoxNahte/obsidian-auto-embed/issues/new) or contact me!
Email - gnoxnahte@gmail.com
Discord - https://discordapp.com/users/222261096738717696 

If this plugin helped you and want to support it's development, consider supporting me at [ko-fi](https://ko-fi.com/gnoxnahtedev)