# Mason Tang Portfolio — Minimal V2

## Run

```bash
npm install
npm run dev
```

## Add your projects

Put images or MP4/WebM videos in `src/assets/projects/<Category Name>/`.
For example:

```
src/assets/projects/
  Graphic Design/
    Jewellery-Ad.jpg
  Video/
    Podcast.mp4
  Others/
    Experimental-Poster.webp
```

New folder names automatically create new category filters. Names become project titles. To group carousel slides into one project, use `My-Carousel__01.jpg`, `My-Carousel__02.jpg`, etc. You may use images or videos in any category.

### Portrait placeholder

The oval in the hero is a CSS placeholder. To add your portrait, edit `.portrait-placeholder` in `src/style.css` or replace the placeholder `<div>` in `src/main.jsx` with an image. A transparent-background portrait is best.

### Deploy

Run `npm run build` and deploy via Vercel (Vite preset). Adding files requires rebuilding/deploying. Keep videos optimized (H.264 MP4, compressed) for performance.
