$ErrorActionPreference='Stop'
$root=Split-Path $PSScriptRoot -Parent
Push-Location $root
try {
  $portable=Join-Path $root '.tools/strawberry/perl/bin/perl.exe'
  if(!(Test-Path -LiteralPath $portable)){throw 'Prepare o Perl portátil autorizado antes de compilar SQLCipher.'}
  $env:PERL=$portable
  $env:PATH=(Split-Path $portable)+';'+(Join-Path $root '.tools/strawberry/c/bin')+';'+$env:PATH
  $env:LC_ALL='C'
  $env:LANG='C'
  npm run tauri build -- --bundles nsis -- --locked
  if($LASTEXITCODE -ne 0){throw 'Falha na geração do instalador.'}
} finally {Pop-Location}
