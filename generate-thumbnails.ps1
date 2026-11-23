# Run this in PowerShell from your portfolio project folder.
# Requires FFmpeg installed and available as the "ffmpeg" command.
$ErrorActionPreference = 'Stop'
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
  Write-Host 'FFmpeg is not installed. Run: winget install --id Gyan.FFmpeg -e' -ForegroundColor Yellow
  exit 1
}
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$source = Join-Path $projectRoot 'src\assets\projects'
$target = Join-Path $projectRoot 'src\assets\thumbnails'
if (-not (Test-Path $source)) { throw "Missing video folder: $source" }
New-Item -ItemType Directory -Force -Path $target | Out-Null
$videos = @(Get-ChildItem -Path $source -Recurse -File | Where-Object { $_.Extension -in @('.mp4','.webm') })
Write-Host "Found $($videos.Count) videos."
foreach ($video in $videos) {
  $out = Join-Path $target ($video.BaseName + '.webp')
  if (Test-Path $out) { Write-Host "Skipping existing: $($video.Name)"; continue }
  Write-Host "Creating cover: $($video.Name)"
  & ffmpeg -hide_banner -loglevel error -y -ss 1 -i $video.FullName -frames:v 1 -vf 'scale=720:-2' -quality 75 $out
  if ($LASTEXITCODE -ne 0) { Write-Warning "Could not extract at 1 second: $($video.Name)" }
}
Write-Host 'Finished. Covers are in src\assets\thumbnails.' -ForegroundColor Green
