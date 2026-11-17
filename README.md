# Totally Accurate Guide to Me

DG8002 Activity 8 - TAG-Me Interactive Edition - Stephan Kozak

The guide uses HTML, CSS, and JavaScript. Week 9 adds a playable Superman flight arcade.
Week 8 adds External JavaScript, Light/Dark Mode, Random Fact Generator, Personalized Greeting, DOM Manipulation, and Events

- Website: https://kozanimator.github.io/guide-to-me/
- Classified page: https://kozanimator.github.io/guide-to-me/Classified.html
- Flight arcade: https://kozanimator.github.io/guide-to-me/flight.html
- Repository: https://github.com/Kozanimator/guide-to-me

## Files

- `index.html`: introduction, origin story, skills, and Unreal Engine link.
- `Classified.html`: fun facts, survival guide, weaknesses, and ambitions.
- `style.css`: shared appearance and layout for both pages.
- `script.js`: switches the theme and reveals random facts on both pages. Classified also greets visitors by name, with a ten-click moving greeting. Home lets visitors preview a story idea.
- `images/space-monkey.jpg`: homepage illustration.
- `images/foreverstar-comic.jpg`: Classified illustration.


## Week 9 flight arcade

Open `flight.html` and choose **Start flight**. Tap the flight area or press **Space** or **Up arrow** to climb. Clear a pair of Kryptonite crystals to earn one point. Press **P** to pause or resume. Leaving the tab also pauses the game.

- `flight.html` contains the controls, scoreboard, and flight area.
- `flight.css` lays out the arcade and displays the pixel art in `images/flight/`.
- `flight.js` handles the buttons, pointer, and keyboard. It creates and removes gate elements and tracks each round, score, and best score.
