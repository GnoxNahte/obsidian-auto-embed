# Changelog
<!--
Template

## [1.2.x](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.2.x) (2025-01-21)

**New Features & Improvements:**
- [Feature request X](https://github.com/GnoxNahte/obsidian-auto-embed/issues/X): Add...
- Add...

**Bugs Fixed:**
- Fix [Issue X](https://github.com/GnoxNahte/obsidian-auto-embed/issues/X): Fix...

Things to remember:
- Change version (On Markdown title and markdown link)
- Change date
- Add & remove all features, improvements, bugs
- Try to check all the links link to a valid location
-->

## [1.2.4](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.2.4) (2024-10-28)
**Bugs Fixed:**
- Fix [Issue 20](https://github.com/GnoxNahte/obsidian-auto-embed/issues/20#issuecomment-2551178504): Ignore embedding svg.

## [1.2.4](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.2.4) (2024-10-28)

**Bugs Fixed:**
- Fix [Issue 19](https://github.com/GnoxNahte/obsidian-auto-embed/issues/19): Add better support for detecting urls
- Fix [Issue 20](https://github.com/GnoxNahte/obsidian-auto-embed/issues/20): Add better support for detecting images that the plugin shouldn't embed.

## [1.2.3](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.2.3) (2024-10-23)

**New Features & Improvements:**
- [Feature request 17](https://github.com/GnoxNahte/obsidian-auto-embed/issues/17): Add support for Instagram.
- Minor changes to README

## [1.2.2](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.2.2) (2024-09-26)

**New Features & Improvements:**
- Add a feature to fetch the link title automatically and set it for the title (Only for fallback embeds)
- Add [issue templates](https://github.com/GnoxNahte/obsidian-auto-embed/issues/new/choose) to make it easier to fill in information for the feature/bug
- Created [discussions](https://github.com/GnoxNahte/obsidian-auto-embed/discussions) to ask questions on how to use the plugin freely, without affecting the issues tab. (If you aren't sure if it is a bug, just ask in discussions. Can be shifted to an issue if needed)

**Bugs Fixed:**
- Fix bug when web images don't appear sometimes

## [1.2.1](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.2.1) (2024-09-19)
Since there are a lot of changes, please report any bugs!

**New Features & Improvements:**
- [Feature request 15](https://github.com/GnoxNahte/obsidian-auto-embed/issues/15): Add support for twitter profile timelines.

**Bugs Fixed:**
- Add padding for fallback embed link (external link below embed)
- Fix [Issue 8](https://github.com/GnoxNahte/obsidian-auto-embed/issues/8) where it crashes the note when `Preload options` is `Placeholder + Click to load` AND `Fallback options` is `Show Error Message`.
- Fix [Issue 9](https://github.com/GnoxNahte/obsidian-auto-embed/issues/9) where embeds aren't collapsing when in a bullet list.
- Fix [Issue 10](https://github.com/GnoxNahte/obsidian-auto-embed/issues/10) and [Issue 11](https://github.com/GnoxNahte/obsidian-auto-embed/issues/11). Slightly change where the embed is placed. Fixes issues like the embed breaking bullet points, or 'eating' the last character. However, this might cause more bugs, so create new issues whenever you find them!
- Fix [Issue 14](https://github.com/GnoxNahte/obsidian-auto-embed/issues/14). Don't embed web images. It might show the placeholder for a split second but it should hide it quite quickly.
- Don't embed x.com on Obsidian versions 1.7.0 and above. [Obsidian changelog 1.7.0](https://obsidian.md/changelog/2024-08-08-desktop-v1.7.0/)

## [1.2.0](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.2.0) (2024-09-07)
Incrementing minor version. Added and fixed most of the features and bugs to make a proper plugin. 

Since there are a lot of changes, please report any bugs!

**New Features & Improvements:**
- [Feature request 7](https://github.com/GnoxNahte/obsidian-auto-embed/issues/7) Add placeholders for websites. It has a 'click to load' mode too. This should greatly improve [Content Layout Shifts](https://web.dev/articles/cls). <br />
	Thanks to [@Rikiub](https://github.com/Rikiub) for suggesting it!
- Add Imgur album support. (Album has `/a/` instead of `/gallery/` in the URL)
- Add options to disable selected websites
- Add option for suggesting to embed links

**Bugs Fixed:**
- Fix the cursor going to the side of the embed when navigating the cursor to the character immediately after the embed/markdown link. 

## [1.1.3](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.1.3) (2024-07-18)

**Bugs Fixed:**
- Fix note embedding when it's in a list. From [issue 6](https://github.com/GnoxNahte/obsidian-auto-embed/issues/6)

## [1.1.2](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.1.2) (2024-07-17)

**New Features & Improvements:**
- Notion websites is supported! Though I just realised that it was supported all along. Notion doesn't have any special things to do when it's embedded so the notion website is just embedded by itself without any modifications. Never really used Notion so I didn't realise it. The website still needs to be public as you can't sign in Obsidian though.
- Cache the size for websites that are dynamically sized like Reddit, Imgur, Twitter/X, TikTok. It should set the height as soon as the iframe loads, reducing [Cumulative Layout Shift](https://web.dev/articles/cls) after the first time you open the note. Also fixes [this issue](https://github.com/GnoxNahte/obsidian-auto-embed/issues/4)

**Bugs Fixed:**
- Fix the bug where the plugin embeds Obsidian's internal links/images which shouldn't happen. From [issue 5](https://github.com/GnoxNahte/obsidian-auto-embed/issues/5)

## [1.1.1](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.1.1) (2024-07-13)

**New Features & Improvements:**
- Add SoundCloud embed support from [feature request](https://github.com/GnoxNahte/obsidian-auto-embed/issues/3)
- Add TikTok embed support from [feature request](https://github.com/GnoxNahte/obsidian-auto-embed/issues/4)

**Bugs Fixed:**
- Fix reddit embeds not resizing correctly when there are multiple reddit embeds appearing on the same page.

## [1.1.0](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.1.0) (2024-07-07)

Increment minor version because the features for the fallback (unsupported websites) embed is mostly done.

**New Features & Improvements:**
- Add support to set the fallback embed link text from the previous update. Set it by using the alt text or in the settings.

**Bugs Fixed:**
- Fix fallback embed not resizing correctly when there is [custom sizes](https://github.com/GnoxNahte/obsidian-auto-embed/tree/main#all-options).

## [1.0.7](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.0.7) (2024-06-08)

**New Features & Improvements:**
- Add an option to have a link below the default fallback embed. Helps with easily opening the link in the browser for further and more in depth viewing.

## [1.0.6](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.0.6) (2024-06-08)

**New Features & Improvements:**
- Add support for embedding Google Docs.

**Bugs Fixed:**
- Fix a bug when the plugin overrides Obsidian whenever there is an image url (urls ending with image extensions like .png or .jpg) which results in the image not being sized correctly. Now it should behave like the [docs](https://help.obsidian.md/Linking+notes+and+files/Embed+files#Embed+an+image+in+a+note).

## [1.0.5](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.0.5) (2024-05-04)

**New Features & Improvements:**
- Add size options for fallback embed (for unsupported links that are marked to embed)

## [1.0.4](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.0.4) (2024-04-12)

**New Features & Improvements:**
- Add [CHANGELOG](https://github.com/GnoxNahte/obsidian-auto-embed/blob/main/CHANGELOG.md)
- Add "Auto Embed: Add embed" and "Auto Embed: Mark to Embed" command. 

## [1.0.3](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.0.3) (2024-04-05)

**New Features & Improvements:**
- Update README.md

**Bugs Fixed:**
- Prevent normal links from embedding. Now it doesn't embed "[](link)", but still embeds "![](link)
- Fix bug when options don't apply when embedding unsupported links.

## [1.0.2](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.0.2) (2024-03-28)

**Bugs Fixed:**
- Minor changes:
    - Spotify: Treat artists as playlists / albums
    - Codepen: Allow hyphens in usernames
    - Clean code
- Fix issues from Obsidian's pull request code review. For adding the plugin to Obsidian's plugin directory

## [1.0.1](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.0.1) (2024-03-25)

**Bugs Fixed:**
- Fix preview embed in setting not working
- Clean up development files, moving all to a src folder

## [1.0.0](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.0.0) (2024-03-25) - First release!

**Features:**
- Creating embeds by pasting links
- Supports: 
    - X 
    - Reddit
    - Imgur
    - CodePen
    - Steam 
    - Spotify
- Adding custom options:
    - noembed
    - set width
    - set height


<!-- Template
DO THIS, DON'T COPY: 
REPLACE 1.0.x (link title and url tree link) AND DATE

## [1.0.x](https://github.com/GnoxNahte/obsidian-auto-embed/tree/1.0.x) (2024-xx-xx)

**New Features & Improvements:**
- 

**Bugs Fixed:**
- 
-->
