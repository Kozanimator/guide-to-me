# Totally Accurate Guide to Me

DG8002 Activity 8 - TAG-Me Interactive Edition - Stephan Kozak

The guide uses HTML, CSS, and JavaScript. Week 9 adds Shield Pong, a one-paddle Superman mini-game.
Week 8 adds External JavaScript, Light/Dark Mode, Random Fact Generator, Personalized Greeting, DOM Manipulation, and Events

- Website: https://kozanimator.github.io/guide-to-me/
- Classified page: https://kozanimator.github.io/guide-to-me/Classified.html
- Shield Pong: https://kozanimator.github.io/guide-to-me/pong.html
- Repository: https://github.com/Kozanimator/guide-to-me

## Files

- `index.html`: introduction, origin story, skills, and Unreal Engine link.
- `Classified.html`: fun facts, survival guide, weaknesses, and ambitions.
- `style.css`: shared appearance and layout for both pages.
- `script.js`: switches the theme and reveals random facts on both pages. Classified also greets visitors by name, with a ten-click moving greeting. Home lets visitors preview a story idea.
- `images/space-monkey.jpg`: homepage illustration.
- `images/foreverstar-comic.jpg`: Classified illustration.

## Week 9 game

Open [Shield Pong](https://kozanimator.github.io/guide-to-me/pong.html) and click **Start game**. Move Superman’s shield with the up and down arrow keys, a mouse, or a finger. Returning the Kryptonite scores one point. After a miss, choose **Play again**.

- `pong.html` contains the court, paddle, ball, button, and score.
- `pong.css` gives the paddle and ball their superhero appearance.
- `pong.js` listens for clicks, keypresses, and pointer movements. A timer moves the ball. An `if` statement checks for a hit or a miss.
