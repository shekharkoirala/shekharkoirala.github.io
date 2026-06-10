---
title: Create your own Blog Post
date: 2020-05-31T14:17:54+05:45
tags:
  - Blog
categories:
  - Random
author: shekhar
layout: layouts/post.njk
---

## Introduction
I want to create a Blog. But there are some conditions that I want:
1. Easy/simple to create
2. The UI should match my style.
3. Based on Git, for future reference.
<!--more-->

I chosed Hugo. because it is based on MarkDown. 
### Why MarkDown:
* Markdown is simple to learn, with minimal extra characters, so it’s also quicker to write content.
* Less chance of errors when writing in Markdown.
* Produces valid XHTML output.
* Keeps the content and the visual display separate, so you cannot mess up the look of your site.
* Write in any text editor or Markdown application you like.
* Markdown is a joy to use

### Why Hugo:
Hugo is created based on [go](https://golang.org/). A respected and fast programming language. 
So, the technology stack is nice. beside that, it is based on Markdown. There are few alternatives of Hugo.
Like [pelican](https://github.com/getpelican/pelican), based on Python: No hard feelings.  
I found a lots of prebuilt themes, which make the boring task easy.

and you know what , when I know what hugo can do. 
I need 
* proper code formatting in the blog
* proper user commenting in each posts
* google analytics
* animation stuff
* tags 
* categories
* search

------ blah blah , and I dont need write any html and css. That's awesome. 
## Installation
Lets start the work. 
1. Install Hugo:

For other OS : 
[Install Hugo](https://gohugo.io/getting-started/installing/)
```shell script
brew install hugo
```
2. create space:

The naming of folder all yours 
```shell script
hugo new site personalBlog
cd personalBlog
```
3. Add Theme
Luckily, hugo has huge collection of [themes](https://themes.gohugo.io/).
Mine one is based on theme: [loveit](https://themes.gohugo.io/loveit/)
```shell script
git init
git submodule add https://github.com/dillonzq/LoveIt.git themes/loveit
```
4. Add a new post
```shell script
hugo new posts/my_post.md
```
yeah , its that easy.
## Configuration
To start the server. lets fix a-little default config.

open `config.toml` in one of the text editor and add this configs there. 

```shell script
baseURL = "http://example.org/"
# [en, zh-cn, fr, ...] determines default content language
defaultContentLanguage = "en"
# language code
languageCode = "en"
title = "My New Hugo Site"

# Change the default theme to be use when building the site with Hugo
theme = "LoveIt"

[params]
  # LoveIt theme version
  version = "0.2.X"

[menu]
  [[menu.main]]
    identifier = "posts"
    # you can add extra information before the name (HTML format is supported), such as icons
    pre = ""
    # you can add extra information after the name (HTML format is supported), such as icons
    post = ""
    name = "Posts"
    url = "/posts/"
    # title will be shown when you hover on this menu link
    title = ""
    weight = 1
  [[menu.main]]
    identifier = "tags"
    pre = ""
    post = ""
    name = "Tags"
    url = "/tags/"
    title = ""
    weight = 2
  [[menu.main]]
    identifier = "categories"
    pre = ""
    post = ""
    name = "Categories"
    url = "/categories/"
    title = ""
    weight = 3

# Markup related configuration in Hugo
[markup]
  # Syntax Highlighting (https://gohugo.io/content-management/syntax-highlighting)
  [markup.highlight]
    # false is a necessary configuration (https://github.com/dillonzq/LoveIt/issues/158)
    noClasses = false

```
Now lets server the site , and check in [localhost:1313](localhost:1313)
```shell script
hugo serve
```
### Preview
Does it look like this ?
![preview](/images/site-preview.png)
May be you ask where is the profile in the homepage ? In order to enable that
```shell script
  # Home page config
  [params.home]
    # LoveIt NEW | 0.2.0 amount of RSS pages
    rss = 10
    # Home page profile
    [params.home.profile]
      enable = true
      # Gravatar Email for preferred avatar in home page
      gravatarEmail = ""
      # URL of avatar shown in home page
      avatarURL = "/images/avatar.png"
      # LoveIt CHANGED | 0.2.7 title shown in home page (HTML format is supported)
      title = ""
      # subtitle shown in home page
      subtitle = "Personal Blog / Scribbles"
      # whether to use typeit animation for subtitle
      typeit = true
      # whether to show social links
      social = true
      # LoveIt NEW | 0.2.0 disclaimer (HTML format is supported)
      disclaimer = ""
    # Home page posts
    [params.home.posts]
      enable = true
      # special amount of posts in each home posts page
      paginate = 6
      # LoveIt DELETED | 0.2.0 replaced with hiddenFromHomePage in params.page
      # default behavior when you don't set "hiddenFromHomePage" in front matter
      defaultHiddenFromHomePage = false
```

More configs can be found here: [site-configurations](https://hugoloveit.com/theme-documentation-basics/#site-configuration) 
## Deployment
Now lets share what we have created here. But to do that we need to create static site from this markdown.
Because only static site is get hosted on the github. No worries, all handled by Hugo.

Create a repo in the github based on your `<username>/github.io` and add it as submodule in the folder.
```shell script
git submodule add -b master https://github.com/<username>/<username>.github.io.git public
```
As, suggested by our mighty Hugo, create a `deploy.sh` file and it here.
```shell script
#!/bin/sh

# If a command fails then the deploy stops
set -e

printf "\033[0;32mDeploying updates to GitHub...\033[0m\n"

# Build the project.
hugo -t loveit # if using a theme, replace with `hugo -t <YOURTHEME>`

# Go To Public folder
cd public

# Add changes to git.
git add .

# Commit changes.
msg="rebuilding site $(date)"
if [ -n "$*" ]; then
	msg="$*"
fi
git commit -m "$msg"

# Push source and build repos.
git push origin master

```
Basically, it generate static site push the code to github. make sure everything working.Now make the script executable.
```shell script
chmod +x deploy.sh
```
```shell script
./deploy.sh "Your optional commit message"
```
Done ... !!!
checkthe site at `<username>.github.io`

## Future
We have created a site , but we are not satisfied yet. yeah i know.
* google analytics : Done

![preview](/images/ganalytics.png)

* Facebook Comments : Done
* Agolia Search : Done
* Add Jupyter notebooks in the blog.
* Using custom domain for the site.

I will look into this topic pretty soon and update in the post. 


## References
### Hugo
* [Install Hugo](https://gohugo.io/getting-started/installing/)
* [Quickstart Hugo](https://gohugo.io/getting-started/quick-start/)
* [Host Hugo in github](https://gohugo.io/hosting-and-deployment/hosting-on-github/)
* [Proper summaries of Blog](https://gohugo.io/content-management/summaries/)
* [Hugo themes](https://themes.gohugo.io/)

### loveit
* [main site Loveit](https://hugoloveit.com/)
* [loveit Docs](https://hugoloveit.com/categories/documentation/)
* [Real world inpiring Example: loveit](https://tyrangyang.github.io/)

### markdown
* [markdown syntax](https://learn.getgrav.org/16/content/markdown)

Add comments to support this Blog. 

