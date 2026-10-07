param([Parameter(Mandatory=$true)][string]$ToolsRoot, [switch]$Initialize)
$ErrorActionPreference='Stop'
$toolRoot=[IO.Path]::GetFullPath($ToolsRoot)
$env:CARGO_HOME=Join-Path $toolRoot 'cargo'
$env:RUSTUP_HOME=Join-Path $toolRoot 'rustup'
$cargoBin=Join-Path $env:CARGO_HOME 'bin'
$env:PATH=$cargoBin+';'+$env:PATH
$env:LC_ALL='C'
$env:LANG='C'

# Isolate Rust from the developer's profile: the runner may execute as NetworkService.
if (!(Test-Path -LiteralPath (Join-Path $cargoBin 'rustup.exe'))) {
  if (!$Initialize) { throw 'Runner toolchain not prepared. Use -Initialize in the runner tool cache.' }
  New-Item -ItemType Directory -Path $toolRoot -Force | Out-Null
  $installer=Join-Path $toolRoot 'rustup-init-1.29.1.exe'
  $url='https://static.rust-lang.org/rustup/archive/1.29.1/x86_64-pc-windows-msvc/rustup-init.exe'
  Invoke-WebRequest -Uri $url -OutFile $installer -UseBasicParsing
  $hashReply=(Invoke-WebRequest -Uri ($url+'.sha256') -UseBasicParsing).Content
  if ($hashReply -is [byte[]]) { $hashReply=[Text.Encoding]::UTF8.GetString($hashReply) }
  $expected=([string]$hashReply).Trim().Split(' ')[0]
  if ($expected -notmatch '^[a-fA-F0-9]{64}$') { throw 'Invalid Rustup checksum response.' }
  if ((Get-FileHash -LiteralPath $installer -Algorithm SHA256).Hash.ToLowerInvariant() -ne $expected.ToLowerInvariant()) { throw 'Rustup checksum mismatch.' }
  & $installer -y --no-modify-path --profile minimal --default-toolchain 1.98.1 --component rustfmt --component clippy
  if ($LASTEXITCODE -ne 0) { throw 'Runner Rust installation failed.' }
}
if ($Initialize) {
  & (Join-Path $cargoBin 'rustup.exe') toolchain install 1.98.1 --profile minimal --component rustfmt --component clippy
  if ($LASTEXITCODE -ne 0) { throw 'Pinned runner Rust toolchain setup failed.' }
}
& (Join-Path $cargoBin 'rustup.exe') run 1.98.1 rustc --version
if ($LASTEXITCODE -ne 0) { throw 'Pinned Rust toolchain unavailable.' }
$env:RUSTUP_TOOLCHAIN='1.98.1'

$perlRoot=$env:WEBFIT_PERL_PATH
if (!$perlRoot) {
  # Existing company PC distribution; another machine can set its own path.
  $perlRoot='D:\MAYCON\PROJETOS\WebFit-DESKTOP\.tools\strawberry'
}
$env:PERL=Join-Path $perlRoot 'perl/bin/perl.exe'
if (!(Test-Path -LiteralPath $env:PERL) -or !(Test-Path -LiteralPath (Join-Path $perlRoot 'c/bin'))) { throw 'Complete Strawberry Perl distribution unavailable; configure WEBFIT_PERL_PATH for this machine.' }
$env:PATH=(Split-Path $env:PERL)+';'+(Join-Path $perlRoot 'c/bin')+';'+$env:PATH
& $env:PERL -e 'print "Perl ready\n";'
if ($LASTEXITCODE -ne 0) { throw 'Perl unavailable to runner account.' }
& (Join-Path $PSScriptRoot 'check-runner.ps1') -RequireTools

if ($env:GITHUB_ENV -and $env:GITHUB_PATH) {
  foreach($name in @('CARGO_HOME','RUSTUP_HOME','RUSTUP_TOOLCHAIN','PERL','LC_ALL','LANG')) {
    ($name+'='+[Environment]::GetEnvironmentVariable($name,'Process')) | Out-File $env:GITHUB_ENV -Append -Encoding utf8
  }
  foreach($folder in @($cargoBin,(Split-Path $env:PERL),(Join-Path $perlRoot 'c/bin'))) { $folder | Out-File $env:GITHUB_PATH -Append -Encoding utf8 }
}
