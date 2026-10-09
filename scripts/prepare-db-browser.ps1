param([string]$ArchivePath, [switch]$Offline)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$projectRoot = Split-Path $PSScriptRoot -Parent
$manifest = Get-Content -LiteralPath (Join-Path $projectRoot 'tools/db-browser/bundle.json') -Raw | ConvertFrom-Json
$cacheRoot = Join-Path $projectRoot '.tools/db-browser'
$destination = Join-Path $cacheRoot ($manifest.version + '-win64')
$cachedArchive = Join-Path $cacheRoot $manifest.archive
# Keep all extraction/move targets inside this workspace, including future manifest edits.
foreach ($target in @($cacheRoot, $destination, $cachedArchive)) {
  if (![IO.Path]::GetFullPath($target).StartsWith([IO.Path]::GetFullPath($projectRoot) + '\', [StringComparison]::OrdinalIgnoreCase)) {
    throw 'Destino do pacote fora do projeto.'
  }
}
New-Item -ItemType Directory -Path $cacheRoot -Force | Out-Null
foreach ($directory in @((Join-Path $projectRoot '.tools'), $cacheRoot)) {
  if ((Get-Item -LiteralPath $directory -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) {
    throw 'Links/junctions não são permitidos no cache do DB Browser.'
  }
}

function Get-Sha256([string]$Path) {
  $stream = [IO.File]::OpenRead($Path)
  $hasher = [Security.Cryptography.SHA256]::Create()
  try { return [BitConverter]::ToString($hasher.ComputeHash($stream)).Replace('-', '').ToLowerInvariant() }
  finally { $hasher.Dispose(); $stream.Dispose() }
}

function Assert-Archive([string]$Path) {
  if ((Get-Sha256 $Path) -ne $manifest.sha256) {
    throw 'ZIP do DB Browser diferente do pacote oficial fixado; empacotamento interrompido.'
  }
}

if ($ArchivePath) {
  $ArchivePath = (Resolve-Path -LiteralPath $ArchivePath).Path
  Assert-Archive $ArchivePath
  if (!(Test-Path -LiteralPath $cachedArchive)) { Copy-Item -LiteralPath $ArchivePath -Destination $cachedArchive }
} elseif (!(Test-Path -LiteralPath $cachedArchive)) {
  if ($Offline) { throw 'ZIP do DB Browser ausente. Execute com -ArchivePath antes do build offline.' }
  $download = Join-Path $cacheRoot ([guid]::NewGuid().ToString() + '.zip')
  try {
    $maximumAttempts = 3
    for ($attempt = 1; $attempt -le $maximumAttempts; $attempt++) {
      try {
        Invoke-WebRequest -Uri $manifest.url -OutFile $download -UseBasicParsing
        break
      } catch {
        Remove-Item -LiteralPath $download -Force -ErrorAction SilentlyContinue
        if ($attempt -eq $maximumAttempts) {
          throw "Falha ao baixar o DB Browser após $maximumAttempts tentativas. Último erro: $($_.Exception.Message)"
        }
        Start-Sleep -Seconds (2 * $attempt)
      }
    }
    Assert-Archive $download
    Move-Item -LiteralPath $download -Destination $cachedArchive
  } finally {
    Remove-Item -LiteralPath $download -Force -ErrorAction SilentlyContinue
  }
}
Assert-Archive $cachedArchive

# Validate paths before extraction; compare every cached file against the pinned ZIP.
$archive = [IO.Compression.ZipFile]::OpenRead($cachedArchive)
try {
  $files = @{}
  foreach ($entry in $archive.Entries) {
    $relative = $entry.FullName.Replace('/', '\')
    if ([IO.Path]::IsPathRooted($relative) -or $relative.Contains(':') -or
        ($relative.Split('\') -contains '..')) { throw 'Caminho inseguro no ZIP.' }
    if ($entry.Name -eq '') { continue }
    if ($files.ContainsKey($relative)) { throw 'Caminho duplicado no ZIP.' }
    $files[$relative] = $entry
  }
  foreach ($required in @('DB Browser for SQLCipher.exe', 'DB Browser for SQLite.exe', 'sqlcipher.dll', 'Qt5Core.dll', 'platforms\qwindows.dll', 'licenses\LICENSE')) {
    if (!$files.ContainsKey($required)) { throw 'Pacote DB Browser incompleto.' }
  }
  if (!(Test-Path -LiteralPath $destination)) {
    $stage = Join-Path $cacheRoot ('stage-' + [guid]::NewGuid().ToString())
    if (![IO.Path]::GetFullPath($stage).StartsWith([IO.Path]::GetFullPath($cacheRoot) + '\', [StringComparison]::OrdinalIgnoreCase)) {
      throw 'Destino de extração fora do cache.'
    }
    [IO.Compression.ZipFile]::ExtractToDirectory($cachedArchive, $stage)
    Move-Item -LiteralPath $stage -Destination $destination
  }
  # Walk one directory at a time, rejecting links before descending into them.
  $pending = [Collections.Generic.Queue[string]]::new()
  $pending.Enqueue($destination)
  $actual = @()
  while ($pending.Count -gt 0) {
    $directory = $pending.Dequeue()
    if ((Get-Item -LiteralPath $directory -Force).Attributes -band [IO.FileAttributes]::ReparsePoint) {
      throw 'Links/junctions não são permitidos no pacote DB Browser.'
    }
    foreach ($item in Get-ChildItem -LiteralPath $directory -Force) {
      if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
        throw 'Links/junctions não são permitidos no pacote DB Browser.'
      }
      if ($item.PSIsContainer) { $pending.Enqueue($item.FullName) }
      else { $actual += $item }
    }
  }
  if ($actual.Count -ne $files.Count) { throw 'Cache do DB Browser contém arquivos ausentes ou extras.' }
  foreach ($relative in $files.Keys) {
    $path = Join-Path $destination $relative
    if (!(Test-Path -LiteralPath $path -PathType Leaf)) { throw 'Arquivo ausente no cache do DB Browser.' }
    $stream = $files[$relative].Open()
    $hasher = [Security.Cryptography.SHA256]::Create()
    try { $expected = [BitConverter]::ToString($hasher.ComputeHash($stream)).Replace('-', '') }
    finally { $hasher.Dispose(); $stream.Dispose() }
    if ((Get-Sha256 $path) -ne $expected) {
      throw 'Arquivo alterado no cache do DB Browser; empacotamento interrompido.'
    }
  }
  Write-Output "DB Browser $($manifest.version) win64: ZIP e $($files.Count) arquivos verificados."
} finally { $archive.Dispose() }
