# Mason Tang Portfolio — Update Guide

Live website: https://mason-portfolio-gamma.vercel.app/  
GitHub repository: https://github.com/howpinta/mason-portfolio

Use this guide whenever you add or update portfolio projects. You do **not** need to edit `main.jsx` or `style.css` just to add new media.

## 1. Open the correct local folder

Use the local portfolio folder that GitHub Desktop is tracking (not an older copy in Downloads).

In **GitHub Desktop**, select the `mason-portfolio` repository and click **Repository → Show in Explorer**. This is your project folder. You should see `package.json` and the `src` folder inside it.

## 2. Add your portfolio files

Put files in the appropriate category folder under:

`src/assets/projects/`

For example:

- `src/assets/projects/Social Media/My New Post.png`
- `src/assets/projects/Video/My New Commercial.mp4`
- `src/assets/projects/Web Design/My Landing Page.webp`

The website reads the category folders automatically. To group several images into one slideshow, name them like:

- `Campaign__01.png`
- `Campaign__02.png`
- `Campaign__03.png`

Keep these files in the same category folder.

## 3. Generate thumbnails for new videos

Images do not need separate thumbnails. Videos do.

Keep the `generate-thumbnails.ps1` script in the main portfolio folder (beside `package.json`). It creates video thumbnails under `src/assets/thumbnails/`.

### Run the PowerShell command

1. In **GitHub Desktop**, click **Repository → Show in Explorer**.
2. In File Explorer, click the address bar, type `powershell`, and press **Enter**. PowerShell opens in the correct folder.
3. Copy and paste this exact command, then press **Enter**:

```powershell
powershell -ExecutionPolicy Bypass -File .\generate-thumbnails.ps1
```

4. Wait until the script finishes. Check that new `.webp` thumbnails appeared in `src/assets/thumbnails/`.

**If the script says FFmpeg is not recognized:** Install it with the command below, then close and reopen PowerShell before running the thumbnail command again.

```powershell
winget install --id Gyan.FFmpeg -e
```

**If the script cannot be found:** Make sure `generate-thumbnails.ps1` is in the same folder as `package.json`, and that PowerShell is opened in that folder.

**If you want a different cover frame:** Replace the generated thumbnail with your preferred image using the same filename. The script is intended to skip thumbnails that already exist.

## 4. Publish your changes

1. Open **GitHub Desktop** and select `mason-portfolio`.
2. Review the changed files, including new videos and thumbnails.
3. In **Summary**, type something like `Add new portfolio projects`.
4. Click **Commit to main**.
5. Click **Push origin**.
6. Wait for the upload to finish.

**Note:** GitHub rejects regular Git files larger than 100 MB. Compress or host very large videos elsewhere before pushing.

## 5. Check the live website

Vercel should automatically deploy after the push to GitHub. Open:

https://mason-portfolio-gamma.vercel.app/

Check the new project on desktop and mobile:

- Does the thumbnail appear?
- Does the project open?
- Does the full video play with sound?
- Are the category and slideshow correct?

If you don't see the update, check the **Deployments** tab of your Vercel project and refresh the website after the new deployment is ready.

## Quick reminder

**Add files → Open PowerShell in the GitHub Desktop project folder → Run thumbnail command (videos only) → Commit → Push → Check Vercel**

```powershell
powershell -ExecutionPolicy Bypass -File .\generate-thumbnails.ps1
```

## Troubleshooting

**The new project doesn't appear:** Confirm you copied it into the local folder tracked by GitHub Desktop, committed it, and pushed it. Check the correct category folder path.

**Video thumbnail is blank:** Check for a matching `.webp` thumbnail in `src/assets/thumbnails/`, then commit and push that file. Thumbnail names should match the video filenames except for the extension.

**The website hasn't changed:** Check whether GitHub Desktop still says **Push origin**, and whether Vercel finished deploying the latest commit.

**Video takes time to start on mobile:** Full videos still require network buffering. Thumbnails improve browsing speed, but don't eliminate playback buffering.
