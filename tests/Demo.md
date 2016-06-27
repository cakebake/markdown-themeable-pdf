An h1 header
============

Paragraphs are separated by a blank line.

New line... Some changes... :)

2nd paragraph. *Italic*, **bold**, and `monospace`. Itemized lists look like:

-	this one
-	that one
-	the other one

Note that --- not considering the asterisk --- the actual text content starts at 4-columns in.

Convert arrows like `-->` or `==>` to --> or ==>

```
--> →
<-- ←
<--> ↔
==> ⇒
<== ⇐
<==> ⇔
```

> Block quotes are written like so.
>
> They can span multiple paragraphs, if you like.

Use 3 dashes for an em-dash. Use 2 dashes for ranges (ex., "it's all in chapters 12--14"). Three dots ... will be converted to an ellipsis. Unicode is supported. ☺

Write a todo list
-----------------

-	[ ] Step 1
-	[x] Step 1
-	[x] Step 1

<div class="page-break"></div>

An h2 header
------------

Here's a numbered list:

1.	first item
2.	second item
3.	third item

Here's a code sample:
---------------------

```bash
#!/bin/bash

###### CONFIG
ACCEPTED_HOSTS="/root/.hag_accepted.conf"
BE_VERBOSE=false

if [ "$UID" -ne 0 ]
then
 echo "Superuser rights required"
 exit 2
fi

genApacheConf(){
 echo -e "# Host ${HOME_DIR}$1/$2 :"
}
```

(which makes copying & pasting easier). You can optionally mark the delimited block for Pandoc to syntax highlight it:

```python
import time
# Quick, count to ten!
for i in range(10):
    # (but not *too* quick)
    time.sleep(0.5)
    print i
```

<div class="page-break"></div>

### An h3 header

Now a nested list:

1.	First, get these ingredients:

	-	carrots
	-	celery
	-	lentils

2.	Boil some water.

3.	Dump everything in the pot and follow this algorithm:

	```
	find wooden spoon
	uncover pot
	stir
	cover pot
	balance wooden spoon precariously on pot handle
	wait 10 minutes
	goto first step (or shut off burner when done)
	```

	Do not bump wooden spoon or it will fall.

Notice again how text always lines up on 4-space indents (including that last line which continues item 3 above).

Here's a link to [a website](http://foo.bar).

> Move the following to next page with `<div class="page-break"></div>`.

<div class="page-break"></div>

Some Headlines.

Headline 1
==========

Headline 2
----------

### Headline 3

#### Headline 4

##### Headline 5

###### Headline 6

<div class="page-break"></div>

Tables can look like this:

| Lorem ipsum                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Lorem ipsum       | Lorem ipsum dolor |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------|-------------------|
| Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. | lorem ipsum dolor | hello world       |
| Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. | lorem ipsum dolor | hello world       |
| Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. | lorem ipsum dolor | hello world       |

<div class="page-break"></div>

### External image

```
![external image](http://placehold.it/900x250/000/FFF)
```

![external image](http://placehold.it/900x250/000/FFF)

### Local image

Local image with relative path.

```
![local image](example.png)
```

![local image](example.png)

<div class="page-break"></div>

And note that you can backslash-escape any punctuation characters which you wish to be displayed literally, ex.: \`foo\`, \*bar\*, etc.

Anbei testen wir ein paar Umlaute und Sonderzeichen...

> Äußerst schön verändert

Chinese lorem ipsum

> 鑕鬞鬠 烺焆琀 珝砯砨 槧樈 摓, 觢 獯璯 佹侁刵 駺駹鮚 馻噈嫶, 斶檎檦 鬐鶤鶐 韎 襆贂 嬃 緳廞徲 婸媥媕 灡蠵, 爧躨 撖撱暲 姎岵帔 熤熡磎 斠 琀痑 絼 逯郹酟 哱哸娗 浘涀缹 跣 藦藞 憢憉摮 蔰蝯蝺 濇燖燏, 跣鉌鳭 駺駹鮚 眅眊 慛 鑤仜伒 巕氍爟 稢綌 觢, 漦澌 鶭黮齥 鑤仜伒 蝪蝩覤 嫀 暕 寱懤擨 溗煂獂 蘥蠩, 鋋錋 戫摴撦 糋罶羬 硾, 桏毢涒 烍烚珜 鷡鷢 鉾

<div class="page-break"></div>

Testing some HTML code
----------------------

Image with relative path...

```
<img src="../tests/example.png" alt="Image with relative path" />
```

<img src="../tests/example.png" alt="IMG RELATIVE" />

<br /><br>

Image external...

```
<img src="http://placehold.it/900x250/f3330b/fff" alt="Image external" />
```

<img src="http://placehold.it/900x250/f3330b/fff" alt="IMG EXTERNAL" />
