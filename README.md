# Issue tracker
App for tracking issues like on Trello.

Hopefully working:tm: example at: http://issues-dirivial.vercel.app/

## Issues I am aware of but probably won't fix
### Loading times.
This is a big issue with the site, and I can't do too much about it since I'm not hosting it myself.
I'm currently using https://railway.app/ for the server/db and https://vercel.com/ for hosting the frontend. I know that at least railway has their servers in the US (no clue about Vercel, but probably the same). Performance will therefore vary greatly on where you are. I will also blame create-react-app for including so many packages :).

To fix this somewhat I should add loading animations but to be honest, I want to move on to another project.

## Note to the user
I'm not encrypting your mail address (I do, however, encrypt passwords), do with that information as you will.

## To any developer reading this
I would personally recommend avoiding Axios, Create-react-app and Javascript in favor of the normal fetch, next.js or remix and TypeScript. Axios felt unnecessary after looking at fetch. Create-react-app seems bloated with packages at the moment, and people seem to have a hard time ejecting (which I then chose to not do). TypeScript will probably allow you to write better code, so go for that.

### Colorscheme
I've used the color scheme gruvbox, because I like it. I used the following repo to get the colors <br>
https://github.com/morhetz/gruvbox

