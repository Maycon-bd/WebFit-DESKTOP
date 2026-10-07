param([switch]$RequireTools)
$ErrorActionPreference='Stop'
$runnerRoot=Split-Path $PSScriptRoot -Parent
$missing=@()
foreach($tool in @('git','node','npm','cargo','rustc')) {
  if(!(Get-Command $tool -ErrorAction SilentlyContinue)) { $missing += $tool }
}
$perlTool=Get-Command perl -ErrorAction SilentlyContinue
$portablePerl=Join-Path $runnerRoot '.tools/strawberry/perl/bin/perl.exe'
if ($env:WEBFIT_PERL_PATH) { $portablePerl=Join-Path $env:WEBFIT_PERL_PATH 'perl/bin/perl.exe' }
if(!$perlTool -and !(Test-Path -LiteralPath $portablePerl)) { $missing += 'Perl completo (SQLCipher)' }
[pscustomobject]@{Machine=$env:COMPUTERNAME;Account=[Security.Principal.WindowsIdentity]::GetCurrent().Name;Missing=($missing -join ', ');Ready=($missing.Count -eq 0);Scope='Current process only; does not certify service account or MSVC build'} | Format-List
if($missing.Count -gt 0 -and $RequireTools) { throw 'Prepare as ferramentas no perfil que executa o serviço do runner.' }
