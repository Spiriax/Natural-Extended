# Natural Extended
## v0.9 - 20 June, 2026

Natural Extended is designed for users who want more control over character responses in SillyTavern group chats. With this extension, you can specify a word or phrase that will make specific characters respond, as well as unique words or phrases that will force everybody to respond.

Once installed, Natural Extended adds an Enable checkbox inside Group Controls:

<img width="635" height="379" alt="image" src="https://github.com/user-attachments/assets/47c8b059-2853-4b71-a0bb-2407b477c67b" />

When Natural Extended is enabled, a row for each character with two fields will be created:

<img width="633" height="124" alt="image" src="https://github.com/user-attachments/assets/70339c37-c77e-465c-9a7b-e673f73af06e" />

Here is how a simple setup might look like. These characters will respond to any of the words mentioned on the left, as long as the words or phrases to the right aren't mentioned:

<img width="638" height="133" alt="image" src="https://github.com/user-attachments/assets/48d41598-b0d6-4019-8537-1926d8786d34" />
<img width="635" height="116" alt="image" src="https://github.com/user-attachments/assets/202e3370-97de-4e22-99f9-c37a8ba5695f" />

(I added "chief" in Tifa's ignore field, because if you use speech-to-text "Tifa" could be misheard as "Chief" -- although this can also be fixed with Regex inside SillyTavern.)
In my example, what if you want to talk to Cloud, but you want the topic to be about Tifa? This is where 'Maximum Triggered Characters' comes in! This is a feature that can be found at the bottom of the extension field:

<img width="634" height="68" alt="image" src="https://github.com/user-attachments/assets/270e960a-164b-4b05-8d4c-d15f3d72ce4d" />

By default, this setting is set at 0. At 0, it does nothing. Once you set this value to 1, this now means only the first mentioned word or phrase from the Respond fields will trigger. So if I say:

"Hey Cloud, don't you think Tifa is quite energetic today?" - Here, Cloud is mentioned first which means he will respond, but Tifa will not respond.
"Tifa, come here! Let's play a little prank on Cloud!" - Here, Tifa is mentioned first which means she will respond, but Cloud will not respond.

Above Maximum Triggered Characters you can also find the 'Words or phrases that will make every character respond':

<img width="633" height="76" alt="image" src="https://github.com/user-attachments/assets/fba7bd3b-d8d9-4c0b-bc1b-4f5d25afeec9" />

For example, I can add the phrase, "listen up everyone":

<img width="631" height="75" alt="image" src="https://github.com/user-attachments/assets/922dd58a-ff80-4896-be50-13cb3bf208a1" />

Now, "listen up everyone" will make all characters respond, regardless of what Maximum Triggered Characters is set to, and it will also not take the Ignore fields into account. For example, saying "Listen up everyone! Let's look at clouds together!" will still make Cloud respond, together with Tifa. Also, when more than one character is triggered, a response queue is created. Just like Natural Order (which is one of the Group reply strategies inside group chats in SillyTavern) once a message is finished generating the next message in queue is generated.

There is only one feature (so far) left to introduce. So what if you don't want to have to mention their names or anything in the Respond fields for every message? This is where 'Conversation Lock' comes in!

<img width="1414" height="304" alt="image" src="https://github.com/user-attachments/assets/0aeb8bc0-e64f-4b57-bd46-74046f4193b4" />

Conversation Lock is a per-character checkbox. When enabled, that character will continue responding to every message until another trigger word or phrase changes the active lock.

<img width="635" height="264" alt="image" src="https://github.com/user-attachments/assets/7282e610-d932-40d9-a50e-31d0663063df" />

So, if I say, "I'm talking to you now Cloud.", then Cloud will respond. Now we can talk about anything, and Cloud will continue to respond every message. If I want to talk to Tifa, I can say "I'm talking to you now Tifa" and this unlocks the 'Conversation Lock' on Cloud, and only Tifa will respond from then on. Conversation Lock also works with 'Words or phrases that make every character respond'. So if I say, "Listen up everyone!", now both of my characters will respond every message, until another word or phrase is mentioned.

### Feedback and Current Status

Let me know if you have any feedback! Are there any features that you'd like to see? And please let me know if there are bugs. I started using this extension myself recently because it has the primary features I wanted, so I thought it was time for a release!
Currently, there are three bugs:

* When you add or remove characters while the extension has text inside the text fields, but I *believe* it's purely visual and will come back once you switch group to a different one, and come back.
* When you create a new group the Natural Extended layout will be visible from the previous group you were in. If you hit F5 to refresh SillyTavern before making a new group it will not look as messy, for now.
* When you remove Conversation Lock for a character, the current lock still persists. It will be gone once another character is triggered instead.

Current TO-DO :

* Being able to restrict each Respond word or phrase to trigger only within a certain number of words in a message. In case you want any Respond word to be ignored if you mention it later in the message.
* Add some functionality to SillyTavern's internal feature, 'Talkativeness'.
* More Randomization. Right now each Respond word or phrase will trigger in the order inside the message. This will be able to be randomized, to make things less predictable. This will also add randomness to 'Words or phrases that make every character respond'.
* Ways for characters to respond to each other.
* Replace the current comma-based delimiter with a more flexible system. Did you notice at the tutorial that I wrote "I'm talking to you now Cloud", instead of "I'm talking to you now, Cloud" (with the comma)? This is because this will make it into two phrases, "I'm talking to you now", and "Cloud".
* Bake in Mute and manual Trigger in each character row. Just to make the Current Members section in group chats redundant when using Natural Extended.
* Add a way to introduce delay during response queues.
