# PropsCoin
You achieved something remarkable and want my very own, personal, intimate recognition? 

Leave an issue with your metamask wallet public address and I'll gladly prop the hell out of you!!

**Important note: Only true while fantom fees remain cheap, if it ever gets even near ethereum fees this might (definitely won't) be true anymore.**

## Faucet
You haven't done anything truly remarkable but still wanna feel the prop power? Ikr, everyone wants that...

Fortunately, everyone is entitled to **1 PRP**!! Just go to the faucet and claim it!!

[Get propped, now!](https://getproppedm8.herokuapp.com/)

## Failures
Well, unfortunately there's some stuff that could be largely better. 

The main one I've found so far was that I could have **added an event to the contract that would be emitted on the ``getPropped`` function.**

This would have allowed me to answer to that event on the frontend and trigger the event that happens (not spoiling it) only then.

Another thing **would be ``wasPropped`` not checking the current balance** since that breaks the desired effect of giving **PRP** to any non-holder.

A holder that got rid of the coin (which is now possible since there's liquidity for this on Spookyswap) shouldn't be able to reclaim it using the faucet!

I'll add this improvements as commentaries on the solidity contract soon!

## Motivation
I wanted to give Solidity a try, so I did! 
Of course this is a super simple project that barely scratched anything interesting, but it's a start. 💯

## Tech
If you're curious about any of the tech used, some of it wasn't optimal, but here's my take on each choice.

### Blockchain: Fantom
This was definitely a solid pick. The fees are incredibly cheap at the moment and the process for deploying doesn't really seems to be affected by the chain you choose (as long as it's solidity at least). 

Also, Fantom is great overall so it definitely deserved some attention. Any solidity projects I have coming up will probably be developed there.

### Dapp: Rails 🤷‍♂️
I'm not particularly experienced with Vue/React so I thought I would choose something I am familiar with...

BUTTT, server-side rendering definitely lacks a bit to interact with blockchains since you will end up using mostly JS anyway.

I used mostly Stimulus.js to handle all the interactions with my view but it definitely wasn't an optimal choice. This brings Vue.js to my learnlist and I might remake the Dapp as a learning experience!
