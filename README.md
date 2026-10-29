# Totally Accurate Guide to Me

**DG8002 - Activity 6**  
**Author: Stephan Kozak**  
**Theme: The Reality Architect**

Repository: https://github.com/Kozanimator/guide-to-me  
Website: https://kozanimator.github.io/guide-to-me/

A humorous, fictionalized biography built with plain HTML. No CSS, JavaScript,
framework, installation, or build step is required.

## Files

- `index.html` - Homepage: introduction, origin story, skills, character profile, and an external link.
- `Classified.html` - Three fun facts, an ordered survival guide, weaknesses, and future ambitions.
- `images/reality-architect.png` - Homepage illustration.
- `images/classified-workshop.png` - Classified page illustration.
- `README.md` - This guide and assignment checklist.

The image files are original vector-based illustrations created for this activity.
The biography uses real creative interests with clearly fictional exaggerations.
Review the wording and adjust it to your own voice before submission.

## Open it on your computer

1. Extract the ZIP file first.
2. Open `index.html` in your browser.
3. Click **Classified Information**, then click **Home** to return.
4. Check that both images appear and the Unreal Engine link opens.

Keep the `images` folder beside the two HTML files. Opening the HTML while it is
still inside a ZIP may prevent images and links from working properly.

To edit the page, open the HTML file in a plain-text code editor. Text between
HTML tags is the content visitors see. Comments such as `<!-- ... -->` explain
the code and are not displayed on the page.

## Publish on GitHub Pages

The assignment requires a PUBLIC repository and a published GitHub Pages website.
This repository is public and its website is published. The steps below document the publishing setup.

1. Sign in to [GitHub](https://github.com/).
2. Create a new repository named `guide-to-me`.
3. Choose **Public**. You can enable a README to make the new repository easy to open.
4. Open the repository and choose **Add file > Upload files**.
5. Upload `index.html`, `Classified.html`, and the entire `images` folder.
   You can upload this README too, replacing the default one if necessary.
   Upload the CONTENTS of the extracted folder to the repository's top level.
   Do not upload the ZIP file or an extra enclosing folder.
6. Commit the files to the `main` branch. Check that `index.html` appears at
   the repository's top level and `images` contains both PNG files.
7. Open **Settings > Pages**.
8. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
9. Choose branch **main** and folder **/ (root)**, then click **Save**.
10. Wait for the deployment to finish. GitHub says publication can take up
    to 10 minutes. Refresh Pages settings to find the website link.

The homepage is lowercase `index.html` because GitHub Pages expects that entry
filename. The second page is `Classified.html`, with a capital C. HTML paths are
case-sensitive on the published website; do not rename either file without also
updating its links.

## Check the PUBLISHED website

- Open the website link shown in **Settings > Pages**.
- Confirm that the homepage and its image appear.
- Click **Classified Information** and confirm that the second page and its image appear.
- Click **Home** and confirm that it returns to the homepage.
- Click the Unreal Engine link and confirm that it reaches the external website.
- Open the public repository link in a signed-out or private browser window.

The published homepage, Classified page, both images, navigation in both directions,
and external Unreal Engine link were checked successfully on October 29, 2026.

## Submit two links through D2L before the next class

1. https://github.com/Kozanimator/guide-to-me
2. https://kozanimator.github.io/guide-to-me/

## Requirement checklist

| Requirement | Location / status |
| --- | --- |
| Homepage introduction | `index.html`: Who Is This Person? |
| Origin story | `index.html`: My Suspiciously Dramatic Origin Story |
| At least three skills | `index.html`: five Skills and Abilities |
| Three fun facts | `Classified.html`: Three Fun Facts |
| Ordered survival guide | `Classified.html`: six steps in an `<ol>` |
| Weaknesses | `Classified.html`: Greatest Weaknesses |
| Future ambitions | `Classified.html`: Future Ambitions |
| Semantic HTML | Both pages: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` |
| Headings and paragraphs | Both pages: `<h1>`, `<h2>`, `<p>` |
| A div grouping related content | Character Profile and Greatest Weaknesses |
| At least two images with descriptive alt text | One local PNG image on each page |
| Working internal navigation | Both headers and additional content links |
| Relevant external hyperlink | `index.html`: Unreal Engine |
| Public GitHub repository | Published: Kozanimator/guide-to-me |
| Published website and live-link checks | Published and verified on GitHub Pages |

## GitHub documentation

Publication instructions checked against GitHub documentation on October 29, 2026:

- [Quickstart for GitHub Pages](https://docs.github.com/en/pages/quickstart)
- [Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Adding a file to a repository](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
