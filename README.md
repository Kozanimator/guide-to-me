# Totally Accurate Guide to Me

DG8002 Activity 8 - TAG-Me Interactive Edition - Stephan Kozak

The guide uses HTML, CSS, and JavaScript. Week 9 adds Shield Pong, a one-paddle Superman mini-game.
Week 8 adds External JavaScript, Light/Dark Mode, Random Fact Generator, Personalized Greeting, DOM Manipulation, and Events

- Website: https://kozanimator.github.io/guide-to-me/
- Classified page: https://kozanimator.github.io/guide-to-me/Classified.html
- Shield Pong: https://kozanimator.github.io/guide-to-me/pong.html
- Repository: https://github.com/Kozanimator/guide-to-me
- Superhero Files: https://kozanimator.github.io/guide-to-me/heroes.html

## Files

- `index.html`: introduction, origin story, skills, and Unreal Engine link.
- `Classified.html`: fun facts, survival guide, weaknesses, and ambitions.
- `style.css`: shared appearance and layout for both pages.
- `script.js`: switches the theme and reveals random facts on both pages. Classified also greets visitors by name, with a ten-click moving greeting. Home lets visitors preview a story idea.
- `images/space-monkey.jpg`: homepage illustration.
- `images/foreverstar-comic.jpg`: Classified illustration.

## Week 9 mini-game

Open [Shield Pong](https://kozanimator.github.io/guide-to-me/pong.html) and click **Start game**. Move Superman’s shield with the up and down arrow keys, a mouse, or a finger. Returning the Kryptonite scores one point. After a miss, choose **Play again**.

- `pong.html` contains the court, paddle, ball, button, and score.
- `pong.css` gives the paddle and ball their superhero appearance.
- `pong.js` listens for clicks, keypresses, and pointer movements. A timer moves the ball. An `if` statement checks for a hit or a miss.

## Week 10 - Connecting to the World

Open [Superhero Files](https://kozanimator.github.io/guide-to-me/heroes.html), choose a hero, and select Open File. Surprise Me selects a different hero. Batman's file opens when the page loads.

This activity uses [SuperHeroAPI](https://superheroapi.com/), the SuperHeroes service linked in the public-apis list. It requires an access token. A small server-side adapter keeps that token private; the GitHub Pages website fetches the adapter’s JSON response. See `api/README.md` for setup. This migration is a draft until authorization, hosting, and live testing are complete.

- `heroes.html`: hero selector, buttons, portrait, biography, and three power meters.
- `heroes.css`: responsive layout and dark-mode styles, alongside the existing `style.css`.
- `heroes.js`: commented JavaScript for the request, JSON processing, and DOM updates.
Missing values display as "Not listed"; a failed portrait shows a text fallback. Some community records contain an alter ego instead of a publisher, so those entries display "Publisher not listed". Ratings come from the SuperHeroAPI dataset and are not official rankings. Character information and images belong to their respective owners.  The new page shares the existing light/dark toggle. Navigation on Home, Classified, and Shield Pong includes Superhero Files.
