# Public reference data only. This script never reads application/user data.
$ErrorActionPreference='Stop'
$sources=@(
  @{code='BRC0208A';parameter='qtqOHQ4EkR82Z0oZf8AKdA%3D%3D'},
  @{code='BRC0001T';parameter='pIqRrKBm8h1amgooDYSLHw%3D%3D'},
  @{code='BRC0011C';parameter='2TForHUFkQoNZIv4AIRJVA%3D%3D'},
  @{code='BRC0114F';parameter='DP42TQ4ecxn47Ihwru2%2FQw%3D%3D'},
  @{code='BRC0041B';parameter='F4WtDgVyc5YY7uFLcpKzxg%3D%3D'}
)
function Plain([string]$value){[System.Net.WebUtility]::HtmlDecode([regex]::Replace($value,'<[^>]+>','')).Trim()}
$foods=@()
foreach($record in $sources){
  $url='https://www.tbca.net.br/base-dados/int_composicao_alimentos_2_edit.php?n0REd3kv7e86D%2BViXWYUnQ%3D%3D='+$record.parameter
  $html=(Invoke-WebRequest -Uri $url).Content
  if($html -notmatch $record.code){throw 'TBCA code mismatch'}
  $name=Plain ([regex]::Match($html,'<strong>Descrição:</strong>(.*?)<br>').Groups[1].Value)
  $table=[regex]::Match($html,"(?s)<table id='tabela1'.*?</table>").Value
  $nutrients=@{}
  foreach($row in [regex]::Matches($table,'(?s)<tr>.*?</tr>')){
    $cells=@([regex]::Matches($row.Value,'(?s)<td>(.*?)</td>')|ForEach-Object{Plain $_.Groups[1].Value})
    if($cells.Count -lt 3){continue}
    $amount=0.0
    $numeric=[double]::TryParse($cells[2].Replace(',','.'),[Globalization.NumberStyles]::Float,[Globalization.CultureInfo]::InvariantCulture,[ref]$amount)
    $nutrients[$cells[0]+':'+$cells[1]]=@{value=$(if($numeric){$amount}else{$null});unit=$cells[1];original=$cells[2]}
  }
  $measures=@([regex]::Matches($table,'<th>(.*?)</th>')|ForEach-Object {
    $label=Plain $_.Groups[1].Value
    $match=[regex]::Match($label,'\(([0-9,]+)\s*g\)')
    if($match.Success){@{name=$label;grams=[double]::Parse($match.Groups[1].Value.Replace(',','.'),[Globalization.CultureInfo]::InvariantCulture)}}
  })
  $food=[ordered]@{code=$record.code;name=$name;source='TBCA 7.3';url=$url;grams=100;measures=$measures;nutrients=$nutrients}
  foreach($entry in @{kcal='Energia:kcal';protein='Proteína:g';carbs='Carboidrato total:g';fat='Lipídios:g';fiber='Fibra alimentar:g'}.GetEnumerator()){
    if($null -eq $nutrients[$entry.Value].value){throw 'Missing quantitative macronutrient'}
    $food[$entry.Key]=$nutrients[$entry.Value].value
  }
  $foods+=$food
  Write-Output ($record.code+' '+$name)
}
$target=Join-Path $PSScriptRoot '../src/data/tbca.json'
New-Item -ItemType Directory -Path (Split-Path $target) -Force | Out-Null
[IO.File]::WriteAllText($target,($foods|ConvertTo-Json -Depth 8),[Text.UTF8Encoding]::new($false))
