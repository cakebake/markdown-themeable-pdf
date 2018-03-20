# image tests

## emoji

:blush: `:blush:`  :smiley: `:smiley:`  :relaxed: `:relaxed:`
:smirk: `:smirk:`  :heart_eyes: `:heart_eyes:`  :kissing_heart: `:kissing_heart:`
:kissing_closed_eyes: `:kissing_closed_eyes:`  :flushed: `:flushed:`  :relieved: `:relieved:`
:satisfied: `:satisfied:`  :grin: `:grin:`  :wink: `:wink:`
:stuck_out_tongue_winking_eye: `:stuck_out_tongue_winking_eye:`  :stuck_out_tongue_closed_eyes: `:stuck_out_tongue_closed_eyes:`  :grinning: `:grinning:` 
:kissing: `:kissing:`  :kissing_smiling_eyes: `:kissing_smiling_eyes:`  :stuck_out_tongue: `:stuck_out_tongue:`
:sleeping: `:sleeping:`  :worried: `:worried:`  :frowning: `:frowning:`
:anguished: `:anguished:`  :open_mouth: `:open_mouth:`  :grimacing: `:grimacing:`
:confused: `:confused:`  :hushed: `:hushed:`  :expressionless: `:expressionless:`
:unamused: `:unamused:`  :sweat_smile: `:sweat_smile:`  :sweat: `:sweat:`
:disappointed_relieved: `:disappointed_relieved:`  :weary: `:weary:`  :pensive: `:pensive:`
:disappointed: `:disappointed:`  :confounded: `:confounded:`  :fearful: `:fearful:`
:cold_sweat: `:cold_sweat:`  :persevere: `:persevere:`  :cry: `:cry:`

## local src

normal

![example](./img/example.png)

normal 404

![does not exist](./img/not-found.png)

normal with size definition

![example-2](./img/example-2.jpg =100x200)

white space and specials Üäßbn - ubå

![white space and specials Üäßbn - ubå](./img/white space and specials Üäßbn - ubå.jpg)

html image

<img src="./img/example.png" alt="html image" />

html 404

<img src="./img/not-found.png" alt="html does not exist" />

## external src

normal

![external image](http://placehold.it/900x250/000/FFF)

html image

<img src="http://placehold.it/900x250/f3330b/fff" alt="IMG EXTERNAL" />
