image tests
===========

emoji
-----

:blush: `:blush:`

<div class="page-break"></div>

local src
---------

local normal

![example](./img/example.png)

local normal 404

![does not exist](./img/not-found.png)

local normal with size definition

![example 100x100](./img/example.png =100x100)

local html image

<img src="./img/example.png" alt="html image" />

local html 404

<img src="./img/not-found.png" alt="html does not exist" />

<div class="page-break"></div>

external src
------------

external normal

![external image](http://placehold.it/100x100/000/FFF)

external html image

<img src="http://placehold.it/100x100/f3330b/fff" alt="external html image" />
